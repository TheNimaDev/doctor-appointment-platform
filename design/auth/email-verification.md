# Email Verification Entity Design

## Purpose

مدیریت فرآیند تایید ایمیل کاربران.

این Entity برای ذخیره Token تایید ایمیل، زمان انقضا، وضعیت تایید و ارتباط با User استفاده می‌شود.

هر User فقط یک Email Verification فعال دارد.

---

# Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| id | UUID | ❌ | Primary Key |
| userId | UUID | ❌ | FK → User |
| tokenHash | varchar(255) | ❌ | Hash شده Token تایید |
| expiresAt | datetime | ❌ | زمان انقضای Token |
| isVerified | boolean | ❌ | آیا ایمیل تایید شده است |
| verifiedAt | datetime | ✅ | زمان تایید ایمیل |
| createdAt | datetime | ❌ | زمان ایجاد |

---

# Indexes

```text
UNIQUE(userId)

INDEX(expiresAt)

INDEX(isVerified)
```

---

## Why userId Unique?

زیرا هر User فقط یک Email Verification فعال دارد.

Example:

```sql
SELECT *
FROM email_verifications
WHERE user_id = 'USER_ID';
```

---

## Why expiresAt Index?

برای Job پاکسازی Tokenهای منقضی استفاده می‌شود.

Example:

```sql
DELETE
FROM email_verifications
WHERE expires_at < NOW();
```

---

## Why isVerified Index?

برای پیدا کردن Verificationهای تایید نشده استفاده می‌شود.

Example:

```sql
SELECT *
FROM email_verifications
WHERE is_verified = false;
```

---

# Constraints

## User Relation

```text
userId cannot be null

userId must reference existing User
```

Relation:

```text
EmailVerification.userId

↓

User.id
```

---

## Token

```text
Token is never stored as plain text

Database stores only token hash
```

Example:

Original Token:

```text
8f7c2d91a4e5...
```

Stored:

```text
$2b$10$Xk2....
```

---

# Relations

## Many To One

## EmailVerification → User

```
EmailVerification

N

↓

1

User
```

### Description

هر EmailVerification متعلق به یک User است.

---

# Verification Flow

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

Create EmailVerification

↓

Send Verification Email

↓

User clicks verification link

↓

Validate Token

↓

Update EmailVerification

isVerified = true

verifiedAt = NOW()

↓

Update User

status = ACTIVE
```

---

# Token Lifecycle

## Create

هنگام ثبت‌نام یا درخواست مجدد تایید ایمیل:

```
Generate Token

↓

Hash Token

↓

Save EmailVerification
```

---

## Verify

هنگام کلیک روی لینک:

Checks:

```
Token exists

↓

Token is not expired

↓

isVerified = false
```

Success:

```
isVerified = true

verifiedAt = NOW()
```

---

## Expiration

اگر Token استفاده نشود:

```
expiresAt < NOW()
```

دیگر معتبر نیست.

---

# Resend Verification Email Flow

اگر کاربر دوباره درخواست تایید ایمیل بدهد:

```
Find existing EmailVerification

↓

Delete old record

↓

Generate new Token

↓

Create new EmailVerification

↓

Send new Email
```

---

# Cleanup Job

برای حذف Verificationهای منقضی:

Example:

```sql
DELETE
FROM email_verifications
WHERE
is_verified = false
AND expires_at < NOW();
```

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

هر User فقط یک Email Verification فعال دارد.

Database Constraint:

```
UNIQUE(userId)
```

---

## Rule 3

Token بعد از تایید دوباره استفاده نمی‌شود.

Example:

```
isVerified = true

↓

Invalid Token
```

---

## Rule 4

Token دارای زمان انقضا است.

بعد از پایان زمان:

```
Token expired

↓

Verification rejected
```

---

## Rule 5

تایید ایمیل باعث Active شدن User می‌شود.

Flow:

```
EmailVerification

isVerified = true

verifiedAt = NOW()

↓

User

status = ACTIVE
```

---

# Future Improvements

مواردی که در آینده می‌توان اضافه کرد:

- Email Change Verification
- Multiple Email Addresses
- Verification Attempt Tracking
- Rate Limit For Resend
- Email Delivery Status
- Verification History