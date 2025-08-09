# Test School Competency Assessment Platform

A comprehensive web application for educational assessments, quizzes, and certification.

![Test School Platform](https://via.placeholder.com/1200x600?text=Test+School+Competency+Assessment+Platform)

## 📋 Table of Contents

- [Test School Competency Assessment Platform](#test-school-competency-assessment-platform)
  - [📋 Table of Contents](#-table-of-contents)
  - [🔍 Overview](#-overview)
  - [✨ Features](#-features)
    - [User Authentication and Management](#user-authentication-and-management)
    - [Quiz Management (Admin)](#quiz-management-admin)
    - [Student Experience](#student-experience)
    - [Dashboard and Reporting](#dashboard-and-reporting)
  - [🛠 Technology Stack](#-technology-stack)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
  - [📁 Project Structure](#-project-structure)
  - [👥 User Roles and Access](#-user-roles-and-access)
  - [🔌 API Integration](#-api-integration)
  - [Additional Information](#additional-information)
    - [Quiz Step Progression](#quiz-step-progression)
    - [Time Management](#time-management)
    - [Certification Levels](#certification-levels)

## 🔍 Overview

The Test School Competency Assessment Platform is a modern web application designed to provide educational institutions with a robust system for creating, administering, and evaluating competency assessments and quizzes. The platform supports multiple user roles, step-by-step quiz progression, and certification based on performance.

## ✨ Features

### User Authentication and Management
- **User Registration & Login**: Secure email and password-based authentication
- **Role-Based Access Control**: Different interfaces and permissions for students and administrators
- **Password Recovery**: OTP-based password reset functionality

### Quiz Management (Admin)
- **Create and Edit Quizzes**: Comprehensive quiz creation tools with various question types
- **Question Bank**: Maintain a library of questions that can be reused across different quizzes
- **Student Performance Analytics**: Track and analyze student performance metrics

### Student Experience
- **Quiz Taking**: Interactive interface for completing quizzes
- **Step-Based Progression**: Multi-step quiz process with adaptive difficulty
- **Timed Questions**: Each question has a time limit for completion
- **Immediate Feedback**: Receive instant results after completing quiz steps
- **Certification**: Earn certifications based on performance levels

### Dashboard and Reporting
- **Admin Dashboard**: Overview of system usage, quiz performance, and user statistics
- **Student Dashboard**: View available quizzes, past results, and earned certifications
- **Result Analysis**: Detailed breakdowns of quiz performance

## 🛠 Technology Stack

- **Frontend**:
  - React with TypeScript
  - Redux Toolkit for state management
  - RTK Query for API interactions
  - React Router for navigation
  - TailwindCSS for styling

- **Backend Integration**:
  - RESTful API integration
  - JWT authentication
  - Axios for HTTP requests

## 🚀 Getting Started

### Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v18.0.0 or higher)
- npm (v8.0.0 or higher) or yarn (v1.22.0 or higher)
- Access to the backend API server (see API Integration section)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/antor-arif/test_exam_frontend.git
   cd test_exam_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or using yarn
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm start
   # or using yarn
   yarn start
   ```

2. The application will be available at `http://localhost:3000` (or another port if 3000 is in use)

3. For production builds:
   ```bash
   npm run build
   # or using yarn
   yarn build
   ```

## 📁 Project Structure

```
src/
├── api/                  # API integration with RTK Query
├── app/                  # Redux store configuration
├── components/           # Reusable UI components
├── features/             # Feature-based modules
│   ├── admin/            # Admin dashboard and tools
│   ├── auth/             # Authentication components
│   ├── quiz/             # Quiz-taking functionality
│   └── user/             # User profile and results
├── hooks/                # Custom React hooks
├── pages/                # Page-level components
├── routes/               # Route definitions
├── styles/               # Global styles
└── utils/                # Utility functions
```

## 👥 User Roles and Access

The application supports different user roles:

1. **Students**:
   - Take quizzes and assessments
   - View personal results and certificates
   - Update profile information

2. **Administrators**:
   - Manage users (create, edit, delete)
   - Create and manage quizzes and questions
   - View comprehensive reports and analytics

## 🔌 API Integration

The application integrates with a backend API server for data persistence and business logic. Key API endpoints include:

- **Authentication**: `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`
- **Quiz Management**: `/quizzes`, `/questions`
- **User Management**: `/users`, `/profile`
- **Results**: `/results`, `/certificates`

Make sure the backend server is running and accessible from the frontend application.



## Additional Information

### Quiz Step Progression

The quiz system is designed with a multi-step approach:
1. Each quiz consists of multiple steps (typically 3)
2. Users must pass each step to proceed to the next
3. Each step may have different difficulty levels
4. Final certification level is based on performance across all steps

### Time Management

- Questions are time-limited (typically 1 minute per question)
- When time expires, the current answer is automatically submitted
- The timer is visually displayed to help users manage their time

### Certification Levels

Based on quiz performance, users can achieve different certification levels:
- A1
- A2
- B1
- B2
- C1
- C2

Each level has specific requirements in terms of accuracy and completion time.

---

Developed with ❤️ by the Test School Development Team
