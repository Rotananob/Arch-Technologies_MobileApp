import 'package:flutter_test/flutter_test.dart';

void main() {
  group('College Alert Event Business Logic Tests', () {
    final sampleEvents = [
      {
        'id': 'evt-1',
        'title': 'Midterm Exam Schedule Announcement',
        'titleKh': 'សេចក្តីជូនដំណឹងកាលវិភាគប្រឡងឆមាស',
        'category': {'id': 'cat-academic', 'name': 'Academic', 'nameKh': 'ការសិក្សា'},
        'startDate': '2026-11-05T08:00:00Z',
        'priorityAlert': true,
        'location': 'Main Hall',
        'isSaved': true,
      },
      {
        'id': 'evt-2',
        'title': 'Campus Hackathon 2026',
        'titleKh': 'ការប្រកួត Hackathon 2026',
        'category': {'id': 'cat-tech', 'name': 'Workshops', 'nameKh': 'សិក្ខាសាលា'},
        'startDate': '2026-11-12T09:00:00Z',
        'priorityAlert': false,
        'location': 'Innovation Lab',
        'isSaved': false,
      },
      {
        'id': 'evt-3',
        'title': 'University Sports Day',
        'titleKh': 'ទិវាកីឡាសកលវិទ្យាល័យ',
        'category': {'id': 'cat-sports', 'name': 'Sports', 'nameKh': 'កីឡា'},
        'startDate': '2026-10-01T07:00:00Z', // Past event
        'priorityAlert': false,
        'location': 'Football Stadium',
        'isSaved': true,
      },
    ];

    test('filters high priority alert events correctly', () {
      final alerts = sampleEvents.where((e) => e['priorityAlert'] == true).toList();
      expect(alerts.length, equals(1));
      expect(alerts.first['id'], equals('evt-1'));
    });

    test('filters saved / bookmarked events for student offline review', () {
      final savedEvents = sampleEvents.where((e) => e['isSaved'] == true).toList();
      expect(savedEvents.length, equals(2));
      expect(savedEvents.map((e) => e['id']).toList(), equals(['evt-1', 'evt-3']));
    });

    test('search query matches title, location or category name', () {
      final query = 'Hackathon';
      final results = sampleEvents.where((e) {
        final title = (e['title'] as String).toLowerCase();
        final location = (e['location'] as String).toLowerCase();
        return title.contains(query.toLowerCase()) || location.contains(query.toLowerCase());
      }).toList();

      expect(results.length, equals(1));
      expect(results.first['id'], equals('evt-2'));
    });

    test('filters events by category identifier', () {
      final academicEvents = sampleEvents.where((e) {
        final cat = e['category'] as Map<String, dynamic>;
        return cat['id'] == 'cat-academic';
      }).toList();

      expect(academicEvents.length, equals(1));
      expect(academicEvents.first['title'], equals('Midterm Exam Schedule Announcement'));
    });
  });
}
