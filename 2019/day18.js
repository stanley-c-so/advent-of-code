// --- Day 18: Many-Worlds Interpretation ---

// PART 1:

// As you approach Neptune, a planetary security system detects you and activates a giant tractor beam on Triton! You have no choice but to land.

// A scan of the local area reveals only one interesting feature: a massive underground vault. You generate a map of the tunnels (your puzzle input). The tunnels are too narrow to move diagonally.

// Only one entrance (marked @) is present among the open passages (marked .) and stone walls (#), but you also detect an assortment of keys (shown as lowercase letters) and doors (shown as uppercase letters). Keys of a given letter open the door of the same letter: a opens A, b opens B, and so on. You aren't sure which key you need to disable the tractor beam, so you'll need to collect all of them.

// For example, suppose you have the following map:

// #########
// #b.A.@.a#
// #########

// Starting from the entrance (@), you can only access a large door (A) and a key (a). Moving toward the door doesn't help you, but you can move 2 steps to collect the key, unlocking A in the process:

// #########
// #b.....@#
// #########

// Then, you can move 6 steps to collect the only other key, b:

// #########
// #@......#
// #########

// So, collecting every key took a total of 8 steps.

// Here is a larger example:

// ########################
// #f.D.E.e.C.b.A.@.a.B.c.#
// ######################.#
// #d.....................#
// ########################

// The only reasonable move is to take key a and unlock door A:

// ########################
// #f.D.E.e.C.b.....@.B.c.#
// ######################.#
// #d.....................#
// ########################

// Then, do the same with key b:

// ########################
// #f.D.E.e.C.@.........c.#
// ######################.#
// #d.....................#
// ########################

// ...and the same with key c:

// ########################
// #f.D.E.e.............@.#
// ######################.#
// #d.....................#
// ########################

// Now, you have a choice between keys d and e. While key e is closer, collecting it now would be slower in the long run than collecting key d first, so that's the best choice:

// ########################
// #f...E.e...............#
// ######################.#
// #@.....................#
// ########################

// Finally, collect key e to unlock door E, then collect key f, taking a grand total of 86 steps.

// Here are a few more examples:

// ########################
// #...............b.C.D.f#
// #.######################
// #.....@.a.B.c.d.A.e.F.g#
// ########################

// Shortest path is 132 steps: b, a, c, d, f, e, g

// #################
// #i.G..c...e..H.p#
// ########.########
// #j.A..b...f..D.o#
// ########@########
// #k.E..a...g..B.n#
// ########.########
// #l.F..d...h..C.m#
// #################

// Shortest paths are 136 steps;
// one is: a, f, b, j, g, n, h, d, l, o, e, p, c, i, k, m

// ########################
// #@..............ac.GI.b#
// ###d#e#f################
// ###A#B#C################
// ###g#h#i################
// ########################

// Shortest paths are 81 steps; one is: a, c, f, i, d, g, b, e, h

// How many steps is the shortest path that collects all of the keys?

// PART 2:

//

function shortestPath (part, mapStr) {

  // BFS PURE UTILITY FUNCTION FOR RETURNING AN OBJECT OF ALL REACHABLE KEYS FROM GIVEN map AND x, y COORDINATES
  function findKeys (map, x, y) {
    const reachableKeys = {};                                                           // each key is a key, with value being the steps to get to that key from current x, y
    const queue = [[x, y, 0]];
    const visited = new Set();
    while (queue.length) {
      const [currentX, currentY, distance] = queue.shift();
      const char = map[currentY][currentX];
      if (visited.has(`${currentX},${currentY}`)) continue;
      visited.add(`${currentX},${currentY}`);
      if (char in keys) {                                                               // if current location is a key, stop traveling
        reachableKeys[char] = distance;
        continue;
      }
      const up = map[currentY - 1][currentX];
      const down = map[currentY + 1][currentX];
      const left = map[currentY][currentX - 1];
      const right = map[currentY][currentX + 1];
      if (                                                                              // check up
        currentY > 0                                                                      // in bounds
        && !visited.has(`${currentX},${currentY - 1}`)                                    // unvisited
        && (up === floor || up in keys)                                                   // destination is either floor or key
      ) queue.push([currentX, currentY - 1, distance + 1]);
      if (                                                                              // check down
        currentY < h
        && !visited.has(`${currentX},${currentY + 1}`)
        && (down === floor || down in keys)
      ) queue.push([currentX, currentY + 1, distance + 1]);
      if (                                                                              // check left
        currentX > 0
        && !visited.has(`${currentX - 1},${currentY}`)
        && (left === floor || left in keys)
      ) queue.push([currentX - 1, currentY, distance + 1]);
      if (                                                                              // check right
        currentX < w
        && !visited.has(`${currentX + 1},${currentY}`)
        && (right === floor || right in keys)
      ) queue.push([currentX + 1, currentY, distance + 1]);
    }
    return reachableKeys;
  }

  // HELPER FUNCTION FOR SIMULATING A DIRECT MOVEMENT TO A GIVEN REACHABLE KEY
  function goTo (key, map, keys, doors) {

    // CLONE map, keys, AND doors TO SIMULATE MOVING THERE WHILE ALLOWING FOR BACKTRACKING
    const mapClone = map.map(row => [...row]);
    const keysClone = {};
    for (const key in keys) keysClone[key] = {...keys[key]};
    const doorsClone = {};
    for (const door in doors) doorsClone[door] = {...doors[door]};

    const keyY = keysClone[key].row;
    const keyX = keysClone[key].col;
    mapClone[keyY][keyX] = floor;
    delete keysClone[key];
    if (key.toUpperCase() in doorsClone) {                                              // the door corresponding to this key may not necessarily exist
      const doorY = doorsClone[key.toUpperCase()].row;
      const doorX = doorsClone[key.toUpperCase()].col;
      mapClone[doorY][doorX] = floor;
      delete doorsClone[key.toUpperCase()];
    }
    
    return [mapClone, keysClone, doorsClone, keyX, keyY];
  }

  // CONSTANTS
  const floor = '.';
  const start = '@';

  // INGEST DATA AND CHART OUT ALL KEYS AND DOORS, AND CURRENT POSITION
  const map = mapStr.split('\n').map(row => row.split(''));
  const h = map.length;
  const w = map[0].length;
  const keys = {};
  const doors = {};
  let x, y;
  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      const char = map[row][col];
      if (char === start) {                                                             // found start
        map[row][col] = floor;                                                          // get rid of start indicator
        x = col;
        y = row;
      }
      if (char.toUpperCase() !== char.toLowerCase()) {                                  // if letter...
        if (char === char.toLowerCase()) {                                              // ...found key
          keys[char] = {row, col};
        } else {                                                                        // ...found door
          doors[char] = {row, col};
        }
      }
    }
  }

  // HELPER FUNCTION FOR RECURSION
  function helper (map, keys, doors, x, y, steps, upperBound, keysSoFar) {
    // console.log('helper was called')
    const foundKeys = findKeys(map, x, y);
    if (Object.keys(foundKeys).length) {
      console.log(`currently at x: ${x}, y: ${y} and can reach these keys:`, Object.keys(foundKeys))
      let minSteps = upperBound;
      for (const key in foundKeys) {                                                    // try going to every candidate key
        console.log('KEYS SO FAR:', keysSoFar)
        if (steps + foundKeys[key] >= upperBound) {
          console.log(`GOING FOR KEY ${key} WOULD HAVE BEEN ${steps + foundKeys[key]} STEPS WHICH IS NO BETTER THAN ${upperBound}`)
          continue;
        }
        console.log(`let's try going for key ${key}`)
        minSteps = Math.min(minSteps,
          helper(
            ...goTo(key, map, keys, doors),                                             // goTo returns an array with updated map, keys, doors, x, and y
            steps + foundKeys[key],                                                     // this aggregates the number of steps
            minSteps,
            new Set([...keysSoFar, key])
          )
        );
      }
      return minSteps;
    } else {
      console.log(`no more keys... took total of ${steps} steps`)
      return steps;
    }
  }

  return helper(map, keys, doors, x, y, 0, Infinity, new Set());

  // PART 1 VS PART 2
  // if (part === 1) {


    
  // } else {

  

  // }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = shortestPath;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 4 || 0;
const highestTest = 4 || Infinity;

const actualInput = `#################################################################################
#.#...........#...#.....#.......#...#...#.....#.....#.....#...#...#..g.........x#
#.#.#####.###Z#.#.#.###.#.#.###.#.###.#.#.###.#.#####.#.#.#.#.#.###.###########.#
#...#...#.#.....#.#.#.#...#.#...#.#...#.#.#.#.#.#.....#p#.#.#.#.......#...#.....#
#.#####.#.#########.#.#####.#.###.#.###.#.#.#.#.#.#####.#.#.#.#######.###.#.###.#
#.......#...#.......#.....#.#.#.....#...#.#.....#...#...#...#.#.....#.....#.#...#
###########.#.#########.###.#.###.###.###.#####.###.#.#######.#.###.#####.#.#.###
#...V.....#.......#...#.#...#...#...#...#.#...#...#.#.#.......#.#.#.#.....#.#...#
#.#######.#######.#.#.#.#.#####.#######.#.#.#.#.###.#.#######.#.#.#.#.#####B###.#
#.#.......#...#.....#...#.....#.....#...#...#.#.#...#.......#...#...#.....#...#.#
#.#.#####.#.#K#.#############.#####.#.#.#####.###.#########.#####.#######.###.###
#.#.#.....#.#.#...#...#.......#...#.#.#.#...#.#...#...#.....#.....#....l..#.#...#
#.#.#####.#.#.###.#.#.#.#######.#.#.#.###.#.#.#.###.#.#.#####.#######.#####.###.#
#.#.....#.#.#...#.#.#.#.....#...#...#...#.#...#.#...#.#...#...#.....#.........#.#
#.#####.#.#.###.#.#.#.#####.#####.#####.#.#####.#.#.#####.#.###.###.#######.###.#
#.#...#.#.#...#.#.#.#..j..#.....#.......#.#...#...#.#...#.#.....#...#.......#...#
#.#.###.#Q###.#.###.#####.#####I#######.#.#.#.#.#####.#.#.#######.#######.###.#.#
#...#...#.#...#.....#...#.....#.....#...#.#.#...#.....#.#.#.#.....#.....#h..#.#.#
###.#.#####.#########.#.#####.#.###.#.###.#.#####.#####.#.#.#.#####.###.#####.#.#
#...#...#...#.......#.#.......#...#.#...#.#.#.....#.....#.#.....#.....#.......#.#
#.#####.#.###.#####.#.###########.#.#####.#.#.#####.#####.#.###.#####.###########
#.....#.#...#.#.....#.#.......#...#.#...#...#.#.......#...#.#.#.....#.....#.....#
#####.#.###.#.#.###.###.###.###.###.#.#.#####.#######.###.###.#####.#####.#.###.#
#.#...#...#.#.#.#...#.....#...#.#.#.#.#.#.....#...#.#.....#...#...#.....#.....#.#
#.#.###.###.###.#.###########.#.#.#.#.#.#.#.###.#.#.#####.#.#####.#####.#######.#
#.#...#...#.....#.#..e....#...#...#...#.#.#.#...#.#...#...#.....#.....#.#.......#
#.###.###.#######.#.#####.#.#####.#####.#.###.###.#.#.#.#######.#.#.###.#.#####.#
#.#...#.#...#...#...#.....#.#.........#.#.#.....#.#.#.#.......#.#.#.....#...#...#
#.#.###.#.###.#.#####.#####.#.#########.#.#.#####.###.###.#####.#.#########.#.###
#...#...#...#.#.....#.#.#.......#...#...#.#o#.#...#...#...#.....#.#.........#...#
#.#####.###.#.#.#####.#.#.#######.#.#.#.#.#.#.#.###.###.###.#####.#####.#######U#
#.........#...#...#...#...#.......#...#.#.....#...#.....#.#.#...#.#.....#.....#.#
#########.#######.#.###.###.###########.#.#######.#.#####.#.#.#.#.#.#########.#.#
#.......#.......#...#.....#...#.#.....#.#.#.....#.#.......#.#.#.#.#.#.......#...#
#.#####.#######.#############.#.#.#.###.#.#.###.#.#########.#.###.#.#.#####.#####
#.....#.#.......#.....#.......#.#.#.#...#.#.#.....#...#.....#.#...#.....#.#..tE.#
#.###.###.#######.###.#.#######.#.#.#.###.#.#######.#.#.#####.#.#######.#.#####.#
#.S.#...#.....#...#.#c..#...#.....#.#.#.#.#...#.....#..s#.....#.#.....#...#...#.#
###.###.#####.#.###.#####.#.#.#####.#.#.#.###.#.#########.###.#.###.#.#####.#.#.#
#.....#.........#.........#.......#.........#...#...........#.....F.#.......#...#
#######################################.@.#######################################
#m........#.............#...........#.........#.....#.........#.....#...#.......#
###.#####.#########.#####.#####.###.#.#.#.#.#.#.###.#.#####.#.#.###.#.#.#.###.#.#
#...#.#...#.......#...#...#...#.#.#...#.#.#.#.#...#...#...#.#.....#.#.#.#.#...#.#
#.###W#.###.#####.#.#.#O###.#.#.#.#####.###.#####.#####.#.#########.#.#.#.#.###.#
#.#.......#...#.#.#.#.#...#.#.#.#...#...#...#...#.....#.#.#...#...#.C.#.#.#.#...#
#.#######.###.#.#.#.#.###.#.#.#.#.###.###.###.#.#.#####.#.#.#.#.#.#####.#.#.###.#
#.#...#.#.#...#...#.#.#...#.#...#.......#.....#...#.....#.#.#.#.#.....#...#...#.#
#.#.#.#.#.#.###.###.#.#.###.#####.#######.#########.#####.#.#.#.#####.#.#####.#.#
#.#f#.#.#.#.#.#.#...#...#...#...#...#...#.#.......#...#.....#.#.#...#.#...#.#.#.#
#.#.#.#.#.#.#.#.#.#######.###.###.###.#D#.###.#.#####.#######.#.#.###.###.#.#.#.#
#...#.#...#.#...#.....#.#...#.....#...#.#...#.#.#...#.....#.#.#.#.....#.....#.#.#
#####.#.###.#.#######.#.###.###.###.###.###.#.###.#.#####.#.#.#.#.#####.#####.#.#
#.....#...#.#.#...#...#...#...#.#a..#.#.#.#.#.....#.....#.#...#.#w#...#...#...#.#
#.#######.#.#.#.#.#.###.#####.###.###.#.#.#.#.#######.###.#.###.#.#.#####.#.###.#
#.#.....#.#.#.#.#.#...#.#...#...#...#.#.#...#.....#...#...#...#.#.#.......#.#...#
#.###.#.#.#.#.#.#.###.#.#.#.#.#.###.#.#.#.#########.#.#.#####.#M#.#########.###.#
#...#.#...#.#...#.#.....#.#.#.#...#.#..d#.#.........#.#.#.......#...#.....#...#.#
#.#.#.#####.#####.#######.#.#####.#.#.###.###.#####.###.#.#########.#.###.###.#.#
#.#.#...#...#.............#.......#.#...#.#i..#.....#...#.#.......#...#.#...#.#.#
###.###.#.###.#################.###A###.#.#.###.#####.###.#.#####.#####.###.#.###
#...#.....#.#.#.....#.Y...#...#.#...#.#.#...#.#.#.#...#...#.#.N...#.........#...#
#.###.#####.#.#.###.#####.###.#.#.###.#.#####.#.#.#.###.###.#############.#####.#
#...#.#...#...#.#.#.....#...#...#.#...R.#.#.....#.#...#...#.....#...#...#q....#.#
#.#.###.#.#.###.#.###.#.###.#####.#.#####.#.#####.###.#########.#.#.#.#.#####.#.#
#.#...#.#.#.#...#...#.#...#..y....#.#...#.#.#.......#.........#...#...#...#.#.#.#
#####.#.#.###.###.#.#.###.#########.#.#.#.#.#.#####.#########.###########.#.#.#.#
#...#.#.#...#.#...#.#...#.....#...#.#.#.#.#.#.#.............#.#...#.....#.#.#.#.#
#.#.#.#.###.#.#.#######.#####.#.#.#.###.#.#.#.#.#######.#####.#.#.#.###.#.#.#.#.#
#.#...#.#.#.#...#.......#...#.#.#r..#...#...#.#.#.....#.#...#...#.#...#...#.#.#.#
#T###.#.#.#.###.#.#######.#.###.#####.###.#####.#.###.#.#.#.#####.###.#####.#.#.#
#.#...#u..#.....#...#...#n#...#.#.#.....#.#...#.#...#.#.#.#.#.......#.....#.....#
#.#.#####.#########.#.#H#.###.#.#.#.###.#.#.#.#.#.###.#.#.#J#.###########.#####.#
#.#.....#.#...#...#.#.#...#.#...#.#...#.#...#.#...#...#.#.#...#.........#.....#.#
#.#######.#.###.#.#.#.#####.#####.###.#.#####.#.###.#####.#.###.#####.#######.#.#
#.#.......#.#...#...#...#.....L.#.....#.#.#...#..v#z..#...#.#...#...#.......#.#.#
#.#.#######.#.###.#####.#.#####.#######.#.#.#########.#.#####.###.#.###.#####.#.#
#.#.#k......#...#.#...#...#.....#.....#.#.#.....#...#.#..b....#...#...#...#...#.#
#.#.#.#####.###.###.#.#####.#####.###.#.#.#####.#.#.#.#############.#.###X#.###.#
#.....#.......#...G.#.............#.....#.........#...P.............#...#...#...#
#################################################################################`;

// Test case 1
input = {
  part: 1,
  mapStr: `#########
#b.A.@.a#
#########`,
};
expected = 8;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  mapStr: `########################
#f.D.E.e.C.b.A.@.a.B.c.#
######################.#
#d.....................#
########################`,
};
expected = 86;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  mapStr: `########################
#...............b.C.D.f#
#.######################
#.....@.a.B.c.d.A.e.F.g#
########################`,
};
expected = 132;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  mapStr: `#################
#i.G..c...e..H.p#
########.########
#j.A..b...f..D.o#
########@########
#k.E..a...g..B.n#
########.########
#l.F..d...h..C.m#
#################`,
};
expected = 136;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  mapStr: `########################
#@..............ac.GI.b#
###d#e#f################
###A#B#C################
###g#h#i################
########################`,
};
expected = 81;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  mapStr: actualInput,
};
expected = null;
test(func, input, expected, testNum, lowestTest, highestTest);