# Doctor Entity Design

## Purpose

مدیریت اطلاعات تخصصی پزشکان سیستم.

Doctor نماینده پروفایل پزشکی یک User است.

در سیستم، اطلاعات عمومی کاربر مانند نام، موبایل و ایمیل داخل Entity `User` نگهداری می‌شود و اطلاعات تخصصی پزشکی داخل `Doctor` قرار می‌گیرد.

ساختار:

```
User

1

↓

1

Doctor
```

---

# Fields

| Field           | Type          | Nullable | Description          |
| --------------- | ------------- | -------- | -------------------- |
| id              | UUID          | ❌       | Primary Key          |
| userId          | UUID          | ❌       | FK → User            |
| medicalCode     | varchar(50)   | ❌       | شماره نظام پزشکی     |
| bio             | text          | ✅       | توضیحات و معرفی پزشک |
| experienceYears | int           | ❌       | تعداد سال‌های تجربه  |
| consultationFee | decimal(10,2) | ❌       | هزینه ویزیت          |
| ratingAverage   | decimal(3,2)  | ❌       | میانگین امتیاز       |
| reviewCount     | int           | ❌       | تعداد نظرات          |
| status          | enum          | ❌       | وضعیت پزشک           |
| createdAt       | datetime      | ❌       | زمان ایجاد           |
| updatedAt       | datetime      | ❌       | زمان بروزرسانی       |
| deletedAt       | datetime      | ✅       | Soft Delete          |

---

# Field Details

## userId

ارتباط با User اصلی پزشک.

Example:

```
User:

Dr Ahmad

↓

Doctor Profile
```

---

## medicalCode

شماره نظام پزشکی.

Rules:

```
Required

Unique
```

هر پزشک باید یک شماره نظام پزشکی یکتا داشته باشد.

---

## bio

توضیحات پزشک:

Example:

```
متخصص قلب و عروق با ۱۰ سال سابقه فعالیت
```

---

## experienceYears

تعداد سال‌های تجربه پزشک.

Example:

```
experienceYears = 12
```

---

## consultationFee

هزینه ویزیت پزشک.

Example:

```
500000 تومان
```

---

## ratingAverage

میانگین امتیاز پزشک.

Example:

```
4.8
```

این مقدار مستقیماً توسط کاربر تغییر نمی‌کند و از Reviewها محاسبه می‌شود.

---

## reviewCount

تعداد Reviewهای ثبت شده برای پزشک.

Example:

```
250 Reviews
```

---

# Enum

## DoctorStatus

```ts
ACTIVE;

INACTIVE;

SUSPENDED;

PENDING_VERIFICATION;
```

---

# Indexes

```
UNIQUE(userId)

UNIQUE(medicalCode)

INDEX(status)

INDEX(ratingAverage)
```

---

# Relations

## One To One

---

## Doctor → User

```
Doctor

1

↓

1

User
```

Description:

هر پزشک متعلق به یک User است.

---

## Many To Many

---

## Doctor ↔ Specialty

از طریق:

```
DoctorSpecialty
```

پیاده‌سازی می‌شود.

ساختار:

```
Doctor

N

↓

DoctorSpecialty

↓

N

Specialty
```

Example:

```
Doctor:

Dr Ahmad

Specialties:

Cardiology

Internal Medicine
```

---

## Doctor ↔ Clinic

از طریق:

```
DoctorClinic
```

پیاده‌سازی می‌شود.

ساختار:

```
Doctor

N

↓

DoctorClinic

↓

N

Clinic
```

Description:

یک پزشک می‌تواند در چند Clinic فعالیت داشته باشد و هر Clinic نیز می‌تواند چند Doctor داشته باشد.

---

## One To Many

---

## Doctor → DoctorClinic

```
Doctor

1

↓

N

DoctorClinic
```

Description:

یک پزشک می‌تواند چند رابطه با Clinicهای مختلف داشته باشد.

---

## Doctor → TimeSlot

```
Doctor

1

↓

N

TimeSlot
```

Description:

TimeSlotهای مربوط به پزشک.

---

## Doctor → DoctorSchedule

```
Doctor

1

↓

N

DoctorClinic

1

↓

N

DoctorSchedule
```

Description:

زمان‌های کاری پزشک برای هر Clinic از طریق `DoctorClinic` مدیریت می‌شوند.

---

## Doctor → Appointment

```
Doctor

1

↓

N

Appointment
```

Description:

تمام نوبت‌های مربوط به پزشک.

---

## Doctor → MedicalRecord

```
Doctor

1

↓

N

MedicalRecord
```

Description:

پرونده‌های پزشکی بیماران.

---

## Doctor → Prescription

```
Doctor

1

↓

N

Prescription
```

Description:

نسخه‌های صادر شده توسط پزشک.

---

## Doctor → Review

```
Doctor

1

↓

N

Review
```

Description:

امتیازها و نظرات بیماران.

---

# Constraints

## Medical Code

```
medicalCode cannot be null

medicalCode must be unique
```

---

## User Relation

```
One User can have only one Doctor Profile
```

Database:

```
UNIQUE(userId)
```

---

# Business Rules

## Rule 1

هر Doctor باید یک User داشته باشد.

Wrong:

```
Doctor بدون User
```

Correct:

```
User

↓

Doctor
```

---

## Rule 2

Doctor بدون Specialty معتبر نیست.

حداقل یک تخصص باید داشته باشد.

---

## Rule 3

Doctor غیرفعال نباید در جستجوی بیماران نمایش داده شود.

Example:

```
status = INACTIVE
```

---

## Rule 4

Rating مستقیماً قابل ویرایش نیست.

Wrong:

```sql
UPDATE doctors
SET ratingAverage = 5
```

Correct:

```
Review

↓

Calculate Average

↓

Update Doctor Rating
```

---

## Rule 5

حذف پزشک Soft Delete است.

Example:

```
deletedAt = 2026-07-24
```

---

# Usage

Used In:

- Doctor Registration
- Doctor Profile
- Doctor Search
- Doctor-Clinic Assignment
- Appointment Booking
- Medical Records
- Prescription System
- Review System
- Dashboard

---

# Future Improvements

- Doctor Verification Workflow
- Doctor Documents
- Doctor Education History
- Doctor Certificates
- Multiple Consultation Types
- Online Consultation Support
- Doctor Availability Status
