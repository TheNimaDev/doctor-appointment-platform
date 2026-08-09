# Email Entity Design

## Purpose

مدیریت ایمیل‌های مربوط به فرآیندهای احراز هویت کاربران.

این Entity برای ذخیره Tokenهای ایمیلی، زمان انقضا، وضعیت ارسال ایمیل و ارتباط با User استفاده می‌شود.

Examples:

- Email Verification
- Password Reset
- Password Changed
- Email Changed

---

# Fields

| Field        | Type         | Nullable | Description                                |
| ------------ | ------------ | -------- | ------------------------------------------ |
| id           | UUID         | ❌       | Primary Key                                |
| userId       | UUID         | ❌       | FK → User                                  |
| tokenHash    | varchar(255) | ✅       | Hash شده Token؛ برای ایمیل‌های دارای Token |
| type         | enum         | ❌       | نوع ایمیل                                  |
| status       | enum         | ❌       | وضعیت ارسال ایمیل                          |
| expiresAt    | datetime     | ✅       | زمان انقضای Token                          |
| usedAt       | datetime     | ✅       | زمان استفاده Token                         |
| revokedAt    | datetime     | ✅       | زمان لغو Token                             |
| sentAt       | datetime     | ✅       | زمان ارسال ایمیل                           |
| failedAt     | datetime     | ✅       | زمان شکست ارسال                            |
| errorMessage | text         | ✅       | خطای ارسال ایمیل                           |
| createdAt    | datetime     | ❌       | زمان ایجاد                                 |

---

# Indexes

```text
INDEX(userId, type)

INDEX(expiresAt)

INDEX(status)
```

---

## Why userId + type Index?

برای پیدا کردن ایمیل‌های یک کاربر بر اساس نوع:

```sql
SELECT *
FROM emails
WHERE user_id = 'USER_ID'
AND type = 'EMAIL_VERIFICATION';
```

---

## Why expiresAt Index?

برای Job پاکسازی Tokenهای منقضی استفاده می‌شود.

Example:

```sql
DELETE
FROM emails
WHERE
expires_at < NOW()
AND token_hash IS NOT NULL;
```

---

## Why status Index?

برای پیدا کردن ایمیل‌های در انتظار ارسال یا ارسال ناموفق:

```sql
SELECT *
FROM emails
WHERE status = 'PENDING';
```

---

# Constraints

## User Relation

```
userId cannot be null

userId must reference existing User
```

Relation:

```
Email.userId

↓

User.id
```

---

## Token

برای ایمیل‌هایی که Token دارند:

```
Token is never stored as plain text

Database stores only token hash
```

Example:

Original Token:

```
8f7c2d91a4e5...
```

Stored:

```
$2b$10$Xk2....
```

برای ایمیل‌هایی مثل `PASSWORD_CHANGED` که Token ندارند:

```
tokenHash = NULL
expiresAt = NULL
usedAt = NULL
```

---

# Relations

## Many To One

### Email → User

```
Email

N

↓

1

User
```

### Description

هر Email متعلق به یک User است.

---

# Email Types

```
EMAIL_VERIFICATION
PASSWORD_RESET
PASSWORD_CHANGED
EMAIL_CHANGED
```

### EMAIL_VERIFICATION

ارسال لینک تأیید ایمیل بعد از ثبت‌نام یا درخواست مجدد تأیید.

### PASSWORD_RESET

ارسال لینک برای بازیابی رمز عبور.

### PASSWORD_CHANGED

اطلاع‌رسانی به کاربر بعد از تغییر موفق رمز عبور.

این نوع Token ندارد.

### EMAIL_CHANGED

اطلاع‌رسانی یا تأیید تغییر ایمیل کاربر.

در صورت نیاز به تأیید، می‌تواند Token داشته باشد.

---

# Email Status

```
PENDING
SENT
FAILED
```

### PENDING

ایمیل ایجاد شده ولی هنوز ارسال نشده است.

### SENT

ایمیل با موفقیت ارسال شده است.

### FAILED

ارسال ایمیل با خطا مواجه شده است.

---

# Email Verification Flow

```
User Register

↓

Create User

status = PENDING_VERIFICATION

↓

Generate Random Token

↓

Hash Token

↓

Create Email

type = EMAIL_VERIFICATION

status = PENDING

↓

Send Verification Email

↓

Update Email

status = SENT
sentAt = NOW()

↓

User clicks verification link

↓

Validate Token

↓

Update Email

usedAt = NOW()

↓

Update User

status = ACTIVE
```

---

# Password Reset Flow

```
User requests password reset

↓

Generate Random Token

↓

Hash Token

↓

Create Email

type = PASSWORD_RESET

status = PENDING

↓

Send Password Reset Email

↓

Update Email

status = SENT

↓

User clicks reset link

↓

Validate Token

↓

Update Password

↓

Update Email

usedAt = NOW()
```

---

# Password Changed Flow

```
User changes password

↓

Validate current password

↓

Update password

↓

Create Email

type = PASSWORD_CHANGED

status = PENDING

↓

Send Email

↓

Update Email

status = SENT
sentAt = NOW()
```

این نوع ایمیل Token ندارد.

---

# Token Lifecycle

## Create

برای ایمیل‌هایی که Token دارند:

```
Generate Token

↓

Hash Token

↓

Save Email

↓

Send Email
```

---

## Verify / Use

Checks:

```
Token exists

↓

Token is not expired

↓

Token is not revoked

↓

Token is not used
```

Success:

```
usedAt = NOW()
```

---

## Revoke

اگر Token قبلی دیگر نباید معتبر باشد:

```
revokedAt = NOW()
```

بعد از آن:

```
Token = Invalid
```

---

# Expiration

اگر Token استفاده نشود:

```
expiresAt < NOW()
```

دیگر معتبر نیست.

Expiration فقط برای Emailهایی که Token دارند کاربرد دارد.

---

# Resend Verification Email Flow

اگر کاربر دوباره درخواست تأیید ایمیل بدهد:

```
Find active EMAIL_VERIFICATION

↓

Revoke old Email

revokedAt = NOW()

↓

Generate new Token

↓

Hash Token

↓

Create new Email

type = EMAIL_VERIFICATION

↓

Send new Email
```

Token قبلی حذف نمی‌شود؛ فقط `revokedAt` می‌گیرد تا History حفظ شود.

---

# Cleanup Job

برای حذف رکوردهای قدیمی در آینده می‌توان Cleanup Job داشت.

مثلاً:

```sql
DELETE
FROM emails
WHERE
expires_at < NOW()
AND used_at IS NOT NULL
AND revoked_at IS NOT NULL;
```

این Job بیشتر برای پاکسازی History قدیمی است و Token منقضی‌شده از نظر منطقی حتی بدون حذف هم معتبر نیست.

Schedule:

```
Every 10 minutes
```

---

# Business Rules

## Rule 1

Token هیچ‌وقت Plain Text ذخیره نمی‌شود.

Database فقط Hash Token را نگهداری می‌کند.

---

## Rule 2

هر Email به یک User تعلق دارد.

```
Email.userId → User.id
```

---

## Rule 3

Token بعد از استفاده دوباره معتبر نیست.

```
usedAt != NULL

↓

Invalid Token
```

---

## Rule 4

Token لغوشده معتبر نیست.

```
revokedAt != NULL

↓

Invalid Token
```

---

## Rule 5

Token دارای زمان انقضا است.

```
expiresAt < NOW()

↓

Token expired

↓

Verification rejected
```

---

## Rule 6

ایمیل‌های بدون Token نیازی به `expiresAt` و `usedAt` ندارند.

Examples:

```
PASSWORD_CHANGED
```

---

## Rule 7

وضعیت ارسال ایمیل جدا از وضعیت Token است.

```
Email.status

PENDING
SENT
FAILED
```

و Token lifecycle با:

```
expiresAt
usedAt
revokedAt
```

مدیریت می‌شود.

---

# Future Improvements

مواردی که در آینده می‌توان اضافه کرد:

- Email Templates
- Email Delivery Provider
- Retry Failed Emails
- Rate Limit For Email Sending
- Email Delivery History
- Email Change Verification
- Two-Factor Authentication
- Email Queue با BullMQ
