# Course Management System - Frontend

This is the frontend application for the Course Management System, built with React.

## Technologies Used

- **React**: JavaScript library for building user interfaces
- **React Router**: For navigation between pages
- **React Bootstrap**: UI component library
- **Axios**: For HTTP requests
- **React Select**: For enhanced select inputs
- **Docker**: For containerization

## Architecture

The frontend follows a component-based architecture:
- **Components**: Reusable UI elements
- **Routes**: Page-level components
- **Services**: API communication layer
- **Config**: Environment-specific configuration

## Features

- Create and list courses
- Select prerequisites for courses
- Create and list course instances
- View course instance details
- Delete courses and instances with validation

## Prerequisites

- Node.js 14.x or higher
- npm or yarn package manager

## Running Locally

1. Install dependencies:
   ```
   npm install
   ```

2. Configure the backend API URL:
   - Create a `.env` file with:
     ```
     REACT_APP_API_URL=http://localhost:5000/api
     ```

3. Start the development server:
   ```
   npm start
   ```

4. Build for production:
   ```
   npm run build
   ```

## Running with Docker

```
docker build -t course-management-frontend .
docker run -p 80:80 -d course-management-frontend
```

## Why React?

React was chosen for the frontend because:
1. Component-based architecture promotes reusability
2. Virtual DOM provides excellent performance
3. Large ecosystem and community support
4. Easy to integrate with other libraries
5. Strong developer tools and debugging capabilities
