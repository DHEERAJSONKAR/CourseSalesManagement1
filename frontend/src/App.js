import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import NavBar from './components/NavBar';
import CourseList from './components/CourseList';
import CourseForm from './components/CourseForm';
import CourseInstanceList from './components/CourseInstanceList';
import CourseInstanceForm from './components/CourseInstanceForm';
import CourseInstanceDetails from './components/CourseInstanceDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<CourseList />} />
            <Route path="/courses/new" element={<CourseForm />} />
            <Route path="/instances" element={<CourseInstanceList />} />
            <Route path="/instances/new" element={<CourseInstanceForm />} />
            <Route path="/instances/:year/:semester/:courseId" element={<CourseInstanceDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
