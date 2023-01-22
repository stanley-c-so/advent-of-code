/*

--- Day 15: Dueling Generators ---

Here, you encounter a pair of dueling generators. The generators, called generator A and generator B, are trying to agree on a sequence of numbers. However, one of them is malfunctioning, and so the sequences don't always match.

As they do this, a judge waits for each of them to generate its next value, compares the lowest 16 bits of both values, and keeps track of the number of times those parts of the values match.

The generators both work on the same principle. To create its next value, a generator will take the previous value it produced, multiply it by a factor (generator A uses 16807; generator B uses 48271), and then keep the remainder of dividing that resulting product by 2147483647. That final remainder is the value it produces next.

To calculate each generator's first value, it instead uses a specific starting value as its "previous value" (as listed in your puzzle input).

For example, suppose that for starting values, generator A uses 65, while generator B uses 8921. Then, the first five pairs of generated values are:

--Gen. A--  --Gen. B--
   1092455   430625591
1181022009  1233683848
 245556042  1431495498
1744312007   137874439
1352636452   285222916

In binary, these pairs are (with generator A's value first in each pair):

00000000000100001010101101100111
00011001101010101101001100110111

01000110011001001111011100111001
01001001100010001000010110001000

00001110101000101110001101001010
01010101010100101110001101001010

01100111111110000001011011000111
00001000001101111100110000000111

01010000100111111001100000100100
00010001000000000010100000000100

Here, you can see that the lowest (here, rightmost) 16 bits of the third value match: 1110001101001010. Because of this one match, after processing these five pairs, the judge would have added only 1 to its total.

To get a significant sample, the judge would like to consider 40 million pairs. (In the example above, the judge would eventually find a total of 588 pairs that match in their lowest 16 bits.)

After 40 million pairs, what is the judge's final count?


--- Part Two ---

In the interest of trying to align a little better, the generators get more picky about the numbers they actually give to the judge.

They still generate values in the same way, but now they only hand a value to the judge when it meets their criteria:

Generator A looks for values that are multiples of 4.
Generator B looks for values that are multiples of 8.
Each generator functions completely independently: they both go through values entirely on their own, only occasionally handing an acceptable value to the judge, and otherwise working through the same sequence of values as before until they find one.

The judge still waits for each generator to provide it with a value before comparing them (using the same comparison method as before). It keeps track of the order it receives values; the first values from each generator are compared, then the second values from each generator, then the third values, and so on.

Using the example starting values given above, the generators now produce the following first five values each:

--Gen. A--  --Gen. B--
1352636452  1233683848
1992081072   862516352
 530830436  1159784568
1980017072  1616057672
 740335192   412269392

These values have the following corresponding binary values:

01010000100111111001100000100100
01001001100010001000010110001000

01110110101111001011111010110000
00110011011010001111010010000000

00011111101000111101010001100100
01000101001000001110100001111000

01110110000001001010100110110000
01100000010100110001010101001000

00101100001000001001111001011000
00011000100100101011101101010000

Unfortunately, even though this change makes more bits similar on average, none of these values' lowest 16 bits match. Now, it's not until the 1056th pair that the judge finds the first match:

--Gen. A--  --Gen. B--
1023762912   896885216

00111101000001010110000111100000
00110101011101010110000111100000

This change makes the generators much slower, and the judge is getting impatient; it is now only willing to consider 5 million pairs. (Using the values from the example above, after five million pairs, the judge would eventually find a total of 309 pairs that match in their lowest 16 bits.)

After 5 million pairs, but using this new generator logic, what is the judge's final count?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function NAME_OF_FUNC_HERE (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // PARSE DATA INPUT
  let valueA = +inputArr[0].split(' ').at(-1);
  let valueB = +inputArr[1].split(' ').at(-1);

  // CONSTANTS
  const FACTOR_A = 16807;
  const FACTOR_B = 48271;
  const DIVISOR = 2147483647;
  const BINARY_LENGTH = 32;
  const NUM_PAIRS = part === 1  ? 40000000                                    // GET 40 MIL PAIRS TO COMPARE
                                : 5000000;                                    // GET 5 MIL PAIRS TO COMPARE
                                                                              // (but loop may run many more times than this!)
  const MOD_A = 4;
  const MOD_B = 8;

  // INIT
  const numsA = [];
  const numsB = [];
  let numMatches = 0;

  // ANALYZE
  const TIME_AT_START = Date.now();
  console.log('RUNNING ANALYSIS (PLEASE WAIT)...');
  for ( let i = 0;
        part === 1  ? i < NUM_PAIRS                                           // PART 1: RUN THIS 40 MIL TIMES
                    : numsA.length < NUM_PAIRS || numsB.length < NUM_PAIRS;   // PART 2: STOP ONLY WHEN BOTH ARRAYS GET 5 MIL NUMBERS
        ++i ) {

    valueA = (valueA * FACTOR_A) % DIVISOR;
    valueB = (valueB * FACTOR_B) % DIVISOR;

    const binaryA = valueA.toString(2).padStart(BINARY_LENGTH, '0');
    const binaryB = valueB.toString(2).padStart(BINARY_LENGTH, '0');

    const sliceA = binaryA.slice(16);
    const sliceB = binaryB.slice(16);

    if (part === 1) {

      if (sliceA === sliceB) ++numMatches;                                    // PART 1: IMMEDIATELY JUDGE THE TWO NUMBERS

    } else {

      if (valueA % MOD_A === 0) numsA.push(sliceA);                           // PART 2: STORE THE NUMBERS IF CONDITIONS ARE MET
      if (valueB % MOD_B === 0) numsB.push(sliceB);

    }
  }

  console.log(`(FINISHED GENERATING NUMBERS AFTER ${(Date.now() - TIME_AT_START)/1000} SECS)`);

  // PART 2: NOW JUDGE THE STORED PAIRS
  if (part === 2) {
    for (let i = 0; i < NUM_PAIRS; ++i) {
      if (numsA[i] === numsB[i]) ++numMatches;
    }
  }

  console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
  return numMatches;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = NAME_OF_FUNC_HERE;
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
`Generator A starts with 65
Generator B starts with 8921`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 588;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 631;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 309;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 279;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);