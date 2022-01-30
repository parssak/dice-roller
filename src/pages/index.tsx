import React, { useState, Suspense, useEffect, lazy } from "react";
import Game from "../components/canvas/Game";
import useGameState from "../hooks/useGame";
import { io } from "socket.io-client";
import LoginPanel from "../components/LoginPanel";
import isClient from "../utils/isClient";

const s = io("ws://192.168.2.29:5656");

export default function Home() {
  const { game } = useGameState();
  const [users, setUsers] = useState<Map<string, IPlayer>>(new Map());
  const [joined, setJoined] = useState(false);
  const [socket] = useState(s);

  useEffect(() => {
    if (!isClient()) {
      socket.disconnect();
      return;
    }
    console.debug(socket.id);
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    socket.on("users", (usersResponse) => {
      const usersArray = JSON.parse(usersResponse) as unknown as any[];

      const usersMap = new Map(
        usersArray.filter((user) => user.type === "player").map((user) => [user._id, user])
      );

      setUsers(usersMap);
    });
  }, []);

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
              .map((player, index) => (
                <div
                  key={index}
                  className={`
                bg-gray-100
                bg-opacity-40
                border-b-2
                ${index === 0 ? " border-blue-400 bg-blue-300 bg-opacity-40" : "border-gray-20"}
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
                  <p className="font-medium">{player.name}</p>
                  <p>{player.score}</p>
                </div>
              ))}
          </div>
        </div>
      </main>
    </>
  );
}
