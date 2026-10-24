package com.archtechnologies.shopsphere.domain.model

enum class ProductCondition {
    BRAND_NEW,
    LIKE_NEW,
    GOOD
}

enum class ProductStatus {
    ACTIVE,
    SOLD_OUT,
    SUSPENDED
}

data class Product(
    val id: String,
    val title: String,
    val titleKh: String? = null,
    val description: String,
    val descriptionKh: String? = null,
    val price: Double,
    val originalPrice: Double? = null,
    val categoryId: String,
    val categoryName: String,
    val sellerId: String,
    val sellerName: String,
    val sellerRating: Double = 4.8,
    val images: List<String> = emptyList(),
    val stockQuantity: Int,
    val condition: ProductCondition = ProductCondition.BRAND_NEW,
    val isFeatured: Boolean = false,
    val isPromotion: Boolean = false,
    val status: ProductStatus = ProductStatus.ACTIVE,
    val createdAt: String = ""
) {
    val isAvailable: Boolean get() = stockQuantity > 0 && status == ProductStatus.ACTIVE
    val discountPercent: Int?
        get() = if (originalPrice != null && originalPrice > price) {
            (((originalPrice - price) / originalPrice) * 100).toInt()
        } else null

    fun getLocalizedTitle(isKhmer: Boolean): String =
        if (isKhmer && !titleKh.isNullOrBlank()) titleKh else title

    fun getLocalizedDescription(isKhmer: Boolean): String =
        if (isKhmer && !descriptionKh.isNullOrBlank()) descriptionKh else description
}
