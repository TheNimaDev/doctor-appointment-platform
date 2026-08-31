# Appointment Entity Design

## Purpose

مدیریت رزرو نوبت بین بیمار و پزشک.

Appointment هسته اصلی سیستم نوبت‌دهی است و مشخص می‌کند:

- چه بیماری
- برای چه TimeSlot
- با چه وضعیتی

نوبت دارد.

اطلاعات پزشک، کلینیک، تاریخ و زمان نوبت از `TimeSlot` قابل دسترسی هستند.

---

# Fields

| Field              | Type         | Nullable | Description    |
| ------------------ | ------------ | -------- | -------------- |
| id                 | UUID         | ❌       | Primary Key    |
| patientId          | UUID         | ❌       | FK → Patient   |
| timeSlotId         | UUID         | ❌       | FK → TimeSlot  |
| status             | enum         | ❌       | وضعیت نوبت     |
| notes              | text         | ✅       | توضیحات بیمار  |
| cancelledAt        | datetime     | ✅       | زمان لغو       |
| cancellationReason | varchar(255) | ✅       | دلیل لغو       |
| createdAt          | datetime     | ❌       | زمان ایجاد     |
| updatedAt          | datetime     | ❌       | زمان بروزرسانی |
| deletedAt          | datetime     | ✅       | Soft Delete    |

اطلاعات پزشک، کلینیک، تاریخ و زمان نوبت از `TimeSlot` قابل دسترسی هستند.

---

# Enum

## AppointmentStatus

```ts
PENDING;

CONFIRMED;

CANCELLED;

COMPLETED;

NO_SHOW;
```

---

# Status Description

## PENDING

نوبت ایجاد شده ولی هنوز تایید نشده است.

Example:

```
Patient booked appointment

↓

PENDING
```

---

## CONFIRMED

نوبت تایید شده است.

Example:

```
Doctor accepted

↓

CONFIRMED
```

---

## CANCELLED

نوبت لغو شده است.

Example:

```
Patient cancelled

or

Doctor cancelled
```

---

## COMPLETED

ویزیت انجام شده است.

---

## NO_SHOW

بیمار مراجعه نکرده است.

---

# Relations

## Many To One

---

## Appointment → Patient

```
Appointment

N

↓

1

Patient
```

Description:

یک بیمار می‌تواند چند نوبت داشته باشد.

Example:

```
Patient:

Ali


Appointments:

Heart Checkup

Dental Visit
```

---

## Appointment → TimeSlot

```
Appointment

1

↓

1

TimeSlot
```

Description:

هر نوبت روی یک Slot مشخص ثبت می‌شود.

اطلاعات زیر از `TimeSlot` دریافت می‌شوند:

```
Doctor

Clinic

Date

Start Time

End Time
```

Example:

```
TimeSlot:

2026-08-01

10:00

↓

Appointment
```

---

# Indexes

```sql
INDEX(patientId)

INDEX(status)

INDEX(timeSlotId)
```

---

# Booking Flow

## Step 1

Patient درخواست رزرو می‌دهد:

```
TimeSlot
```

---

## Step 2

شروع Transaction:

```
BEGIN TRANSACTION
```

---

## Step 3

Lock کردن Slot:

```sql
SELECT *

FROM time_slots

WHERE id = ?

FOR UPDATE
```

---

## Step 4

بررسی وضعیت Slot:

```
AVAILABLE
```

---

## Step 5

تغییر وضعیت Slot:

```
AVAILABLE

↓

BOOKED
```

---

## Step 6

ساخت Appointment:

```
Appointment Created
```

---

## Step 7

Commit:

```
COMMIT
```

---

# جلوگیری از Double Booking

برای جلوگیری از:

```
Two users booking same slot
```

استفاده می‌شود از:

## Transaction Level

```
Pessimistic Lock
```

---

# Business Rules

## Rule 1

هر Appointment باید:

```
Patient

TimeSlot
```

داشته باشد.

اطلاعات `Doctor` و `Clinic` از `TimeSlot` مشخص می‌شوند.

---

## Rule 2

TimeSlot باید AVAILABLE باشد.

Wrong:

```
BOOKED

↓

Create Appointment
```

---

## Rule 3

نوبت گذشته قابل رزرو نیست.

Example:

```
2025-01-01

Cannot Book
```

---

## Rule 4

Appointment حذف فیزیکی نمی‌شود.

Soft Delete استفاده می‌شود.

---

## Rule 5

لغو نوبت باید دلیل داشته باشد.

Example:

```
status:

CANCELLED


cancellationReason:

Patient unavailable
```

---

# Appointment Lifecycle

```
PENDING

↓

CONFIRMED

↓

COMPLETED
```

یا:

```
PENDING

↓

CANCELLED
```

یا:

```
CONFIRMED

↓

NO_SHOW
```

---

# Usage

Used In:

- Patient Booking
- Doctor Calendar
- Payment
- Notification
- Medical Record
- Prescription
- Review

---

# Future Improvements

- Appointment Reminder
- Queue Number
- Waiting List
- Reschedule Appointment
- Insurance Validation
- Online Meeting Integration
- Doctor Approval Workflow
