/*

--- Day 11: Space Police ---

On the way to Jupiter, you're pulled over by the Space Police.

"Attention, unmarked spacecraft! You are in violation of Space Law! All spacecraft must have a clearly visible registration identifier! You have 24 hours to comply or be sent to Space Jail!"

Not wanting to be sent to Space Jail, you radio back to the Elves on Earth for help. Although it takes almost three hours for their reply signal to reach you, they send instructions for how to power up the emergency hull painting robot and even provide a small Intcode program (your puzzle input) that will cause it to paint your ship appropriately.

There's just one problem: you don't have an emergency hull painting robot.

You'll need to build a new emergency hull painting robot. The robot needs to be able to move around on the grid of square panels on the side of your ship, detect the color of its current panel, and paint its current panel black or white. (All of the panels are currently black.)

The Intcode program will serve as the brain of the robot. The program uses input instructions to access the robot's camera: provide 0 if the robot is over a black panel or 1 if the robot is over a white panel. Then, the program will output two values:

First, it will output a value indicating the color to paint the panel the robot is over: 0 means to paint the panel black, and 1 means to paint the panel white.
Second, it will output a value indicating the direction the robot should turn: 0 means it should turn left 90 degrees, and 1 means it should turn right 90 degrees.

After the robot turns, it should always move forward exactly one panel. The robot starts facing up.

The robot will continue running for a while like this and halt when it is finished drawing. Do not restart the Intcode computer inside the robot during this process.

For example, suppose the robot is about to start running. Drawing black panels as ., white panels as #, and the robot pointing the direction it is facing (< ^ > v), the initial state and region near the robot looks like this:

.....
.....
..^..
.....
.....

The panel under the robot (not visible here because a ^ is shown instead) is also black, and so any input instructions at this point should be provided 0. Suppose the robot eventually outputs 1 (paint white) and then 0 (turn left). After taking these actions and moving forward one panel, the region now looks like this:

.....
.....
.<#..
.....
.....

Input instructions should still be provided 0. Next, the robot might output 0 (paint black) and then 0 (turn left):

.....
.....
..#..
.v...
.....

After more outputs (1,0, 1,0):

.....
.....
..^..
.##..
.....

The robot is now back where it started, but because it is now on a white panel, input instructions should be provided 1. After several more outputs (0,1, 1,0, 1,0), the area looks like this:

.....
..<#.
...#.
.##..
.....

Before you deploy the robot, you should probably have an estimate of the area it will cover: specifically, you need to know the number of panels it paints at least once, regardless of color. In the example above, the robot painted 6 panels at least once. (It painted its starting panel twice, but that panel is still only counted once; it also never painted the panel it ended on.)

Build a new emergency hull painting robot and run the Intcode program on it. How many panels does it paint at least once?


--- Part Two ---

You're not sure what it's trying to paint, but it's definitely not a registration identifier. The Space Police are getting impatient.

Checking your external ship cameras again, you notice a white panel marked "emergency hull painting robot starting panel". The rest of the panels are still black, but it looks like the robot was expecting to start on a white panel, not a black one.

Based on the Space Law Space Brochure that the Space Police attached to one of your windows, a valid registration identifier is always eight capital letters. After starting the robot on a single white panel instead, what registration identifier does it paint on your hull?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function intcode5 (part, inputStr, DEBUG = false) {
  
  const PROGRAM = inputStr.split(',').map(n => +n);

  function runIntcode() {

    // UTILITY FUNCTION THAT TAKES A NUM AND STANDARDIZES ITS FORMAT BY PADDING ITS START AND KEEPING ITS NEGATIVE SIGN
    function numParser(num) {
      const str = String(num);
      const negative = str[0] === '-';
      const paddedNum = (negative ? str.slice(1) : str).padStart(OPCODE_LEN, '0');
      return (negative ? '-' : '') + paddedNum;
    }

    // UTILITY FUNCTION THAT FIGURES OUT THE VALUE OF THE OPERANDS FOLLOWING AN OPCODE
    function calculateOperands(i, opcodeData, opcode) {

      const operands = [];

      for (let n = 1; n <= numArgsByOpcode[opcode]; ++n) {
        if (i + n >= REGISTERS.length) {
          operands.push(null);
          continue;
        }

        const mode = +opcodeData[OPCODE_LEN - 2 - n];

        if (mode === 1) {
          operands.push(REGISTERS[i + n]);
        } else {
          const offset = mode === 0 ? 0 : relativeBase;
          const searchIdx = REGISTERS[i + n] + offset;
          operands.push(n === 3 || opcode === '03'  ? searchIdx                         // opcode '03' operand1, and operand3 generally, always
                                                                                        // refer to the write location, so we only need that index
                                                    : readFromRegisters(searchIdx));
        }
      }

      return operands;
    }

    // UTILITY FUNCTION FOR READING VALUES FROM REGISTERS WHILE HANDLING FOR OUT-OF-BOUNDS INDICES BY EXTENDING REGISTERS
    function readFromRegisters(readIdx) {
      if (readIdx < 0) throw `ERROR: NEGATIVE readIdx ${readIdx}`;
      const currentLen = REGISTERS.length;
      if (readIdx >= currentLen) {
        REGISTERS.length = readIdx + 1;
        for (let idx = currentLen; idx <= readIdx; ++idx) {
          REGISTERS[idx] = 0;
        }
      }
      return REGISTERS[readIdx];
    }

    // UTILITY FUNCTION FOR WRITING VALUES INTO REGISTERS WHILE HANDLING FOR OUT-OF-BOUNDS INDICES BY EXTENDING REGISTERS
    function writeToRegisters(writeIdx, value) {
      if (writeIdx < 0) throw `ERROR: NEGATIVE writeIdx ${writeIdx}`;
      const currentLen = REGISTERS.length;
      if (writeIdx >= currentLen) {
        REGISTERS.length = writeIdx + 1;
        for (let idx = currentLen; idx <= writeIdx; ++idx) {
          REGISTERS[idx] = 0;
        }
      }
      REGISTERS[writeIdx] = value;
    }

    // CONSTANTS
    const OPCODE_LEN = 5;
    const numArgsByOpcode = {
      '01': 3,
      '02': 3,
      '03': 1,
      '04': 1,
      '05': 2,
      '06': 2,
      '07': 3,
      '08': 3,
      '09': 1,
      '99': 0,
    };
    
    // DATA STRUCTURES
    const REGISTERS = [ ...PROGRAM ];

    // INIT
    let i = 0;
    let relativeBase = 0;
    let paint = null;

    while (i < REGISTERS.length) {

      const opcodeData = numParser(REGISTERS[i]);
      const opcode = opcodeData.slice(-2);
      
      const [ arg1, arg2, arg3 ] = calculateOperands(i, opcodeData, opcode);

      if (opcode === '01') {

        const [ operandA, operandB, writeIdx ] = [ arg1, arg2, arg3 ];

        if ([ operandA, operandB, writeIdx ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}, ${writeIdx}`;
        }

        const sum = operandA + operandB;

        writeToRegisters(writeIdx, sum);
        i += 4;
      }

      else if (opcode === '02') {

        const [ operandA, operandB, writeIdx ] = [ arg1, arg2, arg3 ];

        if ([ operandA, operandB, writeIdx ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}, ${writeIdx}`;
        }

        const product = operandA * operandB;

        writeToRegisters(writeIdx, product);
        i += 4;
      }

      else if (opcode === '03') {
        
        const writeIdx = arg1;

        if (writeIdx === null) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${writeIdx}`;
        }

        // INPUT IS CONTEXTUAL!
        // in this problem, we are told to provide 0 if the robot is over a black panel, or 1 if it is over a white panel
        const input = WHITE.has(`${y},${x}`) ? 1 : 0;

        // SANITY CHECK: SHOULD NOT GIVE ANOTHER INPUT IN BETWEEN RECEIVING TWO OUTPUTS IN SEQUENCE
        if (paint !== null) throw `ERROR: HIT OPCODE 03 BEFORE GETTING TWO OUTPUTS IN SEQUENCE`;

        writeToRegisters(writeIdx, input);
        
        i += 2;
      }

      else if (opcode === '04') {

        const readValue = arg1;

        if (readValue === null) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${readValue}`;
        }

        // OUTPUT IS CONTEXTUAL!
        // in this problem, we are told to use output information to paint the ship and rotate the robot

        if (paint === null) {

          paint = readValue;
          if (paint === 0) WHITE.delete(`${y},${x}`);
          else if (paint === 1) WHITE.add(`${y},${x}`);
          else throw `ERROR: INVALID PAINT OUTPUT ${paint}`;

          PAINTED.add(`${y},${x}`);

        } else {

          paint = null;
          if (readValue === 0) dir = (dir + 4 - 1) % 4;
          else if (readValue === 1) dir = (dir + 1) % 4;
          else throw `ERROR: INVALID PAINT OUTPUT ${paint}`;
          
          const [ dy, dx ] = DELTAS[dir];
          y += dy;
          x += dx;

        }

        i += 2;
      }

      else if (opcode === '05') {

        const [ operandA, operandB ] = [ arg1, arg2 ];

        if ([ operandA, operandB ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}`;
        }

        if (operandA) i = operandB;
        else i += 3;

      }

      else if (opcode === '06') {

        const [ operandA, operandB ] = [ arg1, arg2 ];

        if ([ operandA, operandB ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}`;
        }

        if (!operandA) i = operandB;
        else i += 3;

      }

      else if (opcode === '07') {

        const [ operandA, operandB, writeIdx ] = [ arg1, arg2, arg3 ];

        if ([ operandA, operandB, writeIdx ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}, ${writeIdx}`;
        }

        writeToRegisters(writeIdx, +(operandA < operandB));
        i += 4;
      }

      else if (opcode === '08') {

        const [ operandA, operandB, writeIdx ] = [ arg1, arg2, arg3 ];

        if ([ operandA, operandB, writeIdx ].includes(null)) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${operandA}, ${operandB}, ${writeIdx}`;
        }

        writeToRegisters(writeIdx, +(operandA === operandB));
        i += 4;
      }

      else if (opcode === '09') {

        const relativeBaseOffset = arg1;

        if (relativeBaseOffset === null) {
          console.log('STATE OF REGISTERS:', REGISTERS);
          throw `ERROR AT INDEX ${i}: ARGUMENTS CONTAIN null: ${relativeBaseOffset}`;
        }

        relativeBase += relativeBaseOffset;

        i += 2;
      }

      else if (opcode === '99') {
        break;
      }

      else {
        console.log('STATE OF REGISTERS:', REGISTERS);
        throw `ERROR AT INDEX ${i}: UNRECOGNIZED OPCODE ${opcode}`;
      }

    }

    // SANITY CHECKS

    if (DISPLAY_EXTRA_INFO) {
      // console.log('FINAL STATE OF REGISTERS:', REGISTERS);
    }

    // RETURN VALUE IS CONTEXTUAL!
    // in this problem, we don't return anything

  }

  // CONSTANTS
  const DELTAS = [
    [ -1, 0 ],                                      // UP (negative dy for the grid)
    [ 0, +1 ],                                      // RIGHT
    [ +1, 0 ],                                      // DOWN (positive dy for the grid)
    [ 0, -1 ],                                      // LEFT
  ];

  // DATA STRUCTURES
  const WHITE = new Set();
  const PAINTED = new Set();

  // INIT
  let [ y, x ] = [ 0, 0 ];
  let dir = 0;
  if (part === 2) WHITE.add('0,0');

  // RUN INTCODE COMPUTER
  runIntcode();

  if (part === 1) {

    return PAINTED.size;

  } else {

    // FIRST PASS: GET EXTREMA
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const serial of WHITE) {
      const [ y, x ] = serial.split(',').map(n => +n);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }

    // BUILD GRID
    const H = maxY - minY + 1;
    const W = maxX - minX + 1;
    const GRID = Array.from({length: H}, () => Array(W).fill('.'));

    // SECOND PASS: POPULATE GRID
    const [ offsetY, offsetX ] = [ -minY, -minX ];
    for (const serial of WHITE) {
      const [ y, x ] = serial.split(',').map(n => +n);
      GRID[y + offsetY][x + offsetX] = '#';
    }

    // PRINT GRID TO SEE THE ANSWER
    for (const row of GRID) {
      console.log(row.map(c => c === '.' ? ' ' : c).join(' '));
    }

    return GRID.map(row => row.join('')).join('\n');

  }
  
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = intcode5;
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

// const sampleInput = parseSampleInput(
// ``
// );

// Test case 1
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 2478;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 2,
  inputStr: actualInput,
};
expected =
`#..#..##..####.###..#..#..##...##..####
#..#.#..#....#.#..#.#..#.#..#.#..#....#
####.#......#..#..#.#..#.#....#..#...#.
#..#.#.....#...###..#..#.#.##.####..#..
#..#.#..#.#....#.#..#..#.#..#.#..#.#...
#..#..##..####.#..#..##...###.#..#.####`
;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);