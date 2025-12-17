import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateJob from "./pages/CreateJob";
import Dashboard from "./pages/Dashboard";
import JobDetail from "./pages/JobDetail";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white">
          <ul className="flex space-x-6 max-w-4xl mx-auto">
            <li><Link to="/create-job">Create Job</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
