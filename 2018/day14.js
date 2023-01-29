/*

--- Day 14: Chocolate Charts ---

You finally have a chance to look at all of the produce moving around. Chocolate, cinnamon, mint, chili peppers, nutmeg, vanilla... the Elves must be growing these plants to make hot chocolate! As you realize this, you hear a conversation in the distance. When you go to investigate, you discover two Elves in what appears to be a makeshift underground kitchen/laboratory.

The Elves are trying to come up with the ultimate hot chocolate recipe; they're even maintaining a scoreboard which tracks the quality score (0-9) of each recipe.

Only two recipes are on the board: the first recipe got a score of 3, the second, 7. Each of the two Elves has a current recipe: the first Elf starts with the first recipe, and the second Elf starts with the second recipe.

To create new recipes, the two Elves combine their current recipes. This creates new recipes from the digits of the sum of the current recipes' scores. With the current recipes' scores of 3 and 7, their sum is 10, and so two new recipes would be created: the first with score 1 and the second with score 0. If the current recipes' scores were 2 and 3, the sum, 5, would only create one recipe (with a score of 5) with its single digit.

The new recipes are added to the end of the scoreboard in the order they are created. So, after the first round, the scoreboard is 3, 7, 1, 0.

After all new recipes are added to the scoreboard, each Elf picks a new current recipe. To do this, the Elf steps forward through the scoreboard a number of recipes equal to 1 plus the score of their current recipe. So, after the first round, the first Elf moves forward 1 + 3 = 4 times, while the second Elf moves forward 1 + 7 = 8 times. If they run out of recipes, they loop back around to the beginning. After the first round, both Elves happen to loop around until they land on the same recipe that they had in the beginning; in general, they will move to different recipes.

Drawing the first Elf as parentheses and the second Elf as square brackets, they continue this process:

(3)[7]
(3)[7] 1  0 
 3  7  1 [0](1) 0 
 3  7  1  0 [1] 0 (1)
(3) 7  1  0  1  0 [1] 2 
 3  7  1  0 (1) 0  1  2 [4]
 3  7  1 [0] 1  0 (1) 2  4  5 
 3  7  1  0 [1] 0  1  2 (4) 5  1 
 3 (7) 1  0  1  0 [1] 2  4  5  1  5 
 3  7  1  0  1  0  1  2 [4](5) 1  5  8 
 3 (7) 1  0  1  0  1  2  4  5  1  5  8 [9]
 3  7  1  0  1  0  1 [2] 4 (5) 1  5  8  9  1  6 
 3  7  1  0  1  0  1  2  4  5 [1] 5  8  9  1 (6) 7 
 3  7  1  0 (1) 0  1  2  4  5  1  5 [8] 9  1  6  7  7 
 3  7 [1] 0  1  0 (1) 2  4  5  1  5  8  9  1  6  7  7  9 
 3  7  1  0 [1] 0  1  2 (4) 5  1  5  8  9  1  6  7  7  9  2 

The Elves think their skill will improve after making a few recipes (your puzzle input). However, that could take ages; you can speed this up considerably by identifying the scores of the ten recipes after that. For example:

If the Elves think their skill will improve after making 9 recipes, the scores of the ten recipes after the first nine on the scoreboard would be 5158916779 (highlighted in the last line of the diagram).
After 5 recipes, the scores of the next ten would be 0124515891.
After 18 recipes, the scores of the next ten would be 9251071085.
After 2018 recipes, the scores of the next ten would be 5941429882.

What are the scores of the ten recipes immediately after the number of recipes in your puzzle input?


--- Part Two ---

As it turns out, you got the Elves' plan backwards. They actually want to know how many recipes appear on the scoreboard to the left of the first recipes whose scores are the digits from your puzzle input.

51589 first appears after 9 recipes.
01245 first appears after 5 recipes.
92510 first appears after 18 recipes.
59414 first appears after 2018 recipes.

How many recipes appear on the scoreboard to the left of the score sequence in your puzzle input?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function analyzeGrowingSequence (part, inputStr, DEBUG = false) {
  
  // CONSTANTS
  const NUM_ROUNDS = +inputStr;
  const GOAL_SEQUENCE = inputStr;
  
  // DATA STRUCTURES
  const RECIPES = [ 3, 7 ];

  // INIT
  let [ elf1Idx, elf2Idx ] = [ 0, 1 ];

  // ANALYZE
  const TIME_AT_START = Date.now();
  if (part === 2) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');

  while ( part === 1  ? RECIPES.length < NUM_ROUNDS + 10                                      // PART 1: STOP WHEN YOU HAVE ENOUGH RECIPES EQUAL TO
                                                                                              // NUMBER OF ROUNDS + 10 (YOU LOOK AT THE NEXT 10 NUMBERS)

                      : !RECIPES.slice(-GOAL_SEQUENCE.length - 1)                             // PART 2: STOP WHEN SOMEWHERE IN YOUR RECIPES YOU FIND
                                .join('')                                                     // THE GOAL SEQUENCE
                                .includes(GOAL_SEQUENCE)                              
  ) {

    // CALCULATE SCORE FOR NEW RECIPE(S)
    const elf1Score = RECIPES[elf1Idx];
    const elf2Score = RECIPES[elf2Idx];
    const sum = elf1Score + elf2Score;
    const tens = sum >= 10 ? 1 : 0;
    const ones = sum % 10;

    // ADD NEW RECIPE(S) TO THE LIST
    if (tens) RECIPES.push(tens);
    RECIPES.push(ones);

    // MOVE ELF INDICES
    elf1Idx = (elf1Idx + elf1Score + 1) % RECIPES.length;
    elf2Idx = (elf2Idx + elf2Score + 1) % RECIPES.length;

    if (DISPLAY_EXTRA_INFO && DEBUG) {
      console.log(`elf1Idx: ${elf1Idx}, elf2Idx: ${elf2Idx} |`, RECIPES.join(' '));
    }

  }

  if (part === 2) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);

  return part === 1 ? RECIPES.slice(NUM_ROUNDS, NUM_ROUNDS + 10).join('')                     // PART 1: SLICE THE 10 NUMBERS AFTER NUMBER OF ROUNDS
                    : RECIPES.join('').indexOf(GOAL_SEQUENCE);                                // PART 2: FIND NUMBER OF POSITIONS LEFT OF THE GOAL SEQUENCE
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = analyzeGrowingSequence;
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
`9`
);

const sampleInput2 = parseSampleInput(
`5`
);

const sampleInput3 = parseSampleInput(
`18`
);

const sampleInput4 = parseSampleInput(
`2018`
);

const sampleInput5 = parseSampleInput(
`51589`
);

const sampleInput6 = parseSampleInput(
`01245`
);

const sampleInput7 = parseSampleInput(
`92510`
);

const sampleInput8 = parseSampleInput(
`59414`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = '5158916779';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = '0124515891';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = '9251071085';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInput4,
  // DEBUG: true,
  DEBUG: false,
};
expected = '5941429882';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: actualInput,
};
expected = '3147574107';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  inputStr: sampleInput5,
  DEBUG: true,
};
expected = 9;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  inputStr: sampleInput6,
  DEBUG: true,
};
expected = 5;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  inputStr: sampleInput7,
  DEBUG: true,
};
expected = 18;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 9
input = {
  part: 2,
  inputStr: sampleInput8,
  // DEBUG: true,
  DEBUG: false,
};
expected = 2018;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 10
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 20280190;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);