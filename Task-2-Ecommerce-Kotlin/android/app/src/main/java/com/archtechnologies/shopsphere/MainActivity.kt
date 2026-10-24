package com.archtechnologies.shopsphere

import android.content.Context
import android.content.res.Configuration
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.archtechnologies.shopsphere.presentation.navigation.NavGraph
import com.archtechnologies.shopsphere.presentation.theme.ShopSphereTheme
import java.util.Locale

class MainActivity : ComponentActivity() {

    override fun attachBaseContext(newBase: Context) {
        super.attachBaseContext(newBase)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val app = application as ShopSphereApp

        setContent {
            val language by app.preferencesManager.selectedLanguage.collectAsState(initial = "en")
            val isDarkTheme by app.preferencesManager.isDarkTheme.collectAsState(initial = false)

            val isKhmer = language == "km"

            ShopSphereTheme(darkTheme = isDarkTheme) {
                Surface(modifier = Modifier.fillMaxSize()) {
                    val navController = rememberNavController()
                    NavGraph(
                        navController = navController,
                        authRepository = app.authRepository,
                        productRepository = app.productRepository,
                        cartRepository = app.cartRepository,
                        orderRepository = app.orderRepository,
                        preferencesManager = app.preferencesManager,
                        sellerRepository = app.sellerRepository,
                        isKhmerLocale = isKhmer
                    )
                }
            }
        }
    }
}
