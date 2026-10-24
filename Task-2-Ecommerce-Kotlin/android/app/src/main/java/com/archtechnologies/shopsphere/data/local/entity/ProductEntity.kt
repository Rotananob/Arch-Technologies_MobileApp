package com.archtechnologies.shopsphere.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.archtechnologies.shopsphere.domain.model.Product
import com.archtechnologies.shopsphere.domain.model.ProductCondition
import com.archtechnologies.shopsphere.domain.model.ProductStatus

@Entity(tableName = "cached_products")
data class ProductEntity(
    @PrimaryKey val id: String,
    val title: String,
    val titleKh: String?,
    val description: String,
    val descriptionKh: String?,
    val price: Double,
    val originalPrice: Double?,
    val categoryId: String,
    val categoryName: String,
    val sellerId: String,
    val sellerName: String,
    val sellerRating: Double,
    val imageUrlsJson: String,
    val stockQuantity: Int,
    val condition: String,
    val isFeatured: Boolean,
    val isPromotion: Boolean,
    val status: String,
    val createdAt: String
) {
    fun toDomain(): Product = Product(
        id = id,
        title = title,
        titleKh = titleKh,
        description = description,
        descriptionKh = descriptionKh,
        price = price,
        originalPrice = originalPrice,
        categoryId = categoryId,
        categoryName = categoryName,
        sellerId = sellerId,
        sellerName = sellerName,
        sellerRating = sellerRating,
        images = if (imageUrlsJson.isNotBlank()) imageUrlsJson.split(";") else emptyList(),
        stockQuantity = stockQuantity,
        condition = try { ProductCondition.valueOf(condition) } catch (e: Exception) { ProductCondition.BRAND_NEW },
        isFeatured = isFeatured,
        isPromotion = isPromotion,
        status = try { ProductStatus.valueOf(status) } catch (e: Exception) { ProductStatus.ACTIVE },
        createdAt = createdAt
    )
}
