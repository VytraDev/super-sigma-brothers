import { useState } from 'react';

export default function VisitDraft({ visit, houseId, ownerEmail, onDraftSaved }) {
  const [subject, setSubject] = useState(visit.draft_subject || '');
  const [body, setBody] = useState(visit.draft_body || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const hasDraft = Boolean(subject || body);
  const aiUnavailable = visit.draft_source === 'template';
  const mailto = `mailto:${ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  async function draftEmail() {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/houses/${houseId}/visits/${visit.id}/draft`, { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSubject(data.draft.draft_subject);
      setBody(data.draft.draft_body);
      onDraftSaved(visit.id, data.draft);
    } catch (caught) {
      if (caught.message === 'Failed to fetch') {
        setError('Could not reach the server. Try again.');
      } else {
        setError(caught.message);
      }
    }
    setBusy(false);
  }

  return (
    <div className="draft">
      <div className="draft-actions">
        <button type="button" onClick={draftEmail} disabled={busy}>
          {busy ? 'Drafting...' : 'Draft email'}
        </button>
        {hasDraft && <a href={mailto}>Open in email app</a>}
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {aiUnavailable && hasDraft && (
        <p className="error" role="status">The AI was unavailable, so this is a plain template draft.</p>
      )}
      {hasDraft && (
        <div className="draft-box">
          <label>
            Subject
            <input value={subject} onChange={(event) => setSubject(event.target.value)} />
          </label>
          <label>
            Body
            <textarea rows="8" value={body} onChange={(event) => setBody(event.target.value)} />
          </label>
        </div>
      )}
    </div>
  );
}
