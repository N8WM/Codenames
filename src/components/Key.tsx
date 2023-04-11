import { Show, For } from "solid-js";
import { grid } from "../util/GameState";
import Row from "./Row";
import WebSocket from "isomorphic-ws";
import "./Key.css";

export default function Key(props: any) {
  const gameStateGrid = () => grid(props.gameState());

  return (
    <Show
      when={props.socketState() == WebSocket.OPEN && props.humanIsCodemaster()}
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
