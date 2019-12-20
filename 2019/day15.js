// --- Day 15: Oxygen System ---

// PART 1:

// Out here in deep space, many things can go wrong. Fortunately, many of those things have indicator lights. Unfortunately, one of those lights is lit: the oxygen system for part of the ship has failed!

// According to the readouts, the oxygen system must have failed days ago after a rupture in oxygen tank two; that section of the ship was automatically sealed once oxygen levels went dangerously low. A single remotely-operated repair droid is your only option for fixing the oxygen system.

// The Elves' care package included an Intcode program (your puzzle input) that you can use to remotely control the repair droid. By running that program, you can direct the repair droid to the oxygen system and fix the problem.

// The remote control program executes the following steps in a loop forever:

// Accept a movement command via an input instruction.
// Send the movement command to the repair droid.
// Wait for the repair droid to finish the movement operation.
// Report on the status of the repair droid via an output instruction.
// Only four movement commands are understood: north (1), south (2), west (3), and east (4). Any other command is invalid. The movements differ in direction, but not in distance: in a long enough east-west hallway, a series of commands like 4,4,4,4,3,3,3,3 would leave the repair droid back where it started.

// The repair droid can reply with any of the following status codes:

// 0: The repair droid hit a wall. Its position has not changed.
// 1: The repair droid has moved one step in the requested direction.
// 2: The repair droid has moved one step in the requested direction; its new position is the location of the oxygen system.
// You don't know anything about the area around the repair droid, but you can figure it out by watching the status codes.

// For example, we can draw the area using D for the droid, # for walls, . for locations the droid can traverse, and empty space for unexplored locations. Then, the initial state looks like this:

      
      
//    D  
      
      

// To make the droid go north, send it 1. If it replies with 0, you know that location is a wall and that the droid didn't move:

      
//    #  
//    D  
      

      
// To move east, send 4; a reply of 1 means the movement was successful:

      
//    #  
//    .D 
      
      

// Then, perhaps attempts to move north (1), south (2), and east (4) are all met with replies of 0:

      
//    ## 
//    .D#
//     # 
      

// Now, you know the repair droid is in a dead end. Backtrack with 3 (which you already know will get a reply of 1 because you already know that location is open):

      
//    ## 
//    D.#
//     # 
      

// Then, perhaps west (3) gets a reply of 0, south (2) gets a reply of 1, south again (2) gets a reply of 0, and then west (3) gets a reply of 2:

      
//    ## 
//   #..#
//   D.# 
//    #  

// Now, because of the reply of 2, you know you've found the oxygen system! In this example, it was only 2 moves away from the repair droid's starting position.

// What is the fewest number of movement commands required to move the repair droid from its starting position to the location of the oxygen system?

// PART 2:

//

function findTarget (part, codeStr) {

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
  function runIntcode (code, directionIdx = 0) {

    function calculateOperand (n, mode) {                                           // use this helper function to calculate operand based on operand # and mode #
      if (mode === 1) return +clone[i + n];
      const offset = mode === 0 ? 0 : relativeBase;
      const searchIdx = +clone[i + n] + offset;
      if (n === 3) return searchIdx;                                                // operand3 always refers to the write location, so we only need to return that index
      if (clone[searchIdx] === undefined) clone[searchIdx] = numParser(0);          // if the search index is out of bounds of current clone state, first set that value to 0
      return +clone[searchIdx];
    }

    // THIS FUNCTION IS COMPLETELY OPTIONAL
    function drawBoard (tiles, highestX, lowestX, highestY, lowestY, currentX, currentY) {
      const h = highestY - lowestY + 1;
      const w = highestX - lowestX + 1;
      const img = Array.from({length: h}, () => Array.from({length: w}, () => 0));
      for (const coord in tiles) {
        const [x, y] = coord.split(',').map(s => +s);
        const row = highestY - y;                                                   // since matrix rows are flipped relative to y axis, measure y relative to highestY
        const col = x - lowestX;                                                    // measure x relative to lowestX
        img[row][col] = tiles[coord];
      }
      img[highestY - currentY][currentX - lowestX] = 'D';                           // overwrite droid's current position with 'D'
      console.log('');
      img.forEach(row => console.log(row.map(pixel => pixel ? pixel : ' ').join(' ')));
      console.log('');
    }

    const clone = [...code];
    const output = [];

    // SPECIAL INITIALIZATIONS FOR THIS PROBLEM
    const direction = [1, 4, 2, 3];                                                 // north, east, south, west
    let mainDirection = true;                                                       // if true, your most recent attempt to move in your main direction was successful
    let hitFirstWall = false;                                                       // droid should run straight until it hits its first wall, after which it will hug the wall
    const xVector = [0, 1, 0, -1];
    const yVector = [1, 0, -1, 0];
    let x = 0;                                                                      // default coordinates will by 0, 0
    let y = 0;
    const positions = new Set(['0,0,0,1']);                                         // x, y, direction, mainDirection (boolean)

    // THIS BLOCK OF CODE IS COMPLETELY OPTIONAL
    const tiles = {'0,0': 's'};                                                     // start position uniquely has 's' as its pixel
    let lowestX = Infinity;
    let highestX = -Infinity;
    let lowestY = Infinity;
    let highestY = -Infinity;
    const dir = {0: 'NORTH', 1: 'EAST', 2: 'SOUTH', 3: 'WEST'};

    let count = 0;

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

      count++;
      if (count === 10000) throw `REACHED ${count} ITERATIONS`

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
        clone[searchIdx] = numParser(
          direction[(directionIdx + !mainDirection) % 4]                            // if currently going in main direction, go by directionIdx; else, choose 1 index higher
        );
        console.log(`count ${count}: next output will be ${dir[(directionIdx + !mainDirection) % 4]}. mainDirection is ${mainDirection}`)
        i += 2;
      } else if (opcode === '04') {
        if (operand1 === 0) {                                                       // hit a wall. you must turn
          
          // OPTIONAL
          tiles[
            `${x + xVector[(directionIdx + !mainDirection) % 4]}`
            + ','
            + `${y + yVector[(directionIdx + !mainDirection) % 4]}`
          ] = '#';
          console.log(`count ${count}: wall found to the ${dir[(directionIdx + !mainDirection) % 4]} at ${x + xVector[(directionIdx + !mainDirection) % 4]}, ${y + yVector[(directionIdx + !mainDirection) % 4]}`)

          hitFirstWall = true;
          if (mainDirection) {                                                        // you were going in your main direction, but now you cannot continue
            mainDirection = false;                                                      // set mainDirection to false - on your next input you will attempt the next direction (a turn)
          } else {                                                                    // you cannot go in your main or the next direction
            directionIdx++;                                                             // increase directionIdx to cycle to the next mainDirection
          }
        } else if (operand1 === 1) {                                                // you successfully moved where you wanted

          const youMovedInThisDir = dir[(directionIdx + !mainDirection) % 4];
          
          x += xVector[(directionIdx + !mainDirection) % 4];                        // update x position (if mainDirection, we want directionIdx + 0; else, directionIdx + 1)
          y += yVector[(directionIdx + !mainDirection) % 4];                        // update y position (if mainDirection, we want directionIdx + 0; else, directionIdx + 1)
          if (mainDirection && hitFirstWall) directionIdx--;                        // if you successfully moved in mainDirection, decrease directionIdx to cycle to the previous mainDirection
          mainDirection = true;                                                     // after any successful movement, resume trying to go in mainDirection

          // OPTIONAL
          if (!(`${x},${y}` in tiles)) tiles[`${x},${y}`] = '.';
          lowestX = Math.min(lowestX, x - 1);                                       // give a 1 space buffer around the edge of the drawable area
          highestX = Math.max(highestX, x + 1);
          lowestY = Math.min(lowestY, y - 1);
          highestY = Math.max(highestY, y + 1);

          console.log(`count ${count}: position after moving ${youMovedInThisDir}: ${x}, ${y}`)

        } else if (operand1 === 2) {
          console.log(`FOUND THE OXYGEN SYSTEM AT ${x}, ${y}`);
          return;
        } else {
          throw `INVALID OUTPUT: ${operand1} AT i = ${i}`;
        }

        const state = `${x},${y},${directionIdx % 4},${+mainDirection}`;
        if (positions.has(state)) throw `repeated state ${state} at i = ${i}`
        positions.add(state);

        i += 2;

        // OPTIONAL
        drawBoard(tiles, highestX, lowestX, highestY, lowestY, x, y);

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
        console.log(`REACHED OPCODE 99`);
        return;
      } else {
        throw 'ERROR! unrecognized opcode';                                         // this makes sure that the opcode belongs to one of the above cases. this error should never happen
      }
    }
    throw 'ERROR! i is out of bounds';                                              // if the while loop terminates prematurely (apart from opcode 99 or 04). this error should never happen
  }

  // INGEST INPUT DATA (THE PROGRAM)
  const code = codeStr.split(',').map(str => numParser(str));

  return runIntcode(code);

  // PART 1 VS PART 2
  // if (part === 1) {


    
  // } else {

  

  // }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = findTarget;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const actualInput = `3,1033,1008,1033,1,1032,1005,1032,31,1008,1033,2,1032,1005,1032,58,1008,1033,3,1032,1005,1032,81,1008,1033,4,1032,1005,1032,104,99,1001,1034,0,1039,1001,1036,0,1041,1001,1035,-1,1040,1008,1038,0,1043,102,-1,1043,1032,1,1037,1032,1042,1105,1,124,102,1,1034,1039,1001,1036,0,1041,1001,1035,1,1040,1008,1038,0,1043,1,1037,1038,1042,1106,0,124,1001,1034,-1,1039,1008,1036,0,1041,101,0,1035,1040,1001,1038,0,1043,102,1,1037,1042,1106,0,124,1001,1034,1,1039,1008,1036,0,1041,1001,1035,0,1040,1001,1038,0,1043,1002,1037,1,1042,1006,1039,217,1006,1040,217,1008,1039,40,1032,1005,1032,217,1008,1040,40,1032,1005,1032,217,1008,1039,39,1032,1006,1032,165,1008,1040,39,1032,1006,1032,165,1101,0,2,1044,1105,1,224,2,1041,1043,1032,1006,1032,179,1102,1,1,1044,1105,1,224,1,1041,1043,1032,1006,1032,217,1,1042,1043,1032,1001,1032,-1,1032,1002,1032,39,1032,1,1032,1039,1032,101,-1,1032,1032,101,252,1032,211,1007,0,69,1044,1106,0,224,1102,0,1,1044,1105,1,224,1006,1044,247,1001,1039,0,1034,101,0,1040,1035,1001,1041,0,1036,101,0,1043,1038,102,1,1042,1037,4,1044,1105,1,0,14,64,25,87,47,95,19,65,33,21,99,74,49,51,99,41,76,12,91,19,39,77,68,1,94,19,16,66,72,56,21,81,96,48,35,31,95,41,65,21,84,74,61,27,81,17,77,75,63,80,38,74,91,51,77,30,51,50,93,81,57,78,84,5,32,90,83,21,87,54,92,64,55,81,96,55,89,45,58,37,31,88,51,70,15,93,13,68,76,58,96,34,22,93,27,84,13,27,95,57,88,14,72,96,50,13,54,94,14,92,58,30,6,73,78,56,41,71,86,30,81,2,80,58,90,19,97,43,41,13,96,95,89,19,79,99,77,46,53,23,84,74,62,51,86,40,88,23,75,83,97,95,5,5,86,81,18,45,94,99,79,83,6,82,60,60,97,89,74,24,3,81,85,41,39,89,45,90,80,8,45,92,11,96,99,88,58,75,31,44,5,92,82,38,22,9,57,5,77,65,5,74,87,81,10,46,87,12,52,76,22,25,74,76,61,88,92,14,96,44,80,20,23,24,76,72,64,78,97,87,9,2,91,10,32,78,70,65,70,85,51,1,6,84,83,84,62,70,40,31,96,73,85,12,85,5,53,98,58,78,24,80,70,7,77,60,71,63,13,94,8,85,7,91,47,35,89,18,44,70,71,98,68,99,14,84,82,3,79,38,68,70,44,34,96,35,87,29,95,48,85,30,96,58,16,74,2,78,96,82,20,14,41,22,88,74,13,86,21,28,93,60,92,72,50,43,95,29,97,97,74,23,87,30,62,89,3,90,77,36,42,70,76,18,96,46,93,68,94,25,95,52,83,95,36,39,87,32,23,88,33,96,31,90,15,96,81,45,44,77,64,38,98,75,71,47,99,88,29,85,30,83,48,93,5,28,86,21,16,93,17,99,68,13,87,71,97,56,84,43,26,70,21,66,82,46,96,84,37,85,90,79,33,57,87,73,40,56,45,87,37,91,28,61,89,87,89,16,46,11,77,89,5,3,71,68,61,91,76,16,85,16,83,50,41,31,71,87,20,60,80,48,24,80,7,85,98,62,91,75,46,11,80,36,26,41,24,92,98,53,73,66,73,75,31,23,88,28,89,84,25,78,58,91,77,55,64,70,46,99,71,38,84,15,50,97,85,15,36,77,25,88,70,81,78,58,54,4,34,92,97,13,4,92,80,71,52,16,93,29,99,2,87,37,99,20,73,59,10,44,91,9,2,72,94,1,76,47,79,91,1,18,86,6,10,86,35,81,20,54,98,87,48,65,85,56,68,85,71,55,82,80,19,25,70,87,31,90,87,80,53,51,90,42,87,86,1,91,49,82,21,79,88,54,28,1,78,54,81,47,12,73,79,5,22,89,71,93,63,56,93,33,83,47,75,36,49,81,10,80,99,49,26,51,78,39,70,79,49,95,16,44,97,8,19,60,95,88,17,78,55,77,60,87,25,53,72,26,42,78,7,72,86,51,31,90,40,61,75,61,85,99,4,90,22,37,95,15,64,93,70,48,7,50,81,92,46,15,73,54,81,91,63,34,93,91,58,82,78,89,55,29,96,80,78,3,82,38,57,85,51,83,79,78,88,53,7,78,71,48,92,43,61,96,11,29,77,91,53,1,20,92,56,86,34,20,70,67,91,14,79,92,31,21,82,75,52,89,37,7,10,85,17,66,86,73,8,31,95,49,78,74,6,77,98,71,49,76,90,78,9,81,79,89,63,92,36,79,53,80,20,77,94,96,1,87,45,77,94,80,3,92,96,97,9,73,35,77,66,98,0,0,21,21,1,10,1,0,0,0,0,0,0`;

// Test case 1
input = {
  part: 1,
  codeStr: actualInput,
};
expected = null;
test(func, input, expected, testNum, lowestTest, highestTest);