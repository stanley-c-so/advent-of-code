/*

--- Day 12: Leonardo's Monorail ---

You finally reach the top floor of this building: a garden with a slanted glass ceiling. Looks like there are no more stars to be had.

While sitting on a nearby bench amidst some tiger lilies, you manage to decrypt some of the files you extracted from the servers downstairs.

According to these documents, Easter Bunny HQ isn't just this building - it's a collection of buildings in the nearby area. They're all connected by a local monorail, and there's another building not far from here! Unfortunately, being night, the monorail is currently not operating.

You remotely connect to the monorail control systems and discover that the boot sequence expects a password. The password-checking logic (your puzzle input) is easy to extract, but the code it uses is strange: it's assembunny code designed for the new computer you just assembled. You'll have to execute the code and get the password.

The assembunny code you've extracted operates on four registers (a, b, c, and d) that start at 0 and can hold any integer. However, it seems to make use of only a few instructions:

cpy x y copies x (either an integer or the value of a register) into register y.
inc x increases the value of register x by one.
dec x decreases the value of register x by one.
jnz x y jumps to an instruction y away (positive means forward; negative means backward), but only if x is not zero.

The jnz instruction moves relative to itself: an offset of -1 would continue at the previous instruction, while an offset of 2 would skip over the next instruction.

For example:

cpy 41 a
inc a
inc a
dec a
jnz a 2
dec a

The above code would set register a to 41, increase its value by 2, decrease its value by 1, and then skip the last dec a (because a is not zero, so the jnz a 2 skips it), leaving register a at 42. When you move past the last instruction, the program halts.

After executing the assembunny code in your puzzle input, what value is left in register a?


--- Part Two ---

As you head down the fire escape to the monorail, you notice it didn't start; register c needs to be initialized to the position of the ignition key.

If you instead initialize register c to be 1, what value is now left in register a?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function assembunny (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // DATA STRUCTURE
  const registers = {
    'a': 0,
    'b': 0,
    'c': part === 1 ? 0                                                               // PART 1: INIT REGISTER C AT 0
                    : 1,                                                              // PART 2: INIT REGISTER C AT 1
    'd': 0,
  };

  // ANALYZE
  const TIME_AT_START = Date.now();
  if (!DEBUG) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');
  for (let i = 0; i < inputArr.length; ) {                                            // NOTE: no ++i at the end
    const split = inputArr[i].split(' ');
    const instruction = split[0];
    const arg1 = split[1];
    const arg2 = split[2];

    if (instruction === 'cpy') {
      registers[arg2] = 'abcd'.includes(arg1) ? registers[arg1]                       // if arg1 is a register
                                              : +arg1;                                // if arg1 is a literal
    }
    else if (instruction === 'inc') {
      ++registers[arg1];
    }
    else if (instruction === 'dec') {
      --registers[arg1];
    }
    else if (instruction === 'jnz') {
      if ('abcd'.includes(arg1) && registers[arg1]                                    // if arg1 is a register and non-zero
          || !'abcd'.includes(arg1) && +arg1                                          // if arg1 is a literal and non-zero
      ) {

        i += 'abcd'.includes(arg2)  ? registers[arg2]                                 // if arg2 is a register (doesn't happen here, but it will in day 23)
                                    : +arg2;                                          // if arg2 is a literal
        continue;                                                                     // if executed jnz, skip the ++i
      }
    }
    else throw `ERROR: UNRECOGNIZED INSTRUCTION: ${instruction}`;

    ++i;                                                                              // ++i only if no executed jnz
  }

  if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
  return registers['a'];
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = assembunny;
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
`cpy 41 a
inc a
inc a
dec a
jnz a 2
dec a`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 42;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 318020;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 9227674;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);