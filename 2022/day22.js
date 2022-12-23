/*

--- Day 22: Monkey Map ---

The monkeys take you on a surprisingly easy trail through the jungle. They're even going in roughly the right direction according to your handheld device's Grove Positioning System.

As you walk, the monkeys explain that the grove is protected by a force field. To pass through the force field, you have to enter a password; doing so involves tracing a specific path on a strangely-shaped board.

At least, you're pretty sure that's what you have to do; the elephants aren't exactly fluent in monkey.

The monkeys give you notes that they took when they last saw the password entered (your puzzle input).

For example:

        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5

The first half of the monkeys' notes is a map of the board. It is comprised of a set of open tiles (on which you can move, drawn .) and solid walls (tiles which you cannot enter, drawn #).

The second half is a description of the path you must follow. It consists of alternating numbers and letters:

A number indicates the number of tiles to move in the direction you are facing. If you run into a wall, you stop moving forward and continue with the next instruction.
A letter indicates whether to turn 90 degrees clockwise (R) or counterclockwise (L). Turning happens in-place; it does not change your current tile.
So, a path like 10R5 means "go forward 10 tiles, then turn clockwise 90 degrees, then go forward 5 tiles".

You begin the path in the leftmost open tile of the top row of tiles. Initially, you are facing to the right (from the perspective of how the map is drawn).

If a movement instruction would take you off of the map, you wrap around to the other side of the board. In other words, if your next tile is off of the board, you should instead look in the direction opposite of your current facing as far as you can until you find the opposite edge of the board, then reappear there.

For example, if you are at A and facing to the right, the tile in front of you is marked B; if you are at C and facing down, the tile in front of you is marked D:

        ...#
        .#..
        #...
        ....
...#.D.....#
........#...
B.#....#...A
.....C....#.
        ...#....
        .....#..
        .#......
        ......#.

It is possible for the next tile (after wrapping around) to be a wall; this still counts as there being a wall in front of you, and so movement stops before you actually wrap to the other side of the board.

By drawing the last facing you had with an arrow on each tile you visit, the full path taken by the above example looks like this:

        >>v#    
        .#v.    
        #.v.    
        ..v.    
...#...v..v#    
>>>v...>#.>>    
..#v...#....    
...>>>>v..#.    
        ...#....
        .....#..
        .#......
        ......#.

To finish providing the password to this strange input device, you need to determine numbers for your final row, column, and facing as your final position appears from the perspective of the original map. Rows start from 1 at the top and count downward; columns start from 1 at the left and count rightward. (In the above example, row 1, column 1 refers to the empty space with no tile on it in the top-left corner.) Facing is 0 for right (>), 1 for down (v), 2 for left (<), and 3 for up (^). The final password is the sum of 1000 times the row, 4 times the column, and the facing.

In the above example, the final row is 6, the final column is 8, and the final facing is 0. So, the final password is 1000 * 6 + 4 * 8 + 0: 6032.

Follow the path given in the monkeys' notes. What is the final password?


--- Part Two ---

As you reach the force field, you think you hear some Elves in the distance. Perhaps they've already arrived?

You approach the strange input device, but it isn't quite what the monkeys drew in their notes. Instead, you are met with a large cube; each of its six faces is a square of 50x50 tiles.

To be fair, the monkeys' map does have six 50x50 regions on it. If you were to carefully fold the map, you should be able to shape it into a cube!

In the example above, the six (smaller, 4x4) faces of the cube are:

        1111
        1111
        1111
        1111
222233334444
222233334444
222233334444
222233334444
        55556666
        55556666
        55556666
        55556666

You still start in the same position and with the same facing as before, but the wrapping rules are different. Now, if you would walk off the board, you instead proceed around the cube. From the perspective of the map, this can look a little strange. In the above example, if you are at A and move to the right, you would arrive at B facing down; if you are at C and move down, you would arrive at D facing up:

        ...#
        .#..
        #...
        ....
...#.......#
........#..A
..#....#....
.D........#.
        ...#..B.
        .....#..
        .#......
        ..C...#.

Walls still block your path, even if they are on a different face of the cube. If you are at E facing up, your movement is blocked by the wall marked by the arrow:

        ...#
        .#..
     -->#...
        ....
...#..E....#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

Using the same method of drawing the last facing you had with an arrow on each tile you visit, the full path taken by the above example now looks like this:

        >>v#    
        .#v.    
        #.v.    
        ..v.    
...#..^...v#    
.>>>>>^.#.>>    
.^#....#....    
.^........#.    
        ...#..v.
        .....#v.
        .#v<<<<.
        ..v...#.

The final password is still calculated from your final position and facing from the perspective of the map. In this example, the final row is 5, the final column is 7, and the final facing is 3, so the final password is 1000 * 5 + 4 * 7 + 3 = 5031.

Fold the map into a cube, then follow the path given in the monkeys' notes. What is the final password?


*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function navigateCubeSurface (part, inputStr, data, DEBUG = false) {

  if (!['sample', 'actual'].includes(data)) {                                       // this is necessary, as my PART 2 solution involves a lot of hard coding
    throw `ERROR: ${data} MUST BE 'sample' OR 'actual'`;
  }

  // PARSE INPUT DATA
  const inputArr = inputStr.split('\r\n');
  const INSTRUCTIONS = inputArr.at(-1);
  const H = inputArr.length - 2;                                                    // skip last 2 lines (last line is instructions; line before that is blank)
  let W = 0;                                                                        // NOTE: BECAUSE THE INPUT IS ANNOYING AND DOESN'T FILL IN SPACES TO THE END OF THE LINE...
  for (let row = 0; row < H; ++row) {
    W = Math.max(W, inputArr[row].length);                                          // ...WE HAVE TO PARSE THE DATA TO FIND W!
  }

  // INIT
  const GRID = [];
  for (let row = 0; row < H; ++row) {
    const rowStr = inputArr[row].padEnd(W, ' ');                                    // NOTE: pad the row to make sure all rows have equal width 
    GRID.push(rowStr.split(''));
  }
  const DIRS = [ [ +1, 0 ], [ 0, +1 ], [ -1, 0 ], [ 0, -1 ] ];
  const ARROWS = '>v<^';                                                            // we only need this if we want to display the grid

  let y = 0;                                                                        // we begin at the top row...
  let x = GRID[y].indexOf('.');                                                     // ...at the leftmost '.'
  let dir = 0;                                                                      // init at 0 for R (0 is R, 1 is D, 2 is L, 3 is U)


  // PART 2 HARD CODING: ANALYZE THE CUBE DIAGRAM AND CONNECT TOGETHER THE EDGES THAT WILL BE TOUCHING ONCE THE CUBE IS FOLDED
  const CONNECTIONS = {};                                                           // keys are serials of position coords. values are a nested object,
                                                                                    // as the same position may have special edges in two directions.
                                                                                    // the keys of the nested object is the number representing a direction.
                                                                                    // the value of the nested object is yet another nested object indicating
                                                                                    // the position and new direction of the coordinate of the matching edge


  const S = data === 'sample' ? 4 :                                                 // S is the length of one side of the cube
            data === 'actual' ? 50 :
                                0;

  if (data === 'sample') {

    /*
      REFERENCE IMAGE:

             Aa
            G  B
            g  b
       aA Gg --
      D  |  |  C
      d  |  |  c
       Ee Ff -- cC
            f  |  b
            F  |  B
             eE dD

    */

    for (let i = 0; i < S; ++i) {

      // Aa
      const A1 = `${8 + i},${0}`;                                                   // start position ('A') of one edge 'Aa'
      const A2 = `${3 - i},${4}`;                                                   // start position ('A') of other edge 'Aa'
      if (!(A1 in CONNECTIONS)) CONNECTIONS[A1] = {};
      if (3 in CONNECTIONS[A1]) throw `ERROR: ${3} already in CONNECTIONS[${A1}]`;  // sanity check: for any edge position, there should be at most 1 entry for a given direction
      CONNECTIONS[A1][3] = { connection: A2, destinationDir: 1 };
      if (!(A2 in CONNECTIONS)) CONNECTIONS[A2] = {};
      if (3 in CONNECTIONS[A2]) throw `ERROR: ${3} already in CONNECTIONS[${A2}]`;
      CONNECTIONS[A2][3] = { connection: A1, destinationDir: 1 };

      // Bb
      const B1 = `${11},${0 + i}`;
      const B2 = `${15},${11 - i}`;
      if (!(B1 in CONNECTIONS)) CONNECTIONS[B1] = {};
      if (0 in CONNECTIONS[B1]) throw `ERROR: ${0} already in CONNECTIONS[${B1}]`;
      CONNECTIONS[B1][0] = { connection: B2, destinationDir: 2 };
      if (!(B2 in CONNECTIONS)) CONNECTIONS[B2] = {};
      if (0 in CONNECTIONS[B2]) throw `ERROR: ${0} already in CONNECTIONS[${B2}]`;
      CONNECTIONS[B2][0] = { connection: B1, destinationDir: 2 };

      // Cc
      const C1 = `${11},${4 + i}`;
      const C2 = `${15 - i},${8}`;
      if (!(C1 in CONNECTIONS)) CONNECTIONS[C1] = {};
      if (0 in CONNECTIONS[C1]) throw `ERROR: ${0} already in CONNECTIONS[${C1}]`;
      CONNECTIONS[C1][0] = { connection: C2, destinationDir: 1 };
      if (!(C2 in CONNECTIONS)) CONNECTIONS[C2] = {};
      if (3 in CONNECTIONS[C2]) throw `ERROR: ${3} already in CONNECTIONS[${C2}]`;
      CONNECTIONS[C2][3] = { connection: C1, destinationDir: 2 };

      // Dd
      const D1 = `${15 - i},${11}`;
      const D2 = `${0},${4 + i}`;
      if (!(D1 in CONNECTIONS)) CONNECTIONS[D1] = {};
      if (1 in CONNECTIONS[D1]) throw `ERROR: ${1} already in CONNECTIONS[${D1}]`;
      CONNECTIONS[D1][1] = { connection: D2, destinationDir: 0 };
      if (!(D2 in CONNECTIONS)) CONNECTIONS[D2] = {};
      if (2 in CONNECTIONS[D2]) throw `ERROR: ${2} already in CONNECTIONS[${D2}]`;
      CONNECTIONS[D2][2] = { connection: D1, destinationDir: 3 };

      // Ee
      const E1 = `${11 - i},${11}`;
      const E2 = `${0 + i},${7}`;
      if (!(E1 in CONNECTIONS)) CONNECTIONS[E1] = {};
      if (1 in CONNECTIONS[E1]) throw `ERROR: ${1} already in CONNECTIONS[${E1}]`;
      CONNECTIONS[E1][1] = { connection: E2, destinationDir: 3 };
      if (!(E2 in CONNECTIONS)) CONNECTIONS[E2] = {};
      if (1 in CONNECTIONS[E2]) throw `ERROR: ${1} already in CONNECTIONS[${E2}]`;
      CONNECTIONS[E2][1] = { connection: E1, destinationDir: 3 };

      // Ff
      const F1 = `${7},${11 - i}`;
      const F2 = `${4 + i},${7}`;
      if (!(F1 in CONNECTIONS)) CONNECTIONS[F1] = {};
      if (2 in CONNECTIONS[F1]) throw `ERROR: ${2} already in CONNECTIONS[${F1}]`;
      CONNECTIONS[F1][2] = { connection: F2, destinationDir: 3 };
      if (!(F2 in CONNECTIONS)) CONNECTIONS[F2] = {};
      if (1 in CONNECTIONS[F2]) throw `ERROR: ${1} already in CONNECTIONS[${F2}]`;
      CONNECTIONS[F2][1] = { connection: F1, destinationDir: 0 };

      // Gg
      const G1 = `${4 + i},${4}`;
      const G2 = `${8},${0 + i}`;
      if (!(G1 in CONNECTIONS)) CONNECTIONS[G1] = {};
      if (3 in CONNECTIONS[G1]) throw `ERROR: ${3} already in CONNECTIONS[${G1}]`;
      CONNECTIONS[G1][3] = { connection: G2, destinationDir: 0 };
      if (!(G2 in CONNECTIONS)) CONNECTIONS[G2] = {};
      if (2 in CONNECTIONS[G2]) throw `ERROR: ${2} already in CONNECTIONS[${G2}]`;
      CONNECTIONS[G2][2] = { connection: G1, destinationDir: 1 };

    }

  }
  else if (data === 'actual') {

    /*
      REFERENCE IMAGE:

          Aa Bb
         F  |  C
         f  |  c
          -- dD
         G  d
         g  D
       Gg --
      f  |  c
      F  |  C
       -- eE
      A  e
      a  E
       Bb

    */

    for (let i = 0; i < S; ++i) {

      // Aa
      const A1 = `${50 + i},${0}`;
      const A2 = `${0},${150 + i}`;
      if (!(A1 in CONNECTIONS)) CONNECTIONS[A1] = {};
      if (3 in CONNECTIONS[A1]) throw `ERROR: ${3} already in CONNECTIONS[${A1}]`;
      CONNECTIONS[A1][3] = { connection: A2, destinationDir: 0 };
      if (!(A2 in CONNECTIONS)) CONNECTIONS[A2] = {};
      if (2 in CONNECTIONS[A2]) throw `ERROR: ${2} already in CONNECTIONS[${A2}]`;
      CONNECTIONS[A2][2] = { connection: A1, destinationDir: 1 };

      // Bb
      const B1 = `${100 + i},${0}`;
      const B2 = `${0 + i},${199}`;
      if (!(B1 in CONNECTIONS)) CONNECTIONS[B1] = {};
      if (3 in CONNECTIONS[B1]) throw `ERROR: ${3} already in CONNECTIONS[${B1}]`;
      CONNECTIONS[B1][3] = { connection: B2, destinationDir: 3 };
      if (!(B2 in CONNECTIONS)) CONNECTIONS[B2] = {};
      if (1 in CONNECTIONS[B2]) throw `ERROR: ${1} already in CONNECTIONS[${B2}]`;
      CONNECTIONS[B2][1] = { connection: B1, destinationDir: 1 };

      // Cc
      const C1 = `${149},${0 + i}`;
      const C2 = `${99},${149 - i}`;
      if (!(C1 in CONNECTIONS)) CONNECTIONS[C1] = {};
      if (0 in CONNECTIONS[C1]) throw `ERROR: ${0} already in CONNECTIONS[${C1}]`;
      CONNECTIONS[C1][0] = { connection: C2, destinationDir: 2 };
      if (!(C2 in CONNECTIONS)) CONNECTIONS[C2] = {};
      if (0 in CONNECTIONS[C2]) throw `ERROR: ${0} already in CONNECTIONS[${C2}]`;
      CONNECTIONS[C2][0] = { connection: C1, destinationDir: 2 };

      // Dd
      const D1 = `${149 - i},${49}`;
      const D2 = `${99},${99 - i}`;
      if (!(D1 in CONNECTIONS)) CONNECTIONS[D1] = {};
      if (1 in CONNECTIONS[D1]) throw `ERROR: ${1} already in CONNECTIONS[${D1}]`;
      CONNECTIONS[D1][1] = { connection: D2, destinationDir: 2 };
      if (!(D2 in CONNECTIONS)) CONNECTIONS[D2] = {};
      if (0 in CONNECTIONS[D2]) throw `ERROR: ${0} already in CONNECTIONS[${D2}]`;
      CONNECTIONS[D2][0] = { connection: D1, destinationDir: 3 };

      // Ee
      const E1 = `${99 - i},${149}`;
      const E2 = `${49},${199 - i}`;
      if (!(E1 in CONNECTIONS)) CONNECTIONS[E1] = {};
      if (1 in CONNECTIONS[E1]) throw `ERROR: ${1} already in CONNECTIONS[${E1}]`;
      CONNECTIONS[E1][1] = { connection: E2, destinationDir: 2 };
      if (!(E2 in CONNECTIONS)) CONNECTIONS[E2] = {};
      if (0 in CONNECTIONS[E2]) throw `ERROR: ${0} already in CONNECTIONS[${E2}]`;
      CONNECTIONS[E2][0] = { connection: E1, destinationDir: 3 };

      // Ff
      const F1 = `${0},${149 - i}`;
      const F2 = `${50},${0 + i}`;
      if (!(F1 in CONNECTIONS)) CONNECTIONS[F1] = {};
      if (2 in CONNECTIONS[F1]) throw `ERROR: ${2} already in CONNECTIONS[${F1}]`;
      CONNECTIONS[F1][2] = { connection: F2, destinationDir: 0 };
      if (!(F2 in CONNECTIONS)) CONNECTIONS[F2] = {};
      if (2 in CONNECTIONS[F2]) throw `ERROR: ${2} already in CONNECTIONS[${F2}]`;
      CONNECTIONS[F2][2] = { connection: F1, destinationDir: 0 };

      // Gg
      const G1 = `${0 + i},${100}`;
      const G2 = `${50},${50 + i}`;
      if (!(G1 in CONNECTIONS)) CONNECTIONS[G1] = {};
      if (3 in CONNECTIONS[G1]) throw `ERROR: ${3} already in CONNECTIONS[${G1}]`;
      CONNECTIONS[G1][3] = { connection: G2, destinationDir: 0 };
      if (!(G2 in CONNECTIONS)) CONNECTIONS[G2] = {};
      if (2 in CONNECTIONS[G2]) throw `ERROR: ${2} already in CONNECTIONS[${G2}]`;
      CONNECTIONS[G2][2] = { connection: G1, destinationDir: 1 };

    }

  }

  // HELPER FUNCTION: PART 1 ONLY - RETURN THE DESTINATION COORDINATES TO BE EXAMINED AFTER A POTENTIAL WRAP AROUND
  function getWrapAroundDestination() {
    let [ currX, currY ] = [ x, y ];
    switch (dir) {
      case 0:                                                                       // R
        currX = 0;                                                                  // set x to 0 (the leftmost column)...
        while (GRID[currY][currX] === ' ') ++currX;                                 // ...then keep moving right until landing on something that is not empty space
        break;
      case 1:                                                                       // D
        currY = 0;                                                                  // set y to 0 (the topmost row)...
        while (GRID[currY][currX] === ' ') ++currY;                                 // ...then keep moving down until landing on something that is not empty space
        break;
      case 2:                                                                       // L
        currX = W - 1;                                                              // set x to W - 1 (the rightmost column)...
        while (GRID[currY][currX] === ' ') --currX;                                 // ...then keep moving left until landing on something that is not empty space
        break;
      case 3:                                                                       // U
        currY = H - 1;                                                              // set y to H - 1 (the bottommost row)...
        while (GRID[currY][currX] === ' ') --currY;                                 // ...then keep moving up until landing on something that is not empty space
        break;
      default:
        throw `ERROR: INVALID DIR: ${dir}`;
    }
    return [ currX, currY, dir ];                                                   // NOTE: although dir doesn't change in PART 1, we need to return some dir for the move function
  }

  // HELPER FUNCTION: PART 1 ONLY - RETURN THE NEW COORDINATES IF MAKING ONE MOVE FROM CURRENT POSITION, GOING IN CURRENT DIRECTION. WRAPPING AROUND MAY BE NECESSARY.
  function getDestinationPart1() {
    const [ dx, dy ] = DIRS[dir];
    const [ newX, newY ] = [ x + dx, y + dy ];                                      // first, get potential destination coordinates from incrementing/decrementing x and y...
                                                                                    // ...then check for one of the following:
    if (newX < 0 || newX === W                                                      // out of bounds horizontally
        || newY < 0 || newY === H                                                   // out of bounds vertically
        || GRID[newY][newX] === ' '                                                 // step into blank space
    ) {
      return getWrapAroundDestination();                                            // if any of the above, we need to wrap around, so call this helper and return
    }
    return [ newX, newY, dir ];                                                     // NOTE: although dir doesn't change in PART 1, we need to return some dir for the move function
  }

  // HELPER FUNCTION: PART 2 ONLY - RETURN THE NEW COORDINATES IF MAKING ONE MOVE FROM CURRENT POSITION, GOING IN CURRENT DIRECTION. TRANSFERRING TO NEW EDGE MAY BE NECESSARY.
  function getDestinationPart2() {
    const serial = `${x},${y}`;
    if (                                                                            // check if currently moving off the edge from a special edge (i.e. transferring to new edge)...
        serial in CONNECTIONS                                                       // ...by seeing if current coordinates are on such an edge...
        && dir in CONNECTIONS[serial]                                               // ...and current direction would move off that edge
    ) {
      const [ newX, newY ] = CONNECTIONS[serial][dir].connection
                              .split(',')
                              .map(n => +n);
      return [                                                                      // return the hard-coded destination coordinates and direction
        newX,
        newY,
        CONNECTIONS[serial][dir].destinationDir
      ];
    } else {                                                                        // otherwise, if not moving off a special edge, then simply update by incrementing/decrementing
      const [ dx, dy ] = DIRS[dir];
      return [
        x + dx,
        y + dy,
        dir
      ];
    }
  }

  // HELPER FUNCTION: ATTEMPT TO MOVE N TIMES IN CURRENT DIRECTION
  function move(N) {
    for (let i = 0; i < N; ++i) {        
      if (!'.>v<^'.includes(GRID[y][x])) {
        throw `INVALID CHAR AT x,y ${x},${y}: ${GRID[y][x]}`;                       // sanity check: you should be starting on a valid position (no empty spaces, no walls)
      }

      GRID[y][x] = ARROWS[dir];                                                     // we only need this if we want to display the grid

      const [ newX, newY, newDir ] = (part === 1  ? getDestinationPart1             // PART 1: MOVE RULES INVOLVE POTENTIAL WRAP-AROUNDS
                                                  : getDestinationPart2)();         // PART 2: MOVE RULES INVOLVE POTENTIAL EDGE TRANSFERS AS IF MOVING ALONG THE SURFACE OF A CUBE


      if (GRID[newY][newX] === '#') break;                                          // if destination coords have a wall, do not move, and break the loop

      [ x, y, dir ] = [ newX, newY, newDir ];                                       // otherwise, update position and direction according to move rules
    }
  }


  // ANALYZE
  let numStr = '';                                                                  // temporary store for parsing N from input instructions
  for (const c of INSTRUCTIONS) {
    if (!'LR'.includes(c)) {                                                        // character is a number string
      numStr += c;
    } else {                                                                        // character is L or R
      move(+numStr);
      dir = (dir + 4 + (c === 'R' ? 1 : -1)) % 4;                                   // add 4 to dir first to prevent getting a negative for L
      GRID[y][x] = ARROWS[dir];                                                     // this is here to draw the final arrow if the input instructions end on a turn
      numStr = '';                                                                  // clear temporary store for parsing N
    }
  }
  if (numStr) move(+numStr);                                                        // NOTE: ABSOLUTELY REQUIRED IN CASE THE INSTRUCTIONS END WITH A NUMBER RATHER THAN L OR R

  // OPTIONAL: DISPLAY GRID AND MOVEMENT
  if (DISPLAY_EXTRA_INFO) {
    for (const row of GRID) {
      console.log(row.join(''));
    }
    console.log('');
    console.log('FINAL POSITION (1-INDEX):');
    console.log(`x = ${x + 1}, y = ${y + 1}, dir = ${dir}`);
  }

  return 1000 * (y + 1)
          + 4 * (x + 1)
          + dir;  
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = navigateCubeSurface;
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
`        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  data: 'sample',
  DEBUG: true,
};
expected = 6032;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
  data: 'actual',
};
expected = 189140;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  data: 'sample',
  DEBUG: true,
};
expected = 5031;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
  data: 'actual',
};
expected = 115063;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);