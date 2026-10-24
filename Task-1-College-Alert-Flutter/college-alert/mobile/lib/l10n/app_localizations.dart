import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_km.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('km'),
  ];

  /// The title of the application
  ///
  /// In en, this message translates to:
  /// **'College Alert'**
  String get appTitle;

  /// No description provided for @tagline.
  ///
  /// In en, this message translates to:
  /// **'Campus Notifications & Event Hub'**
  String get tagline;

  /// No description provided for @welcomeBack.
  ///
  /// In en, this message translates to:
  /// **'Welcome back,'**
  String get welcomeBack;

  /// No description provided for @guestUser.
  ///
  /// In en, this message translates to:
  /// **'Guest Student'**
  String get guestUser;

  /// No description provided for @browseEvents.
  ///
  /// In en, this message translates to:
  /// **'Discover Events'**
  String get browseEvents;

  /// No description provided for @featuredEvent.
  ///
  /// In en, this message translates to:
  /// **'Featured Campus Event'**
  String get featuredEvent;

  /// No description provided for @upcomingEvents.
  ///
  /// In en, this message translates to:
  /// **'Upcoming Activities'**
  String get upcomingEvents;

  /// No description provided for @seeAll.
  ///
  /// In en, this message translates to:
  /// **'See All'**
  String get seeAll;

  /// No description provided for @categories.
  ///
  /// In en, this message translates to:
  /// **'Categories'**
  String get categories;

  /// No description provided for @academic.
  ///
  /// In en, this message translates to:
  /// **'Academic'**
  String get academic;

  /// No description provided for @workshopsTech.
  ///
  /// In en, this message translates to:
  /// **'Workshops & Tech'**
  String get workshopsTech;

  /// No description provided for @careerInternship.
  ///
  /// In en, this message translates to:
  /// **'Career & Internship'**
  String get careerInternship;

  /// No description provided for @sportsWellness.
  ///
  /// In en, this message translates to:
  /// **'Sports & Wellness'**
  String get sportsWellness;

  /// No description provided for @campusLife.
  ///
  /// In en, this message translates to:
  /// **'Campus Life & Arts'**
  String get campusLife;

  /// No description provided for @priorityAlerts.
  ///
  /// In en, this message translates to:
  /// **'Campus Alerts'**
  String get priorityAlerts;

  /// No description provided for @searchPlaceholder.
  ///
  /// In en, this message translates to:
  /// **'Search events, topics, locations...'**
  String get searchPlaceholder;

  /// No description provided for @filterByCategory.
  ///
  /// In en, this message translates to:
  /// **'All Categories'**
  String get filterByCategory;

  /// No description provided for @filterByDate.
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get filterByDate;

  /// No description provided for @noEventsFound.
  ///
  /// In en, this message translates to:
  /// **'No events scheduled'**
  String get noEventsFound;

  /// No description provided for @noEventsFoundSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Check back later or adjust your search filter to see more campus activities.'**
  String get noEventsFoundSubtitle;

  /// No description provided for @eventDetails.
  ///
  /// In en, this message translates to:
  /// **'Event Details'**
  String get eventDetails;

  /// No description provided for @dateAndTime.
  ///
  /// In en, this message translates to:
  /// **'Date & Time'**
  String get dateAndTime;

  /// No description provided for @location.
  ///
  /// In en, this message translates to:
  /// **'Location'**
  String get location;

  /// No description provided for @organizer.
  ///
  /// In en, this message translates to:
  /// **'Organized By'**
  String get organizer;

  /// No description provided for @aboutEvent.
  ///
  /// In en, this message translates to:
  /// **'About This Event'**
  String get aboutEvent;

  /// No description provided for @registration.
  ///
  /// In en, this message translates to:
  /// **'Registration'**
  String get registration;

  /// No description provided for @registerNow.
  ///
  /// In en, this message translates to:
  /// **'Register for Event'**
  String get registerNow;

  /// No description provided for @cancelRegistration.
  ///
  /// In en, this message translates to:
  /// **'Cancel Registration'**
  String get cancelRegistration;

  /// No description provided for @registrationConfirmed.
  ///
  /// In en, this message translates to:
  /// **'Registered'**
  String get registrationConfirmed;

  /// No description provided for @eventFull.
  ///
  /// In en, this message translates to:
  /// **'Event is Full'**
  String get eventFull;

  /// No description provided for @noRegistrationRequired.
  ///
  /// In en, this message translates to:
  /// **'No Registration Required'**
  String get noRegistrationRequired;

  /// No description provided for @saveEvent.
  ///
  /// In en, this message translates to:
  /// **'Bookmark Event'**
  String get saveEvent;

  /// No description provided for @unsaveEvent.
  ///
  /// In en, this message translates to:
  /// **'Remove Bookmark'**
  String get unsaveEvent;

  /// No description provided for @shareEvent.
  ///
  /// In en, this message translates to:
  /// **'Share Event'**
  String get shareEvent;

  /// No description provided for @setReminder.
  ///
  /// In en, this message translates to:
  /// **'Set Calendar Reminder'**
  String get setReminder;

  /// No description provided for @reminderSet.
  ///
  /// In en, this message translates to:
  /// **'Reminder scheduled for this event'**
  String get reminderSet;

  /// No description provided for @calendarTitle.
  ///
  /// In en, this message translates to:
  /// **'Campus Calendar'**
  String get calendarTitle;

  /// No description provided for @notificationsTitle.
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get notificationsTitle;

  /// No description provided for @markAllAsRead.
  ///
  /// In en, this message translates to:
  /// **'Mark all as read'**
  String get markAllAsRead;

  /// No description provided for @noNotifications.
  ///
  /// In en, this message translates to:
  /// **'No notifications yet'**
  String get noNotifications;

  /// No description provided for @noNotificationsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'You are all caught up! Campus updates and reminders will appear here.'**
  String get noNotificationsSubtitle;

  /// No description provided for @savedEventsTitle.
  ///
  /// In en, this message translates to:
  /// **'Saved Events'**
  String get savedEventsTitle;

  /// No description provided for @noSavedEvents.
  ///
  /// In en, this message translates to:
  /// **'No saved events'**
  String get noSavedEvents;

  /// No description provided for @noSavedEventsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Tap the bookmark icon on any event to save it for easy access later.'**
  String get noSavedEventsSubtitle;

  /// No description provided for @profileTitle.
  ///
  /// In en, this message translates to:
  /// **'Student Profile'**
  String get profileTitle;

  /// No description provided for @editProfile.
  ///
  /// In en, this message translates to:
  /// **'Edit Profile'**
  String get editProfile;

  /// No description provided for @saveChanges.
  ///
  /// In en, this message translates to:
  /// **'Save Changes'**
  String get saveChanges;

  /// No description provided for @studentId.
  ///
  /// In en, this message translates to:
  /// **'Student ID'**
  String get studentId;

  /// No description provided for @department.
  ///
  /// In en, this message translates to:
  /// **'Department / Major'**
  String get department;

  /// No description provided for @phoneNumber.
  ///
  /// In en, this message translates to:
  /// **'Phone Number'**
  String get phoneNumber;

  /// No description provided for @email.
  ///
  /// In en, this message translates to:
  /// **'Email Address'**
  String get email;

  /// No description provided for @fullName.
  ///
  /// In en, this message translates to:
  /// **'Full Name'**
  String get fullName;

  /// No description provided for @settingsTitle.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get settingsTitle;

  /// No description provided for @language.
  ///
  /// In en, this message translates to:
  /// **'Language'**
  String get language;

  /// No description provided for @english.
  ///
  /// In en, this message translates to:
  /// **'English'**
  String get english;

  /// No description provided for @khmer.
  ///
  /// In en, this message translates to:
  /// **'ភាសាខ្មែរ (Khmer)'**
  String get khmer;

  /// No description provided for @appearance.
  ///
  /// In en, this message translates to:
  /// **'Appearance'**
  String get appearance;

  /// No description provided for @themeSystem.
  ///
  /// In en, this message translates to:
  /// **'System Default'**
  String get themeSystem;

  /// No description provided for @themeLight.
  ///
  /// In en, this message translates to:
  /// **'Light Theme'**
  String get themeLight;

  /// No description provided for @themeDark.
  ///
  /// In en, this message translates to:
  /// **'Dark Theme'**
  String get themeDark;

  /// No description provided for @notificationPreferences.
  ///
  /// In en, this message translates to:
  /// **'Notification Preferences'**
  String get notificationPreferences;

  /// No description provided for @eventAnnouncements.
  ///
  /// In en, this message translates to:
  /// **'Campus Event Announcements'**
  String get eventAnnouncements;

  /// No description provided for @upcomingReminders.
  ///
  /// In en, this message translates to:
  /// **'Upcoming Event Reminders'**
  String get upcomingReminders;

  /// No description provided for @registrationUpdates.
  ///
  /// In en, this message translates to:
  /// **'Registration Updates & Passes'**
  String get registrationUpdates;

  /// No description provided for @generalAlerts.
  ///
  /// In en, this message translates to:
  /// **'Urgent Campus Alerts'**
  String get generalAlerts;

  /// No description provided for @account.
  ///
  /// In en, this message translates to:
  /// **'Account'**
  String get account;

  /// No description provided for @login.
  ///
  /// In en, this message translates to:
  /// **'Sign In'**
  String get login;

  /// No description provided for @register.
  ///
  /// In en, this message translates to:
  /// **'Create Account'**
  String get register;

  /// No description provided for @logout.
  ///
  /// In en, this message translates to:
  /// **'Sign Out'**
  String get logout;

  /// No description provided for @logoutConfirm.
  ///
  /// In en, this message translates to:
  /// **'Are you sure you want to sign out?'**
  String get logoutConfirm;

  /// No description provided for @cancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get cancel;

  /// No description provided for @confirm.
  ///
  /// In en, this message translates to:
  /// **'Confirm'**
  String get confirm;

  /// No description provided for @password.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get password;

  /// No description provided for @confirmPassword.
  ///
  /// In en, this message translates to:
  /// **'Confirm Password'**
  String get confirmPassword;

  /// No description provided for @forgotPassword.
  ///
  /// In en, this message translates to:
  /// **'Forgot Password?'**
  String get forgotPassword;

  /// No description provided for @forgotPasswordSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Enter your university email to receive password reset instructions.'**
  String get forgotPasswordSubtitle;

  /// No description provided for @sendResetLink.
  ///
  /// In en, this message translates to:
  /// **'Send Reset Link'**
  String get sendResetLink;

  /// No description provided for @alreadyHaveAccount.
  ///
  /// In en, this message translates to:
  /// **'Already have an account? Sign In'**
  String get alreadyHaveAccount;

  /// No description provided for @dontHaveAccount.
  ///
  /// In en, this message translates to:
  /// **'Don\'t have an account? Sign Up'**
  String get dontHaveAccount;

  /// No description provided for @onboardingTitle1.
  ///
  /// In en, this message translates to:
  /// **'Stay Ahead of Campus Life'**
  String get onboardingTitle1;

  /// No description provided for @onboardingDesc1.
  ///
  /// In en, this message translates to:
  /// **'Never miss critical academic announcements, exam schedules, or university emergencies with direct real-time alerts.'**
  String get onboardingDesc1;

  /// No description provided for @onboardingTitle2.
  ///
  /// In en, this message translates to:
  /// **'Discover Events & Workshops'**
  String get onboardingTitle2;

  /// No description provided for @onboardingDesc2.
  ///
  /// In en, this message translates to:
  /// **'Explore hackathons, sports tournaments, career fairs, and cultural festivities happening right across your campus.'**
  String get onboardingDesc2;

  /// No description provided for @onboardingTitle3.
  ///
  /// In en, this message translates to:
  /// **'Reserve Seats & Manage Schedules'**
  String get onboardingTitle3;

  /// No description provided for @onboardingDesc3.
  ///
  /// In en, this message translates to:
  /// **'One-tap registrations, personalized bookmarks, and seamless calendar integration designed specifically for busy students.'**
  String get onboardingDesc3;

  /// No description provided for @getStarted.
  ///
  /// In en, this message translates to:
  /// **'Get Started'**
  String get getStarted;

  /// No description provided for @skip.
  ///
  /// In en, this message translates to:
  /// **'Skip'**
  String get skip;

  /// No description provided for @next.
  ///
  /// In en, this message translates to:
  /// **'Next'**
  String get next;

  /// No description provided for @retry.
  ///
  /// In en, this message translates to:
  /// **'Try Again'**
  String get retry;

  /// No description provided for @errorOccurred.
  ///
  /// In en, this message translates to:
  /// **'Something went wrong'**
  String get errorOccurred;

  /// No description provided for @connectionError.
  ///
  /// In en, this message translates to:
  /// **'Unable to connect to server. Please check your network.'**
  String get connectionError;

  /// No description provided for @registeredCount.
  ///
  /// In en, this message translates to:
  /// **'{count} Students Attending'**
  String registeredCount(Object count);
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'km'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'km':
      return AppLocalizationsKm();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
