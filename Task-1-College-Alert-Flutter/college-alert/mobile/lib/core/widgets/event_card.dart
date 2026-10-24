import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../app/theme/app_colors.dart';
import 'status_badge.dart';

class EventCard extends StatelessWidget {
  final Map<String, dynamic> event;
  final VoidCallback onTap;
  final VoidCallback? onBookmarkToggle;
  final bool isBookmarked;
  final bool isKhmer;

  const EventCard({
    super.key,
    required this.event,
    required this.onTap,
    this.onBookmarkToggle,
    this.isBookmarked = false,
    this.isKhmer = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final title =
        isKhmer &&
                (event['titleKh'] != null &&
                    (event['titleKh'] as String).isNotEmpty)
            ? event['titleKh'] as String
            : (event['title'] as String? ?? 'Campus Event');

    final location = event['location'] as String? ?? 'Campus Location';
    final isPriorityAlert = event['priorityAlert'] == true;
    final isRegistrationRequired = event['isRegistrationRequired'] == true;
    final isRegistered = event['isRegistered'] == true;

    final category = event['category'] as Map<String, dynamic>?;
    final categoryName =
        isKhmer && category?['nameKh'] != null
            ? category!['nameKh']
            : category?['name'] ?? 'General';

    DateTime? startDate;
    if (event['startDate'] != null) {
      try {
        startDate = DateTime.parse(event['startDate']);
      } catch (_) {}
    }

    final monthStr =
        startDate != null
            ? DateFormat('MMM').format(startDate).toUpperCase()
            : 'OCT';
    final dayStr =
        startDate != null ? DateFormat('dd').format(startDate) : '28';
    final timeStr =
        startDate != null
            ? DateFormat('hh:mm a').format(startDate)
            : '09:00 AM';

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : AppColors.cardLight,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color:
              isPriorityAlert
                  ? AppColors.error.withOpacity(0.4)
                  : (isDark ? AppColors.borderDark : AppColors.borderLight),
          width: isPriorityAlert ? 1.5 : 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Date Container Badge
                Container(
                  width: 52,
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  decoration: BoxDecoration(
                    color:
                        isPriorityAlert
                            ? AppColors.errorBg
                            : (isDark
                                ? const Color(0xFF1F2E47)
                                : const Color(0xFFF1F5F9)),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color:
                          isPriorityAlert
                              ? AppColors.error.withOpacity(0.3)
                              : Colors.transparent,
                    ),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        monthStr,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color:
                              isPriorityAlert
                                  ? AppColors.error
                                  : AppColors.secondary,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        dayStr,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color:
                              isPriorityAlert
                                  ? AppColors.error
                                  : (isDark
                                      ? AppColors.textPrimaryDark
                                      : AppColors.textPrimaryLight),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 14),

                // Event Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Category Tag + Priority Alert Indicator
                      Row(
                        children: [
                          if (isPriorityAlert) ...[
                            const StatusBadge(
                              label: 'URGENT ALERT',
                              backgroundColor: AppColors.errorBg,
                              textColor: AppColors.error,
                              icon: Icons.warning_amber_rounded,
                            ),
                            const SizedBox(width: 6),
                          ],
                          Flexible(
                            child: Text(
                              categoryName,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color:
                                    isDark
                                        ? AppColors.secondaryLight
                                        : AppColors.secondary,
                                letterSpacing: 0.3,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),

                      // Title
                      Text(
                        title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          height: 1.3,
                          color:
                              isDark
                                  ? AppColors.textPrimaryDark
                                  : AppColors.textPrimaryLight,
                        ),
                      ),
                      const SizedBox(height: 8),

                      // Location & Time metadata
                      Row(
                        children: [
                          Icon(
                            Icons.access_time_rounded,
                            size: 13,
                            color:
                                isDark
                                    ? AppColors.textMutedDark
                                    : AppColors.textMutedLight,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            timeStr,
                            style: TextStyle(
                              fontSize: 12,
                              color:
                                  isDark
                                      ? AppColors.textSecondaryDark
                                      : AppColors.textSecondaryLight,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Icon(
                            Icons.location_on_outlined,
                            size: 13,
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
                                fontSize: 12,
                                color:
                                    isDark
                                        ? AppColors.textSecondaryDark
                                        : AppColors.textSecondaryLight,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),

                      // Registration Tag or Attending Status
                      Row(
                        children: [
                          if (isRegistered)
                            const StatusBadge(
                              label: 'Registered',
                              backgroundColor: AppColors.successBg,
                              textColor: AppColors.success,
                              icon: Icons.check_circle_outline,
                            )
                          else if (isRegistrationRequired)
                            StatusBadge(
                              label: 'Registration Required',
                              backgroundColor:
                                  isDark
                                      ? const Color(0xFF1E293B)
                                      : const Color(0xFFF1F5F9),
                              textColor:
                                  isDark
                                      ? AppColors.textSecondaryDark
                                      : AppColors.textSecondaryLight,
                            )
                          else
                            StatusBadge(
                              label: 'Open Entry',
                              backgroundColor:
                                  isDark
                                      ? const Color(0xFF1E293B)
                                      : const Color(0xFFF1F5F9),
                              textColor:
                                  isDark
                                      ? AppColors.textSecondaryDark
                                      : AppColors.textSecondaryLight,
                            ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Bookmark Icon Button
                if (onBookmarkToggle != null)
                  IconButton(
                    iconSize: 20,
                    splashRadius: 18,
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                    icon: Icon(
                      isBookmarked ? Icons.bookmark : Icons.bookmark_border,
                      color:
                          isBookmarked
                              ? AppColors.primaryLight
                              : (isDark
                                  ? AppColors.textMutedDark
                                  : AppColors.textMutedLight),
                    ),
                    onPressed: onBookmarkToggle,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
