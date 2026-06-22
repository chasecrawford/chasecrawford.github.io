import type { Meta, StoryObj } from '@storybook/react';
import { Output, OutToken } from './Output';

const meta = {
  component: Output,
  tags: ['autodocs'],
} satisfies Meta<typeof Output>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dim: Story = {
  args: {
    dim: true,
    children: 'total 2 · open source',
  },
};

export const WithTokens: Story = {
  args: {
    children: (
      <>
        build <OutToken tone="success">ok</OutToken> - <OutToken tone="info">info</OutToken>:{' '}
        <OutToken tone="warn">warning</OutToken> - <OutToken tone="key">key</OutToken>
      </>
    ),
  },
};
