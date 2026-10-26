package com.archtechnologies.shopsphere.presentation.screens.seller

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import coil.request.ImageRequest
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
                        Icon(Icons.Default.Add, contentDescription = "Add Product Listing")
                    }
                }
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = onNavigateToCreateListing,
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary,
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = stringResource(R.string.btn_create_listing),
                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                )
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Metrics Row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                SellerMetricCard(
                    icon = Icons.Outlined.Storefront,
                    title = "Active Listings",
                    count = "${uiState.myListings.size}",
                    modifier = Modifier.weight(1f)
                )
                SellerMetricCard(
                    icon = Icons.Outlined.ShoppingBag,
                    title = "Orders",
                    count = "${uiState.customerOrders.size}",
                    modifier = Modifier.weight(1f)
                )
                SellerMetricCard(
                    icon = Icons.Outlined.Star,
                    title = "Seller Rating",
                    count = "4.9",
                    modifier = Modifier.weight(1f)
                )
            }

            // Tab Navigation
            TabRow(
                selectedTabIndex = uiState.selectedTab,
                containerColor = MaterialTheme.colorScheme.surface,
                divider = {
                    HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.35f))
                }
            ) {
                Tab(
                    selected = uiState.selectedTab == 0,
                    onClick = { viewModel.onTabSelected(0) },
                    text = {
                        Text(
                            text = "${stringResource(R.string.my_listings)} (${uiState.myListings.size})",
                            style = MaterialTheme.typography.labelMedium.copy(
                                fontWeight = if (uiState.selectedTab == 0) FontWeight.Bold else FontWeight.Medium
                            )
                        )
                    }
                )
                Tab(
                    selected = uiState.selectedTab == 1,
                    onClick = { viewModel.onTabSelected(1) },
                    text = {
                        Text(
                            text = "Customer Orders (${uiState.customerOrders.size})",
                            style = MaterialTheme.typography.labelMedium.copy(
                                fontWeight = if (uiState.selectedTab == 1) FontWeight.Bold else FontWeight.Medium
                            )
                        )
                    }
                )
            }

            if (uiState.isLoading) {
                LoadingState()
            } else if (uiState.selectedTab == 0) {
                // Listings Tab
                if (uiState.myListings.isEmpty()) {
                    EmptyState(
                        title = "No Active Listings",
                        description = "You haven't listed any campus products yet. Tap the button below to add your first item.",
                        icon = Icons.Outlined.Inventory2,
                        actionLabel = "Create New Listing",
                        onActionClick = onNavigateToCreateListing
                    )
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
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
                        description = "When students purchase your listed items, order fulfillment details and handover locations will be shown here.",
                        icon = Icons.Outlined.ReceiptLong
                    )
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
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
    icon: ImageVector,
    title: String,
    count: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
        ),
        shape = RoundedCornerShape(8.dp),
        border = androidx.compose.foundation.BorderStroke(
            0.75.dp,
            MaterialTheme.colorScheme.outline.copy(alpha = 0.35f)
        )
    ) {
        Column(modifier = Modifier.padding(10.dp)) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = count,
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Bold,
                    fontSize = 17.sp
                )
            )
            Text(
                text = title,
                style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp),
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
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
            .border(
                1.dp,
                MaterialTheme.colorScheme.outline.copy(alpha = 0.4f),
                RoundedCornerShape(8.dp)
            ),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Thumbnail
            Box(
                modifier = Modifier
                    .size(68.dp)
                    .clip(RoundedCornerShape(6.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant)
            ) {
                AsyncImage(
                    model = ImageRequest.Builder(LocalContext.current)
                        .data(product.images.firstOrNull())
                        .crossfade(true)
                        .build(),
                    contentDescription = product.title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = product.getLocalizedTitle(isKhmerLocale),
                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.SemiBold),
                    maxLines = 1
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "$${String.format(Locale.US, "%.2f", product.price)}",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Stock: ${product.stockQuantity}",
                        style = MaterialTheme.typography.labelSmall.copy(fontSize = 11.sp),
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "• ${product.condition.name.replace("_", " ")}",
                        style = MaterialTheme.typography.labelSmall.copy(fontSize = 11.sp),
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            IconButton(onClick = onDelete) {
                Icon(
                    imageVector = Icons.Outlined.DeleteOutline,
                    contentDescription = "Delete Listing",
                    tint = RoseError,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}

@Composable
fun SellerOrderCard(
    order: Order
) {
    val (statusBg, statusFg, statusLabel) = when (order.status) {
        OrderStatus.PENDING -> Triple(AmberWarning.copy(alpha = 0.12f), AmberWarning, "Pending")
        OrderStatus.CONFIRMED, OrderStatus.PROCESSING -> Triple(OceanBlue.copy(alpha = 0.12f), OceanBlue, "Processing")
        OrderStatus.SHIPPED, OrderStatus.DELIVERED -> Triple(EmeraldSuccess.copy(alpha = 0.12f), EmeraldSuccess, "Delivered")
        OrderStatus.CANCELLED -> Triple(RoseError.copy(alpha = 0.12f), RoseError, "Cancelled")
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .border(
                1.dp,
                MaterialTheme.colorScheme.outline.copy(alpha = 0.4f),
                RoundedCornerShape(8.dp)
            ),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
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
                        .background(statusBg)
                        .padding(horizontal = 7.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = statusLabel,
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = statusFg)
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
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Customer: ${order.shippingAddress.recipientName} (${order.shippingAddress.phoneNumber})",
                    style = MaterialTheme.typography.labelSmall.copy(fontSize = 11.sp),
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
