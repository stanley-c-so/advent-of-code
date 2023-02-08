// --- Day 11: Space Police ---

// PART 1:

// On the way to Jupiter, you're pulled over by the Space Police.

// "Attention, unmarked spacecraft! You are in violation of Space Law! All spacecraft must have a clearly visible registration identifier! You have 24 hours to comply or be sent to Space Jail!"

// Not wanting to be sent to Space Jail, you radio back to the Elves on Earth for help. Although it takes almost three hours for their reply signal to reach you, they send instructions for how to power up the emergency hull painting robot and even provide a small Intcode program (your puzzle input) that will cause it to paint your ship appropriately.

// There's just one problem: you don't have an emergency hull painting robot.

// You'll need to build a new emergency hull painting robot. The robot needs to be able to move around on the grid of square panels on the side of your ship, detect the color of its current panel, and paint its current panel black or white. (All of the panels are currently black.)

// The Intcode program will serve as the brain of the robot. The program uses input instructions to access the robot's camera: provide 0 if the robot is over a black panel or 1 if the robot is over a white panel. Then, the program will output two values:

// First, it will output a value indicating the color to paint the panel the robot is over: 0 means to paint the panel black, and 1 means to paint the panel white.
// Second, it will output a value indicating the direction the robot should turn: 0 means it should turn left 90 degrees, and 1 means it should turn right 90 degrees.
// After the robot turns, it should always move forward exactly one panel. The robot starts facing up.

// The robot will continue running for a while like this and halt when it is finished drawing. Do not restart the Intcode computer inside the robot during this process.

// For example, suppose the robot is about to start running. Drawing black panels as ., white panels as #, and the robot pointing the direction it is facing (< ^ > v), the initial state and region near the robot looks like this:

// .....
// .....
// ..^..
// .....
// .....

// The panel under the robot (not visible here because a ^ is shown instead) is also black, and so any input instructions at this point should be provided 0. Suppose the robot eventually outputs 1 (paint white) and then 0 (turn left). After taking these actions and moving forward one panel, the region now looks like this:

// .....
// .....
// .<#..
// .....
// .....

// Input instructions should still be provided 0. Next, the robot might output 0 (paint black) and then 0 (turn left):

// .....
// .....
// ..#..
// .v...
// .....

// After more outputs (1,0, 1,0):

// .....
// .....
// ..^..
// .##..
// .....

// The robot is now back where it started, but because it is now on a white panel, input instructions should be provided 1. After several more outputs (0,1, 1,0, 1,0), the area looks like this:

// .....
// ..<#.
// ...#.
// .##..
// .....

// Before you deploy the robot, you should probably have an estimate of the area it will cover: specifically, you need to know the number of panels it paints at least once, regardless of color. In the example above, the robot painted 6 panels at least once. (It painted its starting panel twice, but that panel is still only counted once; it also never painted the panel it ended on.)

// Build a new emergency hull painting robot and run the Intcode program on it. How many panels does it paint at least once?

// PART 2:

// You're not sure what it's trying to paint, but it's definitely not a registration identifier. The Space Police are getting impatient.

// Checking your external ship cameras again, you notice a white panel marked "emergency hull painting robot starting panel". The rest of the panels are still black, but it looks like the robot was expecting to start on a white panel, not a black one.

// Based on the Space Law Space Brochure that the Space Police attached to one of your windows, a valid registration identifier is always eight capital letters. After starting the robot on a single white panel instead, what registration identifier does it paint on your hull?

function robotPaint (part, codeStr) {

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
  function runIntcode (code) {

    function calculateOperand (n, mode) {                                       // use this helper function to calculate operand based on operand # and mode #
      if (mode === 1) return +clone[i + n];
      const offset = mode === 0 ? 0 : relativeBase;
      const searchIdx = +clone[i + n] + offset;
      if (n === 3) return searchIdx;                                            // operand3 always refers to the write location, so we only need to return that index
      if (clone[searchIdx] === undefined) clone[searchIdx] = numParser(0);      // if the search index is out of bounds of current clone state, first set that value to 0
      return +clone[searchIdx];
    }

    const clone = [...code];

    // SPECIAL INITIALIZATIONS FOR THIS PROBLEM
    const panels = part === 1 ? {} : {'0,0': 1};                                // this will track the movement of the robot. part 1 starts the robot on a black panel, while part 2 starts it on white
    const output = [];                                                          // in this problem, output will temporarily store values until it has 2, and then it will process and empty
    const xVectors = [0, 1, 0, -1];                                             // represents 1 unit of movement while robot is facing UP, RIGHT, DOWN, or LEFT
    const yVectors = [1, 0, -1, 0];                                             // represents 1 unit of movement while robot is facing UP, RIGHT, DOWN, or LEFT
    let currentDir = 0;                                                         // defaults UP, will be incremented/decremented and % 4 to get appropriate vector
    let x = 0;
    let y = 0;
    let lowestX = 0;                                                            // for part 2
    let highestX = 0;                                                           // for part 2
    let lowestY = 0;                                                            // for part 2
    let highestY = 0;                                                           // for part 2

    let i = 0;
    let relativeBase = 0;
    while (i < clone.length) {                                                  // we use a while loop because the increment varies depending on a lot of things
      const opcode = clone[i].slice(-2);
      const mode1 = +clone[i].substr(-3, 1);
      const mode2 = +clone[i].substr(-4, 1);
      const mode3 = +clone[i].substr(-5, 1);
      const operand1 = calculateOperand(1, mode1);
      const operand2 = calculateOperand(2, mode2);
      const operand3 = calculateOperand(3, mode3);                              // NOTE: unlike operands 1-2 which could be either an index or absolute value, 3 is ALWAYS an index

      if (opcode === '01') {
        clone[operand3] = numParser(operand1 + operand2);
        i += 4;
      } else if (opcode === '02') {
        clone[operand3] = numParser(operand1 * operand2);
        i += 4;
      } else if (opcode === '03') {
        const offset = mode1 === 0 ? 0 : relativeBase;
        const searchIdx = +clone[i + 1] + offset;
        if (clone[searchIdx] === undefined) clone[searchIdx] = numParser(0);    // if the search index is out of bounds of current clone state, first set that value to 0
        const input = `${x},${y}` in panels ? panels[`${x},${y}`] : 0;          // read the color at that panel if we have painted it before; else, it must be 0 (black)
        clone[searchIdx] = numParser(input);
        i += 2;
      } else if (opcode === '04') {
        output.push(operand1);
        if (output.length === 1) {                                              // first output value represents the color to paint that panel
          panels[`${x},${y}`] = operand1;
        } else {                                                                // second output value represents a turn. the robot also moves forward one panel. also, clear the output
          currentDir += operand1 ? 1 : -1;                                      // if operand1, then it's 1, and that's a right turn (so increment currentDir). else, it's 0, and that's a left turn (decrement)
          x += xVectors[(currentDir % 4 + 4) % 4];                              // move robot (currentDir could be negative, so % 4 would be negative. if you add 4 and then % 4 again, it will be in bounds!)
          y += yVectors[(currentDir % 4 + 4) % 4];                              // move robot (currentDir could be negative, so % 4 would be negative. if you add 4 and then % 4 again, it will be in bounds!)
          lowestX = Math.min(lowestX, x);                                       // for part 2
          highestX = Math.max(highestX, x);                                     // for part 2
          lowestY = Math.min(lowestY, y);                                       // for part 2
          highestY = Math.max(highestY, y);                                     // for part 2
          output.length = 0;                                                    // this clears the array! another way to do it is `output.splice(0, output.length)`
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
        if (part === 1) {
          return Object.keys(panels).length;                                    // the number of painted panels will match the number of keys in the panels object
        } else {
          const h = highestY - lowestY + 1;
          const w = highestX - lowestX + 1;
          const img = Array.from({length: h}, () => Array.from({length: w}, () => 0));
          for (const coord in panels) {
            const [x, y] = coord.split(',').map(s => +s);
            const row = highestY - y;                                           // since matrix rows are flipped relative to y axis, measure y relative to highestY
            const col = x - lowestX;                                            // measure x relative to lowestX
            img[row][col] = panels[coord];
          }
          console.log('\n' + 'Image from Part 2 (white as foreground):' + '\n');
          img.forEach(row => console.log(row.map(n => n ? 'XX' : '  ').join(' ')));
          console.log('\n' + 'Image from Part 2 (black as foreground):' + '\n');
          img.forEach(row => console.log(row.map(n => n ? '  ' : 'XX').join(' ')));
          console.log('');
          return;
        }
      } else {
        throw 'ERROR! unrecognized opcode';   // this makes sure that the opcode belongs to one of the above cases. this error should never happen
      }
    }
    throw 'ERROR! i is out of bounds';        // if the while loop terminates prematurely (apart from opcode 99). this error should never happen
  }

  // INGEST INPUT DATA (THE PROGRAM)
  const code = codeStr.split(',').map(str => numParser(str));

  return runIntcode(code);
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = robotPaint;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const actualInput = `3,8,1005,8,324,1106,0,11,0,0,0,104,1,104,0,3,8,1002,8,-1,10,1001,10,1,10,4,10,1008,8,0,10,4,10,1001,8,0,29,3,8,1002,8,-1,10,101,1,10,10,4,10,108,0,8,10,4,10,101,0,8,50,1,1106,9,10,1,102,15,10,2,1003,3,10,1,3,19,10,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,0,10,4,10,1001,8,0,89,1,1105,9,10,2,1103,1,10,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,1,10,4,10,1001,8,0,119,1006,0,26,1,109,7,10,3,8,1002,8,-1,10,1001,10,1,10,4,10,108,1,8,10,4,10,1002,8,1,147,1006,0,75,1,1005,17,10,3,8,102,-1,8,10,101,1,10,10,4,10,108,0,8,10,4,10,102,1,8,176,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,1,10,4,10,102,1,8,199,3,8,102,-1,8,10,1001,10,1,10,4,10,108,1,8,10,4,10,102,1,8,220,2,103,10,10,1,1,0,10,1,102,17,10,3,8,1002,8,-1,10,101,1,10,10,4,10,108,1,8,10,4,10,101,0,8,254,2,1001,10,10,1006,0,12,1,3,6,10,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,0,10,4,10,102,1,8,288,2,1106,9,10,2,1009,6,10,2,1101,18,10,2,103,8,10,101,1,9,9,1007,9,1045,10,1005,10,15,99,109,646,104,0,104,1,21101,838211318676,0,1,21102,341,1,0,1106,0,445,21101,0,838211051932,1,21101,0,352,0,1106,0,445,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,21101,0,21704576195,1,21101,0,399,0,1106,0,445,21101,0,179356830951,1,21101,410,0,0,1105,1,445,3,10,104,0,104,0,3,10,104,0,104,0,21102,837897052948,1,1,21102,1,433,0,1106,0,445,21102,709052085092,1,1,21102,1,444,0,1105,1,445,99,109,2,21201,-1,0,1,21101,0,40,2,21102,476,1,3,21102,466,1,0,1105,1,509,109,-2,2105,1,0,0,1,0,0,1,109,2,3,10,204,-1,1001,471,472,487,4,0,1001,471,1,471,108,4,471,10,1006,10,503,1102,1,0,471,109,-2,2106,0,0,0,109,4,2102,1,-1,508,1207,-3,0,10,1006,10,526,21101,0,0,-3,21201,-3,0,1,21201,-2,0,2,21101,0,1,3,21101,545,0,0,1105,1,550,109,-4,2105,1,0,109,5,1207,-3,1,10,1006,10,573,2207,-4,-2,10,1006,10,573,21201,-4,0,-4,1105,1,641,22102,1,-4,1,21201,-3,-1,2,21202,-2,2,3,21101,592,0,0,1105,1,550,21201,1,0,-4,21102,1,1,-1,2207,-4,-2,10,1006,10,611,21101,0,0,-1,22202,-2,-1,-2,2107,0,-3,10,1006,10,633,21202,-1,1,1,21101,633,0,0,106,0,508,21202,-2,-1,-2,22201,-4,-2,-4,109,-5,2105,1,0`;

// Test case 1
input = {
  part: 1,
  codeStr: actualInput,
};
expected = 2478;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 2,
  codeStr: actualInput,
};
expected = undefined;                                             // there is no expected return! we just want to print out the image and decode it! the message is HCZRUGAZ
test(func, input, expected, testNum, lowestTest, highestTest);