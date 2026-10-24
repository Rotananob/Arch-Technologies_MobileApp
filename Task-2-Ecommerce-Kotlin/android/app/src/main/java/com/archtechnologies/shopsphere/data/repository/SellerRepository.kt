package com.archtechnologies.shopsphere.data.repository

import com.archtechnologies.shopsphere.data.remote.api.ShopSphereApiService
import com.archtechnologies.shopsphere.domain.model.*

class SellerRepository(
    private val apiService: ShopSphereApiService
) {

    suspend fun getMyListings(): Result<List<Product>> {
        return try {
            val response = apiService.getMyListings()
            if (response.isSuccessful && response.body() != null) {
                val products = response.body()!!.map { dto ->
                    Product(
                        id = dto.id,
                        title = dto.title,
                        titleKh = dto.titleKh,
                        description = dto.description,
                        descriptionKh = dto.descriptionKh,
                        price = dto.price,
                        originalPrice = dto.originalPrice,
                        categoryId = dto.categoryId,
                        categoryName = dto.categoryName,
                        sellerId = dto.sellerId,
                        sellerName = dto.sellerName,
                        sellerRating = dto.sellerRating,
                        images = dto.images,
                        stockQuantity = dto.stockQuantity,
                        condition = try { ProductCondition.valueOf(dto.condition) } catch (e: Exception) { ProductCondition.BRAND_NEW },
                        isFeatured = dto.isFeatured,
                        isPromotion = dto.isPromotion,
                        status = try { ProductStatus.valueOf(dto.status) } catch (e: Exception) { ProductStatus.ACTIVE },
                        createdAt = dto.createdAt
                    )
                }
                Result.success(products)
            } else {
                Result.failure(Exception("Failed to fetch seller listings"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteListing(productId: String): Result<Unit> {
        return try {
            val response = apiService.deleteListing(productId)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to delete product listing"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getSellerSalesOrders(): Result<List<Order>> {
        return try {
            val response = apiService.getSellerSalesOrders()
            if (response.isSuccessful && response.body() != null) {
                val orders = response.body()!!.map { dto ->
                    Order(
                        id = dto.id,
                        orderNumber = dto.orderNumber,
                        userId = dto.userId,
                        items = dto.items.map { item ->
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
                        subtotal = dto.subtotal,
                        deliveryFee = dto.deliveryFee,
                        totalAmount = dto.totalAmount,
                        shippingAddress = Address(
                            id = "addr_${dto.id}",
                            recipientName = dto.recipientName,
                            phoneNumber = dto.phoneNumber,
                            streetAddress = dto.streetAddress,
                            city = dto.city
                        ),
                        status = try { OrderStatus.valueOf(dto.status) } catch (e: Exception) { OrderStatus.PENDING },
                        paymentMethod = try { PaymentMethod.valueOf(dto.paymentMethod) } catch (e: Exception) { PaymentMethod.MOCK_PAYMENT },
                        paymentStatus = try { PaymentStatus.valueOf(dto.paymentStatus) } catch (e: Exception) { PaymentStatus.PENDING },
                        createdAt = dto.createdAt
                    )
                }
                Result.success(orders)
            } else {
                Result.failure(Exception("Failed to load seller sales orders"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
