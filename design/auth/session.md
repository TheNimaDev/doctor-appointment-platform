# Session Entity Design

## Purpose

مدیریت نشست‌های کاربران و اطلاعات دستگاه‌هایی که با آن‌ها وارد سیستم شده‌اند.

Session برای قابلیت‌هایی مثل:

- مشاهده دستگاه‌های فعال
- Logout از یک دستگاه خاص
- Logout از تمام دستگاه‌ها
- مدیریت امنیت حساب
- مدیریت Refresh Token Rotation

استفاده می‌شود.

---

# Fields

| Field        | Type         | Nullable | Description                                                |
| ------------ | ------------ | -------- | ---------------------------------------------------------- |
| id           | UUID         | ❌       | Primary Key                                                |
| userId       | UUID         | ❌       | FK → User                                                  |
| ipAddress    | varchar(45)  | ✅       | User IP Address                                            |
| userAgent    | text         | ✅       | Raw Browser User Agent                                     |
| browser      | varchar(50)  | ✅       | Browser Name                                               |
| os           | varchar(50)  | ✅       | Operating System                                           |
| device       | varchar(50)  | ✅       | Device Type                                                |
| country      | varchar(100) | ✅       | User Country                                               |
| city         | varchar(100) | ✅       | User City                                                  |
| remember     | boolean      | ❌       | Whether the session uses extended refresh-token expiration |
| lastActiveAt | datetime     | ❌       | آخرین فعالیت Session                                       |
| revokedAt    | datetime     | ✅       | زمان غیرفعال شدن Session                                   |
| createdAt    | datetime     | ❌       | Creation Time                                              |
| updatedAt    | datetime     | ❌       | Update Time                                                |

---

# Indexes

```sql
INDEX(userId, revokedAt)

INDEX(lastActiveAt)
```

---

# Relations

## Session → User

```
Session

N

↓

1

User
```

### Description

هر User می‌تواند چند Session داشته باشد.

Example:

```
User:

Nima


Sessions:

Chrome Windows

iPhone Safari

Android Chrome
```

---

## Session → RefreshToken

```
Session

1

↓

N

RefreshToken
```

### Description

هر Session در طول زمان می‌تواند چند Refresh Token داشته باشد.

به دلیل Refresh Token Rotation، توکن‌های قدیمی revoke می‌شوند و توکن جدید به همان Session متصل می‌شود.

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

# RefreshToken Relation

RefreshToken باید دارای `sessionId` باشد:

```
RefreshToken

N

↓

1

Session
```

---

# Token Rotation Flow

```
Session

↓

Refresh Token A

↓

Refresh Request

↓

Validate Token A

↓

Revoke Token A

↓

Create Token B

↓

Attach Token B to Same Session
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
Device          OS        Last Active
------------------------------------------------
Chrome PC       Windows   5 minutes ago

iPhone          iOS       Yesterday

Android         Android   2 days ago
------------------------------------------------
```

---

# Business Rules

## Rule 1

هر Login از یک Device جدید یک Session جدید ایجاد می‌کند.

اگر Session فعال مربوط به همان Client قبلاً وجود داشته باشد، می‌توان همان Session را مجدداً استفاده کرد و `lastActiveAt` را بروزرسانی کرد.

Example:

```
Login From Chrome

↓

Find Active Session

↓

Session Found
    ↓
Update lastActiveAt

OR

Session Not Found
    ↓
Create Session
```

---

## Rule 2

مقدار `remember` متعلق به Session است و مدت اعتبار Refresh Token را تعیین می‌کند.

```
remember = false

↓

Normal Refresh Token expiration


remember = true

↓

Extended Refresh Token expiration
```

در زمان Refresh Token Rotation، Refresh Token جدید به همان Session متصل می‌شود و مقدار `remember` از Session فعلی استفاده می‌شود.

---

## Rule 3

Logout یک دستگاه خاص:

```
User

↓

Select Session

↓

Revoke Session

↓

Revoke Related Refresh Tokens
```

Database:

```
Session.revokedAt = now()

RefreshToken.revokedAt = now()
```

---

## Rule 4

Logout All Devices:

```
User

↓

Revoke All Sessions

↓

Revoke All Refresh Tokens
```

---

## Rule 5

Session Activity باید بروزرسانی شود.

هنگام استفاده موفق از Refresh Token:

```
Refresh Request

↓

Update lastActiveAt
```

برای جلوگیری از Update زیاد دیتابیس، لازم نیست در هر API Request مقدار `lastActiveAt` تغییر کند.

---

# Authentication Flow

## Login

```
User Login

↓

Validate Credentials

↓

Find Active Session

↓

Session Found?
    ├── Yes → Update lastActiveAt
    │
    └── No → Create Session

↓

Create Refresh Token

↓

Store Refresh Token

↓

Generate Access Token

↓

Return Access Token
```

---

## Refresh Token

```
Access Token Expired

↓

Send Refresh Token

↓

Validate Refresh Token

↓

Validate Session

↓

Update Session Activity

↓

Revoke Old Refresh Token

↓

Create New Refresh Token

↓

Generate New Access Token
```

---

## Logout

```
User Logout

↓

Find Current Session

↓

Revoke Session Refresh Tokens

↓

Revoke Session

↓

Clear Cookie
```

---

# Security Considerations

- Never store raw Refresh Token
- Store only hashed Refresh Token
- Support device-based logout
- Support logout from all devices
- Validate Session status during Refresh
- Detect suspicious sessions
- Track login activity
- Limit active sessions per user

---

# Future Improvements

- Device Trust
- Login History
- Location Tracking
- Security Alerts
- Suspicious Login Detection
- Device Fingerprinting
- Active Session Limit
