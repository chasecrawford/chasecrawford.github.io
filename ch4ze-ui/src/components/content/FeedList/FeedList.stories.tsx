import type { Meta, StoryObj } from '@storybook/react';
import { FeedList } from './FeedList';

const meta = {
  title: 'Content / FeedList',
  component: FeedList,
  tags: ['autodocs'],
} satisfies Meta<typeof FeedList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
