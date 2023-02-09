/*

COPY + PASTE PUZZLE DESCRIPTION HERE (PART 1)


COPY + PASTE PUZZLE DESCRIPTION HERE (PART 2)

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function orbitTree (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // CONSTANTS
  const [ COM, YOU, SAN ] = [ 'COM', 'YOU', 'SAN' ];

  // DATA STRUCTURES
  const DATA = {};

  // PARSE INPUT DATA
  for (const line of inputArr) {
    const [ orbited, orbiter ] = line.split(')');
    if (!(orbited in DATA)) DATA[orbited] = { parent: null, children: [], depth: null };
    if (!(orbiter in DATA)) DATA[orbiter] = { parent: null, children: [], depth: null };
    DATA[orbited].children.push(orbiter);
    DATA[orbiter].parent = orbited;
  }

  // ANALYZE DFS - NEEDED IN BOTH PARTS BECAUSE DFS POPULATES THE DEPTH DATA USED IN PART 2
  let numIndirectOrbits = 0;
  let numDirectOrbits = 0;
  const stack = [ [ COM, 0 ] ];
  while (stack.length) {
    const [ node, depth ] = stack.pop();
    DATA[node].depth = depth;
    if (node !== COM
        && (!DEBUG || ![ YOU, SAN ].includes(node))         // sample data should not have YOU and SAN for part 1. we add it for purposes of part 2,
                                                            // so in part 1 just ignore it if DEBUG. (if NOT DEBUG, we still need to count it.)
    ) {
      ++numDirectOrbits;                                    // everything except COM directly orbits something
      numIndirectOrbits += depth - 1;                       // depth includes the direct orbit as well, and we don't want to double count it,
                                                            // so we look at depth - 1.
    }
    for (const child of DATA[node].children) {
      stack.push([ child, depth + 1 ]);
    }
  }

  // ANALYZE
  if (part === 1) {                                         // PART 1: RETURN THE SUM OF THE DIRECT AND INDIRECT ORBITS

    if (DISPLAY_EXTRA_INFO) {
      console.log(`INDIRECT ORBITS: ${numIndirectOrbits}`);
      console.log(`DIRECT ORBITS: ${numDirectOrbits}`);
    }

    return numIndirectOrbits + numDirectOrbits;

  } else {                                                  // PART 2: RETURN THE MINIMUM PATH DISTANCE BETWEEN WHERE YOU AND SAN ARE

    let locationYOU = DATA[YOU].parent;
    let locationSAN = DATA[SAN].parent;

    let [ lowerNode, higherNode ] = DATA[locationYOU].depth > DATA[locationSAN].depth ? [ locationYOU, locationSAN ]
                                                                                      : [ locationSAN, locationYOU ];

    let lowerNodeMoves = 0;
    let higherNodeMoves = 0;

    while (DATA[lowerNode].depth > DATA[higherNode].depth) {
      lowerNode = DATA[lowerNode].parent;
      ++lowerNodeMoves;
    }

    if (DISPLAY_EXTRA_INFO) {
      console.log(`LOWER NODE REACHED SAME LEVEL AS HIGHER NODE AT: ${lowerNode}`);
    }

    while (lowerNode !== higherNode) {
      lowerNode = DATA[lowerNode].parent;
      higherNode = DATA[higherNode].parent;
      ++lowerNodeMoves;
      ++higherNodeMoves;
    }

    if (DISPLAY_EXTRA_INFO) {
      console.log(`NODES MEET AT: ${lowerNode}`);
    }

    return lowerNodeMoves + higherNodeMoves;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = orbitTree;
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
`COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`
);                                          // manually added K)YOU and I)SAN for purposes of part 2

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
expected = 119831;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 4;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 322;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);