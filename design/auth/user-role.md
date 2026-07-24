# UserRole Entity Design

## Purpose

جدول واسط بین User و Role است.

از آنجایی که یک User می‌تواند چند Role داشته باشد و یک Role می‌تواند متعلق به چند User باشد، رابطه‌ی Many To Many از طریق این Entity پیاده‌سازی می‌شود.

```
User

N

↓

UserRole

N

↓

Role
```

---

# Fields

| Field     | Type     | Nullable | Description    |
| --------- | -------- | -------- | -------------- |
| id        | UUID     | ❌       | Primary Key    |
| userId    | UUID     | ❌       | FK → User      |
| roleId    | UUID     | ❌       | FK → Role      |
| createdAt | datetime | ❌       | زمان ایجاد     |
| updatedAt | datetime | ❌       | زمان بروزرسانی |
| deletedAt | datetime | ✅       | Soft Delete    |

---

# Relations

## Many To One

---

## UserRole → User

```
UserRole

N

↓

1

User
```

### Description

هر رکورد UserRole متعلق به یک User است.

Example:

```
User:

Ali


UserRole:

Ali → DOCTOR
Ali → CLINIC_ADMIN
```

---

## UserRole → Role

```
UserRole

N

↓

1

Role
```

### Description

هر رکورد UserRole فقط یک Role دارد.

Example:

```
UserRole:

Ali → DOCTOR
```

---

# Indexes

```text
INDEX(userId)

INDEX(roleId)

UNIQUE(userId, roleId)
```

---

# Constraints

## Duplicate Prevention

یک User نباید یک Role را دوبار داشته باشد.

Wrong:

```
User:

Ali


Roles:

DOCTOR

DOCTOR
```

Correct:

```
User:

Ali


Roles:

DOCTOR

CLINIC_ADMIN
```

Database:

```sql
UNIQUE(userId, roleId)
```

---

# Business Rules

## Rule 1

Roleها مستقیماً داخل User ذخیره نمی‌شوند.

Wrong:

```
User

role = DOCTOR
```

Correct:

```
User

↓

UserRole

↓

Role
```

---

## Rule 2

یک User می‌تواند چند Role داشته باشد.

Example:

```
User:

Dr. Ahmad


Roles:

DOCTOR

CLINIC_ADMIN
```

---

## Rule 3

حذف Role از User باید Soft Delete شود.

Example:

```
deletedAt = 2026-07-24
```

---

# Usage Example

زمان Login:

```
User

↓

Load UserRole

↓

Load Roles

↓

Load Permissions

↓

Create JWT Payload
```

JWT Example:

```json
{
  "sub": "user-id",
  "roles": ["DOCTOR"]
}
```

---

# Future Improvements

- Role Assignment History
- Role Expiration Date
- Assigned By Admin
- Temporary Permissions
