// --- Day 24: Planet of Discord ---

// PART 1:

// You land on Eris, your last stop before reaching Santa. As soon as you do, your sensors start picking up strange life forms moving around: Eris is infested with bugs! With an over 24-hour roundtrip for messages between you and Earth, you'll have to deal with this problem on your own.

// Eris isn't a very large place; a scan of the entire area fits into a 5x5 grid (your puzzle input). The scan shows bugs (#) and empty spaces (.).

// Each minute, The bugs live and die based on the number of bugs in the four adjacent tiles:

// A bug dies(becoming an empty space) unless there is exactly one bug adjacent to it.
// An empty space becomes infested with a bug if exactly one or two bugs are adjacent to it.
//   Otherwise, a bug or empty space remains the same. (Tiles on the edges of the grid have fewer than four adjacent tiles; the missing tiles count as empty space.) This process happens in every location simultaneously; that is, within the same minute, the number of adjacent bugs is counted for every tile first, and then the tiles are updated.

// Here are the first few minutes of an example scenario:

// Initial state:
// ....#
// #..#.
// #..##
// ..#..
// #....

// After 1 minute:
// #..#.
// ####.
// ###.#
// ##.##
// .##..

// After 2 minutes:
// #####
// ....#
// ....#
// ...#.
// #.###

// After 3 minutes:
// #....
// ####.
// ...##
// #.##.
// .##.#

// After 4 minutes:
// ####.
// ....#
// ##..#
// .....
// ##...

// To understand the nature of the bugs, watch for the first time a layout of bugs and empty spaces matches any previous layout.In the example above, the first layout to appear twice is:

// .....
// .....
// .....
// #....
// .#...

// To calculate the biodiversity rating for this layout, consider each tile left - to - right in the top row, then left - to - right in the second row, and so on.Each of these tiles is worth biodiversity points equal to increasing powers of two: 1, 2, 4, 8, 16, 32, and so on.Add up the biodiversity points for tiles with bugs; in this example, the 16th tile(32768 points) and 22nd tile(2097152 points) have bugs, a total biodiversity rating of 2129920.

// What is the biodiversity rating for the first layout that appears twice ?

// PART 2:

// After careful analysis, one thing is certain: you have no idea where all these bugs are coming from.

// Then, you remember: Eris is an old Plutonian settlement! Clearly, the bugs are coming from recursively - folded space.

//   This 5x5 grid is only one level in an infinite number of recursion levels.The tile in the middle of the grid is actually another 5x5 grid, the grid in your scan is contained as the middle tile of a larger 5x5 grid, and so on.Two levels of grids look like this:

//        |     |         |     |     
//        |     |         |     |     
//        |     |         |     |
//   -----+-----+---------+-----+-----
//        |     |         |     |     
//        |     |         |     |     
//        |     |         |     |
//   -----+-----+---------+-----+-----
//        |     | | | | | |     |     
//        |     |-+-+-+-+-|     |     
//        |     | | | | | |     |     
//        |     |-+-+-+-+-|     |     
//        |     | | |?| | |     |     
//        |     |-+-+-+-+-|     |     
//        |     | | | | | |     |     
//        |     |-+-+-+-+-|     |     
//        |     | | | | | |     |
//   -----+-----+---------+-----+-----
//        |     |         |     |     
//        |     |         |     |     
//        |     |         |     |
//   -----+-----+---------+-----+-----
//        |     |         |     |     
//        |     |         |     |     
//        |     |         |     |

// (To save space, some of the tiles are not drawn to scale.) Remember, this is only a small part of the infinitely recursive grid; there is a 5x5 grid that contains this diagram, and a 5x5 grid that contains that one, and so on.Also, the ? in the diagram contains another 5x5 grid, which itself contains another 5x5 grid, and so on.

// The scan you took(your puzzle input) shows where the bugs are on a single level of this structure.The middle tile of your scan is empty to accommodate the recursive grids within it.Initially, no other levels contain bugs.

// Tiles still count as adjacent if they are directly up, down, left, or right of a given tile.Some tiles have adjacent tiles at a recursion level above or below its own level.For example:

//        |     |         |     |
//     1  |  2  |    3    |  4  |  5
//        |     |         |     |
//   -----+-----+---------+-----+-----
//        |     |         |     |
//     6  |  7  |    8    |  9  |  10
//        |     |         |     |
//   -----+-----+---------+-----+-----
//        |     |A|B|C|D|E|     |     
//        |     |-+-+-+-+-|     |     
//        |     |F|G|H|I|J|     |     
//        |     |-+-+-+-+-|     |
//     11 |  12 |K|L|?|N|O|  14 |  15
//        |     |-+-+-+-+-|     |     
//        |     |P|Q|R|S|T|     |     
//        |     |-+-+-+-+-|     |     
//        |     |U|V|W|X|Y|     |
//   -----+-----+---------+-----+-----
//        |     |         |     |
//     16 |  17 |    18   |  19 |  20
//        |     |         |     |
//   -----+-----+---------+-----+-----
//        |     |         |     |
//     21 |  22 |    23   |  24 |  25
//        |     |         |     |

// Tile 19 has four adjacent tiles: 14, 18, 20, and 24.
// Tile G has four adjacent tiles: B, F, H, and L.
// Tile D has four adjacent tiles: 8, C, E, and I.
// Tile E has four adjacent tiles: 8, D, 14, and J.
// Tile 14 has eight adjacent tiles: 9, E, J, O, T, Y, 15, and 19.
// Tile N has eight adjacent tiles: I, O, S, and five tiles within the sub - grid marked ?.
// The rules about bugs living and dying are the same as before.

// For example, consider the same initial state as above:

// ....#
// #..#.
// #.?##
// ..#..
// #....

// The center tile is drawn as ?to indicate the next recursive grid.Call this level 0; the grid within this one is level 1, and the grid that contains this one is level - 1. Then, after ten minutes, the grid at each level would look like this:

// Depth - 5:
// ..#..
// .#.#.
// ..?.#
// .#.#.
// ..#..

// Depth - 4:
// ...#.
// ...##
// ..?..
// ...##
// ...#.

// Depth - 3:
// #.#..
// .#...
// ..?..
// .#...
// #.#..

// Depth - 2:
// .#.##
// ....#
// ..?.#
// ...##
// .###.

// Depth - 1:
// #..##
// ...##
// ..?..
// ...#.
// .####

// Depth 0:
// .#...
// .#.##
// .#?..
// .....
// .....

// Depth 1:
// .##..
// #..##
// ..?.#
// ##.##
// #####

// Depth 2:
// ###..
// ##.#.
// #.?..
// .#.##
// #.#..

// Depth 3:
// ..###
// .....
// #.?..
// #....
// #...#

// Depth 4:
// .###.
// #..#.
// #.?..
// ##.#.
// .....

// Depth 5:
// ####.
// #..#.
// #.?#.
// ####.
// .....

// In this example, after 10 minutes, a total of 99 bugs are present.

// Starting with your scan, how many bugs are present after 200 minutes ?

function gameOfLife (part, initialState, time = Infinity) {                                       // part 2 uses time; in part 1 we break when a repeated state is found, so time can be Infinity

  // HELPER FUNCTION: INVOKE TO SIMULATE GAME OF LIFE (MUTATES STATE)
  function simulate () {

    // UTILITY FUNCTION: GENERATE NEW GRID (USEFUL BOTH FOR nextState AND NEW LEVELS)
    function newGrid () {
      return Array.from({length: h}, () => Array.from({length: w}, () => space));
    }

    // UTILITY FUNCTION: GIVEN A state, level, row, AND col, CALCULATE THE NUMBER OF NEIGHBORING BUGS
    function checkNeighbors (state, level, row, col) {
      
      let neighboringBugs = 0;

      // CHECK OUTER BOUNDARY
      if ((+level - 1) in state) {
        ['up', 'down', 'left', 'right'].forEach((_, i) => {                                       // we split by direction instead of by coords, because we want corners to process twice (check two directions)
            if (
              i === 0 && row === 0 && state[+level - 1][midHeight - 1][midWidth] === bug          // check up (top row)
              || i === 1 && row === h - 1 && state[+level - 1][midHeight + 1][midWidth] === bug   // check down (bottom row)
              || i === 2 && col === 0 && state[+level - 1][midHeight][midWidth - 1] === bug       // check left (left column)
              || i === 3 && col === w - 1 && state[+level - 1][midHeight][midWidth + 1] === bug   // check right (right column)
            ) neighboringBugs++;
        });
      }

      // CHECK INNER BOUNDARY
      if ((+level + 1) in state) {                                                                // here it is better to split by direction because there is only one square at base level, vs. many neighbors
        if (row === midHeight + 1 && col === midWidth) {                                          // check up
          for (let i = 0; i < w; i++) neighboringBugs += state[+level + 1][h - 1][i] === bug;
        }
        if (row === midHeight - 1 && col === midWidth) {                                          // check down
          for (let i = 0; i < w; i++) neighboringBugs += state[+level + 1][0][i] === bug;
        }
        if (row === midHeight && col === midWidth + 1) {                                          // check left
          for (let i = 0; i < h; i++) neighboringBugs += state[+level + 1][i][w - 1] === bug;
        }
        if (row === midHeight && col === midWidth - 1) {                                          // check right
          for (let i = 0; i < h; i++) neighboringBugs += state[+level + 1][i][0] === bug;
        }
      }

      // CHECK GENERAL CASE - note: in part 2 do not worry about inner boundary as the centers will always be bug-free
      neighboringBugs += (row !== 0 && state[level][row - 1][col] === bug);                       // check up
      neighboringBugs += (row !== h - 1 && state[level][row + 1][col] === bug);                   // check down
      neighboringBugs += (col !== 0 && state[level][row][col - 1] === bug);                       // check left
      neighboringBugs += (col !== w - 1 && state[level][row][col + 1] === bug);                   // check right

      return neighboringBugs;
    }

    // INITIALIZATIONS
    const seenStates = { initialState: 0 };                                                       // for part 1. tick 0 is the initial state (which is already in string form)
    let innerMostLevel = 0;
    let outerMostLevel = 0;

    let tick = 1;
    while (tick <= time) {                                                                        // when tick = N, we simulate Nth minute

      // STEP 1: INITIALIZE nextState, AND IF PART 2, ADD EXTRA LEVELS TO state
      const nextState = {};
      if (part === 2) {
        innerMostLevel++;                                                                         // increment innerMostLevel and decrement outerMostLevel in case of spillover
        outerMostLevel--;                                                                         // (we will delete extraneous levels at the end)
        state[innerMostLevel] = newGrid();
        state[outerMostLevel] = newGrid();
      }

      // STEP 2: DETERMINE nextState CONFIGURATION BASED ON CURRENT state
      for (const level in state) {
        if (!(level in nextState)) nextState[level] = newGrid();                                  // for each level in state, initialize matrix filled with space for the same level in nextState
        for (let row = 0; row < h; row++) {                                                       // iterate through current level's matrix to calculate nextState
          for (let col = 0; col < w; col++) {
            if (                                                                                  // PART 2 ONLY: skip middle square
              part === 2
              && row === midHeight
              && col === midWidth
            ) continue;
            const neighboringBugs = checkNeighbors(state, level, row, col);                       // check neighbors (including from adjacent levels)
            if (
              state[level][row][col] === bug && neighboringBugs === 1                             // bug stays alive if neighboringBugs === 1
              || state[level][row][col] === space && neighboringBugs > 0 && neighboringBugs < 3   // space becomes infested is neighboringBugs is between 1..2
            ) {
              nextState[level][row][col] = bug;
            }
          }
        }
      }

      // REMOVE EXTRANEOUS LEVELS OF nextState AND state
      if (outerMostLevel !== innerMostLevel) {
        [outerMostLevel, innerMostLevel].forEach((level, i) => {
          let bugs = 0;
          for (let row = 0; row < h; row++) {
            for (let col = 0; col < w; col++) {
              if (                                                                                // skip middle square
                row === midHeight
                && col === midWidth
              ) continue;
              if (nextState[level][row][col] === bug) bugs++;                                     // we only count bugs in nextState...
            }
          }
          if (!bugs) {
            delete state[level];                                                                  // ...but we delete that level for both state AND nextState
            delete nextState[level];
            i ? innerMostLevel-- : outerMostLevel++;
          }
        });
      }

      // TRANSFER DATA FROM nextState TO CURRENT state
      for (const level in nextState) {                                                            // copy data from nextState to current matrix
        // if (!(level in state)) state[level] = newGrid();
        for (let row = 0; row < h; row++) {
          for (let col = 0; col < w; col++) {
            if (                                                                                  // PART 2 ONLY: skip middle square
              part === 2
              && row === midHeight
              && col === midWidth
            ) continue;
            state[level][row][col] = nextState[level][row][col];
          }
        }
      }

      // PART 1 ONLY: BREAK IF REPEATED STATE
      if (part === 1) {                                                                           // in part 1, save a record of previously seen states
        const stringified = state[0].map(row => row.join('')).join('\n');                         // convert state into string form
        if (stringified in seenStates) break;                                                     // as soon as a repeated state is found, break out of infinite while loop and prepare for return
        seenStates[stringified] = tick;
      }

      tick++;
    }

    return state;                                                                                 // return current value of state
  }

  // CONSTANTS
  const bug = '#';
  const space = '.';

  // INTIALIZATIONS
  const state = {0: initialState.split('\n').map(row => row.split(''))};                          // initial state represents grid at level 0. as more levels appear, more entries will be added
  const h = state[0].length;
  const w = state[0][0].length;
  const midHeight = Math.floor(h / 2);
  const midWidth = Math.floor(w / 2);

  // CALL THE HELPER TO MUTATE `state`
  simulate();

  // PART 1 VS PART 2
  if (part === 1) {

    let biodiversity = 0;
    for (let row = 0; row < h; row++) {                                                           // note: only level 0 should exist in state
      for (let col = 0; col < w; col++) {
        if (state[0][row][col] === bug) biodiversity += 2 ** (row * w + col);                     // each bug adds to biodiversity by 2 ^ (row * width + col)
      }
    }
    return biodiversity;

  } else {

    let totalBugs = 0;
    for (const level in state) {
      for (let row = 0; row < h; row++) {
        for (let col = 0; col < w; col++) {
          if (                                                                                    // skip middle square
            row === midHeight
            && col === midWidth
          ) continue;
          if (state[level][row][col] === bug) totalBugs++;                                        // count bugs
        }
      }
    }
    return totalBugs;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = gameOfLife;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const actualInput = `.#.##
.###.
##.#.
####.
##.##`;

// Test case 1
input = {
  part: 1,
  initialState: `....#
#..#.
#..##
..#..
#....`,
};
expected = 2129920;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  initialState: actualInput,
};
expected = 19516944;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  initialState: `....#
#..#.
#..##
..#..
#....`,
  time: 10,
};
expected = 99;
test(func, input, expected, testNum, lowestTest, highestTest);


// Test case 4
input = {
  part: 2,
  initialState: actualInput,
  time: 200,
};
expected = 2006;
test(func, input, expected, testNum, lowestTest, highestTest);