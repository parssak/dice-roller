import { atom, useRecoilState } from "recoil";
import useTurn from "./useTurn";

const dice1State = atom({
  key: "dice1State",
  default: {
    value: -1,
    lastUpdated: 0,
    updatedForTurn: -1,
  },
});

const dice2State = atom({
  key: "dice2State",
  default: {
    value: -1,
    lastUpdated: 0,
    updatedForTurn: -1,
  },
});

const dice3State = atom({
  key: "dice3State",
  default: {
    value: -1,
    lastUpdated: 0,
    updatedForTurn: -1,
  },
});

const gameState = atom({
  key: "gameState",
  default: {
    // dice: [
    //   {
    //     value: -1,
    //     lastUpdated: 0,
    //     updatedForTurn: -1,
    //   },
    //   {
    //     value: -1,
    //     lastUpdated: 0,
    //     updatedForTurn: -1,
    //   },
    //   {
    //     value: -1,
    //     lastUpdated: 0,
    //     updatedForTurn: -1,
    //   },
    // ],
    lastDiceChange: 0,
  },
  dangerouslyAllowMutability: true,
});

export default function useGameState() {
  // set game
  const [game, setGame] = useRecoilState(gameState);
  const [dice1, setDice1] = useRecoilState(dice1State);
  const [dice2, setDice2] = useRecoilState(dice2State);
  const [dice3, setDice3] = useRecoilState(dice3State);
  const { turn } = useTurn();

  const setDiceRoll = (value: number, index: number) => {
    const dice = [dice1, dice2, dice3];
    if (value === dice[index].value) return;
    const newDice = { ...dice[index] };
    newDice.value = value;
    newDice.lastUpdated = Date.now();
    newDice.updatedForTurn = turn;
    if (index === 0) {
      setDice1(newDice);
    } else if (index === 1) {
      setDice2(newDice);
    } else if (index === 2) {
      setDice3(newDice);
    }

    setGame({ ...game, lastDiceChange: Date.now() });
  };

  const getDice = () => [dice1, dice2, dice3];

  return {
    game,
    setDiceRoll,
    getDice,
  };
}
