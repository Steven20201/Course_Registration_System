# CSC220 Course Registration System

A MERN-stack web app where **admins** manage user accounts, 
**advisors** open course sections and register students, and 
**students** view their record and request add/drop changes.

> Final project for CSC220 | Group 4

## Features

- **Admin**: list and filter users, create accounts (student IDs are generated automatically), edit, activate/deactivate, delete with confirmation. An admin cannot delete themselves, and the system always keeps at least one admin.
- **Advisor**: open and manage course sections with live seat counts, check a student's eligible and excluded courses (with a reason for each), register students, open or close add/drop per section.
- **Student**: view current registrations, completed courses by term, GPA and credits, "Retake required" flag for F grades, add/drop status and request steps. Students cannot register themselves.
- **Everyone**: JWT login, role-based route protection, automatic logout when idle, forced password change on a new student's first login.

## Tech Stack

React + Vite, Node.js + Express, MongoDB (Atlas) with Mongoose, JWT, bcryptjs.

## Project Structure

```
course_registration_system/
├── client/    React frontend (src/pages, src/services/api.js, src/context)
├── server/    Express backend (models, controllers, routes, middleware,
│              utils/eligibilityRules.js, seedData/, seed.js, app.js)
└── docs/      database diagram, screenshots
```

## Getting Started

**1. Backend**

```bash
cd server
npm install
```

Create `server/.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>
JWT_SECRET=choose-a-long-random-string
PORT=3000
```

```bash
node app.js
```

**2. Seed the database** (safe to run more than once; existing data is not duplicated)

```bash
node seed.js
```

This loads an admin, 2 advisors, 25 students (one with an F grade), 44 courses, records, and current-term offerings. All names and emails are invented.

**3. Frontend** (second terminal)

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**. The API address is set in `client/src/services/api.js`.

## Team

| Name | Student ID | Role |
|---|---|---|
| Khant Zaw Hein | 2403220009 | Team Leader / Back-end Developer |
| Jeerachot Kaewkampol | 2312260001 | Admin Dashboard Developer |
| Chanon Kittikwangthong  | 2306270008 | Login Page & Authentication Developer |
| Shein Yazar Hlaing | 2310240002 | Advisor Dashboard Developer |
| Kyaw Zin Thiha | 2403010001 | Student Dashboard Developer |

Repository: `https://github.com/Steven20201/Course_Registration_System.git`