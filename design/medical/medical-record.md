# MedicalRecord Entity Design

## Purpose

مدیریت پرونده پزشکی بیمار.

MedicalRecord اطلاعات مربوط به سابقه مراجعه بیمار، تشخیص پزشک، یادداشت‌های پزشکی و اطلاعات درمانی را نگهداری می‌کند.

هر رکورد پزشکی مربوط به یک Appointment انجام شده است.

Structure:

```
Patient
   1
   ↓
   N
Appointment
   1
   ↓
   0..1
MedicalRecord
```

---

# Fields

| Field         | Type     | Nullable | Description      |
| ------------- | -------- | -------- | ---------------- |
| id            | UUID     | ❌       | Primary Key      |
| appointmentId | UUID     | ❌       | FK → Appointment |
| diagnosis     | text     | ❌       | تشخیص پزشک       |
| description   | text     | ✅       | توضیحات پزشکی    |
| notes         | text     | ✅       | یادداشت پزشک     |
| createdAt     | datetime | ❌       | زمان ایجاد       |
| updatedAt     | datetime | ❌       | زمان بروزرسانی   |
| deletedAt     | datetime | ✅       | Soft Delete      |

---

# Relations

## One To One

### MedicalRecord → Appointment

```
MedicalRecord
   0..1
    ↓
Appointment
    1
```

هر Appointment حداکثر یک MedicalRecord دارد.

Patient و Doctor از طریق Appointment قابل دسترسی هستند:

```
MedicalRecord
    ↓
Appointment
   ↙       ↘
Patient   Doctor
```

---

# Business Rules

## Rule 1

هر MedicalRecord باید مربوط به یک Appointment باشد.

```
Completed Appointment
        ↓
MedicalRecord
```

---

## Rule 2

فقط Doctor مربوط به Appointment اجازه ایجاد MedicalRecord دارد.

---

## Rule 3

هر Appointment حداکثر یک MedicalRecord دارد.

```
Appointment 1 ─── 0..1 MedicalRecord
```

---

## Rule 4

MedicalRecord حذف فیزیکی نمی‌شود.

استفاده از Soft Delete.

---

# Usage

Used In:

- Patient History
- Doctor Dashboard
- Treatment Tracking
- Medical Reports
