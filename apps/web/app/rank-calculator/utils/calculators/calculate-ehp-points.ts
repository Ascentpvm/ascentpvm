export function calculateEhpPoints(ehp: number, scaling: number) {
  const pointsPerEhp = 0;
  const pointsAwarded = Math.floor(
    Number((ehp * pointsPerEhp * scaling).toFixed(3)),
  );

  return pointsAwarded;
}
