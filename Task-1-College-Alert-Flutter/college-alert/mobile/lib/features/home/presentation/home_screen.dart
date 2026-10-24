import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:college_alert/l10n/app_localizations.dart';
import 'package:intl/intl.dart';
import '../../../app/providers.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/widgets/event_card.dart';
import '../../../core/widgets/empty_state_view.dart';
import '../../../core/widgets/loading_view.dart';
import '../../../core/widgets/status_badge.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  bool _isLoading = true;
  String? _error;
  Map<String, dynamic>? _featuredEvent;
  List<Map<String, dynamic>> _upcomingEvents = [];
  List<Map<String, dynamic>> _categories = [];
  String? _selectedCategoryId;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final repo = ref.read(eventsRepositoryProvider);
      final featuredFuture = repo.getFeaturedEvent();
      final upcomingFuture = repo.getUpcomingEvents(limit: 6);
      final categoriesFuture = repo.getCategories();

      final results = await Future.wait([
        featuredFuture,
        upcomingFuture,
        categoriesFuture,
      ]);

      if (mounted) {
        setState(() {
          _featuredEvent = results[0] as Map<String, dynamic>?;
          _upcomingEvents = results[1] as List<Map<String, dynamic>>;
          _categories = results[2] as List<Map<String, dynamic>>;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
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
      // Revert if error
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
    final authState = ref.watch(authProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final currentLocale = ref.watch(localeProvider).languageCode;
    final isKhmer = currentLocale == 'km';
    final unreadCount = ref.watch(unreadNotificationsCountProvider);

    final userName = authState.user?['fullName'] as String? ?? l10n.guestUser;

    return Scaffold(
      backgroundColor:
          isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: AppBar(
        titleSpacing: 20,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              l10n.welcomeBack,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color:
                    isDark
                        ? AppColors.textSecondaryDark
                        : AppColors.textSecondaryLight,
              ),
            ),
            Text(
              userName,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color:
                    isDark
                        ? AppColors.textPrimaryDark
                        : AppColors.textPrimaryLight,
              ),
            ),
          ],
        ),
        actions: [
          // 1-Tap Language Switcher (EN <-> KM)
          InkWell(
            onTap: () {
              final next = isKhmer ? const Locale('en') : const Locale('km');
              ref.read(localeProvider.notifier).setLocale(next);
            },
            borderRadius: BorderRadius.circular(16),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDark ? const Color(0xFF334155) : const Color(0xFFCBD5E1),
                ),
              ),
              child: Text(
                isKhmer ? '🇰🇭 ខ្មែរ' : '🇬🇧 EN',
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
              ),
            ),
          ),
          const SizedBox(width: 4),

          // Notification Bell with Badge
          Stack(
            clipBehavior: Clip.none,
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined, size: 24),
                onPressed: () => context.push('/notifications'),
              ),
              if (unreadCount > 0)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: AppColors.error,
                      shape: BoxShape.circle,
                    ),
                    constraints: const BoxConstraints(
                      minWidth: 16,
                      minHeight: 16,
                    ),
                    child: Text(
                      '$unreadCount',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 8),
        ],
      ),
      body:
          _isLoading
              ? const LoadingView(message: 'Updating campus events feed...')
              : _error != null
              ? Center(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.cloud_off_rounded,
                        size: 48,
                        color: AppColors.error,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        _error!,
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: _loadData,
                        icon: const Icon(Icons.refresh, size: 18),
                        label: Text(l10n.retry),
                      ),
                    ],
                  ),
                ),
              )
              : RefreshIndicator(
                onRefresh: _loadData,
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 820),
                    child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 12,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Urgent Alert Notification Banner
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppColors.errorBg,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: AppColors.error.withOpacity(0.3),
                          ),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.warning_amber_rounded,
                              color: AppColors.error,
                              size: 24,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    isKhmer
                                        ? 'ដំណឹងបន្ទាន់៖ ការប្រឡងឆមាស'
                                        : 'Priority Alert: Midterm Exams Scheduled',
                                    style: const TextStyle(
                                      color: AppColors.error,
                                      fontWeight: FontWeight.w800,
                                      fontSize: 13,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    isKhmer
                                        ? 'កាលវិភាគប្រឡងបានប្រកាសជាផ្លូវការ។ សូមត្រួតពិនិត្យបន្ទប់ប្រឡង។'
                                        : 'Midterm timetable published. Please verify your hall tickets.',
                                    style: TextStyle(
                                      color: Colors.red.shade900,
                                      fontSize: 12,
                                      height: 1.3,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Featured Hero Event Section
                      if (_featuredEvent != null) ...[
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              l10n.featuredEvent,
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color:
                                    isDark
                                        ? AppColors.textPrimaryDark
                                        : AppColors.textPrimaryLight,
                              ),
                            ),
                            const StatusBadge(
                              label: 'FEATURED',
                              backgroundColor: Color(0xFFEFF6FF),
                              textColor: AppColors.secondary,
                              icon: Icons.star_rounded,
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        _buildHeroCard(_featuredEvent!, isDark, isKhmer),
                        const SizedBox(height: 28),
                      ],

                      // Category Chips Row
                      Text(
                        l10n.categories,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color:
                              isDark
                                  ? AppColors.textPrimaryDark
                                  : AppColors.textPrimaryLight,
                        ),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        height: 38,
                        child: ListView.separated(
                          scrollDirection: Axis.horizontal,
                          itemCount: _categories.length + 1,
                          separatorBuilder: (_, __) => const SizedBox(width: 8),
                          itemBuilder: (context, index) {
                            if (index == 0) {
                              final isSelected = _selectedCategoryId == null;
                              return ChoiceChip(
                                label: Text(l10n.filterByCategory),
                                selected: isSelected,
                                onSelected: (_) {
                                  setState(() => _selectedCategoryId = null);
                                },
                              );
                            }
                            final cat = _categories[index - 1];
                            final isSelected = _selectedCategoryId == cat['id'];
                            final catName =
                                isKhmer && cat['nameKh'] != null
                                    ? cat['nameKh']
                                    : cat['name'];

                            return ChoiceChip(
                              label: Text(catName),
                              selected: isSelected,
                              onSelected: (_) {
                                setState(() {
                                  _selectedCategoryId =
                                      isSelected ? null : cat['id'] as String;
                                });
                              },
                            );
                          },
                        ),
                      ),
                      const SizedBox(height: 28),

                      // Upcoming Activities Section
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            l10n.upcomingEvents,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color:
                                  isDark
                                      ? AppColors.textPrimaryDark
                                      : AppColors.textPrimaryLight,
                            ),
                          ),
                          TextButton(
                            onPressed: () => context.push('/events'),
                            child: Text(
                              l10n.seeAll,
                              style: const TextStyle(
                                fontWeight: FontWeight.w700,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),

                      // Upcoming Events List
                      Builder(builder: (context) {
                        final displayedEvents = _selectedCategoryId == null
                            ? _upcomingEvents
                            : _upcomingEvents
                                .where(
                                  (e) => e['categoryId'] == _selectedCategoryId,
                                )
                                .toList();

                        if (displayedEvents.isEmpty) {
                          return EmptyStateView(
                            icon: Icons.event_busy_outlined,
                            title: l10n.noEventsFound,
                            subtitle: l10n.noEventsFoundSubtitle,
                          );
                        }

                        return ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: displayedEvents.length,
                          itemBuilder: (context, index) {
                            final event = displayedEvents[index];
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
                        );
                      }),
                    ],
                  ),
                ),
              ),
            ),
    );
  }

  Widget _buildHeroCard(Map<String, dynamic> event, bool isDark, bool isKhmer) {
    final title =
        isKhmer && event['titleKh'] != null ? event['titleKh'] : event['title'];
    final location = event['location'] ?? 'Campus';
    final imageUrl = event['imageUrl'] as String?;

    DateTime? startDate;
    if (event['startDate'] != null) {
      try {
        startDate = DateTime.parse(event['startDate']);
      } catch (_) {}
    }
    final dateStr =
        startDate != null
            ? DateFormat('EEEE, MMM dd • hh:mm a').format(startDate)
            : '';

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isDark ? AppColors.borderDark : AppColors.borderLight,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.2 : 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => context.push('/event-details/${event['id']}'),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (imageUrl != null)
                Image.network(
                  imageUrl,
                  height: 150,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder:
                      (_, __, ___) => Container(
                        height: 120,
                        color: AppColors.primary,
                        child: const Center(
                          child: Icon(
                            Icons.school,
                            size: 48,
                            color: Colors.white54,
                          ),
                        ),
                      ),
                ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      dateStr,
                      style: const TextStyle(
                        color: AppColors.secondary,
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w800,
                        color:
                            isDark
                                ? AppColors.textPrimaryDark
                                : AppColors.textPrimaryLight,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(
                          Icons.location_on_outlined,
                          size: 14,
                          color:
                              isDark
                                  ? AppColors.textMutedDark
                                  : AppColors.textMutedLight,
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            location,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 13,
                              color:
                                  isDark
                                      ? AppColors.textSecondaryDark
                                      : AppColors.textSecondaryLight,
                            ),
                          ),
                        ),
                        ElevatedButton(
                          onPressed:
                              () =>
                                  context.push('/event-details/${event['id']}'),
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 14,
                              vertical: 8,
                            ),
                            minimumSize: Size.zero,
                          ),
                          child: const Text(
                            'View Details',
                            style: TextStyle(fontSize: 12),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
