/*

--- Day 10: Balance Bots ---

You come upon a factory in which many robots are zooming around handing small microchips to each other.

Upon closer examination, you notice that each bot only proceeds when it has two microchips, and once it does, it gives each one to a different bot or puts it in a marked "output" bin. Sometimes, bots take microchips from "input" bins, too.

Inspecting one of the microchips, it seems like they each contain a single number; the bots must use some logic to decide what to do with each chip. You access the local control computer and download the bots' instructions (your puzzle input).

Some of the instructions specify that a specific-valued microchip should be given to a specific bot; the rest of the instructions indicate what a given bot should do with its lower-value or higher-value chip.

For example, consider the following instructions:

value 5 goes to bot 2
bot 2 gives low to bot 1 and high to bot 0
value 3 goes to bot 1
bot 1 gives low to output 1 and high to bot 0
bot 0 gives low to output 2 and high to output 0
value 2 goes to bot 2

Initially, bot 1 starts with a value-3 chip, and bot 2 starts with a value-2 chip and a value-5 chip.
Because bot 2 has two microchips, it gives its lower one (2) to bot 1 and its higher one (5) to bot 0.
Then, bot 1 has two microchips; it puts the value-2 chip in output 1 and gives the value-3 chip to bot 0.
Finally, bot 0 has two microchips; it puts the 3 in output 2 and the 5 in output 0.
In the end, output bin 0 contains a value-5 microchip, output bin 1 contains a value-2 microchip, and output bin 2 contains a value-3 microchip. In this configuration, bot number 2 is responsible for comparing value-5 microchips with value-2 microchips.

Based on your instructions, what is the number of the bot that is responsible for comparing value-61 microchips with value-17 microchips?


--- Part Two ---

What do you get if you multiply together the values of one chip in each of outputs 0, 1, and 2?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function simulateItemMovement (part, inputStr, extraParam, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // INIT
  const INSTRUCTIONS = {};
  const bots = {};
  const outputs = {};
  const stack = [];                                                             // represents robots that are ready to go because they hold 2 chips

  // PARSE INPUT DATA
  extraParam.sort((a, b) => a - b);                                             // NOTE: IMPORTANT FOR OUR LOGIC TO MAKE SURE THIS IS SORTED!
  for (const line of inputArr) {
    const split = line.split(' ');

    if (split[0] === 'value') {
      const bot = +split[5];
      const value = +split[1];
      if (!(bot in bots)) bots[bot] = [];                                       // NOTE: important to init bot upon initial discovery
      bots[bot].push(value);
      if (bots[bot].length > 2) {                                               // sanity check: bot should not carry more than 2 chips
        throw `ERROR: MORE THAN 2 VALUES ON BOT ${bot} -`, bots[bot];
      }
      if (bots[bot].length === 2) stack.push(bot);
    }

    else if (split[0] === 'bot') {
      const bot = +split[1];
      
      const lowType = split[5] === 'bot' ? bots : outputs;
      const lowNum = +split[6];
      if (!(lowNum in lowType)) lowType[lowNum] = [];                           // NOTE: important to init receiving bot upon initial discovery
      
      const highType = split[10] === 'bot' ? bots : outputs;
      const highNum = +split[11];
      if (!(highNum in highType)) highType[highNum] = [];                       // NOTE: important to init receiving bot upon initial discovery
      
      INSTRUCTIONS[bot] = { lowType, lowNum, highType, highNum };
    }

    else throw `ERROR: UNRECOGNIZED START WORD ${split[0]}`;
  }

  // ANALYZE
  while (stack.length) {
    const bot = stack.pop();
    const higherVal = Math.max(...bots[bot]);
    const lowerVal = Math.min(...bots[bot]);
    bots[bot].length = 0;                                                       // clear array (not strictly necessary)

    if (part === 1                                                              // PART 1: SIMPLY RETURN BOT # OF THE ONE COMPARING THE GIVEN EXTRA PARAMS
        && lowerVal === extraParam[0]                                           // NOTE: recall that extraParam was sorted at the beginning
        && higherVal === extraParam[1]
    ) {
      return bot;
    }

    const { lowType, lowNum, highType, highNum } = INSTRUCTIONS[bot];

    const higherTarget = highType[highNum];
    higherTarget.push(higherVal);
    if (higherTarget.length > 2) {                                              // sanity check: bot should not carry more than 2 chips
      throw `ERROR: MORE THAN 2 VALUES ON BOT ${highNum} -`, higherTarget;
    }
    if (higherTarget.length === 2) stack.push(highNum);

    const lowerTarget = lowType[lowNum];
    lowerTarget.push(lowerVal);
    if (lowerTarget.length > 2) {                                               // sanity check: bot should not carry more than 2 chips
      throw `ERROR: MORE THAN 2 VALUES ON BOT ${lowNum} -`, lowerTarget;
    }
    if (lowerTarget.length === 2) stack.push(lowNum);
  }

  if (part === 1) {                                                             // PART 1: throw error if while loop escapes without solution
    
    throw 'ERROR: DID NOT FIND A SOLUTION';

  } else {                                                                      // PART 2: return product of items in first 3 outputs

    if (DISPLAY_EXTRA_INFO) console.log(outputs);
    return outputs[0] * outputs[1] * outputs[2];

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = simulateItemMovement;
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
`value 5 goes to bot 2
bot 2 gives low to bot 1 and high to bot 0
value 3 goes to bot 1
bot 1 gives low to output 1 and high to bot 0
bot 0 gives low to output 2 and high to output 0
value 2 goes to bot 2`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: [5, 2],
  DEBUG: true,
};
expected = 2;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: [61, 17],
};
expected = 116;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  extraParam: [],
  DEBUG: true,
};
expected = 30;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: [],
};
expected = 23903;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);