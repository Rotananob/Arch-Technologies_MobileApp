import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:college_alert/l10n/app_localizations.dart';
import 'package:intl/intl.dart';
import '../../../app/providers.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/widgets/loading_view.dart';
import '../../../core/widgets/status_badge.dart';

class EventDetailScreen extends ConsumerStatefulWidget {
  final String eventId;

  const EventDetailScreen({super.key, required this.eventId});

  @override
  ConsumerState<EventDetailScreen> createState() => _EventDetailScreenState();
}

class _EventDetailScreenState extends ConsumerState<EventDetailScreen> {
  bool _isLoading = true;
  String? _error;
  Map<String, dynamic>? _event;
  bool _isActionLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchDetails();
  }

  Future<void> _fetchDetails() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final repo = ref.read(eventsRepositoryProvider);
      final data = await repo.getEventDetails(widget.eventId);
      if (mounted) {
        setState(() {
          _event = data;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Could not load event information';
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _handleRegisterToggle() async {
    if (_event == null) return;
    final isRegistered = _event!['isRegistered'] == true;

    setState(() => _isActionLoading = true);
    try {
      final repo = ref.read(eventsRepositoryProvider);
      if (isRegistered) {
        await repo.cancelRegistration(widget.eventId);
        if (mounted) {
          setState(() {
            _event!['isRegistered'] = false;
            final count = _event!['registeredCount'] as int? ?? 1;
            _event!['registeredCount'] = count > 0 ? count - 1 : 0;
            _isActionLoading = false;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Registration cancelled successfully'),
            ),
          );
        }
      } else {
        await repo.registerForEvent(widget.eventId);
        if (mounted) {
          setState(() {
            _event!['isRegistered'] = true;
            final count = _event!['registeredCount'] as int? ?? 0;
            _event!['registeredCount'] = count + 1;
            _isActionLoading = false;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              backgroundColor: AppColors.success,
              content: Text(
                '🎉 Successfully registered! Confirmation sent to notifications.',
              ),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isActionLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: AppColors.error,
            content: Text(
              'Action failed. Please sign in or check availability.',
            ),
          ),
        );
      }
    }
  }

  Future<void> _handleBookmarkToggle() async {
    if (_event == null) return;
    final isSaved = _event!['isSaved'] == true;

    setState(() {
      _event!['isSaved'] = !isSaved;
    });

    try {
      final repo = ref.read(eventsRepositoryProvider);
      if (isSaved) {
        await repo.unsaveEvent(widget.eventId);
      } else {
        await repo.saveEvent(widget.eventId);
      }
    } catch (_) {
      if (mounted) {
        setState(() => _event!['isSaved'] = isSaved);
      }
    }
  }

  void _handleSetReminder(AppLocalizations l10n) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: AppColors.primary,
        content: Text('🔔 ${l10n.reminderSet}'),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _handleShare() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Event link copied to clipboard'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final currentLocale = ref.watch(localeProvider).languageCode;
    final isKhmer = currentLocale == 'km';

    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(title: Text(l10n.eventDetails)),
        body: const LoadingView(),
      );
    }

    if (_error != null || _event == null) {
      return Scaffold(
        appBar: AppBar(title: Text(l10n.eventDetails)),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(_error ?? 'Event not found'),
              const SizedBox(height: 12),
              ElevatedButton(onPressed: _fetchDetails, child: Text(l10n.retry)),
            ],
          ),
        ),
      );
    }

    final ev = _event!;
    final title =
        isKhmer && ev['titleKh'] != null ? ev['titleKh'] : ev['title'];
    final description =
        isKhmer && ev['descriptionKh'] != null
            ? ev['descriptionKh']
            : ev['description'];
    final location = ev['location'] as String? ?? 'Campus';
    final organizer = ev['organizer'] as String? ?? 'University';
    final imageUrl = ev['imageUrl'] as String?;
    final isPriorityAlert = ev['priorityAlert'] == true;
    final isRegistrationRequired = ev['isRegistrationRequired'] == true;
    final isRegistered = ev['isRegistered'] == true;
    final isSaved = ev['isSaved'] == true;
    final isFull = ev['isFull'] == true;
    final maxCapacity = ev['maxCapacity'] as int?;
    final registeredCount = ev['registeredCount'] as int? ?? 0;

    final category = ev['category'] as Map<String, dynamic>?;
    final categoryName =
        isKhmer && category?['nameKh'] != null
            ? category!['nameKh']
            : category?['name'] ?? 'General';

    DateTime? startDate;
    DateTime? endDate;
    if (ev['startDate'] != null) {
      try {
        startDate = DateTime.parse(ev['startDate']);
      } catch (_) {}
    }
    if (ev['endDate'] != null) {
      try {
        endDate = DateTime.parse(ev['endDate']);
      } catch (_) {}
    }

    final fullDateStr =
        startDate != null
            ? DateFormat('EEEE, MMMM dd, yyyy').format(startDate)
            : '';
    final timeRangeStr =
        startDate != null && endDate != null
            ? '${DateFormat('hh:mm a').format(startDate)} – ${DateFormat('hh:mm a').format(endDate)}'
            : '';

    return Scaffold(
      backgroundColor:
          isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: AppBar(
        title: Text(l10n.eventDetails),
        actions: [
          IconButton(
            icon: Icon(isSaved ? Icons.bookmark : Icons.bookmark_border),
            color: isSaved ? AppColors.primaryLight : null,
            onPressed: _handleBookmarkToggle,
          ),
          IconButton(
            icon: const Icon(Icons.share_outlined),
            onPressed: _handleShare,
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Event Hero Image
            if (imageUrl != null)
              Image.network(
                imageUrl,
                height: 220,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder:
                    (_, __, ___) => Container(
                      height: 180,
                      color: AppColors.primary,
                      child: const Center(
                        child: Icon(
                          Icons.school,
                          size: 54,
                          color: Colors.white54,
                        ),
                      ),
                    ),
              )
            else
              Container(
                height: 140,
                color: AppColors.primary,
                child: const Center(
                  child: Icon(Icons.event, size: 50, color: Colors.white70),
                ),
              ),

            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Badges Row
                  Row(
                    children: [
                      StatusBadge(
                        label: categoryName,
                        backgroundColor:
                            isDark
                                ? const Color(0xFF1E293B)
                                : const Color(0xFFEFF6FF),
                        textColor:
                            isDark
                                ? AppColors.secondaryLight
                                : AppColors.secondary,
                      ),
                      const SizedBox(width: 8),
                      if (isPriorityAlert)
                        const StatusBadge(
                          label: 'PRIORITY ALERT',
                          backgroundColor: AppColors.errorBg,
                          textColor: AppColors.error,
                          icon: Icons.warning_amber_rounded,
                        ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Title
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      height: 1.3,
                      color:
                          isDark
                              ? AppColors.textPrimaryDark
                              : AppColors.textPrimaryLight,
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Meta Info Box
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.surfaceDark : Colors.white,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color:
                            isDark
                                ? AppColors.borderDark
                                : AppColors.borderLight,
                      ),
                    ),
                    child: Column(
                      children: [
                        // Date & Time
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(
                              Icons.calendar_today_outlined,
                              size: 20,
                              color: AppColors.secondary,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    fullDateStr,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w700,
                                      fontSize: 14,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    timeRangeStr,
                                    style: TextStyle(
                                      color:
                                          isDark
                                              ? AppColors.textSecondaryDark
                                              : AppColors.textSecondaryLight,
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const Divider(height: 24),

                        // Location
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(
                              Icons.location_on_outlined,
                              size: 20,
                              color: AppColors.secondary,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    location,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w700,
                                      fontSize: 14,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    ev['isOnline'] == true
                                        ? 'Online / Virtual Session'
                                        : 'Main University Campus',
                                    style: TextStyle(
                                      color:
                                          isDark
                                              ? AppColors.textSecondaryDark
                                              : AppColors.textSecondaryLight,
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const Divider(height: 24),

                        // Organizer
                        Row(
                          children: [
                            const Icon(
                              Icons.business_outlined,
                              size: 20,
                              color: AppColors.secondary,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                organizer,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Reminder button action
                  OutlinedButton.icon(
                    onPressed: () => _handleSetReminder(l10n),
                    icon: const Icon(Icons.alarm_add_rounded, size: 18),
                    label: Text(l10n.setReminder),
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size.fromHeight(44),
                    ),
                  ),
                  const SizedBox(height: 28),

                  // About Section
                  Text(
                    l10n.aboutEvent,
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w800,
                      color:
                          isDark
                              ? AppColors.textPrimaryDark
                              : AppColors.textPrimaryLight,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    description,
                    style: TextStyle(
                      fontSize: 14,
                      height: 1.6,
                      color:
                          isDark
                              ? AppColors.textSecondaryDark
                              : AppColors.textSecondaryLight,
                    ),
                  ),
                  const SizedBox(height: 28),

                  // Capacity & Registration stats
                  if (isRegistrationRequired) ...[
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color:
                            isDark
                                ? AppColors.surfaceDark
                                : const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(
                                Icons.people_outline,
                                size: 18,
                                color: AppColors.secondary,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                maxCapacity != null
                                    ? '$registeredCount / $maxCapacity registered'
                                    : '$registeredCount students attending',
                                style: const TextStyle(
                                  fontWeight: FontWeight.w600,
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                          if (isFull)
                            const StatusBadge(
                              label: 'FULL',
                              backgroundColor: AppColors.warningBg,
                              textColor: AppColors.warning,
                            ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar:
          isRegistrationRequired
              ? SafeArea(
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 12,
                  ),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.surfaceDark : Colors.white,
                    border: Border(
                      top: BorderSide(
                        color:
                            isDark
                                ? AppColors.borderDark
                                : AppColors.borderLight,
                      ),
                    ),
                  ),
                  child:
                      isRegistered
                          ? OutlinedButton.icon(
                            onPressed:
                                _isActionLoading ? null : _handleRegisterToggle,
                            icon: const Icon(
                              Icons.cancel_outlined,
                              size: 18,
                              color: AppColors.error,
                            ),
                            label: Text(
                              l10n.cancelRegistration,
                              style: const TextStyle(color: AppColors.error),
                            ),
                          )
                          : ElevatedButton.icon(
                            onPressed:
                                (_isActionLoading || isFull)
                                    ? null
                                    : _handleRegisterToggle,
                            icon: const Icon(
                              Icons.check_circle_outline,
                              size: 18,
                            ),
                            label:
                                _isActionLoading
                                    ? const SizedBox(
                                      height: 18,
                                      width: 18,
                                      child: CircularProgressIndicator(
                                        color: Colors.white,
                                        strokeWidth: 2,
                                      ),
                                    )
                                    : Text(
                                      isFull
                                          ? l10n.eventFull
                                          : l10n.registerNow,
                                    ),
                          ),
                ),
              )
              : null,
    );
  }
}
