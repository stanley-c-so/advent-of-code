// --- Day 12: Rain Risk ---

// Your ferry made decent progress toward the island, but the storm came in faster than anyone expected. The ferry needs to take evasive actions!

// Unfortunately, the ship's navigation computer seems to be malfunctioning; rather than giving a route directly to safety, it produced extremely circuitous instructions. When the captain uses the PA system to ask if anyone can help, you quickly volunteer.

// The navigation instructions (your puzzle input) consists of a sequence of single-character actions paired with integer input values. After staring at them for a few minutes, you work out what they probably mean:

// Action N means to move north by the given value.
// Action S means to move south by the given value.
// Action E means to move east by the given value.
// Action W means to move west by the given value.
// Action L means to turn left the given number of degrees.
// Action R means to turn right the given number of degrees.
// Action F means to move forward by the given value in the direction the ship is currently facing.

// The ship starts by facing east. Only the L and R actions change the direction the ship is facing. (That is, if the ship is facing east and the next instruction is N10, the ship would move north 10 units, but would still move east if the following action were F.)

// For example:

// F10
// N3
// F7
// R90
// F11

// These instructions would be handled as follows:

// F10 would move the ship 10 units east (because the ship starts by facing east) to east 10, north 0.
// N3 would move the ship 3 units north to east 10, north 3.
// F7 would move the ship another 7 units east (because the ship is still facing east) to east 17, north 3.
// R90 would cause the ship to turn right by 90 degrees and face south; it remains at east 17, north 3.
// F11 would move the ship 11 units south to east 17, south 8.
// At the end of these instructions, the ship's Manhattan distance (sum of the absolute values of its east/west position and its north/south position) from its starting position is 17 + 8 = 25.

// Figure out where the navigation instructions lead. What is the Manhattan distance between that location and the ship's starting position?

// --- Part Two ---

// Before you can give the destination to the captain, you realize that the actual action meanings were printed on the back of the instructions the whole time.

// Almost all of the actions indicate how to move a waypoint which is relative to the ship's position:

// Action N means to move the waypoint north by the given value.
// Action S means to move the waypoint south by the given value.
// Action E means to move the waypoint east by the given value.
// Action W means to move the waypoint west by the given value.
// Action L means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
// Action R means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
// Action F means to move forward to the waypoint a number of times equal to the given value.

// The waypoint starts 10 units east and 1 unit north relative to the ship. The waypoint is relative to the ship; that is, if the ship moves, the waypoint moves with it.

// For example, using the same instructions as above:

// F10 moves the ship to the waypoint 10 times (a total of 100 units east and 10 units north), leaving the ship at east 100, north 10. The waypoint stays 10 units east and 1 unit north of the ship.
// N3 moves the waypoint 3 units north to 10 units east and 4 units north of the ship. The ship remains at east 100, north 10.
// F7 moves the ship to the waypoint 7 times (a total of 70 units east and 28 units north), leaving the ship at east 170, north 38. The waypoint stays 10 units east and 4 units north of the ship.
// R90 rotates the waypoint around the ship clockwise 90 degrees, moving it to 4 units east and 10 units south of the ship. The ship remains at east 170, north 38.
// F11 moves the ship to the waypoint 11 times (a total of 44 units east and 110 units south), leaving the ship at east 214, south 72. The waypoint stays 4 units east and 10 units south of the ship.

// After these operations, the ship's Manhattan distance from its starting position is 214 + 72 = 286.

// Figure out where the navigation instructions actually lead. What is the Manhattan distance between that location and the ship's starting position?

function manhattanDistance (part, inputStr) {
  const inputArr = inputStr.split('\n');

  let x = 0;                                // origin x
  let y = 0;                                // origin y
  let wx = 10;                              // waypoint x (part 2 only - starts 10 units east of origin)
  let wy = 1;                               // waypoint y (part 2 only - starts 1 unit north of origin)
  let dir = 0;
  const delta = [                           // takes the form of [dx, dy]
    [1, 0],                                 // East
    [0, -1],                                // South
    [-1, 0],                                // West
    [0, 1],                                 // North
  ];

  for (const instruction of inputArr) {
    const code = instruction[0];
    const num = +instruction.slice(1);

    if (part === 1) {                       // PART 1: MOVE THE SHIP ONLY

      if (code === "N") y += num;           // NESW: translate the ship
      if (code === "E") x += num;
      if (code === "S") y -= num;
      if (code === "W") x -= num;
      if (code === "L") {                   // L: rotate the ship counterclockwise
        dir -= (num / 90) % 4;              // we assume num is always a multiple of 90 deg
        if (dir < 0) dir += 4;              // handle out of bounds
      }
      if (code === "R") {                   // R: rotate the ship clockwise
        dir += (num / 90) % 4;              // we assume num is always a multiple of 90 deg
        if (dir > 3) dir -= 4;              // handle out of bounds
      }
      if (code === "F") {                   // F: translate based on deltas specified by current direction multiplied by num
        x += delta[dir][0] * num;
        y += delta[dir][1] * num;
      }

    } else {                                // PART 2: MOVE THE WAYPOINT (AND THE SHIP, IF CODE IS F)

      if (code === "N") wy += num;          // NESW: translate the waypoint
      if (code === "E") wx += num;
      if (code === "S") wy -= num;
      if (code === "W") wx -= num;
      if (code === "L") {                   // L: rotate the waypoint about the ship counterclockwise
        let turns = (num / 90) % 4;
        while (turns--) {
          const dx = wx - x;
          const dy = wy - y;
          wx = x - dy;
          wy = y + dx;
        }
      }
      if (code === "R") {                   // R: rotate the waypoint about the ship clockwise
        let turns = (num / 90) % 4;
        while (turns--) {
          const dx = wx - x;
          const dy = wy - y;
          wx = x + dy;
          wy = y - dx;
        }
      }
      if (code === "F") {                   // F: translate based on relative position of waypoint multiplied by num
        const dx = wx - x;
        const dy = wy - y;
        x += dx * num;
        y += dy * num;
        wx = x + dx;                        // reset the waypoint x
        wy = y + dy;                        // reset the waypoint y
      }

    }
  }

  return Math.abs(x) + Math.abs(y);         // return manhattan distance
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = manhattanDistance;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `F10
N3
F7
R90
F11`;

const actualInput = `E5
R90
E5
L90
F80
L90
E3
N5
F10
S2
W1
F98
L180
W1
F55
L90
F73
N1
E3
S2
E5
R90
E2
S4
F34
R90
W2
L90
W4
F92
R90
W4
N5
R90
F73
S4
W3
N4
R90
S3
W3
N4
F30
S5
E4
R90
W5
R90
S3
E5
L180
E2
S4
E4
S2
W3
F19
N2
F53
R90
W4
R90
N3
W5
R90
W4
F68
W4
N5
F26
W4
F11
L90
E5
L90
F67
W3
S3
F15
E4
S4
E5
S1
F11
R90
E3
F46
R90
F40
E3
R90
F35
R180
E3
S5
L90
E3
F63
E4
F56
N2
E1
R90
N3
F42
W2
S4
N3
R90
W2
R90
F45
N5
L90
F38
L90
N5
E4
R90
N2
R90
S4
R90
N3
F53
R90
F72
S5
E3
F98
L90
E3
F56
S2
F29
E2
W3
L180
S4
F31
S2
R90
N5
R270
F45
L90
F10
N5
R90
E5
F47
R90
S3
F98
R90
F85
E1
L90
S4
R180
N4
L90
W5
R90
E4
L90
F24
R90
N4
W3
F54
N3
F14
N1
F19
S3
S2
R90
N1
E4
F3
N3
R90
F4
S2
L90
N5
L90
W5
S2
L90
E4
F61
N2
W5
F84
R270
S1
E1
F18
S3
E4
F97
N2
R90
E5
F79
R180
F12
R180
F93
L180
N1
S5
E2
N5
E5
L180
S3
L90
F85
S4
R90
S2
W3
R90
F87
L90
F33
W2
F22
W3
W2
N4
F83
L90
S2
W5
S5
F99
E1
L180
F81
S2
L90
N3
E5
N3
L90
S5
F91
R270
F68
L90
N2
E3
N5
L90
S3
E1
L90
E2
N1
W4
F53
S4
F47
R90
S5
W2
F99
W4
R180
E4
R90
E3
N3
E3
F23
L90
N5
L90
F68
R180
S4
S2
F71
E2
F7
N4
W3
L180
F17
R90
N5
F70
W3
F82
L90
L90
S2
L90
F10
W1
N2
R90
W3
F48
L90
N5
W1
F42
S5
R180
F99
L90
F28
W4
R180
N2
W5
N3
F79
N5
W1
R90
F8
L180
S4
L90
S2
E2
F60
E5
L90
F93
S3
F17
E2
F6
N4
F80
L90
F98
S3
L90
S5
E1
N4
E2
F67
R90
E2
L90
W5
F32
W1
S2
L90
S4
W4
N1
F74
W3
R90
F24
N5
R90
F74
E5
L90
W4
R180
F51
W2
L180
F36
E5
E5
N4
F53
S2
F56
S5
S2
F31
W5
N5
L90
S1
E2
L90
N2
W4
F5
L90
S2
E5
F62
L90
E3
L90
F41
E5
F32
R90
E4
R90
N1
L90
N5
E5
R180
E1
N3
R90
W4
F86
F8
S1
R90
N4
L90
N4
W3
F39
R90
S4
E2
F59
E4
N1
F72
E1
N2
E4
F93
S2
F10
R180
F74
S1
S1
F67
R90
E5
F66
L90
F27
S2
R270
F11
E4
N3
F32
L180
S4
F92
L90
N1
E3
R180
F9
R90
F31
E5
L90
N2
F13
E2
L90
F52
W3
R180
E3
S3
R90
F67
N1
F75
L90
W5
F3
W3
R90
F76
L90
S4
E2
L90
W2
L90
R90
N1
F77
E2
L180
E4
L90
F65
N3
L180
F1
W2
N5
F97
S1
W2
L90
F81
R90
S4
F85
R180
F45
W3
N2
N5
W4
R90
N4
E3
N5
W4
F29
E5
R180
N1
R180
F17
E3
R90
W1
F62
N3
F87
R270
W5
S5
F42
W5
F72
R90
E3
F11
R90
F14
S3
R90
N4
E3
R90
W5
S4
E5
R270
F35
E3
W3
N1
R90
S1
W3
R180
F80
E2
F24
E1
R90
F23
S3
L90
W4
F37
L90
F55
S3
N4
N5
L90
N1
L90
F99
R90
N4
E1
R90
F21
N4
L180
F50
S4
W2
F43
R180
F7
S4
W1
E1
N4
E3
R180
F3
S1
F48
L180
F97
R90
F46
W2
F3
W4
N1
R180
N5
E4
R180
S5
F99
N5
E2
R90
S2
W5
N5
R90
F26
W3
N3
F25
E4
S2
F62
S5
F54
R90
F45
S4
F97
R90
W1
F68
N3
R90
F76
R90
N2
R180
N2
F42
L180
E5
L90
W4
N4
F39
N4
R180
W2
N1
F19
R90
W5
L90
N3
L90
F24
S2
R180
N5
E4
F92
N2
R90
F73
W3
S2
L180
F53
S5
W5
W4
L90
S3
L90
F49
R90
W4
N1
R90
N1
E1
R270
E1
F62
N1
E5
R90
F59
F56
R180
F25
L180
W3
L90
N3
E4
S2
S3
E4
L90
E4
N5
F81
S4
F54
S2
R90
S2
F4
W4
N1
F100
L90
S5
L180
F59
L90
F56
S1
F5
F79
R90
N5
W4
N5
W4
N3
R180
W5
R90
S5
F92
S4
E4
F17
N2
L90
S2
L90
F62
N1
F2
W2
N4
F40
R90
S2
L180
E5
S4
F100
W2
F27
W5
R90
S1
L90
E5
R90
W5
R90
R180
S3
E2
F75
N5
R180
F8
S5
F64`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 25;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 1565;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 286;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 78883;
test(func, input, expected, testNum, lowestTest, highestTest);