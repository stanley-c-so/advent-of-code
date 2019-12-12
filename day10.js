// --- Day 10: Monitoring Station ---

// PART 1:

// You fly into the asteroid belt and reach the Ceres monitoring station. The Elves here have an emergency: they're having trouble tracking all of the asteroids and can't be sure they're safe.

// The Elves would like to build a new monitoring station in a nearby area of space; they hand you a map of all of the asteroids in that region (your puzzle input).

// The map indicates whether each position is empty (.) or contains an asteroid (#). The asteroids are much smaller than they appear on the map, and every asteroid is exactly in the center of its marked position. The asteroids can be described with X,Y coordinates where X is the distance from the left edge and Y is the distance from the top edge (so the top-left corner is 0,0 and the position immediately to its right is 1,0).

// Your job is to figure out which asteroid would be the best place to build a new monitoring station. A monitoring station can detect any asteroid to which it has direct line of sight - that is, there cannot be another asteroid exactly between them. This line of sight can be at any angle, not just lines aligned to the grid or diagonally. The best location is the asteroid that can detect the largest number of other asteroids.

// For example, consider the following map:

// .#..#
// .....
// #####
// ....#
// ...##

// The best location for a new monitoring station on this map is the highlighted asteroid at 3,4 because it can detect 8 asteroids, more than any other location. (The only asteroid it cannot detect is the one at 1,0; its view of this asteroid is blocked by the asteroid at 2,2.) All other asteroids are worse locations; they can detect 7 or fewer other asteroids. Here is the number of other asteroids a monitoring station on each asteroid could detect:

// .7..7
// .....
// 67775
// ....7
// ...87

// Here is an asteroid (#) and some examples of the ways its line of sight might be blocked. If there were another asteroid at the location of a capital letter, the locations marked with the corresponding lowercase letter would be blocked and could not be detected:

// #.........
// ...A......
// ...B..a...
// .EDCG....a
// ..F.c.b...
// .....c....
// ..efd.c.gb
// .......c..
// ....f...c.
// ...e..d..c

// Here are some larger examples:

// Best is 5,8 with 33 other asteroids detected:

// ......#.#.
// #..#.#....
// ..#######.
// .#.#.###..
// .#..#.....
// ..#....#.#
// #..#....#.
// .##.#..###
// ##...#..#.
// .#....####

// Best is 1,2 with 35 other asteroids detected:

// #.#...#.#.
// .###....#.
// .#....#...
// ##.#.#.#.#
// ....#.#.#.
// .##..###.#
// ..#...##..
// ..##....##
// ......#...
// .####.###.

// Best is 6,3 with 41 other asteroids detected:

// .#..#..###
// ####.###.#
// ....###.#.
// ..###.##.#
// ##.##.#.#.
// ....###..#
// ..#.#..#.#
// #..#.#.###
// .##...##.#
// .....#.#..

// Best is 11,13 with 210 other asteroids detected:

// .#..##.###...#######
// ##.############..##.
// .#.######.########.#
// .###.#######.####.#.
// #####.##.#.##.###.##
// ..#####..#.#########
// ####################
// #.####....###.#.#.##
// ##.#################
// #####.##.###..####..
// ..######..##.#######
// ####.##.####...##..#
// .#####..#.######.###
// ##...#.##########...
// #.##########.#######
// .####.#.###.###.#.##
// ....##.##.###..#####
// .#.#.###########.###
// #.#.#.#####.####.###
// ###.##.####.##.#..##

// Find the best location for a new monitoring station. How many other asteroids can be detected from that location?

// PART 2:

// Once you give them the coordinates, the Elves quickly deploy an Instant Monitoring Station to the location and discover the worst: there are simply too many asteroids.

// The only solution is complete vaporization by giant laser.

// Fortunately, in addition to an asteroid scanner, the new monitoring station also comes equipped with a giant rotating laser perfect for vaporizing asteroids. The laser starts by pointing up and always rotates clockwise, vaporizing any asteroid it hits.

// If multiple asteroids are exactly in line with the station, the laser only has enough power to vaporize one of them before continuing its rotation. In other words, the same asteroids that can be detected can be vaporized, but if vaporizing one asteroid makes another one detectable, the newly-detected asteroid won't be vaporized until the laser has returned to the same position by rotating a full 360 degrees.

// For example, consider the following map, where the asteroid with the new monitoring station (and laser) is marked X:

// .#....#####...#..
// ##...##.#####..##
// ##...#...#.#####.
// ..#.....X...###..
// ..#.#.....#....##

// The first nine asteroids to get vaporized, in order, would be:

// .#....###24...#..
// ##...##.13#67..9#
// ##...#...5.8####.
// ..#.....X...###..
// ..#.#.....#....##

// Note that some asteroids (the ones behind the asteroids marked 1, 5, and 7) won't have a chance to be vaporized until the next full rotation. The laser continues rotating; the next nine to be vaporized are:

// .#....###.....#..
// ##...##...#.....#
// ##...#......1234.
// ..#.....X...5##..
// ..#.9.....8....76

// The next nine to be vaporized are then:

// .8....###.....#..
// 56...9#...#.....#
// 34...7...........
// ..2.....X....##..
// ..1..............

// Finally, the laser completes its first full rotation (1 through 3), a second rotation (4 through 8), and vaporizes the last asteroid (9) partway through its third rotation:

// ......234.....6..
// ......1...5.....7
// .................
// ........X....89..
// .................

// In the large example above (the one with the best monitoring station location at 11,13):

// The 1st asteroid to be vaporized is at 11,12.
// The 2nd asteroid to be vaporized is at 12,1.
// The 3rd asteroid to be vaporized is at 12,2.
// The 10th asteroid to be vaporized is at 12,8.
// The 20th asteroid to be vaporized is at 16,0.
// The 50th asteroid to be vaporized is at 16,9.
// The 100th asteroid to be vaporized is at 10,16.
// The 199th asteroid to be vaporized is at 9,6.
// The 200th asteroid to be vaporized is at 8,2.
// The 201st asteroid to be vaporized is at 10,9.
// The 299th and final asteroid to be vaporized is at 11,1.

// The Elves are placing bets on which will be the 200th asteroid to be vaporized. Win the bet by determining which asteroid that will be; what do you get if you multiply its X coordinate by 100 and then add its Y coordinate? (For example, 8,2 becomes 802.)

function bestAsteroidLocation (part, asteroidStr, n, startX, startY) {        // n, startX, and startY are for part 2

  // UTILITY FUNCTION: GIVEN INTEGER INPUTS, FIND POSITIVE GREATEST COMMON DENOMINATOR
  function GCD (num, denom) {                                                 // uses Euclidean algorithm (https://en.wikipedia.org/wiki/Euclidean_algorithm)
    num = Math.abs(num);
    denom = Math.abs(denom);
    return denom ? GCD(denom, num % denom) : num;
  }

  // UTILITY FUNCTION: GIVEN INTEGER INPUTS, FIND SLOPE (DISTINGUISH BETWEEN -RISE/RUN AND RISE/-RUN)
  function simplifySlope (rise, run) {
    if (!rise) return run > 0 ? '+0' : '-0';                                  // signs are needed to distinguish between looking left (negative) or looking right (positive)
    if (!run) return rise > 0 ? 'Infinity' : '-Infinity';                     // signs are needed to distinguish between looking up (negative) or looking down (positive) (higher row means down)
    const gcd = GCD(rise, run);                                               // credit to Phrogz (https://stackoverflow.com/questions/4652468/is-there-a-javascript-function-that-reduces-a-fraction)
    return `${rise/gcd},${run/gcd}`;                                          // we distinguish between -rise/run and rise/-run since those would imply two directions of visibility along the same slope
  }

  // PARSE INPUT DATA AND CREATE HASH OF ALL ASTEROIDS, ALONG WITH A HASH OF ALL SLOPES (ANGLES) OF OTHER ASTEROIDS VISIBLE FROM THAT POSITION
  const asteroidArr = asteroidStr.split('\n');
  const h = asteroidArr.length;
  const w = asteroidArr[0].length;
  const asteroidObj = {};
  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      if (asteroidArr[row][col] !== '.') {                                            // supports any non '.' as asteroid, since one of the examples specifically marks out an asteroid as 'X'
        asteroidObj[`${col},${row}`] = {};                                            // note the switch: the key will be in format `X,Y` because that's how the problem expresses it
      }
    }
  }

  // FOR EACH ASTEROID, GATHER SLOPE DATA RELATIVE TO ALL OTHER ASTEROIDS
  const asteroidObjKeys = Object.keys(asteroidObj);
  for (let i = 0; i < asteroidObjKeys.length; i++) {                                  // each asteroid A considers every other asteroid B...
    for (let j = 0; j < asteroidObjKeys.length; j++) {
      if (i === j) continue;                                                          // asteroid cannot see itself
      const [x1, y1] = asteroidObjKeys[i].split(',');                                 // again, note the format of the key, `X,Y`, because that's how the problem expresses it
      const [x2, y2] = asteroidObjKeys[j].split(',');
      const slope = simplifySlope((+y2 - +y1), (+x2 - +x1));                          // calculate slope
      if (!(slope in asteroidObj[asteroidObjKeys[i]])) {                              // add that slope as a key to asteroid A's hash
        asteroidObj[asteroidObjKeys[i]][slope] = [];                                  // use an array so we can sort in part 2 based on distance from laser
      }
      asteroidObj[asteroidObjKeys[i]][slope].push(asteroidObjKeys[j]);                // add asteroid B to the array corresponding to asteroid A's slope key
    }
  }

  // PART 1 VS PART 2
  if (part === 1) {

    // ITERATE THROUGH ASTEROID HASH AND FIND THE ONE WITH THE MOST SIGHT LINES (THE MOST SLOPE KEYS)
    let bestCoords;
    let mostAsteroids = 0;
    for (const coord in asteroidObj) {
      if (Object.keys(asteroidObj[coord]).length > mostAsteroids) {
        mostAsteroids = Object.keys(asteroidObj[coord]).length;
        bestCoords = coord;
      }
    }

    return [mostAsteroids, bestCoords.split(',').map(s => +s)];
    
  } else {

    // LOCATION OF LASER IS startX, startY WHICH IS EITHER DETERMINED BY FUNCTION INPUT OR ELSE IT DEFAULTS TO BEST ASTEROID LOCATION
    if (startX === undefined) [startX, startY] = bestAsteroidLocation(1, asteroidStr)[1];
    const laserLocation = `${startX},${startY}`

    // WE HAVE TO SORT THE DATA WITHIN COORDS SO THAT MULTIPLE ASTEROIDS IN A SINGLE LINE ARE ORDERED WITH FARTHER ASTEROIDS TO THE LASER FIRST (SO WE CAN POP)
    for (const coord in asteroidObj[laserLocation]) {
      asteroidObj[laserLocation][coord].sort((a, b) => {
        const [ax, ay] = a.split(',').map(s => +s);
        const [bx, by] = b.split(',').map(s => +s);
        return (Math.abs(bx - startX) + Math.abs(by - startY)) - (Math.abs(ax - startX) + Math.abs(ay - startY));
      })
    }

    const sortedSlopes = Object.keys(asteroidObj[laserLocation]).sort((a, b) => {         // we will sort by "sorter value": -Inf is 0, TR quadrant is 1, +0 is 2, ... , TL quadrant is 7
      const sorter = {a: undefined, b: undefined};                                        // these values will be calculated below
      const slopes = {a: undefined, b: undefined};                                        // these values will be calculated below
      const specialValues = {'-Infinity': 0, '+0': 2, 'Infinity' : 4, '-0': 6};           // these special values are unique because we can't to the rise/run calculation on them
      for (const comparator of [a, b]) {                                                  // do the following for both comparators a and b
        if (comparator in specialValues) {                                                // handle special values
          sorter[comparator] = specialValues[comparator];
          continue;
        }
        const [rise, run] = comparator.split(',').map(n => +n);                           // handle regular cases by calculating slope
        slopes[comparator] = rise / run;
        if (run > 0) {                                                                    // sort into categories linked to regular values
          if (rise < 0) sorter[comparator] = 1;
          else sorter[comparator] = 3;
        } else {
          if (rise > 0) sorter[comparator] = 5;
          else sorter[comparator] = 7;
        }
      }
      if (sorter[a] !== sorter[b] || a in specialValues) {          // if sorter[a] and sorter[b] are different values, or if they're both the same special value, compare by sorter values
        return sorter[a] - sorter[b];                               // (same values would produce 0 here which is fine)
      } else {                                                      // else, sorter[a] and sorter[b] are the same non-special value, in which case the lower slope value goes first
        return slopes[a] - slopes[b];
      }
    });

    let i = 0;
    let destroyed;
    while (n) {
      const currentSlope = sortedSlopes[i % sortedSlopes.length];
      if (currentSlope in asteroidObj[laserLocation]) {
        destroyed = asteroidObj[laserLocation][currentSlope].pop();
        n--;
        if (!asteroidObj[laserLocation][currentSlope].length) delete asteroidObj[laserLocation][currentSlope];
      }
      i++;
    }

    return destroyed.split(',').map(s => +s);
  }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = bestAsteroidLocation;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const actualInput = `.###.###.###.#####.#
#####.##.###..###..#
.#...####.###.######
######.###.####.####
#####..###..########
#.##.###########.#.#
##.###.######..#.#.#
.#.##.###.#.####.###
##..#.#.##.#########
###.#######.###..##.
###.###.##.##..####.
.##.####.##########.
#######.##.###.#####
#####.##..####.#####
##.#.#####.##.#.#..#
###########.#######.
#.##..#####.#####..#
#####..#####.###.###
####.#.############.
####.#.#.##########.`;

// Test case 1
input = {
  part: 1,
  asteroidStr: `.#..#
.....
#####
....#
...##`,
};
expected = [8, [3, 4]];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  asteroidStr: `......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`,
};
expected = [33, [5, 8]];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  asteroidStr: `#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.`,
};
expected = [35, [1, 2]];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  asteroidStr: `.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..`,
};
expected = [41, [6, 3]];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  asteroidStr: `.#..##.###...#######
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
###.##.####.##.#..##`,
};
expected = [210, [11, 13]];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  asteroidStr: actualInput,
};
expected = [214, [8, 16]];                                          // the first element is confirmed correct because it is the answer
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  asteroidStr: `.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....X...###..
..#.#.....#....##`,
  n: 36,
  startX: 8,                                                        // part1 indicates that the optimal place to start in this map is 4, 4. however, the example starts at 8, 3.
  startY: 3,                                                        // since we have expected data if it starts at 8, 3, i wanted to allow it to start there for part 2 testing purposes
};
expected = [14, 3];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  asteroidStr: `.#..##.###...#######
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
###.##.####.##.#..##`,
  n: 200,
};
expected = [8, 2];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 9
input = {
  part: 2,
  asteroidStr: actualInput,
  n: 200,
};
expected = [5, 2];
test(func, input, expected, testNum, lowestTest, highestTest);