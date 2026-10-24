package com.archtechnologies.shopsphere

import android.app.Application
import com.archtechnologies.shopsphere.data.local.PreferencesManager
import com.archtechnologies.shopsphere.data.local.ShopSphereDatabase
import com.archtechnologies.shopsphere.data.remote.NetworkClient
import com.archtechnologies.shopsphere.data.repository.*

class ShopSphereApp : Application() {

    lateinit var preferencesManager: PreferencesManager
        private set

    lateinit var database: ShopSphereDatabase
        private set

    lateinit var authRepository: AuthRepository
        private set

    lateinit var productRepository: ProductRepository
        private set

    lateinit var cartRepository: CartRepository
        private set

    lateinit var orderRepository: OrderRepository
        private set

    lateinit var sellerRepository: SellerRepository
        private set

    override fun onCreate() {
        super.onCreate()

        preferencesManager = PreferencesManager(this)
        database = ShopSphereDatabase.getDatabase(this)

        val apiService = NetworkClient.createApiService(preferencesManager)

        authRepository = AuthRepository(apiService, preferencesManager)
        productRepository = ProductRepository(apiService, database.productDao())
        cartRepository = CartRepository(apiService, database.cartDao())
        orderRepository = OrderRepository(apiService)
        sellerRepository = SellerRepository(apiService)
    }
}
