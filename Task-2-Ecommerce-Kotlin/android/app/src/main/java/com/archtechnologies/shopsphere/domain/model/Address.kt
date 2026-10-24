package com.archtechnologies.shopsphere.domain.model

data class Address(
    val id: String,
    val recipientName: String,
    val phoneNumber: String,
    val streetAddress: String,
    val city: String,
    val campusBuilding: String? = null,
    val isDefault: Boolean = false
) {
    val formattedAddress: String
        get() = buildString {
            append(streetAddress)
            if (!campusBuilding.isNullOrBlank()) {
                append(", ").append(campusBuilding)
            }
            append(", ").append(city)
        }
}
