import { useState } from 'react';
import coin from '../assets/coin.svg';
import { hourLabel } from '../hours.js';

const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

export default function VisitForm({ house, today, currentHour, onAdded }) {
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [job, setJob] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  async function addVisit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const response = await fetch(`/api/houses/${house.id}/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visit_date: date, visit_hour: Number(hour), job }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSuccess(`Visit booked for ${hourLabel(data.visit_hour)} on ${data.visit_date}.`);
      setDate('');
      setHour('');
      setJob('');
      onAdded();
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        setError('Could not reach the server. Your visit was not booked. Try again.');
      } else {
        setError(error.message);
      }
    }
    setSaving(false);
  }

  function changeDate(event) {
    setDate(event.target.value);
    setHour('');
  }

  return (
    <section className="booking">
      <h2>Book a visit</h2>
      <form onSubmit={addVisit}>
        {error && <p className="error" role="alert">{error}</p>}
        {success && <p className="success" role="status">{success}</p>}
        <div className="visit-slot">
          <label>
            Date
            <input type="date" min={today} required value={date} onChange={changeDate} />
          </label>
          <label>
            Time <span>(Malaysia)</span>
            <select required value={hour} onChange={(event) => setHour(event.target.value)}>
              <option value="">Choose an hour</option>
              {hours.map((value) => (
                <option key={value} value={value} disabled={date === today && value <= currentHour}>
                  {hourLabel(value)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label htmlFor="visit-job">What needs fixing?</label>
        <textarea
          id="visit-job"
          rows="3"
          required
          maxLength={200}
          placeholder="e.g. The kitchen tap keeps dripping."
          value={job}
          onChange={(event) => setJob(event.target.value)}
        />
        <p className="field-note">{job.length}/200 characters</p>
        <button className="primary" disabled={saving}>
          <img src={coin} alt="" width="15" height="18" />
          {saving ? 'Booking...' : 'Book visit'}
        </button>
      </form>
    </section>
  );
}
