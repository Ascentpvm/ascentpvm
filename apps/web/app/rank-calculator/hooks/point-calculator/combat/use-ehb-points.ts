import { useWatch } from 'react-hook-form';
import { RankCalculatorSchema } from '@/app/rank-calculator/[player]/submit-rank-calculator-validation';
import { calculateEhbPoints } from '@/app/rank-calculator/utils/calculators/calculate-ehb-points';

export function useEhbPoints() {
  const ehb = useWatch<RankCalculatorSchema, 'ehb'>({ name: 'ehb' });

  return calculateEhbPoints(ehb);
}
