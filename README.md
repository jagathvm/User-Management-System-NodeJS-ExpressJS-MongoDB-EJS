# User Management System

A full-stack web application for managing users, built with **Node.js**, **Express.js**, **MongoDB**, and **EJS**. This project offers an admin dashboard with CRUD operations for users, role-based access control, and a responsive UI, making it suitable for applications where user management is essential.

## Features

- **User Registration & Authentication**: Allows new users to sign up and existing users to log in securely.
- **Role-Based Access Control**: Admins can assign roles (e.g., admin, user) to control permissions.
- **Admin Dashboard**: A central interface for administrators to view, edit, and delete users.
- **User Search & Filter**: Easily find users by username, email, or phone number.
- **Responsive Design**: Built with EJS and Bootstrap for a clean and adaptable UI.

## Tech Stack

- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database for efficient data storage
- **EJS** - Embedded JavaScript templates for server-side rendering
- **Bootstrap** - CSS framework for responsive and visually appealing UI

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and [npm](https://npmjs.com/) installed on your machine.
- MongoDB server running locally or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jagathvm/User-Management-System-NodeJS-ExpressJS-MongoDB-EJS.git
   cd User-Management-System-NodeJS-ExpressJS-MongoDB-EJS
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```plaintext
   MONGODB_URI=<Your MongoDB connection string>
   JWT_SECRET=<Your JWT secret key>
   ```

4. Start the server:
   ```bash
   npm start
   ```
   By default, the app will run on `http://localhost:3000`.

## Usage

### Admin Dashboard

- Log in as an admin to access the dashboard.
- Add new users, edit details, assign roles, or delete users.
- The dashboard includes search and filter functionalities for easier navigation of users.

### Role Management

- Assign `user` or `admin` roles to control access to certain parts of the application.
- Role-based views and controls ensure secure and organized user management.

## Project Structure

The project is structured as follows:

```plaintext
User-Management-System-NodeJS-ExpressJS-MongoDB-EJS
├───public/               # Static assets for client-side
│ ├───scripts/            # JavaScript files for frontend functionality
│ │ └───user/             # Scripts specific to user management
│ └───stylesheets/        # CSS files for styling
│
├───server/               # Server-side application code
│ ├───config/             # Configuration files (database, environment, etc.)
│ ├───controllers/        # Controllers to handle business logic for routes
│ ├───helpers/            # Utility functions for various functionalities
│ ├───middlewares/        # Middleware functions (e.g., authentication)
│ ├───routes/             # Route definitions for API endpoints
│ └───services/           # Service layer for handling external API calls, etc.
│
└───views/                # EJS templates for rendering HTML
├───admin/                # Views specific to admin users
├───layouts/              # Main layouts used by different pages
├───partials/             # Reusable partials (e.g., header, footer)
└───user/                 # Views specific to standard user pages
```
