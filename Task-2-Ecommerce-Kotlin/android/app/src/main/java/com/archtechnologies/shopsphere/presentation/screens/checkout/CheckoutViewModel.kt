package com.archtechnologies.shopsphere.presentation.screens.checkout

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.archtechnologies.shopsphere.data.repository.CartRepository
import com.archtechnologies.shopsphere.data.repository.OrderRepository
import com.archtechnologies.shopsphere.domain.model.CartSummary
import com.archtechnologies.shopsphere.domain.model.Order
import com.archtechnologies.shopsphere.domain.model.PaymentMethod
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class CheckoutUiState(
    val recipientName: String = "",
    val phone: String = "",
    val street: String = "",
    val city: String = "Phnom Penh",
    val building: String = "",
    val paymentMethod: PaymentMethod = PaymentMethod.MOCK_PAYMENT,
    val isPlacingOrder: Boolean = false,
    val errorMessage: String? = null,
    val createdOrder: Order? = null
)

class CheckoutViewModel(
    private val cartRepository: CartRepository,
    private val orderRepository: OrderRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(CheckoutUiState())
    val uiState: StateFlow<CheckoutUiState> = _uiState.asStateFlow()

    val cartSummary: StateFlow<CartSummary> = cartRepository.cartSummary
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), CartSummary())

    fun updateRecipientName(name: String) { _uiState.value = _uiState.value.copy(recipientName = name) }
    fun updatePhone(phone: String) { _uiState.value = _uiState.value.copy(phone = phone) }
    fun updateStreet(street: String) { _uiState.value = _uiState.value.copy(street = street) }
    fun updateCity(city: String) { _uiState.value = _uiState.value.copy(city = city) }
    fun updateBuilding(building: String) { _uiState.value = _uiState.value.copy(building = building) }
    fun updatePaymentMethod(method: PaymentMethod) { _uiState.value = _uiState.value.copy(paymentMethod = method) }

    fun placeOrder(onSuccess: (Order) -> Unit) {
        val state = _uiState.value
        if (state.recipientName.isBlank() || state.phone.isBlank() || state.street.isBlank()) {
            _uiState.value = state.copy(errorMessage = "Please complete all required shipping fields")
            return
        }

        _uiState.value = state.copy(isPlacingOrder = true, errorMessage = null)
        viewModelScope.launch {
            val result = orderRepository.createOrder(
                recipientName = state.recipientName,
                phone = state.phone,
                street = state.street,
                city = state.city,
                building = if (state.building.isNotBlank()) state.building else null,
                paymentMethod = state.paymentMethod
            )

            result.onSuccess { order ->
                cartRepository.clearCart()
                _uiState.value = _uiState.value.copy(isPlacingOrder = false, createdOrder = order)
                onSuccess(order)
            }.onFailure { err ->
                _uiState.value = _uiState.value.copy(
                    isPlacingOrder = false,
                    errorMessage = err.message ?: "Failed to place order"
                )
            }
        }
    }
}
