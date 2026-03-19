export function simpleKMeans(values: number[], k: number): number[] {
  const centroids = Array.from({ length: k }, (_, i) => (i / k) * 360);
  const assignments = new Array(values.length).fill(0);

  for (let iter = 0; iter < 20; iter++) {
    const sums = new Array(k).fill(0);
    const counts = new Array(k).fill(0);

    values.forEach((v, i) => {
      let best = 0;
      let bestD = Infinity;

      centroids.forEach((c, j) => {
        let d = Math.abs(v - c);
        if (d > 180) d = 360 - d;
        if (d < bestD) {
          bestD = d;
          best = j;
        }
      });

      assignments[i] = best;
      sums[best] += v;
      counts[best]++;
    });

    centroids.forEach((_, j) => {
      if (counts[j] > 0) centroids[j] = sums[j] / counts[j];
    });
  }

  return assignments;
}
