 <div align="center">

# 🩺 Doctor Appointment Platform

**A Modular Healthcare Appointment Booking Backend API**

Built with NestJS, TypeScript, MySQL, and TypeORM.

[Features](#features) · [Tech Stack](#tech-stack) · [Architecture](#architecture) · [Author](#author)

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=flat-square&logo=typeorm&logoColor=white)

</div>

## Overview

A backend application designed to manage doctor appointments, scheduling, user authentication, and access control. Built with a modular architecture, focusing on maintainability, type safety, and reliable business logic.

## Features

- **Authentication** — JWT-based authentication, session management, and refresh tokens.
- **Authorization** — Role-based access control (RBAC), permissions, and resource ownership validation.
- **User Management** — Account management, email verification, and password recovery.
- **Doctor Management** — Doctor profiles, medical specialties, and schedules.
- **Appointment Booking** — Time-slot management, temporary reservations, and appointment expiration.
- **Payment Modeling** — Appointment payments and payment-attempt data modeling.
- **Scheduled Jobs** — Automated handling of expired appointments.
- **API Documentation** — Swagger / OpenAPI integration.

## Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** MySQL
- **ORM:** TypeORM
- **Authentication:** JWT & Passport
- **Validation:** class-validator
- **Testing:** Jest & Supertest

## Architecture

Designed around modularity, separation of concerns, explicit state transitions, and database transaction consistency.

## Author

**Nima** · [GitHub](https://github.com/TheNimaDev)

[Repository](https://github.com/TheNimaDev/doctor-appointment-platform)
