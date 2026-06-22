import type { Meta, StoryObj } from '@storybook/react';
import { EquityChart } from './EquityChart';

const meta = {
  component: EquityChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof EquityChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: bundled 30-day paper-equity data */
export const Default: Story = {
  args: {},
};

/** SevenDay: same bundled data windowed to 7D */
export const SevenDay: Story = {
  name: 'Seven Day (7D)',
  args: {
    defaultDays: 7,
  },
};

/** EmptyOnePoint: only one snapshot — shows the "awaiting" empty state */
export const EmptyOnePoint: Story = {
  name: 'Empty (one point)',
  args: {
    data: {
      start_date: '2026-06-01',
      snapshots: [{ date: '2026-06-01', equity: 5000 }],
    },
  },
};
