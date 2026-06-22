import type { Meta, StoryObj } from '@storybook/react';
import { Caret } from './Caret';

const meta = {
  component: Caret,
  tags: ['autodocs'],
} satisfies Meta<typeof Caret>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
