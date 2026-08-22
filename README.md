# DAYFLOW

### Every workday, perfectly aligned.

DAYFLOW is a modern Human Resource Management System (HRMS) designed to centralize employee management, attendance, leave management, payroll, documents, notifications, and HR operations in one clean and intuitive platform.

The system provides separate experiences for **Employees** and **Admin/HR**, with role-based access and permissions.

---

## 🚀 Features

### 👤 Employee

* Secure login and authentication
* Employee profile
* Attendance tracking
* Check-in / Check-out
* Working-hours tracking
* Daily and weekly attendance history
* Leave balance
* Apply for leave
* Track leave requests
* Salary information
* Salary history
* Documents
* Notifications
* Profile settings

### 🧑‍💼 Admin / HR

* HR dashboard
* Employee directory
* Employee search and filtering
* Employee profile management
* Department management
* Organization-wide attendance monitoring
* Leave request management
* Approve / reject leave requests
* Payroll management
* Salary structure management
* Payslip interface
* Employee document management
* Attendance reports
* Leave reports
* Payroll reports
* Global search
* Notifications

---

## 🎯 Problem Statement

Organizations often manage employee information, attendance, leave, salary, and HR processes across multiple disconnected systems.

This can result in:

* Manual work
* Scattered employee information
* Difficulty tracking attendance
* Delayed leave approvals
* Poor visibility into payroll
* Inefficient HR workflows

DAYFLOW brings these workflows together into a single centralized platform.

---

## 💡 Solution

DAYFLOW provides a unified HR management platform where:

**Employees can**

* Manage their profile
* Track attendance
* Check in and check out
* Apply for leave
* View leave status
* View salary information
* Access documents
* Receive notifications

**HR/Admin can**

* Manage employees
* Monitor attendance
* Approve/reject leave
* Manage payroll
* Manage employee documents
* Generate reports
* Monitor organization-wide HR activity

---

## 🏗️ System Architecture

```text
                         DAYFLOW
                            │
              ┌─────────────┴─────────────┐
              │                           │
           FRONTEND                    BACKEND
              │                           │
        React + TypeScript             Supabase
              │                           │
        React Router              ┌───────┼────────┐
              │                   │       │        │
        Tailwind CSS             Auth  PostgreSQL Storage
              │                   │       │        │
              └───────────────────┴───────┴────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Chart library
* Reusable component architecture

### Backend

* Supabase
* Supabase Authentication
* PostgreSQL
* Supabase Storage
* Row Level Security (RLS)
* Supabase Realtime where required

### Development Tools

* Git
* GitHub
* VS Code
* npm

---

## 🔐 Authentication & Authorization

DAYFLOW supports two primary roles:

```text
Employee
HR / Admin
```

### Employee permissions

Employees can:

* View their own profile
* Edit limited profile information
* View their own attendance
* Check in / check out
* Apply for leave
* View leave status
* View salary information
* Access their documents
* View notifications

### HR/Admin permissions

HR/Admin can:

* View employees
* Edit employee information
* View organization attendance
* Manage leave requests
* Approve/reject leave
* Manage payroll
* Update salary structures
* Manage documents
* View reports

Role-based access is enforced through the application and Supabase Row Level Security policies.

---

## 🗄️ Database Structure

The main database entities include:

```text
profiles
departments
employees
attendance
leave_types
leave_requests
salary_structures
salary_history
documents
notifications
```

### Basic relationship

```text
Department
    │
    └── Employees
          │
          ├── Attendance
          │
          ├── Leave Requests
          │
          ├── Salary
          │
          ├── Documents
          │
          └── Notifications
```

---

## 📂 Project Structure

```text
dayflow/
│
├── src/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── employee/
│   │   ├── attendance/
│   │   ├── leave/
│   │   ├── payroll/
│   │   └── notifications/
│   │
│   ├── pages/
│   │   ├── auth/
│   │   ├── employee/
│   │   └── admin/
│   │
│   ├── layouts/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │   ├── authService.ts
│   │   ├── employeeService.ts
│   │   ├── attendanceService.ts
│   │   ├── leaveService.ts
│   │   ├── payrollService.ts
│   │   ├── documentService.ts
│   │   └── notificationService.ts
│   │
│   ├── hooks/
│   │
│   ├── contexts/
│   │
│   ├── types/
│   │
│   ├── data/
│   │
│   ├── utils/
│   │
│   └── assets/
│
├── public/
│
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 📊 Main Modules

### 1. Authentication

```text
/login
/signup
/verify-email
```

Provides authentication and role-based redirection.

---

### 2. Employee Dashboard

```text
/employee/dashboard
```

Provides:

* Attendance summary
* Working hours
* Leave balance
* Pending requests
* Recent activity
* Notifications

---

### 3. Employee Management

```text
/admin/employees
/admin/employees/:id
```

HR can search, filter, view and manage employee information.

---

### 4. Attendance

```text
/employee/attendance
/admin/attendance
```

Includes:

* Check-in
* Check-out
* Working hours
* Daily attendance
* Weekly attendance
* Attendance status
* HR workforce monitoring

---

### 5. Leave Management

```text
/employee/leave
/admin/leave
```

Employee:

```text
Apply → Pending → Approved/Rejected
```

HR:

```text
View → Review → Approve/Reject
```

---

### 6. Payroll

```text
/employee/salary
/admin/payroll
```

Includes:

* Salary structure
* Basic salary
* Allowances
* Deductions
* Net salary
* Salary history
* Payroll dashboard
* Payslip interface

---

### 7. Documents

```text
/employee/documents
/admin/documents
```

Uses Supabase Storage for document management when storage is configured.

---

### 8. Notifications

Provides notifications for:

* Leave approval
* Leave rejection
* Attendance reminders
* Profile updates
* Other HR activities

---

### 9. Reports

```text
/admin/reports
```

Reports include:

* Attendance reports
* Leave reports
* Payroll reports

Reports support filtering and CSV export.

---

## 🔄 Application Workflow

### Employee Workflow

```text
Login
  ↓
Employee Dashboard
  ↓
Check In
  ↓
Work
  ↓
Check Out
  ↓
Attendance Recorded
```

### Leave Workflow

```text
Employee
   ↓
Apply Leave
   ↓
Pending
   ↓
HR Reviews
   ↓
┌───────────────┐
│               │
Approve       Reject
│               │
↓               ↓
Approved      Rejected
```

---

## 🔎 Global Search

DAYFLOW provides global search across:

* Employees
* Employee IDs
* Departments
* Leave requests

Search results are grouped by category and respect user permissions.

---

## 📱 Responsive Design

DAYFLOW is designed for:

### Desktop

* Persistent sidebar
* Multi-column dashboards
* Tables
* Charts

### Tablet

* Collapsible sidebar
* Responsive cards
* Scrollable tables where necessary

### Mobile

* Compact navigation
* Stacked cards
* Mobile-friendly forms
* Mobile attendance
* Mobile leave application

---

## 🔒 Security

Security considerations include:

* Supabase Authentication
* Role-based authorization
* Row Level Security (RLS)
* Protected application routes
* Environment variables for credentials
* Restricted employee data access
* Restricted HR/Admin functionality

Never expose Supabase service-role keys in the frontend.

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not commit `.env` to GitHub.

Add it to `.gitignore`:

```gitignore
.env
.env.local
```

---

## 💻 Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate into the project:

```bash
cd dayflow
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application at the URL provided by Vite.

---

## 🧪 Testing

Before deployment, verify:

* [ ] Employee login works
* [ ] HR login works
* [ ] Logout works
* [ ] Protected routes work
* [ ] Employee cannot access HR pages
* [ ] Employee check-in works
* [ ] Employee check-out works
* [ ] Working hours are calculated
* [ ] Leave application works
* [ ] HR receives leave request
* [ ] HR can approve leave
* [ ] HR can reject leave
* [ ] Employee sees updated leave status
* [ ] Employee profile updates work
* [ ] Search works
* [ ] Filters work
* [ ] Payroll calculations work
* [ ] Notifications work
* [ ] Documents work
* [ ] Reports work
* [ ] CSV export works
* [ ] Mobile layout works

---

## 🚀 Development Roadmap

### Phase 1 — Foundation

* Project setup
* Design system
* Authentication
* Role-based routing

### Phase 2 — Dashboards

* Employee dashboard
* HR dashboard

### Phase 3 — Employee Management

* Employee directory
* Employee profiles
* Search and filtering

### Phase 4 — Attendance

* Check-in/check-out
* Daily attendance
* Weekly attendance
* HR attendance monitoring

### Phase 5 — Leave

* Leave application
* Leave balance
* Leave approval
* Leave rejection
* Leave calendar

### Phase 6 — Payroll

* Salary
* Payroll
* Salary history
* Payslip

### Phase 7 — Supporting Modules

* Documents
* Notifications
* Reports
* Global search
* Settings

### Phase 8 — Final Polish

* Responsive optimization
* Accessibility
* Error handling
* Loading states
* UI animations
* Performance improvements
* Final testing

---

## 👥 Team Collaboration

The project can be divided into two major workstreams.

### Frontend Team

Responsible for:

* React UI
* Components
* Pages
* Routing
* Responsive design
* Frontend interactions

### Backend Team

Responsible for:

* Supabase project
* Database schema
* Authentication
* Row Level Security
* Storage
* Database queries
* Backend service layer
* Data validation

Both teams should agree on the database structure and service/API contracts before integration.

---

## 🎨 Design Philosophy

DAYFLOW should feel:

* Professional
* Modern
* Clean
* Minimal
* Trustworthy
* Enterprise-ready
* Accessible
* Responsive

The interface should avoid looking like a generic CRUD project or an old enterprise admin panel.

DAYFLOW has its own visual identity and does not copy IceHrm branding, source code, layouts or exact UI.

---

## 🏆 Hackathon Goal

DAYFLOW aims to demonstrate how a centralized HR platform can simplify everyday workforce management through:

**One platform → One workforce → One connected workflow.**

The hackathon prototype focuses on creating a realistic, interactive HRMS experience rather than static screens.

---

## 📄 License

This project was created as a hackathon project.

---

# Author
VAISHNAVI DESHPANDE
DEEPA MS

## 👩‍💻 Team

Built with ❤️ by the DAYFLOW team.

**DAYFLOW — Every workday, perfectly aligned.**
