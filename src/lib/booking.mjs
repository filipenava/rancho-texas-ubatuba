export const BOOKING_BASE = 'https://book.omnibees.com/hotelresults';
export function localISO(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function addDays(iso, days) {
  const [y, m, d] = iso.split('-').map(Number);
  return localISO(new Date(y, m - 1, d + days, 12));
}
function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  return localISO(new Date(y, m - 1, d, 12)) === value;
}
/** @param {{checkIn: string, checkOut: string, adults?: number, ages?: number[], code?: string}} options */
export function buildBookingURL(
  { checkIn, checkOut, adults = 2, ages = [], code = '' },
  today = localISO(),
) {
  if (!validDate(checkIn) || !validDate(checkOut))
    throw new Error('Escolha as datas de chegada e saída.');
  if (checkIn < today)
    throw new Error('A chegada deve ser hoje ou em uma data futura.');
  if (checkOut <= checkIn)
    throw new Error('A saída precisa ser depois da chegada.');
  if (!Number.isInteger(adults) || adults < 1 || adults > 6)
    throw new Error('Selecione de 1 a 6 adultos.');
  if (
    !Array.isArray(ages) ||
    ages.length > 4 ||
    ages.some((a) => !Number.isInteger(a) || a < 0 || a > 17)
  )
    throw new Error('Informe a idade de cada criança, de 0 a 17 anos.');
  const format = (date) => date.split('-').reverse().join('');
  const params = new URLSearchParams({
    c: '6369',
    q: '10889',
    lang: 'pt-BR',
    currencyId: '16',
    NRooms: '1',
    CheckIn: format(checkIn),
    CheckOut: format(checkOut),
    ad: String(adults),
    ch: String(ages.length),
  });
  // Omnibees uses semicolons between child ages (verified against the live engine).
  if (ages.length) params.set('ag', ages.join(';'));
  if (code.trim()) params.set('Code', code.trim());
  return `${BOOKING_BASE}?${params}`;
}
