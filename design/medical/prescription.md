# Prescription Entity Design

## Purpose

مدیریت نسخه‌های پزشکی صادر شده توسط پزشک برای بیمار.

Prescription بعد از انجام ویزیت ایجاد می‌شود.

Flow:

```
Appointment

COMPLETED

↓

Prescription

↓

PrescriptionItems
```

---

# Fields

| Field         | Type     | Nullable | Description      |
| ------------- | -------- | -------- | ---------------- | --- |
| id            | UUID     | ❌       | Primary Key      |
| appointmentId | UUID     | ❌       | FK → Appointment |
| doctorId      | UUID     | ❌       | FK → Doctor      |
| patientId     | UUID     | ❌       | FK → Patient     |
| notes         | text     | ✅       | توضیحات نسخه     |
| pdfFileId     | UUID     | ✅       | FK → File        | @   |
| createdAt     | datetime | ❌       | زمان ایجاد       |
| updatedAt     | datetime | ❌       | زمان بروزرسانی   |
| deletedAt     | datetime | ✅       | Soft Delete      |

---

# Relations

## One To One

### Prescription → Appointment

```
Prescription

1

↓

1

Appointment
```

---

## Many To One

### Prescription → Doctor

```
Prescription

N

↓

1

Doctor
```

---

### Prescription → Patient

```
Prescription

N

↓

1

Patient
```

---

## One To Many

### Prescription → PrescriptionItem

```
Prescription

1

↓

N

PrescriptionItem
```

---

# Business Rules

## Rule 1

هر Appointment فقط یک Prescription دارد.

---

## Rule 2

Prescription فقط بعد از Completed شدن Appointment ایجاد می‌شود.

---

## Rule 3

PDF نسخه به صورت File ذخیره می‌شود.

---

# Usage

Used In:

- Patient Prescription History
- Doctor Panel
- PDF Generation
