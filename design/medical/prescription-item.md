# PrescriptionItem Entity Design

## Purpose

مدیریت داروهای داخل یک نسخه پزشکی.

هر Prescription می‌تواند چند دارو داشته باشد.

Example:

```
Prescription:

Dr Ahmad


Items:

- Amoxicillin 500mg
- Vitamin D
- Ibuprofen
```

---

# Fields

| Field          | Type         | Nullable | Description       |
| -------------- | ------------ | -------- | ----------------- |
| id             | UUID         | ❌       | Primary Key       |
| prescriptionId | UUID         | ❌       | FK → Prescription |
| medicineName   | varchar(255) | ❌       | نام دارو          |
| dosage         | varchar(100) | ❌       | مقدار مصرف        |
| usage          | text         | ❌       | نحوه مصرف         |
| duration       | varchar(100) | ✅       | مدت مصرف          |
| quantity       | int          | ✅       | تعداد             |
| createdAt      | datetime     | ❌       | زمان ایجاد        |
| updatedAt      | datetime     | ❌       | زمان بروزرسانی    |

---

# Relations

## Many To One

### PrescriptionItem → Prescription

```
PrescriptionItem

N

↓

1

Prescription
```

---

# Example

Prescription:

```
id: 1
```

Items:

```
Medicine:

Amoxicillin


Dosage:

500mg


Usage:

Every 8 hours


Duration:

7 days
```

---

# Business Rules

## Rule 1

هر PrescriptionItem باید متعلق به یک Prescription باشد.

---

## Rule 2

نسخه بدون دارو معتبر نیست.

---

## Rule 3

حذف دارو باید از طریق حذف نسخه یا Soft Delete مدیریت شود.

---

# Future Improvements

- Medicine Entity
- Drug Interaction Check
- Insurance Coverage
- Pharmacy Integration
