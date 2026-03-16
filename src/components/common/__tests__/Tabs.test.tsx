import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from '../Tabs';

const sampleTabs = [
  { label: 'Theory', content: <p>Theory content here</p> },
  { label: 'Simulation', content: <p>Simulation content here</p> },
  { label: 'Practice', content: <p>Practice content here</p> },
];

describe('Tabs', () => {
  it('renders all tab labels', () => {
    render(<Tabs tabs={sampleTabs} />);
    expect(screen.getByRole('tab', { name: 'Theory' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Simulation' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Practice' })).toBeInTheDocument();
  });

  it('shows first tab content by default', () => {
    render(<Tabs tabs={sampleTabs} />);
    expect(screen.getByText('Theory content here')).toBeInTheDocument();
    expect(screen.queryByText('Simulation content here')).not.toBeInTheDocument();
  });

  it('switches content on tab click', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={sampleTabs} />);

    await user.click(screen.getByRole('tab', { name: 'Simulation' }));
    expect(screen.getByText('Simulation content here')).toBeInTheDocument();
    expect(screen.queryByText('Theory content here')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation with ArrowRight and ArrowLeft', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={sampleTabs} />);

    // Focus on the first tab
    const firstTab = screen.getByRole('tab', { name: 'Theory' });
    firstTab.focus();

    // ArrowRight moves to the next tab
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Simulation' })).toHaveFocus();
    expect(screen.getByText('Simulation content here')).toBeInTheDocument();

    // ArrowRight again moves to the third tab
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Practice' })).toHaveFocus();
    expect(screen.getByText('Practice content here')).toBeInTheDocument();

    // ArrowRight wraps around to the first tab
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Theory' })).toHaveFocus();

    // ArrowLeft wraps around to the last tab
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Practice' })).toHaveFocus();
  });

  it('respects defaultIndex prop', () => {
    render(<Tabs tabs={sampleTabs} defaultIndex={2} />);
    expect(screen.getByText('Practice content here')).toBeInTheDocument();
    expect(screen.queryByText('Theory content here')).not.toBeInTheDocument();

    const practiceTab = screen.getByRole('tab', { name: 'Practice' });
    expect(practiceTab).toHaveAttribute('aria-selected', 'true');
  });
});
