/*

--- Day 4: Security Through Obscurity ---

Finally, you come across an information kiosk with a list of rooms. Of course, the list is encrypted and full of decoy data, but the instructions to decode the list are barely hidden nearby. Better remove the decoy data first.

Each room consists of an encrypted name (lowercase letters separated by dashes) followed by a dash, a sector ID, and a checksum in square brackets.

A room is real (not a decoy) if the checksum is the five most common letters in the encrypted name, in order, with ties broken by alphabetization. For example:

aaaaa-bbb-z-y-x-123[abxyz] is a real room because the most common letters are a (5), b (3), and then a tie between x, y, and z, which are listed alphabetically.
a-b-c-d-e-f-g-h-987[abcde] is a real room because although the letters are all tied (1 of each), the first five are listed alphabetically.
not-a-real-room-404[oarel] is a real room.
totally-real-room-200[decoy] is not.

Of the real rooms from the list above, the sum of their sector IDs is 1514.

What is the sum of the sector IDs of the real rooms?


--- Part Two ---

With all the decoy data out of the way, it's time to decrypt this list and get moving.

The room names are encrypted by a state-of-the-art shift cipher, which is nearly unbreakable without the right software. However, the information kiosk designers at Easter Bunny HQ were not expecting to deal with a master cryptographer like yourself.

To decrypt a room name, rotate each letter forward through the alphabet a number of times equal to the room's sector ID. A becomes B, B becomes C, Z becomes A, and so on. Dashes become spaces.

For example, the real name for qzmt-zixmtkozy-ivhz-343 is very encrypted name.

What is the sector ID of the room where North Pole objects are stored?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function NAME_OF_FUNC_HERE (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // ANALYZE
  if (part === 1) {

    let sum = 0;

    for (const line of inputArr) {
      const split = line.split('-');
      const letters = split.slice(0, split.length - 1).join('');
      const sectorIdAndChecksumSplit = split.at(-1).split('[');
      const sectorId = +sectorIdAndChecksumSplit[0];
      const checksumWithClosingBracket = sectorIdAndChecksumSplit[1];
      const checksum = checksumWithClosingBracket.slice(0, checksumWithClosingBracket.length - 1);

      const freq = {};
      for (const c of letters) freq[c] = (freq[c] || 0) + 1;

      const expectedChecksum = Object.keys(freq)
                                .sort((a, b) => (freq[b] - freq[a]) || a.charCodeAt(0) - b.charCodeAt(0))
                                .slice(0, 5)
                                .join('');
      
      if (checksum === expectedChecksum) sum += sectorId;
    }

    return sum;

  } else {

    const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
    const target = 'northpole object storage';                        // the only way to figure this out is to examine all cleartext

    for (const line of inputArr) {
      const split = line.split('-');
      const letters = split.slice(0, split.length - 1).join('-');
      const sectorId = +split.at(-1).split('[')[0];

      let cleartext = '';
      for (const c of letters) {
        if (c === '-') cleartext += ' ';
        else {
          const startIdx = ALPHABET.indexOf(c);
          const endIdx = (startIdx + sectorId) % 26;
          cleartext += ALPHABET[endIdx];
        }
      }

      if (cleartext === target) return sectorId;
    }
    throw `ERROR: DID NOT FIND TARGET ROOM '${target}'`;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = NAME_OF_FUNC_HERE;
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
`aaaaa-bbb-z-y-x-123[abxyz]
a-b-c-d-e-f-g-h-987[abcde]
not-a-real-room-404[oarel]
totally-real-room-200[decoy]`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 1514;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 409147;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 991;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);