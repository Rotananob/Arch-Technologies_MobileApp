package com.archtechnologies.shopsphere.presentation.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.*
import androidx.navigation.navArgument
import com.archtechnologies.shopsphere.R
import com.archtechnologies.shopsphere.data.local.PreferencesManager
import com.archtechnologies.shopsphere.data.repository.*
import com.archtechnologies.shopsphere.presentation.screens.auth.LoginScreen
import com.archtechnologies.shopsphere.presentation.screens.auth.RegisterScreen
import com.archtechnologies.shopsphere.presentation.screens.cart.CartScreen
import com.archtechnologies.shopsphere.presentation.screens.cart.CartViewModel
import com.archtechnologies.shopsphere.presentation.screens.checkout.CheckoutScreen
import com.archtechnologies.shopsphere.presentation.screens.checkout.CheckoutViewModel
import com.archtechnologies.shopsphere.presentation.screens.details.ProductDetailsScreen
import com.archtechnologies.shopsphere.presentation.screens.details.ProductDetailsViewModel
import com.archtechnologies.shopsphere.presentation.screens.discovery.DiscoveryScreen
import com.archtechnologies.shopsphere.presentation.screens.discovery.DiscoveryViewModel
import com.archtechnologies.shopsphere.presentation.screens.home.HomeScreen
import com.archtechnologies.shopsphere.presentation.screens.home.HomeViewModel
import com.archtechnologies.shopsphere.presentation.screens.onboarding.OnboardingScreen
import com.archtechnologies.shopsphere.presentation.screens.orders.OrdersScreen
import com.archtechnologies.shopsphere.presentation.screens.orders.OrdersViewModel
import com.archtechnologies.shopsphere.presentation.screens.payment.PaymentScreen
import com.archtechnologies.shopsphere.presentation.screens.profile.ProfileScreen
import com.archtechnologies.shopsphere.presentation.screens.profile.ProfileViewModel
import com.archtechnologies.shopsphere.presentation.screens.seller.CreateListingScreen
import com.archtechnologies.shopsphere.presentation.screens.seller.SellerScreen
import com.archtechnologies.shopsphere.presentation.screens.seller.SellerViewModel
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.runBlocking

data class BottomNavItem(
    val route: String,
    val titleRes: Int,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
)

@Composable
fun NavGraph(
    navController: NavHostController,
    authRepository: AuthRepository,
    productRepository: ProductRepository,
    cartRepository: CartRepository,
    orderRepository: OrderRepository,
    preferencesManager: PreferencesManager,
    sellerRepository: SellerRepository? = null,
    isKhmerLocale: Boolean = false
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val bottomNavItems = listOf(
        BottomNavItem(Screen.Home.route, R.string.nav_home, Icons.Filled.Home, Icons.Outlined.Home),
        BottomNavItem(Screen.Explore.route, R.string.nav_explore, Icons.Filled.Search, Icons.Outlined.Search),
        BottomNavItem(Screen.Cart.route, R.string.nav_cart, Icons.Filled.ShoppingCart, Icons.Outlined.ShoppingCart),
        BottomNavItem(Screen.Sell.route, R.string.nav_sell, Icons.Filled.Storefront, Icons.Outlined.Storefront),
        BottomNavItem(Screen.Profile.route, R.string.nav_profile, Icons.Filled.Person, Icons.Outlined.Person)
    )

    val showBottomBar = currentRoute in bottomNavItems.map { it.route }

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                Column {
                    HorizontalDivider(
                        color = MaterialTheme.colorScheme.outline.copy(alpha = 0.35f),
                        thickness = 0.75.dp
                    )
                    NavigationBar(
                        containerColor = MaterialTheme.colorScheme.surface,
                        tonalElevation = 0.dp
                    ) {
                        bottomNavItems.forEach { item ->
                            val isSelected = currentRoute == item.route
                            NavigationBarItem(
                                selected = isSelected,
                                onClick = {
                                    navController.navigate(item.route) {
                                        popUpTo(navController.graph.findStartDestination().id) {
                                            saveState = true
                                        }
                                        launchSingleTop = true
                                        restoreState = true
                                    }
                                },
                                icon = {
                                    Icon(
                                        imageVector = if (isSelected) item.selectedIcon else item.unselectedIcon,
                                        contentDescription = null
                                    )
                                },
                                label = {
                                    Text(
                                        text = stringResource(item.titleRes),
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontWeight = if (isSelected) androidx.compose.ui.text.font.FontWeight.Bold else androidx.compose.ui.text.font.FontWeight.Normal
                                        )
                                    )
                                },
                                colors = NavigationBarItemDefaults.colors(
                                    indicatorColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.6f),
                                    selectedIconColor = MaterialTheme.colorScheme.primary,
                                    selectedTextColor = MaterialTheme.colorScheme.primary,
                                    unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                                    unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            )
                        }
                    }
                }
            }
        }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(padding)
        ) {
            composable(Screen.Onboarding.route) {
                OnboardingScreen(
                    onFinishOnboarding = {
                        navController.navigate(Screen.Home.route) {
                            popUpTo(Screen.Onboarding.route) { inclusive = true }
                        }
                    }
                )
            }

            composable(Screen.Login.route) {
                LoginScreen(
                    authRepository = authRepository,
                    onLoginSuccess = {
                        navController.navigate(Screen.Home.route) {
                            popUpTo(Screen.Login.route) { inclusive = true }
                        }
                    },
                    onNavigateToRegister = { navController.navigate(Screen.Register.route) },
                    onNavigateToForgotPassword = {}
                )
            }

            composable(Screen.Register.route) {
                RegisterScreen(
                    authRepository = authRepository,
                    onRegisterSuccess = {
                        navController.navigate(Screen.Home.route) {
                            popUpTo(Screen.Register.route) { inclusive = true }
                        }
                    },
                    onNavigateToLogin = { navController.popBackStack() }
                )
            }

            composable(Screen.Home.route) {
                val homeViewModel = remember { HomeViewModel(productRepository, cartRepository) }
                HomeScreen(
                    viewModel = homeViewModel,
                    onNavigateToSearch = { navController.navigate(Screen.Explore.route) },
                    onNavigateToCategory = { catId -> navController.navigate(Screen.Explore.route) },
                    onNavigateToProduct = { prodId -> navController.navigate(Screen.ProductDetails.createRoute(prodId)) },
                    onNavigateToCart = { navController.navigate(Screen.Cart.route) },
                    isKhmerLocale = isKhmerLocale
                )
            }

            composable(Screen.Explore.route) {
                val discoveryViewModel = remember { DiscoveryViewModel(productRepository) }
                DiscoveryScreen(
                    viewModel = discoveryViewModel,
                    onNavigateToProduct = { prodId -> navController.navigate(Screen.ProductDetails.createRoute(prodId)) },
                    isKhmerLocale = isKhmerLocale
                )
            }

            composable(
                route = Screen.ProductDetails.route,
                arguments = listOf(navArgument("productId") { type = NavType.StringType })
            ) { backStackEntry ->
                val productId = backStackEntry.arguments?.getString("productId") ?: ""
                val detailsViewModel = remember(productId) {
                    ProductDetailsViewModel(productId, productRepository, cartRepository)
                }
                ProductDetailsScreen(
                    viewModel = detailsViewModel,
                    onNavigateBack = { navController.popBackStack() },
                    onNavigateToCart = { navController.navigate(Screen.Cart.route) },
                    onBuyNow = { navController.navigate(Screen.Checkout.route) },
                    isKhmerLocale = isKhmerLocale
                )
            }

            composable(Screen.Cart.route) {
                val cartViewModel = remember { CartViewModel(cartRepository) }
                CartScreen(
                    viewModel = cartViewModel,
                    onNavigateToCheckout = { navController.navigate(Screen.Checkout.route) },
                    onNavigateToExplore = { navController.navigate(Screen.Explore.route) },
                    isKhmerLocale = isKhmerLocale
                )
            }

            composable(Screen.Checkout.route) {
                val checkoutViewModel = remember { CheckoutViewModel(cartRepository, orderRepository) }
                CheckoutScreen(
                    viewModel = checkoutViewModel,
                    onNavigateBack = { navController.popBackStack() },
                    onOrderSuccess = { orderId ->
                        navController.navigate(Screen.Payment.createRoute(orderId)) {
                            popUpTo(Screen.Cart.route) { inclusive = true }
                        }
                    }
                )
            }

            composable(
                route = Screen.Payment.route,
                arguments = listOf(navArgument("orderId") { type = NavType.StringType })
            ) { backStackEntry ->
                val orderId = backStackEntry.arguments?.getString("orderId") ?: ""
                PaymentScreen(
                    orderId = orderId,
                    orderRepository = orderRepository,
                    onPaymentComplete = { navController.navigate(Screen.Orders.route) },
                    onNavigateBack = { navController.popBackStack() }
                )
            }

            composable(Screen.Orders.route) {
                val ordersViewModel = remember { OrdersViewModel(orderRepository) }
                OrdersScreen(
                    viewModel = ordersViewModel,
                    onNavigateToOrderDetails = {}
                )
            }

            composable(Screen.Sell.route) {
                val sellerViewModel = remember { SellerViewModel(productRepository, sellerRepository) }
                SellerScreen(
                    viewModel = sellerViewModel,
                    onNavigateToCreateListing = { navController.navigate(Screen.CreateListing.route) },
                    isKhmerLocale = isKhmerLocale
                )
            }

            composable(Screen.CreateListing.route) {
                val sellerViewModel = remember { SellerViewModel(productRepository, sellerRepository) }
                CreateListingScreen(
                    viewModel = sellerViewModel,
                    onNavigateBack = { navController.popBackStack() }
                )
            }

            composable(Screen.Profile.route) {
                val profileViewModel = remember { ProfileViewModel(authRepository, preferencesManager) }
                ProfileScreen(
                    viewModel = profileViewModel,
                    onNavigateToOrders = { navController.navigate(Screen.Orders.route) },
                    onNavigateToSeller = { navController.navigate(Screen.Sell.route) },
                    onLogout = {
                        navController.navigate(Screen.Login.route) {
                            popUpTo(Screen.Home.route) { inclusive = true }
                        }
                    }
                )
            }
        }
    }
}
