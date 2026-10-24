package com.archtechnologies.shopsphere.presentation.screens.discovery

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
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
            // Search Input
            OutlinedTextField(
                value = uiState.searchQuery,
                onValueChange = { viewModel.onSearchQueryChanged(it) },
                placeholder = { Text(stringResource(R.string.search_hint)) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                trailingIcon = {
                    if (uiState.searchQuery.isNotEmpty()) {
                        IconButton(onClick = { viewModel.onSearchQueryChanged("") }) {
                            Icon(Icons.Default.Close, contentDescription = "Clear")
                        }
                    }
                },
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            )

            // Category Filter Pills
            if (uiState.categories.isNotEmpty()) {
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    item {
                        CategoryChip(
                            name = stringResource(R.string.filter_all),
                            isSelected = uiState.selectedCategoryId == null,
                            onClick = { viewModel.onCategorySelected(null) }
                        )
                    }
                    items(uiState.categories) { category ->
                        CategoryChip(
                            name = category.getLocalizedName(isKhmerLocale),
                            isSelected = uiState.selectedCategoryId == category.id,
                            onClick = { viewModel.onCategorySelected(category.id) }
                        )
                    }
                }
            }

            // Results and States
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
                    description = "Try adjusting your search keywords or removing active category filters."
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
