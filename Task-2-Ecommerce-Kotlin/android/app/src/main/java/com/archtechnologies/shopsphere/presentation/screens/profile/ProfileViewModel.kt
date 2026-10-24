package com.archtechnologies.shopsphere.presentation.screens.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.archtechnologies.shopsphere.data.local.PreferencesManager
import com.archtechnologies.shopsphere.data.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class ProfileViewModel(
    private val authRepository: AuthRepository,
    private val preferencesManager: PreferencesManager
) : ViewModel() {

    val selectedLanguage: StateFlow<String> = preferencesManager.selectedLanguage
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), "en")

    val isDarkTheme: StateFlow<Boolean> = preferencesManager.isDarkTheme
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), false)

    fun setLanguage(lang: String) {
        viewModelScope.launch {
            preferencesManager.setLanguage(lang)
        }
    }

    fun setDarkTheme(dark: Boolean) {
        viewModelScope.launch {
            preferencesManager.setDarkTheme(dark)
        }
    }

    fun logout(onLogoutSuccess: () -> Unit) {
        viewModelScope.launch {
            authRepository.logout()
            onLogoutSuccess()
        }
    }
}
