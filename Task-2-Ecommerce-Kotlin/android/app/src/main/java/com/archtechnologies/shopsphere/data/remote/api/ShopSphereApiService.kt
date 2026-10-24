package com.archtechnologies.shopsphere.data.remote.api

import com.archtechnologies.shopsphere.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

interface ShopSphereApiService {

    // Auth
    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("api/auth/refresh")
    suspend fun refreshToken(@Body request: RefreshTokenRequest): Response<AuthResponse>

    @POST("api/auth/forgot-password")
    suspend fun forgotPassword(@Body request: ForgotPasswordRequest): Response<Map<String, String>>

    // Products & Categories
    @GET("api/categories")
    suspend fun getCategories(): Response<List<CategoryDto>>

    @GET("api/products")
    suspend fun getProducts(
        @Query("search") search: String? = null,
        @Query("categoryId") categoryId: String? = null,
        @Query("sortBy") sortBy: String? = null,
        @Query("isFeatured") isFeatured: Boolean? = null,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<List<ProductDto>>

    @GET("api/products/{id}")
    suspend fun getProductDetails(@Path("id") id: String): Response<ProductDto>

    // Cart
    @GET("api/cart")
    suspend fun getCart(): Response<CartResponse>

    @POST("api/cart/items")
    suspend fun addToCart(@Body request: AddToCartRequest): Response<CartResponse>

    @PATCH("api/cart/items/{id}")
    suspend fun updateCartItem(
        @Path("id") itemId: String,
        @Body request: UpdateCartItemRequest
    ): Response<CartResponse>

    @DELETE("api/cart/items/{id}")
    suspend fun removeCartItem(@Path("id") itemId: String): Response<CartResponse>

    // Orders & Checkout
    @POST("api/orders")
    suspend fun createOrder(@Body request: CreateOrderRequest): Response<OrderResponseDto>

    @GET("api/orders")
    suspend fun getMyOrders(): Response<List<OrderResponseDto>>

    @GET("api/orders/{id}")
    suspend fun getOrderDetails(@Path("id") orderId: String): Response<OrderResponseDto>

    @POST("api/orders/{id}/cancel")
    suspend fun cancelOrder(@Path("id") orderId: String): Response<OrderResponseDto>

    // Payments
    @POST("api/payments/process")
    suspend fun processPayment(@Body request: PaymentProcessRequest): Response<PaymentProcessResponse>

    // Seller Listings
    @GET("api/seller/listings")
    suspend fun getMyListings(): Response<List<ProductDto>>

    @POST("api/seller/listings")
    suspend fun createListing(@Body request: CreateListingRequest): Response<ProductDto>

    @DELETE("api/seller/listings/{id}")
    suspend fun deleteListing(@Path("id") id: String): Response<Map<String, String>>

    @GET("api/seller/orders")
    suspend fun getSellerSalesOrders(): Response<List<OrderResponseDto>>
}
