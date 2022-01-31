import { atom, useRecoilState } from "recoil";

const playerState = atom({
  key: "playerState",
  default: null as IPlayer | null,
});

export default function usePlayer() {
  const [player, setPlayer] = useRecoilState(playerState);

  return {
    player,
    setPlayer,
  };
}
