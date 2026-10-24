package com.archtechnologies.shopsphere.presentation.screens.details

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.archtechnologies.shopsphere.data.repository.CartRepository
import com.archtechnologies.shopsphere.data.repository.ProductRepository
import com.archtechnologies.shopsphere.domain.model.Product
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ProductDetailsUiState(
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
    val product: Product? = null,
    val selectedQuantity: Int = 1,
    val isAddingToCart: Boolean = false,
    val isAddedToCartSuccess: Boolean = false
)

class ProductDetailsViewModel(
    private val productId: String,
    private val productRepository: ProductRepository,
    private val cartRepository: CartRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ProductDetailsUiState())
    val uiState: StateFlow<ProductDetailsUiState> = _uiState.asStateFlow()

    init {
        loadProduct()
    }

    fun loadProduct() {
        _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
        viewModelScope.launch {
            productRepository.getProductDetails(productId).onSuccess { prod ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    product = prod
                )
            }.onFailure { err ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = err.message ?: "Failed to load product details"
                )
            }
        }
    }

    fun setQuantity(qty: Int) {
        val prod = _uiState.value.product ?: return
        if (qty in 1..prod.stockQuantity) {
            _uiState.value = _uiState.value.copy(selectedQuantity = qty)
        }
    }

    fun addToCart(onSuccess: () -> Unit = {}) {
        val prod = _uiState.value.product ?: return
        _uiState.value = _uiState.value.copy(isAddingToCart = true)
        viewModelScope.launch {
            cartRepository.addToCart(prod.id, _uiState.value.selectedQuantity).onSuccess {
                _uiState.value = _uiState.value.copy(isAddingToCart = false, isAddedToCartSuccess = true)
                onSuccess()
            }.onFailure { err ->
                _uiState.value = _uiState.value.copy(isAddingToCart = false, errorMessage = err.message)
            }
        }
    }
}
