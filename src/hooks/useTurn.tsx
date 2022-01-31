import { atom, useRecoilState } from "recoil";

const turnState = atom({
  key: "turnState",
  default: 0,
});

export default function useTurn() {
  const [turn, setTurn] = useRecoilState(turnState);
  return {
    turn,
    setTurn,
  };
}
