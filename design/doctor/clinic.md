# Clinic Entity Design

## Purpose

مدیریت مطب‌ها و محل‌های ارائه خدمات پزشکی.

هر User می‌تواند حداکثر یک Clinic ایجاد و مالک آن باشد.

هر Clinic می‌تواند با چند Doctor همکاری داشته باشد و هر Doctor نیز می‌تواند در چند Clinic فعالیت کند.

Example:

```text
User:

Nima

Clinic:

مطب تهران

Doctors:

├── Dr. Ahmad
├── Dr. Rezaei
└── Dr. Mohammadi
```

---

# Fields

| Field       | Type          | Nullable | Description                 |
| ----------- | ------------- | -------- | --------------------------- |
| id          | UUID          | ❌       | Primary Key                 |
| ownerId     | UUID          | ❌       | FK → User                   |
| name        | varchar(150)  | ❌       | نام مطب / کلینیک            |
| address     | text          | ❌       | آدرس                        |
| city        | varchar(100)  | ❌       | شهر                         |
| phone       | varchar(20)   | ✅       | شماره تماس                  |
| latitude    | decimal(10,8) | ✅       | عرض جغرافیایی               |
| longitude   | decimal(11,8) | ✅       | طول جغرافیایی               |
| description | text          | ✅       | توضیحات                     |
| status      | enum          | ❌       | PENDING / ACTIVE / INACTIVE |
| createdAt   | datetime      | ❌       | زمان ایجاد                  |
| updatedAt   | datetime      | ❌       | زمان بروزرسانی              |
| deletedAt   | datetime      | ✅       | Soft Delete                 |

---

# Field Details

## ownerId

مالک این Clinic را مشخص می‌کند.

`ownerId` به `User` اشاره می‌کند، نه `Doctor`.

هر User حداکثر می‌تواند یک Clinic داشته باشد.

Example:

```text
User:

Nima

Clinic:

مطب تهران
```

---

## name

نام محل ارائه خدمات پزشکی.

Examples:

```text
مطب شخصی دکتر احمدی

کلینیک تخصصی قلب
```

---

## address

آدرس کامل محل مراجعه بیمار.

Example:

```text
تهران، خیابان ولیعصر، پلاک ۲۰
```

---

## latitude / longitude

برای نمایش موقعیت روی Map استفاده می‌شود.

Example:

```text
latitude:

35.6892

longitude:

51.3890
```

---

# Enum

## ClinicStatus

```ts
ACTIVE;
INACTIVE;
PENDING;
```

---

# Indexes

```text
UNIQUE(ownerId)

INDEX(city)

INDEX(status)
```

---

# Relations

## One To One

---

## Clinic → User

```text
User

1

↓

1

Clinic
```

Description:

هر User حداکثر یک Clinic دارد و هر Clinic دقیقاً یک Owner دارد.

---

## Many To Many

---

## Clinic → Doctor

رابطه Clinic و Doctor به صورت Many-to-Many است و توسط Entity واسط `DoctorClinic` مدیریت می‌شود.

```text
Clinic

N

↓

DoctorClinic

↓

N

Doctor
```

Description:

هر Clinic می‌تواند چند Doctor داشته باشد و هر Doctor نیز می‌تواند در چند Clinic فعالیت کند.

Example:

```text
Clinic:

مطب تهران

Doctors:

├── Dr. Ahmad
├── Dr. Rezaei
└── Dr. Mohammadi
```

---

# One To Many

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

رابطه بین Clinic و Doctor را از طریق Entity واسط `DoctorClinic` مدیریت می‌کند.

---

## Clinic → DoctorSchedule

```text
Clinic

1

↓

N

DoctorClinic

1

↓

N

DoctorSchedule
```

Description:

زمان‌های کاری یک Doctor در یک Clinic خاص از طریق `DoctorClinic` مدیریت می‌شوند.

---

# Constraints

## Owner Relation

هر Clinic باید یک Owner داشته باشد.

```text
ownerId cannot be null
```

---

## One Clinic Per User

هر User فقط می‌تواند یک Clinic داشته باشد.

Database:

```text
UNIQUE(ownerId)
```

Example:

Valid:

```text
User:

Nima

Clinic:

مطب تهران
```

Wrong:

```text
User:

Nima

Clinics:

├── مطب تهران
└── کلینیک غرب تهران
```

---

## Doctor-Clinic Relation

یک Doctor می‌تواند در چند Clinic فعالیت کند و یک Clinic نیز می‌تواند چند Doctor داشته باشد.

Database:

```ts
UNIQUE(doctorId, clinicId);
```

این Constraint از ایجاد رابطه تکراری بین یک Doctor و یک Clinic جلوگیری می‌کند.

---

# Business Rules

## Rule 1

یک User می‌تواند حداکثر یک Clinic داشته باشد.

Example:

```text
Nima

└── مطب تهران
```

---

## Rule 2

Clinic جدید ابتدا با وضعیت `PENDING` ایجاد می‌شود.

پس از تأیید توسط `SUPER_ADMIN`:

```text
PENDING

↓

ACTIVE
```

پس از تأیید، مالک Clinic نقش `CLINIC_ADMIN` دریافت می‌کند.

---

## Rule 3

یک Doctor می‌تواند در چند Clinic فعالیت داشته باشد.

Example:

```text
Dr Ahmad

├── مطب تهران
├── مطب کرج
└── کلینیک بیمارستان
```

---

## Rule 4

یک Clinic می‌تواند چند Doctor داشته باشد.

Example:

```text
Clinic تهران

├── Dr Ahmad
├── Dr Rezaei
└── Dr Mohammadi
```

---

## Rule 5

Clinic غیرفعال نباید برای رزرو نوبت نمایش داده شود.

Example:

```text
status = INACTIVE
```

---

## Rule 6

حذف Clinic باید Soft Delete باشد.

Example:

```text
deletedAt = 2026-07-24
```

---

# Usage

Used In:

- Doctor Profile
- Doctor-Clinic Assignment
- Appointment Booking
- Schedule Management
- Patient Search
- Map Location

---

# Future Improvements

- Clinic Images
- Clinic Facilities
- Advanced Working Hours Management
- Insurance Support
- Clinic Rating
- Waiting Room Management
