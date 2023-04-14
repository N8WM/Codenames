import { createSignal, For, Switch, Match, Show, Accessor } from "solid-js";
import Row from "./Row";
import WebSocket from "isomorphic-ws";
import "./Table.css";
import { GameState, GameStatus, defaultGameState, getGrid } from "~/util/store";
import { SetStoreFunction } from "solid-js/store";

export default function Table(props: {
  gameState: GameState;
  setGameState: SetStoreFunction<GameState>;
  socketState: Accessor<0 | 2 | 1 | 3>;
}) {
  const gameStateGrid = () => getGrid(props.gameState);
  const [reloading, setReloading] = createSignal(false);
  const reload = () => {
    location.reload();
    setReloading(true);
    props.setGameState(defaultGameState);
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
      <Match when={props.gameState.status === GameStatus.Ongoing}>
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
      <Match when={props.gameState.status === GameStatus.Lost}>
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
      <Match when={props.gameState.status === GameStatus.Won}>
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
          props.gameState.status === GameStatus.Pending &&
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
