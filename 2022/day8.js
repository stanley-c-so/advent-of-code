/*

--- Day 8: Treetop Tree House ---

The expedition comes across a peculiar patch of tall trees all planted carefully in a grid. The Elves explain that a previous expedition planted these trees as a reforestation effort. Now, they're curious if this would be a good location for a tree house.

First, determine whether there is enough tree cover here to keep a tree house hidden. To do this, you need to count the number of trees that are visible from outside the grid when looking directly along a row or column.

The Elves have already launched a quadcopter to generate a map with the height of each tree (your puzzle input). For example:

30373
25512
65332
33549
35390

Each tree is represented as a single digit whose value is its height, where 0 is the shortest and 9 is the tallest.

A tree is visible if all of the other trees between it and an edge of the grid are shorter than it. Only consider trees in the same row or column; that is, only look up, down, left, or right from any given tree.

All of the trees around the edge of the grid are visible - since they are already on the edge, there are no trees to block the view. In this example, that only leaves the interior nine trees to consider:

The top-left 5 is visible from the left and top. (It isn't visible from the right or bottom since other trees of height 5 are in the way.)
The top-middle 5 is visible from the top and right.
The top-right 1 is not visible from any direction; for it to be visible, there would need to only be trees of height 0 between it and an edge.
The left-middle 5 is visible, but only from the right.
The center 3 is not visible from any direction; for it to be visible, there would need to be only trees of at most height 2 between it and an edge.
The right-middle 3 is visible from the right.
In the bottom row, the middle 5 is visible, but the 3 and 4 are not.

With 16 trees visible on the edge and another 5 visible in the interior, a total of 21 trees are visible in this arrangement.

Consider your map; how many trees are visible from outside the grid?


--- Part Two ---

Content with the amount of tree cover available, the Elves just need to know the best spot to build their tree house: they would like to be able to see a lot of trees.

To measure the viewing distance from a given tree, look up, down, left, and right from that tree; stop if you reach an edge or at the first tree that is the same height or taller than the tree under consideration. (If a tree is right on the edge, at least one of its viewing distances will be zero.)

The Elves don't care about distant trees taller than those found by the rules above; the proposed tree house has large eaves to keep it dry, so they wouldn't be able to see higher than the tree house anyway.

In the example above, consider the middle 5 in the second row:

30373
25512
65332
33549
35390

Looking up, its view is not blocked; it can see 1 tree (of height 3).
Looking left, its view is blocked immediately; it can see only 1 tree (of height 5, right next to it).
Looking right, its view is not blocked; it can see 2 trees.
Looking down, its view is blocked eventually; it can see 2 trees (one of height 3, then the tree of height 5 that blocks its view).

A tree's scenic score is found by multiplying together its viewing distance in each of the four directions. For this tree, this is 4 (found by multiplying 1 * 1 * 2 * 2).

However, you can do even better: consider the tree of height 5 in the middle of the fourth row:

30373
25512
65332
33549
35390

Looking up, its view is blocked at 2 trees (by another tree with a height of 5).
Looking left, its view is not blocked; it can see 2 trees.
Looking down, its view is also not blocked; it can see 1 tree.
Looking right, its view is blocked at 2 trees (by a massive tree of height 9).

This tree's scenic score is 8 (2 * 2 * 1 * 2); this is the ideal spot for the tree house.

Consider each tree on your map. What is the highest scenic score possible for any tree?

*/

// ===== SOLUTION 1: MORE BRUTE FORCE - AT EACH POSITION, PERFORM SCAN TO THE EDGES OF GRID

function visibleTrees (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  // if (DEBUG) {
  //   console.log(inputArr[0]);
  //   // console.log(inputArr[1]);
  // }

  // INIT
  const H = inputArr.length;
  const W = inputArr[0].length;
  const grid = Array.from({length: H}, (_, i) => inputArr[i].split('').map(n => +n));                   // convert input into numbers

  // ANALYZE
  if (part === 1) {                                                                                     // PART 1: COUNT VISIBLE TREES

    // COUNT VISIBLE TREES (init count with edge trees, and iterate through interior trees)
    let count = 2*(H + W) - 4;                                                                          // subtract 4 corners due to double counting

    // ANALYZE - the input here is sufficiently small to warrant manually checking the visibility by scanning at every position
    for (let row = 1; row < H - 1; ++row) {
      for (let col = 1; col < W - 1; ++col) {

        let visible = false;
        let rowPtr, colPtr;

        // check visibility from the top
        rowPtr = row - 1;
        while (!visible) {
          if (grid[rowPtr][col] >= grid[row][col]) break;
          if (rowPtr === 0) visible = true;
          --rowPtr;
        }

        // check visibility from the bottom
        rowPtr = row + 1;
        while (!visible) {
          if (grid[rowPtr][col] >= grid[row][col]) break;
          if (rowPtr === H - 1) visible = true;
          ++rowPtr;
        }

        // check visibility from the left
        colPtr = col - 1;
        while (!visible) {
          if (grid[row][colPtr] >= grid[row][col]) break;
          if (colPtr === 0) visible = true;
          --colPtr;
        }

        // check visibility from the right
        colPtr = col + 1;
        while (!visible) {
          if (grid[row][colPtr] >= grid[row][col]) break;
          if (colPtr === W - 1) visible = true;
          ++colPtr;
        }

        if (visible) ++count;
      }
    }

    return count;

  } else {                                                                                              // PART 2: FIND BEST SCENIC SCORE

    // INIT
    let bestScenicScore = 0;

    // ANALYZE - the input here is sufficiently small to warrant manually checking the scenic score by scanning at every position
    for (let row = 0; row < H; ++row) {
      for (let col = 0; col < W; ++col) {

        let rowPtr, colPtr;

        // get up-facing viewing distance
        let up = 0;
        rowPtr = row - 1;
        while (rowPtr >= 0) {
          ++up;
          if (grid[rowPtr][col] >= grid[row][col]) break;
          --rowPtr;
        }

        // get down-facing viewing distance
        let down = 0;
        rowPtr = row + 1;
        while (rowPtr < H) {
          ++down;
          if (grid[rowPtr][col] >= grid[row][col]) break;
          ++rowPtr;
        }

        // get left-facing viewing distance
        let left = 0;
        colPtr = col - 1;
        while (colPtr >= 0) {
          ++left;
          if (grid[row][colPtr] >= grid[row][col]) break;
          --colPtr;
        }

        // get right-facing viewing distance
        let right = 0;
        colPtr = col + 1;
        while (colPtr < W) {
          ++right;
          if (grid[row][colPtr] >= grid[row][col]) break;
          ++colPtr;
        }

        bestScenicScore = Math.max(bestScenicScore, up * down * left * right);
      }
    }

    return bestScenicScore;

  }
}


// ===== SOLUTION 2: BETTER TIME COMPLEXITY, BUT SLOWER ON SMALL INPUTS, AS HERE - USE DP, AS WELL AS A MONOTONIC STACK FOR PART 2

function visibleTrees2 (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  // if (DEBUG) {
  //   console.log(inputArr[0]);
  //   // console.log(inputArr[1]);
  // }

  // INIT
  const H = inputArr.length;
  const W = inputArr[0].length;
  const grid = Array.from({length: H}, (_, i) => inputArr[i].split('').map(n => +n));                   // convert input into numbers

  // DATA STRUCTURE - each position contains an object with 4 key/value pairs for each of the 4 directions (up, left, down, right)
  const dp = Array.from({length: H}, () => Array.from({length: W}, () => ({})));

  // ANALYZE
  if (part === 1) {                                                                                     // PART 1: COUNT VISIBLE TREES
                                                                                                        // dp[row][col] represents height of highest obstacle...
                                                                                                        // ...at given coords, from given direction

    // PROCESS DATA STRUCTURES

    for (let row = 0; row < H; ++row) {                                                                 // NOTE: ITERATE FROM TOP TO BOTTOM, LEFT TO RIGHT
      for (let col = 0; col < W; ++col) {

        // check up
        dp[row][col].up = row === 0 ? 0                                                                 // set to 0 for top edge
                                    : Math.max(grid[row - 1][col],                                      // otherwise, compare against grid AND dp values above
                                                dp[row - 1][col].up);
        // check left
        dp[row][col].left = col === 0 ? 0
                                      : Math.max(grid[row][col - 1],
                                                  dp[row][col - 1].left);                                        
      }
    }

    for (let row = H - 1; row >= 0; --row) {                                                            // NOTE: ITERATE FROM BOTTOM TO TOP, RIGHT TO LEFT
      for (let col = W - 1; col >= 0; --col) {

        // check down
        dp[row][col].down = row === H - 1 ? 0
                                          : Math.max(grid[row + 1][col],
                                                      dp[row + 1][col].down);
        // check right
        dp[row][col].right = col === W - 1 ? 0
                                            : Math.max(grid[row][col + 1],
                                                        dp[row][col + 1].right);
      }
    }

    // COUNT VISIBLE TREES (init count with edge trees, and iterate through interior trees)
    let count = 2*(H + W) - 4;                                                                          // subtract 4 corners due to double counting
    for (let row = 1; row < H - 1; ++row) {                                                             // NOTE: SKIP TOP AND BOTTOM ROWS
      for (let col = 1; col < W - 1; ++col) {                                                           // NOTE: SKIP LEFT AND RIGHT COLS
        const { up, left, down, right } = dp[row][col];
        if (
          grid[row][col] > up
          || grid[row][col] > left
          || grid[row][col] > down
          || grid[row][col] > right
        ) ++count;                                                                                      // tree is visible if its height exceeds ANY of...
                                                                                                        // ...its mask values in the 4 directions
      }
    }
    return count;

  } else {                                                                                              // PART 2: FIND BEST SCENIC SCORE
                                                                                                        // dp[row][col] represents view distance...
                                                                                                        // ...at given coords, while looking in given direction

    // PROCESS DATA STRUCTURES
    const monotonicStack = [];                                                                          // should be non-increasing

    // check up
    for (let col = 0; col < W; ++col) {                                                                 // NOTE: OUTER LOOP IS COLS, INNER LOOP IS ROWS
      monotonicStack.length = 0;                                                                        // clear stack
      for (let row = 0; row < H; ++row) {
        if (row === 0) {                                                                                // init dp value to 0 for top edge
          dp[row][col].up = 0;
        } else {
          while (monotonicStack.length && monotonicStack.at(-1).highest < grid[row][col]) {             // pop outdated values from monotonic stack
            monotonicStack.pop();
          }
          dp[row][col].up = monotonicStack.length ? Math.abs(monotonicStack.at(-1).coord - row)         // set dp value based on monotonic stack...
                                                  : row                                                 // ...or if stack empty, measure from edge
        }
        monotonicStack.push({ highest: grid[row][col], coord: row });                                   // add current value to monotonic stack
      }
    }

    // check left
    for (let row = 0; row < H; ++row) {                                                                 // NOTE: OUTER LOOP IS ROWS, INNER LOOP IS COLS
      monotonicStack.length = 0;
      for (let col = 0; col < W; ++col) {
        if (col === 0) {
          dp[row][col].left = 0;
        } else {
          while (monotonicStack.length && monotonicStack.at(-1).highest < grid[row][col]) {
            monotonicStack.pop();
          }
          dp[row][col].left = monotonicStack.length ? Math.abs(monotonicStack.at(-1).coord - col)
                                                    : col
        }
        monotonicStack.push({ highest: grid[row][col], coord: col });
      }
    }

    // check down
    for (let col = 0; col < W; ++col) {                                                                 // NOTE: OUTER LOOP IS COLS, INNER LOOP IS ROWS
      monotonicStack.length = 0;
      for (let row = H - 1; row >= 0; --row) {                                                          // NOTE: ITERATE THROUGH ROWS BACKWARD
        if (row === H - 1) {
          dp[row][col].down = 0;
        } else {
          while (monotonicStack.length && monotonicStack.at(-1).highest < grid[row][col]) {
            monotonicStack.pop();
          }
          dp[row][col].down = monotonicStack.length ? Math.abs(monotonicStack.at(-1).coord - row)
                                                    : H - 1 - row                                       // NOTE: DISTANCE TO EDGE CALCULATION BASED ON BOTTOM EDGE
        }
        monotonicStack.push({ highest: grid[row][col], coord: row });
      }
    }

    // check right
    for (let row = 0; row < H; ++row) {                                                                 // NOTE: OUTER LOOP IS ROWS, INNER LOOP IS COLS
      monotonicStack.length = 0;
      for (let col = W - 1; col >= 0; --col) {                                                          // NOTE: ITERATE THROUGH COLS BACKWARD
        if (col === W - 1) {
          dp[row][col].right = 0;
        } else {
          while (monotonicStack.length && monotonicStack.at(-1).highest < grid[row][col]) {
            monotonicStack.pop();
          }
          dp[row][col].right = monotonicStack.length ? Math.abs(monotonicStack.at(-1).coord - col)
                                                      : W - 1 - col                                     // NOTE: DISTANCE TO EDGE CALCULATION BASED ON RIGHT EDGE
        }
        monotonicStack.push({ highest: grid[row][col], coord: col });
      }
    }

    // INIT
    let bestScenicScore = 0;

    // ANALYZE
    for (let row = 1; row < H - 1; ++row) {
      for (let col = 1; col < W - 1; ++col) {
        const { up, left, down, right } = dp[row][col];
        bestScenicScore = Math.max(bestScenicScore, up * left * down * right);
      }
    }

    return bestScenicScore;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
// const func = visibleTrees;
const func = visibleTrees2;
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
`30373
25512
65332
33549
35390`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 21;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 1713;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 8;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 268464;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);