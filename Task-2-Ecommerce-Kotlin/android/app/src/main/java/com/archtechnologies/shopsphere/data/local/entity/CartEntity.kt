package com.archtechnologies.shopsphere.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.archtechnologies.shopsphere.domain.model.CartItem

@Entity(tableName = "cart_items")
data class CartEntity(
    @PrimaryKey val id: String,
    val productId: String,
    val productTitle: String,
    val productTitleKh: String?,
    val unitPrice: Double,
    val imageUrl: String?,
    val quantity: Int,
    val maxAvailableStock: Int,
    val sellerId: String,
    val sellerName: String
) {
    fun toDomain(): CartItem = CartItem(
        id = id,
        productId = productId,
        productTitle = productTitle,
        productTitleKh = productTitleKh,
        unitPrice = unitPrice,
        imageUrl = imageUrl,
        quantity = quantity,
        maxAvailableStock = maxAvailableStock,
        sellerId = sellerId,
        sellerName = sellerName
    )

    companion object {
        fun fromDomain(item: CartItem): CartEntity = CartEntity(
            id = item.id,
            productId = item.productId,
            productTitle = item.productTitle,
            productTitleKh = item.productTitleKh,
            unitPrice = item.unitPrice,
            imageUrl = item.imageUrl,
            quantity = item.quantity,
            maxAvailableStock = item.maxAvailableStock,
            sellerId = item.sellerId,
            sellerName = item.sellerName
        )
    }
}
