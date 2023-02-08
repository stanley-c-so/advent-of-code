/*

--- Day 3: Crossed Wires ---

The gravity assist was successful, and you're well on your way to the Venus refuelling station. During the rush back on Earth, the fuel management system wasn't completely installed, so that's next on the priority list.

Opening the front panel reveals a jumble of wires. Specifically, two wires are connected to a central port and extend outward on a grid. You trace the path each wire takes as it leaves the central port, one wire per line of text (your puzzle input).

The wires twist and turn, but the two wires occasionally cross paths. To fix the circuit, you need to find the intersection point closest to the central port. Because the wires are on a grid, use the Manhattan distance for this measurement. While the wires do technically cross right at the central port where they both start, this point does not count, nor does a wire count as crossing with itself.

For example, if the first wire's path is R8,U5,L5,D3, then starting from the central port (o), it goes right 8, up 5, left 5, and finally down 3:

...........
...........
...........
....+----+.
....|....|.
....|....|.
....|....|.
.........|.
.o-------+.
...........

Then, if the second wire's path is U7,R6,D4,L4, it goes up 7, right 6, down 4, and left 4:

...........
.+-----+...
.|.....|...
.|..+--X-+.
.|..|..|.|.
.|.-X--+.|.
.|..|....|.
.|.......|.
.o-------+.
...........

These wires cross at two locations (marked X), but the lower-left one is closer to the central port: its distance is 3 + 3 = 6.

Here are a few more examples:

R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83 = distance 159
R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7 = distance 135

What is the Manhattan distance from the central port to the closest intersection?


--- Part Two ---

It turns out that this circuit is very timing-sensitive; you actually need to minimize the signal delay.

To do this, calculate the number of steps each wire takes to reach each intersection; choose the intersection where the sum of both wires' steps is lowest. If a wire visits a position on the grid multiple times, use the steps value from the first time it visits that position when calculating the total value of a specific intersection.

The number of steps a wire takes is the total number of grid squares the wire has entered to get to that location, including the intersection being considered. Again consider the example from above:

...........
.+-----+...
.|.....|...
.|..+--X-+.
.|..|..|.|.
.|.-X--+.|.
.|..|....|.
.|.......|.
.o-------+.
...........

In the above example, the intersection closest to the central port is reached after 8+5+5+2 = 20 steps by the first wire and 7+6+4+3 = 20 steps by the second wire for a total of 20+20 = 40 steps.

However, the top-right intersection is better: the first wire takes only 8+5+2 = 15 and the second wire takes only 7+6+2 = 15, a total of 15+15 = 30 steps.

Here are the best steps for the extra examples from above:

R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83 = 610 steps
R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7 = 410 steps

What is the fewest combined steps the wires must take to reach an intersection?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function crisscrossingWires (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // PARSE INPUT DATA
  const WIRE_1_MOVES = inputArr[0].split(',');
  const WIRE_2_MOVES = inputArr[1].split(',');

  // UTILITY FUNCTION - GET MANHATTAN DISTANCE
  const getManhattanDistance = (y, x) => Math.abs(y) + Math.abs(x);

  // DATA STRUCTURE FOR MARKING THE MINIMUM STEPS IT TAKES TO REACH EACH COORD FOR WIRE 1
  const WIRE_1_VISITED = {};

  // INIT
  let distanceToClosestIntersection = Infinity;
  let minStepsToAnIntersection = Infinity;

  // SIMULATE WIRE 1, STORING INFO ON EVERY COORD IT REACHES AND THE NUMBER OF STEPS IT TAKES TO GET THERE
  let [ y, x ] = [ 0, 0 ];
  let moves = 0;
  for (const move of WIRE_1_MOVES) {
    const dir = move[0];
    let N = +move.slice(1);
    while (N--) {
      if (dir === 'U') {
        ++y;
      }
      else if (dir === 'D') {
        --y;
      }
      else if (dir === 'L') {
        --x;
      }
      else if (dir === 'R') {
        ++x;
      }
      else throw `ERROR: INVALID DIRECTION ${dir}`;
      ++moves;
      const serial = `${y},${x}`;
      if (!(serial in WIRE_1_VISITED)) WIRE_1_VISITED[serial] = moves;
    }
  }

  // SIMULATE WIRE 2, LOOKING FOR CROSSOVERS WITH WIRE 1
  [ y, x ] = [ 0, 0 ];
  moves = 0;
  for (const move of WIRE_2_MOVES) {
    const dir = move[0];
    let N = +move.slice(1);
    while (N--) {
      if (dir === 'U') {
        ++y;
      }
      else if (dir === 'D') {
        --y;
      }
      else if (dir === 'L') {
        --x;
      }
      else if (dir === 'R') {
        ++x;
      }
      else throw `ERROR: INVALID DIRECTION ${dir}`;
      ++moves;
      const serial = `${y},${x}`;
      if (serial in WIRE_1_VISITED) {
        distanceToClosestIntersection = Math.min(distanceToClosestIntersection, getManhattanDistance(y, x));    // for part 1
        minStepsToAnIntersection = Math.min(minStepsToAnIntersection, WIRE_1_VISITED[serial] + moves);          // for part 2
      };
    }
  }

  return part === 1 ? distanceToClosestIntersection                                                             // PART 1: GET SMALLEST MANHATTAN DISTANCE
                    : minStepsToAnIntersection;                                                                 // PART 2: GET MINIMUM NUMBER OF STEPS
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = crisscrossingWires;
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
`R8,U5,L5,D3
U7,R6,D4,L4`
);

const sampleInput2 = parseSampleInput(
`R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`
);

const sampleInput3 = parseSampleInput(
`R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 6;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 159;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 135;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 207;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 30;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 2,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 610;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 410;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 21196;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);