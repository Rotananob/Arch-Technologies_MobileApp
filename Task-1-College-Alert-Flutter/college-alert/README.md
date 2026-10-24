# 🎓 College Alert — Campus Notifications & Event Hub
**Android App Development Internship Task 1 — Arch Technologies**
*Candidate:* **Rotana Nob**  
*Internship Domain:* **Android App Development**  
*Academic Period:* **Month 1 (October 2026)**

---

## 📌 1. Project Overview

**College Alert** is a full-stack, enterprise-grade Android application designed specifically for college and university students to stay informed about campus events, academic announcements, midterm examination schedules, student activities, and emergency alerts in real time.

Built with an intentional, academic human-designed interface, College Alert eliminates the clutter of low-quality generic templates by delivering a focused, dignified mobile experience paired with a robust **NestJS + PostgreSQL + Prisma ORM** backend.

---

## 🎯 2. Project Objectives

1. **Keep Students Informed**: Deliver immediate campus alerts, exam schedules, and department notices.
2. **Promote Student Engagement**: Streamline event discovery across Academic, Tech Workshops, Sports, Career, and Cultural domains.
3. **Seamless Schedule Management**: Provide one-tap event registrations, bookmarked activities, and an interactive in-app academic calendar.
4. **Bilingual Accessibility**: Full first-class bilingual support for **English** (default) and **ភាសាខ្មែរ (Khmer)**.
5. **Real Engineering Rigor**: Production architecture with Riverpod state management, GoRouter, JWT dual-token authentication, Prisma ORM, and comprehensive automated test suites.

---

## 🛠️ 3. Technology Stack

### Mobile Client (Android)
- **Framework**: Flutter 3.47.8 / Dart 3.13.7
- **Platform**: Android
- **State Management**: Flutter Riverpod 2.6.1
- **Navigation & Routing**: GoRouter 14.8.1 (with StatefulShellRoute persistent bottom navigation)
- **Network / HTTP**: Dio 5.11.1 (with auto-refresh interceptors & token injection)
- **Local Preferences**: SharedPreferences 2.5.6
- **Secure Storage**: Flutter Secure Storage 9.2.4 (Android EncryptedSharedPreferences)
- **Typography & UI**: Google Fonts (Noto Sans Khmer + Inter), Material Design 3
- **Localization**: Native Flutter Localization (`.arb` files for `en` and `km`)

### Backend Services
- **Framework**: NestJS 10.4 with TypeScript
- **Database**: PostgreSQL 17 (Relational Database)
- **ORM & Migrations**: Prisma ORM 5.22
- **Authentication**: JWT (Access Token 15m + Refresh Token 7d), bcrypt password hashing (10 salt rounds)
- **API Documentation**: Swagger OpenAPI 3.0 (`/api/docs`)
- **Security & Reliability**: Throttler (Rate Limiting), CORS, Class-Validator, Class-Transformer
- **Automated Testing**: Jest 29.7 & ts-jest (Unit & Service tests)

---

## 📂 4. Repository Structure

```
college-alert/
├── mobile/                     # Flutter Android Application
│   ├── lib/
│   │   ├── app/                # App configuration, theme, router, providers
│   │   │   ├── app.dart
│   │   │   ├── providers.dart
│   │   │   ├── router.dart
│   │   │   ├── scaffold_with_nav_bar.dart
│   │   │   └── theme/          # AppColors & AppTheme (Light & Dark)
│   │   ├── core/               # Reusable infrastructure & UI widgets
│   │   │   ├── constants/      # ApiConstants
│   │   │   ├── network/        # DioClient & interceptors
│   │   │   ├── storage/        # StorageService
│   │   │   └── widgets/        # EventCard, StatusBadge, EmptyState, LoadingView
│   │   ├── features/           # Feature-driven module architecture
│   │   │   ├── authentication/ # Login, Register, Forgot Password
│   │   │   ├── home/           # Dashboard, Priority alerts, Featured hero
│   │   │   ├── events/         # Search, Filter, Event Details, Register
│   │   │   ├── calendar/       # Monthly grid view, scheduled day filter
│   │   │   ├── notifications/  # Notification center, mark read, unread count
│   │   │   ├── saved_events/   # Bookmarks screen & unsave actions
│   │   │   ├── profile/        # Student ID badge, profile editor
│   │   │   ├── settings/       # Language (EN/KH), Theme (Light/Dark/System)
│   │   │   ├── splash/         # Splash branding & auth redirect
│   │   │   └── onboarding/     # 3-page student walkthrough
│   │   ├── l10n/               # English & Khmer ARB localization files
│   │   └── main.dart
│   ├── test/                   # Flutter Unit & Widget tests
│   └── pubspec.yaml
├── backend/                    # NestJS REST API Server
│   ├── prisma/
│   │   ├── schema.prisma       # Relational database schema
│   │   └── seed.ts             # Realistic university seed data
│   ├── src/
│   │   ├── admin/              # Event administration & broadcasts
│   │   ├── auth/               # JWT authentication, guards & strategies
│   │   ├── categories/         # Campus category management
│   │   ├── events/             # CRUD, registration, save, filtering
│   │   ├── health/             # System health check endpoint
│   │   ├── notifications/      # In-app notifications & read states
│   │   ├── prisma/             # Global Prisma service
│   │   ├── users/              # Student profile & notification preferences
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/                   # Jest automated test suites
│   ├── .env                    # Active environment configuration
│   ├── .env.example
│   └── package.json
└── docs/
    ├── PROJECT_REPORT.md       # Full engineering implementation report
    └── INTERNSHIP_SUBMISSION_REPORT.md # Official Arch Technologies submission report
```

---

## 🚀 5. Prerequisites & Quick Start

### Prerequisites
- Flutter SDK (3.47+) & Dart SDK (3.13+)
- Node.js (v20+ or v24+) & npm
- PostgreSQL 17 running on localhost:5432
- Android Studio / Android SDK (API 34+)

---

## 🖥️ 6. How to Run the Backend

```powershell
# 1. Navigate to backend directory
cd "college-alert/backend"

# 2. Install dependencies
npm install

# 3. Synchronize database schema with PostgreSQL
npx prisma db push

# 4. Seed database with realistic campus events, categories, and student accounts
npx ts-node prisma/seed.ts

# 5. Start development server
npm run start:dev
```
- **Backend API**: `http://localhost:3000`
- **Swagger Documentation**: `http://localhost:3000/api/docs`
- **Health Check**: `http://localhost:3000/health`

### Seed Demo Accounts
- **Student User**: `rotana.nob@university.edu` | Password: `Password123!`
- **Administrator**: `admin@collegealert.edu` | Password: `AdminPassword2026!`

---

## 📱 7. How to Run the Mobile Application

```powershell
# 1. Navigate to mobile directory
cd "college-alert/mobile"

# 2. Get dependencies
flutter pub get

# 3. Run on connected Android device or emulator
flutter run
```

---

## 🧪 8. How to Run Tests

### Backend Jest Tests:
```powershell
cd "college-alert/backend"
npm test
```
*Result: 2 test suites passed, 6 unit tests passed (AuthService, EventsService).*

### Flutter Mobile Tests:
```powershell
cd "college-alert/mobile"
flutter test
```
*Result: 4 test suites passed (EventCard widget, StatusBadge, EmptyStateView, LoadingView).*

---

## 🔔 9. Firebase Cloud Messaging (FCM) Configuration

In production, register the app package `com.collegealert.app` in the Firebase Console:
1. Download `google-services.json` and place it in `mobile/android/app/`.
2. Configure Firebase Server Key / Admin SDK in backend `.env` (`FIREBASE_SERVICE_ACCOUNT_KEY`).
3. The database model `NotificationPreference` includes the `fcmToken` column to store student device tokens for targeted push delivery.

---

## ⚖️ 10. Known Limitations

- **FCM Real Device Delivery**: Requires paid Google Play Services account on a physical device. Currently, in-app notifications and background simulated notifications function seamlessly across both online and offline states.
- **Image Uploads**: Event and profile avatars currently consume CDN image URLs. Cloudinary or AWS S3 direct file upload bucket can be attached for custom photo uploads in Month 2.

---

*Project prepared and verified by **Rotana Nob** for Arch Technologies Internship.*
