const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'openai/gpt-oss-120b';

function buildMessages(facts, job) {
  const system = [
    'You write one short email for a plumbing company, to be sent by staff to the person who booked a visit.',
    'Reply with only a JSON object of the form {"subject": string, "body": string}.',
    'Use only the facts in the user message. Never invent prices, names, addresses, phone numbers or times.',
    'The body must be under 120 words, plain text with no markdown, and ready to send.',
    'If the reminder flag is true the visit is today or tomorrow, so write the email as a friendly reminder.',
    'Otherwise write it as a confirmation of the booking.',
    'Sign the email as Super Sigma Brothers.',
  ].join(' ');
  return [
    { role: 'system', content: system },
    { role: 'user', content: JSON.stringify({ ...facts, job }) },
  ];
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function validateDraft(draft) {
  if (!draft || typeof draft !== 'object') return false;
  if (typeof draft.subject !== 'string' || !draft.subject.trim()) return false;
  if (typeof draft.body !== 'string' || !draft.body.trim()) return false;
  return wordCount(draft.body) < 120;
}

async function askGroq(facts, job) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY is not set.');
  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL,
      messages: buildMessages(facts, job),
      response_format: { type: 'json_object' },
      temperature: 0.4,
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Groq responded with status ${response.status}.`);
  const payload = await response.json();
  const draft = JSON.parse(payload.choices[0].message.content);
  if (!validateDraft(draft)) throw new Error('Groq did not return usable subject and body text.');
  return { subject: draft.subject.trim(), body: draft.body.trim() };
}

function templateDraft(facts, job) {
  const when = facts.daysAway === 0 ? 'today' : facts.daysAway === 1 ? 'tomorrow' : `in ${facts.daysAway} days`;
  const opening = facts.isReminder ? 'This is a reminder about your visit' : 'This confirms your booking for a visit';
  return {
    subject: `${facts.isReminder ? 'Reminder' : 'Visit confirmed'}: ${facts.date} at ${facts.time}`,
    body: [
      'Hello,',
      '',
      `${opening} on ${facts.date} at ${facts.time}, which is ${when}.`,
      `The job noted is: ${job.trim()}`,
      '',
      'If that time no longer suits, reply to this email and let us know.',
      '',
      'Super Sigma Brothers',
    ].join('\n'),
  };
}

module.exports = { askGroq, templateDraft, validateDraft };
