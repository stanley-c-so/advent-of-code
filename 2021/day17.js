/*

--- Day 17: Trick Shot ---

You finally decode the Elves' message. HI, the message says. You continue searching for the sleigh keys.

Ahead of you is what appears to be a large ocean trench. Could the keys have fallen into it? You'd better send a probe to investigate.

The probe launcher on your submarine can fire the probe with any integer velocity in the x (forward) and y (upward, or downward if negative) directions. For example, an initial x,y velocity like 0,10 would fire the probe straight up, while an initial velocity like 10,-1 would fire the probe forward at a slight downward angle.

The probe's x,y position starts at 0,0. Then, it will follow some trajectory by moving in steps. On each step, these changes occur in the following order:

The probe's x position increases by its x velocity.
The probe's y position increases by its y velocity.
Due to drag, the probe's x velocity changes by 1 toward the value 0; that is, it decreases by 1 if it is greater than 0, increases by 1 if it is less than 0, or does not change if it is already 0.
Due to gravity, the probe's y velocity decreases by 1.

For the probe to successfully make it into the trench, the probe must be on some trajectory that causes it to be within a target area after any step. The submarine computer has already calculated this target area (your puzzle input). For example:

target area: x=20..30, y=-10..-5

This target area means that you need to find initial x,y velocity values such that after any step, the probe's x position is at least 20 and at most 30, and the probe's y position is at least -10 and at most -5.

Given this target area, one initial velocity that causes the probe to be within the target area after any step is 7,2:

.............#....#............
.......#..............#........
...............................
S........................#.....
...............................
...............................
...........................#...
...............................
....................TTTTTTTTTTT
....................TTTTTTTTTTT
....................TTTTTTTT#TT
....................TTTTTTTTTTT
....................TTTTTTTTTTT
....................TTTTTTTTTTT

In this diagram, S is the probe's initial position, 0,0. The x coordinate increases to the right, and the y coordinate increases upward. In the bottom right, positions that are within the target area are shown as T. After each step (until the target area is reached), the position of the probe is marked with #. (The bottom-right # is both a position the probe reaches and a position in the target area.)

Another initial velocity that causes the probe to be within the target area after any step is 6,3:

...............#..#............
...........#........#..........
...............................
......#..............#.........
...............................
...............................
S....................#.........
...............................
...............................
...............................
.....................#.........
....................TTTTTTTTTTT
....................TTTTTTTTTTT
....................TTTTTTTTTTT
....................TTTTTTTTTTT
....................T#TTTTTTTTT
....................TTTTTTTTTTT

Another one is 9,0:

S........#.....................
.................#.............
...............................
........................#......
...............................
....................TTTTTTTTTTT
....................TTTTTTTTTT#
....................TTTTTTTTTTT
....................TTTTTTTTTTT
....................TTTTTTTTTTT
....................TTTTTTTTTTT

One initial velocity that doesn't cause the probe to be within the target area after any step is 17,-4:

S..............................................................
...............................................................
...............................................................
...............................................................
.................#.............................................
....................TTTTTTTTTTT................................
....................TTTTTTTTTTT................................
....................TTTTTTTTTTT................................
....................TTTTTTTTTTT................................
....................TTTTTTTTTTT..#.............................
....................TTTTTTTTTTT................................
...............................................................
...............................................................
...............................................................
...............................................................
................................................#..............
...............................................................
...............................................................
...............................................................
...............................................................
...............................................................
...............................................................
..............................................................#

The probe appears to pass through the target area, but is never within it after any step. Instead, it continues down and to the right - only the first few steps are shown.

If you're going to fire a highly scientific probe out of a super cool probe launcher, you might as well do it with style. How high can you make the probe go while still reaching the target area?

In the above example, using an initial velocity of 6,9 is the best you can do, causing the probe to reach a maximum y position of 45. (Any higher initial y velocity causes the probe to overshoot the target area entirely.)

Find the initial velocity that causes the probe to reach the highest y position and still eventually be within the target area after any step. What is the highest y position it reaches on this trajectory?


--- Part Two ---

Maybe a fancy trick shot isn't the best idea; after all, you only have one probe, so you had better not miss.

To get the best idea of what your options are for launching the probe, you need to find every initial velocity that causes the probe to eventually be within the target area after any step.

In the above example, there are 112 different initial velocity values that meet these criteria:

23,-10  25,-9   27,-5   29,-6   22,-6   21,-7   9,0     27,-7   24,-5
25,-7   26,-6   25,-5   6,8     11,-2   20,-5   29,-10  6,3     28,-7
8,0     30,-6   29,-8   20,-10  6,7     6,4     6,1     14,-4   21,-6
26,-10  7,-1    7,7     8,-1    21,-9   6,2     20,-7   30,-10  14,-3
20,-8   13,-2   7,3     28,-8   29,-9   15,-3   22,-5   26,-8   25,-8
25,-6   15,-4   9,-2    15,-2   12,-2   28,-9   12,-3   24,-6   23,-7
25,-10  7,8     11,-3   26,-7   7,1     23,-9   6,0     22,-10  27,-6
8,1     22,-8   13,-4   7,6     28,-6   11,-4   12,-4   26,-9   7,4
24,-10  23,-8   30,-8   7,0     9,-1    10,-1   26,-5   22,-9   6,5
7,5     23,-6   28,-10  10,-2   11,-1   20,-9   14,-2   29,-7   13,-3
23,-5   24,-8   27,-9   30,-7   28,-5   21,-10  7,9     6,6     21,-5
27,-10  7,2     30,-9   21,-8   22,-7   24,-9   20,-6   6,9     29,-5
8,-2    27,-8   30,-5   24,-7

How many distinct initial velocity values cause the probe to be within the target area after any step?

*/

function trickShot (part, inputStr) {

  /*
    we can make two reasonable assumptions about our data, given that they hold true in both the example data as well as the actual data:
    
    (1) the left edge of the target area has positive x (i.e. it's to the right of the start)
    (2) the top edge of the target area has negative y (i.e. it's below the start)
  
    thus there is a red herring in this problem: x velocity would never be negative, because you must fire the cannon to the right (positive x),
    and once the velocity decays to 0 it will stay at 0. so we don't need to think about what its behavior would be if it were negative.
  
    there is a third reasonable assumption about our data we can make (again, because it holds true in the example and actual data), which is:

    (3) there is some starting x velocity we can shoot at, such that when the probe decays to 0 x velocity, we will be within the target area's
    x range. (to verify that this is the case, keep adding 1 + 2 + 3 + ... until you reach a number within the target area's x range, instead of
    passing over it.)

    the reason why (3) is so important is because it frees us to think only about the y axis, since we can just shoot at the key x velocity that
    is guaranteed to fall within the target area's x range.

    thus part 1 can be treated as a pure math problem: *in order to maximize maxHeight*, you have to shoot at the highest theoretical initial y velocity
    (we'll call it Y) that still lands on target. imagine you shoot the probe at Y. its value decrements until it reaches 0 as y === maxHeight, and the probe
    starts to fall. its fall will mirror the path of its rise (ignoring the x axis) until eventually the probe reaches y === 0 again (which will always happen).
    at this point, the y velocity will be -Y. then on the subsequent step, y velocity will be -(Y + 1) and the probe ends up at position -(Y + 1). since we are
    trying to maximize Y, it is possible that position -(Y + 1) would have dropped below the bottom edge of the target area, and thus we would not land on target.
    therefore, to avoid missing the target, the lowest we could go (since we are trying to maximize Y) is such that -(Y + 1) exactly matched the y value of the bottom
    edge of the target area. thus, for such a value of Y, maxHeight is simply 1 + 2 + 3 + ... + Y, or using euler's summation, Y * (Y + 1) / 2. simply
    substitute Y = abs(minTargetY) - 1.

    notably, you don't have to use the complete analysis above to approach part 1. as long as you realize the theoretical max initial y velocity, since you will
    try every combination of candidate x and y values anyway in part 2, you could still derive the max height empirically anyway. if you approach it this way,
    you don't even need to rely on assumption (3).

  */

  // PARSE DATA TO GET MIN AND MAX X AND Y VALUES OF TARGET AREA
  const data = inputStr.split(': ')[1];
  const [xData, yData] = data.split(', ');
  const xRangeStr = xData.slice(2);
  const [minTargetX, maxTargetX] = xRangeStr.split('..').map(n => +n);
  const yRangeStr = yData.slice(2);
  const [minTargetY, maxTargetY] = yRangeStr.split('..').map(n => +n);

  // THEORETICAL MAX VALUE OF Y AT WHICH YOU CAN SHOOT AND STILL BE ON TARGET (ANY HIGHER, AND YOUR FIRST STEP WITH y < 0 WILL ALREADY BE TOO FAR DOWN)
  const theoreticalMaxY = Math.abs(minTargetY) - 1;

  if (part === 1) {                                                                                       // PART 1: find max height (i.e. find height when shooting at theoretical max y)

    return theoreticalMaxY * (theoreticalMaxY + 1) / 2;                                                   // use euler's summation (see three assumptions)

  } else {                                                                                                // PART 2: count number of distinct pairs of initial shot velocities that hit target

    // HELPER FUNCTION - SIMULATE THE SHOT
    function shootOnTarget(xVelocity, yVelocity) {
      let x = 0;
      let y = 0;
      let maxHeight = 0;                                                                                  // OPTIONAL: track max height
      while (y >= minTargetY) {
        if (minTargetX <= x && x <= maxTargetX && minTargetY <= y && y <= maxTargetY) {
          return { onTarget: true, maxHeight };                                                           // OPTIONAL: instead of just returning onTarget bool, return max height
        }
        x += xVelocity;
        y += yVelocity;
        maxHeight = Math.max(maxHeight, y);                                                               // OPTIONAL: track max height
        if (xVelocity > 0) --xVelocity;
        // else if (xVelocity < 0) ++xVelocity;                                                           // don't truly need this because this will never happen
        --yVelocity;
      }
      return { onTarget: false, maxHeight: null };                                                        // OPTIONAL: instead of just returning onTarget bool, return max height
    }

    let maxHeight = 0;                                                                                    // OPTIONAL: track max height
    let numValues = 0;

    const theoreticalMinX = 1;                                                                            // any lower, and you wouldn't get any rightward movement (assumption (1))
    const theoreticalMaxX = maxTargetX;                                                                   // you could reach the right edge of the target area in one shot
    const theoreticalMinY = minTargetY;                                                                   // you could reach the bottom edge of the target area in one shot

    for (let xVelocity = theoreticalMinX; xVelocity <= theoreticalMaxX; ++xVelocity) {                    // simply try every combination of possible x velocity values...
      for (let yVelocity = theoreticalMinY; yVelocity <= theoreticalMaxY; ++yVelocity) {                  // ...with possible y velocity values...
        const simulate = shootOnTarget(xVelocity, yVelocity);
        if (simulate.onTarget) {
          ++numValues;                                                                                    // ...and count the successful shots
          maxHeight = Math.max(maxHeight, simulate.maxHeight);                                            // OPTIONAL: track max height
        }
      }
    }

    console.log('MAX HEIGHT WAS:', maxHeight);                                                            // OPTIONAL: inspect max height to verify part 1
    return numValues;

  }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = trickShot;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `target area: x=20..30, y=-10..-5`;

const actualInput = `target area: x=201..230, y=-99..-65`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 45;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 4851;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 112;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 1739;
test(func, input, expected, testNum, lowestTest, highestTest);