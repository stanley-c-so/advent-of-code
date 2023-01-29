/*

--- Day 13: Mine Cart Madness ---

A crop of this size requires significant logistics to transport produce, soil, fertilizer, and so on. The Elves are very busy pushing things around in carts on some kind of rudimentary system of tracks they've come up with.

Seeing as how cart-and-track systems don't appear in recorded history for another 1000 years, the Elves seem to be making this up as they go along. They haven't even figured out how to avoid collisions yet.

You map out the tracks (your puzzle input) and see where you can help.

Tracks consist of straight paths (| and -), curves (/ and \), and intersections (+). Curves connect exactly two perpendicular pieces of track; for example, this is a closed loop:

/----\
|    |
|    |
\----/

Intersections occur when two perpendicular paths cross. At an intersection, a cart is capable of turning left, turning right, or continuing straight. Here are two loops connected by two intersections:

/-----\
|     |
|  /--+--\
|  |  |  |
\--+--/  |
   |     |
   \-----/

Several carts are also on the tracks. Carts always face either up (^), down (v), left (<), or right (>). (On your initial map, the track under each cart is a straight path matching the direction the cart is facing.)

Each time a cart has the option to turn (by arriving at any intersection), it turns left the first time, goes straight the second time, turns right the third time, and then repeats those directions starting again with left the fourth time, straight the fifth time, and so on. This process is independent of the particular intersection at which the cart has arrived - that is, the cart has no per-intersection memory.

Carts all move at the same speed; they take turns moving a single step at a time. They do this based on their current location: carts on the top row move first (acting from left to right), then carts on the second row move (again from left to right), then carts on the third row, and so on. Once each cart has moved one step, the process repeats; each of these loops is called a tick.

For example, suppose there are two carts on a straight track:

|  |  |  |  |
v  |  |  |  |
|  v  v  |  |
|  |  |  v  X
|  |  ^  ^  |
^  ^  |  |  |
|  |  |  |  |

First, the top cart moves. It is facing down (v), so it moves down one square. Second, the bottom cart moves. It is facing up (^), so it moves up one square. Because all carts have moved, the first tick ends. Then, the process repeats, starting with the first cart. The first cart moves down, then the second cart moves up - right into the first cart, colliding with it! (The location of the crash is marked with an X.) This ends the second and last tick.

Here is a longer example:

/->-\        
|   |  /----\
| /-+--+-\  |
| | |  | v  |
\-+-/  \-+--/
  \------/   

/-->\        
|   |  /----\
| /-+--+-\  |
| | |  | |  |
\-+-/  \->--/
  \------/   

/---v        
|   |  /----\
| /-+--+-\  |
| | |  | |  |
\-+-/  \-+>-/
  \------/   

/---\        
|   v  /----\
| /-+--+-\  |
| | |  | |  |
\-+-/  \-+->/
  \------/   

/---\        
|   |  /----\
| /->--+-\  |
| | |  | |  |
\-+-/  \-+--^
  \------/   

/---\        
|   |  /----\
| /-+>-+-\  |
| | |  | |  ^
\-+-/  \-+--/
  \------/   

/---\        
|   |  /----\
| /-+->+-\  ^
| | |  | |  |
\-+-/  \-+--/
  \------/   

/---\        
|   |  /----<
| /-+-->-\  |
| | |  | |  |
\-+-/  \-+--/
  \------/   

/---\        
|   |  /---<\
| /-+--+>\  |
| | |  | |  |
\-+-/  \-+--/
  \------/   

/---\        
|   |  /--<-\
| /-+--+-v  |
| | |  | |  |
\-+-/  \-+--/
  \------/   

/---\        
|   |  /-<--\
| /-+--+-\  |
| | |  | v  |
\-+-/  \-+--/
  \------/   

/---\        
|   |  /<---\
| /-+--+-\  |
| | |  | |  |
\-+-/  \-<--/
  \------/   

/---\        
|   |  v----\
| /-+--+-\  |
| | |  | |  |
\-+-/  \<+--/
  \------/   

/---\        
|   |  /----\
| /-+--v-\  |
| | |  | |  |
\-+-/  ^-+--/
  \------/   

/---\        
|   |  /----\
| /-+--+-\  |
| | |  X |  |
\-+-/  \-+--/
  \------/   

After following their respective paths for a while, the carts eventually crash. To help prevent crashes, you'd like to know the location of the first crash. Locations are given in X,Y coordinates, where the furthest left column is X=0 and the furthest top row is Y=0:

           111
 0123456789012
0/---\        
1|   |  /----\
2| /-+--+-\  |
3| | |  X |  |
4\-+-/  \-+--/
5  \------/   

In this example, the location of the first crash is 7,3.


--- Part Two ---

There isn't much you can do to prevent crashes in this ridiculous system. However, by predicting the crashes, the Elves know where to be in advance and instantly remove the two crashing carts the moment any crash occurs.

They can proceed like this for a while, but eventually, they're going to run out of carts. It could be useful to figure out where the last cart that hasn't crashed will end up.

For example:

/>-<\  
|   |  
| /<+-\
| | | v
\>+</ |
  |   ^
  \<->/

/---\  
|   |  
| v-+-\
| | | |
\-+-/ |
  |   |
  ^---^

/---\  
|   |  
| /-+-\
| v | |
\-+-/ |
  ^   ^
  \---/

/---\  
|   |  
| /-+-\
| | | |
\-+-/ ^
  |   |
  \---/

After four very expensive crashes, a tick ends with only one cart remaining; its final location is 6,4.

What is the location of the last cart at the end of the first tick where it is the only cart left?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function cartCollisionsOnRailConfiguration (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // GRID CONSTANTS
  const GRID = [];
  const [ INTERSECTION, VERTICAL, HORIZONTAL, SLASH, BACKSLASH, UP, DOWN, LEFT, RIGHT ]
    = [ '+', '|', '-', '/', '\\', '^', 'v', '<', '>' ];

  // MOVEMENT RESOLUTION CONSTANTS
  const TYPES_ON_TURN = {
    [UP]: [ LEFT, UP, RIGHT ],
    [DOWN]: [ RIGHT, DOWN, LEFT ],
    [LEFT]: [ DOWN, LEFT, UP ],
    [RIGHT]: [ UP, RIGHT, DOWN ],
  };
  const TYPES_ON_CURVE = {
    [UP]: { [SLASH]: RIGHT, [BACKSLASH]: LEFT },
    [DOWN]: { [SLASH]: LEFT, [BACKSLASH]: RIGHT },
    [LEFT]: { [SLASH]: DOWN, [BACKSLASH]: UP },
    [RIGHT]: { [SLASH]: UP, [BACKSLASH]: DOWN },
  };
  const DELTAS = {
    [UP]: [ -1, 0 ],
    [DOWN]: [ +1, 0 ],
    [LEFT]: [ 0, -1 ],
    [RIGHT]: [ 0, +1 ],
  };

  // DATA STRUCTURES
  const CARTS = [];                                                             // this array does NOT get shuffled, so the index
                                                                                // of a given cart can be thought of as its ID

  const REMAINING_CART_INDICES = new Set();                                     // this set holds IDs of remaining carts

  // PARSE INPUT DATA
  for (let i = 0; i < inputArr.length; ++i) {
    const line = inputArr[i];

    // CONSTRUCT GRID OF RAIL CONFIGURATION
    const row = [];
    for (let j = 0; j < line.length; ++j) {
      const c = line[j];
      row.push( [UP, DOWN].includes(c)    ? VERTICAL :
                [LEFT, RIGHT].includes(c) ? HORIZONTAL :
                                            c);
      
      // DISCOVER CARTS
      if ([UP, DOWN, LEFT, RIGHT].includes(c)) {
        CARTS.push({ row: i, col: j, type: c, nextDir: 0 });                    // nextDir: 0 = left, 1 = straight, 2 = right
        REMAINING_CART_INDICES.add(CARTS.length - 1);
      }
    }
    GRID.push(row);
  }

  if (DISPLAY_EXTRA_INFO && DEBUG) {
    for (const row of GRID) console.log(row.join(''));
  }

  // ANALYZE
  const LIMIT = Number.MAX_SAFE_INTEGER;
  for (let t = 1; t <= LIMIT; ++t) {

    const REMAINING_CARTS = [ ...REMAINING_CART_INDICES ]                       // IMPORTANT: must sort cart indices in correct
                              .sort((a, b) => CARTS[a].row - CARTS[b].row       // move order (starting with row, and then
                                              || CARTS[a].col - CARTS[b].col);  // breaking ties with col)

    // PROCESS ALL REMAINING CARTS
    for (const c of REMAINING_CARTS) {
      const cart = CARTS[c];
      const terrain = GRID[cart.row][cart.col];

      // RESOLVE TURN IF NECESSARY, BASED ON CURRENT TERRAIN
      if (terrain === INTERSECTION) {                                           // CASE 1: INTERSECTION

        cart.type = TYPES_ON_TURN[cart.type][cart.nextDir];
        cart.nextDir = (cart.nextDir + 1) % 3;                                  // cycle between 0, 1, and 2

      }
      else if ([ SLASH, BACKSLASH ].includes(terrain)) {                        // CASE 2: CURVE

        cart.type = TYPES_ON_CURVE[cart.type][terrain];

      }
      else {}                                                                   // CASE 3: ALL ELSE - NO-OP

      // MOVE FORWARD
      const [ dy, dx ] = DELTAS[cart.type];
      cart.row += dy;
      cart.col += dx;

      // CHECK FOR COLLISION WITH OTHER CARTS
      for (const c2 of REMAINING_CARTS) {
        if (c === c2) continue;                                                 // cart cannot collide with itself
        const cart2 = CARTS[c2];
        if (cart2.row === cart.row && cart2.col === cart.col) {
          if (DISPLAY_EXTRA_INFO) {
            console.log(`COLLISION ON TURN ${t} AT row, col: ${
              cart.row}, ${cart.col}`);
          }
          
          if (part === 1) {                                                     // PART 1: RETURN LOCATION OF FIRST CRASH
            return `${cart.col},${cart.row}`;                                   // return as X,Y
          }

          REMAINING_CART_INDICES.delete(c);
          REMAINING_CART_INDICES.delete(c2);
          break;
        }
      }
    }

    if (part === 2 && REMAINING_CART_INDICES.size === 1) {                      // PART 2: RETURN LOCATION OF LAST CART REMAINING
      const lastCart = CARTS[[ ...REMAINING_CART_INDICES ][0]];                 // IMPORTANT: must refer to SET, not array, as
                                                                                // the set is up to date after resolving last crash
      
      if (DISPLAY_EXTRA_INFO) {
        console.log(`FINAL CART STOPS MOVING AFTER TURN ${
          t}; STOPS AT row, col: ${lastCart.row}, ${lastCart.col}`);
      }

      return `${lastCart.col},${lastCart.row}`;                                 // return as X,Y
    }
  }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = cartCollisionsOnRailConfiguration;
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
`/->-\\        
|   |  /----\\
| /-+--+-\\  |
| | |  | v  |
\\-+-/  \\-+--/
  \\------/   `
);

const sampleInput2 = parseSampleInput(
`/>-<\\  
|   |  
| /<+-\\
| | | v
\\>+</ |
  |   ^
  \\<->/`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = '7,3';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = '143,43';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = '6,4';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = '116,125';
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);