package com.archtechnologies.shopsphere.presentation.screens.seller

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.DeleteOutline
import androidx.compose.material.icons.filled.Inventory
import androidx.compose.material.icons.filled.ShoppingBag
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
import com.archtechnologies.shopsphere.R
import com.archtechnologies.shopsphere.domain.model.Order
import com.archtechnologies.shopsphere.domain.model.OrderStatus
import com.archtechnologies.shopsphere.domain.model.Product
import com.archtechnologies.shopsphere.presentation.components.EmptyState
import com.archtechnologies.shopsphere.presentation.components.LoadingState
import com.archtechnologies.shopsphere.presentation.components.ShopSphereTopBar
import com.archtechnologies.shopsphere.presentation.theme.AmberWarning
import com.archtechnologies.shopsphere.presentation.theme.EmeraldSuccess
import com.archtechnologies.shopsphere.presentation.theme.OceanBlue
import com.archtechnologies.shopsphere.presentation.theme.RoseError
import java.util.Locale

@Composable
fun SellerScreen(
    viewModel: SellerViewModel,
    onNavigateToCreateListing: () -> Unit,
    isKhmerLocale: Boolean = false
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            ShopSphereTopBar(
                title = stringResource(R.string.seller_dashboard),
                actions = {
                    IconButton(onClick = onNavigateToCreateListing) {
                        Icon(Icons.Default.Add, contentDescription = "Add Product")
                    }
                }
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = onNavigateToCreateListing,
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary
            ) {
                Icon(Icons.Default.Add, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text(stringResource(R.string.btn_create_listing))
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Metrics Summary Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                SellerMetricCard(
                    title = "My Listings",
                    count = "${uiState.myListings.size}",
                    modifier = Modifier.weight(1f)
                )
                SellerMetricCard(
                    title = "Orders",
                    count = "${uiState.customerOrders.size}",
                    modifier = Modifier.weight(1f)
                )
            }

            // Tab Navigation
            TabRow(selectedTabIndex = uiState.selectedTab) {
                Tab(
                    selected = uiState.selectedTab == 0,
                    onClick = { viewModel.onTabSelected(0) },
                    text = { Text(stringResource(R.string.my_listings)) }
                )
                Tab(
                    selected = uiState.selectedTab == 1,
                    onClick = { viewModel.onTabSelected(1) },
                    text = { Text("Customer Orders (${uiState.customerOrders.size})") }
                )
            }

            if (uiState.isLoading) {
                LoadingState()
            } else if (uiState.selectedTab == 0) {
                // Listings Tab
                if (uiState.myListings.isEmpty()) {
                    EmptyState(
                        title = "No Active Listings",
                        description = "You haven't listed any products yet. Tap the button below to add your first listing.",
                        icon = Icons.Default.Inventory
                    )
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(uiState.myListings, key = { it.id }) { product ->
                            SellerListingCard(
                                product = product,
                                isKhmerLocale = isKhmerLocale,
                                onDelete = { viewModel.deleteListing(product.id) }
                            )
                        }
                    }
                }
            } else {
                // Customer Orders Tab
                if (uiState.customerOrders.isEmpty()) {
                    EmptyState(
                        title = "No Customer Orders Yet",
                        description = "When other users purchase your listed products, their orders and shipping details will appear here.",
                        icon = Icons.Default.ShoppingBag
                    )
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(uiState.customerOrders, key = { it.id }) { order ->
                            SellerOrderCard(order = order)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun SellerMetricCard(
    title: String,
    count: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(text = title, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = count, style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold))
        }
    }
}

@Composable
fun SellerListingCard(
    product: Product,
    isKhmerLocale: Boolean = false,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .border(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.6f), RoundedCornerShape(8.dp)),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = product.getLocalizedTitle(isKhmerLocale),
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                    maxLines = 1
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "$${String.format(Locale.US, "%.2f", product.price)}",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Stock: ${product.stockQuantity}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "• ${product.condition.name.replace("_", " ")}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            IconButton(onClick = onDelete) {
                Icon(
                    imageVector = Icons.Default.DeleteOutline,
                    contentDescription = "Delete Listing",
                    tint = RoseError
                )
            }
        }
    }
}

@Composable
fun SellerOrderCard(
    order: Order
) {
    val statusColor = when (order.status) {
        OrderStatus.PENDING -> AmberWarning
        OrderStatus.CONFIRMED, OrderStatus.PROCESSING -> OceanBlue
        OrderStatus.SHIPPED, OrderStatus.DELIVERED -> EmeraldSuccess
        OrderStatus.CANCELLED -> RoseError
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .border(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.6f), RoundedCornerShape(8.dp)),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
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
                        .background(statusColor.copy(alpha = 0.15f))
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = order.status.name,
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = statusColor)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            order.items.forEach { item ->
                Text(
                    text = "${item.quantity}x ${item.productTitle} ($${String.format(Locale.US, "%.2f", item.unitPrice)})",
                    style = MaterialTheme.typography.bodySmall,
                    maxLines = 1
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Customer: ${order.shippingAddress.recipientName} (${order.shippingAddress.phoneNumber})",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = "Total: $${String.format(Locale.US, "%.2f", order.totalAmount)}",
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold)
                )
            }
        }
    }
}
