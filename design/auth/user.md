# User Entity Design

## Purpose

ذخیره اطلاعات پایه تمام کاربران سیستم.

تمام افراد سیستم ابتدا یک User هستند و سپس با توجه به Role خود می‌توانند Doctor، Patient، Assistant یا Admin باشند.

---

# Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| id | UUID | ❌ | Primary Key |
| firstName | varchar(100) | ❌ | نام |
| lastName | varchar(100) | ❌ | نام خانوادگی |
| email | varchar(255) | ❌ | ایمیل |
| password | varchar(255) | ❌ | رمز عبور Hash شده |
| avatarId | UUID | ✅ | FK → File |
| status | enum | ❌ | وضعیت حساب کاربر |
| lastLoginAt | datetime | ✅ | آخرین ورود |
| createdAt | datetime | ❌ | زمان ایجاد |
| updatedAt | datetime | ❌ | زمان بروزرسانی |
| deletedAt | datetime | ✅ | Soft Delete |

---

# Indexes

```
UNIQUE(email)

INDEX(status)
```

## Why status Index?

زیرا وضعیت کاربران در Queryهای مختلف استفاده می‌شود.

Example:

```sql
SELECT *
FROM users
WHERE status = 'ACTIVE';
```

---

# Constraints

## Email

```
email cannot be null

email must be unique
```

---

## Password

```
Minimum length validation happens in DTO

Database stores only hash
```

Example:

```
$2b$10$Xk2....
```

---

# Email Verification Flow

کاربر بعد از ثبت‌نام بلافاصله Active نمی‌شود.

Flow:

```
Register

↓

Create User

status = PENDING_VERIFICATION

↓

Create EmailVerification

↓

Generate Verification Token

↓

Send Verification Email

↓

User clicks verification link

↓

Validate Token

↓

EmailVerification.verifiedAt = NOW()
EmailVerification.isVerified = True

↓

User.status = ACTIVE
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

### Description

اگر کاربر نقش بیمار داشته باشد، یک Patient Profile خواهد داشت.

---

## User → EmailVerification

```
User

1

↓

1

EmailVerification
```

### Description

هر User فقط یک Email Verification فعال دارد.

Relation توسط `EmailVerification.userId` برقرار می‌شود.

Constraint:

```
EmailVerification.userId UNIQUE
```

در صورت درخواست مجدد تایید ایمیل:

- EmailVerification قبلی حذف می‌شود.
- EmailVerification جدید ایجاد می‌شود.
- Token جدید تولید می‌شود.
- Email تایید دوباره ارسال می‌شود.

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
PENDING_VERIFICATION;

ACTIVE;

BLOCKED;
```

## Status Description

| Status | Description |
|---|---|
| PENDING_VERIFICATION | کاربر ثبت‌نام کرده ولی ایمیل را تایید نکرده |
| ACTIVE | حساب فعال و قابل استفاده |
| BLOCKED | حساب توسط سیستم یا Admin مسدود شده |

---

# Business Rules

## Rule 1

هر ایمیل فقط متعلق به یک کاربر است.

---

## Rule 2

کاربر حذف فیزیکی نمی‌شود.

Soft Delete استفاده می‌شود.

Example:

```
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

## Rule 6

کاربر تا قبل از تایید ایمیل اجازه Login ندارد.

Example:

```
status = PENDING_VERIFICATION

↓

Login rejected
```

---

## Rule 7

هر User فقط یک Email Verification فعال دارد.

در صورت درخواست مجدد تایید ایمیل:

- Verification قبلی حذف می‌شود.
- Token جدید ساخته می‌شود.
- Email تایید دوباره ارسال می‌شود.

---

# Future Improvements

مواردی که در آینده می‌توان اضافه کرد:

- Two Factor Authentication
- Login History
- User Preferences
- Multiple Phone Numbers
- Security Notifications
- Email Change Verification
- Password Reset Flow
- User Activity Tracking