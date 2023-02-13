export const fetchGameState = async () => (await fetch("/io/inf.json")).json();
export const grid = (state: any) =>
  state?.words.reduce((acc: any, word: any, i: number) => {
    const row = Math.floor(i / 5);
    acc[row] = [].concat(acc[row] || [], word);
    return acc;
  }, []);
