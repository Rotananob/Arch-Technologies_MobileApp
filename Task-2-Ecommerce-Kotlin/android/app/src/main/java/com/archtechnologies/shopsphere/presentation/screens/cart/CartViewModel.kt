package com.archtechnologies.shopsphere.presentation.screens.cart

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.archtechnologies.shopsphere.data.repository.CartRepository
import com.archtechnologies.shopsphere.domain.model.CartSummary
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class CartUiState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

class CartViewModel(
    private val cartRepository: CartRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(CartUiState())
    val uiState: StateFlow<CartUiState> = _uiState.asStateFlow()

    val cartSummary: StateFlow<CartSummary> = cartRepository.cartSummary
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), CartSummary())

    init {
        refreshCart()
    }

    fun refreshCart() {
        _uiState.value = CartUiState(isLoading = true)
        viewModelScope.launch {
            cartRepository.syncCartWithServer()
            _uiState.value = CartUiState(isLoading = false)
        }
    }

    fun updateQuantity(cartItemId: String, newQty: Int) {
        if (newQty <= 0) {
            removeItem(cartItemId)
            return
        }
        viewModelScope.launch {
            cartRepository.updateQuantity(cartItemId, newQty)
        }
    }

    fun removeItem(cartItemId: String) {
        viewModelScope.launch {
            cartRepository.removeItem(cartItemId)
        }
    }
}
