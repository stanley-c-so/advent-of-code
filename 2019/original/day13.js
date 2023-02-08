// --- Day 13: Care Package ---

// PART 1:

// As you ponder the solitude of space and the ever-increasing three-hour roundtrip for messages between you and Earth, you notice that the Space Mail Indicator Light is blinking. To help keep you sane, the Elves have sent you a care package.

// It's a new game for the ship's arcade cabinet! Unfortunately, the arcade is all the way on the other end of the ship. Surely, it won't be hard to build your own - the care package even comes with schematics.

// The arcade cabinet runs Intcode software like the game the Elves sent (your puzzle input). It has a primitive screen capable of drawing square tiles on a grid. The software draws tiles to the screen with output instructions: every three output instructions specify the x position (distance from the left), y position (distance from the top), and tile id. The tile id is interpreted as follows:

// 0 is an empty tile. No game object appears in this tile.
// 1 is a wall tile. Walls are indestructible barriers.
// 2 is a block tile. Blocks can be broken by the ball.
// 3 is a horizontal paddle tile. The paddle is indestructible.
// 4 is a ball tile. The ball moves diagonally and bounces off objects.
// For example, a sequence of output values like 1,2,3,6,5,4 would draw a horizontal paddle tile (1 tile from the left and 2 tiles from the top) and a ball tile (6 tiles from the left and 5 tiles from the top).

// Start the game. How many block tiles are on the screen when the game exits?

// PART 2:

// The game didn't run because you didn't put in any quarters. Unfortunately, you did not bring any quarters. Memory address 0 represents the number of quarters that have been inserted; set it to 2 to play for free.

// The arcade cabinet has a joystick that can move left and right. The software reads the position of the joystick with input instructions:

// If the joystick is in the neutral position, provide 0.
// If the joystick is tilted to the left, provide -1.
// If the joystick is tilted to the right, provide 1.
// The arcade cabinet also has a segment display capable of showing a single number that represents the player's current score. When three output instructions specify X=-1, Y=0, the third output instruction is not a tile; the value instead specifies the new score to show in the segment display. For example, a sequence of output values like -1,0,12345 would show 12345 as the player's current score.

// Beat the game by breaking all the blocks. What is your score after the last block is broken?

function arcade (part, codeStr) {

  // UTILITY FUNCTION: takes a str (or num) and standardizes its format so that the number portion is n digits (default 5) and it keeps its negative sign if applicable
  const numParser = (str, n = 5) => {
    if (typeof str === 'number') str = str.toString();
    const negative = str[0] === '-';
    let rtn = negative ? str.slice(1) : str;
    rtn = rtn.length < n ? '0'.repeat(n - rtn.length) + rtn : rtn;
    if (negative) rtn = '-' + rtn;
    return rtn;
  }

  // HELPER FUNCTION: RUNS THROUGH INPUT INTCODE AND RETURNS ENTIRE OUTPUT
  function runIntcode (code, showImage = false) {

    function calculateOperand (n, mode) {                                       // use this helper function to calculate operand based on operand # and mode #
      if (mode === 1) return +clone[i + n];
      const offset = mode === 0 ? 0 : relativeBase;
      const searchIdx = +clone[i + n] + offset;
      if (n === 3) return searchIdx;                                            // operand3 always refers to the write location, so we only need to return that index
      if (clone[searchIdx] === undefined) clone[searchIdx] = numParser(0);      // if the search index is out of bounds of current clone state, first set that value to 0
      return +clone[searchIdx];
    }

    // THIS FUNCTION IS COMPLETELY OPTIONAL
    function drawBoard (tiles, highestX, lowestX, highestY, lowestY) {
      const h = highestY - lowestY + 1;
      const w = highestX - lowestX + 1;
      const img = Array.from({length: h}, () => Array.from({length: w}, () => 0));
      for (const coord in tiles) {
        const [x, y] = coord.split(',').map(s => +s);
        const row = y - lowestY;                                      // not sure if matrix rows are flipped relative to y axis. if so, use `highestY - y` instead (flips image upside down)
        const col = x - lowestX;                                      // measure x relative to lowestX
        img[row][col] = tiles[coord];
      }
      img.forEach(row => console.log(row.map(n => n ? n : ' ').join(' ')));
      console.log('');
    }

    const clone = [...code];
    const output = [];

    // SPECIAL INITIALIZATIONS FOR THIS PROBLEM
    const tiles = {};                                                               // every time we draw a tile type to an X,Y position, we will write/overwrite key X,Y with that tile type
    let blockTiles = 0;                                                             // we ultimately need to return the number of block tiles (type 2)
    let score;                                                                      // part 2 asks to track the score
    let ballX;                                                                      // we want to track the x position of the ball so we can move the paddle toward it in part 2
    let paddleX;                                                                    // we want to track the x position of the paddle so we can move it toward the ball in part 2

    // THIS BLOCK OF CODE IS COMPLETELY OPTIONAL
    let lowestX = Infinity;
    let highestX = -Infinity;
    let lowestY = Infinity;
    let highestY = -Infinity;

    if (part === 2) clone[0] = numParser(2);                                        // in part 2, we have to set memory address 0 to 2 to play without quarters

    let i = 0;
    let relativeBase = 0;
    while (i < clone.length) {                                                      // we use a while loop because the increment varies depending on a lot of things
      const opcode = clone[i].slice(-2);
      const mode1 = +clone[i].substr(-3, 1);
      const mode2 = +clone[i].substr(-4, 1);
      const mode3 = +clone[i].substr(-5, 1);
      const operand1 = calculateOperand(1, mode1);
      const operand2 = calculateOperand(2, mode2);
      const operand3 = calculateOperand(3, mode3);                                  // NOTE: unlike operands 1-2 which could be either an index or absolute value, 3 is ALWAYS an index

      if (opcode === '01') {
        clone[operand3] = numParser(operand1 + operand2);
        i += 4;
      } else if (opcode === '02') {
        clone[operand3] = numParser(operand1 * operand2);
        i += 4;
      } else if (opcode === '03') {
        const offset = mode1 === 0 ? 0 : relativeBase;
        const searchIdx = +clone[i + 1] + offset;
        if (clone[searchIdx] === undefined) clone[searchIdx] = numParser(0);        // if the search index is out of bounds of current clone state, first set that value to 0
        if (ballX > paddleX) {
          clone[searchIdx] = numParser(1);                                          // if ball is to the right of paddle, move joystick right
        } else if (ballX < paddleX) {
          clone[searchIdx] = numParser(-1);                                         // if ball is to the left of paddle, move joystick left
        } else {
          clone[searchIdx] = numParser(0);                                          // if ball's x position matches that of the paddle, leave the joystick neutral
        }
        i += 2;
      } else if (opcode === '04') {
        output.push(operand1);
        if (output.length === 3) {
          const [x, y, value] = output;
          if (x === -1 && y === 0) {                                                // IF we get X = -1 and Y = 0, then we change score to third input instead of drawing a tile
            score = value;

            // THIS BLOCK OF CODE IS COMPLETELY OPTIONAL
            if (showImage) {
              console.log('\n' + 'BOARD AT SCORE CHANGE:' + '\n');
              drawBoard(tiles, highestX, lowestX, highestY, lowestY);
            }

          } else {                                                                  // ELSE, we are updating the game state
            tiles[`${x},${y}`] = value;                                             // write the tile type to the corresponding location in the tiles object
            if (value === 2) blockTiles++;                                          // update block count for part 1
            if (value === 3) paddleX = x;                                           // update x position of paddle
            if (value === 4) ballX = x;                                             // update x position of ball

            // THIS BLOCK OF CODE IS COMPLETELY OPTIONAL: i was curious what the display looked like in part 1. this code shows the screen
            lowestX = Math.min(lowestX, x);
            highestX = Math.max(highestX, x);
            lowestY = Math.min(lowestY, y);
            highestY = Math.max(highestY, y);

          }
          output.length = 0;                                                        // clear the output for the next set of 3
        }
        i += 2;
      } else if (opcode === '05') {
        i = operand1 ? operand2 : i + 3;
      } else if (opcode === '06') {
        i = operand1 ? i + 3 : operand2;
      } else if (opcode === '07') {
        clone[operand3] = operand1 < operand2 ? numParser(1) : numParser(0);
        i += 4;
      } else if (opcode === '08') {
        clone[operand3] = operand1 === operand2 ? numParser(1) : numParser(0);
        i += 4;
      } else if (opcode === '09') {
        relativeBase += operand1;
        i += 2;
      } else if (opcode === '99') {

        // THIS BLOCK OF CODE IS COMPLETELY OPTIONAL
        if (showImage) {
          console.log('\n' + 'FINAL BOARD BEFORE EXIT:' + '\n');
          drawBoard(tiles, highestX, lowestX, highestY, lowestY);
        }

        return {blockTiles, score};
      } else {
        throw 'ERROR! unrecognized opcode';                                         // this makes sure that the opcode belongs to one of the above cases. this error should never happen
      }
    }
    throw 'ERROR! i is out of bounds';                                              // if the while loop terminates prematurely (apart from opcode 99 or 04). this error should never happen
  }

  // INGEST INPUT DATA (THE PROGRAM)
  const code = codeStr.split(',').map(str => numParser(str));

  // RUN THE SIMULATION
  const {blockTiles, score} = runIntcode(code, true);                               // omit second parameter or switch it to false if you don't want to see the image

  // PART 1 VS PART 2
  return (part === 1) ? blockTiles : score;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = arcade;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const actualInput = `1,380,379,385,1008,2319,769929,381,1005,381,12,99,109,2320,1101,0,0,383,1102,1,0,382,20101,0,382,1,20101,0,383,2,21102,1,37,0,1105,1,578,4,382,4,383,204,1,1001,382,1,382,1007,382,42,381,1005,381,22,1001,383,1,383,1007,383,20,381,1005,381,18,1006,385,69,99,104,-1,104,0,4,386,3,384,1007,384,0,381,1005,381,94,107,0,384,381,1005,381,108,1105,1,161,107,1,392,381,1006,381,161,1101,-1,0,384,1105,1,119,1007,392,40,381,1006,381,161,1101,1,0,384,21001,392,0,1,21102,18,1,2,21102,0,1,3,21102,138,1,0,1105,1,549,1,392,384,392,21001,392,0,1,21102,1,18,2,21102,3,1,3,21101,161,0,0,1106,0,549,1101,0,0,384,20001,388,390,1,20101,0,389,2,21102,180,1,0,1105,1,578,1206,1,213,1208,1,2,381,1006,381,205,20001,388,390,1,21001,389,0,2,21102,1,205,0,1105,1,393,1002,390,-1,390,1102,1,1,384,21001,388,0,1,20001,389,391,2,21102,228,1,0,1106,0,578,1206,1,261,1208,1,2,381,1006,381,253,20102,1,388,1,20001,389,391,2,21101,253,0,0,1106,0,393,1002,391,-1,391,1101,0,1,384,1005,384,161,20001,388,390,1,20001,389,391,2,21101,0,279,0,1105,1,578,1206,1,316,1208,1,2,381,1006,381,304,20001,388,390,1,20001,389,391,2,21101,304,0,0,1105,1,393,1002,390,-1,390,1002,391,-1,391,1102,1,1,384,1005,384,161,20102,1,388,1,20101,0,389,2,21102,0,1,3,21101,0,338,0,1105,1,549,1,388,390,388,1,389,391,389,20101,0,388,1,20101,0,389,2,21102,1,4,3,21101,0,365,0,1106,0,549,1007,389,19,381,1005,381,75,104,-1,104,0,104,0,99,0,1,0,0,0,0,0,0,207,19,15,1,1,21,109,3,22101,0,-2,1,22101,0,-1,2,21102,0,1,3,21101,0,414,0,1106,0,549,22101,0,-2,1,22101,0,-1,2,21101,0,429,0,1106,0,601,2101,0,1,435,1,386,0,386,104,-1,104,0,4,386,1001,387,-1,387,1005,387,451,99,109,-3,2105,1,0,109,8,22202,-7,-6,-3,22201,-3,-5,-3,21202,-4,64,-2,2207,-3,-2,381,1005,381,492,21202,-2,-1,-1,22201,-3,-1,-3,2207,-3,-2,381,1006,381,481,21202,-4,8,-2,2207,-3,-2,381,1005,381,518,21202,-2,-1,-1,22201,-3,-1,-3,2207,-3,-2,381,1006,381,507,2207,-3,-4,381,1005,381,540,21202,-4,-1,-1,22201,-3,-1,-3,2207,-3,-4,381,1006,381,529,22102,1,-3,-7,109,-8,2106,0,0,109,4,1202,-2,42,566,201,-3,566,566,101,639,566,566,1201,-1,0,0,204,-3,204,-2,204,-1,109,-4,2106,0,0,109,3,1202,-1,42,593,201,-2,593,593,101,639,593,593,21002,0,1,-2,109,-3,2105,1,0,109,3,22102,20,-2,1,22201,1,-1,1,21101,0,431,2,21101,0,400,3,21101,840,0,4,21101,630,0,0,1106,0,456,21201,1,1479,-2,109,-3,2105,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,2,2,2,2,2,0,2,0,2,2,0,0,0,2,2,0,0,2,0,2,0,2,2,0,2,0,2,2,0,2,0,2,2,2,2,0,2,0,0,1,1,0,0,0,0,2,2,2,2,2,2,2,2,0,2,2,2,0,2,0,0,2,0,2,2,0,0,0,2,2,2,0,0,0,2,0,0,0,0,2,0,1,1,0,0,2,2,2,0,0,2,0,2,0,0,2,0,0,2,2,0,2,2,0,0,0,2,2,2,0,0,0,0,2,0,0,0,2,0,2,2,0,0,1,1,0,0,0,2,0,2,0,0,0,0,0,0,0,0,2,2,2,2,0,0,2,2,0,0,2,2,2,0,0,0,2,0,0,0,0,2,2,0,2,0,1,1,0,2,0,0,2,0,0,2,2,0,0,2,0,0,2,2,0,2,0,0,2,0,2,2,0,2,0,2,2,0,2,0,2,2,0,0,0,0,0,0,1,1,0,2,2,0,0,0,0,0,0,0,0,2,0,2,0,0,0,0,0,2,2,2,2,2,0,0,2,0,2,0,0,2,2,2,2,0,0,0,0,0,1,1,0,2,0,2,2,0,2,2,0,0,2,0,2,0,2,0,0,0,0,2,0,2,2,2,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,0,1,1,0,0,0,2,0,2,0,0,2,0,2,0,0,0,0,0,2,0,2,2,0,0,0,2,2,0,0,2,2,2,2,2,0,2,2,0,2,0,2,0,1,1,0,2,0,0,0,0,2,0,0,2,2,0,2,0,0,0,0,2,0,2,2,0,0,0,0,2,2,2,2,2,0,2,0,2,0,2,0,0,2,0,1,1,0,0,0,0,2,0,2,0,0,0,2,2,0,0,2,2,0,2,0,0,0,0,0,2,0,2,0,0,2,0,2,2,2,0,0,2,0,0,2,0,1,1,0,2,2,0,2,2,0,0,2,2,0,2,2,2,2,2,0,2,0,0,0,0,0,2,2,0,0,0,2,0,0,0,0,0,0,0,0,0,2,0,1,1,0,0,0,2,2,0,2,2,2,0,2,0,2,2,0,0,0,2,2,2,2,2,2,0,0,0,0,2,0,2,2,0,0,0,0,0,2,2,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,57,12,56,27,22,51,23,56,81,51,42,19,57,97,82,70,24,36,70,51,86,22,44,17,68,68,76,3,5,83,77,61,50,40,6,31,75,43,30,40,61,77,17,92,23,40,49,22,27,67,8,2,6,77,23,59,73,50,5,44,87,49,41,60,34,98,68,29,38,77,40,27,45,87,38,5,90,84,10,22,8,33,48,5,82,47,88,86,26,59,73,41,42,85,95,55,20,60,19,78,88,51,64,71,6,11,8,29,11,61,20,38,9,92,13,59,35,11,83,23,66,76,91,8,9,84,74,8,37,20,31,19,16,3,52,38,89,36,43,97,27,95,51,15,38,93,65,93,29,14,71,30,16,57,23,32,94,54,9,21,51,9,59,88,17,35,2,97,4,3,70,94,97,36,90,64,87,58,42,69,35,64,29,8,17,75,93,44,89,63,85,81,1,96,45,56,20,19,16,54,31,17,69,89,20,16,21,13,59,98,53,41,47,55,94,32,26,64,4,36,26,44,7,64,80,52,65,75,81,81,89,78,4,19,76,98,62,79,33,9,24,40,51,79,77,23,46,79,22,5,53,22,81,35,3,49,35,90,76,89,73,11,17,71,49,95,85,64,82,5,38,82,88,45,80,49,7,53,28,57,14,35,11,71,52,65,3,42,97,24,1,39,68,24,41,56,18,61,71,87,88,8,74,81,9,59,91,22,21,83,50,61,46,33,87,28,7,31,88,66,2,92,76,36,42,83,50,42,89,2,40,98,84,60,46,36,38,86,27,17,34,80,60,43,64,44,24,71,76,43,85,98,89,72,2,53,37,81,48,33,68,96,36,34,72,25,71,72,40,60,30,27,82,91,57,46,36,6,95,75,19,29,56,84,59,80,58,15,95,10,36,8,88,79,29,59,91,17,12,42,68,64,36,74,81,22,61,95,44,88,96,14,1,78,77,76,24,81,19,39,95,80,21,73,59,61,62,49,49,47,53,4,22,65,12,59,8,11,43,52,12,71,35,2,75,78,54,62,39,3,58,90,54,8,54,27,44,45,76,33,72,98,89,2,67,96,95,25,57,29,51,34,63,81,89,63,56,40,96,64,50,7,20,72,3,1,91,63,16,69,12,1,11,84,54,13,96,33,27,44,76,67,83,27,84,3,27,17,82,92,34,12,94,63,33,74,49,81,28,59,58,82,1,92,92,93,92,28,10,14,5,22,48,95,43,95,76,66,67,4,51,61,17,23,21,37,67,9,30,76,22,33,77,98,70,68,18,55,33,65,43,31,21,31,30,10,39,32,44,57,62,91,38,74,47,38,78,68,2,93,53,89,51,65,71,75,34,18,1,19,42,68,26,91,25,40,92,44,74,61,85,19,33,76,46,89,10,61,96,43,97,25,14,66,90,30,82,6,61,10,29,89,15,19,18,63,58,37,85,64,37,29,3,1,71,33,73,26,50,49,13,11,68,53,57,8,32,47,59,15,47,14,12,95,49,57,5,24,22,46,9,72,3,85,67,47,57,71,3,76,29,36,54,38,44,45,17,84,97,21,16,92,81,62,54,44,20,93,80,84,1,55,64,28,42,38,42,17,22,14,3,9,73,48,79,45,5,76,27,40,3,31,60,6,65,30,71,70,44,93,26,3,27,91,23,50,94,45,82,52,39,16,71,19,84,38,64,45,60,12,87,90,80,93,39,78,46,30,37,33,15,49,36,75,46,18,59,15,1,7,4,21,80,11,75,72,12,5,9,63,65,3,54,32,74,15,5,8,50,39,5,80,83,15,58,20,1,95,61,15,27,35,14,69,55,50,32,2,58,17,4,1,89,83,78,4,44,48,76,17,73,76,65,59,97,76,88,70,35,67,51,71,65,15,51,90,97,82,11,19,40,22,17,43,22,6,44,21,51,43,769929`;

// Test case 1
input = {
  part: 1,
  codeStr: actualInput,
};
expected = 207;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 1
input = {
  part: 2,
  codeStr: actualInput,
};
expected = 10247;
test(func, input, expected, testNum, lowestTest, highestTest);