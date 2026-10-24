package com.archtechnologies.shopsphere.data.repository

import com.archtechnologies.shopsphere.data.local.dao.ProductDao
import com.archtechnologies.shopsphere.data.remote.api.ShopSphereApiService
import com.archtechnologies.shopsphere.data.remote.dto.CreateListingRequest
import com.archtechnologies.shopsphere.domain.model.Category
import com.archtechnologies.shopsphere.domain.model.Product
import com.archtechnologies.shopsphere.domain.model.ProductCondition
import com.archtechnologies.shopsphere.domain.model.ProductStatus
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class ProductRepository(
    private val apiService: ShopSphereApiService,
    private val productDao: ProductDao
) {

    val cachedProducts: Flow<List<Product>> = productDao.getAllProducts().map { list ->
        list.map { it.toDomain() }
    }

    suspend fun getCategories(): Result<List<Category>> {
        return try {
            val response = apiService.getCategories()
            if (response.isSuccessful && response.body() != null) {
                val categories = response.body()!!.map { dto ->
                    Category(
                        id = dto.id,
                        name = dto.name,
                        nameKh = dto.nameKh,
                        slug = dto.slug,
                        iconName = dto.iconName,
                        productCount = dto.productCount
                    )
                }
                Result.success(categories)
            } else {
                Result.failure(Exception("Failed to load categories"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun fetchProducts(
        search: String? = null,
        categoryId: String? = null,
        sortBy: String? = null,
        isFeatured: Boolean? = null
    ): Result<List<Product>> {
        return try {
            val response = apiService.getProducts(
                search = search,
                categoryId = categoryId,
                sortBy = sortBy,
                isFeatured = isFeatured
            )
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
                Result.failure(Exception("Failed to fetch products"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getProductDetails(id: String): Result<Product> {
        return try {
            val response = apiService.getProductDetails(id)
            if (response.isSuccessful && response.body() != null) {
                val dto = response.body()!!
                Result.success(
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
                )
            } else {
                Result.failure(Exception("Product not found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createProductListing(
        title: String,
        description: String,
        price: Double,
        categoryId: String,
        stock: Int,
        condition: String,
        images: List<String>
    ): Result<Product> {
        return try {
            val request = CreateListingRequest(
                title = title,
                description = description,
                price = price,
                categoryId = categoryId,
                stockQuantity = stock,
                condition = condition,
                imageUrls = images
            )
            val response = apiService.createListing(request)
            if (response.isSuccessful && response.body() != null) {
                val dto = response.body()!!
                Result.success(
                    Product(
                        id = dto.id,
                        title = dto.title,
                        description = dto.description,
                        price = dto.price,
                        categoryId = dto.categoryId,
                        categoryName = dto.categoryName,
                        sellerId = dto.sellerId,
                        sellerName = dto.sellerName,
                        images = dto.images,
                        stockQuantity = dto.stockQuantity
                    )
                )
            } else {
                Result.failure(Exception("Failed to publish listing"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
