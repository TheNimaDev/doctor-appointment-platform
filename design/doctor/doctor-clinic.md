# DoctorClinic Entity Design

## Purpose

مدیریت رابطه بین Doctor و Clinic.

هر Doctor می‌تواند در چند Clinic فعالیت داشته باشد و هر Clinic نیز می‌تواند چند Doctor داشته باشد.

Entity `DoctorClinic` به عنوان جدول واسط بین `Doctor` و `Clinic` استفاده می‌شود.

Example:

```text
Doctor:

Dr. Ahmad

Clinics:

├── مطب تهران
├── مطب کرج
└── کلینیک بیمارستان
```

---

# Fields

| Field     | Type     | Nullable | Description          |
| --------- | -------- | -------- | -------------------- |
| id        | UUID     | ❌       | Primary Key          |
| doctorId  | UUID     | ❌       | FK → Doctor          |
| clinicId  | UUID     | ❌       | FK → Clinic          |
| createdAt | datetime | ❌       | زمان ایجاد رابطه     |
| updatedAt | datetime | ❌       | زمان بروزرسانی رابطه |
| deletedAt | datetime | ✅       | Soft Delete          |

---

# Field Details

## doctorId

شناسه Doctor مرتبط با Clinic را مشخص می‌کند.

Example:

```text
Doctor:

Dr. Ahmad

doctorId:

UUID
```

---

## clinicId

شناسه Clinic مرتبط با Doctor را مشخص می‌کند.

Example:

```text
Clinic:

مطب تهران

clinicId:

UUID
```

---

# Indexes

```text
UNIQUE(doctorId, clinicId)

INDEX(doctorId)

INDEX(clinicId)
```

---

# Relations

## Many To One

---

## DoctorClinic → Doctor

```text
DoctorClinic

N

↓

1

Doctor
```

Description:

هر Doctor می‌تواند چند رابطه `DoctorClinic` داشته باشد و هر `DoctorClinic` متعلق به یک Doctor است.

---

## DoctorClinic → Clinic

```text
DoctorClinic

N

↓

1

Clinic
```

Description:

هر Clinic می‌تواند چند رابطه `DoctorClinic` داشته باشد و هر `DoctorClinic` متعلق به یک Clinic است.

---

# One To Many

---

## Doctor → DoctorClinic

```text
Doctor

1

↓

N

DoctorClinic
```

Description:

یک Doctor می‌تواند در چند Clinic فعالیت داشته باشد.

---

## Clinic → DoctorClinic

```text
Clinic

1

↓

N

DoctorClinic
```

Description:

یک Clinic می‌تواند چند Doctor داشته باشد.

---

## DoctorClinic → DoctorSchedule

```text
DoctorClinic

1

↓

N

DoctorSchedule
```

Description:

برنامه‌های کاری یک Doctor در یک Clinic خاص از طریق `DoctorClinic` مدیریت می‌شوند.

---

# Constraints

## Doctor Relation

هر `DoctorClinic` باید یک Doctor داشته باشد.

```text
doctorId cannot be null
```

---

## Clinic Relation

هر `DoctorClinic` باید یک Clinic داشته باشد.

```text
clinicId cannot be null
```

---

## Unique Doctor-Clinic Relation

یک Doctor نمی‌تواند بیش از یک بار به یک Clinic متصل شود.

Database:

```text
UNIQUE(doctorId, clinicId)
```

Example:

Valid:

```text
Dr Ahmad

↓

مطب تهران
```

Wrong:

```text
Dr Ahmad

├── مطب تهران
└── مطب تهران
```

---

# Business Rules

## Rule 1

یک Doctor می‌تواند در چند Clinic فعالیت داشته باشد.

Example:

```text
Dr Ahmad

├── مطب تهران
├── مطب کرج
└── کلینیک بیمارستان
```

---

## Rule 2

یک Clinic می‌تواند چند Doctor داشته باشد.

Example:

```text
Clinic تهران

├── Dr Ahmad
├── Dr Rezaei
└── Dr Mohammadi
```

---

## Rule 3

یک رابطه تکراری بین Doctor و Clinic مجاز نیست.

Example:

```text
Dr Ahmad

↓

Clinic Tehran

```

این رابطه فقط یک بار می‌تواند در `DoctorClinic` وجود داشته باشد.

---

## Rule 4

Schedule مربوط به Doctor در یک Clinic خاص باید از طریق `DoctorClinic` مدیریت شود.

Example:

```text
DoctorClinic

Doctor:
Dr Ahmad

Clinic:
مطب تهران

↓

DoctorSchedule

├── Saturday 09:00 - 13:00
├── Monday 09:00 - 13:00
└── Wednesday 15:00 - 19:00
```

---

## Rule 5

با حذف Doctor یا Clinic، روابط مربوط به آن‌ها نیز حذف می‌شوند.

Database Relation:

```text
Doctor

↓

DoctorClinic

↓

Clinic
```

`DoctorClinic` از `CASCADE` برای حذف رابطه استفاده می‌کند.

---

# Usage

Used In:

- Doctor-Clinic Assignment
- Doctor Profile
- Clinic Management
- Schedule Management
- Appointment Booking
- Doctor Search
- Clinic Search

---

# Future Improvements

- Doctor Role In Clinic
- Primary Clinic
- Consultation Fee Per Clinic
- Clinic-Specific Doctor Status
- Room Assignment
- Doctor Working Hours Per Clinic
- Doctor-Clinic Notes
