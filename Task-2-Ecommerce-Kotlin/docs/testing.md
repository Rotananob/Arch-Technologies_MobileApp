# 🧪 Testing Strategy — ShopSphere

## 1. Android Client Tests
- **Unit Testing**:
  - `CartCalculationTest.kt`: Validates empty cart zero totals, multiple item subtotal + delivery fee accumulation, and stock boundary checks.
  - Kotlin Coroutines Test support for async state flow assertions.

## 2. Backend Automated Tests
- **Jest Unit Tests**:
  - `e2e-cart-order.spec.ts`: Validates backend monetary arithmetic, server-side cart delivery fee rules, stock boundary validation, and standardized `SS-XXXXXX-XXX` order number formatting.

## Execution Commands
- **Run Android Tests**:
  ```bash
  cd android
  ./gradlew testDebugUnitTest
  ```
- **Run Backend Tests**:
  ```bash
  cd backend
  npm test
  ```
