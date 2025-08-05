import { formatNumber } from './format-number';

export function getPointsRemainingLabel(
  pointsRemaining: number,
  throttleReason?: 'completionist' | 'join date' | 'boss kc' | 'items' | 'Master CAs' | 'slayer level' | null,
) {
  if (throttleReason === 'completionist') {
    return 'All Items';
  }
  if (throttleReason === 'join date') {
    return 'Join date too recent!';
  }
  if (throttleReason === 'items') {
    return 'Missing Required Items!';
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
