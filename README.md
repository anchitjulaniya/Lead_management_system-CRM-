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
