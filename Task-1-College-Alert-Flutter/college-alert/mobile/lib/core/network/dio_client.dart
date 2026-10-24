import 'package:dio/dio.dart';
import '../constants/api_constants.dart';
import '../storage/storage_service.dart';

class DioClient {
  final StorageService _storage;
  late final Dio _dio;

  DioClient(this._storage) {
    _dio = Dio(
      BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.getAccessToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException error, handler) async {
          // If token expired (401), try refresh
          if (error.response?.statusCode == 401 &&
              error.requestOptions.path != ApiConstants.login) {
            final refreshToken = await _storage.getRefreshToken();
            if (refreshToken != null) {
              try {
                final refreshResponse = await Dio(
                  BaseOptions(baseUrl: ApiConstants.baseUrl),
                ).post(
                  ApiConstants.refresh,
                  data: {'refreshToken': refreshToken},
                );

                if (refreshResponse.statusCode == 200) {
                  final newAccess = refreshResponse.data['accessToken'];
                  final newRefresh = refreshResponse.data['refreshToken'];
                  await _storage.saveTokens(
                    accessToken: newAccess,
                    refreshToken: newRefresh,
                  );

                  // Retry original request with new token
                  error.requestOptions.headers['Authorization'] =
                      'Bearer $newAccess';
                  final cloneReq = await _dio.fetch(error.requestOptions);
                  return handler.resolve(cloneReq);
                }
              } catch (_) {
                await _storage.clearTokens();
              }
            }
          }
          return handler.next(error);
        },
      ),
    );
  }

  Dio get dio => _dio;

  void updateBaseUrl(String url) {
    _dio.options.baseUrl = url;
  }
}
