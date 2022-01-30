import React, { lazy, Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Plane } from "./Plane";
import { OrbitControls } from "@react-three/drei";
import useGameState from "../../hooks/useGame";
import { RecoilRoot } from "recoil";
const Dice = lazy(() => import("./Dice"));

type Props = {};

export default function Game({}: Props) {
  const { game, setDiceRoll } = useGameState();
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
          <Physics gravity={[0, -20, 0]}>
            <Suspense fallback={null}>
              <Dice
                position={[5, 5, 0]}
                rotation={[Math.random(), Math.random(), Math.random()]}
                setRollResult={(val: number) => setDiceRoll(val, 0)}
              />
              <Dice
                rotation={[Math.random(), Math.random(), Math.random()]}
                setRollResult={(val: number) => setDiceRoll(val, 1)}
              />
              <Dice
                position={[-5, 5, 0]}
                rotation={[Math.random(), Math.random(), Math.random()]}
                setRollResult={(val: number) => setDiceRoll(val, 2)}
              />
            </Suspense>
            <Plane />
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
