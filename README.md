# Arch Technologies — Android App Development Internship
### Monthly Task Assignment 1 (Month 1 Submission)

[![Internship Domain](https://img.shields.io/badge/Domain-Android%20App%20Development-blue.svg)](#)
[![Company](https://img.shields.io/badge/Company-Arch%20Technologies-orange.svg)](#)
[![Candidate](https://img.shields.io/badge/Candidate-Rotana%20NOB-green.svg)](#)
[![University](https://img.shields.io/badge/University-Asia%20Euro%20University-blueviolet.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](#)

---

## 👨‍💻 Candidate & Submission Details
- **Candidate Name:** **Rotana NOB**
- **Internship Domain:** Android App Development
- **University:** Asia Euro University
- **Email:** `nobrothana180703@gmail.com`
- **Phone:** `+855 87 986 045`
- **Submission Destination:** `submissions.archtech@gmail.com`
- **Submission Title:** `Rotana_Nob_AndroidAppDevelopment_Month1`

---

## 📁 Repository Overview

This repository houses two complete, production-grade applications built for the **Arch Technologies Remote Android App Development Internship**:

```tree
Arch-Technologies_MobileApp/
├── Task-1-College-Alert-Flutter/         # Task 1: College Alert Application
│   └── college-alert/
│       ├── mobile/                       # Flutter Mobile Client (Riverpod, GoRouter, Dio)
│       ├── backend/                      # NestJS REST API (Prisma ORM, PostgreSQL)
│       └── docs/                         # Reports & Technical Architecture
│
├── Task-2-Ecommerce-Kotlin/              # Task 2: ShopSphere E-Commerce Application
│   ├── android/                          # Native Android Kotlin Client (Jetpack Compose, Room)
│   ├── backend/                          # NestJS REST API (Prisma ORM, PostgreSQL)
│   └── docs/                             # Technical Specs, Reports & DB Design
│
├── docs/                                 # Official Month 1 Master Submission Report
│   └── Rotana_Nob_AndroidAppDevelopment_Month1_Final_Report.md
│
├── run-all-tests.bat                     # Automated Test Runner (One-Click)
├── run-all-tests.ps1                     # PowerShell Test Verification Script
├── start-task1.bat                       # Launch Task 1 NestJS Backend (Port 3000)
├── start-task2.bat                       # Launch Task 2 ShopSphere Backend (Port 3001)
└── README.md                             # Repository Master Documentation
```

---

## 📌 Task 1: College Alert Application

> **Project Objective:** A comprehensive campus event notification and alert system helping university students stay informed about academic deadlines, campus events, workshops, sports, and emergency announcements.

### Key Features:
- 🔔 **Real-Time Notification System:** Push alert simulation and categorized event inbox (Academic, Sports, Cultural, Emergency).
- 📅 **Interactive Event Calendar:** Day/month calendar views with bookmarking and schedule synchronization.
- 🌐 **Native Bilingual Localization:** English (`en`) & Khmer (`km`) support with seamless runtime switching.
- 🔐 **JWT Authentication:** Access and refresh token rotation with role-based authorization (Student & Admin).
- 💾 **PostgreSQL Database:** Powered by Prisma ORM with pre-seeded campus event categories and test accounts.

### Tech Stack:
- **Mobile:** Flutter 3.x, Dart, Riverpod 2.6, GoRouter, Dio, Flutter Secure Storage.
- **Backend:** NestJS 10, TypeScript, Prisma ORM, PostgreSQL 17, Swagger OpenAPI.

👉 Detailed technical report: [`Task-1-College-Alert-Flutter/college-alert/docs/INTERNSHIP_SUBMISSION_REPORT.md`](./Task-1-College-Alert-Flutter/college-alert/docs/INTERNSHIP_SUBMISSION_REPORT.md)

---

## 📌 Task 2: ShopSphere — Mobile E-Commerce Application

> **Project Objective:** An advanced mobile-only e-commerce marketplace where registered users can securely buy and sell products, manage carts, list inventory, and perform secure simulated checkouts.

### Key Features:
- 🛒 **Buyer Experience:** Dynamic product catalog, multi-criteria filtering, search, cart management, and order tracking.
- 🏪 **Seller Studio ("Sell Your Product"):** In-app listing creator allowing users to upload products, define conditions (Brand New, Like New, Good), and track sales.
- 💳 **Secure Payment Processing:** Multi-tier payment simulation supporting Credit/Debit cards with LUHN validation, CVV checks, end-to-end tokenization, and Cash on Delivery (COD).
- 📴 **Offline-First Room Caching:** Room Database SQLite cache with repository pattern ensuring instant load times and offline discovery.
- 🛡️ **Data Security:** Argon2/bcrypt password hashing, rate limiting, and parameter validation.

### Tech Stack:
- **Mobile:** 100% Native Android Kotlin, Jetpack Compose, Coroutines & Flow, Room Database, Retrofit 2, MVVM.
- **Backend:** NestJS 10, TypeScript, Prisma ORM, PostgreSQL 17, Swagger OpenAPI.

👉 Detailed technical report: [`Task-2-Ecommerce-Kotlin/docs/PROJECT_REPORT.md`](./Task-2-Ecommerce-Kotlin/docs/PROJECT_REPORT.md)

---

## 🚀 Quick Start Guide for Evaluators

### 1. Database Setup (PostgreSQL)
Ensure PostgreSQL is running on `localhost:5432`:
```bash
# Task 1 Database
createdb college_alert_db

# Task 2 Database
createdb shopsphere_db
```

### 2. Task 1 Backend & Mobile
```bash
# Start Backend (Port 3000)
cd Task-1-College-Alert-Flutter/college-alert/backend
npm install
npx prisma db push
npx ts-node prisma/seed.ts
npm run start:dev

# Run Mobile Client
cd ../mobile
flutter pub get
flutter run
```

### 3. Task 2 Backend & Android
```bash
# Start Backend (Port 3001)
cd Task-2-Ecommerce-Kotlin/backend
npm install
npx prisma db push
npx ts-node prisma/seed.ts
npm run start:dev

# Run Android Client
cd ../android
./gradlew assembleDebug
```

---

## 🧪 Testing & Verification
Both projects include rigorous automated test suites:
- **Task 1 Mobile:** `flutter test` (8 Tests Passed)
- **Task 1 Backend:** `npm test` (6 Tests Passed)
- **Task 2 Backend:** `npm test` (12 Tests Passed)
- **Unified One-Click Runner:** Run `.\run-all-tests.bat` or `.\run-all-tests.ps1` to test everything across both projects!

---

## 📜 Submission Compliance
- [x] Both Task 1 and Task 2 fully implemented and structured.
- [x] Clear Clean Architecture / MVVM implemented on both projects.
- [x] Word/PDF conversion-ready reports created in `docs/` directories.
- [x] Front page details included: Full Name, Internship Domain, Email, and Phone.
- [x] Code tested with zero critical compile or lint errors.

---
*Created with dedication by Rotana NOB for the Arch Technologies Internship Program.*
