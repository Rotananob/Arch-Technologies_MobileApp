import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  final FlutterSecureStorage _secureStorage;
  final SharedPreferences _prefs;

  StorageService(this._secureStorage, this._prefs);

  static const String _keyAccessToken = 'college_alert_access_token';
  static const String _keyRefreshToken = 'college_alert_refresh_token';
  static const String _keyLocale = 'college_alert_locale';
  static const String _keyThemeMode = 'college_alert_theme_mode';
  static const String _keyOnboardingDone = 'college_alert_onboarding_done';

  // Secure Token Management
  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _secureStorage.write(key: _keyAccessToken, value: accessToken);
    await _secureStorage.write(key: _keyRefreshToken, value: refreshToken);
  }

  Future<String?> getAccessToken() async {
    return _secureStorage.read(key: _keyAccessToken);
  }

  Future<String?> getRefreshToken() async {
    return _secureStorage.read(key: _keyRefreshToken);
  }

  Future<void> clearTokens() async {
    await _secureStorage.delete(key: _keyAccessToken);
    await _secureStorage.delete(key: _keyRefreshToken);
  }

  // Preferences (Language, Theme, Onboarding)
  String getLocale() {
    return _prefs.getString(_keyLocale) ?? 'en';
  }

  Future<void> setLocale(String locale) async {
    await _prefs.setString(_keyLocale, locale);
  }

  String getThemeMode() {
    return _prefs.getString(_keyThemeMode) ?? 'system';
  }

  Future<void> setThemeMode(String mode) async {
    await _prefs.setString(_keyThemeMode, mode);
  }

  bool isOnboardingDone() {
    return _prefs.getBool(_keyOnboardingDone) ?? false;
  }

  Future<void> setOnboardingDone(bool done) async {
    await _prefs.setBool(_keyOnboardingDone, done);
  }
}
