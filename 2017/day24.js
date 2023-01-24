/*

--- Day 24: Electromagnetic Moat ---

The CPU itself is a large, black building surrounded by a bottomless pit. Enormous metal tubes extend outward from the side of the building at regular intervals and descend down into the void. There's no way to cross, but you need to get inside.

No way, of course, other than building a bridge out of the magnetic components strewn about nearby.

Each component has two ports, one on each end. The ports come in all different types, and only matching types can be connected. You take an inventory of the components by their port types (your puzzle input). Each port is identified by the number of pins it uses; more pins mean a stronger connection for your bridge. A 3/7 component, for example, has a type-3 port on one side, and a type-7 port on the other.

Your side of the pit is metallic; a perfect surface to connect a magnetic, zero-pin port. Because of this, the first port you use must be of type 0. It doesn't matter what type of port you end with; your goal is just to make the bridge as strong as possible.

The strength of a bridge is the sum of the port types in each component. For example, if your bridge is made of components 0/3, 3/7, and 7/4, your bridge has a strength of 0+3 + 3+7 + 7+4 = 24.

For example, suppose you had the following components:

0/2
2/2
2/3
3/4
3/5
0/1
10/1
9/10

With them, you could make the following valid bridges:

0/1
0/1--10/1
0/1--10/1--9/10
0/2
0/2--2/3
0/2--2/3--3/4
0/2--2/3--3/5
0/2--2/2
0/2--2/2--2/3
0/2--2/2--2/3--3/4
0/2--2/2--2/3--3/5

(Note how, as shown by 10/1, order of ports within a component doesn't matter. However, you may only use each port on a component once.)

Of these bridges, the strongest one is 0/1--10/1--9/10; it has a strength of 0+1 + 1+10 + 10+9 = 31.

What is the strength of the strongest bridge you can make with the components you have available?


--- Part Two ---

The bridge you've built isn't long enough; you can't jump the rest of the way.

In the example above, there are two longest bridges:

0/2--2/2--2/3--3/4
0/2--2/2--2/3--3/5
Of them, the one which uses the 3/5 component is stronger; its strength is 0+2 + 2+2 + 2+3 + 3+5 = 19.

What is the strength of the longest bridge you can make? If you can make multiple bridges of the longest length, pick the strongest one.

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function arrangePiecesWithConnectingEdgesInLine (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // DATA STRUCTURES
  const COMPONENTS = [];
  const UNUSED = new Set();
  const BRIDGES_BY_LENGTH = {};

  // PARSE INPUT DATA
  const CHECK_FOR_DUPLICATES = new Set();
  for (let i = 0; i < inputArr.length; ++i) {
    const line = inputArr[i];
    const [ A, B ] = line.split('/').map(n => +n);
    const forward = `${A},${B}`;
    const backward = `${B},${A}`;

    if (CHECK_FOR_DUPLICATES.has(forward)                                                   // SANITY CHECK: enforce no duplicate components
        || CHECK_FOR_DUPLICATES.has(backward)
    ) {
      console.log(CHECK_FOR_DUPLICATES)
      console.log(`ERROR: SET ALREADY HAS ${forward} OR IN REVERSE`);
    }
    CHECK_FOR_DUPLICATES.add(forward);

    COMPONENTS.push([ A, B ]);
    UNUSED.add(i);
  }

  // INIT STATE VARIABLES
  const PATH = [];
  let length = 0;
  let maxLength = 0;
  let currentStrength = 0;
  let part1BestPath = { path: [], strength: 0 };

  // ANALYZE BACKTRACK
  function backtrack(connectingType) {

    const candidates = [ ...UNUSED ].filter(i => COMPONENTS[i].includes(connectingType));
    
    // BASE CASE - NO CANDIDATES
    if (!candidates.length) {

      const path = [ ...PATH ];

      if (currentStrength > part1BestPath.strength) {
        part1BestPath = { path, strength: currentStrength };
      }
      if (!(length in BRIDGES_BY_LENGTH)) BRIDGES_BY_LENGTH[length] = [];
      BRIDGES_BY_LENGTH[length].push({ path, strength: currentStrength });
      maxLength = Math.max(maxLength, length);

    }

    // RECURSIVE CASE - PICK A CANDIDATE AND CONTINUE
    else {

      for (const candidate of candidates) {

        const component = COMPONENTS[candidate];
        const flipped = component[0] !== connectingType;
        const otherType = flipped ? component[0] : component[1];
        
        PATH.push({ candidate, flipped });
        UNUSED.delete(candidate);
        currentStrength += (connectingType + otherType);
        ++length;
        
        backtrack(otherType);

        PATH.pop();
        UNUSED.add(candidate);
        currentStrength -= (connectingType + otherType);
        --length;

      }

    }
  }
  backtrack(0);

  if (part === 1) {                                                                         // PART 1: GET STRENGTH OF STRONGEST POSSIBLE PATH

    if (DISPLAY_EXTRA_INFO) {
      console.log('BEST STRENGTH:', part1BestPath.strength);
      console.log('BEST PATH:', part1BestPath.path.map(data => {
        const { candidate, flipped } = data;
        const component = COMPONENTS[candidate];
        const backward = [ component[1], component[0] ];
        return flipped ? backward : component;
      }));
    }
    return part1BestPath.strength;

  } else {                                                                                  // PART 2: GET STRENGTH OF STRONGEST POSSIBLE PATH, AMONG ONLY
                                                                                            // THOSE WHOSE LENGTH IS THE LONGEST POSSIBLE LENGTH

    let maxStrength = 0;
    let bestPath = null;
    for (const candidate of BRIDGES_BY_LENGTH[maxLength]) {
      if (candidate.strength > maxStrength) {
        maxStrength = candidate.strength;
        bestPath = candidate;
      }
    }

    if (DISPLAY_EXTRA_INFO) {
      console.log('MAX LENGTH:', maxLength);
      console.log('BEST STRENGTH:', bestPath.strength);
      console.log('BEST PATH:', bestPath.path.map(data => {
        const { candidate, flipped } = data;
        const component = COMPONENTS[candidate];
        const backward = [ component[1], component[0] ];
        return flipped ? backward : component;
      }));
    }
    return maxStrength;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = arrangePiecesWithConnectingEdgesInLine;
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
`0/2
2/2
2/3
3/4
3/5
0/1
10/1
9/10`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 31;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 1906;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 19;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 1824;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);