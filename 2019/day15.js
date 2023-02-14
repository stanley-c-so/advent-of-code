/*

--- Day 15: Oxygen System ---

Out here in deep space, many things can go wrong. Fortunately, many of those things have indicator lights. Unfortunately, one of those lights is lit: the oxygen system for part of the ship has failed!

According to the readouts, the oxygen system must have failed days ago after a rupture in oxygen tank two; that section of the ship was automatically sealed once oxygen levels went dangerously low. A single remotely-operated repair droid is your only option for fixing the oxygen system.

The Elves' care package included an Intcode program (your puzzle input) that you can use to remotely control the repair droid. By running that program, you can direct the repair droid to the oxygen system and fix the problem.

The remote control program executes the following steps in a loop forever:

Accept a movement command via an input instruction.
Send the movement command to the repair droid.
Wait for the repair droid to finish the movement operation.
Report on the status of the repair droid via an output instruction.

Only four movement commands are understood: north (1), south (2), west (3), and east (4). Any other command is invalid. The movements differ in direction, but not in distance: in a long enough east-west hallway, a series of commands like 4,4,4,4,3,3,3,3 would leave the repair droid back where it started.

The repair droid can reply with any of the following status codes:

0: The repair droid hit a wall. Its position has not changed.
1: The repair droid has moved one step in the requested direction.
2: The repair droid has moved one step in the requested direction; its new position is the location of the oxygen system.

You don't know anything about the area around the repair droid, but you can figure it out by watching the status codes.

For example, we can draw the area using D for the droid, # for walls, . for locations the droid can traverse, and empty space for unexplored locations. Then, the initial state looks like this:

      
      
   D  
      
      

To make the droid go north, send it 1. If it replies with 0, you know that location is a wall and that the droid didn't move:

      
   #  
   D  
      
      

To move east, send 4; a reply of 1 means the movement was successful:

      
   #  
   .D 
      
      

Then, perhaps attempts to move north (1), south (2), and east (4) are all met with replies of 0:

      
   ## 
   .D#
    # 
      

Now, you know the repair droid is in a dead end. Backtrack with 3 (which you already know will get a reply of 1 because you already know that location is open):

      
   ## 
   D.#
    # 
      

Then, perhaps west (3) gets a reply of 0, south (2) gets a reply of 1, south again (2) gets a reply of 0, and then west (3) gets a reply of 2:

      
   ## 
  #..#
  D.# 
   #  

Now, because of the reply of 2, you know you've found the oxygen system! In this example, it was only 2 moves away from the repair droid's starting position.

What is the fewest number of movement commands required to move the repair droid from its starting position to the location of the oxygen system?


--- Part Two ---

You quickly repair the oxygen system; oxygen gradually fills the area.

Oxygen starts in the location containing the repaired oxygen system. It takes one minute for oxygen to spread to all open locations that are adjacent to a location that already contains oxygen. Diagonal locations are not adjacent.

In the example above, suppose you've used the droid to explore the area fully and have the following map (where locations that currently contain oxygen are marked O):

 ##   
#..## 
#.#..#
#.O.# 
 ###  

Initially, the only location which contains oxygen is the location of the repaired oxygen system. However, after one minute, the oxygen spreads to all open (.) locations that are adjacent to a location containing oxygen:

 ##   
#..## 
#.#..#
#OOO# 
 ###  

After a total of two minutes, the map looks like this:

 ##   
#..## 
#O#O.#
#OOO# 
 ###  

After a total of three minutes:

 ##   
#O.## 
#O#OO#
#OOO# 
 ###  

And finally, the whole region is full of oxygen after a total of four minutes:

 ##   
#OO## 
#O#OO#
#OOO# 
 ###  

So, in this example, all locations contain oxygen after 4 minutes.

Use the repair droid to get a complete map of the area. How many minutes will it take to fill with oxygen?

*/

const { Queue } = require('./_classes');

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function intcode7 (part, inputStr, DEBUG = false) {
  
  const PROGRAM = inputStr.split(',').map(n => +n);

  function runIntcode(hugLeftWall) {

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

    let [ y, x ] = [ 0, 0 ];
    let dir = 0;

    // const OUTPUT = [];

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
        // in this problem, we are told to input 1-4 depending on if we want to go N, S, W, or E
        // however, this doesn't quite map to dirs, which are 0-3 and go in the order of N, E, S, W
        const DIR_TO_INPUT_DIRECTION_MAPPING = [ 1, 4, 2, 3 ];
        const input = DIR_TO_INPUT_DIRECTION_MAPPING[dir];

        // console.log(`INPUT: ${input}`)
        // console.log(`now at: ${y}, ${x}`)

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
        // in this problem, we are told to use output information to determine if we hit a wall or not.
        const [ dy, dx ] = DELTAS[dir];
        if (readValue === 0) {
          // console.log(`at ${y}, ${x}, dir ${dir} | hit wall!`)
          // OUTPUT.push(readValue);
          WALLS.add(`${y + dy},${x + dx}`);
          updateExtrema(y + dy, x + dx);
          if (hugLeftWall) {
            dir = (dir + 1) % 4;                                                          // attempt to go in next dir
          } else {
            dir = (dir + 4 - 1) % 4;
          }
        }
        else if ([ 1, 2 ].includes(readValue)) {
          if (hugLeftWall) {
            dir = (dir + 4 - 1) % 4;                                                      // attempt to go in previous dir
          } else {
            dir = (dir + 1) % 4;
          }
          y += dy;
          x += dx;
          SPACES.add(`${y},${x}`);
          updateExtrema(y, x);
          if (readValue === 2) return [ y, x ];
        }
        else throw `ERROR: UNEXPECTED OUTPUT ${readValue}`;

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
    // in this problem, we return the position of the oxygen tank if we find it directly in opcode 04; if we reach here, throw error
    throw `ERROR: NO OXYGEN TANK FOUND`;

  }

  // CONSTANTS
  const DELTAS = [
    [ -1, 0 ],                                                                            // N
    [ 0, +1 ],                                                                            // E
    [ +1, 0 ],                                                                            // S
    [ 0, -1 ],                                                                            // W
  ];

  // DATA STRUCTURES
  const WALLS = new Set();
  const SPACES = new Set();
  SPACES.add(`${0},${0}`);

  // EXTREMA - OPTIONAL; ONLY NEEDED IF DRAWING GRID
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  function updateExtrema(y, x) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  // ANALYZE - RUN THE MAZE TWICE, HUGGING OPPOSITE WALLS
  const [ oxygenTankY, oxygenTankX ] = runIntcode(true);
  const [ doubleCheckOxygenTankY, doubleCheckOxygenTankX ] = runIntcode(false);
  if (oxygenTankY !== doubleCheckOxygenTankY) {
    throw `ERROR: TANK Y COORDS DO NOT MATCH - ${oxygenTankY} vs ${doubleCheckOxygenTankY}`;
  }
  if (oxygenTankX !== doubleCheckOxygenTankX) {
    throw `ERROR: TANK X COORDS DO NOT MATCH - ${oxygenTankX} vs ${doubleCheckOxygenTankX}`;
  }
  // console.log(oxygenTankY, oxygenTankX);
  // console.log(doubleCheckOxygenTankY, doubleCheckOxygenTankX);
  // console.log(minY, maxY);
  // console.log(minX, maxX);

  // BUILD GRID - OPTIONAL
  const H = maxY - minY + 1;
  const W = maxX - minX + 1;
  const [ offsetY, offsetX ] = [ -minY, -minX ];
  const [ WALL, SPACE, UNKNOWN, TANK, START, OXYGEN ] = [ '#', ' ', '?', 'T', 'X', 'O' ];
  const GRID = Array.from({length: H}, () => Array(W).fill(UNKNOWN));
  for (const serial of WALLS) {
    const [ y, x ] = serial.split(',').map(n => +n);
    GRID[y + offsetY][x + offsetX] = WALL;
  }
  for (const serial of SPACES) {
    const [ y, x ] = serial.split(',').map(n => +n);
    GRID[y + offsetY][x + offsetX] = SPACE;
  }
  GRID[offsetY][offsetX] = START;
  GRID[oxygenTankY + offsetY][oxygenTankX + offsetX] = TANK;
  
  if (part === 1) {

    if (DISPLAY_EXTRA_INFO) {
      for (const row of GRID) console.log(row.join(' '));
    }

    // BFS
    const Q = new Queue([ 0, 0, 0 ]);
    const visited = new Set();
    while (!Q.isEmpty()) {
      const [ y, x, moves ] = Q.dequeue().val;
      const serial = `${y},${x}`;
      if (visited.has(serial)) continue;
      visited.add(serial);

      if (y === oxygenTankY && x === oxygenTankX) return moves;                           // found oxygen tank

      for (const [ dy, dx ] of DELTAS) {
        if (SPACES.has(`${y + dy},${x + dx}`)) {                                          // can only traverse along spaces
          Q.enqueue([ y + dy, x + dx, moves + 1 ]);
        }
      }
    }
    throw `ERROR: NO SOLUTION FOUND`;

  } else {

    // BFS
    const Q = new Queue([ oxygenTankY, oxygenTankX, 0 ]);
    while (!Q.isEmpty()) {
      const [ y, x, moves ] = Q.dequeue().val;
      const serial = `${y},${x}`;

      if (!SPACES.has(serial)) continue;                                                  // we only want oxygen to travel to an empty space
      SPACES.delete(serial);                                                              // 'delete' the space...

      if (y !== oxygenTankY || x !== oxygenTankX) {
        GRID[y + offsetY][x + offsetX] = OXYGEN;                                          // ...and fill it with oxygen in the GRID
      }

      if (SPACES.size === 0) {                                                            // completely filled maze with oxygen
        if (DISPLAY_EXTRA_INFO) {
          for (const row of GRID) console.log(row.join(' '));
        }
        return moves;
      }

      for (const [ dy, dx ] of DELTAS) {
        Q.enqueue([ y + dy, x + dx, moves + 1 ]);
      }
    }
    throw `ERROR: NO SOLUTION FOUND`;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = intcode7;
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
expected = 304;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 310;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);