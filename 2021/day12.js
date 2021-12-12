/*

--- Day 12: Passage Pathing ---

With your submarine's subterranean subsystems subsisting suboptimally, the only way you're getting out of this cave anytime soon is by finding a path yourself. Not just a path - the only way to know if you've found the best path is to find all of them.

Fortunately, the sensors are still mostly working, and so you build a rough map of the remaining caves (your puzzle input). For example:

start-A
start-b
A-c
A-b
b-d
A-end
b-end

This is a list of how all of the caves are connected. You start in the cave named start, and your destination is the cave named end. An entry like b-d means that cave b is connected to cave d - that is, you can move between them.

So, the above cave system looks roughly like this:

    start
    /   \
c--A-----b--d
    \   /
     end

Your goal is to find the number of distinct paths that start at start, end at end, and don't visit small caves more than once. There are two types of caves: big caves (written in uppercase, like A) and small caves (written in lowercase, like b). It would be a waste of time to visit any small cave more than once, but big caves are large enough that it might be worth visiting them multiple times. So, all paths you find should visit small caves at most once, and can visit big caves any number of times.

Given these rules, there are 10 paths through this example cave system:

start,A,b,A,c,A,end
start,A,b,A,end
start,A,b,end
start,A,c,A,b,A,end
start,A,c,A,b,end
start,A,c,A,end
start,A,end
start,b,A,c,A,end
start,b,A,end
start,b,end

(Each line in the above list corresponds to a single path; the caves visited by that path are listed in the order they are visited and separated by commas.)

Note that in this cave system, cave d is never visited by any path: to do so, cave b would need to be visited twice (once on the way to cave d and a second time when returning from cave d), and since cave b is small, this is not allowed.

Here is a slightly larger example:

dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc

The 19 paths through it are as follows:

start,HN,dc,HN,end
start,HN,dc,HN,kj,HN,end
start,HN,dc,end
start,HN,dc,kj,HN,end
start,HN,end
start,HN,kj,HN,dc,HN,end
start,HN,kj,HN,dc,end
start,HN,kj,HN,end
start,HN,kj,dc,HN,end
start,HN,kj,dc,end
start,dc,HN,end
start,dc,HN,kj,HN,end
start,dc,end
start,dc,kj,HN,end
start,kj,HN,dc,HN,end
start,kj,HN,dc,end
start,kj,HN,end
start,kj,dc,HN,end
start,kj,dc,end

Finally, this even larger example has 226 paths through it:

fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW

How many paths through this cave system are there that visit small caves at most once?


--- Part Two ---

After reviewing the available paths, you realize you might have time to visit a single small cave twice. Specifically, big caves can be visited any number of times, a single small cave can be visited at most twice, and the remaining small caves can be visited at most once. However, the caves named start and end can only be visited exactly once each: once you leave the start cave, you may not return to it, and once you reach the end cave, the path must end immediately.

Now, the 36 possible paths through the first example above are:

start,A,b,A,b,A,c,A,end
start,A,b,A,b,A,end
start,A,b,A,b,end
start,A,b,A,c,A,b,A,end
start,A,b,A,c,A,b,end
start,A,b,A,c,A,c,A,end
start,A,b,A,c,A,end
start,A,b,A,end
start,A,b,d,b,A,c,A,end
start,A,b,d,b,A,end
start,A,b,d,b,end
start,A,b,end
start,A,c,A,b,A,b,A,end
start,A,c,A,b,A,b,end
start,A,c,A,b,A,c,A,end
start,A,c,A,b,A,end
start,A,c,A,b,d,b,A,end
start,A,c,A,b,d,b,end
start,A,c,A,b,end
start,A,c,A,c,A,b,A,end
start,A,c,A,c,A,b,end
start,A,c,A,c,A,end
start,A,c,A,end
start,A,end
start,b,A,b,A,c,A,end
start,b,A,b,A,end
start,b,A,b,end
start,b,A,c,A,b,A,end
start,b,A,c,A,b,end
start,b,A,c,A,c,A,end
start,b,A,c,A,end
start,b,A,end
start,b,d,b,A,c,A,end
start,b,d,b,A,end
start,b,d,b,end
start,b,end

The slightly larger example above now has 103 paths through it, and the even larger example now has 3509 paths through it.

Given these new rules, how many paths through this cave system are there?

*/

function graphTraversalDFS (part, inputStr) {
  const inputArr = inputStr.split('\n');

  // CREATE ADJACENCY LIST FROM INPUT
  const adjacencyList = {};
  for (const line of inputArr) {
    const [a, b] = line.split('-');
    if (!(a in adjacencyList)) adjacencyList[a] = new Set();
    adjacencyList[a].add(b);
    if (!(b in adjacencyList)) adjacencyList[b] = new Set();
    adjacencyList[b].add(a);
  }

  // UTILITY FUNCTION
  const isSmallCave = cave => cave.length < 3 && cave[0] === cave[0].toLowerCase();                                   // each cave name (not 'start' or 'end') is either 1 or 2 letters

  // INIT
  let paths = 0;

  // // ===== MY INITIAL DFS SOLUTION
  // const stack = [
  //   {                                                                                                                 // each stack node has the following 3 pieces of data:
  //     location: 'start',                                                                                              // (1) current node
  //     smallCavesVisited: new Set(),                                                                                   // a copy of the set of all small caves that have been visited (or 'start')
  //     repeatedASmallCave: false                                                                                       // PART 2: whether a small cave has been visited twice yet
  //   }
  // ];
  // while (stack.length) {
  //   const { location, smallCavesVisited, repeatedASmallCave } = stack.pop();
  //   if (location === 'end') {                                                                                         // if you reach 'end' then you have found a path...
  //     ++paths;                                                                                                        // ...so increment the count
  //     continue;
  //   }
  //   const copyOfSet = new Set(smallCavesVisited);                                                                     // otherwise, you have to keep going, so make a copy of the set...
  //   if (location === 'start' || isSmallCave(location)) copyOfSet.add(location);                                       // ...be sure to add current location to it, if it's a small cave...
  //   for (const neighbor of adjacencyList[location]) {                                                                 // then consider every neighbor...
  //     if (part === 2 && isSmallCave(neighbor) && copyOfSet.has(neighbor) && !repeatedASmallCave) {                    // PART 2: if neighbor is a small cave you've visited before, AND...
  //       stack.push( { location: neighbor, smallCavesVisited: copyOfSet, repeatedASmallCave: true } );                 // ...you haven't visited a cave twice yet, try visiting this one again
  //     } else if (!copyOfSet.has(neighbor)) {                                                                          // else, for either part, if neighbor is NOT a small cave you've visited...
  //       stack.push( { location: neighbor, smallCavesVisited: copyOfSet, repeatedASmallCave: repeatedASmallCave } );   // ...then try visiting it
  //     }
  //   }
  // }
  // // ==========

  // ===== BACKTRACKING SOLUTION - MORE EFFICIENT!
  const smallCavesVisited = new Set();                                                                                // again, a set to track visited small caves (or 'start'), but only 1 set!
  let repeatedSmallCave = null;                                                                                       // null if you never repeated a small cave, else stores name of cave
  function backtrack(location) {
    if (location === 'end') {                                                                                         // BASE CASE "POSITIVE": reached the 'end'
      ++paths;                                                                                                        // increment path count...
      return;                                                                                                         // ...and return
    }
    if (location === 'start' || isSmallCave(location)) smallCavesVisited.add(location);                               // RECURSIVE CASE: start by adding location to set if it's a small cave
    for (const neighbor of adjacencyList[location]) {                                                                 // in any event, next consider all neighbors
      if (part === 2 && isSmallCave(neighbor) && smallCavesVisited.has(neighbor) && repeatedSmallCave === null) {     // PART 2: if a neighbor is eligible to be visited for a 2nd time...
        repeatedSmallCave = neighbor;                                                                                 // ...then set that neighbor as the repeated small cave...
        backtrack(neighbor);                                                                                          // ...and call backtrack on that neighbor
        repeatedSmallCave = null;                                                                                     // upon returning from the call, set the repeated small cave back to null
      } else if (!smallCavesVisited.has(neighbor)) {                                                                  // else, if otherwise able to visit this neighbor...
        backtrack(neighbor);                                                                                          // ...call backtrack on the neighbor
      }
    }
    if (repeatedSmallCave !== location) smallCavesVisited.delete(location);                                           // BASE CASE "NEGATIVE": unvisit this location (unless this is 2nd visit)
  }
  backtrack('start')                                                                                                  // kick start the backtrack process on 'start'!
  // ==========

  return paths;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = graphTraversalDFS;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput1 = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;

const sampleInput2 = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`;

const sampleInput3 = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`;

const actualInput = `xq-XZ
zo-yr
CT-zo
yr-xq
yr-LD
xq-ra
np-zo
end-LD
np-LD
xq-kq
start-ra
np-kq
LO-end
start-xq
zo-ra
LO-np
XZ-start
zo-kq
LO-yr
kq-XZ
zo-LD
kq-ra
XZ-yr
LD-ws
np-end
kq-yr`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput1,
};
expected = 10;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
};
expected = 19;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
};
expected = 226;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 5457;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 1
input = {
  part: 2,
  inputStr: sampleInput1,
};
expected = 36;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 2,
  inputStr: sampleInput2,
};
expected = 103;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput3,
};
expected = 3509;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 128506;
test(func, input, expected, testNum, lowestTest, highestTest);