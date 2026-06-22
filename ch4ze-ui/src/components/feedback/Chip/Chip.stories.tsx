import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';
import type { Tone } from '../../../types';

const meta = {
  component: Chip,
  tags: ['autodocs'],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'PHP',
  },
};

const tones: Tone[] = ['green', 'cyan', 'yellow', 'magenta', 'red', 'ink', 'dim'];

export const Tones: Story = {
  args: {
    children: 'Tones',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {tones.map((tone) => (
        <Chip key={tone} tone={tone}>
          {tone}
        </Chip>
      ))}
    </div>
  ),
};
