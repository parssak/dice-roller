import { atom, useRecoilState } from "recoil";
import useTurn from "./useTurn";

export const gameState = atom({
  key: "gameState",
  default: {
    dice: [
      {
        value: -1,
        lastUpdated: 0,
        updatedForTurn: -1,
      },
      {
        value: -1,
        lastUpdated: 0,
        updatedForTurn: -1,
      },
      {
        value: -1,
        lastUpdated: 0,
        updatedForTurn: -1,
      },
    ],
    lastDiceChange: 0,
  },
  dangerouslyAllowMutability: true,
});

export default function useGameState() {
  // set game
  const [game, setGame] = useRecoilState(gameState);
  const { turn, setTurn } = useTurn();

  const setDiceRoll = (value: number, index: number) => {
    if (game.dice[index].lastUpdated + 2000 > Date.now()) return;
    if (value === game.dice[index].value) return;

    let newDice = [
      {
        value: game.dice[0].value,
        lastUpdated: game.dice[0].lastUpdated,
        updatedForTurn: game.dice[0].updatedForTurn,
      },
      {
        value: game.dice[1].value,
        lastUpdated: game.dice[1].lastUpdated,
        updatedForTurn: game.dice[1].updatedForTurn,
      },
      {
        value: game.dice[2].value,
        lastUpdated: game.dice[2].lastUpdated,
        updatedForTurn: game.dice[2].updatedForTurn,
      },
    ];

    newDice[index].value = value;
    newDice[index].lastUpdated = Date.now();
    newDice[index].updatedForTurn = turn;
    setGame({ ...game, dice: newDice, lastDiceChange: Date.now() });
  };

  return {
    game,
    setDiceRoll,
  };
}
