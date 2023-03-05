import Table from "~/components/Table";
import { createEffect, createSignal, Match, Show, Switch } from "solid-js";
import WebSocket from "isomorphic-ws";

export default function GameUI(props: any) {
  const [gameState, setGameState] = createSignal<any>();
  const [message, setMessage] = createSignal("");
  const socket = new WebSocket("ws://localhost:8001/");
  const [state, setState] = createSignal(socket.readyState);

  const resetBoard = () => {
    setGameState({
      board: {
        words: [],
        guessed: [],
      },
      prompt: null,
      error: null,
    });
  };

  socket.onopen = () => setState(socket.readyState);
  socket.onmessage = (e) => {
    setMessage(e.data.toString());
    setState(socket.readyState);
  };
  socket.onerror = (e) => {
    console.error(`Socket Error: ${e.message}`);
    setState(socket.readyState);
  };
  socket.onclose = () => setState(socket.readyState);

  const send = (msg: string) => {
    socket.send(msg, (err) => {
      if (err != null) console.error(`Socket Error: ${err.message}`);
    });
  };

  resetBoard();
  createEffect(() => {
    if (state() == WebSocket.CLOSED) resetBoard();
  });

  createEffect(() => {
    if (message() != "") {
      const data: any = JSON.parse(message());
      if (data.hasOwnProperty("guess_success"))
        setGameState((gameState) => {
          let res = { ...gameState };
          res.board.guessed[data.guess_success] = true;
          return res;
        });
      if (data.hasOwnProperty("board"))
        setGameState((gameState) => {
          let res = { ...gameState };
          res.board = { ...gameState.board, ...data.board };
          if (
            !gameState.board.hasOwnProperty("guessed") ||
            gameState.board.guessed.length == 0
          )
            res.board.guessed = (() => {
              let board = [];
              for (let i = 0; i < res.board.words.length; i++) {
                board.push(false);
              }
              return board;
            })();
          console.log(res.board.guessed);
          return res;
        });
      if (data.hasOwnProperty("prompt"))
        setGameState((gameState) => {
          let res = { ...gameState };
          res.prompt = data.prompt;
          return res;
        });
      else
        setGameState((gameState) => {
          let res = { ...gameState };
          res.prompt = null;
          return res;
        });
      if (data.hasOwnProperty("error"))
        setGameState((gameState) => {
          let res = { ...gameState };
          res.error = data.error;
          alert(res.error);
          return res;
        });
      else
        setGameState((gameState) => {
          let res = { ...gameState };
          res.error = null;
          return res;
        });
      console.log(message());
    }
  });

  return (
    <>
      <Table socketState={state} gameState={gameState}></Table>
      <br />
      <br />
      <Show
        when={
          gameState().hasOwnProperty("prompt") && gameState().prompt != null
        }
        fallback={<div></div>}
      >
        <div>
          <div>
            <b>{gameState().prompt.message}</b>
          </div>
          <br />
          <Switch fallback={<div></div>}>
            <Match when={gameState().prompt.type === "str"}>
              <input type="text" id="prompt" />
              <input
                type="button"
                value="Submit"
                onClick={(e) =>
                  send((e.target.previousSibling as HTMLInputElement).value)
                }
              />
            </Match>
            <Match when={gameState().prompt.type === "bool"}>
              <input type="button" value="Yes" onClick={() => send("true")} />
              <input type="button" value="No" onClick={() => send("false")} />
            </Match>
          </Switch>
        </div>
      </Show>
    </>
  );
}
