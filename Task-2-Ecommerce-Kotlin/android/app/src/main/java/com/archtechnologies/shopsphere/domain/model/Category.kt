package com.archtechnologies.shopsphere.domain.model

data class Category(
    val id: String,
    val name: String,
    val nameKh: String,
    val slug: String,
    val iconName: String,
    val productCount: Int = 0
) {
    fun getLocalizedName(isKhmer: Boolean): String = if (isKhmer) nameKh else name
}
