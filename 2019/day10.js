/*

--- Day 10: Monitoring Station ---

You fly into the asteroid belt and reach the Ceres monitoring station. The Elves here have an emergency: they're having trouble tracking all of the asteroids and can't be sure they're safe.

The Elves would like to build a new monitoring station in a nearby area of space; they hand you a map of all of the asteroids in that region (your puzzle input).

The map indicates whether each position is empty (.) or contains an asteroid (#). The asteroids are much smaller than they appear on the map, and every asteroid is exactly in the center of its marked position. The asteroids can be described with X,Y coordinates where X is the distance from the left edge and Y is the distance from the top edge (so the top-left corner is 0,0 and the position immediately to its right is 1,0).

Your job is to figure out which asteroid would be the best place to build a new monitoring station. A monitoring station can detect any asteroid to which it has direct line of sight - that is, there cannot be another asteroid exactly between them. This line of sight can be at any angle, not just lines aligned to the grid or diagonally. The best location is the asteroid that can detect the largest number of other asteroids.

For example, consider the following map:

.#..#
.....
#####
....#
...##

The best location for a new monitoring station on this map is the highlighted asteroid at 3,4 because it can detect 8 asteroids, more than any other location. (The only asteroid it cannot detect is the one at 1,0; its view of this asteroid is blocked by the asteroid at 2,2.) All other asteroids are worse locations; they can detect 7 or fewer other asteroids. Here is the number of other asteroids a monitoring station on each asteroid could detect:

.7..7
.....
67775
....7
...87

Here is an asteroid (#) and some examples of the ways its line of sight might be blocked. If there were another asteroid at the location of a capital letter, the locations marked with the corresponding lowercase letter would be blocked and could not be detected:

#.........
...A......
...B..a...
.EDCG....a
..F.c.b...
.....c....
..efd.c.gb
.......c..
....f...c.
...e..d..c

Here are some larger examples:

Best is 5,8 with 33 other asteroids detected:

......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####

Best is 1,2 with 35 other asteroids detected:

#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.

Best is 6,3 with 41 other asteroids detected:

.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..

Best is 11,13 with 210 other asteroids detected:

.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##

Find the best location for a new monitoring station. How many other asteroids can be detected from that location?


--- Part Two ---

Once you give them the coordinates, the Elves quickly deploy an Instant Monitoring Station to the location and discover the worst: there are simply too many asteroids.

The only solution is complete vaporization by giant laser.

Fortunately, in addition to an asteroid scanner, the new monitoring station also comes equipped with a giant rotating laser perfect for vaporizing asteroids. The laser starts by pointing up and always rotates clockwise, vaporizing any asteroid it hits.

If multiple asteroids are exactly in line with the station, the laser only has enough power to vaporize one of them before continuing its rotation. In other words, the same asteroids that can be detected can be vaporized, but if vaporizing one asteroid makes another one detectable, the newly-detected asteroid won't be vaporized until the laser has returned to the same position by rotating a full 360 degrees.

For example, consider the following map, where the asteroid with the new monitoring station (and laser) is marked X:

.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....X...###..
..#.#.....#....##

The first nine asteroids to get vaporized, in order, would be:

.#....###24...#..
##...##.13#67..9#
##...#...5.8####.
..#.....X...###..
..#.#.....#....##

Note that some asteroids (the ones behind the asteroids marked 1, 5, and 7) won't have a chance to be vaporized until the next full rotation. The laser continues rotating; the next nine to be vaporized are:

.#....###.....#..
##...##...#.....#
##...#......1234.
..#.....X...5##..
..#.9.....8....76

The next nine to be vaporized are then:

.8....###.....#..
56...9#...#.....#
34...7...........
..2.....X....##..
..1..............

Finally, the laser completes its first full rotation (1 through 3), a second rotation (4 through 8), and vaporizes the last asteroid (9) partway through its third rotation:

......234.....6..
......1...5.....7
.................
........X....89..
.................

In the large example above (the one with the best monitoring station location at 11,13):

The 1st asteroid to be vaporized is at 11,12.
The 2nd asteroid to be vaporized is at 12,1.
The 3rd asteroid to be vaporized is at 12,2.
The 10th asteroid to be vaporized is at 12,8.
The 20th asteroid to be vaporized is at 16,0.
The 50th asteroid to be vaporized is at 16,9.
The 100th asteroid to be vaporized is at 10,16.
The 199th asteroid to be vaporized is at 9,6.
The 200th asteroid to be vaporized is at 8,2.
The 201st asteroid to be vaporized is at 10,9.
The 299th and final asteroid to be vaporized is at 11,1.

The Elves are placing bets on which will be the 200th asteroid to be vaporized. Win the bet by determining which asteroid that will be; what do you get if you multiply its X coordinate by 100 and then add its Y coordinate? (For example, 8,2 becomes 802.)

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function asteroidLineOfSight (part, inputStr, extraParam, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // CONSTANTS
  const H = inputArr.length;
  const W = inputArr[0].length;

  // DATA STRUCTURES
  const ASTEROIDS = [];

  // PARSE INPUT DATA
  for (let row = 0; row < H; ++row) {
    for (let col = 0; col < W; ++col) {
      if (inputArr[row][col] === '#') {
        ASTEROIDS.push([ row, col ]);
      }
    }
  }

  // ANALYZE
  if (part === 1) {                                                 // PART 1: FIND THE NUMBER OF VISIBLE ASTEROIDS FROM THE ASTEROID THAT CAN SEE THE MOST

    // INIT
    let maxAsteroids = 0;
    let bestAsteroidIdx = null;

    for (let i = 0; i < ASTEROIDS.length; ++i) {
      const SLOPES = {};
      for (let j = 0; j < ASTEROIDS.length; ++j) {
        if (i === j) continue;
        const rise = ASTEROIDS[i][0] - ASTEROIDS[j][0];             // reversed to be negative, since a higher row is physically lower
        const run = ASTEROIDS[j][1] - ASTEROIDS[i][1];
        const slope = rise / run;                                   // we cannot just use slope by itself, because the asteroid can look in opposite directions
                                                                    // and it would be the same slope either way, but two different lines of sight
        const riseSign = rise > 0 ? '+' : rise < 0 ? '-' : '0';
        const runSign = run > 0 ? '+' : run < 0 ? '-' : '0';
        const quadrantCode = `${riseSign}${runSign}`;
        const serial = `${quadrantCode}|${slope}`;
        if (!(serial in SLOPES)) SLOPES[serial] = [];
        SLOPES[serial].push(j);
      }

      const numVisibleAsteroids = Object.keys(SLOPES).length;       // for every slope, only 1 asteroid is visible; the rest are blocked

      if (numVisibleAsteroids > maxAsteroids) {
        maxAsteroids = numVisibleAsteroids;
        bestAsteroidIdx = i;
      }
    }

    if (DISPLAY_EXTRA_INFO) {
      console.log(`BEST ASTEROID: ${ASTEROIDS[bestAsteroidIdx]}`);
    }

    return maxAsteroids;

  } else {                                                          // PART 2: SHOOT DOWN THE ASTEROIDS WITH SPINNING LASER AND DETERMINE THE 200th ONE

    const [ LASER_Y, LASER_X ] = extraParam.laserCoords;
    const idxOfLaser = ASTEROIDS.findIndex(asteroid => asteroid[0] === LASER_Y && asteroid[1] === LASER_X);

    const SLOPES = {};
    for (let j = 0; j < ASTEROIDS.length; ++j) {
      if (j === idxOfLaser) continue;
      const rise = LASER_Y - ASTEROIDS[j][0];                       // reversed to be negative, since a higher row is physically lower
      const run = ASTEROIDS[j][1] - LASER_X;
      const slope = rise / run;
      const riseSign = rise > 0 ? '+' : rise < 0 ? '-' : '0';
      const runSign = run > 0 ? '+' : run < 0 ? '-' : '0';
      const quadrantCode = `${riseSign}${runSign}`;
      const serial = `${quadrantCode}|${slope}`;
      if (!(serial in SLOPES)) SLOPES[serial] = [];
      SLOPES[serial].push(j);
    }

    const QUADRANT_CODE_PRIORITY = {
      '+0': 0,
      '++': 1,
      '0+': 2,
      '-+': 3,
      '-0': 4,
      '--': 5,
      '0-': 6,
      '+-': 7,
    };

    const SORTED_SLOPES = Object.keys(SLOPES).sort((a, b) => {
      const [ quadrantCodeA, slopeA ] = a.split('|');
      const [ quadrantCodeB, slopeB ] = b.split('|');

      return QUADRANT_CODE_PRIORITY[quadrantCodeA] - QUADRANT_CODE_PRIORITY[quadrantCodeB]
              || +slopeB - +slopeA;
    });

    function getDistanceSquared(idx1, idx2) {
      return (ASTEROIDS[idx1][0] - ASTEROIDS[idx2][0])**2 + (ASTEROIDS[idx1][1] - ASTEROIDS[idx2][1])**2;
    }

    for (const slope of SORTED_SLOPES) {
      SLOPES[slope].sort((a, b) => getDistanceSquared(idxOfLaser, b) - getDistanceSquared(idxOfLaser, a));
    }

    const FINAL_ASTEROID_NUM = extraParam.finalAsteroidNum;

    const DESTROYED_ASTEROIDS = [];
    let currentSlopeIdx = 0;
    for (let asteroid = 1; asteroid <= FINAL_ASTEROID_NUM; ++asteroid) {
      while (!SLOPES[SORTED_SLOPES[currentSlopeIdx]].length) {
        currentSlopeIdx = (currentSlopeIdx + 1) % SORTED_SLOPES.length;
      }
      DESTROYED_ASTEROIDS.push(SLOPES[SORTED_SLOPES[currentSlopeIdx]].pop());
      currentSlopeIdx = (currentSlopeIdx + 1) % SORTED_SLOPES.length;
    }

    if (DISPLAY_EXTRA_INFO) {
      console.log(`INDEX OF LASER: ${idxOfLaser} | ${ASTEROIDS[idxOfLaser]}`);
      // console.log('DESTROYED ASTEROIDS:');
      // for (const asteroid of DESTROYED_ASTEROIDS) {
      //   console.log(`${asteroid} | ${ASTEROIDS[asteroid]}`);
      // }
    }

    const finalAsteroidIdx = DESTROYED_ASTEROIDS.at(-1);
    const [ finalAsteroidY, finalAsteroidX ] = ASTEROIDS[finalAsteroidIdx];
    return finalAsteroidX * 100 + finalAsteroidY;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = asteroidLineOfSight;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const skippedTests = new Set([  ]);
const lowestTest = 0;
const highestTest = 0;

const fs = require('fs');
const path = require('path');
const { checkPrime } = require('crypto');
const DAY_NUM = __filename.split('.js')[0].split('day')[1];
const INPUT_PATH = path.join(__dirname, `day${DAY_NUM}-input.txt`);
const actualInput = fs.readFileSync(INPUT_PATH, 'utf8');
const parseSampleInput = s => s.split('').map(c => c === '\n' ? '\r\n' : c).join('');

const sampleInput = parseSampleInput(
`.#..#
.....
#####
....#
...##`
);

const sampleInput2 = parseSampleInput(
`......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`
);

const sampleInput3 = parseSampleInput(
`#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.`
);

const sampleInput4 = parseSampleInput(
`.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..`
);

const sampleInput5 = parseSampleInput(
`.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`
);

const sampleInput6 = parseSampleInput(
`.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....#...###..
..#.#.....#....##`
);

const sampleInput7 = parseSampleInput(
`.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: null,
  DEBUG: true,
};
expected = 8;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  extraParam: null,
  DEBUG: true,
};
expected = 33;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  extraParam: null,
  DEBUG: true,
};
expected = 35;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInput4,
  extraParam: null,
  DEBUG: true,
};
expected = 41;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: sampleInput5,
  extraParam: null,
  DEBUG: true,
};
expected = 210;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: null,
};
expected = 214;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  inputStr: sampleInput6,
  extraParam: {
    laserCoords: [ 3, 8 ],
    finalAsteroidNum: 36,
  },
  DEBUG: true,
};
expected = 1403;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  inputStr: sampleInput7,
  extraParam: {
    laserCoords: [ 13, 11 ],
    finalAsteroidNum: 200,
  },
  DEBUG: true,
};
expected = 802;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 9
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: {
    laserCoords: [ 16, 8 ],
    finalAsteroidNum: 200,
  },
};
expected = 502;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);