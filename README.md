🚀 DAYFLOW

Every workday, perfectly aligned.

DAYFLOW is a modern Human Resource Management System (HRMS) designed to bring employees, attendance, leave, payroll, documents, notifications, and HR operations together in one connected platform.



🖥️ Dashboard

<img width="1905" height="888" alt="image" src="https://github.com/user-attachments/assets/149a4078-e4cf-4342-ae47-8a38fea5dba8" />



👤 Employee Module

<img width="1917" height="909" alt="image" src="https://github.com/user-attachments/assets/26a10a98-5a16-48b8-8674-a863b2a62874" />




🧑‍💼 HR / Admin Module

<img width="1906" height="963" alt="image" src="https://github.com/user-attachments/assets/daf15e0c-bdc1-4e9d-8dd8-eb230b15b412" />


# 🚀 DAYFLOW

### Every workday, perfectly aligned.

DAYFLOW is a modern Human Resource Management System (HRMS) designed to bring employees, attendance, leave, payroll, documents, notifications, and HR operations together in one connected platform.

Built with **React, TypeScript, and Supabase**, DAYFLOW provides dedicated experiences for employees and HR/Admin users while keeping the complete workforce workflow connected.

---

## 🎯 Problem

HR teams often depend on multiple disconnected systems to manage employee information, attendance, leave requests, payroll, documents, notifications, and reports.

This can lead to:

* Scattered employee information
* Manual administrative work
* Delayed approvals
* Limited workforce visibility
* Repetitive HR operations
* Disconnected employee and HR workflows

Employees can also struggle when attendance, leave, salary, and important documents are managed through different systems.

---

## 💡 Solution

DAYFLOW provides a centralized HR platform where employees and HR teams can manage their daily workforce operations through one simple interface.

Employees can manage their workday, attendance, leave, salary information, documents, notifications, and profile.

HR/Admin users get organization-wide visibility and can manage employees, attendance, leave requests, payroll, documents, and reports.

**One platform. One workforce. One connected workflow.**

---

## ✨ Key Features

### 👤 Employee Experience

**🔐 Authentication**

Secure authentication with role-based access for employees and HR/Admin users.

**👤 Profile**

Employees can view their personal and professional information and update permitted profile details.

**⏱️ Attendance**

Employees can:

* Check in
* Check out
* Track working hours
* View attendance history
* Monitor daily attendance status

**🏖️ Leave Management**

Employees can:

* View leave balances
* Apply for leave
* Select leave type and dates
* Add a leave reason
* Track request status
* View approved and rejected requests

**💰 Salary**

Employees can view:

* Basic salary
* Allowances
* Deductions
* Net salary
* Salary history
* Payslip information

Salary information is presented as a read-only employee feature.

**📄 Documents**

Employees can access important workplace documents and permitted files.

**🔔 Notifications**

Employees receive updates related to leave, attendance, profile changes, and workplace activities.

**⚙️ Settings**

Employees can manage their profile preferences and application settings.

---

### 🧑‍💼 HR / Admin Experience

**📊 HR Dashboard**

The HR dashboard provides an organization-wide overview of workforce activity, including attendance, employees, leave, departments, activity, and payroll status.

**👥 Employee Management**

HR/Admin users can search, filter, view, and manage employee information.

Employee profiles include personal, professional, attendance, leave, salary, and document information.

**⏱️ Attendance Monitoring**

HR can monitor workforce attendance across the organization and filter information by employee, department, date, and status.

**🏖️ Leave Management**

HR can review employee leave requests, view details, approve requests, reject requests, and provide rejection comments.

**💰 Payroll**

HR/Admin users can manage salary and payroll information, including salary structures, allowances, deductions, salary history, and payslip information.

**📄 Documents**

HR can manage employee documents and files.

**📈 Reports**

HR can access reports covering attendance, leave, payroll, and workforce information.

**🔎 Global Search**

HR can quickly search for employees, employee IDs, departments, and relevant HR information.

---

## 🔄 How DAYFLOW Works

### ⏱️ Employee Attendance

```text
Employee
   ↓
Login to DAYFLOW
   ↓
Employee Dashboard
   ↓
Check In
   ↓
Workday Tracking
   ↓
Check Out
   ↓
Attendance Recorded
```

### 🏖️ Leave Management

```text
Employee
   ↓
Apply for Leave
   ↓
Pending
   ↓
HR Reviews Request
   ↓
 ┌───────────────┐
 ↓               ↓
Approve        Reject
 ↓               ↓
Approved       Rejected
```

---

## 🧪 Complete Demo Journey

The complete DAYFLOW demonstration can follow this workflow:

```text
Login
  ↓
Employee Dashboard
  ↓
Check In
  ↓
Attendance Tracking
  ↓
Apply Leave
  ↓
Logout
  ↓
HR Login
  ↓
HR Dashboard
  ↓
Review Leave Request
  ↓
Approve / Reject
  ↓
Employee Receives Update
```

This demonstrates how employee and HR workflows connect through the same platform.

---

## 🏗️ System Architecture

DAYFLOW follows a modular application architecture.

The React frontend is organized into pages, reusable components, layouts, services, hooks, contexts, types, and utilities.

Data operations are handled through a dedicated service layer that communicates with Supabase.

```text
React Application
       ↓
Pages & Components
       ↓
Service Layer
       ↓
Supabase
       ↓
PostgreSQL / Storage
```

Supabase provides:

* Authentication
* PostgreSQL database
* File storage
* Row Level Security
* Realtime capabilities

Role-based access is handled through protected frontend routes together with Supabase Row Level Security.

---

## 🛠️ Technology Stack

### Frontend

⚛️ React
🔷 TypeScript
⚡ Vite
🎨 Tailwind CSS
🧭 React Router

### Backend & Data

🟩 Supabase
🔐 Supabase Authentication
🐘 PostgreSQL
📦 Supabase Storage
🛡️ Row Level Security

### Development

Git
GitHub
VS Code
npm

---

## 🗄️ Core Data Model

DAYFLOW is organized around several major entities:

**Department**

Stores organizational department information.

**Employee**

Stores employee identity, professional information, employment status, and department relationships.

**Attendance**

Stores check-in, check-out, working hours, and attendance status.

**Leave Requests**

Stores leave applications, dates, leave types, reasons, approval status, and HR comments.

**Salary Structures**

Stores salary components such as basic salary, allowances, deductions, and net salary.

**Salary History**

Maintains historical salary information.

**Documents**

Stores metadata and references for employee documents and files.

**Notifications**

Stores employee and HR notifications together with read/unread status.

---

## 🔐 Role-Based Access

### 👤 Employee

Employees can:

* View their own profile
* Update permitted profile information
* Check in and check out
* View attendance
* Apply for leave
* Track leave requests
* View salary information
* Access documents
* View notifications
* Manage preferences

### 🧑‍💼 HR / Admin

HR/Admin users can:

* Manage employees
* Monitor organization attendance
* Review leave requests
* Approve or reject leave
* Manage payroll
* Manage employee documents
* View reports
* View workforce analytics
* Search HR information

Access control is implemented through protected application routes and Supabase Row Level Security.

---

## 📂 Project Structure

```text
src/
│
├── components/
│   └── Reusable UI components
│
├── pages/
│   └── Application pages
│
├── layouts/
│   └── Shared application layouts
│
├── routes/
│   └── Route protection and navigation
│
├── services/
│   └── Supabase and data operations
│
├── hooks/
│   └── Reusable React hooks
│
├── contexts/
│   └── Global application state
│
├── types/
│   └── TypeScript types
│
├── utils/
│   └── Utility functions
│
└── assets/
    └── Images and static assets
```

---

## 🔗 Service Architecture

DAYFLOW keeps data operations separate from UI components.

```text
React Page
    ↓
Service Layer
    ↓
Supabase
    ↓
PostgreSQL / Storage
```

This architecture keeps the application modular and makes it easier to maintain, test, and extend.

It also allows backend logic to evolve without requiring major changes to the user interface.

---

## 🔒 Security

Security is an important part of DAYFLOW's architecture.

The application uses:

* Supabase Authentication
* Protected frontend routes
* Role-based navigation
* PostgreSQL policies
* Row Level Security
* Supabase Storage
* Environment variables

Sensitive credentials and Supabase service-role keys should never be committed to the repository.

---

## 🎨 Design Philosophy

DAYFLOW is designed to feel:

**Modern · Clean · Professional · Responsive · Trustworthy · Simple**

The interface uses a consistent SaaS design language with:

* Indigo-based brand identity
* Clean cards
* Clear typography
* Responsive layouts
* Meaningful status indicators
* Accessible interactions
* Consistent spacing
* Minimal and purposeful animations

The overall goal is to make important HR information easy to understand without overwhelming the user.

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd dayflow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ Never commit `.env` files or Supabase service-role keys to GitHub.

### 4. Start the Development Server

```bash
npm run dev
```

The terminal will display the local development URL.

### 5. Create a Production Build

```bash
npm run build
```

---

## 🔮 Future Scope

DAYFLOW can be extended with additional capabilities such as:

**🤖 AI-Powered HR Assistant**

Help employees and HR teams find information, understand policies, and complete routine HR operations.

**📊 Advanced Workforce Analytics**

Provide deeper insights into attendance patterns, leave trends, workforce activity, and employee metrics.

**📱 Mobile Application**

Provide employees with quick access to attendance, leave, notifications, documents, and other daily HR operations.

**📧 Automated Notifications**

Integrate email and other communication channels for automated HR notifications and reminders.

**📅 Calendar Integration**

Connect leave and attendance information with external calendar platforms.

**💳 Automated Payroll Processing**

Further automate payroll calculations and processing.

**📄 Automated Document Generation**

Generate payslips, employee letters, certificates, and other HR documents automatically.

**🔔 Advanced Realtime Notifications**

Provide instant updates across employee and HR workflows.

**🧠 Employee Insights**

Use intelligent analytics to help HR teams identify workforce trends and make better decisions.

---

## 🏆 Hackathon Highlights

DAYFLOW focuses on solving a real-world HR problem through a connected digital experience.

The project focuses on:

* 🎯 Solving fragmented HR workflows
* 💡 Creating a unified employee experience
* 🔐 Implementing role-based access
* 📊 Making HR information easier to understand
* 🎨 Building a professional SaaS interface
* 🔄 Connecting employee and HR workflows
* 📱 Maintaining a responsive experience

---

## ❤️ Why DAYFLOW?

DAYFLOW is more than an employee directory or attendance tracker.

It connects the complete employee lifecycle:

**People → Attendance → Leave → Payroll → Documents → Notifications → Reports**

Our goal is to make everyday HR operations:

**Simpler. Faster. More connected.**

---

## 👥 Team

DAYFLOW was built as a collaborative hackathon project.

The team worked across:

🎨 Frontend Development
⚙️ Backend and Database Integration
🔗 Frontend + Backend Integration
🧪 Testing and Workflow Validation
💡 UI/UX Design

---

## 📌 Project Status

DAYFLOW is a hackathon-focused HRMS platform demonstrating connected employee and HR workflows using React, TypeScript, and Supabase.

The architecture is modular so additional HR capabilities can be added as the platform evolves.

---

<div align="center">

# 🚀 DAYFLOW

### Every workday, perfectly aligned.

Built with React + TypeScript + Supabase

</div>

