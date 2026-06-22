import type { Meta, StoryObj } from '@storybook/react';
import { TitleBar } from './TitleBar';

const meta = {
  component: TitleBar,
  tags: ['autodocs'],
} satisfies Meta<typeof TitleBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'chase@louisville · Windows PowerShell',
    status: <span style={{ color: 'var(--green)' }}>● LIVE</span>,
  },
};

export const NoControls: Story = {
  args: {
    title: 'chase@louisville · Windows PowerShell',
    status: <span style={{ color: 'var(--green)' }}>● LIVE</span>,
    showControls: false,
  },
};
