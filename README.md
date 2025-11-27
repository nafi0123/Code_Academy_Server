# 🚀 CodeAcademy Backend API

A scalable and secure RESTful API built with **Node.js** and **Express.js** to manage all data and user logic for the CodeAcademy learning platform.

---

## 🎯 Project Description

This backend application handles all core operations, including user authentication, course administration, enrollment tracking, and the review system. It acts as the primary data source for the Next.js client application.

### Key Responsibilities:
* **Authentication:** Secure user sign-up, login, and token generation (JWT).
* **Data Management:** CRUD operations for Courses, Users, and Reviews.
* **Authorization:** Middleware for role-based access control (e.g., Admin vs. User).
* **Database:** Persistent data storage using **MongoDB**.

---

## 💻 Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Runtime** | **Node.js** | The execution environment. |
| **Web Framework** | **Express.js** | Fast, minimalist framework for API development. |
| **Database** | **MongoDB** | NoSQL database for flexible data modeling. |
---

## 📦 API Endpoints

The API is structured and versioned at `/api/v1`. The base URL for the local server is typically `http://localhost:5000`.

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new user. | Public |
| `POST` | `/api/v1/auth/login` | Authenticate user and return JWT. | Public |
| `GET` | `/api/v1/courses` | Retrieve all courses (supports filtering/sorting). | Public |
| `GET` | `/api/v1/courses/:id` | Get details for a single course. | Public |
| `POST` | `/api/v1/courses` | Create a new course. | Protected (Admin) |
| `POST` | `/api/v1/enroll/:courseId` | Enroll the authenticated user in a course. | Protected (User) |
| `GET` | `/api/v1/users/my-courses` | Get list of courses the user is enrolled in. | Protected (User) |
| `POST` | `/api/v1/reviews/:courseId` | Submit a review for a specific course. | Protected (User) |

---

## ⚙️ Setup & Installation

Follow these steps to get the server running locally.

### Prerequisites

* Node.js (LTS version)
* npm or yarn
* A running **MongoDB** instance (local or remote/Atlas)

### 1. Clone the repository

Use the provided repository URL to clone the project:

```bash
git clone [https://github.com/nafi0123/Code_Academy_Server.git](https://github.com/nafi0123/Code_Academy_Server.git)
cd Code_Academy_Server