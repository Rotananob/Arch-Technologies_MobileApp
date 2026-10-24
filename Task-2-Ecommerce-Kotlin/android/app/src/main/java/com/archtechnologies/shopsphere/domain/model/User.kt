package com.archtechnologies.shopsphere.domain.model

enum class UserRole {
    BUYER,
    SELLER,
    ADMIN
}

data class User(
    val id: String,
    val email: String,
    val fullName: String,
    val phoneNumber: String? = null,
    val role: UserRole = UserRole.BUYER,
    val avatarUrl: String? = null,
    val token: String? = null
)
