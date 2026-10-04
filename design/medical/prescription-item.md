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
| deletedAt      | datetime     | ✅       | Soft Delete      |

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

Quantity:
21

---

# Business Rules

## Rule 1

هر PrescriptionItem باید متعلق به یک Prescription باشد.

---

## Rule 2

یک Prescription در حالت نهایی/ثبت‌شده باید حداقل یک PrescriptionItem داشته باشد.

---

## Rule 3

PrescriptionItem باید از Prescription خود جدا نشود.

حذف نسخه باید مطابق سیاست حذف Prescription انجام شود و حذف مستقیم دارو در صورت نیاز با Soft Delete مدیریت شود.

---

## Rule 4

اگر quantity مقدار داشته باشد، باید بزرگ‌تر از صفر باشد.

---

# Future Improvements

- Medicine Entity
- Drug Interaction Check
- Insurance Coverage
- Pharmacy Integration
