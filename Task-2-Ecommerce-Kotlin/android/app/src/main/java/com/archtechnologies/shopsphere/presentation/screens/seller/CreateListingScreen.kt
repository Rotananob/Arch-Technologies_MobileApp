package com.archtechnologies.shopsphere.presentation.screens.seller

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.archtechnologies.shopsphere.R
import com.archtechnologies.shopsphere.presentation.components.ShopSphereTopBar

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateListingScreen(
    viewModel: SellerViewModel,
    onNavigateBack: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val scrollState = rememberScrollState()

    var title by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var priceText by remember { mutableStateOf("") }
    var stockText by remember { mutableStateOf("1") }
    var imageUrl by remember { mutableStateOf("") }
    var selectedCategoryId by remember { mutableStateOf(uiState.categories.firstOrNull()?.id ?: "") }
    var selectedCondition by remember { mutableStateOf("BRAND_NEW") }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(uiState.categories) {
        if (selectedCategoryId.isBlank() && uiState.categories.isNotEmpty()) {
            selectedCategoryId = uiState.categories.first().id
        }
    }

    Scaffold(
        topBar = {
            ShopSphereTopBar(
                title = stringResource(R.string.btn_create_listing),
                canNavigateBack = true,
                onNavigateBack = onNavigateBack
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(scrollState)
                .padding(16.dp)
        ) {
            errorMessage?.let { error ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.error.copy(alpha = 0.1f)),
                    modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
                ) {
                    Text(
                        text = error,
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.padding(12.dp)
                    )
                }
            }

            OutlinedTextField(
                value = title,
                onValueChange = { title = it },
                label = { Text("Product Title *") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = description,
                onValueChange = { description = it },
                label = { Text("Product Description *") },
                minLines = 3,
                maxLines = 5,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedTextField(
                    value = priceText,
                    onValueChange = { priceText = it },
                    label = { Text("Price (USD) *") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    singleLine = true,
                    modifier = Modifier.weight(1f)
                )

                OutlinedTextField(
                    value = stockText,
                    onValueChange = { stockText = it },
                    label = { Text("Available Stock *") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    singleLine = true,
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = imageUrl,
                onValueChange = { imageUrl = it },
                label = { Text("Product Image URL") },
                placeholder = { Text("https://...") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(28.dp))

            Button(
                onClick = {
                    val price = priceText.toDoubleOrNull()
                    val stock = stockText.toIntOrNull()
                    if (title.isBlank() || description.isBlank() || price == null || stock == null) {
                        errorMessage = "Please complete all required fields with valid numbers"
                        return@Button
                    }
                    if (selectedCategoryId.isBlank()) {
                        selectedCategoryId = uiState.categories.firstOrNull()?.id ?: "cat_electronics"
                    }

                    viewModel.createListing(
                        title = title,
                        description = description,
                        price = price,
                        categoryId = selectedCategoryId,
                        stock = stock,
                        condition = selectedCondition,
                        imageUrl = imageUrl,
                        onSuccess = onNavigateBack
                    )
                },
                enabled = !uiState.isCreatingListing,
                modifier = Modifier.fillMaxWidth().height(48.dp),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
            ) {
                if (uiState.isCreatingListing) {
                    CircularProgressIndicator(strokeWidth = 2.dp, modifier = Modifier.size(20.dp), color = MaterialTheme.colorScheme.onPrimary)
                } else {
                    Text(stringResource(R.string.btn_save_listing), style = MaterialTheme.typography.labelLarge)
                }
            }
        }
    }
}
