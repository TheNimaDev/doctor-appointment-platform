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

MedicalRecord

N

↓

1

Doctor

N

↓

1

Appointment
```

---

# Fields

| Field         | Type     | Nullable | Description      |
| ------------- | -------- | -------- | ---------------- |
| id            | UUID     | ❌       | Primary Key      |
| patientId     | UUID     | ❌       | FK → Patient     |
| doctorId      | UUID     | ❌       | FK → Doctor      |
| appointmentId | UUID     | ❌       | FK → Appointment |
| diagnosis     | text     | ❌       | تشخیص پزشک       |
| description   | text     | ✅       | توضیحات پزشکی    |
| notes         | text     | ✅       | یادداشت پزشک     |
| createdAt     | datetime | ❌       | زمان ایجاد       |
| updatedAt     | datetime | ❌       | زمان بروزرسانی   |
| deletedAt     | datetime | ✅       | Soft Delete      |

---

# Relations

## Many To One

### MedicalRecord → Patient

```
MedicalRecord

N

↓

1

Patient
```

---

### MedicalRecord → Doctor

```
MedicalRecord

N

↓

1

Doctor
```

---

### MedicalRecord → Appointment

```
MedicalRecord

N

↓

1

Appointment
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

MedicalRecord حذف فیزیکی نمی‌شود.

استفاده از Soft Delete.

---

# Usage

Used In:

- Patient History
- Doctor Dashboard
- Treatment Tracking
- Medical Reports
