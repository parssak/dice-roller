import React from "react";
import { usePlane } from "@react-three/cannon";
import { ARENA_SIZE } from "../../utils/constants";

export default function Wall(props) {
  const [ref] = usePlane(() => ({ ...props }));
  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[ARENA_SIZE, 5]} />
      <meshPhongMaterial color="#47b5ff" />
    </mesh>
  );
}
