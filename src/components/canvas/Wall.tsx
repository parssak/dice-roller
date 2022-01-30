import React from "react";
import { usePlane } from "@react-three/cannon";

export default function Wall(props) {
  const [ref] = usePlane(() => ({ ...props }));
  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[40, 5]} />
      <meshPhongMaterial color="#47b5ff" />
    </mesh>
  );
}
