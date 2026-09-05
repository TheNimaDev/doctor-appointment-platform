# DoctorSchedule Entity Design

## Purpose

مدیریت برنامه کاری پزشک در یک Clinic.

DoctorSchedule مشخص می‌کند که یک پزشک در یک Clinic، در چه روزهایی و چه بازه‌های زمانی فعالیت دارد.

Schedule مستقیماً به Doctor یا Clinic وصل نمی‌شود، بلکه از طریق `DoctorClinic` به Doctor و Clinic مرتبط می‌شود.

Structure:

```
Doctor

1

↓

DoctorClinic

1

↓

N

DoctorSchedule
```

---

# Fields

| Field          | Type     | Nullable | Description              |
| -------------- | -------- | -------- | ------------------------ |
| id             | UUID     | ❌       | Primary Key              |
| doctorClinicId | UUID     | ❌       | FK → DoctorClinic        |
| dayOfWeek      | enum     | ❌       | روز هفته                 |
| startTime      | time     | ❌       | ساعت شروع فعالیت         |
| endTime        | time     | ❌       | ساعت پایان فعالیت        |
| slotDuration   | int      | ❌       | مدت زمان هر نوبت (دقیقه) |
| status         | enum     | ❌       | ACTIVE / INACTIVE        |
| createdAt      | datetime | ❌       | زمان ایجاد               |
| updatedAt      | datetime | ❌       | زمان بروزرسانی           |
| deletedAt      | datetime | ✅       | Soft Delete              |

---

# Field Details

## doctorClinicId

مشخص می‌کند این برنامه کاری مربوط به کدام پزشک در کدام Clinic است.

Example:

```
Doctor:

Dr Ahmad

↓

DoctorClinic

↓

Clinic:

مطب تهران

↓

Schedule:

Saturday

09:00 - 13:00
```

---

## dayOfWeek

روز هفته‌ای که پزشک فعالیت دارد.

Example:

```
SATURDAY

SUNDAY

MONDAY
```

---

## startTime

زمان شروع فعالیت.

Example:

```
09:00
```

---

## endTime

زمان پایان فعالیت.

Example:

```
13:00
```

---

## slotDuration

مدت زمان هر نوبت.

Example:

```
30 minutes
```

با این مقدار سیستم Slot تولید می‌کند:

```
09:00

09:30

10:00

10:30

11:00
```

---

# Enum

## DayOfWeek

```ts
SATURDAY;

SUNDAY;

MONDAY;

TUESDAY;

WEDNESDAY;

THURSDAY;

FRIDAY;
```

---

## ScheduleStatus

```ts
ACTIVE;

INACTIVE;
```

---

# Indexes

```
INDEX(doctorClinicId)

INDEX(dayOfWeek)

INDEX(status)

UNIQUE(doctorClinicId, dayOfWeek, startTime, endTime)
```

---

# Constraints

## Time Validation

```
startTime < endTime
```

Example:

Valid:

```
09:00 - 13:00
```

Invalid:

```
13:00 - 09:00
```

---

## Duplicate Schedule

یک `DoctorClinic` نمی‌تواند در یک روز، بازه زمانی کاملاً تکراری داشته باشد.

Example:

Wrong:

```text
Doctor:

Dr Ahmad

Clinic:

Clinic Tehran

Saturday

09:00 - 13:00


Doctor:

Dr Ahmad

Clinic:

Clinic Tehran

Saturday

09:00 - 13:00
```

Database:

```
UNIQUE(
doctorClinicId,
dayOfWeek,
startTime,
endTime
)
```

---

# Relations

## Many To One

### DoctorSchedule → DoctorClinic

```text
DoctorSchedule

N

↓

1

DoctorClinic
```

Description:

هر Schedule متعلق به یک `DoctorClinic` است.

---

## One To Many

### DoctorSchedule → TimeSlot

```
DoctorSchedule

1

↓

N

TimeSlot
```

Description:

هر Schedule می‌تواند چند Slot زمانی تولید کند.

Example:

```
Schedule:

Saturday
09:00 - 13:00


TimeSlots:

09:00

09:30

10:00

10:30
```

---

# Slot Generation

وقتی Schedule ایجاد می‌شود:

Example:

Input:

```
Day:

Saturday


Time:

09:00 - 11:00


Duration:

30 minutes
```

Generated Slots:

```
09:00

09:30

10:00

10:30
```

---

# Business Rules

## Rule 1

Schedule باید متعلق به یک `DoctorClinic` باشد.

Wrong:

```
Schedule without DoctorClinic
```

Correct:

```
Doctor

↓

DoctorClinic

↓

DoctorSchedule
```

---

## Rule 2

Clinic غیرفعال نباید Schedule فعال داشته باشد.

---

## Rule 3

Slot Duration باید مقدار منطقی داشته باشد.

Examples:

```
15

30

45

60
```

---

## Rule 4

Schedule حذف فیزیکی نمی‌شود.

Soft Delete استفاده می‌شود.

---

# Usage

Used In:

- Doctor Calendar
- Appointment Booking
- Available Slot Generation
- Doctor-Clinic Management
- Clinic Management

---

# Future Improvements

- Holiday Management
- Doctor Vacation
- Custom Working Days
- Break Time
- Multiple Sessions Per Day
- Online Consultation Schedule
