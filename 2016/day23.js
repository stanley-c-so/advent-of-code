/*

--- Day 23: Safe Cracking ---

This is one of the top floors of the nicest tower in EBHQ. The Easter Bunny's private office is here, complete with a safe hidden behind a painting, and who wouldn't hide a star in a safe behind a painting?

The safe has a digital screen and keypad for code entry. A sticky note attached to the safe has a password hint on it: "eggs". The painting is of a large rabbit coloring some eggs. You see 7.

When you go to type the code, though, nothing appears on the display; instead, the keypad comes apart in your hands, apparently having been smashed. Behind it is some kind of socket - one that matches a connector in your prototype computer! You pull apart the smashed keypad and extract the logic circuit, plug it into your computer, and plug your computer into the safe.

Now, you just need to figure out what output the keypad would have sent to the safe. You extract the assembunny code from the logic chip (your puzzle input).
The code looks like it uses almost the same architecture and instruction set that the monorail computer used! You should be able to use the same assembunny interpreter for this as you did there, but with one new instruction:

tgl x toggles the instruction x away (pointing at instructions like jnz does: positive means forward; negative means backward):

For one-argument instructions, inc becomes dec, and all other one-argument instructions become inc.
For two-argument instructions, jnz becomes cpy, and all other two-instructions become jnz.
The arguments of a toggled instruction are not affected.
If an attempt is made to toggle an instruction outside the program, nothing happens.
If toggling produces an invalid instruction (like cpy 1 2) and an attempt is later made to execute that instruction, skip it instead.
If tgl toggles itself (for example, if a is 0, tgl a would target itself and become inc a), the resulting instruction is not executed until the next time it is reached.

For example, given this program:

cpy 2 a
tgl a
tgl a
tgl a
cpy 1 a
dec a
dec a

cpy 2 a initializes register a to 2.
The first tgl a toggles an instruction a (2) away from it, which changes the third tgl a into inc a.
The second tgl a also modifies an instruction 2 away from it, which changes the cpy 1 a into jnz 1 a.
The fourth line, which is now inc a, increments a to 3.
Finally, the fifth line, which is now jnz 1 a, jumps a (3) instructions ahead, skipping the dec a instructions.

In this example, the final value in register a is 3.

The rest of the electronics seem to place the keypad entry (the number of eggs, 7) in register a, run the code, and then send the value left in register a to the safe.

What value should be sent to the safe?


--- Part Two ---

The safe doesn't open, but it does make several angry noises to express its frustration.

You're quite sure your logic is working correctly, so the only other thing is... you check the painting again. As it turns out, colored eggs are still eggs. Now you count 12.

As you run the program with this new input, the prototype computer begins to overheat. You wonder what's taking so long, and whether the lack of any instruction more powerful than "add one" has anything to do with it. Don't bunnies usually multiply?

Anyway, what value should actually be sent to the safe?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function assembunnyRedux (part, inputStr, DEBUG = false) {

  // TO MAKE PART 2 RUN AT A REASONABLE SPEED, THE DOUBLY NESTED LOOPS INVOLVING REGISTERS a, c, AND d NEED TO BE
  // REINTERPRETED AND REFACTORED TO RUN MULTIPLICATION INSTEAD OF INCREMENTING IN A LOOP ('PEEPHOLE OPTIMIZATION').
  // THIS WAS A MANUAL PROCESS. AS A RESULT I HAD TO INVENT 2 NEW OPERATIONS, AND ADD CODE TO HANDLE A THIRD ARGUMENT.
  // MOREOVER, TO PRESERVE THE NUMBER OF INSTRUCTIONS, EACH TIME I REDUCED A BLOCK OF INSTRUCTIONS TO ONLY ONE NEW
  // INSTRUCTION, I PADDED THE REMAINING LINES WITHIN THAT BLOCK WITH 'tgl Infinity' WHICH IS SURE TO BE IGNORED BECAUSE
  // INDEX Infinity IS ALWAYS OUT OF BOUNDS

  const REAL_DATA_REINTERPRETED = `cpy a b
dec b
cpy a d
cpy 0 a
cpy b c
mul a c d
tgl Infinity
tgl Infinity
tgl Infinity
tgl Infinity
dec b
cpy b c
cpy c d
add c d
tgl Infinity
tgl Infinity
tgl c
cpy -16 c
jnz 1 c
cpy 75 c
jnz 72 d
mul a c d
tgl Infinity
tgl Infinity
tgl Infinity
tgl Infinity`.split('\n');

  const inputArr = DEBUG  ? inputStr.split('\r\n')
                          : REAL_DATA_REINTERPRETED;

  // DATA STRUCTURE
  const registers = {
    'a': part === 1 ? 7                                                               // PART 1: REGISTER a STARTS AS 7
                    : 12,                                                             // PART 2: REGISTER a STARTS AS 12
    'b': 0,
    'c': 0,
    'd': 0,
  };

  // ANALYZE
  const TIME_AT_START = Date.now();
  if (part === 2) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');
  let NEXT_MIN_TARGET = 1;
  for (let i = 0; i < inputArr.length; ) {                                            // NOTE: no ++i at the end

    // NOTE: THIS NAIVE SOLUTION FOR PART 2 TAKES ABOUT 12 MINUTES TO RUN!
    // BUT WITH THE REINTERPRETED INSTRUCTIONS, IT IS LIGHTNING FAST!
    if (DISPLAY_EXTRA_INFO
      && Math.floor((Date.now() - TIME_AT_START)/(1000*60)) === NEXT_MIN_TARGET)
    {
      console.log(`... ${
        Math.floor((Date.now() - TIME_AT_START)/(1000*60))
      } mins have passed since beginning this run`);
      ++NEXT_MIN_TARGET;
    }

    const split = inputArr[i].split(' ');
    const instruction = split[0];
    const arg1 = split[1];
    const arg2 = split[2];
    const arg3 = split[3];                                                            // NEEDED FOR REINTERPRETED INSTRUCTIONS

    if (instruction === 'cpy') {
      if ('abcd'.includes(arg2)) {                                                    // enforce arg2 is a register
        registers[arg2] = 'abcd'.includes(arg1) ? registers[arg1]                     // if arg1 is a register
                                                : +arg1;                              // if arg1 is a literal
      }
    }
    else if (instruction === 'inc') {
      if ('abcd'.includes(arg1)) {                                                    // enforce arg1 is a register
        ++registers[arg1];
      }
    }
    else if (instruction === 'dec') {
      if ('abcd'.includes(arg1)) {                                                    // enforce arg1 is a register
        --registers[arg1];
      }
    }
    else if (instruction === 'jnz') {
      if ('abcd'.includes(arg1) && registers[arg1]                                    // if arg1 is a register and non-zero
          || !'abcd'.includes(arg1) && +arg1                                          // if arg1 is a literal and non-zero
      ) {
        i += 'abcd'.includes(arg2)  ? registers[arg2]                                 // if arg2 is a register
                                    : +arg2;                                          // if arg2 is a literal
        continue;                                                                     // if executed jnz, skip the ++i
      }
    }
    else if (instruction === 'tgl') {
      if ('abcd'.includes(arg1)) {                                                    // enforce arg1 is a register
        const targetIdx = i + registers[arg1];
        if (0 <= targetIdx && targetIdx < inputArr.length) {
          const targetInstructionLine = inputArr[targetIdx];
          const targetSplit = targetInstructionLine.split(' ');
          switch (targetSplit[0]) {
            case 'cpy':
              targetSplit[0] = 'jnz';
              break;
            case 'inc':
              targetSplit[0] = 'dec';
              break;
            case 'dec':
              targetSplit[0] = 'inc';
              break;
            case 'jnz':
              targetSplit[0] = 'cpy';
              break;
            case 'tgl':
              targetSplit[0] = 'inc';
              break;
            default:
              throw `ERROR: UNRECOGNIZED INSTRUCTION ${targetSplit[0]}`;
          }
          inputArr[targetIdx] = targetSplit.join(' ');
        }
      }
    }
    else if (instruction === 'mul') {                                                 // NEEDED FOR REINTERPRETED INSTRUCTIONS
      // add to the register in arg1 the absolute value of the product of the arg2 and arg3...
      // ...then set the registers in arg2 and arg3 to 0
      registers[arg1] += Math.abs(registers[arg2] * registers[arg3]);
      registers[arg2] = 0;
      registers[arg3] = 0;
    }
    else if (instruction === 'add') {                                                 // NEEDED FOR REINTERPRETED INSTRUCTIONS
      // add to the register in arg1 the absolute value of arg2...
      // ...then set the register in arg2 to 0
      registers[arg1] += Math.abs(registers[arg2]);
      registers[arg2] = 0;
    }
    else throw `ERROR: UNRECOGNIZED INSTRUCTION: ${instruction}`;

    ++i;                                                                              // ++i only if no executed jnz
  }

  if (part === 2) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
  return registers['a'];
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = assembunnyRedux;
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
`cpy 2 a
tgl a
tgl a
tgl a
cpy 1 a
dec a
dec a`
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
expected = 10440;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 479007000;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);