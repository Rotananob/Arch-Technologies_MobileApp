package com.archtechnologies.shopsphere.presentation.screens.discovery

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.archtechnologies.shopsphere.R
import com.archtechnologies.shopsphere.presentation.components.*

@Composable
fun DiscoveryScreen(
    viewModel: DiscoveryViewModel,
    onNavigateToProduct: (String) -> Unit,
    isKhmerLocale: Boolean = false
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            ShopSphereTopBar(title = stringResource(R.string.nav_explore))
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Search Input Field
            OutlinedTextField(
                value = uiState.searchQuery,
                onValueChange = { viewModel.onSearchQueryChanged(it) },
                placeholder = {
                    Text(
                        text = stringResource(R.string.search_hint),
                        style = MaterialTheme.typography.bodyMedium.copy(fontSize = 13.sp)
                    )
                },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Outlined.Search,
                        contentDescription = "Search",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(18.dp)
                    )
                },
                trailingIcon = {
                    if (uiState.searchQuery.isNotEmpty()) {
                        IconButton(onClick = { viewModel.onSearchQueryChanged("") }) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Clear Search",
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                },
                singleLine = true,
                shape = RoundedCornerShape(10.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = MaterialTheme.colorScheme.primary,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            )

            // Category Filter Pills
            if (uiState.categories.isNotEmpty()) {
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    item {
                        CategoryChip(
                            name = stringResource(R.string.filter_all),
                            isSelected = uiState.selectedCategoryId == null,
                            onClick = { viewModel.onCategorySelected(null) },
                            icon = Icons.Outlined.GridView
                        )
                    }
                    items(uiState.categories) { category ->
                        val icon = getCategoryIcon(category.slug)
                        CategoryChip(
                            name = category.getLocalizedName(isKhmerLocale),
                            isSelected = uiState.selectedCategoryId == category.id,
                            onClick = { viewModel.onCategorySelected(category.id) },
                            icon = icon
                        )
                    }
                }
            }

            // Sorting & In-Stock Filter Row
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    FilterChip(
                        selected = uiState.selectedSort == SortOption.NEWEST,
                        onClick = { viewModel.onSortSelected(SortOption.NEWEST) },
                        label = {
                            Text(
                                text = "Newest",
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Medium)
                            )
                        },
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Outlined.Schedule,
                                contentDescription = null,
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    )
                }
                item {
                    FilterChip(
                        selected = uiState.selectedSort == SortOption.PRICE_LOW_TO_HIGH,
                        onClick = { viewModel.onSortSelected(SortOption.PRICE_LOW_TO_HIGH) },
                        label = {
                            Text(
                                text = "Price: Low to High",
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Medium)
                            )
                        },
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Outlined.ArrowUpward,
                                contentDescription = null,
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    )
                }
                item {
                    FilterChip(
                        selected = uiState.selectedSort == SortOption.PRICE_HIGH_TO_LOW,
                        onClick = { viewModel.onSortSelected(SortOption.PRICE_HIGH_TO_LOW) },
                        label = {
                            Text(
                                text = "Price: High to Low",
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Medium)
                            )
                        },
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Outlined.ArrowDownward,
                                contentDescription = null,
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    )
                }
                item {
                    FilterChip(
                        selected = uiState.inStockOnly,
                        onClick = { viewModel.onToggleInStockOnly() },
                        label = {
                            Text(
                                text = "In Stock Only",
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Medium)
                            )
                        },
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Outlined.CheckCircle,
                                contentDescription = null,
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    )
                }
            }

            // Results Count Header
            if (!uiState.isLoading && uiState.products.isNotEmpty()) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Results (${uiState.products.size})",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    )
                }
            }

            // Results Content State
            if (uiState.isLoading) {
                LoadingState()
            } else if (uiState.errorMessage != null) {
                ErrorState(
                    errorMessage = uiState.errorMessage!!,
                    onRetry = { viewModel.applyFilters() }
                )
            } else if (uiState.products.isEmpty()) {
                EmptyState(
                    title = stringResource(R.string.empty_products),
                    description = "No items match your active filters. Try clearing your search keyword or switching category.",
                    icon = Icons.Outlined.SearchOff
                )
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    val chunked = uiState.products.chunked(2)
                    items(chunked) { rowItems ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
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

private fun getCategoryIcon(slug: String): ImageVector {
    return when {
        slug.contains("tech") || slug.contains("electronics") -> Icons.Outlined.Devices
        slug.contains("book") -> Icons.Outlined.MenuBook
        slug.contains("fashion") || slug.contains("apparel") -> Icons.Outlined.Checkroom
        slug.contains("stationery") || slug.contains("supplies") -> Icons.Outlined.EditNote
        else -> Icons.Outlined.Category
    }
}
