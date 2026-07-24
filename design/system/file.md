# File Entity Design

## Purpose

مدیریت فایل‌های سیستم.

Examples:

- User Avatar
- Prescription PDF

---

# Fields

| Field        | Type         | Nullable | Description            |
| ------------ | ------------ | -------- | ---------------------- |
| id           | UUID         | ❌       | Primary Key            |
| originalName | varchar(255) | ❌       | نام اصلی فایل          |
| fileName     | varchar(255) | ❌       | نام ذخیره شده روی سرور |
| mimeType     | varchar(100) | ❌       | نوع فایل               |
| size         | bigint       | ❌       | حجم فایل               |
| path         | varchar(500) | ❌       | مسیر فایل              |
| createdAt    | datetime     | ❌       | زمان آپلود             |
| updatedAt    | datetime     | ❌       | زمان بروزرسانی         |
| deletedAt    | datetime     | ✅       | Soft Delete            |

---

# Enums

## StorageProvider

```ts
MINIO;

S3;

LOCAL;
```

---

# Relations

```
User

1

↓

N

File
```

---

# Future Usage

- User.avatarId → File.id
- Prescription.pdfFileId → File.id
