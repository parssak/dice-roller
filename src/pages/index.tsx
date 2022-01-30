import React, { useState, Suspense, useEffect, lazy } from "react";
import Game from "../components/canvas/Game";
import useGameState from "../hooks/useGame";

interface IPlayer {
  name: string;
  score: number;
}

export default function Home() {
  const { game } = useGameState();
  const [players, setPlayers] = useState<IPlayer[]>([
    {
      name: "Player 1",
      score: 0,
    },
    {
      name: "Player 2",
      score: 0,
    },
    {
      name: "Player 3",
      score: 0,
    },
    {
      name: "Player 4",
      score: 0,
    },
  ]);
  return (
    <>
      <main className="min-h-screen relative bg-green-50">
        <Game />
        <div className="absolute inset-0 pointer-events-none">
          <div className="container">
            <p className="font-bold text-center text-6xl mt-24">
              {game.dice[0].value} {game.dice[1].value} {game.dice[2].value}
            </p>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none p-4">
          <div className="max-w-xs space-y-2">
            {players.map((player, index) => (
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
                  // @ts-ignore
                  backDropFilter: "blur(10px)",
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
