import type { Meta, StoryObj } from '@storybook/react';
import { ExperienceTable } from './ExperienceTable';

const meta: Meta<typeof ExperienceTable> = {
  component: ExperienceTable,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ExperienceTable />,
};
