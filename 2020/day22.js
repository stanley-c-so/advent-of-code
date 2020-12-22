// --- Day 22: Crab Combat ---

// It only takes a few hours of sailing the ocean on a raft for boredom to sink in. Fortunately, you brought a small deck of space cards! You'd like to play a game of Combat, and there's even an opponent available: a small crab that climbed aboard your raft before you left.

// Fortunately, it doesn't take long to teach the crab the rules.

// Before the game starts, split the cards so each player has their own deck (your puzzle input). Then, the game consists of a series of rounds: both players draw their top card, and the player with the higher-valued card wins the round. The winner keeps both cards, placing them on the bottom of their own deck so that the winner's card is above the other card. If this causes a player to have all of the cards, they win, and the game ends.

// For example, consider the following starting decks:

// Player 1:
// 9
// 2
// 6
// 3
// 1

// Player 2:
// 5
// 8
// 4
// 7
// 10

// This arrangement means that player 1's deck contains 5 cards, with 9 on top and 1 on the bottom; player 2's deck also contains 5 cards, with 5 on top and 10 on the bottom.

// The first round begins with both players drawing the top card of their decks: 9 and 5. Player 1 has the higher card, so both cards move to the bottom of player 1's deck such that 9 is above 5. In total, it takes 29 rounds before a player has all of the cards:

// -- Round 1 --
// Player 1's deck: 9, 2, 6, 3, 1
// Player 2's deck: 5, 8, 4, 7, 10
// Player 1 plays: 9
// Player 2 plays: 5
// Player 1 wins the round!

// -- Round 2 --
// Player 1's deck: 2, 6, 3, 1, 9, 5
// Player 2's deck: 8, 4, 7, 10
// Player 1 plays: 2
// Player 2 plays: 8
// Player 2 wins the round!

// -- Round 3 --
// Player 1's deck: 6, 3, 1, 9, 5
// Player 2's deck: 4, 7, 10, 8, 2
// Player 1 plays: 6
// Player 2 plays: 4
// Player 1 wins the round!

// -- Round 4 --
// Player 1's deck: 3, 1, 9, 5, 6, 4
// Player 2's deck: 7, 10, 8, 2
// Player 1 plays: 3
// Player 2 plays: 7
// Player 2 wins the round!

// -- Round 5 --
// Player 1's deck: 1, 9, 5, 6, 4
// Player 2's deck: 10, 8, 2, 7, 3
// Player 1 plays: 1
// Player 2 plays: 10
// Player 2 wins the round!

// ...several more rounds pass...

// -- Round 27 --
// Player 1's deck: 5, 4, 1
// Player 2's deck: 8, 9, 7, 3, 2, 10, 6
// Player 1 plays: 5
// Player 2 plays: 8
// Player 2 wins the round!

// -- Round 28 --
// Player 1's deck: 4, 1
// Player 2's deck: 9, 7, 3, 2, 10, 6, 8, 5
// Player 1 plays: 4
// Player 2 plays: 9
// Player 2 wins the round!

// -- Round 29 --
// Player 1's deck: 1
// Player 2's deck: 7, 3, 2, 10, 6, 8, 5, 9, 4
// Player 1 plays: 1
// Player 2 plays: 7
// Player 2 wins the round!


// == Post-game results ==
// Player 1's deck: 
// Player 2's deck: 3, 2, 10, 6, 8, 5, 9, 4, 7, 1
// Once the game ends, you can calculate the winning player's score. The bottom card in their deck is worth the value of the card multiplied by 1, the second-from-the-bottom card is worth the value of the card multiplied by 2, and so on. With 10 cards, the top card is worth the value on the card multiplied by 10. In this example, the winning player's score is:

//    3 * 10
// +  2 *  9
// + 10 *  8
// +  6 *  7
// +  8 *  6
// +  5 *  5
// +  9 *  4
// +  4 *  3
// +  7 *  2
// +  1 *  1
// = 306

// So, once the game ends, the winning player's score is 306.

// Play the small crab in a game of Combat using the two decks you just dealt. What is the winning player's score?

// --- Part Two ---

// You lost to the small crab! Fortunately, crabs aren't very good at recursion. To defend your honor as a Raft Captain, you challenge the small crab to a game of Recursive Combat.

// Recursive Combat still starts by splitting the cards into two decks (you offer to play with the same starting decks as before - it's only fair). Then, the game consists of a series of rounds with a few changes:

// Before either player deals a card, if there was a previous round in this game that had exactly the same cards in the same order in the same players' decks, the game instantly ends in a win for player 1. Previous rounds from other games are not considered. (This prevents infinite games of Recursive Combat, which everyone agrees is a bad idea.)
// Otherwise, this round's cards must be in a new configuration; the players begin the round by each drawing the top card of their deck as normal.
// If both players have at least as many cards remaining in their deck as the value of the card they just drew, the winner of the round is determined by playing a new game of Recursive Combat (see below).
// Otherwise, at least one player must not have enough cards left in their deck to recurse; the winner of the round is the player with the higher-value card.
// As in regular Combat, the winner of the round (even if they won the round by winning a sub-game) takes the two cards dealt at the beginning of the round and places them on the bottom of their own deck (again so that the winner's card is above the other card). Note that the winner's card might be the lower-valued of the two cards if they won the round due to winning a sub-game. If collecting cards by winning the round causes a player to have all of the cards, they win, and the game ends.

// Here is an example of a small game that would loop forever without the infinite game prevention rule:

// Player 1:
// 43
// 19

// Player 2:
// 2
// 29
// 14

// During a round of Recursive Combat, if both players have at least as many cards in their own decks as the number on the card they just dealt, the winner of the round is determined by recursing into a sub-game of Recursive Combat. (For example, if player 1 draws the 3 card, and player 2 draws the 7 card, this would occur if player 1 has at least 3 cards left and player 2 has at least 7 cards left, not counting the 3 and 7 cards that were drawn.)

// To play a sub-game of Recursive Combat, each player creates a new deck by making a copy of the next cards in their deck (the quantity of cards copied is equal to the number on the card they drew to trigger the sub-game). During this sub-game, the game that triggered it is on hold and completely unaffected; no cards are removed from players' decks to form the sub-game. (For example, if player 1 drew the 3 card, their deck in the sub-game would be copies of the next three cards in their deck.)

// Here is a complete example of gameplay, where Game 1 is the primary game of Recursive Combat:

// === Game 1 ===

// -- Round 1 (Game 1) --
// Player 1's deck: 9, 2, 6, 3, 1
// Player 2's deck: 5, 8, 4, 7, 10
// Player 1 plays: 9
// Player 2 plays: 5
// Player 1 wins round 1 of game 1!

// -- Round 2 (Game 1) --
// Player 1's deck: 2, 6, 3, 1, 9, 5
// Player 2's deck: 8, 4, 7, 10
// Player 1 plays: 2
// Player 2 plays: 8
// Player 2 wins round 2 of game 1!

// -- Round 3 (Game 1) --
// Player 1's deck: 6, 3, 1, 9, 5
// Player 2's deck: 4, 7, 10, 8, 2
// Player 1 plays: 6
// Player 2 plays: 4
// Player 1 wins round 3 of game 1!

// -- Round 4 (Game 1) --
// Player 1's deck: 3, 1, 9, 5, 6, 4
// Player 2's deck: 7, 10, 8, 2
// Player 1 plays: 3
// Player 2 plays: 7
// Player 2 wins round 4 of game 1!

// -- Round 5 (Game 1) --
// Player 1's deck: 1, 9, 5, 6, 4
// Player 2's deck: 10, 8, 2, 7, 3
// Player 1 plays: 1
// Player 2 plays: 10
// Player 2 wins round 5 of game 1!

// -- Round 6 (Game 1) --
// Player 1's deck: 9, 5, 6, 4
// Player 2's deck: 8, 2, 7, 3, 10, 1
// Player 1 plays: 9
// Player 2 plays: 8
// Player 1 wins round 6 of game 1!

// -- Round 7 (Game 1) --
// Player 1's deck: 5, 6, 4, 9, 8
// Player 2's deck: 2, 7, 3, 10, 1
// Player 1 plays: 5
// Player 2 plays: 2
// Player 1 wins round 7 of game 1!

// -- Round 8 (Game 1) --
// Player 1's deck: 6, 4, 9, 8, 5, 2
// Player 2's deck: 7, 3, 10, 1
// Player 1 plays: 6
// Player 2 plays: 7
// Player 2 wins round 8 of game 1!

// -- Round 9 (Game 1) --
// Player 1's deck: 4, 9, 8, 5, 2
// Player 2's deck: 3, 10, 1, 7, 6
// Player 1 plays: 4
// Player 2 plays: 3
// Playing a sub-game to determine the winner...

// === Game 2 ===

// -- Round 1 (Game 2) --
// Player 1's deck: 9, 8, 5, 2
// Player 2's deck: 10, 1, 7
// Player 1 plays: 9
// Player 2 plays: 10
// Player 2 wins round 1 of game 2!

// -- Round 2 (Game 2) --
// Player 1's deck: 8, 5, 2
// Player 2's deck: 1, 7, 10, 9
// Player 1 plays: 8
// Player 2 plays: 1
// Player 1 wins round 2 of game 2!

// -- Round 3 (Game 2) --
// Player 1's deck: 5, 2, 8, 1
// Player 2's deck: 7, 10, 9
// Player 1 plays: 5
// Player 2 plays: 7
// Player 2 wins round 3 of game 2!

// -- Round 4 (Game 2) --
// Player 1's deck: 2, 8, 1
// Player 2's deck: 10, 9, 7, 5
// Player 1 plays: 2
// Player 2 plays: 10
// Player 2 wins round 4 of game 2!

// -- Round 5 (Game 2) --
// Player 1's deck: 8, 1
// Player 2's deck: 9, 7, 5, 10, 2
// Player 1 plays: 8
// Player 2 plays: 9
// Player 2 wins round 5 of game 2!

// -- Round 6 (Game 2) --
// Player 1's deck: 1
// Player 2's deck: 7, 5, 10, 2, 9, 8
// Player 1 plays: 1
// Player 2 plays: 7
// Player 2 wins round 6 of game 2!
// The winner of game 2 is player 2!

// ...anyway, back to game 1.
// Player 2 wins round 9 of game 1!

// -- Round 10 (Game 1) --
// Player 1's deck: 9, 8, 5, 2
// Player 2's deck: 10, 1, 7, 6, 3, 4
// Player 1 plays: 9
// Player 2 plays: 10
// Player 2 wins round 10 of game 1!

// -- Round 11 (Game 1) --
// Player 1's deck: 8, 5, 2
// Player 2's deck: 1, 7, 6, 3, 4, 10, 9
// Player 1 plays: 8
// Player 2 plays: 1
// Player 1 wins round 11 of game 1!

// -- Round 12 (Game 1) --
// Player 1's deck: 5, 2, 8, 1
// Player 2's deck: 7, 6, 3, 4, 10, 9
// Player 1 plays: 5
// Player 2 plays: 7
// Player 2 wins round 12 of game 1!

// -- Round 13 (Game 1) --
// Player 1's deck: 2, 8, 1
// Player 2's deck: 6, 3, 4, 10, 9, 7, 5
// Player 1 plays: 2
// Player 2 plays: 6
// Playing a sub-game to determine the winner...

// === Game 3 ===

// -- Round 1 (Game 3) --
// Player 1's deck: 8, 1
// Player 2's deck: 3, 4, 10, 9, 7, 5
// Player 1 plays: 8
// Player 2 plays: 3
// Player 1 wins round 1 of game 3!

// -- Round 2 (Game 3) --
// Player 1's deck: 1, 8, 3
// Player 2's deck: 4, 10, 9, 7, 5
// Player 1 plays: 1
// Player 2 plays: 4
// Playing a sub-game to determine the winner...

// === Game 4 ===

// -- Round 1 (Game 4) --
// Player 1's deck: 8
// Player 2's deck: 10, 9, 7, 5
// Player 1 plays: 8
// Player 2 plays: 10
// Player 2 wins round 1 of game 4!
// The winner of game 4 is player 2!

// ...anyway, back to game 3.
// Player 2 wins round 2 of game 3!

// -- Round 3 (Game 3) --
// Player 1's deck: 8, 3
// Player 2's deck: 10, 9, 7, 5, 4, 1
// Player 1 plays: 8
// Player 2 plays: 10
// Player 2 wins round 3 of game 3!

// -- Round 4 (Game 3) --
// Player 1's deck: 3
// Player 2's deck: 9, 7, 5, 4, 1, 10, 8
// Player 1 plays: 3
// Player 2 plays: 9
// Player 2 wins round 4 of game 3!
// The winner of game 3 is player 2!

// ...anyway, back to game 1.
// Player 2 wins round 13 of game 1!

// -- Round 14 (Game 1) --
// Player 1's deck: 8, 1
// Player 2's deck: 3, 4, 10, 9, 7, 5, 6, 2
// Player 1 plays: 8
// Player 2 plays: 3
// Player 1 wins round 14 of game 1!

// -- Round 15 (Game 1) --
// Player 1's deck: 1, 8, 3
// Player 2's deck: 4, 10, 9, 7, 5, 6, 2
// Player 1 plays: 1
// Player 2 plays: 4
// Playing a sub-game to determine the winner...

// === Game 5 ===

// -- Round 1 (Game 5) --
// Player 1's deck: 8
// Player 2's deck: 10, 9, 7, 5
// Player 1 plays: 8
// Player 2 plays: 10
// Player 2 wins round 1 of game 5!
// The winner of game 5 is player 2!

// ...anyway, back to game 1.
// Player 2 wins round 15 of game 1!

// -- Round 16 (Game 1) --
// Player 1's deck: 8, 3
// Player 2's deck: 10, 9, 7, 5, 6, 2, 4, 1
// Player 1 plays: 8
// Player 2 plays: 10
// Player 2 wins round 16 of game 1!

// -- Round 17 (Game 1) --
// Player 1's deck: 3
// Player 2's deck: 9, 7, 5, 6, 2, 4, 1, 10, 8
// Player 1 plays: 3
// Player 2 plays: 9
// Player 2 wins round 17 of game 1!
// The winner of game 1 is player 2!


// == Post-game results ==
// Player 1's deck: 
// Player 2's deck: 7, 5, 6, 2, 4, 1, 10, 8, 9, 3

// After the game, the winning player's score is calculated from the cards they have in their original deck using the same rules as regular Combat. In the above game, the winning player's score is 291.

// Defend your honor as Raft Captain by playing the small crab in a game of Recursive Combat using the same two decks as before. What is the winning player's score?

function crabCombat (part, inputStr) {
  const inputArr = inputStr.split('\n\n');

  // PARSE DATA
  const [p1CardsStr, p2CardsStr] = inputArr;
  const p1Cards = p1CardsStr.split("\n").slice(1).map(n => +n);                                 // both players' card values will be maintained in an array, with index 0 representing the top
  const p2Cards = p2CardsStr.split("\n").slice(1).map(n => +n);                                 // e.g. from sample input: p1Cards begins as [9, 2, 6, 3, 1]

  // UTILITY FUNCTIONS
  function calculateWinningScore(cards) {                                                       // given the array representation of the winner's cards, calculate the score
    return cards.reduce((total, card, i, cards) => total + card * (cards.length - i), 0);       // e.g. if 10 cards: [A, B, C, ..., J] add up A*10 + B*9 + C*8 + ... + J*1
  }
  function serializeGameState(p1Cards, p2Cards) {                                               // given the array representations of the players' cards, serialize into a string
    return p1Cards.join(",") + "|" + p2Cards.join(",");                                         // (the arbitrary "|" serves to distinguish between P1 and P2 cards)
  }

  if (part === 1) {                                                                             // PART 1: SIMPLE RULES WITHOUT RECURSION

    while (p1Cards.length && p2Cards.length) {                                                  // keep playing until one player has no more cards
      const p1Card = p1Cards.shift();                                                           // P1 draws a card
      const p2Card = p2Cards.shift();                                                           // P2 draws a card
      if (p1Card === p2Card) throw "ERROR";                                                     // sanity check: the two players should not draw the same card (it turns out all cards are unique)
      if (p1Card > p2Card) p1Cards.push(p1Card, p2Card);                                        // if P1 wins, push P1's card followed by P2's card to the bottom of P1's deck
      else p2Cards.push(p2Card, p1Card);                                                        // if P2 wins, push P2's card followed by P1's card to the bottom of P2's deck
    }
    return calculateWinningScore(p1Cards.length ? p1Cards : p2Cards);                           // once the game is over (because a player ran out of cards), calculate the winner's score

  } else {                                                                                      // PART 2: RECURSIVE COMBAT (IF PLAYERS CAN PLAY A SUB-GAME, THEY MUST PLAY IT)

    function recursiveCombat(p1Cards, p2Cards) {                                                // this recursive function represents a GAME and returns the winner (1 or 2)

      const gameStates = new Set();                                                             // keep a set of all game states encountered so far (for the repeated game state rule)

      while (p1Cards.length && p2Cards.length) {                                                // keep playing ROUNDS indefinitely until one player runs out of cards and the other wins the GAME

        // CHECK FOR WIN BY GAME STATE RULE
        const gameState = serializeGameState(p1Cards, p2Cards);
        if (gameStates.has(gameState)) return 1;                                                // if the game state repeats, P1 wins the GAME (return 1) - no cards were drawn
        gameStates.add(gameState);

        const p1Card = p1Cards.shift();                                                         // P1 draws a card
        const p2Card = p2Cards.shift();                                                         // P2 draws a card
        if (p1Card === p2Card) throw "ERROR";                                                   // sanity check: the two players should not draw the same card (it turns out all cards are unique)

        // CHECK FOR SUB-GAME RECURSION
        if (p1Cards.length >= p1Card && p2Cards.length >= p2Card) {                             // if a sub-game is possible (both players have enough cards to copy over to the sub-game)...
          const winner = recursiveCombat(p1Cards.slice(0, p1Card), p2Cards.slice(0, p2Card));   // ...clone the necessary cards and recurse, and determine who the winner is
          if (winner === 1) p1Cards.push(p1Card, p2Card);                                       // if P1 wins the ROUND, push P1's card followed by P2's card to the bottom of P1's deck
          else p2Cards.push(p2Card, p1Card);                                                    // if P2 wins the ROUND, push P2's card followed by P1's card to the bottom of P2's deck
        }
        
        // WIN BY HIGHER CARD
        else {
          if (p1Card > p2Card) p1Cards.push(p1Card, p2Card);                                    // if P1 wins the ROUND, push P1's card followed by P2's card to the bottom of P1's deck
          else p2Cards.push(p2Card, p1Card);                                                    // if P2 wins the ROUND, push P2's card followed by P1's card to the bottom of P2's deck
        }

      }

      return p1Cards.length ? 1 : 2;                                                            // once the GAME is over (because a player ran out of cards), return the winner (1 or 2)

    }

    const winner = recursiveCombat(p1Cards, p2Cards);                                           // kick-start recursion and determine the winner (1 or 2)
    return calculateWinningScore(winner === 1 ? p1Cards : p2Cards);                             // calculate and return the winner's score

  }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = crabCombat;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`;

const actualInput = `Player 1:
41
26
29
11
50
38
42
20
13
9
40
43
10
24
35
30
23
15
31
48
27
44
16
12
14

Player 2:
18
6
32
37
25
21
33
28
7
8
45
46
49
5
19
2
39
4
17
3
22
1
34
36
47`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 306;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 32489;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 291;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 35676;
test(func, input, expected, testNum, lowestTest, highestTest);