import { formatMoney } from '../../utils/courseData';

export default function BudgetingActivity({
  page,
  answer,
  onChange,
  disabled = false,
}) {
  const items = page?.availableItems ?? [];
  const selected = answer?.selectedItemIndexes ?? [];
  const selectedSet = new Set(selected);
  const spend = items.reduce(
    (total, item) =>
      selectedSet.has(item.index) ? total + Number(item.cost) : total,
    0,
  );
  const startingAmount = Number(page?.startingAmount) || 0;
  const targetSavings = Number(page?.targetSavings) || 0;
  const remaining = startingAmount - spend;

  const toggleItem = (itemIndex) => {
    const next = selectedSet.has(itemIndex)
      ? selected.filter((index) => index !== itemIndex)
      : [...selected, itemIndex].sort((left, right) => left - right);
    onChange({ selectedItemIndexes: next });
  };

  return (
    <div className='space-y-5'>
      <dl className='grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--code-bg)] p-4 sm:grid-cols-3'>
        <div>
          <dt className='text-xs text-[var(--text)]'>Starting amount</dt>
          <dd className='mt-1 font-semibold text-[var(--text-h)]'>
            {formatMoney(startingAmount)}
          </dd>
        </div>
        <div>
          <dt className='text-xs text-[var(--text)]'>Selected spend</dt>
          <dd className='mt-1 font-semibold text-[var(--text-h)]'>
            {formatMoney(spend)}
          </dd>
        </div>
        <div>
          <dt className='text-xs text-[var(--text)]'>Remaining</dt>
          <dd className='mt-1 font-semibold text-[var(--text-h)]'>
            {formatMoney(remaining)}
          </dd>
        </div>
      </dl>
      <fieldset disabled={disabled} className='space-y-3'>
        <legend className='text-sm font-medium text-[var(--text-h)]'>
          Choose items to buy
        </legend>
        {items.map((item) => {
          const itemId = `budget-item-${page?._id ?? page?.id ?? 'page'}-${item.index}`;
          return (
            <label
              key={item.index}
              htmlFor={itemId}
              className='flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 transition hover:border-[var(--accent-border)] focus-within:ring-2 focus-within:ring-[var(--accent-border)] has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent-bg)]'
            >
              <span className='flex items-center gap-3'>
                <input
                  id={itemId}
                  type='checkbox'
                  checked={selectedSet.has(item.index)}
                  onChange={() => toggleItem(item.index)}
                  className='h-5 w-5 accent-[var(--accent-bold)]'
                />
                <span className='text-[var(--text-h)]'>{item.name}</span>
              </span>
              <span className='text-sm text-[var(--text)]'>
                {formatMoney(item.cost)}
              </span>
            </label>
          );
        })}
      </fieldset>
      <p className='text-sm text-[var(--text)]'>
        Keep at least {formatMoney(targetSavings)} saved to reach your goal.
      </p>
    </div>
  );
}

export { BudgetingActivity };
