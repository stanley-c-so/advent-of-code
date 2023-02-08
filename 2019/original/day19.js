// --- Day 19: Tractor Beam ---

// PART 1:

// Unsure of the state of Santa's ship, you borrowed the tractor beam technology from Triton. Time to test it out.

// When you're safely away from anything else, you activate the tractor beam, but nothing happens. It's hard to tell whether it's working if there's nothing to use it on. Fortunately, your ship's drone system can be configured to deploy a drone to specific coordinates and then check whether it's being pulled. There's even an Intcode program (your puzzle input) that gives you access to the drone system.

// The program uses two input instructions to request the X and Y position to which the drone should be deployed. Negative numbers are invalid and will confuse the drone; all numbers should be zero or positive.

// Then, the program will output whether the drone is stationary (0) or being pulled by something (1). For example, the coordinate X=0, Y=0 is directly in front of the tractor beam emitter, so the drone control program will always report 1 at that location.

// To better understand the tractor beam, it is important to get a good picture of the beam itself. For example, suppose you scan the 10x10 grid of points closest to the emitter:

//        X
//   0->      9
//  0#.........
//  |.#........
//  v..##......
//   ...###....
//   ....###...
// Y .....####.
//   ......####
//   ......####
//   .......###
//  9........##

// In this example, the number of points affected by the tractor beam in the 10x10 area closest to the emitter is 27.

// However, you'll need to scan a larger area to understand the shape of the beam. How many points are affected by the tractor beam in the 50x50 area closest to the emitter? (For each of X and Y, this will be 0 through 49.)

// PART 2:

// You aren't sure how large Santa's ship is. You aren't even sure if you'll need to use this thing on Santa's ship, but it doesn't hurt to be prepared. You figure Santa's ship might fit in a 100x100 square.

// The beam gets wider as it travels away from the emitter; you'll need to be a minimum distance away to fit a square of that size into the beam fully. (Don't rotate the square; it should be aligned to the same axes as the drone grid.)

// For example, suppose you have the following tractor beam readings:

// #.......................................
// .#......................................
// ..##....................................
// ...###..................................
// ....###.................................
// .....####...............................
// ......#####.............................
// ......######............................
// .......#######..........................
// ........########........................
// .........#########......................
// ..........#########.....................
// ...........##########...................
// ...........############.................
// ............############................
// .............#############..............
// ..............##############............
// ...............###############..........
// ................###############.........
// ................#################.......
// .................########OOOOOOOOOO.....
// ..................#######OOOOOOOOOO#....
// ...................######OOOOOOOOOO###..
// ....................#####OOOOOOOOOO#####
// .....................####OOOOOOOOOO#####
// .....................####OOOOOOOOOO#####
// ......................###OOOOOOOOOO#####
// .......................##OOOOOOOOOO#####
// ........................#OOOOOOOOOO#####
// .........................OOOOOOOOOO#####
// ..........................##############
// ..........................##############
// ...........................#############
// ............................############
// .............................###########

// In this example, the 10x10 square closest to the emitter that fits entirely within the tractor beam has been marked O. Within it, the point closest to the emitter (the only highlighted O) is at X=25, Y=20.

// Find the 100x100 square closest to the emitter that fits entirely within the tractor beam; within that square, find the point closest to the emitter. What value do you get if you take that point's X coordinate, multiply it by 10000, then add the point's Y coordinate? (In the example above, this would be 250020.)

function tractorBeam (part, codeStr, col, row, width, height) {                     // col and row are for part 1, and width and height are for part 2

// UTILITY FUNCTION: takes a str (or num) and standardizes its format so that the number portion is n digits (default 5) and it keeps its negative sign if applicable
  const numParser = (str, n = 5) => {
    if (typeof str === 'number') str = str.toString();
    const negative = str[0] === '-';
    let rtn = negative ? str.slice(1) : str;
    rtn = rtn.length < n ? '0'.repeat(n - rtn.length) + rtn : rtn;
    if (negative) rtn = '-' + rtn;
    return rtn;
  }

  // HELPER FUNCTION: RUNS THROUGH INPUT INTCODE
  function runIntcode (code, x, y) {

    function calculateOperand (n, mode) {                                           // use this helper function to calculate operand based on operand # and mode #
      if (mode === 1) return +clone[i + n];
      const offset = mode === 0 ? 0 : relativeBase;
      const searchIdx = +clone[i + n] + offset;
      if (n === 3) return searchIdx;                                                // operand3 always refers to the write location, so we only need to return that index
      if (clone[searchIdx] === undefined) clone[searchIdx] = numParser(0);          // if the search index is out of bounds of current clone state, first set that value to 0
      return +clone[searchIdx];
    }

    const clone = [...code];
    const output = [];

    // SPECIAL INITIALIZATIONS FOR THIS PROBLEM
    let inputCount = 0;                                                             // the first input will be x, and then the next will be y. then it will exit

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
        clone[searchIdx] = numParser(inputCount ? x : y);                           // the first input will be x, and then the next will be y. then it will exit
        inputCount++;                                                               // this bumps inputCount up from 0 to 1 after the first input
        i += 2;
      } else if (opcode === '04') {
        output.push(operand1);
        i += 2;
      } else if (opcode === '05') {
        i = operand1 ? operand2 : i + 3;
      } else if (opcode === '06') {``
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
        return output[0];
      } else {
        throw 'ERROR! unrecognized opcode';                                         // this makes sure that the opcode belongs to one of the above cases. this error should never happen
      }
    }
    throw 'ERROR! i is out of bounds';                                              // if the while loop terminates prematurely (apart from opcode 99 or 04). this error should never happen
  }

  // INGEST INPUT DATA (THE PROGRAM)
  const code = codeStr.split(',').map(str => numParser(str));

  // PART 1 VS PART 2
  if (part === 1) {

    let affectedPoints = 0;
    const img = [];
    for (let y = 0; y < row; y++) {
      const newRow = [];
      for (let x = 0; x < col; x++) {
        const result = runIntcode(code, x, y);
        affectedPoints += result;
        newRow.push(result);
      }
      img.push(newRow);
    }
  
    // OPTIONAL: DRAW THE RESULT
    console.log('');
    img.forEach(r => console.log(
      r.map(pixel => pixel ? '#' : '.').join(' ')
    ));
    console.log('');
  
    return affectedPoints;
    
  } else {

    let currentY = height;                                                          // track the bottom left corner of the width x height rectangle. no need to start at any row less than `height`
    let currentX = 0;
    while (true) {
      while (!runIntcode(code, currentX, currentY)) currentX++;                     // to find potential bottom left corner, keep incrementing currentX until it is within the affected area
      if (runIntcode(code, currentX + width - 1, currentY - height + 1)) {          // scan top right corner to see if affected. if so, you know that currentX and currentY point to the lower left corner!
        const answerX = currentX;
        const answerY = currentY - height + 1;                                      // don't forget that the answer requires the top left corner

        // OPTIONAL: DRAW THE RESULT
        const img = [];
        const buffer = 2;                                                           // buffer is the amount of extra space around the rectangle that you want the program to draw
        for (let y = answerY - buffer; y < answerY + height + buffer; y++) {
          const newRow = [];
          for (let x = answerX - buffer; x < answerX + width + buffer; x++) {
            newRow.push(
              (
                x >= answerX 
                && x <= answerX + width - 1
                && y >= answerY&& y <= answerY + height - 1
              )
              ? 2
              : runIntcode(code, x, y)
            );
          }
          img.push(newRow);
        }
        console.log('');
        img.forEach(r => console.log(
          r.map(pixel => pixel ? pixel === 1 ? '#' : 'O' : '.').join(' ')
        ));
        console.log('');

        return answerY * 10000 + answerX;                                           // NOTE: NOT SURE IF ERROR IN PROBLEM OR IN MY CODE (are X and Y switched?)
                                                                                    // the problem asks for X * 10000 + Y, but the 'correct' answer is my Y * 10000 + my X
      }
      currentY++;
    }

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = tractorBeam;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const actualInput = `109,424,203,1,21102,11,1,0,1105,1,282,21101,0,18,0,1105,1,259,2102,1,1,221,203,1,21102,1,31,0,1105,1,282,21102,1,38,0,1105,1,259,21002,23,1,2,21201,1,0,3,21101,0,1,1,21102,57,1,0,1105,1,303,2102,1,1,222,21002,221,1,3,21001,221,0,2,21102,1,259,1,21102,80,1,0,1105,1,225,21102,59,1,2,21102,1,91,0,1105,1,303,1202,1,1,223,21001,222,0,4,21102,259,1,3,21102,1,225,2,21101,225,0,1,21101,118,0,0,1105,1,225,21002,222,1,3,21102,1,112,2,21101,0,133,0,1105,1,303,21202,1,-1,1,22001,223,1,1,21101,148,0,0,1105,1,259,1201,1,0,223,20102,1,221,4,21002,222,1,3,21102,1,18,2,1001,132,-2,224,1002,224,2,224,1001,224,3,224,1002,132,-1,132,1,224,132,224,21001,224,1,1,21101,0,195,0,106,0,108,20207,1,223,2,21001,23,0,1,21102,1,-1,3,21102,1,214,0,1105,1,303,22101,1,1,1,204,1,99,0,0,0,0,109,5,2101,0,-4,249,22101,0,-3,1,21202,-2,1,2,21201,-1,0,3,21101,250,0,0,1105,1,225,22101,0,1,-4,109,-5,2105,1,0,109,3,22107,0,-2,-1,21202,-1,2,-1,21201,-1,-1,-1,22202,-1,-2,-2,109,-3,2106,0,0,109,3,21207,-2,0,-1,1206,-1,294,104,0,99,21202,-2,1,-2,109,-3,2105,1,0,109,5,22207,-3,-4,-1,1206,-1,346,22201,-4,-3,-4,21202,-3,-1,-1,22201,-4,-1,2,21202,2,-1,-1,22201,-4,-1,1,22102,1,-2,3,21101,343,0,0,1106,0,303,1105,1,415,22207,-2,-3,-1,1206,-1,387,22201,-3,-2,-3,21202,-2,-1,-1,22201,-3,-1,3,21202,3,-1,-1,22201,-3,-1,2,22102,1,-4,1,21101,384,0,0,1105,1,303,1105,1,415,21202,-4,-1,-4,22201,-4,-3,-4,22202,-3,-2,-2,22202,-2,-4,-4,22202,-3,-2,-3,21202,-4,-1,-2,22201,-3,-2,1,22102,1,1,-4,109,-5,2106,0,0`;

// Test case 1
input = {
  part: 1,
  codeStr: actualInput,
  col: 50,
  row: 50,
};
expected = 199;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 2,
  codeStr: actualInput,
  col: null,
  row: null,
  width: 100,
  height: 100,
};
expected = 10180726;
test(func, input, expected, testNum, lowestTest, highestTest);