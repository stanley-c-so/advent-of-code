/*

--- Day 20: A Regular Map ---

While you were learning about instruction pointers, the Elves made considerable progress. When you look up, you discover that the North Pole base construction project has completely surrounded you.

The area you are in is made up entirely of rooms and doors. The rooms are arranged in a grid, and rooms only connect to adjacent rooms when a door is present between them.

For example, drawing rooms as ., walls as #, doors as | or -, your current position as X, and where north is up, the area you're in might look like this:

#####
#.|.#
#-###
#.|X#
#####

You get the attention of a passing construction Elf and ask for a map. "I don't have time to draw out a map of this place - it's huge. Instead, I can give you directions to every room in the facility!" He writes down some directions on a piece of parchment and runs off. In the example above, the instructions might have been ^WNE$, a regular expression or "regex" (your puzzle input).

The regex matches routes (like WNE for "west, north, east") that will take you from your current room through various doors in the facility. In aggregate, the routes will take you through every door in the facility at least once; mapping out all of these routes will let you build a proper map and find your way around.

^ and $ are at the beginning and end of your regex; these just mean that the regex doesn't match anything outside the routes it describes. (Specifically, ^ matches the start of the route, and $ matches the end of it.) These characters will not appear elsewhere in the regex.

The rest of the regex matches various sequences of the characters N (north), S (south), E (east), and W (west). In the example above, ^WNE$ matches only one route, WNE, which means you can move west, then north, then east from your current position. Sequences of letters like this always match that exact route in the same order.

Sometimes, the route can branch. A branch is given by a list of options separated by pipes (|) and wrapped in parentheses. So, ^N(E|W)N$ contains a branch: after going north, you must choose to go either east or west before finishing your route by going north again. By tracing out the possible routes after branching, you can determine where the doors are and, therefore, where the rooms are in the facility.

For example, consider this regex: ^ENWWW(NEEE|SSE(EE|N))$

This regex begins with ENWWW, which means that from your current position, all routes must begin by moving east, north, and then west three times, in that order. After this, there is a branch. Before you consider the branch, this is what you know about the map so far, with doors you aren't sure about marked with a ?:

#?#?#?#?#
?.|.|.|.?
#?#?#?#-#
    ?X|.?
    #?#?#

After this point, there is (NEEE|SSE(EE|N)). This gives you exactly two options: NEEE and SSE(EE|N). By following NEEE, the map now looks like this:

#?#?#?#?#
?.|.|.|.?
#-#?#?#?#
?.|.|.|.?
#?#?#?#-#
    ?X|.?
    #?#?#

Now, only SSE(EE|N) remains. Because it is in the same parenthesized group as NEEE, it starts from the same room NEEE started in. It states that starting from that point, there exist doors which will allow you to move south twice, then east; this ends up at another branch. After that, you can either move east twice or north once. This information fills in the rest of the doors:

#?#?#?#?#
?.|.|.|.?
#-#?#?#?#
?.|.|.|.?
#-#?#?#-#
?.?.?X|.?
#-#-#?#?#
?.|.|.|.?
#?#?#?#?#

Once you've followed all possible routes, you know the remaining unknown parts are all walls, producing a finished map of the facility:

#########
#.|.|.|.#
#-#######
#.|.|.|.#
#-#####-#
#.#.#X|.#
#-#-#####
#.|.|.|.#
#########

Sometimes, a list of options can have an empty option, like (NEWS|WNSE|). This means that routes at this point could effectively skip the options in parentheses and move on immediately. For example, consider this regex and the corresponding map:

^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$

###########
#.|.#.|.#.#
#-###-#-#-#
#.|.|.#.#.#
#-#####-#-#
#.#.#X|.#.#
#-#-#####-#
#.#.|.|.|.#
#-###-###-#
#.|.|.#.|.#
###########

This regex has one main route which, at three locations, can optionally include additional detours and be valid: (NEWS|), (WNSE|), and (SWEN|). Regardless of which option is taken, the route continues from the position it is left at after taking those steps. So, for example, this regex matches all of the following routes (and more that aren't listed here):

ENNWSWWSSSEENEENNN
ENNWSWWNEWSSSSEENEENNN
ENNWSWWNEWSSSSEENEESWENNNN
ENNWSWWSSSEENWNSEEENNN

By following the various routes the regex matches, a full map of all of the doors and rooms in the facility can be assembled.

To get a sense for the size of this facility, you'd like to determine which room is furthest from you: specifically, you would like to find the room for which the shortest path to that room would require passing through the most doors.

In the first example (^WNE$), this would be the north-east corner 3 doors away.
In the second example (^ENWWW(NEEE|SSE(EE|N))$), this would be the south-east corner 10 doors away.
In the third example (^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$), this would be the north-east corner 18 doors away.

Here are a few more examples:

Regex: ^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$
Furthest room requires passing 23 doors

#############
#.|.|.|.|.|.#
#-#####-###-#
#.#.|.#.#.#.#
#-#-###-#-#-#
#.#.#.|.#.|.#
#-#-#-#####-#
#.#.#.#X|.#.#
#-#-#-###-#-#
#.|.#.|.#.#.#
###-#-###-#-#
#.|.#.|.|.#.#
#############

Regex: ^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$
Furthest room requires passing 31 doors

###############
#.|.|.|.#.|.|.#
#-###-###-#-#-#
#.|.#.|.|.#.#.#
#-#########-#-#
#.#.|.|.|.|.#.#
#-#-#########-#
#.#.#.|X#.|.#.#
###-#-###-#-#-#
#.|.#.#.|.#.|.#
#-###-#####-###
#.|.#.|.|.#.#.#
#-#-#####-#-#-#
#.#.|.|.|.#.|.#
###############

What is the largest number of doors you would be required to pass through to reach a room? That is, find the room for which the shortest path from your starting location to that room would require passing through the most doors; what is the fewest doors you can pass through to reach it?


--- Part Two ---

Okay, so the facility is big.

How many rooms have a shortest path from your current location that pass through at least 1000 doors?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function exploreGridWithPredeterminedBFS (part, inputStr, DEBUG = false) {
  
  // CONSTANTS
  const [ REGEX_START, REGEX_END ] = [ '^', '$' ];
  const [ N, E, W, S ] = [ 'N', 'E', 'W', 'S' ];
  const [ OPEN, CLOSE ] = [ '(', ')' ];
  const OR = '|';
  const DELTAS = {
    [N]: [ -1, 0 ],
    [E]: [ 0, +1 ],
    [W]: [ 0, -1 ],
    [S]: [ +1, 0 ],
  };

  // UTILITY FUNCTIONS
  const serialize = (y, x) => `${y},${x}`;
  const serializeDoor = (y1, x1, y2, x2) => serialize(y1, x1)
                                              + '|'
                                              + serialize(y2, x2);          // e.g. '0,0|1,0'

  // DATA STRUCTURES
  const FLOORS = {};                                                        // track EARLIEST move count at which we reached this floor
  const DOORS = new Set();                                                  // sort two coords within coords pair by reading order, OR just check both

  // INIT
  let [ y, x ] = [ 0, 0 ];
  let moves = 0;
  FLOORS[serialize(y, x)] = moves;
  let maxMoves = 0;
  let doors = 0;
  let roomsWithPathContaining1000DoorsOrMore = 0;
  let minRow = 0;                                                           // only if we want to display the map
  let maxRow = 0;                                                           // only if we want to display the map
  let minCol = 0;                                                           // only if we want to display the map
  let maxCol = 0;                                                           // only if we want to display the map

  // PARSE INPUT DATA AND ANALYZE
  const STACK = [];                                                         // saves states that we should return to:
                                                                            // [ serializedCoord, moves, doors ]

  for (const c of inputStr) {
    if ([ REGEX_START, REGEX_END ].includes(c)) {
      continue;
    }

    else if ([ N, E, W, S ].includes(c)) {
      const [ dy, dx ] = DELTAS[c];
      const [ newY, newX ] = [ y + dy, x + dx ];
      DOORS.add(serializeDoor(y, x, newY, newX));
      [ y, x ] = [ newY, newX ];
      ++moves;
      const serial = serialize(y, x);
      if (!(serial in FLOORS)) {                                            // important wrapper: otherwise we can land on same spot again
        FLOORS[serial] = moves;
        maxMoves = Math.max(maxMoves, moves);
        ++doors;
        if (doors >= 1000) ++roomsWithPathContaining1000DoorsOrMore;
      }

      minRow = Math.min(minRow, y);                                         // only if we want to display the map
      maxRow = Math.max(maxRow, y);                                         // only if we want to display the map
      minCol = Math.min(minCol, x);                                         // only if we want to display the map
      maxCol = Math.max(maxCol, x);                                         // only if we want to display the map
    }

    else if (c === OPEN) {
      STACK.push([ serialize(y, x), moves, doors ]);
    }

    else if (c === OR) {
      if (!STACK.length) throw `ERROR: STACK SHOULD NOT BE EMPTY`;
      const [ serial, m, d ] = STACK.at(-1);
      [ y, x ] = serial.split(',').map(n => +n);
      moves = m;
      doors = d;
    }
    
    else if (c === CLOSE) {
      if (!STACK.length) throw `ERROR: STACK SHOULD NOT BE EMPTY`;
      const [ serial, m, d ] = STACK.pop();
      [ y, x ] = serial.split(',').map(n => +n);
      moves = m;
      doors = d;
    }

    else throw `ERROR: UNRECOGNIZED CHARACTER ${c}`;
  }

  if (DISPLAY_EXTRA_INFO && DEBUG) {
    const trueHeight = maxRow - minRow + 1;
    const trueWidth = maxCol - minCol + 1;
    
    const H = trueHeight * 2 + 1;
    const W = trueWidth * 2 + 1;

    const [ WALL, FLOOR, CONNECTION_HORIZONTAL, CONNECTION_VERTICAL, START ]
      = [ '#', ' ', '|', '-', 'X' ];
    const GRID = Array.from({length: H}, () => Array(W).fill(WALL));

    for (const serial in FLOORS) {
      const [ y, x ] = serial.split(',').map(n => +n);
      GRID[ (y - minCol) * 2 + 1 ][ (x - minRow) * 2 + 1 ] = FLOOR;
    }

    GRID[ (0 - minCol) * 2 + 1 ][ (0 - minRow) * 2 + 1 ] = START;

    for (const connection of DOORS) {
      const [ [ y1, x1 ], [ y2, x2 ] ] = connection.split('|')
                                                    .map(coord => coord.split(',')
                                                                        .map(n => +n));

      // horizontal connection - draw a vertical door
      if (y1 === y2) {
        const smallerX = Math.min(x1, x2);
        GRID[ (y1 - minCol) * 2 + 1 ][ (smallerX - minRow) * 2 + 2 ] = CONNECTION_HORIZONTAL;
      }

      // vertical connection - draw a horizontal door
      else if (x1 === x2) {
        const smallerY = Math.min(y1, y2);
        GRID[ (smallerY - minCol) * 2 + 2 ][ (x1 - minRow) * 2 + 1 ] = CONNECTION_VERTICAL;
      }

      else throw `ERROR: THE COORDINATES SHOULD MATCH ALONG ONE OF THE AXIS VALUES`;
    }

    for (const row of GRID) console.log(row.join(' '));
  }

  return part === 1 ? maxMoves
                    : roomsWithPathContaining1000DoorsOrMore;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = exploreGridWithPredeterminedBFS;
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
`^WNE$`
);

const sampleInput2 = parseSampleInput(
`^ENWWW(NEEE|SSE(EE|N))$`
);

const sampleInput3 = parseSampleInput(
`^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$`
);

const sampleInput4 = parseSampleInput(
`^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$`
);

const sampleInput5 = parseSampleInput(
`^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 3;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 10;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 18;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = 23;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: sampleInput5,
  DEBUG: true,
};
expected = 31;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 3971;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 8578;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);