/*

--- Day 23: Experimental Emergency Teleportation ---

Using your torch to search the darkness of the rocky cavern, you finally locate the man's friend: a small reindeer.

You're not sure how it got so far in this cave. It looks sick - too sick to walk - and too heavy for you to carry all the way back. Sleighs won't be invented for another 1500 years, of course.

The only option is experimental emergency teleportation.

You hit the "experimental emergency teleportation" button on the device and push I accept the risk on no fewer than 18 different warning messages. Immediately, the device deploys hundreds of tiny nanobots which fly around the cavern, apparently assembling themselves into a very specific formation. The device lists the X,Y,Z position (pos) for each nanobot as well as its signal radius (r) on its tiny screen (your puzzle input).

Each nanobot can transmit signals to any integer coordinate which is a distance away from it less than or equal to its signal radius (as measured by Manhattan distance). Coordinates a distance away of less than or equal to a nanobot's signal radius are said to be in range of that nanobot.

Before you start the teleportation process, you should determine which nanobot is the strongest (that is, which has the largest signal radius) and then, for that nanobot, the total number of nanobots that are in range of it, including itself.

For example, given the following nanobots:

pos=<0,0,0>, r=4
pos=<1,0,0>, r=1
pos=<4,0,0>, r=3
pos=<0,2,0>, r=1
pos=<0,5,0>, r=3
pos=<0,0,3>, r=1
pos=<1,1,1>, r=1
pos=<1,1,2>, r=1
pos=<1,3,1>, r=1

The strongest nanobot is the first one (position 0,0,0) because its signal radius, 4 is the largest. Using that nanobot's location and signal radius, the following nanobots are in or out of range:

The nanobot at 0,0,0 is distance 0 away, and so it is in range.
The nanobot at 1,0,0 is distance 1 away, and so it is in range.
The nanobot at 4,0,0 is distance 4 away, and so it is in range.
The nanobot at 0,2,0 is distance 2 away, and so it is in range.
The nanobot at 0,5,0 is distance 5 away, and so it is not in range.
The nanobot at 0,0,3 is distance 3 away, and so it is in range.
The nanobot at 1,1,1 is distance 3 away, and so it is in range.
The nanobot at 1,1,2 is distance 4 away, and so it is in range.
The nanobot at 1,3,1 is distance 5 away, and so it is not in range.

In this example, in total, 7 nanobots are in range of the nanobot with the largest signal radius.

Find the nanobot with the largest signal radius. How many nanobots are in range of its signals?


--- Part Two ---

Now, you just need to figure out where to position yourself so that you're actually teleported when the nanobots activate.

To increase the probability of success, you need to find the coordinate which puts you in range of the largest number of nanobots. If there are multiple, choose one closest to your position (0,0,0, measured by manhattan distance).

For example, given the following nanobot formation:

pos=<10,12,12>, r=2
pos=<12,14,12>, r=2
pos=<16,12,12>, r=4
pos=<14,14,14>, r=6
pos=<50,50,50>, r=200
pos=<10,10,10>, r=5

Many coordinates are in range of some of the nanobots in this formation. However, only the coordinate 12,12,12 is in range of the most nanobots: it is in range of the first five, but is not in range of the nanobot at 10,10,10. (All other coordinates are in range of fewer than five nanobots.) This coordinate's distance from 0,0,0 is 36.

Find the coordinates that are in range of the largest number of nanobots. What is the shortest manhattan distance between any of those points and 0,0,0?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function findCoordCoincidingWithMostOctahedra (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // PART 1 VARIABLES TO BE DISCOVERED ON PARSING INPUT DATA
  let highestRadius = 0;
  let idxOfNanobotWithHighestRadius = null;

  // PART 2 VARIABLES TO BE DISCOVERED ON PARSING INPUT DATA
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  // DATA STRUCTURES
  const NANOBOTS = [];

  // PARSE INPUT DATA
  for (let i = 0; i < inputArr.length; ++i) {
    const [ posData, rData ] = inputArr[i].split('>, r=');
    const [ x, y, z ] = posData.split('<')[1].split(',').map(n => +n);
    const r = +rData;
    NANOBOTS.push({ x, y, z, r });

    // PART 1
    if (r > highestRadius) {
      highestRadius = r;
      idxOfNanobotWithHighestRadius = i;
      highestRadius = Math.max(highestRadius, r);
    }

    // PART 2
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    minZ = Math.min(minZ, z);
    maxZ = Math.max(maxZ, z);
  }

  // UTILITY FUNCTION - GET MANHATTAN DISTANCE BETWEEN TWO SETS OF COORDS
  const getManhattanDistance = (x1, y1, z1, x2, y2, z2) => Math.abs(x1 - x2)
                                                            + Math.abs(y1 - y2)
                                                            + Math.abs(z1 - z2);

  // ANALYZE
  if (part === 1) {                                                               // PART 1: COUNT NUMBER OF BOTS IN RANGE OF THE BOT WITH BIGGEST RADIUS

    const x1 = NANOBOTS[idxOfNanobotWithHighestRadius].x;
    const y1 = NANOBOTS[idxOfNanobotWithHighestRadius].y;
    const z1 = NANOBOTS[idxOfNanobotWithHighestRadius].z;

    let numNanobotsInRange = 0;
    for (let i = 0; i < NANOBOTS.length; ++i) {
      const x2 = NANOBOTS[i].x;
      const y2 = NANOBOTS[i].y;
      const z2 = NANOBOTS[i].z;
      
      if (getManhattanDistance(x1, y1, z1, x2, y2, z2) <= highestRadius) {
        ++numNanobotsInRange;
      }
    }
    return numNanobotsInRange;

  } else {                                                                        // PART 2: GET COORD THAT OVERLAPS WITH THE MOST BOTS
    
    const TIME_AT_START = Date.now();
    console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');
    
    // UTILITY FUNCTION - GIVEN A NANOBOT AND THE LOWER AND UPPER BOUNDS OF A BOX OF SPACE, DETERMINE WHETHER THERE IS AN OVERLAP
    const checkOverlap = (nanobotIdx, boxLowerBounds, boxUpperBounds) => {

      const { x, y, z, r } = NANOBOTS[nanobotIdx];

      // FIRST, CHECK 6 CORNERS OF OCTAHEDRON (MORE LIKELY WHEN SEARCH BOX DOMINATES NANOBOT OCTAHEDRON)
      const OCTAHEDRON_DELTAS = [
        [ +1, 0, 0 ],
        [ -1, 0, 0 ],
        [ 0, +1, 0 ],
        [ 0, -1, 0 ],
        [ 0, 0, +1 ],
        [ 0, 0, -1 ],
      ];
      for (const [ dx, dy, dz ] of OCTAHEDRON_DELTAS) {
        const [ newX, newY, newZ ] = [ x + dx * r, y + dy * r, z + dz * r ];
        if (boxLowerBounds.x <= newX && newX <= boxUpperBounds.x                  // see if the corner is between the extremes of all 3 axis corners of the search box
            && boxLowerBounds.y <= newY && newY <= boxUpperBounds.y
            && boxLowerBounds.z <= newZ && newZ <= boxUpperBounds.z
        ) {
          return true;
        }
      }

      // THEN, CHECK 8 CORNERS OF SEARCH BOX (MORE LIKELY WHEN NANOBOT OCTAHEDRON DOMINATES SEARCH BOX)
      for (let boolX = 0; boolX <= 1; ++boolX) {
        for (let boolY = 0; boolY <= 1; ++boolY) {
          for (let boolZ = 0; boolZ <= 1; ++boolZ) {
            const boxX = boolX ? boxUpperBounds.x : boxLowerBounds.x;
            const boxY = boolY ? boxUpperBounds.y : boxLowerBounds.y;
            const boxZ = boolZ ? boxUpperBounds.z : boxLowerBounds.z;
            if (getManhattanDistance(boxX, boxY, boxZ, x, y, z) <= r) {           // see if the manhattan distance from the nanobot to the corner is not greater than r
              return true;
            }
          }
        }
      }

      return false;
    };

    // INIT
    let boxSize = 1;
    while ( minX < 1 - (boxSize / 2) || (boxSize / 2) < maxX
            || minY < 1 - (boxSize / 2) || (boxSize / 2) < maxY
            || minZ < 1 - (boxSize / 2) || (boxSize / 2) < maxZ
    ) {
      boxSize *= 2;                                                               // keep doubling until it fully encompasses all nanobots
    }
    let lowerBoundX = 1 - (boxSize / 2);
    let lowerBoundY = 1 - (boxSize / 2);
    let lowerBoundZ = 1 - (boxSize / 2);
    let upperBoundX = boxSize / 2;
    let upperBoundY = boxSize / 2;
    let upperBoundZ = boxSize / 2;

    // "3D BINARY SEARCH": AT EACH ITERATION, DIVIDE THE CUBIC SEARCH SPACE INTO 8 BOXES
    while (boxSize > 1) {

      const containerLowerBoundX = lowerBoundX;                                   // lowerBoundX can change within this iteration, so save initial value as const
      const containerLowerBoundY = lowerBoundY;
      const containerLowerBoundZ = lowerBoundZ;

      boxSize /= 2;
      let maxNanobotsInRange = 0;

      for (let x = 0; x <= 1; ++x) {
        for (let y = 0; y <= 1; ++y) {
          for (let z = 0; z <= 1; ++z) {

            const currLowerBoundX = containerLowerBoundX + (x * boxSize);
            const currUpperBoundX = currLowerBoundX + boxSize - 1;

            const currLowerBoundY = containerLowerBoundY + (y * boxSize);
            const currUpperBoundY = currLowerBoundY + boxSize - 1;
            
            const currLowerBoundZ = containerLowerBoundZ + (z * boxSize);
            const currUpperBoundZ = currLowerBoundZ + boxSize - 1;

            const currLowerBounds = { x: currLowerBoundX,
                                      y: currLowerBoundY,
                                      z: currLowerBoundZ };
            const currUpperBounds = { x: currUpperBoundX,
                                      y: currUpperBoundY,
                                      z: currUpperBoundZ };

            // CHECK ALL NANOBOTS TO SEE IF THEY COLLIDE WITH THE CURRENT SEARCH BOX
            let nanobotsInRange = 0;
            for (let i = 0; i < NANOBOTS.length; ++i) {
              if (checkOverlap(i, currLowerBounds, currUpperBounds)) {
                ++nanobotsInRange;
              }
            }
            
            // UPDATE VARIABLES IF MORE NANOBOTS IN RANGE (OR IF TIED FOR RECORD, TIEBREAKER IS BASED ON WHICHEVER SEARCH BOX IS CLOSER TO THE ORIGIN)
            if (  nanobotsInRange > maxNanobotsInRange
                  || nanobotsInRange === maxNanobotsInRange
                      && getManhattanDistance(  currLowerBoundX + Math.floor((currUpperBoundX - currLowerBoundX) / 2),
                                                currLowerBoundY + Math.floor((currUpperBoundY - currLowerBoundY) / 2),
                                                currLowerBoundZ + Math.floor((currUpperBoundZ - currLowerBoundZ) / 2),
                                                0, 0, 0 )

                          < getManhattanDistance( lowerBoundX + Math.floor((upperBoundX - lowerBoundX) / 2),
                                                  lowerBoundY + Math.floor((upperBoundY - lowerBoundY) / 2),
                                                  lowerBoundZ + Math.floor((upperBoundZ - lowerBoundZ) / 2),
                                                  0, 0, 0 )
            ) {
              maxNanobotsInRange = nanobotsInRange;
              lowerBoundX = currLowerBoundX;
              lowerBoundY = currLowerBoundY;
              lowerBoundZ = currLowerBoundZ;
              upperBoundX = currUpperBoundX;
              upperBoundY = currUpperBoundY;
              upperBoundZ = currUpperBoundZ;
            }

          }
        }
      }

    }

    if (DISPLAY_EXTRA_INFO) {
      console.log(`THE BEST COORDINATE IS: (${lowerBoundX}, ${lowerBoundY}, ${lowerBoundZ})`);
    }

    console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return getManhattanDistance(lowerBoundX, lowerBoundY, lowerBoundZ, 0, 0, 0);

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = findCoordCoincidingWithMostOctahedra;
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
`pos=<0,0,0>, r=4
pos=<1,0,0>, r=1
pos=<4,0,0>, r=3
pos=<0,2,0>, r=1
pos=<0,5,0>, r=3
pos=<0,0,3>, r=1
pos=<1,1,1>, r=1
pos=<1,1,2>, r=1
pos=<1,3,1>, r=1`
);

const sampleInput2 = parseSampleInput(
`pos=<10,12,12>, r=2
pos=<12,14,12>, r=2
pos=<16,12,12>, r=4
pos=<14,14,14>, r=6
pos=<50,50,50>, r=200
pos=<10,10,10>, r=5`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 7;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 652;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 36;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 164960498;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);