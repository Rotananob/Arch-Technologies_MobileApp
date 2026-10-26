# Arch Technologies — Remote Mobile App Development Internship
### Month 1 Final Submission Repository (October 2026)

[![Internship Domain](https://img.shields.io/badge/Domain-Android%20App%20Development-blue.svg)](#)
[![Company](https://img.shields.io/badge/Company-Arch%20Technologies-orange.svg)](#)
[![Candidate](https://img.shields.io/badge/Candidate-Rotana%20NOB-green.svg)](#)
[![University](https://img.shields.io/badge/University-Asia%20Euro%20University-blueviolet.svg)](#)
[![Tests Passing](https://img.shields.io/badge/Automated%20Tests-35%2F35%20Passed-brightgreen.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](#)

---

## 👨‍💻 Developer & Project Credentials
- **Candidate Name:** **Rotana NOB**
- **Internship Domain:** Android App Development
- **Institution:** Asia Euro University (AEU)
- **Field of Study:** Computer Science & Software Engineering
- **Email:** `nobrothana180703@gmail.com`
- **Phone:** `+855 87 986 045`
- **GitHub:** [https://github.com/Rotananob](https://github.com/Rotananob)
- **Repository:** [https://github.com/Rotananob/Arch-Technologies_MobileApp](https://github.com/Rotananob/Arch-Technologies_MobileApp)

---

## 📁 Repository Architecture

This repository contains two complete, enterprise-grade applications developed for Month 1 of the **Arch Technologies Remote Mobile App Development Internship**:

```tree
Arch-Technologies_MobileApp/
├── Task-1-College-Alert-Flutter/         # Task 1: College Alert Application
│   └── college-alert/
│       ├── mobile/                       # Flutter Mobile Client (Riverpod 2.6, GoRouter, ARB Localizations)
│       ├── backend/                      # NestJS REST API (Prisma ORM, PostgreSQL 17)
│       └── docs/                         # Architecture & Technical Documentation
│
├── Task-2-Ecommerce-Kotlin/              # Task 2: ShopSphere E-Commerce Application
│   ├── android/                          # Native Android Kotlin Client (Jetpack Compose, Room DB, MVVM)
│   ├── backend/                          # NestJS REST API (Prisma ORM, PostgreSQL 17)
│   └── docs/                             # Architecture & Database Schema
│
├── docs/                                 # Project Documentation & High-Resolution UI Showcase
│   ├── screenshots/                      # 9 Full Viewport UI Screenshots (Tasks 1 & 2)
│   └── Rotana_Nob_AndroidAppDevelopment_Month1_Final_Report.md
│
├── .gitignore                            # Multi-Project Git Ignore Rules
└── README.md                             # Repository Master Documentation
```

---

## 📌 Task 1: College Alert Application

> **Overview:** A centralized campus event notification, calendar, and urgent safety alert system engineered to ensure university students stay informed regarding academic exams, departmental announcements, workshops, and career fairs.

### Key Engineering Features:
- 🔔 **Real-Time Notifications:** Push alert simulation with unread count badges and categorized emergency dispatches.
- 📅 **Campus Calendar & Bookmarks:** Interactive month/day schedule synchronizer with offline local bookmarking.
- 🌐 **Native Bilingual Localization:** Full English (`en`) and Khmer (`km`) support powered by Google Font *Kantumruy Pro* with an instant 1-tap language switch pill.
- 🔐 **JWT Authentication & Role Security:** Access and refresh token rotation with bcrypt password hashing.
- 📱 **Adaptive Viewport:** Responsive `NavigationRail` sidebar on wide desktop/tablet screens (&ge; 720px) and clean 1-line `NavigationBar` on mobile phones.
- 💾 **Relational Persistence:** PostgreSQL 17 database managed via Prisma ORM with comprehensive data seeding.

### Technology Stack:
- **Client:** Flutter 3.x, Riverpod 2.6, GoRouter, Kantumruy Pro typography, Material 3.
- **Backend:** NestJS, TypeScript, Prisma ORM, PostgreSQL 17, Swagger OpenAPI.

---

## 📌 Task 2: ShopSphere Mobile E-Commerce Application

> **Overview:** An advanced mobile marketplace where registered students can securely purchase academic supplies and list their own pre-owned textbooks and electronics through a peer-to-peer (C2C) seller studio.

### Key Engineering Features:
- 🛒 **Buyer Marketplace:** Dynamic catalog with instant search, condition filtering (`Brand New`, `Like New`, `Good`), and real-time cart badging.
- 🏪 **C2C Seller Studio ("Sell Your Product"):** In-app listing creator enabling students to upload photos, define prices, specify item conditions, and manage inventory.
- 💳 **PCI-DSS & Luhn Payment Safety Sandbox:** Multi-tier payment validation incorporating the **LUHN algorithm** (MOD 10 checksum), PAN card masking (`**** **** **** 1234`), and unique tokenized transaction hashes (`TXN-XXXXXXXX`).
- ⚡ **Concurrency-Safe Transactions:** Server-side atomic locks (`prisma.$transaction`) preventing overselling and double-spending.
- 📴 **Offline-First Room Caching:** Room SQLite database paired with repository architecture for instant offline discovery.

### Technology Stack:
- **Client:** 100% Native Android Kotlin, Jetpack Compose, Coroutines & StateFlow, Room DB, Retrofit 2, Material 3.
- **Backend:** NestJS, TypeScript, Prisma ORM, PostgreSQL 17, Swagger OpenAPI.

---

## 🚀 Quick Start Guide

### 1. Database Provisioning (PostgreSQL)
Ensure PostgreSQL is active on `localhost:5432`:
```bash
# Provision Task 1 Database
createdb college_alert_db

# Provision Task 2 Database
createdb shopsphere_db
```

### 2. Task 1 Backend & Mobile
```bash
# Start Backend (Port 3000)
cd Task-1-College-Alert-Flutter/college-alert/backend
npm install
npx prisma db push
npx ts-node prisma/seed.ts
npm run start

# Launch Frontend Client
cd ../mobile
flutter pub get
flutter run -d chrome
```

### 3. Task 2 Backend & Android
```bash
# Start Backend (Port 3001)
cd Task-2-Ecommerce-Kotlin/backend
npm install
npx prisma db push
npx ts-node prisma/seed.ts
npm run start

# Build & Run Android Client
cd ../android
./gradlew assembleDebug
```

---

## 🧪 Consolidated Automated Test Suite

Both projects feature comprehensive test suites with **100% pass rate**:

| Suite | Component | Framework / Tool | Test Count | Status |
|---|---|---|---|:---:|
| **Task 1** | Mobile Widgets & Business Logic | Flutter Test / WidgetTester | 8 Tests | ✅ **PASSED** |
| **Task 1** | Backend Auth & Events API | Jest / ts-jest | 6 Tests | ✅ **PASSED** |
| **Task 2** | Android Cart & Luhn Validation | JUnit 4 / Kotlin | 9 Tests | ✅ **PASSED** |
| **Task 2** | Backend Payments & Orders API | Jest / ts-jest | 12 Tests | ✅ **PASSED** |
| **Total** | **Unified Automation** | **Multi-Platform Runner** | **35 Tests** | ✅ **100% PASS** |

To execute the test suites:
```bash
# Task 1 Mobile & Backend Tests
cd Task-1-College-Alert-Flutter/college-alert/mobile && flutter test
cd ../backend && npm test

# Task 2 Android & Backend Tests
cd Task-2-Ecommerce-Kotlin/backend && npm test
cd ../android && ./gradlew test
```

---

## 📄 Project Documentation

- Detailed Technical Master Report: [`docs/Rotana_Nob_AndroidAppDevelopment_Month1_Final_Report.md`](./docs/Rotana_Nob_AndroidAppDevelopment_Month1_Final_Report.md)
- Complete UI Screenshots Showcase: [`docs/screenshots/`](./docs/screenshots/)

---
*Developed with engineering excellence by Rotana NOB — Asia Euro University.*
