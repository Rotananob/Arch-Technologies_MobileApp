import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:college_alert/l10n/app_localizations.dart';
import '../../../app/providers.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/widgets/event_card.dart';
import '../../../core/widgets/empty_state_view.dart';
import '../../../core/widgets/loading_view.dart';

class EventsScreen extends ConsumerStatefulWidget {
  const EventsScreen({super.key});

  @override
  ConsumerState<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends ConsumerState<EventsScreen> {
  final _searchController = TextEditingController();
  List<Map<String, dynamic>> _events = [];
  List<Map<String, dynamic>> _categories = [];
  String? _selectedCategory;
  bool _isLoading = true;
  String? _error;
  int _currentPage = 1;
  int _totalPages = 1;

  bool get hasMorePages => _currentPage < _totalPages;

  @override
  void initState() {
    super.initState();
    _loadCategories();
    _fetchEvents();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadCategories() async {
    try {
      final cats = await ref.read(eventsRepositoryProvider).getCategories();
      if (mounted) setState(() => _categories = cats);
    } catch (_) {}
  }

  Future<void> _fetchEvents({bool reset = true}) async {
    if (reset) {
      setState(() {
        _isLoading = true;
        _error = null;
        _currentPage = 1;
      });
    }

    try {
      final repo = ref.read(eventsRepositoryProvider);
      final res = await repo.getEvents(
        search:
            _searchController.text.trim().isNotEmpty
                ? _searchController.text.trim()
                : null,
        categoryId: _selectedCategory,
        page: _currentPage,
        limit: 20,
      );

      final dataList =
          (res['data'] as List<dynamic>).cast<Map<String, dynamic>>();
      final meta = res['meta'] as Map<String, dynamic>?;

      if (mounted) {
        setState(() {
          if (reset) {
            _events = dataList;
          } else {
            _events.addAll(dataList);
          }
          _totalPages = meta?['totalPages'] ?? 1;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Failed to load events';
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _toggleBookmark(Map<String, dynamic> event) async {
    final eventId = event['id'] as String;
    final isSaved = event['isSaved'] == true;

    setState(() {
      event['isSaved'] = !isSaved;
    });

    try {
      final repo = ref.read(eventsRepositoryProvider);
      if (isSaved) {
        await repo.unsaveEvent(eventId);
      } else {
        await repo.saveEvent(eventId);
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          event['isSaved'] = isSaved;
        });
      }
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
      appBar: AppBar(title: Text(l10n.browseEvents)),
      body: Column(
        children: [
          // Search & Filter Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            color: isDark ? AppColors.surfaceDark : Colors.white,
            child: Column(
              children: [
                // Search Input
                TextField(
                  controller: _searchController,
                  textInputAction: TextInputAction.search,
                  onSubmitted: (_) => _fetchEvents(reset: true),
                  decoration: InputDecoration(
                    hintText: l10n.searchPlaceholder,
                    prefixIcon: const Icon(Icons.search, size: 20),
                    suffixIcon:
                        _searchController.text.isNotEmpty
                            ? IconButton(
                              icon: const Icon(Icons.clear, size: 18),
                              onPressed: () {
                                _searchController.clear();
                                _fetchEvents(reset: true);
                              },
                            )
                            : null,
                    contentPadding: const EdgeInsets.symmetric(
                      vertical: 10,
                      horizontal: 16,
                    ),
                  ),
                ),
                const SizedBox(height: 10),

                // Category Filter Pills
                SizedBox(
                  height: 36,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _categories.length + 1,
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemBuilder: (context, index) {
                      if (index == 0) {
                        final isSelected = _selectedCategory == null;
                        return ChoiceChip(
                          label: Text(l10n.filterByCategory),
                          selected: isSelected,
                          onSelected: (_) {
                            setState(() => _selectedCategory = null);
                            _fetchEvents(reset: true);
                          },
                        );
                      }
                      final cat = _categories[index - 1];
                      final isSelected = _selectedCategory == cat['id'];
                      final catName =
                          isKhmer && cat['nameKh'] != null
                              ? cat['nameKh']
                              : cat['name'];

                      return ChoiceChip(
                        label: Text(catName),
                        selected: isSelected,
                        onSelected: (_) {
                          setState(() {
                            _selectedCategory =
                                isSelected ? null : cat['id'] as String;
                          });
                          _fetchEvents(reset: true);
                        },
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // Events Content
          Expanded(
            child:
                _isLoading
                    ? const LoadingView(message: 'Loading campus activities...')
                    : _error != null
                    ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.error_outline,
                            size: 44,
                            color: AppColors.error,
                          ),
                          const SizedBox(height: 12),
                          Text(_error!),
                          const SizedBox(height: 12),
                          ElevatedButton(
                            onPressed: () => _fetchEvents(reset: true),
                            child: Text(l10n.retry),
                          ),
                        ],
                      ),
                    )
                    : _events.isEmpty
                    ? EmptyStateView(
                      icon: Icons.event_busy_outlined,
                      title: l10n.noEventsFound,
                      subtitle: l10n.noEventsFoundSubtitle,
                      actionLabel: 'Clear Filters',
                      onAction: () {
                        _searchController.clear();
                        setState(() => _selectedCategory = null);
                        _fetchEvents(reset: true);
                      },
                    )
                    : RefreshIndicator(
                      onRefresh: () => _fetchEvents(reset: true),
                      child: ListView.builder(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 16,
                        ),
                        itemCount: _events.length,
                        itemBuilder: (context, index) {
                          final event = _events[index];
                          return EventCard(
                            event: event,
                            isKhmer: isKhmer,
                            isBookmarked: event['isSaved'] == true,
                            onTap:
                                () => context.push(
                                  '/event-details/${event['id']}',
                                ),
                            onBookmarkToggle: () => _toggleBookmark(event),
                          );
                        },
                      ),
                    ),
          ),
        ],
      ),
    );
  }
}
