import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const fetchJobs = async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.append("status", statusFilter);
    if (priorityFilter) params.append("priority", priorityFilter);

    const res = await axios.get(`http://localhost:5000/jobs?${params}`);
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter, priorityFilter]);

  const handleRun = async (id) => {
    await axios.post(`http://localhost:5000/run-job/${id}`);
    fetchJobs();
  };

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "taskname",
      header: "Task Name",
    },
    {
      accessorKey: "priority",
      header: "Priority",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="space-x-2">
          <button
            onClick={() => handleRun(row.original.id)}
            disabled={row.original.status !== "pending"}
            className="bg-green-600 text-white px-3 py-1 rounded disabled:bg-gray-400"
          >
            Run
          </button>
          <Link
            to={`/job/${row.original.id}`}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            View
          </Link>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Job Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Monitor, run and manage scheduled jobs
            </p>
          </div>
        </div>
  
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6 flex flex-wrap gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
          </select>
  
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
  
        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left font-semibold text-gray-600"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
  
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {cell.column.id === "status" ? (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${
                              cell.getValue() === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : cell.getValue() === "running"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                        >
                          {cell.getValue()}
                        </span>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
  
          {jobs.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No jobs found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}  