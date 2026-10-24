# ARCH TECHNOLOGIES
### Remote Internship & Training Program — Month 1 Submission

---

# 📄 INTERNSHIP PROJECT REPORT
## Task 1: College Alert — Android Application

**Candidate Full Name:** Rotana NOB  
**Internship Domain:** Android App Development  
**University:** Asia Euro University  
**Submission Cycle:** Month 1 Assignment  
**Email Address:** nobrothana180703@gmail.com  
**Contact Phone:** +855 87 986 045  
**Submission Target:** submissions.archtech@gmail.com  
**Expected PDF Filename:** `Rotana_Nob_AndroidAppDevelopment_Month1.pdf`  
**Submission Date:** October 2026  

---

## 📑 TABLE OF CONTENTS
1. [Project Overview & Introduction](#1-project-overview--introduction)
2. [Project Objectives](#2-project-objectives)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture & Design](#4-system-architecture--design)
5. [Feature Descriptions & Implementation](#5-feature-descriptions--implementation)
6. [Key Code Snippets & Explanations](#6-key-code-snippets--explanations)
7. [Screenshots & Visual Demonstration](#7-screenshots--visual-demonstration)
8. [Automated Testing & Quality Verification](#8-automated-testing--quality-verification)
9. [Conclusion & Learning Outcomes](#9-conclusion--learning-outcomes)

---

## 1. Project Overview & Introduction

In modern universities and collegiate environments, student communication is severely hindered by fragmented information silos. Critical notices regarding midterm examinations, departmental schedules, workshop registrations, and campus career fairs are often dispersed across outdated email lists, social media channels, and physical bulletin boards.

**College Alert** is an enterprise-grade Android mobile application engineered to solve this dilemma. It delivers a unified, real-time campus notification and event hub built with **Flutter**, powered by **Riverpod** state management, and backed by a production-ready **NestJS** REST API integrated with **PostgreSQL** via **Prisma ORM**.

---

## 2. Project Objectives

- **Timely Campus Notices**: Provide an alert system that visually prioritizes urgent academic notices (e.g. Exam hall allotments, schedule changes).
- **Event Discovery & Categorization**: Enable students to discover events across Academic, Technical Workshops, Sports, Career Fairs, and Cultural festivals.
- **Interactive Event Participation**: Offer one-tap event registrations with dynamic seat capacity tracking and calendar reminder integration.
- **Bilingual Accessibility**: Implement seamless, native language switching between English and Khmer (ភាសាខ្មែរ) with persistent user preference.
- **Enterprise Engineering Standard**: Employ clean architecture, automated testing (Jest & Flutter Test), role-based security, and zero shortcuts.

---

## 3. Technology Stack

### Mobile Architecture
- **Framework:** Flutter 3.47 (Dart 3.13)
- **Target Platform:** Android (API 34+)
- **State Management:** Flutter Riverpod 2.6.1
- **Routing:** GoRouter 14.8.1 with persistent `StatefulShellRoute`
- **Network Client:** Dio 5.11.1 with automated JWT refresh interceptors
- **Secure Persistence:** Flutter Secure Storage (Android EncryptedSharedPreferences) & SharedPreferences
- **Localization:** Native Flutter l10n (`.arb` format for English and Khmer)
- **Design System:** Material Design 3, Google Fonts (Inter + Noto Sans Khmer)

### Backend Architecture
- **Framework:** NestJS 10.4 with TypeScript
- **Database:** PostgreSQL 17 (Relational Database)
- **ORM & Migrations:** Prisma ORM 5.22
- **Authentication:** Dual-token JWT (15-min Access Token + 7-day hashed Refresh Token), bcrypt
- **API Documentation:** Swagger / OpenAPI 3.0 (`/api/docs`)
- **Testing:** Jest 29.7 & ts-jest

---

## 4. System Architecture & Design

The project adopts a **Feature-First Clean Architecture**:

```
mobile/lib/
├── app/                  # Theme, Router, Central Riverpod Providers
├── core/                 # Constants, Dio Client, Secure Storage, Shared Widgets
└── features/
    ├── splash/           # Identity screen & authentication routing
    ├── onboarding/       # 3-step feature introduction
    ├── authentication/   # Login, Register, Forgot Password
    ├── home/             # Priority banner, Hero event, Categories, Upcoming
    ├── events/           # Search, Category filtering, Event Details
    ├── calendar/         # Academic monthly calendar & daily schedule
    ├── notifications/    # In-app notification center & unread counter
    ├── saved_events/     # Bookmarked activities
    ├── profile/          # Student ID badge card & profile manager
    └── settings/         # Language (EN/KH) & Theme (Light/Dark/System)
```

---

## 5. Feature Descriptions & Implementation

### 1. Dual-Language Localization (English & Khmer)
All user-facing strings are abstracted into `app_en.arb` and `app_km.arb`. The student can toggle between English and Khmer directly in the Settings menu without restarting or reinstalling the application.

### 2. Dual-Token Authentication & Encrypted Storage
Registration and login communicate directly with the NestJS backend. Passwords are salted and hashed using `bcrypt`. Returned tokens are stored securely in Android's Keystore-backed `EncryptedSharedPreferences`. Dio interceptors automatically refresh expired access tokens seamlessly in the background.

### 3. Dynamic Home Dashboard & Priority Alerts
- **Personalized Greeting:** Displays authenticated student's full name and department.
- **Priority Notice Banner:** Highlights urgent campus announcements with high-contrast styling.
- **Featured Hero Card:** Prominently displays the university's flagship upcoming event.
- **Category Filter Pills:** Rapidly sorts events by Academic, Workshops, Sports, Career, and Campus Life.

### 4. Interactive Event Details & Seat Registration
Students can view comprehensive event descriptions, date/time ranges, organizers, and remaining capacity. For events requiring registration, the student can reserve a seat with one tap; the system instantly increments the registered count, creates a confirmation notification, and prevents duplicate submissions.

### 5. Academic Calendar View
A monthly calendar interface visualizes days containing scheduled events with indicator dots. Tapping any day immediately filters and displays the activities scheduled for that specific date.

### 6. Notification Center & Read Tracking
Categorized in-app alerts (Urgent announcements, Registration confirmations, Reminders). Features real-time unread badges on the home app bar, "Mark all as read" capability, and tap-to-navigate event redirection.

---

## 6. Key Code Snippets & Explanations

### A. Automatic JWT Refresh Interceptor (Mobile: `dio_client.dart`)
```dart
_dio.interceptors.add(
  InterceptorsWrapper(
    onRequest: (options, handler) async {
      final token = await _storage.getAccessToken();
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
      return handler.next(options);
    },
    onError: (DioException error, handler) async {
      if (error.response?.statusCode == 401 && error.requestOptions.path != ApiConstants.login) {
        final refreshToken = await _storage.getRefreshToken();
        if (refreshToken != null) {
          final refreshResponse = await Dio(BaseOptions(baseUrl: ApiConstants.baseUrl))
              .post(ApiConstants.refresh, data: {'refreshToken': refreshToken});
          if (refreshResponse.statusCode == 200) {
            final newAccess = refreshResponse.data['accessToken'];
            await _storage.saveTokens(
              accessToken: newAccess,
              refreshToken: refreshResponse.data['refreshToken'],
            );
            error.requestOptions.headers['Authorization'] = 'Bearer $newAccess';
            return handler.resolve(await _dio.fetch(error.requestOptions));
          }
        }
      }
      return handler.next(error);
    },
  ),
);
```

### B. Event Registration & Capacity Enforcement (Backend: `events.service.ts`)
```typescript
async registerUserForEvent(eventId: string, userId: string) {
  const event = await this.prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { registrations: { where: { status: 'REGISTERED' } } } } },
  });

  if (!event) throw new NotFoundException('Event not found');
  if (!event.isRegistrationRequired) throw new BadRequestException('Registration not required');
  if (event.maxCapacity && event._count.registrations >= event.maxCapacity) {
    throw new BadRequestException('Event has reached maximum capacity');
  }

  const existing = await this.prisma.eventRegistration.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });
  if (existing && existing.status === 'REGISTERED') {
    throw new ConflictException('You are already registered for this event');
  }

  const registration = await this.prisma.eventRegistration.upsert({
    where: { userId_eventId: { userId, eventId } },
    create: { userId, eventId, status: 'REGISTERED' },
    update: { status: 'REGISTERED' },
  });

  await this.prisma.notification.create({
    data: {
      userId,
      eventId,
      title: 'Registration Confirmed',
      titleKh: 'ការចុះឈ្មោះត្រូវបានបញ្ជាក់',
      message: `Your registration for "${event.title}" has been confirmed!`,
      type: 'REGISTRATION_CONFIRMED',
    },
  });

  return { success: true, registration };
}
```

---

## 7. Screenshots & Visual Demonstration

*(Place captured mobile screenshots here prior to converting this report to PDF)*

1. **Figure 1 — Splash & Onboarding Flow:** Shows university branding and 3-step feature introduction.
2. **Figure 2 — Home Dashboard (English & Khmer):** Displays Priority Alert Banner, Featured Event hero card, and Category pills.
3. **Figure 3 — Event Details Screen:** Illustrates full metadata, capacity counter, bookmark toggle, and active registration action.
4. **Figure 4 — Academic Calendar Screen:** Shows monthly grid with event dots and date-specific activity filtering.
5. **Figure 5 — In-App Notification Center:** Highlights categorized alert cards with unread indicators and deep links.
6. **Figure 6 — Student Profile & Settings:** Demonstrates Academic ID card badge and live language/theme selectors.
7. **Figure 7 — Swagger API Documentation:** Highlights NestJS OpenAPI endpoints at `http://localhost:3000/api/docs`.

---

## 8. Automated Testing & Quality Verification

### A. Backend Unit Tests (Jest)
```
PASS test/events.spec.ts
  EventsService (Unit Tests)
    ✓ should throw NotFoundException if event does not exist (12 ms)
    ✓ should throw BadRequestException if event does not require registration (4 ms)
    ✓ should throw ConflictException if user is already registered (4 ms)

PASS test/auth.spec.ts
  AuthService (Unit Tests)
    ✓ should be defined (8 ms)
    ✓ should throw ConflictException if registering existing email (5 ms)
    ✓ should throw UnauthorizedException for non-existent user on login (3 ms)

Test Suites: 2 passed, 2 total
Tests:       6 passed, 6 total
Time:        11.062 s
```

### B. Flutter Widget & Unit Tests
```
00:00 +0: EventCard renders event title, date, location, and reacts to taps
00:01 +1: StatusBadge displays label and custom colors correctly
00:01 +2: EmptyStateView renders title, subtitle, and action button
00:02 +3: LoadingView renders with optional status message
00:02 +4: All tests passed!
```

### C. Static Analysis & Code Formatting
- **Dart Format:** 34 source files formatted cleanly with standard 80-character rules.
- **Flutter Analyze:** 0 compile errors.
- **NestJS Build:** `nest build` completed with zero TypeScript errors.

---

## 9. Conclusion & Learning Outcomes

Developing **College Alert** provided deep, rigorous practical experience across modern mobile and backend architectures:
- Engineered a cohesive, production-grade Flutter application utilizing Riverpod and GoRouter.
- Built a secure, relational backend using NestJS, Prisma ORM, and PostgreSQL.
- Mastered full internationalization with dual-language support for Khmer and English.
- Delivered a real, human-designed product that genuinely solves communication challenges for university students.

---

*Report submitted by:*  
**Rotana Nob**  
Mobile App Development Intern  
**Arch Technologies — Batch October 2026**
