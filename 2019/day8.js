/*

--- Day 8: Space Image Format ---

The Elves' spirits are lifted when they realize you have an opportunity to reboot one of their Mars rovers, and so they are curious if you would spend a brief sojourn on Mars. You land your ship near the rover.

When you reach the rover, you discover that it's already in the process of rebooting! It's just waiting for someone to enter a BIOS password. The Elf responsible for the rover takes a picture of the password (your puzzle input) and sends it to you via the Digital Sending Network.

Unfortunately, images sent via the Digital Sending Network aren't encoded with any normal encoding; instead, they're encoded in a special Space Image Format. None of the Elves seem to remember why this is the case. They send you the instructions to decode it.

Images are sent as a series of digits that each represent the color of a single pixel. The digits fill each row of the image left-to-right, then move downward to the next row, filling rows top-to-bottom until every pixel of the image is filled.

Each image actually consists of a series of identically-sized layers that are filled in this way. So, the first digit corresponds to the top-left pixel of the first layer, the second digit corresponds to the pixel to the right of that on the same layer, and so on until the last digit, which corresponds to the bottom-right pixel of the last layer.

For example, given an image 3 pixels wide and 2 pixels tall, the image data 123456789012 corresponds to the following image layers:

Layer 1: 123
         456

Layer 2: 789
         012
         
The image you received is 25 pixels wide and 6 pixels tall.

To make sure the image wasn't corrupted during transmission, the Elves would like you to find the layer that contains the fewest 0 digits. On that layer, what is the number of 1 digits multiplied by the number of 2 digits?


--- Part Two ---

Now you're ready to decode the image. The image is rendered by stacking the layers and aligning the pixels with the same positions in each layer. The digits indicate the color of the corresponding pixel: 0 is black, 1 is white, and 2 is transparent.

The layers are rendered with the first layer in front and the last layer in back. So, if a given position has a transparent pixel in the first and second layers, a black pixel in the third layer, and a white pixel in the fourth layer, the final image would have a black pixel at that position.

For example, given an image 2 pixels wide and 2 pixels tall, the image data 0222112222120000 corresponds to the following image layers:

Layer 1: 02
         22

Layer 2: 11
         22

Layer 3: 22
         12

Layer 4: 00
         00

Then, the full image can be found by determining the top visible pixel in each position:

The top-left pixel is black because the top layer is 0.
The top-right pixel is white because the top layer is 2 (transparent), but the second layer is 1.
The bottom-left pixel is white because the top two layers are 2, but the third layer is 1.
The bottom-right pixel is black because the only visible pixel in that position is 0 (from layer 4).

So, the final image looks like this:

01
10

What message is produced after decoding your image?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function layerImageData (part, inputStr, extraParam, DEBUG = false) {
  
  const [ W, H ] = extraParam;
  const SIZE = W * H;

  // ANALYZE
  if (part === 1) {

    const LAYER_DATA = [];

    for (let i = 0; i < inputStr.length; i += SIZE) {

      const layer = inputStr.slice(i, i + SIZE);
      let num0 = 0;
      let num1 = 0;
      let num2 = 0;
      for (let c of layer) {
        if (c === '0') ++num0;
        if (c === '1') ++num1;
        if (c === '2') ++num2;
      }
      LAYER_DATA.push({ num0, num1, num2 });

    }

    let num0 = SIZE;
    let layerWithFewest0 = null;
    for (const layer of LAYER_DATA) {
      if (layer.num0 < num0) {
        num0 = layer.num0;
        layerWithFewest0 = layer;
      }
    }

    return layerWithFewest0.num1 * layerWithFewest0.num2;

  } else {

    const FINAL_IMAGE = Array.from({length: H}, () => Array(W).fill(null));

    for (let i = 0; i < inputStr.length; i += SIZE) {

      const layer = inputStr.slice(i, i + SIZE);

      for (let j = 0; j < layer.length; j += W) {

        const row = Math.floor(j / W);
        const rowData = layer.slice(j, j + W);

        for (let col = 0; col < W; ++col) {

          if (FINAL_IMAGE[row][col] === null && rowData[col] !== '2') {
            FINAL_IMAGE[row][col] = rowData[col];
          }

        }

      }

    }

    console.log(FINAL_IMAGE.map(row => row.map(c => c === '0' ? '   ' : ' . ').join('')).join('\n'));
    return FINAL_IMAGE.map(row => row.join('')).join('\n');

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = layerImageData;
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
`123456789012`
);

const sampleInput2 = parseSampleInput(
`0222112222120000`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: [ 3, 2 ],
  DEBUG: true,
};
expected = 1;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: [ 25, 6 ],
};
expected = 1560;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput2,
  extraParam: [ 2, 2 ],
  DEBUG: true,
};
expected =
`01
10`
;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: [ 25, 6 ],
};
expected =
`1001001100011001001010010
1001010010100101001010010
1001010000100001001011110
1001010110100001001010010
1001010010100101001010010
0110001110011000110010010`
;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);