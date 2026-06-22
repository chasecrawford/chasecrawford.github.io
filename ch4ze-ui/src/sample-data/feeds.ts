export interface Feed {
  name: string;
  description: React.ReactNode;
  href: string;
}

export const FEEDS: Feed[] = [
  {
    name: 'Louisville Football',
    description: 'UofL football — players, coaches, opponents, venue.',
    href: 'https://bsky.app/profile/chasecrawford.dev/feed/aaaps4w6ssniy',
  },
  {
    name: 'Louisville Basketball',
    description: "UofL men's & women's basketball — rostered names, coaches, arena.",
    href: 'https://bsky.app/profile/chasecrawford.dev/feed/aaalxyswlqxco',
  },
  {
    name: 'Alien: Earth (spoilers)',
    description: 'FX series chatter, spoilers welcome.',
    href: 'https://bsky.app/profile/chasecrawford.dev/feed/aaaf2gyhpeav6',
  },
];
