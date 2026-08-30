# TimeSlot Entity Design

## Purpose

مدیریت بازه‌های زمانی قابل رزرو برای پزشک.

TimeSlot ها از روی `DoctorSchedule` تولید می‌شوند و مشخص می‌کنند که در یک زمان مشخص، امکان رزرو نوبت وجود دارد یا خیر.

Example:

Doctor Schedule:

```
Clinic:

مطب تهران

Saturday:

09:00 - 13:00

Slot Duration:

30 minutes
```

Generated TimeSlots:

```
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

| Field      | Type     | Nullable | Description                            |
| ---------- | -------- | -------- | -------------------------------------- |
| id         | UUID     | ❌       | Primary Key                            |
| scheduleId | UUID     | ❌       | FK → DoctorSchedule                    |
| clinicId   | UUID     | ❌       | FK → Clinic                            |
| doctorId   | UUID     | ❌       | FK → Doctor                            |
| date       | date     | ❌       | تاریخ دقیق Slot                        |
| startTime  | time     | ❌       | زمان شروع                              |
| endTime    | time     | ❌       | زمان پایان                             |
| status     | enum     | ❌       | AVAILABLE / BOOKED / BLOCKED / EXPIRED |
| createdAt  | datetime | ❌       | زمان ایجاد                             |
| updatedAt  | datetime | ❌       | زمان بروزرسانی                         |
| deletedAt  | datetime | ✅       | Soft Delete                            |

---

# Field Details

## scheduleId

Schedule اصلی که این Slot از آن ساخته شده است.

Example:

```
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

این فیلد برای Query سریع استفاده می‌شود.

Example:

```
Find available slots:

Doctor + Date
```

---

## clinicId

مکانی که نوبت در آن ارائه می‌شود.

Example:

```
Clinic:

مطب تهران
```

---

## date

تاریخ واقعی Slot.

تفاوت:

Schedule:

```
Saturday
```

TimeSlot:

```
2026-08-01 Saturday 09:00
```

---

## status

وضعیت Slot را مشخص می‌کند.

---

# Enum

## TimeSlotStatus

```ts
AVAILABLE;
BOOKED;
BLOCKED;
EXPIRED;
```

---

# Status Description

## AVAILABLE

قابل رزرو است.

Example:

```
09:30

AVAILABLE
```

---

## BOOKED

رزرو شده است.

Example:

```
10:00

BOOKED
```

---

## BLOCKED

توسط پزشک یا ادمین بسته شده است.

Example:

```
Doctor Vacation
```

---

## EXPIRED

زمان آن گذشته است.

Example:

```
Yesterday 09:00
```

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

```
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

```
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

```
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

```
TimeSlot
N
↓
1
Clinic
```

Description:

هر Slot در یک مطب ارائه می‌شود.

---

## One To One

---

## TimeSlot → Appointment

```
TimeSlot
1
↓
0..1
Appointment
```

Description:

هر Slot حداکثر یک Appointment فعال دارد.

Example:

```
10:00

↓

Appointment #125
```

---

# Slot Generation Flow

```
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

# Example

Doctor:

```
Dr Ahmad
```

Clinic:

```
مطب تهران
```

Schedule:

```
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

```
10:00
```

System:

```
Begin Transaction

↓

Lock TimeSlot

↓

Check Status

↓

Change:

AVAILABLE → BOOKED

↓

Create Appointment

↓

Commit
```

---

# Business Rules

## Rule 1

هر Slot فقط یک بار قابل رزرو است.

---

## Rule 2

Slot های گذشته قابل رزرو نیستند.

---

## Rule 3

Slot مربوط به Schedule حذف شده نباید قابل استفاده باشد.

---

## Rule 4

تغییر وضعیت Slot باید Transactional باشد.

برای جلوگیری از:

```
Two patients booking same slot
```

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
