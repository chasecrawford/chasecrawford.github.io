export interface ContactLink {
  key: string;
  value: string;
  href?: string;
  copy?: string;
  target?: string;
}

export const CONTACT_LINKS: ContactLink[] = [
  {
    key: 'EMAIL',
    value: 'chase@ch4ze.com',
    href: 'mailto:chase@ch4ze.com',
  },
  {
    key: 'PHONE',
    value: '502-438-8129',
    href: 'tel:+15024388129',
  },
  {
    key: 'LINKEDIN',
    value: '/in/chasecrawford',
    href: 'https://www.linkedin.com/in/chasecrawford',
    target: '_blank',
  },
  {
    key: 'RESUME',
    value: 'resume.pdf',
    href: 'pdf/resume.pdf',
    target: '_blank',
  },
  {
    key: 'BLUESKY',
    value: '@chasecrawford.dev',
    href: 'https://bsky.app/profile/chasecrawford.dev',
    target: '_blank',
  },
  {
    key: 'STEAM',
    value: '/id/ch4ze',
    href: 'https://steamcommunity.com/id/ch4ze/',
    target: '_blank',
  },
  {
    key: 'XBOX',
    value: 'Adalius',
    href: 'https://www.xbox.com/en-US/play/user/Adalius',
    target: '_blank',
  },
  {
    key: 'DISCORD',
    value: 'chase_22',
    copy: 'chase_22',
  },
];
