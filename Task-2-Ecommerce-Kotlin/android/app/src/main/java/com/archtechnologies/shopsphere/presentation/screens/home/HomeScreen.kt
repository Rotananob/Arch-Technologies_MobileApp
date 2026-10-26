package com.archtechnologies.shopsphere.presentation.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.archtechnologies.shopsphere.R
import com.archtechnologies.shopsphere.presentation.components.*
import com.archtechnologies.shopsphere.presentation.theme.OceanBlue
import com.archtechnologies.shopsphere.presentation.theme.Slate900

@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    onNavigateToSearch: () -> Unit,
    onNavigateToCategory: (String) -> Unit,
    onNavigateToProduct: (String) -> Unit,
    onNavigateToCart: () -> Unit,
    isKhmerLocale: Boolean = false
) {
    val uiState by viewModel.uiState.collectAsState()
    val cartCount by viewModel.cartItemCount.collectAsState()

    Scaffold(
        topBar = {
            ShopSphereTopBar(
                title = stringResource(R.string.app_name),
                cartItemCount = cartCount,
                onCartClick = onNavigateToCart
            )
        }
    ) { padding ->
        if (uiState.isLoading) {
            LoadingState(modifier = Modifier.padding(padding))
        } else if (uiState.errorMessage != null) {
            ErrorState(
                errorMessage = uiState.errorMessage!!,
                onRetry = { viewModel.loadHomeData() },
                modifier = Modifier.padding(padding)
            )
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentPadding = PaddingValues(bottom = 32.dp)
            ) {
                // Editorial Hero Banner
                item {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 10.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.6f)
                        ),
                        shape = RoundedCornerShape(12.dp),
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            MaterialTheme.colorScheme.outline.copy(alpha = 0.35f)
                        )
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp)
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(6.dp)
                                        .clip(CircleShape)
                                        .background(OceanBlue)
                                )
                                Text(
                                    text = "OFFICIAL CAMPUS MARKETPLACE",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        letterSpacing = 1.sp,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 10.sp,
                                        color = OceanBlue
                                    )
                                )
                            }

                            Spacer(modifier = Modifier.height(6.dp))

                            Text(
                                text = "Buy & Sell Trusted Gear",
                                style = MaterialTheme.typography.titleLarge.copy(
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 19.sp,
                                    letterSpacing = (-0.3).sp
                                )
                            )

                            Spacer(modifier = Modifier.height(4.dp))

                            Text(
                                text = "Verified student sellers, authoritative stock checks, and zero listing fees.",
                                style = MaterialTheme.typography.bodySmall.copy(
                                    fontSize = 12.sp,
                                    lineHeight = 17.sp
                                ),
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            // Trust Badges Row
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(16.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                TrustPill(icon = Icons.Outlined.VerifiedUser, text = "Verified IDs")
                                TrustPill(icon = Icons.Outlined.LocalShipping, text = "Safe Pickup")
                                TrustPill(icon = Icons.Outlined.Security, text = "Secure Orders")
                            }
                        }
                    }
                }

                // Search Trigger Bar
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 4.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .border(
                                1.dp,
                                MaterialTheme.colorScheme.outline.copy(alpha = 0.5f),
                                RoundedCornerShape(10.dp)
                            )
                            .background(MaterialTheme.colorScheme.surface)
                            .clickable(onClick = onNavigateToSearch)
                            .padding(horizontal = 14.dp, vertical = 12.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(
                                imageVector = Icons.Outlined.Search,
                                contentDescription = "Search",
                                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = stringResource(R.string.search_hint),
                                style = MaterialTheme.typography.bodyMedium.copy(fontSize = 13.sp),
                                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.75f),
                                modifier = Modifier.weight(1f)
                            )
                            Icon(
                                imageVector = Icons.Outlined.Tune,
                                contentDescription = "Filters",
                                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                }

                // Curated Categories Section
                if (uiState.categories.isNotEmpty()) {
                    item {
                        Column(modifier = Modifier.padding(top = 16.dp)) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 16.dp, vertical = 6.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = stringResource(R.string.section_categories),
                                    style = MaterialTheme.typography.titleSmall.copy(
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 15.sp,
                                        letterSpacing = (-0.2).sp
                                    )
                                )
                                TextButton(
                                    onClick = onNavigateToSearch,
                                    contentPadding = PaddingValues(0.dp)
                                ) {
                                    Text(
                                        text = "View All",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontWeight = FontWeight.SemiBold,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                    )
                                }
                            }

                            LazyRow(
                                contentPadding = PaddingValues(horizontal = 16.dp),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                items(uiState.categories) { category ->
                                    val icon = getCategoryIcon(category.slug)
                                    CategoryChip(
                                        name = category.getLocalizedName(isKhmerLocale),
                                        isSelected = false,
                                        onClick = { onNavigateToCategory(category.id) },
                                        icon = icon
                                    )
                                }
                            }
                        }
                    }
                }

                // Featured Picks Carousel
                if (uiState.featuredProducts.isNotEmpty()) {
                    item {
                        Column(modifier = Modifier.padding(top = 22.dp)) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 16.dp, vertical = 6.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = stringResource(R.string.section_featured),
                                        style = MaterialTheme.typography.titleSmall.copy(
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 15.sp,
                                            letterSpacing = (-0.2).sp
                                        )
                                    )
                                    Text(
                                        text = "Handpicked and verified campus items",
                                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            LazyRow(
                                contentPadding = PaddingValues(horizontal = 16.dp),
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                items(uiState.featuredProducts, key = { it.id }) { product ->
                                    ProductCard(
                                        product = product,
                                        onClick = { onNavigateToProduct(product.id) },
                                        modifier = Modifier.width(185.dp),
                                        isKhmerLocale = isKhmerLocale
                                    )
                                }
                            }
                        }
                    }
                }

                // Recently Added Section (2-Column Grid)
                if (uiState.recentProducts.isNotEmpty()) {
                    item {
                        Column(
                            modifier = Modifier.padding(start = 16.dp, end = 16.dp, top = 24.dp, bottom = 8.dp)
                        ) {
                            Text(
                                text = stringResource(R.string.section_recent),
                                style = MaterialTheme.typography.titleSmall.copy(
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp,
                                    letterSpacing = (-0.2).sp
                                )
                            )
                            Text(
                                text = "Latest arrivals listed by students",
                                style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }

                    val chunked = uiState.recentProducts.chunked(2)
                    items(chunked) { rowItems ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp, vertical = 6.dp),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            for (product in rowItems) {
                                ProductCard(
                                    product = product,
                                    onClick = { onNavigateToProduct(product.id) },
                                    modifier = Modifier.weight(1f),
                                    isKhmerLocale = isKhmerLocale
                                )
                            }
                            if (rowItems.size == 1) {
                                Spacer(modifier = Modifier.weight(1f))
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun TrustPill(
    icon: ImageVector,
    text: String
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            modifier = Modifier.size(13.dp),
            tint = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall.copy(
                fontSize = 10.sp,
                fontWeight = FontWeight.Medium
            ),
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

private fun getCategoryIcon(slug: String): ImageVector {
    return when {
        slug.contains("tech") || slug.contains("electronics") -> Icons.Outlined.Devices
        slug.contains("book") -> Icons.Outlined.MenuBook
        slug.contains("fashion") || slug.contains("apparel") -> Icons.Outlined.Checkroom
        slug.contains("stationery") || slug.contains("supplies") -> Icons.Outlined.EditNote
        else -> Icons.Outlined.Category
    }
}
