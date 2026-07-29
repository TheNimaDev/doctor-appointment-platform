# Notification Entity Design

## Purpose

مدیریت اعلان‌های سیستم.

Notification برای اطلاع‌رسانی به کاربران استفاده می‌شود.

Examples:

- Appointment Created
- Appointment Confirmed
- Appointment Reminder
- Payment Successful
- Password Reset

---

# Fields

| Field     | Type         | Nullable | Description                |
| --------- | ------------ | -------- | -------------------------- |
| id        | UUID         | ❌       | Primary Key                |
| userId    | UUID         | ❌       | FK → User                  |
| title     | varchar(255) | ❌       | عنوان اعلان                |
| message   | text         | ❌       | متن اعلان                  |
| channel   | enum         | ❌       | Email / Push / InApp |
| type      | enum         | ❌       | نوع اعلان                  |
| status    | enum         | ❌       | وضعیت ارسال                |
| readAt    | datetime     | ✅       | زمان مشاهده                |
| sentAt    | datetime     | ✅       | زمان ارسال                 |
| createdAt | datetime     | ❌       | زمان ایجاد                 |
| updatedAt | datetime     | ❌       | زمان بروزرسانی             |

---

# Enums

## NotificationChannel

```ts
EMAIL;

SMS;

PUSH;

IN_APP;
```

## NotificationStatus

```ts
PENDING;

SENT;

FAILED;

READ;
```

---

# Relations

## Many To One

### Notification → User

```
Notification

N

↓

1

User
```

---

# Usage

- Appointment Reminder
- Payment Notification
- OTP
- Marketing Messages
