# Lead Management System (CRM+) — MERN Stack

A **mini CRM (Customer Relationship Management) application** built with the **MERN stack** to manage sales leads efficiently.

The system includes **authentication, role-based access control (RBAC), lead management, analytics dashboard, real-time notifications, and user management**.

This project demonstrates **full-stack development with scalable architecture, secure APIs, and responsive UI**.

---

# 🌐 Live Demo

**Frontend (Vercel)**
https://lead-management-system-crm.vercel.app/

**Backend API (Render)**
https://lead-management-system-crm.onrender.com

**GitHub Repository**
https://github.com/anchitjulaniya/Lead_management_system-CRM-

---

# Tech Stack

## Frontend

* React
* Tailwind CSS
* Axios
* React Router
* Socket.IO Client

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.IO

---

# Design Decisions

Some architectural decisions made during development:

• JWT authentication for stateless API security  
• RBAC middleware for centralized permission enforcement  
• Socket.IO for real-time notifications  
• Pagination and filtering implemented at database level  
• Indexes added to optimize lead queries  
• React Context used for authentication state management

# Application Pages

After authentication, users can access the following main pages:

## Dashboard

The **Dashboard** provides an overview of lead performance.

Features:

* Total leads count
* Leads by status
* Leads by source
* Real-time updates when leads are created or updated

Endpoint used:

```
GET /dashboard/summary
```

---

## Leads Page

The **Leads page** is the core part of the CRM system where users manage sales leads.

Features:

* Create new leads
* Update lead details
* Delete leads (Admin only)
* Assign leads to sales users
* Change lead status
* Search leads
* Filter by status, source, and date
* Sort leads
* Pagination support

Lead fields include:

* Name
* Phone
* Email
* Source
* Status
* Notes
* Assigned User

Example API request:

```
GET /leads?q=rahul&status=new&page=1&limit=10
```

Supported filters:

* search (name/email/phone)
* status
* source
* assignedTo
* createdFrom
* createdTo

---

## Users Page

The **Users page** allows administrators to manage system users.

Only **Admin users** can access this page.

Features:

* View all users
* View current user roles
* Update user roles
* Role updates apply immediately

Example table:

```
Name        Email                Role        Change Role
--------------------------------------------------------
Rahul       rahul@test.com       sales       manager
Priya       priya@test.com       manager     sales
Admin       admin@test.com       admin       disabled
```

API used:

```
GET /users
PATCH /users/:id/role
```

Example request:

```
PATCH /users/6658a9c2/role

{
  "role": "manager"
}
```

---

## Profile Page

The **Profile page** shows information about the logged-in user.

Features:

* View user details
* See current role
* Account information
* Quick access to user identity within the system

---

# Authentication

Authentication is handled using **JWT (JSON Web Tokens)**.

Features:

* User registration
* Secure login
* Password hashing using bcrypt
* Token-based API protection

Endpoints:

```
POST /auth/register
POST /auth/login
```

All protected APIs require:

```
Authorization: Bearer <JWT_TOKEN>
```

Token contains:

```
sub  -> userId
role -> user role
exp  -> expiration time
```

---

# Role-Based Access Control (RBAC)

The system uses **RBAC to restrict access based on user roles**.

Roles supported:

* Admin
* Manager
* Sales

Permissions are defined in:

```
backend/utils/permissions.js
```

Example structure:

```javascript
module.exports = {

  admin: [
    "lead:read",
    "lead:write",
    "lead:delete",
    "user:read",
    "user:write",
    "dashboard:read",
    "notification:read"
  ],

  manager: [
    "lead:read",
    "lead:write",
    "dashboard:read",
    "notification:read"
  ],

  sales: [
    "lead:read",
    "lead:write",
    "notification:read"
  ]

};
```

---

## Role Permissions

### Admin

Full system access.

Permissions:

* Create, update, delete leads
* Manage users and roles
* Access dashboard analytics
* View notifications

---

### Manager

Responsible for managing leads.

Permissions:

* View leads
* Assign leads
* Update lead status
* Access dashboard analytics

Restrictions:

* Cannot delete leads
* Cannot manage users

---

### Sales

Focused on handling assigned leads.

Permissions:

* Create leads
* View assigned leads
* Update assigned leads
* View notifications

Restrictions:

* Cannot delete leads
* Cannot manage users
* Cannot access analytics

---

# Lead Ownership Rules

Sales users can access a lead only if:

```
createdBy === loggedInUser
OR
assignedTo === loggedInUser
```

This ensures proper **data ownership and privacy**.

---

# Realtime Notifications

Implemented using **Socket.IO**.

Notifications are triggered when:

* A lead is created
* A lead is assigned
* Lead status changes

Notifications are:

* Delivered in real time
* Stored in MongoDB

---

# MongoDB Indexes

Indexes were added to improve query performance.

Single indexes:

createdBy  
assignedTo  
status  
source  
createdAt  

Compound index for lead list queries:

status + source + createdAt

---

# Folder Structure

```
/backend
  /config
  /controllers
  /middlewares
  /models
  /routes
  /services
  /utils

/frontend
  /components
  /pages
  /context
  /hooks
  /services
  /socket
```

---

# Installation

## Clone Repository

```
git clone <repository_url>
```

---

## Backend Setup

```
cd backend
npm install
Create a `.env` file in the backend folder.

Example:

PORT=5000

MONGO_URI=mongodb://localhost:27017/crm

JWT_SECRET=your_jwt_secret_key

CLIENT_URL=http://localhost:5173
npm run dev
```

---

## Frontend Setup

```
cd frontend
npm install
Create a `.env` file in the backend folder.

Example:

PORT=5000

MONGO_URI=mongodb://localhost:27017/crm

JWT_SECRET=your_jwt_secret_key

CLIENT_URL=http://localhost:5173
npm run dev
```

---


# API Endpoints

## Authentication

```
POST /auth/register
POST /auth/login
```

## Leads

```
POST /leads
GET /leads
GET /leads/:id
PATCH /leads/:id
DELETE /leads/:id
```

## Users

```
GET /users
PATCH /users/:id/role
```

## Notifications

```
GET /notifications
PATCH /notifications/:id/read
```

# API Documentation

A Postman collection is available here:

https://github.com/anchitjulaniya/Lead_management_system-CRM-/postman

It includes all endpoints for:

- Authentication
- Leads
- Users
- Notifications
- Dashboard

# Postman Setup

This project includes a Postman collection for testing APIs.

Before using the collection:

Create an environment variable:

Example request:

POST {{BaseURL}}/auth/login

## Dashboard

```
GET /dashboard/summary
```

---

# Sample Login Credentials

### Admin

```
Email: admin@test.com
Password: 123456
Role: admin
```

### Manager

```
Email: manager@test.com
Password: 123456
Role: manager
```

### Sales

```
Email: sales@test.com
Password: 123456
Role: sales
```

---

# Author

Anchit Julaniya
MERN Stack Developer
