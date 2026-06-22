export interface EquitySnapshot {
  date: string;
  equity: number;
  spy_equity?: number;
}

export interface EquityData {
  start_date?: string;
  positions?: string[];
  snapshots: EquitySnapshot[];
}

export interface ChartGeometry {
  linePts: string;
  areaD: string;
  refY: string;
  spyD: string | null;
  yMax: number;
  yMin: number;
  startEq: number;
  nowEq: number;
  xLabels: { i: number; label: string }[];
  refPos: number;
  showRef: boolean;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function fmtDate(iso: string): string {
  const [, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${String(d).padStart(2, '0')}`;
}

export function fmtUSD0(v: number): string {
  return '$' + Math.round(v).toLocaleString();
}

export function fmtUSD2(v: number): string {
  return '$' + v.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Filter snapshots to those whose date falls within `days` calendar days
 * of the most recent snapshot. "7D" means the last day and 6 days before it.
 */
export function sliceByDays(snaps: EquitySnapshot[], days: number): EquitySnapshot[] {
  if (!snaps.length) return snaps;
  const last = snaps[snaps.length - 1].date;
  const [ly, lm, ld] = last.split('-').map(Number);
  const cutoff = new Date(Date.UTC(ly, lm - 1, ld - days));
  return snaps.filter(s => {
    const [y, m, d] = s.date.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d)) >= cutoff;
  });
}

/**
 * Build all chart geometry from a snapshot array.
 * Returns null when fewer than 2 points are provided.
 */
export function buildGeometry(snaps: EquitySnapshot[]): ChartGeometry | null {
  if (snaps.length < 2) return null;

  const W = 320, H = 100, padX = 4, padY = 8;

  const equities = snaps.map(s => s.equity);
  const startEq = equities[0];
  const nowEq = equities[equities.length - 1];

  const spyVals = snaps.map(s => (typeof s.spy_equity === 'number' ? s.spy_equity : null));
  const validSpy = spyVals.filter((v): v is number => v !== null);
  const hasSpy = validSpy.length >= 2;

  const yMin = Math.min(...equities, ...(hasSpy ? validSpy : []));
  const yMax = Math.max(...equities, ...(hasSpy ? validSpy : []));
  const yRange = (yMax - yMin) || 1;
  const yPad = yRange * 0.15;
  const yLo = yMin - yPad;
  const yHi = yMax + yPad;

  const xAt = (i: number) => padX + (i / (snaps.length - 1)) * (W - 2 * padX);
  const yAt = (v: number) => padY + (1 - (v - yLo) / (yHi - yLo)) * (H - 2 * padY);

  const linePts = snaps
    .map((s, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(2)} ${yAt(s.equity).toFixed(2)}`)
    .join(' ');

  const areaD =
    linePts +
    ` L${xAt(snaps.length - 1).toFixed(2)} ${(H - padY).toFixed(2)}` +
    ` L${xAt(0).toFixed(2)} ${(H - padY).toFixed(2)} Z`;

  const refY = yAt(startEq).toFixed(2);

  // SPY path — handles gaps (null values) by using M for non-contiguous segments
  let spyD: string | null = null;
  if (hasSpy) {
    let path = '';
    let prevIdx = -2;
    spyVals.forEach((v, i) => {
      if (v === null) return;
      path += (i === prevIdx + 1 ? 'L' : 'M') + xAt(i).toFixed(2) + ' ' + yAt(v).toFixed(2) + ' ';
      prevIdx = i;
    });
    spyD = path.trim();
  }

  // X-axis: thin to 4 labels when >8 points, else show all
  const n = snaps.length;
  const xIndices =
    n > 8
      ? [0, Math.floor((n - 1) / 3), Math.floor((2 * (n - 1)) / 3), n - 1]
      : snaps.map((_, i) => i);
  const uniqueIndices = [...new Set(xIndices)];
  const xLabels = uniqueIndices.map(i => ({ i, label: fmtDate(snaps[i].date) }));

  // Y-axis ref-line visibility
  const refPos = yAt(startEq);
  const showRef = Math.abs(refPos - padY) >= 10 && Math.abs(refPos - (H - padY)) >= 10;

  return {
    linePts,
    areaD,
    refY,
    spyD,
    yMax,
    yMin,
    startEq,
    nowEq,
    xLabels,
    refPos,
    showRef,
  };
}
