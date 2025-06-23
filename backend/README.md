# Course Management System - Backend

This is the backend API for the Course Management System, built with Express.js and MongoDB.

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling for Node.js
- **Express Validator**: Middleware for input validation
- **Docker**: For containerization

## Architecture

The backend follows a layered architecture:
- **Models**: Define data structure and schema
- **Routes**: Handle HTTP requests and define API endpoints
- **Controllers**: Implement business logic (embedded in routes in this implementation)
- **Database**: MongoDB for persistent storage

## API Endpoints

### Courses
- `POST /api/courses` - Create a new course
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get a specific course
- `DELETE /api/courses/:id` - Delete a course

### Course Instances
- `POST /api/instances` - Create a new course instance
- `GET /api/instances/:year/:semester` - Get all instances for a semester
- `GET /api/instances/:year/:semester/:courseId` - Get a specific instance
- `DELETE /api/instances/:year/:semester/:courseId` - Delete a specific instance

## Prerequisites

- Node.js 14.x or higher
- MongoDB

## Running Locally

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   - Create a `.env` file with the following variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/courseManagementSystem
     ```

3. Start the server:
   ```
   npm start
   ```

4. For development with auto-reload:
   ```
   npm run dev
   ```

## Running with Docker

```
docker build -t course-management-backend .
docker run -p 5000:5000 -d course-management-backend
```

## Why Express.js?

Express.js was chosen for the backend because:
1. It's lightweight and flexible
2. Easy to set up and configure
3. Large ecosystem of middleware
4. Well-documented and widely used
5. Perfect for RESTful API development
