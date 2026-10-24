# 🗄️ Database Design — ShopSphere

## Relational Entity Model (PostgreSQL + Prisma)

```mermaid
erDiagram
    USER ||--o{ PRODUCT : "lists"
    USER ||--o| SELLER_PROFILE : "owns"
    USER ||--o| CART : "has"
    USER ||--o{ ORDER : "places"
    USER ||--o{ ADDRESS : "saves"
    CATEGORY ||--o{ PRODUCT : "contains"
    PRODUCT ||--o{ PRODUCT_IMAGE : "has"
    CART ||--o{ CART_ITEM : "contains"
    PRODUCT ||--o{ CART_ITEM : "in"
    ORDER ||--o{ ORDER_ITEM : "contains"
    PRODUCT ||--o{ ORDER_ITEM : "sold"
    ORDER ||--o{ PAYMENT : "records"

    USER {
        string id PK
        string email UK
        string passwordHash
        string fullName
        string role
    }

    PRODUCT {
        string id PK
        string title
        float price
        int stockQuantity
        string condition
        string status
    }

    ORDER {
        string id PK
        string orderNumber UK
        float subtotal
        float deliveryFee
        float totalAmount
        string status
        string paymentStatus
    }
```

## Key Invariants and Integrity Rules
1. **Stock Decrement & Oversell Protection**: Handled within SQL transactions when orders are finalized.
2. **Authoritative Pricing**: Unit prices are snapshots taken directly from `Product.price` at the moment of checkout, not from mobile client payloads.
3. **Data Security**: Passwords salted with bcrypt (10 rounds). Tokens verified with distinct JWT secrets for access and refresh flows.
