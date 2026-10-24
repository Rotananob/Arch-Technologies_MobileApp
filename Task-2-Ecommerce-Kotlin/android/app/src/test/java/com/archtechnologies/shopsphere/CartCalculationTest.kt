package com.archtechnologies.shopsphere

import com.archtechnologies.shopsphere.domain.model.CartItem
import com.archtechnologies.shopsphere.domain.model.CartSummary
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class CartCalculationTest {

    @Test
    fun calculateCartSummary_emptyCart_hasZeroSubtotalAndFee() {
        val summary = CartSummary.calculate(emptyList())

        assertEquals(0.0, summary.subtotal, 0.001)
        assertEquals(0.0, summary.deliveryFee, 0.001)
        assertEquals(0.0, summary.total, 0.001)
    }

    @Test
    fun calculateCartSummary_multipleItems_calculatesCorrectTotalWithDeliveryFee() {
        val items = listOf(
            CartItem(
                id = "c1",
                productId = "p1",
                productTitle = "MacBook Pro 14",
                unitPrice = 1299.00,
                imageUrl = null,
                quantity = 1,
                maxAvailableStock = 5,
                sellerId = "s1",
                sellerName = "Campus Tech"
            ),
            CartItem(
                id = "c2",
                productId = "p2",
                productTitle = "Wireless Mouse",
                unitPrice = 25.50,
                imageUrl = null,
                quantity = 2,
                maxAvailableStock = 10,
                sellerId = "s1",
                sellerName = "Campus Tech"
            )
        )

        val summary = CartSummary.calculate(items, deliveryFee = 2.00)

        // Subtotal: 1299.00 + (25.50 * 2) = 1350.00
        assertEquals(1350.00, summary.subtotal, 0.001)
        assertEquals(2.00, summary.deliveryFee, 0.001)
        assertEquals(1352.00, summary.total, 0.001)
    }

    @Test
    fun cartItem_stockValidation_correctlyFlagsSufficientStock() {
        val validItem = CartItem(
            id = "c1",
            productId = "p1",
            productTitle = "Notebook",
            unitPrice = 3.00,
            imageUrl = null,
            quantity = 4,
            maxAvailableStock = 5,
            sellerId = "s1",
            sellerName = "Bookstore"
        )
        assertTrue(validItem.isStockSufficient)

        val overStockItem = validItem.copy(quantity = 6)
        assertFalse(overStockItem.isStockSufficient)
    }
}
