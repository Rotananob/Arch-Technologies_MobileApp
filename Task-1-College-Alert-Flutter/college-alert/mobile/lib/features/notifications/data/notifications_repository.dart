import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';

class NotificationsRepository {
  final DioClient _client;

  NotificationsRepository(this._client);

  static final List<Map<String, dynamic>> _mockNotifications = [
    {
      'id': 'notif-1',
      'title': '⚠️ Midterm Exam Hall Allotment Released',
      'titleKh': '⚠️ ការប្រកាសកាលវិភាគ និងបន្ទប់ប្រឡងឆមាស',
      'message':
          'Your examination seat for CS301 (Mobile Application Architecture) has been assigned to Hall C-204.',
      'messageKh':
          'លេខតុប្រឡងមុខវិជ្ជា CS301 របស់អ្នកត្រូវបានចាត់ចែងនៅបន្ទប់ប្រឡង Hall C-204។ សូមត្រួតពិនិត្យ hall ticket ឱ្យបានមុនថ្ងៃកំណត់។',
      'body':
          'Your examination seat for CS301 (Mobile Application Architecture) has been assigned to Hall C-204.',
      'type': 'ALERT',
      'isRead': false,
      'createdAt': DateTime.now().subtract(const Duration(minutes: 45)).toIso8601String(),
    },
    {
      'id': 'notif-2',
      'title': 'Registration Confirmed: Engineering Expo 2026',
      'titleKh': 'ការចុះឈ្មោះជោគជ័យ៖ ពិព័រណ៍វិស្វកម្ម ២០២៦',
      'message':
          'You are confirmed to attend the Annual Engineering & Software Expo. Your check-in QR code is ready.',
      'messageKh':
          'អ្នកបានចុះឈ្មោះចូលរួមពិព័រណ៍បច្ចេកវិទ្យាប្រចាំឆ្នាំដោយជោគជ័យ។ កូដ QR សម្រាប់ Check-in ត្រូវបានរៀបចំរួចរាល់។',
      'body':
          'You are confirmed to attend the Annual Engineering & Software Expo. Your check-in QR code is ready.',
      'type': 'REGISTRATION',
      'isRead': false,
      'createdAt': DateTime.now().subtract(const Duration(hours: 3)).toIso8601String(),
    },
    {
      'id': 'notif-3',
      'title': 'Upcoming Event Tomorrow: AI Masterclass',
      'titleKh': 'ការដាស់តឿន៖ សិក្ខាសាលា AI នឹងចាប់ផ្ដើមថ្ងៃស្អែក',
      'message':
          'Hands-on Masterclass on Multimodal Agents begins tomorrow at 2:00 PM in Lab 4.',
      'messageKh':
          'វគ្គបណ្ដុះបណ្ដាលអនុវត្តជាក់ស្ដែងស្ដីពី Multimodal AI Agents នឹងចាប់ផ្ដើមនៅថ្ងៃស្អែកវេលាម៉ោង ២:០០ រសៀល ក្នុងបន្ទប់ Lab 4។',
      'body':
          'Hands-on Masterclass on Multimodal Agents begins tomorrow at 2:00 PM in Lab 4.',
      'type': 'REMINDER',
      'isRead': true,
      'createdAt': DateTime.now().subtract(const Duration(days: 1)).toIso8601String(),
    },
    {
      'id': 'notif-4',
      'title': 'New Internship Drive: Arch Technologies',
      'titleKh': 'ឱកាសហាត់ការថ្មីពី Arch Technologies',
      'message':
          'Arch Technologies is currently interviewing 3rd and 4th year mobile development students.',
      'messageKh':
          'ក្រុមហ៊ុន Arch Technologies កំពុងបើកទទួលពាក្យហាត់ការសម្រាប់និស្សិតឆ្នាំទី ៣ និងទី ៤ ផ្នែក Mobile App Development។',
      'body':
          'Arch Technologies is currently interviewing 3rd and 4th year mobile development students.',
      'type': 'EVENT',
      'isRead': true,
      'createdAt': DateTime.now().subtract(const Duration(days: 2)).toIso8601String(),
    },
  ];

  Future<Map<String, dynamic>> getMyNotifications() async {
    try {
      final response = await _client.dio.get(ApiConstants.notifications);
      return response.data as Map<String, dynamic>;
    } catch (_) {
      final unread = _mockNotifications.where((n) => n['isRead'] == false).length;
      return {
        'notifications': _mockNotifications,
        'unreadCount': unread,
      };
    }
  }

  Future<void> markAsRead(String id) async {
    try {
      await _client.dio.patch(ApiConstants.markNotificationRead(id));
    } catch (_) {}
    for (final n in _mockNotifications) {
      if (n['id'] == id) {
        n['isRead'] = true;
      }
    }
  }

  Future<void> markAllAsRead() async {
    try {
      await _client.dio.patch(ApiConstants.markAllNotificationsRead);
    } catch (_) {}
    for (final n in _mockNotifications) {
      n['isRead'] = true;
    }
  }

  Future<Map<String, dynamic>> getPreferences() async {
    try {
      final response = await _client.dio.get(
        ApiConstants.userNotificationPreferences,
      );
      return response.data as Map<String, dynamic>;
    } catch (_) {
      return {
        'eventAnnouncements': true,
        'upcomingReminders': true,
        'registrationUpdates': true,
        'generalAlerts': true,
      };
    }
  }

  Future<void> updatePreferences(Map<String, dynamic> data) async {
    try {
      await _client.dio.patch(
        ApiConstants.userNotificationPreferences,
        data: data,
      );
    } catch (_) {}
  }
}
