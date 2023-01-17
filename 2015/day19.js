/*

--- Day 19: Medicine for Rudolph ---

Rudolph the Red-Nosed Reindeer is sick! His nose isn't shining very brightly, and he needs medicine.

Red-Nosed Reindeer biology isn't similar to regular reindeer biology; Rudolph is going to need custom-made medicine. Unfortunately, Red-Nosed Reindeer chemistry isn't similar to regular reindeer chemistry, either.

The North Pole is equipped with a Red-Nosed Reindeer nuclear fusion/fission plant, capable of constructing any Red-Nosed Reindeer molecule you need. It works by starting with some input molecule and then doing a series of replacements, one per step, until it has the right molecule.

However, the machine has to be calibrated before it can be used. Calibration involves determining the number of molecules that can be generated in one step from a given starting point.

For example, imagine a simpler machine that supports only the following replacements:

H => HO
H => OH
O => HH

Given the replacements above and starting with HOH, the following molecules could be generated:

HOOH (via H => HO on the first H).
HOHO (via H => HO on the second H).
OHOH (via H => OH on the first H).
HOOH (via H => OH on the second H).
HHHH (via O => HH).

So, in the example above, there are 4 distinct molecules (not five, because HOOH appears twice) after one replacement from HOH. Santa's favorite molecule, HOHOHO, can become 7 distinct molecules (over nine replacements: six from H, and three from O).

The machine replaces without regard for the surrounding characters. For example, given the string H2O, the transition H => OO would result in OO2O.

Your puzzle input describes all of the possible replacements and, at the bottom, the medicine molecule for which you need to calibrate the machine. How many distinct molecules can be created after all the different ways you can do one replacement on the medicine molecule?


Your puzzle answer was 576.

--- Part Two ---

Now that the machine is calibrated, you're ready to begin molecule fabrication.

Molecule fabrication always begins with just a single electron, e, and applying replacements one at a time, just like the ones during calibration.

For example, suppose you have the following replacements:

e => H
e => O
H => HO
H => OH
O => HH

If you'd like to make HOH, you start with e, and then make the following replacements:

e => O to get O
O => HH to get HH
H => OH (on the second H) to get HOH

So, you could make HOH after 3 steps. Santa's favorite molecule, HOHOHO, can be made in 6 steps.

How long will it take to make the medicine? Given the available replacements and the medicine molecule in your puzzle input, what is the fewest number of steps to go from e to the medicine molecule?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function stepByStepTransformation (part, inputStr, DEBUG = false) {
  const [ TRANSFORMATIONS_STR, MEDICINE ] = inputStr.split('\r\n\r\n');

  // CONSTANTS
  const [ A, B ] = [ 'A', 'B' ]                                                             // directions A and B to support bidirectional BFS
                                                                                            // (even though final solution doesn't need it)
  const ELECTRON = 'e';

  // DATA STRUCTURES
  const TRANSFORMATIONS_A = {};                                                             // A and B to support bidirectional BFS
  const TRANSFORMATIONS_B = {};                                                             // (even though final solution doesn't need it)

  // PARSE INPUT DATA
  for (const line of TRANSFORMATIONS_STR.split('\r\n')) {
    const [ LS, RS ] = line.split(' => ');
    if (!(LS in TRANSFORMATIONS_A)) TRANSFORMATIONS_A[LS] = [];
    if (!(RS in TRANSFORMATIONS_B)) TRANSFORMATIONS_B[RS] = [];
    TRANSFORMATIONS_A[LS].push(RS);
    TRANSFORMATIONS_B[RS].push(LS);
  }
  const TRANSFORMATIONS_A_SEQUENCES = Object.keys(TRANSFORMATIONS_A)
                                            .sort((a, b) => b.length - a.length);           // greedily sort by longest first
  const TRANSFORMATIONS_B_SEQUENCES = Object.keys(TRANSFORMATIONS_B)
                                            .sort((a, b) => b.length - a.length);

  // HELPER FUNCTION - GIVEN A STARTING MOLECULE, RETURN THE SET OF MOLECULES YOU CAN MAKE IN ONE STEP
  const MEMO = { A: {}, B: {} };
  function getTransformedMolecule(molecule, direction) {
    if (!(molecule in MEMO[direction])) {
      const TRANSFORMATIONS = direction === A ? TRANSFORMATIONS_A
                                              : TRANSFORMATIONS_B;
      const TRANSFORMATIONS_SEQUENCES = direction === A ? TRANSFORMATIONS_A_SEQUENCES
                                                        : TRANSFORMATIONS_B_SEQUENCES;
      const RESULTS = new Set();                                                            // set helps to account for duplicates

      for (let i = 0; i < molecule.length; ++i) {                                           // iterate through every character of molecule...
        for (const sequence of TRANSFORMATIONS_SEQUENCES) {                                 // for every transformation sequence...
          if (i < molecule.length - sequence.length + 1) {
            const segment = molecule.slice(i, i + sequence.length);
            if (segment === sequence) {                                                     // ...check if a sequence begins at this segment
              for (const transformed of TRANSFORMATIONS[sequence]) {                        // if so, then for every transformation...
                const res = molecule.slice(0, i)
                              + transformed
                              + molecule.slice(i + sequence.length);
                RESULTS.add(res);                                                           // ...add the new result to RESULTS set
              }
            }
          }
        }
      }
      MEMO[direction][molecule] = RESULTS;
    }
    return MEMO[direction][molecule];
  }

  
  // ANALYZE
  if (part === 1) {                                                                         // PART 1: COUNT # OF FORWARD TRANSFORMATIONS FROM MEDICINE

    return getTransformedMolecule(MEDICINE, A).size;
    
  } else {                                                                                  // PART 2: FIND MIN MOVES FROM ELECTRON TO MEDICINE
                                                                                            // (OR, AS HERE, FROM MEDICINE TO ELECTRON, WITH THE THEORY
                                                                                            // THAT IT WOULD BE FASTER TO REDUCE SPECIFIC LENGTHY SEQUENCES
                                                                                            // (e.g. 'CRnFYFYFAr') TO THEIR ORIGINS)
    
    const TIME_AT_START = Date.now();
    if (!DEBUG) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');
    let NEXT_MIN_TARGET = 1;

    // ANALYZE BACKTRACKING
    let minMoves = Infinity;
    const fail = new Set();
    
    function backtrack(molecule, moves) {

      if (DISPLAY_EXTRA_INFO
          && Math.floor((Date.now() - TIME_AT_START)/(1000*60)) === NEXT_MIN_TARGET
      ) {
        console.log(`... ${
          Math.floor((Date.now() - TIME_AT_START)/(1000*60))
        } mins have passed since beginning this run`);
        ++NEXT_MIN_TARGET;
      }

      // BASE CASE - FAIL
      if (fail.has(molecule)) return false;                                                 // OPTIMIZATION: SKIP THE ONES THAT FAIL

      // BASE CASE - SUCCESS
      if (molecule === ELECTRON) {
        if (moves < minMoves) {
          if (DISPLAY_EXTRA_INFO) console.log('SUCCESS! New minMoves:', moves);
          minMoves = moves;
        }
        return true;
      }

      // RECURSIVE CASE
      const nextMolecules = [ ...getTransformedMolecule(molecule, B) ]
                              .filter(next => !fail.has(next));                             // MINI-OPTIMIZATION: DON'T RECURSE ON THE ONES THAT FAIL                              
      for (const next of nextMolecules) {
        if (backtrack(next, moves + 1)) return true;                                        // OPTIMIZATION: IF ANY MOVE SUCCEEDS, SKIP OTHER MOVES
                                                                                            // but is this theoretically correct? not if you find
                                                                                            // a non-optimal success before finding an optimal one.
                                                                                            // however, i wonder if the greedy method counteracts
                                                                                            // this, given the type of data we have. moreover,
                                                                                            // apparently the creator of this puzzle has said that
                                                                                            // there will only ever be ONE answer anyway (i.e.
                                                                                            // 'find the shortest answer' was a distraction!)
      }
      fail.add(molecule);
      return false;
    }

    backtrack(MEDICINE, 0);                                                                 // see notes above - we start at MEDICINE and try to find ELECTRON
    if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    if (minMoves === Infinity) throw 'ERROR: NO SOLUTION FOUND';
    return minMoves;


    // // ANALYZE BIDIRECTIONAL BFS
    // // NOTE: THIS WILL CAUSE NODE TO RUN OUT OF MEMORY, BUT THEORETICALLY IT SHOULD WORK
    
    // const { Queue } = require('./_classes');
    // const Q = new Queue();
    // Q.enqueue([ ELECTRON, 0, A ]);
    // Q.enqueue([ MEDICINE, 0, B ]);
    // const [ visitedA, visitedB ] = [ {}, {} ];

    // while (!Q.isEmpty()) {

    //   if (DISPLAY_EXTRA_INFO
    //     && Math.floor((Date.now() - TIME_AT_START)/(1000*60)) === NEXT_MIN_TARGET)
    //   {
    //     console.log(`... ${
    //       Math.floor((Date.now() - TIME_AT_START)/(1000*60))
    //     } mins have passed since beginning this run`);
    //     ++NEXT_MIN_TARGET;
    //   }

    //   const [ molecule, moves, direction ] = Q.dequeue().val;

    //   const [ visited, otherVisited ] = direction === A ? [ visitedA, visitedB ]
    //                                                     : [ visitedB, visitedA ];

    //   if (molecule in visited) {
    //     // if (DEBUG) console.log(`SKIP ${direction}:`, molecule);
    //     continue;
    //   }
    //   visited[molecule] = moves;

    //   // if (molecule === (direction === A ? MEDICINE : ELECTRON)) {
    //   //   if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    //   //   if (DEBUG) console.log(Object.keys(visited).length)
    //   //   return moves;
    //   // }
    //   if (molecule in otherVisited) {
    //     if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    //     console.log(`${direction} SUCCESS:`, molecule)
    //     if (DEBUG) console.log(Object.keys(visited).length);
    //     if (DEBUG) console.log(Object.keys(otherVisited).length);
    //     return moves + otherVisited[molecule];
    //   }

    //   const nextMolecule = getTransformedMolecule(molecule, direction);
    //   for (const next of nextMolecule) {
    //     if (!(next in visited)) {
    //       Q.enqueue([ next, moves + 1, direction ]);
    //     }
    //   }
    // }

    // if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    // throw 'ERROR: NO SOLUTION FOUND';

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = stepByStepTransformation;
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
`H => HO
H => OH
O => HH

HOH`
);

const sampleInput2 = parseSampleInput(
`H => HO
H => OH
O => HH

HOHOHO`
);

const sampleInput3 = parseSampleInput(
`e => H
e => O
H => HO
H => OH
O => HH

HOH`
);

const sampleInput4 = parseSampleInput(
`e => H
e => O
H => HO
H => OH
O => HH

HOHOHO`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 4;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 7;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 576;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 2,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = 6;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 207;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);