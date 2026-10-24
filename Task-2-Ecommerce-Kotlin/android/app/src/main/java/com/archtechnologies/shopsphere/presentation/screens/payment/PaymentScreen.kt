package com.archtechnologies.shopsphere.presentation.screens.payment

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.archtechnologies.shopsphere.data.repository.OrderRepository
import com.archtechnologies.shopsphere.presentation.components.ShopSphereTopBar
import com.archtechnologies.shopsphere.presentation.theme.EmeraldSuccess
import com.archtechnologies.shopsphere.presentation.theme.RoseError
import kotlinx.coroutines.launch

@Composable
fun PaymentScreen(
    orderId: String,
    orderRepository: OrderRepository,
    onPaymentComplete: () -> Unit,
    onNavigateBack: () -> Unit
) {
    var paymentStatus by remember { mutableStateOf("PENDING") } // PENDING, SUCCESSFUL, FAILED, CANCELLED
    var isLoading by remember { mutableStateOf(false) }
    var statusMessage by remember { mutableStateOf("Complete your payment simulation below:") }
    val scope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            ShopSphereTopBar(
                title = "Payment Gateway Sandbox",
                canNavigateBack = true,
                onNavigateBack = onNavigateBack
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            when (paymentStatus) {
                "SUCCESSFUL" -> {
                    Box(
                        modifier = Modifier.size(90.dp).clip(CircleShape).background(EmeraldSuccess.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = EmeraldSuccess, modifier = Modifier.size(54.dp))
                    }
                    Spacer(modifier = Modifier.height(24.dp))
                    Text("Payment Successful!", style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold))
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(statusMessage, textAlign = TextAlign.Center, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(modifier = Modifier.height(32.dp))
                    Button(
                        onClick = onPaymentComplete,
                        modifier = Modifier.fillMaxWidth().height(48.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                    ) {
                        Text("View Order Details")
                    }
                }
                "FAILED" -> {
                    Box(
                        modifier = Modifier.size(90.dp).clip(CircleShape).background(RoseError.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.Close, contentDescription = null, tint = RoseError, modifier = Modifier.size(54.dp))
                    }
                    Spacer(modifier = Modifier.height(24.dp))
                    Text("Payment Declined", style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold))
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(statusMessage, textAlign = TextAlign.Center, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(modifier = Modifier.height(32.dp))
                    Button(
                        onClick = { paymentStatus = "PENDING" },
                        modifier = Modifier.fillMaxWidth().height(48.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                    ) {
                        Text("Try Again")
                    }
                }
                "CANCELLED" -> {
                    Box(
                        modifier = Modifier.size(90.dp).clip(CircleShape).background(Color.Gray.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.Warning, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(54.dp))
                    }
                    Spacer(modifier = Modifier.height(24.dp))
                    Text("Payment Cancelled", style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold))
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("The transaction was cancelled by the user.", textAlign = TextAlign.Center, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(modifier = Modifier.height(32.dp))
                    OutlinedButton(
                        onClick = onNavigateBack,
                        modifier = Modifier.fillMaxWidth().height(48.dp)
                    ) {
                        Text("Return to Checkout")
                    }
                }
                else -> {
                    // PENDING simulation controls
                    Text(
                        text = "Sandbox Mock Payment",
                        style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Order ID: $orderId\nChoose a simulated payment outcome to test the backend verification lifecycle:",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(32.dp))

                    if (isLoading) {
                        CircularProgressIndicator(strokeWidth = 3.dp, color = MaterialTheme.colorScheme.primary)
                    } else {
                        Button(
                            onClick = {
                                isLoading = true
                                scope.launch {
                                    val result = orderRepository.processPayment(orderId, "SUCCESS")
                                    isLoading = false
                                    result.onSuccess {
                                        paymentStatus = "SUCCESSFUL"
                                        statusMessage = "Order marked as CONFIRMED on server."
                                    }.onFailure {
                                        paymentStatus = "FAILED"
                                        statusMessage = it.message ?: "Server verification failed"
                                    }
                                }
                            },
                            modifier = Modifier.fillMaxWidth().height(48.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = EmeraldSuccess),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Simulate Successful Payment", color = Color.White)
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        OutlinedButton(
                            onClick = {
                                isLoading = true
                                scope.launch {
                                    val result = orderRepository.processPayment(orderId, "FAILED")
                                    isLoading = false
                                    paymentStatus = "FAILED"
                                    statusMessage = "Simulated bank card decline."
                                }
                            },
                            modifier = Modifier.fillMaxWidth().height(48.dp),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Simulate Payment Failure", color = RoseError)
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        TextButton(
                            onClick = {
                                isLoading = true
                                scope.launch {
                                    orderRepository.processPayment(orderId, "CANCELLED")
                                    isLoading = false
                                    paymentStatus = "CANCELLED"
                                }
                            }
                        ) {
                            Text("Cancel Transaction", color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
        }
    }
}
