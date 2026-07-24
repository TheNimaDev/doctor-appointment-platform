# AuditLog Entity Design

## Purpose

ثبت فعالیت کاربران در سیستم.

Examples:

- Login
- Logout
- Create Appointment
- Cancel Appointment
- Update Doctor Profile

---

# Fields

| Field     | Type         | Nullable | Description      |
| --------- | ------------ | -------- | ---------------- |
| id        | UUID         | ❌       | Primary Key      |
| userId    | UUID         | ❌       | FK → User        |
| action    | varchar(100) | ❌       | عملیات انجام شده |
| entity    | varchar(100) | ❌       | نام Entity       |
| entityId  | UUID         | ✅       | شناسه Entity     |
| ip        | varchar(50)  | ✅       | IP کاربر         |
| userAgent | text         | ✅       | مرورگر یا دستگاه |
| metadata  | json         | ✅       | اطلاعات تکمیلی   |
| createdAt | datetime     | ❌       | زمان ثبت         |

---

# Relations

```
User

1

↓

N

AuditLog
```

---

# Examples

```
User:

Admin

Action:

UPDATE

Entity:

Doctor

EntityId:

doctor-uuid
```

---

# Usage

- Security Logs
- User Activity
- Admin Activity
- Debugging
- Compliance
