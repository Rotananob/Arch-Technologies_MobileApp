package com.archtechnologies.shopsphere.presentation.screens.orders

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.archtechnologies.shopsphere.data.repository.OrderRepository
import com.archtechnologies.shopsphere.domain.model.Order
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class OrdersUiState(
    val isLoading: Boolean = false,
    val orders: List<Order> = emptyList(),
    val errorMessage: String? = null
)

class OrdersViewModel(
    private val orderRepository: OrderRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(OrdersUiState())
    val uiState: StateFlow<OrdersUiState> = _uiState.asStateFlow()

    init {
        loadOrders()
    }

    fun loadOrders() {
        _uiState.value = OrdersUiState(isLoading = true)
        viewModelScope.launch {
            orderRepository.getMyOrders().onSuccess { list ->
                _uiState.value = OrdersUiState(isLoading = false, orders = list)
            }.onFailure { err ->
                _uiState.value = OrdersUiState(isLoading = false, errorMessage = err.message)
            }
        }
    }

    fun cancelOrder(orderId: String) {
        viewModelScope.launch {
            orderRepository.cancelOrder(orderId).onSuccess {
                loadOrders()
            }
        }
    }
}
