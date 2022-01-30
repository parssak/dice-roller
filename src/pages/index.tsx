import React, { useState, Suspense, useEffect, lazy } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Plane } from "../components/canvas/Plane";
import { OrbitControls } from "@react-three/drei";
const Dice = lazy(() => import("../components/canvas/Dice"));

export default function Home() {
  return (
    <>
      <main className="min-h-screen relative bg-green-50">
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
          <OrbitControls enablePan={false} />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Physics>
            <Suspense fallback={null}>
              <Dice rotation={[Math.random(), Math.random(), Math.random()]} />
              <Dice position={[5, 5, 0]} rotation={[Math.random(), Math.random(), Math.random()]} />
              <Dice
                position={[-5, 5, 0]}
                rotation={[Math.random(), Math.random(), Math.random()]}
              />
            </Suspense>
            <Plane />
          </Physics>
        </Canvas>
      </main>
    </>
  );
}
