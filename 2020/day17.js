// --- Day 17: Conway Cubes ---

// As your flight slowly drifts through the sky, the Elves at the Mythical Information Bureau at the North Pole contact you. They'd like some help debugging a malfunctioning experimental energy source aboard one of their super-secret imaging satellites.

// The experimental energy source is based on cutting-edge technology: a set of Conway Cubes contained in a pocket dimension! When you hear it's having problems, you can't help but agree to take a look.

// The pocket dimension contains an infinite 3-dimensional grid. At every integer 3-dimensional coordinate (x,y,z), there exists a single cube which is either active or inactive.

// In the initial state of the pocket dimension, almost all cubes start inactive. The only exception to this is a small flat region of cubes (your puzzle input); the cubes in this region start in the specified active (#) or inactive (.) state.

// The energy source then proceeds to boot up by executing six cycles.

// Each cube only ever considers its neighbors: any of the 26 other cubes where any of their coordinates differ by at most 1. For example, given the cube at x=1,y=2,z=3, its neighbors include the cube at x=2,y=2,z=2, the cube at x=0,y=2,z=3, and so on.

// During a cycle, all cubes simultaneously change their state according to the following rules:

// If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
// If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.
// The engineers responsible for this experimental energy source would like you to simulate the pocket dimension and determine what the configuration of cubes should be at the end of the six-cycle boot process.

// For example, consider the following initial state:

// .#.
// ..#
// ###

// Even though the pocket dimension is 3-dimensional, this initial state represents a small 2-dimensional slice of it. (In particular, this initial state defines a 3x3x1 region of the 3-dimensional space.)

// Simulating a few cycles from this initial state produces the following configurations, where the result of each cycle is shown layer-by-layer at each given z coordinate (and the frame of view follows the active cells in each cycle):

// Before any cycles:

// z=0
// .#.
// ..#
// ###


// After 1 cycle:

// z=-1
// #..
// ..#
// .#.

// z=0
// #.#
// .##
// .#.

// z=1
// #..
// ..#
// .#.

// After 2 cycles:

// z=-2
// .....
// .....
// ..#..
// .....
// .....

// z=-1
// ..#..
// .#..#
// ....#
// .#...
// .....

// z=0
// ##...
// ##...
// #....
// ....#
// .###.

// z=1
// ..#..
// .#..#
// ....#
// .#...
// .....

// z=2
// .....
// .....
// ..#..
// .....
// .....

// After 3 cycles:

// z=-2
// .......
// .......
// ..##...
// ..###..
// .......
// .......
// .......

// z=-1
// ..#....
// ...#...
// #......
// .....##
// .#...#.
// ..#.#..
// ...#...

// z=0
// ...#...
// .......
// #......
// .......
// .....##
// .##.#..
// ...#...

// z=1
// ..#....
// ...#...
// #......
// .....##
// .#...#.
// ..#.#..
// ...#...

// z=2
// .......
// .......
// ..##...
// ..###..
// .......
// .......
// .......

// After the full six-cycle boot process completes, 112 cubes are left in the active state.

// Starting with your given initial configuration, simulate six cycles. How many cubes are left in the active state after the sixth cycle?

// --- Part Two ---

// For some reason, your simulated results don't match what the experimental energy source engineers expected. Apparently, the pocket dimension actually has four spatial dimensions, not three.

// The pocket dimension contains an infinite 4-dimensional grid. At every integer 4-dimensional coordinate (x,y,z,w), there exists a single cube (really, a hypercube) which is still either active or inactive.

// Each cube only ever considers its neighbors: any of the 80 other cubes where any of their coordinates differ by at most 1. For example, given the cube at x=1,y=2,z=3,w=4, its neighbors include the cube at x=2,y=2,z=3,w=3, the cube at x=0,y=2,z=3,w=4, and so on.

// The initial state of the pocket dimension still consists of a small flat region of cubes. Furthermore, the same rules for cycle updating still apply: during each cycle, consider the number of active neighbors of each cube.

// For example, consider the same initial state as in the example above. Even though the pocket dimension is 4-dimensional, this initial state represents a small 2-dimensional slice of it. (In particular, this initial state defines a 3x3x1x1 region of the 4-dimensional space.)

// Simulating a few cycles from this initial state produces the following configurations, where the result of each cycle is shown layer-by-layer at each given z and w coordinate:

// Before any cycles:

// z=0, w=0
// .#.
// ..#
// ###


// After 1 cycle:

// z=-1, w=-1
// #..
// ..#
// .#.

// z=0, w=-1
// #..
// ..#
// .#.

// z=1, w=-1
// #..
// ..#
// .#.

// z=-1, w=0
// #..
// ..#
// .#.

// z=0, w=0
// #.#
// .##
// .#.

// z=1, w=0
// #..
// ..#
// .#.

// z=-1, w=1
// #..
// ..#
// .#.

// z=0, w=1
// #..
// ..#
// .#.

// z=1, w=1
// #..
// ..#
// .#.

// After 2 cycles:

// z=-2, w=-2
// .....
// .....
// ..#..
// .....
// .....

// z=-1, w=-2
// .....
// .....
// .....
// .....
// .....

// z=0, w=-2
// ###..
// ##.##
// #...#
// .#..#
// .###.

// z=1, w=-2
// .....
// .....
// .....
// .....
// .....

// z=2, w=-2
// .....
// .....
// ..#..
// .....
// .....

// z=-2, w=-1
// .....
// .....
// .....
// .....
// .....

// z=-1, w=-1
// .....
// .....
// .....
// .....
// .....

// z=0, w=-1
// .....
// .....
// .....
// .....
// .....

// z=1, w=-1
// .....
// .....
// .....
// .....
// .....

// z=2, w=-1
// .....
// .....
// .....
// .....
// .....

// z=-2, w=0
// ###..
// ##.##
// #...#
// .#..#
// .###.

// z=-1, w=0
// .....
// .....
// .....
// .....
// .....

// z=0, w=0
// .....
// .....
// .....
// .....
// .....

// z=1, w=0
// .....
// .....
// .....
// .....
// .....

// z=2, w=0
// ###..
// ##.##
// #...#
// .#..#
// .###.

// z=-2, w=1
// .....
// .....
// .....
// .....
// .....

// z=-1, w=1
// .....
// .....
// .....
// .....
// .....

// z=0, w=1
// .....
// .....
// .....
// .....
// .....

// z=1, w=1
// .....
// .....
// .....
// .....
// .....

// z=2, w=1
// .....
// .....
// .....
// .....
// .....

// z=-2, w=2
// .....
// .....
// ..#..
// .....
// .....

// z=-1, w=2
// .....
// .....
// .....
// .....
// .....

// z=0, w=2
// ###..
// ##.##
// #...#
// .#..#
// .###.

// z=1, w=2
// .....
// .....
// .....
// .....
// .....

// z=2, w=2
// .....
// .....
// ..#..
// .....
// .....

// After the full six-cycle boot process completes, 848 cubes are left in the active state.

// Starting with your given initial configuration, simulate six cycles in a 4-dimensional space. How many cubes are left in the active state after the sixth cycle?

function conwayCubes (part, inputStr) {
  const inputArr = inputStr.split('\n');

  // INITIALIZE A SET THAT CONTAINS COORDINATES OF ALL ACTIVE CUBES
  const active = new Set();
  for (let y = 0; y < inputArr.length; ++y) {
    for (let x = 0; x < inputArr[y].length; ++x) {
      if (inputArr[y][x] === "#") active.add(`${x},${y},0,0`);                                          // parse the input data - since this is a 2D slice, z and w values are 0
    }
  }

  // DEFINE THE simulate UTILITY FUNCTION:
  function simulate() {

    // FIRST, FIND THE MINIMUM AND MAXIMUM x, y, z, AND w VALUES OUT OF THE SET OF ALL ACTIVE CUBES
    let minX = Infinity, minY = Infinity, minZ = Infinity, minW = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity, maxW = -Infinity;
    for (const coords of active) {
      const [x, y, z, w] = coords.split(",").map(n => +n);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      minZ = Math.min(minZ, z);
      maxZ = Math.max(maxZ, z);
      minW = Math.min(minW, w);
      maxW = Math.max(maxW, w);
    }

    // THEN, ITERATE FROM THE MIN - 1 TO MAX + 1 FOR EACH DIMENSION (AS INACTIVE NEIGHBORS OF OUTERMOST ACTIVE CUBES MAY BECOME ACTIVE!)...
    const result = new Set();                                                                           // empty result set for storing active cubes at the end of the simulation
    for (let x = minX - 1; x <= maxX + 1; ++x) {
      for (let y = minY - 1; y <= maxY + 1; ++y) {
        for (let z = minZ - 1; z <= maxZ + 1; ++z) {
          for (
            let w = (part === 1 ? 0 : minW - 1);                                                        // PART 1: NO w DIMENSION; PART 2: HANDLE w DIMENSION
            w <= (part === 1 ? 0 : maxW + 1);                                                           // PART 1: NO w DIMENSION; PART 2: HANDLE w DIMENSION
            ++w
          ) {

            // ...FIRST, COUNT THE NEIGHBORS BY ITERATING THROUGH ADJACENT POSITIONS...
            let activeNeighbors = 0;
            for (let X = x - 1; X <= x + 1; ++X) {
              for (let Y = y - 1; Y <= y + 1; ++Y) {
                for (let Z = z - 1; Z <= z + 1; ++Z) {
                  for (
                    let W = (part === 1 ? 0 : w - 1);                                                   // PART 1: NO w DIMENSION; PART 2: HANDLE w DIMENSION
                    W <= (part === 1 ? 0 : w + 1);                                                      // PART 1: NO w DIMENSION; PART 2: HANDLE w DIMENSION
                    ++W
                  ) {
                    if (X === x && Y === y && Z === z && W === w) continue;                             // always skip the current position itself
                    if (active.has(`${X},${Y},${Z},${W}`)) ++activeNeighbors;
                  }
                }
              }
            }

            // ...THEN, IDENTIFY ACTIVE CUBES THAT REMAIN ACTIVE, OR INACTIVE CUBES THAT BECOME ACTIVE, AND ADD TO THE RESULT SET
            if (active.has(`${x},${y},${z},${w}`)) {
              if (activeNeighbors === 2 || activeNeighbors === 3) result.add(`${x},${y},${z},${w}`);    // active cubes remain active if they have 2 or 3 active neighbors
            } else {
              if (activeNeighbors === 3) result.add(`${x},${y},${z},${w}`);                             // inactive cubes become active if they have exactly 3 active neighbors
            }
          }
        }
      }
    }
    return result;
  }

  for (let i = 0; i < 6; ++i) {                                                                         // simulate 6 times - for each simulation:
    const result = simulate();                                                                          // find the result by calling the simulate utility function
    active.clear();                                                                                     // clear the active set
    for (const coord of result) active.add(coord);                                                      // copy the result data into the active set
  }

  // RETURN THE SIZE OF THE active SET (THE NUMBER OF ACTIVE CUBES)
  return active.size;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = conwayCubes;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `.#.
..#
###`;

const actualInput = `#####...
.#..##..
##.##.##
...####.
#.#...##
.##...#.
.#.#.###
#.#.#..#`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 112;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 313;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 848;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 2640;
test(func, input, expected, testNum, lowestTest, highestTest);