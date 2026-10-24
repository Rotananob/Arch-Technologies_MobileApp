import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:college_alert/l10n/app_localizations.dart';
import '../../../app/providers.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/widgets/event_card.dart';
import '../../../core/widgets/empty_state_view.dart';
import '../../../core/widgets/loading_view.dart';

class SavedEventsScreen extends ConsumerStatefulWidget {
  const SavedEventsScreen({super.key});

  @override
  ConsumerState<SavedEventsScreen> createState() => _SavedEventsScreenState();
}

class _SavedEventsScreenState extends ConsumerState<SavedEventsScreen> {
  List<Map<String, dynamic>> _savedEvents = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadSavedEvents();
  }

  Future<void> _loadSavedEvents() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final repo = ref.read(eventsRepositoryProvider);
      final list = await repo.getMySavedEvents();

      if (mounted) {
        setState(() {
          _savedEvents =
              list
                  .map((item) => item['event'] as Map<String, dynamic>)
                  .toList();
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Could not load your bookmarked activities';
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _unsave(Map<String, dynamic> event) async {
    final eventId = event['id'] as String;
    setState(() {
      _savedEvents.removeWhere((e) => e['id'] == eventId);
    });

    try {
      await ref.read(eventsRepositoryProvider).unsaveEvent(eventId);
    } catch (_) {
      _loadSavedEvents();
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final currentLocale = ref.watch(localeProvider).languageCode;
    final isKhmer = currentLocale == 'km';

    return Scaffold(
      backgroundColor:
          isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: AppBar(title: Text(l10n.savedEventsTitle)),
      body:
          _isLoading
              ? const LoadingView(message: 'Loading saved campus events...')
              : _error != null
              ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.bookmark_border,
                      size: 44,
                      color: AppColors.error,
                    ),
                    const SizedBox(height: 12),
                    Text(_error!),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: _loadSavedEvents,
                      child: Text(l10n.retry),
                    ),
                  ],
                ),
              )
              : _savedEvents.isEmpty
              ? EmptyStateView(
                icon: Icons.bookmark_border,
                title: l10n.noSavedEvents,
                subtitle: l10n.noSavedEventsSubtitle,
                actionLabel: l10n.browseEvents,
                onAction: () => context.go('/events'),
              )
              : RefreshIndicator(
                onRefresh: _loadSavedEvents,
                child: ListView.builder(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 16,
                  ),
                  itemCount: _savedEvents.length,
                  itemBuilder: (context, index) {
                    final event = _savedEvents[index];
                    return EventCard(
                      event: event,
                      isKhmer: isKhmer,
                      isBookmarked: true,
                      onTap:
                          () => context.push('/event-details/${event['id']}'),
                      onBookmarkToggle: () => _unsave(event),
                    );
                  },
                ),
              ),
    );
  }
}
