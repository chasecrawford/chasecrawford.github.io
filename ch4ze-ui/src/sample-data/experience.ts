export interface ExperienceRow {
  dates: string;
  role: string;
  company: string;
  companyHref?: string;
  notes: React.ReactNode;
  status: 'current' | 'closed';
}

export const EXPERIENCE_ROWS: ExperienceRow[] = [
  {
    dates: '2022 — now',
    role: 'Lead Backend Developer',
    company: 'Hatfield Media',
    companyHref: 'https://hatfieldmedia.com',
    notes: 'Same responsibilities as before with the addition of eCommerce, dev ops, and infrastructure management.',
    status: 'current',
  },
  {
    dates: '2019 — 2022',
    role: 'Backend Developer',
    company: 'Hatfield Media',
    companyHref: 'https://hatfieldmedia.com',
    notes: 'Backend development for client deliverables — Laravel, custom PHP, database work, third-party integrations.',
    status: 'closed',
  },
  {
    dates: '2015 — 2019',
    role: 'Digital Application Developer',
    company: 'PriceWeber Advertising',
    companyHref: 'https://priceweber.com',
    notes: 'Full-stack agency work. Responsive WordPress themes from Photoshop/XD. Laravel & custom PHP/MySQL apps. Third-party API integrations (XML/JSON). LAMP server management. HTML emails compliant across mail clients.',
    status: 'closed',
  },
  {
    dates: '2013 — 2015',
    role: 'Web Developer',
    company: 'CustomWeb',
    companyHref: 'https://customweb.com',
    notes: 'Fast-paced full-stack on responsive WordPress & eCommerce builds (WooCommerce, OpenCart) from Photoshop comps. cPanel reseller admin. Maintained hundreds of client sites.',
    status: 'closed',
  },
  {
    dates: '2011 — 2013',
    role: 'Web Developer',
    company: 'DBS>Interactive',
    companyHref: 'https://dbswebsite.com',
    notes: 'Custom, responsive WordPress and Drupal themes. Heavy PHP and JavaScript work. LAMP hosting server management.',
    status: 'closed',
  },
  {
    dates: '2008 — 2009',
    role: 'Frontend Web Developer',
    company: 'DBS>Interactive',
    companyHref: 'https://dbswebsite.com',
    notes: 'First dev role out of high school. Frontend work at a digital agency working with WordPress & Drupal.',
    status: 'closed',
  },
];
