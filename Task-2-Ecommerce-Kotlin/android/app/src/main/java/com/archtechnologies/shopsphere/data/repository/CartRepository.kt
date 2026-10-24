package com.archtechnologies.shopsphere.data.repository

import com.archtechnologies.shopsphere.data.local.dao.CartDao
import com.archtechnologies.shopsphere.data.local.entity.CartEntity
import com.archtechnologies.shopsphere.data.remote.api.ShopSphereApiService
import com.archtechnologies.shopsphere.data.remote.dto.AddToCartRequest
import com.archtechnologies.shopsphere.data.remote.dto.UpdateCartItemRequest
import com.archtechnologies.shopsphere.domain.model.CartItem
import com.archtechnologies.shopsphere.domain.model.CartSummary
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class CartRepository(
    private val apiService: ShopSphereApiService,
    private val cartDao: CartDao
) {

    val localCartItems: Flow<List<CartItem>> = cartDao.getAllCartItems().map { list ->
        list.map { it.toDomain() }
    }

    val cartSummary: Flow<CartSummary> = localCartItems.map { items ->
        CartSummary.calculate(items)
    }

    suspend fun syncCartWithServer(): Result<CartSummary> {
        return try {
            val response = apiService.getCart()
            if (response.isSuccessful && response.body() != null) {
                val cartResp = response.body()!!
                val domainItems = cartResp.items.map { dto ->
                    CartItem(
                        id = dto.id,
                        productId = dto.productId,
                        productTitle = dto.productTitle,
                        productTitleKh = dto.productTitleKh,
                        unitPrice = dto.unitPrice,
                        imageUrl = dto.imageUrl,
                        quantity = dto.quantity,
                        maxAvailableStock = dto.maxAvailableStock,
                        sellerId = dto.sellerId,
                        sellerName = dto.sellerName
                    )
                }
                cartDao.clearCart()
                domainItems.forEach { cartDao.insertOrUpdate(CartEntity.fromDomain(it)) }
                Result.success(CartSummary(domainItems, cartResp.subtotal, cartResp.deliveryFee, cartResp.total))
            } else {
                // Fallback to local
                Result.success(CartSummary.calculate(emptyList()))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun addToCart(productId: String, quantity: Int = 1): Result<Unit> {
        return try {
            val response = apiService.addToCart(AddToCartRequest(productId, quantity))
            if (response.isSuccessful && response.body() != null) {
                syncCartWithServer()
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to add to cart: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateQuantity(cartItemId: String, newQuantity: Int): Result<Unit> {
        return try {
            val response = apiService.updateCartItem(cartItemId, UpdateCartItemRequest(newQuantity))
            if (response.isSuccessful) {
                syncCartWithServer()
                Result.success(Unit)
            } else {
                Result.failure(Exception("Could not update item quantity"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun removeItem(cartItemId: String): Result<Unit> {
        return try {
            val response = apiService.removeCartItem(cartItemId)
            if (response.isSuccessful) {
                cartDao.deleteById(cartItemId)
                Result.success(Unit)
            } else {
                Result.failure(Exception("Could not remove item from cart"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun clearCart() {
        cartDao.clearCart()
    }
}
