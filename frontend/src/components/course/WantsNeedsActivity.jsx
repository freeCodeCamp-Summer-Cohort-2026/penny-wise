export default function WantsNeedsActivity({
  page,
  answer,
  onChange,
  disabled = false,
}) {
  const items = page?.items ?? [];
  const classifications = answer?.classifications ?? [];

  const updateCategory = (itemIndex, category) => {
    const next = [
      ...classifications.filter(
        (classification) => classification.itemIndex !== itemIndex,
      ),
      { itemIndex, category },
    ].sort((left, right) => left.itemIndex - right.itemIndex);
    onChange({ classifications: next });
  };

  return (
    <fieldset disabled={disabled} className='space-y-4'>
      <legend className='text-sm font-medium text-[var(--text-h)]'>
        Sort each item as a want or a need
      </legend>
      {items.map((item) => {
        const current = classifications.find(
          (classification) => classification.itemIndex === item.index,
        );
        return (
          <div
            key={item.index}
            className='rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4'
          >
            <p className='mb-3 font-medium text-[var(--text-h)]'>{item.name}</p>
            <div className='flex flex-wrap gap-4'>
              {['need', 'want'].map((category) => {
                const inputId = `wants-needs-${page?._id ?? page?.id ?? 'page'}-${item.index}-${category}`;
                return (
                  <label
                    key={category}
                    htmlFor={inputId}
                    className='flex cursor-pointer items-center gap-2 text-[var(--text)]'
                  >
                    <input
                      id={inputId}
                      type='radio'
                      name={`wants-needs-${page?._id ?? page?.id ?? 'page'}-${item.index}`}
                      value={category}
                      checked={current?.category === category}
                      onChange={() => updateCategory(item.index, category)}
                      className='h-5 w-5 accent-[var(--accent-bold)]'
                    />
                    <span className='capitalize'>{category}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </fieldset>
  );
}

export { WantsNeedsActivity };
