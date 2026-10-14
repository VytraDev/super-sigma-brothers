import wrench from '../assets/wrench.svg';
import { hourLabel } from '../hours.js';

export default function VisitList({ visits, today }) {
  if (visits.length === 0) {
    return (
      <div className="empty-visits">
        <img src={wrench} alt="" width="36" height="36" />
        <h3>A clear schedule.</h3>
        <p>No visits booked for this house yet. Add the first one with the booking form.</p>
      </div>
    );
  }

  return (
    <ol className="visits">
      {visits.map((visit) => {
        const past = visit.visit_date < today;
        // The date is midnight UTC, so format it in UTC to keep the same day.
        const date = new Date(`${visit.visit_date}T00:00:00Z`);
        const dateText = date.toLocaleDateString('en-GB', {
          weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
        });
        let status = 'Upcoming';
        if (past) status = 'Past';
        if (visit.visit_date === today) status = 'Today';

        return (
          <li key={visit.id} className={past ? 'past-visit' : ''}>
            <div className="visit-line">
              <h3>{dateText}</h3>
              <span className={past ? 'past-label' : 'upcoming-label'}>{status}</span>
            </div>
            <p className="visit-hour">{hourLabel(visit.visit_hour)}</p>
            <p className="job">{visit.job}</p>
          </li>
        );
      })}
    </ol>
  );
}
