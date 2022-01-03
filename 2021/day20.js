/*

--- Day 20: Trench Map ---

With the scanners fully deployed, you turn their attention to mapping the floor of the ocean trench.

When you get back the image from the scanners, it seems to just be random noise. Perhaps you can combine an image enhancement algorithm and the input image (your puzzle input) to clean it up a little.

For example:

..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..##
#..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###
.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#.
.#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#.....
.#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#..
...####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.....
..##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###

The first section is the image enhancement algorithm. It is normally given on a single line, but it has been wrapped to multiple lines in this example for legibility. The second section is the input image, a two-dimensional grid of light pixels (#) and dark pixels (.).

The image enhancement algorithm describes how to enhance an image by simultaneously converting all pixels in the input image into an output image. Each pixel of the output image is determined by looking at a 3x3 square of pixels centered on the corresponding input image pixel. So, to determine the value of the pixel at (5,10) in the output image, nine pixels from the input image need to be considered: (4,9), (4,10), (4,11), (5,9), (5,10), (5,11), (6,9), (6,10), and (6,11). These nine input pixels are combined into a single binary number that is used as an index in the image enhancement algorithm string.

For example, to determine the output pixel that corresponds to the very middle pixel of the input image, the nine pixels marked by [...] would need to be considered:

# . . # .
#[. . .].
#[# . .]#
.[. # .].
. . # # #

Starting from the top-left and reading across each row, these pixels are ..., then #.., then .#.; combining these forms ...#...#.. By turning dark pixels (.) into 0 and light pixels (#) into 1, the binary number 000100010 can be formed, which is 34 in decimal.

The image enhancement algorithm string is exactly 512 characters long, enough to match every possible 9-bit binary number. The first few characters of the string (numbered starting from zero) are as follows:

0         10        20        30  34    40        50        60        70
|         |         |         |   |     |         |         |         |
..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..##

In the middle of this first group of characters, the character at index 34 can be found: #. So, the output pixel in the center of the output image should be #, a light pixel.

This process can then be repeated to calculate every pixel of the output image.

Through advances in imaging technology, the images being operated on here are infinite in size. Every pixel of the infinite output image needs to be calculated exactly based on the relevant pixels of the input image. The small input image you have is only a small region of the actual infinite input image; the rest of the input image consists of dark pixels (.). For the purposes of the example, to save on space, only a portion of the infinite-sized input and output images will be shown.

The starting input image, therefore, looks something like this, with more dark pixels (.) extending forever in every direction not shown here:

...............
...............
...............
...............
...............
.....#..#......
.....#.........
.....##..#.....
.......#.......
.......###.....
...............
...............
...............
...............
...............

By applying the image enhancement algorithm to every pixel simultaneously, the following output image can be obtained:

...............
...............
...............
...............
.....##.##.....
....#..#.#.....
....##.#..#....
....####..#....
.....#..##.....
......##..#....
.......#.#.....
...............
...............
...............
...............

Through further advances in imaging technology, the above output image can also be used as an input image! This allows it to be enhanced a second time:

...............
...............
...............
..........#....
....#..#.#.....
...#.#...###...
...#...##.#....
...#.....#.#...
....#.#####....
.....#.#####...
......##.##....
.......###.....
...............
...............
...............

Truly incredible - now the small details are really starting to come through. After enhancing the original input image twice, 35 pixels are lit.

Start with the original input image and apply the image enhancement algorithm twice, being careful to account for the infinite size of the images. How many pixels are lit in the resulting image?


--- Part Two ---

You still can't quite make out the details in the image. Maybe you just didn't enhance it enough.

If you enhance the starting input image in the above example a total of 50 times, 3351 pixels are lit in the final output image.

Start again with the original input image and apply the image enhancement algorithm 50 times. How many pixels are lit in the resulting image?

*/

function enhanceImage (part, inputStr) {

  // PARSE DATA AND INITIALIZE inputImgMap

  const [ref, inputImg] = inputStr.split('\n\n');
  if (ref.length !== 2 ** 9) throw `YOU SCREWED UP - INVALID PARSE FOR REF: ${ref.length}`;               // OPTIONAL: SANITY CHECK
  if (ref[0] === '#' && ref[ref.length - 1] !== '.') {                                                    // OPTIONAL: SANITY CHECK / ENFORCE ASSUMPTION
    throw `THIS SOLUTION WON'T WORK - INFINITE LIT PIXELS AFTER ONE STEP`;
  }

  // SIMULATE IMAGE ENHANCEMENT - NOTE: THE TRICKY PART OF THIS PROBLEM IS IF ref[0] === '#' (AND ref[ref.length - 1] === '.') THEN INFINITE PIXELS ALTERNATE!

  function enhance(inputImgMap, alternate, k) {

    // handle for infinite pixels by using an overflow 2d array: buffer the new array with filler pixels, then chop off at the end for efficiency
    const bufferBefore = 3;   // buffer the next grid with this many pixels on each edge. MUST BE AT LEAST 3 (1 for growth, 1 to handle infinite, 1 for 9-px ref)
    const bufferAfter = 2;    // remove the extra layers from each edge. MUST BE AT MOST 2 (1 for the 9-px ref, 1 for the infinite pixels)

    // reconstruct input image map with buffer, and fill buffer with filler pixel
    const H = inputImgMap.length + (bufferBefore * 2);
    const W = inputImgMap[0].length + (bufferBefore * 2);
    const [filler, fillerOpposite] = !alternate ? ['.', '.'] : (k % 2 ? ['#', '.'] : ['.', '#']);         // if not alternating, filler/opp are always '.'
    const inputImgMapWithBuffer = [
      ...Array.from({length: bufferBefore}, () => Array(W).fill(filler)),
      ...Array.from({length: H - (bufferBefore * 2)}, (_, i) =>
        [...Array(bufferBefore).fill(filler),  ...inputImgMap[i], ...Array(bufferBefore).fill(filler)]
      ),
      ...Array.from({length: bufferBefore}, () => Array(W).fill(filler))
    ];

    // construct output image map, and fill with opposite filler pixel (if alternating)
    const outputImgMap = Array.from({length: H}, () => Array(W).fill(fillerOpposite));
    for (let row = 1; row < H - 1; ++row) {                                                               // note: outermost layer is for reference...
      for (let col = 1; col < W - 1; ++col) {                                                             // ...so skip it and only fill interior
        let str = '';
        for (let dr = -1; dr <= 1; ++dr) {
          for (let dc = -1; dc <= 1; ++dc) {
            if (!['.', '#'].includes(inputImgMapWithBuffer[row + dr][col + dc])) {                        // OPTIONAL: SANITY CHECK
              throw `YOU SCREWED UP - INVALID CHARACTER: ${inputImgMapWithBuffer[row + dr][col + dc]}`;
            }
            str += (inputImgMapWithBuffer[row + dr][col + dc] === '.' ? '0' : '1');
          }
        }
        const index = parseInt(str, 2);
        const outputPixel = ref[index];
        outputImgMap[row][col] = outputPixel;
      }
    }
    return outputImgMap
      .slice(bufferAfter, H - bufferAfter)
      .map(row => row.slice(bufferAfter, W - bufferAfter));
  }

  // SIMULATE IMAGE ENHANCEMENT

  let inputImgMap = inputImg.split('\n').map(row => row.split(''));

  for (let k = 0; k < (part === 1 ? 2 : 50); ++k) {                                                       // PART 1: 2 simulations; PART 2: 50 simulations
    const alternate = ref[0] === '#';
    inputImgMap = enhance(inputImgMap, alternate, k);
  }

  // COUNT LIT PIXELS

  let countLit = 0;
  let countDark = 0;                                                                                      // OPTIONAL: SANITY CHECK
  for (let row = 0; row < inputImgMap.length; ++row) {
    for (let col = 0; col < inputImgMap[0].length; ++col) {
      if (!['.', '#'].includes(inputImgMap[row][col])) {
        throw `YOU SCREWED UP - INVALID CHARACTER: ${inputImgMap[row][col]}`;                             // OPTIONAL: SANITY CHECK
      }
      if (inputImgMap[row][col] === '#') ++countLit;
      if (inputImgMap[row][col] === '.') ++countDark;                                                     // OPTIONAL: SANITY CHECK
    }
  }
  const gridSize = inputImgMap.length * inputImgMap[0].length;                                            // OPTIONAL: SANITY CHECK
  if (countLit + countDark !== gridSize) {
    throw `YOU SCREWED UP - COUNTS TOTAL TO ${countLit + countDark} INSTEAD OF ${gridSize}`;              // OPTIONAL: SANITY CHECK
  }
  return countLit;

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = enhanceImage;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`;

const actualInput = `##..##...#..#.#...#.....##....#.#..#.#.####...#####..#.######...#......#.##.#..######.########....#.#..##.####.##...##..#.########.#.##..........##.######.#......#..#...##..#..#.###.#.#..#..#...##.###.....#.#.###..##.####....##.#....#.#.###..###.....####..###..##.#.#..##....#.#....#####.##.....#.#.#..###..#.....####..##.#..#.###....#...##..###.#.###.##.####..#.##......##.##.#.##..##...##..######..####.#.##..###..###.###.##.##..###..#.......##.#######.#..##..##.###.#.#.#.####...####..#.#.#.......##.##.#.....

.#####..###.#.##.#..#.#.###..#......##.####.####.....##..#..#..#.#.##..##..##..#...##..#####....#.#.
..###..##..##.#.##.###..#.##..##.########..#...####.#..#.#.#...##.##.##.#....####...#......###.#.#..
###.###.###.#..#.#.#.##.#..#.######.##.#..##...#.#...##......#.###...###.#.#.#..##...######.###..#..
.######..##.#.##.####.....#..###.##..###....##..#.#.....#.##.....##.####.#...##..###...##...#.##.#.#
##...#.#.##.#.###...#.##.#..##.#.##.##.#####...#.##..#..###.#.##...##...#.###.###.#.#.##.##..#......
..##....#.##.#....#.####.#.#...####..##...#..#.##.##.#.###.#..##.#..##......#####.#.###..#.##..##..#
..##.....#..#.#####.....#..####...###.#..#.##.#....#.##.#...####.##.....##........#...###.#.#.##.#.#
##..##.........##.#..##..#.####.#.........#.##.#..####..####.....#....#.#..##.###...#..#.#...#.#..##
....###.###.#....##.#...#..####..##.###.###.#.####.##.##.#####..####.####.#...#.#.#.....#.##.##.###.
#...#.#.###...#...#.#..##..#.##.#.##.##...#.#.#..#.##..#.#.....####...##.#####....#.#..#...#...##.#.
#.#...###....##..##...###..#..#####.#.###...##......##..###.##.#.#...#...#.#...###..#.####..#.......
.###....##.##...###.###.#.#.#.##..#..#..###..#..#.#..#.#....##....#.#.#.#....#.#.#..#.#.#..##..#....
###..#..##.###.#.####..####........#.#.##..##..#...#...#...##.##.#.....#.#..#..#..#.#...##...###.###
..##.#......#...###...###########.###..#.#..###....###..##.###..#....#######.#..###.##..###......###
..###..#.#.#.#.....####.#.#..#..#.####..#..#.#.##.##########.##.#.#.#....########.##...#..#..#.#..##
###....###.#.#....###.##...#..##.#..##...####....####.####...##..##.....#####.#......###.##..#..#...
#.###.#.#..#...#..#..#...#...#......#..###.####...##.#.###.....###.###..#...#...####.##..#.###.#.#..
##.###.##..##..#..#...####......##.#.#.#.###.#....##..###.#.##.#....#####..##..........#.##.#..#.#.#
.#.#.#.#####..##...#####..#####..###.#######....#..#.####..#.#..##....##.#..#.....#..###.##.#...#.#.
.#...#..#.....##....#.#####.##...###..#####..#.#####.#.#..####...#..###...#.###..###....#..#.##.....
#..##.##...###.##.#.#....##.....#.#.####...##.#.#..###....##.#..#..#.####.#.#.##.##.#.####.##.###.#.
.#..#.###...#..###.....####..##.##.....##.....#......#######...#.###..#.##.##....##.##.####..#######
#..#.#####.#.#.#..#.#.##..##.###....#####.##.##..#####.#..###..#...#.##........####...##..###.#...##
#.##.#..#...########.....##.####.#...##.#.##...#..##.#.#..##.....###..##...#######....####..##.#....
####.....####.##.##.##.######...#.####.#.#.#.#..##.##.#..####.#.#..#.##...#.#...##########..#.##..##
.##.#######.###.####..#....##...###..#.#.#..##....#......#.#...#.#..###..###...##.#######.#.####..##
..#.#......#...#######.#..#...######.#.#.#.#...##.#....######.#..#####.##.......#.#####....#####...#
####.####.##..#..#..###..###....#...###..#..#..#.##.##..##.##..###.####.####.##..##...###..##..#.###
.##.#......###.####..###..#....#..##.#.#.#.##.#...#.##...##.....#.######..######.##.#...####..###...
##.####.#.#..##..#.########.....#.##..#..#....#.#.#..#..#.#...##..#.#...##...#####.#...####.#######.
##.#..#.###.....#.##....#.#.#...#####.#.#######..##.#..#####.####..#.#.##.#..#...##.##.######.##..##
##..#.##..###...###..###....###.#....#.##...#.#.###......####.###..#######.#.#........##...#.#.##..#
#..##.#..#..####....#.###...#.#...##.#..#.#.####.#..##.###.##.##..#.##..#.##.##.#..#.....##....#..#.
#######.#.#.###.#####.....#.#..###..####.#...#...###..####.#..#.#.#.#.#...##...#.####.#.#.....#.####
##.###...####..##.#..#.#.##.#....#.###.###.####..####..####....###.###.##..###.#.##..##.#..#######.#
...###...#....######....###..#..#..##..###...###..###.####.####....##.#..#.#.#.#..#####.##.#..##..#.
#.....########.####.#....#.#####.#.....###.#.##..##...####.#.#.#.##..##.##.#.##.#####..#..#.##.##.#.
#..#.#.#......#.#.####.#.###.#.#.##..##.##.#...#..#.##..#.##.#..##.#...####.#.####.##.#......##.#.#.
####.#..#.##.######....##.....#.######.....###...##.##.....##.#...##..........#.#.##.##..#.##..#####
...###..##..#.#..####.#...#..#..##.#..##.#..####...#..#..##.#...#.##...##...###..#.####.......#..##.
.#.###.....#.####..#..#.##....###.##..##.#####.#...###.##.##..##.####.#..###.#####.##....#.##..###..
.#..##....##..#.##.##..##.....#..##.#.#....#..##.#..#.###..#.......###.##.###....####...##.#####..##
.#.##.#.#....####..####.#......#.....#####.#.####...#.##.#...###.#.#..##.#.##.#.##..##.#######...#..
##..###.#..#.#..#...###.....#.#....##.##.#.##.##.#..######...#..#..#.......###.#.####...#.######...#
#...###..#......#..#...#....###.....##.##.##.##....#####.##....##.##.#....##..#...##..#.##..#.#.#..#
.....#.#.###.#.####..#....####.#####......##.##..####.#.#.#....#..#....######.#.###...###..###..#...
.#.#.#.#....#.#.....##..#...##.##.#..###.#.#.#.###......#.############.#............#..#..##.......#
#.##.#..####.##.##..##..#.####.#...##.##..#####.###..##..#.######.#.###....#.##..##..#....#..####...
#..###...###..#.##....#......##...###...##..#..#..#.#.#.#.##....#......##..##.#.#.####..##..#..#.##.
#.#.....##...#...#####...#.#####....#..###..#..#..####.##.#..##..#.###..#...#.#.#.##..##.#.....##.#.
..#.###..##.###..###.....#.###.#######.#.....#.#####.#...####.....#...#######..#.#.#.#..##.##.#.##..
####...#.#..#.##..#.##....#..####..#..####...##.#....###..#..#..#.#.###...#..#####...#.##.##.##..#..
.#.#..##.######..##.#.##...##...#.........#..#.###....#..#....####.##....#####..#....##.####..#.####
.#..##....#..##....#.###.######.#..#..#.###.####.#.#.#..####...###.##.##..#..#...#..#.###.##.###.###
......###.#..#..#..#.#.#.#...#.#..#...#....#.##..#.##.#.....##....####.#..##..##....#..#.#.##.#..##.
#..##.##..#######.#...##....#..###.#.##.###.##.###..#.###.#...#.#...##.#.###....###.#.##.#.#....#.##
#...####..######...####.#.##..###..#.#####.##...#.####.#.#....####.#..#.......###...##.#..#..##...##
##..#..##.#.###.#.#..#.#.###..#.......###..#.#.#.###........#...#.#..#.....##.####...#####.###....##
...#...#######.#..#########.#.#..#..###..#.#..#######.#.#....#.#.##.###.###.#######.####.....##.#.#.
..#...#####.#.##...##...#.#.##.#.###.#..###.#.#...##.#..#.#..###.#..#.#....#.###..###.#..##.....####
.#.###.#.#..#.####..#.###....##..#.#...##..#.###.#.#.##..#.#.#.....##.#...##.##..#.....#..##.#.###.#
#..#.###.##..#..###....#...#.#.###..#....####.##.##.#.#...#..#..####.##.##.##.###...####...####....#
.#.#...##.#.##.....#.#.##..#.#...#.#.#...##.....##.#...#####...##..##...#..##.##.##.#.##.##.....##.#
.######.###..#.#.######.###.#.#...#..#.#.#..#..##......####.##...#..#.#.#.###..####.##.######.######
.##.##...#......##.#....######.##.###.####...##...##.#.#.#.#.##...#######..#....##.#..#....###......
.#.##.###....#..#..#...###...#...#.#.....###.##.###.#........##.#.##.###..##.#####.##..##.##.#.#.#.#
..##..####.##.#..###.##.#..###.###.#####.####.#.##.####..#...#..#.###.#.#....#.##..##.#..##....##..#
.....#.#..##...#.#..##.#..#.#########..##.##.#...###..######...#.#.....#...###.##..##..#.#.......#.#
..#.#.#.#...###..####.###.##..#.##.###..#.#...##.....#.#..###.#..#.###..#.###..###.#.##...####.#....
#..#.###..#.#.##.#..##.###...##..............##.###.#.##...#.##..#...##........#.#.###.##....#.#.##.
##....####.##.#......###..#.....#.....#..####.....#..#.#.####...###...#...#.#...####..#..#..#..###..
.#....#..#####....#.#.#.#...#....##....##.#..###.#....#.#######.#.####.##...##..#....#......#.#.#.##
#.##....#####.#######...#.####.#..#..##..#.######..####..####..#..#...#.#.###.###....#..#....#.#####
###.#####...#.##.#.#####.#.#################.#..#..##.##...#.#...###..#.#.#.##.##..###.#..##.##..###
.#.##.##.###.#.##.#.###.##....#.....##..##...##.#########.##.##.#.###..##..#..#.#####..###.#...#..##
#.#....###..#.###..#...#..#.###.#.##..#..#.##...#...#..##..###..######....#.##.#..#.........##.#.##.
#.#.##.#.#####.#.#..#..###..#...###.###..##.##...##....#..##..##....#....#...##.#####..###..#..####.
#.#..##..##..##..##...####.#..#.####.##.#.##..#....###.#.####.####..#.###.###.#.#..#.#...#.#..#.....
#.#...####..#######.#.##..#.#......##.....######..#..##...##.#..#.#####.#..#..#....#.#..#####.#...##
.#.#.######.##....#..###.#...#.#....#.......#..#.#.#..#....##.#..###..##..#.#......####.#.#.##...##.
##..###..####...###.####...#.###....#.#######.##.####.#.....#.#.###.####.####...#.#.....#....##..###
..#.#.#.#.###...##.##..##..#.######..###..#...#......##.#.###....#.###...#.....#....####..###.##.#.#
.###..##..###.....##...#......####.##.#....###..#.##.#..#.##.##..#.....#.#.##..##.####..###.#...#..#
.#....####..##.#...###.#..#..###..##.#.#.....#...#.###..####..######.#.#...#...#.#...##.....###.....
.....#.#...#...#..#.###....##.##.#.#.#.#.##...##.#.#.....#.###.#.#.##.######.....#.###.###.#.##.###.
.####....#..###.#####.#.#..#.#.#..##.....##.#.#.#...#####..##.#.......###.###.#.##.#..##.#.###.#.#.#
##.#.#......#####..#.##.##..###..##..###.#..##..##.#.###.....#...####......#..###....#..##.#..#....#
#.#.#####...##.##.#...##.###..######.###.#.##.##..#..#...##..##.###...#.#..##.#########.#####.#.##.#
.#.##....#..#..#..#..##...#......#..#.#.##...##...#.###.##.......####...#.#..#.#...##.#..#.####..##.
.#.######.#.##...#####.###..#..##....##.#####.###..######.#...###.#.##..##....###..####.##.#.####.##
.#.#....#.##..##...#########...#..#.#.######.#.#.##.#....####.#...#.##..#..#.#.#..#.#.##..#.#...#.#.
.####...#...#..##.#.#.###.####...#.#...#####.....###.####.#.##..###..#.##.#...#.#####.####..##.##.#.
....#..#...#.###..##.##..#..####.#.#...#.#####..##...#####.#.#...###..#...#.#.###.#.#.##..###..###.#
#####.........##..###.#.###.#..........#.#.#..#.#..#.#.#######.#....##....#.###..#.#..##.#...##....#
.....###.##..#....#..#.#...#.##.#..#.#####.####.##.#.#.###........##..#.#..#.....###......##..##.#..
.###....#.#....#......##.##....##....#.#.##.######.#.##..##.###...#....#..#..#..###..##.#.#.##.#.#.#
##....#.##.#..#.###..##.##..#.#..###.##........##.#.#..#..####...####.#...#....#.#.##..#...#.####.#.
....###.##.#####.#....##.##.##.#..#.#..#.##.##.#.####.##..#.##.#...##..####..#..#.#.##.##...##.#....
..###........####.#....##.##..##..##.#....###..#.#.###......#.#####.###...##..##..#..#.#.###.#.#..#.
....#.###.##.....#..#.#.#.#####.###.#.##.#.##.......#.###.#.##..###........#.#.###.####.##.#....#.#.`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 35;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 5259;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 3351;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 15287;
test(func, input, expected, testNum, lowestTest, highestTest);