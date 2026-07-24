# User Entity Design

## Purpose

ذخیره اطلاعات پایه تمام کاربران سیستم.

تمام افراد سیستم ابتدا یک User هستند و سپس با توجه به Role خود می‌توانند Doctor، Patient، Assistant یا Admin باشند.

---

# Fields

| Field       | Type         | Nullable | Description                 |
| ----------- | ------------ | -------- | --------------------------- | --- |
| id          | UUID         | ❌       | Primary Key                 |
| firstName   | varchar(100) | ❌       | نام                         |
| lastName    | varchar(100) | ❌       | نام خانوادگی                |
| mobile      | varchar(11)  | ❌       | شماره موبایل                |
| email       | varchar(255) | ✅       | ایمیل                       |
| password    | varchar(255) | ❌       | رمز عبور Hash شده           |
| avatarId    | UUID         | ✅       | FK → File                   | @   |
| status      | enum         | ❌       | ACTIVE / INACTIVE / BLOCKED |
| lastLoginAt | datetime     | ✅       | آخرین ورود                  |
| createdAt   | datetime     | ❌       | زمان ایجاد                  |
| updatedAt   | datetime     | ❌       | زمان بروزرسانی              |
| deletedAt   | datetime     | ✅       | Soft Delete                 |

---

# Indexes

```text
UNIQUE(mobile)

UNIQUE(email)

INDEX(status)
```

## Why status Index?

زیرا وضعیت کاربران زیاد در Queryها استفاده می‌شود.

مثال:

```sql
SELECT *
FROM users
WHERE status = 'ACTIVE';
```

---

# Constraints

## Mobile

```text
mobile cannot be null

mobile must be unique
```

---

## Email

```text
email is optional

if exists => unique
```

---

## Password

```text
Minimum length validation happens in DTO

Database stores only hash
```

Example:

```text
password:

$2b$10$Xk2....
```

---

# Relations

## One To One

---

## User → Doctor

```
User

1

↓

1

Doctor
```

### Description

اگر کاربر نقش پزشک داشته باشد، یک Doctor Profile خواهد داشت.

---

## User → Patient

```
User

1

↓

1

Patient
```

---

# One To Many

---

## User → RefreshToken

```
User

1

↓

N

RefreshToken
```

### Description

یک کاربر می‌تواند روی چند دستگاه Login باشد.

Example:

```
User

├── Chrome Laptop
├── iPhone
└── Android
```

---

## User → Session

```
User

1

↓

N

Session
```

### Description

برای مدیریت Device Session کاربران استفاده می‌شود.

---

## User → Notification

```
User

1

↓

N

Notification
```

Example:

```
Appointment Confirmed

Payment Success
```

---

## User → AuditLog

```
User

1

↓

N

AuditLog
```

Example:

```
Admin changed doctor status
```

---

# Many To Many

## User ↔ Role

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

یک User می‌تواند چند Role داشته باشد:

```
User:

Nima

Roles:

DOCTOR

CLINIC_ADMIN
```

---

# Enum

## UserStatus

```ts
ACTIVE;

INACTIVE;

BLOCKED;
```

---

# Business Rules

## Rule 1

هر شماره موبایل فقط متعلق به یک کاربر است.

---

## Rule 2

کاربر حذف فیزیکی نمی‌شود.

Soft Delete استفاده می‌شود.

Example:

```text
deletedAt = 2026-07-24
```

---

## Rule 3

Password هیچ‌وقت Plain Text ذخیره نمی‌شود.

Database فقط Hash رمز عبور را نگهداری می‌کند.

---

## Rule 4

Avatar داخل User ذخیره نمی‌شود.

فقط Reference به File ذخیره می‌شود.

Wrong:

```
User

avatar binary data
```

Correct:

```
User

avatarId

↓

File
```

---

## Rule 5

User فقط اطلاعات Authentication و اطلاعات عمومی را نگه می‌دارد.

اطلاعات تخصصی پزشک داخل Doctor Entity قرار می‌گیرد.

Wrong:

```
User

medicalCode

specialty

experience
```

Correct:

```
User

↓

Doctor
```

---

# Future Improvements

مواردی که در آینده می‌توان اضافه کرد:

- Two Factor Authentication
- Login History
- User Preferences
- Multiple Phone Numbers
- Account Verification Status
- User Activity Tracking
