import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';

class NotificationsRepository {
  final DioClient _client;

  NotificationsRepository(this._client);

  Future<Map<String, dynamic>> getMyNotifications() async {
    final response = await _client.dio.get(ApiConstants.notifications);
    return response.data as Map<String, dynamic>;
  }

  Future<void> markAsRead(String id) async {
    await _client.dio.patch(ApiConstants.markNotificationRead(id));
  }

  Future<void> markAllAsRead() async {
    await _client.dio.patch(ApiConstants.markAllNotificationsRead);
  }

  Future<Map<String, dynamic>> getPreferences() async {
    final response = await _client.dio.get(
      ApiConstants.userNotificationPreferences,
    );
    return response.data as Map<String, dynamic>;
  }

  Future<void> updatePreferences(Map<String, dynamic> data) async {
    await _client.dio.patch(
      ApiConstants.userNotificationPreferences,
      data: data,
    );
  }
}
