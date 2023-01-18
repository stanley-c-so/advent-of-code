/*

--- Day 23: Opening the Turing Lock ---

Little Jane Marie just got her very first computer for Christmas from some unknown benefactor. It comes with instructions and an example program, but the computer itself seems to be malfunctioning. She's curious what the program does, and would like you to help her run it.

The manual explains that the computer supports two registers and six instructions (truly, it goes on to remind the reader, a state-of-the-art technology). The registers are named a and b, can hold any non-negative integer, and begin with a value of 0. The instructions are as follows:

hlf r sets register r to half its current value, then continues with the next instruction.
tpl r sets register r to triple its current value, then continues with the next instruction.
inc r increments register r, adding 1 to it, then continues with the next instruction.
jmp offset is a jump; it continues with the instruction offset away relative to itself.
jie r, offset is like jmp, but only jumps if register r is even ("jump if even").
jio r, offset is like jmp, but only jumps if register r is 1 ("jump if one", not odd).

All three jump instructions work with an offset relative to that instruction. The offset is always written with a prefix + or - to indicate the direction of the jump (forward or backward, respectively). For example, jmp +1 would simply continue with the next instruction, while jmp +0 would continuously jump back to itself forever.

The program exits when it tries to run an instruction beyond the ones defined.

For example, this program sets a to 2, because the jio instruction causes it to skip the tpl instruction:

inc a
jio a, +2
tpl a
inc a

What is the value in register b when the program in your puzzle input is finished executing?


--- Part Two ---

The unknown benefactor is very thankful for releasi-- er, helping little Jane Marie with her computer. Definitely not to distract you, what is the value in register b after the program is finished executing if register a starts as 1 instead?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function collatz (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  const registers = {
    a: part === 1 ? 0                                                           // PART 1: REGISTER a STARTS AT 0
                  : 1,                                                          // PART 2: REGISTER a STARTS AT 1
    b: 0
  };

  // NOTE: IF YOU ANALYZE THE ACTUAL INPUT DATA, IT BECOMES CLEAR THAT THIS PROBLEM IS SIMULATING THE COLLATZ CONJECTURE.
  // IN PART 1, REGISTER a STARTS AT 0, SO AFTER LINE 1, YOU RUN THROUGH LINES 2-16, WHICH GETS YOUR REGISTER a TO 4591.
  // THEN, YOU LOOP THROUGH LINES 39-46, ONLY ESCAPING IF REGISTER a EQUALS 1. WITHIN THAT LOOP, IF REGISTER a IS EVEN,
  // YOU CUT IT IN HALF. ELSE, IF IT IS ODD, YOU TRIPLE IT AND ADD 1. (THIS IS COLLATZ.)
  // IN PART 2, SINCE REGISTER a STARTS AT 1, AFTER LINE 1, YOU INSTEAD RUN THROUGH LINES 17-38, WHICH GETS YOUR REGISTER
  // a TO 113383. THEN, YOU LOOP THROUGH LINES 39-46 (COLLATZ).
  //
  // AFTER YOU ESCAPE THE INSTRUCTIONS, YOU RETURN THE VALUE AT REGISTER b - THIS GOT INCREMENTED EVERY TIME YOU RAN THE
  // COLLATZ LOOP, SO THIS REPRESENTS THE NUMBER OF COLLATZ OPERATIONS YOU DID AFTER THE FIRST TIME YOU REACHED LINE 39.

  let collatzStartingNum = null;

  for (let i = 0; 0 <= i && i < inputArr.length; ) {

    // if (DISPLAY_EXTRA_INFO) {
    //   console.log('NOW ON LINE:', i + 1, '|', registers);
    // }

    if (!collatzStartingNum && !DEBUG && i + 1 === 39) {
      collatzStartingNum = registers['a'];
      console.log('COLLATZ ANALYSIS BEGAN AT NUMBER:', collatzStartingNum);
    }

    const split = inputArr[i].split(' ');
    const instruction = split[0];
    const arg1 = split.length > 2 ? split[1].slice(0, -1) : split[1];           // if length 3+, must strip comma from arg1
    const arg2 = split[2];

    if (instruction === 'hlf') {
      if (registers[arg1] % 2) {                                                // sanity check to make sure we don't call hlf on odd number
        throw `ERROR: CANNOT HALF AN ODD VALUE AT registers[${arg1}]: ${
          registers[arg1]
        }`;
      }
      registers[arg1] /= 2;
    }

    else if (instruction === 'tpl') {
      registers[arg1] *= 3;
    }
    
    else if (instruction === 'inc') {
      registers[arg1] += 1;
    }

    else if (instruction === 'jmp') {
      i += (+arg1);
      continue;
    }

    else if (instruction === 'jie') {
      if (registers[arg1] % 2 === 0) {
        i += (+arg2);
        continue;
      }
    }
    
    else if (instruction === 'jio') {
      if (registers[arg1] === 1) {
        i += (+arg2);
        continue;
      }
    }

    ++i;
  }

  return registers['b'];
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = collatz;
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
`inc a
jio a, +2
tpl a
inc a`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 0;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 170;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 247;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);