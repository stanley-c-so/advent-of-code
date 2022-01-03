/*

--- Day 25: Sea Cucumber ---

This is it: the bottom of the ocean trench, the last place the sleigh keys could be. Your submarine's experimental antenna still isn't boosted enough to detect the keys, but they must be here. All you need to do is reach the seafloor and find them.

At least, you'd touch down on the seafloor if you could; unfortunately, it's completely covered by two large herds of sea cucumbers, and there isn't an open space large enough for your submarine.

You suspect that the Elves must have done this before, because just then you discover the phone number of a deep-sea marine biologist on a handwritten note taped to the wall of the submarine's cockpit.

"Sea cucumbers? Yeah, they're probably hunting for food. But don't worry, they're predictable critters: they move in perfectly straight lines, only moving forward when there's space to do so. They're actually quite polite!"

You explain that you'd like to predict when you could land your submarine.

"Oh that's easy, they'll eventually pile up and leave enough space for-- wait, did you say submarine? And the only place with that many sea cucumbers would be at the very bottom of the Mariana--" You hang up the phone.

There are two herds of sea cucumbers sharing the same region; one always moves east (>), while the other always moves south (v). Each location can contain at most one sea cucumber; the remaining locations are empty (.). The submarine helpfully generates a map of the situation (your puzzle input). For example:

v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>

Every step, the sea cucumbers in the east-facing herd attempt to move forward one location, then the sea cucumbers in the south-facing herd attempt to move forward one location. When a herd moves forward, every sea cucumber in the herd first simultaneously considers whether there is a sea cucumber in the adjacent location it's facing (even another sea cucumber facing the same direction), and then every sea cucumber facing an empty location simultaneously moves into that location.

So, in a situation like this:

...>>>>>...

After one step, only the rightmost sea cucumber would have moved:

...>>>>.>..

After the next step, two sea cucumbers move:

...>>>.>.>.

During a single step, the east-facing herd moves first, then the south-facing herd moves. So, given this situation:

..........
.>v....v..
.......>..
..........
After a single step, of the sea cucumbers on the left, only the south-facing sea cucumber has moved (as it wasn't out of the way in time for the east-facing cucumber on the left to move), but both sea cucumbers on the right have moved (as the east-facing sea cucumber moved out of the way of the south-facing sea cucumber):

..........
.>........
..v....v>.
..........

Due to strong water currents in the area, sea cucumbers that move off the right edge of the map appear on the left edge, and sea cucumbers that move off the bottom edge of the map appear on the top edge. Sea cucumbers always check whether their destination location is empty before moving, even if that destination is on the opposite side of the map:

Initial state:
...>...
.......
......>
v.....>
......>
.......
..vvv..

After 1 step:
..vv>..
.......
>......
v.....>
>......
.......
....v..

After 2 steps:
....v>.
..vv...
.>.....
......>
v>.....
.......
.......

After 3 steps:
......>
..v.v..
..>v...
>......
..>....
v......
.......

After 4 steps:
>......
..v....
..>.v..
.>.v...
...>...
.......
v......

To find a safe place to land your submarine, the sea cucumbers need to stop moving. Again consider the first example:

Initial state:
v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>

After 1 step:
....>.>v.>
v.v>.>v.v.
>v>>..>v..
>>v>v>.>.v
.>v.v...v.
v>>.>vvv..
..v...>>..
vv...>>vv.
>.v.v..v.v

After 2 steps:
>.v.v>>..v
v.v.>>vv..
>v>.>.>.v.
>>v>v.>v>.
.>..v....v
.>v>>.v.v.
v....v>v>.
.vv..>>v..
v>.....vv.

After 3 steps:
v>v.v>.>v.
v...>>.v.v
>vv>.>v>..
>>v>v.>.v>
..>....v..
.>.>v>v..v
..v..v>vv>
v.v..>>v..
.v>....v..

After 4 steps:
v>..v.>>..
v.v.>.>.v.
>vv.>>.v>v
>>.>..v>.>
..v>v...v.
..>>.>vv..
>.v.vv>v.v
.....>>vv.
vvv>...v..

After 5 steps:
vv>...>v>.
v.v.v>.>v.
>.v.>.>.>v
>v>.>..v>>
..v>v.v...
..>.>>vvv.
.>...v>v..
..v.v>>v.v
v.v.>...v.

...

After 10 steps:
..>..>>vv.
v.....>>.v
..v.v>>>v>
v>.>v.>>>.
..v>v.vv.v
.v.>>>.v..
v.v..>v>..
..v...>v.>
.vv..v>vv.

...

After 20 steps:
v>.....>>.
>vv>.....v
.>v>v.vv>>
v>>>v.>v.>
....vv>v..
.v.>>>vvv.
..v..>>vv.
v.v...>>.v
..v.....v>

...

After 30 steps:
.vv.v..>>>
v>...v...>
>.v>.>vv.>
>v>.>.>v.>
.>..v.vv..
..v>..>>v.
....v>..>v
v.v...>vv>
v.v...>vvv

...

After 40 steps:
>>v>v..v..
..>>v..vv.
..>>>v.>.v
..>>>>vvv>
v.....>...
v.v...>v>>
>vv.....v>
.>v...v.>v
vvv.v..v.>

...

After 50 steps:
..>>v>vv.v
..v.>>vv..
v.>>v>>v..
..>>>>>vv.
vvv....>vv
..v....>>>
v>.......>
.vv>....v>
.>v.vv.v..

...

After 55 steps:
..>>v>vv..
..v.>>vv..
..>>v>>vv.
..>>>>>vv.
v......>vv
v>v....>>v
vvv...>..>
>vv.....>.
.>v.vv.v..

After 56 steps:
..>>v>vv..
..v.>>vv..
..>>v>>vv.
..>>>>>vv.
v......>vv
v>v....>>v
vvv....>.>
>vv......>
.>v.vv.v..

After 57 steps:
..>>v>vv..
..v.>>vv..
..>>v>>vv.
..>>>>>vv.
v......>vv
v>v....>>v
vvv.....>>
>vv......>
.>v.vv.v..

After 58 steps:
..>>v>vv..
..v.>>vv..
..>>v>>vv.
..>>>>>vv.
v......>vv
v>v....>>v
vvv.....>>
>vv......>
.>v.vv.v..

In this example, the sea cucumbers stop moving after 58 steps.

Find somewhere safe to land your submarine. What is the first step on which no sea cucumbers move?


--- Part Two ---

Suddenly, the experimental antenna control console lights up:

Sleigh keys detected!
According to the console, the keys are directly under the submarine. You landed right on them! Using a robotic arm on the submarine, you move the sleigh keys into the airlock.

Now, you just need to get them to Santa in time to save Christmas! You check your clock - it is Christmas. There's no way you can get them back to the surface in time.

Just as you start to lose hope, you notice a button on the sleigh keys: remote start. You can start the sleigh from the bottom of the ocean! You just need some way to boost the signal from the keys so it actually reaches the sleigh. Good thing the submarine has that experimental antenna! You'll definitely need 50 stars to boost it that far, though.

The experimental antenna control console lights up again:

Energy source detected.
Integrating energy source from device "sleigh keys"...done.
Installing device drivers...done.
Recalibrating experimental antenna...done.
Boost strength due to matching signal phase: 1 star
Only 49 stars to go.

You use all fifty stars to boost the signal and remotely start the sleigh! Now, you just have to find your way back to the surface...

...did you know crab submarines come with colored lights?

// NOTE: There is no part 2 puzzle! In reality you just needed to have solved every other problem.

*/

function seaCucumberMovement (part, inputStr) {

  // PARSE DATA
  let map = inputStr.split('\n').map(line => line.split(''));
  const H = map.length;
  const W = map[0].length;

  // INIT
  const ref = { 'E': '>', 'S': 'v' };

  // UTILITY FUNCTION
  function getPosInFront(dir, row, col) {
    switch (dir) {
      case 'E':
        return [row, col === W - 1 ? 0 : col + 1];
      case 'S':
        return [row === H - 1 ? 0 : row + 1, col];
      default:
        throw `YOU SCREWED UP - INVALID DIR ${dir}`;
    }
  }

  // HELPER FUNCTION - RETURNS WHETHER ANYTHING MOVED
  function move(dir) {
    let somethingMoved = false;
    const newMap = Array.from({length: H}, () => Array(W).fill(null));
    const symbol = ref[dir];
    for (let row = 0; row < H; ++row) {
      for (let col = 0; col < W; ++col) {
        const [nextRow, nextCol] = getPosInFront(dir, row, col);
        if (map[row][col] === symbol && map[nextRow][nextCol] === '.') {
          newMap[row][col] = '.';
          newMap[nextRow][nextCol] = symbol;
          somethingMoved = true;
        } else if (newMap[row][col] === null) {
          newMap[row][col] = map[row][col];
        }
      }
    }
    map = newMap;
    return somethingMoved;
  }

  // MAIN FUNCTION

  const ERROR_LIMIT = 1000;

  for (let i = 1; i < ERROR_LIMIT; ++i) {
    const somethingMovedEast = move('E');
    const somethingMovedSouth = move('S');
    if (!somethingMovedEast && !somethingMovedSouth) return i; 
  }

  throw `YOU SCREWED UP - DID NOT FIND AN ANSWER AFTER COMPLETING FOR LOOP OF ${ERROR_LIMIT} ITERATIONS`;
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = seaCucumberMovement;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`;

const actualInput = `>.v..>.>.>>.v>vv.vv>v.v...v>>..v.v.>>.>...v>.>....v>>.v.....vv.vvvv>...v.>.v>..v>>..>.v.v>.....vvv.....>....v>.v..>..>.>>v.......v.>....>..
v.>.>.>.v.v.v.v.>..v.v.v.v...vv..>>v>vv.v>..>>..>.>v..>......v....>..v...vv..v.vv.>.vv>v.>.v>..>>....>..>....vv..v..>.>v>>..v>..>...>..>>v>
v..>>v...>>>.>>.>vv.>...>.vv>v.v>vv.v>.vv>.v>v.v.>.v.v.>......v>.>>..v>v.v...vv>v...vv.>>..v>v.vv.>v..v.>>.vv.....>.>vv.>>>>v.....>v.>>..>.
>.>v..>..>>>.>>..>.v.....v>v...v>.>..v.>vvv..>>v...v...v>....v.>.>.v>.v..>>v..>.>......>.v.vvv..>vvv...v.......v..>>..>...>v..v..>....>.v>.
...>v>.v.>v>>...>vv.v>v...>vv.v>.vv>..v..>..vv..>>>>v>...>....vv...v.>....v.v.>.>...>vv>v.>.v..>>.v.v>vv>...>>>v..>>.v.....v>..>>v>.....>>>
>.v.>v>>.....>..v.........v..vvv>>..v..>v.v.>vv.....>.>.v>.>>v........vvv......>vv..v...........v>>.>.v.....>....>.>.>.>..>.v..>v>>.>>>.>..
.vvvvv>vv..vv.>.v.>...v>>>>vv>>>..vv..>>.......>>.vv>vv>v..>...vv...>...v>.>>....>.v....>.v.vv>...>vv..v.>..>>>v>>.>.......vvv>..>...v.v..>
..>..v>>....v.>v.vvv>.....v>vvv...>v...v>...v.>......>.......>..v.v>>.>.>..v>.vv....v.>v>.vvv>>>..v....v.v>....v>.v>..v.v....>>....v>>...v.
..vvv>.>.v.v....>..v.>v.v>>...v.v>v.....vv>>v>vv...>.>vv.>...v>.>.>.>.>vvv>.>..v..vv>......v..>>.......v>>v.vv>.v>..v>.vv....v...>..vvv.>v.
..v..v.v.v.....v.v>......>.>vvv.v>v.>>......v.v....>>>>..>>...v>vv>......>>v..v>.>v.>vv..vv..>>>>..v>.v>>.vv...v.>>....v.>>..>>..>....v.v.v
>.v>v>.>>..>>>>>v.....>..>...>vvv>....>vv>v>>..vv.v..>.v.>.v.vv..>..>....vv.....vvvv>..v.v....>.>.>>>.>..vvv...>.v....v...>>>..>..v.>>..>..
v>..v..v.>v>v.>....vv..>...>..>.v.>>..v.v.>>v.v.v..v...>.>>>v>>..v..v...>.>....vv...v.v>..>v.v......>.>v>v.....v..v...vv.vv..vv..>...>vv.>>
>v..v...v>.vv>>>...>..vvvv.>>..>>v..>vv>..>>.>....>.>.....>v>v>>.>>v.v..v.>>v.vv..v..>.>v.>.>>..>>.v>>>vv..>.v...>..vvv.v..v.v.>.>>.v.>.vv.
..v.v.....v.v..>v..>v>vv.>.....>.>v....>vv.v...v..v.>.>>.vv.>...>..>....>..>>>vv....>..>v...vvvvvv>.vv>..v.>v>.>..vv.v.v>>..>v>.>v>.vv.>vv.
>.>vv>>>>v....vvv>>.>vv>.vv>>...v..>>vv>...v>.>>v..>...>.....v>.>v.>.>v.>v>v.v.>v.>..>.v>.v...vv.v>>..vv.>>vv.>>.v..>...>>....v.v.>v.v>..>>
>v.>>v>v..>>....>.v.>..>.....>.v>v.....vv..v..>...v...>v..v>..>..v.....>.vv>.>.>.>..>.....v>.>v...v.v.vvv>>.>>vv>..>>>.>>.vv>..v.>>.....>..
>>.>.>...>...v.>..v.v.v.v.>.>v.>.>v.>..v.v.vv>.v....v.vvv>v.v.....v.v>..v..v..>...>..v.v..>.>>..>>.vvv..>..vv.>.vv......>.>>>>.......vvv.v.
.>>>.v.>>..v.>.>....vvvv.vv.v..v>.v.>>v..>...>...>...v.>.....v...v..v..v.....v>...>>>>v>v.>>.v>v>.>..>..>.vv.v.v.>>....>>>...>v>.>..>....vv
.v.....v>>.vv>.>>v..>>>..>>.v........>v.v..>.v..>>.vvv......v>..v.v>.v.>.v>v>>.>.vv>...vv...>v..>.......>>v>.....v.>.v.>.....vv>....v.>..v.
>vv..v>.>.vvv>......>..v..>..>.vv.vv...>.vvvv.vvvv>>...v.....v..vv>v..v..>.v>.>>>v.>.v...>...v>....v.>..vv....>>>>v....v.v>.v>>.>.>.>vvv.vv
...>v.>>v.>...>..v.vvv>v...>.>>.vvvv.>v.v..vv..v.v>..vv...>.>>>...>..v>>.v.v.>v.......v.v>>..v>..v.v..v.v.v>v.v>......>.v....v.>.>vv......>
>>.vv>>..>...v.>>..vv>.v>v.vv.>.v.>v..vv.vv>....>.v.v..v..>v.....>>>>...v..>vv..>..>v.v>.v..v..v>.v..>vvv...>v>>.vvvv>.v>v.>..>.v...v>>v>.>
...v.vv>..>>vv.v.>..v.v...>..>...>>>>...v..>>.....>.....v>...>...>v>.>..v>.vv.v.>.>...>>>.....>.>>v..v.>...>.>.>.v.>v.v>>vv.v>vv....vv.>..v
vv>....>.>..vv>.>...>>.v.>v>..>>>.v....vv.>.v.v...v>v.>.>vv>>v.>v>v>.vv...v.>.v>.>>.....>>>..v>..>.....>vv.........>v.>vvv>..v>>...>v...v>.
.>>..>..>>.v>v..>.>>..>..v.>>>.v>..>v...>........>v>..>.v>v>v..>...v.v....>..>.>vv.v..>v...v.>>>.>vv..>.v.v.>...>.>>...v..v.v>....>.v..>.>.
>..>v>v.v..>vv.v>v..>.>v>v....vv.>.>.>.>.v.>>...v>.>.>.vv>.>.>>>>>v...>..>.v>vv.>>..>>>...v.>v>..v>....>...>>.v.>v.vv..>>>>....vv..vvv.>.>.
vvv.>....v>v.v....>>>>.....v>v>v>v.v..>.>v.........v.v.v.vv>v.v....>..v...>...v..>...v.vv..>..v>v..v....vv..>.v..>.>v....v>>..>.>.v.>>.v.>.
v....vv>>.v..v.v>.vv..>>>..v.v>..v>.v.>..v..>>>v..>>.v>v>>>>vvv>.v>..v..>>.>v..v>>v......>....>v.vv..>v.v.v......v...v.>.v>.>.>>>>..v>>.v..
>.v..v.vv>....>>vvv.vv..vvv.>.vv.>.v.>v.>.v........v.v....vv.v...v.>.v..>...>..vv...v....v.v.v.v>v.>v.vv.v>..v>.v....v>.>>.vv.>.........>.v
>>..v.vv..v....>vv.v>vv>v>....>....>v..>..>vv>..>>v>..>v.v>..>v..>v...vvv.>v.v.vv.v....vv..v>vv.>v....>.>>>....vv.v>.vv>>>...v.>v.>>>>>.>.v
.v.>....v>.v>>.>>...>vv......v.>...v>>v>.vv.>.>v..vv>>vv.>v>>.v.v....>v.v.>..v>...>.v..v.v>>.>v..>v..>>vv>v.>.>v>v......>v>...>.v.>..>..>.>
..vv.>>>v>>>...vvv.>..v...>v..>>...>v..>vv.>>v.v..>>..v..vv.v..v..>v>v.v....vv..v....>>.......>.v.v..v.>........>.>.>...>v>.>v...v...>.v>>.
v.>.....>.v.v>....>vvv..>vv.v>.>vv.vv.>...>vv.v..>v>..>.v.vvvv....>vv......>....v...>.>.v...>.v....>v>...v>.v.....v.v.....vvv>....>...v.>v.
v...v.v>>.>.vv..v.........>v.>....v...>...v..>>......v..>.>.>.v>...vvvv....vv..v.....>..>.......>..>.v..>..v>..v>.............v>...>.....v>
>.>.vv..>..v>.>>.v>v>>.>..v.....>v>.>.vv.>...v>...>v>...>.v..v>>......>v..>..v>v.v>v>.>v...v>.>..>.v.>.>v>>...v..v.v..>v.vvv>>..>v>>v......
>vvv.v.>.v>..v>>>v.>vv.....>v>>>..v...v>>v>>>v>>.>v.v.>v>>vv..>v>>v>...>vv.vv.>...>vv>.v>.v>vv.v.v>...>..vv...v....>..v.>>.v.>>>vvv.v.v...>
v..v..vv.v.v.>>..v..>.vvv...>.v.v..v..vv.>v>vv.v.......>v>.v.v.>.vv..v.>vvv>.>>>.vv.>...>>.>....>>>..v...>v.>....>.v.v>vv.v....>v>vv....>v.
.v.v.>.v.v>vv.>>.vv>>.v>....v..>vv.vv>......v.>v>...>>..v>..v.>.v.v....>.>vv.v.....>.v.>>.>>.>..>.v..>..>....v....>..>...v>.>>..>.v.vvv..>.
vvv.>>>v.v.v>>..>>>>.>.>.v>.v....>.>vvv>>>...v..v>v.......vv>.>.v.v>....>..>.v>v.v.>vv>vvv.v..v.v.v..v....v.>..>v>vv.v>>.......>.>.>.....v>
>>.vv>.v>.v.>v..>...vv.v..>>....>>v>.v....>.>v..v...v.vv......vvv.>>..>.>..>.>vv>.>..>.v>>..>....vvv>..v.>.v.>...v..>v..>.v>.>v...vv...>.v>
.v>>>.v.vv..>..v>>.>>.....>...vv.v>>.vv>..v>v....vv>.v>....>v....v>>>>.>>>.v>>.>.v.>>.v..v..>>...>..........>>.>>..v..>...v..v>.>v....v.v..
.v.>v>>...>>..>>..vv.....v>>>.vv>.v.......vv..v..>>>v..v.>.v..>v.v...>.vv....v>.v.v.>.v.>..>..v.v.>.v.>v.v>vvv>...v..>v>>v..>>....v..>.v.v.
v>>v..>>vv..vv.>>...>>..v...vv..v....>.v.v>>.>..v.v..>.v>...v........>v>.v.....v>>..vv......v.v.>.v..>.......vvvvvv..v.v>.v>vv>..v>.>v..v>.
.v.>....>.v.>vv>>..>.....>v>.v>.>v.>v...>...>>..v>>>>..v.>..>.>..>>>.>.v>.>>v>.vv>>v..v...>.>v.v>.v...>..v.>..>>v...v>.>v..v>>v..v>v.>v...>
.>.>...>.....vv>.>v..vv.>v>v...v>...>>v>>....>v..v>.v>v..v..v>>..v.v........>>.>.v>.....>>v>..>..>....>>...v.>v>vv>>.v.>>..v>...v.v.v.v...>
..v>.>..v>vv.>>..>>>.>v>vv>>v>vvv.v....vvv.v.....>v.>v.vvvv.>>...>.>.....>v.v..v....v>.>>.v.v.v.>vvv>>>v>.....v.v>.....>>......vv.v.>>vv>..
vv>....v....v..>>vvvv>.vv.>v..>.>vv>v.........vv>>......>.v>>.v>.v....>v...>>>.>>..v....>>v>v>>v......>v.>..vv.>.v>..>.>..v..>.v>.v.>...v..
>>...>..>>>>..v>..vv.>...v.v..v>.v>v>v>v.>>>..>v.v..>v.>vvvv>vv.>v>>....>>..v.v>.v.v....v.>vv>v..>vv.v>>.v.vvv>v>v......>.>..>..vvvv>..v..v
>..v....v>>>v>>>.>..>.v.>...v>.>v..vv..>...>vv..vv.......v>>>>v>v>..>v.>...v...v.v......>.....>....>v.>...>>>vv..>.>..>..v.>.>>..>.>v..v.>>
v....>...>>>...>........>>>vv.>>v...v..v>..>.v..v>..>.>.v...........>.v..v>>.>>>vv..>>v..>.vvv>vv.v>>.v.>v>.>.>.>>>>.>v..v.>...>.>>>v.>.>v.
.v>>.......v.v.v.>v.v.vv...v>>v.v.v.v...v...v...vvv....>.vv>.vv.>....>>..>...>.>.>v>.v...>......v..v>v.vv...v>>.v..>v.>v..>v...>.vv>>..>vvv
>>....v..>.v..v>vv.>>...vvvv..v.v..>.>..vv>vv.>.v...v.>v>.vv.v>.>.....vv>v..v.v>>.>...>>..>.>..vv.....v.v.v>.>>.v>>v>>vv.>v>v.v...v....v..v
>.....vv>.v>>v.>>>v.v.v.>...v.vv>vvv>vv>v..>...v.>.>.>...>>..>v..>.>.>>v...>...v.vv>v..vv>>>>.v...vvvvv>..>v>.>.v.>..>.vv>>vv......>>.>vv.v
...>.vv....>.>.>v.v.>..>>.v>..>v...>....>.v>..>...>v...v>.>v>>v..>.>.>.>.>....>>vvvv.>>v>.>v>>.>>.>.v.>..>....v....vv.>...>>>..>.>vvv..>>.v
.v>..v.v..>.>>.v>vvvvv....v.>.>v.vvvv.v....v.v...>.v>.v>..v>vvv>>...>v>v...>.v>.vv.v>>.v>.>.....>.vv.>>>..>..v>>..>..>.v>v..v......>..>v>..
v>>..>v.v.v>...vv.vv.>>>v>..>.v...>..>v...v>>>vv>>>>v.vv.>v>.v.>...>v...>..v....>..vv...v>>....>v......>..>>.>..v>vvvvv...v>..>.>.>.>v.>v..
v..vv>>v>..vv..>...v.>.>..>.>..v..vv..vv.vv>.>>.v.....>.>.>.>.v..vv.v.>..v>..vv..v>.vvvv.>...v.....>>vvvv...>v>v>v.vvvv>>.>v.>>vv>......>..
>>.>..v..>>.v>.v..>.>...v..v.>.>.v>.>>v>...v.>.>..>>.vvv>>v.>..v...>>..v>vv>.>vv>..>v>..v.>v.v......>>vv>>vvvv.>v>.>.v>vvvv.v.....>....>v.v
.>>..v>.v.>.v.v>..v>>...v.>vv.>..v.>>.v>.....>.v.>.>.......>.v..vv..>....v..vv.v.v.>>v.v>..>.vvv.>>..>v...v>v.>>.v.>.>.>..>.>..>..v>.v.>..v
.vv>>..>...v..>v......>.vvvv>>v>>.>...>>>.v...v.v..v>.v..v>.v..v>v.>v>.v.>.>>.vv>..v>>.>>>.>.>>...>..v.>v..v>.v>..v>v>vv...>vv....>.vv>..v>
..>v>..>v.>.v>v.>>..>.>.v..vv.>..vv.>..v.v>v.vvv..v>.v>>..v.>.>>.>.>v.>v...v.v...v.>.>....vvvv.v.v.>v.v.v.>v.>vv.v>v.v>..>>v.>>>>..>.>>>...
...>.v>.>.v..v>>.>v>>...>..>...vv.>>v...>v...v>>>..>v..>v.v>.vv>vv..>..>v.>..>>.....>.v.v>.v.v>.v...>.v..v.>.>..v...>v..>.>.>>v.>...>.>...v
.......vv....v.>>v>.>.>....>.....>..vv.v....vv>>vv..v..>v..vvv>.v.>v..>>..v.>.>.>......>>..v.>.v....v.v.v>...>...v.v>>>v>>.>.>.vv.....>v>.>
..>..>>.v.v.v>...>.....v>v.>>...vv.>.>..>....v.>.>.>>v.v.v>v...>>.>.v>>..>>....vvvv>>>.vv....>.>.....>v....vv.v.v..v>v...>>.v>vv>v.>>..v>..
......>v.vv...>v.>.v.v...>...v...>>...>v..v.v...vvv.>>....v..v>v....vv>>>>>..>..v.>v>>.>.v>>v.>..>v...>.>.v...>v...vv.v.v.vv>.>...>.v..vv..
.>>.>.>.>.vv>>v........v.v.v>.vv..vv...>...>>v.v.>>.vv..v..>..>...>v..vvv.>>.v.vv.v...>>.>>>v.v.>...v.v..>.vv>...v..v.>...>..>v....v.v..>>v
>v....>v...vv..v>.v.>v>..v>.>......v....v...v..>v>..>...>.v.>.>>>.>v>>>..v>v>>.v.v.v.v....>v.vv.vv>.>>>>..>.v.v...>.vv>.....v>>..v>..vv.v.>
.>v.>.>..v.>>>>.>vv>..vv>v.>.>.>>..>>...v>v>....v..v.>v.v.>.v...vv..v.>.v..>.>.....>.>.>vv>.v.v.v...v..v..>.>v.>>....>..>>v>v.>v..>.v>>>vvv
>>vv>...>.>v..v..........>...>..v>........vv..v>v>.v.>>v>>>.>vvv..>..>.>>.....v>.v.v.>.v.v.>>>..>.vvvvv.>>.v.vv>>.v..vv>v...vv>..>.v.>>>>v.
.....>..v>.v>>..>...>..>v>>.vv>.>v..>.>>.>v...v>..>.>>..v.v.v.v..>>>.>>v>..v.>..v.v.>>.>>vv..>>....vv.vv>>v..>...>>>...v>....>v.>.vv...>>..
..>.vvv>>.>.>v.>.v>.>>v>.v.....v...v...v..>v.>v.>.>...v.>..v.>v>>>>>.vv.v...>>...>>v.v...>...vv.v.>v>vv....vv>vv>.>>>.>..vv>.v>..>.v.vv.>..
>>v...v>.>.vvv>...>.>...vv.>..>vv....v>v...>..v.v.v.v>v....>...>..>.v>>..>.v..>.v......>.>>>>v>...>v>.>>.v>..v.>.vv>>.vvv.>>.>v.>..>.vvv>v.
.>.v...v>...>v..vvv>.>...>...v....>>.>.v..v....>>.>....>>..v....>>vvv>vv.vv...>...>.vv...>v...>.vvvv>..>vv>v..v..>>v..>.vv.>...vvv>.....>..
.>vv>....>v..vv...>>v>.v...v.>..........>.v>.v..v>.v..vv...v...>>>.>..>..>.>.....>.vv>vv>.>.v..>v>>.vv..>..>vv.vvv.v>....vv.v..v.vv.>v.v.v.
>...v.>>>vv.>..>v>vv>....v..vv.>.>.v...vv..>v>...>.>.v>......v..v.v.v>.>.v>.>.v.vvv.>>>.>.v>.vv.v.>v>>v....v>.>.>...vv>>.vv>.v>..>.>...v.v.
.v..>v...v..v..>>...>.>...vv..v.....v>>v...>vv..>..v...>.>>v...>>v....vv........>>v>..>>..>.>..vv.>v.vv.v..>v>vv....>....v..>>....vv.v..>v.
>vv..>v....>...vvv.v.>v.v..>..>..>...>..>>v>.v..>>>.v.>.>...>vv...>v.>>.vv.>>>>v>.v..>v.v....>.>>v.v....>v..>>>..>.>.v>.>.v>...v..v.>>v>v.v
.>>v>.vvvv.>v>.>>.....>....v.........>>>vv>.>v....>.>.>.>..>..>>v..>....v.>>.>.v...vvv>..>..v..>v...vv>.v>v.vvv...vv...>.v....>v.v>>>v...>v
.v.vv...>v.>>.>.>..>v.v>vv>>vv.v.v.v>...v....v.>>.>.>.....>.vv.>...>>>.v>..v.>vv>.v>.v.>>v..........v...v>>.v.v.....v..v>.>..>>>>v.>v>.>.>.
v...vv..v..>.>.>>v....>...v..>.>.vv.v.>..v....>v.v.>.v.>>v>v>...v.>...v..>v>..v.vv...v...v.vv>v..>.>...>..>.>.v..v>..v.>.v>...v.v..>.vvv>.>
..v...v.v.v..v..vvvvv....>vv..vv..v>..vv.v.v...vv>....v.>vv.vv>vv...>..>>>.v.v.....v...v..>..v...v..>..>>.>>v......>.v...>.v>.>.vv>.v...vv.
v..>v.v.v>>..>.....>>>vvv.....>v>.>.>>v.v>v..>v..vv..>>vvv>>>.>vvvvvv>..>v.>..v...v.>...>vv>>v>.vv.>v..v>.vv....>v.vvv>v..v.>>..>....v..>.v
>v>.v..v>>..>v.>.....>v..v..vv..>..>>..v..v>...>.>>>.....>>..>>v....>..>..>.....>....>>>.>......>....>.v.v....v.v>.>..v>v.>v.>v>.>....v....
.>.v.v...>.vvv>..v>.v..>..>.v.....>v>vv.v.v...v...v>>....v.>.v.v....>....vv>...v.vv>.>v.>>..>>..vv>.>...vv>>v....>..>.....>v..>vv.v........
..v....v...v....vv.>>v.v.vvv..>v..>v.v.vv.vv.v>v>>>...>v.>.v..>.v>>>>..>.>.>v>.v.>..vv.>v.>v.>...>.v.>..v....>vv.v.v..v..v.v>...>>.vv.v.v..
..v...>>vv>vv.>v>..............>v.>>>v..>vvv.>>.>...v.>vv.vv......>.v.>vv.>v.v....v>>>..v.>...>>.v..>v>....vv.v.vv..v.v>vv..v>.vvv>.>>v.>..
>v..>.v>..>v..v...>.v...>v>>...>.>v>.>>....>v.>..>v.v>...v..v>v>..>vv>...>....v>...v..v>.v.vv>v>v.v.v..v..>.>v>.>...v.v....>.>.v..v.v>.vv..
>.v>v..>..>>v....>v.>v.>.>>.vvv..vv>v.v..>.v>>>>..>..>v.v..v.>.v.>>v.>>.>v>.>>v>...>v..v.>vv..v.v.....v...v>>.v>.>....>v.>vv..>..v>vv...v..
.v..>..>vv.>>v.v..v...>.....vvvv.v>....vv.>>...>..>.v.vv.>>>.>>vv.>....vv.vv.v.v..vv.v.v>>.v....>...>v..>>..vvv..v...>v.....>vv..>...v>v...
.vv.>.....>..vv>>..>v..>>.>.v..>vv...v...v>v.vv...>.>..>>v>..>>.....>.>..>.v....>>v>..>..>.v.>..vv>........>v.v.>vv.>>.>..v.v>>>v..>>.>.v..
>>v.....>...>>v.vv.>.v.v.v.>....>.>v.v...>...>>vvvv>.vv>vv>.>v>>>.vv>..v>...>.vv.v.....vvvvv.>.v>...>....v...v.>>>>>.v.v.>.>..v.vv.>vv.vv.>
.>.>.>v>>..vv...v.>.v....>>...>>...vvv>.vvv..>.>..v..>>...>.v..>v....>>.v...v>.v...........v...v.>...>v>...>>vvv>v...v.vv..>.>.v..v.v.>..v>
vv....v..v.v>.>>....>>...v..v...v>.v>>..>v.>..>..v>..v>.v>.vv.vv.vvv>v..v...>.vv.>v...vv.>.v..v>...v>..>v.v.>.vv...>>...v>v.v...v>v....>.>>
..>..v>.vv.vv>.>...>.>....v.>.v>....v..>.vv...>....>.>....vvvvv>..>>v.....>vv.v..>..>v.....v.v...>.v>>...>>....>>vvv....>vv....v>v>v.>v>>>.
..v.>>..>>vvv>>>>.>.v>>v.>v>>.v>>>vv.>...>..v.v.v......v.vv.vv>v...>.v.>>vv.>>>.v..vv>v..>>>.vvv.>.v>>..>.>.>>v.>.vv.>v>....>vv..>>.>.>....
v.>..v>v.>>>..vv.v.>.>v.v>v>.>.>>.>vvv>>>.>.>v>.....vv....>v...>v.>.>.vv.vv>..v>>>.v.vv>.......v.>.>vv...>>..v>v....v>...v>.....>.v>.vvvv..
vv....>>...v..v..>>>v....v.>v>vv.v.>.>.>...v.>v>vv..>>vv>..>...>.v>...v>v...>v>....v.>>v>v..>>vv>>v..>>..v....>..>v.v..v...>.vv.>.>v..>v>>.
>v..>..vvv>..>vv>v.>.>.>....v>.....v.v.>vv..>..vvv.>.v>v>..v.>..v.>...v.>>vv>.v.>v.v..v.v.>>>v>v...v..>v>>v>.v...>.vv.v>.>.v.v...v>...>.>>v
.>>v>.>..v.>>...>.>.v...>v.v>...>.v.....v..v..v..v.>......>...>....>v.>..v>v>v.v>>.>..v.v>v>...v.>.v.v...v>v.v.....v.....vvv.>>..>>>...>..v
v..>v..v.v>.>.v>...>..v....v.....v.>..v>>v.v>v.>>.>v..>.>....v....v....v.>>.....>.v>..>..>vv>..v.>v>v>vvv.>>..v>...vv..v>>v.v.v..v.>.>v.>>.
v...v>v....vv>.>>..>>>..v..>v>v..>.vv..v.......>>>vvv..>.....>>.v...v>.v.>.>v.v....>.vv>..>.v.>>vvv>>......v.>....v.v>>..vv>v..>>.v...>>...
>.>>>.>v.....v.v>vv..>...>.>v.....>....v..v...v.>.>v>>........v.v..>>..>vv.>>v.v..vv...v>.......v...>>>v.v.v..v.v>>..>.>..>>......vvvv.>>.>
v.v.v..v..vvvvv..>.v>.vv...>>.v.....>.......>>vv>..>.>>.>>...>.vv>v>v>v>v.>...v.>.vv>>.>..v..vv>v.>v.v.>v>.v..v>.>..>v...vv>.>......vv>..>>
>v>>..>.>.>..v>>v>>.>...>.>.v.>...>..>>>v>.vvvv..v..vvv>vv.>v>>...v....>v.>..>.v..>.>>v..>v>>.>......>vvv....>vv.>v...>.>v.>v.>.v...>vv>v>.
v..........>v>.>....v....>>vv.vvv........vv.v.v...>...vv.......>v>.>..v.>.>vv>vv.v..v.v.v..>>.>vv...>>....>>v.v.vv>v..vv>vv...v>.>.v>vv..v.
>.v....>vv>v>.vv>v...vvvv...vv>>vv.v>.>.vvvv.v.>.>..>.....>...>..v..v....v>.vv..v......>..v>.......v>v.v.v.>..>v..>>.>...>v.vvv..v....vv.vv
>>>v.vv..>v>.v>.vv.>>v...>..>>v>.v..v..v.....>>>..>>>..>.v>v.>..>.>>..>>..>vv.>..v>.v.>...vv>.>...>v>>..>>>>..>vv.>>>..>v..>v.v>...vv.v.>.>
..v.vv>.>>>v..v..v>>v>..>.v.v.v..v...v.v>..v..>....vv.v>v.v>v..v..>v.vvvvv.>.v...>.>.>>>.vvvvv.vv.vvv...v.....v....v......>.....v>vv.vv.v>.
v.v..>.v.>v..v.vv>>.vv.>.>....>vvv>..>.>.v..v.>....v.....v>v.v.vv.vv>>v>>..>....>.>.v>.vvv..>.....>v....>.>v.>>..v>>>>>v.>...>..v.v.v.....>
>.v.v..>......v.>.>>.v>v>>.vvv>v>....vvv.....>.>.>v>.......>v...>>....v..>>v..>>>.>vvvvv.>.>...v..v>.v...v>..v>...v..>.>vv..v..v.v.>.>.>>vv
>.v.v>>v..>>.v.vv....vvv......v....>v>>..v.v..vv.v>v..>v..vv..>>.>>.>v>......v.v.>v....>v.v>.v....>>..>>>v..v>...>v..>..>.>.v..>..>>.......
>..>.>.....v>..>...v.vvvv..vvvv.v>.v......v.v....>>v....v.>...>>>....vv...>vv.vv..vvv.>v>.v..>>>.v.v..>....>.v..>.v..vv.v.>..vv...>>v>..vvv
.v..v>.v>>v>.>.vvv.....>>.>>.>v..vv>v..v.>.>>.>vv>.v.>.v>..>>..>v......v>>v.v>.>.v..vv..vv...>.vvvv.>v..v.v.>v.>vv.>.vvvvvv.....v.>..>>.v.v
vv...>v...>v>v..vv....>.....>>>v..v>>v.v>>..>..v.v.>.>..>.>.>..v..v.v>...>...>.v.v..v>>.v>v.v...v..>.>.v.>>>>v....>..>v>v.v>v.v>.vvvv...>v.
.vvv>v.>>>>.>...vv>.v.vv....>...v.v......>>..>>v>....>>..>v.>.>.>>>v.v>vv......vv.>.v..>...v.>>v.>.v.>v..>v..v.>..>.>vv.v.v.v...>....vv....
vv.>....vv.v>vv>.v>....v>>......>..vvv..v.vv.>v......>>.......>.vvv>.>..>...>v.v...>v>>..>>>>.v.>.v....>...>.>v>v.>v..>vv>.>.v..>.v......vv
v..>>..>.....v>..>.>.v>>v>.>...>vv.>v..vv.v.>v.>>.vv>..v...>>>..v.>v>>>...>.v.>..v.>>vvvv..v.v.v..vv.vvv...v.vv>.v....>....vv.>vv.>........
.v>v.vv>>vv>......vv...>>v..v>...>.v...vv...>v>..>..>>>>...>>.vvvv.>...>..v>vv...>..v.>>vv....>.vv..>.>...>......v>>..v>.>..>.>>>.v>>..>.v>
v.....>>.>....v>>.>>>>.v>>......vv.>...>vv..v.v..v.>...>...>vv.>.v..>>>.>...vv.v...v>v>....>.vv.....v.....v>.v..v>vv..v>>.>.vv>v....v>>>..>
....>vv>..v>.v>>...>.>>>>>v>>...>..v..>.>..vv>>.>vv.v.v.>.vv.>>..>....>>v>.vv.>.vv.....v>..>v.v.>......>v>.v>>vv.v.>>..v..vvv.>v.vvv>..>v>.
.....>.v.>>.>...>.v..>v..>..>>....v.v.vv....v.v..v.>>.v.>..>v>>.>.vvvv>...>v.>v>>.>v.>>v>>...>..v.v.vv....v...v.vvvv>>>>>.v>>v>.....>..v.>v
>.vv>..>..>v..>...v>>.>>.>...>v>...v.>v..>...>...v.v.>.>.vv.>.>...>...vv...v.>>>v........vv>>...v.>.>>>v.vv>vv...vv..>..vv>vv...v>>v.v>...v
vv..vv>.>..vv..vvv>..v..>.>v>>.>..vv>.v.>>vv..vvv....v..v.v>.vv..>...vv..v....v.v>v>v...v>>.........v..vvvv.vv...vv.>v>..>.>>vvv>>.>..>vv.>
>.>>vv>.>v.>>..v.vv..v......>...vv>.v....>..>.>>..>.v..>v.>..>vv.v>...>..v>v>>..>vv..v.v...v.vvvvv>v.....v.v>....>v.vv.v>....v..>vv>v..>.v>
v.>v>v.>..v>.v.>.>.........>..vv>.....vv.>.v.>.>v..v.v>......v...v..>..>>.vv...>>.>.vv.>..>......vv.>..v....v...>.>.>v>v.>.>.vv.>>>>.>..>.>
.v..vvv>>..v.vv.vv>>....v....v>v.>>>..>>...v...>..>...>>>...>vv.>..>>v..v>.v.>.>.>v>v.>v>>>vvv.v.v>>v....>...>>v.v>>>.v..v.>.>v.v>>v.vvv>>.
.>>.v.vv.>v..>.v>.>>....>.......v...vvv>..v.>>v......>..vv>>v.>...>>..>...v......v>vvv..>v....v.v..v..v.v....v>>v.vv.v.>..>>..>.>v>v..v..v>
v.v..>>.>..v.v.v.>>v>>v.vv.v......v.v.v.v..v...v....vvvvv>>..>.v.>v.>.>vv>.vv.>>>>....v.>>>v...........v.>...>v.v.vv.>......>.v....>.>.v>..
v..>>>>.>.v.>..v..v.....v>>v....v.vv>v>>vvv..>v>v..v...vv.v.vv.>v>.>.>.>>.v.>v..>..>....v>v>>..v.>v......v>..v>...vv>>v.v>vvv>..vv....v.vv.
>..>>..>v...v.>..>v>>>..>.v.....v..v.......>v>..>>v.>...v.>.....vv....>>..v...>v..>v>...v.v...>v>.>.v....>...>.......vvv.>v>>..>..>....>>vv
v..>...v....>.>vv...v..v>v..>...v.....>..>>.v...v>..>>>>>>>.v.>>>v.vv>..v.v>v>.>v.v.>>..>.....>..>..>>v....v...v.>>>v..vv..vvvv.v.>v>v..vv.
.>vv>.>....>.>...>>v...>v....v......>vv.........>>..>>.>vv>...vv.>..>v....>.>v..>v..>.v.v>>v..v>>>.>>....>vvv>..vv..>.>.>>..v..v>.>v..>>vv.
.v.....>>vvv....>v>....>..vv.v..>v>.v.....v>v>.vv.v>>v.>.>v>v>.>>..>>vvv.>>.vv.>>.>v.>>>vv..>......>v>>vv.>v.v.v>....v>vv>.>.vv..v>v.>...v.
>>>vv....>>..v..v>v..>......>>...>>..>.>>vv.v>>....v>......v....vv..>vv.v>.>..>>.>....>>vv.....vv>.v...vv..>.v.....>>..>..v>.....v>...vv>.v
..>.vv.>.>v....vv>....vvv>.>>>>..>>>.v...>v>>..v>>..v...>.>..v.>..vv>.vv..vv>..v..>...v>vv>vvv...vv.>vv>>>.>v.>>..>.vvv.vv>....>.vvvv.>.>.>
>>v.>.>v>..>.>>>..v.v...vvvv>.>..v.>>.>>.v>..>>.v...>>v.>...v..>.>.vv.>>..vvvv.>.v>....v>v>>vv.vvv>>.>.>.v.v>>..v..>..>...>vv.v....>vvv>..v
vv.vvv.>.v...>v>v>v.>.v>.v....v.......v>>>>.>...>v.vv>..>>>.v.>v>v>v.v>v>v.v..>v.>v....vv..v>>>vv....>...v>.>v.v>..>v..>.>.>>>....vv>>v>v..`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 58;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 321;
test(func, input, expected, testNum, lowestTest, highestTest);