import { clampPercent } from '../../utils/courseData';

export default function ProgressBar({
  value = 0,
  label = 'Progress',
  valueText,
  className = '',
}) {
  const percent = clampPercent(value);

  return (
    <div className={className}>
      <div
        role='progressbar'
        aria-label={label}
        aria-valuemin='0'
        aria-valuemax='100'
        aria-valuenow={percent}
        aria-valuetext={valueText}
        className='h-2.5 overflow-hidden rounded-full bg-[var(--code-bg)]'
      >
        <div
          className='h-full rounded-full bg-[var(--accent)] transition-[width] duration-300'
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
