import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:college_alert/core/widgets/event_card.dart';

void main() {
  testWidgets('EventCard renders event title, date, location, and reacts to taps', (WidgetTester tester) async {
    bool tapped = false;
    bool bookmarked = false;

    final sampleEvent = {
      'id': 'test-123',
      'title': 'Senior Capstone Tech Expo',
      'titleKh': 'ពិព័រណ៍បច្ចេកវិទ្យា',
      'location': 'Auditorium C',
      'organizer': 'Engineering Club',
      'startDate': '2026-10-30T09:00:00Z',
      'priorityAlert': false,
      'isRegistrationRequired': true,
      'isRegistered': false,
      'isSaved': false,
      'category': {'name': 'Workshops', 'nameKh': 'សិក្ខាសាលា'},
    };

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: EventCard(
            event: sampleEvent,
            onTap: () => tapped = true,
            onBookmarkToggle: () => bookmarked = true,
          ),
        ),
      ),
    );

    expect(find.text('Senior Capstone Tech Expo'), findsOneWidget);
    expect(find.text('Auditorium C'), findsOneWidget);
    expect(find.text('Workshops'), findsOneWidget);
    expect(find.text('Registration Required'), findsOneWidget);

    await tester.tap(find.text('Senior Capstone Tech Expo'));
    expect(tapped, isTrue);

    await tester.tap(find.byIcon(Icons.bookmark_border));
    expect(bookmarked, isTrue);
  });
}
