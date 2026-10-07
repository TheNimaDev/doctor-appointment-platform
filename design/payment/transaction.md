# Transaction Entity Design

## Purpose

ثبت جزئیات هر تلاش پرداخت.

Transaction برای نگهداری اطلاعات ارتباط با Payment Gateway استفاده می‌شود.

یک Payment می‌تواند چند Transaction داشته باشد.

Example:

```
Payment
|
├── Transaction 1
|      FAILED
|
└── Transaction 2
       SUCCESS
```

---

# Fields

| Field         | Type         | Nullable | Description        |
| ------------- | ------------ | -------- | ------------------ |
| id            | UUID         | ❌       | Primary Key        |
| paymentId     | UUID         | ❌       | FK → Payment       |
| transactionId | varchar(255) | ❌       | شناسه تراکنش درگاه |
| gateway       | varchar(50)  | ❌       | نام درگاه          |
| amount        | decimal      | ❌       | مبلغ تراکنش        |
| status        | enum         | ❌       | وضعیت تراکنش       |
| referenceId   | varchar(255) | ✅       | شماره پیگیری       |
| response      | json         | ✅       | پاسخ درگاه         |
| createdAt     | datetime     | ❌       | زمان ایجاد         |
| updatedAt     | datetime     | ❌       | زمان بروزرسانی     |

---

# Enum

## TransactionStatus

```ts
PENDING;

SUCCESS;

FAILED;
```

---

# Relations

## Many To One

### Transaction → Payment

```
Transaction

N

↓

1

Payment
```

Description:

هر Transaction مربوط به یک Payment است.

---

# Indexes

```
INDEX(paymentId)

INDEX(status)
```

---

# Constraints

## Unique Gateway Transaction

```sql
UNIQUE(gateway, transactionId)
```

جلوگیری از ثبت دوباره یک تراکنش در یک درگاه مشخص.

---

# Transaction Flow

```
Payment Created

↓

Create Transaction

↓

Send To Gateway

↓

Receive Callback

↓

Verify

↓

Update Transaction Status

↓

Update Payment Status
```

---

# Business Rules

## Rule 1

Transaction بدون Payment معتبر نیست.

---

## Rule 2

Transaction موفق باید Reference Number داشته باشد.

---

## Rule 3

هر Gateway Transaction فقط یک بار در همان Gateway ثبت می‌شود.

---

## Rule 4

هر تلاش جدید برای پرداخت یک Transaction جدید ایجاد می‌کند.

---

# Usage

Used In:

- Payment Verification
- Financial Reports
- Refund Tracking
- Gateway Logs
