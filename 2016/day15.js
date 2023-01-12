/*

--- Day 15: Timing is Everything ---

The halls open into an interior plaza containing a large kinetic sculpture. The sculpture is in a sealed enclosure and seems to involve a set of identical spherical capsules that are carried to the top and allowed to bounce through the maze of spinning pieces.

Part of the sculpture is even interactive! When a button is pressed, a capsule is dropped and tries to fall through slots in a set of rotating discs to finally go through a little hole at the bottom and come out of the sculpture. If any of the slots aren't aligned with the capsule as it passes, the capsule bounces off the disc and soars away. You feel compelled to get one of those capsules.

The discs pause their motion each second and come in different sizes; they seem to each have a fixed number of positions at which they stop. You decide to call the position with the slot 0, and count up for each position it reaches next.

Furthermore, the discs are spaced out so that after you push the button, one second elapses before the first disc is reached, and one second elapses as the capsule passes from one disc to the one below it. So, if you push the button at time=100, then the capsule reaches the top disc at time=101, the second disc at time=102, the third disc at time=103, and so on.

The button will only drop a capsule at an integer time - no fractional seconds allowed.

For example, at time=0, suppose you see the following arrangement:

Disc #1 has 5 positions; at time=0, it is at position 4.
Disc #2 has 2 positions; at time=0, it is at position 1.

If you press the button exactly at time=0, the capsule would start to fall; it would reach the first disc at time=1. Since the first disc was at position 4 at time=0, by time=1 it has ticked one position forward. As a five-position disc, the next position is 0, and the capsule falls through the slot.

Then, at time=2, the capsule reaches the second disc. The second disc has ticked forward two positions at this point: it started at position 1, then continued to position 0, and finally ended up at position 1 again. Because there's only a slot at position 0, the capsule bounces away.

If, however, you wait until time=5 to push the button, then when the capsule reaches each disc, the first disc will have ticked forward 5+1 = 6 times (to position 0), and the second disc will have ticked forward 5+2 = 7 times (also to position 0). In this case, the capsule would fall through the discs and come out of the machine.

However, your situation has more than two discs; you've noted their positions in your puzzle input. What is the first time you can press the button to get a capsule?


--- Part Two ---

After getting the first capsule (it contained a star! what great fortune!), the machine detects your success and begins to rearrange itself.

When it's done, the discs are back in their original configuration as if it were time=0 again, but a new disc with 11 positions and starting at position 0 has appeared exactly one second below the previously-bottom disc.

With this new disc, and counting again starting from time=0 with the configuration in your puzzle input, what is the first time you can press the button to get another capsule?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function alignDiscs (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  if (part === 2) inputArr.push('Disc #7 has 11 positions; at time=0, it is at position 0.');   // PART 2: ADD ANOTHER DISC TO THE END

  // PARSE INPUT DATA
  const DATA = [];
  for (let disc = 0; disc < inputArr.length; ++disc) {
    const split = inputArr[disc].split(' ');
    const numPos = +split[split.indexOf('positions;') - 1];
    const startPos = +split.at(-1).slice(0, -1);

    const timeToReachDisc = disc + 1;
    const posAtTimeThatDiscIsReached = (startPos + timeToReachDisc) % numPos;                   // need mod in case sum exceeds numPos
    const minTimeToClearDisc = (numPos - posAtTimeThatDiscIsReached) % numPos;                  // need mod in case posAtTimeThatDiscIsReached is 0

    DATA.push({ minTimeToClearDisc, numPos });
  }

  // ANALYZE
  const LIMIT = Number.MAX_SAFE_INTEGER;
  for (let t = 0; t <= LIMIT; ++t) {
    if (DATA.every(obj => t >= obj.minTimeToClearDisc                                           // IMPORTANT: time must be at least the min time
                          && (t - obj.minTimeToClearDisc) % obj.numPos === 0)                   // time must be some multiple of numPos after min time
    ) {
      return t;
    }
  }
  throw 'ERROR: NO SOLUTION FOUND';
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = alignDiscs;
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
`Disc #1 has 5 positions; at time=0, it is at position 4.
Disc #2 has 2 positions; at time=0, it is at position 1.`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 5;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 16824;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 3543984;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);