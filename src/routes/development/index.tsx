import Table from "~/components/Table";
import Prompt from "~/components/Prompt";
import Key from "~/components/Key";
import { createEffect, createSignal } from "solid-js";
import WebSocket from "isomorphic-ws";
import "./index.css";

export enum GameStatus {
  Pending,
  Ongoing,
  Won,
  Lost,
}

export default function GameUI(props: any) {
  const [gameState, setGameState] = createSignal<any>();
  const [message, setMessage] = createSignal("");
  const socket = new WebSocket("ws://localhost:8001/");
  const [state, setState] = createSignal(socket.readyState);

  const [gameStatus, setGameStatus] = createSignal(GameStatus.Pending);
  // used to only show the key to the codemaster
  const [humanIsCodemaster, setHumanIsCodemaster] = createSignal(false);
  const codemasterRole = "Codemaster";

  const startGame = () => {
    send("Connection established.");
    setGameStatus(GameStatus.Pending);
  };

  const resetBoard = () => {
    setGameState({
      board: {
        words: [],
        guessed: [],
        key: [],
      },
      prompt: null,
      error: null,
    });
    setGameStatus(GameStatus.Pending);
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
    if (state() == WebSocket.OPEN) startGame();
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
          if (
            gameState.board.words.length > 0 &&
            gameState.board.key.length > 0
          )
            res.board = { ...gameState.board };
          else res.board = { ...gameState.board, ...data.board };
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
          return res;
        });
      if (data.hasOwnProperty("prompt")) {
        setGameState((gameState) => {
          let res = { ...gameState };
          res.prompt = data.prompt;
          return res;
        });
        const role = getRole(data.prompt.message);
        if (role != null) setHumanIsCodemaster(role[0] == codemasterRole);
      } else {
        setGameState((gameState) => {
          let res = { ...gameState };
          res.prompt = null;
          return res;
        });
        setHumanIsCodemaster(false);
      }
      if (data.hasOwnProperty("error"))
        setGameState((gameState) => {
          let res = { ...gameState };
          res.error = data.error;
          alert(res.error);
          return res;
        });
      if (data.hasOwnProperty("game_over"))
        setGameStatus(
          data.game_over == "won" ? GameStatus.Won : GameStatus.Lost
        );
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
      <h1>Codenames Arena</h1>
      <div id="table-container">
        <Table
          socketState={state}
          gameState={gameState}
          gameStatus={gameStatus}
          setGameStatus={setGameStatus}
        ></Table>
        <Key
          socketState={state}
          gameState={gameState}
          humanIsCodemaster={humanIsCodemaster}
        ></Key>
      </div>
      <Prompt gameState={gameState} send={send} getRole={getRole}></Prompt>
    </>
  );
}

function getRole(message: string): string[] | null {
  const startSymbol = "[";
  const endSymbol = "]";
  const start = message.indexOf(startSymbol);
  const end = message.indexOf(endSymbol);
  if (start != 0 || end == -1) return null;
  return [message.substring(start + 1, end), message.substring(end + 1)];
}
