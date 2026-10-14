import { describe, expect, test } from 'vitest';
import rules from './rules.js';
const { validateVisit } = rules;
const today = '2026-10-14';
const visit = { visit_date: '2026-10-15', visit_hour: 9, job: 'Leaking tap' };

describe('booking rules', () => {
  test('accepts tomorrow and the first and last bookable hours', () => {
    expect(validateVisit(visit, today, 15)).toBeNull();
    expect(validateVisit({ ...visit, visit_hour: 7 }, today, 15)).toBeNull();
    expect(validateVisit({ ...visit, visit_hour: 21 }, today, 15)).toBeNull();
  });
  test.each(['', '14/10/2026', '2026-02-30', '2026-13-01', '0000-00-00'])('refuses invalid date %s', (visit_date) => {
    expect(validateVisit({ ...visit, visit_date }, today, 15)).toBe('Choose a valid date.');
  });
  test('refuses yesterday', () => {
    expect(validateVisit({ ...visit, visit_date: '2026-10-13' }, today, 15)).toBe('Choose today or a future date.');
  });
  test.each([6, 22, 9.5, '9', null])('refuses invalid hour %s', (visit_hour) => {
    expect(validateVisit({ ...visit, visit_hour }, today, 15)).toBe('Choose a whole hour from 7am to 9pm.');
  });
  test('today must be later than the current Malaysian hour', () => {
    expect(validateVisit({ ...visit, visit_date: today, visit_hour: 15 }, today, 15)).not.toBeNull();
    expect(validateVisit({ ...visit, visit_date: today, visit_hour: 16 }, today, 15)).toBeNull();
    expect(validateVisit({ ...visit, visit_date: today, visit_hour: 21 }, today, 21)).not.toBeNull();
  });
  test('requires a note and caps it at 200 characters', () => {
    expect(validateVisit({ ...visit, job: '   ' }, today, 15)).not.toBeNull();
    expect(validateVisit({ ...visit, job: null }, today, 15)).not.toBeNull();
    expect(validateVisit({ ...visit, job: 'a'.repeat(200) }, today, 15)).toBeNull();
    expect(validateVisit({ ...visit, job: 'a'.repeat(201) }, today, 15)).not.toBeNull();
  });
  test('missing request body returns a helpful error', () => {
    expect(validateVisit(undefined, today, 15)).toBe('Choose a valid date.');
  });
});
