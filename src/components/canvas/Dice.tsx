import React, { useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import { useBox } from "@react-three/cannon";
import * as THREE from "three";

interface Props {
  setRollResult: (value: number) => void;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function Dice({ position = [0, 5, 0], rotation = [0, 0, 0], setRollResult }: Props) {
  const [lastStoppedTime, setLastStoppedTime] = useState(0);
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

  const roll = () => {
    interface RollPayload {
      position: [number, number, number];
      rotation: [number, number, number];
      localImpulse: [number, number, number];
      localImpulsePoint: [number, number, number];
      torque: [number, number, number];
    }

    api.position.set(position[0], position[1], position[2]);
    api.rotation.set(Math.random(), Math.random(), Math.random());

    const magnitude = 30;
    const torqueMagnitude = 200;

    api.applyLocalImpulse(
      [
        Math.random() * magnitude - magnitude / 2,
        Math.random() * magnitude - magnitude / 2,
        Math.random() * magnitude - magnitude / 2,
      ],
      [Math.random() / 2, Math.random() / 2, Math.random() / 2]
    );
    api.applyTorque([
      torqueMagnitude * Math.random() - torqueMagnitude / 2,
      torqueMagnitude * Math.random() - torqueMagnitude / 2,
      torqueMagnitude * Math.random() - torqueMagnitude / 2,
    ]);
  };

  const hasStopped = () => {
    const v = velocity.current;
    return (
      Math.round(v[0] * 100) === 0 && Math.round(v[1] * 100) === 0 && Math.round(v[2] * 100) === 0
    );
  };

  useFrame(({ clock }) => {
    if (!hasStopped() || clock.elapsedTime < 1) return;
    if (clock.elapsedTime - lastStoppedTime > 0 && clock.elapsedTime - lastStoppedTime < 0.5)
      setRollResult(getRollResult());
    if (clock.elapsedTime - lastStoppedTime > 1) {
      setLastStoppedTime(clock.elapsedTime);
    }
  });

  // add an event listener to roll() when spacebar is pressed
  useEffect(() => {
    const rollOnClick = () => {
      roll();
    };
    window.addEventListener("keydown", rollOnClick);
    return () => {
      window.removeEventListener("keydown", rollOnClick);
    };
  }, []);

  return (
    <mesh
      ref={ref}
      onClick={(e) => {
        roll();
      }}
    >
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
