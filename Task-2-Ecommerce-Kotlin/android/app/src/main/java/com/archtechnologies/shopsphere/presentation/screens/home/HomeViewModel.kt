package com.archtechnologies.shopsphere.presentation.screens.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.archtechnologies.shopsphere.data.repository.CartRepository
import com.archtechnologies.shopsphere.data.repository.ProductRepository
import com.archtechnologies.shopsphere.domain.model.Category
import com.archtechnologies.shopsphere.domain.model.Product
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class HomeUiState(
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
    val categories: List<Category> = emptyList(),
    val featuredProducts: List<Product> = emptyList(),
    val recentProducts: List<Product> = emptyList(),
    val promotionProducts: List<Product> = emptyList(),
    val selectedCategoryId: String? = null
)

class HomeViewModel(
    private val productRepository: ProductRepository,
    private val cartRepository: CartRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    val cartItemCount: StateFlow<Int> = cartRepository.localCartItems
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
        .let { flow ->
            MutableStateFlow(0).apply {
                viewModelScope.launch {
                    flow.collect { items -> value = items.sumOf { it.quantity } }
                }
            }
        }

    init {
        loadHomeData()
    }

    fun loadHomeData() {
        _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
        viewModelScope.launch {
            try {
                val catResult = productRepository.getCategories()
                val prodResult = productRepository.fetchProducts()

                val categories = catResult.getOrDefault(emptyList())
                val allProducts = prodResult.getOrDefault(emptyList())

                val featured = allProducts.filter { it.isFeatured }
                val promotions = allProducts.filter { it.isPromotion }
                val recent = allProducts.sortedByDescending { it.createdAt }.take(6)

                _uiState.value = HomeUiState(
                    isLoading = false,
                    categories = categories,
                    featuredProducts = if (featured.isNotEmpty()) featured else allProducts.take(4),
                    recentProducts = recent,
                    promotionProducts = promotions
                )
            } catch (e: Exception) {
                _uiState.value = HomeUiState(
                    isLoading = false,
                    errorMessage = e.message ?: "Failed to load marketplace content"
                )
            }
        }
    }
}
