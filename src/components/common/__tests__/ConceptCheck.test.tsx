import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConceptCheck, type ConceptCheckData } from '../ConceptCheck';

const mcData: ConceptCheckData = {
  mode: 'multiple-choice',
  question: 'What is the speed of light?',
  options: [
    { text: '3e8 m/s', correct: true, explanation: 'Correct! The speed of light in vacuum.' },
    { text: '3e6 m/s', correct: false, explanation: 'Too slow — that is much less than c.' },
    { text: '3e10 m/s', correct: false, explanation: 'Too fast — nothing exceeds c.' },
  ],
};

const prData: ConceptCheckData = {
  mode: 'predict-reveal',
  question: 'What happens to VSWR when the load is matched?',
  answer: 'VSWR equals 1 because there is no reflected wave.',
};

const mcWithHints: ConceptCheckData = {
  ...mcData,
  hints: ['Think about fundamental constants.', 'It starts with 3.'],
};

const prWithHints: ConceptCheckData = {
  ...prData,
  hints: ['Consider the reflection coefficient.', 'Gamma equals zero when matched.'],
};

describe('ConceptCheck — multiple-choice mode', () => {
  it('renders the question text', () => {
    render(<ConceptCheck data={mcData} />);
    expect(screen.getByText('What is the speed of light?')).toBeInTheDocument();
  });

  it('shows all option texts', () => {
    render(<ConceptCheck data={mcData} />);
    expect(screen.getByText('3e8 m/s')).toBeInTheDocument();
    expect(screen.getByText('3e6 m/s')).toBeInTheDocument();
    expect(screen.getByText('3e10 m/s')).toBeInTheDocument();
  });

  it('selects an option on click and shows explanation', async () => {
    const user = userEvent.setup();
    render(<ConceptCheck data={mcData} />);

    await user.click(screen.getByText('3e8 m/s'));
    expect(screen.getByText('Correct! The speed of light in vacuum.')).toBeInTheDocument();
  });

  it('shows "Try Again" after selection', async () => {
    const user = userEvent.setup();
    render(<ConceptCheck data={mcData} />);

    await user.click(screen.getByText('3e6 m/s'));
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('resets when "Try Again" is clicked', async () => {
    const user = userEvent.setup();
    render(<ConceptCheck data={mcData} />);

    await user.click(screen.getByText('3e6 m/s'));
    expect(screen.getByText('Too slow — that is much less than c.')).toBeInTheDocument();

    await user.click(screen.getByText('Try Again'));
    // Explanation should be gone after reset
    expect(screen.queryByText('Too slow — that is much less than c.')).not.toBeInTheDocument();
    // Options should be clickable again (not disabled)
    expect(screen.getByText('3e8 m/s')).toBeEnabled();
  });
});

describe('ConceptCheck — predict-reveal mode', () => {
  it('shows "Reveal Answer" button', () => {
    render(<ConceptCheck data={prData} />);
    expect(screen.getByText('Reveal Answer')).toBeInTheDocument();
  });

  it('shows the answer when "Reveal Answer" is clicked', async () => {
    const user = userEvent.setup();
    render(<ConceptCheck data={prData} />);

    await user.click(screen.getByText('Reveal Answer'));
    expect(screen.getByText('VSWR equals 1 because there is no reflected wave.')).toBeInTheDocument();
  });

  it('shows "Hide Answer" after revealing', async () => {
    const user = userEvent.setup();
    render(<ConceptCheck data={prData} />);

    await user.click(screen.getByText('Reveal Answer'));
    expect(screen.getByText('Hide Answer')).toBeInTheDocument();
  });

  it('hides the answer when "Hide Answer" is clicked', async () => {
    const user = userEvent.setup();
    render(<ConceptCheck data={prData} />);

    await user.click(screen.getByText('Reveal Answer'));
    expect(screen.getByText('VSWR equals 1 because there is no reflected wave.')).toBeInTheDocument();

    await user.click(screen.getByText('Hide Answer'));
    expect(screen.queryByText('VSWR equals 1 because there is no reflected wave.')).not.toBeInTheDocument();
    expect(screen.getByText('Reveal Answer')).toBeInTheDocument();
  });
});

describe('ConceptCheck — hints', () => {
  it('shows "Need a hint?" when hints are provided', () => {
    render(<ConceptCheck data={mcWithHints} />);
    expect(screen.getByText('Need a hint?')).toBeInTheDocument();
  });

  it('does not show "Need a hint?" when no hints provided', () => {
    render(<ConceptCheck data={mcData} />);
    expect(screen.queryByText('Need a hint?')).not.toBeInTheDocument();
  });

  it('reveals hints progressively on click', async () => {
    const user = userEvent.setup();
    render(<ConceptCheck data={mcWithHints} />);

    // First hint
    await user.click(screen.getByText('Need a hint?'));
    expect(screen.getByText('Think about fundamental constants.')).toBeInTheDocument();
    expect(screen.queryByText('It starts with 3.')).not.toBeInTheDocument();

    // Second hint
    await user.click(screen.getByText('Need a hint?'));
    expect(screen.getByText('It starts with 3.')).toBeInTheDocument();

    // No more hints — button should disappear
    expect(screen.queryByText('Need a hint?')).not.toBeInTheDocument();
  });

  it('reveals hints progressively in predict-reveal mode', async () => {
    const user = userEvent.setup();
    render(<ConceptCheck data={prWithHints} />);

    await user.click(screen.getByText('Need a hint?'));
    expect(screen.getByText('Consider the reflection coefficient.')).toBeInTheDocument();

    await user.click(screen.getByText('Need a hint?'));
    expect(screen.getByText('Gamma equals zero when matched.')).toBeInTheDocument();
  });
});
