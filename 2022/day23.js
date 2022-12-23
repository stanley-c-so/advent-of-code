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

  let ELVES = [];
  let LOCATIONS = {};
  for (let row = 0; row < inputArr.length; ++row) {
    for (let col = 0; col < inputArr[0].length; ++col) {
      if (inputArr[row][col] === '#') {
        const serial = `${row},${col}`;
        ELVES.push(serial);
        if (!(serial in LOCATIONS)) LOCATIONS[serial] = [];
        LOCATIONS[serial].push(ELVES.length - 1);
      }
    }
  }

  const SURROUNDINGS = [
    [-1, -1], [-1, 0], [-1, +1],
    [0, -1], [0, +1],
    [+1, -1], [+1, 0], [+1, +1],
  ];

  const DIRS = [  // [dy, dx]
    [ [-1, -1], [-1, 0], [-1, +1] ],  // N]
    [ [+1, -1], [+1, 0], [+1, +1] ],  // S
    [ [-1, -1], [0, -1], [+1, -1] ],  // W
    [ [-1, +1], [0, +1], [+1, +1] ],  // E
  ]

  let dir = 0;
  // while (true) {
  for (let round = 1;
        part === 1  ? round <= 10
                    : true;
        ++round) {

    const PROPOSALS = {};
    const NEW_ELVES = [];
    const NEW_LOCATIONS = {};
    // const deltas = DIRS[dir];

    let nobodyMoved = true;

    // figure out proposals
    for (let i = 0; i < ELVES.length; ++i) {

      const elfSerial = ELVES[i];
      const [row, col] = elfSerial.split(',').map(n => +n);

      const surroundingsToCheck = SURROUNDINGS.map(dYdX => `${row + dYdX[0]},${col + dYdX[1]}`);
      if (surroundingsToCheck.every(serial => !(serial in LOCATIONS))) {
        NEW_ELVES[i] = elfSerial;
        if (!(elfSerial in NEW_LOCATIONS)) NEW_LOCATIONS[elfSerial] = [];
        NEW_LOCATIONS[elfSerial].push(i);
        continue;
      }

      let elfMadeValidProposal = false;
      for (let elfDir = 0; elfDir < 4; ++elfDir) {
        const locationsToCheck = DIRS[(dir + elfDir) % 4].map(dYdX => `${row + dYdX[0]},${col + dYdX[1]}`);
        if (locationsToCheck.every(serial => !(serial in LOCATIONS))) {
          const proposal = locationsToCheck[1];  // middle location is the cardinal dir
          if (!(proposal in PROPOSALS)) PROPOSALS[proposal] = [];
          PROPOSALS[proposal].push(i);
          elfMadeValidProposal = true;
          break;
        }
      }
      if (!elfMadeValidProposal) {
        NEW_ELVES[i] = elfSerial;
        if (!(elfSerial in NEW_LOCATIONS)) NEW_LOCATIONS[elfSerial] = [];
        NEW_LOCATIONS[elfSerial].push(i);
      }

    }

    for (const proposal in PROPOSALS) {
      if (PROPOSALS[proposal].length === 1) {   // go
        const elfIdx = PROPOSALS[proposal][0];
        NEW_ELVES[elfIdx] = proposal;
        if (!(proposal in NEW_LOCATIONS)) NEW_LOCATIONS[proposal] = [];
        NEW_LOCATIONS[proposal].push(elfIdx);
        nobodyMoved = false;
      } else {                                  // don't go
        for (const elfIdx of PROPOSALS[proposal]) {
          NEW_ELVES[elfIdx] = ELVES[elfIdx];
          if (!(ELVES[elfIdx] in NEW_LOCATIONS)) NEW_LOCATIONS[ELVES[elfIdx]] = [];
          NEW_LOCATIONS[ELVES[elfIdx]].push(elfIdx);
        }
      }
    }


    // if (round === 1) {
    //   let minX = Infinity;
    //   let maxX = -Infinity;
    //   let minY = Infinity;
    //   let maxY = -Infinity;
    //   for (const location in NEW_LOCATIONS) {
    //     const [row, col] = location.split(',').map(n => +n);
    //     minX = Math.min(minX, col);
    //     maxX = Math.max(maxX, col);
    //     minY = Math.min(minY, row);
    //     maxY = Math.max(maxY, row);
    //   }
    //   const GRID = Array.from({length: maxY - minY + 5}, () => Array(maxX - minX + 5).fill('.'));
    //   // console.log(minX, maxX, minY, maxY)

    //   // const OFFSET_X = minX

    //   // for (const row of GRID) console.log(row.join(''))

    //   for (const location in NEW_LOCATIONS) {
    //     const [row, col] = location.split(',').map(n => n);
    //     GRID[row - minY + 2][col - minX + 2] = '#';
    //   }

    //   for (const row of GRID) console.log(row.join(''))

    //   // throw 'TEST'
    // }


    ELVES = NEW_ELVES;
    LOCATIONS = NEW_LOCATIONS;
    dir = (dir + 1) % 4;
    if (nobodyMoved) {
      if (part === 2) return round;
      break;
    }
  }

  // throw 'REACHED END!'

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const location in LOCATIONS) {
    const [row, col] = location.split(',').map(n => +n);
    minX = Math.min(minX, col);
    maxX = Math.max(maxX, col);
    minY = Math.min(minY, row);
    maxY = Math.max(maxY, row);
  }

  return (maxX - minX + 1) * (maxY - minY + 1) - ELVES.length;
  


  // const TIME_AT_START = Date.now();

  // ANALYZE
  if (part === 1) {

  } else {

    // if (!DEBUG) console.log('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...');



    // if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    // return;

  }
}

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
`....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 110;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 3864;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 20;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = null;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);