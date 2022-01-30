import { atom, useRecoilState } from "recoil";

export const gameState = atom({
  key: "gameState",
  default: {
    dice: [
      {
        value: -1,
        lastUpdated: 0,
      },
      {
        value: -1,
        lastUpdated: 0,
      },
      {
        value: -1,
        lastUpdated: 0,
      },
    ],
    score: 0,
    rolls: 0,
  },
  dangerouslyAllowMutability: true,
});

export default function useGameState() {
  // set game
  const [game, setGame] = useRecoilState(gameState);

  const setDiceRoll = (value: number, index: number) => {
    if (game.dice[index].lastUpdated + 2000 > Date.now()) return;
    const newDice = [
      {
        value: game.dice[0].value,
        lastUpdated: game.dice[0].lastUpdated,
      },
      {
        value: game.dice[1].value,
        lastUpdated: game.dice[1].lastUpdated,
      },
      {
        value: game.dice[2].value,
        lastUpdated: game.dice[2].lastUpdated,
      },
    ];
    newDice[index].value = value;
    newDice[index].lastUpdated = Date.now();
    setGame({ ...game, dice: newDice });
  };

  const setScore = (score: number) => {
    setGame({ ...game, score: score });
  };

  const setRolls = (rolls: number) => {
    setGame({ ...game, rolls: rolls });
  };

  return {
    game,
    setDiceRoll,
    setScore,
    setRolls,
  };
}
