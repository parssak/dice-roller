import { usePlane } from "@react-three/cannon";
import { ARENA_SIZE } from "../../utils/constants";

export function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[ARENA_SIZE, ARENA_SIZE]} />
      <meshPhongMaterial color="tomato" />
    </mesh>
  );
}
