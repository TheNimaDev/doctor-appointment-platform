# Role Entity Design

## Purpose

مدیریت نقش‌های کاربران در سیستم.

Role مشخص می‌کند یک کاربر چه سطح دسترسی و مسئولیتی در سیستم دارد.

سیستم از مدل **RBAC (Role Based Access Control)** استفاده می‌کند.

مثال:

```
User

↓

Role

↓

Permission
```

یک کاربر می‌تواند چند Role داشته باشد و هر Role می‌تواند چند Permission داشته باشد.

---

# Fields

| Field       | Type         | Nullable | Description    |
| ----------- | ------------ | -------- | -------------- |
| id          | UUID         | ❌       | Primary Key    |
| name        | varchar(100) | ❌       | نام Role       |
| description | varchar(255) | ✅       | توضیحات Role   |
| createdAt   | datetime     | ❌       | زمان ایجاد     |
| updatedAt   | datetime     | ❌       | زمان بروزرسانی |
| deletedAt   | datetime     | ✅       | Soft Delete    |

---

# Example Data

| id  | name         | description       |
| --- | ------------ | ----------------- |
| 1   | SUPER_ADMIN  | دسترسی کامل سیستم |
| 2   | CLINIC_ADMIN | مدیریت کلینیک     |
| 3   | DOCTOR       | پزشک              |
| 4   | ASSISTANT    | دستیار پزشک       |
| 5   | PATIENT      | بیمار             |

---

# Indexes

```text
UNIQUE(name)

INDEX(name)
```

---

# Constraints

## Role Name

```text
name cannot be null

name must be unique
```

مثلاً:

Valid:

```
DOCTOR
PATIENT
ADMIN
```

Invalid:

```
DOCTOR
DOCTOR
```

---

# Enum

## Default Roles

```ts
SUPER_ADMIN;

CLINIC_ADMIN;

DOCTOR;

ASSISTANT;

PATIENT;
```

> توجه:
>
> در طراحی حرفه‌ای بهتر است Roleها در Database ذخیره شوند و Enum فقط برای Seed اولیه استفاده شود.
>
> چون سیستم Permission داینامیک است و ممکن است در آینده Role جدید اضافه شود.

---

# Relations

## Many To Many

---

# Role ↔ User

از طریق جدول واسط:

```
UserRole
```

Relation:

```
User

N

↓

N

Role
```

Example:

```
User:

Ali


Roles:

DOCTOR

CLINIC_ADMIN
```

---

# Role ↔ Permission

از طریق جدول واسط:

```
RolePermission
```

Relation:

```
Role

N

↓

N

Permission
```

Example:

```
Role:

DOCTOR


Permissions:

appointment.view

appointment.complete

medical-record.create
```

---

# Database Structure

```
Role

id
 |
 |
 +--------- UserRole --------- User


id
 |
 |
 +--------- RolePermission --------- Permission
```

---

# Business Rules

## Rule 1

نام Role باید Unique باشد.

مثال:

Allowed:

```
DOCTOR
PATIENT
```

Not Allowed:

```
DOCTOR
DOCTOR
```

---

## Rule 2

Role مستقیماً Permission ندارد.

Permissionها از طریق جدول واسط مدیریت می‌شوند.

Wrong:

```
Role

permissionId
```

Correct:

```
Role

↓

RolePermission

↓

Permission
```

---

## Rule 3

Roleها نباید Hard Delete شوند.

از Soft Delete استفاده می‌شود.

Example:

```
deletedAt = 2026-07-24
```

---

## Rule 4

SUPER_ADMIN نباید توسط کاربران عادی ساخته شود.

ایجاد آن فقط از طریق:

- Seeder
- Migration
- System Setup

انجام می‌شود.

---

# Usage Examples

## Patient

```
Role:

PATIENT


Permissions:

appointment.create

appointment.cancel

review.create
```

---

## Doctor

```
Role:

DOCTOR


Permissions:

appointment.view

appointment.complete

medical-record.create

prescription.create
```

---

## Clinic Admin

```
Role:

CLINIC_ADMIN


Permissions:

doctor.manage

clinic.manage

report.view
```

---

# Future Improvements

در آینده می‌توان اضافه کرد:

- Role Hierarchy
- Role Inheritance
- Temporary Roles
- Role Expiration
- Department Based Roles
- Custom Roles Created By Admin
