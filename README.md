🚀 DAYFLOW

Every workday, perfectly aligned.

DAYFLOW is a modern Human Resource Management System (HRMS) designed to bring employees, attendance, leave, payroll, documents, notifications, and HR operations together in one connected platform.

📸 Project Preview

<!--
Add your screenshots inside a folder named `screenshots`
and replace the filenames below.

Example:
![DAYFLOW Dashboard](screenshots/dashboard.png)
-->

🖥️ Dashboard

<p align="center">
  <img src="screenshots/dashboard.png" alt="DAYFLOW Dashboard" width="90%">
</p>

👤 Employee Module

<p align="center">
  <img src="screenshots/employee.png" alt="DAYFLOW Employee Module" width="90%">
</p>

🧑‍💼 HR / Admin Module

<p align="center">
  <img src="screenshots/admin.png" alt="DAYFLOW HR Admin Module" width="90%">
</p>

💡 Add your real screenshots here.
Create a screenshots folder in the project and place your images inside it.

🎯 Problem

HR teams often depend on multiple disconnected systems to manage:

Employee information

Attendance

Leave requests

Payroll

Documents

Notifications

HR reports

This can lead to manual work, scattered information, delayed approvals, and poor visibility.

💡 Our Solution

DAYFLOW provides a single, centralized HR platform where employees and HR teams can manage their daily workforce operations through one simple interface.

✨ Key Features

👤 Employee Experience

Feature

Description

🔐 Authentication

Secure login and role-based access

👤 Profile

View and manage employee information

⏱️ Attendance

Check-in, check-out and track working hours

🏖️ Leave

Apply for leave and track requests

💰 Salary

View salary details and payslip information

📄 Documents

Access important employee documents

🔔 Notifications

Receive HR and workplace updates

⚙️ Settings

Manage profile and preferences

🧑‍💼 HR / Admin Experience

Feature

Description

📊 HR Dashboard

Organization-wide workforce overview

👥 Employees

Search, filter and manage employees

⏱️ Attendance

Monitor workforce attendance

🏖️ Leave Management

Review, approve or reject requests

💰 Payroll

Manage salary and payroll information

📄 Documents

Manage employee documents

📈 Reports

Attendance, leave and payroll insights

🔎 Global Search

Quickly find employees and HR information

🔄 How DAYFLOW Works

Employee Attendance

        👤 Employee
             │
             ▼
        Login to DAYFLOW
             │
             ▼
        Employee Dashboard
             │
             ▼
          Check In
             │
             ▼
        Workday Tracking
             │
             ▼
          Check Out
             │
             ▼
      Attendance Recorded

Leave Management

Employee
   │
   ▼
Apply for Leave
   │
   ▼
   Pending
   │
   ▼
HR Reviews Request
   │
   ├───────────────┐
   ▼               ▼
Approve          Reject
   │               │
   ▼               ▼
Approved         Rejected

🏗️ System Architecture

┌───────────────────────────────────────────────┐
│                 DAYFLOW                       │
│            React + TypeScript                 │
├───────────────────────────────────────────────┤
│        Pages • Components • Services           │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│                  SUPABASE                     │
├──────────────┬──────────────┬─────────────────┤
│     Auth     │  PostgreSQL  │     Storage     │
│              │   Database   │ Documents/Files │
└──────────────┴──────────────┴─────────────────┘
                        │
                        ▼
              Row Level Security
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
          Employee             HR/Admin

Why Supabase?

Supabase Auth → Authentication and user sessions

PostgreSQL → Structured HR data

Supabase Storage → Employee documents and files

Row Level Security → Role-based data protection

Realtime capabilities → Support for live application updates

🛠️ Technology Stack

Frontend

⚛️ React

🔷 TypeScript

⚡ Vite

🎨 Tailwind CSS

🧭 React Router

Backend & Data

🟩 Supabase

🔐 Supabase Authentication

🐘 PostgreSQL

📦 Supabase Storage

🛡️ Row Level Security (RLS)

Development

Git

GitHub

VS Code

npm

🗄️ Core Data Model

DAYFLOW is organized around the following major entities:

Department
    │
    ▼
Employee
 ┌──┼──────────┬───────────┐
 ▼  ▼          ▼           ▼
Attendance   Leave       Salary     Documents
                │
                ▼
           Notifications

Main Tables

profiles
departments
employees
attendance
leave_requests
salary_structures
salary_history
documents
notifications

🔐 Role-Based Access

DAYFLOW provides two main roles.

👤 Employee

Employees can:

View their own profile

Update permitted profile information

Check in and check out

View attendance

Apply for leave

Track leave status

View salary information

Access their documents

View notifications

🧑‍💼 HR / Admin

HR/Admin can:

Manage employees

Monitor organization attendance

Review leave requests

Approve or reject leave

Manage payroll

Manage documents

View reports and analytics

🔒 Access control is designed using protected frontend routes and Supabase Row Level Security.

📂 Project Structure

src/
│
├── components/      # Reusable UI components
├── pages/            # Application pages
├── layouts/          # Shared application layouts
├── routes/           # Route protection and navigation
├── services/         # Data/API operations
├── hooks/            # Reusable React hooks
├── contexts/         # Global state/context
├── types/             # TypeScript types
├── utils/             # Utility functions
└── assets/            # Images and static assets

Service Architecture

The application keeps data operations separate from UI components:

React Page
    │
    ▼
Service Layer
    │
    ▼
Supabase
    │
    ▼
PostgreSQL / Storage

This makes the application easier to maintain and allows backend logic to evolve without rewriting the UI.

🎨 Design Philosophy

DAYFLOW is designed to feel:

✨ Modern

🧹 Clean

💼 Professional

📱 Responsive

🔐 Trustworthy

⚡ Simple to use

The interface uses a consistent SaaS design language with:

Indigo-based brand identity

Clean cards

Clear typography

Responsive layouts

Meaningful status indicators

Accessible interactions

Minimal and purposeful animations

⚙️ Getting Started

1. Clone the repository

git clone <YOUR_REPOSITORY_URL>
cd dayflow

2. Install dependencies

npm install

3. Configure environment variables

Create a .env file in the project root:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

⚠️ Never commit .env or Supabase service-role keys to GitHub.

4. Start the development server

npm run dev

The terminal will display the local development URL.

5. Create a production build

npm run build

🧪 Key User Journey

A complete DAYFLOW demonstration can follow this flow:

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

This demonstrates how the employee and HR workflows connect through the same platform.

🏆 Why DAYFLOW?

One platform. One workforce. One connected workflow.

DAYFLOW is not just an employee directory or attendance tracker.

It connects the complete employee lifecycle:

People
  ↓
Attendance
  ↓
Leave
  ↓
Payroll
  ↓
Documents
  ↓
Notifications
  ↓
Reports

Our goal is to make everyday HR operations simpler, faster, and more connected.

🔮 Future Scope

Potential future improvements include:

🤖 AI-powered HR assistant

📊 Advanced workforce analytics

📱 Dedicated mobile application

📧 Automated email notifications

📅 Calendar integrations

💳 Automated payroll processing

📄 Automated document generation

🔔 Advanced real-time notifications

🧠 Employee insights and HR recommendations

👥 Team

Built with ❤️ for the Hackathon

DAYFLOW Team

Area

Responsibility

🎨 Frontend

React, TypeScript, UI/UX

⚙️ Backend

Supabase, PostgreSQL, Auth

🔗 Integration

Frontend + Backend

🧪 Testing

Feature and workflow testing

🌟 Hackathon Highlights

What we focused on

🎯 Solving a real-world HR problem

💡 Creating a unified employee experience

🔐 Implementing role-based access

📊 Making HR data easier to understand

🎨 Building a professional SaaS interface

🔄 Connecting employee and HR workflows

📱 Keeping the experience responsive and accessible

<div align="center">

🚀 DAYFLOW

Every workday, perfectly aligned.

Built with React + TypeScript + Supabase

⭐ If you like the project, consider giving it a star!

</div>
