import type { Meta, StoryObj } from '@storybook/react';
import { KVList } from './KVList';

const meta = {
  component: KVList,
  tags: ['autodocs'],
} satisfies Meta<typeof KVList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
