/*

--- Day 16: Permutation Promenade ---

You come upon a very unusual sight; a group of programs here appear to be dancing.

There are sixteen programs in total, named a through p. They start by standing in a line: a stands in position 0, b stands in position 1, and so on until p, which stands in position 15.

The programs' dance consists of a sequence of dance moves:

Spin, written sX, makes X programs move from the end to the front, but maintain their order otherwise. (For example, s3 on abcde produces cdeab).
Exchange, written xA/B, makes the programs at positions A and B swap places.
Partner, written pA/B, makes the programs named A and B swap places.

For example, with only five programs standing in a line (abcde), they could do the following dance:

s1, a spin of size 1: eabcd.
x3/4, swapping the last two programs: eabdc.
pe/b, swapping programs e and b: baedc.

After finishing their dance, the programs end up in order baedc.

You watch the dance for a while and record their dance moves (your puzzle input). In what order are the programs standing after their dance?


--- Part Two ---

Now that you're starting to get a feel for the dance moves, you turn your attention to the dance as a whole.

Keeping the positions they ended up in from their previous dance, the programs perform it again and again: including the first dance, a total of one billion (1000000000) times.

In the example above, their second dance would begin with the order baedc, and use the same dance moves:

s1, a spin of size 1: cbaed.
x3/4, swapping the last two programs: cbade.
pe/b, swapping programs e and b: ceadb.
In what order are the programs standing after their billion dances?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function findPeriodOfScrambleInstructions (part, inputStr, extraParam, DEBUG = false) {
  
  // CONSTANTS
  const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
  const NUM_PROGRAMS = extraParam;
  const MOVES = inputStr.split(',');
  const NUM_ROUNDS = part === 1 ? 1                                                           // PART 1: DANCE ONCE
                                : 1000000000;                                                 // PART 2: DANCE 1 BIL TIMES

  // UTILITY FUNCTION
  const serialize = PROGRAMS => PROGRAMS.join('');

  // DATA STRUCTURES
  const PROGRAMS = [ ...Array(NUM_PROGRAMS).keys() ].map(idx => ALPHABET[idx]);
  const SEEN = {};
  SEEN[serialize(PROGRAMS)] = 0;
  const RESULTS = [ serialize(PROGRAMS) ];

  const TIME_AT_START = Date.now();
  if (part === 2) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');

  for (let round = 1; round <= NUM_ROUNDS; ++round) {
    for (const move of MOVES) {
      if (move[0] === 's') {                                                                  // SPIN
        const N = +move.slice(1);
        const firstSegment = PROGRAMS.slice(-N);
        const secondSegment = PROGRAMS.slice(0, -N);
        PROGRAMS.length = 0;
        PROGRAMS.push( ...firstSegment, ...secondSegment );
      }
      else if (move[0] === 'x') {                                                             // EXCHANGE
        const [ idxA, idxB ] = move.slice(1).split('/').map(n => +n);
        [ PROGRAMS[idxA], PROGRAMS[idxB] ] = [ PROGRAMS[idxB], PROGRAMS[idxA] ];
      }
      else if (move[0] === 'p') {                                                             // PARTNER
        const [ A, B ] = move.slice(1).split('/');
        const idxA = PROGRAMS.indexOf(A);
        const idxB = PROGRAMS.indexOf(B);
        [ PROGRAMS[idxA], PROGRAMS[idxB] ] = [ PROGRAMS[idxB], PROGRAMS[idxA] ];
      }
      else throw `ERROR: UNRECOGNIZED FIRST CHARACTER ${move[0]}`;
    }

    // PART 2: INSTEAD OF SIMULATING ALL 1 BIL MOVES, FIND THE PERIOD OF THE CYCLE, THEN SKIP AHEAD
    if (part === 2) {
      const serial = serialize(PROGRAMS);
      if (serial in SEEN) {
        if (DISPLAY_EXTRA_INFO) {
          console.log(`AFTER ROUND ${round}, REPEATED ${serial} FROM ROUND ${SEEN[serial]}`);
        }
        const period = round - SEEN[serial];
        const numRoundsRemaining = (NUM_ROUNDS - round) % period;
        if (part === 2) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
        return RESULTS[ (round + numRoundsRemaining) % period ];
      }
      SEEN[serial] = round;
      RESULTS.push(serial);
    }
  }

  if (part === 2) {
    console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    throw 'ERROR: IN PART 2, SHOULD HAVE FOUND THE ANSWER BEFORE FOR LOOP TERMINATES';
  }

  return PROGRAMS.join('');
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = findPeriodOfScrambleInstructions;
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
`s1,x3/4,pe/b`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: 5,
  DEBUG: true,
};
expected = 'baedc';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: 16,
};
expected = 'kgdchlfniambejop';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: 16,
};
expected = 'fjpmholcibdgeakn';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);