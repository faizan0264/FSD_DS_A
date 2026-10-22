# 🎓 Student & Admin Portal (React Frontend + JSON Storage)

A modern, responsive, frontend-only Single Page Application (SPA) built with **React (Vite)** and styled with **Pure CSS**. It uses local **JSON data** and browser `localStorage` for complete data persistence without requiring any backend server or external database.

---

## 🚀 Live Local URL
The application is running at:
- **Local:** [http://localhost:5173/](http://localhost:5173/)

---

## 👥 Roles & Feature Breakdown

### 1. 🛡️ Admin Role
* **1. Add Student:**
  - Form with Full Name, Roll Number, Email, Department, Semester, and Phone.
  - Generates unique ID (`STU-xxx`) and auto-creates corresponding student portal login credentials (`student123`).
* **2. Attendance Management:**
  - Date-based attendance picker (defaults to today).
  - Quick actions: *Mark All Present*, *Mark All Absent*.
  - Student attendance toggle pills (*Present*, *Absent*, *Late*) with optional teacher remarks.
  - Direct save to JSON storage with instant class attendance calculation.
* **3. Assignment Upload:**
  - Create and publish course assignments with Title, Subject, Due Date, Points, Description, and Attachment specification.
  - View all student submissions uploaded for each assignment (submission files, student names, submission time, and notes).
* **4. Delete Student:**
  - Dedicated **Delete Student** buttons with safety confirmation modal.
  - Automatically cascades and cleans up student records, attendance logs, and assignment submissions from the JSON store.

---

### 2. 🎓 Student Role
* **1. View Attendance:**
  - Overall attendance rate meter with standing status (e.g. *Good Standing* vs *Attendance Shortage*).
  - Breakdown count of Present, Absent, and Late sessions.
  - Complete date-wise attendance log with teacher notes.
* **2. View Assignments & Upload Submissions:**
  - Filter assignments by *All*, *Pending*, or *Submitted*.
  - View assignment requirements, points, due dates, and teacher attachment files.
  - **Upload & Submit Assignment**: Upload solution files (`.pdf`, `.zip`, `.docx`, etc.), add notes, and track submission timestamp.
  - Support for updating / re-submitting solutions before the due date.

---

## 🔑 Login Credentials

| Role | Username | Password | Branch & Section | Sample Student / User |
|---|---|---|---|---|
| **Admin** | `admin` | `admin123` | All Branches & Sections | Prof. Arthur Vance (Administrator) |
| **B.Tech Student** | `btech_student` | `student123` | B.Tech - Section A | Aarav Sharma (`BT-2026-A01`) |
| **MCA Student** | `mca_student` | `student123` | MCA - Section A | Aditya Verma (`MCA-2026-A01`) |
| **BCA Student** | `bca_student` | `student123` | BCA - Section A | Rohan Patel (`BCA-2026-A01`) |

> 💡 **Quick 1-Click Demo Buttons:** You can click the quick demo buttons on the login screen (`Admin Demo`, `B.Tech (Sec A)`, `MCA (Sec A)`, `BCA (Sec A)`) to sign in instantly!

---

## 🏛️ Academic Hierarchy: Courses, Branches, Years & Sections

### 1. **B.Tech (Bachelor of Technology)** - 800 Students (1st to 4th Year)
- **AIML (Artificial Intelligence & Machine Learning):** 4 Sections (A, B, C, D) &times; 50 students = **200 students**
- **DS (Data Science):** 4 Sections (A, B, C, D) &times; 50 students = **200 students**
- **CSE (Computer Science & Engineering):** 4 Sections (A, B, C, D) &times; 50 students = **200 students**
- **IT (Information Technology):** 4 Sections (A, B, C, D) &times; 50 students = **200 students**

### 2. **MCA (Master of Computer Applications)** - 400 Students (1st & 2nd Year)
- **CS (Computer Science):** 4 Sections (A, B, C, D) &times; 50 students = **200 students**
- **DS (Data Science & Analytics):** 4 Sections (A, B, C, D) &times; 50 students = **200 students**

### 3. **BCA (Bachelor of Computer Applications)** - 400 Students (1st to 3rd Year)
- **CS (Computer Science):** 4 Sections (A, B, C, D) &times; 50 students = **200 students**
- **IT (Information Technology):** 4 Sections (A, B, C, D) &times; 50 students = **200 students**

**Total Enrolled Students:** **1,600 Indian Students** across **8 Branches** and **32 Sections** (each containing exactly 50 students across 1st to 4th Years).

---

## 🔑 Demo Login Accounts

| Role | Username | Password | Details |
|---|---|---|---|
| **Admin** | `admin` | `admin123` | Full Administrator (Dean of Engineering) |
| **B.Tech AI & ML** | `btech_aiml_student` | `student123` | Aarav Sharma (B.Tech AIML - Section A) |
| **B.Tech Data Science** | `btech_ds_student` | `student123` | Ananya Verma (B.Tech DS - Section A) |
| **B.Tech CSE** | `btech_cse_student` | `student123` | Vihaan Gupta (B.Tech CSE - Section A) |
| **MCA CS** | `mca_cs_student` | `student123` | Aditya Mishra (MCA CS - Section A) |
| **BCA IT** | `bca_it_student` | `student123` | Rohan Patel (BCA IT - Section B) |

> 💡 **Quick 1-Click Demo Buttons:** Available on the login page for instant access without typing! All 1,600 student accounts use password `student123`.

---

## 💾 JSON Architecture (No Backend / No Database)
- Initial seed data is loaded from [`src/data/initialData.json`](./src/data/initialData.json).
- All operations (adding/deleting students, saving attendance, uploading assignments, submitting solutions) manipulate the JSON state directly in memory and synchronize it to the browser's `localStorage`.
- **JSON Inspector Modal:** Click the **Inspect JSON** button in the top navbar to view the live JSON database or copy it.
- **Export JSON:** Click **Export JSON** to download the current state as a `.json` backup file.
- **Reset Data:** Click **Reset Data** anytime to restore the default seed records.

---

## 🛠️ Tech Stack
- **Framework:** React 19 + Vite
- **Styling:** Pure CSS (CSS Variables, Responsive Flexbox/Grid, Accessible Modals)
- **Icons:** `lucide-react`
- **Data Layer:** React Context API + Local JSON + LocalStorage
