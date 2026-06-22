import type { Meta, StoryObj } from '@storybook/react';
import { DisconnectOverlay } from './DisconnectOverlay';

const meta = {
  component: DisconnectOverlay,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DisconnectOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
    onReconnect: () => {},
  },
};
