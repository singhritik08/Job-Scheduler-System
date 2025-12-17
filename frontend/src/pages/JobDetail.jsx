import React from "react";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/jobs/${id}`).then(res => setJob(res.data));
  }, [id]);

  if (!job) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Job Details</h1>
      <p><strong>ID:</strong> {job.id}</p>
      <p><strong>Task Name:</strong> {job.taskname}</p>
      <p><strong>Priority:</strong> {job.priority}</p>
      <p><strong>Status:</strong> <span className={`font-bold ${job.status === 'completed' ? 'text-green-600' : job.status === 'running' ? 'text-yellow-600' : 'text-gray-600'}`}>{job.status}</span></p>
      <p><strong>Created At:</strong> {new Date(job.createdat).toLocaleString()}</p>
      <p><strong>Updated At:</strong> {new Date(job.updatedat).toLocaleString()}</p>
      <div className="mt-4">
        <strong>Payload:</strong>
        <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
          {JSON.stringify(job.payload, null, 2)}
        </pre>
      </div>
    </div>
  );
}