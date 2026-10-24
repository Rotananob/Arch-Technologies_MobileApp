package com.archtechnologies.shopsphere.data.repository

import com.archtechnologies.shopsphere.data.remote.api.ShopSphereApiService
import com.archtechnologies.shopsphere.data.remote.dto.CreateOrderRequest
import com.archtechnologies.shopsphere.data.remote.dto.PaymentProcessRequest
import com.archtechnologies.shopsphere.domain.model.*

class OrderRepository(
    private val apiService: ShopSphereApiService
) {

    suspend fun createOrder(
        recipientName: String,
        phone: String,
        street: String,
        city: String,
        building: String?,
        paymentMethod: PaymentMethod
    ): Result<Order> {
        return try {
            val request = CreateOrderRequest(
                recipientName = recipientName,
                phoneNumber = phone,
                streetAddress = street,
                city = city,
                campusBuilding = building,
                paymentMethod = paymentMethod.name
            )
            val response = apiService.createOrder(request)
            if (response.isSuccessful && response.body() != null) {
                val dto = response.body()!!
                Result.success(dto.toDomain())
            } else {
                Result.failure(Exception("Failed to place order: ${response.errorBody()?.string()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getMyOrders(): Result<List<Order>> {
        return try {
            val response = apiService.getMyOrders()
            if (response.isSuccessful && response.body() != null) {
                val list = response.body()!!.map { it.toDomain() }
                Result.success(list)
            } else {
                Result.failure(Exception("Failed to retrieve order history"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getOrderDetails(orderId: String): Result<Order> {
        return try {
            val response = apiService.getOrderDetails(orderId)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!.toDomain())
            } else {
                Result.failure(Exception("Order not found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun cancelOrder(orderId: String): Result<Order> {
        return try {
            val response = apiService.cancelOrder(orderId)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!.toDomain())
            } else {
                Result.failure(Exception("Unable to cancel order"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun processPayment(orderId: String, outcome: String): Result<String> {
        return try {
            val response = apiService.processPayment(PaymentProcessRequest(orderId, outcome))
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!.message)
            } else {
                Result.failure(Exception("Payment verification failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    private fun com.archtechnologies.shopsphere.data.remote.dto.OrderResponseDto.toDomain(): Order {
        return Order(
            id = id,
            orderNumber = orderNumber,
            userId = userId,
            items = items.map { item ->
                OrderItem(
                    id = item.id,
                    productId = item.productId,
                    productTitle = item.productTitle,
                    imageUrl = item.imageUrl,
                    unitPrice = item.unitPrice,
                    quantity = item.quantity,
                    sellerId = item.sellerId
                )
            },
            subtotal = subtotal,
            deliveryFee = deliveryFee,
            totalAmount = totalAmount,
            shippingAddress = Address(
                id = "addr_$id",
                recipientName = recipientName,
                phoneNumber = phoneNumber,
                streetAddress = streetAddress,
                city = city,
                campusBuilding = campusBuilding
            ),
            status = try { OrderStatus.valueOf(status) } catch (e: Exception) { OrderStatus.PENDING },
            paymentMethod = try { PaymentMethod.valueOf(paymentMethod) } catch (e: Exception) { PaymentMethod.MOCK_PAYMENT },
            paymentStatus = try { PaymentStatus.valueOf(paymentStatus) } catch (e: Exception) { PaymentStatus.PENDING },
            createdAt = createdAt
        )
    }
}
