package com.archtechnologies.shopsphere.data.repository

import com.archtechnologies.shopsphere.data.local.PreferencesManager
import com.archtechnologies.shopsphere.data.remote.api.ShopSphereApiService
import com.archtechnologies.shopsphere.data.remote.dto.ForgotPasswordRequest
import com.archtechnologies.shopsphere.data.remote.dto.LoginRequest
import com.archtechnologies.shopsphere.data.remote.dto.RegisterRequest
import com.archtechnologies.shopsphere.domain.model.User
import com.archtechnologies.shopsphere.domain.model.UserRole
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class AuthRepository(
    private val apiService: ShopSphereApiService,
    private val preferencesManager: PreferencesManager
) {

    val currentToken: Flow<String?> = preferencesManager.authToken

    val currentUser: Flow<User?> = preferencesManager.authToken.map { token ->
        if (token.isNullOrBlank()) null
        else {
            // Reconstruct minimal user from stored preferences
            User(
                id = "current_user",
                email = "",
                fullName = "",
                token = token
            )
        }
    }

    suspend fun login(email: String, pass: String): Result<User> {
        return try {
            val response = apiService.login(LoginRequest(email.trim(), pass))
            if (response.isSuccessful && response.body() != null) {
                val authBody = response.body()!!
                preferencesManager.saveAuthTokens(
                    token = authBody.accessToken,
                    refreshToken = authBody.refreshToken,
                    userId = authBody.user.id,
                    name = authBody.user.fullName,
                    email = authBody.user.email,
                    role = authBody.user.role
                )
                Result.success(
                    User(
                        id = authBody.user.id,
                        email = authBody.user.email,
                        fullName = authBody.user.fullName,
                        phoneNumber = authBody.user.phoneNumber,
                        role = try { UserRole.valueOf(authBody.user.role) } catch (e: Exception) { UserRole.BUYER },
                        token = authBody.accessToken
                    )
                )
            } else {
                Result.failure(Exception(response.errorBody()?.string() ?: "Invalid login credentials"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun register(email: String, pass: String, fullName: String, phone: String?): Result<User> {
        return try {
            val response = apiService.register(RegisterRequest(email.trim(), pass, fullName.trim(), phone?.trim()))
            if (response.isSuccessful && response.body() != null) {
                val authBody = response.body()!!
                preferencesManager.saveAuthTokens(
                    token = authBody.accessToken,
                    refreshToken = authBody.refreshToken,
                    userId = authBody.user.id,
                    name = authBody.user.fullName,
                    email = authBody.user.email,
                    role = authBody.user.role
                )
                Result.success(
                    User(
                        id = authBody.user.id,
                        email = authBody.user.email,
                        fullName = authBody.user.fullName,
                        phoneNumber = authBody.user.phoneNumber,
                        role = try { UserRole.valueOf(authBody.user.role) } catch (e: Exception) { UserRole.BUYER },
                        token = authBody.accessToken
                    )
                )
            } else {
                Result.failure(Exception(response.errorBody()?.string() ?: "Registration failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun forgotPassword(email: String): Result<String> {
        return try {
            val response = apiService.forgotPassword(ForgotPasswordRequest(email.trim()))
            if (response.isSuccessful) {
                Result.success("Instructions sent")
            } else {
                Result.failure(Exception("Failed to request password reset"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun logout() {
        preferencesManager.clearAuth()
    }
}
