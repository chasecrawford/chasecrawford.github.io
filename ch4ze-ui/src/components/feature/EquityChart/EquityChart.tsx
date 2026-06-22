import { useMemo, useState } from 'react';
import { PAPER_EQUITY } from '../../../sample-data/equity';
import {
  buildGeometry,
  fmtDate,
  fmtUSD0,
  fmtUSD2,
  sliceByDays,
} from './equityModel';
import type { EquityData } from './equityModel';
import styles from './EquityChart.module.css';

export interface EquityChartProps {
  data?: EquityData;
  defaultDays?: 7 | 30;
  title?: string;
  className?: string;
}

export function EquityChart({
  data = PAPER_EQUITY as EquityData,
  defaultDays = 30,
  title = 'EMA trend-state strategy',
  className,
}: EquityChartProps): JSX.Element {
  const [days, setDays] = useState<7 | 30>(defaultDays);

  const allSnaps = useMemo(
    () => (data.snapshots ?? []).filter(s => typeof s.equity === 'number'),
    [data],
  );

  const snaps = useMemo(() => sliceByDays(allSnaps, days), [allSnaps, days]);

  const geo = useMemo(() => buildGeometry(snaps), [snaps]);

  const positions = Array.isArray(data.positions) ? data.positions : [];

  const sinceText = data.start_date
    ? `$5,000 paper account · opened ${fmtDate(data.start_date.replace(/-/g, '-'))}`
    : '';

  const wrapClass = [styles['proj-chart'], className].filter(Boolean).join(' ');

  return (
    <div className={wrapClass} aria-label="Paper-trading equity chart">
      {/* Card header */}
      <div className={styles['proj-head']}>
        <span className={styles['id']}>Paper Trading Trial No. 2</span>
        <div
          className={styles['equity-toggle']}
          role="group"
          aria-label="Chart window"
        >
          <button
            type="button"
            className={days === 7 ? styles['active'] : undefined}
            onClick={() => setDays(7)}
          >
            7D
          </button>
          <button
            type="button"
            className={days === 30 ? styles['active'] : undefined}
            onClick={() => setDays(30)}
          >
            30D
          </button>
        </div>
      </div>

      {/* Strategy name */}
      <div className={styles['proj-name']}>
        <span className={styles['nm']}>{title}</span>
      </div>

      {/* Legend — only when SPY present */}
      {geo?.spyD ? (
        <div className={styles['equity-legend']} aria-hidden="false">
          <span className={`${styles['item']} ${styles['strategy']}`}>
            <span className={styles['swatch']}></span>Strategy
          </span>
          <span className={`${styles['item']} ${styles['spy']}`}>
            <span className={styles['swatch']}></span>SPY benchmark
          </span>
        </div>
      ) : null}

      {/* Chart area or empty state */}
      {geo ? (
        <>
          <div className={styles['equity-frame']}>
            {/* Y axis */}
            <div className={styles['equity-yaxis']}>
              <span className={styles['ymax']}>{fmtUSD0(geo.yMax)}</span>
              {geo.showRef && (
                <span
                  className={styles['ystart']}
                  style={{ top: `${geo.refPos}%` }}
                >
                  {fmtUSD0(geo.startEq)}
                </span>
              )}
              <span className={styles['ymin']}>{fmtUSD0(geo.yMin)}</span>
            </div>

            {/* SVG chart */}
            <svg
              className={styles['equity-spark']}
              viewBox="0 0 320 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="equityGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#00ff88" stopOpacity=".25" />
                  <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line
                className={styles['ref']}
                x1={4}
                y1={geo.refY}
                x2={316}
                y2={geo.refY}
              />
              <path className={styles['area']} d={geo.areaD} />
              {geo.spyD && (
                <path className={styles['spy-line']} d={geo.spyD} />
              )}
              <path className={styles['line']} d={geo.linePts} />
            </svg>
          </div>

          {/* X axis */}
          <div className={styles['equity-xaxis']}>
            {geo.xLabels.map(({ i, label }) => (
              <span key={i}>{label}</span>
            ))}
          </div>
        </>
      ) : (
        <div className={styles['equity-empty']}>
          {snaps.length === 0
            ? 'awaiting first snapshot'
            : 'awaiting second snapshot · curve renders at 2 points'}
        </div>
      )}

      {/* Footer */}
      <div className={styles['equity-footer']}>
        <div className={styles['proj-stats']}>
          <div>
            open:{' '}
            <b>
              {geo
                ? fmtUSD2(geo.startEq)
                : snaps.length === 1
                  ? fmtUSD2(snaps[0].equity)
                  : '—'}
            </b>
          </div>
          <div>
            close:{' '}
            <b>
              {geo
                ? fmtUSD2(geo.nowEq)
                : snaps.length === 1
                  ? fmtUSD2(snaps[0].equity)
                  : '—'}
            </b>
          </div>
        </div>
        {sinceText && (
          <div className={styles['equity-caption']}>{sinceText}</div>
        )}
      </div>

      {/* Positions */}
      {positions.length > 0 && (
        <div className={styles['equity-positions']}>
          <span className={styles['label']}>Holding</span>
          <span className={styles['equity-positions-list']}>
            {positions.map((sym, i) => (
              <span key={sym}>
                {i > 0 && (
                  <span className={styles['sep']}> · </span>
                )}
                <a
                  className={styles['symbol']}
                  href={`https://finance.yahoo.com/quote/${encodeURIComponent(sym)}`}
                  target="_blank"
                  rel="noopener"
                  title={`View ${sym} on Yahoo Finance`}
                >
                  {sym}
                </a>
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  );
}
