import type { Meta, StoryObj } from '@storybook/react';
import { Gallery } from './Gallery';

const meta: Meta<typeof Gallery> = {
  component: Gallery,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
