# CSC220 Course Registration System

A MERN-stack web application (MongoDB, Express, React, Node.js) where a university's **admins** manage user accounts, **advisors** open course sections and register students, and **students** view their record and request add/drop changes.

> Final project for CSC220 | Group 4

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Seeding the Database](#seeding-the-database)
6. [Test Accounts](#test-accounts)
7. [Registration Rules](#registration-rules)
8. [API Overview](#api-overview)
9. [Security Notes](#security-notes)
10. [Known Limitations](#known-limitations)
11. [Feature Status](#feature-status)
12. [Team](#team)

---

## Features

### Admin
- View all users, filterable by role (student / advisor / admin)
- Create accounts with name, email, role, and an initial password
- Student IDs are generated automatically (unique 10-digit number)
- Edit a user's name, email, and role
- Activate / deactivate accounts (inactive users cannot log in)
- Delete with a confirmation step
- Cannot delete their own account; the system can never be left with zero admins
- Admins manage people only, not courses

### Advisor
- Open course sections for a term (course, section, day, time, room, instructor, seats)
- View, edit, and remove sections with live seat counts (taken / total)
- Select a student and see the **eligible** and **excluded** course lists, with a reason for every excluded course
- Register a student into an eligible section
- Open or close the add/drop window per section

### Student
- View current-term registrations (section, day, time, room, instructor)
- View completed courses grouped by term, with grades
- GPA and total credits earned
- Courses graded **F** are marked **Retake required**
- See add/drop status (open / closed) for each registered course
- When add/drop is open: download the form and email the advisor from the page
- Must set a new password on first login; can change it again at any time
- Students cannot register themselves

### All users
- Login with JWT authentication
- Role-based route protection on both frontend and server
- Automatic logout after a period of inactivity

---

## Tech Stack

| Layer   | Technology                                                         |
|---      |---                                                                 |
| Frontend| React, Vite, react-router-dom, axios, Context API                  |
| Backend | Node.js, Express                                                   |
| Database| MongoDB (Atlas) with Mongoose                                      |
| Auth    | JSON Web Tokens (`jsonwebtoken`), password hashing with `bcryptjs` |
| Other   | `cors`, `dotenv`, `nodemon` (development)                          |

---

## Project Structure

```
course_registration_system/
├── client/                      React + Vite frontend
│   ├── public/                  static files (add/drop form PDF)
│   └── src/
│       ├── components/          ProtectedRoute.jsx
│       ├── context/             AuthContext.jsx
│       ├── pages/               Login, ChangePassword,
│       │                        AdminDashboard, AdvisorDashboard, StudentDashboard
│       ├── services/            api.js  (all HTTP calls)
│       └── App.jsx
│
├── server/                      Express backend
│   ├── config/                  db.js, constants.js
│   ├── models/                  Users, Courses, Offering, Record, Registration
│   ├── middleware/              authMiddleware.js, roleMiddleware.js
│   ├── controllers/             one file per resource
│   ├── routes/                  one file per resource
│   ├── utils/                   eligibilityRules.js, generateStudentId.js
│   ├── seedData/                courses.json, advisors.json, students.json
│   ├── seed.js                  loads seedData into MongoDB
│   ├── app.js                   server entry point
│   └── .env                     secrets (not committed)
│
├── docs/                        database diagram and reports
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd course_registration_system
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a file named `.env` inside `server/`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>
JWT_SECRET=choose-a-long-random-string
PORT=3000
```

Start the server:

```bash
npx nodemon app.js
# or
node app.js
```

You should see `Server is running on port 3000` and a MongoDB connected message.

### 3. Frontend setup

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

The app opens at **http://localhost:5173**.

The frontend calls the API at `http://localhost:3000/api` (set in `client/src/services/api.js`). If you change the backend port, change it there too.

### 4. Add/drop form

Place the add/drop form PDF in `client/public/` using the file name that `StudentDashboard.jsx` links to (currently `UG001_Request_for_Add_Drop_Withdrawal.pdf`).

---

## Seeding the Database

The seed script loads an admin, 2 advisors, 25 students, 44 courses, each student's completed-course records, a set of current-term offerings, and registrations for the students who were "in progress".

```bash
cd server
node seed.js
```

Notes:
- Every record is checked by its unique field (email for users, code for courses, etc.) before it is inserted, so the script is **safe to run more than once** — existing data is never duplicated or overwritten.
- The data lives in `server/seedData/*.json`. All names and emails are invented (no real personal data).
- One student has a grade of **F** so the retake rule can be demonstrated.
- Course codes were standardised to one canonical code per course (variants such as `ITE220` / `CSC220` are treated as the same course).

---

## Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@csc220.edu` | `admin123` or `password123` (see note) |
| Advisor | `wendylu@gamil.com` | `password123` |
| Advisor | `zak@gmail.com` | `password123` |
| Student (has an F) | `Ayla@gmail.com` | `password123` |
| Student | `niko@gmail.com` | `password123` |


All 25 student emails are in `server/seedData/students.json`.

---

## Registration Rules

When an advisor selects a student, the system builds the list of courses for the chosen term using these rules (implemented in `server/utils/eligibilityRules.js`):

| Rule | Behaviour |
|---|---|
| Offered this term | Only courses with at least one open section in the term are considered |
| Already passed | A course passed with D or better is excluded — reason shown, e.g. "Already passed — grade B+" |
| Failed (F) | The course stays available, is marked **Retake required**, and is listed first |
| Seats | A section with no seats left is excluded — "Full — 0 seats remaining" |
| Time clash | A section overlapping the student's other registered sections is excluded, naming the clash |

The seat, duplicate, and clash checks are repeated on the server at the moment of registering, so a stale list cannot cause an over-full section.

---

## API Overview

Base URL: `http://localhost:3000/api`. Protected routes need the header `Authorization: Bearer <token>`.

| Area | Endpoints | Access |
|---|---|---|
| Auth | `POST /auth/login`, `PATCH /auth/change-password` | Login: public. Change password: any logged-in user |
| Users | `GET/POST /users`, `GET/PATCH/DELETE /users/:id` | Admin (advisor may list students) |
| Courses | `GET /courses`, `GET /courses/:id` | Public |
| | `POST /courses`, `PATCH/DELETE /courses/:id` | Advisor |
| Offerings | `GET /offerings?term=`, `GET /offerings/:id` | Logged-in users |
| | `POST /offerings`, `PATCH/DELETE /offerings/:id` | Advisor |
| Registrations | `POST/GET /registrations`, `DELETE /registrations/:id` | Advisor |
| Records | `POST /records`, `PATCH/DELETE /records/:id` | Advisor |
| Students | `GET /students/:id/record`, `GET /students/:id/eligible?term=` | Advisor |
| Me | `GET /me/registrations`, `GET /me/record` | Student (own data only) |

Common status codes: `400` validation or rule failure, `401` missing or invalid token, `403` wrong role or deactivated account, `404` not found.

---

## Security Notes

- Passwords are hashed with bcrypt; the hash is never returned by any endpoint.
- Every protected route checks the user's role on the **server** (`authMiddleware` + `roleMiddleware`); hiding a button in the UI is only a convenience.
- Student endpoints under `/api/me` take the student's identity from the token, never from the URL, so one student cannot read another's data.
- Deleting is guarded: a user cannot delete themselves, the last admin cannot be removed, a course with sections cannot be deleted, and a section with registrations cannot be deleted. Registrations are marked `dropped` rather than erased.
- Secrets live in `.env`, which must be listed in `.gitignore`.

---

## Known Limitations

- If a student failed a course and later passed it, the rules engine still sees the earlier F and may show the course as a retake. Using only the latest or best grade would fix this.
- Section times are compared as text, so they must be entered as zero-padded 24-hour values such as `09:00` and `14:30`.
- Registering checks seats and clashes and then writes; two simultaneous registrations for the last seat are not protected by a transaction.
- There is no self-service "forgot password"; a lost account has to be handled by an admin creating a new one. (Not required by the brief.)

---

## Feature Status

| Area | Status |
|---|---|
| Login, JWT, role-based routes | Complete |
| Admin dashboard (list, filter, create, edit, deactivate, delete with guards) | Complete |
| Advisor dashboard (sections, seat counts, eligibility, register, add/drop toggle) | Complete |
| Student dashboard (registrations, record, GPA, F flag, add/drop request, change password) | Complete |
| 25-student seeded dataset with an F case | Complete |
| Advisor: view a student's full academic record panel | Verify / in progress |
| Advisor: remove a registration from the UI | Verify / in progress |
| Bonus items (deployment, search/sort, printable slip, automated tests) | Not attempted |

> Update the last rows to match your final build before submitting.

---

## Team

| Name | Student ID | Role |
|---|---|---|
| Khant Zaw Hein | 2403220009 | Team Lead / Integrator |
| ______ | ______ | Back-end Developer |
| ______ | ______ | Database & Data Lead |
| ______ | ______ | Front-end Developer A (Admin + Advisor) |
| ______ | ______ | Front-end Developer B (Student + shared components) |

Repository: `<your-repository-url>`