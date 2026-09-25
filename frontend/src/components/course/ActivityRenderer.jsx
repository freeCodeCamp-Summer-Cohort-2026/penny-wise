import MultipleChoiceActivity from './MultipleChoiceActivity';
import MatchingActivity from './MatchingActivity';
import BudgetingActivity from './BudgetingActivity';
import WantsNeedsActivity from './WantsNeedsActivity';

export default function ActivityRenderer(props) {
  const { page } = props;

  if (page?.type === 'multiple_choice') {
    return <MultipleChoiceActivity {...props} />;
  }
  if (page?.type === 'matching') {
    return <MatchingActivity {...props} />;
  }
  if (page?.type === 'budgeting') {
    return <BudgetingActivity {...props} />;
  }
  if (page?.type === 'wants_needs') {
    return <WantsNeedsActivity {...props} />;
  }

  return (
    <p role='alert' className='text-[var(--text)]'>
      This activity type is not available yet.
    </p>
  );
}
