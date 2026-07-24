# Specialty Entity Design

## Purpose

مدیریت تخصص‌های پزشکی در سیستم.

Specialty مشخص می‌کند پزشک در چه زمینه‌هایی فعالیت دارد و برای جستجو، فیلتر و دسته‌بندی پزشکان استفاده می‌شود.

Examples:

```
Cardiology

Dermatology

Dentistry

Neurology
```

---

# Fields

| Field       | Type         | Nullable | Description         |
| ----------- | ------------ | -------- | ------------------- |
| id          | UUID         | ❌       | Primary Key         |
| name        | varchar(100) | ❌       | نام تخصص            |
| slug        | varchar(100) | ❌       | شناسه یکتا برای URL |
| description | text         | ✅       | توضیحات تخصص        |
| icon        | varchar(255) | ✅       | آیکون تخصص          |
| status      | enum         | ❌       | ACTIVE / INACTIVE   |
| createdAt   | datetime     | ❌       | زمان ایجاد          |
| updatedAt   | datetime     | ❌       | زمان بروزرسانی      |
| deletedAt   | datetime     | ✅       | Soft Delete         |

---

# Example Data

| Name        | Slug        |
| ----------- | ----------- |
| Cardiology  | cardiology  |
| Dermatology | dermatology |
| Dentistry   | dentistry   |
| Neurology   | neurology   |

---

# Enum

## SpecialtyStatus

```ts
ACTIVE;

INACTIVE;
```

---

# Indexes

```text
UNIQUE(name)

UNIQUE(slug)

INDEX(status)
```

---

# Constraints

## Name

```
name cannot be null

name must be unique
```

---

## Slug

```
slug cannot be null

slug must be unique
```

---

# Relations

## Many To Many

### Specialty ↔ Doctor

رابطه Many To Many بین Specialty و Doctor وجود دارد.

این رابطه از طریق جدول واسط:

```
DoctorSpecialty
```

پیاده‌سازی می‌شود.

ساختار رابطه:

```
Specialty

N

↓

DoctorSpecialty

↓

N

Doctor
```

---

# Relation Description

## Specialty → Doctor

هر تخصص می‌تواند چند پزشک داشته باشد.

Example:

```
Cardiology

├── Dr Ali
├── Dr Reza
└── Dr Sara
```

---

## Doctor → Specialty

هر پزشک می‌تواند چند تخصص داشته باشد.

Example:

```
Dr Ahmad

├── Cardiology
└── Internal Medicine
```

---

# DoctorSpecialty Entity

برای مدیریت رابطه Many To Many یک Entity جداگانه ایجاد می‌شود.

```
DoctorSpecialty

id

doctorId

specialtyId

isPrimary

createdAt

updatedAt

deletedAt
```

---

# Business Rules

## Rule 1

یک Specialty می‌تواند توسط چند Doctor استفاده شود.

Example:

```
Cardiology

Doctors:

Dr Ali
Dr Reza
Dr Sara
```

---

## Rule 2

یک Doctor می‌تواند چند Specialty داشته باشد.

Example:

```
Doctor:

Dr Ahmad


Specialties:

Cardiology

Internal Medicine
```

---

## Rule 3

یک Doctor فقط می‌تواند یک Specialty اصلی داشته باشد.

Example:

```
Primary:

Cardiology


Secondary:

Internal Medicine
```

---

## Rule 4

Specialty حذف فیزیکی نمی‌شود.

از Soft Delete استفاده می‌شود.

Example:

```
deletedAt = 2026-07-24
```

---

## Rule 5

Specialty با وضعیت INACTIVE نباید برای پزشک جدید قابل انتخاب باشد.

Example:

```
status = INACTIVE
```

---

# Usage

Used In:

- Doctor Registration
- Doctor Profile
- Doctor Search
- Doctor Filtering
- Dashboard Reports

---

# Future Improvements

- Specialty Categories
- Multi Language Support
- Specialty Ordering
- Specialty SEO Metadata
- Specialty Icon Management
