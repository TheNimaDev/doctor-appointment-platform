# Review Entity Design

## Purpose

ثبت امتیاز و نظر بیمار برای پزشک.

بیمار فقط بعد از Completed شدن Appointment می‌تواند نظر ثبت کند.

---

# Fields

| Field         | Type     | Nullable | Description      |
| ------------- | -------- | -------- | ---------------- |
| id            | UUID     | ❌       | Primary Key      |
| appointmentId | UUID     | ❌       | FK → Appointment |
| patientId     | UUID     | ❌       | FK → Patient     |
| doctorId      | UUID     | ❌       | FK → Doctor      |
| rating        | tinyint  | ❌       | امتیاز 1 تا 5    |
| comment       | text     | ✅       | نظر بیمار        |
| createdAt     | datetime | ❌       | زمان ایجاد       |
| updatedAt     | datetime | ❌       | زمان بروزرسانی   |
| deletedAt     | datetime | ✅       | Soft Delete      |

---

# Relations

```
Patient

1

↓

N

Review

N

↓

1

Doctor
```

---

```
Appointment

1

↓

0..1

Review
```

---

# Business Rules

- هر Appointment فقط یک Review دارد.
- فقط Patient مربوط به Appointment می‌تواند Review ثبت کند.
- Appointment باید COMPLETED باشد.
