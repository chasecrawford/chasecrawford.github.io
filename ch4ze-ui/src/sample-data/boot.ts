import type { BootLine } from '../components/terminal/BootLoader';

export const BOOT_LINES: BootLine[] = [
  { t: '[0.000]', cls: 'dim',  txt: 'BIOS init · chasecrawford.dev v3.0.0' },
  { t: '[0.018]', cls: 'ok',   txt: '> DNS resolved · tls 1.3 handshake ok' },
  { t: '[0.071]', cls: 'info', txt: '> fetching manifest … ok' },
  { t: '[0.120]', cls: 'ok',   txt: '> mount /home/chase/projects (2 entries · open source)' },
  { t: '[0.154]', cls: 'ok',   txt: '> mount /home/chase/photos (4 frames)' },
  { t: '[0.201]', cls: 'info', txt: '> hydrate experience.log (6 entries · since 2008)' },
  { t: '[0.248]', cls: 'warn', txt: '> WARN: lilo on the keyboard · purring at 18 hz' },
  { t: '[0.275]', cls: 'info', txt: '> nox.wag() running · tail at 4 hz' },
  { t: '[0.302]', cls: 'dim',  txt: '> load fonts: JetBrainsMono[400,500,700,800]' },
  { t: '[0.361]', cls: 'info', txt: '> init ascii-8-ball · sphere generated · oracle ready' },
  { t: '[0.388]', cls: 'ok',   txt: '> render tree: 458 nodes' },
  { t: '[0.441]', cls: 'info', txt: '> postgres.primary · redis.cache · ok' },
  { t: '[0.512]', cls: 'ok',   txt: '> laravel queue workers: warm' },
  { t: '[0.571]', cls: 'dim',  txt: '> ticker: started' },
  { t: '[0.684]', cls: 'info', txt: '> ready for input' },
  { t: '[0.700]', cls: 'ok',   txt: '> login: guest · welcome in.' },
];
