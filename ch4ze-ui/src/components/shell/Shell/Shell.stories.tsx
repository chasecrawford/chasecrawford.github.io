import type { Meta, StoryObj } from '@storybook/react';
import { Shell } from './Shell';

const meta = {
  component: Shell,
  tags: ['autodocs'],
} satisfies Meta<typeof Shell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div style={{ padding: '16px', color: 'var(--green)' }}>Shell wrapper placeholder</div>,
  },
};
