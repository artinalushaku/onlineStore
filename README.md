# Project Setup Guide

This guide provides instructions on how to start both the backend and frontend of the project.

## Backend (Express.js with Node.js)

### Prerequisites:
- Node.js installed
- npm installed
Steps to Start the Backend:

Navigate to the backend directory:

cd backend

Install dependencies:

npm install

Set up the database:

Open phpMyAdmin

Create a new database named onlinestore

Configure the .env file with the correct database credentials:

DB_NAME=onlinestore
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
PORT=3306

Start the backend server:

npm run dev

the backend sever runs on port 5000


## Frontend (React with Vite and TailwindCSS)

### Prerequisites:
- Node.js installed
- npm installed

### Steps to Start the Frontend:
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend server:
   ```
   npm run dev
   ```
4. The frontend will run on the port assigned  **http://localhost:3002**

## Additional Notes
- Ensure that both backend and frontend are running simultaneously for full functionality.

