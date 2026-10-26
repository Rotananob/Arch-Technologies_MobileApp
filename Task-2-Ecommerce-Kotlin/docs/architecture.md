# ShopSphere — System Architecture

## Overview
ShopSphere is a full-stack, native Android E-Commerce Marketplace application adhering strictly to Clean Architecture, modern Android standards (Jetpack Compose, Material 3, MVVM), and enterprise-grade backend infrastructure (NestJS, TypeScript, PostgreSQL, Prisma ORM).

```mermaid
graph TD
    subgraph "Android Native Client (Kotlin)"
        UI["Jetpack Compose UI (Material 3)"]
        VM["AndroidX ViewModel & StateFlow"]
        UC["Domain Models & Calculations"]
        REPO["Repository Layer (Auth, Product, Cart, Order)"]
        ROOM["Room Database (Cached Items)"]
        DS["Preferences DataStore (Auth Tokens & Language)"]
        RETROFIT["Retrofit & OkHttp (HTTP Client)"]
    end

    subgraph "Backend System (NestJS & Node.js)"
        REST["REST API Controllers (Swagger)"]
        GUARDS["JWT Auth & Role Guards"]
        SERVICES["Business Logic Services (Transactions, Stock Checks)"]
        PRISMA["Prisma ORM"]
    end

    subgraph "Data Storage"
        PG[("PostgreSQL 17 Database")]
    end

    UI --> VM
    VM --> UC
    UC --> REPO
    REPO --> ROOM
    REPO --> DS
    REPO --> RETROFIT
    RETROFIT <==>|HTTP / JSON (Port 3001)| REST
    REST --> GUARDS
    GUARDS --> SERVICES
    SERVICES --> PRISMA
    PRISMA <==>|SQL Transactions| PG
```

## Layers
1. **Presentation Layer**: Built with declarative Jetpack Compose. Utilizes uni-directional data flow (UDF) through ViewModels emitting immutable StateFlow states.
2. **Domain Layer**: Clean Kotlin business entities and calculations (CartSummary, Order, Product, Price checks) independent of frameworks.
3. **Data Layer**: 
   - Local: Room SQLite database for persistent offline cache and Preferences DataStore for tokens/locale.
   - Remote: Retrofit 2 with Kotlinx Serialization and OkHttp interceptors.
4. **Backend Infrastructure**:
   - NestJS architecture with modular separation of concerns.
   - Database transactions for concurrency-safe stock updates.
