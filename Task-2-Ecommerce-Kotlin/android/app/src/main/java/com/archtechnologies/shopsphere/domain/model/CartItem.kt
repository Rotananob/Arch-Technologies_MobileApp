package com.archtechnologies.shopsphere.domain.model

data class CartItem(
    val id: String,
    val productId: String,
    val productTitle: String,
    val productTitleKh: String? = null,
    val unitPrice: Double,
    val imageUrl: String?,
    val quantity: Int,
    val maxAvailableStock: Int,
    val sellerId: String,
    val sellerName: String
) {
    val totalPrice: Double get() = unitPrice * quantity
    val isStockSufficient: Boolean get() = quantity <= maxAvailableStock
}

data class CartSummary(
    val items: List<CartItem> = emptyList(),
    val subtotal: Double = 0.0,
    val deliveryFee: Double = 2.00,
    val total: Double = 0.0
) {
    companion object {
        fun calculate(items: List<CartItem>, deliveryFee: Double = 2.00): CartSummary {
            val subtotal = items.sumOf { it.totalPrice }
            val fee = if (items.isEmpty()) 0.0 else deliveryFee
            return CartSummary(
                items = items,
                subtotal = subtotal,
                deliveryFee = fee,
                total = subtotal + fee
            )
        }
    }
}
