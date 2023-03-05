export const grid = (state: any) => {
  const words = state?.board?.words;
  const key = state?.board?.key;
  const guessed = state?.board?.guessed;
  const grid: { word: string; color: string; guessed: boolean }[][] = [];
  if (!words || !key || !guessed) return [];
  for (let i = 0; i < words.length; i++) {
    const row = Math.floor(i / 5);
    if (grid.length <= row) {
      grid.push([]);
    }
    const item = {
      word: words[i],
      color: key[i],
      guessed: guessed[i],
    };
    grid[row].push(item);
  }
  return grid;
};
