// --- Day 5: Binary Boarding ---

// You board your plane only to discover a new problem: you dropped your boarding pass! You aren't sure which seat is yours, and all of the flight attendants are busy with the flood of people that suddenly made it through passport control.

// You write a quick program to use your phone's camera to scan all of the nearby boarding passes (your puzzle input); perhaps you can find your seat through process of elimination.

// Instead of zones or groups, this airline uses binary space partitioning to seat people. A seat might be specified like FBFBBFFRLR, where F means "front", B means "back", L means "left", and R means "right".

// The first 7 characters will either be F or B; these specify exactly one of the 128 rows on the plane (numbered 0 through 127). Each letter tells you which half of a region the given seat is in. Start with the whole list of rows; the first letter indicates whether the seat is in the front (0 through 63) or the back (64 through 127). The next letter indicates which half of that region the seat is in, and so on until you're left with exactly one row.

// For example, consider just the first seven characters of FBFBBFFRLR:

// Start by considering the whole range, rows 0 through 127.
// F means to take the lower half, keeping rows 0 through 63.
// B means to take the upper half, keeping rows 32 through 63.
// F means to take the lower half, keeping rows 32 through 47.
// B means to take the upper half, keeping rows 40 through 47.
// B keeps rows 44 through 47.
// F keeps rows 44 through 45.
// The final F keeps the lower of the two, row 44.
// The last three characters will be either L or R; these specify exactly one of the 8 columns of seats on the plane (numbered 0 through 7). The same process as above proceeds again, this time with only three steps. L means to keep the lower half, while R means to keep the upper half.

// For example, consider just the last 3 characters of FBFBBFFRLR:

// Start by considering the whole range, columns 0 through 7.
// R means to take the upper half, keeping columns 4 through 7.
// L means to take the lower half, keeping columns 4 through 5.
// The final R keeps the upper of the two, column 5.
// So, decoding FBFBBFFRLR reveals that it is the seat at row 44, column 5.

// Every seat also has a unique seat ID: multiply the row by 8, then add the column. In this example, the seat has ID 44 * 8 + 5 = 357.

// Here are some other boarding passes:

// BFFFBBFRRR: row 70, column 7, seat ID 567.
// FFFBBBFRRR: row 14, column 7, seat ID 119.
// BBFFBBFRLL: row 102, column 4, seat ID 820.
// As a sanity check, look through your list of boarding passes. What is the highest seat ID on a boarding pass?

// --- Part Two ---

// Ding! The "fasten seat belt" signs have turned on. Time to find your seat.

// It's a completely full flight, so your seat should be the only missing boarding pass in your list. However, there's a catch: some of the seats at the very front and back of the plane don't exist on this aircraft, so they'll be missing from your list as well.

// Your seat wasn't at the very front or back, though; the seats with IDs +1 and -1 from yours will be in your list.

// What is the ID of your seat?

function seatId (part, inputStr) {
  const inputArr = inputStr.split('\n');

  const seatIds = inputArr.map(pass => {
    let min = 0;
    let max = 127;
    for (let i = 0; i < 7; ++i) {
      const mid = Math.floor((min + max) / 2);
      if (pass[i] === 'F') max = mid;               // if the letter is F, adjust max to first half
      else min = mid + 1;                           // if the letter is B, adjust min to second half
    }
    const row = min;                                // min and max will be the same number. save it to row
    min = 0;
    max = 7;
    for (let i = 7; i < 10; ++i) {
      const mid = Math.floor((min + max) / 2);
      if (pass[i] === 'L') max = mid;               // if the letter is L, adjust max to first half
      else min = mid + 1;                           // if the letter is R, adjust min to second half
    }
    const col = min;                                // min and max will be the same number. save it to col
    return row * 8 + col;                           // calculate seatId
  });

  if (part === 1) {                                 // PART 1: RETURN THE HIGHEST seatId NUMBER

    return Math.max(...seatIds);

  } else {                                          // PART 2: FIND THE MISSING seatId SUCH THAT ADJACENT seatIds ARE NOT MISSING

    const seats = new Set(seatIds);
    for (let i = 0; i <= 127 * 8 + 7; ++i) {        // the lowest possible seatId is 0 (0 * 8 + 0), and the highest possible seatId is 127 * 8 + 7
      if (
        !seats.has(i) &&                            // if the seatId is missing...
        seats.has(i - 1) &&                         // ...and the preceding seatId is not...
        seats.has(i + 1)                            // ...and the subsequent seatId is not...
      ) return i;                                   // ...then we found our seat!
    }
    
    throw 'INVALID: NO SOLUTION';                   // we are given that there must be a solution

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = seatId;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `FBFBBFFRLR
BFFFBBFRRR
FFFBBBFRRR
BBFFBBFRLL`;

const actualInput = `BFFFBFFRLR
FBBBFFBRRL
FFBFBFFRRR
FBBFBFFRRR
BBBFFFFLLR
FFBFBBFRRR
BFFBBFFLRL
BBBFBBFLRR
BFFBFBFLRR
BBBFFBFLLL
BFBFBBBRRR
FBBBBBFLRR
BBFFBBFRRL
BFBBBBBRLR
FBBFFFFRLR
BBFFBFFRRL
FBBFFFBRRR
FFBBBBFRRL
BFBBBFFRRR
BBBFBFBRRR
FBFFBFBRLR
BFFBBFBLLL
BBFFFFFRRL
FBBBBFBRLR
FBBBBBFRLR
BFFBBBFLRR
FBFBFBFLLR
FFBFFFBRRR
BBBFFBBLRR
BBBFFBBLRL
BBFBFFBLRR
BBBFFFFRRL
FBFFFBFLRR
BBFBBBFRLL
BBBFFBFLRR
FBFFFFBLRR
FBBBBBFLRL
BBFFFBBRRL
BBFFBFBLRL
BBBFBBFRLR
FFBBFFFRRL
BBFBBBFLRL
BFBBFFBRRR
BFBFFBFLRR
BFBBBFFRLR
FFFBBBBLRL
BBFBFFBRRL
FBFBBFBLRL
FBBBBBBRLL
FBBFBBFLLR
FBBBFFFLLR
BFFFFFBRLR
BBFFFBBLRL
FBBBFFBLRL
FFFBBBBRRR
FBBBFBFLRR
BFFBFFBLLL
BFBBBBBLLR
BBFFFFBLRR
FFBFFFBRRL
BFFFBFFRRL
FFBBFBFLLL
FBFFFFFLRR
FBFFBFFLRR
FBBBFFFRRR
FBFFBFBLRR
FFBBBFFRLR
BBFFFFFRLR
BFFFBFBRRR
FBFBBBFRLL
FFBBFFBRRL
FFBBBBBRLL
FBBFFBBRRR
FBBBFFBLLR
FBBFBFFLRR
FBFFFBFRLR
BBFFBFFLLL
BFBFFFBLRL
BFFBBFFLLL
FBFBBBFRRR
BFFBFFFLLL
BBFBBFFRLR
BFFBBBBRLL
FBBFFBBRRL
FFBFFFFRLR
BFBFBFBLRR
FFBBBBBRRR
FFBBFBBLLR
FBBFFBFLRR
FBFBBBBLLL
BFBBBBFRRR
FFBFBBFLLR
BFBFBBFRLL
BFBFFFBRRL
FFBBFBFRRR
FBFFBBBRLR
BBBFFBFRRR
FFBFFFFRRL
BFBFFBBLRR
FBBBBFBLLL
FFFBFFFRRR
BBFBBFBRRL
FFFBFFBRRR
FBBBFBFLLR
FFBBFFFLLR
BFFBBFFRRR
FFBBFBBLRR
FFBBBBBLLR
BBFBFBFRRL
BBFBBFBLLL
BBFBFBFRLR
BBFBFFBRRR
FFBBFBBLRL
FBFFFFFRLR
FBFBFBBLRR
BFFFFBFRLL
BBBFFBBRRR
FFBFBFFRRL
BFFFBBFLLL
FBBBBBBLRL
BFBBFBFRRR
BFFFFFBLLR
BFBBBFFLRL
BBBFFFBRRL
BBFBFFFLRR
FBFFFFFRRR
BBFFFBBLRR
FBFBBFBRLR
FBFBBBBRLL
FBFFFFFRRL
FBFBBFFRLR
BFBBFBBRLL
BFFBBFFRRL
FBFFFBBRLR
FFBBBBFLRL
BFBBBBBRRL
BBFBBBFRRL
FFBBBFFLRR
FBBBBFBRLL
BFFFBFFLRL
BFBFBFBLLL
BBFFBFFRLR
FBBBBFBRRR
BFBBFFBLRR
FBFFBBBLRR
FBFFFFFLLL
BFFBFBFRRL
FBBFFBFRRL
BBFBFBBRRL
BBFBBFBRRR
BFBFBBFLRL
BBFBFFBLLR
BBFFBFBLRR
FBBFFFBLRL
BFBFFFFRRL
BFBBFBFRRL
BFBBFFBLLL
BFFFFBFLLL
BBFBFFFLLR
BFFFBFBLLL
BBFBFBFRRR
BFFBBBFLLL
FBFFFFBRLR
BFFBBFBLRR
BBFBBBFRLR
BBFBFBBRLR
BFBBBBBRLL
BFFFFFFLRR
FFBBBBFLLR
BBBFFBFLLR
BFBFBBFRRL
BBFBBBFRRR
FFBBBBFLRR
FBFBBFBLLL
FFBBBFFRLL
FBFBFFFRLR
BFBBBFBLLL
BFBFBFBRRL
BBBFBBBLRR
BBFBBFFLLR
BFBFFFBLLL
BFFBFFFLLR
FBFBFFBLLR
BBFFFBBLLL
BBFFBFBLLR
FFBFBBFLLL
BFFFFBFRLR
FBFFBFFLRL
BFBFFBFRLL
BBFFBBBRLR
FBFBFFFRRL
FBFBBFFRRR
FBFBFBBLLL
BFBFBBBRRL
BFBFFBFRRL
BBBFBFFLLL
FFBFBBBRLR
FBFBBBFLRR
FBBFBBBRRR
BFBBBBFRRL
FFFBFBBLLL
FFFBBBFLLR
FFFBBBFRRR
FFBBFFFLRR
FFBFBFBLRL
FBBFBBFLLL
FFFBBFBRLL
FBFFBFBRLL
FFBBFBBRLR
BBFBFFFLLL
BFBFFBFLRL
FFFBFBFLLL
BBBFBFBRLL
FFBFBBBRRL
FBBBBFBLLR
BBBFBFBRRL
BFBBBFBLLR
FFFBBFFLRR
BFBBFFBRLL
FFBFBBFRRL
BBFFFFFRRR
BBBFFBBRLR
BFFFBBBRRR
BBBFFFFRLL
BBFBBBBLRL
FFBFBFFLRL
FFBFBFBRRL
BFFBFFBRRR
FBFFFBBRLL
FBBFBBBRLR
BFFFFFBLRL
FFBBFFBLRL
BBBFFBBRRL
FFBFBFFLLL
FBFFFBFRLL
BFBFFBFRRR
BFBFBBFLRR
FFBBFFBRRR
BFBFBBFRLR
FFFBBBBRLL
BBFBBBFLLR
FBFFBBBLLL
FFBFBFFLLR
BBFFFBBRLL
BFBFBFFRRR
BFBFBFBRLL
BFFFFBBLRL
FFBFFBFLRL
BFBBFFBRLR
FBBBBBFLLR
FBFBFFFLLL
BBFBFFFLRL
BBBFBFFLLR
FFFBFBFLLR
BFFBFBBRLL
FBBFBBBLLL
BFFFBFBRRL
FFFBBFBLRR
FBFFBFFRLL
BBFFBBBRRL
BFBBFBBLRR
FBFFBFBRRR
FBFFBBFRRL
BBFFFBFRLL
FFBBBFBLRR
BFFFBBFRRR
BBBFFBFLRL
FFBFFBFLLR
FBFFBFFLLL
FFFBBBFLLL
BFBFBBBLRL
BFBBFBFLRR
BFBFFFBRLL
FBFBFFBRRR
BFFFBBFRLL
FBBFFBFRRR
BBBFFBBLLL
FBFFFFBRLL
FFBBBFBLLR
BBFFBFFRRR
FFFBBBBLRR
BBFFFFBRRL
BBFBFBBLRL
FBBBFBFLRL
FBFFBBFRLL
FFBFBBBLLL
BFBFBFFRLL
FBBBFBBRLL
FBFBBFBRRL
BBFFBFFLRR
BBFFFFBRLR
FFFBBBBRLR
BFFFBBFLRL
BFBFBFFLRR
FBBBBFFRRR
FBFBBBBLLR
FBBFFBBRLR
BFBFBBBLLR
BBBFFBBLLR
BFBFFFFLRR
BFFFBBBRLR
BBFFFFBLLR
FBFBBFFLRL
BFFBFFBLLR
BFFFBFBLRR
BFBBBBFLRL
BBBFFBFRLL
BFBBFBFLLL
BBBFFFBLRL
FFBFBBFRLR
FBBBFBBRRL
FBFFBBFLRL
FBBBBFFLRR
FFFBBBFLRR
FBBFBFFLLL
BBFFFFFLLR
BBBFFFBLLL
BFFBBBBRRR
BFFBBBBLLL
FBFBBBBRRL
FFFBBFBLLR
BBFBFBBLLR
BBFBFFBRLR
FFFBFBBRLR
FBFFFBFLLL
FBFBBBBRRR
FBBFBBFRRL
FBBBFBFRRL
BBFBBFFLLL
BFBBFFFLLR
FBBFFFFLLR
BFBBBFFLRR
BBFBBFFRRR
BBFBFFBLLL
FFFBBFFLRL
FBBBBFBLRL
FBBBBBBLLR
BFBBFFFRRR
FBBFBFFLRL
BFBBBBBLLL
FFBBFFBLLL
BBBFFBBRLL
FFBBBBFRRR
FBBFFFBRLL
BBFBFBFRLL
BFBFFBBLLR
BFFFFFFRRR
BFFFFFFRRL
FBFBFBBRRL
FBBFBFBLRL
BBBFBBFLLL
FBFFBFFRRR
BFFFFBBLLR
FBFFBBBLLR
FBBBFFBLLL
FFBBBFBLLL
BFFFBFBLRL
FBBFBBFLRL
BBFFFBBRLR
BFBFFFFLLL
BBFFBBBRRR
FBFBFFBRLL
BFFBFBFLLL
FFBFFFBRLL
FFBFFFBRLR
BBBFFFFLLL
FFBFFBFRRL
BFFBBBFRLR
BBFFFFFLRR
FBBBFFBRLR
BFBFFBFRLR
BFFBFFFLRL
BFFBFFFRLR
FBBFFFFLLL
FBFFFBFLLR
FBFBFFBRLR
BFFFFBBRRR
BBBFBFFRRL
FFFBBFFLLL
FFBBFFFRRR
FBBFFBFLRL
BFFBFBBLLR
FFBBBFBRRR
FFFBFBFRRL
FFBBBBBLLL
BBFFBBBLLR
FFFBBBFRRL
BFFFBBFLRR
BFFBFFFRRR
BFBBBFFRLL
FBBFFBBLRL
FBBFBBFLRR
FBBFFBBLRR
FFBFFBBLRL
FBBFFBFRLL
BFFBBBFRRL
FBFBFFFLLR
FFBFBBBLLR
FFFBFBFRLL
BBBFBBBLRL
FBBFFFFLRR
FBBBFFFRLL
BBFBBBBRLL
FBFBFFFRLL
FBFFFFFLRL
BFBFFFFRRR
BBFFBBFLRL
FBBFFBFRLR
FFBBFFFRLL
BFBBFFFLRL
BBFBFFFRRR
BBFBFFFRLR
FBFBBBFRLR
BFBBFFBRRL
BBBFFBFRRL
BFFFFFFRLL
FFFBFFBRLR
BBFFFBFLRR
FBBFFBFLLL
FBFFBFBLLR
FBFBBFBLRR
FBFBFBFRRR
FFBFBFBRLL
BFBFFFBRLR
BFBBFFBLLR
FBBBFBFRLL
FBBFBFBLLR
FFFBBFFRRL
FBFBFFBLRR
FBBFBFBRLL
FBFFFFBLLR
FBBBFFFLRL
BBBFBBFRRL
FBBFFFFRLL
BFBBBBFLLL
BFFBBBFLLR
FBFBBBFLLL
FBBFFFFRRL
BFFFBFFRRR
BBBFFFBLLR
FFBBFBFRLR
FBBFBBBRLL
BBFFFFFLRL
FBBFFBFLLR
BFBFFBBRRR
BFBBFFFRRL
FFBBBBFRLL
BBFBFFBRLL
BFFFFFBLLL
FFBBBFBLRL
FFFBBFFRRR
BBFBFBFLRR
FFFBFFBLRL
BFFFBBBLRL
BFBBFBBLLR
FFBBBFFRRL
BBFFFBFLLR
BFFFFBBLRR
FFBFFBFRRR
FFBFBFFRLL
FBFBBBBLRR
FFFBBFBRRR
BFBFBFBRRR
FFFBFBFLRR
BFFBFFFRLL
BFFFFFBRRL
BFFBFBFLLR
BBFFBBFRLR
BFFFFFFLLR
BBFFFBBRRR
BBFBFBBRLL
FFFBBBFRLR
FBFBBBFRRL
FFFBFFBRRL
BFBFFFFLLR
BFBBFBBRRL
FFBFBFFRLR
FFFBBBBLLL
FFBFBFBRRR
FBBFBBBLRR
BFFBFFBLRL
BFFFBFFLLR
BFFFFBFLLR
BBFBFBBLRR
BFFBFFFRRL
BFFBBFBRLL
BBFFBFBRRL
BBBFFFFRRR
BFFBFFBRLL
FBFBBFFRLL
FBBFFFFLRL
BBBFBFFLRR
FFBBBBBLRL
FBBFFFBRLR
FFBBBBBRLR
FBBBFFBLRR
FBBBFBBLLR
FFBBBFFLLR
BFFFFFFLLL
FFFBFBBRRL
FFBBBBFRLR
FBFFFFBRRR
FFBFFBBLLL
FBBFFBBLLR
FFFBFBFRRR
BFFBBFBLRL
BFBFFFBLLR
BBFFFFBRRR
FBBFBFBLRR
FBBFFFBRRL
FFBBBFFRRR
FBFFFFBLRL
FBBFFFBLLL
FBFFFBBLRL
FBFBFBFLLL
BFFBFFFLRR
BFBFFBFLLL
FFBFFBBLRR
FBFBFFBRRL
FBFBBBBRLR
BBFFBFBRRR
BBBFBBFLRL
BFBBFBBLLL
FFBFBFBLLR
FBBBBFFLRL
FFBBFBBRRR
FBFFBBBRLL
FFBBFFFLLL
BFFFFFBRLL
BBFBBBBLLR
FBBBFFBRRR
BFFBBFBRLR
FBBBBFBRRL
BBFFBBFLRR
FFBFBFBLRR
FFFBFBBRRR
FFBFFFFRLL
FBBFFFFRRR
BFBFBFFLLR
BBFFBFFLLR
FFBFBBBRRR
BFBBBFFRRL
BBFFBFFRLL
FBFBBFFLLL
BFFBFBBLRL
FFBFFBFLRR
BBFBFFFRRL
BBFBFBFLLL
FBBBFFFLRR
FBBFFBBLLL
BBFFBBFRLL
FFBBFBBRRL
BBFBBFFLRL
BFBFFBFLLR
BBBFFFBRLL
FFBBFBFLRL
FBFBFBBLRL
FFBFFFFLLR
BBFBBBBRRR
FBBFFBBRLL
FFBBBFBRLL
FFBFFBBLLR
BBFBBBBLLL
BFBBBFFLLR
BBFBBFBRLR
FBBBBBFLLL
FBBBBFFRLR
BFBBFFFLRR
FFBFBFBLLL
BFFFFBFRRR
FBFBFBFRLL
FFBFBBFLRL
BFFFFBBLLL
BBFBFFFRLL
FBFFFBBRRR
FBFBBBBLRL
BBFFBBBLLL
BFFFBBBLLL
BFBBBFBLRL
BFFBFBBLRR
BBFFBFBRLR
BBFFFBBLLR
BFBFFFFRLR
BBFBFFBLRL
BFFFBFFLLL
BFBFFFBLRR
FFBBFFFLRL
FBFBFBBRLR
FBFFBBBRRL
BBBFBFBRLR
BFFFBFBRLR
BBFFBBBRLL
FBBBBBBRRR
FFFBFBBLRL
BFBBFFFLLL
FBBFBFBRLR
FFBFFBBRRR
BFFBBBBLLR
FBFBFBBLLR
BFBFBBBRLR
FBFBBBFLRL
BBFBBBFLRR
FBBBBFFRRL
FBBBFBBRLR
FFFBFFBLRR
BFFFFBFLRL
BBBFFBFRLR
FFBFBFBRLR
BBBFBFFLRL
BBFFFFFLLL
FBFFBBFLRR
FFBBFBFLRR
FFBBBBBRRL
BBFFBFBLLL
FFBFFFBLLR
BFFFFFFLRL
FFBBFFBRLL
FFBBFBFRLL
FBBBFFBRLL
BBFFFFBRLL
FFBFFBBRRL
BBFFBBBLRR
BBBFBFBLRR
FFBBBBBLRR
FBBFBBBRRL
BFBBFBFRLL
FBFFBFFRLR
FFFBBBBLLR
FFFBBFBRRL
FFBFBBFLRR
FFBFFFFLRR
BFBFBBFRRR
BFFFFFFRLR
FFBFFBBRLL
BFBFBBFLLL
BBFBFBFLLR
BFBFFFFRLL
BFBBFBFLLR
FFBBFBFRRL
FFBBBFFLLL
FBBBFBBLLL
BBBFBBFLLR
BFFBBFFRLR
FBBFBBBLLR
FFFBBBFLRL
BFFFFBBRLR
BFBBFBFRLR
FBBBFFFRLR
BBBFBFBLRL
BFBFBBBLLL
BBFFBBFLLR
BBFBBFBLRR
FFBFFBFLLL
FBBFBBFRRR
FBBFBBFRLR
BFBFBFFRRL
BFFFFBBRRL
FFBBFFBRLR
FFFBFBFLRL
FBFFFFFRLL
FBFFBBFLLL
FBFFFFBLLL
BBBFFFFRLR
FFFBBBFRLL
FBBFBFFRLL
FFFBBFFRLR
FBBFBFFLLR
BFFFBFBRLL
BFBFFBBLRL
FBBFBFBRRR
BFFFBFBLLR
FBFBFBBRLL
FBBFBFBLLL
FFFBBFBRLR
FBBBFBFLLL
BBBFBBFRRR
BFBFBBFLLR
FFBFFFFRRR
BFBBFBFLRL
BFFBBFBLLR
BBFBFBBLLL
BFBBFFBLRL
BFBFFBBLLL
FBBBBBBRLR
FBFFBFBLLL
BFFBBBFRLL
FBBBBBBRRL
FBBBFBBLRL
BBFFFFBLLL
FFFBBFFRLL
FBFFFBBLLR
BFFBBFFRLL
FFBFFBBRLR
BFFFBBFRLR
FFBBFFBLLR
FFBBBBFLLL
BBBFBFBLLL
FBFBBFBRLL
BBBFBBFRLL
BFFFBBFLLR
FBBBBBFRRR
FBFBFFBLLL
BBBFFFFLRL
FBBBBFFLLR
BFFFFBFRRL
BFFBBBFLRL
BFBFFFFLRL
FFFBBFBLRL
BBFBBBFLLL
FBFFBBBRRR
BBFFFBFRRR
BBFFFFFRLL
BBBFBBBLLL
FFBBFFBLRR
BBFBFBBRRR
BFFBFFBRLR
BFBBFFFRLR
FBFBFFBLRL
FBFFBFBLRL
BFFFBFFRLL
FFBFBBBLRL
FBFFBFFLLR
FFBFFBFRLR
FBBFFFBLLR
BBBFFFBRLR
BFBFBBBLRR
FBFBBFFLLR
FBFBFBFRRL
BFFBBBBLRR
BBFFBBBLRL
FFBFFFBLRR
BFFBBFBRRL
FBBBFBBRRR
FFBBBFBRLR
BBFFFFBLRL
FBFBFFFRRR
BFFBFBFRRR
BFBFBFFLLL
BFFBFBFRLL
FBFFFBBRRL
BFFFBFFLRR
FFBFBFFLRR
FBFFBBFRRR
BFFBBFFLRR
FFBBFFFRLR
BFBFBFFRLR
BFBBBFBRRR
BBFBFBFLRL
FFFBFFBLLL
FBBFBBBLRL
FBFBFBBRRR
BBFFBFBRLL
FFFBFFBLLR
FBBFBBFRLL
FFBBFBBRLL
FBFBFFFLRL
BBFBBFBLLR
FBBBBFFRLL
FFBBBFFLRL
FBFFBBBLRL
FBFBFFFLRR
BBFFBBFRRR
BBFFFBFLRL
FBFFFBFRRR
BFBFBFBRLR
FBFFBBFRLR
BFBBFFFRLL
FFBFFFFLLL
FFBBBFBRRL
BFFFBBBRLL
BFFFBBBRRL
FBFBFBFLRR
FBFBBBFLLR
BBBFBFFRLL
BFFBFBBRRL
BFFBBBFRRR
BFFBBBBLRL
FBBFBFFRRL
FFBBFBFLLR
FBBBFBFRRR
BBFFFBFRRL
BFBBBFFLLL
BBFFBFFLRL
FFFBFFBRLL
FBFFFBFRRL
FBFFFBBLRR
FBFBBFBLLR
FBFFBFFRRL
BFBBBFBRLR
BFFFBBFRRL
FBFFBFBRRL
FFBFBBBLRR
BFBFBBBRLL
FBBBFBBLRR
FBFFFBBLLL
BFBFBFBLLR
FBBBBFFLLL
FFBFFBFRLL
BBFFBBFLLL
FFFBBBBRRL
BFBFFBBRRL
BFFBFBBRRR
BFFBFBFLRL
BBFBBBBLRR
FBFBFBFLRL
BFFFBBBLRR
BFFBFBBRLR
BBFFFBFRLR
BBBFFFBRRR
BFBFFBBRLR
FBFBFBFRLR
FFBFBBBRLL
FBFFBBFLLR
BFBFFFBRRR
BFFBFBBLLL
BFBBBBFRLL
BBFBBFBRLL
BFBBFBBRRR
BFFBBFBRRR
BFBBBBBRRR
FFFBFBFRLR
BFFBBFFLLR
BBFBBBBRLR
FFFBFBBRLL
BFFBFFBRRL
BBBFFFFLRR
FBBBFFFRRL
BBFBBBBRRL
BFFFFBFLRR
BBFBBFFRLL
FBBFBFFRLR
FBFBBFFRRL
BFFFFFBRRR
BFFBBBBRLR
BFBFFBBRLL
FBFBBFBRRR
FFBFBBFRLL
FBFFFFBRRL
BFBFBFFLRL
BBFBBFFLRR
BFBBBFBRLL
FBFBBFFLRR
BFFFFBBRLL
BBBFBBBLLR
FBBFBFBRRL
BBFFFBFLLL
BFBBBFBRRL
BFFBFBFRLR
FFFBFBBLLR
FBBBFBFRLR
FBFFFFFLLR
BBBFFFBLRR
BBFBBFBLRL
BFBBBBBLRR
BFFBBBBRRL
FBBFFFBLRR
FBBBBBBLLL
BFBBBFBLRR
BFBBBBFLRR
BFBBBBBLRL
BFBBBBFLLR
FFFBBFBLLL
BBFBBFFRRL
FBBBBFBLRR
BBBFBFFRRR
BFBFBFBLRL
FBBBBBBLRR
BFFBFFBLRR
FFBBFBBLLL
BBBFBFBLLR
FBBBFFFLLL
BBBFBFFRLR
BFBBFBBRLR
FFBFFFBLRL
FFBFFFBLLL
FBBBBBFRRL
FFFBBFFLLR
FBFFFBFLRL
BFBBBBFRLR
BFBBFBBLRL
BFFFFFBLRR
FBBBBBFRLL
FFBFFFFLRL
FFFBFBBLRR`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = Math.max(357, 567, 119, 820);
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 955;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 569;
test(func, input, expected, testNum, lowestTest, highestTest);