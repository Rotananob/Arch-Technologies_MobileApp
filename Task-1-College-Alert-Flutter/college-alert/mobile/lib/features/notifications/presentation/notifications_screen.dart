import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:college_alert/l10n/app_localizations.dart';
import 'package:intl/intl.dart';
import '../../../app/providers.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/widgets/empty_state_view.dart';
import '../../../core/widgets/loading_view.dart';

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() =>
      _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  List<Map<String, dynamic>> _notifications = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final repo = ref.read(notificationsRepositoryProvider);
      final res = await repo.getMyNotifications();
      final list =
          (res['notifications'] as List<dynamic>).cast<Map<String, dynamic>>();
      final unreadCount = res['unreadCount'] as int? ?? 0;

      ref.read(unreadNotificationsCountProvider.notifier).state = unreadCount;

      if (mounted) {
        setState(() {
          _notifications = list;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Could not load notifications';
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _markRead(String id) async {
    try {
      await ref.read(notificationsRepositoryProvider).markAsRead(id);
      setState(() {
        final item = _notifications.firstWhere(
          (n) => n['id'] == id,
          orElse: () => {},
        );
        if (item.isNotEmpty) item['isRead'] = true;
      });
      final count = ref.read(unreadNotificationsCountProvider);
      if (count > 0)
        ref.read(unreadNotificationsCountProvider.notifier).state = count - 1;
    } catch (_) {}
  }

  Future<void> _markAllRead() async {
    try {
      await ref.read(notificationsRepositoryProvider).markAllAsRead();
      setState(() {
        for (final n in _notifications) {
          n['isRead'] = true;
        }
      });
      ref.read(unreadNotificationsCountProvider.notifier).state = 0;
    } catch (_) {}
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
      appBar: AppBar(
        title: Text(l10n.notificationsTitle),
        actions: [
          if (_notifications.any((n) => n['isRead'] == false))
            TextButton(
              onPressed: _markAllRead,
              child: Text(
                l10n.markAllAsRead,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                ),
              ),
            ),
        ],
      ),
      body:
          _isLoading
              ? const LoadingView(message: 'Loading campus notices...')
              : _error != null
              ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.cloud_off_rounded,
                      size: 44,
                      color: AppColors.error,
                    ),
                    const SizedBox(height: 12),
                    Text(_error!),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: _loadNotifications,
                      child: Text(l10n.retry),
                    ),
                  ],
                ),
              )
              : _notifications.isEmpty
              ? EmptyStateView(
                icon: Icons.notifications_none_rounded,
                title: l10n.noNotifications,
                subtitle: l10n.noNotificationsSubtitle,
              )
              : RefreshIndicator(
                onRefresh: _loadNotifications,
                child: ListView.separated(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                  itemCount: _notifications.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (context, index) {
                    final n = _notifications[index];
                    final isRead = n['isRead'] == true;
                    final title =
                        isKhmer && n['titleKh'] != null
                            ? n['titleKh']
                            : n['title'];
                    final message =
                        isKhmer && n['messageKh'] != null
                            ? n['messageKh']
                            : n['message'];
                    final type = n['type'] as String? ?? 'GENERAL';
                    final eventId = n['eventId'] as String?;

                    DateTime? createdAt;
                    if (n['createdAt'] != null) {
                      try {
                        createdAt = DateTime.parse(n['createdAt']);
                      } catch (_) {}
                    }
                    final timeStr =
                        createdAt != null
                            ? DateFormat('MMM dd • hh:mm a').format(createdAt)
                            : '';

                    return _buildNotificationTile(
                      title: title,
                      message: message,
                      timeStr: timeStr,
                      isRead: isRead,
                      type: type,
                      isDark: isDark,
                      onTap: () async {
                        if (!isRead) await _markRead(n['id']);
                        if (!context.mounted) return;
                        if (eventId != null) {
                          context.push('/event-details/$eventId');
                        }
                      },
                    );
                  },
                ),
              ),
    );
  }

  Widget _buildNotificationTile({
    required String title,
    required String message,
    required String timeStr,
    required bool isRead,
    required String type,
    required bool isDark,
    required VoidCallback onTap,
  }) {
    IconData iconData = Icons.notifications_outlined;
    Color iconColor = AppColors.secondary;

    if (type.contains('ANNOUNCEMENT') ||
        title.contains('⚠️') ||
        title.contains('Urgent')) {
      iconData = Icons.warning_amber_rounded;
      iconColor = AppColors.error;
    } else if (type.contains('CONFIRMED')) {
      iconData = Icons.check_circle_outline;
      iconColor = AppColors.success;
    } else if (type.contains('REMINDER')) {
      iconData = Icons.alarm_rounded;
      iconColor = AppColors.warning;
    }

    return Container(
      decoration: BoxDecoration(
        color:
            isRead
                ? (isDark ? AppColors.surfaceDark : Colors.white)
                : (isDark ? const Color(0xFF192A47) : const Color(0xFFEFF6FF)),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color:
              isRead
                  ? (isDark ? AppColors.borderDark : AppColors.borderLight)
                  : AppColors.secondary.withOpacity(0.3),
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(10),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: iconColor.withOpacity(0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(iconData, size: 20, color: iconColor),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              title,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight:
                                    isRead ? FontWeight.w600 : FontWeight.w800,
                                color:
                                    isDark
                                        ? AppColors.textPrimaryDark
                                        : AppColors.textPrimaryLight,
                              ),
                            ),
                          ),
                          if (!isRead)
                            Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: AppColors.secondary,
                                shape: BoxShape.circle,
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        message,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 13,
                          height: 1.3,
                          color:
                              isDark
                                  ? AppColors.textSecondaryDark
                                  : AppColors.textSecondaryLight,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        timeStr,
                        style: TextStyle(
                          fontSize: 11,
                          color:
                              isDark
                                  ? AppColors.textMutedDark
                                  : AppColors.textMutedLight,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
