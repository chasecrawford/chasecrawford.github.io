import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { BOT_TRADER, FEEDS_BY_CHASE } from '../../../sample-data/projects';

const meta: Meta<typeof Card> = {
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BotTrader: Story = {
  args: BOT_TRADER,
};

export const FeedsByChase: Story = {
  args: FEEDS_BY_CHASE,
};
