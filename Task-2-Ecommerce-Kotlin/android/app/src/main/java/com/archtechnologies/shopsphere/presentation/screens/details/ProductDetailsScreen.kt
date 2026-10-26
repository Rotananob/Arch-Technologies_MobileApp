package com.archtechnologies.shopsphere.presentation.screens.details

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.archtechnologies.shopsphere.R
import com.archtechnologies.shopsphere.domain.model.ProductCondition
import com.archtechnologies.shopsphere.presentation.components.ErrorState
import com.archtechnologies.shopsphere.presentation.components.LoadingState
import com.archtechnologies.shopsphere.presentation.components.ShopSphereTopBar
import com.archtechnologies.shopsphere.presentation.theme.AmberWarning
import com.archtechnologies.shopsphere.presentation.theme.EmeraldSuccess
import com.archtechnologies.shopsphere.presentation.theme.OceanBlue
import com.archtechnologies.shopsphere.presentation.theme.RoseError
import java.util.Locale

@Composable
fun ProductDetailsScreen(
    viewModel: ProductDetailsViewModel,
    onNavigateBack: () -> Unit,
    onNavigateToCart: () -> Unit,
    onBuyNow: (String) -> Unit,
    isKhmerLocale: Boolean = false
) {
    val uiState by viewModel.uiState.collectAsState()
    val scrollState = rememberScrollState()

    Scaffold(
        topBar = {
            ShopSphereTopBar(
                title = uiState.product?.getLocalizedTitle(isKhmerLocale) ?: "Product Details",
                canNavigateBack = true,
                onNavigateBack = onNavigateBack,
                onCartClick = onNavigateToCart
            )
        },
        bottomBar = {
            uiState.product?.let { product ->
                Surface(
                    color = MaterialTheme.colorScheme.surface,
                    tonalElevation = 6.dp,
                    shadowElevation = 8.dp,
                    border = androidx.compose.foundation.BorderStroke(
                        width = 0.75.dp,
                        color = MaterialTheme.colorScheme.outline.copy(alpha = 0.35f)
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .navigationBarsPadding()
                            .padding(horizontal = 16.dp, vertical = 12.dp),
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Total Price Column
                        Column(modifier = Modifier.weight(0.9f)) {
                            Text(
                                text = "Total Price",
                                style = MaterialTheme.typography.labelSmall.copy(fontSize = 11.sp),
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            val itemTotalPrice = product.price * uiState.selectedQuantity
                            Text(
                                text = "$${String.format(Locale.US, "%.2f", itemTotalPrice)}",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 17.sp,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            )
                        }

                        // Add to Cart Button
                        OutlinedButton(
                            onClick = { viewModel.addToCart() },
                            enabled = product.isAvailable && !uiState.isAddingToCart,
                            modifier = Modifier
                                .weight(1.1f)
                                .height(44.dp),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 10.dp)
                        ) {
                            if (uiState.isAddedToCartSuccess) {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = null,
                                    tint = EmeraldSuccess,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "Added",
                                    color = EmeraldSuccess,
                                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                                )
                            } else {
                                Icon(
                                    imageVector = Icons.Outlined.AddShoppingCart,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = stringResource(R.string.btn_add_to_cart),
                                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.SemiBold)
                                )
                            }
                        }

                        // Buy Now Button
                        Button(
                            onClick = {
                                viewModel.addToCart {
                                    onBuyNow(product.id)
                                }
                            },
                            enabled = product.isAvailable,
                            modifier = Modifier
                                .weight(1.1f)
                                .height(44.dp),
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                            contentPadding = PaddingValues(horizontal = 10.dp)
                        ) {
                            Text(
                                text = stringResource(R.string.btn_buy_now),
                                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                            )
                        }
                    }
                }
            }
        }
    ) { padding ->
        if (uiState.isLoading) {
            LoadingState(modifier = Modifier.padding(padding))
        } else if (uiState.errorMessage != null) {
            ErrorState(
                errorMessage = uiState.errorMessage!!,
                onRetry = { viewModel.loadProduct() },
                modifier = Modifier.padding(padding)
            )
        } else {
            uiState.product?.let { product ->
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .verticalScroll(scrollState)
                ) {
                    // Hero Product Image
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(290.dp)
                            .background(MaterialTheme.colorScheme.surfaceVariant)
                    ) {
                        AsyncImage(
                            model = ImageRequest.Builder(LocalContext.current)
                                .data(product.images.firstOrNull())
                                .crossfade(true)
                                .build(),
                            contentDescription = product.title,
                            modifier = Modifier.fillMaxSize(),
                            contentScale = ContentScale.Crop
                        )

                        // Condition Badge
                        val conditionText = when (product.condition) {
                            ProductCondition.BRAND_NEW -> "BRAND NEW"
                            ProductCondition.LIKE_NEW -> "LIKE NEW"
                            ProductCondition.GOOD -> "GOOD CONDITION"
                        }
                        Box(
                            modifier = Modifier
                                .padding(16.dp)
                                .align(Alignment.TopStart)
                                .clip(RoundedCornerShape(4.dp))
                                .background(Color(0xD90F172A))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = conditionText,
                                color = Color.White,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.5.sp
                            )
                        }
                    }

                    Column(modifier = Modifier.padding(16.dp)) {
                        // Category & Stock Indicator
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = product.categoryName.uppercase(Locale.getDefault()),
                                style = MaterialTheme.typography.labelSmall.copy(
                                    letterSpacing = 1.sp,
                                    fontWeight = FontWeight.Bold
                                ),
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )

                            if (product.isAvailable) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .size(6.dp)
                                            .clip(CircleShape)
                                            .background(EmeraldSuccess)
                                    )
                                    Spacer(modifier = Modifier.width(5.dp))
                                    Text(
                                        text = "${stringResource(R.string.label_in_stock)} (${product.stockQuantity})",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontWeight = FontWeight.SemiBold,
                                            color = EmeraldSuccess
                                        )
                                    )
                                }
                            } else {
                                Text(
                                    text = stringResource(R.string.label_out_of_stock),
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        fontWeight = FontWeight.Bold,
                                        color = RoseError
                                    )
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        // Product Title
                        Text(
                            text = product.getLocalizedTitle(isKhmerLocale),
                            style = MaterialTheme.typography.titleLarge.copy(
                                fontWeight = FontWeight.Bold,
                                fontSize = 20.sp,
                                letterSpacing = (-0.3).sp,
                                lineHeight = 26.sp
                            )
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        // Price & Discount Line
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = "$${String.format(Locale.US, "%.2f", product.price)}",
                                style = MaterialTheme.typography.headlineMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            )

                            product.originalPrice?.let { orig ->
                                if (orig > product.price) {
                                    Text(
                                        text = "$${String.format(Locale.US, "%.2f", orig)}",
                                        style = MaterialTheme.typography.titleMedium.copy(
                                            textDecoration = TextDecoration.LineThrough,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
                                        )
                                    )
                                    val discount = product.discountPercent ?: 0
                                    if (discount > 0) {
                                        Box(
                                            modifier = Modifier
                                                .clip(RoundedCornerShape(4.dp))
                                                .background(RoseError.copy(alpha = 0.12f))
                                                .padding(horizontal = 6.dp, vertical = 2.dp)
                                        ) {
                                            Text(
                                                text = "Save $discount%",
                                                color = RoseError,
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                    }
                                }
                            }
                        }

                        HorizontalDivider(
                            modifier = Modifier.padding(vertical = 16.dp),
                            color = MaterialTheme.colorScheme.outline.copy(alpha = 0.35f)
                        )

                        // Verified Seller Card
                        Card(
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f)
                            ),
                            shape = RoundedCornerShape(10.dp),
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)
                            ),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(14.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(42.dp)
                                            .clip(CircleShape)
                                            .background(OceanBlue.copy(alpha = 0.15f)),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = Icons.Outlined.Storefront,
                                            contentDescription = null,
                                            tint = OceanBlue,
                                            modifier = Modifier.size(20.dp)
                                        )
                                    }
                                    Column {
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                                        ) {
                                            Text(
                                                text = product.sellerName,
                                                style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                                            )
                                            Icon(
                                                imageVector = Icons.Outlined.VerifiedUser,
                                                contentDescription = "Verified Seller",
                                                tint = OceanBlue,
                                                modifier = Modifier.size(14.dp)
                                            )
                                        }
                                        Text(
                                            text = "Verified Student Seller • Typically replies in < 1h",
                                            style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }

                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(4.dp))
                                        .background(AmberWarning.copy(alpha = 0.12f))
                                        .padding(horizontal = 6.dp, vertical = 3.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Star,
                                        contentDescription = null,
                                        tint = AmberWarning,
                                        modifier = Modifier.size(12.dp)
                                    )
                                    Spacer(modifier = Modifier.width(3.dp))
                                    Text(
                                        text = String.format(Locale.US, "%.1f", product.sellerRating),
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 11.sp
                                        )
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        // Trust & Handover Features Grid
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            TrustCard(
                                icon = Icons.Outlined.LocalShipping,
                                title = "Campus Delivery",
                                desc = "Meetup or drop-off",
                                modifier = Modifier.weight(1f)
                            )
                            TrustCard(
                                icon = Icons.Outlined.Security,
                                title = "Safe Purchase",
                                desc = "Payment held securely",
                                modifier = Modifier.weight(1f)
                            )
                            TrustCard(
                                icon = Icons.Outlined.AssignmentReturn,
                                title = "24h Inspect",
                                desc = "Verify item on receipt",
                                modifier = Modifier.weight(1f)
                            )
                        }

                        HorizontalDivider(
                            modifier = Modifier.padding(vertical = 16.dp),
                            color = MaterialTheme.colorScheme.outline.copy(alpha = 0.35f)
                        )

                        // Quantity Selector
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "Select Quantity",
                                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                                )
                                Text(
                                    text = "Maximum ${product.stockQuantity} units available",
                                    style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier
                                    .border(
                                        1.dp,
                                        MaterialTheme.colorScheme.outline.copy(alpha = 0.5f),
                                        RoundedCornerShape(6.dp)
                                    )
                            ) {
                                IconButton(
                                    onClick = { viewModel.setQuantity(uiState.selectedQuantity - 1) },
                                    enabled = uiState.selectedQuantity > 1,
                                    modifier = Modifier.size(34.dp)
                                ) {
                                    Icon(Icons.Default.Remove, contentDescription = "Decrease", modifier = Modifier.size(14.dp))
                                }
                                Text(
                                    text = "${uiState.selectedQuantity}",
                                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                                    modifier = Modifier.padding(horizontal = 12.dp)
                                )
                                IconButton(
                                    onClick = { viewModel.setQuantity(uiState.selectedQuantity + 1) },
                                    enabled = uiState.selectedQuantity < product.stockQuantity,
                                    modifier = Modifier.size(34.dp)
                                ) {
                                    Icon(Icons.Default.Add, contentDescription = "Increase", modifier = Modifier.size(14.dp))
                                }
                            }
                        }

                        HorizontalDivider(
                            modifier = Modifier.padding(vertical = 16.dp),
                            color = MaterialTheme.colorScheme.outline.copy(alpha = 0.35f)
                        )

                        // Product Description
                        Text(
                            text = "Item Details & Overview",
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = product.getLocalizedDescription(isKhmerLocale),
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontSize = 13.sp,
                                lineHeight = 20.sp
                            ),
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )

                        Spacer(modifier = Modifier.height(28.dp))
                    }
                }
            }
        }
    }
}

@Composable
private fun TrustCard(
    icon: ImageVector,
    title: String,
    desc: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(8.dp),
        border = androidx.compose.foundation.BorderStroke(
            0.75.dp,
            MaterialTheme.colorScheme.outline.copy(alpha = 0.35f)
        )
    ) {
        Column(
            modifier = Modifier.padding(10.dp),
            horizontalAlignment = Alignment.Start
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(18.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.labelSmall.copy(
                    fontWeight = FontWeight.Bold,
                    fontSize = 11.sp
                )
            )
            Text(
                text = desc,
                style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp),
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
