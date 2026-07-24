# Payment Entity Design

## Purpose

مدیریت پرداخت‌های مربوط به Appointment.

هر Appointment می‌تواند یک Payment داشته باشد و وضعیت پرداخت را نگهداری کند.

Flow:

```
Appointment

↓

Payment

↓

Transaction
```

---

# Fields

| Field         | Type        | Nullable | Description      |
| ------------- | ----------- | -------- | ---------------- |
| id            | UUID        | ❌       | Primary Key      |
| appointmentId | UUID        | ❌       | FK → Appointment |
| patientId     | UUID        | ❌       | FK → Patient     |
| amount        | decimal     | ❌       | مبلغ پرداخت      |
| status        | enum        | ❌       | وضعیت پرداخت     |
| gateway       | varchar(50) | ❌       | درگاه پرداخت     |
| paidAt        | datetime    | ✅       | زمان پرداخت موفق |
| createdAt     | datetime    | ❌       | زمان ایجاد       |
| updatedAt     | datetime    | ❌       | زمان بروزرسانی   |
| deletedAt     | datetime    | ✅       | Soft Delete      |

---

# Enum

## PaymentStatus

```ts
PENDING;

SUCCESS;

FAILED;

REFUNDED;
```

---

# Status Description

## PENDING

پرداخت ایجاد شده ولی هنوز انجام نشده.

Example:

```
User redirected to gateway
```

---

## SUCCESS

پرداخت موفق بوده است.

Example:

```
Gateway verified

↓

SUCCESS
```

---

## FAILED

پرداخت ناموفق بوده است.

---

## REFUNDED

مبلغ برگشت داده شده است.

---

# Relations

## One To One

### Payment → Appointment

```
Payment

1

↓

1

Appointment
```

Description:

هر Appointment یک Payment دارد.

---

## Many To One

### Payment → Patient

```
Payment

N

↓

1

Patient
```

Description:

هر بیمار می‌تواند چند پرداخت داشته باشد.

---

## One To Many

### Payment → Transaction

```
Payment

1

↓

N

Transaction
```

Description:

یک Payment ممکن است چند تلاش پرداخت داشته باشد.

Example:

```
Payment

Attempt 1 → Failed

Attempt 2 → Success
```

---

# Indexes

```
INDEX(appointmentId)

INDEX(patientId)

INDEX(status)
```

---

# Constraints

## Unique Appointment Payment

```sql
UNIQUE(appointmentId)
```

یک Appointment نباید چند Payment فعال داشته باشد.

---

# Payment Flow

```
Create Appointment

↓

Create Payment

↓

Redirect To Gateway

↓

Gateway Callback

↓

Verify Payment

↓

Update Status

SUCCESS

↓

Confirm Appointment
```

---

# Business Rules

## Rule 1

Payment فقط برای Appointment ایجاد می‌شود.

---

## Rule 2

Appointment بدون Payment موفق نباید Confirm شود.

---

## Rule 3

تغییر وضعیت Payment فقط از طریق Payment Service انجام می‌شود.

---

# Usage

Used In:

- Appointment Booking
- Doctor Income
- Financial Reports
- Refund System
