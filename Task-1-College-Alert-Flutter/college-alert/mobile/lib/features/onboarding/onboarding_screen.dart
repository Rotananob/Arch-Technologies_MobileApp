import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:college_alert/l10n/app_localizations.dart';
import '../../app/providers.dart';
import '../../app/theme/app_colors.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  Future<void> _completeOnboarding() async {
    final storage = ref.read(storageServiceProvider);
    await storage.setOnboardingDone(true);
    if (!mounted) return;
    context.go('/home');
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final pages = [
      {
        'icon': Icons.notifications_active_outlined,
        'title': l10n.onboardingTitle1,
        'desc': l10n.onboardingDesc1,
      },
      {
        'icon': Icons.explore_outlined,
        'title': l10n.onboardingTitle2,
        'desc': l10n.onboardingDesc2,
      },
      {
        'icon': Icons.event_available_outlined,
        'title': l10n.onboardingTitle3,
        'desc': l10n.onboardingDesc3,
      },
    ];

    return Scaffold(
      backgroundColor: isDark ? AppColors.backgroundDark : Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          TextButton(
            onPressed: _completeOnboarding,
            child: Text(
              l10n.skip,
              style: TextStyle(
                color:
                    isDark
                        ? AppColors.textSecondaryDark
                        : AppColors.textSecondaryLight,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                itemCount: pages.length,
                onPageChanged: (index) {
                  setState(() => _currentPage = index);
                },
                itemBuilder: (context, index) {
                  final p = pages[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 32),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 100,
                          height: 100,
                          decoration: BoxDecoration(
                            color:
                                isDark
                                    ? AppColors.surfaceDark
                                    : const Color(0xFFEFF6FF),
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: AppColors.secondary.withOpacity(0.2),
                              width: 2,
                            ),
                          ),
                          child: Icon(
                            p['icon'] as IconData,
                            size: 48,
                            color:
                                isDark
                                    ? AppColors.secondaryLight
                                    : AppColors.primary,
                          ),
                        ),
                        const SizedBox(height: 36),
                        Text(
                          p['title'] as String,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w800,
                            color:
                                isDark
                                    ? AppColors.textPrimaryDark
                                    : AppColors.textPrimaryLight,
                          ),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          p['desc'] as String,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 14,
                            height: 1.5,
                            color:
                                isDark
                                    ? AppColors.textSecondaryDark
                                    : AppColors.textSecondaryLight,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(28.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Page Indicators
                  Row(
                    children: List.generate(
                      pages.length,
                      (i) => Container(
                        margin: const EdgeInsets.only(right: 6),
                        width: _currentPage == i ? 24 : 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color:
                              _currentPage == i
                                  ? (isDark
                                      ? AppColors.secondaryLight
                                      : AppColors.primary)
                                  : (isDark
                                      ? const Color(0xFF263954)
                                      : const Color(0xFFCBD5E1)),
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    ),
                  ),

                  // Next / Get Started Button
                  ElevatedButton(
                    onPressed: () {
                      if (_currentPage < pages.length - 1) {
                        _pageController.nextPage(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.easeInOut,
                        );
                      } else {
                        _completeOnboarding();
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 14,
                      ),
                    ),
                    child: Text(
                      _currentPage == pages.length - 1
                          ? l10n.getStarted
                          : l10n.next,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
