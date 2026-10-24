import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:college_alert/l10n/app_localizations.dart';
import '../../../app/providers.dart';
import '../../../app/theme/app_colors.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _eventAnnouncements = true;
  bool _upcomingReminders = true;
  bool _registrationUpdates = true;
  bool _generalAlerts = true;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final currentLocale = ref.watch(localeProvider);
    final currentThemeMode = ref.watch(themeModeProvider);
    final authState = ref.watch(authProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor:
          isDark ? AppColors.backgroundDark : AppColors.backgroundLight,
      appBar: AppBar(title: Text(l10n.settingsTitle)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Language Section
            _buildSectionHeader(l10n.language, isDark),
            Container(
              decoration: _cardBoxDecoration(isDark),
              child: Column(
                children: [
                  RadioListTile<String>(
                    title: const Text('English (Default)'),
                    subtitle: const Text(
                      'English interface',
                      style: TextStyle(fontSize: 12),
                    ),
                    value: 'en',
                    groupValue: currentLocale.languageCode,
                    onChanged: (val) {
                      if (val != null) {
                        ref.read(localeProvider.notifier).setLocale(val);
                      }
                    },
                  ),
                  const Divider(height: 1),
                  RadioListTile<String>(
                    title: const Text('ភាសាខ្មែរ (Khmer)'),
                    subtitle: const Text(
                      'ចំណុចប្រទាក់ជាភាសាខ្មែរ',
                      style: TextStyle(fontSize: 12),
                    ),
                    value: 'km',
                    groupValue: currentLocale.languageCode,
                    onChanged: (val) {
                      if (val != null) {
                        ref.read(localeProvider.notifier).setLocale(val);
                      }
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // 2. Theme / Appearance Section
            _buildSectionHeader(l10n.appearance, isDark),
            Container(
              decoration: _cardBoxDecoration(isDark),
              child: Column(
                children: [
                  RadioListTile<ThemeMode>(
                    title: Text(l10n.themeSystem),
                    value: ThemeMode.system,
                    groupValue: currentThemeMode,
                    onChanged: (val) {
                      if (val != null)
                        ref.read(themeModeProvider.notifier).setThemeMode(val);
                    },
                  ),
                  const Divider(height: 1),
                  RadioListTile<ThemeMode>(
                    title: Text(l10n.themeLight),
                    value: ThemeMode.light,
                    groupValue: currentThemeMode,
                    onChanged: (val) {
                      if (val != null)
                        ref.read(themeModeProvider.notifier).setThemeMode(val);
                    },
                  ),
                  const Divider(height: 1),
                  RadioListTile<ThemeMode>(
                    title: Text(l10n.themeDark),
                    value: ThemeMode.dark,
                    groupValue: currentThemeMode,
                    onChanged: (val) {
                      if (val != null)
                        ref.read(themeModeProvider.notifier).setThemeMode(val);
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // 3. Notification Preferences Section
            _buildSectionHeader(l10n.notificationPreferences, isDark),
            Container(
              decoration: _cardBoxDecoration(isDark),
              child: Column(
                children: [
                  SwitchListTile(
                    title: Text(
                      l10n.eventAnnouncements,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    value: _eventAnnouncements,
                    onChanged:
                        (val) => setState(() => _eventAnnouncements = val),
                  ),
                  const Divider(height: 1),
                  SwitchListTile(
                    title: Text(
                      l10n.upcomingReminders,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    value: _upcomingReminders,
                    onChanged:
                        (val) => setState(() => _upcomingReminders = val),
                  ),
                  const Divider(height: 1),
                  SwitchListTile(
                    title: Text(
                      l10n.registrationUpdates,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    value: _registrationUpdates,
                    onChanged:
                        (val) => setState(() => _registrationUpdates = val),
                  ),
                  const Divider(height: 1),
                  SwitchListTile(
                    title: Text(
                      l10n.generalAlerts,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    value: _generalAlerts,
                    onChanged: (val) => setState(() => _generalAlerts = val),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // 4. About & Project Credit
            _buildSectionHeader('About College Alert', isDark),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: _cardBoxDecoration(isDark),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(
                        Icons.verified_outlined,
                        color: AppColors.secondary,
                        size: 20,
                      ),
                      SizedBox(width: 8),
                      Text(
                        'Arch Technologies Internship Task 1',
                        style: TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Developed by Rotana Nob for the Remote Mobile App Development Program. Powered by Flutter, Riverpod, GoRouter, NestJS, and PostgreSQL.',
                    style: TextStyle(
                      fontSize: 12,
                      height: 1.4,
                      color:
                          isDark
                              ? AppColors.textSecondaryDark
                              : AppColors.textSecondaryLight,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Version 1.0.0 (Build 2026.1)',
                    style: TextStyle(
                      fontSize: 11,
                      color: AppColors.textMutedLight,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // 5. Account Sign Out or Sign In Action
            if (authState.isAuthenticated)
              OutlinedButton.icon(
                onPressed: () => _confirmSignOut(context, l10n),
                icon: const Icon(
                  Icons.logout,
                  size: 18,
                  color: AppColors.error,
                ),
                label: Text(
                  l10n.logout,
                  style: const TextStyle(color: AppColors.error),
                ),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                  side: const BorderSide(color: AppColors.error),
                ),
              )
            else
              ElevatedButton.icon(
                onPressed: () => context.push('/login'),
                icon: const Icon(Icons.login, size: 18),
                label: Text(l10n.login),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                ),
              ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  void _confirmSignOut(BuildContext context, AppLocalizations l10n) {
    showDialog(
      context: context,
      builder:
          (ctx) => AlertDialog(
            title: Text(l10n.logout),
            content: Text(l10n.logoutConfirm),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: Text(l10n.cancel),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.error,
                ),
                onPressed: () async {
                  Navigator.pop(ctx);
                  await ref.read(authProvider.notifier).logout();
                  if (context.mounted) {
                    context.go('/login');
                  }
                },
                child: Text(l10n.confirm),
              ),
            ],
          ),
    );
  }

  Widget _buildSectionHeader(String title, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.w700,
          color:
              isDark
                  ? AppColors.textSecondaryDark
                  : AppColors.textSecondaryLight,
          letterSpacing: 0.5,
        ),
      ),
    );
  }

  BoxDecoration _cardBoxDecoration(bool isDark) {
    return BoxDecoration(
      color: isDark ? AppColors.surfaceDark : Colors.white,
      borderRadius: BorderRadius.circular(10),
      border: Border.all(
        color: isDark ? AppColors.borderDark : AppColors.borderLight,
      ),
    );
  }
}
