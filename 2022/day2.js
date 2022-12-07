/*

--- Day 2: Rock Paper Scissors ---

The Elves begin to set up camp on the beach. To decide whose tent gets to be closest to the snack storage, a giant Rock Paper Scissors tournament is already in progress.

Rock Paper Scissors is a game between two players. Each game contains many rounds; in each round, the players each simultaneously choose one of Rock, Paper, or Scissors using a hand shape. Then, a winner for that round is selected: Rock defeats Scissors, Scissors defeats Paper, and Paper defeats Rock. If both players choose the same shape, the round instead ends in a draw.

Appreciative of your help yesterday, one Elf gives you an encrypted strategy guide (your puzzle input) that they say will be sure to help you win. "The first column is what your opponent is going to play: A for Rock, B for Paper, and C for Scissors. The second column--" Suddenly, the Elf is called away to help with someone's tent.

The second column, you reason, must be what you should play in response: X for Rock, Y for Paper, and Z for Scissors. Winning every time would be suspicious, so the responses must have been carefully chosen.

The winner of the whole tournament is the player with the highest score. Your total score is the sum of your scores for each round. The score for a single round is the score for the shape you selected (1 for Rock, 2 for Paper, and 3 for Scissors) plus the score for the outcome of the round (0 if you lost, 3 if the round was a draw, and 6 if you won).

Since you can't be sure if the Elf is trying to help you or trick you, you should calculate the score you would get if you were to follow the strategy guide.

For example, suppose you were given the following strategy guide:

A Y
B X
C Z

This strategy guide predicts and recommends the following:

In the first round, your opponent will choose Rock (A), and you should choose Paper (Y). This ends in a win for you with a score of 8 (2 because you chose Paper + 6 because you won).
In the second round, your opponent will choose Paper (B), and you should choose Rock (X). This ends in a loss for you with a score of 1 (1 + 0).
The third round is a draw with both players choosing Scissors, giving you a score of 3 + 3 = 6.
In this example, if you were to follow the strategy guide, you would get a total score of 15 (8 + 1 + 6).

What would your total score be if everything goes exactly according to your strategy guide?


--- Part Two ---

The Elf finishes helping with the tent and sneaks back over to you. "Anyway, the second column says how the round needs to end: X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win. Good luck!"

The total score is still calculated in the same way, but now you need to figure out what shape to choose so the round ends as indicated. The example above now goes like this:

In the first round, your opponent will choose Rock (A), and you need the round to end in a draw (Y), so you also choose Rock. This gives you a score of 1 + 3 = 4.
In the second round, your opponent will choose Paper (B), and you choose Rock so you lose (X) with a score of 1 + 0 = 1.
In the third round, you will defeat your opponent's Scissors with Rock for a score of 1 + 6 = 7.
Now that you're correctly decrypting the ultra top secret strategy guide, you would get a total score of 12.

Following the Elf's instructions for the second column, what would your total score be if everything goes exactly according to your strategy guide?

*/

function rockPaperScissors (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  // if (DEBUG) {
  //   console.log(inputArr[0]);
  //   // console.log(inputArr[1]);
  // }

  // // ===== SOLUTION 1: TRY TO WRITE CODE IN A SOMEWHAT MODULAR, READABLE WAY

  // const REF = {
  //   'rock': { points: 1, beats: 'scissors', losesTo: 'paper' },
  //   'paper': { points: 2, beats: 'rock', losesTo: 'scissors' },
  //   'scissors': { points: 3, beats: 'paper', losesTo: 'rock' },
  // };

  // const OPPONENT = {
  //   'A': 'rock',
  //   'B': 'paper',
  //   'C': 'scissors',
  // };

  // const RESULTS = {
  //   'win': 6,
  //   'tie': 3,
  //   'lose': 0,
  // };
  
  // let score = 0;
  // for (const line of inputArr) {
  //   const opponentMove = OPPONENT[line[0]];
  //   const you = line[2];

  //   if (part === 1) {

  //     const PART1 = {
  //       'X': 'rock',
  //       'Y': 'paper',
  //       'Z': 'scissors',
  //     };

  //     const yourMove = PART1[you];
  //     score += REF[yourMove].points;                                                      // add points from shape
  //     if (opponentMove === yourMove) score += RESULTS.tie;                                // then add points from result
  //     else if (opponentMove === REF[yourMove].beats) score += RESULTS.win;
  //     else if (opponentMove === REF[yourMove].losesTo) score += RESULTS.lose;
  //     else throw 'ERROR!';

  //   } else {

  //     const PART2 = {
  //       'X': 'lose',
  //       'Y': 'tie',
  //       'Z': 'win',
  //     };

  //     const yourResult = PART2[you];
  //     score += RESULTS[yourResult];                                                       // add points from result
  //     if (yourResult === 'win') score += REF[REF[opponentMove].losesTo].points;           // then add points from shape
  //     else if (yourResult === 'lose') score += REF[REF[opponentMove].beats].points;
  //     else if (yourResult === 'tie') score += REF[opponentMove].points;
  //     else throw 'ERROR!';

  //   }
  // }

  // return score;

  // ===== SOLUTION 2: HARD CODE EVERYTHING

  let score = 0;
  for (const line of inputArr) {
    if (part === 1) {               // PART 1: X/Y/Z REPRESENT ROCK/PAPER/SCISSORS
      switch (line) {
        case 'A X':
          score += 1 + 3;
          break;
        case 'A Y':
          score += 2 + 6;
          break;
        case 'A Z':
          score += 3 + 0;
          break;
        case 'B X':
          score += 1 + 0;
          break;
        case 'B Y':
          score += 2 + 3;
          break;
        case 'B Z':
          score += 3 + 6;
          break;
        case 'C X':
          score += 1 + 6;
          break;
        case 'C Y':
          score += 2 + 0;
          break;
        case 'C Z':
          score += 3 + 3;
          break;
      }
    } else {                        // PART 2: X/Y/Z REPRESENT LOSE/TIE/WIN FOR YOU
      switch (line) {
        case 'A X':
          score += 3 + 0;
          break;
        case 'A Y':
          score += 1 + 3;
          break;
        case 'A Z':
          score += 2 + 6;
          break;
        case 'B X':
          score += 1 + 0;
          break;
        case 'B Y':
          score += 2 + 3;
          break;
        case 'B Z':
          score += 3 + 6;
          break;
        case 'C X':
          score += 2 + 0;
          break;
        case 'C Y':
          score += 3 + 3;
          break;
        case 'C Z':
          score += 1 + 6;
          break;
      }
    }
  }
  return score;

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = rockPaperScissors;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const skippedTests = new Set([  ]);
const lowestTest = 0;
const highestTest = 0;

const fs = require('fs');
const path = require('path');
const DAY_NUM = __filename.split('.js')[0].split('day')[1];
const INPUT_PATH = path.join(__dirname, `day${DAY_NUM}-input.txt`);
const actualInput = fs.readFileSync(INPUT_PATH, 'utf8');
const parseSampleInput = s => s.split('').map(c => c === '\n' ? '\r\n' : c).join('');

const sampleInput = parseSampleInput(
`A Y
B X
C Z`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 15;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 12855;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 12;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 13726;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);