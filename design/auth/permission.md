# Permission Entity Design

## Purpose

مدیریت دسترسی‌های قابل انجام در سیستم.

Permission مشخص می‌کند یک کاربر دقیقاً چه عملیاتی را می‌تواند انجام دهد.

سیستم از **Dynamic Permission Based Authorization** استفاده می‌کند.

ساختار کلی:

```
User

↓

Role

↓

Permission
```

مثال:

یک پزشک:

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

# Fields

| Field       | Type         | Nullable | Description    |
| ----------- | ------------ | -------- | -------------- |
| id          | UUID         | ❌       | Primary Key    |
| name        | varchar(150) | ❌       | نام Permission |
| description | varchar(255) | ✅       | توضیحات        |
| module      | varchar(100) | ❌       | ماژول مربوطه   |
| action      | varchar(100) | ❌       | عملیات         |
| createdAt   | datetime     | ❌       | زمان ایجاد     |
| updatedAt   | datetime     | ❌       | زمان بروزرسانی |
| deletedAt   | datetime     | ✅       | Soft Delete    |

---

# Field Details

## name

نام کامل Permission.

Format:

```
resource.action
```

Examples:

```
doctor.create

doctor.update

appointment.manage

payment.refund
```

---

## module

بخش مربوط به Permission.

Examples:

```
doctor

patient

appointment

payment

clinic
```

---

## action

عملیات قابل انجام.

Examples:

```
create

read

update

delete

manage

approve

refund
```

---

# Example Data

| Name               | Module      | Action | Description |
| ------------------ | ----------- | ------ | ----------- |
| doctor.create      | doctor      | create | ایجاد پزشک  |
| doctor.update      | doctor      | update | ویرایش پزشک |
| doctor.delete      | doctor      | delete | حذف پزشک    |
| appointment.view   | appointment | read   | مشاهده نوبت |
| appointment.manage | appointment | manage | مدیریت نوبت |
| payment.refund     | payment     | refund | بازگشت وجه  |

---

# Indexes

```text
UNIQUE(name)

INDEX(module)

INDEX(action)
```

---

# Constraints

## Permission Name

```
name cannot be null

name must be unique
```

Example:

Allowed:

```
doctor.create

doctor.update
```

Not Allowed:

```
doctor.create

doctor.create
```

---

# Relations

## Many To Many

---

# Permission ↔ Role

از طریق جدول واسط:

```
RolePermission
```

Relation:

```
Permission

N

↓

N

Role
```

Example:

```
Permission:

appointment.create


Roles:

PATIENT

ASSISTANT
```

---

# Business Rules

## Rule 1

Permissionها باید Dynamic باشند.

یعنی اضافه کردن Permission جدید نیاز به تغییر Code نداشته باشد.

Example:

امروز:

```
doctor.create
doctor.update
```

فردا:

```
doctor.export
doctor.verify
doctor.block
```

فقط یک رکورد جدید در Database اضافه می‌شود.

---

## Rule 2

Permission مستقیماً به User اختصاص داده نمی‌شود.

Wrong:

```
User

↓

Permission
```

Correct:

```
User

↓

Role

↓

Permission
```

---

## Rule 3

Permissionها Hard Delete نمی‌شوند.

Soft Delete استفاده می‌شود.

Example:

```
deletedAt = 2026-07-24
```

---

## Rule 4

نام Permission باید استاندارد باشد.

Format:

```
module.action
```

Examples:

```
doctor.create

doctor.update

clinic.manage

appointment.cancel

payment.refund
```

---

# Permission Naming Convention

ساختار:

```
<module>.<action>
```

---

## User Module

```
user.create

user.update

user.delete

user.view
```

---

## Doctor Module

```
doctor.create

doctor.update

doctor.delete

doctor.verify

doctor.view
```

---

## Appointment Module

```
appointment.create

appointment.view

appointment.cancel

appointment.complete

appointment.manage
```

---

## Payment Module

```
payment.view

payment.refund

payment.manage
```

---

# Authorization Flow

زمان درخواست:

```
HTTP Request

↓

JWT Guard

↓

Get Current User

↓

Load Roles

↓

Load Permissions

↓

Permission Guard

↓

Allow / Deny
```

Example:

Request:

```
DELETE /doctors/:id
```

Required Permission:

```
doctor.delete
```

Check:

```
User

has Role

CLINIC_ADMIN


CLINIC_ADMIN

has Permission

doctor.delete


Allow
```

---

# Seed Data

Permissionها معمولاً توسط Seeder ساخته می‌شوند.

Example:

```ts
[
  {
    name: "doctor.create",
    module: "doctor",
    action: "create",
  },
  {
    name: "appointment.manage",
    module: "appointment",
    action: "manage",
  },
];
```

---

# Future Improvements

- Permission Groups
- Permission Categories
- API Endpoint Mapping
- Permission Cache With Redis
- Admin Permission Management UI
- Custom Permission Builder
