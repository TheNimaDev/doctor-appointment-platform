# Prescription Entity Design

## Purpose

مدیریت نسخه‌های پزشکی صادر شده توسط پزشک برای بیمار.

Prescription بعد از انجام ویزیت ایجاد می‌شود.

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
Prescription
   1
   ↓
   N
PrescriptionItems
```
---

# Fields

| Field         | Type     | Nullable | Description      |
| ------------- | -------- | -------- | ---------------- |
| id            | UUID     | ❌       | Primary Key      |
| appointmentId | UUID     | ❌       | FK → Appointment |
| notes         | text     | ✅       | توضیحات نسخه     |
| pdfFileId     | UUID     | ✅       | FK → File        |
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

# Indexes

```
UNIQUE(appointmentId)
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
