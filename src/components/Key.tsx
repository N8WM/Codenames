import { Show, For, Accessor } from "solid-js";
import Row from "./Row";
import "./Key.css";
import { useGameState } from "~/stores/GameState";
import { GameStatus } from "~/util/prototypes";

export default function Key(props: { humanIsCodemaster: Accessor<boolean> }) {
  const state = useGameState();
  if (!state) throw new Error("Store uninitialized");
  const [gameState, { getGrid: getGridGS }] = state;
  const gameStateGrid = () => getGridGS();

  return (
    <Show
      when={
        gameState.status === GameStatus.Ongoing && props.humanIsCodemaster()
      }
    >
      <table id="key-table">
        <Show when={gameStateGrid().length > 0}>
          <For each={gameStateGrid()}>
            {(row) => <Row words={row} isKey={true}></Row>}
          </For>
        </Show>
      </table>
    </Show>
  );
}
