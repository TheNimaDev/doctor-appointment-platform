# Session Entity Design

## Purpose

مدیریت نشست‌های فعال کاربران و اطلاعات دستگاه‌هایی که با آن‌ها وارد سیستم شده‌اند.

Session برای قابلیت‌هایی مثل:

- مشاهده دستگاه‌های فعال
- Logout از یک دستگاه خاص
- مدیریت امنیت حساب

استفاده می‌شود.

---

# Fields

| Field          | Type         | Nullable | Description               |
| -------------- | ------------ | -------- | ------------------------- |
| id             | UUID         | ❌       | Primary Key               |
| userId         | UUID         | ❌       | FK → User                 |
| refreshTokenId | UUID         | ✅       | FK → RefreshToken         |
| deviceName     | varchar(100) | ✅       | نام دستگاه                |
| deviceType     | enum         | ❌       | MOBILE / DESKTOP / TABLET |
| ipAddress      | varchar(45)  | ✅       | IP Address                |
| userAgent      | varchar(255) | ✅       | Browser Information       |
| lastActiveAt   | datetime     | ❌       | آخرین فعالیت              |
| expiresAt      | datetime     | ❌       | زمان پایان Session        |
| createdAt      | datetime     | ❌       | زمان ایجاد                |
| updatedAt      | datetime     | ❌       | زمان بروزرسانی            |
| deletedAt      | datetime     | ✅       | Soft Delete               |

---

# Enum

## DeviceType

```ts
MOBILE;

DESKTOP;

TABLET;
```

---

# Indexes

```
INDEX(userId)

INDEX(lastActiveAt)

INDEX(deviceType)
```

---

# Relations

## Many To One

---

## Session → User

```
Session

N

↓

1

User
```

---

## Session → RefreshToken

```
Session

N

↓

1

RefreshToken
```

---

# Example Data

User:

```
Nima
```

Sessions:

```
------------------------------------------------
Device        IP              Last Active
------------------------------------------------
Chrome PC     192.168.1.5     Today
iPhone        5.34.xx.xx      Yesterday
Android       10.xx.xx.xx     2 days ago
------------------------------------------------
```

---

# Business Rules

## Rule 1

هر Login یک Session جدید ایجاد می‌کند.

Example:

```
Login From Chrome

↓

Create Session


Login From iPhone

↓

Create Another Session
```

---

## Rule 2

Logout فقط یک دستگاه:

```
User

↓

Select Session

↓

Delete Session

↓

Revoke RefreshToken
```

---

## Rule 3

Logout All Devices:

```
User

↓

Delete All Sessions

↓

Revoke All RefreshTokens
```

---

## Rule 4

Session فعال باید مرتب بروزرسانی شود.

هر Request:

```
lastActiveAt = now()
```

---

# Authentication Flow

```
Login

↓

Create Session

↓

Create RefreshToken

↓

Return JWT


Request

↓

Validate Access Token

↓

Update Session Activity
```

---

# Future Improvements

- Device Trust
- Remember Device
- Location Tracking
- Login History
- Security Alerts
