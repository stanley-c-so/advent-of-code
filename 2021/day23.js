/*

--- Day 23: Amphipod ---

A group of amphipods notice your fancy submarine and flag you down. "With such an impressive shell," one amphipod says, "surely you can help us with a question that has stumped our best scientists."

They go on to explain that a group of timid, stubborn amphipods live in a nearby burrow. Four types of amphipods live there: Amber (A), Bronze (B), Copper (C), and Desert (D). They live in a burrow that consists of a hallway and four side rooms. The side rooms are initially full of amphipods, and the hallway is initially empty.

They give you a diagram of the situation (your puzzle input), including locations of each amphipod (A, B, C, or D, each of which is occupying an otherwise open space), walls (#), and open space (.).

For example:

#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########

The amphipods would like a method to organize every amphipod into side rooms so that each side room contains one type of amphipod and the types are sorted A-D going left to right, like this:

#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #########

Amphipods can move up, down, left, or right so long as they are moving into an unoccupied open space. Each type of amphipod requires a different amount of energy to move one step: Amber amphipods require 1 energy per step, Bronze amphipods require 10 energy, Copper amphipods require 100, and Desert ones require 1000. The amphipods would like you to find a way to organize the amphipods that requires the least total energy.

However, because they are timid and stubborn, the amphipods have some extra rules:

Amphipods will never stop on the space immediately outside any room. They can move into that space so long as they immediately continue moving. (Specifically, this refers to the four open spaces in the hallway that are directly above an amphipod starting position.)
Amphipods will never move from the hallway into a room unless that room is their destination room and that room contains no amphipods which do not also have that room as their own destination. If an amphipod's starting room is not its destination room, it can stay in that room until it leaves the room. (For example, an Amber amphipod will not move from the hallway into the right three rooms, and will only move into the leftmost room if that room is empty or if it only contains other Amber amphipods.)
Once an amphipod stops moving in the hallway, it will stay in that spot until it can move into a room. (That is, once any amphipod starts moving, any other amphipods currently in the hallway are locked in place and will not move again until they can move fully into a room.)
In the above example, the amphipods can be organized using a minimum of 12521 energy. One way to do this is shown below.

Starting configuration:

#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########

One Bronze amphipod moves into the hallway, taking 4 steps and using 40 energy:

#############
#...B.......#
###B#C#.#D###
  #A#D#C#A#
  #########

The only Copper amphipod not in its side room moves there, taking 4 steps and using 400 energy:

#############
#...B.......#
###B#.#C#D###
  #A#D#C#A#
  #########

A Desert amphipod moves out of the way, taking 3 steps and using 3000 energy, and then the Bronze amphipod takes its place, taking 3 steps and using 30 energy:

#############
#.....D.....#
###B#.#C#D###
  #A#B#C#A#
  #########

The leftmost Bronze amphipod moves to its room using 40 energy:

#############
#.....D.....#
###.#B#C#D###
  #A#B#C#A#
  #########

Both amphipods in the rightmost room move into the hallway, using 2003 energy in total:

#############
#.....D.D.A.#
###.#B#C#.###
  #A#B#C#.#
  #########

Both Desert amphipods move into the rightmost room using 7000 energy:

#############
#.........A.#
###.#B#C#D###
  #A#B#C#D#
  #########

Finally, the last Amber amphipod moves into its room, using 8 energy:

#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #########

What is the least energy required to organize the amphipods?


--- Part Two ---

As you prepare to give the amphipods your solution, you notice that the diagram they handed you was actually folded up. As you unfold it, you discover an extra part of the diagram.

Between the first and second lines of text that contain amphipod starting positions, insert the following lines:

  #D#C#B#A#
  #D#B#A#C#

So, the above example now becomes:

#############
#...........#
###B#C#B#D###
  #D#C#B#A#
  #D#B#A#C#
  #A#D#C#A#
  #########

The amphipods still want to be organized into rooms similar to before:

#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #A#B#C#D#
  #A#B#C#D#
  #########

In this updated example, the least energy required to organize these amphipods is 44169:

#############
#...........#
###B#C#B#D###
  #D#C#B#A#
  #D#B#A#C#
  #A#D#C#A#
  #########

#############
#..........D#
###B#C#B#.###
  #D#C#B#A#
  #D#B#A#C#
  #A#D#C#A#
  #########

#############
#A.........D#
###B#C#B#.###
  #D#C#B#.#
  #D#B#A#C#
  #A#D#C#A#
  #########

#############
#A........BD#
###B#C#.#.###
  #D#C#B#.#
  #D#B#A#C#
  #A#D#C#A#
  #########

#############
#A......B.BD#
###B#C#.#.###
  #D#C#.#.#
  #D#B#A#C#
  #A#D#C#A#
  #########

#############
#AA.....B.BD#
###B#C#.#.###
  #D#C#.#.#
  #D#B#.#C#
  #A#D#C#A#
  #########

#############
#AA.....B.BD#
###B#.#.#.###
  #D#C#.#.#
  #D#B#C#C#
  #A#D#C#A#
  #########

#############
#AA.....B.BD#
###B#.#.#.###
  #D#.#C#.#
  #D#B#C#C#
  #A#D#C#A#
  #########

#############
#AA...B.B.BD#
###B#.#.#.###
  #D#.#C#.#
  #D#.#C#C#
  #A#D#C#A#
  #########

#############
#AA.D.B.B.BD#
###B#.#.#.###
  #D#.#C#.#
  #D#.#C#C#
  #A#.#C#A#
  #########

#############
#AA.D...B.BD#
###B#.#.#.###
  #D#.#C#.#
  #D#.#C#C#
  #A#B#C#A#
  #########

#############
#AA.D.....BD#
###B#.#.#.###
  #D#.#C#.#
  #D#B#C#C#
  #A#B#C#A#
  #########

#############
#AA.D......D#
###B#.#.#.###
  #D#B#C#.#
  #D#B#C#C#
  #A#B#C#A#
  #########

#############
#AA.D......D#
###B#.#C#.###
  #D#B#C#.#
  #D#B#C#.#
  #A#B#C#A#
  #########

#############
#AA.D.....AD#
###B#.#C#.###
  #D#B#C#.#
  #D#B#C#.#
  #A#B#C#.#
  #########

#############
#AA.......AD#
###B#.#C#.###
  #D#B#C#.#
  #D#B#C#.#
  #A#B#C#D#
  #########

#############
#AA.......AD#
###.#B#C#.###
  #D#B#C#.#
  #D#B#C#.#
  #A#B#C#D#
  #########

#############
#AA.......AD#
###.#B#C#.###
  #.#B#C#.#
  #D#B#C#D#
  #A#B#C#D#
  #########

#############
#AA.D.....AD#
###.#B#C#.###
  #.#B#C#.#
  #.#B#C#D#
  #A#B#C#D#
  #########

#############
#A..D.....AD#
###.#B#C#.###
  #.#B#C#.#
  #A#B#C#D#
  #A#B#C#D#
  #########

#############
#...D.....AD#
###.#B#C#.###
  #A#B#C#.#
  #A#B#C#D#
  #A#B#C#D#
  #########

#############
#.........AD#
###.#B#C#.###
  #A#B#C#D#
  #A#B#C#D#
  #A#B#C#D#
  #########

#############
#..........D#
###A#B#C#.###
  #A#B#C#D#
  #A#B#C#D#
  #A#B#C#D#
  #########

#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #A#B#C#D#
  #A#B#C#D#
  #########

Using the initial configuration from the full diagram, what is the least energy required to organize the amphipods?

*/

function NAME_OF_FUNC_HERE (part, inputStr) {

  // PARSE DATA (FURTHER PARSING LATER)
  const inputArr = inputStr.split('\n');
  if (part === 2) {                                                                 // PART 2: add two extra lines
    inputArr.splice(3, 0, '  #D#C#B#A#  ');
    inputArr.splice(4, 0, '  #D#B#A#C#  ');
  }

  // INIT MOVEMENT COST BASED ON A/B/C/D
  const movementCostByLetter = {
    A: 1,
    B: 10,
    C: 100,
    D: 1000
  }

  if (part === 1) {                                                                 // PART 1: smaller board

    // LEGEND:
    // 00 01    02    03    04    05 06
    //       07    09    11    13
    //       08    10    12    14

    // INIT BOARD, MOVEMENT COST BY i --> j, AND MOVEMENT OBSTACLES BY i --> j

    const board = Array(15);                                                        // 0-6 (hallway) followed by 7-14 (side rooms)
    board[0] = null;
    board[1] = null;
    board[2] = null;
    board[3] = null;
    board[4] = null;
    board[5] = null;
    board[6] = null;
    board[7] = inputArr[2][3];
    board[8] = inputArr[3][3];
    board[9] = inputArr[2][5];
    board[10] = inputArr[3][5];
    board[11] = inputArr[2][7];
    board[12] = inputArr[3][7];
    board[13] = inputArr[2][9];
    board[14] = inputArr[3][9];

    const movementCostByDestination = [
      [...Array(7).fill(null), 3, 4, 5, 6, 7, 8, 9, 10],
      [...Array(7).fill(null), 2, 3, 4, 5, 6, 7, 8, 9],
      [...Array(7).fill(null), 2, 3, 2, 3, 4, 5, 6, 7],
      [...Array(7).fill(null), 4, 5, 2, 3, 2, 3, 4, 5],
      [...Array(7).fill(null), 6, 7, 4, 5, 2, 3, 2, 3],
      [...Array(7).fill(null), 8, 9, 6, 7, 4, 5, 2, 3],
      [...Array(7).fill(null), 9, 10, 7, 8, 5, 6, 3, 4],
      [3, 2, 2, 4, 6, 8, 9, ...Array(8).fill(null)],
      [4, 3, 3, 5, 7, 9, 10, ...Array(8).fill(null)],
      [5, 4, 2, 2, 4, 6, 7, ...Array(8).fill(null)],
      [6, 5, 3, 3, 5, 7, 8, ...Array(8).fill(null)],
      [7, 6, 4, 2, 2, 4, 5, ...Array(8).fill(null)],
      [8, 7, 5, 3, 3, 5, 6, ...Array(8).fill(null)],
      [9, 8, 6, 4, 2, 2, 3, ...Array(8).fill(null)],
      [10, 9, 7, 5, 3, 3, 4, ...Array(8).fill(null)],
    ];

    const movementObstacles = [
      [...Array(7).fill(null), [1], [1, 7], [1, 2], [1, 2, 9], [1, 2, 3], [1, 2, 3, 11], [1, 2, 3, 4], [1, 2, 3, 4, 13]],
      [...Array(7).fill(null), [], [7], [2], [2, 9], [2, 3], [2, 3, 11], [2, 3, 4], [2, 3, 4, 13]],
      [...Array(7).fill(null), [], [7], [], [9], [3], [3, 11], [3, 4], [3, 4, 13]],
      [...Array(7).fill(null), [2], [2, 7], [], [9], [], [11], [4], [4, 13]],
      [...Array(7).fill(null), [2, 3], [2, 3, 7], [3], [3, 9], [], [11], [], [13]],
      [...Array(7).fill(null), [2, 3, 4], [2, 3, 4, 7], [3, 4], [3, 4, 9], [4], [4, 11], [], [13]],
      [...Array(7).fill(null), [2, 3, 4, 5], [2, 3, 4, 5, 7], [3, 4, 5], [3, 4, 5, 9], [4, 5], [4, 5, 11], [5], [5, 13]],
      [[1], [], [], [2], [2, 3], [2, 3, 4], [2, 3, 4, 5], ...Array(8).fill(null)],
      [[1, 7], [7], [7], [2, 7], [2, 3, 7], [2, 3, 4, 7], [2, 3, 4, 5, 7], ...Array(8).fill(null)],
      [[1, 2], [2], [], [], [3], [3, 4], [3, 4, 5], ...Array(8).fill(null)],
      [[1, 2, 9], [2, 9], [9], [9], [3, 9], [3, 4, 9], [3, 4, 5, 9], ...Array(8).fill(null)],
      [[1, 2, 3], [2, 3], [3], [], [], [4], [4, 5], ...Array(8).fill(null)],
      [[1, 2, 3, 11], [2, 3, 11], [3, 11], [11], [11], [4, 11], [4, 5, 11], ...Array(8).fill(null)],
      [[1, 2, 3, 4], [2, 3, 4], [3, 4], [4], [], [], [5], ...Array(8).fill(null)],
      [[1, 2, 3, 4, 13], [2, 3, 4, 13], [3, 4, 13], [4, 13], [13], [13], [5, 13], ...Array(8).fill(null)],
    ];

    // HELPER FUNCTIONS

    function getCandidateDestinations(i) {
      const candidateDestinations = [];
      for (let j = 0; j < 15; ++j) {
        const mover = board[i];
        if (movementCostByDestination[i][j] === null) continue;                     // invalid move: move to self, or stay within hallway/room
        if (board[j] !== null) continue;                                            // invalid move: destination occupied
        if (j === 7 && board[8] !== mover) continue;                                // invalid move: stopping prematurely or entering room with other type
        if (j === 9 && board[10] !== mover) continue;
        if (j === 11 && board[12] !== mover) continue;
        if (j === 13 && board[14] !== mover) continue;
        if (i < 7) {                                                                // invalid move: entering wrong hallway
          if (mover === 'A' && ![7, 8].includes(j)) continue;
          if (mover === 'B' && ![9, 10].includes(j)) continue;
          if (mover === 'C' && ![11, 12].includes(j)) continue;
          if (mover === 'D' && ![13, 14].includes(j)) continue;
        } else {
          if (mover === 'A' && i === 8) continue;                                   // invalid move: letter already properly placed deep within correct room
          if (mover === 'B' && i === 10) continue;
          if (mover === 'C' && i === 12) continue;
          if (mover === 'D' && i === 14) continue;
          if (mover === 'A' && i === 7 && board[8] === mover) continue;             // invalid move: room already correctly filled
          if (mover === 'B' && i === 9 && board[10] === mover) continue;
          if (mover === 'C' && i === 11 && board[12] === mover) continue;
          if (mover === 'D' && i === 13 && board[14] === mover) continue;
        }
        if (!movementObstacles[i][j].every(idx => board[idx] === null)) continue;   // invalid move: path is blocked
        candidateDestinations.push(j);
      }
      return candidateDestinations;
    }

    function done() {
      return board[7] == 'A'
        && board[8] == 'A'
        && board[9] == 'B'
        && board[10] == 'B'
        && board[11] == 'C'
        && board[12] == 'C'
        && board[13] == 'D'
        && board[14] == 'D'
    }
  
    // MAIN FUNCTION

    let minCost = Infinity;
    const memo = {};                                                                // memoization absolutely required for algorithm to run quickly

    function backtrack(energy, lastMoverIdx) {
      const serial = board.join(',');
      if (serial in memo && memo[serial] <= energy) return;
      memo[serial] = energy;

      if (done()) {
        minCost = Math.min(minCost, energy);
        return;
      }

      const candidateMovers = {};
      for (let i = 0; i < 15; ++i) {
        if (i === lastMoverIdx || board[i] === null) continue;
        const candidateDestinations = getCandidateDestinations(i);
        if (!candidateDestinations.length) continue;
        candidateMovers[i] = candidateDestinations;
      }
      for (const i in candidateMovers) {
        for (const destination of candidateMovers[i]) {
          const idx = +i;
          const mover = board[idx];
          const cost = movementCostByDestination[idx][destination] * movementCostByLetter[mover];
          energy += cost;
          board[idx] = null;
          board[destination] = mover;
          backtrack(energy, idx);
          energy -= cost;
          board[idx] = mover;
          board[destination] = null;
        }
      }
    }
    backtrack(0, null);
    return minCost;

  } else {                                                                          // PART 2: bigger board

    // LEGEND:
    // 00 01    02    03    04    05 06
    //       07    09    11    13
    //       08    10    12    14
    //       15    17    19    21
    //       16    18    20    22
    

    // INIT BOARD, MOVEMENT COST BY i --> j, AND MOVEMENT OBSTACLES BY i --> j

    const board = Array(23);                                                        // 0-6 (hallway) followed by 7-22 (side rooms)
    board[0] = null;
    board[1] = null;
    board[2] = null;
    board[3] = null;
    board[4] = null;
    board[5] = null;
    board[6] = null;
    board[7] = inputArr[2][3];
    board[8] = inputArr[3][3];
    board[9] = inputArr[2][5];
    board[10] = inputArr[3][5];
    board[11] = inputArr[2][7];
    board[12] = inputArr[3][7];
    board[13] = inputArr[2][9];
    board[14] = inputArr[3][9];
    board[15] = inputArr[4][3];
    board[16] = inputArr[5][3];
    board[17] = inputArr[4][5];
    board[18] = inputArr[5][5];
    board[19] = inputArr[4][7];
    board[20] = inputArr[5][7];
    board[21] = inputArr[4][9];
    board[22] = inputArr[5][9];


    const movementCostByDestination = [
      [...Array(7).fill(null), 3, 4, 5, 6, 7, 8, 9, 10, 5, 6, 7, 8, 9, 10, 11, 12],
      [...Array(7).fill(null), 2, 3, 4, 5, 6, 7, 8, 9, 4, 5, 6, 7, 8, 9, 10, 11],
      [...Array(7).fill(null), 2, 3, 2, 3, 4, 5, 6, 7, 4, 5, 4, 5, 6, 7, 8, 9],
      [...Array(7).fill(null), 4, 5, 2, 3, 2, 3, 4, 5, 6, 7, 4, 5, 4, 5, 6, 7],
      [...Array(7).fill(null), 6, 7, 4, 5, 2, 3, 2, 3, 8, 9, 6, 7, 4, 5, 4, 5],
      [...Array(7).fill(null), 8, 9, 6, 7, 4, 5, 2, 3, 10, 11, 8, 9, 6, 7, 4, 5],
      [...Array(7).fill(null), 9, 10, 7, 8, 5, 6, 3, 4, 11, 12, 9, 10, 7, 8, 5, 6],
      [3, 2, 2, 4, 6, 8, 9, ...Array(16).fill(null)],
      [4, 3, 3, 5, 7, 9, 10, ...Array(16).fill(null)],
      [5, 4, 2, 2, 4, 6, 7, ...Array(16).fill(null)],
      [6, 5, 3, 3, 5, 7, 8, ...Array(16).fill(null)],
      [7, 6, 4, 2, 2, 4, 5, ...Array(16).fill(null)],
      [8, 7, 5, 3, 3, 5, 6, ...Array(16).fill(null)],
      [9, 8, 6, 4, 2, 2, 3, ...Array(16).fill(null)],
      [10, 9, 7, 5, 3, 3, 4, ...Array(16).fill(null)],
      [5, 4, 4, 6, 8, 10, 11, ...Array(16).fill(null)],
      [6, 5, 5, 7, 9, 11, 12, ...Array(16).fill(null)],
      [7, 6, 4, 4, 6, 8, 9, ...Array(16).fill(null)],
      [8, 7, 5, 5, 7, 9, 10, ...Array(16).fill(null)],
      [9, 8, 6, 4, 4, 6, 7, ...Array(16).fill(null)],
      [10, 9, 7, 5, 5, 7, 8, ...Array(16).fill(null)],
      [11, 10, 8, 6, 4, 4, 5, ...Array(16).fill(null)],
      [12, 11, 9, 7, 5, 5, 6, ...Array(16).fill(null)],
    ];

    const movementObstacles = [
      [...Array(7).fill(null), [1], [1, 7], [1, 2], [1, 2, 9], [1, 2, 3], [1, 2, 3, 11], [1, 2, 3, 4], [1, 2, 3, 4, 13], [1, 7, 8], [1, 7, 8, 15], [1, 2, 9, 10], [1, 2, 9, 10, 17], [1, 2, 3, 11, 12], [1, 2, 3, 11, 12, 19], [1, 2, 3, 4, 13, 14], [1, 2, 3, 4, 13, 14, 21]],
      [...Array(7).fill(null), [], [7], [2], [2, 9], [2, 3], [2, 3, 11], [2, 3, 4], [2, 3, 4, 13], [7, 8], [7, 8, 15], [2, 9, 10], [2, 9, 10, 17], [2, 3, 11, 12], [2, 3, 11, 12, 19], [2, 3, 4, 13, 14], [2, 3, 4, 13, 14, 21]],
      [...Array(7).fill(null), [], [7], [], [9], [3], [3, 11], [3, 4], [3, 4, 13], [7, 8], [7, 8, 15], [9, 10], [9, 10, 17], [3, 11, 12], [3, 11, 12, 19], [3, 4, 13, 14], [3, 4, 13, 14, 21]],
      [...Array(7).fill(null), [2], [2, 7], [], [9], [], [11], [4], [4, 13], [2, 7, 8], [2, 7, 8, 15], [9, 10], [9, 10, 17], [11, 12], [11, 12, 19], [4, 13, 14], [4, 13, 14, 21]],
      [...Array(7).fill(null), [2, 3], [2, 3, 7], [3], [3, 9], [], [11], [], [13], [2, 3, 7, 8], [2, 3, 7, 8, 15], [3, 9, 10], [3, 9, 10, 17], [11, 12], [11, 12, 19], [13, 14], [13, 14, 21]],
      [...Array(7).fill(null), [2, 3, 4], [2, 3, 4, 7], [3, 4], [3, 4, 9], [4], [4, 11], [], [13], [2, 3, 4, 7, 8], [2, 3, 4, 7, 8, 15], [3, 4, 9, 10], [3, 4, 9, 10, 17], [4, 11, 12], [4, 11, 12, 19], [13, 14], [13, 14, 21]],
      [...Array(7).fill(null), [2, 3, 4, 5], [2, 3, 4, 5, 7], [3, 4, 5], [3, 4, 5, 9], [4, 5], [4, 5, 11], [5], [5, 13], [2, 3, 4, 5, 7, 8], [2, 3, 4, 5, 7, 8, 15], [3, 4, 5, 9, 10], [3, 4, 5, 9, 10, 17], [4, 5, 11, 12], [4, 5, 11, 12, 19], [5, 13, 14], [5, 13, 14, 21]],

      [[1], [], [], [2], [2, 3], [2, 3, 4], [2, 3, 4, 5], ...Array(16).fill(null)],
      [[1, 7], [7], [7], [2, 7], [2, 3, 7], [2, 3, 4, 7], [2, 3, 4, 5, 7], ...Array(16).fill(null)],
      [[1, 2], [2], [], [], [3], [3, 4], [3, 4, 5], ...Array(16).fill(null)],
      [[1, 2, 9], [2, 9], [9], [9], [3, 9], [3, 4, 9], [3, 4, 5, 9], ...Array(16).fill(null)],
      [[1, 2, 3], [2, 3], [3], [], [], [4], [4, 5], ...Array(16).fill(null)],
      [[1, 2, 3, 11], [2, 3, 11], [3, 11], [11], [11], [4, 11], [4, 5, 11], ...Array(16).fill(null)],
      [[1, 2, 3, 4], [2, 3, 4], [3, 4], [4], [], [], [5], ...Array(16).fill(null)],
      [[1, 2, 3, 4, 13], [2, 3, 4, 13], [3, 4, 13], [4, 13], [13], [13], [5, 13], ...Array(16).fill(null)],
      [[1, 7, 8], [7, 8], [7, 8], [2, 7, 8], [2, 3, 7, 8], [2, 3, 4, 7, 8], [2, 3, 4, 5, 7, 8], ...Array(16).fill(null)],
      [[1, 7, 8, 15], [7, 8, 15], [7, 8, 15], [2, 7, 8, 15], [2, 3, 7, 8, 15], [2, 3, 4, 7, 8, 15], [2, 3, 4, 5, 7, 8, 15], ...Array(16).fill(null)],
      [[1, 2, 9, 10], [2, 9, 10], [9, 10], [9, 10], [3, 9, 10], [3, 4, 9, 10], [3, 4, 5, 9, 10], ...Array(16).fill(null)],
      [[1, 2, 9, 10, 17], [2, 9, 10, 17], [9, 10, 17], [9, 10, 17], [3, 9, 10, 17], [3, 4, 9, 10, 17], [3, 4, 5, 9, 10, 17], ...Array(16).fill(null)],
      [[1, 2, 3, 11, 12], [2, 3, 11, 12], [3, 11, 12], [11, 12], [11, 12], [4, 11, 12], [4, 5, 11, 12], ...Array(16).fill(null)],
      [[1, 2, 3, 11, 12, 19], [2, 3, 11, 12, 19], [3, 11, 12, 19], [11, 12, 19], [11, 12, 19], [4, 11, 12, 19], [4, 5, 11, 12, 19], ...Array(16).fill(null)],
      [[1, 2, 3, 4, 13, 14], [2, 3, 4, 13, 14], [3, 4, 13, 14], [4, 13, 14], [13, 14], [13, 14], [5, 13, 14], ...Array(16).fill(null)],
      [[1, 2, 3, 4, 13, 14, 21], [2, 3, 4, 13, 14, 21], [3, 4, 13, 14, 21], [4, 13, 14, 21], [13, 14, 21], [13, 14, 21], [5, 13, 14, 21], ...Array(16).fill(null)],
    ];

    // HELPER FUNCTIONS

    function getCandidateDestinations(i) {
      const candidateDestinations = [];
      for (let j = 0; j < 23; ++j) {
        const mover = board[i];
        if (movementCostByDestination[i][j] === null) continue;                     // invalid move: move to self, or stay within hallway/room
        if (board[j] !== null) continue;                                            // invalid move: destination occupied

        if (j === 7 && (                                                            // invalid move: stopping prematurely or entering room with other type
          board[8] !== mover ||
          board[15] !== mover ||
          board[16] !== mover
        )) continue;
        if (j === 8 && (
          board[15] !== mover ||
          board[16] !== mover
        )) continue;
        if (j === 15 && (
          board[16] !== mover
        )) continue;

        if (j === 9 && (
          board[10] !== mover ||
          board[17] !== mover ||
          board[18] !== mover
        )) continue;
        if (j === 10 && (
          board[17] !== mover ||
          board[18] !== mover
        )) continue;
        if (j === 17 && (
          board[18] !== mover
        )) continue;

        if (j === 11 && (
          board[12] !== mover ||
          board[19] !== mover ||
          board[20] !== mover
        )) continue;
        if (j === 12 && (
          board[19] !== mover ||
          board[20] !== mover
        )) continue;
        if (j === 19 && (
          board[20] !== mover
        )) continue;

        if (j === 13 && (
          board[14] !== mover ||
          board[21] !== mover ||
          board[22] !== mover
        )) continue;
        if (j === 14 && (
          board[21] !== mover ||
          board[22] !== mover
        )) continue;
        if (j === 21 && (
          board[22] !== mover
        )) continue;

        if (i < 7) {                                                                // invalid move: entering wrong hallway
          if (mover === 'A' && ![7, 8, 15, 16].includes(j)) continue;
          if (mover === 'B' && ![9, 10, 17, 18].includes(j)) continue;
          if (mover === 'C' && ![11, 12, 19, 20].includes(j)) continue;
          if (mover === 'D' && ![13, 14, 21, 22].includes(j)) continue;
        } else {
          if (mover === 'A' && i === 16) continue;                                  // invalid move: letter already properly placed deep within correct room
          if (mover === 'B' && i === 18) continue;
          if (mover === 'C' && i === 20) continue;
          if (mover === 'D' && i === 22) continue;

          if (mover === 'A' && i == 7                                               // invalid move: room already correctly filled
            && board[8] === mover
            && board[15] === mover
            && board[16] === mover
          ) continue;
          if (mover === 'A' && i == 8
            && board[15] === mover
            && board[16] === mover
          ) continue;
          if (mover === 'A' && i == 15
            && board[16] === mover
          ) continue;

          if (mover === 'B' && i == 9
            && board[10] === mover
            && board[17] === mover
            && board[18] === mover
          ) continue;
          if (mover === 'B' && i == 10
            && board[17] === mover
            && board[18] === mover
          ) continue;
          if (mover === 'B' && i == 17
            && board[18] === mover
          ) continue;

          if (mover === 'C' && i == 11
            && board[12] === mover
            && board[19] === mover
            && board[20] === mover
          ) continue;
          if (mover === 'C' && i == 12
            && board[19] === mover
            && board[20] === mover
          ) continue;
          if (mover === 'C' && i == 19
            && board[20] === mover
          ) continue;

          if (mover === 'D' && i == 13
            && board[14] === mover
            && board[21] === mover
            && board[22] === mover
          ) continue;
          if (mover === 'D' && i == 14
            && board[21] === mover
            && board[22] === mover
          ) continue;
          if (mover === 'D' && i == 21
            && board[22] === mover
          ) continue;
        }
        if (!movementObstacles[i][j].every(idx => board[idx] === null)) continue;   // invalid move: path is blocked
        candidateDestinations.push(j);
      }
      return candidateDestinations;
    }

    function done() {
      return board[7] == 'A'
        && board[8] == 'A'
        && board[15] == 'A'
        && board[16] == 'A'
        && board[9] == 'B'
        && board[10] == 'B'
        && board[17] == 'B'
        && board[18] == 'B'
        && board[11] == 'C'
        && board[12] == 'C'
        && board[19] == 'C'
        && board[20] == 'C'
        && board[13] == 'D'
        && board[14] == 'D'
        && board[21] == 'D'
        && board[22] == 'D'
    }
  
    // MAIN FUNCTION

    let minCost = Infinity;
    const memo = {};                                                                // memoization absolutely required for algorithm to run quickly

    function backtrack(energy, lastMoverIdx) {
      const serial = board.join(',');
      if (serial in memo && memo[serial] <= energy) return;
      memo[serial] = energy;

      if (done()) {
        minCost = Math.min(minCost, energy);
        return;
      }

      const candidateMovers = {};
      for (let i = 0; i < 23; ++i) {
        if (i === lastMoverIdx || board[i] === null) continue;
        const candidateDestinations = getCandidateDestinations(i);
        if (!candidateDestinations.length) continue;
        candidateMovers[i] = candidateDestinations;
      }
      for (const i in candidateMovers) {
        for (const destination of candidateMovers[i]) {
          const idx = +i;
          const mover = board[idx];
          const cost = movementCostByDestination[idx][destination] * movementCostByLetter[mover];
          energy += cost;
          board[idx] = null;
          board[destination] = mover;
          backtrack(energy, idx);
          energy -= cost;
          board[idx] = mover;
          board[destination] = null;
        }
      }
    }
    backtrack(0, null);
    return minCost;
    
  }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = NAME_OF_FUNC_HERE;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`;

const actualInput = `#############
#...........#
###A#C#B#C###
  #D#A#D#B#
  #########`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 12521;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 16300;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 44169;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 48676;
test(func, input, expected, testNum, lowestTest, highestTest);