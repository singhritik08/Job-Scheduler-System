import React from "react";
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateJob() {
  const [taskName, setTaskName] = useState('');
  const [payload, setPayload] = useState('{}');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      JSON.parse(payload); // Validate
      await axios.post('http://localhost:5000/jobs', {
        taskName,
        payload: JSON.parse(payload),
        priority,
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid JSON or server error');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Create New Job</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="w-full p-3 border rounded mb-4"
          required
        />
        <textarea
          placeholder="Payload (JSON)"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          className="w-full p-3 border rounded mb-4 h-40 font-mono text-sm"
          required
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
          Create Job
        </button>
      </form>
    </div>
  );
}