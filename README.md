# Overcloud-Legacy

## Overview
Overcloud-Legacy is a web application designed to manage and share documents securely after death. It includes features such as user authentication, document upload, and secure sharing. The project uses a combination of frontend and backend technologies, including React, Node.js, Express, and AWS services simulated with LocalStack for now.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- Docker
- Docker Compose
- Node.js (for local development)

## Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/yourusername/Overcloud-Legacy.git
cd Overcloud-Legacy
```

### 2. Environment Variables
Create a `.env` file in the backend directory with the following content:

### 3. Install Dependencies
Navigate to the frontend and backend directories and install the dependencies:
```sh
cd frontend
npm install
cd ../backend
npm install
```

### 4. Start the Application
Use Docker Compose to start the application, including the frontend, backend, MongoDB, and LocalStack services:
```sh
docker-compose up
```

### 5. Access the Application
- **Frontend**: Open your browser and navigate to [http://localhost:8085](http://localhost:8085)
- **Backend**: The backend API is available at [http://localhost:3000](http://localhost:3000)

## Project Structure
- **frontend**: Contains the React frontend application.
- **backend**: Contains the Node.js backend application.
- **localstack**: Contains configuration for LocalStack to simulate AWS services.
- **docker-compose.yml**: Docker Compose configuration file to set up the entire application stack.

## Frontend
The frontend is built with React and Vite. It includes components for user authentication, document management, and navigation.

### Key Files
- `App.tsx`: Main application component.
- `src/components/`: Contains various React components such as Navbar, Sidebar, DocumentPage, etc.
- `src/services/`: Contains service files for handling API requests.
- `authContext.tsx`: Context for managing authentication state.

### Scripts
- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run preview`: Preview the production build.

## Backend
The backend is built with Node.js and Express. It includes routes for user authentication, file management, and more.

### Key Files
- `server.js`: Main server file.
- `routes/`: Contains route definitions for users, files, and uploads.
- `controllers/`: Contains controller logic for handling requests.
- `models/`: Contains Mongoose models for MongoDB collections.
- `services/`: Contains service files for interacting with AWS services and DynamoDB.

### Script
`npm start`: Start the backend server.

## LocalStack
LocalStack is used to simulate AWS services locally. It is configured to run within a Docker container.

### Key File
`localstack.Dockerfile`: Dockerfile for LocalStack.

## Additional Information
- **Authentication**: JWT-based authentication is used for securing API endpoints.
- **File Upload**: Multer is used for handling file uploads, and files are stored in an S3 bucket simulated by LocalStack.
- **Cron Jobs**: Node-cron is used to schedule periodic tasks, such as checking user activity.

## Troubleshooting
- Ensure Docker and Docker Compose are installed and running.
- Check the `.env` file for correct environment variable values.