import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:college_alert/core/widgets/status_badge.dart';
import 'package:college_alert/core/widgets/empty_state_view.dart';
import 'package:college_alert/core/widgets/loading_view.dart';

void main() {
  testWidgets('StatusBadge displays label and custom colors correctly', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: StatusBadge(
            label: 'PRIORITY ALERT',
            backgroundColor: Colors.red,
            textColor: Colors.white,
            icon: Icons.warning,
          ),
        ),
      ),
    );

    expect(find.text('PRIORITY ALERT'), findsOneWidget);
    expect(find.byIcon(Icons.warning), findsOneWidget);
  });

  testWidgets('EmptyStateView renders title, subtitle, and action button', (WidgetTester tester) async {
    bool actionTapped = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: EmptyStateView(
            icon: Icons.event_busy,
            title: 'No events found',
            subtitle: 'Try adjusting your filters',
            actionLabel: 'Reset',
            onAction: () => actionTapped = true,
          ),
        ),
      ),
    );

    expect(find.text('No events found'), findsOneWidget);
    expect(find.text('Try adjusting your filters'), findsOneWidget);
    expect(find.text('Reset'), findsOneWidget);

    await tester.tap(find.text('Reset'));
    expect(actionTapped, isTrue);
  });

  testWidgets('LoadingView renders with optional status message', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: LoadingView(message: 'Connecting to server...'),
        ),
      ),
    );

    expect(find.byType(CircularProgressIndicator), findsOneWidget);
    expect(find.text('Connecting to server...'), findsOneWidget);
  });
}
