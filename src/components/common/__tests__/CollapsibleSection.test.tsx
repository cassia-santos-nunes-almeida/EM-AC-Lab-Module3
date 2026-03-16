import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CollapsibleSection } from '../CollapsibleSection';

describe('CollapsibleSection', () => {
  it('renders the title', () => {
    render(
      <CollapsibleSection title="Test Section">
        <p>Hidden content</p>
      </CollapsibleSection>,
    );
    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('is collapsed by default (aria-expanded="false")', () => {
    render(
      <CollapsibleSection title="Collapsed">
        <p>Content</p>
      </CollapsibleSection>,
    );
    const button = screen.getByRole('button', { name: /Collapsed/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens on click (aria-expanded="true")', async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleSection title="Click Me">
        <p>Now visible</p>
      </CollapsibleSection>,
    );
    const button = screen.getByRole('button', { name: /Click Me/i });

    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('starts open when defaultOpen=true', () => {
    render(
      <CollapsibleSection title="Open Section" defaultOpen>
        <p>Visible from start</p>
      </CollapsibleSection>,
    );
    const button = screen.getByRole('button', { name: /Open Section/i });
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes when clicking again (toggle)', async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleSection title="Toggle" defaultOpen>
        <p>Content</p>
      </CollapsibleSection>,
    );
    const button = screen.getByRole('button', { name: /Toggle/i });

    expect(button).toHaveAttribute('aria-expanded', 'true');
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
