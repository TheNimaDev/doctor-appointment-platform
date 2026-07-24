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
- Deviceها را مدیریت کرد

---

# Fields

| Field     | Type         | Nullable | Description            |
| --------- | ------------ | -------- | ---------------------- |
| id        | UUID         | ❌       | Primary Key            |
| userId    | UUID         | ❌       | FK → User              |
| tokenHash | varchar(255) | ❌       | Hash شده Refresh Token |
| deviceId  | varchar(255) | ✅       | شناسه دستگاه           |
| ipAddress | varchar(45)  | ✅       | IP کاربر               |
| userAgent | varchar(255) | ✅       | Browser / Device Info  |
| expiresAt | datetime     | ❌       | زمان انقضا             |
| revokedAt | datetime     | ✅       | زمان باطل شدن          |
| createdAt | datetime     | ❌       | زمان ایجاد             |
| updatedAt | datetime     | ❌       | زمان بروزرسانی         |
| deletedAt | datetime     | ✅       | Soft Delete            |

---

# Indexes

```
INDEX(userId)

INDEX(expiresAt)

INDEX(deviceId)

UNIQUE(tokenHash)
```

---

# Relations

## Many To One

---

## RefreshToken → User

```
RefreshToken

N

↓

1

User
```

### Description

یک User می‌تواند چند Refresh Token داشته باشد.

Example:

```
User:

Nima


RefreshTokens:

Chrome Laptop

iPhone

Android
```

---

# Token Flow

## Login

```
User Login

↓

Generate Access Token

↓

Generate Refresh Token

↓

Hash Refresh Token

↓

Save In Database

↓

Return Tokens
```

---

## Refresh Token Rotation

```
Old Refresh Token

↓

Validate

↓

Delete/Revoke Old Token

↓

Generate New Refresh Token

↓

Save New Token
```

---

# Business Rules

## Rule 1

Refresh Token به صورت Plain Text ذخیره نمی‌شود.

Wrong:

```
database:

eyJhbGciOiJIUzI1...
```

Correct:

```
database:

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

کاربر می‌تواند از تمام دستگاه‌ها Logout شود.

Flow:

```
User

↓

Delete/Revoke

↓

All RefreshTokens
```

---

## Rule 4

Token منقضی شده باید پاکسازی شود.

توسط Scheduler:

```
Every day

↓

Delete expired tokens
```

---

# Security Considerations

- Store hashed token
- Rotate token after refresh
- Detect token reuse
- Revoke suspicious sessions
- Limit active devices

---

# Future Improvements

- Token Family Tracking
- Refresh Token Reuse Detection
- Device Fingerprinting
- Suspicious Login Detection
