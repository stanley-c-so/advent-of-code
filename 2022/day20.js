/*

--- Day 20: Grove Positioning System ---

It's finally time to meet back up with the Elves. When you try to contact them, however, you get no reply. Perhaps you're out of range?

You know they're headed to the grove where the star fruit grows, so if you can figure out where that is, you should be able to meet back up with them.

Fortunately, your handheld device has a file (your puzzle input) that contains the grove's coordinates! Unfortunately, the file is encrypted - just in case the device were to fall into the wrong hands.

Maybe you can decrypt it?

When you were still back at the camp, you overheard some Elves talking about coordinate file encryption. The main operation involved in decrypting the file is called mixing.

The encrypted file is a list of numbers. To mix the file, move each number forward or backward in the file a number of positions equal to the value of the number being moved. The list is circular, so moving a number off one end of the list wraps back around to the other end as if the ends were connected.

For example, to move the 1 in a sequence like 4, 5, 6, 1, 7, 8, 9, the 1 moves one position forward: 4, 5, 6, 7, 1, 8, 9. To move the -2 in a sequence like 4, -2, 5, 6, 7, 8, 9, the -2 moves two positions backward, wrapping around: 4, 5, 6, 7, 8, -2, 9.

The numbers should be moved in the order they originally appear in the encrypted file. Numbers moving around during the mixing process do not change the order in which the numbers are moved.

Consider this encrypted file:

1
2
-3
3
-2
0
4

Mixing this file proceeds as follows:

Initial arrangement:
1, 2, -3, 3, -2, 0, 4

1 moves between 2 and -3:
2, 1, -3, 3, -2, 0, 4

2 moves between -3 and 3:
1, -3, 2, 3, -2, 0, 4

-3 moves between -2 and 0:
1, 2, 3, -2, -3, 0, 4

3 moves between 0 and 4:
1, 2, -2, -3, 0, 3, 4

-2 moves between 4 and 1:
1, 2, -3, 0, 3, 4, -2

0 does not move:
1, 2, -3, 0, 3, 4, -2

4 moves between -3 and 0:
1, 2, -3, 4, 0, 3, -2

Then, the grove coordinates can be found by looking at the 1000th, 2000th, and 3000th numbers after the value 0, wrapping around the list as necessary. In the above example, the 1000th number after 0 is 4, the 2000th is -3, and the 3000th is 2; adding these together produces 3.

Mix your encrypted file exactly once. What is the sum of the three numbers that form the grove coordinates?


--- Part Two ---

The grove coordinate values seem nonsensical. While you ponder the mysteries of Elf encryption, you suddenly remember the rest of the decryption routine you overheard back at camp.

First, you need to apply the decryption key, 811589153. Multiply each number by the decryption key before you begin; this will produce the actual list of numbers to mix.

Second, you need to mix the list of numbers ten times. The order in which the numbers are mixed does not change during mixing; the numbers are still moved in the order they appeared in the original, pre-mixed list. (So, if -3 appears fourth in the original list of numbers to mix, -3 will be the fourth number to move during each round of mixing.)

Using the same example as above:

Initial arrangement:
811589153, 1623178306, -2434767459, 2434767459, -1623178306, 0, 3246356612

After 1 round of mixing:
0, -2434767459, 3246356612, -1623178306, 2434767459, 1623178306, 811589153

After 2 rounds of mixing:
0, 2434767459, 1623178306, 3246356612, -2434767459, -1623178306, 811589153

After 3 rounds of mixing:
0, 811589153, 2434767459, 3246356612, 1623178306, -1623178306, -2434767459

After 4 rounds of mixing:
0, 1623178306, -2434767459, 811589153, 2434767459, 3246356612, -1623178306

After 5 rounds of mixing:
0, 811589153, -1623178306, 1623178306, -2434767459, 3246356612, 2434767459

After 6 rounds of mixing:
0, 811589153, -1623178306, 3246356612, -2434767459, 1623178306, 2434767459

After 7 rounds of mixing:
0, -2434767459, 2434767459, 1623178306, -1623178306, 811589153, 3246356612

After 8 rounds of mixing:
0, 1623178306, 3246356612, 811589153, -2434767459, 2434767459, -1623178306

After 9 rounds of mixing:
0, 811589153, 1623178306, -2434767459, 3246356612, 2434767459, -1623178306

After 10 rounds of mixing:
0, -2434767459, 1623178306, 3246356612, -1623178306, 2434767459, 811589153
The grove coordinates can still be found in the same way. Here, the 1000th number after 0 is 811589153, the 2000th is 2434767459, and the 3000th is -1623178306; adding these together produces 1623178306.

Apply the decryption key and mix your encrypted file ten times. What is the sum of the three numbers that form the grove coordinates?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function rotationalOrder (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  // if (DEBUG) {
  //   console.log(inputArr[0]);
  //   // console.log(inputArr[1]);
  // }

  // PARSE INPUT
  const ORIGINAL_NUMS = inputArr.map(n => +n);
  const LEN = ORIGINAL_NUMS.length;

  // NOTE: MANY PEOPLE FAILED TO REALIZE THAT THE ACTUAL INPUT DATA CONTAINS DUPLICATES. BECAUSE OF THIS, WE CANNOT SIMPLY TRACK THE LOCATION
  // OF A MOVING NUMBER BASED ON THE IDENTITY (VALUE) OF THAT NUMBER. INSTEAD, WE SHOULD REPRESENT OUR STATE AS A COLLECTION OF INDEX VALUES INSTEAD,
  // AS THESE WILL BE UNIQUE AND ALLOW FOR EASY IDENTIFICATION OF ANY NUMBER, IN SPITE OF THE PRESENCE OF DUPLIATES.
  
  // if (new Set(ORIGINAL_NUMS).size !== LEN) {                                     // sanity check to confirm the presence of duplicates
  //   throw 'WARNING: CONFIRMED THERE ARE DUPLICATES';
  // }

  // INIT
  const [ NUM_TIMES, MULTIPLIER ] = part === 1  ? [ 1, 1 ]                          // PART 1: DO 1 MIX WITH THE NUMBERS AS THEY ARE
                                                : [ 10, 811589153 ];                // PART 2: DO 10 MIXES WITH THE NUMBERS MULTIPLIED BY 811589153

  const state = [ ...ORIGINAL_NUMS.keys() ];                                        // there are duplicate numbers in the input, so we use indices to track them

  // ANALYZE
  for (let x = 0; x < NUM_TIMES; ++x) {
    for (let i = 0; i < LEN; ++i) {                                                 // iterate through the original input, which governs the order of moves

      const num = ORIGINAL_NUMS[i] * MULTIPLIER;
      let IDX = state.indexOf(i);                                                   // declare with `let` so we can manually reassign during wrap-arounds

      // NOTE: IT IS EXTREMELY IMPORTANT THAT WHEN SIMPLIFYING THE NUMBER OF MOVES THE CURRENT NUMBER IS MAKING AROUND THE CIRCLE THAT WE TAKE
      // THE MODULO OF (LEN - 1) AND NOT LEN! THIS IS WHAT GOT ME STUCK FOR THE LONGEST TIME. UNLIKE WHEN YOU ARE SIMPLY COUNTING AROUND THE CIRCLE
      // (LIKE WE DO AFTER WE FIND THE POSITION OF 0 AND COUNT AROUND BY 1000, 2000, AND 3000) WHEN YOU *MOVE* AN ELEMENT, SWAPPING IT WITH ITS
      // NEIGHBORS, THE MATH IS SLIGHTLY DIFFERENT. EVEN AS ONE ELEMENT MOVES AROUND, THE RELATIVE CIRCULAR ORDER OF THE REMAINING ELEMENTS WILL REMAIN
      // THE SAME. IF THERE ARE N ITEMS IN TOTAL, THEN THE N-1 NON-MOVING ITEMS REMAIN IN THE SAME RELATIVE ORDER. YOU CAN IMAGINE THAT THERE ARE
      // N-1 "VACANCIES" IN THE SPACES BETWEEN THOSE ITEMS THAT THE MOVING ITEM CAN POTENTIALLY FILL, AND THAT AT ALL TIMES IT IS OCCUPYING ONE SUCH
      // SPACE. THEREFORE, TO RESET TO ITS ORIGINAL STATE, THE MOVING ITEM WOULD HAVE TO MAKE N-1 SWAPS, NOT N.
      //
      // NOTE ALSO THAT BASED ON WHAT THE PROBLEM IS ASKING, THE ONLY THING THAT MATTERS IS RELATIVE ROTATIONAL ORDER, AND NOT THE LINEAR ORDER IN WHICH
      // WE PRESENT THE STATE (e.g. [ 0, 1, 2, 3 ] is the same as [ 2, 3, 1, 0 ]). SOME OF THE INFORMATION GIVEN IN THE PART 1 DESCRIPTION ABOUT THE SAMPLE
      // INPUT MAKES SOME STRANGE CHOICES IN HOW THEY REPRESENT STATE IN LINEAR ORDER - I LOST TIME WHEN I GOT TRIPPED UP BY IT.

      let MOVES = num % (LEN - 1);                                                  // declare with `let` so we can increment/decrement

      if (DISPLAY_EXTRA_INFO && DEBUG) {
        console.log(`> moving ${num} by ${MOVES} positions`);
      }

      if (MOVES > 0) {                                                              // moving rightward along the array
        while (MOVES--) {
          if (IDX === LEN - 1) {                                                    // handle wrap-around
            state.unshift(state.pop());                                             // while not ideal for time complexity, this has a negligible effect on speed
            IDX = 0;                                                                // manually reset IDX to follow the wrapped-around number
          }
          [ state[IDX], state[IDX + 1] ] = [ state[IDX + 1], state[IDX] ];          // swap number with neighbor on the right
          ++IDX;
        }
      }
      else if (MOVES < 0) {                                                         // moving leftward along the array
        while (MOVES++) {
          if (IDX === 0) {
            state.push(state.shift());
            IDX = LEN - 1;
          }

          [ state[IDX - 1], state[IDX] ] = [ state[IDX], state[IDX - 1] ];
          --IDX;
        }
      }

    }
  }

  const IDX_OF_ZERO = state.map(i => ORIGINAL_NUMS[i]).indexOf(0);

  const NUMBER_1 = ORIGINAL_NUMS[state[(IDX_OF_ZERO + 1000) % LEN]] * MULTIPLIER;   // here, we can take mod of LEN, as we are merely counting, not swapping
  const NUMBER_2 = ORIGINAL_NUMS[state[(IDX_OF_ZERO + 2000) % LEN]] * MULTIPLIER;
  const NUMBER_3 = ORIGINAL_NUMS[state[(IDX_OF_ZERO + 3000) % LEN]] * MULTIPLIER;

  if (DISPLAY_EXTRA_INFO) {
    console.log('NUMBER 1 (1000 positions after 0):', NUMBER_1);
    console.log('NUMBER 2 (2000 positions after 0):', NUMBER_2);
    console.log('NUMBER 3 (3000 positions after 0):', NUMBER_3);
  }

  return NUMBER_1 + NUMBER_2 + NUMBER_3;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = rotationalOrder;
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
`1
2
-3
3
-2
0
4`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 8372;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 1623178306;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 7865110481723;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);