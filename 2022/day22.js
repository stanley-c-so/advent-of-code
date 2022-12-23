/*

COPY + PASTE PUZZLE DESCRIPTION HERE (PART 1)


COPY + PASTE PUZZLE DESCRIPTION HERE (PART 2)

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function NAME_OF_FUNC_HERE (part, inputStr, data, DEBUG = false) {

  if (!['sample', 'actual'].includes(data)) {
    throw `ERROR: ${data} MUST BE 'sample' OR 'actual'`;
  }

  const inputArr = inputStr.split('\r\n');
  // if (DEBUG) {
  //   console.log(inputArr[0]);
  //   // console.log(inputArr[1]);
  // }

  const INSTRUCTIONS = inputArr.at(-1);
  const H = inputArr.length - 2;                                  // skip last 2 lines (last line is instructions; line before that is blank)
  let W = 0;                                                      // because the input is annoying and doesn't fill in spaces to the end of the line, parse to find W
  for (let row = 0; row < H; ++row) {
    W = Math.max(W, inputArr[row].length);
  }

  const GRID = [];
  for (let row = 0; row < H; ++row) {
    const rowStr = inputArr[row].padEnd(W, ' ');                  // pad the row to make sure all rows have equal width 
    GRID.push(rowStr.split(''));
  }

  const DIRS = [ [ +1, 0 ], [ 0, +1 ], [ -1, 0 ], [ 0, -1 ] ];
  const ARROWS = '>v<^';

  // ANALYZE
  if (part === 1) {

    let y = 0;
    let x = GRID[0].indexOf('.');
    let dir = 0;                                                  // init at 0 for R (0 is R, 1 is D, 2 is L, 3 is U)

    function getWrapAroundDestination() {
      let currX = x;
      let currY = y;
      switch (dir) {
        case 0:                                                   // R
          currX = 0;
          while (GRID[currY][currX] === ' ') ++currX;
          break;
        case 1:                                                   // D
          currY = 0;
          while (GRID[currY][currX] === ' ') ++currY;
          break;
        case 2:                                                   // L
          currX = W - 1;
          while (GRID[currY][currX] === ' ') --currX;
          break;
        case 3:                                                   // U
          currY = H - 1;
          while (GRID[currY][currX] === ' ') --currY;
          break;
        default:
          throw `ERROR: INVALID DIR: ${dir}`;
      }
      return [ currX, currY ];
    }

    function getDestination() {
      const [ dx, dy ] = DIRS[dir];
      const [ newX, newY ] = [ x + dx, y + dy ];
      if (newX < 0 || newX === W                                  // out of bounds horizontally
          || newY < 0 || newY === H                               // out of bounds vertically
          || GRID[newY][newX] === ' '                             // step into blank space
      ) {
        return getWrapAroundDestination();
      }
      return [ newX, newY ];
    }

    function move(N) {
      for (let i = 0; i < N; ++i) {
        if (!'.>v<^'.includes(GRID[y][x])) {
          throw `INVALID CHAR AT x,y ${x},${y}: ${GRID[y][x]}`;
        }

        GRID[y][x] = ARROWS[dir];

        const [ newX, newY ] = getDestination();          // oob or step into space
        if (GRID[newY][newX] === '#') break;              // can't walk into wall, so discontinue move
        x = newX;
        y = newY;
      }
    }

    let numStr = '';                                      // temporary store for parsing N from input instructions
    for (const c of INSTRUCTIONS) {
      if (!'LR'.includes(c)) {                            // number string
        numStr += c;
      } else {                                            // L or R
        move(+numStr);
        dir = (dir + 4 + (c === 'R' ? 1 : -1)) % 4;       // add 4 first to prevent negative for L
        GRID[y][x] = ARROWS[dir];
        numStr = '';
      }
    }
    if (numStr) move(+numStr);

    if (DISPLAY_EXTRA_INFO) {
      for (const row of GRID) {
        console.log(row.join(''));
      }
      console.log('');
      console.log(`FINAL POSITION (1-INDEX): x=${x + 1}, y=${y + 1}, dir=${dir}`);
    }

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

    // const S = DEBUG ? 4 : 50;               // TODO: fix

    const S = data === 'sample' ? 4 : 50;

    // function rotate(FACE, direction) {    // 1 is clockwise, -1 is CCW
    //   if (direction === 1) {
    //     for (let row = 0; row < S / 2; ++row) {
    //       for (let col = 0; col < S / 2; ++col) {
    //         [
    //           FACE[row][col],
    //           FACE[col][S - 1 - row],
    //           FACE[S - 1 - row][S - 1 - col],
    //           FACE[S - 1 - col][row],
    //         ]
    //         =
    //         [
    //           FACE[S - 1 - col][row],
    //           FACE[row][col],
    //           FACE[col][S - 1 - row],
    //           FACE[S - 1 - row][S - 1 - col],
    //         ];
    //       }
    //     }
    //   }
    //   else if (direction === -1) {
    //     for (let row = 0; row < S / 2; ++row) {
    //       for (let col = 0; col < S / 2; ++col) {
    //         [
    //           FACE[row][col],
    //           FACE[col][S - 1 - row],
    //           FACE[S - 1 - row][S - 1 - col],
    //           FACE[S - 1 - col][row],
    //         ]
    //         =
    //         [
    //           FACE[col][S - 1 - row],
    //           FACE[S - 1 - row][S - 1 - col],
    //           FACE[S - 1 - col][row],
    //           FACE[row][col],
    //         ];
    //       }
    //     }
    //   }
    //   else throw `ERROR: INVALID DIRECTION: ${direction}`;
    // }

    // const TEST = [
    //   [1, 2, 3, 4],
    //   [5, 6, 7, 8],
    //   [9, 10, 11, 12],
    //   [13, 14, 15, 16],
    // ]
    // rotate(TEST, -1)
    // console.log(TEST);
    // throw 'TEST'

    // let A, B, C, D, E, F;
    
    // if (DEBUG) {
    //   A = GRID.slice(0*S, 1*S).map(row => row.slice(2*S, 3*S));
    //   B = GRID.slice(2*S, 3*S).map(row => row.slice(3*S, 4*S));
    //   rotate(B, -1);
    //   rotate(B, -1);
    //   C = GRID.slice(2*S, 3*S).map(row => row.slice(2*S, 3*S));
    //   rotate(C, -1);
    //   rotate(C, -1);
    //   D = GRID.slice(1*S, 2*S).map(row => row.slice(1*S, 2*S));
    //   rotate(D, 1);
    //   E = GRID.slice(1*S, 2*S).map(row => row.slice(0*S, 1*S));
    //   rotate(E, 1);
    //   F = GRID.slice(1*S, 2*S).map(row => row.slice(2*S, 3*S));
    // } else {
      
    // }
    // const FACES = [ A, B, C, D, E, F ];

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

    const CONNECTIONS = {};

    if (data === 'sample') {

      /*
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
        const A1 = `${8 + i},${0}`;
        const A2 = `${3 - i},${4}`;
        if (!(A1 in CONNECTIONS)) CONNECTIONS[A1] = {};
        if (3 in CONNECTIONS[A1]) throw `ERROR: ${3} already in CONNECTIONS[${A1}]`;
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
    if (data === 'actual') {

      /*
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

    // function getDestination() {

    //   const sectorX = Math.floor(x / S);
    //   const sectorY = Math.floor(y / S);

    //   const [ dx, dy ] = DIRS[dir];
    //   let [ newX, newY ] = [ x + dx, y + dy ];
      
    //   if (Math.floor(newX / S) !== sectorX
    //       || Math.floor(newY / S) !== sectorY) {
    //     // return getWrapAroundDestination();
    //     const [ newX, newY ] = getWrapAroundDestination();
    //     return { newX, newY, wrapped: true };
    //   }
    //   // return [ newX, newY ];
    //   return { newX, newY, wrapped: false };
    // }

    function getDestination() {
      const serial = `${x},${y}`;
      if (serial in CONNECTIONS && dir in CONNECTIONS[serial]) {
        if (x === 149 && y === 49 && dir === 1) console.log('SPECIAL')

        const [ newX, newY ] = CONNECTIONS[serial][dir].connection.split(',').map(n => +n);
        // console.log('warp')
        return [ newX, newY, CONNECTIONS[serial][dir].destinationDir ];
      } else {
        if (x === 149 && y === 49 && dir === 1) console.log('not special')

        const [ dx, dy ] = DIRS[dir];
        const [ newX, newY ] = [ x + dx, y + dy ];
        // console.log('not warp')
        return [ newX, newY, dir ];
      }
    }

    function move(N) {
      for (let i = 0; i < N; ++i) {        
        if (!'.>v<^'.includes(GRID[y][x])) {
          throw `INVALID CHAR AT x,y ${x},${y}: ${GRID[y][x]}`;
        }

        GRID[y][x] = ARROWS[dir];

        const [ newX, newY, newDir ] = getDestination();  // oob or step into space

        // if (x === 149 && y === 49 && dir === 1) {
        //   console.log(newX, newY, newDir)
        //   console.log(`${149},${49}` in CONNECTIONS[dir])
        //   console.log(CONNECTIONS[dir][`${149},${49}`])
        //   console.log(`${149},${49}` in CONNECTIONS[dir])
        //   console.log(CONNECTIONS[dir][`${149},${49}`])
        //   throw 'GOT HERE'
        // }

        if (GRID[newY][newX] === '#') break;              // can't walk into wall

        x = newX;
        y = newY;
        dir = newDir;
        // console.log(newX, newY, newDir)
      }
    }


    let numStr = '';                                      // temporary store for parsing N from input instructions
    for (const c of INSTRUCTIONS) {
      if (!'LR'.includes(c)) {                            // number string
        numStr += c;
      } else {                                            // L or R
        move(+numStr);
        dir = (dir + 4 + (c === 'R' ? 1 : -1)) % 4;       // add 4 first to prevent negative for L
        GRID[y][x] = ARROWS[dir];
        numStr = '';
      }
    }
    if (numStr) move(+numStr);

    if (DISPLAY_EXTRA_INFO) {
      for (const row of GRID) {
        console.log(row.join(''));
      }
      console.log('');
      console.log(`FINAL POSITION (1-INDEX): x=${x + 1}, y=${y + 1}, dir=${dir}`);
    }

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