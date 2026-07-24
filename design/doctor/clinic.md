# Clinic Entity Design

## Purpose

مدیریت مطب‌ها و محل‌های ارائه خدمات پزشکی توسط پزشکان.

هر پزشک می‌تواند چندین مطب یا محل فعالیت داشته باشد.

Example:

```
Doctor:

Dr. Ahmad


Clinics:

- مطب تهران
- کلینیک غرب تهران
- بیمارستان X
```

---

# Fields

| Field       | Type          | Nullable | Description       |
| ----------- | ------------- | -------- | ----------------- |
| id          | UUID          | ❌       | Primary Key       |
| doctorId    | UUID          | ❌       | FK → Doctor       |
| name        | varchar(150)  | ❌       | نام مطب / کلینیک  |
| address     | text          | ❌       | آدرس              |
| city        | varchar(100)  | ❌       | شهر               |
| phone       | varchar(20)   | ✅       | شماره تماس        |
| latitude    | decimal(10,8) | ✅       | عرض جغرافیایی     |
| longitude   | decimal(11,8) | ✅       | طول جغرافیایی     |
| description | text          | ✅       | توضیحات           |
| status      | enum          | ❌       | ACTIVE / INACTIVE |
| createdAt   | datetime      | ❌       | زمان ایجاد        |
| updatedAt   | datetime      | ❌       | زمان بروزرسانی    |
| deletedAt   | datetime      | ✅       | Soft Delete       |

---

# Field Details

## doctorId

مالک این Clinic را مشخص می‌کند.

Example:

```
Doctor:

Dr. Ahmad


Clinic:

مطب تهران
```

---

## name

نام محل فعالیت پزشک.

Examples:

```
مطب شخصی دکتر احمدی

کلینیک تخصصی قلب
```

---

## address

آدرس کامل محل مراجعه بیمار.

Example:

```
تهران، خیابان ولیعصر، پلاک ۲۰
```

---

## latitude / longitude

برای نمایش موقعیت روی Map استفاده می‌شود.

Example:

```
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
```

---

# Indexes

```
INDEX(doctorId)

INDEX(city)

INDEX(status)
```

---

# Relations

## Many To One

---

## Clinic → Doctor

```
Clinic

N

↓

1

Doctor
```

Description:

هر Clinic متعلق به یک Doctor است.

Example:

```
Doctor:

Dr. Ahmad


Clinics:

├── Clinic Tehran
├── Clinic Karaj
└── Clinic Hospital
```

---

# One To Many

---

## Clinic → Appointment

```
Clinic

1

↓

N

Appointment
```

Description:

تمام نوبت‌هایی که در این مطب ثبت شده‌اند.

---

## Clinic → Schedule

```
Clinic

1

↓

N

Schedule
```

Description:

زمان‌های کاری پزشک در یک مطب خاص.

---

# Constraints

## Doctor Relation

هر Clinic باید یک Doctor داشته باشد.

```
doctorId cannot be null
```

---

## Clinic Name

نام مطب برای یک پزشک نباید تکراری باشد.

Database:

```
UNIQUE(doctorId, name)
```

Example:

Wrong:

```
Dr Ahmad

مطب تهران

مطب تهران
```

---

# Business Rules

## Rule 1

یک Doctor می‌تواند چند Clinic داشته باشد.

Example:

```
Dr Ahmad

├── مطب تهران
├── مطب کرج
└── کلینیک بیمارستان
```

---

## Rule 2

Clinic بدون Doctor وجود ندارد.

Wrong:

```
Clinic

without Doctor
```

---

## Rule 3

Clinic غیرفعال نباید برای رزرو نوبت نمایش داده شود.

Example:

```
status = INACTIVE
```

---

## Rule 4

حذف Clinic باید Soft Delete باشد.

Example:

```
deletedAt = 2026-07-24
```

---

# Usage

Used In:

- Doctor Profile
- Appointment Booking
- Schedule Management
- Patient Search
- Map Location

---

# Future Improvements

- Clinic Images
- Clinic Facilities
- Working Hours Per Clinic
- Multiple Doctors In One Clinic
- Insurance Support
- Clinic Rating
- Waiting Room Management
