/*

--- Day 8: I Heard You Like Registers ---

You receive a signal directly from the CPU. Because of your recent assistance with jump instructions, it would like you to compute the result of a series of unusual register instructions.

Each instruction consists of several parts: the register to modify, whether to increase or decrease that register's value, the amount by which to increase or decrease it, and a condition. If the condition fails, skip the instruction without modifying the register. The registers all start at 0. The instructions look like this:

b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10

These instructions would be processed as follows:

Because a starts at 0, it is not greater than 1, and so b is not modified.
a is increased by 1 (to 1) because b is less than 5 (it is 0).
c is decreased by -10 (to 10) because a is now greater than or equal to 1 (it is 1).
c is increased by -20 (to -10) because c is equal to 10.

After this process, the largest value in any register is 1.

You might also encounter <= (less than or equal to) or != (not equal to). However, the CPU doesn't have the bandwidth to tell you what all the registers are named, and leaves that to you to determine.

What is the largest value in any register after completing the instructions in your puzzle input?


--- Part Two ---

To be safe, the CPU also needs to know the highest value held in any register during this process so that it can decide how much memory to allocate to these operations. For example, in the above instructions, the highest value ever held was 10 (in register c after the third instruction was evaluated).

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function registers (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // DATA STRUCTURES
  const INSTRUCTIONS = [];
  const REGISTERS = {};

  // PARSE INPUT DATA FIRST PASS: IDENTIFY ALL REGISTERS, VALIDATE INSTRUCTION COMPONENTS
  for (const line of inputArr) {
    const split = line.split(' ');
    INSTRUCTIONS.push(split);

    if (![ 'inc', 'dec' ].includes(split[1])) throw `ERROR: UNRECOGNIZED INC/DEC: ${split[1]}`;
    const registerA = split[0];
    if (!isNaN(split[4])) throw `ERROR: ${split[4]} SHOULD NOT BE A NUMBER`;
    const registerB = split[4];
    if (isNaN(split[6])) throw `ERROR: EXPECTED ${split[6]} TO BE A NUMBER`;

    REGISTERS[registerA] = 0;
    REGISTERS[registerB] = 0;
  }

  // INIT
  let registerWithHighestValueEver = null;
  let highestValueEver = -Infinity;

  // PARSE INPUT DATA SECOND PASS
  for (let i = 0; i < inputArr.length; ++i) {
    const instruction = INSTRUCTIONS[i];
    const registerA = instruction[0];
    const registerB = instruction[4];
    const conditionOperator = instruction[5];
    const conditionOperand = +instruction[6];
    const delta = +instruction[2] * (instruction[1] === 'inc' ? 1 : -1);

    const condition = conditionOperator === '>'  ?  REGISTERS[registerB] > conditionOperand :
                      conditionOperator === '<'  ?  REGISTERS[registerB] < conditionOperand :
                      conditionOperator === '>=' ?  REGISTERS[registerB] >= conditionOperand :
                      conditionOperator === '<=' ?  REGISTERS[registerB] <= conditionOperand :
                      conditionOperator === '==' ?  REGISTERS[registerB] === conditionOperand :
                      conditionOperator === '!=' ?  REGISTERS[registerB] !== conditionOperand :
                                                    null;

    if (condition === null) throw `ERROR: INVALID CONDITION / OPERATOR ${conditionOperator}`;

    if (condition) REGISTERS[registerA] += delta;

    if (REGISTERS[registerA] > highestValueEver) {                                                // PART 2: update highestValueEver
      registerWithHighestValueEver = registerA;
      highestValueEver = REGISTERS[registerA];
    }
  }

  // PART 1: GET HIGHEST VALUE AT END
  let highestRegister = null;
  let highestValue = -Infinity;
  for (const register in REGISTERS) {
    if (REGISTERS[register] > highestValue) {
      highestRegister = register;
      highestValue = REGISTERS[register];
    }
  }

  if (DISPLAY_EXTRA_INFO) {
    console.log('REGISTERS:', REGISTERS);
    console.log('-----');
    console.log('register with highest value at end of instructions:', highestRegister);
    console.log('highest value at end of instructions:', highestValue);
    console.log('register with highest value ever:', registerWithHighestValueEver);
    console.log('highest value ever:', highestValueEver);
  }

  return part === 1 ? highestValue                                                                // PART 1: GET HIGHEST VALUE AT END
                    : highestValueEver;                                                           // PART 2: GET HIGHEST VALUE EVER
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = registers;
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
`b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 1;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 6611;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 10;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 6619;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);