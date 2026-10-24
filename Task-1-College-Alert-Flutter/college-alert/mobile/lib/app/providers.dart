import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/storage/storage_service.dart';
import '../core/network/dio_client.dart';
import '../features/authentication/data/auth_repository.dart';
import '../features/events/data/events_repository.dart';
import '../features/notifications/data/notifications_repository.dart';

// Storage Provider
final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError('SharedPreferences must be initialized in main');
});

final storageServiceProvider = Provider<StorageService>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  const secureStorage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );
  return StorageService(secureStorage, prefs);
});

// Network Provider
final dioClientProvider = Provider<DioClient>((ref) {
  final storage = ref.watch(storageServiceProvider);
  return DioClient(storage);
});

// Repositories
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(
    ref.watch(dioClientProvider),
    ref.watch(storageServiceProvider),
  );
});

final eventsRepositoryProvider = Provider<EventsRepository>((ref) {
  return EventsRepository(ref.watch(dioClientProvider));
});

final notificationsRepositoryProvider = Provider<NotificationsRepository>((
  ref,
) {
  return NotificationsRepository(ref.watch(dioClientProvider));
});

// Locale State Notifier
class LocaleNotifier extends StateNotifier<Locale> {
  final StorageService _storage;

  LocaleNotifier(this._storage) : super(Locale(_storage.getLocale()));

  Future<void> setLocale(String code) async {
    await _storage.setLocale(code);
    state = Locale(code);
  }
}

final localeProvider = StateNotifierProvider<LocaleNotifier, Locale>((ref) {
  final storage = ref.watch(storageServiceProvider);
  return LocaleNotifier(storage);
});

// Theme Mode State Notifier
class ThemeModeNotifier extends StateNotifier<ThemeMode> {
  final StorageService _storage;

  ThemeModeNotifier(this._storage) : super(_parseMode(_storage.getThemeMode()));

  static ThemeMode _parseMode(String mode) {
    switch (mode) {
      case 'light':
        return ThemeMode.light;
      case 'dark':
        return ThemeMode.dark;
      default:
        return ThemeMode.system;
    }
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    String modeStr = 'system';
    if (mode == ThemeMode.light) modeStr = 'light';
    if (mode == ThemeMode.dark) modeStr = 'dark';

    await _storage.setThemeMode(modeStr);
    state = mode;
  }
}

final themeModeProvider = StateNotifierProvider<ThemeModeNotifier, ThemeMode>((
  ref,
) {
  final storage = ref.watch(storageServiceProvider);
  return ThemeModeNotifier(storage);
});

// Auth State Notifier
class AuthState {
  final bool isLoading;
  final bool isAuthenticated;
  final Map<String, dynamic>? user;
  final String? errorMessage;

  const AuthState({
    this.isLoading = false,
    this.isAuthenticated = false,
    this.user,
    this.errorMessage,
  });

  AuthState copyWith({
    bool? isLoading,
    bool? isAuthenticated,
    Map<String, dynamic>? user,
    String? errorMessage,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      user: user ?? this.user,
      errorMessage: errorMessage,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repo;

  AuthNotifier(this._repo) : super(const AuthState(isLoading: true)) {
    checkAuth();
  }

  Future<void> checkAuth() async {
    try {
      final user = await _repo.getCurrentUser();
      if (user != null) {
        state = AuthState(isAuthenticated: true, user: user, isLoading: false);
      } else {
        state = const AuthState(isAuthenticated: false, isLoading: false);
      }
    } catch (_) {
      state = const AuthState(isAuthenticated: false, isLoading: false);
    }
  }

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final user = await _repo.login(email, password);
      state = AuthState(isAuthenticated: true, user: user, isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage:
            'Invalid credentials. Please verify your email & password.',
      );
      return false;
    }
  }

  Future<bool> register({
    required String email,
    required String password,
    required String fullName,
    String? studentId,
    String? department,
    String? phoneNumber,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final user = await _repo.register(
        email: email,
        password: password,
        fullName: fullName,
        studentId: studentId,
        department: department,
        phoneNumber: phoneNumber,
      );
      state = AuthState(isAuthenticated: true, user: user, isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Registration failed. Email may already be in use.',
      );
      return false;
    }
  }

  Future<void> logout() async {
    await _repo.logout();
    state = const AuthState(
      isAuthenticated: false,
      user: null,
      isLoading: false,
    );
  }

  void updateUserProfile(Map<String, dynamic> updatedFields) {
    if (state.user != null) {
      state = state.copyWith(user: {...state.user!, ...updatedFields});
    }
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final repo = ref.watch(authRepositoryProvider);
  return AuthNotifier(repo);
});

// Notifications count badge provider
final unreadNotificationsCountProvider = StateProvider<int>((ref) => 1);
