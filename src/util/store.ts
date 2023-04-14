import { SetStoreFunction } from "solid-js/store";

export enum GameStatus {
  Pending,
  Ongoing,
  Won,
  Lost,
}

export type Board = {
  words: string[];
  key: string[];
  guessed: boolean[];
};

export type Prompt = {
  type: string;
  message: string;
};

export type GameState = {
  board: Board;
  prompt: Prompt | null;
  error: string | null;
  status: GameStatus;
};

export const defaultGameState: GameState = {
  board: { words: [], guessed: [], key: [] },
  prompt: null,
  error: null,
  status: GameStatus.Pending,
};

export const resetGameState = (setGameState: SetStoreFunction<GameState>) => {
  setGameState(defaultGameState);
};

export const updateGameState = (
  gameState: GameState,
  setGameState: SetStoreFunction<GameState>,
  data: any
) => {
  for (const key in data)
    updateGameStateKV(gameState, setGameState, key, data[key]);
  if (!data.hasOwnProperty("prompt")) setGameState({ prompt: null });
  if (!data.hasOwnProperty("error")) setGameState({ error: null });
};

const updateGameStateKV = (
  gameState: GameState,
  setGameState: SetStoreFunction<GameState>,
  key: string,
  value: any
) => {
  switch (key) {
    case "guess_success":
      const _guessed = JSON.parse(JSON.stringify(gameState.board.guessed));
      _guessed[value] = true;
      setGameState("board", { guessed: _guessed });
      break;
    case "board":
      if (gameState.board.guessed.length === 0)
        setGameState("board", {
          guessed: new Array(value.words.length).fill(false),
        });
      if (gameState.board.words.length === 0)
        setGameState("board", { words: value.words });
      if (gameState.board.key.length === 0 && value.hasOwnProperty("key"))
        setGameState("board", { key: value.key });
      break;
    case "prompt":
      setGameState({ prompt: value });
      break;
    case "error":
      setGameState({ error: value });
      alert(value);
      break;
    case "game_over":
      setGameState({ status: value ? GameStatus.Won : GameStatus.Lost });
      break;
  }
};

export const getGrid = (gameState: GameState) => {
  const words = gameState.board.words;
  const key = gameState.board.key;
  const guessed = gameState.board.guessed;
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
