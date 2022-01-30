import React, { useRef, useState, Suspense, useEffect, lazy } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
// @ts-ignore
const Box = lazy(() => import("../components/canvas/Box"));

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  return (
    <>
      <main className="min-h-screen relative bg-green-50">
        {hasMounted && (
          <Canvas
            camera={{ position: [0, 0, 10] }}
            style={{
              position: "absolute",
              width: "100vw",
              height: "100vh",
            }}
          >
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <Box />
            </Suspense>
          </Canvas>
        )}
      </main>
    </>
  );
}
