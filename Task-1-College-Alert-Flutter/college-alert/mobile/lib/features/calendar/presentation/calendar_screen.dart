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

class CalendarScreen extends ConsumerStatefulWidget {
  const CalendarScreen({super.key});

  @override
  ConsumerState<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends ConsumerState<CalendarScreen> {
  DateTime _currentMonth = DateTime.now();
  DateTime _selectedDate = DateTime.now();
  List<Map<String, dynamic>> _monthEvents = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchMonthEvents();
  }

  Future<void> _fetchMonthEvents() async {
    setState(() => _isLoading = true);
    final monthStr = DateFormat('yyyy-MM').format(_currentMonth);

    try {
      final repo = ref.read(eventsRepositoryProvider);
      final res = await repo.getEvents(month: monthStr, limit: 100);
      final list = (res['data'] as List<dynamic>).cast<Map<String, dynamic>>();

      if (mounted) {
        setState(() {
          _monthEvents = list;
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  List<Map<String, dynamic>> _getEventsForDate(DateTime date) {
    return _monthEvents.where((ev) {
      if (ev['startDate'] == null) return false;
      try {
        final d = DateTime.parse(ev['startDate']);
        return d.year == date.year &&
            d.month == date.month &&
            d.day == date.day;
      } catch (_) {
        return false;
      }
    }).toList();
  }

  Set<int> _getDaysWithEvents() {
    final days = <int>{};
    for (final ev in _monthEvents) {
      if (ev['startDate'] != null) {
        try {
          final d = DateTime.parse(ev['startDate']);
          if (d.year == _currentMonth.year && d.month == _currentMonth.month) {
            days.add(d.day);
          }
        } catch (_) {}
      }
    }
    return days;
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final currentLocale = ref.watch(localeProvider).languageCode;
    final isKhmer = currentLocale == 'km';

    final selectedDateEvents = _getEventsForDate(_selectedDate);
    final daysWithEvents = _getDaysWithEvents();

    return Scaffold(
      backgroundColor:
          isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: AppBar(
        title: Text(l10n.calendarTitle),
        actions: [
          IconButton(
            icon: const Icon(Icons.today_outlined),
            tooltip: 'Today',
            onPressed: () {
              setState(() {
                _currentMonth = DateTime.now();
                _selectedDate = DateTime.now();
              });
              _fetchMonthEvents();
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Month Selector Header
          Container(
            color: isDark ? AppColors.surfaceDark : Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.chevron_left),
                  onPressed: () {
                    setState(() {
                      _currentMonth = DateTime(
                        _currentMonth.year,
                        _currentMonth.month - 1,
                      );
                    });
                    _fetchMonthEvents();
                  },
                ),
                Text(
                  DateFormat('MMMM yyyy').format(_currentMonth),
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color:
                        isDark
                            ? AppColors.textPrimaryDark
                            : AppColors.textPrimaryLight,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.chevron_right),
                  onPressed: () {
                    setState(() {
                      _currentMonth = DateTime(
                        _currentMonth.year,
                        _currentMonth.month + 1,
                      );
                    });
                    _fetchMonthEvents();
                  },
                ),
              ],
            ),
          ),

          // Calendar Grid
          Container(
            color: isDark ? AppColors.surfaceDark : Colors.white,
            padding: const EdgeInsets.only(left: 16, right: 16, bottom: 16),
            child: _buildMonthCalendar(isDark, daysWithEvents),
          ),
          const Divider(height: 1),

          // Selected Day Header & Events List
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  DateFormat('EEEE, MMM dd').format(_selectedDate),
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color:
                        isDark
                            ? AppColors.textPrimaryDark
                            : AppColors.textPrimaryLight,
                  ),
                ),
                Text(
                  '${selectedDateEvents.length} scheduled',
                  style: TextStyle(
                    fontSize: 12,
                    color:
                        isDark
                            ? AppColors.textSecondaryDark
                            : AppColors.textSecondaryLight,
                  ),
                ),
              ],
            ),
          ),

          Expanded(
            child:
                _isLoading
                    ? const LoadingView(
                      message: 'Loading calendar activities...',
                    )
                    : selectedDateEvents.isEmpty
                    ? EmptyStateView(
                      icon: Icons.event_available_outlined,
                      title: 'No events on this day',
                      subtitle:
                          'No campus activities scheduled for this date. Select another date with a blue indicator.',
                    )
                    : ListView.builder(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 4,
                      ),
                      itemCount: selectedDateEvents.length,
                      itemBuilder: (context, index) {
                        final event = selectedDateEvents[index];
                        return EventCard(
                          event: event,
                          isKhmer: isKhmer,
                          isBookmarked: event['isSaved'] == true,
                          onTap:
                              () =>
                                  context.push('/event-details/${event['id']}'),
                        );
                      },
                    ),
          ),
        ],
      ),
    );
  }

  Widget _buildMonthCalendar(bool isDark, Set<int> daysWithEvents) {
    final firstDayOfMonth = DateTime(
      _currentMonth.year,
      _currentMonth.month,
      1,
    );
    final daysInMonth =
        DateTime(_currentMonth.year, _currentMonth.month + 1, 0).day;
    final firstWeekday = firstDayOfMonth.weekday % 7; // Sunday = 0

    final weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return Column(
      children: [
        // Weekday header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children:
              weekdays
                  .map(
                    (d) => SizedBox(
                      width: 36,
                      child: Text(
                        d,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color:
                              isDark
                                  ? AppColors.textMutedDark
                                  : AppColors.textMutedLight,
                        ),
                      ),
                    ),
                  )
                  .toList(),
        ),
        const SizedBox(height: 8),

        // Days Grid
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 7,
            mainAxisSpacing: 4,
            crossAxisSpacing: 4,
          ),
          itemCount: 42, // 6 weeks * 7 days
          itemBuilder: (context, index) {
            final dayNumber = index - firstWeekday + 1;

            if (dayNumber < 1 || dayNumber > daysInMonth) {
              return const SizedBox();
            }

            final date = DateTime(
              _currentMonth.year,
              _currentMonth.month,
              dayNumber,
            );
            final isSelected =
                date.year == _selectedDate.year &&
                date.month == _selectedDate.month &&
                date.day == _selectedDate.day;
            final isToday =
                date.year == DateTime.now().year &&
                date.month == DateTime.now().month &&
                date.day == DateTime.now().day;
            final hasEvent = daysWithEvents.contains(dayNumber);

            return InkWell(
              borderRadius: BorderRadius.circular(8),
              onTap: () {
                setState(() => _selectedDate = date);
              },
              child: Container(
                decoration: BoxDecoration(
                  color:
                      isSelected
                          ? AppColors.primary
                          : (isToday
                              ? (isDark
                                  ? const Color(0xFF1E293B)
                                  : const Color(0xFFEFF6FF))
                              : null),
                  borderRadius: BorderRadius.circular(8),
                  border:
                      isToday && !isSelected
                          ? Border.all(
                            color: AppColors.secondary.withOpacity(0.5),
                          )
                          : null,
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      '$dayNumber',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight:
                            isSelected || isToday
                                ? FontWeight.w800
                                : FontWeight.w500,
                        color:
                            isSelected
                                ? Colors.white
                                : (isDark
                                    ? AppColors.textPrimaryDark
                                    : AppColors.textPrimaryLight),
                      ),
                    ),
                    const SizedBox(height: 2),
                    if (hasEvent)
                      Container(
                        width: 4,
                        height: 4,
                        decoration: BoxDecoration(
                          color:
                              isSelected ? Colors.white : AppColors.secondary,
                          shape: BoxShape.circle,
                        ),
                      )
                    else
                      const SizedBox(height: 4),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}
