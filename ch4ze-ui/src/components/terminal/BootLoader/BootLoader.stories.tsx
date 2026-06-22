import type { Meta, StoryObj } from '@storybook/react';
import { BootLoader } from './BootLoader';

const meta = {
  component: BootLoader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof BootLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playing: Story = {
  args: {
    autoStart: true,
    onComplete: () => console.log('boot complete'),
  },
};

export const Static: Story = {
  args: {
    autoStart: false,
    onComplete: () => console.log('boot complete'),
  },
};
