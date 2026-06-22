import type { Meta, StoryObj } from '@storybook/react';
import { Ticker } from './Ticker';

const meta = {
  component: Ticker,
  tags: ['autodocs'],
} satisfies Meta<typeof Ticker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      'LEAD BACKEND DEVELOPER • HATFIELD MEDIA • LOUISVILLE KY',
      'CUSTOM SOLUTIONS IN PHP SINCE 2008',
      'WANNABE INDIE GAME DEV',
      'REAL HUMAN',
    ],
  },
};
