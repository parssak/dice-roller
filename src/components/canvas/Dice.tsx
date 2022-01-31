import React, { useEffect, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import { useBox } from "@react-three/cannon";
import * as THREE from "three";
import { Socket } from "socket.io-client";
import useGameState from "../../hooks/useGame";

interface Props {
  setRollResult: (value: number) => void;
  index: number;
  socket: Socket;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function Dice({
  setRollResult,
  index,
  socket,
  position = [0, 5, 0],
  rotation = [0, 0, 0],
}: Props) {
  const { getDice, setDiceRoll } = useGameState();
  const [ref, api] = useBox(() => ({
    mass: 2,
    position: position,
    rotation: rotation,
  }));

  const velocity = useRef([0, 0, 0]);
  const quaternion = useRef([0, 0, 0, 0]);

  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => (velocity.current = v));
    const unsubscribe2 = api.quaternion.subscribe((q) => (quaternion.current = q));
    return () => {
      unsubscribe();
      unsubscribe2();
    };
  }, []);

  useEffect(() => {
    socket.on("roll", (rolls: RollPayload[]) => {
      setDiceRoll(-1, 0);
      setDiceRoll(-1, 1);
      setDiceRoll(-1, 2);
      roll(rolls[index]);
    });
  }, []);

  const texture_1 = useLoader(TextureLoader, "textures/dice_1.jpg");
  const texture_2 = useLoader(TextureLoader, "textures/dice_2.jpg");
  const texture_3 = useLoader(TextureLoader, "textures/dice_3.jpg");
  const texture_4 = useLoader(TextureLoader, "textures/dice_4.jpg");
  const texture_5 = useLoader(TextureLoader, "textures/dice_5.jpg");
  const texture_6 = useLoader(TextureLoader, "textures/dice_6.jpg");

  const rad2deg = (rad: number) => (rad * 180) / Math.PI;

  const getRollResult = () => {
    const [x, y, z, w] = quaternion.current;
    const q = new THREE.Quaternion(x, y, z, w);
    const euler = new THREE.Euler();
    euler.setFromQuaternion(q, "YXZ");
    const roll = Math.floor(rad2deg(euler.x));
    const yaw = Math.floor(rad2deg(euler.z));
    if (roll > 0) {
      return 6;
    }
    if (roll <= -90) {
      return 5;
    }
    if (yaw > 80 && yaw < 100) {
      return 1;
    }
    if (yaw <= -80 && yaw > -100) {
      return 2;
    }
    if (yaw <= -170 && yaw > -190) {
      return 4;
    }
    return 3;
  };

  const roll = (rollPayload: RollPayload) => {
    api.position.set(rollPayload.position[0], rollPayload.position[1], rollPayload.position[2]);
    api.rotation.set(rollPayload.rotation[0], rollPayload.rotation[1], rollPayload.rotation[2]);
    api.applyLocalImpulse(rollPayload.localImpulse, rollPayload.localImpulsePoint);
    api.applyTorque(rollPayload.torque);
  };

  const hasStopped = () => {
    const v = velocity.current;
    const vVector = new THREE.Vector3(v[0], v[1], v[2]);
    return vVector.length() < 0.0006;
  };

  useFrame(({ clock }) => {
    if (!hasStopped() || clock.elapsedTime < 1) {
      return;
    }
    const result = getRollResult();
    if (result !== getDice()[index].value) {
      setRollResult(getRollResult());
    }
  });

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
