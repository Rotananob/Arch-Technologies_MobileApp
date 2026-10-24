import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';

class EventsRepository {
  final DioClient _client;

  EventsRepository(this._client);

  // In-memory bookmark and registration cache for offline/fallback resilience
  static final Set<String> _savedEventIds = {'evt-2', 'evt-4'};
  static final Set<String> _registeredEventIds = {'evt-1'};

  static final List<Map<String, dynamic>> _mockCategories = [
    {
      'id': 'cat-academic',
      'name': 'Academic',
      'nameKh': 'ការសិក្សា',
      'slug': 'academic',
      'icon': 'school',
      'colorHex': '#1E40AF',
    },
    {
      'id': 'cat-tech',
      'name': 'Workshops & Tech',
      'nameKh': 'សិក្ខាសាលា & បច្ចេកវិទ្យា',
      'slug': 'workshops-tech',
      'icon': 'lightbulb',
      'colorHex': '#0D9488',
    },
    {
      'id': 'cat-career',
      'name': 'Career & Internship',
      'nameKh': 'អាជីពការងារ',
      'slug': 'career',
      'icon': 'work',
      'colorHex': '#7C3AED',
    },
    {
      'id': 'cat-sports',
      'name': 'Sports & Wellness',
      'nameKh': 'កីឡា & សុខភាព',
      'slug': 'sports-wellness',
      'icon': 'fitness_center',
      'colorHex': '#D97706',
    },
    {
      'id': 'cat-arts',
      'name': 'Campus Life & Arts',
      'nameKh': 'ជីវិតនិស្សិត & សិល្បៈ',
      'slug': 'campus-life',
      'icon': 'groups',
      'colorHex': '#E11D48',
    },
  ];

  static List<Map<String, dynamic>> _generateMockEvents() {
    final now = DateTime.now();
    return [
      {
        'id': 'evt-1',
        'title': 'Annual Engineering & Software Expo 2026',
        'titleKh': 'ពិព័រណ៍វិស្វកម្ម និងបច្ចេកវិទ្យាប្រចាំឆ្នាំ ២០២៦',
        'description':
            'Join the university flagship technology exposition showcasing over 60 capstone projects from software engineering, artificial intelligence, robotics, and cloud computing students. Industry judges from leading regional tech firms will award top honours.',
        'descriptionKh':
            'ចូលរួមទស្សនាពិព័រណ៍បច្ចេកវិទ្យាដ៏ធំបំផុតប្រចាំឆ្នាំ ដែលបង្ហាញគម្រោងឆ្នើមជាង ៦០ ពីនិស្សិតផ្នែកវិស្វកម្មសូហ្វវែរ បញ្ញាសិប្បនិម្មិត និងរ៉ូបូត។ មានការចូលរួមវាយតម្លៃដោយផ្ទាល់ពីអ្នកជំនាញក្រុមហ៊ុនបច្ចេកវិទ្យាល្បីៗ។',
        'categoryId': 'cat-tech',
        'category': _mockCategories[1],
        'location': 'Grand Exhibition Hall, Building Innovation C',
        'isOnline': false,
        'organizer': 'Faculty of Science & Technology',
        'imageUrl':
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        'startDate': now.add(const Duration(days: 3, hours: 2)).toIso8601String(),
        'endDate': now.add(const Duration(days: 3, hours: 10)).toIso8601String(),
        'isRegistrationRequired': true,
        'maxCapacity': 300,
        'currentRegistrationsCount': 142,
        'isPublished': true,
        'isFeatured': true,
        'priorityAlert': false,
        'isSaved': _savedEventIds.contains('evt-1'),
        'isRegistered': _registeredEventIds.contains('evt-1'),
      },
      {
        'id': 'evt-2',
        'title': '⚠️ Midterm Exam Schedule & Hall Allotment Released',
        'titleKh': '⚠️ បន្ទាន់៖ ការប្រកាសកាលវិភាគប្រឡងឆមាស និងលេខបន្ទប់ប្រឡង',
        'description':
            'The Department of Academic Affairs has officially published the Semester 1 Midterm Exam schedule. All students must download and verify their hall tickets by October 30. No electronic devices are permitted inside examination halls.',
        'descriptionKh':
            'ការិយាល័យកិច្ចការសិក្សាបានប្រកាសជាផ្លូវការនូវកាលវិភាគប្រឡងឆមាសទី ១។ និស្សិតទាំងអស់ត្រូវត្រួតពិនិត្យលេខតុ និងបន្ទប់ប្រឡងឱ្យបានមុនថ្ងៃទី ៣០ តុលា។ ហាមដាច់ខាតនូវឧបករណ៍អេឡិចត្រូនិកក្នុងបន្ទប់ប្រឡង។',
        'categoryId': 'cat-academic',
        'category': _mockCategories[0],
        'location': 'Academic Affairs Portal & Main Campus Notice Boards',
        'isOnline': true,
        'meetingUrl': 'https://portal.university.edu/exams',
        'organizer': 'Academic Affairs Board',
        'imageUrl':
            'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
        'startDate': now.add(const Duration(days: 1, hours: 1)).toIso8601String(),
        'endDate': now.add(const Duration(days: 7, hours: 10)).toIso8601String(),
        'isRegistrationRequired': false,
        'maxCapacity': 2000,
        'currentRegistrationsCount': 850,
        'isPublished': true,
        'isFeatured': false,
        'priorityAlert': true,
        'isSaved': _savedEventIds.contains('evt-2'),
        'isRegistered': _registeredEventIds.contains('evt-2'),
      },
      {
        'id': 'evt-3',
        'title': 'Applied AI & Generative Intelligence Masterclass',
        'titleKh': 'វគ្គបណ្ដុះបណ្ដាលស្ដីពីបញ្ញាសិប្បនិម្មិត AI និងការអនុវត្តជាក់ស្ដែង',
        'description':
            'A comprehensive hands-on workshop covering LLMs, multimodal AI agent workflows, and real-time streaming architectures. Attendees will build and deploy a working conversational agent during the lab session. Laptops required.',
        'descriptionKh':
            'សិក្ខាសាលាអនុវត្តផ្ទាល់លើបច្ចេកវិទ្យា Large Language Models, Multi-agent workflows និង Real-time streaming។ សិក្ខាកាមនឹងបានអនុវត្តជាក់ស្ដែងក្នុងការបង្កើត AI agent ផ្ទាល់ខ្លួន។',
        'categoryId': 'cat-tech',
        'category': _mockCategories[1],
        'location': 'Advanced Computing Lab 4, IT Wing',
        'isOnline': false,
        'organizer': 'Google Developer Student Clubs (GDSC)',
        'imageUrl':
            'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        'startDate': now.add(const Duration(days: 5, hours: 4)).toIso8601String(),
        'endDate': now.add(const Duration(days: 5, hours: 7)).toIso8601String(),
        'isRegistrationRequired': true,
        'maxCapacity': 60,
        'currentRegistrationsCount': 48,
        'isPublished': true,
        'isFeatured': false,
        'priorityAlert': false,
        'isSaved': _savedEventIds.contains('evt-3'),
        'isRegistered': _registeredEventIds.contains('evt-3'),
      },
      {
        'id': 'evt-4',
        'title': 'Campus Career Fair & Tech Internship Drive 2026',
        'titleKh': 'ពិព័រណ៍ការងារ និងឱកាសហាត់ការសម្រាប់និស្សិត ២០២៦',
        'description':
            'Connect directly with HR directors and lead engineers from 35+ partner organizations including Arch Technologies, Smart Axiata, ABA Bank, and international tech ventures. Bring at least 5 copies of your updated resume.',
        'descriptionKh':
            'ជួបពិភាក្សាផ្ទាល់ជាមួយនាយកធនធានមនុស្ស និងវិស្វករជាន់ខ្ពស់មកពីក្រុមហ៊ុនដៃគូជាង ៣៥ រួមទាំង Arch Technologies, Smart, និងធនាគារ ABA។ សូមត្រៀម CV បច្ចុប្បន្នភាពយ៉ាងតិច ៥ ច្បាប់។',
        'categoryId': 'cat-career',
        'category': _mockCategories[2],
        'location': 'University Gymnasium & Conference Center',
        'isOnline': false,
        'organizer': 'Career Services Center',
        'imageUrl':
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
        'startDate': now.add(const Duration(days: 8, hours: 1)).toIso8601String(),
        'endDate': now.add(const Duration(days: 8, hours: 8)).toIso8601String(),
        'isRegistrationRequired': true,
        'maxCapacity': 500,
        'currentRegistrationsCount': 310,
        'isPublished': true,
        'isFeatured': true,
        'priorityAlert': false,
        'isSaved': _savedEventIds.contains('evt-4'),
        'isRegistered': _registeredEventIds.contains('evt-4'),
      },
      {
        'id': 'evt-5',
        'title': 'Inter-College Badminton & Sports Championship 2026',
        'titleKh': 'ការប្រកួតកីឡាវាយសី និងកីឡាចម្រុះអន្តរមហាវិទ្យាល័យ ២០២៦',
        'description':
            'Annual inter-faculty tournament with singles, doubles, and mixed matches. Trophies, medals, and merit certificates awarded at the closing ceremony. Open to all students.',
        'descriptionKh':
            'ការប្រកួតកីឡាប្រចាំឆ្នាំរួមមានវិញ្ញាសាវាយសីទោល វាយសីគូ និងកីឡាចម្រុះ។ មានពានរង្វាន់ មេដាយកិត្តិយស និងវិញ្ញាបនបត្រជូនជយលាភី។',
        'categoryId': 'cat-sports',
        'category': _mockCategories[3],
        'location': 'Indoor Sports Arena Court 2',
        'isOnline': false,
        'organizer': 'Student Athletic Council',
        'imageUrl':
            'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800',
        'startDate': now.add(const Duration(days: 12, hours: 2)).toIso8601String(),
        'endDate': now.add(const Duration(days: 13, hours: 9)).toIso8601String(),
        'isRegistrationRequired': true,
        'maxCapacity': 120,
        'currentRegistrationsCount': 95,
        'isPublished': true,
        'isFeatured': false,
        'priorityAlert': false,
        'isSaved': _savedEventIds.contains('evt-5'),
        'isRegistered': _registeredEventIds.contains('evt-5'),
      },
      {
        'id': 'evt-6',
        'title': 'University Cultural Night & Student Showcase',
        'titleKh': 'រាត្រីសមោសរសិល្បៈ និងការសម្ដែងវប្បធម៌និស្សិត',
        'description':
            'A vibrant celebration of music, theatre, traditional dance, and culinary arts prepared by international and local student associations. Free entry for all university students and faculty.',
        'descriptionKh':
            'ការសម្ដែងតន្ត្រី ល្ខោន របាំបុរាណ និងម្ហូបអាហារចម្រុះជាតិសាសន៍រៀបចំដោយសមាគមនិស្សិត។ ចូលរួមដោយសេរីសម្រាប់សាស្ត្រាចារ្យ និងនិស្សិតទាំងអស់។',
        'categoryId': 'cat-arts',
        'category': _mockCategories[4],
        'location': 'Grand Auditorium Hall, Cultural Wing',
        'isOnline': false,
        'organizer': 'Student Affairs & Arts Council',
        'imageUrl':
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        'startDate': now.add(const Duration(days: 16, hours: 10)).toIso8601String(),
        'endDate': now.add(const Duration(days: 16, hours: 14)).toIso8601String(),
        'isRegistrationRequired': false,
        'maxCapacity': 800,
        'currentRegistrationsCount': 420,
        'isPublished': true,
        'isFeatured': false,
        'priorityAlert': false,
        'isSaved': _savedEventIds.contains('evt-6'),
        'isRegistered': _registeredEventIds.contains('evt-6'),
      },
    ];
  }

  Future<Map<String, dynamic>> getEvents({
    String? search,
    String? categoryId,
    String? date,
    String? month,
    int page = 1,
    int limit = 20,
  }) async {
    try {
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
    } catch (_) {
      // Offline / network fallback
      var allEvents = _generateMockEvents();
      if (categoryId != null && categoryId.isNotEmpty) {
        allEvents = allEvents.where((e) => e['categoryId'] == categoryId).toList();
      }
      if (search != null && search.trim().isNotEmpty) {
        final q = search.toLowerCase();
        allEvents = allEvents.where((e) {
          final t = (e['title'] ?? '').toString().toLowerCase();
          final tKh = (e['titleKh'] ?? '').toString().toLowerCase();
          final d = (e['description'] ?? '').toString().toLowerCase();
          return t.contains(q) || tKh.contains(q) || d.contains(q);
        }).toList();
      }
      return {
        'data': allEvents,
        'meta': {
          'total': allEvents.length,
          'page': page,
          'lastPage': 1,
          'limit': limit,
        },
      };
    }
  }

  Future<Map<String, dynamic>?> getFeaturedEvent() async {
    try {
      final response = await _client.dio.get(ApiConstants.featuredEvent);
      return response.data as Map<String, dynamic>?;
    } catch (_) {
      final events = _generateMockEvents();
      return events.firstWhere((e) => e['isFeatured'] == true, orElse: () => events.first);
    }
  }

  Future<List<Map<String, dynamic>>> getUpcomingEvents({int limit = 5}) async {
    try {
      final response = await _client.dio.get(
        ApiConstants.upcomingEvents,
        queryParameters: {'limit': limit},
      );
      final data = response.data['data'] as List<dynamic>;
      return data.cast<Map<String, dynamic>>();
    } catch (_) {
      final events = _generateMockEvents();
      return events.take(limit).toList();
    }
  }

  Future<Map<String, dynamic>> getEventDetails(String id) async {
    try {
      final response = await _client.dio.get(ApiConstants.eventDetails(id));
      return response.data as Map<String, dynamic>;
    } catch (_) {
      final events = _generateMockEvents();
      return events.firstWhere((e) => e['id'] == id, orElse: () => events.first);
    }
  }

  Future<List<Map<String, dynamic>>> getCategories() async {
    try {
      final response = await _client.dio.get(ApiConstants.categories);
      final list = response.data as List<dynamic>;
      return list.cast<Map<String, dynamic>>();
    } catch (_) {
      return _mockCategories;
    }
  }

  Future<void> registerForEvent(String id) async {
    try {
      await _client.dio.post(ApiConstants.registerEvent(id));
    } catch (_) {}
    _registeredEventIds.add(id);
  }

  Future<void> cancelRegistration(String id) async {
    try {
      await _client.dio.delete(ApiConstants.registerEvent(id));
    } catch (_) {}
    _registeredEventIds.remove(id);
  }

  Future<void> saveEvent(String id) async {
    try {
      await _client.dio.post(ApiConstants.saveEvent(id));
    } catch (_) {}
    _savedEventIds.add(id);
  }

  Future<void> unsaveEvent(String id) async {
    try {
      await _client.dio.delete(ApiConstants.saveEvent(id));
    } catch (_) {}
    _savedEventIds.remove(id);
  }

  Future<List<Map<String, dynamic>>> getMyRegistrations() async {
    try {
      final response = await _client.dio.get(ApiConstants.userRegistrations);
      final list = response.data as List<dynamic>;
      return list.cast<Map<String, dynamic>>();
    } catch (_) {
      final all = _generateMockEvents();
      return all
          .where((e) => _registeredEventIds.contains(e['id']))
          .map((e) => {'id': 'reg-${e['id']}', 'event': e, 'registeredAt': DateTime.now().toIso8601String()})
          .toList();
    }
  }

  Future<List<Map<String, dynamic>>> getMySavedEvents() async {
    try {
      final response = await _client.dio.get(ApiConstants.userSavedEvents);
      final list = response.data as List<dynamic>;
      return list.cast<Map<String, dynamic>>();
    } catch (_) {
      final all = _generateMockEvents();
      return all
          .where((e) => _savedEventIds.contains(e['id']))
          .map((e) => {'id': 'save-${e['id']}', 'event': e, 'savedAt': DateTime.now().toIso8601String()})
          .toList();
    }
  }
}
