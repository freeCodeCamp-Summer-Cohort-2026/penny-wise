import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MultipleChoiceActivity from '../components/course/MultipleChoiceActivity';
import MatchingActivity from '../components/course/MatchingActivity';
import BudgetingActivity from '../components/course/BudgetingActivity';
import WantsNeedsActivity from '../components/course/WantsNeedsActivity';
import { getActivityAnswerError } from '../utils/activityValidation';

const multipleChoicePage = {
  _id: 'mc-1',
  type: 'multiple_choice',
  text: 'Pick one',
  options: [
    { index: 0, answerText: 'First' },
    { index: 1, answerText: 'Second' },
  ],
};

const matchingPage = {
  _id: 'match-1',
  type: 'matching',
  text: 'Match terms',
  words: [
    { index: 0, text: 'save' },
    { index: 1, text: 'spend' },
  ],
  definitions: [
    { index: 0, text: 'keep for later' },
    { index: 1, text: 'use now' },
  ],
};

const budgetingPage = {
  _id: 'budget-1',
  type: 'budgeting',
  text: 'Choose purchases',
  startingAmount: 500,
  targetSavings: 200,
  availableItems: [
    { index: 0, name: 'Notebook', cost: 100 },
    { index: 1, name: 'Sticker', cost: 50 },
  ],
};

const wantsNeedsPage = {
  _id: 'needs-1',
  type: 'wants_needs',
  text: 'Sort items',
  items: [
    { index: 0, name: 'Water' },
    { index: 1, name: 'Game' },
  ],
};

function BudgetingHarness({ onChange }) {
  const [answer, setAnswer] = useState({ selectedItemIndexes: [] });
  return (
    <BudgetingActivity
      page={budgetingPage}
      answer={answer}
      onChange={(nextAnswer) => {
        setAnswer(nextAnswer);
        onChange(nextAnswer);
      }}
    />
  );
}

describe('controlled activities', () => {
  it('submits the selected multiple-choice index', async () => {
    const onChange = vi.fn();
    render(
      <MultipleChoiceActivity
        page={multipleChoicePage}
        answer={{ optionIndex: null }}
        onChange={onChange}
      />,
    );

    await userEvent.click(screen.getByRole('radio', { name: 'Second' }));

    expect(onChange).toHaveBeenCalledWith({ optionIndex: 1 });
  });

  it('submits accessible matching selections', async () => {
    const onChange = vi.fn();
    render(
      <MatchingActivity
        page={matchingPage}
        answer={{ matches: [] }}
        onChange={onChange}
      />,
    );

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Definition for save' }),
      '1',
    );

    expect(onChange).toHaveBeenLastCalledWith({
      matches: [{ wordIndex: 0, definitionIndex: 1 }],
    });
  });

  it('submits budget item indexes and shows running totals', async () => {
    const onChange = vi.fn();
    render(<BudgetingHarness onChange={onChange} />);

    await userEvent.click(screen.getByRole('checkbox', { name: /Notebook/ }));

    expect(screen.getByText('$1.00', { selector: 'dd' })).toBeInTheDocument();
    expect(screen.getByText('$4.00', { selector: 'dd' })).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith({ selectedItemIndexes: [0] });
  });

  it('submits want and need classifications', async () => {
    const onChange = vi.fn();
    render(
      <WantsNeedsActivity
        page={wantsNeedsPage}
        answer={{ classifications: [] }}
        onChange={onChange}
      />,
    );

    const radios = screen.getAllByRole('radio', { name: 'need' });
    await userEvent.click(radios[0]);

    expect(onChange).toHaveBeenCalledWith({
      classifications: [{ itemIndex: 0, category: 'need' }],
    });
  });

  it('locally rejects incomplete or duplicate structural answers', () => {
    expect(
      getActivityAnswerError(
        'multiple_choice',
        { optionIndex: null },
        multipleChoicePage,
      ),
    ).toMatch(/choose one/i);
    expect(
      getActivityAnswerError(
        'matching',
        { matches: [{ wordIndex: 0, definitionIndex: 0 }] },
        matchingPage,
      ),
    ).toMatch(/match every/i);
    expect(
      getActivityAnswerError(
        'matching',
        {
          matches: [
            { wordIndex: 0, definitionIndex: 0 },
            { wordIndex: 1, definitionIndex: 0 },
          ],
        },
        matchingPage,
      ),
    ).toMatch(/different definition/i);
    expect(
      getActivityAnswerError(
        'budgeting',
        { selectedItemIndexes: [] },
        budgetingPage,
      ),
    ).toMatch(/at least one/i);
    expect(
      getActivityAnswerError(
        'wants_needs',
        { classifications: [] },
        wantsNeedsPage,
      ),
    ).toMatch(/every item/i);
  });
});
