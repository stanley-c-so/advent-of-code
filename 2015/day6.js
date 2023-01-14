/*

--- Day 6: Probably a Fire Hazard ---

Because your neighbors keep defeating you in the holiday house decorating contest year after year, you've decided to deploy one million lights in a 1000x1000 grid.

Furthermore, because you've been especially nice this year, Santa has mailed you instructions on how to display the ideal lighting configuration.

Lights in your grid are numbered from 0 to 999 in each direction; the lights at each corner are at 0,0, 0,999, 999,999, and 999,0. The instructions include whether to turn on, turn off, or toggle various inclusive ranges given as coordinate pairs. Each coordinate pair represents opposite corners of a rectangle, inclusive; a coordinate pair like 0,0 through 2,2 therefore refers to 9 lights in a 3x3 square. The lights all start turned off.

To defeat your neighbors this year, all you have to do is set up your lights by doing the instructions Santa sent you in order.

For example:

turn on 0,0 through 999,999 would turn on (or leave on) every light.
toggle 0,0 through 999,0 would toggle the first line of 1000 lights, turning off the ones that were on, and turning on the ones that were off.
turn off 499,499 through 500,500 would turn off (or leave off) the middle four lights.

After following the instructions, how many lights are lit?


--- Part Two ---

You just finish implementing your winning light pattern when you realize you mistranslated Santa's message from Ancient Nordic Elvish.

The light grid you bought actually has individual brightness controls; each light can have a brightness of zero or more. The lights all start at zero.

The phrase turn on actually means that you should increase the brightness of those lights by 1.

The phrase turn off actually means that you should decrease the brightness of those lights by 1, to a minimum of zero.

The phrase toggle actually means that you should increase the brightness of those lights by 2.

What is the total brightness of all lights combined after following Santa's instructions?

For example:

turn on 0,0 through 0,0 would increase the total brightness by 1.
toggle 0,0 through 999,999 would increase the total brightness by 2000000.

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function christmasLights (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // CONSTANTS AND DATA STRUCTURE
  const H = 1000;
  const W = 1000;
  const GRID = Array.from({length: H}, () => Array(W).fill(0));

  // PARSE INPUT DATA
  for (const line of inputArr) {
    const split = line.split(' ');
    const firstWord = split[0];
    const secondWord = split[1];
    const [ x1, y1 ] = split.at(-3).split(',').map(n => +n);
    const [ x2, y2 ] = split.at(-1).split(',').map(n => +n);
    
    if (x1 > x2) throw `ERROR: INVALID x COORDINATES: ${x1} > ${x2}`;   // sanity check
    if (y1 > y2) throw `ERROR: INVALID y COORDINATES: ${y1} > ${y2}`;   // sanity check

    for (let row = y1; row <= y2; ++row) {
      for (let col = x1; col <= x2; ++col) {

        if (part === 1) {                                               // PART 1: ENGLISH INSTRUCTIONS

          if (firstWord === 'toggle') {
            GRID[row][col] = +(!GRID[row][col]);
          } else if (secondWord === 'on') {
            GRID[row][col] = 1;
          } else if (secondWord === 'off') {
            GRID[row][col] = 0;
          } else throw `ERROR: INVALID LINE ${line}`;

        } else {                                                        // PART 2: 'ANCIENT NORDIC ELVISH' INSTRUCTIONS

          if (firstWord === 'toggle') {                                 // 'toggle' means *INCREASE BRIGHTNESS BY 2*
            GRID[row][col] += 2;
          } else if (secondWord === 'on') {                             // 'turn on' means increment brightness
            GRID[row][col] += 1;
          } else if (secondWord === 'off') {                            // 'turn off' means decrement brightness (but never below 0)
            if (GRID[row][col]) GRID[row][col] -= 1;
          } else throw `ERROR: INVALID LINE ${line}`;

        }

      }
    }
  }

  // ANALYZE BRIGHTNESS
  // NOTE: in part 1, 'turn on' means set brightness to 1; 'turn off' means set brightness to 0;
  // 'toggle' means switch between 0 and 1, so therefore the total brightness will equal the total
  // number of lights that are on, which is what the problem asks for. therefore, by framing this
  // part of the problem as finding the total brightness, we are generalizing it to parts 1 and 2
  // without any issues.

  let brightness = 0;
  for (let row = 0; row < H; ++row) {
    for (let col = 0; col < W; ++col) {
      brightness += GRID[row][col];
    }
  }
  return brightness;

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = christmasLights;
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
`turn on 0,0 through 999,999
toggle 0,0 through 999,0
turn off 499,499 through 500,500`
);

const sampleInput2 = parseSampleInput(
`turn on 0,0 through 0,0
toggle 0,0 through 999,999`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 1000 * 1000 - 1000 - 4;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 400410;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 1 + 2000000;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 15343601;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);