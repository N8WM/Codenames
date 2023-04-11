import { Match, Show, Switch } from "solid-js";
import "./Prompt.css";

export default function Prompt(props: any) {
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
      when={
        props.gameState().hasOwnProperty("prompt") &&
        props.gameState().prompt != null
      }
      fallback={<div></div>}
    >
      <div id="prompt-container">
        <div id="prompt-area">
          <div id="prompt-message">
            <Switch>
              <Match
                when={props.getRole(props.gameState().prompt.message) != null}
              >
                <b>{props.getRole(props.gameState().prompt.message)[0]}:</b>
                {props.getRole(props.gameState().prompt.message)[1]}
              </Match>
              <Match
                when={props.getRole(props.gameState().prompt.message) == null}
              >
                {props.gameState().prompt.message}
              </Match>
            </Switch>
          </div>
          <Switch>
            <Match when={props.gameState().prompt.type === "str"}>
              <form
                onSubmit={respond}
                autocomplete="off"
                id="prompt-input-area"
              >
                <input type="text" id="prompt" ref={textRef} />
                <input type="submit" value="Submit" />
              </form>
            </Match>
            <Match when={props.gameState().prompt.type === "bool"}>
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
