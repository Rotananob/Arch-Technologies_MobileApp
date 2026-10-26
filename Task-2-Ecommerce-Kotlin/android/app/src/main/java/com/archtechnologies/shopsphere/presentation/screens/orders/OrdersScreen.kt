package com.archtechnologies.shopsphere.presentation.screens.orders

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.LocalShipping
import androidx.compose.material.icons.outlined.ReceiptLong
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
                title = "No Orders Placed Yet",
                description = "When you order items from campus sellers, their live progress and tracking will be displayed here.",
                icon = Icons.Outlined.ReceiptLong,
                modifier = Modifier.padding(padding)
            )
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
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
    val (statusBg, statusFg, statusText) = when (order.status) {
        OrderStatus.PENDING -> Triple(AmberWarning.copy(alpha = 0.12f), AmberWarning, "Pending")
        OrderStatus.CONFIRMED -> Triple(OceanBlue.copy(alpha = 0.12f), OceanBlue, "Confirmed")
        OrderStatus.PROCESSING -> Triple(OceanBlue.copy(alpha = 0.12f), OceanBlue, "Processing")
        OrderStatus.SHIPPED -> Triple(OceanBlue.copy(alpha = 0.12f), OceanBlue, "Shipped")
        OrderStatus.DELIVERED -> Triple(EmeraldSuccess.copy(alpha = 0.12f), EmeraldSuccess, "Delivered")
        OrderStatus.CANCELLED -> Triple(RoseError.copy(alpha = 0.12f), RoseError, "Cancelled")
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .border(
                1.dp,
                MaterialTheme.colorScheme.outline.copy(alpha = 0.4f),
                RoundedCornerShape(10.dp)
            )
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            // Header Row: Order Number & Status Badge
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Order #${order.orderNumber}",
                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                )

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(statusBg)
                        .padding(horizontal = 8.dp, vertical = 3.dp)
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

            // Order Status Pipeline Visualization
            if (order.status != OrderStatus.CANCELLED) {
                OrderStatusPipeline(status = order.status)
                Spacer(modifier = Modifier.height(12.dp))
            }

            // Items count and total
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "${order.items.size} item(s) ordered",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = "Total: $${String.format(Locale.US, "%.2f", order.totalAmount)}",
                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            // Shipping Address
            Text(
                text = "Dispatch to: ${order.shippingAddress.formattedAddress}",
                style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            // Cancel Button if eligible
            if (order.canBeCancelled) {
                Spacer(modifier = Modifier.height(12.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    OutlinedButton(
                        onClick = onCancelClick,
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.error),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Text(
                            text = stringResource(R.string.btn_cancel_order),
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.SemiBold)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun OrderStatusPipeline(status: OrderStatus) {
    val steps = listOf("Confirmed", "Processing", "Shipped", "Delivered")
    val currentStepIndex = when (status) {
        OrderStatus.PENDING -> 0
        OrderStatus.CONFIRMED -> 1
        OrderStatus.PROCESSING -> 2
        OrderStatus.SHIPPED -> 3
        OrderStatus.DELIVERED -> 4
        OrderStatus.CANCELLED -> -1
    }

    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        steps.forEachIndexed { index, label ->
            val isPassed = currentStepIndex >= index + 1
            val isCurrent = currentStepIndex == index

            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(
                        if (isPassed || isCurrent) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline.copy(alpha = 0.4f)
                    )
            )

            if (index < steps.size - 1) {
                HorizontalDivider(
                    modifier = Modifier.weight(1f).padding(horizontal = 4.dp),
                    color = if (isPassed) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
                    thickness = 1.5.dp
                )
            }
        }
    }
}
