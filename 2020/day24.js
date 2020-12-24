// --- Day 24: Lobby Layout ---

// Your raft makes it to the tropical island; it turns out that the small crab was an excellent navigator. You make your way to the resort.

// As you enter the lobby, you discover a small problem: the floor is being renovated. You can't even reach the check-in desk until they've finished installing the new tile floor.

// The tiles are all hexagonal; they need to be arranged in a hex grid with a very specific color pattern. Not in the mood to wait, you offer to help figure out the pattern.

// The tiles are all white on one side and black on the other. They start with the white side facing up. The lobby is large enough to fit whatever pattern might need to appear there.

// A member of the renovation crew gives you a list of the tiles that need to be flipped over (your puzzle input). Each line in the list identifies a single tile that needs to be flipped by giving a series of steps starting from a reference tile in the very center of the room. (Every line starts from the same reference tile.)

// Because the tiles are hexagonal, every tile has six neighbors: east, southeast, southwest, west, northwest, and northeast. These directions are given in your list, respectively, as e, se, sw, w, nw, and ne. A tile is identified by a series of these directions with no delimiters; for example, esenee identifies the tile you land on if you start at the reference tile and then move one tile east, one tile southeast, one tile northeast, and one tile east.

// Each time a tile is identified, it flips from white to black or from black to white. Tiles might be flipped more than once. For example, a line like esew flips a tile immediately adjacent to the reference tile, and a line like nwwswee flips the reference tile itself.

// Here is a larger example:

// sesenwnenenewseeswwswswwnenewsewsw
// neeenesenwnwwswnenewnwwsewnenwseswesw
// seswneswswsenwwnwse
// nwnwneseeswswnenewneswwnewseswneseene
// swweswneswnenwsewnwneneseenw
// eesenwseswswnenwswnwnwsewwnwsene
// sewnenenenesenwsewnenwwwse
// wenwwweseeeweswwwnwwe
// wsweesenenewnwwnwsenewsenwwsesesenwne
// neeswseenwwswnwswswnw
// nenwswwsewswnenenewsenwsenwnesesenew
// enewnwewneswsewnwswenweswnenwsenwsw
// sweneswneswneneenwnewenewwneswswnese
// swwesenesewenwneswnwwneseswwne
// enesenwswwswneneswsenwnewswseenwsese
// wnwnesenesenenwwnenwsewesewsesesew
// nenewswnwewswnenesenwnesewesw
// eneswnwswnwsenenwnwnwwseeswneewsenese
// neswnwewnwnwseenwseesewsenwsweewe
// wseweeenwnesenwwwswnew

// In the above example, 10 tiles are flipped once (to black), and 5 more are flipped twice (to black, then back to white). After all of these instructions have been followed, a total of 10 tiles are black.

// Go through the renovation crew's list and determine which tiles they need to flip. After all of the instructions have been followed, how many tiles are left with the black side up?

// --- Part Two ---

// The tile floor in the lobby is meant to be a living art exhibit. Every day, the tiles are all flipped according to the following rules:

// Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
// Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.
// Here, tiles immediately adjacent means the six tiles directly touching the tile in question.

// The rules are applied simultaneously to every tile; put another way, it is first determined which tiles need to be flipped, then they are all flipped at the same time.

// In the above example, the number of black tiles that are facing up after the given number of days has passed is as follows:

// Day 1: 15
// Day 2: 12
// Day 3: 25
// Day 4: 14
// Day 5: 23
// Day 6: 28
// Day 7: 41
// Day 8: 37
// Day 9: 49
// Day 10: 37

// Day 20: 132
// Day 30: 259
// Day 40: 406
// Day 50: 566
// Day 60: 788
// Day 70: 1106
// Day 80: 1373
// Day 90: 1844
// Day 100: 2208

// After executing this process a total of 100 times, there would be 2208 black tiles facing up.

// How many tiles will be black after 100 days?

// NOTE: the way i handled a hexagonal grid is to simply imagine a chessboard pattern - if the origin hex is represented by, say, a white square, then its NE, SE, NW, SW neighbors are
// the white squares diagonally adjacent to the square, and its E and W neighbors are the white squares two spaces over to the left or right of the square. in other words, all hexes
// will ultimately be equivalent to squares that are only of the same color as the origin square. this makes sense: when you look at a hex grid pattern, adjacent "rows" appear to be
// shifted relative to one another. the same relationship applies to like colored squares of a chessboard.

function analyzeHexagonalFloor (part, inputStr) {
  const inputArr = inputStr.split('\n');

  // PARSE DATA TO FIND INITIAL CONFIGURATION
  const blackTiles = new Set();                                                             // track locations of all black tiles using a set containing serialized coordinates of said tiles
  for (const line of inputArr) {
    let x = 0;                                                                              // origin tile is (0,0); E neighbor is (2,0); NE neighbor is (1, 1); SE neighbor is (1, -1) etc.
    let y = 0;
    for (let i = 0; i < line.length; ) {                                                    // NOTE: handle the iteration of i separately within the cases below, as line is not delimited
      if (line[i] === "e") {
        x += 2;                                                                             // east neighbor is 2 units to the right
        i += 1;                                                                             // increment i by 1
      } else if (line[i] === "w") {
        x -= 2;                                                                             // west neighbor is 2 units to the left
        i += 1;                                                                             // increment i by 1
      } else if (line[i] === "n" && line[i + 1] === "e") {
        x += 1;                                                                             // NE neighbor is 1 unit to the right
        y += 1;                                                                             // ...and 1 unit up
        i += 2;                                                                             // increment i by 2
      } else if (line[i] === "n" && line[i + 1] === "w") {
        x -= 1;                                                                             // NW neighbor is 1 unit to the left
        y += 1;                                                                             // ...and 1 unit up
        i += 2;                                                                             // increment i by 2
      } else if (line[i] === "s" && line[i + 1] === "e") {
        x += 1;                                                                             // SE neighbor is 1 unit to the right
        y -= 1;                                                                             // ...and 1 unit down
        i += 2;                                                                             // increment i by 2
      } else if (line[i] === "s" && line[i + 1] === "w") {
        x -= 1;                                                                             // SW neighbor is 1 unit to the left
        y -= 1;                                                                             // ...and 1 unit down
        i += 2;                                                                             // increment i by 2
      } else {
        throw "INVALID: NO SOLUTION";                                                       // assuming valid input, we must fall into one of the above cases
      }
    }
    const serial = `${x},${y}`                                                              // serialize the coordinates for storage within the set
    if (blackTiles.has(serial)) blackTiles.delete(serial);                                  // if this tile is already black, flip it back white by deleting it from the set
    else blackTiles.add(serial);                                                            // else, this tile is white, so flip it black by adding it to the set
  }

  if (part === 1) {                                                                         // PART 1: RETURN THE NUMBER OF BLACK TILES AFTER THE INITIAL CONFIGURATION

    return blackTiles.size;

  } else {                                                                                  // PART 2: RETURN THE NUMBER OF BLACK TILES AFTER 100 DAYS BASED ON RULES

    // SIMULATE 100 DAYS ACCORDING TO THE RULES OF PART 2
    for (let i = 0; i < 100; ++i) {

      // STEP 1: FIND THE x AND y EXTREMA AMONG THE BLACK TILES
      let maxX = -Infinity;
      let minX = Infinity;
      let maxY = -Infinity;
      let minY = Infinity;
      for (const tile of [...blackTiles]) {
        const [x, y] = tile.split(",").map(n => +n);
        maxX = Math.max(maxX, x);
        minX = Math.min(minX, x);
        maxY = Math.max(maxY, y);
        minY = Math.min(minY, y);
      }

      // STEP 2: ITERATE THROUGH ALL HEXES (INCLUDING 1 UNIT BEYOND EXTREMA IN ALL 4 DIRECTIONS), COUNT BLACK TILE NEIGHBORS AND MAKE NECESSARY FLIPS
      const newBlackTiles = new Set();
      for (let x = minX - 1; x <= maxX + 1; ++x) {
        for (let y = minY - 1; y <= maxY + 1; ++y) {
          if (!!(x % 2) !== !!(y % 2)) continue;                                            // IMPORTANT: if the odd/evenness of x doesn't match that of y, this is not even a valid hex!
          let blackNeighbors = 0;                                                           // count the number of black tile neighbors
          if (blackTiles.has(`${x - 1},${y + 1}`)) ++blackNeighbors;                        // check NW
          if (blackTiles.has(`${x + 1},${y + 1}`)) ++blackNeighbors;                        // check NE
          if (blackTiles.has(`${x - 2},${y}`)) ++blackNeighbors;                            // check W
          if (blackTiles.has(`${x + 2},${y}`)) ++blackNeighbors;                            // check E
          if (blackTiles.has(`${x - 1},${y - 1}`)) ++blackNeighbors;                        // check SW
          if (blackTiles.has(`${x + 1},${y - 1}`)) ++blackNeighbors;                        // check SE
          const serial = `${x},${y}`;
          if (blackTiles.has(serial)) {                                                     // if tile is black...
            if (blackNeighbors === 1 || blackNeighbors === 2) newBlackTiles.add(serial);    // ...it turns white if 0 or 3+ neighbors - in other words, it stays black if 1 or 2 neighbors
          } else {                                                                          // else if tile is white...
            if (blackNeighbors === 2) newBlackTiles.add(serial);                            // it turns black if 2 neighbors
          }
        }
      }
      blackTiles.clear();                                                                   // clear the current set of black tiles...
      for (const tile of [...newBlackTiles]) blackTiles.add(tile);                          // ...and copy over the new set
    }
    
    return blackTiles.size;                                                                 // after the simulation of 100 days, return the number of black tiles

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = analyzeHexagonalFloor;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew`;

const actualInput = `nenwnwnwnwnewnwsenwnwnwsenwnwsenwnenww
eeeeeenewsweneeeeseeenwwnene
seeesesesenweeseewnw
nesesweneewseeseeseenwweeswesw
neeneeswneeeeeeeneeneeneweee
seseesenwsesesesesesesesenewseeseswsese
senwwwenwneswnwnwewswsewnesewesw
swswswswswnwseswwswswswswswswswsweswnw
neeneeweeeeseeneneeseeneneenenwe
seneswwnenewsewesenenenenenenenwnenenene
wwnwnenwsenwwnwwwwwwwwwwnww
seeeeneenesewseeswneeewnwseseswse
nwwwsenwnwwwwewwwwewnwwwwswnw
neneswenenenenenesweneneenewnwenenewne
nwwwneseswswnwesenwnesewswwsenwseww
nwwwnwnwnwnwnwwnwnwsewnwnwnw
nwsewsenenenwnweswnwnenwenenwswnwnwnwnw
nwnenwneewnwneswwnwnenwnwnwnwnwnwnwese
nenwneneenwnewnwnwnenw
seswswseswwseneswswsenwseswseswswe
swseswwswswswswswnwswswswswwnwseswswsww
wswseswswseswswsweswswneeseswwnwswnesw
nenenenwnwnwnenwnesenwnwnwnwnewnenenwnw
seneswnenwnenwnenewneseenwneneswnwnenenwne
nwnwnwnwnwnwnwswnwnwenwnwnwnwnwnwnwnww
nwweenweswneneneneneneeseeesewnene
nwswswswswswsweswswseswswswswswswswswsw
eeeenwneneeswneeeeneneneneeeneew
swwsewwwnwswnwwenewswswwseswswnesw
eswseswneneseswswwsenwseswswsesw
wewnewwwswswewsewneswswswswwwsw
eneeneeneneeneweenewneneeenenesw
enweneeesesesesesewneswneswesesewse
nwswswswwwswwswswwwswwswswswewsw
eeseweseseswseneseeseseeseseesee
nwswswswswswswswswnenewwswswwsenweswsw
wwwnwsesewnenewswsenenewww
neneneneneneneneeswnenwneneneswnwnwnenwnw
nenwnenwnwneswswswsewnenwnwneeswswnww
ewswswnewnwswwswswswswnesweswnwsesesw
nweenwnwnwswwnwnwnwnwwswnwnwnwenwswnwnw
senenwneneneeswneeeswnewenwnewswne
swsesweswnwwswswswswsweseseseswswwsene
swswweswnwwswnwwnwswwseewwwwsw
ewenwswwwwwwwwnwsewnwnenwsenww
eneenesenwswnenwnwnwneneneseseeswenwsw
sesesesenewnwnewsewseesewseseseesene
neeweneseeeeeswenweeneeswee
nwseseeeseeeeeseseewseweesenwe
eenweeneneeeeneseee
nwnwnwnwnwswnwnwnwnenwenwnwnwnwnwwswnw
sesenenwweseseeseesweeeneeseeese
nwenenenwnenwnenwnwsenwwnwsenwneseswsw
enwneneenwseswwneswwnwneswneseswwe
swswswswswwswseeswswswwneseseswswsese
nwnwnwenwneswnwnenenwwnwnwnwnenwnwnwne
nwwnenwewswswswswewswsweswenwswnwsw
nwwnesweswwswswwwwwewwwswwsww
sweeseeeeeeeenweeeeenwesw
wsewnewwwwnwwwwswwwwnew
wewwwswnewsesenewswswwwwwww
eeewneneeeeeeeseswesweseesee
nwwnwnenwneneswseneswsenwsenewenesenene
nwnwnwnwsenwnenewnwnwnwnenwnwnwsenenwnene
swswswswenwswseseeswnwswnwne
wesenwnwneenwnwnwnwnwnwswnwwnwnwnwsww
eeeweeeneenwneeesweseeeeee
neeswneswnewswswswnenenenwnenenwnenenenw
nwnwnenwnwnenwnenwwenwnwswwnwnwnwsenwe
wwwnwwwwwwwewwewwnwwwwnw
wnweswswwwwnwnwnwwnwnwwnewswnenwnw
nwsenwnwenwsewnwnwnenwnewnwenewnenwswnw
swnwsewweseswwsesesewnenesenesenesw
swwswswswsweswswswswswswswsw
nenewswneswneneneneneneneseneswnenenene
eswnwswswseswswswnwseswseeswseswseswsesew
newnewneneseeweeee
senwwseeseswseseseeseswswswswseswseswse
wsenenewneneweneeneseneneneeneenee
eneseseswsesewswseseseseew
wweneswwswswwwsewwswswwnwswwwsw
eeseeeewsweweseeeeenwewe
nwnewnwnwewswenenwnenwenwswnwneswnw
nenwseswnesesesweseseseswenwseewsesee
nwnewwseswwsenwnwneewnesenenwesenw
wnenenwnewneseneneneswswnesenwnwneenenene
esesesenwswseseseeeseeswsenwe
swswswswswswwswneswswwswwswswsww
neswsweswneneeeswwswwnwenwseswnenenene
nwswnenenenenwnenenwneneneneneswneenwnw
eesenweneeseseeeeswseeweesenw
swneneswnwenenwnwsenwnwnwnwnenwnwnwenw
nwnwsenwwnwnwsenwnewwwnwnwnwnwnw
nwseseneeewsenwnenenwneseswsweseswesw
nwnwnesenwnwnwwnwnwnwswnwnwnwnenwnenwne
eswswnewseswsenweswswswnesenewswswsw
eeneswneeeweneseswenenwnee
nenenwneseswwnwneneewnwenwswwswese
sewwwnwwwwwenwswwwwwwwwnw
eeewnweeneseeesweeeeweewswe
newsewswneeseswseseeseeseenesenwe
nwnwnwenwswneswsenwnwnwwnwnenenwswnwnwe
swnwswswswneswsesweswsewswseswswswseswnwsw
nwwwnwwsewwnweneswwwnwwewwww
wwswnwwwewnwwwsewnwnenwnwwwww
swswsweswswswswswneswneswswseswsesew
seeeeeeeeeeeeeeeenwswee
swseswseneswswswwswswswsesesesewneswsw
sesenwwnwseewnenwsee
seseeseseeseseeswseeesesesenwwsee
wseswsenenesweenwwswwnwwswnwnwenw
eneeeeeewenwweseseseeeneswese
swswseswseseswwseneseswswsweswsesesw
enwswsenwwnwnwnwsewwnwwewwnwnwwsw
nenwnwneneswnwnwwnwnwsenwwnwnenwsenwne
eseseeeneneeeeeeweeewesesew
seseswseeseswnwseswsesenwswseswnwseesenese
swswwsenwnewswsewsewsenwswwwnenenwse
nwswwswswwwswswswswswswswswseswnwesw
swwnwnwwnwsenwnenwenwwwnwnwnwnwnenwnww
neeneneneswnwneneenenenenwnenenwneneneswne
swneeswnenenenenenwnwswswnwewsenenene
seweweswseswswnenewnewswswnewenwne
wsewwwweswwnewwwsewswnewwew
newnwnwnwnwnwnwnwnwnwnwnwnwnwnwenw
swsenwswseseseseswnwswswswswsweswsesesese
nwnwnwwnwwwwnwwnwwwwse
nwnenwenenenwwnwnwnwnenenenenwnewene
sweseswnwnwswwsweswswswseseswswnwswsene
swwnewnweswewweneswesewenwswsw
nweeneswnwswswsesesesewwe
weswwnwswswsenwsewwswneswwswwww
nwnwnwneswnwnwnwnwnw
swswswswswswswswenwswswswswswnewswswswsw
nwnenwnwnwswswneneswsenwnwnenwnwnwswnenwnw
seseeseseswsenwseeseseneseseseseenwse
neenwnwnwwnwnwswnwnw
sesesewsesesesesesesesenesesewsesene
eeeneeeneneeenesweeenweeenesw
swsesesesenwswesweseswnwswsenwswseswsw
eseseseswseeeeswneesesesenweseeewe
neseeeeenweeeeneeeeneeneesenw
seeseseseseseseswswsenwsesewsesesesese
wswewwwwwewwswswwwwwwww
nwnwnwnwnwneenwnwnwsenenwnwnwsenwwnwnw
wwsewwwwwwnewnwwwwnwnwwwnw
swswseswswswswswsweswswswswwsweswswswnw
nenwnwnenwnenwnwneswnwnenwnwnwnwsenenesw
eweeseesweeeenwnwseswneeswnwenw
nenenewnenwnenwesenenenenenwne
nwenwsesenwseneeseneesenwseswwswsww
swswsenwnenwswswswseswwenenenwswswsese
wnewsewwnwwwwwwwwwnww
nwnenwnwnenenwnwnwnwnwnenwnwnwsenwnwnww
wwwneswwsenwwsenwwweewnwwnwnwe
wnewsewwnwwwswwenenwwnwsew
nwseswwsenwnwswnwneenewweneswwswne
weweeseseweswnwene
nwnwsewnwwnwnwwwwnwnwnwnwnwnwnw
enwseseswswswswswneswwswneswnewswswwsw
seswwenwnwwwwwsenwwwwnwswnewnwwnw
wnwwnwwwsenewnenwnwswwwwwnwwnwnw
neneneenewneenenesewneeeneneeene
wneswnwwwwwswwwwwseeseewwsw
neswnenenenwneneneenenenenwnwnwnenenene
nwnwnwnwsenwswnwnwnwnwnwnwnwnwnwenwnwnw
nenwseseneweseneneswwwseswsewswsesese
esesweseeeseeseseeeseeenwseese
sweneseswseseseseeseneseseesesesesee
nwnwnwswneneneneenwnenwnenenwnwnenw
nwwwswewsesewneww
wwwwwnewswwwswwwwwewwwwsw
sewwwneswswwsewnwnwwewwwwwe
nwnwnwnwnwnwnwnwnenwenwswnwnwnwnwnwnwnw
swswswswwswswnwswswwwswswswseswneswse
senewseseseswsewneswseweseseesesene
swseswswswneeswswswswseswswnwswswwswsw
nwesweenewsweneeneenesewneseee
eswseseseesenwseeenwnwseeseseesee
nwnewsenwwwwwwnewwwsenwnwnwww
eneneneneweneewenenene
senwnwnwnwnwnwnwnwnww
eneeeeneneeeeeeseeneeenewne
eseswswswswnwswswswswnwswseneswswswsww
nwwnwwnwnwnwnwnwsenwwenwnwnwnwsenwnw
wswsweswswswswwswswwwsenewswswwsww
enenewneneeeenenewsenewsenenene
eseeeeeseeeseeeesenwsweeese
eneeswwsewneseeeneseseeneewwee
swseseneswnwswswwswswswswswseswsweswswsese
neesewesesenwewneeeeneeneeeenwsw
eswwseenweseenweeeseeeeseee
wswseswneseneeswwnwsewse
sweswswswwseneswswneswewnwswneseseswsw
sesenwseseeseseseeenwseseeswnwsesee
seseswnwswseswswswswneseseswswseseswswsesw
nenweswwseeneeneneenenenesenenenenwnene
nwnwnwnwnwnwnwnwnwnwnwnwenwnwnwnwnwnwsw
swswwwwwswwneseswswwswwwwwswew
nwnenwnwnwwsenenwsenwwnwnenwenwnenwnwnwnw
wsewnwnwnenwnwnwnwnwnwsenwnwnwnwnwnenw
nenenenenwneeeeeeneeneeneeneseswe
wnenenenwnewnwnenenwnenenwseenenesenwne
nesenwsewnenwswenwneesewswnwswnesww
wwnwenwewswswwnwwseswnesweswnww
neneneenwneeneneneneswnenwneneneswneswne
nwnwswnwenwnwwewnwnweswnwnwwwnwwsww
eeeeeweeeneeeseseseeeesee
wwwwwswnewwwneswsewwwwwww
nweeswwseeseeenweeeeenene
nwnwnwnenenwnwnwnwsenwnwnwnwnww
seweeeseseseseeseeseeeeewesese
wseewseneseeseseesesese
senenwnwswnwnwswnenwnwnweswwwnwnwnene
swseseseesesesesewseseseenesesesewsese
seswswewseswswneswse
nenwnwnwnwnwnwenwnenenwswnenwnwswnwnwnwnw
neneeswwswnenwnwenwnenewnwnwnwnesewe
wnwnwswwnweeenenwsenwseenwnwwswnw
eeseseseeeeeeseeseneesewswnwse
neswseswewswsweswwswseswswwswswnwesw
nwwnwewsewnesewnwwsewww
weseeneneneeenesenweesenwwenenenee
nwwnwwenwnwnwswwwnwwnwnewnwnwswnww
nwwnwnwnwnwnwenwnwsenwnenwwnwnwnw
wsewseesenwneswnenenwenesewwwsww
swsesesesesesesenwwnese
newswewenenesewsenwweesweseenenw
nwnwnwnwnwnwnwnwsenwnwnwnwnwnw
swsweeswswseeneswswswnwwwswwnenwswsww
neneeneswneneneewnesenenenesenwnenw
nwnesenwnwnwnwnwnenwnwnw
nwnwswnwwwsewnwnwwsenenwwnenwnwswnwne
nwenwseseseeeeswsesesesesenwseweese
nwnwnwnwnwnwsenwnwwnwnwnwwnwnwnwnwnw
seneweseseseswnwswesesewseneseseswnew
eeeseseeeeeeseeseswnweeene
swnwseeeswnwseeseeseseesenw
swswswswsesweseswswseseswswseswswswnwsenew
swseseseswneneswswseswewsesweswswswnw
ewwswnewwwwnwswnwwwenwwwww
newneneeneseswwwseswwnenweenwseene
nwseswsesweseswswseswswnwnwswswseeseswsw
eeneeswneneeneseeeweenenenwnee
wsesesewswseeseseseseswseseswsesesenwne
swswnewewswsewnewwwnewwnwwnwew
swseswswneswwnwswneeww
sweswneeeeewneseenwneew
nwnwnwwwenesenwnwwnwnwswsenwenwswnwe
nwneenenwwsenenenenenwswsenenwneswnwnenew
wwwwsewswwwwnewwwwwwwnwww
wneneneeneseneeeeeneneneneneneene
seseeseeseeeseeesweseeesewnwew
seseeeswnwseeseseewseseeseseseeseese
seswsesesesenwsenwseseseswsesesesesesesese
swsweswswswswswnwswswswswswswneswswswsw
eeeeeweseeee
eewseseeeseeeseseeswsenesesesesenw
sewsewneseswseseweseneseeenwsewnwse
wnwwwwnwnenwwnwnwnwnwwswwnwwewnw
eeseseeewsesweeseneneseeeseee
neneseswseeeewneeeeseseswwseswee
neneeswenenweeneneenenenesewneeneene
swnwnenewwswseswwswsw
seseseswsesesesesesesesesenewwsenesese
nenesenesewesewsewneswseswneneswswse
neswswswswswswswneswseswwseswsenwneseswsw
neeeneeneneneneswnenwswneneneswnwenene
wwwwswwwnewwwswnwnwswseswwwesw
swneenwneeneewnenenenenewneswnenene
swswseseswswswseseneeswnwsesenwswswsese
senesenwsenenewnenwenwsenenwswenwnwwne
seseenwseenwseswseesesesesesesesesese
senwnwswnwnwswnwnenwwseeneneeswswnwnwne
nwwwnwnwwnwnwwewesewnwwwwwnw
enwnenweeseswnweewseneesweneeene
swswseseswsenwseseseeeswseseswswswnwsewse
nwwnwnwnenwseseswnwnwswnwne
senewseseseseeseseseseseeseeseseese
swswnwnwnwnenwnwnwnenwnwnwnenwwnenwsenwnwnw
neeneeneweeneeenweneseeeseswne
senenwnwnwnwnwnenenenesw
swswswwswneswnenwsesesweneswwswswswnew
nesewseeeseseseseesesee
eeeswnweweeeneeneneneeneeneee
senenenwnwnwswnwenenenwnwnenwnenene
senwnwnwnwwnwnwnwnwnwnwnwsewnwnwwnwnwnw
seseswseseseswseswwwseseseswsesweneswsese
eswnwsenwswswnwenenesesewwswnwnewe
eneneeseneeeeeeeseweeneneswenwnw
swwnwwswswnwswwseweswswweeswswsw
wswnwnewnwswweewsewnewnwnwseswsese
wwswwwswwswswnewswwnewswswswseswsww
sesesenesesesenwsewseseseseseewesesese
swneseswseswseswswswswswwswseseenewsese
ewswneseneswnwsesenwsewwnwenesewnew
eswnenwswnesweenwnwnwnwnenewneswsene
neweeeeneseeeeeeenewnenene
seseseseseeseseseseseseseesesesewwsene
swswswswswswswswswswswswswwswswswswewne
neenenewnwnenenenesenwneneswnwnee
nwewnwewsewswenewwseswswnwneneswne
swswseswneneseeswswseswseneseseswsewnw
wneneneenenenwnenwwnenenenenwneneene
weswnwnenwwsewswwwne
nwnenwnwnwnwswnwnwenwnweswnwnwsenwnwnwswnw
wnwwsenwswwnwnwnwenwwswnwwnwsenwwnwe
nwseeseswswseswseseswnewwseneseswseswsene
wwnwnenwwwswnwwwwweswnwwwwese
swseswswswswweneswswnenwseswneswnwswsw
ewswneeeseesewseeeseseeenewe
seswneseseswwswseseseseswseseswseseswsw
neneweneeeeesweneeenee
seeeseneweswnwwenweneenenwnesesw
eeeeeeeewesesesesesesesesesewse
newwenesesewseseseseswseswsesesesesese
eeseeseeweeneewseeeeeeeeee
swswwswwswswwswwwseweneneswswsesww
eeeweeeeseeeeeeeenweswe
wnwwwnwenwwwneseeseenwwnw
eewewesweneenenweewsweseweene
enwseswswnweswwswseneeenenewsenese
sweseswneseswswswswswswseswseeseswswnwswnw
eneswswnewwnwnwwnwsenwwee
swwwnwnwwnwwsewsewnwnwnewwnwenw
wenenwnenenwnenwneneneneneenenwwnwne
wnewwnwwsenwwnwwnwnwswnwwnwnwwwnw
wnwwwwwseeeneswnwnwnenesenwswsewsew
neneneneswnenenenenenenwnwnenesenenenenwne
nwwwwwwwswwwenww
nwseswwswnenenesenewesenw
swnwnwnwesweneseswnenenwnwnenenenenenw
eswwswswswwneswswwswwwewneswwswse
swneeseswnwswseswnwseseweeseenwswsew
wnwnenenenenwsenenenenenenenwnenene
neneseneeneneneneneneneneneeneenwswene
eenwenesenewsenenwneswewsw
swseseswseseeswneseswswswswswsesesenwsw
neeeneneneneneneneneneneneswnenenenewne
wnwnwnwwwswnwwnwnwwwnwnwnwnwnwenenw
neeswneewseeneeneneneneneneneneeeene
wswwwsewwwwwwwwwnwwweww
seseseswenwnwseesesesewseswnwsesesese
newneseeeseneneseswseewswenwseeese
wnwwwwnwwwenwnwswnwwnwwwswneww
nwneeeeeesenenweeeeeseeneesewe
nwnwnwnwnwnwenwwnwnwnwnwsenwnwnwnwnww
eseesewsewneeseneswneseneseesew
wseswenwnenewnwwswwewsesewwwsee
wsweseswsenwnwnwesesewseneseseseseese
wseswswseneneewswseseseseseswswsesese
swseswneswseseswseeswseswwswwswewswne
esweeeneeeeeseneeeeenwwee
wswswewnwswswswswnwswswswswe
nwweneswewwneneeeeneeweeeeee
sesesesenweswseseenwseseeeswsenwsese
neesewsenenweswsw
wswwswwseswweswswwwwnewwwwsww
swneswswswswswswswswnewswswseswswswswswsw
eweswnwnwwewswwswswswwswwswnwwswsw
nwsesesesweseseseseseseenwewnesenwsesesw
wwswswswewweswswswwwenewswwsww
seeeeweeeeeesweseeneeeee
esweeeseseeeseweseneseeeeese
wwswweswwwswswswwswwwwswww
neswseneseewnweenwnenenwneseswenwenwse
esenweeeseeeeswnwesweenwsenwe
swnwsenwnwnwnwnenwnwenwsenwwnenenw
swnwsenwnwsewsenwnenwnwnwnwe
neneweesweneneewenenewwsesew
nwnwwnwnwnwnwwnwwwewswnwnwnwnw
nwwnwwswwwnwenwwwnwnwwenwnwwnwnwnw
wseseswneeneweseseswswswsenwnwsesew
wwswswwwwswswwwnwswewswwwwne
eeeeeeeeesweeenweee
ewnwnwnwnwwnwnwseswnwnwnwenwsenwnwnw
nwnenweswnenwnwswenenwswnwesenwnesw
nwwnwwnwnesesenwsenwnwnwneenwenwswnw
senwneneweswenwswnwnwwwnwwsenwnwne
eseeswseeeenwsenwe
sewsesweseseeesenweseeneseseseseese
nenwnenesesenwneneesweneeenewnenee
seswswswswwwswwwnewwswwwwwww
swswwswnwswswneswwwswewswswswsewsw
nwwwswnwenwswnwsenwnwwwwewnwseneene
swwwneswnwewnwwwseswwwseswwsw
nwwenwnwnwsewnwwwnwnewnwwwwnwnwew
nwsenwsenewenwnwnewnwnwsenwswnwnwnwwnw
seswseseseswseswseseseeseesesesenwsewsenw
neswnwswnwewswswswwewnewwesweww
nwnenwnenwnenwnwnwnenwsenenwsenwnwnwnenwne
seswswwwnwwswwwswwnwswnewwwewww
nenenenenenenenenenenenwswnenenenenenenesew
neswswswswswswswswswswswswswenwswswswsw
sesweeeneeseesweeneeeeee
nwwswwswswwneenwswwneswnwswswswee
sewseesesenwseseseseesesesesesw
neenenesweweenweeeneneneswe
nwwwwneswwwwwsewwnenwswwnewwnw
eeeswnenweeeswswneeeneneswneene
sewnwnwseneneswneseswsesewswnwsww
enwnwswnenwswwsenwsenwnwnenwnwnwswnenwnw
neeeswneeeenwnewnweneeneneeseese
swsesewnwswnesewwwwswwwwwwneww
swswswwswswseswneswwwwswswswwsw
sewnewwwwwnewwwwwwswswwww
nenwenwnwneneswenwseseeeewneswnee
swwewnwwwnwsesenenesenwsweneswnenwnww
eeeseeneeeeeeweneeeeeene
swseseeswseswnwswsewswneseseswsesesese
nwseeweweneenweseeesweeeee
eeeeeneneneneneneeneeswwnewne
wwwwsewsweswswweswswnwwwswswswsw
nwswnwnenwwnwwnwnwnw
eeesenweeeseeeenwsweeesesese
enwnwseenwnwnwnwnwnwnwnenwnenenenwwnwsw
sewswswnewneswswneswswswseswswswswswswswsw
nwnenwnenwnwnwnenwnwnwnwnenwnwsenwnwnw
nwswswneswswwwswneeswwnenwnewwswswsese
sweswneswswwwswswswswwwswswswswswsw
wnwnwenwnewnwswwnwwswwwnwwenwese
swseneswswswswwswswswswneswswswswswswswsw
nwseeswnwnwsenwwswnwseenwnenwnwwe
wwwsewwnwwnewnwwwwwwwwww
sesweseeseeeseeseneenenwsewswsesese
wnwswnwwnwnwwnwwnwwnwnwnewswnenewsw
nenwnwnwnwnwnenwsenwnwnwnwnwnwnwnwnwnww
wnwnenwswnwwwnwwesesew
nwnenenenwnenenenwswnwnenwnenwneenwnene
eswnwwswswseseswswnwseswneswswsw
nwnwnenwwnenesenwnenenwnwneenenww
nwwwneneneenenwnwnenwneswneneneeneene
seseneneswwnwenewwswenewsenesewesww
neenewnenewneneneneseneneeeneneene
wwwwnenwwwnwwwwnwwwwsewwew
neswnwswnwseeseeswnweseneenwsesenew
nwnenwneenwnwnenwnwnenwswnwnenwnenwswnwnwe
nenewseswwwswswswswswswse
seswsenesesesewseswneswseeseseswseseswnw
wnwsewseswsewwwwnwwwwwwwenw
swwswwswswswsweeswswswswswswww
swnwnwnwnwwnwnwnwwwnwnwnwnwenwwnewsw
wweeneeeswneeeeeese
swswswswswswswwneneswswswswwswswswwswsesw
seseseneswseseseseswseswseseseseswwsenwsese
wwwewswnwwwwwnwwnwswnwne
wenwnwwwnwwwswwnwwwnewnewswsenw
swwswwwnenesewswswswnwswswsewwwwsw
nenwnewneneneseneswneneneneenwenenenene
nenenewneneneswnenenenenenenenenenesene
swnwwsewwwwwwwwswwneswwesesw
wwnwnwnwwwsewwwwwwwwwwsew
nenenesenewnenwneswnenwseeenwnenwsee
senwenenwnwnenwnwnenwnwneneneswnwnwnesene
neneenwneneneweeseswwnesenenwnwnewnesw
ewnwnenwnenwnenenwnenwsenwnwneswnwsenw
seswswsweseseneswnesesenwswnwseseswswwsese
swswnwswenenwsewsesw
sesweeseeneseseswsewesenenwnwsw
seseseswseseeswweseswseswnwsesesesesw
neeswnwswnenesesenwnwnwewsenwnwnewwsese
wneswwwwwwwswwswwswswswww
eeeeeeneneeenwswnewsweswnwnenw
neneswweeneeenwwseneswnweneenee
nenenewnwnenwnenewneneeneneneene
wswswswseswswsenenwswseswsweswsweswswnwsw
wsesesesesesesesesesesesesesesenesesese
wnwwnwwwnwswnwwsenwnwenwnewnwwnw
wwswneneesewseneswnenenenenenenenwneese
neeseswnenenwwnenenwseneneneenwneneww
enwnenwswneneneneneswenenwnenenenenenenwne
neneneneneneneenenesenenwneeneswnenenene
swsenewswsweseswswswewneewwswwnw
wsewswswnwneswwwwswswwswwwwwww
seneneneneeneneswsenenewnwnwnene
nenewnenenenwnenenwnenenwnenwnenenenese
seseseswswnenwseseseenwswnwswsesesewsese
swnwnwnewsweseeneseswneeenw
wwsenwnwnwnwewwwnwwwnwnwwwnwnw
nwwnwneseseeneswnwnwnenwnwsenwnwswse
eeseneeeseeeeseneseswweseeeswe
swswneseswseswwswswswswwswswswswswnenwsw
nwnwnwnenwwsenenenenwnwswnenwnwenwnwnwnw
eseseseeesesesesenwseseswseesenwsese
enweeseeeswenwseseeeseeeeeesw
sesenweeeeseseeeesweseeseeee
nwnwnwnwnwnwnwsenwnwnwnwnw
nenwneswnwnwnenwnwnwnenwnwnene
neseeeeswwenweeweweweenewe
neweeeseeseseseseeswenweeesenee
swwswnewseeswneneeseenwnwenwnenenenw
seswesenesewswenweseenweeweeene
seesewnwswseseesee
nwneswseseesewwnwseesenewneseswsese
nwseeeeenwesesewneseseeseeswsesee
nenenenewneseesenenweeesenenwnenenene
eeenwswwnwneenweeewsenwswesese
wneswwwwwswwwnewswswswwwswwseswsw
swseswseseswsesenwsesesenesesesweswseswse
wwswneswwsewwwweswsw
wseeseeenwseseneswswseese
nenwswnwswwwswsee
nwnwnwnenwnwnwnwnwnewnwnwnwswneenenenwne
eeeeswneseeeesesee
enenenwnwnwnwnenenenwnwnwnwswnenwnwswnw
eenewesesenenenenenewnenenenwneswnene
nwnwnwnwsenwnwesewnwsenenwwwwwnwsenwne
eesenwwsenwseswswwseweeeesenene
eeeneneeneeneeeeeneeewseesw
swwwwwswswswswwwswnwswwswwsweesw
neneneeenenewesweenwneeseeenenwee
swwswnwwswswswwswewswwwswswwww
neneneneneeewneeweneneenene
swswseswswnwswswsweseswswswwswswswswswsee
nwnwneswswswsewneswswseswnweswswweswse
eswswwswswswswswwneswswsweswsw
nwwwswswswwwsenwwwwnesewwswww
newneneeswneneneenesenenesw
nwwnwnwenwnwnwwnwww
nenesesewseseseseseseseseseseseseseesewe
neneneneneneneneneneeswneneswnenwneenene
nwswnwnwwwwnwnwnwewnwnww
nwnwnenwnwnwnwnwnenwnwsenwwnwnwnwnwswnwnw
nwnwnwnenewsenenenenwnenwewwsenenwne
wwsweswwwwswwswwswswsww
newseenewenwseswswsw
neswsenwnwnweenenwesenenwnesenenenenenesw
nwswwnwwenwnwnwnwnwenwnwswnwnwwnwwnw
nenwneswnenwswnenwnenenwnwnenenenenene
swswswswwweswswnwswseswswnewsweswswsw
ewseeseseseseeseeesenwseseseesese
nwnewnwsenwwnwwsenwnwww
nwswswswweneswswwswwneseswseswswswe
eewseweneeeseesweneesesenwneswe
wswwnesewnewwneneswsewwwwsewwww
nenenenwnenwnenwnenwenwnewneswnwnwnee
eeweeeeesesewnewseenweseee
enenenewswnenenwseneneeneneenenenenenee
eswenwswnwnwnenewswwneseseseeesenw
swswseswswswswseseswneswsw
neneeenwswnesweswneseneneenenweeenene
newwwwesewsewwwwwwnwswwneww
wesenenwnweseeseseeeeswe
seeeenweneneeneeeeeeene
swwsewnwseseneweneswneeswswnwseswswse
wnenenwswneenewneswneneneeeswenwne
sewnesenwwnwnwnwwnewnwnwnwnwswsewnw
eeeenwswesweeswneeweeeeenee
nwseswswsesesenwseseseswswsw
eeeseseeseesesewnenwewesweweee
wswsewwwsenwnenewsewwsenwnewwnew
eeeeenwneeeenwenesesweeeneeee
nesewseswneneenenwnene
neneenwneneneswsweenewnenwneneenene
nwnwnwnwnwnwwnwnwnwweswnwnwnwnwnwwenw
seswsweseswseswswseneswswwswseseswswsw
seseseswwseseswswswseneenewsew
swsewswswsesesewswseseswswneswnesw
ewweenwneseneeneesweeeweee
swseswswseswsweswneswswswsenwswsw
neseswseseseseseesesenwwseseesesese
nwswnwswnwnwnwwnwenwnwnwenwnwnwnwnenww
neneneneneenesweseenewnewneeswnesee
sweseseeewwneswseenweesesewnwe
nwnwnwnwewnwnwnwnwnwnwwnwwnwwsenwenw
nwwwwswswswwewwsenwww
eswwnwnwneswswswnwwswswweseswwswswsw
swneweseneenenwneneneeseneseweww
nwnenenwnwnenwnenenenwnenwnwnwsenwne
neswswswswswnwsesenenewwseseseswseswse
nesenwswseseseseewsesesweswesenwsesew
nwwnwnwnwnwsenwnweswnwwswnwnwnwnwenenw
nwneneeswnenwnwnenwwnwnwenwneswnwnwsw
nwnenwnwswnenenwnewnwnwnweweswnwswseswe
wnwsenewswnwnwnwnwwnwnwswnwnwswnwenwnwe
swwswswswswswswswswswneseswswswswswswsw
enwesenwseneesewwnwswse
neeneenewenesesweneneeeeneeene
esewesenwnenewneewnenene
nenenenenewneneneneenwnwneneneneneswe
seenweeseeseseesesesee`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 10;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 523;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 2208;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 4225;
test(func, input, expected, testNum, lowestTest, highestTest);