/*

--- Day 21: Chronal Conversion ---

You should have been watching where you were going, because as you wander the new North Pole base, you trip and fall into a very deep hole!

Just kidding. You're falling through time again.

If you keep up your current pace, you should have resolved all of the temporal anomalies by the next time the device activates. Since you have very little interest in browsing history in 500-year increments for the rest of your life, you need to find a way to get back to your present time.

After a little research, you discover two important facts about the behavior of the device:

First, you discover that the device is hard-wired to always send you back in time in 500-year increments. Changing this is probably not feasible.

Second, you discover the activation system (your puzzle input) for the time travel module. Currently, it appears to run forever without halting.

If you can cause the activation system to halt at a specific moment, maybe you can make the device send you so far back in time that you cause an integer underflow in time itself and wrap around back to your current time!

The device executes the program as specified in manual section one and manual section two.

Your goal is to figure out how the program works and cause it to halt. You can only control register 0; every other register begins at 0 as usual.

Because time travel is a dangerous activity, the activation system begins with a few instructions which verify that bitwise AND (via bani) does a numeric operation and not an operation as if the inputs were interpreted as strings. If the test fails, it enters an infinite loop re-running the test instead of allowing the program to execute normally. If the test passes, the program continues, and assumes that all other bitwise operations (banr, bori, and borr) also interpret their inputs as numbers. (Clearly, the Elves who wrote this system were worried that someone might introduce a bug while trying to emulate this system with a scripting language.)

What is the lowest non-negative integer value for register 0 that causes the program to halt after executing the fewest instructions? (Executing the same instruction multiple times counts as multiple instructions executed.)


--- Part Two ---

In order to determine the timing window for your underflow exploit, you also need an upper bound:

What is the lowest non-negative integer value for register 0 that causes the program to halt after executing the most instructions? (The program must actually halt; running forever does not count as halting.)

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function makeTheProgramHalt (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // CONSTANTS
  const [ ADDR, ADDI, MULR, MULI, BANR, BANI, BORR, BORI, SETR, SETI, GTIR, GTRI, GTRR, EQIR, EQRI, EQRR ] =
    [ 'addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr' ];

  // DATA STRUCTURES
  const INSTRUCTIONS = [];
  const REGISTERS = [ 0, 0, 0, 0, 0, 0 ];

  // INIT
  const IP_BINDING = +inputArr[0].split(' ')[1];

  // PARSE INPUT DATA
  for (let i = 1; i < inputArr.length; ++i) {                                             // skip first line
    const line = inputArr[i];
    const split = line.split(' ');
    const opCode = split[0];
    const A = +split[1];
    const B = +split[2];
    const C = +split[3];
    INSTRUCTIONS.push([ opCode, A, B, C ]);
  }

  // HELPER FUNCTION - RUNS A SINGLE LINE OF THE VM
  function runOpCode(REGISTERS, opCode, A, B, C) {
    if (opCode === ADDR) {
      REGISTERS[C] = REGISTERS[A] + REGISTERS[B];
    }
    else if (opCode === ADDI) {
      REGISTERS[C] = REGISTERS[A] + B;
    }
    else if (opCode === MULR) {
      REGISTERS[C] = REGISTERS[A] * REGISTERS[B];
    }
    else if (opCode === MULI) {
      REGISTERS[C] = REGISTERS[A] * B;
    }
    else if (opCode === BANR) {
      REGISTERS[C] = REGISTERS[A] & REGISTERS[B];
    }
    else if (opCode === BANI) {
      REGISTERS[C] = REGISTERS[A] & B;
    }
    else if (opCode === BORR) {
      REGISTERS[C] = REGISTERS[A] | REGISTERS[B];
    }
    else if (opCode === BORI) {
      REGISTERS[C] = REGISTERS[A] | B;
    }
    else if (opCode === SETR) {
      REGISTERS[C] = REGISTERS[A];
    }
    else if (opCode === SETI) {
      REGISTERS[C] = A;
    }
    else if (opCode === GTIR) {
      REGISTERS[C] = A > REGISTERS[B] ? 1 : 0;
    }
    else if (opCode === GTRI) {
      REGISTERS[C] = REGISTERS[A] > B ? 1 : 0;
    }
    else if (opCode === GTRR) {
      REGISTERS[C] = REGISTERS[A] > REGISTERS[B] ? 1 : 0;
    }
    else if (opCode === EQIR) {
      REGISTERS[C] = A === REGISTERS[B] ? 1 : 0;
    }
    else if (opCode === EQRI) {
      REGISTERS[C] = REGISTERS[A] === B ? 1 : 0;
    }
    else if (opCode === EQRR) {
      REGISTERS[C] = REGISTERS[A] === REGISTERS[B] ? 1 : 0;
    }
    else throw `ERROR: UNRECOGNIZED OP CODE ${opCode}`;
  }

  // INIT
  let IP_VALUE = 0;
  const SEEN_R3_ON_LINE_28 = new Set();
  let lastUniqueR3OnLine28 = null;
  
  let numLinesRun = 0;                                                              // only for extra info

  // ANALYZE
  const TIME_AT_START = Date.now();
  if (part === 2) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');

  while (0 <= IP_VALUE && IP_VALUE < INSTRUCTIONS.length) {

    const [ opCode, A, B, C ] = INSTRUCTIONS[IP_VALUE];
    REGISTERS[IP_BINDING] = IP_VALUE;

    runOpCode(REGISTERS, opCode, A, B, C);
    ++numLinesRun;

    // EXPLANATION:
    //
    // LINES 0 TO 5 ONLY EVER GET RUN ONCE, AND I DON'T THINK THEY DO ANYTHING BECAUSE THEY ESSENTIALLY ONLY CHANGE R3,
    // BUT THEN BY THE TIME YOU BREAK OUT OF THE INITIAL LOOP AND HIT LINE 5, R3 GETS SET BACK TO 0. RED HERRING PERHAPS?
    //
    // R3 = 123;
    // do {
    //   R3 = R3 * 456;
    // } while (R3 !== 72)
    // R3 = 0;
    //
    // LINES 6 TO 30 FORM ONE GIANT LOOP THAT REPEATS FOREVER; R1 GETS TO R3 | 65536, THEN R3 GETS RESET TO 9450265 AT THE START.
    // THEN WE MOVE DIRECTLY INTO THE NEXT NESTED LOOP.
    //
    // LINES 8 TO 27 FORM THE NEXT NESTED LOOP. HERE, WE START WITH A "TRANSFORMATION" OF R3: FIRST, WE GO R3 += R1 % 256 (NOT SURE WHY),
    // THEN MOD ITSELF BY 16777216, MULTIPLY ITSELF BY 65899, THEN MOD ITSELF BY 16777216 AGAIN. THEN, IF R1 IS LESS THAN 256, WE
    // POTENTIALLY CHECK FOR AN EXIT IF R3 IS EQUAL TO R0 (WHICH NEVER CHANGES; THIS IS THE "INPUT" OF THE PROGRAM). ELSE, WE RESTART THE
    // OUTER LOOP.
    //
    // IF R1 WAS NOT LESS THAN 256, THEN INSTEAD WE HAVE AN EVEN DEEPER NESTED LOOP FROM LINES 18 TO 25, WHICH ESSENTIALLY SET R1 TO
    // THE FLOOR OF ITSELF DIVIDED BY 256. THEN WE RESTART THE MIDDLE LOOP, LEADING TO THE NEXT TRANSFORMATION OF R3.
    //
    // I'M NOT REALLY SURE WHAT THE PATTERN IS, OR HOW TO DESCRIBE AT A HIGH LEVEL WHAT THE TRANSFORMATION OF R3 IS REALLY ABOUT, BUT THE
    // POINT IS THAT ON LINE 28, WE ARE CHECKING R3 AGAINST R0. THE ONLY WAY THE PROGRAM WILL TERMINATE IS IF R0 WAS INITIALLY SET TO
    // SOME VALUE THAT R3 WILL EVENTUALLY REACH. THIS IS WHY WHEN WE REACH LINE 28, WE EITHER RETURN IMMEDIATELY IN PART 1 BECAUSE WE
    // WANT TO HAVE EXECUTED THE FEWEST INSTRUCTIONS, OR WE WAIT UNTIL R3 SEEMS TO BEGIN REPEATING AGAIN IN PART 2 SO WE KNOW WE HAVE
    // EXECUTED THE GREATEST POSSIBLE NUMBER OF INSTRUCTIONS WITHOUT GOING FOREVER. OF COURSE, IT IS NOT OBVIOUS (TO ME ANYWAY) THAT R3
    // NEVER REPEATS ITSELF UNTIL IT HAS EXHAUSTED ALL OF ITS POSSIBILITIES - IN OTHER WORDS, THERE IS A CYCLE, BUT IT IS NOT OBVIOUS WHY.
    // THIS IS ESPECIALLY TRUE BECAUSE THE STATE OF THE REGISTERS SEEMS TO DEPEND ON MORE THAN JUST R3, BUT WHAT DO I KNOW.


    if (IP_VALUE === 28) {
      if (part === 1) {                                                             // PART 1: EXECUTE THE FEWEST INSTRUCTIONS
                                                                                    // (i.e. make program halt as early as possible)

        return REGISTERS[3];

      } else {                                                                      // PART 2: EXECUTE THE MOST INSTRUCTIONS
                                                                                    // (i.e. make program halt as late as possible - this means
                                                                                    // the last unique value of R3 that gets checked against R0)

        if (SEEN_R3_ON_LINE_28.has(REGISTERS[3])) {
          console.log(`RAN A TOTAL OF ${numLinesRun} MOVES`)
          console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
          return lastUniqueR3OnLine28;                                              // return NOT REGISTERS[3] now, but what it was previously
        }
        lastUniqueR3OnLine28 = REGISTERS[3];
        SEEN_R3_ON_LINE_28.add(lastUniqueR3OnLine28);

      }
    }

    IP_VALUE = REGISTERS[IP_BINDING];
    ++IP_VALUE;

    if (DISPLAY_EXTRA_INFO
        && numLinesRun % 100000000 === 0
    ) {
      console.log(`Number of lines run so far (in 100 million increments): ${numLinesRun}`);
    }
  }

  throw 'ERROR: SHOULD NOT ACTUALLY BE EXITING THE PROGRAM FOR PURPOSES OF SOLVING THIS PROBLEM';
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = makeTheProgramHalt;
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
expected = 986758;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 16016565;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);