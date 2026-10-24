package com.archtechnologies.shopsphere.presentation.screens.checkout

import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.archtechnologies.shopsphere.R
import com.archtechnologies.shopsphere.domain.model.PaymentMethod
import com.archtechnologies.shopsphere.presentation.components.ShopSphereTopBar
import java.util.Locale

@Composable
fun CheckoutScreen(
    viewModel: CheckoutViewModel,
    onNavigateBack: () -> Unit,
    onOrderSuccess: (String) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val summary by viewModel.cartSummary.collectAsState()
    val scrollState = rememberScrollState()

    Scaffold(
        topBar = {
            ShopSphereTopBar(
                title = stringResource(R.string.checkout_title),
                canNavigateBack = true,
                onNavigateBack = onNavigateBack
            )
        },
        bottomBar = {
            Surface(
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp,
                shadowElevation = 8.dp
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .navigationBarsPadding()
                        .padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Total Payable",
                            style = MaterialTheme.typography.titleMedium
                        )
                        Text(
                            text = "$${String.format(Locale.US, "%.2f", summary.total)}",
                            style = MaterialTheme.typography.headlineSmall.copy(
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Button(
                        onClick = {
                            viewModel.placeOrder { order ->
                                onOrderSuccess(order.id)
                            }
                        },
                        enabled = !uiState.isPlacingOrder && summary.items.isNotEmpty(),
                        modifier = Modifier.fillMaxWidth().height(48.dp),
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                    ) {
                        if (uiState.isPlacingOrder) {
                            CircularProgressIndicator(strokeWidth = 2.dp, modifier = Modifier.size(20.dp), color = MaterialTheme.colorScheme.onPrimary)
                        } else {
                            Text(stringResource(R.string.btn_confirm_order), style = MaterialTheme.typography.labelLarge)
                        }
                    }
                }
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(scrollState)
                .padding(16.dp)
        ) {
            uiState.errorMessage?.let { error ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.error.copy(alpha = 0.1f)),
                    modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
                ) {
                    Text(
                        text = error,
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.padding(12.dp)
                    )
                }
            }

            // Shipping Address Section
            Text(
                text = stringResource(R.string.section_shipping_address),
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold)
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = uiState.recipientName,
                onValueChange = { viewModel.updateRecipientName(it) },
                label = { Text("Recipient Full Name *") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = uiState.phone,
                onValueChange = { viewModel.updatePhone(it) },
                label = { Text("Phone Number *") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = uiState.street,
                onValueChange = { viewModel.updateStreet(it) },
                label = { Text("Street Address *") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = uiState.city,
                    onValueChange = { viewModel.updateCity(it) },
                    label = { Text("City *") },
                    singleLine = true,
                    modifier = Modifier.weight(1f)
                )
                OutlinedTextField(
                    value = uiState.building,
                    onValueChange = { viewModel.updateBuilding(it) },
                    label = { Text("Campus / Building") },
                    singleLine = true,
                    modifier = Modifier.weight(1f)
                )
            }

            HorizontalDivider(modifier = Modifier.padding(vertical = 20.dp), color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))

            // Payment Methods Section
            Text(
                text = stringResource(R.string.section_payment_method),
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold)
            )
            Spacer(modifier = Modifier.height(12.dp))

            PaymentMethodOption(
                title = stringResource(R.string.payment_mock),
                description = "Simulate instant success/failure for development",
                isSelected = uiState.paymentMethod == PaymentMethod.MOCK_PAYMENT,
                onClick = { viewModel.updatePaymentMethod(PaymentMethod.MOCK_PAYMENT) }
            )

            Spacer(modifier = Modifier.height(10.dp))

            PaymentMethodOption(
                title = stringResource(R.string.payment_cod),
                description = "Pay in cash when order is delivered to your address",
                isSelected = uiState.paymentMethod == PaymentMethod.CASH_ON_DELIVERY,
                onClick = { viewModel.updatePaymentMethod(PaymentMethod.CASH_ON_DELIVERY) }
            )

            Spacer(modifier = Modifier.height(10.dp))

            PaymentMethodOption(
                title = stringResource(R.string.payment_card),
                description = "Secure credit or debit card payment",
                isSelected = uiState.paymentMethod == PaymentMethod.CREDIT_CARD,
                onClick = { viewModel.updatePaymentMethod(PaymentMethod.CREDIT_CARD) }
            )

            HorizontalDivider(modifier = Modifier.padding(vertical = 20.dp), color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))

            // Order Summary Section
            Text(
                text = stringResource(R.string.section_order_summary),
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold)
            )
            Spacer(modifier = Modifier.height(12.dp))

            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    summary.items.forEach { item ->
                        Row(
                            modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "${item.quantity}x ${item.productTitle}",
                                style = MaterialTheme.typography.bodyMedium,
                                modifier = Modifier.weight(1f),
                                maxLines = 1
                            )
                            Text(
                                text = "$${String.format(Locale.US, "%.2f", item.totalPrice)}",
                                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold)
                            )
                        }
                    }
                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Subtotal", style = MaterialTheme.typography.bodySmall)
                        Text("$${String.format(Locale.US, "%.2f", summary.subtotal)}", style = MaterialTheme.typography.bodySmall)
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Delivery Fee", style = MaterialTheme.typography.bodySmall)
                        Text("$${String.format(Locale.US, "%.2f", summary.deliveryFee)}", style = MaterialTheme.typography.bodySmall)
                    }
                }
            }

            Spacer(modifier = Modifier.height(40.dp))
        }
    }
}

@Composable
fun PaymentMethodOption(
    title: String,
    description: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val borderColor = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .border(if (isSelected) 2.dp else 1.dp, borderColor, RoundedCornerShape(8.dp))
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f) else MaterialTheme.colorScheme.surface
        )
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            RadioButton(selected = isSelected, onClick = onClick)
            Spacer(modifier = Modifier.width(10.dp))
            Column {
                Text(text = title, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold))
                Text(text = description, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}
