import React, { useState, Suspense, useEffect, lazy } from "react";
import Game from "../components/canvas/Game";
import useGameState from "../hooks/useGame";
import { io } from "socket.io-client";
import LoginPanel from "../components/LoginPanel";
import isClient from "../utils/isClient";
import usePlayer from "../hooks/usePlayer";
import useTurn from "../hooks/useTurn";

const s = io("ws://localhost:8080");
// const s = io("wss://parssa-dice-game.herokuapp.com");

export default function Home() {
  const { game } = useGameState();
  const { player, setPlayer } = usePlayer();
  const { turn, setTurn } = useTurn();
  const [users, setUsers] = useState<Map<string, IPlayer>>(new Map());
  const [joined, setJoined] = useState(false);
  const [socket] = useState(s);
  useEffect(() => {
    if (!isClient()) {
      socket.disconnect();
      return;
    }

    socket.on("connect", () => {
      console.debug("Connected to server");
    });

    socket.on("disconnect", () => {
      console.debug("Disconnected from server");
    });

    socket.on("turn", (turn: number) => {
      console.debug(`-- Turn ${turn} --`);
      setTurn(turn);
    });

    socket.on("users", (usersResponse) => {
      const usersArray = JSON.parse(usersResponse) as unknown as IPlayer[];
      const usersMap = new Map<string, IPlayer>(
        usersArray.filter((user) => user.type === "player").map((user) => [user._id, user])
      );
      const curr = usersArray.find((u) => u._id === socket.id);
      if (curr) {
        console.debug("setting current player", curr);
        setPlayer(curr);
      }
      setUsers(usersMap);
    });
  }, [socket]);

  console.debug(game);

  const join = (name: string) => {
    s.emit("join", { name, type: "player" });
    setJoined(true);
  };

  return (
    <>
      <main className="min-h-screen relative bg-green-50 text-3xl text-center">
        {joined ? <Game socket={socket} /> : <LoginPanel join={join} />}
        <div className="absolute inset-0 pointer-events-none p-4">
          <div className="max-w-xs space-y-2">
            {Array.from(users.values())
              .filter((user: any) => user.type === "player")
              .map((p, index) => (
                <div
                  key={index}
                  className={`
                bg-gray-100
                bg-opacity-40
                border-b-2
                ${index === turn ? " border-blue-400 bg-blue-300 bg-opacity-40" : "border-gray-20"}
                rounded-md 
                text-xl
                p-1 
                flex 
                justify-between
                items-center
                `}
                  style={{
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                >
                  <p className="font-medium">
                    {p._id === player?._id && `*`}
                    {p.name}
                    {p.turn_index}
                  </p>
                  <p>{p.score}</p>
                  <p>{p.turn_index}</p>
                </div>
              ))}
          </div>
        </div>
      </main>
    </>
  );
}
