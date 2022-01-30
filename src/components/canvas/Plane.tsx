import { usePlane } from "@react-three/cannon";

export function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[40, 40]} />
      <meshPhongMaterial color="tomato" />
    </mesh>
  );
}
