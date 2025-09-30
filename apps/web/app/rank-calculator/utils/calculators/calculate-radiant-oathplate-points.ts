import Decimal from 'decimal.js-light';
import { pointsConfig } from '../../config/points';

export function calculateRadiantOathplatePoints(
  hasRadiantOathplate: boolean,
  scaling: number,
) {
  const basePoints = hasRadiantOathplate
    ? pointsConfig.radiantOathplatePoints
    : 0;

  return new Decimal(basePoints).times(scaling).toNumber();
}
