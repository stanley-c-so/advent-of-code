/*

--- Day 21: RPG Simulator 20XX ---

Little Henry Case got a new video game for Christmas. It's an RPG, and he's stuck on a boss. He needs to know what equipment to buy at the shop. He hands you the controller.

In this game, the player (you) and the enemy (the boss) take turns attacking. The player always goes first. Each attack reduces the opponent's hit points by at least 1. The first character at or below 0 hit points loses.

Damage dealt by an attacker each turn is equal to the attacker's damage score minus the defender's armor score. An attacker always does at least 1 damage. So, if the attacker has a damage score of 8, and the defender has an armor score of 3, the defender loses 5 hit points. If the defender had an armor score of 300, the defender would still lose 1 hit point.

Your damage score and armor score both start at zero. They can be increased by buying items in exchange for gold. You start with no items and have as much gold as you need. Your total damage or armor is equal to the sum of those stats from all of your items. You have 100 hit points.

Here is what the item shop is selling:

Weapons:    Cost  Damage  Armor
Dagger        8     4       0
Shortsword   10     5       0
Warhammer    25     6       0
Longsword    40     7       0
Greataxe     74     8       0

Armor:      Cost  Damage  Armor
Leather      13     0       1
Chainmail    31     0       2
Splintmail   53     0       3
Bandedmail   75     0       4
Platemail   102     0       5

Rings:      Cost  Damage  Armor
Damage +1    25     1       0
Damage +2    50     2       0
Damage +3   100     3       0
Defense +1   20     0       1
Defense +2   40     0       2
Defense +3   80     0       3

You must buy exactly one weapon; no dual-wielding. Armor is optional, but you can't use more than one. You can buy 0-2 rings (at most one for each hand). You must use any items you buy. The shop only has one of each item, so you can't buy, for example, two rings of Damage +3.

For example, suppose you have 8 hit points, 5 damage, and 5 armor, and that the boss has 12 hit points, 7 damage, and 2 armor:

The player deals 5-2 = 3 damage; the boss goes down to 9 hit points.
The boss deals 7-5 = 2 damage; the player goes down to 6 hit points.
The player deals 5-2 = 3 damage; the boss goes down to 6 hit points.
The boss deals 7-5 = 2 damage; the player goes down to 4 hit points.
The player deals 5-2 = 3 damage; the boss goes down to 3 hit points.
The boss deals 7-5 = 2 damage; the player goes down to 2 hit points.
The player deals 5-2 = 3 damage; the boss goes down to 0 hit points.

In this scenario, the player wins! (Barely.)

You have 100 hit points. The boss's actual stats are in your puzzle input. What is the least amount of gold you can spend and still win the fight?


--- Part Two ---

Turns out the shopkeeper is working with the boss, and can persuade you to buy whatever items he wants. The other rules still apply, and he still only has one of each item.

What is the most amount of gold you can spend and still lose the fight?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function simulateBattle (part, inputStr, extraParam, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // DATA STRUCTURES
  const bossStats = {};

  // CONSTANTS
  const PLAYER_HP = 100;
  const [ PLAYER, BOSS ] = [ 0, 1 ];
  const WEAPONS = 'WEAPONS';
  const ARMOR = 'ARMOR';
  const RINGS = 'RINGS';
  const STORE = {
    [WEAPONS]: {
      'Dagger':     { cost: 8, damage: 4, armor: 0 },
      'Shortsword': { cost: 10, damage: 5, armor: 0 },
      'Warhammer':  { cost: 25, damage: 6, armor: 0 },
      'Longsword':  { cost: 40, damage: 7, armor: 0 },
      'Greataxe':   { cost: 74, damage: 8, armor: 0 },
    },
    [ARMOR]: {
      'Leather':    { cost: 13, damage: 0, armor: 1 },
      'Chainmail':  { cost: 31, damage: 0, armor: 2 },
      'Splintmail': { cost: 53, damage: 0, armor: 3 },
      'Bandedmail': { cost: 75, damage: 0, armor: 4 },
      'Platemail':  { cost: 102, damage: 0, armor: 5 },
    },
    [RINGS]: {
      'Damage +1':  { cost: 25, damage: 1, armor: 0 },
      'Damage +2':  { cost: 50, damage: 2, armor: 0 },
      'Damage +3':  { cost: 100, damage: 3, armor: 0 },
      'Defense +1': { cost: 20, damage: 0, armor: 1 },
      'Defense +2': { cost: 40, damage: 0, armor: 2 },
      'Defense +3': { cost: 80, damage: 0, armor: 3 },
    },
  };
  const STORE_CATEGORIES = Object.keys(STORE);
  const RING_CHOICES = Object.keys(STORE[RINGS]);

  // PARSE INPUT DATA TO GET BOSS STATS
  for (const line of inputArr) {
    const [ prop, n ] = line.split(': ');
    switch (prop) {
      case 'Hit Points':
        bossStats.HP = +n;
        break;
      case 'Damage':
        bossStats.damage = +n;
        break;
      case 'Armor':
        bossStats.armor = +n;
        break;
      default:
        throw `ERROR: UNRECOGNIZED PROPERTY ${prop}`;
    }
  }

  function getWinnerFromBattle(playerStats, bossStats) {
    let attacker = PLAYER;                                                            // player attacks first
    while (true) {
      const [ attackerStats, defenderStats ] = attacker ? [ bossStats, playerStats ]
                                                        : [ playerStats, bossStats ];

      if (attackerStats.HP <= 0) {                                                    // if attacker out of HP...
        const res = {
          winner: +(!attacker),
          playerHP: playerStats.HP,
          bossHP: bossStats.HP,
        }

        if (DISPLAY_EXTRA_INFO) {
          console.log('PLAYER STATS:', playerStats);
          console.log('RESULT:', res);
          console.log('-----');
        }

        return res;                                                                   // ...battle is over, so return data
      }

      const dmg = Math.max( attackerStats.damage - defenderStats.armor, 1 );          // calculate damage (minimum is 1)
      defenderStats.HP -= dmg;                                                        // inflict damage on defender
      attacker = +(!attacker);                                                        // switch turns
    }
  }

  function getPossibleStats(category) {

    const possibilities = [];

    if (category === WEAPONS) {

      // USE 1 WEAPON
      for (const weapon in STORE[category]) {
        possibilities.push(STORE[category][weapon]);
      }
    }

    else if (category === ARMOR) {

      // USE 0 ARMOR
      possibilities.push( { cost: 0, damage: 0, armor: 0 } );

      // USE 1 ARMOR
      for (const armor in STORE[category]) {
        possibilities.push(STORE[category][armor]);
      }
    }

    else if (category === RINGS) {

      // USE 0 RINGS
      possibilities.push( { cost: 0, damage: 0, armor: 0 } );

      // USE 1 RING
      for (const ring in STORE[category]) {
        possibilities.push(STORE[category][ring]);
      }

      // USE 2 RINGS
      for (let i = 0; i < RING_CHOICES.length - 1; ++i) {
        for (let j = i + 1; j < RING_CHOICES.length; ++j) {
          possibilities.push({
            cost: STORE[category][RING_CHOICES[i]].cost
                    + STORE[category][RING_CHOICES[j]].cost,
            damage: STORE[category][RING_CHOICES[i]].damage
                    + STORE[category][RING_CHOICES[j]].damage,
            armor: STORE[category][RING_CHOICES[i]].armor
                    + STORE[category][RING_CHOICES[j]].armor,
          });
        }
      }
    }

    else throw `ERROR: UNRECOGNIZED CATEGORY ${category}`;

    return possibilities;
  }

  // HANDLE SAMPLE DATA
  if (extraParam) {
    console.log('FINAL RESULT:', getWinnerFromBattle(extraParam, { ...bossStats }));  // for sample data, extraParam is playerStats
    return null;
  }

  // ANALYZE - BACKTRACKING
  let minGoldSpent = Infinity;
  let maxGoldSpent = 0;
  const PURCHASES = [];
  function backtrack(i) {

    // BASE CASE
    if (i === STORE_CATEGORIES.length) {

      const winner = getWinnerFromBattle(
        {
          HP: PLAYER_HP,
          damage: PURCHASES.reduce((total, item) => total + item.damage, 0),
          armor: PURCHASES.reduce((total, item) => total + item.armor, 0),
        },
        { ...bossStats }                                                              // IMPORTANT: make a copy of bossStats object
      ).winner;

      const goldSpent = PURCHASES.reduce((total, item) => total + item.cost, 0);

      if (part === 1) {                                                               // PART 1: MINIMIZE GOLD, PLAYER MUST WIN

        if (winner === PLAYER) minGoldSpent = Math.min(minGoldSpent, goldSpent);

      } else {                                                                        // PART 2: MAXIMIZE GOLD, BOSS MUST WIN

        if (winner === BOSS) maxGoldSpent = Math.max(maxGoldSpent, goldSpent);

      }
    }

    // RECURSIVE CASE
    else {
      for (const possibility of getPossibleStats(STORE_CATEGORIES[i])) {
        PURCHASES.push(possibility);
        backtrack(i + 1);
        PURCHASES.pop();
      }
    }
  }
  backtrack(0);

  return part === 1 ? minGoldSpent                                                    // PART 1: MINIMIZE GOLD, PLAYER MUST WIN
                    : maxGoldSpent;                                                   // PART 2: MAXIMIZE GOLD, BOSS MUST WIN
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = simulateBattle;
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
`Hit Points: 12
Damage: 7
Armor: 2`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: { HP: 8, damage: 5, armor: 5 },
  DEBUG: true,
};
expected = null;                                                                  // for sample test, expected result is null
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: null,
};
expected = 111;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: null,
};
expected = 188;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);