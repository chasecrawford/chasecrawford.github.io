import { Chip } from '../components/feedback/Chip';
import type { KVRow } from '../types';

export const WHOAMI_ROWS: KVRow[] = [
  { k: 'name', v: 'Chase Crawford' },
  { k: 'role', v: 'Lead Backend Developer' },
  { k: 'employer', v: <a href="https://hatfieldmedia.com" target="_blank" rel="noopener">Hatfield Media</a> },
  { k: 'location', v: 'Louisville, Kentucky' },
  {
    k: 'skills',
    v: (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        <Chip>PHP</Chip>
        <Chip>LARAVEL</Chip>
        <Chip>VUE</Chip>
        <Chip>MYSQL</Chip>
        <Chip>POSTGRES</Chip>
        <Chip>AWS</Chip>
        <Chip>NGINX</Chip>
        <Chip>APACHE</Chip>
      </div>
    ),
  },
  { k: 'status', v: <span style={{ color: 'var(--green)' }}>● employed full-time</span> },
  { k: 'pronouns', v: 'he/him' },
];
