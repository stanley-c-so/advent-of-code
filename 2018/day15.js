/*

--- Day 15: Beverage Bandits ---

Having perfected their hot chocolate, the Elves have a new problem: the Goblins that live in these caves will do anything to steal it. Looks like they're here for a fight.

You scan the area, generating a map of the walls (#), open cavern (.), and starting position of every Goblin (G) and Elf (E) (your puzzle input).

Combat proceeds in rounds; in each round, each unit that is still alive takes a turn, resolving all of its actions before the next unit's turn begins. On each unit's turn, it tries to move into range of an enemy (if it isn't already) and then attack (if it is in range).

All units are very disciplined and always follow very strict combat rules. Units never move or attack diagonally, as doing so would be dishonorable. When multiple choices are equally valid, ties are broken in reading order: top-to-bottom, then left-to-right. For instance, the order in which units take their turns within a round is the reading order of their starting positions in that round, regardless of the type of unit or whether other units have moved after the round started. For example:

                 would take their
These units:   turns in this order:
  #######           #######
  #.G.E.#           #.1.2.#
  #E.G.E#           #3.4.5#
  #.G.E.#           #.6.7.#
  #######           #######

Each unit begins its turn by identifying all possible targets (enemy units). If no targets remain, combat ends.

Then, the unit identifies all of the open squares (.) that are in range of each target; these are the squares which are adjacent (immediately up, down, left, or right) to any target and which aren't already occupied by a wall or another unit. Alternatively, the unit might already be in range of a target. If the unit is not already in range of a target, and there are no open squares which are in range of a target, the unit ends its turn.

If the unit is already in range of a target, it does not move, but continues its turn with an attack. Otherwise, since it is not in range of a target, it moves.

To move, the unit first considers the squares that are in range and determines which of those squares it could reach in the fewest steps. A step is a single movement to any adjacent (immediately up, down, left, or right) open (.) square. Units cannot move into walls or other units. The unit does this while considering the current positions of units and does not do any prediction about where units will be later. If the unit cannot reach (find an open path to) any of the squares that are in range, it ends its turn. If multiple squares are in range and tied for being reachable in the fewest steps, the square which is first in reading order is chosen. For example:

Targets:      In range:     Reachable:    Nearest:      Chosen:
#######       #######       #######       #######       #######
#E..G.#       #E.?G?#       #E.@G.#       #E.!G.#       #E.+G.#
#...#.#  -->  #.?.#?#  -->  #.@.#.#  -->  #.!.#.#  -->  #...#.#
#.G.#G#       #?G?#G#       #@G@#G#       #!G.#G#       #.G.#G#
#######       #######       #######       #######       #######

In the above scenario, the Elf has three targets (the three Goblins):

Each of the Goblins has open, adjacent squares which are in range (marked with a ? on the map).
Of those squares, four are reachable (marked @); the other two (on the right) would require moving through a wall or unit to reach.
Three of these reachable squares are nearest, requiring the fewest steps (only 2) to reach (marked !).
Of those, the square which is first in reading order is chosen (+).
The unit then takes a single step toward the chosen square along the shortest path to that square. If multiple steps would put the unit equally closer to its destination, the unit chooses the step which is first in reading order. (This requires knowing when there is more than one shortest path so that you can consider the first step of each such path.) For example:

In range:     Nearest:      Chosen:       Distance:     Step:
#######       #######       #######       #######       #######
#.E...#       #.E...#       #.E...#       #4E212#       #..E..#
#...?.#  -->  #...!.#  -->  #...+.#  -->  #32101#  -->  #.....#
#..?G?#       #..!G.#       #...G.#       #432G2#       #...G.#
#######       #######       #######       #######       #######

The Elf sees three squares in range of a target (?), two of which are nearest (!), and so the first in reading order is chosen (+). Under "Distance", each open square is marked with its distance from the destination square; the two squares to which the Elf could move on this turn (down and to the right) are both equally good moves and would leave the Elf 2 steps from being in range of the Goblin. Because the step which is first in reading order is chosen, the Elf moves right one square.

Here's a larger example of movement:

Initially:
#########
#G..G..G#
#.......#
#.......#
#G..E..G#
#.......#
#.......#
#G..G..G#
#########

After 1 round:
#########
#.G...G.#
#...G...#
#...E..G#
#.G.....#
#.......#
#G..G..G#
#.......#
#########

After 2 rounds:
#########
#..G.G..#
#...G...#
#.G.E.G.#
#.......#
#G..G..G#
#.......#
#.......#
#########

After 3 rounds:
#########
#.......#
#..GGG..#
#..GEG..#
#G..G...#
#......G#
#.......#
#.......#
#########

Once the Goblins and Elf reach the positions above, they all are either in range of a target or cannot find any square in range of a target, and so none of the units can move until a unit dies.

After moving (or if the unit began its turn in range of a target), the unit attacks.

To attack, the unit first determines all of the targets that are in range of it by being immediately adjacent to it. If there are no such targets, the unit ends its turn. Otherwise, the adjacent target with the fewest hit points is selected; in a tie, the adjacent target with the fewest hit points which is first in reading order is selected.

The unit deals damage equal to its attack power to the selected target, reducing its hit points by that amount. If this reduces its hit points to 0 or fewer, the selected target dies: its square becomes . and it takes no further turns.

Each unit, either Goblin or Elf, has 3 attack power and starts with 200 hit points.

For example, suppose the only Elf is about to attack:

       HP:            HP:
G....  9       G....  9  
..G..  4       ..G..  4  
..EG.  2  -->  ..E..     
..G..  2       ..G..  2  
...G.  1       ...G.  1  

The "HP" column shows the hit points of the Goblin to the left in the corresponding row. The Elf is in range of three targets: the Goblin above it (with 4 hit points), the Goblin to its right (with 2 hit points), and the Goblin below it (also with 2 hit points). Because three targets are in range, the ones with the lowest hit points are selected: the two Goblins with 2 hit points each (one to the right of the Elf and one below the Elf). Of those, the Goblin first in reading order (the one to the right of the Elf) is selected. The selected Goblin's hit points (2) are reduced by the Elf's attack power (3), reducing its hit points to -1, killing it.

After attacking, the unit's turn ends. Regardless of how the unit's turn ends, the next unit in the round takes its turn. If all units have taken turns in this round, the round ends, and a new round begins.

The Elves look quite outnumbered. You need to determine the outcome of the battle: the number of full rounds that were completed (not counting the round in which combat ends) multiplied by the sum of the hit points of all remaining units at the moment combat ends. (Combat only ends when a unit finds no targets during its turn.)

Below is an entire sample combat. Next to each map, each row's units' hit points are listed from left to right.

Initially:
#######   
#.G...#   G(200)
#...EG#   E(200), G(200)
#.#.#G#   G(200)
#..G#E#   G(200), E(200)
#.....#   
#######   

After 1 round:
#######   
#..G..#   G(200)
#...EG#   E(197), G(197)
#.#G#G#   G(200), G(197)
#...#E#   E(197)
#.....#   
#######   

After 2 rounds:
#######   
#...G.#   G(200)
#..GEG#   G(200), E(188), G(194)
#.#.#G#   G(194)
#...#E#   E(194)
#.....#   
#######   

Combat ensues; eventually, the top Elf dies:

After 23 rounds:
#######   
#...G.#   G(200)
#..G.G#   G(200), G(131)
#.#.#G#   G(131)
#...#E#   E(131)
#.....#   
#######   

After 24 rounds:
#######   
#..G..#   G(200)
#...G.#   G(131)
#.#G#G#   G(200), G(128)
#...#E#   E(128)
#.....#   
#######   

After 25 rounds:
#######   
#.G...#   G(200)
#..G..#   G(131)
#.#.#G#   G(125)
#..G#E#   G(200), E(125)
#.....#   
#######   

After 26 rounds:
#######   
#G....#   G(200)
#.G...#   G(131)
#.#.#G#   G(122)
#...#E#   E(122)
#..G..#   G(200)
#######   

After 27 rounds:
#######   
#G....#   G(200)
#.G...#   G(131)
#.#.#G#   G(119)
#...#E#   E(119)
#...G.#   G(200)
#######   

After 28 rounds:
#######   
#G....#   G(200)
#.G...#   G(131)
#.#.#G#   G(116)
#...#E#   E(113)
#....G#   G(200)
#######   

More combat ensues; eventually, the bottom Elf dies:

After 47 rounds:
#######   
#G....#   G(200)
#.G...#   G(131)
#.#.#G#   G(59)
#...#.#   
#....G#   G(200)
#######   

Before the 48th round can finish, the top-left Goblin finds that there are no targets remaining, and so combat ends. So, the number of full rounds that were completed is 47, and the sum of the hit points of all remaining units is 200+131+59+200 = 590. From these, the outcome of the battle is 47 * 590 = 27730.

Here are a few example summarized combats:

#######       #######
#G..#E#       #...#E#   E(200)
#E#E.E#       #E#...#   E(197)
#G.##.#  -->  #.E##.#   E(185)
#...#E#       #E..#E#   E(200), E(200)
#...E.#       #.....#
#######       #######

Combat ends after 37 full rounds
Elves win with 982 total hit points left
Outcome: 37 * 982 = 36334

#######       #######   
#E..EG#       #.E.E.#   E(164), E(197)
#.#G.E#       #.#E..#   E(200)
#E.##E#  -->  #E.##.#   E(98)
#G..#.#       #.E.#.#   E(200)
#..E#.#       #...#.#   
#######       #######   

Combat ends after 46 full rounds
Elves win with 859 total hit points left
Outcome: 46 * 859 = 39514

#######       #######   
#E.G#.#       #G.G#.#   G(200), G(98)
#.#G..#       #.#G..#   G(200)
#G.#.G#  -->  #..#..#   
#G..#.#       #...#G#   G(95)
#...E.#       #...G.#   G(200)
#######       #######   

Combat ends after 35 full rounds
Goblins win with 793 total hit points left
Outcome: 35 * 793 = 27755

#######       #######   
#.E...#       #.....#   
#.#..G#       #.#G..#   G(200)
#.###.#  -->  #.###.#   
#E#G#G#       #.#.#.#   
#...#G#       #G.G#G#   G(98), G(38), G(200)
#######       #######   

Combat ends after 54 full rounds
Goblins win with 536 total hit points left
Outcome: 54 * 536 = 28944

#########       #########   
#G......#       #.G.....#   G(137)
#.E.#...#       #G.G#...#   G(200), G(200)
#..##..G#       #.G##...#   G(200)
#...##..#  -->  #...##..#   
#...#...#       #.G.#...#   G(200)
#.G...G.#       #.......#   
#.....G.#       #.......#   
#########       #########   

Combat ends after 20 full rounds
Goblins win with 937 total hit points left
Outcome: 20 * 937 = 18740

What is the outcome of the combat described in your puzzle input?


--- Part Two ---

According to your calculations, the Elves are going to lose badly. Surely, you won't mess up the timeline too much if you give them just a little advanced technology, right?

You need to make sure the Elves not only win, but also suffer no losses: even the death of a single Elf is unacceptable.

However, you can't go too far: larger changes will be more likely to permanently alter spacetime.

So, you need to find the outcome of the battle in which the Elves have the lowest integer attack power (at least 4) that allows them to win without a single death. The Goblins always have an attack power of 3.

In the first summarized example above, the lowest attack power the Elves need to win without losses is 15:

#######       #######
#.G...#       #..E..#   E(158)
#...EG#       #...E.#   E(14)
#.#.#G#  -->  #.#.#.#
#..G#E#       #...#.#
#.....#       #.....#
#######       #######

Combat ends after 29 full rounds
Elves win with 172 total hit points left
Outcome: 29 * 172 = 4988
In the second example above, the Elves need only 4 attack power:

#######       #######
#E..EG#       #.E.E.#   E(200), E(23)
#.#G.E#       #.#E..#   E(200)
#E.##E#  -->  #E.##E#   E(125), E(200)
#G..#.#       #.E.#.#   E(200)
#..E#.#       #...#.#
#######       #######

Combat ends after 33 full rounds
Elves win with 948 total hit points left
Outcome: 33 * 948 = 31284
In the third example above, the Elves need 15 attack power:

#######       #######
#E.G#.#       #.E.#.#   E(8)
#.#G..#       #.#E..#   E(86)
#G.#.G#  -->  #..#..#
#G..#.#       #...#.#
#...E.#       #.....#
#######       #######

Combat ends after 37 full rounds
Elves win with 94 total hit points left
Outcome: 37 * 94 = 3478
In the fourth example above, the Elves need 12 attack power:

#######       #######
#.E...#       #...E.#   E(14)
#.#..G#       #.#..E#   E(152)
#.###.#  -->  #.###.#
#E#G#G#       #.#.#.#
#...#G#       #...#.#
#######       #######

Combat ends after 39 full rounds
Elves win with 166 total hit points left
Outcome: 39 * 166 = 6474
In the last example above, the lone Elf needs 34 attack power:

#########       #########   
#G......#       #.......#   
#.E.#...#       #.E.#...#   E(38)
#..##..G#       #..##...#   
#...##..#  -->  #...##..#   
#...#...#       #...#...#   
#.G...G.#       #.......#   
#.....G.#       #.......#   
#########       #########   

Combat ends after 30 full rounds
Elves win with 38 total hit points left
Outcome: 30 * 38 = 1140

After increasing the Elves' attack power until it is just barely enough for them to win without any Elves dying, what is the outcome of the combat described in your puzzle input?

*/

const { Queue } = require('./_classes');

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function simulateTurnBasedCombat (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // GRID CONSTANTS
  const DELTAS = [ [ +1, 0 ], [ -1, 0 ], [ 0, +1 ], [ 0, -1 ] ];
  const H = inputArr.length;
  const W = inputArr[0].length;
  const [ WALL, OPEN, ELF, GOBLIN ] = [ '#', '.', 'E', 'G' ];

  // CONSTANTS
  const ROUND_LIMIT = Number.MAX_SAFE_INTEGER;
  const GOBLIN_ATTACK_POWER = 3;

  // SIMULATE FUNCTION IS ONE GIANT FUNCTION THAT CAN BE CALLED BY PART 1 / PART 2 CODE
  function SIMULATE(ELF_ATTACK_POWER) {

    // DATA STRUCTURES AND GLOBAL VALUES
    const TERRAIN = [];
    const UNITS = [];
    const REMAINING_UNIT_INDICES = new Set();
    const COUNT = { [ELF]: 0, [GOBLIN]: 0 };
    let numElvesDied = 0;

    // DISCOVER CAVE AND UNIT DATA
    for (let row = 0; row < H; ++row) {
      const terrainRow = [];
      for (let col = 0; col < W; ++col) {
        const c = inputArr[row][col];
        terrainRow.push(c);                                                                 // save terrain data
        if ([ ELF, GOBLIN ].includes(c)) {
          REMAINING_UNIT_INDICES.add(UNITS.length);                                         // add unit to remaining units set
          UNITS.push({                                                                      // save unit data
            idx: UNITS.length,
            type: c,
            row,
            col,
            attackPower: c === GOBLIN ? GOBLIN_ATTACK_POWER
                                      : ELF_ATTACK_POWER,
            HP: 200,
          });
          ++COUNT[c];                                                                       // update global unit count data
        }
      }
      TERRAIN.push(terrainRow);
    }

    // HELPER FUNCTION - TAKES IN AN ARRAY OF COORDINATES ([row, col]), AND SORTS THEM IN READING ORDER
    function getReadingOrder(coords) {
      return coords.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    }

    // HELPER FUNCTION - TAKES IN COORDINATES, AND A REFERENCE TYPE; OUTPUTS A DATA OBJECT THAT INCLUDES A BOOL
    // FOR WHETHER THAT SQUARE IS NEXT TO A LIVING UNIT OF THE OPPOSITE TYPE; ALSO INCLUDES AN ARRAY OF ALL ENEMIES
    // ADJACENT TO THAT COORDINATE
    function isSquareOfOccupiedStateNextToEnemy(row, col, type) {
      const enemyType = type === ELF ? GOBLIN : ELF;
      const enemies = [];
      let bool = false;
      for (const [ dy, dx ] of DELTAS) {
        const [ newRow, newCol ] = [ row + dy, col + dx ];
        if (0 <= newRow && newRow < H && 0 <= newCol && newCol < W
            && TERRAIN[newRow][newCol] === enemyType
        ) {
          bool = true;
          enemies.push(UNITS.findIndex(unit => unit.row === newRow && unit.col === newCol));
        }
      }
      return { bool, enemies };
    }

    // SIMULATE BATTLE
    let NEXT_MIN_TARGET = 1;
    for (let round = 1; round <= ROUND_LIMIT; ++round) {

      if (DISPLAY_EXTRA_INFO
        && Math.floor((Date.now() - TIME_AT_START)/(1000*60)) >= NEXT_MIN_TARGET
      ) {
        const MINS_PASSED = Math.floor((Date.now() - TIME_AT_START)/(1000*60));
        console.log(`... ${
          MINS_PASSED
        } mins have passed since beginning this run`);
        console.log(`(currently on round ${round})`);
        NEXT_MIN_TARGET = MINS_PASSED + 1;
      }

      // DETERMINE THE MOVE ORDER
      const REMAINING_UNITS_COORDS = getReadingOrder([ ...REMAINING_UNIT_INDICES ]
                                                      .map(i => [ UNITS[i].row, UNITS[i].col ]));

      const REMAINING_UNITS = [ ...REMAINING_UNIT_INDICES ]
                                .sort((a, b) => REMAINING_UNITS_COORDS
                                                  .findIndex(coords => UNITS[a].row === coords[0]
                                                                        && UNITS[a].col === coords[1])
                                                    - REMAINING_UNITS_COORDS
                                                      .findIndex(coords => UNITS[b].row === coords[0]
                                                                            && UNITS[b].col === coords[1]));

      // ITERATE THROUGH EVERY UNIT
      for (let i = 0; i < REMAINING_UNITS.length; ++i) {

        // CHECK FOR END OF COMBAT AT THE START OF EVERY INDIVIDUAL UNIT'S TURN, PER THE INSTRUCTIONS.
        // NOTE: YOU CANNOT JUST PUT THIS AT THE START OF THE ROUND OR THE END OF THE ROUND.
        // IF YOU PUT IT AT THE START OF THE ROUND - WHAT IF IN THE PREVIOUS ROUND COMBAT SHOULD HAVE
        // ENDED? BUT NOW YOU DON'T SEE THAT UNTIL THE ROUND IS 1 TOO HIGH.
        // IF YOU PUT IT AT THE END OF THE ROUND - WHAT IF THE LAST MOVING UNIT KILLS ITS LAST ENEMY?
        // THEN YOU DETECT THE TERMINATE CONDITION IN THIS ROUND, 1 TOO LOW - IT SHOULD NOT HAVE BEEN
        // DETECTED UNTIL THE START OF THE NEXT ROUND WHEN THE FIRST UNIT CHECKS WHETHER COMBAT IS OVER.
        if (COUNT[ELF] === 0 || COUNT[GOBLIN] === 0) {
          
          const finalCompletedRound = round - 1;                                            // this round is not a complete round
          const sumOfHPOfRemainingUnits = [ ...REMAINING_UNIT_INDICES ]
                                            .reduce((sum, i) => sum + UNITS[i].HP, 0);
                            
          return {
            outcome: finalCompletedRound * sumOfHPOfRemainingUnits,
            numElvesDied,
            finalCompletedRound,                                                            // for extra info
            sumOfHPOfRemainingUnits,                                                        // for extra info
            UNITS,                                                                          // for extra info
            TERRAIN,                                                                        // for extra info
          };
        };

        // GET UNIT INFORMATION
        const unitIdx = REMAINING_UNITS[i];
        if (!REMAINING_UNIT_INDICES.has(unitIdx)) continue;                                 // skip eliminated units
        const { type, row, col, attackPower } = UNITS[unitIdx];

        // MOVE
        
        // first, check if we even need to move
        let needToMove = true;
        if (isSquareOfOccupiedStateNextToEnemy(row, col, type).bool                         // if we are already in range...
            || [ ...REMAINING_UNIT_INDICES ]                                                // ...or every enemy is already surrounded...
                  .filter(i => UNITS[i].type !== type)
                  .every(enemy => DELTAS.every(delta => {
                    const [ dy, dx ] = delta;
                    const [ newRow, newCol ] = [  UNITS[enemy].row + dy,
                                                  UNITS[enemy].col + dx ];
                    return newRow < 0 || newRow === H || newCol < 0 || newCol === W
                            || TERRAIN[newRow][newCol] !== OPEN
                  }))
        ) {
          needToMove = false;                                                               // ...then we don't need to move
        }

        // otherwise, if neither of the above is true, we must move in the best way to the best square that is closest
        if (needToMove) {

          // BFS flood fill, and as soon as we find 1 eligible square,
          // keep going until we exhaust all moves that take the same number of steps
          const candidateFirstMovesByEndSq = {};
          const Q = new Queue([ row, col, 0, null ]);
          const MEMO = {};
          let shortestPathLength = null;
          while (!Q.isEmpty()) {
            const [ r, c, moves, firstCoord ] = Q.dequeue().val;
            if (shortestPathLength !== null && moves > shortestPathLength) break;           // break BFS if we have fully analyzed path length
            if (r < 0 || r === H || c < 0 || c === W) continue;                             // stop path if square is out of bounds
            if (moves && TERRAIN[r][c] !== OPEN) continue;                                  // stop path if square is not open space

            const serial = `${r},${c}|${firstCoord}`;                                       // IMPORTANT: no collision if different first move!
            if (!(serial in MEMO) || moves < MEMO[serial]) MEMO[serial] = moves;
            else if (moves >= MEMO[serial]) continue;

            if (TERRAIN[r][c] === OPEN                                                      // if we find an open spot next to an enemy...
                && isSquareOfOccupiedStateNextToEnemy(r, c, type).bool
            ) {
              shortestPathLength = moves;                                                   // set shortest path length
              const endSquare = `${r},${c}`;
              if (!(endSquare in candidateFirstMovesByEndSq)) {
                candidateFirstMovesByEndSq[endSquare] = new Set();
              }
              candidateFirstMovesByEndSq[endSquare].add(firstCoord);
            }
            else {                                                                          // else, take next step at 4 neighbors
              for (const [ dy, dx ] of DELTAS) {
                Q.enqueue([ r + dy,
                            c + dx,
                            moves + 1,
                            firstCoord || `${r + dy},${c + dx}` ]);
              }
            }
          }

          // if we found any candidate squares to move toward...
          const endSquares = Object.keys(candidateFirstMovesByEndSq)
                              .map(serial => serial.split(',').map(n => +n));
          if (endSquares.length) {
            const moveTarget = getReadingOrder(endSquares)[0];                              // ...choose the best target by reading order...
            const firstCoordsToMoveTarget = [ ...candidateFirstMovesByEndSq[moveTarget] ]
                                              .map(serial => serial.split(',').map(n => +n));

            const [ newRow, newCol ] = getReadingOrder(firstCoordsToMoveTarget)[0];         // ...then choose the best starter move by reading order

            [ UNITS[unitIdx].row, UNITS[unitIdx].col ] = [ newRow, newCol ];                // now move the unit,
            [ TERRAIN[row][col], TERRAIN[newRow][newCol] ] = [ OPEN, type ];                // and update the terrain
          }
        }

        // ATTACK
        const destinationSquareInRangeData = isSquareOfOccupiedStateNextToEnemy(UNITS[unitIdx].row,     // location may have changed if unit moved
                                                                                UNITS[unitIdx].col,
                                                                                type);
        if (destinationSquareInRangeData.bool) {

          const enemiesInRange = destinationSquareInRangeData.enemies;
          const lowestHP = enemiesInRange.map(i => UNITS[i].HP).sort((a, b) => a - b)[0];               // find lowest HP
          const enemyPositionsWithLowestHP = enemiesInRange.filter(i => UNITS[i].HP === lowestHP)       // get positions of all enemies with that HP
                                                            .map(i => [ UNITS[i].row, UNITS[i].col ])

          const [ targetRow, targetCol ] = getReadingOrder(enemyPositionsWithLowestHP)[0];              // pick enemy based on reading order
          
          const targetIdx = UNITS.findIndex(unit => unit.row === targetRow && unit.col === targetCol);  // get index of enemy

          UNITS[targetIdx].HP -= attackPower;                                                           // lower enemy's HP
          if (UNITS[targetIdx].HP <= 0) {                                                               // if enemy dies...
            [ UNITS[targetIdx].row, UNITS[targetIdx].col ] = [ -1, -1 ];                                // 'send' it to -1, -1 (IMPORTANT: so that
                                                                                                        // code doesn't 'detect' a dead unit in map)
            REMAINING_UNIT_INDICES.delete(targetIdx);
            TERRAIN[targetRow][targetCol] = OPEN;
            --COUNT[type === ELF ? GOBLIN : ELF];
            if (type === GOBLIN) ++numElvesDied;
          }
        }
      }
    }

  }

  // ANALYZE
  const TIME_AT_START = Date.now();
  console.log('RUNNING ANALYSIS (PLEASE WAIT)...');
  if (part === 1) {                                                                         // PART 1: GET OUTCOME WITH STANDARD ELF ATTACK POWER

    console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return SIMULATE(3).outcome;

  } else {                                                                                  // PART 2: GET OUTCOME AFTER RAISING ELF ATTACK POWER
                                                                                            // TO MINIMUM REQUIRED FOR NO ELVES TO DIE

    let elfAttackPower = 3;
    let simulationResults = null;
    do {
      ++elfAttackPower;
      simulationResults = SIMULATE(elfAttackPower);
    } while (simulationResults.numElvesDied > 0)

    console.log(`SUCCESSFUL SIMULATION WITH ELF ATTACK POWER: ${elfAttackPower}`);

    if (DISPLAY_EXTRA_INFO) {
      console.log('OUTCOME OF SUCCESSFUL SIMULATION:', simulationResults.outcome);
      console.log('FINAL COMPLETED ROUND:', simulationResults.finalCompletedRound);
      console.log('SUM OF HP OF REMAINING UNITS:', simulationResults.sumOfHPOfRemainingUnits);
      console.log('UNIT DATA:', simulationResults.UNITS);
      console.log('MAP:');
      for (const row of simulationResults.TERRAIN) console.log(row.join(''));
    }

    console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    return simulationResults.outcome;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = simulateTurnBasedCombat;
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
`#######
#.G...#
#...EG#
#.#.#G#
#..G#E#
#.....#
#######`
);

const sampleInput2 = parseSampleInput(
`#######
#G..#E#
#E#E.E#
#G.##.#
#...#E#
#...E.#
#######`
);

const sampleInput3 = parseSampleInput(
`#######
#E..EG#
#.#G.E#
#E.##E#
#G..#.#
#..E#.# 
#######`
);

const sampleInput4 = parseSampleInput(
`#######
#E.G#.#
#.#G..#
#G.#.G# 
#G..#.#
#...E.#
#######`
);

const sampleInput5 = parseSampleInput(
`#######
#.E...#
#.#..G#
#.###.#
#E#G#G#
#...#G#
#######`
);

const sampleInput6 = parseSampleInput(
`#########
#G......#
#.E.#...#
#..##..G#
#...##..#
#...#...#
#.G...G.#
#.....G.#
#########`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 27730;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  DEBUG: true,
};
expected = 36334;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 39514;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = 27755;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  inputStr: sampleInput5,
  DEBUG: true,
};
expected = 28944;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  inputStr: sampleInput6,
  DEBUG: true,
};
expected = 18740;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 7
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 245280;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 4988;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 9
input = {
  part: 2,
  inputStr: sampleInput3,
  DEBUG: true,
};
expected = 31284;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 10
input = {
  part: 2,
  inputStr: sampleInput4,
  DEBUG: true,
};
expected = 3478;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 11
input = {
  part: 2,
  inputStr: sampleInput5,
  DEBUG: true,
};
expected = 6474;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 12
input = {
  part: 2,
  inputStr: sampleInput6,
  DEBUG: true,
};
expected = 1140;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 13
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 74984;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);