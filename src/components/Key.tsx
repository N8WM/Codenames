import { Show, For, Accessor } from "solid-js";
import Row from "./Row";
import WebSocket from "isomorphic-ws";
import "./Key.css";
import { getGrid, GameStatus, GameState } from "~/util/store";

export default function Key(props: {
  gameState: GameState;
  humanIsCodemaster: Accessor<boolean>;
}) {
  const gameStateGrid = () => getGrid(props.gameState);

  return (
    <Show
      when={
        props.gameState.status === GameStatus.Ongoing &&
        props.humanIsCodemaster()
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
