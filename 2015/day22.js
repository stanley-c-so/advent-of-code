/*

--- Day 22: Wizard Simulator 20XX ---

Little Henry Case decides that defeating bosses with swords and stuff is boring. Now he's playing the game with a wizard. Of course, he gets stuck on another boss and needs your help again.

In this version, combat still proceeds with the player and the boss taking alternating turns. The player still goes first. Now, however, you don't get any equipment; instead, you must choose one of your spells to cast. The first character at or below 0 hit points loses.

Since you're a wizard, you don't get to wear armor, and you can't attack normally. However, since you do magic damage, your opponent's armor is ignored, and so the boss effectively has zero armor as well. As before, if armor (from a spell, in this case) would reduce damage below 1, it becomes 1 instead - that is, the boss' attacks always deal at least 1 damage.

On each of your turns, you must select one of your spells to cast. If you cannot afford to cast any spell, you lose. Spells cost mana; you start with 500 mana, but have no maximum limit. You must have enough mana to cast a spell, and its cost is immediately deducted when you cast it. Your spells are Magic Missile, Drain, Shield, Poison, and Recharge.

Magic Missile costs 53 mana. It instantly does 4 damage.
Drain costs 73 mana. It instantly does 2 damage and heals you for 2 hit points.
Shield costs 113 mana. It starts an effect that lasts for 6 turns. While it is active, your armor is increased by 7.
Poison costs 173 mana. It starts an effect that lasts for 6 turns. At the start of each turn while it is active, it deals the boss 3 damage.
Recharge costs 229 mana. It starts an effect that lasts for 5 turns. At the start of each turn while it is active, it gives you 101 new mana.

Effects all work the same way. Effects apply at the start of both the player's turns and the boss' turns. Effects are created with a timer (the number of turns they last); at the start of each turn, after they apply any effect they have, their timer is decreased by one. If this decreases the timer to zero, the effect ends. You cannot cast a spell that would start an effect which is already active. However, effects can be started on the same turn they end.

For example, suppose the player has 10 hit points and 250 mana, and that the boss has 13 hit points and 8 damage:

-- Player turn --
- Player has 10 hit points, 0 armor, 250 mana
- Boss has 13 hit points
Player casts Poison.

-- Boss turn --
- Player has 10 hit points, 0 armor, 77 mana
- Boss has 13 hit points
Poison deals 3 damage; its timer is now 5.
Boss attacks for 8 damage.

-- Player turn --
- Player has 2 hit points, 0 armor, 77 mana
- Boss has 10 hit points
Poison deals 3 damage; its timer is now 4.
Player casts Magic Missile, dealing 4 damage.

-- Boss turn --
- Player has 2 hit points, 0 armor, 24 mana
- Boss has 3 hit points
Poison deals 3 damage. This kills the boss, and the player wins.
Now, suppose the same initial conditions, except that the boss has 14 hit points instead:

-- Player turn --
- Player has 10 hit points, 0 armor, 250 mana
- Boss has 14 hit points
Player casts Recharge.

-- Boss turn --
- Player has 10 hit points, 0 armor, 21 mana
- Boss has 14 hit points
Recharge provides 101 mana; its timer is now 4.
Boss attacks for 8 damage!

-- Player turn --
- Player has 2 hit points, 0 armor, 122 mana
- Boss has 14 hit points
Recharge provides 101 mana; its timer is now 3.
Player casts Shield, increasing armor by 7.

-- Boss turn --
- Player has 2 hit points, 7 armor, 110 mana
- Boss has 14 hit points
Shield's timer is now 5.
Recharge provides 101 mana; its timer is now 2.
Boss attacks for 8 - 7 = 1 damage!

-- Player turn --
- Player has 1 hit point, 7 armor, 211 mana
- Boss has 14 hit points
Shield's timer is now 4.
Recharge provides 101 mana; its timer is now 1.
Player casts Drain, dealing 2 damage, and healing 2 hit points.

-- Boss turn --
- Player has 3 hit points, 7 armor, 239 mana
- Boss has 12 hit points
Shield's timer is now 3.
Recharge provides 101 mana; its timer is now 0.
Recharge wears off.
Boss attacks for 8 - 7 = 1 damage!

-- Player turn --
- Player has 2 hit points, 7 armor, 340 mana
- Boss has 12 hit points
Shield's timer is now 2.
Player casts Poison.

-- Boss turn --
- Player has 2 hit points, 7 armor, 167 mana
- Boss has 12 hit points
Shield's timer is now 1.
Poison deals 3 damage; its timer is now 5.
Boss attacks for 8 - 7 = 1 damage!

-- Player turn --
- Player has 1 hit point, 7 armor, 167 mana
- Boss has 9 hit points
Shield's timer is now 0.
Shield wears off, decreasing armor by 7.
Poison deals 3 damage; its timer is now 4.
Player casts Magic Missile, dealing 4 damage.

-- Boss turn --
- Player has 1 hit point, 0 armor, 114 mana
- Boss has 2 hit points
Poison deals 3 damage. This kills the boss, and the player wins.

You start with 50 hit points and 500 mana points. The boss's actual stats are in your puzzle input. What is the least amount of mana you can spend and still win the fight? (Do not include mana recharge effects as "spending" negative mana.)


--- Part Two ---



*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function simulateWizardBattle (part, inputStr, extraParam, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  
  // DATA STRUCTURES
  const bossStats = {};

  // CONSTANTS
  const PLAYER_HP = 50;
  const PLAYER_ARMOR = 0;
  const PLAYER_MANA = 500;
  const [ PLAYER, BOSS ] = [ 0, 1 ];
  const MAGIC_MISSILE = 'Magic Missile';
  const DRAIN = 'Drain';
  const SHIELD = 'Shield';
  const POISON = 'Poison';
  const RECHARGE = 'Recharge';
  const MANA_COST = {
    [MAGIC_MISSILE]: 53,
    [DRAIN]: 73,
    [SHIELD]: 113,
    [POISON]: 173,
    [RECHARGE]: 229,
  }

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
      default:
        throw `ERROR: UNRECOGNIZED PROPERTY ${prop}`;
    }
  }

  // MAIN DRIVER FUNCTION
  function getResultsFromBattle(playerStats, bossStats) {

    // UTILITY FUNCTION
    function deepCopyState(STATE) {
      return {
        ...STATE,
        TIMERS: { ...STATE.TIMERS },
        playerStats: { ...STATE.playerStats },
        bossStats: { ...STATE.bossStats },
      };
    }

    // HELPER FUNCTION - ON PLAYER MOVE, RECURSE WITH ALL POSSIBLE SPELLS, AND PICK THE CHEAPEST WINNING RESULT
    function getLowestCostResultFromAllPlayerMoves(STATE) {
      const WINNING_RES = [];

      for (const spell in MANA_COST) {
        const res = backtrack(spell,                                                  // chose selected spell for next turn
                              deepCopyState(STATE));                                  // deep copy the state object
        if (res.winner === PLAYER) WINNING_RES.push(res);
      }

      return WINNING_RES.length ? WINNING_RES                                         // if you can win, pick the one with the least mana spent
                                    .sort((a, b) => a.manaSpent - b.manaSpent)[0]
                                : {                                                   // if no way to win from here, boss wins
                                    winner: BOSS,
                                    playerHP: playerStats.HP,
                                    playerMana: playerStats.mana,
                                    bossHP: bossStats.HP,
                                    manaSpent: STATE.manaSpent,
                                  };
    }

    function backtrack(spell, STATE) {

      const { attacker, manaSpent, TIMERS, playerStats, bossStats } = STATE;          // WARNING: primitives (attacker, manaSpent) can only be READ, not modified.
                                                                                      // however, you can modify STATE[attacker] etc.

      // PART 2: PLAYER LOSES 1 HP ON PLAYER'S TURN, BEFORE ANYTHING ELSE HAPPENS
      if (part === 2 && attacker === PLAYER) --playerStats.HP;                        // PART 2: HARD MODE

      // POTENTIAL BASE CASE: CHECK FOR ATTACKER'S HP <= 0
      if ((attacker === BOSS ? bossStats : playerStats).HP <= 0) {                    // if attacker out of HP...
        const res = {
          winner: +(!attacker),
          playerHP: playerStats.HP,
          playerMana: playerStats.mana,
          bossHP: bossStats.HP,
          manaSpent: STATE.manaSpent,
        }

        // if (playerStats.HP <= 0 && DISPLAY_EXTRA_INFO) {
        //   console.log('PLAYER DIED TO BOSS ATTACK:', res);
        // }
        if (bossStats.HP <= 0) {
          minManaSpentOnPlayerWin = Math.min(minManaSpentOnPlayerWin, manaSpent);     // update record variable
          if (DISPLAY_EXTRA_INFO) {
            console.log('PLAYER KILLED BOSS ON ATTACK:', res);
          }
        }

        return res;                                                                   // ...battle is over, so return data
      }

      // RESOLVE SPELL EFFECTS
      for (const spell in TIMERS) {
        if (TIMERS[spell] > 0) {
          if (spell === SHIELD) {
            if (TIMERS[spell] === 1) playerStats.armor -= 7;
          }
          else if (spell === POISON) {
            bossStats.HP -= 3;
          }
          else if (spell === RECHARGE) {
            playerStats.mana += 101;
          }
          else throw `ERROR: UNRECOGNIZED SPELL ${spell}`;

          --TIMERS[spell];
        }
      }

      // POTENTIAL BASE CASE: CHECK BOSS AGAIN FOR DEATH (BECAUSE OF POISON)
      if (bossStats.HP <= 0) {                                                        // if boss is dead from poison...
        const res = {
          winner: PLAYER,
          playerHP: playerStats.HP,
          playerMana: playerStats.mana,
          bossHP: bossStats.HP,
          manaSpent: STATE.manaSpent,
        }

        minManaSpentOnPlayerWin = Math.min(minManaSpentOnPlayerWin, manaSpent);       // update record variable

        if (DISPLAY_EXTRA_INFO) {
          console.log('PLAYER KILLED BOSS WITH POISON:', res);
        }
        
        return res;                                                                   // ...battle is over, so return data
      }

      // RESOLVE MOVE
      if (attacker === PLAYER) {

        // POTENTIAL BASE CASE: CANNOT CAST SPELL
        if (playerStats.mana < MANA_COST[spell]                                       // if player does not have enough mana for desired spell...
            || (spell in TIMERS && TIMERS[spell] > 0)                                 // or player cannot cast it because it has timer left...
        ) {
          const res = {
            winner: BOSS,
            playerHP: playerStats.HP,
            playerMana: playerStats.mana,
            bossHP: bossStats.HP,
            manaSpent: STATE.manaSpent,
          }
  
          // if (DISPLAY_EXTRA_INFO) {
          //   if (playerStats.mana < MANA_COST[spell]) {
          //     console.log('PLAYER DOES NOT HAVE ENOUGH MANA FOR DESIRED SPELL:', res);
          //   } else if (spell in TIMERS && TIMERS[spell] > 0) {
          //     console.log('PLAYER CANNOT CAST DESIRED SPELL BECAUSE IT IS STILL ACTIVE:', res);
          //   }
          // }
  
          return res;                                                                 // ...battle is over, so return data
        }

        playerStats.mana -= MANA_COST[spell];
        STATE.manaSpent += MANA_COST[spell];

        // POTENTIAL BASE CASE: SPENT TOO MUCH MANA
        if (STATE.manaSpent > minManaSpentOnPlayerWin) {
          const res = {
            winner: BOSS,
            playerHP: playerStats.HP,
            playerMana: playerStats.mana,
            bossHP: bossStats.HP,
            manaSpent: STATE.manaSpent,
          }
          // if (DISPLAY_EXTRA_INFO) {
          //   console.log('PLAYER SPENT MORE MANA THAN A PREVIOUSLY DISCOVERED SOLUTION');
          // }
          return res;                                                                 // ...battle is over, so return data
        }

        // if (DISPLAY_EXTRA_INFO) console.log('>>>' + spell);
        if (spell === MAGIC_MISSILE) {
          bossStats.HP -= 4;
        }
        else if (spell === DRAIN) {
          bossStats.HP -= 2;
          playerStats.HP += 2;
        }
        else if (spell === SHIELD) {
          TIMERS[spell] = 6;
          playerStats.armor += 7;
        }
        else if (spell === POISON) {
          TIMERS[spell] = 6;
        }
        else if (spell === RECHARGE) {
          TIMERS[spell] = 5;
        }
        else throw `ERROR: UNRECOGNIZED SPELL ${spell}`;

      } else {

        const dmg = Math.max(bossStats.damage - playerStats.armor, 1);                // calculate damage (minimum is 1)
        playerStats.HP -= dmg;                                                        // inflict damage on defender

      }

      // RECURSIVE CASE - IF YOU DID NOT HIT BASE CASE ABOVE
      STATE.attacker = +(!attacker);                                                  // switch turns

      if (STATE.attacker === BOSS) {                                                  // if boss moves next...

        return backtrack(null,                                                        // ...go to next turn
                         deepCopyState(STATE));                                       // deep copy the state object
                         
      } else if (PRESET_MOVES) {                                                      // else if player moves next, and sample data...

        const nextSpell = PRESET_MOVES.pop();                                         // ...get predetermined next move...
        return backtrack(nextSpell,                                                   // ...and choose that spell for next turn
                         deepCopyState(STATE));                                       // deep copy the state object

      } else {                                                                        // else if player moves next, and real data...

        return getLowestCostResultFromAllPlayerMoves(STATE);                          // ...recurse with all possible spells

      }
    }

    // KICK-START BACKTRACKING
    const PRESET_MOVES = playerStats.moves  ? playerStats.moves.reverse()             // SAMPLE DATA: reverse for quick pop
                                            : null;                                   // ACTUAL DATA: we don't use this

    const INITIAL_STATE = {
      attacker: PLAYER,                                                               // player attacks first
      manaSpent: 0,
      TIMERS: {
        [SHIELD]: 0,
        [POISON]: 0,
        [RECHARGE]: 0,
      },
      playerStats,
      bossStats,
    };

    let minManaSpentOnPlayerWin = Infinity;                                           // this record variable is global relative to the backtrack

    if (PRESET_MOVES) {                                                               // if sample data...
      
      return backtrack(PRESET_MOVES.pop(),                                            // ...kick-start with first preset move
                       deepCopyState(INITIAL_STATE));                                 // deep copy the state object

    } else {                                                                          // else, if real data...

      return getLowestCostResultFromAllPlayerMoves(INITIAL_STATE);                    // ...kick-start with all possible spells

    }
  }

  // HANDLE SAMPLE DATA
  if (extraParam) {
    console.log('SAMPLE DATA FINAL RESULT:',
                getResultsFromBattle(extraParam, { ...bossStats }));                  // for sample data, extraParam is playerStats
    return null;
  }

  // HANDLE REAL DATA
  else {

    const TIME_AT_START = Date.now();
    if (!DEBUG) console.log('RUNNING ANALYSIS (PLEASE WAIT)...');

    const output = getResultsFromBattle(
      {
        HP: PLAYER_HP,
        armor: PLAYER_ARMOR,
        mana: PLAYER_MANA,
        moves: null,
      },
      { ...bossStats }
    ).manaSpent;

    if (!DEBUG) console.log(`(RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`);
    if (output === 0) throw 'ERROR: DID NOT FIND A WAY TO WIN';
    return output;

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = simulateWizardBattle;
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
`Hit Points: 13
Damage: 8`
);

const sampleInput2 = parseSampleInput(
`Hit Points: 14
Damage: 8`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  extraParam: { HP: 10, armor: 0, mana: 250, moves: [ 'Poison', 'Magic Missile' ] },
  DEBUG: true,
};
expected = null;                                                                  // for sample test, expected result is null
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: sampleInput2,
  extraParam: { HP: 10, armor: 0, mana: 250, moves: [ 'Recharge', 'Shield', 'Drain', 'Poison', 'Magic Missile' ] },
  DEBUG: true,
};
expected = null;                                                                  // for sample test, expected result is null
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  inputStr: actualInput,
  extraParam: null,
};
expected = 1824;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
  extraParam: null,
};
expected = 1937;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);