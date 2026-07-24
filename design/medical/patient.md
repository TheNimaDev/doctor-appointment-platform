# Patient Entity Design

## Purpose

مدیریت اطلاعات پزشکی و پروفایل بیماران.

Patient نماینده یک User است که برای دریافت خدمات پزشکی، رزرو نوبت، مشاهده پرونده پزشکی و پرداخت‌ها استفاده می‌شود.

در سیستم، اطلاعات عمومی بیمار مانند نام، موبایل و ایمیل داخل Entity `User` نگهداری می‌شود و اطلاعات مخصوص بیمار داخل `Patient` قرار می‌گیرد.

ساختار:

```
User

1

↓

1

Patient
```

---

# Fields

| Field                 | Type         | Nullable | Description        |
| --------------------- | ------------ | -------- | ------------------ |
| id                    | UUID         | ❌       | Primary Key        |
| userId                | UUID         | ❌       | FK → User          |
| nationalCode          | varchar(10)  | ❌       | کد ملی             |
| birthDate             | date         | ✅       | تاریخ تولد         |
| gender                | enum         | ❌       | جنسیت              |
| bloodType             | enum         | ✅       | گروه خونی          |
| emergencyContactName  | varchar(100) | ✅       | نام تماس اضطراری   |
| emergencyContactPhone | varchar(20)  | ✅       | شماره تماس اضطراری |
| address               | text         | ✅       | آدرس               |
| city                  | varchar(100) | ✅       | شهر                |
| createdAt             | datetime     | ❌       | زمان ایجاد         |
| updatedAt             | datetime     | ❌       | زمان بروزرسانی     |
| deletedAt             | datetime     | ✅       | Soft Delete        |

---

# Field Details

## userId

ارتباط با User اصلی بیمار.

Example:

```
User:

Ali Ahmadi

↓

Patient Profile
```

---

## nationalCode

کد ملی بیمار.

Rules:

```
Required

Unique
```

هر بیمار فقط یک کد ملی دارد.

---

## birthDate

تاریخ تولد بیمار.

Example:

```
2005-05-20
```

برای محاسبه سن بیمار و اطلاعات پزشکی استفاده می‌شود.

---

## gender

جنسیت بیمار.

---

## bloodType

گروه خونی بیمار.

Example:

```
A+

O-

AB+
```

---

## emergencyContact

اطلاعات تماس اضطراری بیمار.

در شرایط اورژانسی استفاده می‌شود.

---

# Enum

## Gender

```ts
MALE;

FEMALE;

OTHER;
```

---

## BloodType

```ts
A_POSITIVE;

A_NEGATIVE;

B_POSITIVE;

B_NEGATIVE;

AB_POSITIVE;

AB_NEGATIVE;

O_POSITIVE;

O_NEGATIVE;
```

---

# Indexes

```
UNIQUE(userId)

UNIQUE(nationalCode)

INDEX(city)

INDEX(gender)
```

---

# Relations

## One To One

---

## Patient → User

```
Patient

1

↓

1

User
```

Description:

هر بیمار یک حساب کاربری دارد.

---

## One To Many

---

## Patient → Appointment

```
Patient

1

↓

N

Appointment
```

Description:

یک بیمار می‌تواند چندین نوبت داشته باشد.

Example:

```
Patient:

Ali


Appointments:

Cardiology - 2026/08/01

Dentistry - 2026/09/10
```

---

## Patient → MedicalRecord

```
Patient

1

↓

N

MedicalRecord
```

Description:

پرونده‌های پزشکی بیمار.

---

## Patient → Prescription

```
Patient

1

↓

N

Prescription
```

Description:

نسخه‌های دریافت شده توسط بیمار.

---

## Patient → Review

```
Patient

1

↓

N

Review
```

Description:

نظرات ثبت شده توسط بیمار.

---

## Patient → Payment

```
Patient

1

↓

N

Payment
```

Description:

پرداخت‌های بیمار.

---

# Constraints

## User Relation

هر User فقط یک Patient Profile دارد.

Database:

```
UNIQUE(userId)
```

---

## National Code

```
nationalCode cannot be null

nationalCode must be unique
```

---

# Business Rules

## Rule 1

Patient بدون User وجود ندارد.

Wrong:

```
Patient

without User
```

Correct:

```
User

↓

Patient
```

---

## Rule 2

کد ملی بیمار یکتا است.

دو بیمار نمی‌توانند یک کد ملی داشته باشند.

---

## Rule 3

اطلاعات حساس پزشکی داخل User ذخیره نمی‌شود.

Wrong:

```
User

bloodType

medicalHistory
```

Correct:

```
User

↓

Patient

↓

MedicalRecord
```

---

## Rule 4

حذف بیمار Soft Delete است.

Example:

```
deletedAt = 2026-07-24
```

---

# Usage

Used In:

- Appointment Booking
- Medical Records
- Prescription History
- Payment
- Review System
- Patient Dashboard

---

# Future Improvements

- Patient Insurance Information
- Chronic Diseases
- Allergies
- Medical History Summary
- Family Doctor
- Multiple Addresses
- Emergency Medical Card
