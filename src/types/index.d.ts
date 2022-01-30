interface IPlayer {
  name: string;
  score: number;
}

interface RollPayload {
  position: [number, number, number];
  rotation: [number, number, number];
  localImpulse: [number, number, number];
  localImpulsePoint: [number, number, number];
  torque: [number, number, number];
}