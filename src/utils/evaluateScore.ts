export default function evaluateScore(dice: [number, number, number]) {
  const diceCopy = [...dice].sort();
  const [first, second, third] = diceCopy;

  const score = [0, 0, 0]; // tier, mantissa1, mantissa2

  // sequentials: [1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6]
  if (first == second - 1 && second == third - 1) {
    score[0] = 3;
    score[1] = third;
    score[2] = third;
  } else if (first == second && second == third) {
    // triples: [1, 1, 1], [2, 2, 2], [3, 3, 3], [4, 4, 4], [5, 5, 5], [6, 6, 6]
    score[0] = 2;
    score[1] = first;
    score[2] = first;
  }
  // doubles: [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]
  else if (first == second || second == third) {
    score[0] = 1;
    score[1] = second; // middle value
    score[2] = first > second ? first : second; // highest value
  } else {
    score[0] = 0;
    score[1] = third;
    score[2] = second;
  }

  return score;
}

export const compareScores = (a: [number, number, number], b: [number, number, number]) => {
  for (let i = 0; i < 3; i++) {
    if (a[i] > b[i]) return 1;
    if (a[i] < b[i]) return -1;
  }
  return 0;
};
