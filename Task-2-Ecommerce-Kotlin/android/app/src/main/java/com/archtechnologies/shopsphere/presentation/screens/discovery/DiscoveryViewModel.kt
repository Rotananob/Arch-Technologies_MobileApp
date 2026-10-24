package com.archtechnologies.shopsphere.presentation.screens.discovery

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.archtechnologies.shopsphere.data.repository.ProductRepository
import com.archtechnologies.shopsphere.domain.model.Category
import com.archtechnologies.shopsphere.domain.model.Product
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

enum class SortOption {
    NEWEST,
    PRICE_LOW_TO_HIGH,
    PRICE_HIGH_TO_LOW
}

data class DiscoveryUiState(
    val searchQuery: String = "",
    val selectedCategoryId: String? = null,
    val selectedSort: SortOption = SortOption.NEWEST,
    val inStockOnly: Boolean = false,
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val categories: List<Category> = emptyList(),
    val products: List<Product> = emptyList()
)

class DiscoveryViewModel(
    private val productRepository: ProductRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(DiscoveryUiState())
    val uiState: StateFlow<DiscoveryUiState> = _uiState.asStateFlow()

    init {
        loadCategories()
        applyFilters()
    }

    private fun loadCategories() {
        viewModelScope.launch {
            productRepository.getCategories().onSuccess { list ->
                _uiState.value = _uiState.value.copy(categories = list)
            }
        }
    }

    fun onSearchQueryChanged(query: String) {
        _uiState.value = _uiState.value.copy(searchQuery = query)
        applyFilters()
    }

    fun onCategorySelected(categoryId: String?) {
        val newCategory = if (_uiState.value.selectedCategoryId == categoryId) null else categoryId
        _uiState.value = _uiState.value.copy(selectedCategoryId = newCategory)
        applyFilters()
    }

    fun onSortSelected(sort: SortOption) {
        _uiState.value = _uiState.value.copy(selectedSort = sort)
        applyFilters()
    }

    fun onToggleInStockOnly() {
        _uiState.value = _uiState.value.copy(inStockOnly = !_uiState.value.inStockOnly)
        applyFilters()
    }

    fun applyFilters() {
        _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
        viewModelScope.launch {
            val currentState = _uiState.value
            val sortKey = when (currentState.selectedSort) {
                SortOption.NEWEST -> "newest"
                SortOption.PRICE_LOW_TO_HIGH -> "price_asc"
                SortOption.PRICE_HIGH_TO_LOW -> "price_desc"
            }

            productRepository.fetchProducts(
                search = if (currentState.searchQuery.isNotBlank()) currentState.searchQuery else null,
                categoryId = currentState.selectedCategoryId,
                sortBy = sortKey
            ).onSuccess { list ->
                val filtered = if (currentState.inStockOnly) {
                    list.filter { it.isAvailable }
                } else {
                    list
                }
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    products = filtered
                )
            }.onFailure { err ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = err.message ?: "Failed to find products"
                )
            }
        }
    }
}
