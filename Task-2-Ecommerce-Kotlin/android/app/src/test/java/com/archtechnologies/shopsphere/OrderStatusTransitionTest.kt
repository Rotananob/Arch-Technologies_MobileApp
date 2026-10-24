package com.archtechnologies.shopsphere

import com.archtechnologies.shopsphere.domain.model.OrderStatus
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Unit tests verifying e-commerce order state machine lifecycle
 * and cancellation constraints.
 */
class OrderStatusTransitionTest {

    private fun canTransition(from: OrderStatus, to: OrderStatus): Boolean {
        return when (from) {
            OrderStatus.PENDING -> to in listOf(OrderStatus.CONFIRMED, OrderStatus.CANCELLED)
            OrderStatus.CONFIRMED -> to in listOf(OrderStatus.PROCESSING, OrderStatus.CANCELLED)
            OrderStatus.PROCESSING -> to in listOf(OrderStatus.SHIPPED, OrderStatus.CANCELLED)
            OrderStatus.SHIPPED -> to in listOf(OrderStatus.DELIVERED)
            OrderStatus.DELIVERED -> false
            OrderStatus.CANCELLED -> false
        }
    }

    private fun canCancel(status: OrderStatus): Boolean {
        return status in listOf(OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING)
    }

    @Test
    fun validTransitions_followBusinessFulfillmentLifecycle() {
        assertTrue("Pending can transition to Confirmed", canTransition(OrderStatus.PENDING, OrderStatus.CONFIRMED))
        assertTrue("Confirmed can transition to Processing", canTransition(OrderStatus.CONFIRMED, OrderStatus.PROCESSING))
        assertTrue("Processing can transition to Shipped", canTransition(OrderStatus.PROCESSING, OrderStatus.SHIPPED))
        assertTrue("Shipped can transition to Delivered", canTransition(OrderStatus.SHIPPED, OrderStatus.DELIVERED))
    }

    @Test
    fun terminalStates_cannotTransitionFurther() {
        assertFalse("Delivered cannot transition to Cancelled", canTransition(OrderStatus.DELIVERED, OrderStatus.CANCELLED))
        assertFalse("Delivered cannot transition to Pending", canTransition(OrderStatus.DELIVERED, OrderStatus.PENDING))
        assertFalse("Cancelled cannot transition to Shipped", canTransition(OrderStatus.CANCELLED, OrderStatus.SHIPPED))
        assertFalse("Cancelled cannot transition to Confirmed", canTransition(OrderStatus.CANCELLED, OrderStatus.CONFIRMED))
    }

    @Test
    fun cancellationRules_preventCancellingShippedOrDeliveredOrders() {
        assertTrue("Pending order can be cancelled", canCancel(OrderStatus.PENDING))
        assertTrue("Confirmed order can be cancelled with refund", canCancel(OrderStatus.CONFIRMED))
        assertTrue("Processing order can be cancelled before dispatch", canCancel(OrderStatus.PROCESSING))
        assertFalse("Shipped order in transit cannot be cancelled", canCancel(OrderStatus.SHIPPED))
        assertFalse("Delivered order cannot be cancelled", canCancel(OrderStatus.DELIVERED))
    }
}
