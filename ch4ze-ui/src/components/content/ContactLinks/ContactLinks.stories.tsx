import type { StoryObj } from '@storybook/react';
import { ContactLinks } from './ContactLinks';

const meta = {
  title: 'content/ContactLinks',
  component: ContactLinks,
};

export default meta;

export const Default: StoryObj = {
  render: () => <ContactLinks />,
};
