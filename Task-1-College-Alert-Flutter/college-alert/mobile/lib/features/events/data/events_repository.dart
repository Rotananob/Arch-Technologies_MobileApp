import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';

class EventsRepository {
  final DioClient _client;

  EventsRepository(this._client);

  Future<Map<String, dynamic>> getEvents({
    String? search,
    String? categoryId,
    String? date,
    String? month,
    int page = 1,
    int limit = 20,
  }) async {
    final response = await _client.dio.get(
      ApiConstants.events,
      queryParameters: {
        if (search != null && search.isNotEmpty) 'search': search,
        if (categoryId != null && categoryId.isNotEmpty)
          'categoryId': categoryId,
        if (date != null) 'date': date,
        if (month != null) 'month': month,
        'page': page,
        'limit': limit,
      },
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>?> getFeaturedEvent() async {
    final response = await _client.dio.get(ApiConstants.featuredEvent);
    return response.data as Map<String, dynamic>?;
  }

  Future<List<Map<String, dynamic>>> getUpcomingEvents({int limit = 5}) async {
    final response = await _client.dio.get(
      ApiConstants.upcomingEvents,
      queryParameters: {'limit': limit},
    );
    final data = response.data['data'] as List<dynamic>;
    return data.cast<Map<String, dynamic>>();
  }

  Future<Map<String, dynamic>> getEventDetails(String id) async {
    final response = await _client.dio.get(ApiConstants.eventDetails(id));
    return response.data as Map<String, dynamic>;
  }

  Future<List<Map<String, dynamic>>> getCategories() async {
    final response = await _client.dio.get(ApiConstants.categories);
    final list = response.data as List<dynamic>;
    return list.cast<Map<String, dynamic>>();
  }

  Future<void> registerForEvent(String id) async {
    await _client.dio.post(ApiConstants.registerEvent(id));
  }

  Future<void> cancelRegistration(String id) async {
    await _client.dio.delete(ApiConstants.registerEvent(id));
  }

  Future<void> saveEvent(String id) async {
    await _client.dio.post(ApiConstants.saveEvent(id));
  }

  Future<void> unsaveEvent(String id) async {
    await _client.dio.delete(ApiConstants.saveEvent(id));
  }

  Future<List<Map<String, dynamic>>> getMyRegistrations() async {
    final response = await _client.dio.get(ApiConstants.userRegistrations);
    final list = response.data as List<dynamic>;
    return list.cast<Map<String, dynamic>>();
  }

  Future<List<Map<String, dynamic>>> getMySavedEvents() async {
    final response = await _client.dio.get(ApiConstants.userSavedEvents);
    final list = response.data as List<dynamic>;
    return list.cast<Map<String, dynamic>>();
  }
}
