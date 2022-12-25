/*

--- Day 25: Full of Hot Air ---

As the expedition finally reaches the extraction point, several large hot air balloons drift down to meet you. Crews quickly start unloading the equipment the balloons brought: many hot air balloon kits, some fuel tanks, and a fuel heating machine.

The fuel heating machine is a new addition to the process. When this mountain was a volcano, the ambient temperature was more reasonable; now, it's so cold that the fuel won't work at all without being warmed up first.

The Elves, seemingly in an attempt to make the new machine feel welcome, have already attached a pair of googly eyes and started calling it "Bob".

To heat the fuel, Bob needs to know the total amount of fuel that will be processed ahead of time so it can correctly calibrate heat output and flow rate. This amount is simply the sum of the fuel requirements of all of the hot air balloons, and those fuel requirements are even listed clearly on the side of each hot air balloon's burner.

You assume the Elves will have no trouble adding up some numbers and are about to go back to figuring out which balloon is yours when you get a tap on the shoulder. Apparently, the fuel requirements use numbers written in a format the Elves don't recognize; predictably, they'd like your help deciphering them.

You make a list of all of the fuel requirements (your puzzle input), but you don't recognize the number format either. For example:

1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122

Fortunately, Bob is labeled with a support phone number. Not to be deterred, you call and ask for help.

"That's right, just supply the fuel amount to the-- oh, for more than one burner? No problem, you just need to add together our Special Numeral-Analogue Fuel Units. Patent pending! They're way better than normal numbers for--"

You mention that it's quite cold up here and ask if they can skip ahead.

"Okay, our Special Numeral-Analogue Fuel Units - SNAFU for short - are sort of like normal numbers. You know how starting on the right, normal numbers have a ones place, a tens place, a hundreds place, and so on, where the digit in each place tells you how many of that value you have?"

"SNAFU works the same way, except it uses powers of five instead of ten. Starting from the right, you have a ones place, a fives place, a twenty-fives place, a one-hundred-and-twenty-fives place, and so on. It's that easy!"

You ask why some of the digits look like - or = instead of "digits".

"You know, I never did ask the engineers why they did that. Instead of using digits four through zero, the digits are 2, 1, 0, minus (written -), and double-minus (written =). Minus is worth -1, and double-minus is worth -2."

"So, because ten (in normal numbers) is two fives and no ones, in SNAFU it is written 20. Since eight (in normal numbers) is two fives minus two ones, it is written 2=."

"You can do it the other direction, too. Say you have the SNAFU number 2=-01. That's 2 in the 625s place, = (double-minus) in the 125s place, - (minus) in the 25s place, 0 in the 5s place, and 1 in the 1s place. (2 times 625) plus (-2 times 125) plus (-1 times 25) plus (0 times 5) plus (1 times 1). That's 1250 plus -250 plus -25 plus 0 plus 1. 976!"

"I see here that you're connected via our premium uplink service, so I'll transmit our handy SNAFU brochure to you now. Did you need anything else?"

You ask if the fuel will even work in these temperatures.

"Wait, it's how cold? There's no way the fuel - or any fuel - would work in those conditions! There are only a few places in the-- where did you say you are again?"

Just then, you notice one of the Elves pour a few drops from a snowflake-shaped container into one of the fuel tanks, thank the support representative for their time, and disconnect the call.

The SNAFU brochure contains a few more examples of decimal ("normal") numbers and their SNAFU counterparts:

  Decimal          SNAFU
        1              1
        2              2
        3             1=
        4             1-
        5             10
        6             11
        7             12
        8             2=
        9             2-
       10             20
       15            1=0
       20            1-0
     2022         1=11-2
    12345        1-0---0
314159265  1121-1110-1=0

Based on this process, the SNAFU numbers in the example above can be converted to decimal numbers as follows:

 SNAFU  Decimal
1=-0-2     1747
 12111      906
  2=0=      198
    21       11
  2=01      201
   111       31
 20012     1257
   112       32
 1=-1=      353
  1-12      107
    12        7
    1=        3
   122       37

In decimal, the sum of these numbers is 4890.

As you go to input this number on Bob's console, you discover that some buttons you expected are missing. Instead, you are met with buttons labeled =, -, 0, 1, and 2. Bob needs the input value expressed as a SNAFU number, not in decimal.

Reversing the process, you can determine that for the decimal number 4890, the SNAFU number you need to supply to Bob's console is 2=-1=0.

The Elves are starting to get cold. What SNAFU number do you supply to Bob's console?


--- Part Two ---

The hot air balloons quickly carry you to the North Pole. As soon as you land, most of the expedition is escorted directly to a small building attached to the reindeer stables.

The head smoothie chef has just finished warming up the industrial-grade smoothie blender as you arrive. It will take 50 stars to fill the blender. The expedition Elves turn their attention to you, and you begin emptying the fruit from your pack onto the table.

As you do, a very young Elf - one you recognize from the expedition team - approaches the table and holds up a single star fruit he found. The head smoothie chef places it in the blender.

Only 49 stars to go.

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;


// ========== SOLUTION 1: FOR THE DECIMAL-TO-SNAFU CONVERSION, WE FIRST FIND THE LENGTH OF THE SNAFU REPRESENTATION BY IMAGINING THAT WE ARE FILLING EACH
// PLACE WITH THE MAX NUMBER, 2, PROGRESSIVELY UNTIL THE NUMBER IS TOO LARGE. THEN WE 'CLEAR' OUR REPRESENTATION, AND WORK OUR WAY BACKWARD FROM THE HIGHEST
// PLACE, EACH TIME CONSIDERING WHAT THE VALUE WOULD BE FOR THE FIVE POSSIBLE CANDIDATE DIGITS, AND CHOOSING THE ONE WITH THE SMALLEST ABOSLUTE DIFFERENCE FROM N.
// NOTE THAT WITH THIS METHOD, IT IS POSSIBLE THAT THE LEADING DIGIT IS A 0, BUT THAT WOULD BE THE ONLY LEADING 0. WE CAN SIMPLY CHECK FOR THIS CASE AND SHIFT
// IT OFF FROM THE ARRAY REPRESENTATION IF NECESSARY, BEFORE JOINING THE ARRAY AND RETURNING AS A STRING.

function baseFiveWithNegativeDigits (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // CONSTANTS
  const REF_SNAFU_TO_DECIMAL = {
    '0': 0,
    '1': 1,
    '2': 2,
    '-': -1,
    '=': -2,
  };

  // HELPER FUNCTION: CONVERT SNAFU (string) TO DECIMAL
  function SNAFUtoDecimal(str) {
    let num = 0;
    let place = 1;
    for (let i = str.length - 1; i >= 0; --i) {                                   // simply iterate backward through the string starting at the ones place...
      num += REF_SNAFU_TO_DECIMAL[str[i]] * place;                                // ...and add the value of the digit multiplied by the value of the place
      place *= 5;
    }
    return num;
  }

  // HELPER FUNCTION: CONVERT DECIMAL TO SNAFU
  function decimalToSNAFU(n) {

    // first, find how long the string will need to be by repeatedly adding new digits with value 2, until it is bigger than n.
    const arr = [ '2' ];                                                          // temporarily stores digits in reverse. start by assuming current number is 2,
                                                                                  // NOTE: we can actually push anything since we overwrite this later
    let place = 1;
    let curr = 2;
    while (curr < n) {
      arr.push('2');                                                              // if curr is less than n, we see what would happen if we fill digit with 2
                                                                                  // NOTE: we can actually push anything since we overwrite this later
      curr += place * 2;
      place *= 5;
    }

    // one out of the while loop we are guaranteed that curr >= n, and our array has sufficient digits (or one extra, with a leading 0)
    curr = 0;                                                                     // reset curr since we will be overwriting all digits
    arr.reverse();                                                                // now we can reverse arr and think about this from left to right


    // for each digit, overwrite with the best digit which gets us closest to n
    for (let i = 0; i < arr.length; ++i) {
      let smallestDiff = Infinity;
      let closestDigit;
      for (const digit in REF_SNAFU_TO_DECIMAL) {
        const diff = Math.abs(n - (curr + REF_SNAFU_TO_DECIMAL[digit] * place));
        if (diff < smallestDiff) {
          smallestDiff = diff;
          closestDigit = digit;
        }
      }
      arr[i] = closestDigit;
      curr += REF_SNAFU_TO_DECIMAL[closestDigit] * place;
      place /= 5;
    }

    if (arr[0] === '0') arr.shift();                                              // we may now have a leading 0. if so, we remove it

    return arr.join('');
  }

  // PARSE INPUT DATA TO GET SUM OF SNAFU NUMBERS (REPRESENTED IN DECIMAL)
  let sum = 0;
  for (const line of inputArr) {
    sum += SNAFUtoDecimal(line)
  }

  // EXAMPLE INPUTS/OUTPUTS GIVEN BY PROMPT, FOR EASIER DEBUGGING
  if (DISPLAY_EXTRA_INFO && DEBUG) {
    const TEST_DECIMALS = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 2022, 12345, 314159265 ];
    const TEST_SNAFUS = [ '1', '2', '1=', '1-', '10', '11', '12', '2=', '2-', '20', '1=0', '1-0', '1=11-2', '1-0---0', '1121-1110-1=0' ];
    const SNAFU_RESULTS = TEST_DECIMALS.map(n => decimalToSNAFU(n));
    for (let i = 0; i < SNAFU_RESULTS.length; ++i) {
      console.log(`FOR DECIMAL ${TEST_DECIMALS[i]}, EXPECTED ${TEST_SNAFUS[i]}, AND GOT ${SNAFU_RESULTS[i]}`);
      if (SNAFU_RESULTS[i] !== TEST_SNAFUS[i]) {
        throw `ERROR: FOR DECIMAL ${TEST_DECIMALS[i]}, EXPECTED ${TEST_SNAFUS[i]} BUT GOT ${SNAFU_RESULTS[i]}`;
      }
    }
  }

  // INVOKE HELPER CONVERTER TO RETURN SNAFU OF THE DECIMAL SUM
  return decimalToSNAFU(sum);
}


// ========== SOLUTION 2: DECIMAL-TO-SNAFU CONVERSION SOLUTION USED BY ALEX MOK (https://github.com/mistuhmok). THIS IS LIKE REGULAR BASE CONVERSION -
// WE FOCUS ON THE UNITS DIGIT, AND TAKE THE MODULO OF THE BASE (HERE, 5). THE ONLY TRICK HERE IS THAT IF THE MOD IS 3 OR 4, SINCE WE CAN'T USE THOSE DIGITS
// IN SNAFU, WE WOULD NEED TO INCREMENT THE NEXT DIGIT OVER (FIVES), AND THEN IN THE UNITS DIGIT, SUBTRACT BACK DOWN.

function baseFiveWithNegativeDigits2 (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // CONSTANTS
  const REF_SNAFU_TO_DECIMAL = {
    '0': 0,
    '1': 1,
    '2': 2,
    '-': -1,
    '=': -2,
  };
  const REF_DECIMAL_TO_SNAFU = {                                                  // we will be taking mods of 5. if result is 3 or 4, next digit needs to increment to gain 5...
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '=',                                                                     // ...and if mod is 3, then current digit needs to subtract 2 to get a net gain of 3
    '4': '-',                                                                     // ...else if mod is 4, then current digit needs to subtract 1 to get a net gain of 4
  }

  // HELPER FUNCTION: CONVERT SNAFU (string) TO DECIMAL
  function SNAFUtoDecimal(str) {
    let num = 0;
    let place = 1;
    for (let i = str.length - 1; i >= 0; --i) {                                   // simply iterate backward through the string starting at the ones place...
      num += REF_SNAFU_TO_DECIMAL[str[i]] * place;                                // ...and add the value of the digit multiplied by the value of the place
      place *= 5;
    }
    return num;
  }

  // HELPER FUNCTION: CONVERT DECIMAL TO SNAFU
  function decimalToSNAFU(n) {
    const arr = [];
    while (n) {                                                                   // regular base conversion from units place, with a twist:
      const mod = n % 5;                                                          // if mod is 3 or 4, since we don't have those numbers, we increment the fives
                                                                                  // place, and subtract back down
      arr.push(REF_DECIMAL_TO_SNAFU[mod]);
      n = Math.floor(n / 5) + ([3, 4].includes(mod) ? 1 : 0);                     // divide n by 5 to work on next digit (floor to discard previous digit). as
                                                                                  // mentioned above, if mod was 3 or 4, we need to increment the result so that
                                                                                  // we can essentially subtract back down
    }
    return arr.reverse().join('');
  }

  // PARSE INPUT DATA TO GET SUM OF SNAFU NUMBERS (REPRESENTED IN DECIMAL)
  let sum = 0;
  for (const line of inputArr) {
    sum += SNAFUtoDecimal(line)
  }

  // EXAMPLE INPUTS/OUTPUTS GIVEN BY PROMPT, FOR EASIER DEBUGGING
  if (DISPLAY_EXTRA_INFO && DEBUG) {
    const TEST_DECIMALS = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 2022, 12345, 314159265 ];
    const TEST_SNAFUS = [ '1', '2', '1=', '1-', '10', '11', '12', '2=', '2-', '20', '1=0', '1-0', '1=11-2', '1-0---0', '1121-1110-1=0' ];
    const SNAFU_RESULTS = TEST_DECIMALS.map(n => decimalToSNAFU(n));
    for (let i = 0; i < SNAFU_RESULTS.length; ++i) {
      console.log(`FOR DECIMAL ${TEST_DECIMALS[i]}, EXPECTED ${TEST_SNAFUS[i]}, AND GOT ${SNAFU_RESULTS[i]}`);
      if (SNAFU_RESULTS[i] !== TEST_SNAFUS[i]) {
        throw `ERROR: FOR DECIMAL ${TEST_DECIMALS[i]}, EXPECTED ${TEST_SNAFUS[i]} BUT GOT ${SNAFU_RESULTS[i]}`;
      }
    }
  }

  // INVOKE HELPER CONVERTER TO RETURN SNAFU OF THE DECIMAL SUM
  return decimalToSNAFU(sum);
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
// const func = baseFiveWithNegativeDigits;
const func = baseFiveWithNegativeDigits2;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const skippedTests = new Set([  3, 4 ]);
const lowestTest = 0;
const highestTest = 0;

const fs = require('fs');
const path = require('path');
const DAY_NUM = __filename.split('.js')[0].split('day')[1];
const INPUT_PATH = path.join(__dirname, `day${DAY_NUM}-input.txt`);
const actualInput = fs.readFileSync(INPUT_PATH, 'utf8');
const parseSampleInput = s => s.split('').map(c => c === '\n' ? '\r\n' : c).join('');

const sampleInput = parseSampleInput(
`1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = '2=-1=0';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = '122-0==-=211==-2-200';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);