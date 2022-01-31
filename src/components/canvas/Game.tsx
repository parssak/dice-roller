import React, { lazy, Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Plane } from "./Plane";
import { OrbitControls } from "@react-three/drei";
import { RecoilRoot } from "recoil";
import { Socket } from "socket.io-client";
import useGameState from "../../hooks/useGame";
import Wall from "./Wall";
import { ARENA_SIZE } from "../../utils/constants";
import useTurn from "../../hooks/useTurn";
import usePlayer from "../../hooks/usePlayer";
const Dice = lazy(() => import("./Dice"));

type Props = {
  socket: Socket;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Game({ socket }: Props) {
  const { game, setDiceRoll } = useGameState();
  const { turn, setTurn } = useTurn();
  const { player } = usePlayer();

  const sendDiceResult = async () => {
    await sleep(1000);
    if (
      game.dice[0].updatedForTurn === turn &&
      game.dice[1].updatedForTurn === turn &&
      game.dice[2].updatedForTurn === turn &&
      player?.turn_index === turn
    )
      socket.emit("roll-result", {
        roll: [game.dice[0].value, game.dice[1].value, game.dice[2].value],
        turn,
        player,
      });
  };
  useEffect(() => {
    if (
      game.dice[0].updatedForTurn === turn &&
      game.dice[1].updatedForTurn === turn &&
      game.dice[2].updatedForTurn === turn &&
      player?.turn_index === turn
    ) {
      sendDiceResult();
    }
  }, [game.dice, game.lastDiceChange, turn, player]);

  const handleDiceRoll = () => {
    const magnitude = 30;
    const torqueMagnitude = 200;

    const getRollPayload = (position: [number, number, number]): RollPayload => {
      return {
        position,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        localImpulse: [
          Math.random() * magnitude - magnitude / 2,
          Math.random() * magnitude - magnitude / 2,
          Math.random() * magnitude - magnitude / 2,
        ],
        localImpulsePoint: [Math.random() / 2, Math.random() / 2, Math.random() / 2],
        torque: [
          torqueMagnitude * Math.random() - torqueMagnitude / 2,
          torqueMagnitude * Math.random() - torqueMagnitude / 2,
          torqueMagnitude * Math.random() - torqueMagnitude / 2,
        ],
      };
    };

    const dice_one: RollPayload = getRollPayload([5, 5, 0]);
    const dice_two: RollPayload = getRollPayload([0, 5, 0]);
    const dice_three: RollPayload = getRollPayload([-5, 5, 0]);

    socket.emit("roll", [dice_one, dice_two, dice_three]);
  };

  useEffect(() => {
    const rollOnClick = (e: KeyboardEvent) => {
      if (e.key === " " && player.turn_index === turn) {
        handleDiceRoll();
      }
    };
    window.addEventListener("keydown", rollOnClick);
    return () => {
      window.removeEventListener("keydown", rollOnClick);
    };
  }, [player, turn]);

  return (
    <>
      <Canvas
        camera={{
          position: [0, 15, 0],
        }}
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
        }}
      >
        <RecoilRoot>
          <OrbitControls enablePan={false} />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Physics gravity={[0, -20, 0]} size={10} iterations={10}>
            <Suspense fallback={null}>
              <Dice
                position={[5, 5, 0]}
                setRollResult={(val: number) => setDiceRoll(val, 0)}
                index={0}
                socket={socket}
              />
              <Dice
                position={[0, 5, 0]}
                setRollResult={(val: number) => setDiceRoll(val, 1)}
                index={1}
                socket={socket}
              />
              <Dice
                position={[-5, 5, 0]}
                setRollResult={(val: number) => setDiceRoll(val, 2)}
                index={2}
                socket={socket}
              />
            </Suspense>
            <Plane />
            <Wall position={[0, 0, -(ARENA_SIZE / 2)]} />
            <Wall position={[0, 0, ARENA_SIZE / 2]} rotation={[0, Math.PI, 0]} />
            <Wall position={[ARENA_SIZE / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
            <Wall position={[-ARENA_SIZE / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
          </Physics>
        </RecoilRoot>
      </Canvas>
      <div className="absolute inset-0 pointer-events-none">
        <div className="container">
          <p className="font-bold text-center text-6xl mt-24">
            {game.dice[0].value} {game.dice[1].value} {game.dice[2].value}
          </p>
        </div>
      </div>
    </>
  );
}
