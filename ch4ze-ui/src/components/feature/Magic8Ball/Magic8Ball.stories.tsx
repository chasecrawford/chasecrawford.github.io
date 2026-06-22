import type { Meta, StoryObj } from '@storybook/react';
import { Magic8Ball } from './Magic8Ball';
import { EIGHT_BALL_ANSWERS } from '../../../sample-data/answers';

const meta = {
  component: Magic8Ball,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Magic8Ball>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: {},
};

/** Pre-answered state: rng always returns 0.5 → index 10 → 'Reply hazy, try again' */
export const Answered: Story = {
  args: {
    rng: () => 0.5,
  },
};

/**
 * ReducedMotion: When `prefers-reduced-motion: reduce` is active,
 * clicking Shake skips the 900ms RAF animation and shows the answer immediately.
 * Enable the 'Reduced Motion' toolbar addon in Storybook to test this path.
 */
export const ReducedMotionNote: Story = {
  name: 'Reduced Motion (note)',
  args: {
    rng: () => 0,
    answers: EIGHT_BALL_ANSWERS,
  },
  parameters: {
    docs: {
      description: {
        story:
          'With `prefers-reduced-motion: reduce`, Shake skips the RAF loop and shows the answer instantly. Enable the "Reduced Motion" addon in Storybook to verify this path.',
      },
    },
  },
};
