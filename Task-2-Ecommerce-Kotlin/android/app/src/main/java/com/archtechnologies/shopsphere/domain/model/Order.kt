package com.archtechnologies.shopsphere.domain.model

enum class OrderStatus {
    PENDING,
    CONFIRMED,
    PROCESSING,
    SHIPPED,
    DELIVERED,
    CANCELLED
}

enum class PaymentMethod {
    MOCK_PAYMENT,
    CASH_ON_DELIVERY,
    CREDIT_CARD
}

enum class PaymentStatus {
    PENDING,
    SUCCESSFUL,
    FAILED,
    CANCELLED
}

data class OrderItem(
    val id: String,
    val productId: String,
    val productTitle: String,
    val imageUrl: String?,
    val unitPrice: Double,
    val quantity: Int,
    val sellerId: String
) {
    val totalPrice: Double get() = unitPrice * quantity
}

data class Order(
    val id: String,
    val orderNumber: String,
    val userId: String,
    val items: List<OrderItem>,
    val subtotal: Double,
    val deliveryFee: Double,
    val totalAmount: Double,
    val shippingAddress: Address,
    val status: OrderStatus = OrderStatus.PENDING,
    val paymentMethod: PaymentMethod = PaymentMethod.MOCK_PAYMENT,
    val paymentStatus: PaymentStatus = PaymentStatus.PENDING,
    val createdAt: String,
    val updatedAt: String? = null
) {
    val canBeCancelled: Boolean
        get() = status == OrderStatus.PENDING || status == OrderStatus.CONFIRMED
}
