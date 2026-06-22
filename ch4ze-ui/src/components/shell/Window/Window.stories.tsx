import type { Meta, StoryObj } from '@storybook/react';
import { Window, WindowBody } from './Window';

const meta = {
  component: Window,
  tags: ['autodocs'],
} satisfies Meta<typeof Window>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <WindowBody><div style={{ color: 'var(--green)' }}>Window content</div></WindowBody>,
  },
};

export const Minimized: Story = {
  args: {
    minimized: true,
    children: <WindowBody><div style={{ color: 'var(--green)' }}>Window content (hidden when minimized)</div></WindowBody>,
  },
};
