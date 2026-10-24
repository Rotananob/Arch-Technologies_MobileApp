package com.archtechnologies.shopsphere.presentation.screens.seller

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.archtechnologies.shopsphere.data.repository.ProductRepository
import com.archtechnologies.shopsphere.domain.model.Category
import com.archtechnologies.shopsphere.domain.model.Product
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class SellerUiState(
    val isLoading: Boolean = false,
    val myListings: List<Product> = emptyList(),
    val categories: List<Category> = emptyList(),
    val isCreatingListing: Boolean = false,
    val listingSuccessMessage: String? = null,
    val errorMessage: String? = null
)

class SellerViewModel(
    private val productRepository: ProductRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(SellerUiState())
    val uiState: StateFlow<SellerUiState> = _uiState.asStateFlow()

    init {
        loadSellerData()
    }

    fun loadSellerData() {
        _uiState.value = _uiState.value.copy(isLoading = true)
        viewModelScope.launch {
            productRepository.getCategories().onSuccess { catList ->
                _uiState.value = _uiState.value.copy(categories = catList)
            }
            productRepository.fetchProducts().onSuccess { allProducts ->
                // In local app, show user's listings or first 5 as demo
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    myListings = allProducts
                )
            }.onFailure {
                _uiState.value = _uiState.value.copy(isLoading = false)
            }
        }
    }

    fun createListing(
        title: String,
        description: String,
        price: Double,
        categoryId: String,
        stock: Int,
        condition: String,
        imageUrl: String,
        onSuccess: () -> Unit
    ) {
        _uiState.value = _uiState.value.copy(isCreatingListing = true, errorMessage = null)
        viewModelScope.launch {
            val result = productRepository.createProductListing(
                title = title,
                description = description,
                price = price,
                categoryId = categoryId,
                stock = stock,
                condition = condition,
                images = if (imageUrl.isNotBlank()) listOf(imageUrl) else emptyList()
            )

            result.onSuccess {
                _uiState.value = _uiState.value.copy(
                    isCreatingListing = false,
                    listingSuccessMessage = "Product published successfully"
                )
                loadSellerData()
                onSuccess()
            }.onFailure { err ->
                _uiState.value = _uiState.value.copy(
                    isCreatingListing = false,
                    errorMessage = err.message ?: "Failed to publish listing"
                )
            }
        }
    }
}
