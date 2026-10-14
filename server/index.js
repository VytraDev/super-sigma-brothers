require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { todayInMalaysia, currentHourInMalaysia } = require('./dates');
const { validateVisit } = require('./rules');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

function validId(value) {
  return /^\d+$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) > 0;
}

app.get('/api/houses', async (req, res) => {
  const result = await pool.query('SELECT id, owner_name, address, email FROM houses ORDER BY id');
  const now = new Date();
  res.json({ houses: result.rows, today: todayInMalaysia(now), currentHour: currentHourInMalaysia(now) });
});

app.get('/api/houses/:id/visits', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'Choose a valid house.' });
  const house = await pool.query('SELECT id FROM houses WHERE id = $1', [req.params.id]);
  if (!house.rows.length) return res.status(404).json({ error: 'House not found.' });
  const result = await pool.query(
    'SELECT * FROM visits WHERE house_id = $1 ORDER BY visit_date, visit_hour',
    [req.params.id],
  );
  const now = new Date();
  res.json({ visits: result.rows, today: todayInMalaysia(now), currentHour: currentHourInMalaysia(now) });
});

app.post('/api/houses/:id/visits', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'Choose a valid house.' });
  const now = new Date();
  const error = validateVisit(req.body, todayInMalaysia(now), currentHourInMalaysia(now));
  if (error) return res.status(400).json({ error });
  const house = await pool.query('SELECT id FROM houses WHERE id = $1', [req.params.id]);
  if (!house.rows.length) return res.status(404).json({ error: 'House not found.' });
  try {
    const result = await pool.query(
      'INSERT INTO visits (house_id, visit_date, visit_hour, job) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.params.id, req.body.visit_date, req.body.visit_hour, req.body.job.trim()],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'That slot is already booked.' });
    throw error;
  }
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.type === 'entity.parse.failed') return res.status(400).json({ error: 'Send a valid JSON request.' });
  console.error('Request failed:', error.code || error.name);
  res.status(500).json({ error: 'The server could not complete that request. Please try again.' });
});

app.listen(3000, () => console.log('Super Sigma Brothers server: http://localhost:3000'));
