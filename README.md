# Job-Scheduler-System
Job Management System
A full-stack application for creating, tracking, and processing background jobs with simulated execution and outbound webhook notifications upon completion.

Tech Stack

Frontend: React (Create React App), React Router, Axios, Tailwind CSS, @tanstack/react-table

Backend: Node.js, Express.js

Database: PostgreSQL (with JSONB for flexible payloads)

Other: Axios (for webhook calls), CORS, dotenv for environment variables



Frontend (React): Single-page application with routes for creating jobs, dashboard listing, and job details. Uses Axios to communicate with the backend API.

Backend (Node.js/Express): RESTful API handling job CRUD operations and job execution simulation. Connects to PostgreSQL via pg library.

Database (PostgreSQL): Stores jobs in a single jobs table. Uses ENUM types for priority and status, JSONB for flexible payload storage.

Webhook: On job completion, the backend sends an outbound POST request to a configurable URL (e.g., from webhook.site).

The system simulates background processing synchronously for simplicity (3-second delay). In production, this could be replaced with a real queue system (e.g., BullMQ or pg-boss).


Database Schema
SQLCREATE TYPE priority_type AS ENUM ('Low', 'Medium', 'High');
CREATE TYPE status_type AS ENUM ('pending', 'running', 'completed');

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  taskName VARCHAR(255) NOT NULL,
  payload JSONB NOT NULL,
  priority priority_type NOT NULL,
  status status_type DEFAULT 'pending',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

API Documentation

All endpoints are prefixed with / (running on http://localhost:5000).



/jobs --> Create a new job --> { taskName, payload (object), priority }  (POST)

/jobsList all jobs (with optional filters)Query: ?status=pending&priority=High (GET)

/jobs/{id} --> idGet job details by ID (GET)

Notes:

Payload is stored and returned as a JSON object (PostgreSQL JSONB handles parsing automatically).
Job running is synchronous with a 3-second delay to simulate work.
Errors return appropriate status codes (e.g., 500 for server errors).

How the Webhook Works

1. Visit https://webhook.site to get a unique testing URL.
2. Set WEBHOOK_URL in backend .env to your unique URL.
3. When /run-job/:id is called and the job reaches "completed" status:
  The backend fetches the updated job details.
            Constructs payload:
               JSON{
              "jobId": <id>,
              "taskName": "<taskName>",
              "priority": "<priority>",
              "payload": { ... },
              "completedAt": "<timestamp>"
            }
    Sends a POST request via Axios to the configured WEBHOOK_URL.
    Logs success/failure to console (can be extended to store in DB).

4. View received payloads and headers on webhook.site dashboard.

Setup Instructions

Prerequisites
 1.Node.js (v18+)
 2.PostgreSQL (local installation or Docker)
 3.Git (optional)

1. Clone and Structure
textgit clone <repo-url> job-system
cd job-system
mkdir backend frontend
2. Database Setup

Start PostgreSQL.
Create database: createdb job_system (or via psql).
Run the schema SQL above.

3. Backend Setup
textcd backend
npm init -y
npm install express pg axios cors dotenv
npm install -D nodemon

Create .env:
DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/job_system
PORT=5000
WEBHOOK_URL=https://webhook.site/your-unique-uuid
  Add server.js (code from previous implementation).
  Run: nodemon server.js

4. Frontend Setup
Step 1: Navigate to Frontend Folder --> cd frontend
Step 2: Install Dependencies --> npm install
Step 3: Start Development Server  --> npm run dev


5. Usage
Open http://localhost:5000
Create jobs → View dashboard → Run jobs → Check webhook.site for deliveries.

6.AI Usage Log (Disclosure)

AI tools were used sparingly and responsibly during this project.
The core architecture, logic, data flow, and feature decisions were designed and implemented by me.

AI was used only as a support tool for:

Writing documentation

Verifying Node.js / Express syntax

Improving code readability

🔧 AI Tools Used

ChatGPT

🧠 Model

GPT-4 / GPT-5.x (OpenAI)

📌 Areas Where AI Was Used
Area	Usage
README Documentation	Structuring and formatting the README file
Node.js Syntax Help	Verifying Express route syntax and async handling
Error Handling	Minor suggestions for cleaner error responses
❌ Areas NOT Assisted by AI

System architecture design

Database schema design

API flow & status transitions

Job execution logic

Webhook flow design

UI logic & filtering behavior

All core logic was written and understood by me.

🧪 Example Prompts Used

These are exact prompts (simple & realistic):

"Help me structure a professional README.md for a full stack project"

"Check if this Express.js POST API syntax is correct"

"Give a clean way to handle async job execution in Node.js"

"Improve wording of README without changing technical meaning"

🧩 How AI Helped

Reduced documentation writing time

Helped validate syntax correctness

Improved clarity of explanations
