import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:college_alert/l10n/app_localizations.dart';
import 'providers.dart';
import 'router.dart';
import 'theme/app_theme.dart';

class CollegeAlertApp extends ConsumerWidget {
  const CollegeAlertApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentLocale = ref.watch(localeProvider);
    final currentThemeMode = ref.watch(themeModeProvider);

    return MaterialApp.router(
      title: 'College Alert',
      debugShowCheckedModeBanner: false,
      routerConfig: appRouter,
      themeMode: currentThemeMode,
      theme: AppTheme.lightTheme(currentLocale.languageCode),
      darkTheme: AppTheme.darkTheme(currentLocale.languageCode),
      locale: currentLocale,
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en', ''), // English
        Locale('km', ''), // Khmer
      ],
    );
  }
}
