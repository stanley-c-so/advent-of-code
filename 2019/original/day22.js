// --- Day 22: Slam Shuffle ---

// PART 1:

// There isn't much to do while you wait for the droids to repair your ship. At least you're drifting in the right direction. You decide to practice a new card shuffle you've been working on.

// Digging through the ship's storage, you find a deck of space cards! Just like any deck of space cards, there are 10007 cards in the deck numbered 0 through 10006. The deck must be new - they're still in factory order, with 0 on the top, then 1, then 2, and so on, all the way through to 10006 on the bottom.

// You've been practicing three different techniques that you use while shuffling. Suppose you have a deck of only 10 cards (numbered 0 through 9):

// To deal into new stack, create a new stack of cards by dealing the top card of the deck onto the top of the new stack repeatedly until you run out of cards:

// Top          Bottom
// 0 1 2 3 4 5 6 7 8 9   Your deck
//                       New stack

//   1 2 3 4 5 6 7 8 9   Your deck
//                   0   New stack

//     2 3 4 5 6 7 8 9   Your deck
//                 1 0   New stack

//       3 4 5 6 7 8 9   Your deck
//               2 1 0   New stack

// Several steps later...

//                   9   Your deck
//   8 7 6 5 4 3 2 1 0   New stack

//                       Your deck
// 9 8 7 6 5 4 3 2 1 0   New stack

// Finally, pick up the new stack you've just created and use it as the deck for the next technique.

// To cut N cards, take the top N cards off the top of the deck and move them as a single unit to the bottom of the deck, retaining their order. For example, to cut 3:

// Top          Bottom
// 0 1 2 3 4 5 6 7 8 9   Your deck

//       3 4 5 6 7 8 9   Your deck
// 0 1 2                 Cut cards

// 3 4 5 6 7 8 9         Your deck
//               0 1 2   Cut cards

// 3 4 5 6 7 8 9 0 1 2   Your deck

// You've also been getting pretty good at a version of this technique where N is negative! In that case, cut (the absolute value of) N cards from the bottom of the deck onto the top. For example, to cut -4:

// Top          Bottom
// 0 1 2 3 4 5 6 7 8 9   Your deck

// 0 1 2 3 4 5           Your deck
//             6 7 8 9   Cut cards

//         0 1 2 3 4 5   Your deck
// 6 7 8 9               Cut cards

// 6 7 8 9 0 1 2 3 4 5   Your deck

// To deal with increment N, start by clearing enough space on your table to lay out all of the cards individually in a long line. Deal the top card into the leftmost position. Then, move N positions to the right and deal the next card there. If you would move into a position past the end of the space on your table, wrap around and keep counting from the leftmost card again. Continue this process until you run out of cards.

// For example, to deal with increment 3:


// 0 1 2 3 4 5 6 7 8 9   Your deck
// . . . . . . . . . .   Space on table
// ^                     Current position

// Deal the top card to the current position:

//   1 2 3 4 5 6 7 8 9   Your deck
// 0 . . . . . . . . .   Space on table
// ^                     Current position

// Move the current position right 3:

//   1 2 3 4 5 6 7 8 9   Your deck
// 0 . . . . . . . . .   Space on table
//       ^               Current position

// Deal the top card:

//     2 3 4 5 6 7 8 9   Your deck
// 0 . . 1 . . . . . .   Space on table
//       ^               Current position

// Move right 3 and deal:

//       3 4 5 6 7 8 9   Your deck
// 0 . . 1 . . 2 . . .   Space on table
//             ^         Current position

// Move right 3 and deal:

//         4 5 6 7 8 9   Your deck
// 0 . . 1 . . 2 . . 3   Space on table
//                   ^   Current position

// Move right 3, wrapping around, and deal:

//           5 6 7 8 9   Your deck
// 0 . 4 1 . . 2 . . 3   Space on table
//     ^                 Current position

// And so on:

// 0 7 4 1 8 5 2 9 6 3   Space on table

// Positions on the table which already contain cards are still counted; they're not skipped. Of course, this technique is carefully designed so it will never put two cards in the same position or leave a position empty.

// Finally, collect the cards on the table so that the leftmost card ends up at the top of your deck, the card to its right ends up just below the top card, and so on, until the rightmost card ends up at the bottom of the deck.

// The complete shuffle process (your puzzle input) consists of applying many of these techniques. Here are some examples that combine techniques; they all start with a factory order deck of 10 cards:

// deal with increment 7
// deal into new stack
// deal into new stack
// Result: 0 3 6 9 2 5 8 1 4 7
// cut 6
// deal with increment 7
// deal into new stack
// Result: 3 0 7 4 1 8 5 2 9 6
// deal with increment 7
// deal with increment 9
// cut -2
// Result: 6 3 0 7 4 1 8 5 2 9
// deal into new stack
// cut -2
// deal with increment 7
// cut 8
// cut -4
// deal with increment 7
// cut 3
// deal with increment 9
// deal with increment 3
// cut -1
// Result: 9 2 5 8 1 4 7 0 3 6
// Positions within the deck count from 0 at the top, then 1 for the card immediately below the top card, and so on to the bottom. (That is, cards start in the position matching their number.)

// After shuffling your factory order deck of 10007 cards, what is the position of card 2019?

// PART 2:

// After a while, you realize your shuffling skill won't improve much more with merely a single deck of cards. You ask every 3D printer on the ship to make you some more cards while you check on the ship repairs. While reviewing the work the droids have finished so far, you think you see Halley's Comet fly past!

// When you get back, you discover that the 3D printers have combined their power to create for you a single, giant, brand new, factory order deck of 119315717514047 space cards.

// Finally, a deck of cards worthy of shuffling!

// You decide to apply your complete shuffle process (your puzzle input) to the deck 101741582076661 times in a row.

// You'll need to be careful, though - one wrong move with this many cards and you might overflow your entire ship!

// After shuffling your new, giant, factory order deck that many times, what number is on the card that ends up in position 2020?

function shuffle (part, deckSize, shuffleStr, cardToReturn, timesToShuffle = 1) {         // part 2 uses timesToShuffle

  const shuffle = shuffleStr.split('\n');

  // PART 1 VS PART 2
  if (part === 1) {

    let deck = Array(deckSize).fill(0).map((_, i) => i);                                  // in part 1, the deck is small enough that we can afford to track the entire deck

    // PART 1 HELPER FUNCTION: ITERATES THROUGH THE SHUFFLE MOVE LIST AND PERFORMS EACH MOVE ON THE DECK, REASSIGNING `deck` TO THE END RESULT
    function part1Helper () {
      for (const move of shuffle) {
        moveArr = move.split(' ');
        const N = +moveArr[moveArr.length - 1];
        if (moveArr[0] === 'cut') {                                                       // 'cut N'
          const sliceIdx = (N % deckSize + deckSize) % deckSize;                            // to deal with negative N, after we calculate the first % deckSize, add deckSize and then % deckSize again
          deck = [...deck.slice(sliceIdx), ...deck.slice(0, sliceIdx)];
        } else if (moveArr[1] === 'with') {                                               // 'deal with increment N'
          const newDeck = [];
          for (let i = 0; i < deckSize; i++) {                                              // for every card in the deck, pre-move...
            newDeck[i * N % deckSize] = deck[i];                                            // ...put it in the appropriate spot in the new deck (post-move)
          }
          deck = newDeck;
        } else if (moveArr[1] === 'into') {                                               // 'deal into new stack'
          deck.reverse();                                                                   // this is basically just reversing the deck
        } else {
          throw `INVALID MOVE: ${move}!`;                                                 // this should never happen
        }
      }
    }

    for (let i = 0; i < timesToShuffle; i++) part1Helper();                               // do the shuffle maneuver `timesToShuffle` times

    return cardToReturn === undefined ? deck : deck.indexOf(cardToReturn);                // if cardToReturn is specified, return only the index position of that card; else, return the whole deck

  } else {

    shuffle.reverse();                                                                    // reverse the move list so we can track the index position of the given post-shuffle card BEFORE the shuffle happened

    const memo = {};                                                                      // used for 'deal with increment N' to avoid having to recalculate the `increase` for the given deckSize and N

    // PART 2 HELPER FUNCTION: TAKES IN AN INDEX POSITION AND 'FOLLOWS' THE CARD THERE AS IT RUNS THROUGH THE REVERSED SHUFFLE MOVE LIST, RETURNING THE FINAL POSITION OF THAT CARD (WHERE IT BEGAN)
    function part2Helper (cardToReturn) {
      let currentIdx = cardToReturn;                                                      // this is the current index of the card that is located at the input index at the end of the shuffle sequence
      for (const move of shuffle) {
        moveArr = move.split(' ');
        const N = +moveArr[moveArr.length - 1];
        if (moveArr[0] === 'cut') {                                                       // 'cut N'
          currentIdx = ((currentIdx + N) % deckSize + deckSize) % deckSize;                 // to deal with negative N, after we calculate the first % deckSize, add deckSize and then % deckSize again
        } else if (moveArr[1] === 'with') {                                               // 'deal with increment N'
          if (!(N in memo)) {
            let multiples = 0;
            while ((multiples * deckSize + 1) % N) multiples++;                             // find the multiple at which (multiple * base + 1) is divisible by N, where base is deckSize
            memo[N] = ((multiples * deckSize + 1) / N) % deckSize;                          // if you increment num every N steps as you deal, then the num 'increases' by (multiple * base + 1) every N steps
          }
          currentIdx = (memo[N] * currentIdx) % deckSize;                                   // use a memo to avoid having to recalculate the `increase` for the given deckSize and N
        } else if (moveArr[1] === 'into') {                                               // 'deal into new stack'
          currentIdx = deckSize - 1 - currentIdx;
        } else {
          throw `INVALID MOVE: ${move}!`;                                                 // this should never happen
        }
      }
      return currentIdx;
    }

    const seen = {};                                                                      // trying to see if there's a period in terms of which cards end up in a given position after every shuffle

    for (let i = 0; i < Math.min(timesToShuffle, 100000); i++) {
      // cardToReturn = part2Helper(cardToReturn)
      const output = part2Helper(cardToReturn);
      if (output in seen) throw `i = ${i}; previously saw ${output} at ${seen[output]}`;  // if a repeat is found, look for a repeating pattern with i?
      seen[output] = i;
      console.log(output)
      // console.log('RESULT AFTER ENTIRE SEQUENCE:', output)
      cardToReturn = output;
    };

    return cardToReturn;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = shuffle;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 9 || Infinity;

const actualInput = `deal with increment 3
deal into new stack
cut -2846
deal with increment 33
cut -8467
deal into new stack
deal with increment 46
cut 6752
deal with increment 63
deal into new stack
deal with increment 70
deal into new stack
deal with increment 14
cut -1804
deal with increment 68
cut -4936
deal with increment 15
cut -3217
deal with increment 49
cut -1694
deal with increment 58
cut -6918
deal with increment 13
cut -4254
deal with increment 4
deal into new stack
cut 5490
deal into new stack
deal with increment 35
deal into new stack
deal with increment 7
cut 854
deal with increment 46
cut -8619
deal with increment 32
deal into new stack
cut -6319
deal with increment 31
cut 1379
deal with increment 66
cut -7328
deal with increment 55
cut -6326
deal with increment 10
deal into new stack
cut 4590
deal with increment 18
cut -9588
deal with increment 5
cut 3047
deal with increment 24
cut -1485
deal into new stack
deal with increment 53
cut 5993
deal with increment 54
cut -5935
deal with increment 49
cut -3349
deal into new stack
deal with increment 28
cut -4978
deal into new stack
deal with increment 30
cut -1657
deal with increment 50
cut 3732
deal with increment 30
cut 6838
deal with increment 30
deal into new stack
cut -3087
deal with increment 42
deal into new stack
deal with increment 68
cut 3376
deal with increment 51
cut -3124
deal with increment 57
deal into new stack
cut -158
deal into new stack
cut -3350
deal with increment 33
deal into new stack
cut 3387
deal with increment 54
cut 1517
deal with increment 20
cut -3981
deal with increment 64
cut 6264
deal with increment 3
deal into new stack
deal with increment 5
cut 232
deal with increment 29
deal into new stack
cut -5147
deal with increment 51`;

// Test case 1
input = {
  part: 1,
  deckSize: 10,
  shuffleStr: `deal into new stack`
};
expected = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  deckSize: 10,
  shuffleStr: `cut 3`
};
expected = [3, 4, 5, 6, 7, 8, 9, 0, 1, 2];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  deckSize: 10,
  shuffleStr: `cut -4`
};
expected = [6, 7, 8, 9, 0, 1, 2, 3, 4, 5];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  deckSize: 10,
  shuffleStr: `deal with increment 3`
};
expected = [0, 7, 4, 1, 8, 5, 2, 9, 6, 3];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  deckSize: 10,
  shuffleStr: `deal with increment 7
deal into new stack
deal into new stack`
};
expected = [0, 3, 6, 9, 2, 5, 8, 1, 4, 7];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  deckSize: 10,
  shuffleStr: `cut 6
deal with increment 7
deal into new stack`
};
expected = [3, 0, 7, 4, 1, 8, 5, 2, 9, 6];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 7
input = {
  part: 1,
  deckSize: 10,
  shuffleStr: `deal with increment 7
deal with increment 9
cut -2`
};
expected = [6, 3, 0, 7, 4, 1, 8, 5, 2, 9];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 8
input = {
  part: 1,
  deckSize: 10,
  shuffleStr: `deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1`
};
expected = [9, 2, 5, 8, 1, 4, 7, 0, 3, 6];
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 9
input = {
  part: 1,
  deckSize: 10007,
  shuffleStr: actualInput,
  cardToReturn: 2019,
};
expected = 7545;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 10
input = {
  part: 2,
  deckSize: 119315717514047,
  shuffleStr: actualInput,
  cardToReturn: 2020,
  timesToShuffle: 101741582076661,
};
expected = null;
test(func, input, expected, testNum, lowestTest, highestTest);

// // Test case 10
// input = {
//   part: 2,
//   deckSize: 119315717514047,
//   shuffleStr: actualInput,
//   cardToReturn: 2020,
//   timesToShuffle: 100,
// };
// expected = null;
// test(func, input, expected, testNum, lowestTest, highestTest);

// // Test case 10
// input = {
//   part: 2,
//   deckSize: 109,
//   shuffleStr: actualInput,
//   cardToReturn: 10,
//   timesToShuffle: 1,
// };
// expected = null;
// test(func, input, expected, testNum, lowestTest, highestTest);

// // Test case 11
// input = {
//   part: 1,
//   deckSize: 109,
//   shuffleStr: actualInput,
// };
// expected = null;
// test(func, input, expected, testNum, lowestTest, highestTest);