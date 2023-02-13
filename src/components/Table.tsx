import { createSignal, For } from "solid-js";
import Row from "./Row";
import StatusBar from "./StatusBar";
import { fetchGameState, grid } from "../util/GameState";

export default function Table(props: any) {
  const [gameState, setGameState] = createSignal<any>();

  setInterval(async () => {
    try {
      const inf = await fetchGameState();
      setGameState(inf);
    } catch (e: any) {
      setGameState(null);
    }
  }, 1000);

  const gameStateGrid = () => grid(gameState());

  return (
    <>
      <h1>Experimental Game UI</h1>
      <div id="game-area">
        <table>
          <For each={gameStateGrid()}>{(row) => <Row words={row}></Row>}</For>
        </table>
        <StatusBar state={gameState()}></StatusBar>
      </div>
    </>
  );
}
