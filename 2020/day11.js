// --- Day 11: Seating System ---

// Your plane lands with plenty of time to spare. The final leg of your journey is a ferry that goes directly to the tropical island where you can finally start your vacation. As you reach the waiting area to board the ferry, you realize you're so early, nobody else has even arrived yet!

// By modeling the process people use to choose (or abandon) their seat in the waiting area, you're pretty sure you can predict the best place to sit. You make a quick map of the seat layout (your puzzle input).

// The seat layout fits neatly on a grid. Each position is either floor (.), an empty seat (L), or an occupied seat (#). For example, the initial seat layout might look like this:

// L.LL.LL.LL
// LLLLLLL.LL
// L.L.L..L..
// LLLL.LL.LL
// L.LL.LL.LL
// L.LLLLL.LL
// ..L.L.....
// LLLLLLLLLL
// L.LLLLLL.L
// L.LLLLL.LL

// Now, you just need to model the people who will be arriving shortly. Fortunately, people are entirely predictable and always follow a simple set of rules. All decisions are based on the number of occupied seats adjacent to a given seat (one of the eight positions immediately up, down, left, right, or diagonal from the seat). The following rules are applied to every seat simultaneously:

// If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
// If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
// Otherwise, the seat's state does not change.
// Floor (.) never changes; seats don't move, and nobody sits on the floor.

// After one round of these rules, every seat in the example layout becomes occupied:

// #.##.##.##
// #######.##
// #.#.#..#..
// ####.##.##
// #.##.##.##
// #.#####.##
// ..#.#.....
// ##########
// #.######.#
// #.#####.##

// After a second round, the seats with four or more occupied adjacent seats become empty again:

// #.LL.L#.##
// #LLLLLL.L#
// L.L.L..L..
// #LLL.LL.L#
// #.LL.LL.LL
// #.LLLL#.##
// ..L.L.....
// #LLLLLLLL#
// #.LLLLLL.L
// #.#LLLL.##

// This process continues for three more rounds:

// #.##.L#.##
// #L###LL.L#
// L.#.#..#..
// #L##.##.L#
// #.##.LL.LL
// #.###L#.##
// ..#.#.....
// #L######L#
// #.LL###L.L
// #.#L###.##

// #.#L.L#.##
// #LLL#LL.L#
// L.L.L..#..
// #LLL.##.L#
// #.LL.LL.LL
// #.LL#L#.##
// ..L.L.....
// #L#LLLL#L#
// #.LLLLLL.L
// #.#L#L#.##

// #.#L.L#.##
// #LLL#LL.L#
// L.#.L..#..
// #L##.##.L#
// #.#L.LL.LL
// #.#L#L#.##
// ..L.L.....
// #L#L##L#L#
// #.LLLLLL.L
// #.#L#L#.##

// At this point, something interesting happens: the chaos stabilizes and further applications of these rules cause no seats to change state! Once people stop moving around, you count 37 occupied seats.

// Simulate your seating area by applying the seating rules repeatedly until no seats change state. How many seats end up occupied?

// --- Part Two ---

// As soon as people start to arrive, you realize your mistake. People don't just care about adjacent seats - they care about the first seat they can see in each of those eight directions!

// Now, instead of considering just the eight immediately adjacent seats, consider the first seat in each of those eight directions. For example, the empty seat below would see eight occupied seats:

// .......#.
// ...#.....
// .#.......
// .........
// ..#L....#
// ....#....
// .........
// #........
// ...#.....

// The leftmost empty seat below would only see one empty seat, but cannot see any of the occupied ones:

// .............
// .L.L.#.#.#.#.
// .............

// The empty seat below would see no occupied seats:

// .##.##.
// #.#.#.#
// ##...##
// ...L...
// ##...##
// #.#.#.#
// .##.##.

// Also, people seem to be more tolerant than you expected: it now takes five or more visible occupied seats for an occupied seat to become empty (rather than four or more from the previous rules). The other rules still apply: empty seats that see no occupied seats become occupied, seats matching no rule don't change, and floor never changes.

// Given the same starting layout as above, these new rules cause the seating area to shift around as follows:

// L.LL.LL.LL
// LLLLLLL.LL
// L.L.L..L..
// LLLL.LL.LL
// L.LL.LL.LL
// L.LLLLL.LL
// ..L.L.....
// LLLLLLLLLL
// L.LLLLLL.L
// L.LLLLL.LL

// #.##.##.##
// #######.##
// #.#.#..#..
// ####.##.##
// #.##.##.##
// #.#####.##
// ..#.#.....
// ##########
// #.######.#
// #.#####.##

// #.LL.LL.L#
// #LLLLLL.LL
// L.L.L..L..
// LLLL.LL.LL
// L.LL.LL.LL
// L.LLLLL.LL
// ..L.L.....
// LLLLLLLLL#
// #.LLLLLL.L
// #.LLLLL.L#

// #.L#.##.L#
// #L#####.LL
// L.#.#..#..
// ##L#.##.##
// #.##.#L.##
// #.#####.#L
// ..#.#.....
// LLL####LL#
// #.L#####.L
// #.L####.L#

// #.L#.L#.L#
// #LLLLLL.LL
// L.L.L..#..
// ##LL.LL.L#
// L.LL.LL.L#
// #.LLLLL.LL
// ..L.L.....
// LLLLLLLLL#
// #.LLLLL#.L
// #.L#LL#.L#

// #.L#.L#.L#
// #LLLLLL.LL
// L.L.L..#..
// ##L#.#L.L#
// L.L#.#L.L#
// #.L####.LL
// ..#.#.....
// LLL###LLL#
// #.LLLLL#.L
// #.L#LL#.L#

// #.L#.L#.L#
// #LLLLLL.LL
// L.L.L..#..
// ##L#.#L.L#
// L.L#.LL.L#
// #.LLLL#.LL
// ..#.L.....
// LLL###LLL#
// #.LLLLL#.L
// #.L#LL#.L#

// Again, at this point, people stop shifting around and the seating area reaches equilibrium. Once this occurs, you count 26 occupied seats.

// Given the new visibility method and the rule change for occupied seats becoming empty, once equilibrium is reached, how many seats end up occupied?

function countSeats (part, inputStr) {
  const inputArr = inputStr.split('\n').map(str => str.split(""));
  const h = inputArr.length;
  const w = inputArr[0].length;

  // UTILITY FUNCTION FOR COUNTING THE NUMBER OF OCCUPIED NEIGHBORS, GIVEN THE ROW AND COL OF A SEAT
  function countOccupiedNeighbors(row, col) {
    const delta = [                                       // THIS COMES IN THE FORM OF: [dy, dx]
      [-1, -1],                                           // up left
      [-1, 0],                                            // up
      [-1, 1],                                            // up right
      [0, -1],                                            // left
      [0, 1],                                             // right
      [1, -1],                                            // down left
      [1, 0],                                             // down
      [1, 1],                                             // down right
    ];
    let neighbors = 0;
    for (const [dy, dx] of delta) {                       // iterate through all 8 directions...

      if (part === 1) {                                   // PART 1: CHECK ONE UNIT IN EACH DIRECTION FOR A NEIGHBOR

        if (
          0 <= row + dy && row + dy < h &&                // if the square one unit away is in bounds vertically...
          0 <= col + dx && col + dx < w &&                // ...and horizontally...
          inputArr[row + dy][col + dx] === "#"            // ...and that square contains an occupied seat...
        ) ++neighbors;                                    // ...then increment neighbors

      } else {                                            // PART 2: KEEP GOING IN EACH DIRECTION UNTIL OUT OF BOUNDS OR A SEAT IS REACHED

        let y = row;                                      // track current position (starting at point of origin)
        let x = col;
        let go = false;                                   // track whether we have moved from point of origin
        while (
          0 <= y + dy && y + dy < h &&                    // if the square one unit away is in bounds vertically...
          0 <= x + dx && x + dx < w &&                    // ...and horizontally...
          (!go || inputArr[y][x] === ".")                 // ...and we either haven't moved yet, or we haven't hit a seat yet...
        ) {
          go = true;                                      // ...then indicate that we have started to move...
          y += dy;                                        // ...and move
          x += dx;
        }
        if (inputArr[y][x] === "#" && go) ++neighbors;    // once we hit a seat or reach an edge, increment neighbors if we are at an occupied seat

      }
    }
    return neighbors;
  }

  // FIRST, SIMULATE THE SEAT CHANGES
  const criticalMass = part === 1 ? 4 : 5;
  const changes = [];                                                         // stack for keeping track of the changes we need to make on each iteration
  do {
    changes.length = 0;                                                       // empty the changes stack
    for (let row = 0; row < h; ++row) {
      for (let col = 0; col < w; ++col) {
        if (inputArr[row][col] === ".") continue;
        const neighbors = countOccupiedNeighbors(row, col);                   // count the current seat's neighbors
        if (inputArr[row][col] === "L" && neighbors === 0) {                  // if this seat is empty, and there are no neighbors...
          changes.push([row, col, "#"]);                                      // ...this seat will be filled (push the change onto the stack)
        }
        if (inputArr[row][col] === "#" && neighbors >= criticalMass) {        // if this seat is occupied, and the neighbors reach critical mass...
          changes.push([row, col, "L"]);                                      // ...this seat will be vacated (push the change onto the stack)
        }
      }
    }
    for (const [row, col, symbol] of changes) inputArr[row][col] = symbol;    // implement all changes from the stack
  } while (changes.length);                                                   // repeat the loop if any changes were made

  // THEN, COUNT HOW MANY SEATS ARE OCCUPIED AFTER IT REACHES EQUILIBRIUM
  let occupied = 0;
  for (let row = 0; row < h; ++row) {
    for (let col = 0; col < w; ++col) {
      if (inputArr[row][col] === "#") ++occupied;
    }
  }
  return occupied;

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = countSeats;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`;

const actualInput = `LLL.LLL.LLLLL.LLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLL.LLLL.LLLLLLLLL.LLLLLLL.LLLLLLLL..LLLLLLL..LLLLLLL.LLLL.LLLLLLLLLL
LLLLLLLLLLLLLLLL.LLLLLLLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLLLLLLLLL.L.LLLLLLLL.LLLLLL.LLLLLLLL
LLLLLLL.LLLLLL.LLLL.LLLLLLLLL.LLLLL.LLL.LLLLLLL.LLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLL.LLLLLLLL
LLLLLLL.LLL.LLLL.LLLLLLL.LLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLL.LLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLLLLLLLLLL.LLLL.LLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLLL.LLLL
...L..L.L......LL.L.......L...L..LLL....L.LL.L..L.L.LL..L..L............LLL.L..L.L.L..LL..
LLLLLLLLLLLLLLL..LLLLL.L.LLLLLLLLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLLLLLLLLLL.L.LLLLLL.LLLLLLLL
.LLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLL.LL.LLLLL
LLLLLLLLLLLLLLLL.LLLLLLL.LLLL.LLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLL.LLLLLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLL.LLLLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLL.LLL
......L.L.L...LLL.LL...........L.....L..L...LL......L..L.L.L.....LL.LL..L..LL.LL......LLLL
LLLLLLLLLLLLLLLL.LLLLLLL.LLLL.LLLLLLLLL.LLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLL.LL.LLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLL.LLLL.LLL.LLLLLL.LLLLLLLL
LLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLLLLL.L.LLLLLL.LLLLLLLL.LLLLLLL.LLLLLLLL..LLLLLLLLLLLLLL
LLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLL.LLLL.LLLLLLLLLLLL.L.LLLLLL.LLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLL.LLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLLLLLLLL.LLLLLLLL.LLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLLLLLLL.LLLLLLLLL.LLLLLLL..LLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLL.LLLLLLLL
L....LL.LL.....LLL.......L.....L.L..L.LL.L...L.L..L.....L...L....LL.LLL...L..L.LL.L..L...L
LLLLLLL.LLLLLLLL.LLLLLLL.LLLL.LLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLL.LLLLLLLLLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLL.LLLL.LLLLLLLLL.LL.LLLL.LL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLL.LLLL.LLLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLL.LLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLL.LLLL..LLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLL.LLLLLL.L
LLLLLLLLLLLLLLLL.LLLLLLL.LLLL.LLLLLLLLL.LLLLL.L.LLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLL
LLLLLLL.LLLLLLLLLLLL.LLLLL.LL.LLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLLLLLL.LLLL.LLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLL.LLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLL.LLLLLL.LLLL.LLL
L....L......L..L..L.........L...LL..L..L.....L....L.LLL.L..L.LL..L..L..LL...L.......L.L...
LLLLLLLLLLLLLLLL..LLLLLL.LLLL.LLLLLLLLL.LLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLL
LLLLLLL.LLLLLLLLLLLLLLLL.LLLL.LLLLLLLLL.LLLL.LL.LLLLLLLLL.LLLLLLL.LLLLLLLLLLLLLLL.LLLLLLLL
LLLLLLLLLLLLLLL..LLLLLLL.LLLL.LLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL.LLLLLLL.LLLL.LLLL.LLLL.LLLLLLL.LLLLLLLLL.LLL.LLLLLLLL.LLL.LLLLLL.LLLLLLLL
LLLLLLL.LLLLLLL..LLLLLLLLLLLL.LLLLLLLLLLLLL.LLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLL.LLLLLLLL
L...LL..L..L..L.LL..L......L..L..LL.....LL...L...LL..L.L........LL.LL..LL.L......L..L..L..
LLLLLLL.LLLLLLLLLLLLLLLL.LLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLL..LLLLLL.LLLLLL...LLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLL.LLLL.LLLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLL.LLLLLLLLLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLL.LLL.LLL.LLLLLLLLLLLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLLLLLLLLLL.LLLL.LLLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLLLLLLLLL
LLLLLLL.LLLLLLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLL.LLLLLLLL.LLLLLLLL
LLLLLLL.LLLLLL.L.LLLLLLL.LLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLL.LLLLLL.LLLLLLLL
LLLLLLL..LLLLLLL.LLLLLLL.LLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLL.LLLLLL.LLLLLLLL
..............L.....L..L..L..L...L......L...LL...................LLLLL..L.LL...L.....L.L..
LLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLLLLL.LLLLLLL.LLLL.LLLLL.LL.LLL.LLLLLLLL.LLLLLLLLLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLL.LLLL.LLLLLLLLL.LLLLLL..LLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLL.LLLLLLLL
LLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLL.LLLLLL.LLLLLLLL
LLLLLLLLLLLLLLLL.LLLLLLL.LLLL.LLLLLL.LLLLLLLLLL.LLLL.LLLL.LLLLLLL.LLLLLLLLLLLLLLL.LLLLLLLL
L.....L..L...LL...L.L...L..L.....L..L...L....L...L...LL...L......LL..L..LL.L.L..L.L.L.L.L.
LLLLLLL.LLLLLLLL.LLLLLLL.LLLL.LLLLLLLLL.LLLLLLLLLLLLLLLLL..LLLLLL.LLLLLLLL.L.LLLL.LLLLLLLL
LLLLLLL.LLLLLL.L.LLLLLLLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLL.LLLLLLLL
LLLLLL.LLLLL.LLL.LLLLLLL.LLLL.LLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLL.LLLLLLLLL.LLLLLL.LLLLLLLL
LLLLLLLLLLLLLLLLLLLLLLL..LLLL.LLLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLL.LLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLL.LLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLL..LLLLLLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLL.LLLLLLLL
LLL..L.L.....L.....LL.L..LL.L.L......L..L.L...L.L....L.....LL..LL.L......L...L....L...L...
L.LLLLLLLLLLL.LL.LLLLLLL.LLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLL.LLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLLL.LLLLLLL.LLL.LLLLLL.LLLLLLLLLL.LLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLL
LLLLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLLLLL.L.LLLLLLL.LLLLLL.LL.LLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLL
LLLLLLL.LLLLLL.LLLLLLLLL.LLLL.LLLLLLLLL.LLLLLLL..LLLLLLLL.LLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLL
.LL.....L.L.L...L.L.....L..L..LL....LLL.......L.L.......LL...LLL...L...L...LLL.L...LLLL..L
LLLLLLLLLLLLLLLL.LLLLLLL.LLLL.LLLLLLLLL.LLLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLL.LLLLL..LLLLLLLL
LLLLLLLLLLLLLLLL.LLLLLLL.LLLL.LLLLL.LLL.LLLLLLL.LLL.LLLLL.LLLLLLL.LLLLLLLL.LL.LLL.LLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLL.LLLLLLLLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLLLLLLLLL.LLLLLLLL
LLLLLLLLLLLLLLLL.LLL.LLL.LLLLLLLLL.LLLLLLLLLLLL.LLLLLLLLLLLLLLLLL.L.LLLLLL.L.LLLLLLLLLLLLL
LLLLLLL.LLLLLL.L.LLLLLLL.LLLL..LLLLLLLL.LLLLLLLLLLLL.LLLLLLLLLLLL.L.LLLLLL.LLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLL.LLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLLLLLLLL.LLLLLLLL.LLLLLLLLLLLLLLL
LLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLL.LL.LLLLLLLLLLLLLL.LLL.LLLL.LLLLL..LLLLLLLL
.L..LLL..L..LL...L.L..L......L.L.L..L.....L.....L..L....LLL....L.......L.LLL..LL....L..L.L
LLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LL.LLLL.LLLLLLLLLLLLLLLLL.LLLLLLLL.LLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLLLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLL.LLLLL.LL.LLLLLLLLLLLLLLL
LLLLLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLLLL.L.LLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLL.LLLL.LLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLL.LLLLLLLLLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLLLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLL.LLLLLL.LLLLLLLL
LL...L.L.L..L.L..........L..L..LL.LL....L.L.L.L.LLL.......L.......L.L....L...L..LL........
LLLLLLLLLLLL.LLL.LLLLLLLLLLLL.LLLLLLLLL.LLLL..LLLLLLLLLL....LLLLLLLLLLLLLL..LLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL.LLLLLLL.LLLL.LLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLL.LL.LLLLLLLLLLLLLLL.LLLLLLLL
LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLLLL.LLLLLLLLLLLLLLLLLLL.LLLLLLLL
LLLLLL.LLLLLLLLL.LLLLLLL.LLLL.LLLLLLLLL.LLLLLLLLLLLLLLLLL.L.LLLLL.LLLLLLLL.LLLLLLLLLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLL.LLLLLLLLLLLLL..LLLL.LLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLLLLLL.LLLLLLLL
LLLLL.L.LLLLLLLL.LLLLLLL.LLLL.LLLLLLLLLLLLLLLLL.LLLL.LLLLLLL.LLLLLLLLLLL.L.LLLLLL.LLLLLLLL
.LLL..L...L.L......LL.L..LL.LL.LLLLL...L...LLLL.L..L..LLL......L...LL.....L..LLLL.LL.LL..L
LLLLLLL.LLLLLLLLLLL.LLL..LLLL.LLLLLLLLL.LLLLLLLLLLLLLLLLLLL.LLLLL.LLLLLLLL.LLLLLL.LLLLLLLL
LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLL.LLL.LL.LLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLL.LLLL.LLLLLLLLLLLLLLLLL.LLLLLLLLLLLLLLLLL.L.LLLLLL.LLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLLLLLLLLLL.LLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLLLLLLLLL.LLLL.LLL
L...L.......L..LLLL..L.LL...LL....L.....L.L..L...LLLLL.....LL.....L.L.LLL.L..L.LL.....L.L.
LLLLLLLLLLLLLLLL.LLLLLLL.LLLL.LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL.LLL.LLLL.LLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLL.LLLLLLLLLLL.LL.LLLLLLL.LLLLLLLLL.LLLLLLLLLLLLL..L.LLLLLLLLLLLLLLL
L.LLLLL.LLLLLLLL.LLLLLLLLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLL.LLLLLL.LLLLLLLL
LLLLLLL.LLLLLL.L.LLLLLLLLLLLL.LLLLLLLLLLLLLLL.L.LLLLLLLLLLLLLLLLL.LLLLLLLL.LLLLLLLLLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLL.LLLLLLLLLL.LLL.LLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLL.LLLLLL.LLLLLLLL
LLLLLLL.LLLLLLLL.LLLLLLLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLLLLLLLLLLL.LLLLLLLL.LLLLLL.LLLLLLLL
LLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLLLLL.LLLLLLLLLLLLL.LLL.LLLLLLL.LLLLLLLLLLLLLLL.LLLLLL.L
LLLLLLL.LLLLLLLL.LLLLLLL.LLLL..LLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLLL.LLLLLLLL..LLLLL.LLLLLLLL
LLLLLLLLL.LLLLLLLLLLLLLLLLLLL.LLLLLLLLL.LLLLLLLLLLLLLLLLL.LLLL.LL.LLLLLLLL.LLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL.LLLLLLL.LLLL.LLLLLLLLL.LLLLLLLLLLLLLLLLL.LLLLLLL.LLLLLLLLLLLLLLL.LLLLLLL.
LLLLLLL.LLLLLLLL.LLLLLLL.LLLLLLLLLLLLLL.LLLLLLL.LLLLLL.LL.LLLLLLL.LLLLLLLL.LLLLLLLLLLLLLLL`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 37;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 2265;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 26;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 2045;
test(func, input, expected, testNum, lowestTest, highestTest);