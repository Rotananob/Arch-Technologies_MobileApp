class ApiConstants {
  ApiConstants._();

  // For Android Emulator use 10.0.2.2, for Physical Device or Desktop use localhost / LAN IP
  // You can easily toggle or override via settings
  static const String baseUrl = 'http://10.0.2.2:3000';
  static const String fallbackLocalUrl = 'http://localhost:3000';

  // Auth Endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String refresh = '/auth/refresh';
  static const String logout = '/auth/logout';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';

  // Events Endpoints
  static const String events = '/events';
  static const String featuredEvent = '/events/featured';
  static const String upcomingEvents = '/events/upcoming';
  static String eventDetails(String id) => '/events/$id';
  static String registerEvent(String id) => '/events/$id/register';
  static String saveEvent(String id) => '/events/$id/save';

  // Categories
  static const String categories = '/categories';

  // Users & Profile
  static const String userMe = '/users/me';
  static const String userRegistrations = '/users/me/registrations';
  static const String userSavedEvents = '/users/me/saved-events';
  static const String userNotificationPreferences =
      '/users/me/notification-preferences';

  // Notifications
  static const String notifications = '/notifications';
  static String markNotificationRead(String id) => '/notifications/$id/read';
  static const String markAllNotificationsRead = '/notifications/read-all';

  // Health
  static const String health = '/health';
}
