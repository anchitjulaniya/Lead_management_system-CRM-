# Lead Management System (CRM+) — MERN Stack

A mini CRM application to manage sales leads with authentication, RBAC authorization, lead management, analytics, and real-time notifications.

This project was built using the **MERN stack** and follows clean architecture principles.

---

# 🌐 Live Demo

**Frontend (Vercel)**  
https://lead-management-system-crm.vercel.app/

**Backend API (Render)**  
https://lead-management-system-crm.onrender.com

**GitHub Repository**  
https://github.com/anchitjulaniya/Lead_management_system-CRM-

# Tech Stack

Frontend

* React
* Tailwind CSS
* Axios
* React Router
* Socket.IO Client

Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.IO

---

# Features

## Authentication

* JWT based login and registration
* Secure password hashing using bcrypt
* Token-based API protection

## Role-Based Access Control (RBAC)

Roles supported:

* Admin
* Manager
* Sales

Permissions example:

| Role    | Permissions                |
| ------- | -------------------------- |
| Admin   | Full access                |
| Manager | View all leads + analytics |
| Sales   | Only own/assigned leads    |

---

Below is a **clean README section** you can add to your project explaining **RBAC permissions and sample login credentials**. This is written in a **professional way suitable for reviewers**.

You can paste this directly into your `README.md`.

---

# Role-Based Access Control (RBAC)

This project implements **Role-Based Access Control (RBAC)** to ensure that users can only perform actions allowed by their assigned role. Each API route checks the required permission using a middleware.

Permissions are defined in:

```
backend/utils/permissions.js
```

Example permission structure:

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


### Admin

The **Admin** role has full system access.

Permissions:

* Create, update, and delete leads
* View all leads
* Manage users and roles
* Access dashboard analytics
* View notifications

---

### Manager

The **Manager** role focuses on team coordination and lead management.

Permissions:

* View and update leads
* Assign leads to sales users
* Access dashboard analytics
* View notifications

Restrictions:

* Cannot delete leads
* Cannot manage users

---

### Sales

The **Sales** role is limited to working on their own leads.

Permissions:

* Create leads
* View leads they created or are assigned to
* Update their assigned leads
* View notifications


Restrictions:

* Cannot delete leads
* Cannot manage users
* Cannot access dashboard analytics

---

# Sample Login Credentials

You can use the following accounts to test the system:

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

### Sales Users

```
Email: sales@test.com
Password: 123456
Role: sales
```

```
Email: test@test.com
Password: 123456
Role: sales
```

---

# Permission Enforcement

Permissions are enforced using a middleware in the backend:

```
backend/middlewares/rbacMiddleware.js
```

Example route protection:

```javascript
router.get(
  "/dashboard/summary",
  authMiddleware,
  rbac("dashboard:read"),
  dashboardController.getSummary
);
```

The middleware checks whether the logged-in user's role includes the required permission before allowing access.

---

# Lead Access Rules

Additional rules are applied for **Sales users**:

A sales user can access a lead **only if**:

```
createdBy === loggedInUser
OR
assignedTo === loggedInUser
```

This ensures proper ownership and prevents unauthorized access to other users' leads.

---

# Notification Permissions

Notifications are sent for important events such as:

* Lead assignment
* Lead status updates
* New lead creation

Users can only read their **own notifications**.

---

# Security

All protected APIs require:

```
Authorization: Bearer <JWT_TOKEN>
```

The token contains:

```
sub  -> userId
role -> user role
exp  -> token expiration
```

RBAC checks the role before executing the controller.


# Lead Management

Features:

* Create lead
* Update lead
* Delete lead
* Assign leads
* Change lead status
* Ownership enforcement

Lead fields:

* Name
* Phone
* Email
* Source
* Status
* Notes
* Assigned user

---

# Advanced Lead List API

Supports:

* Search
* Filtering
* Sorting
* Pagination

Example:

```
GET /leads?q=rahul&status=new&page=1&limit=10
```

Filters supported:

* q (search name/email/phone)
* status
* source
* assignedTo
* createdFrom
* createdTo

---

# Dashboard Analytics

Endpoint:

```
GET /dashboard/summary
```

Returns:

* Total leads
* Leads by status
* Leads by source

Example:

```
{
  "totalLeads": 150,
  "byStatus": {
    "new": 45,
    "contacted": 30,
    "qualified": 25,
    "won": 35,
    "lost": 15
  },
  "bySource": {
    "website": 80,
    "referral": 45,
    "cold": 25
  }
}
```

---

# Realtime Notifications

Implemented using **Socket.IO**.

Triggers:

* Lead created
* Lead assigned
* Lead status changed

Notifications are:

* Sent in realtime
* Persisted in MongoDB

---

# MongoDB Indexes

Indexes used:

* createdBy
* assignedTo
* status
* source
* createdAt

Compound index:

```
status + source + createdAt
```

Improves performance for filtered queries.

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
npm run dev
```

---

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

# API Endpoints

Authentication

```
POST /auth/register
POST /auth/login
```

Leads

```
POST /leads
GET /leads
GET /leads/:id
PATCH /leads/:id
DELETE /leads/:id
```

Users

```
GET /users
PATCH /users/:id/role
```

Notifications

```
GET /notifications
PATCH /notifications/:id/read
```

Dashboard

```
GET /dashboard/summary
```

---

# Author

Anchit Julaniya

MERN Stack Developer
