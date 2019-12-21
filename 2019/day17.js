// --- Day 17: Set and Forget ---

// PART 1:

// An early warning system detects an incoming solar flare and automatically activates the ship's electromagnetic shield. Unfortunately, this has cut off the Wi-Fi for many small robots that, unaware of the impending danger, are now trapped on exterior scaffolding on the unsafe side of the shield. To rescue them, you'll have to act quickly!

// The only tools at your disposal are some wired cameras and a small vacuum robot currently asleep at its charging station. The video quality is poor, but the vacuum robot has a needlessly bright LED that makes it easy to spot no matter where it is.

// An Intcode program, the Aft Scaffolding Control and Information Interface (ASCII, your puzzle input), provides access to the cameras and the vacuum robot. Currently, because the vacuum robot is asleep, you can only access the cameras.

// Running the ASCII program on your Intcode computer will provide the current view of the scaffolds. This is output, purely coincidentally, as ASCII code: 35 means #, 46 means ., 10 starts a new line of output below the current one, and so on. (Within a line, characters are drawn left-to-right.)

// In the camera output, # represents a scaffold and . represents open space. The vacuum robot is visible as ^, v, <, or > depending on whether it is facing up, down, left, or right respectively. When drawn like this, the vacuum robot is always on a scaffold; if the vacuum robot ever walks off of a scaffold and begins tumbling through space uncontrollably, it will instead be visible as X.

// In general, the scaffold forms a path, but it sometimes loops back onto itself. For example, suppose you can see the following view from the cameras:

// ..#..........
// ..#..........
// #######...###
// #.#...#...#.#
// #############
// ..#...#...#..
// ..#####...^..

// Here, the vacuum robot, ^ is facing up and sitting at one end of the scaffold near the bottom-right of the image. The scaffold continues up, loops across itself several times, and ends at the top-left of the image.

// The first step is to calibrate the cameras by getting the alignment parameters of some well-defined points. Locate all scaffold intersections; for each, its alignment parameter is the distance between its left edge and the left edge of the view multiplied by the distance between its top edge and the top edge of the view. Here, the intersections from the above image are marked O:

// ..#..........
// ..#..........
// ##O####...###
// #.#...#...#.#
// ##O###O###O##
// ..#...#...#..
// ..#####...^..

// For these intersections:

// The top-left intersection is 2 units from the left of the image and 2 units from the top of the image, so its alignment parameter is 2 * 2 = 4.
// The bottom-left intersection is 2 units from the left and 4 units from the top, so its alignment parameter is 2 * 4 = 8.
// The bottom-middle intersection is 6 from the left and 4 from the top, so its alignment parameter is 24.
// The bottom-right intersection's alignment parameter is 40.
// To calibrate the cameras, you need the sum of the alignment parameters. In the above example, this is 76.

// Run your ASCII program. What is the sum of the alignment parameters for the scaffold intersections?

// PART 2:

// Now for the tricky part: notifying all the other robots about the solar flare. The vacuum robot can do this automatically if it gets into range of a robot. However, you can't see the other robots on the camera, so you need to be thorough instead: you need to make the vacuum robot visit every part of the scaffold at least once.

// The vacuum robot normally wanders randomly, but there isn't time for that today. Instead, you can override its movement logic with new rules.

// Force the vacuum robot to wake up by changing the value in your ASCII program at address 0 from 1 to 2. When you do this, you will be automatically prompted for the new movement rules that the vacuum robot should use. The ASCII program will use input instructions to receive them, but they need to be provided as ASCII code; end each line of logic with a single newline, ASCII code 10.

// First, you will be prompted for the main movement routine. The main routine may only call the movement functions: A, B, or C. Supply the movement functions to use as ASCII text, separating them with commas (,, ASCII code 44), and ending the list with a newline (ASCII code 10). For example, to call A twice, then alternate between B and C three times, provide the string A,A,B,C,B,C,B,C and then a newline.

// Then, you will be prompted for each movement function. Movement functions may use L to turn left, R to turn right, or a number to move forward that many units. Movement functions may not call other movement functions. Again, separate the actions with commas and end the list with a newline. For example, to move forward 10 units, turn left, move forward 8 units, turn right, and finally move forward 6 units, provide the string 10,L,8,R,6 and then a newline.

// Finally, you will be asked whether you want to see a continuous video feed; provide either y or n and a newline. Enabling the continuous video feed can help you see what's going on, but it also requires a significant amount of processing power, and may even cause your Intcode computer to overheat.

// Due to the limited amount of memory in the vacuum robot, the ASCII definitions of the main routine and the movement functions may each contain at most 20 characters, not counting the newline.

// For example, consider the following camera feed:

// #######...#####
// #.....#...#...#
// #.....#...#...#
// ......#...#...#
// ......#...###.#
// ......#.....#.#
// ^########...#.#
// ......#.#...#.#
// ......#########
// ........#...#..
// ....#########..
// ....#...#......
// ....#...#......
// ....#...#......
// ....#####......

// In order for the vacuum robot to visit every part of the scaffold at least once, one path it could take is:

// R,8,R,8,R,4,R,4,R,8,L,6,L,2,R,4,R,4,R,8,R,8,R,8,L,6,L,2
// Without the memory limit, you could just supply this whole string to function A and have the main routine call A once. However, you'll need to split it into smaller parts.

// One approach is:

// Main routine: A,B,C,B,A,C
// (ASCII input: 65, 44, 66, 44, 67, 44, 66, 44, 65, 44, 67, 10)
// Function A:   R,8,R,8
// (ASCII input: 82, 44, 56, 44, 82, 44, 56, 10)
// Function B:   R,4,R,4,R,8
// (ASCII input: 82, 44, 52, 44, 82, 44, 52, 44, 82, 44, 56, 10)
// Function C:   L,6,L,2
// (ASCII input: 76, 44, 54, 44, 76, 44, 50, 10)

// Visually, this would break the desired path into the following parts:

// A,        B,            C,        B,            A,        C
// R,8,R,8,  R,4,R,4,R,8,  L,6,L,2,  R,4,R,4,R,8,  R,8,R,8,  L,6,L,2

// CCCCCCA...BBBBB
// C.....A...B...B
// C.....A...B...B
// ......A...B...B
// ......A...CCC.B
// ......A.....C.B
// ^AAAAAAAA...C.B
// ......A.A...C.B
// ......AAAAAA#AB
// ........A...C..
// ....BBBB#BBBB..
// ....B...A......
// ....B...A......
// ....B...A......
// ....BBBBA......

// Of course, the scaffolding outside your ship is much more complex.

// As the vacuum robot finds other robots and notifies them of the impending solar flare, it also can't help but leave them squeaky clean, collecting any space dust it finds. Once it finishes the programmed set of movements, assuming it hasn't drifted off into space, the cleaning robot will return to its docking station and report the amount of space dust it collected as a large, non-ASCII value in a single output instruction.

// After visiting every part of the scaffold at least once, how much dust does the vacuum robot report it has collected?

function robot (part, codeStr) {

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
  function runIntcode (code) {

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
    const img = [];                                                                 // this will be an array of arrays. imgRow array will be individual rows of the image
    const imgRow = [];                                                              // whenever a new line is reached, this array gets cloned and pushed into img, and then this gets cleared
    const inputStr =                                                                // THIS IS WHERE WE INPUT THE PATH WE WANT THE DROID TO GO. I HAD TO FIGURE OUT THIS SOLUTION BY HAND!
      'A,B,A,B,C,C,B,A,B,C' + '\n'
      + 'L,10,R,10,L,10,L,10' + '\n'
      + 'R,10,R,12,L,12' + '\n'
      + 'R,12,L,12,R,6' + '\n'
      + 'n' + '\n'                                                                  // make this 'y' if you want to see a new printout after every step of the droid, else 'n' to show only the start and end
    const input = inputStr.split('').map(char => char.charCodeAt(0));               // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
    let inputIdx = 0;

    if (part === 2) clone[0] = numParser(2);                                        // in part 2, we have to set memory address 0 to 2 to force the robot to wake up

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
        if (part === 1) throw 'REACHED OPCODE 03 IN PART 1!';                       // this should never happen: part 1 should not use opcode 03
        if (input[inputIdx] === undefined) throw 'UNDEFINED INPUT';                 // this should never happen: we should not run out of input before hitting opcode 99
        const offset = mode1 === 0 ? 0 : relativeBase;
        const searchIdx = +clone[i + 1] + offset;
        if (clone[searchIdx] === undefined) clone[searchIdx] = numParser(0);        // if the search index is out of bounds of current clone state, first set that value to 0
        clone[searchIdx] = numParser(input[inputIdx]);                              // just grab from input at current inputIdx
        inputIdx++;                                                                 // increment current inputIdx
        i += 2;
      } else if (opcode === '04') {
        if (operand1 === 10) {                                                      // special case: ASCII code 10 is a new line, so we handle that by pushing current row to image
          img.push([...imgRow]);
          imgRow.length = 0;
        } else if (operand1 <= 127) {                                               // i just chose 127 because it seems like most characters on ASCII tables are from 0-127 (this program will output letters)
          imgRow.push(String.fromCharCode(operand1));
        } else {                                                                    // if the output is above 127 then it is the 'dust' picked up along the way by the droid (i.e. the answer)
          output.push(operand1);
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
        const h = img.length;
        const w = img[0].length;
        let sumOfAlignmentParams = 1;

        const showImage = 1;                                                        // OPTIONAL: set this to 1 or 0 depending on whether you want to see the map printed out
        if (showImage) console.log('');
        img.forEach((row, r) => {
          row.forEach((pixel, c) => {
            if (                                                                    // FIND ALL WALKWAY INTERSECTIONS
              pixel === '#'                                                         // if a particular pixel is an unoccupied walkway,
              && r > 0 && r < h - 1 && c > 0 && c < w - 1                           // is not on the border of the image,
              && img[r - 1][c] === '#'                                              // and has 4 neighboring walkways...
              && img[r + 1][c] === '#'
              && img[r][c - 1] === '#'
              && img[r][c + 1] === '#'
            ) {
              sumOfAlignmentParams += r * c;                                        // calculate alignment parameter (problem defines this as product of coordinates) and add to total
              img[r][c] = 'O';                                                      // and, optionally, change its value from '#' to 'O' for visual effect
            }
          });
          if (showImage) console.log(row.join(''));
        });

        // PART 1 VS PART 2
        return part === 1 ? sumOfAlignmentParams : output[0];

      } else {
        throw 'ERROR! unrecognized opcode';                                         // this makes sure that the opcode belongs to one of the above cases. this error should never happen
      }
    }
    throw 'ERROR! i is out of bounds';                                              // if the while loop terminates prematurely (apart from opcode 99 or 04). this error should never happen
  }

  // INGEST INPUT DATA (THE PROGRAM)
  const code = codeStr.split(',').map(str => numParser(str));

  return runIntcode(code);
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = robot;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const actualInput = `1,330,331,332,109,6690,1102,1,1182,16,1102,1,1505,24,102,1,0,570,1006,570,36,1002,571,1,0,1001,570,-1,570,1001,24,1,24,1106,0,18,1008,571,0,571,1001,16,1,16,1008,16,1505,570,1006,570,14,21102,58,1,0,1105,1,786,1006,332,62,99,21101,333,0,1,21102,73,1,0,1105,1,579,1102,0,1,572,1101,0,0,573,3,574,101,1,573,573,1007,574,65,570,1005,570,151,107,67,574,570,1005,570,151,1001,574,-64,574,1002,574,-1,574,1001,572,1,572,1007,572,11,570,1006,570,165,101,1182,572,127,1002,574,1,0,3,574,101,1,573,573,1008,574,10,570,1005,570,189,1008,574,44,570,1006,570,158,1106,0,81,21101,340,0,1,1106,0,177,21102,1,477,1,1106,0,177,21101,0,514,1,21102,1,176,0,1106,0,579,99,21101,0,184,0,1105,1,579,4,574,104,10,99,1007,573,22,570,1006,570,165,1001,572,0,1182,21101,375,0,1,21102,211,1,0,1106,0,579,21101,1182,11,1,21101,222,0,0,1105,1,979,21101,388,0,1,21101,0,233,0,1105,1,579,21101,1182,22,1,21102,1,244,0,1105,1,979,21101,401,0,1,21101,255,0,0,1105,1,579,21101,1182,33,1,21101,0,266,0,1105,1,979,21101,0,414,1,21101,277,0,0,1106,0,579,3,575,1008,575,89,570,1008,575,121,575,1,575,570,575,3,574,1008,574,10,570,1006,570,291,104,10,21101,1182,0,1,21102,1,313,0,1106,0,622,1005,575,327,1101,0,1,575,21101,327,0,0,1106,0,786,4,438,99,0,1,1,6,77,97,105,110,58,10,33,10,69,120,112,101,99,116,101,100,32,102,117,110,99,116,105,111,110,32,110,97,109,101,32,98,117,116,32,103,111,116,58,32,0,12,70,117,110,99,116,105,111,110,32,65,58,10,12,70,117,110,99,116,105,111,110,32,66,58,10,12,70,117,110,99,116,105,111,110,32,67,58,10,23,67,111,110,116,105,110,117,111,117,115,32,118,105,100,101,111,32,102,101,101,100,63,10,0,37,10,69,120,112,101,99,116,101,100,32,82,44,32,76,44,32,111,114,32,100,105,115,116,97,110,99,101,32,98,117,116,32,103,111,116,58,32,36,10,69,120,112,101,99,116,101,100,32,99,111,109,109,97,32,111,114,32,110,101,119,108,105,110,101,32,98,117,116,32,103,111,116,58,32,43,10,68,101,102,105,110,105,116,105,111,110,115,32,109,97,121,32,98,101,32,97,116,32,109,111,115,116,32,50,48,32,99,104,97,114,97,99,116,101,114,115,33,10,94,62,118,60,0,1,0,-1,-1,0,1,0,0,0,0,0,0,1,84,18,0,109,4,2101,0,-3,587,20102,1,0,-1,22101,1,-3,-3,21102,1,0,-2,2208,-2,-1,570,1005,570,617,2201,-3,-2,609,4,0,21201,-2,1,-2,1106,0,597,109,-4,2106,0,0,109,5,2102,1,-4,629,21001,0,0,-2,22101,1,-4,-4,21102,1,0,-3,2208,-3,-2,570,1005,570,781,2201,-4,-3,652,21001,0,0,-1,1208,-1,-4,570,1005,570,709,1208,-1,-5,570,1005,570,734,1207,-1,0,570,1005,570,759,1206,-1,774,1001,578,562,684,1,0,576,576,1001,578,566,692,1,0,577,577,21101,702,0,0,1106,0,786,21201,-1,-1,-1,1106,0,676,1001,578,1,578,1008,578,4,570,1006,570,724,1001,578,-4,578,21101,0,731,0,1106,0,786,1105,1,774,1001,578,-1,578,1008,578,-1,570,1006,570,749,1001,578,4,578,21102,756,1,0,1106,0,786,1106,0,774,21202,-1,-11,1,22101,1182,1,1,21102,1,774,0,1106,0,622,21201,-3,1,-3,1105,1,640,109,-5,2105,1,0,109,7,1005,575,802,20101,0,576,-6,21002,577,1,-5,1106,0,814,21102,0,1,-1,21102,0,1,-5,21102,1,0,-6,20208,-6,576,-2,208,-5,577,570,22002,570,-2,-2,21202,-5,85,-3,22201,-6,-3,-3,22101,1505,-3,-3,1201,-3,0,843,1005,0,863,21202,-2,42,-4,22101,46,-4,-4,1206,-2,924,21101,0,1,-1,1105,1,924,1205,-2,873,21101,0,35,-4,1105,1,924,2101,0,-3,878,1008,0,1,570,1006,570,916,1001,374,1,374,2102,1,-3,895,1102,1,2,0,2101,0,-3,902,1001,438,0,438,2202,-6,-5,570,1,570,374,570,1,570,438,438,1001,578,558,922,20101,0,0,-4,1006,575,959,204,-4,22101,1,-6,-6,1208,-6,85,570,1006,570,814,104,10,22101,1,-5,-5,1208,-5,61,570,1006,570,810,104,10,1206,-1,974,99,1206,-1,974,1101,0,1,575,21102,973,1,0,1105,1,786,99,109,-7,2106,0,0,109,6,21101,0,0,-4,21102,0,1,-3,203,-2,22101,1,-3,-3,21208,-2,82,-1,1205,-1,1030,21208,-2,76,-1,1205,-1,1037,21207,-2,48,-1,1205,-1,1124,22107,57,-2,-1,1205,-1,1124,21201,-2,-48,-2,1106,0,1041,21101,0,-4,-2,1105,1,1041,21101,0,-5,-2,21201,-4,1,-4,21207,-4,11,-1,1206,-1,1138,2201,-5,-4,1059,2101,0,-2,0,203,-2,22101,1,-3,-3,21207,-2,48,-1,1205,-1,1107,22107,57,-2,-1,1205,-1,1107,21201,-2,-48,-2,2201,-5,-4,1090,20102,10,0,-1,22201,-2,-1,-2,2201,-5,-4,1103,1202,-2,1,0,1105,1,1060,21208,-2,10,-1,1205,-1,1162,21208,-2,44,-1,1206,-1,1131,1106,0,989,21101,0,439,1,1106,0,1150,21102,477,1,1,1106,0,1150,21101,0,514,1,21101,1149,0,0,1106,0,579,99,21101,0,1157,0,1105,1,579,204,-2,104,10,99,21207,-3,22,-1,1206,-1,1138,1202,-5,1,1176,1202,-4,1,0,109,-6,2106,0,0,46,7,78,1,84,1,84,1,84,1,84,1,80,13,72,1,3,1,7,1,72,1,3,1,7,1,9,11,52,1,3,1,7,1,9,1,9,1,52,1,3,1,7,1,9,1,9,1,52,1,3,1,7,1,9,1,9,1,44,13,7,1,9,1,9,1,44,1,7,1,11,1,9,1,9,1,44,1,7,1,11,1,9,1,9,1,44,1,7,1,11,1,9,1,9,1,42,11,11,1,9,1,9,1,42,1,1,1,19,1,9,1,9,1,42,1,1,1,19,11,9,11,32,1,1,1,82,1,1,1,82,1,1,1,82,1,1,1,82,1,1,1,72,13,72,1,9,1,74,1,9,11,64,1,19,1,64,1,19,1,64,1,19,1,64,1,19,1,64,1,19,1,64,1,19,1,64,1,19,1,64,11,9,1,74,1,9,1,72,13,72,1,1,1,82,1,1,1,82,1,1,1,82,1,1,1,82,1,1,1,52,11,19,1,1,1,52,1,9,1,19,1,1,1,52,1,9,1,11,11,52,1,9,1,11,1,7,1,54,1,9,1,11,1,7,1,54,1,9,1,11,1,7,1,54,13,5,13,64,1,1,1,5,1,3,1,72,1,1,1,5,1,3,1,72,1,1,1,5,1,3,1,72,1,1,1,5,1,3,1,72,1,1,1,5,1,3,1,72,13,74,1,5,1,78,1,5,1,78,1,5,1,78,1,5,1,78,1,5,1,78,7,66`;

// Test case 1
input = {
  part: 1,
  codeStr: actualInput,
};
expected = 7720;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 2,
  codeStr: actualInput,
};
expected = 1681189;
test(func, input, expected, testNum, lowestTest, highestTest);