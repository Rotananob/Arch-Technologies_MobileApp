import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';
import '../../../core/storage/storage_service.dart';

class AuthRepository {
  final DioClient _client;
  final StorageService _storage;

  AuthRepository(this._client, this._storage);

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _client.dio.post(
      ApiConstants.login,
      data: {'email': email.trim(), 'password': password},
    );
    final data = response.data as Map<String, dynamic>;
    final accessToken = data['accessToken'] as String;
    final refreshToken = data['refreshToken'] as String;

    await _storage.saveTokens(
      accessToken: accessToken,
      refreshToken: refreshToken,
    );
    return data['user'] as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String fullName,
    String? studentId,
    String? department,
    String? phoneNumber,
  }) async {
    final response = await _client.dio.post(
      ApiConstants.register,
      data: {
        'email': email.trim(),
        'password': password,
        'fullName': fullName.trim(),
        if (studentId != null) 'studentId': studentId.trim(),
        if (department != null) 'department': department.trim(),
        if (phoneNumber != null) 'phoneNumber': phoneNumber.trim(),
      },
    );
    final data = response.data as Map<String, dynamic>;
    final accessToken = data['accessToken'] as String;
    final refreshToken = data['refreshToken'] as String;

    await _storage.saveTokens(
      accessToken: accessToken,
      refreshToken: refreshToken,
    );
    return data['user'] as Map<String, dynamic>;
  }

  Future<void> logout() async {
    try {
      await _client.dio.post(ApiConstants.logout);
    } catch (_) {}
    await _storage.clearTokens();
  }

  Future<Map<String, dynamic>?> getCurrentUser() async {
    final token = await _storage.getAccessToken();
    if (token == null) return null;

    try {
      final response = await _client.dio.get(ApiConstants.userMe);
      return response.data as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  Future<void> forgotPassword(String email) async {
    await _client.dio.post(
      ApiConstants.forgotPassword,
      data: {'email': email.trim()},
    );
  }
}
