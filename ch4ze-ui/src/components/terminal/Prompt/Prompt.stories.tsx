import type { Meta, StoryObj } from '@storybook/react';
import { Prompt } from './Prompt';

const meta = {
  component: Prompt,
  tags: ['autodocs'],
} satisfies Meta<typeof Prompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Whoami: Story = {
  args: {
    command: 'whoami',
    flags: '--verbose',
  },
};

export const ListProjects: Story = {
  args: {
    path: '~/projects',
    command: 'ls',
    flags: '--long --featured',
  },
};
