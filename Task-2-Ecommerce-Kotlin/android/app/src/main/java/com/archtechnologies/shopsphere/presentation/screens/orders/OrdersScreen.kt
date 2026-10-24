package com.archtechnologies.shopsphere.presentation.screens.orders

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ReceiptLong
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.archtechnologies.shopsphere.R
import com.archtechnologies.shopsphere.domain.model.Order
import com.archtechnologies.shopsphere.domain.model.OrderStatus
import com.archtechnologies.shopsphere.presentation.components.EmptyState
import com.archtechnologies.shopsphere.presentation.components.LoadingState
import com.archtechnologies.shopsphere.presentation.components.ShopSphereTopBar
import com.archtechnologies.shopsphere.presentation.theme.AmberWarning
import com.archtechnologies.shopsphere.presentation.theme.EmeraldSuccess
import com.archtechnologies.shopsphere.presentation.theme.OceanBlue
import com.archtechnologies.shopsphere.presentation.theme.RoseError
import java.util.Locale

@Composable
fun OrdersScreen(
    viewModel: OrdersViewModel,
    onNavigateToOrderDetails: (String) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            ShopSphereTopBar(title = stringResource(R.string.orders_title))
        }
    ) { padding ->
        if (uiState.isLoading) {
            LoadingState(modifier = Modifier.padding(padding))
        } else if (uiState.orders.isEmpty()) {
            EmptyState(
                title = "No Orders Yet",
                description = "When you place an order, its real-time fulfillment status and tracking will be shown here.",
                icon = Icons.AutoMirrored.Filled.ReceiptLong,
                modifier = Modifier.padding(padding)
            )
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(uiState.orders, key = { it.id }) { order ->
                    OrderCard(
                        order = order,
                        onClick = { onNavigateToOrderDetails(order.id) },
                        onCancelClick = { viewModel.cancelOrder(order.id) }
                    )
                }
            }
        }
    }
}

@Composable
fun OrderCard(
    order: Order,
    onClick: () -> Unit,
    onCancelClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .border(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.6f), RoundedCornerShape(8.dp))
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header Row: Order Number & Status Badge
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Order #${order.orderNumber}",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )

                val (statusBg, statusFg, statusText) = when (order.status) {
                    OrderStatus.PENDING -> Triple(AmberWarning.copy(alpha = 0.15f), AmberWarning, "Pending")
                    OrderStatus.CONFIRMED -> Triple(OceanBlue.copy(alpha = 0.15f), OceanBlue, "Confirmed")
                    OrderStatus.PROCESSING -> Triple(OceanBlue.copy(alpha = 0.15f), OceanBlue, "Processing")
                    OrderStatus.SHIPPED -> Triple(OceanBlue.copy(alpha = 0.15f), OceanBlue, "Shipped")
                    OrderStatus.DELIVERED -> Triple(EmeraldSuccess.copy(alpha = 0.15f), EmeraldSuccess, "Delivered")
                    OrderStatus.CANCELLED -> Triple(RoseError.copy(alpha = 0.15f), RoseError, "Cancelled")
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(statusBg)
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = statusText,
                        color = statusFg,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Order Date and Items summary
            Text(
                text = "${order.items.size} item(s) • Total: $${String.format(Locale.US, "%.2f", order.totalAmount)}",
                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold)
            )

            Text(
                text = "Shipping to: ${order.shippingAddress.formattedAddress}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            // Cancel action if eligible
            if (order.canBeCancelled) {
                Spacer(modifier = Modifier.height(12.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    OutlinedButton(
                        onClick = onCancelClick,
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.error)
                    ) {
                        Text(stringResource(R.string.btn_cancel_order))
                    }
                }
            }
        }
    }
}
