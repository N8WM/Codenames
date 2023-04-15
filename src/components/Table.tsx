import { createSignal, For, Switch, Match, Show, Accessor } from "solid-js";
import Row from "./Row";
import WebSocket from "isomorphic-ws";
import "./Table.css";
import { useGameState } from "~/stores/GameState";
import { GameStatus } from "~/util/prototypes";

export default function Table(props: { socketState: Accessor<0 | 2 | 1 | 3> }) {
  const state = useGameState();
  if (!state) throw new Error("Store uninitialized");
  const [gameState, { reset: resetGS, getGrid: getGridGS }] = state;

  const gameStateGrid = () => getGridGS();
  const [reloading, setReloading] = createSignal(false);
  const reload = () => {
    location.reload();
    setReloading(true);
    resetGS();
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
      <Match when={gameState.status === GameStatus.Ongoing}>
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
      <Match when={gameState.status === GameStatus.Lost}>
        <div>
          <b>You lost!</b>
        </div>
        <input
          type="button"
          value="New Game"
          onClick={reload}
          disabled={reloading()}
        />
      </Match>
      <Match when={gameState.status === GameStatus.Won}>
        <div>
          <b>You won!</b>
        </div>
        <input
          type="button"
          value="New Game"
          onClick={reload}
          disabled={reloading()}
        />
      </Match>
      <Match
        when={
          gameState.status === GameStatus.Pending &&
          props.socketState() === WebSocket.CONNECTING
        }
      >
        <div>
          <b>Connecting...</b>
        </div>
      </Match>
    </Switch>
  );
}
