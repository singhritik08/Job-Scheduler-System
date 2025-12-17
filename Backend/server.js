require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /jobs - Create job
app.post('/jobs', async (req, res) => {
  const { taskName, payload, priority } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO jobs (taskName, payload, priority) VALUES ($1, $2, $3) RETURNING id',
      [taskName, payload, priority]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /jobs - List jobs with optional filters
app.get('/jobs', async (req, res) => {
  const { status, priority } = req.query;
  let query = 'SELECT * FROM jobs';
  const values = [];
  let paramCount = 1;

  if (status || priority) {
    query += ' WHERE';
    if (status) {
      query += ` status = $${paramCount}`;
      values.push(status);
      paramCount++;
    }
    if (status && priority) query += ' AND';
    if (priority) {
      query += ` priority = $${paramCount}`;
      values.push(priority);
    }
  }

  query += ' ORDER BY createdAt DESC';

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);  // pg automatically parses JSONB to object
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /jobs/:id - Job detail
app.get('/jobs/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Job not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /run-job/:id - Simulate processing and trigger webhook
app.post('/run-job/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Set to running
    await client.query('UPDATE jobs SET status = $1 WHERE id = $2', ['running', req.params.id]);

    // Simulate 3s processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Set to completed
    const updateResult = await client.query(
      'UPDATE jobs SET status = $1 WHERE id = $2 RETURNING *',
      ['completed', req.params.id]
    );
    const job = updateResult.rows[0];

    await client.query('COMMIT');

    // Prepare webhook payload
    const webhookPayload = {
      jobId: job.id,
      taskName: job.taskname,
      priority: job.priority,
      payload: job.payload,  
      completedAt: job.updatedat,
    };

    // Trigger outbound webhook
    try {
      const response = await axios.post(process.env.WEBHOOK_URL || 'https://webhook.site/your-id', webhookPayload);
      console.log('Webhook sent successfully:', response.status);
    } catch (webhookErr) {
      console.error('Webhook failed:', webhookErr.message);
    }

    res.json({ message: 'Job completed and webhook triggered' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Processing failed' });
  } finally {
    client.release();
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});