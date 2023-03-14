import { createSignal, For, Switch, Match, Show } from "solid-js";
import Row from "./Row";
import { grid } from "../util/GameState";
import WebSocket from "isomorphic-ws";
import "./Table.css";

export default function Table(props: any) {
  const gameStateGrid = () => grid(props.gameState());
  const [reloading, setReloading] = createSignal(false);
  const reload = () => {
    location.reload();
    setReloading(true);
  };

  return (
    <Switch
      fallback={
        <>
          <div>
            <b>Disconnected</b>
          </div>
          <input
            type="button"
            value="Reconnect"
            onClick={reload}
            disabled={reloading()}
          />
        </>
      }
    >
      <Match when={props.socketState() == WebSocket.OPEN}>
        <Show
          when={gameStateGrid().length > 0}
          fallback={
            <div>
              <b>Loading...</b>
            </div>
          }
        >
          <table id="card-table">
            <For each={gameStateGrid()}>
              {(row) => <Row words={row} isKey={false}></Row>}
            </For>
          </table>
        </Show>
      </Match>
      <Match when={props.socketState() == WebSocket.CONNECTING}>
        <div>
          <b>Connecting...</b>
        </div>
      </Match>
      <Match when={props.socketState() == WebSocket.CLOSING}>
        <div>
          <b>Disconnecting...</b>
        </div>
      </Match>
      <Match when={props.socketState() == WebSocket.CLOSED}>
        <>
          <div>
            <b>Disconnected</b>
          </div>
          <input
            type="button"
            value="Reconnect"
            onClick={reload}
            disabled={reloading()}
          />
        </>
      </Match>
    </Switch>
  );
}
