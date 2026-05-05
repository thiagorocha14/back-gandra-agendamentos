import { Court } from '../../../../courts/entity/court.entity';

const DAY_START_HOUR = 6;
const DAY_END_HOUR = 14;

function normalizeTime(value: string): string {
  return value.length === 5 ? `${value}:00` : value;
}

function timeToMinutes(time: string): number {
  const t = normalizeTime(time);
  const [h, m, s] = t.split(':').map(Number);
  return h * 60 + m + (s || 0) / 60;
}

/**
 * Preço proporcional ao tempo em faixa diurna (day_price) vs noturna (night_price).
 * Diurno: [06:00, 18:00) em cada dia; o restante usa night_price.
 */
export function computeBookingPriceBrl(params: {
  court: Court;
  startTime: string;
  endTime: string;
}): string {
  const startM = timeToMinutes(params.startTime);
  let endM = timeToMinutes(params.endTime);
  if (endM <= startM) {
    endM += 24 * 60;
  }

  const dayStartM = DAY_START_HOUR * 60;
  const dayEndM = DAY_END_HOUR * 60;

  let total = 0;
  const step = 15;
  for (let m = startM; m < endM; m += step) {
    const minutesInSlot = Math.min(step, endM - m);
    const hourFraction = minutesInSlot / 60;
    const minuteOfDay = m % (24 * 60);
    const isDay =
      minuteOfDay >= dayStartM && minuteOfDay < dayEndM;
    const rate = isDay ? params.court.day_price : params.court.night_price;
    total += hourFraction * rate;
  }

  return total.toFixed(2);
}
