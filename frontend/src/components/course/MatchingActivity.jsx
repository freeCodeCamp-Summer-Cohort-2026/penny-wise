export default function MatchingActivity({
  page,
  answer,
  onChange,
  disabled = false,
}) {
  const words = page?.words ?? [];
  const definitions = page?.definitions ?? [];
  const matches = answer?.matches ?? [];

  const updateMatch = (wordIndex, definitionIndex) => {
    const withoutWord = matches.filter(
      (match) => match.wordIndex !== wordIndex,
    );
    const next = [...withoutWord, { wordIndex, definitionIndex }].sort(
      (left, right) => left.wordIndex - right.wordIndex,
    );
    onChange({ matches: next });
  };

  return (
    <div className='space-y-4'>
      {words.map((word) => {
        const current = matches.find((match) => match.wordIndex === word.index);
        const selectId = `match-word-${page?._id ?? page?.id ?? 'page'}-${word.index}`;

        return (
          <div
            key={word.index}
            className='grid gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:items-center'
          >
            <p className='font-medium text-[var(--text-h)]'>{word.text}</p>
            <label htmlFor={selectId} className='sr-only'>
              Definition for {word.text}
            </label>
            <select
              id={selectId}
              value={current?.definitionIndex ?? ''}
              disabled={disabled}
              onChange={(event) =>
                updateMatch(
                  word.index,
                  event.target.value === '' ? null : Number(event.target.value),
                )
              }
              className='w-full rounded-lg border border-[var(--border)] bg-[var(--code-bg)] px-3 py-2.5 text-[var(--text-h)] outline-none focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent-border)] disabled:cursor-not-allowed disabled:opacity-60'
            >
              <option value=''>Choose a definition</option>
              {definitions.map((definition) => (
                <option key={definition.index} value={definition.index}>
                  {definition.text}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}

export { MatchingActivity };
