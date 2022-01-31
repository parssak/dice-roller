interface IPlayer {
  _id: string;
  name: string;
  type: "player" | "house" | "unset";
  score: 0;
  turn_index: number;
}

interface RollPayload {
  position: [number, number, number];
  rotation: [number, number, number];
  localImpulse: [number, number, number];
  localImpulsePoint: [number, number, number];
  torque: [number, number, number];
}