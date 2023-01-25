/*

--- Day 9: Marble Mania ---

You talk to the Elves while you wait for your navigation system to initialize. To pass the time, they introduce you to their favorite marble game.

The Elves play this game by taking turns arranging the marbles in a circle according to very particular rules. The marbles are numbered starting with 0 and increasing by 1 until every marble has a number.

First, the marble numbered 0 is placed in the circle. At this point, while it contains only a single marble, it is still a circle: the marble is both clockwise from itself and counter-clockwise from itself. This marble is designated the current marble.

Then, each Elf takes a turn placing the lowest-numbered remaining marble into the circle between the marbles that are 1 and 2 marbles clockwise of the current marble. (When the circle is large enough, this means that there is one marble between the marble that was just placed and the current marble.) The marble that was just placed then becomes the current marble.

However, if the marble that is about to be placed has a number which is a multiple of 23, something entirely different happens. First, the current player keeps the marble they would have placed, adding it to their score. In addition, the marble 7 marbles counter-clockwise from the current marble is removed from the circle and also added to the current player's score. The marble located immediately clockwise of the marble that was removed becomes the new current marble.

For example, suppose there are 9 players. After the marble with value 0 is placed in the middle, each player (shown in square brackets) takes a turn. The result of each of those turns would produce circles of marbles like this, where clockwise is to the right and the resulting current marble is in parentheses:

[-] (0)
[1]  0 (1)
[2]  0 (2) 1 
[3]  0  2  1 (3)
[4]  0 (4) 2  1  3 
[5]  0  4  2 (5) 1  3 
[6]  0  4  2  5  1 (6) 3 
[7]  0  4  2  5  1  6  3 (7)
[8]  0 (8) 4  2  5  1  6  3  7 
[9]  0  8  4 (9) 2  5  1  6  3  7 
[1]  0  8  4  9  2(10) 5  1  6  3  7 
[2]  0  8  4  9  2 10  5(11) 1  6  3  7 
[3]  0  8  4  9  2 10  5 11  1(12) 6  3  7 
[4]  0  8  4  9  2 10  5 11  1 12  6(13) 3  7 
[5]  0  8  4  9  2 10  5 11  1 12  6 13  3(14) 7 
[6]  0  8  4  9  2 10  5 11  1 12  6 13  3 14  7(15)
[7]  0(16) 8  4  9  2 10  5 11  1 12  6 13  3 14  7 15 
[8]  0 16  8(17) 4  9  2 10  5 11  1 12  6 13  3 14  7 15 
[9]  0 16  8 17  4(18) 9  2 10  5 11  1 12  6 13  3 14  7 15 
[1]  0 16  8 17  4 18  9(19) 2 10  5 11  1 12  6 13  3 14  7 15 
[2]  0 16  8 17  4 18  9 19  2(20)10  5 11  1 12  6 13  3 14  7 15 
[3]  0 16  8 17  4 18  9 19  2 20 10(21) 5 11  1 12  6 13  3 14  7 15 
[4]  0 16  8 17  4 18  9 19  2 20 10 21  5(22)11  1 12  6 13  3 14  7 15 
[5]  0 16  8 17  4 18(19) 2 20 10 21  5 22 11  1 12  6 13  3 14  7 15 
[6]  0 16  8 17  4 18 19  2(24)20 10 21  5 22 11  1 12  6 13  3 14  7 15 
[7]  0 16  8 17  4 18 19  2 24 20(25)10 21  5 22 11  1 12  6 13  3 14  7 15

The goal is to be the player with the highest score after the last marble is used up. Assuming the example above ends after the marble numbered 25, the winning score is 23+9=32 (because player 5 kept marble 23 and removed marble 9, while no other player got any points in this very short example game).

Here are a few more examples:

10 players; last marble is worth 1618 points: high score is 8317
13 players; last marble is worth 7999 points: high score is 146373
17 players; last marble is worth 1104 points: high score is 2764
21 players; last marble is worth 6111 points: high score is 54718
30 players; last marble is worth 5807 points: high score is 37305

What is the winning Elf's score?


--- Part Two ---

Amused by the speed of your answer, the Elves are curious:

What would the new winning Elf's score be if the number of the last marble were 100 times larger?

*/

const { Node } = require('./_classes');

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function marblesInCircularLinkedList (part, inputStr, DEBUG = false) {
  
  const split = inputStr.split(' ');
  const NUM_PLAYERS = +split[0];
  const LAST_MARBLE = +split[6] * (part === 1 ? 1               // PART 1: USE NUMBER FROM INPUT DATA
                                              : 100);           // PART 2: MULTIPLY THAT NUMBER BY 100

  const SCORES = Array(NUM_PLAYERS).fill(0);

  let node = new Node(0);
  node.next = node;
  node.prev = node;

  let currentPlayer = 0;

  const TIME_AT_START = Date.now();
  console.log('RUNNING ANALYSIS (PLEASE WAIT)...');

  for (let marble = 1; marble <= LAST_MARBLE; ++marble) {

    currentPlayer = (currentPlayer + 1) % NUM_PLAYERS;

    if (marble % 23 === 0) {

      SCORES[currentPlayer] += marble;

      for (let i = 0; i < 7; ++i) {
        node = node.prev;
      }

      SCORES[currentPlayer] += node.val;
      const nextNode = node.next;
      node.prev.next = node.next;
      node.next.prev = node.prev;
      node = nextNode;

    } else {

      const nextNode = node.next;
      const nextNextNode = node.next.next;
      const newNode = new Node(marble);

      nextNode.next = newNode;
      newNode.prev = nextNode;
      newNode.next = nextNextNode;
      nextNextNode.prev = newNode;

      node = newNode;

    }
  }

  if (DISPLAY_EXTRA_INFO) {
    console.log(SCORES);
  }

  console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
  return Math.max(...SCORES);
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = marblesInCircularLinkedList;
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
`9 players; last marble is worth 25 points`
);

const sampleInput2 = parseSampleInput(
`10 players; last marble is worth 1618 points`
);

const sampleInput3 = parseSampleInput(
`13 players; last marble is worth 7999 points`
);

const sampleInput4 = parseSampleInput(
`17 players; last marble is worth 1104 points`
);

const sampleInput5 = parseSampleInput(
`21 players; last marble is worth 6111 points`
);

const sampleInput6 = parseSampleInput(
`30 players; last marble is worth 5807 points`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 32;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 8317;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 146373;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = 2764;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: sampleInput5,
  DEBUG: true,
};
expected = 54718;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  inputStr: sampleInput6,
  DEBUG: true,
};
expected = 37305;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 405143;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 3411514667;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);