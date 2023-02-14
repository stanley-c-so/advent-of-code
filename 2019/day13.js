/*

--- Day 13: Care Package ---

As you ponder the solitude of space and the ever-increasing three-hour roundtrip for messages between you and Earth, you notice that the Space Mail Indicator Light is blinking. To help keep you sane, the Elves have sent you a care package.

It's a new game for the ship's arcade cabinet! Unfortunately, the arcade is all the way on the other end of the ship. Surely, it won't be hard to build your own - the care package even comes with schematics.

The arcade cabinet runs Intcode software like the game the Elves sent (your puzzle input). It has a primitive screen capable of drawing square tiles on a grid. The software draws tiles to the screen with output instructions: every three output instructions specify the x position (distance from the left), y position (distance from the top), and tile id. The tile id is interpreted as follows:

0 is an empty tile. No game object appears in this tile.
1 is a wall tile. Walls are indestructible barriers.
2 is a block tile. Blocks can be broken by the ball.
3 is a horizontal paddle tile. The paddle is indestructible.
4 is a ball tile. The ball moves diagonally and bounces off objects.

For example, a sequence of output values like 1,2,3,6,5,4 would draw a horizontal paddle tile (1 tile from the left and 2 tiles from the top) and a ball tile (6 tiles from the left and 5 tiles from the top).

Start the game. How many block tiles are on the screen when the game exits?


--- Part Two ---

The game didn't run because you didn't put in any quarters. Unfortunately, you did not bring any quarters. Memory address 0 represents the number of quarters that have been inserted; set it to 2 to play for free.

The arcade cabinet has a joystick that can move left and right. The software reads the position of the joystick with input instructions:

If the joystick is in the neutral position, provide 0.
If the joystick is tilted to the left, provide -1.
If the joystick is tilted to the right, provide 1.

The arcade cabinet also has a segment display capable of showing a single number that represents the player's current score. When three output instructions specify X=-1, Y=0, the third output instruction is not a tile; the value instead specifies the new score to show in the segment display. For example, a sequence of output values like -1,0,12345 would show 12345 as the player's current score.

Beat the game by breaking all the blocks. What is your score after the last block is broken?
*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function intcode6 (part, inputStr, DEBUG = false) {
  
  const PROGRAM = inputStr.split(',').map(n => +n);

  function runIntcode() {

    // UTILITY FUNCTION THAT DRAWS THE CURRENT STATE (ONLY FOR THIS PROBLEM, AND COMPLETELY OPTIONAL)
    function drawState() {
      let maxX = 0;
      let maxY = 0;

      for (const serial of STATE.empty) {
        const [ y, x ] = serial.split(',').map(n => +n);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
      for (const serial of STATE.wall) {
        const [ y, x ] = serial.split(',').map(n => +n);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
      for (const serial of STATE.block) {
        const [ y, x ] = serial.split(',').map(n => +n);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }

      const [ H, W ] = [ maxY + 1, maxX + 1 ];
      const GRID = Array.from({length: H}, () => Array(W).fill(null));
      
      for (const serial of STATE.empty) {
        const [ y, x ] = serial.split(',').map(n => +n);
        GRID[y][x] = ' ';
      }
      for (const serial of STATE.wall) {
        const [ y, x ] = serial.split(',').map(n => +n);
        GRID[y][x] = '#';
      }
      for (const serial of STATE.block) {
        const [ y, x ] = serial.split(',').map(n => +n);
        GRID[y][x] = '*';
      }

      GRID[STATE.ball.y][STATE.ball.x] = 'o';
      GRID[STATE.paddle.y][STATE.paddle.x] = '_';

      for (const row of GRID) console.log(row.join(' '));
    }

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
    if (part === 2) REGISTERS[0] = 2;                                                     // PART 2: SET THIS TO 2 TO PLAY FOR FREE

    // INIT
    let i = 0;
    let relativeBase = 0;

    const OUTPUT_TEMP = [];

    const STATE = {
      empty: new Set(),
      wall: new Set(),
      block: new Set(),
      paddle: { x: null, y: null },
      ball: { x: null, y: null },
      score: null,
    };

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
        // in this problem, we are told that we would only reach this in part 2, and we have to enter -1, 0, or 1 to move the paddle
        if (part === 1) throw 'ERROR: SHOULD NOT REACH OPCODE 03 IN PART 1!';
        if (STATE.ball.x === null) throw 'ERROR: ball DATA IS NULL';
        if (STATE.paddle.x === null) throw 'ERROR: paddle DATA IS NULL';

        // move the paddle to chase after where the ball is
        const input = STATE.ball.x < STATE.paddle.x ? -1 :                                // move paddle left
                      STATE.ball.x > STATE.paddle.x ? 1 :                                 // move paddle right
                                                      0 ;                                 // don't move paddle

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
        // in this problem, we are told to use output information to draw the state of the game. every 3 outputs
        // we know what to draw, and where

        OUTPUT_TEMP.push(readValue);

        if (OUTPUT_TEMP.length === 3) {
          const item = OUTPUT_TEMP[2];
          const serial = `${OUTPUT_TEMP[1]},${OUTPUT_TEMP[0]}`;

          if (OUTPUT_TEMP[0] === -1) {
            if (OUTPUT_TEMP[1] === 0) {
              STATE.score = OUTPUT_TEMP[2];
            }
            else throw `ERROR: X IS -1 BUT Y IS NOT 0 - ${OUTPUT_TEMP[1]}`;
          }
          else if (item === 0) {
            STATE.empty.add(serial);
            STATE.block.delete(serial);                                                   // blocks can become empty
          }
          else if (item === 1) {
            STATE.wall.add(serial);
          }
          else if (item === 2) {
            STATE.block.add(serial);
          }
          else if (item === 3) {
            STATE.paddle.x = OUTPUT_TEMP[0];
            STATE.paddle.y = OUTPUT_TEMP[1];
          }
          else if (item === 4) {
            STATE.ball.x = OUTPUT_TEMP[0];
            STATE.ball.y = OUTPUT_TEMP[1];
          }
          else throw `ERROR: UNRECOGNIZED ITEM ${item}`;
          OUTPUT_TEMP.length = 0;
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
        drawState();                                                                      // try putting this in other places too for fun
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
    // in this problem, we generically return the state of the game, so that in the main function we can extract what we need

    return STATE;
  }

  const STATE = runIntcode();

  return part === 1 ? STATE.block.size                                                    // PART 1: GET NUMBER OF BLOCKS
                    : STATE.score;                                                        // PART 2: GET FINAL SCORE

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = intcode6;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const skippedTests = new Set([  ]);
const lowestTest = 0;
const highestTest = 1;

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
expected = 207;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 10247;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);