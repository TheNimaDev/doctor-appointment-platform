# DoctorSpecialty Entity Design

## Purpose

جدول واسط بین Doctor و Specialty برای مدیریت رابطه Many To Many.

این Entity مشخص می‌کند یک پزشک چه تخصص‌هایی دارد و کدام تخصص، تخصص اصلی او است.

---

# Fields

| Field       | Type     | Nullable | Description    |
| ----------- | -------- | -------- | -------------- |
| id          | UUID     | ❌       | Primary Key    |
| doctorId    | UUID     | ❌       | FK → Doctor    |
| specialtyId | UUID     | ❌       | FK → Specialty |
| isPrimary   | boolean  | ❌       | تخصص اصلی پزشک |
| createdAt   | datetime | ❌       | زمان ایجاد     |
| updatedAt   | datetime | ❌       | زمان بروزرسانی |
| deletedAt   | datetime | ✅       | Soft Delete    |

---

# Indexes

```
INDEX(doctorId)

INDEX(specialtyId)

UNIQUE(doctorId, specialtyId)
```

---

# Relations

## Many To One

DoctorSpecialty → Doctor

```
DoctorSpecialty

N

↓

1

Doctor
```

---

## Many To One

DoctorSpecialty → Specialty

```
DoctorSpecialty

N

↓

1

Specialty
```

---

# Business Rules

## Rule 1

یک پزشک نمی‌تواند یک تخصص را دوبار داشته باشد.

Example:

Wrong:

```
Dr Ahmad

Cardiology

Cardiology
```

---

## Rule 2

هر پزشک فقط یک Specialty اصلی دارد.

Example:

```
Dr Ahmad

Primary:

Cardiology


Secondary:

Internal Medicine
```

---

## Rule 3

Specialty غیرفعال نباید برای Doctor جدید ثبت شود.

---

## Rule 4

حذف ارتباط Doctor و Specialty باید Soft Delete شود.
