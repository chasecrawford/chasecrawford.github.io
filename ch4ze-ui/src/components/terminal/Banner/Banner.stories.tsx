import type { Meta, StoryObj } from '@storybook/react';
import { Banner } from './Banner';

const meta = {
  component: Banner,
  tags: ['autodocs'],
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    subtitle: 'v3.0',
  },
};

export const CustomText: Story = {
  args: {
    art: ' TEST\n BLOCK',
    artSmall: ' TST',
    subtitle: 'custom test',
  },
};
