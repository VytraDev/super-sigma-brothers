import { describe, expect, test } from 'vitest';
import dates from './dates.js';
const { hourLabel, visitDateFacts } = dates;

describe('visit date facts', () => {
  test('builds the full date, weekday, time and days away', () => {
    expect(visitDateFacts('2026-10-20', 9, '2026-10-14')).toEqual({
      weekday: 'Tuesday',
      date: 'Tuesday, 20 October 2026',
      time: '9am',
      daysAway: 6,
      isReminder: false,
    });
  });
  test('today and tomorrow read as reminders', () => {
    expect(visitDateFacts('2026-10-14', 15, '2026-10-14')).toEqual({
      weekday: 'Wednesday',
      date: 'Wednesday, 14 October 2026',
      time: '3pm',
      daysAway: 0,
      isReminder: true,
    });
    expect(visitDateFacts('2026-10-15', 9, '2026-10-14')).toMatchObject({
      weekday: 'Thursday',
      daysAway: 1,
      isReminder: true,
    });
  });
  test('counts days across month and year boundaries', () => {
    expect(visitDateFacts('2026-11-01', 9, '2026-10-31').daysAway).toBe(1);
    expect(visitDateFacts('2027-01-01', 9, '2026-12-31').daysAway).toBe(1);
    expect(visitDateFacts('2027-03-01', 9, '2027-02-01').daysAway).toBe(28);
  });
  test.each([
    [7, '7am'],
    [9, '9am'],
    [12, '12pm'],
    [14, '2pm'],
    [21, '9pm'],
  ])('labels hour %i as %s', (hour, label) => {
    expect(hourLabel(hour)).toBe(label);
    expect(visitDateFacts('2026-10-20', hour, '2026-10-14').time).toBe(label);
  });
});
