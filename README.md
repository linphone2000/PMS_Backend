# PMS Backend - Pharmacy Management System

The backend server for a Pharmacy Management System, built with Express.js and MongoDB (MERN stack), to handle inventory management API requests.

## Overview
PMS_Backend powers the server-side of a Pharmacy Management System, providing APIs for inventory management tasks like tracking medicine stock and handling pharmacy operations. It connects to a MongoDB database and serves the React frontend.

## Tech Stack
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Environment**: Node.js

## Installation
1. **Prerequisites**:
   - Ensure Node.js (v16 or later) is installed on your computer. Download from [nodejs.org](https://nodejs.org).

2. **Navigate to the Project Folder**:
   ```bash
   cd PMS_Backend
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Set Up Environment Variables**:
   - Contact the project owner for the `.env` file, which contains the database URLs.
   - Place the `.env` file in the `PMS_Backend` root directory.

5. **Run the Backend Server**:
   After installing dependencies, start the server with:
   ```bash
   nodemon server.js
   ```
   The server will run on the port specified in the `.env` file (e.g., `http://localhost:3000`).

## Usage
- Ensure the MongoDB database is running and accessible via the URL in the `.env` file.
- The backend provides APIs (e.g., `/api/inventory`) for the PMS frontend to manage pharmacy inventory.
- Test the APIs using tools like Postman or connect with the PMS_Frontend app.

## Environment Variables
- Requires a `.env` file with database URLs.
- **How to Obtain**: Contact the project owner for the `.env` file.
- **Example**:
  ```
  MONGO_URI=mongodb://localhost:27017/pms_db
  PORT=5000
  ```