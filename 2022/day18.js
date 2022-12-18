/*

--- Day 18: Boiling Boulders ---

You and the elephants finally reach fresh air. You've emerged near the base of a large volcano that seems to be actively erupting! Fortunately, the lava seems to be flowing away from you and toward the ocean.

Bits of lava are still being ejected toward you, so you're sheltering in the cavern exit a little longer. Outside the cave, you can see the lava landing in a pond and hear it loudly hissing as it solidifies.

Depending on the specific compounds in the lava and speed at which it cools, it might be forming obsidian! The cooling rate should be based on the surface area of the lava droplets, so you take a quick scan of a droplet as it flies past you (your puzzle input).

Because of how quickly the lava is moving, the scan isn't very good; its resolution is quite low and, as a result, it approximates the shape of the lava droplet with 1x1x1 cubes on a 3D grid, each given as its x,y,z position.

To approximate the surface area, count the number of sides of each cube that are not immediately connected to another cube. So, if your scan were only two adjacent cubes like 1,1,1 and 2,1,1, each cube would have a single side covered and five sides exposed, a total surface area of 10 sides.

Here's a larger example:

2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5

In the above example, after counting up all the sides that aren't connected to another cube, the total surface area is 64.

What is the surface area of your scanned lava droplet?


--- Part Two ---

Something seems off about your calculation. The cooling rate depends on exterior surface area, but your calculation also included the surface area of air pockets trapped in the lava droplet.

Instead, consider only cube sides that could be reached by the water and steam as the lava droplet tumbles into the pond. The steam will expand to reach as much as possible, completely displacing any air on the outside of the lava droplet but never expanding diagonally.

In the larger example above, exactly one cube of air is trapped within the lava droplet (at 2,2,5), so the exterior surface area of the lava droplet is 58.

What is the exterior surface area of your scanned lava droplet?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function analyzeSurfaceAreaOfSolid (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  // if (DEBUG) {
  //   console.log(inputArr[0]);
  //   // console.log(inputArr[1]);
  // }

  // INIT DATA STRUCTURE AND RELATED KEY VARIABLES
  const CUBES = new Set();

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  // PARSE DATA AND CALCULATE LIMITS OF PROBLEM SPACE
  for (const line of inputArr) {
    CUBES.add(line);
    const [ x, y, z ] = line.split(',').map(n => +n);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    minZ = Math.min(minZ, z);
    maxZ = Math.max(maxZ, z);
  }

  const X_RANGE = maxX - minX + 1;
  const Y_RANGE = maxY - minY + 1;
  const Z_RANGE = maxZ - minZ + 1;
  const TOTAL_VOLUME_OF_PROBLEM_SPACE = X_RANGE * Y_RANGE * Z_RANGE;

  if (DISPLAY_EXTRA_INFO) {
    console.log(`X range: from ${minX} to ${maxX}`);
    console.log(`Y range: from ${minY} to ${maxY}`);
    console.log(`Z range: from ${minZ} to ${maxZ}`);
    console.log(`total volume of problem space: ${TOTAL_VOLUME_OF_PROBLEM_SPACE}`);
  }

  // INIT ADDITIONAL VARIABLES AND DISCOVER TOTAL SURFACE AREA OF SOLID
  const DIRS = [
    [ +1, 0, 0 ],
    [ -1, 0, 0 ],
    [ 0, +1, 0 ],
    [ 0, -1, 0 ],
    [ 0, 0, +1 ],
    [ 0, 0, -1 ],
  ]

  let TOTAL_SURFACE_AREA_OF_SOLID = 0;

  for (const cube of CUBES) {
    const [x, y, z] = cube.split(',').map(n => +n);
    let surfaceArea = 6;
    for (const [ dx, dy, dz ] of DIRS) {                                                  // first, assume this cube has a surface area of 6...
      if (CUBES.has(`${x + dx},${y + dy},${z + dz}`)) --surfaceArea;                      // ...but then decrement for every neighbor that's also a cube
    }
    TOTAL_SURFACE_AREA_OF_SOLID += surfaceArea;
  }

  const TIME_AT_START = Date.now();

  // ANALYZE
  if (part === 1) {                                                                       // PART 1: GET SURFACE AREA OF SOLID

    return TOTAL_SURFACE_AREA_OF_SOLID;

  } else {                                                                                // PART 2: DON'T INCLUDE SURFACE AREA TOUCHING TRAPPED POCKETS OF SPACE

    if (!DEBUG) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');

    let TOTAL_INTERIOR_SURFACE_AREA = 0;
    const visited = new Set();

    // HELPER FUNCTION: MARK OFF ALL CONTIGUOUS EMPTY SPACES CONNECTED TO START LOCATION; RETURN SURFACE AREA IF THIS IS A CONTAINED REGION, ELSE 0
    function DFS(startLocation) {
      let surfaceArea = 0;
      const visitedOnThisRun = new Set();
      const stack = [ startLocation ];

      while (stack.length && visitedOnThisRun.size < TOTAL_VOLUME_OF_PROBLEM_SPACE) {
        const serial = stack.pop();
        if (visitedOnThisRun.has(serial) || CUBES.has(serial)) continue;                  // skip visited locations and non-air locations
        visitedOnThisRun.add(serial);
        const [ x, y, z ] = serial.split(',').map(n => +n);
        for (const [ dx, dy, dz ] of DIRS) {
          const neighbor = `${x + dx},${y + dy},${z + dz}`;
          if (CUBES.has(neighbor)) ++surfaceArea;
          else stack.push(neighbor);
        }
      }

      for (const el of visitedOnThisRun) visited.add(el);                                 // NOTE: add all visited locations on this run to visited set
      return visitedOnThisRun.size === TOTAL_VOLUME_OF_PROBLEM_SPACE ? 0 : surfaceArea;
    }

    for (let x = minX; x <= maxX; ++x) {
      for (let y = minY; y <= maxY; ++y) {
        for (let z = minZ; z <= maxZ; ++z) {
          const serial = `${x},${y},${z}`;
          if (!CUBES.has(serial) && !visited.has(serial)) {
            TOTAL_INTERIOR_SURFACE_AREA += DFS(serial);
          }
        }
      }
    }

    if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return TOTAL_SURFACE_AREA_OF_SOLID - TOTAL_INTERIOR_SURFACE_AREA;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = analyzeSurfaceAreaOfSolid;
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
`2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 64;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 4580;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 58;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 2610;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);