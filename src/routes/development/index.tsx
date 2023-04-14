import Table from "~/components/Table";
import Prompt from "~/components/Prompt";
import Key from "~/components/Key";
import { createEffect, createSignal } from "solid-js";
import WebSocket from "isomorphic-ws";
import "./index.css";
import {
  GameState,
  GameStatus,
  defaultGameState,
  resetGameState,
  updateGameState,
} from "~/util/store";
import { getRole } from "~/util/sockets";
import { createStore } from "solid-js/store";

export default function GameUI() {
  const [gameState, setGameState] = createStore(defaultGameState);

  const [message, setMessage] = createSignal("");
  const socket = new WebSocket("ws://localhost:8001/");
  const [socketState, setSocketState] = createSignal(socket.readyState);
  // used to only show the key to the codemaster
  const [humanIsCodemaster, setHumanIsCodemaster] = createSignal(false);
  const codemasterRole = "Codemaster";

  const startGame = () => send("Connection established.");

  socket.onopen = () => setSocketState(socket.readyState);
  socket.onclose = () => setSocketState(socket.readyState);
  socket.onerror = (e) => {
    console.error(`Socket Error: ${e.message}`);
    setSocketState(socket.readyState);
  };
  socket.onmessage = (m) => {
    setMessage(m.data.toString());
    setSocketState(socket.readyState);
  };

  const send = (msg: string) => {
    socket.send(msg, (err) => {
      if (err != null) {
        console.error(`Socket Error: ${err.message}`);
        setSocketState(socket.readyState);
      }
    });
  };

  createEffect(() => {
    if (
      socketState() === WebSocket.CLOSED &&
      gameState.status !== GameStatus.Pending
    )
      resetGameState(setGameState);
    if (socketState() === WebSocket.OPEN) {
      startGame();
      setGameState({ status: GameStatus.Ongoing });
    }
  });

  createEffect(() => {
    if (message() === "") return;
    const data: any = JSON.parse(message());
    updateGameState(gameState, setGameState, data);
  });

  createEffect(() => {
    console.log(gameState);
    if (gameState.prompt === null) return;
    const role = getRole(gameState.prompt.message);
    if (role != null) setHumanIsCodemaster(role[0] === codemasterRole);
  });

  return (
    <>
      <h1>Codenames Arena</h1>
      <div id="table-container">
        <Table
          socketState={socketState}
          gameState={gameState}
          setGameState={setGameState}
        ></Table>
        <Key gameState={gameState} humanIsCodemaster={humanIsCodemaster}></Key>
      </div>
      <Prompt gameState={gameState} send={send}></Prompt>
    </>
  );
}
