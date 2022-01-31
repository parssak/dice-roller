import React, { useState, Suspense, useEffect, lazy } from "react";
import Game from "../components/canvas/Game";
import useGameState from "../hooks/useGame";
import { io } from "socket.io-client";
import LoginPanel from "../components/LoginPanel";
import isClient from "../utils/isClient";
import usePlayer from "../hooks/usePlayer";
import useTurn from "../hooks/useTurn";
import axios from "axios";

const DEBUG = false;
const BASE_URL = DEBUG ? "://localhost:8080" : "://parssa-dice-game.herokuapp.com";
const s = io(`ws${DEBUG ? '' : 's'}${BASE_URL}`);
// const s = io("wss://parssa-dice-game.herokuapp.com");

export default function Home() {
  const { game } = useGameState();
  const { player, setPlayer } = usePlayer();
  const { turn, setTurn } = useTurn();
  const [users, setUsers] = useState<Map<string, IPlayer>>(new Map());
  const [joined, setJoined] = useState(false);
  const [socket] = useState(s);

  const handleUsers = (users: IPlayer[]) => {
    if (!users) return;
    console.debug(users)
    const usersMap = new Map<string, IPlayer>(
      users.filter((user) => user.type === "player").map((user) => [user._id, user])
    );
    const curr = users.find((u) => u._id === socket.id);
    if (curr) {
      console.debug("setting current player", curr);
      setPlayer(curr);
    } else {
      console.debug("couldnt fnd");
    }
    setUsers(usersMap);
  };

  useEffect(() => {
    if (!isClient()) {
      console.debug('not client')
      socket.disconnect();
      // return;
    }

    s.on("connect", () => {
      console.debug("Connected to server");
      axios.get(`http${BASE_URL}/api/game`).then((res) => {
        const { turn, players } = res.data;
        console.debug("got game", res.data);
        handleUsers(players);
        setTurn(turn);
      });
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
      handleUsers(usersArray);
    });
  }, [socket]);

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
