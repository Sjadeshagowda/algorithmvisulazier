export function randomArray(size: number, min = 5, max = 100): number[] {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function nearSortedArray(size: number, max = 100): number[] {
  const arr = Array.from({ length: size }, (_, i) =>
    Math.floor((i / size) * max) + Math.floor(Math.random() * 10)
  );
  return arr;
}
