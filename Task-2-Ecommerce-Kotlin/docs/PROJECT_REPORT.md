# 📱 INTERNSHIP PROJECT REPORT
# Task 2: Native Android E-Commerce Application — ShopSphere
### Arch Technologies Remote Mobile App Development Internship Program

---

## 👤 Front Page & Candidate Information
- **Intern Name**: Rotana Nob
- **Internship Domain**: Android App Development / Mobile App Development
- **Organization**: Arch Technologies
- **Submission Date**: October 2026
- **Submission File**: `Rotana_Nob_AndroidAppDevelopment_Month1.pdf`
- **Submission Target**: `submissions.archtech@gmail.com`

---

## 1. Executive Summary
ShopSphere is an advanced, production-grade native Android e-commerce application engineered using modern Kotlin, Jetpack Compose, Material 3, and Clean Architecture, supported by a dedicated NestJS and PostgreSQL REST API backend. The platform provides a full-featured peer-to-peer (C2C) and merchant marketplace where verified users can discover products, safely buy goods through an authoritative checkout pipeline, and list their own pre-owned or new items for sale.

---

## 2. Problem Statement & Project Objectives
### The Problem
Traditional student and campus communities often lack a centralized, transparent marketplace for exchanging textbooks, electronics, and study gear. Informal social media groups present significant risks: unverified seller identities, fraudulent transactions, lack of order history, and no authoritative inventory tracking.

### Project Objectives
1. **Human-Centric Commercial UX**: Deliver an interface designed with restrained, professional Material 3 guidelines without generic templates or AI-generated aesthetics.
2. **Native Android Standards**: Implement Jetpack Compose with declarative UI, AndroidX ViewModel, Navigation Compose, and Room local caching.
3. **Dual Localization**: Full support for English and natural Khmer Unicode (`values-km/strings.xml`) with in-app language switching and persistent preference storage.
4. **Authoritative Backend**: Enforce server-side price recalculation, concurrency-safe inventory decrement via SQL transactions, and secure JWT-based authentication.
5. **C2C Selling Capabilities**: Empower users to list items, upload photos, manage prices, and track buyer fulfillment.

---

## 3. Technology Stack

| Domain | Technology / Tool | Purpose |
|---|---|---|
| **Mobile OS** | Android Native (API 26 to 35) | Target operating system |
| **Language** | Kotlin 2.0 | Core programming language |
| **UI Toolkit** | Jetpack Compose & Material 3 | Modern declarative UI design system |
| **Architecture** | MVVM + Clean Architecture | Separation of Presentation, Domain, Data |
| **Networking** | Retrofit 2 + OkHttp 4 | Type-safe REST client with Auth Interceptor |
| **Serialization**| Kotlinx Serialization | Fast JSON parsing |
| **Image Loading** | Coil Compose | Asynchronous image caching |
| **Local Cache** | Room Database | Offline item persistence |
| **Preferences** | Jetpack DataStore | Persistent language, theme, and tokens |
| **Backend** | NestJS + TypeScript | Enterprise modular REST API |
| **Database** | PostgreSQL 17 + Prisma ORM | Relational schema with transactional locks |
| **Documentation**| Swagger / OpenAPI | Interactive API explorer on `/api/docs` |

---

## 4. System Architecture & Database Design
The application enforces strict separation between:
- **Presentation**: Composable screens (`HomeScreen`, `DiscoveryScreen`, `ProductDetailsScreen`, `CartScreen`, `CheckoutScreen`, `PaymentScreen`, `OrdersScreen`, `SellerScreen`, `ProfileScreen`) observing immutable `StateFlow` from ViewModels.
- **Domain**: Pure business entities (`Product`, `CartItem`, `Order`, `CartSummary`) containing core arithmetic rules.
- **Data**: Repository pattern integrating local Room SQLite storage with remote Retrofit services.

### Database Entities
The PostgreSQL database consists of 11 relational models: `User`, `SellerProfile`, `Category`, `Product`, `ProductImage`, `Cart`, `CartItem`, `Address`, `Order`, `OrderItem`, and `Payment`.

---

## 5. Key Implementation Highlights (Kotlin)

### A. Authoritative Cart Summary Calculation
```kotlin
data class CartSummary(
    val items: List<CartItem> = emptyList(),
    val subtotal: Double = 0.0,
    val deliveryFee: Double = 2.00,
    val total: Double = 0.0
) {
    companion object {
        fun calculate(items: List<CartItem>, deliveryFee: Double = 2.00): CartSummary {
            val subtotal = items.sumOf { it.totalPrice }
            val fee = if (items.isEmpty()) 0.0 else deliveryFee
            return CartSummary(
                items = items,
                subtotal = subtotal,
                deliveryFee = fee,
                total = subtotal + fee
            )
        }
    }
}
```

### B. Transactional Order Placement & Concurrency Safety (Backend)
```typescript
return this.prisma.$transaction(async (tx) => {
  for (const item of cart.items) {
    const currentProd = await tx.product.findUnique({ where: { id: item.productId } });
    if (!currentProd || currentProd.stockQuantity < item.quantity) {
      throw new BadRequestException(`Insufficient stock available`);
    }
    // Atomic stock decrement
    await tx.product.update({
      where: { id: currentProd.id },
      data: { stockQuantity: { decrement: item.quantity } },
    });
  }
  // Creates address, order, orderItems and clears cart...
});
```

---

## 6. Testing & Quality Assurance
- **Unit Tests**: Executed `CartCalculationTest` validating zero-total edge cases, subtotal accuracy, delivery fee logic, and stock boundary conditions.
- **Backend Tests**: Executed `e2e-cart-order.spec.ts` testing server arithmetic, order ID formatting (`SS-XXXXXX-XXX`), and stock limitation rules.
- **Quality Checks**: Verified clean architecture, no hardcoded API credentials, and complete separation of concerns.

---

## 7. Conclusion & Deliverables
ShopSphere successfully fulfills and exceeds the requirements of Internship Task 2 from Arch Technologies. The project demonstrates advanced mobile engineering skills, comprehensive localization, high-grade security, and robust database integrity ready for evaluation.
