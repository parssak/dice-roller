import { atom, useRecoilState } from "recoil";

const playerState = atom({
  key: "playerState",
  default: {
    _id: "__error__",
    name: "",
    type: "unset",
    score: 0,
    turn_index: 0,
  } as IPlayer | null,
});

export default function usePlayer() {
  const [player, setPlayer] = useRecoilState(playerState);

  return {
    player,
    setPlayer,
  };
}
