/*

--- Day 25: Clock Signal ---

You open the door and find yourself on the roof. The city sprawls away from you for miles and miles.

There's not much time now - it's already Christmas, but you're nowhere near the North Pole, much too far to deliver these stars to the sleigh in time.

However, maybe the huge antenna up here can offer a solution. After all, the sleigh doesn't need the stars, exactly; it needs the timing data they provide, and you happen to have a massive signal generator right here.

You connect the stars you have to your prototype computer, connect that to the antenna, and begin the transmission.

Nothing happens.

You call the service number printed on the side of the antenna and quickly explain the situation. "I'm not sure what kind of equipment you have connected over there," he says, "but you need a clock signal." You try to explain that this is a signal for a clock.

"No, no, a clock signal - timing information so the antenna computer knows how to read the data you're sending it. An endless, alternating pattern of 0, 1, 0, 1, 0, 1, 0, 1, 0, 1...." He trails off.

You ask if the antenna can handle a clock signal at the frequency you would need to use for the data from the stars. "There's no way it can! The only antenna we've installed capable of that is on top of a top-secret Easter Bunny installation, and you're definitely not-" You hang up the phone.

You've extracted the antenna's clock signal generation assembunny code (your puzzle input); it looks mostly compatible with code you worked on just recently.

This antenna code, being a signal generator, uses one extra instruction:

out x transmits x (either an integer or the value of a register) as the next value for the clock signal.

The code takes a value (via register a) that describes the signal to generate, but you're not sure how it's used. You'll have to find the input to produce the right signal through experimentation.

What is the lowest positive integer that can be used to initialize register a and cause the code to output a clock signal of 0, 1, 0, 1... repeating forever?


--- Part Two ---

The antenna is ready. Now, all you need is the fifty stars required to generate the signal for the sleigh, but you don't have enough.

You look toward the sky in desperation... suddenly noticing that a lone star has been installed at the top of the antenna! Only 49 more to go.

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function assembunnyFinal (part, inputStr, DEBUG = false) {

  // NOTE THAT UNLIKE IN DAY 23, WE DO NOT NEED TO REINTERPRET ANY OF THESE INSTRUCTIONS WITH PEEPHOLE OPTIMIZATIONS. IT TURNS OUT THAT IT RUNS
  // SUFFICIENTLY QUICKLY TO GET THROUGH ONE CYCLE - AND YOU ONLY NEED ONE CYCLE PER VALUE OF a - AND THE CORRECT VALUE OF a IS NOT PARTICULARLY
  // HIGH. SO WE CAN ACTUALLY LEAVE THE INSTRUCTIONS ALONE!

  const inputArr = inputStr.split('\r\n');

  // HELPER FUNCTION
  function runAssembunny(startValA, LAST_LINE_LIMIT) {

    // DATA STRUCTURES
    const registers = {
      'a': startValA,
      'b': 0,
      'c': 0,
      'd': 0,
    };

    let signal = '';

    // INIT
    let numTimesReachedLastLine = 0;

    // RUN INSTRUCTIONS
    for (let i = 0; i < inputArr.length; ) {                                            // NOTE: no ++i at the end

      // END CONDITION: REACHED LAST LINE
      if (i === inputArr.length - 1) ++numTimesReachedLastLine;
      if (numTimesReachedLastLine === LAST_LINE_LIMIT) return signal;                   // it turns out that by the time you reach the last line,
                                                                                        // the signal will have completely filled up with the part
                                                                                        // that gets repeated. so you only need to run the instructions
                                                                                        // once to see what the repeated signal will be.

      const split = inputArr[i].split(' ');
      const instruction = split[0];
      const arg1 = split[1];
      const arg2 = split[2];
      // const arg3 = split[3];                                                            // NEEDED FOR REINTERPRETED INSTRUCTIONS

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
      // else if (instruction === 'mul') {                                                 // NEEDED FOR REINTERPRETED INSTRUCTIONS
      //   // add to the register in arg1 the absolute value of the product of the arg2 and arg3...
      //   // ...then set the registers in arg2 and arg3 to 0
      //   registers[arg1] += Math.abs(registers[arg2] * registers[arg3]);
      //   registers[arg2] = 0;
      //   registers[arg3] = 0;
      // }
      // else if (instruction === 'add') {                                                 // NEEDED FOR REINTERPRETED INSTRUCTIONS
      //   // add to the register in arg1 the absolute value of arg2...
      //   // ...then set the register in arg2 to 0
      //   registers[arg1] += Math.abs(registers[arg2]);
      //   registers[arg2] = 0;
      // }
      else if (instruction === 'out') {
        signal += 'abcd'.includes(arg1) ? registers[arg1]                               // if arg1 is a register
                                        : +arg1;                                        // if arg1 is a literal
      }
      else throw `ERROR: UNRECOGNIZED INSTRUCTION: ${instruction}`;

      ++i;                                                                              // ++i only if no executed jnz
    }
  }

  // CONSTANTS
  const LIMIT = Number.MAX_SAFE_INTEGER;
  const LAST_LINE_LIMIT = 1;                                                            // this can be 1, because the last line is what
                                                                                        // causes the thing to keep outputting a signal
                                                                                        // forever, but you already have the entire repeated
                                                                                        // signal after only one iteration, so you can
                                                                                        // stop running the function as soon as you hit
                                                                                        // the last line!
  
  // ANALYZE
  const TIME_AT_START = Date.now();
  console.log('RUNNING ANALYSIS (PLEASE WAIT)...');

  for (let a = 1; a <= LIMIT; ++a) {
    console.log('NOW RUNNING ASSEMBUNNY WITH a:', a)
    const signal = runAssembunny(a, LAST_LINE_LIMIT);
    if (DISPLAY_EXTRA_INFO) console.log('SIGNAL:', signal);

    const GOAL = '01'.repeat(Math.floor(signal.length / 2));                            // it turns out the signal will always be length 12,
                                                                                        // so the goal will always be '010101010101'
    if (signal === GOAL) {
      console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
      return a;
    }

    console.log('-----');
  }

  console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
  throw 'ERROR: NO SOLUTION FOUND';
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = assembunnyFinal;
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

// const sampleInput = parseSampleInput(
// ``
// );

// Test case 1
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 196;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);