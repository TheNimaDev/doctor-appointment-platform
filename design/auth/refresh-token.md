# RefreshToken Entity Design

## Purpose

ذخیره و مدیریت Refresh Token های کاربران.

در سیستم JWT معمولاً Access Token عمر کوتاه دارد و برای دریافت Access Token جدید از Refresh Token استفاده می‌شود.

مثال:

```
Access Token

15 minutes


Refresh Token

30 days
```

Refresh Token در Database ذخیره می‌شود تا بتوان:

- Logout کرد
- Token را Revoke کرد
- Rotation انجام داد
- Session و Device ها را مدیریت کرد

---

# Fields

| Field     | Type         | Nullable | Description           |
| --------- | ------------ | -------- | --------------------- |
| id        | UUID         | ❌       | Primary Key           |
| sessionId | UUID         | ❌       | FK → Session          |
| tokenHash | varchar(255) | ❌       | Hashed Refresh Token  |
| expiresAt | datetime     | ❌       | Token Expiration Time |
| revokedAt | datetime     | ✅       | Token Revoked Time    |
| createdAt | datetime     | ❌       | Creation Time         |
| updatedAt | datetime     | ❌       | Update Time           |

---

# Indexes

```sql
INDEX(sessionId, revokedAt, expiresAt)

INDEX(expiresAt)

UNIQUE(tokenHash)
```

---

# Relations

## RefreshToken → Session

```
RefreshToken

N

↓

1

Session
```

### Description

هر Refresh Token متعلق به یک Session است.

Session مسئول مدیریت Device و نشست کاربر است و RefreshToken فقط مسئول نگهداری Token های مربوط به آن Session است.

Example:

```
Session:

Chrome Windows


RefreshTokens:

Token A (Revoked)

Token B (Revoked)

Token C (Active)
```

---

# Token Flow

## Login

```
User Login

↓

Validate Credentials

↓

Create Session

↓

Generate Refresh Token

↓

Hash Refresh Token

↓

Save Refresh Token

↓

Generate Access Token

↓

Return Tokens
```

---

# Refresh Token Rotation

```
Current Refresh Token

↓

Validate Token

↓

Find Related Session

↓

Revoke Old Token

↓

Generate New Refresh Token

↓

Save New Token

↓

Generate New Access Token
```

Refresh Token جدید به همان Session قبلی متصل می‌شود.

Example:

```
Session:

Chrome Windows


Before:

RefreshToken A (Active)


After Refresh:

RefreshToken A (Revoked)

RefreshToken B (Active)
```

---

# Business Rules

## Rule 1

Refresh Token به صورت Plain Text ذخیره نمی‌شود.

Wrong:

```
Database:

eyJhbGciOiJIUzI1...
```

Correct:

```
Database:

$2b$10$8dk....
```

---

## Rule 2

هر Refresh Token فقط یک بار استفاده می‌شود.

بعد از Refresh:

```
Old Token

↓

Revoked
```

---

## Rule 3

هر Session می‌تواند چند Refresh Token داشته باشد.

به دلیل Token Rotation:

```
Session

↓

RefreshToken A (Revoked)

↓

RefreshToken B (Revoked)

↓

RefreshToken C (Active)
```

---

## Rule 4

Logout یک دستگاه:

```
User

↓

Select Session

↓

Revoke Session

↓

Revoke Related Refresh Tokens
```

---

## Rule 5

Logout تمام دستگاه‌ها:

```
User

↓

Revoke All Sessions

↓

Revoke All Refresh Tokens
```

---

## Rule 6

Token های منقضی شده باید پاکسازی شوند.

توسط Scheduler:

```
Every day

↓

Delete expired tokens
```

---

# Security Considerations

- Store only hashed token
- Never store raw Refresh Token
- Rotate token after refresh
- Detect token reuse
- Revoke suspicious sessions
- Limit active sessions
- Support device based logout

---

# Future Improvements

- Token Family Tracking
- Refresh Token Reuse Detection
- Device Fingerprinting
- Suspicious Login Detection
- Session Management
- Active Device Management
- Token Theft Detection
