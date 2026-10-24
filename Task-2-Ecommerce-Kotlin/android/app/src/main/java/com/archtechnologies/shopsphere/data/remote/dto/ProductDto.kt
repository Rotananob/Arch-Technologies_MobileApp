package com.archtechnologies.shopsphere.data.remote.dto

import kotlinx.serialization.Serializable

@Serializable
data class CategoryDto(
    val id: String,
    val name: String,
    val nameKh: String,
    val slug: String,
    val iconName: String,
    val productCount: Int = 0
)

@Serializable
data class ProductDto(
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
    val condition: String = "BRAND_NEW",
    val isFeatured: Boolean = false,
    val isPromotion: Boolean = false,
    val status: String = "ACTIVE",
    val createdAt: String = ""
)

@Serializable
data class CreateListingRequest(
    val title: String,
    val titleKh: String? = null,
    val description: String,
    val descriptionKh: String? = null,
    val price: Double,
    val categoryId: String,
    val stockQuantity: Int,
    val condition: String = "BRAND_NEW",
    val imageUrls: List<String> = emptyList()
)
