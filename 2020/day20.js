// --- Day 20: Jurassic Jigsaw ---

// The high-speed train leaves the forest and quickly carries you south. You can even see a desert in the distance! Since you have some spare time, you might as well see if there was anything interesting in the image the Mythical Information Bureau satellite captured.

// After decoding the satellite messages, you discover that the data actually contains many small images created by the satellite's camera array. The camera array consists of many cameras; rather than produce a single square image, they produce many smaller square image tiles that need to be reassembled back into a single image.

// Each camera in the camera array returns a single monochrome image tile with a random unique ID number. The tiles (your puzzle input) arrived in a random order.

// Worse yet, the camera array appears to be malfunctioning: each image tile has been rotated and flipped to a random orientation. Your first task is to reassemble the original image by orienting the tiles so they fit together.

// To show how the tiles should be reassembled, each tile's image data includes a border that should line up exactly with its adjacent tiles. All tiles have this border, and the border lines up exactly when the tiles are both oriented correctly. Tiles at the edge of the image also have this border, but the outermost edges won't line up with any other tiles.

// For example, suppose you have the following nine tiles:

// Tile 2311:
// ..##.#..#.
// ##..#.....
// #...##..#.
// ####.#...#
// ##.##.###.
// ##...#.###
// .#.#.#..##
// ..#....#..
// ###...#.#.
// ..###..###

// Tile 1951:
// #.##...##.
// #.####...#
// .....#..##
// #...######
// .##.#....#
// .###.#####
// ###.##.##.
// .###....#.
// ..#.#..#.#
// #...##.#..

// Tile 1171:
// ####...##.
// #..##.#..#
// ##.#..#.#.
// .###.####.
// ..###.####
// .##....##.
// .#...####.
// #.##.####.
// ####..#...
// .....##...

// Tile 1427:
// ###.##.#..
// .#..#.##..
// .#.##.#..#
// #.#.#.##.#
// ....#...##
// ...##..##.
// ...#.#####
// .#.####.#.
// ..#..###.#
// ..##.#..#.

// Tile 1489:
// ##.#.#....
// ..##...#..
// .##..##...
// ..#...#...
// #####...#.
// #..#.#.#.#
// ...#.#.#..
// ##.#...##.
// ..##.##.##
// ###.##.#..

// Tile 2473:
// #....####.
// #..#.##...
// #.##..#...
// ######.#.#
// .#...#.#.#
// .#########
// .###.#..#.
// ########.#
// ##...##.#.
// ..###.#.#.

// Tile 2971:
// ..#.#....#
// #...###...
// #.#.###...
// ##.##..#..
// .#####..##
// .#..####.#
// #..#.#..#.
// ..####.###
// ..#.#.###.
// ...#.#.#.#

// Tile 2729:
// ...#.#.#.#
// ####.#....
// ..#.#.....
// ....#..#.#
// .##..##.#.
// .#.####...
// ####.#.#..
// ##.####...
// ##..#.##..
// #.##...##.

// Tile 3079:
// #.#.#####.
// .#..######
// ..#.......
// ######....
// ####.#..#.
// .#...#.##.
// #.#####.##
// ..#.###...
// ..#.......
// ..#.###...

// By rotating, flipping, and rearranging them, you can find a square arrangement that causes all adjacent borders to line up:

// #...##.#.. ..###..### #.#.#####.
// ..#.#..#.# ###...#.#. .#..######
// .###....#. ..#....#.. ..#.......
// ###.##.##. .#.#.#..## ######....
// .###.##### ##...#.### ####.#..#.
// .##.#....# ##.##.###. .#...#.##.
// #...###### ####.#...# #.#####.##
// .....#..## #...##..#. ..#.###...
// #.####...# ##..#..... ..#.......
// #.##...##. ..##.#..#. ..#.###...

// #.##...##. ..##.#..#. ..#.###...
// ##..#.##.. ..#..###.# ##.##....#
// ##.####... .#.####.#. ..#.###..#
// ####.#.#.. ...#.##### ###.#..###
// .#.####... ...##..##. .######.##
// .##..##.#. ....#...## #.#.#.#...
// ....#..#.# #.#.#.##.# #.###.###.
// ..#.#..... .#.##.#..# #.###.##..
// ####.#.... .#..#.##.. .######...
// ...#.#.#.# ###.##.#.. .##...####

// ...#.#.#.# ###.##.#.. .##...####
// ..#.#.###. ..##.##.## #..#.##..#
// ..####.### ##.#...##. .#.#..#.##
// #..#.#..#. ...#.#.#.. .####.###.
// .#..####.# #..#.#.#.# ####.###..
// .#####..## #####...#. .##....##.
// ##.##..#.. ..#...#... .####...#.
// #.#.###... .##..##... .####.##.#
// #...###... ..##...#.. ...#..####
// ..#.#....# ##.#.#.... ...##.....

// For reference, the IDs of the above tiles are:

// 1951    2311    3079
// 2729    1427    2473
// 2971    1489    1171

// To check that you've assembled the image correctly, multiply the IDs of the four corner tiles together. If you do this with the assembled tiles from the example above, you get 1951 * 3079 * 2971 * 1171 = 20899048083289.

// Assemble the tiles into an image. What do you get if you multiply together the IDs of the four corner tiles?

// --- Part Two ---

// Now, you're ready to check the image for sea monsters.

// The borders of each tile are not part of the actual image; start by removing them.

// In the example above, the tiles become:

// .#.#..#. ##...#.# #..#####
// ###....# .#....#. .#......
// ##.##.## #.#.#..# #####...
// ###.#### #...#.## ###.#..#
// ##.#.... #.##.### #...#.##
// ...##### ###.#... .#####.#
// ....#..# ...##..# .#.###..
// .####... #..#.... .#......

// #..#.##. .#..###. #.##....
// #.####.. #.####.# .#.###..
// ###.#.#. ..#.#### ##.#..##
// #.####.. ..##..## ######.#
// ##..##.# ...#...# .#.#.#..
// ...#..#. .#.#.##. .###.###
// .#.#.... #.##.#.. .###.##.
// ###.#... #..#.##. ######..

// .#.#.### .##.##.# ..#.##..
// .####.## #.#...## #.#..#.#
// ..#.#..# ..#.#.#. ####.###
// #..####. ..#.#.#. ###.###.
// #####..# ####...# ##....##
// #.##..#. .#...#.. ####...#
// .#.###.. ##..##.. ####.##.
// ...###.. .##...#. ..#..###

// Remove the gaps to form the actual image:

// .#.#..#.##...#.##..#####
// ###....#.#....#..#......
// ##.##.###.#.#..######...
// ###.#####...#.#####.#..#
// ##.#....#.##.####...#.##
// ...########.#....#####.#
// ....#..#...##..#.#.###..
// .####...#..#.....#......
// #..#.##..#..###.#.##....
// #.####..#.####.#.#.###..
// ###.#.#...#.######.#..##
// #.####....##..########.#
// ##..##.#...#...#.#.#.#..
// ...#..#..#.#.##..###.###
// .#.#....#.##.#...###.##.
// ###.#...#..#.##.######..
// .#.#.###.##.##.#..#.##..
// .####.###.#...###.#..#.#
// ..#.#..#..#.#.#.####.###
// #..####...#.#.#.###.###.
// #####..#####...###....##
// #.##..#..#...#..####...#
// .#.###..##..##..####.##.
// ...###...##...#...#..###

// Now, you're ready to search for sea monsters! Because your image is monochrome, a sea monster will look like this:

//                   # 
// #    ##    ##    ###
//  #  #  #  #  #  #   

// When looking for this pattern in the image, the spaces can be anything; only the # need to match. Also, you might need to rotate or flip your image before it's oriented correctly to find sea monsters. In the above image, after flipping and rotating it to the appropriate orientation, there are two sea monsters (marked with O):

// .####...#####..#...###..
// #####..#..#.#.####..#.#.
// .#.#...#.###...#.##.O#..
// #.O.##.OO#.#.OO.##.OOO##
// ..#O.#O#.O##O..O.#O##.##
// ...#.#..##.##...#..#..##
// #.##.#..#.#..#..##.#.#..
// .###.##.....#...###.#...
// #.####.#.#....##.#..#.#.
// ##...#..#....#..#...####
// ..#.##...###..#.#####..#
// ....#.##.#.#####....#...
// ..##.##.###.....#.##..#.
// #...#...###..####....##.
// .#.##...#.##.#.#.###...#
// #.###.#..####...##..#...
// #.###...#.##...#.##O###.
// .O##.#OO.###OO##..OOO##.
// ..O#.O..O..O.#O##O##.###
// #.#..##.########..#..##.
// #.#####..#.#...##..#....
// #....##..#.#########..##
// #...#.....#..##...###.##
// #..###....##.#...##.##.#

// Determine how rough the waters are in the sea monsters' habitat by counting the number of # that are not part of a sea monster. In the above example, the habitat's water roughness is 273.

// How many # are not part of a sea monster?

function analyzeImage (part, inputStr) {
  const inputArr = inputStr.split('\n\n');

  // HELPFUL CONSTANTS
  const numTiles = inputArr.length;
  const len = 10;                                                                 // both the sample data and the actual data feature 10 x 10 images

  // DATA STRUCTURES AND UTILITY FUNCTIONS
  function reverse(str) {                                                         // we will have to do this many times in this problem
    return str.split("").reverse().join("");
  }

  const tileData = {};                                                            // each key is a tile ID, and its value is an array of strings representing the image on that tile
  for (const tile of inputArr) {
    const [label, data] = tile.split(":\n");
    tileData[label.slice(5)] = data.split("\n");
  }

  const borders = {};                                                             // each key is a string representing a unique edge, and its value is an array of all tile IDs that feature it
  function addToDict(str, id) {
    if (!(str in borders)) borders[str] = [];
    borders[str].push(id);
  }
  function getTop(data) {                                                         // given an array representing an image on a tile, return the top edge
    return data[0];
  }
  function getRight(data) {                                                       // given an array representing an image on a tile, return the right edge (if that edge is rotated to the top)
    return data.map(row => row[len - 1]).join("");
  }
  function getBottom(data) {                                                      // ditto, for bottom edge
    return reverse(data[len - 1]);
  }
  function getLeft(data) {                                                        // ditto, for left edge
    return data.map(row => row[0]).reverse().join("");
  }
  for (const id in tileData) {                                                    // for each tile, add all 4 edges into the borders cache...
    const data = tileData[id];
    const top = getTop(data);
    addToDict(top, id + "A");                                                     // ...making sure to represent current tile ID with an extra "A" to denote its original flip orientation...
    addToDict(reverse(top), id + "B");                                            // ...then do the same with each edge reversed (simulating a flip), with an extra "B" after the ID
    const right = getRight(data);
    addToDict(right, id + "A");
    addToDict(reverse(right), id + "B");
    const bottom = getBottom(data);
    addToDict(bottom, id + "A");
    addToDict(reverse(bottom), id + "B");
    const left = getLeft(data);
    addToDict(left, id + "A");
    addToDict(reverse(left), id + "B");
  }

  // KEEP EDGES FOR ONLY ONE FLIP ORIENTATION (A/B) WHILE DISCARDING EDGES FROM THE OPPOSITE ORIENTATION - DFS "GRAPH" TRAVERSAL
  const stack = [Object.keys(tileData)[0] + "A"];                                 // initialize a stack, and arbitrarily deem the first tile ID's "A" orientation to be valid
  const visited = new Set();                                                      // keep a visited set to avoid cycles
  while (stack.length) {
    const knownId = stack.pop();
    const id = knownId.slice(0, knownId.length - 1);
    if (visited.has(id)) continue;
    visited.add(id);
    const orientation = knownId[knownId.length - 1];
    const oppositeId = id + (orientation === "A" ? "B" : "A");                    // e.g. if we know that for 2311, "B" is correct, then we will need to discard all 2311A edges
    for (const border in borders) {
      if (borders[border].includes(oppositeId)) delete borders[border];           // delete edges for the orientation opposite to the current valid one
    }
    for (const border in borders) {
      if (borders[border].length === 2 && borders[border].includes(knownId)) {    // if an edge belongs to the current valid tile orientation as well as another tile...
        const otherId = borders[border].filter(id => id !== knownId)[0];          // ...then that other tile (along with its A/B orientation) is confirmed to be valid as well...
        stack.push(otherId);                                                      // ...so push it to the stack
      }
    }
  }

  const edges = {};                                                               // each key is a tile ID, and its value represents the number of unshared edges that belong to that tile
  for (const border in borders) {
    if (borders[border].length === 1) {
      const id = borders[border][0];
      edges[id] = edges[id] + 1 || 1;
    }
  }

  if (part === 1) {                                                               // PART 1: RETURN THE PRODUCT OF THE 4 CORNER TILE IDS
  
    return Object.keys(edges).reduce((product, id) =>
      edges[id] === 2 ? product * +id.slice(0, id.length - 1)                     // corner tiles are the only tiles that have exactly 2 unshared edges (edge tils have 1, interior tiles have 0)
      : product,
      1
    );

  } else {                                                                        // PART 2: STITCH THE TILES TOGETHER, STRIP AWAY EDGES, ORIENT IMAGE TO LOCATE MONSTERS, AND COUNT # OF WATER

    // UTILITY FUNCTIONS FOR MANIPULATING AN IMAGE REPRESENTED BY AN ARRAY OF STRINGS
    function flipImage(image) {
      return image.map(row => reverse(row));
    }
    function rotateImage(image) {
      const newImage = [];
      for (let col = 0; col < image[0].length; ++col) {
        let newRow = "";
        for (let row = image.length - 1; row >= 0; --row) {
          newRow += image[row][col];
        }
        newImage.push(newRow);
      }
      return newImage;
    }
    
    // STITCH TOGETHER THE IMAGE, BEGINNING WITH DEDUCING THE RELATIVE ARRANGEMENT OF TILES BY ID
    const firstCorner = Object.keys(edges).filter(id => edges[id] === 2)[0];      // arbitrarily begin with the ID of any corner tile - this will go in the top left of our tile arrangement
    const firstCornerId = firstCorner.slice(0, firstCorner.length - 1);
    for (let i = 0; i < 8; ++i) {                                                 // the first tile must be oriented such that its right and bottom edges are both shared. try all 8 orientations
      const rightEdge = getRight(tileData[firstCornerId]);
      const bottomEdge = getBottom(tileData[firstCornerId]);
      if (
        (
          borders[
            rightEdge in borders ? rightEdge                                      // search the borders object for the right edge...
            : reverse(rightEdge)                                                  // ...(or the reverse of its right edge)...
          ].length === 2                                                          // ...and ensure that it is a shared edge
        ) &&
        (
          borders[
            bottomEdge in borders ? bottomEdge                                    // do the same for the bottom edge
            : reverse(bottomEdge)
          ].length === 2
        )
      ) break;                                                                    // when the above conditions have been met, break
      if (i === 7) throw "INVALID: NO SOLUTION";                                  // sanity check: if no solution is found after all 8 orientations, our data is bad
      if (i === 3) tileData[firstCornerId] = flipImage(tileData[firstCornerId]);  // if we haven't found a solution after 4th rotation, flip the image
      tileData[firstCornerId] = rotateImage(tileData[firstCornerId]);             // if we haven't found a solution, rotate
    }

    const imageById = [[firstCornerId]];                                          // this structure is our arrangement of tiles by ID
    let currentRow = 0;                                                           // track the current row, as we do not know in advance what the dimensions of the image will be
    let tilesPlaced = 1;                                                          // instead, we will keep count of how many tiles we have placed in our arrangement...
    while (tilesPlaced < numTiles) {                                              // ...since we cannot use a for loop, as we do not know the dimensions of the image
      const previousId = imageById[currentRow][imageById[currentRow].length - 1];
      let nextId;
      const rightEdge = getRight(tileData[previousId]);                           // examine the right edge of the previous tile...
      if (
        borders[
          rightEdge in borders ? rightEdge                                        // ...and see if it is a shared edge, to determine if the next tile goes to its right
          : reverse(rightEdge)                                                    // (make sure to check the reverse of the previous right edge as well)
        ].length === 2                                                            // CASE i: THE NEXT TILE GOES TO THE RIGHT OF THE PREVIOUS ONE
      ) {
        nextId = borders[
            rightEdge in borders ? rightEdge
            : reverse(rightEdge)
          ].filter(id => id.slice(0, id.length - 1) !== previousId)[0];
        nextId = nextId.slice(0, nextId.length - 1);                              // if so, then the next tile is the one that shares the right edge of the previous tile
        for (let i = 0; i < 8; ++i) {                                             // check all 8 orientations for the one where the left edge matches the previous right edge
          if (
            getLeft(tileData[nextId]) === reverse(getRight(tileData[previousId]))
          ) break;
          if (i === 7) throw "INVALID: NO SOLUTION";                              // sanity check: if no solution is found after all 8 orientations, our data is bad
          if (i === 3) tileData[nextId] = flipImage(tileData[nextId]);            // if we haven't found a solution after 4th rotation, flip the image
          tileData[nextId] = rotateImage(tileData[nextId]);                       // if we haven't found a solution, rotate
        }
      } else {                                                                    // CASE ii: THE NEXT TILE GOES ON THE NEXT ROW
        const imageAboveId = imageById[currentRow][0];                            // the tile above the next tile is the first one on the previous row
        imageById.push([]);
        ++currentRow;                                                             // increment currentRow
        const bottomEdge = getBottom(tileData[imageAboveId]);                     // examine the bottom edge of the tile above...
        nextId = borders[
          bottomEdge in borders ? bottomEdge                                      // ...and search the borders object for this edge...
          : reverse(bottomEdge)                                                   // ...(or its reverse)...
        ].filter(id => id.slice(0, id.length - 1) !== imageAboveId)[0];           // ...and find the other tile ID to determine which tile goes next
        nextId = nextId.slice(0, nextId.length - 1);
        for (let i = 0; i < 8; ++i) {                                             // check all 8 orientations for the one where the top edge matches the one from above
          if (
            getTop(tileData[nextId]) === reverse(getBottom(tileData[imageAboveId]))
          ) break;
          if (i === 7) throw "INVALID: NO SOLUTION";                              // sanity check: if no solution is found after all 8 orientations, our data is bad
          if (i === 3) tileData[nextId] = flipImage(tileData[nextId]);            // if we haven't found a solution after 4th rotation, flip the image
          tileData[nextId] = rotateImage(tileData[nextId]);                       // if we haven't found a solution, rotate
        }
      }
      imageById[currentRow].push(nextId);                                         // in either case (i or ii), push the ID of the new tile into the current row of the arrangement...
      ++tilesPlaced;                                                              // ...and increment tilesPlaced
    }

    // NOW STITCH TOGETHER THE IMAGE ITSELF BASED ON THE ARRANGEMENT OF THE TILE IDS, AND REMEMBER TO STRIP AWAY THE EDGES
    let image = [];
    for (let row = 0; row < imageById.length; ++row) {                            // iterate through the rows of the tile arrangement
      for (let i = 1; i < len - 1; ++i) {                                         // iterate through the SECOND to SECOND LAST rows of the image within a tile
        let rowText = "";
        for (let col = 0; col < imageById[0].length; ++col) {                     // iterate through the columns of the tile arrangement
          const segment = tileData[imageById[row][col]][i];
          rowText += segment.slice(1, segment.length - 1);                        // for each tile, grab the slice from the SECOND to the SECOND LAST characters
        }
        image.push(rowText);
      }
    }

    // IMPORTANT CONSTANTS FOR IDENTIFYING THE MONSTER
    const monster = `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `.split("\n");
    const monsterHeight = monster.length;
    const monsterWidth = monster[0].length;
    const monsterCoords = [];                                                     // once the image is oriented correctly, this holds [row, col] coords for the top left of all monsters
    function containsMonster(image) {
      for (let row = 0; row < image.length - monsterHeight + 1; ++row) {          // iterate through all possible top left corners where a monster could be found
        for (let col = 0; col < image[0].length - monsterWidth + 1; ++col) {
          let invalid = false;
          for (let r = 0; r < monsterHeight; ++r) {                               // scan this location for the monster
            if (invalid) break;
            for (let c = 0; c < monsterWidth; ++c) {
              if (monster[r][c] === "#" && image[row + r][col + c] !== "#") {     // the scan can be immediately aborted if the image lacks a "#" where the monster should be
                invalid = true;
                break;
              }
            }
          }
          if (!invalid) monsterCoords.push([row, col]);                           // if the scan completes without aborting, save the current [row, col] coords
        }
      }
      return monsterCoords.length;                                                // only one orientation has any monsters at all - check if monsterCoords is empty
    }
    
    for (let i = 0; i < 8; ++i) {                                                 // check all 8 orientations for the one where monster coords are found
      if (containsMonster(image)) break;
      if (i === 7) throw "INVALID: NO SOLUTION";                                  // sanity check: if no solution is found after all 8 orientations, our data is bad
      if (i === 3) image = flipImage(image);                                      // if we haven't found a solution after 4th rotation, flip the image
      image = rotateImage(image);                                                 // if we haven't found a solution, rotate
    }

    image = image.map(str => str.split(""));                                      // to modify the image, we must convert the string elements to arrays of characters
    for (const [row, col] of monsterCoords) {
      for (let r = 0; r < monsterHeight; ++r) {
        for (let c = 0; c < monsterWidth; ++c) {
          if (monster[r][c] === "#") image[row + r][col + c] = "O";               // where we have identified a monster, change "#" to "O"
        }
      }
    }

    for (const row of image) console.log(row.join(""));                           // OPTIONAL: SEE THE FINAL IMAGE
    return image.reduce((total, row) =>                                           // this allows us finally to count the unchanged "#" (rough water) patches. count up the "#" totals per row
      total + row.reduce((t, p) => t + (p === "#"), 0),                           // (and count up the total "#" on each row)
      0
    );

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = analyzeImage;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...`;

const actualInput = `Tile 3371:
##...###.#
........#.
..#.#...#.
##..#.....
##.......#
##........
...#......
.........#
#.#......#
.#..###...

Tile 2663:
.#.##..#..
.#..#.....
#........#
....#....#
.......###
....##....
##.#.##.##
.##..##..#
.........#
........#.

Tile 1063:
####...###
..##.....#
.#..#....#
##...#....
#..##...#.
#........#
##.......#
..........
.#.#....#.
.###....#.

Tile 2731:
.####.#.##
#.........
.#.#.##.#.
##..#..#.#
#.#.#....#
####...#.#
#.....#.##
##.##.....
..#..#..##
......#..#

Tile 2711:
#.##..#..#
#...#...##
.#.###...#
......#..#
#.....#..#
....#.#...
.#......##
....#.#..#
..........
###..####.

Tile 1087:
...#.#####
#.........
.....#...#
#.#..#...#
####.#..##
..#.#..#.#
.#..##...#
##...##..#
........#.
##...#....

Tile 2767:
###...#.#.
#.###....#
......##.#
.#........
##....#...
.#.#......
.#..#.##.#
#.#.###...
#........#
..##..###.

Tile 1951:
#...#...##
..........
#.......#.
.........#
...#....##
#.##...###
#.##.#..##
...##....#
...#......
##.#######

Tile 2347:
#..##.###.
.........#
#.#......#
.#....#...
..........
###......#
...###.#.#
#...#.....
......##.#
#.......##

Tile 2243:
.#.#...#..
#.........
#..#.#...#
.........#
#........#
#....#...#
#.....#..#
........#.
#.........
.#.#.#..#.

Tile 3019:
.##...#.##
......###.
......##.#
..#.....##
#.#.....#.
##.....#..
...#......
#.##..#...
###....#.#
##..##.##.

Tile 2851:
...#.##..#
........##
###..#...#
#......#..
#...#.....
..#..##...
##.#...#.#
...#..##..
..#..#..#.
#####.....

Tile 2267:
#####.##..
.....##..#
#.#.......
#........#
#.#...##..
...###....
#.#.....#.
.##.......
..#.......
.#..####..

Tile 2351:
#.#....#..
#..#..#...
###....#.#
#..#.#...#
##...#.#.#
#.#..#.##.
.#..#.##.#
......#.#.
###....#.#
....###.#.

Tile 1373:
..###..##.
..##....##
##..#.##.#
.#...#....
..#..#...#
###....#.#
..##..#..#
...#.....#
#.#...##..
#..##..##.

Tile 2917:
###.#.#.#.
#........#
.#......##
....##...#
.........#
#......#.#
...#......
..#.##..#.
#..###..#.
.#..##.#..

Tile 2423:
#.......##
#......#..
.....#....
##.#......
.#.#..##.#
..#....###
#........#
.....#....
#.....#.##
..###.#...

Tile 3331:
.....##.##
#........#
#.........
#....#...#
.#.#....#.
#.#...#...
#..#......
.#.......#
..........
.#....#.#.

Tile 1297:
.##.##....
.......#..
....#.#.#.
.#........
....#.....
..#..#..#.
#.......##
#...#.....
#..#....##
.#.###.#..

Tile 3923:
...###.##.
#...#.....
.#........
.#.#......
#...#.....
.....##.#.
.....#...#
#...#.#...
#.....#...
.#.......#

Tile 1571:
..##..##.#
..#..#..#.
#........#
...#......
#.......#.
##........
#.........
#...#.#...
.##.#....#
.##.#..#..

Tile 3461:
.#....#..#
........##
#...#...#.
.#...##...
.###......
..........
#..#....#.
#........#
.##..#...#
.##.#.#.#.

Tile 1291:
#.#.#...#.
####....##
..#..#.#.#
....##...#
.......#..
#.....##..
....#...#.
..#..#..#.
#.###....#
...####.#.

Tile 2179:
#.###.#...
#....###..
...#.....#
#.........
...#.....#
...#.#....
#........#
#........#
.........#
.#..##....

Tile 2153:
#...#....#
##...###.#
#...#..#..
#....#...#
#.........
.#..#....#
#....#...#
#..#.#..#.
....#.#..#
##..###.##

Tile 2621:
###..#..##
.......#.#
#........#
....##...#
##..##...#
#.........
..#......#
.....##..#
###.#....#
..##.##.##

Tile 3347:
#.#..#..##
.#.......#
###..###.#
#...#.#..#
#....###..
.##.#.##.#
#...#.##..
.##.##....
##..##..##
#.#.......

Tile 3001:
#...###...
#......#.#
#.....####
#....#....
##.##.#...
#.#.......
.....#..#.
....#.#.##
#.....##..
#.#..#.###

Tile 2707:
.###..#..#
..##...#.#
##.##.#..#
....##...#
#...#..###
#......#..
#.........
#.#......#
.........#
#...#.#...

Tile 3041:
#....##.#.
.#..#..#.#
.........#
###....###
...#.....#
..##..#..#
.#......#.
##.......#
..###.##..
#.#..##..#

Tile 1709:
.##.#....#
.........#
#.#.##....
###.....##
#.....#...
#.....##..
.........#
#........#
..#..#..##
.####.##.#

Tile 2837:
.#...#.##.
###..#...#
#..###..##
....#.....
#........#
..........
#......#.#
....#...#.
..#..#....
...#....##

Tile 1741:
.####.##..
.##......#
#.###.....
...#...#.#
..........
##.#......
....#....#
........#.
..........
#....#..#.

Tile 2383:
...##.....
....#..#..
......#...
#####....#
.........#
......#...
#......#.#
##.....#.#
#.#...##.#
##.#.#..#.

Tile 1823:
######..##
....#.....
..#...#...
##........
.##.......
...#......
#.......#.
##.#.#..##
#...###.##
#...#....#

Tile 2003:
##..##.###
#.##.#.#.#
.#.#......
...#...#..
..#.#.....
.#........
..#.....#.
#.#..#.#.#
##..##..#.
.##....#..

Tile 1367:
..#.###...
..#.##.###
##.####..#
#......###
##......#.
#.#...#..#
#..#.##...
.##....###
#...#..###
.####..#..

Tile 3733:
..#.###..#
.#....##..
.##..#..##
..###....#
.........#
.#........
.##.....#.
#....#...#
....#.#..#
.####....#

Tile 3607:
..##..####
.........#
.........#
..........
#..#......
#.#.##..##
.#..#...##
#....###.#
.#.#..#...
#...###...

Tile 1559:
####.#..#.
##.#......
.#..#.#.#.
#...#....#
##.##...#.
...#....#.
##.......#
...#...#.#
##..#...#.
#.#####.##

Tile 2617:
.#..#.....
.........#
...##..#.#
...#.#.#..
.#..#.....
#.#...#...
#......#..
#....#...#
.##.##.##.
...####..#

Tile 1249:
..##.###..
.........#
#.....#..#
.#..#.....
#..#.....#
#........#
......#...
......##..
#.#..#...#
#.##.....#

Tile 1019:
##.##.###.
##....##..
##........
...#.##...
#.......#.
#........#
....##....
..#.#..#..
#.........
.#..#.##.#

Tile 1451:
#.#.#..#.#
#.......##
#...#...##
#..#......
..##...##.
....#....#
.#.#......
....##....
....#....#
.##...##..

Tile 1433:
##..###..#
...#...##.
#.##.....#
###....#..
.....#..##
#...###..#
#.........
.....#...#
#...##....
###..#....

Tile 3803:
.#..##....
.###.....#
...#.....#
#........#
#.......##
#.##.....#
#.......#.
#.........
......###.
#..#.###..

Tile 3181:
###.#...#.
#.#......#
...#.#.#..
.....#...#
..........
........#.
###.......
#.###....#
###....#..
.###.#.##.

Tile 1831:
#..#..#.##
##...#.#.#
##......##
#..#....#.
##..#...#.
..#.......
#.##.....#
##.#....#.
#.#....#.#
##.###.##.

Tile 2843:
.###...#.#
......##.#
#.#......#
##.#...#.#
.##.#.....
.#......#.
#.#.#....#
##........
..........
###.##..#.

Tile 3691:
..#####...
.........#
#....#...#
.#...#..##
..........
##....#.#.
#........#
#.#.#.....
#.#...#...
..#..##.##

Tile 1327:
.#...#...#
#.....#.##
#..#.#..#.
##.......#
..#......#
#.#.......
..#..#..##
.#....##..
#.#......#
.##..#..#.

Tile 1669:
##.#.....#
.........#
......#.#.
..##....##
#.#.......
.###......
#..#......
.#.#...#.#
#..#......
#..#..#.#.

Tile 2819:
...#..##..
#........#
#.......#.
#.........
.......#..
#...#.....
.........#
#.#.#..#..
#...#..#..
#####..#.#

Tile 1873:
....#.####
#.#.#..###
..........
.....#....
#.#.....#.
#..##.#...
..#...###.
.#........
#.#..#...#
##.#.#....

Tile 2441:
.####.#.#.
...#...##.
....#.....
#...#.....
#.........
#.....#.##
#.#....#..
#...#....#
.........#
#####....#

Tile 1867:
#..##..##.
#..#......
#..#.#..##
....#...##
.#.##....#
....#.....
#......#..
##......#.
#...#....#
###.#..#.#

Tile 1993:
.#..######
#.###...#.
...###....
......##..
#...#...#.
...###.#.#
..##...#..
#.###.###.
...#.....#
...#.#.##.

Tile 2087:
####...#.#
#..###..#.
..##..#..#
#....#...#
.#..#..#..
.......#..
#.#..#....
.##.##.#.#
..##..#...
##..#.##.#

Tile 1973:
#.###.#.##
.......#.#
.##...#...
....#.####
#.#......#
#..#..#.#.
#......##.
...#...##.
#..#.##..#
#.....#.##

Tile 2579:
#....###..
...#...#.#
#.......#.
....#....#
#.........
......#.##
.....##...
...#.###..
.#.#...#.#
#.####.#..

Tile 1583:
#.#...###.
#.....#..#
##....#..#
........##
...#....##
....#.#...
.##....#.#
.......#.#
..#.......
.#....##.#

Tile 2971:
...#.###..
#....##..#
##...##..#
##..##.##.
..##....##
#.........
##....#..#
#.........
..#.....#.
.#.....###

Tile 3719:
#..##..#..
..........
#...#....#
......#..#
#.#..#....
#..#...#..
##.....###
#.#....#..
#.##.#..##
..##...#..

Tile 1151:
.#...##...
#....#...#
.........#
#...#....#
.........#
..........
##.......#
..##......
.......#..
##.##.####

Tile 3373:
...###....
##...##..#
##...#....
#....#...#
#.......#.
.........#
#...#....#
#.....#..#
#........#
#..##...##

Tile 3571:
.#.#.#.###
#...#.#..#
#..#.....#
#..#.#.##.
..#.......
####....##
....##.#..
#....#...#
.#......#.
.#..#.#...

Tile 2137:
.#...###..
#..#......
.###......
#...#.....
#...##..##
#...#..#..
##.#......
.....#...#
.......#..
.#...#.#..

Tile 2377:
.....##...
..#......#
...#......
#...#.....
..#...#..#
.#.#....#.
..##..#.##
.........#
.......#..
#.#.##...#

Tile 3407:
#..#..####
.#......##
###....##.
...##.#...
###...#..#
##...##..#
...#.....#
..........
...#.#.#..
......#...

Tile 1733:
###.####.#
...#..#.##
#....#....
##..#.#...
#.........
#.#...#..#
.#..##..##
.#.....###
#........#
#...#.#.##

Tile 3989:
.##.######
........#.
.#....####
#....#....
..........
..........
.......#.#
#.##.#..##
##.#..##..
..##..####

Tile 1051:
.####.####
..........
#.##....##
....#....#
..........
#........#
.....#.#.#
##.....#.#
......###.
.#...####.

Tile 3643:
.#.....#.#
.###...#.#
..........
.#.##....#
##..#..#.#
##...#....
.......#.#
.........#
..#.#....#
#.#...##..

Tile 3677:
...#.##...
#..###.#.#
.#.#..#..#
.##..#....
#.........
.........#
#..#.....#
#..#..#..#
#..#....##
..#..#....

Tile 2063:
#.###.####
#....###.#
......#..#
.........#
.###.....#
.#..#.####
...#.##..#
..........
#.#...#..#
..#..##..#

Tile 3821:
...#...#..
#..#.#...#
....#....#
..#.##...#
#.#.#.....
#......#.#
.......##.
......#..#
..#..#....
#.###...##

Tile 2477:
#..######.
....##....
.#.#....##
..........
..#...#..#
#.........
#...#...##
##......#.
#........#
#####.....

Tile 2647:
##.#...###
##...##...
#..#......
..#......#
#.#......#
#.........
##.#.....#
..#...####
#........#
..####...#

Tile 2749:
...#...###
##.......#
.....#..#.
#...#....#
#.#.....##
#...#.....
......#.##
.#.###.#..
#.#.#..#.#
..#.#..##.

Tile 2531:
#...##.#..
.#..#..#..
####.....#
#.#....#..
...#.#...#
#.......##
####......
###......#
.#.#.#...#
..##.##...

Tile 3833:
.#.#.##..#
..##...#..
..##.....#
###.....#.
.#...#....
.##......#
...#......
......#..#
.##.......
.##...#...

Tile 2777:
....#.#.##
.#..##...#
#........#
#.........
..#....#.#
..#.......
#...#....#
.#..#.....
#.#.#.....
..##..#...

Tile 2417:
####..#.#.
#..#.....#
#...#...##
......#...
.#....#..#
#...#....#
.......#..
.#..#....#
#........#
##..#.##.#

Tile 1531:
###...#.##
....#.#..#
..........
..#.#.....
.#.....#..
...#...#..
#...#.....
##..#.#..#
#.........
.#.#.###..

Tile 2969:
#.##.###.#
..###.#.##
..#....#.#
##......##
........#.
#........#
##......#.
..#..##...
...#......
.#....##..

Tile 1567:
##...##...
#....#...#
##.......#
#....#...#
........##
#.#..#....
..#.....#.
#...#.....
.........#
#..###.#..

Tile 3779:
..######.#
###..#....
....#.....
#........#
....#.....
#.#.#....#
.....#...#
...#.#....
##..#.#...
###.###.##

Tile 3467:
##..####.#
#.....#...
.....#...#
...#...#..
....#.....
##..#.#...
#.##.....#
.#........
##........
##..#.#...

Tile 2381:
#..#.#####
..###...#.
#..##.##..
###...###.
#.#.....##
.....#....
.......#.#
#.......##
#....#.#.#
##..#.#.#.

Tile 3433:
#####..#.#
......#.##
.#..#.....
#......#..
##.......#
....#.#..#
.......#..
....#....#
....#....#
.#.###.###

Tile 3559:
##..##.#..
#.........
..#......#
..##.....#
#..#..#..#
######...#
#.....#..#
.....#....
#.........
##..#..#.#

Tile 1321:
.#...#....
.#....#..#
#...#....#
#.........
#.........
#.##.##.#.
.#..#..###
..##.###..
#...#...##
.#..#.#...

Tile 1597:
##.##.##..
..........
#........#
#...###..#
#..#......
#...##...#
###.......
#.........
####.#.#.#
.#.#.#...#

Tile 2833:
.......###
.#.#.....#
#.........
#....#...#
###.......
..#....###
#.....#...
#..###....
.#..#....#
.###...#..

Tile 3911:
.###.##..#
......#.##
#........#
......#...
.#........
..........
...#......
..#.#....#
.#....#.##
..#.#..#..

Tile 1663:
####...#.#
#...#.#..#
.#.....###
.....##.#.
#......#..
..#.....##
.........#
##.#.....#
#......##.
.#..#.....

Tile 3469:
.#.##..#.#
.###....##
#.....#...
....##.#.#
....##....
....###..#
..#.###..#
#...#....#
#........#
##.##..#..

Tile 1427:
#.#.##.###
#....#.#.#
###......#
#..#......
#..##..#.#
..#..#..##
#....#.#..
.#....##.#
#..##.#...
#...#.#...

Tile 2311:
..###..#.#
..........
...##.#...
#.........
#.........
#.....##..
.#..#....#
.....#...#
#....##...
#####.##.#

Tile 1997:
.####....#
##.....#.#
#.......##
...#....#.
.###..#.##
#....##..#
#.......##
..##......
#..#..#..#
##.###.#.#

Tile 1987:
####...##.
##....#..#
.#...#....
#.....#..#
..........
#.........
#.#.......
..........
..........
#.#.#.#..#

Tile 3527:
#....##.#.
..###.#.##
....#....#
##......#.
....#....#
#..##.....
#....#...#
..##.#..#.
#........#
..#.#####.

Tile 3023:
#...#...#.
.###......
......#..#
#..#......
#...#.#..#
....#.....
#.......#.
....#.....
.......#.#
..#.##..#.

Tile 2539:
#.....#.#.
....#....#
#...##....
##....#.##
.#.#.....#
..#....#.#
#..#....#.
..#.#....#
#.#.......
###..####.

Tile 1033:
..#....##.
.........#
#........#
.......###
.....#.###
...#...#.#
...#....#.
##.......#
........#.
#...#..#..

Tile 1301:
.#.#....#.
#...#..#..
....#.....
..#......#
...#.#....
#......#..
#..#.#....
..#.......
...##.....
..#...##.#

Tile 3169:
###..##...
#....#...#
.....##...
.##.#..#..
#....##...
......#.##
..##.....#
#..#.....#
....####..
.#.##..##.

Tile 1021:
#.##..#..#
...#.....#
##........
.........#
#..#......
....#.....
......#..#
#........#
#......#..
.#.#.####.

Tile 1303:
.#.#.#.#.#
..####....
#...#..#..
#...#..###
..........
...##.#..#
.##....#.#
#.....#...
##.......#
..##.####.

Tile 3631:
.#.##..##.
#....#.#.#
##.......#
#......#.#
#..#....##
....#.....
........#.
..#....#.#
#.#......#
##.#..###.

Tile 2957:
.....###.#
#..#......
#..#...#.#
...#.....#
.........#
..#....#.#
#......#.#
....#....#
#.##.#...#
####..#.##

Tile 3229:
##.#####.#
.....#...#
......#..#
......#...
#.....#...
#..####...
.....#..#.
#...##....
#...##....
..###...##

Tile 3089:
#####.#.##
#.........
##...#..#.
....#..#..
##.##.....
.#..#...##
#.#....#..
#.....#..#
.....##...
#...######

Tile 2791:
.##.##.#.#
#.......#.
..##.##...
###.......
.......#.#
###..#.#..
#.#.#.#.#.
#...#.#...
#........#
##..###..#

Tile 2273:
...#..##.#
...##....#
.#........
......#.##
#####....#
##...#.##.
........#.
.......##.
#..#....##
#.##..#.#.

Tile 3919:
##.##.##.#
...##...##
#......#..
#.....#.#.
..#.#...#.
..#....#.#
##.#...###
....#.....
#.#.#..#..
..#.##...#

Tile 3637:
##.##.....
#...###...
.........#
#.........
#...#..#..
#...#.#...
...#.....#
....##..##
..#..#...#
#..#####..

Tile 2161:
#..###...#
..........
...#......
.#.......#
#...#.....
#..##.##.#
.####..#.#
....###...
##......#.
..##.#.###

Tile 3449:
.###.##.#.
.........#
...##....#
#.#..#....
.#.#.##..#
#....###.#
.#...##.##
..##.#...#
....#....#
.##.##.###

Tile 2287:
#..#.....#
...#.#...#
....#...#.
.#.......#
#....#.#.#
.........#
#......###
#..##.#...
#.#....#..
....#...##

Tile 2789:
#.#.#.##..
....#...##
###.#.#...
#..#.##..#
#.....#..#
......#...
..#..#..##
..#.###..#
#.....#...
.....###.#

Tile 2143:
#.#...#...
#.#.#...#.
...###.#.#
#..##...#.
#........#
........##
..........
##....##.#
..#.....#.
#.#####..#

Tile 2089:
.##....###
.#.#...#.#
.#...##..#
#....#....
##....#...
#....#...#
......#...
...#.#....
..##.#...#
.##.......

Tile 3457:
#...###..#
#...###...
#.......#.
##......#.
#.....##.#
..........
##..#.#...
....#....#
.#...#.#.#
..####....

Tile 2609:
........#.
......#..#
#.##......
#........#
..###....#
#.#..#..##
......#.#.
##........
#.....#.#.
#.#.###.##

Tile 1187:
.#######.#
#....#.#.#
#.#.###...
.##.###..#
#.#.#....#
#.......##
..#..#....
.##...#..#
.....##..#
.#...#....

Tile 2341:
###.##.#..
#...#..###
#...#....#
....###..#
..##.....#
.##.......
##...#..##
###.#.....
......#.#.
.#..###...

Tile 1171:
##....###.
........##
#........#
.......##.
.#.#....#.
.....##..#
#..#......
....#....#
##....#..#
##..#####.

Tile 1949:
.....###..
...#.#...#
#..##..##.
#...#.....
...#....#.
..#.#..###
#..##.....
#.##.....#
#.#.#.#.#.
..#.#..###

Tile 1871:
##.##.####
###.......
#..#..#...
#..#.....#
#....#....
..##....##
......#...
..#.......
#..#.#.###
#..#.##...

Tile 3907:
####......
#....#...#
....#.#...
#..#...###
....##.##.
..........
#........#
.....##.#.
#...#..##.
.##.#...#.

Tile 1723:
..#.#..#.#
#.........
.#..##...#
#.........
#..##..#.#
..####..#.
#........#
#.....#..#
#..#......
.#.#.##.#.

Tile 1237:
#.#.......
#..##.....
..........
.#..#..#..
####...###
..##.#...#
#.....#...
..#.......
.....#..##
....#..###

Tile 2897:
#.#...#..#
......#...
#...##...#
........#.
#........#
#....#.#..
.....#...#
#..#......
#......#.#
.##.......

Tile 2659:
##.##..#.#
##..#....#
###.....##
..#.....##
#.#...#...
##......##
#..###...#
#........#
.##.....#.
#.##.###.#

Tile 1931:
#...#.#.#.
#....#....
....#..#..
..........
#....#....
....#...#.
.....#...#
.......#.#
#..#..#..#
####...##.

Tile 1423:
#......#..
#...#....#
#........#
#........#
#..#......
..........
##..#..#.#
..........
......#..#
#.#.#.####

Tile 1163:
.####...##
.........#
#..##.....
#.........
#...#.....
....#..#.#
.#.......#
##........
#.....#.#.
...##.##..

Tile 1429:
.#.#.#.#..
##.#.##..#
....#....#
##....##.#
##.#.....#
#....#...#
...#..#..#
..........
#.....#..#
.#####..##

Tile 1523:
.##.#..##.
.....##...
##..##....
....##.###
##.#...#.#
..#......#
....#.....
##...#...#
##...#....
...###.##.

Tile 2029:
#.###...#.
.##.......
........#.
#.........
#..#....##
....#.##.#
#.#...#...
..#..#..##
#..##....#
..###..#.#

Tile 1213:
.##.##.#..
##....#..#
#.#..###..
.......#..
#...#.....
#....##..#
#........#
#....#....
..#..#...#
.##.##...#

Tile 1697:
.#.......#
..####....
....#.....
#....#....
........#.
#.....#...
#........#
...#......
..........
..#......#

Tile 3389:
###....#..
#..#......
##..##.#.#
#.##....##
#.....#..#
.........#
...##.....
##.....#..
#.........
.####.#...
`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 1951 * 3079 * 2971 * 1171;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 59187348943703;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 273;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 1565;
test(func, input, expected, testNum, lowestTest, highestTest);