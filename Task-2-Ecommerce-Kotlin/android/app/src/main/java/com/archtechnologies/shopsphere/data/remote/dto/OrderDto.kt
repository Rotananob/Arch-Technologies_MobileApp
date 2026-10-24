package com.archtechnologies.shopsphere.data.remote.dto

import kotlinx.serialization.Serializable

@Serializable
data class AddToCartRequest(
    val productId: String,
    val quantity: Int = 1
)

@Serializable
data class UpdateCartItemRequest(
    val quantity: Int
)

@Serializable
data class CartItemDto(
    val id: String,
    val productId: String,
    val productTitle: String,
    val productTitleKh: String? = null,
    val unitPrice: Double,
    val imageUrl: String? = null,
    val quantity: Int,
    val maxAvailableStock: Int,
    val sellerId: String,
    val sellerName: String
)

@Serializable
data class CartResponse(
    val items: List<CartItemDto> = emptyList(),
    val subtotal: Double = 0.0,
    val deliveryFee: Double = 2.0,
    val total: Double = 0.0
)

@Serializable
data class CreateOrderRequest(
    val recipientName: String,
    val phoneNumber: String,
    val streetAddress: String,
    val city: String,
    val campusBuilding: String? = null,
    val paymentMethod: String = "MOCK_PAYMENT"
)

@Serializable
data class OrderItemDto(
    val id: String,
    val productId: String,
    val productTitle: String,
    val imageUrl: String? = null,
    val unitPrice: Double,
    val quantity: Int,
    val sellerId: String
)

@Serializable
data class OrderResponseDto(
    val id: String,
    val orderNumber: String,
    val userId: String,
    val items: List<OrderItemDto>,
    val subtotal: Double,
    val deliveryFee: Double,
    val totalAmount: Double,
    val recipientName: String,
    val phoneNumber: String,
    val streetAddress: String,
    val city: String,
    val campusBuilding: String? = null,
    val status: String,
    val paymentMethod: String,
    val paymentStatus: String,
    val createdAt: String
)

@Serializable
data class PaymentProcessRequest(
    val orderId: String,
    val outcome: String = "SUCCESS" // SUCCESS, FAILED, CANCELLED
)

@Serializable
data class PaymentProcessResponse(
    val orderId: String,
    val paymentStatus: String,
    val transactionId: String? = null,
    val message: String
)
