# TimeSlot Entity Design

## Purpose

مدیریت بازه‌های زمانی قابل رزرو برای پزشک.

TimeSlot ها از روی `DoctorSchedule` تولید می‌شوند و مشخص می‌کنند که در یک زمان مشخص، امکان رزرو نوبت وجود دارد یا خیر.

Example:

```text
Doctor Schedule:

Clinic:

مطب تهران

Saturday:

09:00 - 13:00

Slot Duration:

30 minutes
```

Generated TimeSlots:

```text
09:00
09:30
10:00
10:30
11:00
11:30
12:00
12:30
```

---

# Fields

| Field      | Type     | Nullable | Description                                   |
| ---------- | -------- | -------- | --------------------------------------------- |
| id         | UUID     | ❌       | Primary Key                                   |
| scheduleId | UUID     | ❌       | FK → DoctorSchedule                           |
| clinicId   | UUID     | ❌       | FK → Clinic                                   |
| doctorId   | UUID     | ❌       | FK → Doctor                                   |
| date       | date     | ❌       | تاریخ دقیق Slot                               |
| startTime  | time     | ❌       | زمان شروع                                     |
| endTime    | time     | ❌       | زمان پایان                                    |
| status     | enum     | ❌       | AVAILABLE / HELD / BOOKED / BLOCKED / EXPIRED |
| createdAt  | datetime | ❌       | زمان ایجاد                                    |
| updatedAt  | datetime | ❌       | زمان بروزرسانی                                |
| deletedAt  | datetime | ✅       | Soft Delete                                   |

---

# Field Details

## scheduleId

Schedule اصلی که این Slot از آن ساخته شده است.

Example:

```text
DoctorSchedule:

Saturday
09:00 - 13:00

TimeSlots:

09:00
09:30
10:00
```

---

## doctorId

پزشکی که این Slot متعلق به او است.

این فیلد برای Query سریع مربوط به پزشک استفاده می‌شود.

Example:

```text
Find available slots:

Doctor + Date + Status
```

---

## clinicId

مکانی که نوبت در آن ارائه می‌شود.

Example:

```text
Clinic:

مطب تهران
```

---

## date

تاریخ واقعی Slot.

تفاوت:

Schedule:

```text
Saturday
```

TimeSlot:

```text
2026-08-01 Saturday 09:00
```

---

## status

وضعیت Slot را مشخص می‌کند.

---

# Enum

## TimeSlotStatus

```ts
export enum TimeSlotStatus {
  AVAILABLE = 'AVAILABLE',
  HELD = 'HELD',
  BOOKED = 'BOOKED',
  BLOCKED = 'BLOCKED',
  EXPIRED = 'EXPIRED',
}
```

---

# Status Description

## AVAILABLE

Slot قابل رزرو است.

Example:

```text
09:30

AVAILABLE
```

---

## HELD

Slot به‌صورت موقت برای یک بیمار نگه داشته شده و بیمار در حال تکمیل فرآیند پرداخت است.

این وضعیت دائمی نیست و معمولاً برای مدت محدودی مانند 10 دقیقه باقی می‌ماند.

Example:

```text
10:00

HELD

Appointment:
PENDING
```

اگر پرداخت در مهلت تعیین‌شده انجام نشود:

```text
HELD
  ↓
AVAILABLE
```

---

## BOOKED

Slot با موفقیت رزرو شده و Appointment مربوط به آن تأیید شده است.

Example:

```text
10:00

BOOKED

Appointment:
CONFIRMED
```

---

## BLOCKED

Slot توسط پزشک یا ادمین بسته شده و قابل رزرو نیست.

Example:

```text
Doctor Vacation
```

---

## EXPIRED

زمان واقعی Slot گذشته و دیگر قابل رزرو نیست.

Example:

```text
Yesterday 09:00

EXPIRED
```

نکته:

`EXPIRED` در TimeSlot به معنی گذشتن زمان خود Slot است، در حالی که `EXPIRED` در Appointment به معنی تمام‌شدن مهلت پرداخت یک رزرو است.

---

# Indexes

برای بهینه‌سازی Query مربوط به جستجوی Slotهای قابل رزرو برای یک پزشک:

```sql
INDEX(
    doctorId,
    date,
    status
)
```

---

# Unique Constraint

جلوگیری از ایجاد Slot تکراری:

```sql
UNIQUE(
    scheduleId,
    date,
    startTime
)
```

Example:

Wrong:

```text
Schedule:

Saturday

Date:

2026-08-01

09:00

09:00
```

---

# Relations

## Many To One

---

## TimeSlot → DoctorSchedule

```text
TimeSlot

N

↓

1

DoctorSchedule
```

Description:

هر Slot از یک Schedule ساخته می‌شود.

---

## Many To One

---

## TimeSlot → Doctor

```text
TimeSlot

N

↓

1

Doctor
```

Description:

هر Slot متعلق به یک پزشک است.

---

## Many To One

---

## TimeSlot → Clinic

```text
TimeSlot

N

↓

1

Clinic
```

Description:

هر Slot در یک مطب ارائه می‌شود.

---

## One To Many

## TimeSlot → Appointment

```text
TimeSlot

1

↓

0..N

Appointment
```

Description:

هر Slot می‌تواند چند Appointment تاریخی داشته باشد، اما در هر لحظه فقط یک Appointment فعال می‌تواند داشته باشد.

Example:

```text
10:00

↓

Appointment #125
```

> Business Rule: یک Slot نباید همزمان توسط دو بیمار رزرو شود.

---

# Slot Generation Flow

```text
DoctorSchedule Created

↓

Scheduler runs

↓

Generate Future Slots

↓

Save TimeSlots

↓

Patient searches availability

↓

Return AVAILABLE slots
```

---

# Slot Status Lifecycle

```text
AVAILABLE
    ↓
   HELD
    ↓
  BOOKED
```

اگر پرداخت انجام نشود:

```text
HELD
  ↓
AVAILABLE
```

اگر زمان Slot بگذرد:

```text
AVAILABLE
    ↓
EXPIRED
```

یا در صورت رزرو شدن:

```text
BOOKED
   ↓
EXPIRED
```

> `EXPIRED` نشان‌دهنده‌ی گذشتن زمان واقعی Slot است و ارتباطی با timeout پرداخت ندارد.

---

# Example

Doctor:

```text
Dr Ahmad
```

Clinic:

```text
مطب تهران
```

Schedule:

```text
Saturday
09:00 - 11:00
```

Generated:

| Time  | Status    |
| ----- | --------- |
| 09:00 | AVAILABLE |
| 09:30 | AVAILABLE |
| 10:00 | AVAILABLE |
| 10:30 | AVAILABLE |

---

# Booking Flow

Patient selects:

```text
10:00
```

System:

```text
Begin Transaction

↓

Lock TimeSlot
SELECT ... FOR UPDATE

↓

Check Status

↓

Check Slot is not expired

↓

Change:

AVAILABLE → HELD

↓

Create Appointment
status = PENDING
expiresAt = now + 10 minutes

↓

Create Payment

↓

Create Transaction

↓

Commit

↓

Redirect to Payment Gateway
```

بعد از پرداخت موفق:

```text
Gateway Callback

↓

Verify Payment

↓

Transaction → SUCCESS

↓

Payment → SUCCESS

↓

Appointment → CONFIRMED

↓

TimeSlot:

HELD → BOOKED
```

اگر پرداخت timeout شود:

```text
Appointment → EXPIRED

↓

TimeSlot:

HELD → AVAILABLE
```

---

# Business Rules

## Rule 1

هر Slot در هر لحظه فقط یک Appointment فعال می‌تواند داشته باشد.

---

## Rule 2

Slot های گذشته قابل رزرو نیستند.

---

## Rule 3

Slot مربوط به Schedule حذف شده نباید قابل استفاده باشد.

---

## Rule 4

تغییر وضعیت Slot در فرآیند Booking باید Transactional باشد.

برای جلوگیری از:

```
Two patients booking same slot
```

از Database Transaction و Pessimistic Lock استفاده می‌شود:

```
BEGIN

↓

SELECT ... FOR UPDATE

↓

Check AVAILABLE

↓

AVAILABLE → HELD

↓

Create Appointment

↓

COMMIT
```

---

## Rule 5

`HELD` یک وضعیت موقت برای فرآیند پرداخت است و نباید دائمی باقی بماند.

---

## Rule 6

پس از موفقیت پرداخت:

```
HELD → BOOKED
```

و پس از انقضای مهلت پرداخت:

```
HELD → AVAILABLE
```

---

## Rule 7

پس از رسیدن زمان Slot:

```
AVAILABLE → EXPIRED
```

و Slot دیگر قابل رزرو نیست.

---

# Usage

Used In:

- Doctor Calendar
- Appointment Booking
- Availability Search
- Reminder System
- Scheduling

---

# Future Improvements

- Online Meeting Slot
- Queue Number
- Waiting List
- Slot Priority
- Dynamic Pricing
- Emergency Slots
