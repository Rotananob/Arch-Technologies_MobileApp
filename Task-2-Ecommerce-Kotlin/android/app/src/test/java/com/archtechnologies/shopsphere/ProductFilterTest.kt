package com.archtechnologies.shopsphere

import com.archtechnologies.shopsphere.domain.model.Product
import com.archtechnologies.shopsphere.domain.model.ProductCondition
import com.archtechnologies.shopsphere.domain.model.ProductStatus
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ProductFilterTest {

    private val sampleProducts = listOf(
        Product(
            id = "p1",
            title = "Apple iPad Air M2",
            titleKh = "អាយផេដ អ៊ែរ M2",
            description = "11-inch with Apple M2 chip",
            price = 520.00,
            originalPrice = 599.00,
            categoryId = "cat-tech",
            categoryName = "Electronics",
            sellerId = "s1",
            sellerName = "Campus Tech",
            stockQuantity = 5,
            condition = ProductCondition.BRAND_NEW,
            isFeatured = true,
            status = ProductStatus.ACTIVE
        ),
        Product(
            id = "p2",
            title = "Clean Code Handbook",
            titleKh = "សៀវភៅ Clean Code",
            description = "Agile Software Craftsmanship by Robert C. Martin",
            price = 24.50,
            originalPrice = null,
            categoryId = "cat-books",
            categoryName = "Books & Notes",
            sellerId = "s2",
            sellerName = "Student Union",
            stockQuantity = 12,
            condition = ProductCondition.LIKE_NEW,
            isFeatured = false,
            status = ProductStatus.ACTIVE
        ),
        Product(
            id = "p3",
            title = "Logitech MX Master 3S",
            titleKh = "កណ្ដុរឥតខ្សែ Logitech",
            description = "Wireless performance mouse for coding and design",
            price = 78.00,
            originalPrice = 99.00,
            categoryId = "cat-tech",
            categoryName = "Electronics",
            sellerId = "s1",
            sellerName = "Campus Tech",
            stockQuantity = 0,
            condition = ProductCondition.BRAND_NEW,
            isFeatured = false,
            status = ProductStatus.SOLD_OUT
        )
    )

    @Test
    fun productAvailability_inStockVsSoldOut_correctlyEvaluated() {
        val inStockProduct = sampleProducts[0]
        val soldOutProduct = sampleProducts[2]

        assertTrue(inStockProduct.isAvailable)
        assertFalse(soldOutProduct.isAvailable)
    }

    @Test
    fun discountPercentage_calculatesCorrectDiscount() {
        val discounted = sampleProducts[0]
        // (599 - 520) / 599 * 100 = 13.18% -> 13%
        assertEquals(13, discounted.discountPercent)

        val regularPrice = sampleProducts[1]
        assertNull(regularPrice.discountPercent)
    }

    @Test
    fun bilingualLocalization_returnsCorrectLanguageString() {
        val product = sampleProducts[0]

        // English requested
        assertEquals("Apple iPad Air M2", product.getLocalizedTitle(isKhmer = false))

        // Khmer requested
        assertEquals("អាយផេដ អ៊ែរ M2", product.getLocalizedTitle(isKhmer = true))
    }

    @Test
    fun productFiltering_byCategoryAndKeyword_filtersProperly() {
        // Filter by keyword "Logitech"
        val techMatches = sampleProducts.filter {
            it.title.contains("Logitech", ignoreCase = true) ||
            it.description.contains("Logitech", ignoreCase = true)
        }
        assertEquals(1, techMatches.size)
        assertEquals("p3", techMatches.first().id)

        // Filter by Category "Electronics" and only available items
        val availableElectronics = sampleProducts.filter {
            it.categoryName == "Electronics" && it.isAvailable
        }
        assertEquals(1, availableElectronics.size)
        assertEquals("p1", availableElectronics.first().id)
    }
}
