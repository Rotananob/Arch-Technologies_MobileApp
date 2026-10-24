// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appTitle => 'College Alert';

  @override
  String get tagline => 'Campus Notifications & Event Hub';

  @override
  String get welcomeBack => 'Welcome back,';

  @override
  String get guestUser => 'Guest Student';

  @override
  String get browseEvents => 'Discover Events';

  @override
  String get featuredEvent => 'Featured Campus Event';

  @override
  String get upcomingEvents => 'Upcoming Activities';

  @override
  String get seeAll => 'See All';

  @override
  String get categories => 'Categories';

  @override
  String get academic => 'Academic';

  @override
  String get workshopsTech => 'Workshops & Tech';

  @override
  String get careerInternship => 'Career & Internship';

  @override
  String get sportsWellness => 'Sports & Wellness';

  @override
  String get campusLife => 'Campus Life & Arts';

  @override
  String get priorityAlerts => 'Campus Alerts';

  @override
  String get searchPlaceholder => 'Search events, topics, locations...';

  @override
  String get filterByCategory => 'All Categories';

  @override
  String get filterByDate => 'Date';

  @override
  String get noEventsFound => 'No events scheduled';

  @override
  String get noEventsFoundSubtitle =>
      'Check back later or adjust your search filter to see more campus activities.';

  @override
  String get eventDetails => 'Event Details';

  @override
  String get dateAndTime => 'Date & Time';

  @override
  String get location => 'Location';

  @override
  String get organizer => 'Organized By';

  @override
  String get aboutEvent => 'About This Event';

  @override
  String get registration => 'Registration';

  @override
  String get registerNow => 'Register for Event';

  @override
  String get cancelRegistration => 'Cancel Registration';

  @override
  String get registrationConfirmed => 'Registered';

  @override
  String get eventFull => 'Event is Full';

  @override
  String get noRegistrationRequired => 'No Registration Required';

  @override
  String get saveEvent => 'Bookmark Event';

  @override
  String get unsaveEvent => 'Remove Bookmark';

  @override
  String get shareEvent => 'Share Event';

  @override
  String get setReminder => 'Set Calendar Reminder';

  @override
  String get reminderSet => 'Reminder scheduled for this event';

  @override
  String get calendarTitle => 'Campus Calendar';

  @override
  String get notificationsTitle => 'Notifications';

  @override
  String get markAllAsRead => 'Mark all as read';

  @override
  String get noNotifications => 'No notifications yet';

  @override
  String get noNotificationsSubtitle =>
      'You are all caught up! Campus updates and reminders will appear here.';

  @override
  String get savedEventsTitle => 'Saved Events';

  @override
  String get noSavedEvents => 'No saved events';

  @override
  String get noSavedEventsSubtitle =>
      'Tap the bookmark icon on any event to save it for easy access later.';

  @override
  String get profileTitle => 'Student Profile';

  @override
  String get editProfile => 'Edit Profile';

  @override
  String get saveChanges => 'Save Changes';

  @override
  String get studentId => 'Student ID';

  @override
  String get department => 'Department / Major';

  @override
  String get phoneNumber => 'Phone Number';

  @override
  String get email => 'Email Address';

  @override
  String get fullName => 'Full Name';

  @override
  String get settingsTitle => 'Settings';

  @override
  String get language => 'Language';

  @override
  String get english => 'English';

  @override
  String get khmer => 'ភាសាខ្មែរ (Khmer)';

  @override
  String get appearance => 'Appearance';

  @override
  String get themeSystem => 'System Default';

  @override
  String get themeLight => 'Light Theme';

  @override
  String get themeDark => 'Dark Theme';

  @override
  String get notificationPreferences => 'Notification Preferences';

  @override
  String get eventAnnouncements => 'Campus Event Announcements';

  @override
  String get upcomingReminders => 'Upcoming Event Reminders';

  @override
  String get registrationUpdates => 'Registration Updates & Passes';

  @override
  String get generalAlerts => 'Urgent Campus Alerts';

  @override
  String get account => 'Account';

  @override
  String get login => 'Sign In';

  @override
  String get register => 'Create Account';

  @override
  String get logout => 'Sign Out';

  @override
  String get logoutConfirm => 'Are you sure you want to sign out?';

  @override
  String get cancel => 'Cancel';

  @override
  String get confirm => 'Confirm';

  @override
  String get password => 'Password';

  @override
  String get confirmPassword => 'Confirm Password';

  @override
  String get forgotPassword => 'Forgot Password?';

  @override
  String get forgotPasswordSubtitle =>
      'Enter your university email to receive password reset instructions.';

  @override
  String get sendResetLink => 'Send Reset Link';

  @override
  String get alreadyHaveAccount => 'Already have an account? Sign In';

  @override
  String get dontHaveAccount => 'Don\'t have an account? Sign Up';

  @override
  String get onboardingTitle1 => 'Stay Ahead of Campus Life';

  @override
  String get onboardingDesc1 =>
      'Never miss critical academic announcements, exam schedules, or university emergencies with direct real-time alerts.';

  @override
  String get onboardingTitle2 => 'Discover Events & Workshops';

  @override
  String get onboardingDesc2 =>
      'Explore hackathons, sports tournaments, career fairs, and cultural festivities happening right across your campus.';

  @override
  String get onboardingTitle3 => 'Reserve Seats & Manage Schedules';

  @override
  String get onboardingDesc3 =>
      'One-tap registrations, personalized bookmarks, and seamless calendar integration designed specifically for busy students.';

  @override
  String get getStarted => 'Get Started';

  @override
  String get skip => 'Skip';

  @override
  String get next => 'Next';

  @override
  String get retry => 'Try Again';

  @override
  String get errorOccurred => 'Something went wrong';

  @override
  String get connectionError =>
      'Unable to connect to server. Please check your network.';

  @override
  String registeredCount(Object count) {
    return '$count Students Attending';
  }
}
