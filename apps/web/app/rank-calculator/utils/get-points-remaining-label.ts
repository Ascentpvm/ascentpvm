import { formatNumber } from './format-number';

export function getPointsRemainingLabel(
  pointsRemaining: number,
  throttleReason?: 'completionist' | 'join date' | 'boss kc' | 'items' | 'Master CAs' | 'slayer level' | null,
) {
  if (throttleReason === 'completionist') {
    return 'Completionist required!';
  }
  if (throttleReason === 'join date') {
    return 'Need more time in the clan!';
  }
  if (throttleReason === 'items') {
    return 'Items required!';
  }

  if (throttleReason === 'Master CAs') {
    return 'Master CAs required!';
  }

  if (throttleReason === 'slayer level') {
    return '95 Slayer Required!';
  }

  if (throttleReason === 'boss kc') {
    return 'Boss KC required!';
  }


  return pointsRemaining ? `(${formatNumber(pointsRemaining)})` : 'Completed';
}
