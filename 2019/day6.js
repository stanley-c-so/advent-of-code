/*

--- Day 6: Universal Orbit Map ---

You've landed at the Universal Orbit Map facility on Mercury. Because navigation in space often involves transferring between orbits, the orbit maps here are useful for finding efficient routes between, for example, you and Santa. You download a map of the local orbits (your puzzle input).

Except for the universal Center of Mass (COM), every object in space is in orbit around exactly one other object. An orbit looks roughly like this:

                  \
                   \
                    |
                    |
AAA--> o            o <--BBB
                    |
                    |
                   /
                  /

In this diagram, the object BBB is in orbit around AAA. The path that BBB takes around AAA (drawn with lines) is only partly shown. In the map data, this orbital relationship is written AAA)BBB, which means "BBB is in orbit around AAA".

Before you use your map data to plot a course, you need to make sure it wasn't corrupted during the download. To verify maps, the Universal Orbit Map facility uses orbit count checksums - the total number of direct orbits (like the one shown above) and indirect orbits.

Whenever A orbits B and B orbits C, then A indirectly orbits C. This chain can be any number of objects long: if A orbits B, B orbits C, and C orbits D, then A indirectly orbits D.

For example, suppose you have the following map:

COM)B
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

Visually, the above map of orbits looks like this:

        G - H       J - K - L
       /           /
COM - B - C - D - E - F
               \
                I

In this visual representation, when two objects are connected by a line, the one on the right directly orbits the one on the left.

Here, we can count the total number of orbits as follows:

D directly orbits C and indirectly orbits B and COM, a total of 3 orbits.
L directly orbits K and indirectly orbits J, E, D, C, B, and COM, a total of 7 orbits.
COM orbits nothing.

The total number of direct and indirect orbits in this example is 42.

What is the total number of direct and indirect orbits in your map data?


--- Part Two ---

Now, you just need to figure out how many orbital transfers you (YOU) need to take to get to Santa (SAN).

You start at the object YOU are orbiting; your destination is the object SAN is orbiting. An orbital transfer lets you move from any object to an object orbiting or orbited by that object.

For example, suppose you have the following map:

COM)B
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
I)SAN

Visually, the above map of orbits looks like this:

                          YOU
                         /
        G - H       J - K - L
       /           /
COM - B - C - D - E - F
               \
                I - SAN

In this example, YOU are in orbit around K, and SAN is in orbit around I. To move from K to I, a minimum of 4 orbital transfers are required:

K to J
J to E
E to D
D to I

Afterward, the map of orbits looks like this:

        G - H       J - K - L
       /           /
COM - B - C - D - E - F
               \
                I - SAN
                 \
                  YOU

What is the minimum number of orbital transfers required to move from the object YOU are orbiting to the object SAN is orbiting? (Between the objects they are orbiting - not between YOU and SAN.)

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