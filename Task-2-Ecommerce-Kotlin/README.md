# ShopSphere — Native Android E-Commerce Application

> **Arch Technologies — Android App Development Remote Internship (Task 2)**  
> **Candidate**: Rotana Nob  
> **Submission Deadline**: October 27, 2026  

---

## Overview
**ShopSphere** is a modern, production-grade native Android marketplace application engineered using **Kotlin**, **Jetpack Compose**, **Material 3**, and a dedicated **NestJS + PostgreSQL** backend. The platform provides a full peer-to-peer (C2C) ecosystem where users can discover products, purchase items securely, and list their own products for sale.

---

## Key Features
- **Modern Human-Crafted UI**: Designed strictly using Material 3 guidelines; free of generic templates, artificial decorations, or emojis.
- **Full Localization (English & Khmer)**: Natural string resources (`res/values/strings.xml` and `res/values-km/strings.xml`) with in-app language switching and persistent storage.
- **Product Discovery**: Search, category chips with vector icons, price sorting, availability filtering, and detailed product profiles.
- **Authoritative Shopping Cart**: Server-enforced price verification, delivery fee calculations, and real-time stock checks.
- **Checkout & Payment Sandbox**: Multi-step checkout with delivery address form and simulated payment gateway (Pending, Success, Failed, Cancelled).
- **C2C Selling Center**: Registered users can publish listings, specify conditions, prices, stock, and view customer sales orders.
- **Order Lifecycle**: Transparent order tracking (Pending -> Confirmed -> Processing -> Shipped -> Delivered).
- **Dark & Light Mode**: Fluid dynamic theming with persistent preference.

---

## Tech Stack
- **Android**: Kotlin 2.0, Jetpack Compose, Material 3, AndroidX ViewModel, Navigation Compose, Retrofit 2, OkHttp 4, Kotlinx Serialization, Coil, Room SQLite, Preferences DataStore.
- **Backend**: NestJS, TypeScript, PostgreSQL 17, Prisma ORM, Passport JWT, Swagger/OpenAPI.

---

## Getting Started

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run database migrations and seed data:
   ```bash
   npx prisma db push
   npm run prisma:seed
   ```
4. Start the backend server on port 3001:
   ```bash
   npm run start:dev
   ```
   - API Base URL: `http://localhost:3001` (or `http://10.0.2.2:3001` on Android emulator)
   - Interactive Swagger API Explorer: `http://localhost:3001/api/docs`

### 2. Android Application Setup
1. Open `Task-2-Ecommerce-Kotlin/android` in **Android Studio**.
2. Sync Gradle files (All caches and build artifacts are routed safely to Drive D via `$env:GRADLE_USER_HOME = "D:\.gradle"`).
3. Run on an Android emulator (API 26+) or connected physical device.

### 3. Running Tests
- **Android Unit Tests**:
   ```bash
   cd android
   ./gradlew testDebugUnitTest
   ```
- **Backend Tests**:
   ```bash
   cd backend
   npm test
   ```

---

## Documentation & Reports
- [Architecture Details](docs/architecture.md)
- [Database Relational Design](docs/database-design.md)
- [API Documentation](docs/api-documentation.md)
- [Testing Strategy](docs/testing.md)
- [Official Internship Submission Report](docs/PROJECT_REPORT.md)
