import { createSignal, For, Switch, Match } from "solid-js";
import Row from "./Row";
import StatusBar from "./StatusBar";
import { grid } from "../util/GameState";
import WebSocket from "isomorphic-ws";

export default function Table(props: any) {
  const gameStateGrid = () => grid(props.gameState());
  const [reloading, setReloading] = createSignal(false);
  const reload = () => {
    location.reload();
    setReloading(true);
  };

  return (
    <>
      <h1>Experimental Game UI</h1>
      <div id="game-area">
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
            <table>
              <For each={gameStateGrid()}>
                {(row) => <Row words={row}></Row>}
              </For>
            </table>
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
      </div>
    </>
  );
}
