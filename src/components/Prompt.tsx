import { Match, Show, Switch } from "solid-js";
import "./Prompt.css";
import { getRole } from "~/util/general";
import { useGameState } from "~/stores/GameState";

export default function Prompt(props: { send: (message: string) => void }) {
  const state = useGameState();
  if (!state) throw new Error("Store uninitialized");
  const [gameState] = state;

  let textRef: any;

  function respond(event: Event) {
    event.preventDefault();
    props.send(textRef.value);
  }

  function respondYes(event: Event) {
    event.preventDefault();
    props.send("true");
  }

  function respondNo(event: Event) {
    event.preventDefault();
    props.send("false");
  }

  return (
    <Show
      when={gameState.hasOwnProperty("prompt") && gameState.prompt != null}
      fallback={<div></div>}
    >
      <div id="prompt-container">
        <div id="prompt-area">
          <div id="prompt-message">
            <Switch>
              <Match when={getRole(gameState.prompt?.message) != null}>
                <b>{(getRole(gameState.prompt?.message) ?? ["_"])[0]}:</b>
                {(getRole(gameState.prompt?.message) ?? ["", "_"])[1]}
              </Match>
              <Match when={getRole(gameState.prompt?.message) == null}>
                {gameState.prompt?.message}
              </Match>
            </Switch>
          </div>
          <Switch>
            <Match when={gameState.prompt?.type === "str"}>
              <form
                onSubmit={respond}
                autocomplete="off"
                id="prompt-input-area"
              >
                <input type="text" id="prompt" ref={textRef} />
                <input type="submit" value="Submit" />
              </form>
            </Match>
            <Match when={gameState.prompt?.type === "bool"}>
              <div id="prompt-input-area">
                <input type="button" value="Yes" onClick={respondYes} />
                <input type="button" value="No" onClick={respondNo} />
              </div>
            </Match>
          </Switch>
        </div>
      </div>
    </Show>
  );
}
