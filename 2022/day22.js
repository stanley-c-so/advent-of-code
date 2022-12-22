/*

COPY + PASTE PUZZLE DESCRIPTION HERE (PART 1)


COPY + PASTE PUZZLE DESCRIPTION HERE (PART 2)

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function NAME_OF_FUNC_HERE (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  // if (DEBUG) {
  //   console.log(inputArr[0]);
  //   // console.log(inputArr[1]);
  // }

  const H = inputArr.length - 2;
  const W = inputArr[0].length;
  const GRID = [];
  const INSTRUCTIONS = inputArr.at(-1);

  for (let row = 0; row < H; ++row) {
    const rowStr = inputArr[row].padEnd(W, ' ');      // fix this later to scan for max width
    GRID.push(rowStr.split(''));
  }
  // console.log(GRID);

  // console.log('H:', H);
  // console.log('W:', W);
  // console.log('GRID AT y = 199, x = 61:', GRID[199][61]);
  // console.log('GRID[199]', GRID[199]);
  // console.log('GRID[199].length', GRID[199].length);
  // console.log('GRID[198].length', GRID[198].length);
  // console.log('GRID[149].length', GRID[149].length);
  // console.log('GRID[55].length', GRID[55].length);
  // console.log('GRID[0].length', GRID[0].length);
  // throw 'GRID'

  const DIRS = [    // [ dx, dy ]
    [ +1, 0 ],
    [ 0, +1 ],
    [ -1, 0 ],
    [ 0, -1 ],
  ]

  const ARROWS = [
    '>',
    'v',
    '<',
    '^',
  ]


  // ANALYZE
  if (part === 1) {


    let y = 0;
    let x = GRID[0].indexOf('.');
    let dir = 0; // 0 is R, 1 is D, 2 is L, 3 is U
    // console.log(x)
    // throw 'x'

    function scanWrapAround() {
      let currX = x;
      let currY = y;
      // console.log(`STARTING WRAP FROM: [${currX}, ${currY}] with dir ${dir}`)
      switch (dir) {
        case 0:                                           // R
          currX = 0;
          while (GRID[currY][currX] === ' ') ++currX;
          break;
        case 1:                                           // D
          currY = 0;
          while (GRID[currY][currX] === ' ') ++currY;
          break;
        case 2:                                           // L
          currX = W - 1;
          while (GRID[currY][currX] === ' ') --currX;
          break;
        case 3:                                           // U
          currY = H - 1;
          while (GRID[currY][currX] === ' ') --currY;
          break;
        default:
          throw `ERROR: INVALID DIR: ${dir}`;
      }
      // console.log(`WRAP RESULT: [${currX}, ${currY}]`)
      return [ currX, currY ];
    }

    function getDestination() {
      const [ dx, dy ] = DIRS[dir];
      let [ newX, newY ] = [ x + dx, y + dy ];
      if (newX < 0 || newX === W                  // oob
          || newY < 0 || newY === H
          || GRID[newY][newX] === ' '             // step into space
      ) {
        // console.log('WRAPPING!')
        return scanWrapAround();
      }
      return [ newX, newY ];
    }

    function move(N) {
      for (let i = 0; i < N; ++i) {
        
        // if (GRID[y][x] === ' ') throw `SHOULD NOT BE STARTING ON SPACE AT x,y ${x},${y}`
        if (!'.>v<^'.includes(GRID[y][x])) throw `INVALID CHAR AT x,y ${x},${y}: ${GRID[y][x]}`
        GRID[y][x] = ARROWS[dir];

        const [ newX, newY ] = getDestination();          // oob or step into space
        // console.log('NEW X:', newX, 'NEW Y:', newY)
        if (GRID[newY][newX] === '#') break;              // can't walk into wall
        x = newX;
        y = newY;
      }
      // throw 'END MOVE'
    }

    let numStr = '';
    for (const c of INSTRUCTIONS) {
      if (c === 'L') {
        move(+numStr);
        dir = (dir + 4 - 1) % 4;
        // console.log(`CURRENT x,y: ${x},${y} | dir: ${dir}`);
        numStr = '';
      } else if (c === 'R') {
        move(+numStr);
        dir = (dir + 1) % 4;
        // console.log(`CURRENT x,y: ${x},${y} | dir: ${dir}`);
        numStr = '';
      } else {
        numStr += c;
      }
    }
    console.log(`FINAL x,y: ${x},${y} | dir: ${dir}`);

    // console.log(GRID)
    GRID[y][x] = ARROWS[dir];
    // for (const row of GRID) console.log(row.join(''));


    return 1000 * (y + 1)
            + 4 * (x + 1)
            + dir;

  } else {

    /*
    [ current, right, opp, left, top, bottom ]
    [ A, B, C, D, E, F ]

    if you walk off...

      right (0), you just need to rotate top (clockwise), bottom (CCW)
      [ B, C, D, A, E, F ] 

      left (2), you just need to rotate top (CCW), bottom (clockwise)
      [ D, A, B, C, E, F ]

      top (3), you just need to rotate left (clockwise), right (CCW)
      [ E, B, F, D, C, A ]

      bottom (1), you just need to rotate left (CCW), right (clockwise)
      [ F, B, E, D, A, C ]  
    */

    let y = 0;
    let x = GRID[0].indexOf('.');
    let dir = 0;

    const S = DEBUG ? 4 : 50;

    function rotate(FACE, direction) {    // 1 is clockwise, -1 is CCW
      if (direction === 1) {
        for (let row = 0; row < S / 2; ++row) {
          for (let col = 0; col < S / 2; ++col) {
            [
              FACE[row][col],
              FACE[col][S - 1 - row],
              FACE[S - 1 - row][S - 1 - col],
              FACE[S - 1 - col][row],
            ]
            =
            [
              FACE[S - 1 - col][row],
              FACE[row][col],
              FACE[col][S - 1 - row],
              FACE[S - 1 - row][S - 1 - col],
            ];
          }
        }
      }
      else if (direction === -1) {
        for (let row = 0; row < S / 2; ++row) {
          for (let col = 0; col < S / 2; ++col) {
            [
              FACE[row][col],
              FACE[col][S - 1 - row],
              FACE[S - 1 - row][S - 1 - col],
              FACE[S - 1 - col][row],
            ]
            =
            [
              FACE[col][S - 1 - row],
              FACE[S - 1 - row][S - 1 - col],
              FACE[S - 1 - col][row],
              FACE[row][col],
            ];
          }
        }
      }
      else throw `ERROR: INVALID DIRECTION: ${direction}`;
    }
    // const TEST = [
    //   [1, 2, 3, 4],
    //   [5, 6, 7, 8],
    //   [9, 10, 11, 12],
    //   [13, 14, 15, 16],
    // ]
    // rotate(TEST, -1)
    // console.log(TEST);
    // throw 'TEST'

    let A, B, C, D, E, F;
    
    if (DEBUG) {
      A = GRID.slice(0*S, 1*S).map(row => row.slice(2*S, 3*S));
      B = GRID.slice(2*S, 3*S).map(row => row.slice(3*S, 4*S));
      rotate(B, -1);
      rotate(B, -1);
      C = GRID.slice(2*S, 3*S).map(row => row.slice(2*S, 3*S));
      rotate(C, -1);
      rotate(C, -1);
      D = GRID.slice(1*S, 2*S).map(row => row.slice(1*S, 2*S));
      rotate(D, 1);
      E = GRID.slice(1*S, 2*S).map(row => row.slice(0*S, 1*S));
      rotate(E, 1);
      F = GRID.slice(1*S, 2*S).map(row => row.slice(2*S, 3*S));
    } else {
      
    }
    const FACES = [ A, B, C, D, E, F ];

    // console.log(FACES)
    // for (const FACE of FACES) {
    //   for (const row of FACE) console.log(row.join(''))
    // }

    /*
    [ current, right, opp, left, top, bottom ]
    [ A, B, C, D, E, F ]

    if you walk off...

      right (0), you just need to rotate top (clockwise), bottom (CCW)
      [ B, C, D, A, E, F ] 

      left (2), you just need to rotate top (CCW), bottom (clockwise)
      [ D, A, B, C, E, F ]

      top (3), you just need to rotate left (clockwise), right (CCW)
      [ E, B, F, D, C, A ]

      bottom (1), you just need to rotate left (CCW), right (clockwise)
      [ F, B, E, D, A, C ]  
    */

    function scanWrapAround() {
      let currX = x;
      let currY = y;
      switch (dir) {
        case 0:                                           // R
          currX = 0;
          while (GRID[currY][currX] === ' ') ++currX;
          break;
        case 1:                                           // D
          currY = 0;
          while (GRID[currY][currX] === ' ') ++currY;
          break;
        case 2:                                           // L
          currX = W - 1;
          while (GRID[currY][currX] === ' ') --currX;
          break;
        case 3:                                           // U
          currY = H - 1;
          while (GRID[currY][currX] === ' ') --currY;
          break;
        default:
          throw `ERROR: INVALID DIR: ${dir}`;
      }
      // console.log(`WRAP RESULT: [${currX}, ${currY}]`)
      return [ currX, currY ];
    }

    function getDestination() {

      const sectorX = Math.floor(x / S);
      const sectorY = Math.floor(y / S);

      const [ dx, dy ] = DIRS[dir];
      let [ newX, newY ] = [ x + dx, y + dy ];
      
      if (Math.floor(newX / S) !== sectorX
          || Math.floor(newY / S) !== sectorY) {
        // return scanWrapAround();
        const [ newX, newY ] = scanWrapAround();
        return { newX, newY, wrapped: true };
      }
      // return [ newX, newY ];
      return { newX, newY, wrapped: false };
    }

    function move(N) {
      for (let i = 0; i < N; ++i) {
        
        // if (!'.>v<^'.includes(GRID[y][x])) throw `INVALID CHAR AT x,y ${x},${y}: ${GRID[y][x]}`
        // GRID[y][x] = ARROWS[dir];

        // const [ newX, newY ] = getDestination();          // oob or step into space
        const { newX, newY, wrapped } = getDestination();
        if (GRID[newY][newX] === '#') break;              // can't walk into wall

        if (wrapped) {
          
        }

        x = newX;
        y = newY;
      }
    }


    let numStr = '';
    for (const c of INSTRUCTIONS) {
      if (c === 'L') {
        move(+numStr);
        dir = (dir + 4 - 1) % 4;
        numStr = '';
      } else if (c === 'R') {
        move(+numStr);
        dir = (dir + 1) % 4;
        numStr = '';
      } else {
        numStr += c;
      }
    }
    console.log(`FINAL x,y: ${x},${y} | dir: ${dir}`);

    return 1000 * (y + 1)
            + 4 * (x + 1)
            + dir;


  }
}

// 175004 wrong

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = NAME_OF_FUNC_HERE;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const skippedTests = new Set([ 1, 2, 4 ]);
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
  DEBUG: true,
};
expected = 6032;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 189140;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 5031;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = null;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);