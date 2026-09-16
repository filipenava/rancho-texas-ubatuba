import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBookingURL, addDays } from '../src/lib/booking.mjs';
const dates = { checkIn: '2026-12-30', checkOut: '2027-01-03' };
test('sends hotel, dates, occupancy and encoded coupon to Omnibees', () => {
  const url = new URL(
    buildBookingURL(
      { ...dates, adults: 2, ages: [0, 7], code: 'FÉRIAS & FAMÍLIA' },
      '2026-09-16',
    ),
  );
  assert.equal(url.hostname, 'book.omnibees.com');
  assert.equal(url.searchParams.get('q'), '10889');
  assert.equal(url.searchParams.get('c'), '6369');
  assert.equal(url.searchParams.get('CheckIn'), '30122026');
  assert.equal(url.searchParams.get('CheckOut'), '03012027');
  assert.equal(url.searchParams.get('ag'), '0;7');
  assert.equal(url.searchParams.get('ch'), '2');
  assert.equal(url.searchParams.get('ad'), '2');
  assert.equal(url.searchParams.get('Code'), 'FÉRIAS & FAMÍLIA');
  assert.equal(url.searchParams.get('NRooms'), '1');
});
test('rejects past, invalid and reversed dates', () => {
  for (const value of [
    { checkIn: '2026-01-01', checkOut: '2026-01-02' },
    { checkIn: '2026-02-30', checkOut: '2026-03-03' },
    { checkIn: '2026-12-30', checkOut: '2026-12-30' },
    { checkIn: '', checkOut: '2026-12-30' },
  ])
    assert.throws(() => buildBookingURL(value, '2026-09-16'));
});
test('validates adults and all child ages', () => {
  for (const value of [
    { adults: 0 },
    { adults: 1.5 },
    { ages: [NaN] },
    { ages: [18] },
    { ages: [-1] },
    { ages: [1, 2, 3, 4, 5] },
  ])
    assert.throws(() => buildBookingURL({ ...dates, ...value }, '2026-09-16'));
});
test('omits empty coupon and ages when no children travel', () => {
  const url = new URL(buildBookingURL(dates, '2026-09-16'));
  assert.equal(url.searchParams.has('Code'), false);
  assert.equal(url.searchParams.has('ag'), false);
  assert.equal(url.searchParams.get('ch'), '0');
});
test('date arithmetic handles leap day and year boundary', () => {
  assert.equal(addDays('2028-02-28', 1), '2028-02-29');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
});
