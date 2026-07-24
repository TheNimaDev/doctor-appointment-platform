# RolePermission Entity Design

## Purpose

جدول واسط بین Role و Permission است.

سیستم دسترسی به صورت Dynamic RBAC طراحی شده است.

یک Role می‌تواند چند Permission داشته باشد و یک Permission می‌تواند برای چند Role استفاده شود.

```
Role

N

↓

RolePermission

N

↓

Permission
```

---

# Fields

| Field        | Type     | Nullable | Description     |
| ------------ | -------- | -------- | --------------- |
| id           | UUID     | ❌       | Primary Key     |
| roleId       | UUID     | ❌       | FK → Role       |
| permissionId | UUID     | ❌       | FK → Permission |
| createdAt    | datetime | ❌       | زمان ایجاد      |
| updatedAt    | datetime | ❌       | زمان بروزرسانی  |
| deletedAt    | datetime | ✅       | Soft Delete     |

---

# Relations

## Many To One

---

## RolePermission → Role

```
RolePermission

N

↓

1

Role
```

### Example

```
Role:

DOCTOR


RolePermission:

DOCTOR → appointment.view
```

---

## RolePermission → Permission

```
RolePermission

N

↓

1

Permission
```

### Example

```
RolePermission:

DOCTOR → prescription.create
```

---

# Indexes

```text
INDEX(roleId)

INDEX(permissionId)

UNIQUE(roleId, permissionId)
```

---

# Constraints

## Duplicate Prevention

یک Role نباید یک Permission را دوبار داشته باشد.

Wrong:

```
DOCTOR

↓

appointment.create

appointment.create
```

Correct:

```
DOCTOR

↓

appointment.create

appointment.cancel
```

Database:

```sql
UNIQUE(roleId, permissionId)
```

---

# Business Rules

## Rule 1

Permissionها مستقیماً داخل Role ذخیره نمی‌شوند.

Wrong:

```
Role

permissions[]
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

## Rule 2

Permissionها باید قابل توسعه باشند.

مثال:

امروز:

```
doctor.create
doctor.update
```

فردا:

```
doctor.export
doctor.verify
```

بدون تغییر Schema اضافه می‌شوند.

---

## Rule 3

حذف Permission از Role باید Soft Delete شود.

Example:

```
deletedAt = 2026-07-24
```

---

# Usage Example

هنگام Authorization:

```
Request

↓

JWT

↓

User

↓

Roles

↓

RolePermission

↓

Permissions

↓

Guard Check
```

Example:

Request:

```
POST /doctors
```

Required Permission:

```
doctor.create
```

System:

```
User

has Role

CLINIC_ADMIN


CLINIC_ADMIN

has Permission

doctor.create


Allow
```

---

# Future Improvements

- Permission Groups
- Permission Categories
- Permission Inheritance
- Dynamic Permission Builder
- Admin Permission Management Panel
