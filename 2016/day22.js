/*

--- Day 22: Grid Computing ---

You gain access to a massive storage cluster arranged in a grid; each storage node is only connected to the four nodes directly adjacent to it (three if the node is on an edge, two if it's in a corner).

You can directly access data only on node /dev/grid/node-x0-y0, but you can perform some limited actions on the other nodes:

You can get the disk usage of all nodes (via df). The result of doing this is in your puzzle input.
You can instruct a node to move (not copy) all of its data to an adjacent node (if the destination node has enough space to receive the data). The sending node is left empty after this operation.

Nodes are named by their position: the node named node-x10-y10 is adjacent to nodes node-x9-y10, node-x11-y10, node-x10-y9, and node-x10-y11.

Before you begin, you need to understand the arrangement of data on these nodes. Even though you can only move data between directly connected nodes, you're going to need to rearrange a lot of the data to get access to the data you need. Therefore, you need to work out how you might be able to shift data around.

To do this, you'd like to count the number of viable pairs of nodes. A viable pair is any two nodes (A,B), regardless of whether they are directly connected, such that:

Node A is not empty (its Used is not zero).
Nodes A and B are not the same node.
The data on node A (its Used) would fit on node B (its Avail).

How many viable pairs of nodes are there?


--- Part Two ---

Now that you have a better understanding of the grid, it's time to get to work.

Your goal is to gain access to the data which begins in the node with y=0 and the highest x (that is, the node in the top-right corner).

For example, suppose you have the following grid:

Filesystem            Size  Used  Avail  Use%
/dev/grid/node-x0-y0   10T    8T     2T   80%
/dev/grid/node-x0-y1   11T    6T     5T   54%
/dev/grid/node-x0-y2   32T   28T     4T   87%
/dev/grid/node-x1-y0    9T    7T     2T   77%
/dev/grid/node-x1-y1    8T    0T     8T    0%
/dev/grid/node-x1-y2   11T    7T     4T   63%
/dev/grid/node-x2-y0   10T    6T     4T   60%
/dev/grid/node-x2-y1    9T    8T     1T   88%
/dev/grid/node-x2-y2    9T    6T     3T   66%

In this example, you have a storage grid 3 nodes wide and 3 nodes tall. The node you can access directly, node-x0-y0, is almost full. The node containing the data you want to access, node-x2-y0 (because it has y=0 and the highest x value), contains 6 terabytes of data - enough to fit on your node, if only you could make enough space to move it there.

Fortunately, node-x1-y1 looks like it has enough free space to enable you to move some of this data around. In fact, it seems like all of the nodes have enough space to hold any node's data (except node-x0-y2, which is much larger, very full, and not moving any time soon). So, initially, the grid's capacities and connections look like this:

( 8T/10T) --  7T/ 9T -- [ 6T/10T]
    |           |           |
  6T/11T  --  0T/ 8T --   8T/ 9T
    |           |           |
 28T/32T  --  7T/11T --   6T/ 9T

The node you can access directly is in parentheses; the data you want starts in the node marked by square brackets.

In this example, most of the nodes are interchangable: they're full enough that no other node's data would fit, but small enough that their data could be moved around. Let's draw these nodes as .. The exceptions are the empty node, which we'll draw as _, and the very large, very full node, which we'll draw as #. Let's also draw the goal data as G. Then, it looks like this:

(.) .  G
 .  _  .
 #  .  .

The goal is to move the data in the top right, G, to the node in parentheses. To do this, we can issue some commands to the grid and rearrange the data:

Move data from node-y0-x1 to node-y1-x1, leaving node node-y0-x1 empty:

(.) _  G
 .  .  .
 #  .  .

Move the goal data from node-y0-x2 to node-y0-x1:

(.) G  _
 .  .  .
 #  .  .

At this point, we're quite close. However, we have no deletion command, so we have to move some more data around. So, next, we move the data from node-y1-x2 to node-y0-x2:

(.) G  .
 .  .  _
 #  .  .

Move the data from node-y1-x1 to node-y1-x2:

(.) G  .
 .  _  .
 #  .  .

Move the data from node-y1-x0 to node-y1-x1:

(.) G  .
 _  .  .
 #  .  .

Next, we can free up space on our node by moving the data from node-y0-x0 to node-y1-x0:

(_) G  .
 .  .  .
 #  .  .

Finally, we can access the goal data by moving the it from node-y0-x1 to node-y0-x0:

(G) _  .
 .  .  .
 #  .  .

So, after 7 steps, we've accessed the data we want. Unfortunately, each of these moves takes time, and we need to be efficient:

What is the fewest number of steps required to move your goal data to node-x0-y0?

*/

const { Queue } = require('./_classes');

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function slidingPuzzle (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // IMPORTANT NOTE ABOUT HOW TO SOLVE PART 2:
  // after inspecting the data, i decided the best way to distinguish between nodes that are 'normal' and
  // nodes that are 'walls' was based on the value used * (used / avail), or used^2 / avail. this value created
  // a clear distinction between the nodes that were obviously meant to be normal vs. the ones that were meant
  // to be walls.
  // this is the general solution for part 2:
  // - there is only one empty space
  // - the shortest path involves first bringing the empty space to the position left of the goal
  // - the next step is for the goal to move left, once, filling the empty space
  // - after this, it takes 5 steps each time to get the goal to move left once

  // REFERENCE CONSTANTS - see above note. these cutoffs are numbers between the range of usedTimesRatio for the
  // normal nodes vs. the wall nodes. these values were derived from inspecting the actual data, and are thus
  // hard-coded here
  const SAMPLE_CUTOFF = 65;
  const ACTUAL_CUTOFF = 445;
  const CUTOFF = DEBUG ? SAMPLE_CUTOFF : ACTUAL_CUTOFF;

  // VALUES DISCOVERED UPON PARSING INPUT DATA
  let maxX = 0;
  let maxY = 0;
  let wallRow;
  let spaceX, spaceY;

  // DATA STRUCTURE
  const NODES_DATA = {};

  // PARSE INPUT DATA
  for (let i = 2; i < inputArr.length; ++i) {

    // parse text into components
    const line = inputArr[i];
    const components = [];
    let currBlock = '';
    for (const c of line + ' ') {
      if (c === ' ') {
        if (currBlock) {
          components.push(currBlock);
          currBlock = '';
        }
      } else {
        currBlock += c;
      }
    }

    // extract relevant data from components
    const serial = components[0].split('/dev/grid/node-')[1];
    const [x, y] = serial.split('-').map(coord => +coord.slice(1));
    [ maxX, maxY ] = [ Math.max(maxX, x), Math.max(maxY, y) ];
    const used = +components[2].slice(0, -1);
    const avail = +components[3].slice(0, -1);
    const ratio = used / avail;                                                     // see note for part 2
    const usedTimesRatio = used * ratio;                                            // see note for part 2

    // save to data structure
    NODES_DATA[serial] = {
      used,
      avail,
      usedTimesRatio,
    }

    // discover special variables
    if (usedTimesRatio === 0) [ spaceX, spaceY ] = [ x, y ];
    else if (wallRow === undefined && usedTimesRatio > CUTOFF) wallRow = y;
  }

  // ANALYZE
  if (part === 1) {

    let viablePairs = 0;
    const nodes = Object.keys(NODES_DATA);
    for (let i = 0; i < nodes.length; ++i) {
      for (let j = 0; j < nodes.length; ++j) {
        const A = NODES_DATA[nodes[i]];
        const B = NODES_DATA[nodes[j]];
        if (i !== j
            && A.used
            && B.avail >= A.used
        ) {
          ++viablePairs;
        }
      }
    }

    return viablePairs;

  } else {

    // GRID CONSTANTS
    const H = maxY + 1;
    const W = maxX + 1;
    const GOAL = 'G';
    const EMPTY = '_';
    const NODE = '.';
    const WALL = '#';

    // GENERATE GRID
    const GRID = Array.from({length: H}, () => Array(W));
    for (let row = 0; row < H; ++row) {
      for (let col = 0; col < W; ++col) {
        const serial = `x${col}-y${row}`;

        GRID[row][col] =  serial === `x${maxX}-y${0}`                 ? GOAL :
                          NODES_DATA[serial].usedTimesRatio === 0     ? EMPTY :
                          NODES_DATA[serial].usedTimesRatio <= CUTOFF ? NODE :
                                                                        WALL;
      }
    }
    if (DISPLAY_EXTRA_INFO && part === 2) {
      for (const row of GRID) console.log(row.join(''));
    }

    // BFS TO MOVE SPACE TO THE COORDINATES LEFT OF GOAL
    function getMovesFromSpaceToLeftOfGoal() {
      const DIRS = [
        [ +1, 0 ],
        [ -1, 0 ],
        [ 0, +1 ],
        [ 0, -1 ],
      ];
      const Q = new Queue([ spaceY, spaceX, 0 ]);
      const visited = new Set();
      while (!Q.isEmpty()) {
        const [ row, col, moves ] = Q.dequeue().val;
        const serial = `${row},${col}`;

        if (visited.has(serial) || GRID[row][col] === WALL) continue;
        visited.add(serial);

        if (serial === `${0},${W - 2}`) return moves;

        for (const [ dy, dx ] of DIRS) {
          const [ newRow, newCol ] = [ row + dy, col + dx ];
          if (0 <= newRow && newRow < H && 0 <= newCol && newCol < W) {
            Q.enqueue([ newRow, newCol, moves + 1 ]);
          }
        }
      }
      throw 'ERROR: NO SOLUTION FOUND';
    }

    return getMovesFromSpaceToLeftOfGoal()                                          // first, move space to coord left of goal
            + 1                                                                     // then move goal into that space
            + (W - 1 - 1) * 5;                                                      // then for all remaining spaces left, make 5 moves
  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = slidingPuzzle;
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
`root@ebhq-gridcenter# df -h
Filesystem            Size  Used  Avail  Use%
/dev/grid/node-x0-y0   10T    8T     2T   80%
/dev/grid/node-x0-y1   11T    6T     5T   54%
/dev/grid/node-x0-y2   32T   28T     4T   87%
/dev/grid/node-x1-y0    9T    7T     2T   77%
/dev/grid/node-x1-y1    8T    0T     8T    0%
/dev/grid/node-x1-y2   11T    7T     4T   63%
/dev/grid/node-x2-y0   10T    6T     4T   60%
/dev/grid/node-x2-y1    9T    8T     1T   88%
/dev/grid/node-x2-y2    9T    6T     3T   66%`
);

// Test case 1
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 864;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 7;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 244;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);