export default function MultipleChoiceActivity({
  page,
  answer,
  onChange,
  disabled = false,
}) {
  const selectedIndex = answer?.optionIndex;
  const name = `multiple-choice-${page?._id ?? page?.id ?? 'page'}`;

  return (
    <fieldset disabled={disabled} className='space-y-3'>
      <legend className='sr-only'>Choose one answer</legend>
      {(page?.options ?? []).map((option) => {
        const optionId = `${name}-${option.index}`;
        return (
          <label
            key={option.index}
            htmlFor={optionId}
            className='flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 transition hover:border-[var(--accent-border)] focus-within:ring-2 focus-within:ring-[var(--accent-border)] has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent-bg)]'
          >
            <input
              id={optionId}
              type='radio'
              name={name}
              value={option.index}
              checked={selectedIndex === option.index}
              onChange={() => onChange({ optionIndex: option.index })}
              className='mt-1 h-5 w-5 shrink-0 accent-[var(--accent-bold)]'
            />
            <span className='text-[var(--text-h)]'>{option.answerText}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

export { MultipleChoiceActivity };
