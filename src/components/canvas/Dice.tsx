import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
// import orbit controls from @
import { useBox } from "@react-three/cannon";

interface Props {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function Dice({ position, rotation }: Props) {
  // const mesh = useRef<THREE.Mesh>(null!);
  const [ref, api] = useBox(() => ({
    mass: 2,
    position: position || [0, 5, 0],
    rotation: rotation || [0, 0, 0],
  }));

  const texture_1 = useLoader(TextureLoader, "textures/dice_1.jpg");
  const texture_2 = useLoader(TextureLoader, "textures/dice_2.jpg");
  const texture_3 = useLoader(TextureLoader, "textures/dice_3.jpg");
  const texture_4 = useLoader(TextureLoader, "textures/dice_4.jpg");
  const texture_5 = useLoader(TextureLoader, "textures/dice_5.jpg");
  const texture_6 = useLoader(TextureLoader, "textures/dice_6.jpg");

  return (
    <mesh ref={ref}>
      <boxBufferGeometry attach="geometry" />
      <meshToonMaterial map={texture_1} attachArray="material" />
      <meshToonMaterial map={texture_2} attachArray="material" />
      <meshToonMaterial map={texture_3} attachArray="material" />
      <meshToonMaterial map={texture_4} attachArray="material" />
      <meshToonMaterial map={texture_5} attachArray="material" />
      <meshToonMaterial map={texture_6} attachArray="material" />
    </mesh>
  );
}
