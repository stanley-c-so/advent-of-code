/*

--- Day 24: Immune System Simulator 20XX ---

After a weird buzzing noise, you appear back at the man's cottage. He seems relieved to see his friend, but quickly notices that the little reindeer caught some kind of cold while out exploring.

The portly man explains that this reindeer's immune system isn't similar to regular reindeer immune systems:

The immune system and the infection each have an army made up of several groups; each group consists of one or more identical units. The armies repeatedly fight until only one army has units remaining.

Units within a group all have the same hit points (amount of damage a unit can take before it is destroyed), attack damage (the amount of damage each unit deals), an attack type, an initiative (higher initiative units attack first and win ties), and sometimes weaknesses or immunities. Here is an example group:

18 units each with 729 hit points (weak to fire; immune to cold, slashing)
 with an attack that does 8 radiation damage at initiative 10

Each group also has an effective power: the number of units in that group multiplied by their attack damage. The above group has an effective power of 18 * 8 = 144. Groups never have zero or negative units; instead, the group is removed from combat.

Each fight consists of two phases: target selection and attacking.

During the target selection phase, each group attempts to choose one target. In decreasing order of effective power, groups choose their targets; in a tie, the group with the higher initiative chooses first. The attacking group chooses to target the group in the enemy army to which it would deal the most damage (after accounting for weaknesses and immunities, but not accounting for whether the defending group has enough units to actually receive all of that damage).

If an attacking group is considering two defending groups to which it would deal equal damage, it chooses to target the defending group with the largest effective power; if there is still a tie, it chooses the defending group with the highest initiative. If it cannot deal any defending groups damage, it does not choose a target. Defending groups can only be chosen as a target by one attacking group.

At the end of the target selection phase, each group has selected zero or one groups to attack, and each group is being attacked by zero or one groups.

During the attacking phase, each group deals damage to the target it selected, if any. Groups attack in decreasing order of initiative, regardless of whether they are part of the infection or the immune system. (If a group contains no units, it cannot attack.)

The damage an attacking group deals to a defending group depends on the attacking group's attack type and the defending group's immunities and weaknesses. By default, an attacking group would deal damage equal to its effective power to the defending group. However, if the defending group is immune to the attacking group's attack type, the defending group instead takes no damage; if the defending group is weak to the attacking group's attack type, the defending group instead takes double damage.

The defending group only loses whole units from damage; damage is always dealt in such a way that it kills the most units possible, and any remaining damage to a unit that does not immediately kill it is ignored. For example, if a defending group contains 10 units with 10 hit points each and receives 75 damage, it loses exactly 7 units and is left with 3 units at full health.

After the fight is over, if both armies still contain units, a new fight begins; combat only ends once one army has lost all of its units.

For example, consider the following armies:

Immune System:
17 units each with 5390 hit points (weak to radiation, bludgeoning) with
 an attack that does 4507 fire damage at initiative 2
989 units each with 1274 hit points (immune to fire; weak to bludgeoning,
 slashing) with an attack that does 25 slashing damage at initiative 3

Infection:
801 units each with 4706 hit points (weak to radiation) with an attack
 that does 116 bludgeoning damage at initiative 1
4485 units each with 2961 hit points (immune to radiation; weak to fire,
 cold) with an attack that does 12 slashing damage at initiative 4

If these armies were to enter combat, the following fights, including details during the target selection and attacking phases, would take place:

Immune System:
Group 1 contains 17 units
Group 2 contains 989 units
Infection:
Group 1 contains 801 units
Group 2 contains 4485 units

Infection group 1 would deal defending group 1 185832 damage
Infection group 1 would deal defending group 2 185832 damage
Infection group 2 would deal defending group 2 107640 damage
Immune System group 1 would deal defending group 1 76619 damage
Immune System group 1 would deal defending group 2 153238 damage
Immune System group 2 would deal defending group 1 24725 damage

Infection group 2 attacks defending group 2, killing 84 units
Immune System group 2 attacks defending group 1, killing 4 units
Immune System group 1 attacks defending group 2, killing 51 units
Infection group 1 attacks defending group 1, killing 17 units
Immune System:
Group 2 contains 905 units
Infection:
Group 1 contains 797 units
Group 2 contains 4434 units

Infection group 1 would deal defending group 2 184904 damage
Immune System group 2 would deal defending group 1 22625 damage
Immune System group 2 would deal defending group 2 22625 damage

Immune System group 2 attacks defending group 1, killing 4 units
Infection group 1 attacks defending group 2, killing 144 units
Immune System:
Group 2 contains 761 units
Infection:
Group 1 contains 793 units
Group 2 contains 4434 units

Infection group 1 would deal defending group 2 183976 damage
Immune System group 2 would deal defending group 1 19025 damage
Immune System group 2 would deal defending group 2 19025 damage

Immune System group 2 attacks defending group 1, killing 4 units
Infection group 1 attacks defending group 2, killing 143 units
Immune System:
Group 2 contains 618 units
Infection:
Group 1 contains 789 units
Group 2 contains 4434 units

Infection group 1 would deal defending group 2 183048 damage
Immune System group 2 would deal defending group 1 15450 damage
Immune System group 2 would deal defending group 2 15450 damage

Immune System group 2 attacks defending group 1, killing 3 units
Infection group 1 attacks defending group 2, killing 143 units
Immune System:
Group 2 contains 475 units
Infection:
Group 1 contains 786 units
Group 2 contains 4434 units

Infection group 1 would deal defending group 2 182352 damage
Immune System group 2 would deal defending group 1 11875 damage
Immune System group 2 would deal defending group 2 11875 damage

Immune System group 2 attacks defending group 1, killing 2 units
Infection group 1 attacks defending group 2, killing 142 units
Immune System:
Group 2 contains 333 units
Infection:
Group 1 contains 784 units
Group 2 contains 4434 units

Infection group 1 would deal defending group 2 181888 damage
Immune System group 2 would deal defending group 1 8325 damage
Immune System group 2 would deal defending group 2 8325 damage

Immune System group 2 attacks defending group 1, killing 1 unit
Infection group 1 attacks defending group 2, killing 142 units
Immune System:
Group 2 contains 191 units
Infection:
Group 1 contains 783 units
Group 2 contains 4434 units

Infection group 1 would deal defending group 2 181656 damage
Immune System group 2 would deal defending group 1 4775 damage
Immune System group 2 would deal defending group 2 4775 damage

Immune System group 2 attacks defending group 1, killing 1 unit
Infection group 1 attacks defending group 2, killing 142 units
Immune System:
Group 2 contains 49 units
Infection:
Group 1 contains 782 units
Group 2 contains 4434 units

Infection group 1 would deal defending group 2 181424 damage
Immune System group 2 would deal defending group 1 1225 damage
Immune System group 2 would deal defending group 2 1225 damage

Immune System group 2 attacks defending group 1, killing 0 units
Infection group 1 attacks defending group 2, killing 49 units
Immune System:
No groups remain.
Infection:
Group 1 contains 782 units
Group 2 contains 4434 units

In the example above, the winning army ends up with 782 + 4434 = 5216 units.

You scan the reindeer's condition (your puzzle input); the white-bearded man looks nervous. As it stands now, how many units would the winning army have?


--- Part Two ---

Things aren't looking good for the reindeer. The man asks whether more milk and cookies would help you think.

If only you could give the reindeer's immune system a boost, you might be able to change the outcome of the combat.

A boost is an integer increase in immune system units' attack damage. For example, if you were to boost the above example's immune system's units by 1570, the armies would instead look like this:

Immune System:
17 units each with 5390 hit points (weak to radiation, bludgeoning) with
 an attack that does 6077 fire damage at initiative 2
989 units each with 1274 hit points (immune to fire; weak to bludgeoning,
 slashing) with an attack that does 1595 slashing damage at initiative 3

Infection:
801 units each with 4706 hit points (weak to radiation) with an attack
 that does 116 bludgeoning damage at initiative 1
4485 units each with 2961 hit points (immune to radiation; weak to fire,
 cold) with an attack that does 12 slashing damage at initiative 4

With this boost, the combat proceeds differently:

Immune System:
Group 2 contains 989 units
Group 1 contains 17 units
Infection:
Group 1 contains 801 units
Group 2 contains 4485 units

Infection group 1 would deal defending group 2 185832 damage
Infection group 1 would deal defending group 1 185832 damage
Infection group 2 would deal defending group 1 53820 damage
Immune System group 2 would deal defending group 1 1577455 damage
Immune System group 2 would deal defending group 2 1577455 damage
Immune System group 1 would deal defending group 2 206618 damage

Infection group 2 attacks defending group 1, killing 9 units
Immune System group 2 attacks defending group 1, killing 335 units
Immune System group 1 attacks defending group 2, killing 32 units
Infection group 1 attacks defending group 2, killing 84 units
Immune System:
Group 2 contains 905 units
Group 1 contains 8 units
Infection:
Group 1 contains 466 units
Group 2 contains 4453 units

Infection group 1 would deal defending group 2 108112 damage
Infection group 1 would deal defending group 1 108112 damage
Infection group 2 would deal defending group 1 53436 damage
Immune System group 2 would deal defending group 1 1443475 damage
Immune System group 2 would deal defending group 2 1443475 damage
Immune System group 1 would deal defending group 2 97232 damage

Infection group 2 attacks defending group 1, killing 8 units
Immune System group 2 attacks defending group 1, killing 306 units
Infection group 1 attacks defending group 2, killing 29 units
Immune System:
Group 2 contains 876 units
Infection:
Group 2 contains 4453 units
Group 1 contains 160 units

Infection group 2 would deal defending group 2 106872 damage
Immune System group 2 would deal defending group 2 1397220 damage
Immune System group 2 would deal defending group 1 1397220 damage

Infection group 2 attacks defending group 2, killing 83 units
Immune System group 2 attacks defending group 2, killing 427 units

After a few fights...

Immune System:
Group 2 contains 64 units
Infection:
Group 2 contains 214 units
Group 1 contains 19 units

Infection group 2 would deal defending group 2 5136 damage
Immune System group 2 would deal defending group 2 102080 damage
Immune System group 2 would deal defending group 1 102080 damage

Infection group 2 attacks defending group 2, killing 4 units
Immune System group 2 attacks defending group 2, killing 32 units
Immune System:
Group 2 contains 60 units
Infection:
Group 1 contains 19 units
Group 2 contains 182 units

Infection group 1 would deal defending group 2 4408 damage
Immune System group 2 would deal defending group 1 95700 damage
Immune System group 2 would deal defending group 2 95700 damage

Immune System group 2 attacks defending group 1, killing 19 units
Immune System:
Group 2 contains 60 units
Infection:
Group 2 contains 182 units

Infection group 2 would deal defending group 2 4368 damage
Immune System group 2 would deal defending group 2 95700 damage

Infection group 2 attacks defending group 2, killing 3 units
Immune System group 2 attacks defending group 2, killing 30 units

After a few more fights...

Immune System:
Group 2 contains 51 units
Infection:
Group 2 contains 40 units

Infection group 2 would deal defending group 2 960 damage
Immune System group 2 would deal defending group 2 81345 damage

Infection group 2 attacks defending group 2, killing 0 units
Immune System group 2 attacks defending group 2, killing 27 units
Immune System:
Group 2 contains 51 units
Infection:
Group 2 contains 13 units

Infection group 2 would deal defending group 2 312 damage
Immune System group 2 would deal defending group 2 81345 damage

Infection group 2 attacks defending group 2, killing 0 units
Immune System group 2 attacks defending group 2, killing 13 units
Immune System:
Group 2 contains 51 units
Infection:
No groups remain.

This boost would allow the immune system's armies to win! It would be left with 51 units.

You don't even know how you could boost the reindeer's immune system or what effect it might have, so you need to be cautious and find the smallest boost that would allow the immune system to win.

How many units does the immune system have left after getting the smallest boost it needs to win?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;

function simulateBattle (part, inputStr, DEBUG = false) {
  const [ immuneData, infectionData ] = inputStr.split('\r\n\r\n').map(group => group.split('\r\n'));

  // CONSTANTS
  const IMMUNE = 'IMMUNE';
  const INFECTION = 'INFECTION';

  // HELPER FUNCTION FOR PARSING INPUT DATA
  function parseInputData(dataSource, type) {
    const dataStructure = [];

    for (let i = 1; i < dataSource.length; ++i) {

      // SPLIT LS / RS BASED ON THE PHRASE ' with an attack that does '
      const [ countAndHPAndResistance, damageAndTypeAndInitiative ] = dataSource[i].split(' with an attack that does ');

      // GET COUNT, HP, WEAKNESSES, AND IMMUNITIES INFORMATION FROM LS
      const splitLS = countAndHPAndResistance.split(' ');
      const count = +splitLS[0];
      const HP = +splitLS[4];

      const resistances = countAndHPAndResistance.split('(')[1] || null;
      const [ resistancesLS, resistancesRS ] = resistances ? resistances.slice(0, -1).split('; ') : [ null, null ];                   // remember to strip off the ')'
      const weaknesses =  resistancesLS === null                    ? new Set() :
                          resistancesLS.split(' ')[0] === 'weak'    ? new Set(resistancesLS.split('weak to ')[1].split(', ')) :
                          resistancesRS                             ? new Set(resistancesRS.split('weak to ')[1].split(', ')) :
                                                                      new Set();
      const immunities =  resistancesLS === null                    ? new Set() :
                          resistancesLS.split(' ')[0] === 'immune'  ? new Set(resistancesLS.split('immune to ')[1].split(', ')) :
                          resistancesRS                             ? new Set(resistancesRS.split('immune to ')[1].split(', ')) :
                                                                      new Set();

      // GET DMG, DMG TYPE, AND INITIATIVE INFORMATION FROM RS
      const splitRS = damageAndTypeAndInitiative.split(' ');
      const dmg = +splitRS[0];
      const dmgType = splitRS[1];
      const initiative = +splitRS[5];

      dataStructure.push({
        type,
        count,
        HP,
        weaknesses,
        immunities,
        dmg,
        dmgType,
        initiative,
      });
    }
    return dataStructure;
  }

  // HELPER FUNCTION - SIMULATE THE RESULT OF A BATTLE, GIVEN A CERTAIN AMOUNT OF BOOST TO IMMUNE SYSTEM'S DAMAGE
  function simulateBattle(immuneDmgBoost) {

    // PARSE INPUT DATA
    const IMMUNE_DATA = parseInputData(immuneData, IMMUNE);
    const INFECTION_DATA = parseInputData(infectionData, INFECTION);

    // PART 2: APPLY BOOST
    for (const group of IMMUNE_DATA) group.dmg += immuneDmgBoost;

    // INIT
    let numImmuneGroupsAlive = IMMUNE_DATA.length;
    let numInfectionGroupsAlive = INFECTION_DATA.length;

    let round = 1;
    while (numImmuneGroupsAlive && numInfectionGroupsAlive) {

      const immuneGroupsAlive = IMMUNE_DATA.map((_, i) => i)
                                            .filter(i => IMMUNE_DATA[i].count > 0)
                                            .sort((a, b) => IMMUNE_DATA[b].count * IMMUNE_DATA[b].dmg - IMMUNE_DATA[a].count * IMMUNE_DATA[a].dmg
                                                              || IMMUNE_DATA[b].initiative - IMMUNE_DATA[a].initiative);
      const infectionGroupsAlive = INFECTION_DATA.map((_, i) => i)
                                                  .filter(i => INFECTION_DATA[i].count > 0)
                                                  .sort((a, b) => INFECTION_DATA[b].count * INFECTION_DATA[b].dmg - INFECTION_DATA[a].count * INFECTION_DATA[a].dmg
                                                                    || INFECTION_DATA[b].initiative - INFECTION_DATA[a].initiative);

      // TARGETING PHASE

      const immuneGroupTargets = new Set(immuneGroupsAlive);
      const infectionGroupTargets = new Set(infectionGroupsAlive);

      const whomImmuneGroupsAreAttacking = {};
      const whomInfectionGroupsAreAttacking = {};

      for (const attackerIdx of immuneGroupsAlive) {

        const attackerData = IMMUNE_DATA[attackerIdx];
        const potentialDmg = attackerData.count * attackerData.dmg;

        let maxDamage = 0;
        let potentialTargets = [];

        for (const targetIdx of infectionGroupTargets) {

          const targetData = INFECTION_DATA[targetIdx];
          const dmg = targetData.immunities.has(attackerData.dmgType) ? 0 :
                      targetData.weaknesses.has(attackerData.dmgType) ? 2 * potentialDmg :
                                                                        potentialDmg;

          if (dmg && dmg === maxDamage) {
            potentialTargets.push(targetIdx);
          }
          else if (dmg > maxDamage) {
            maxDamage = dmg;
            potentialTargets = [ targetIdx ];
          }
        }

        potentialTargets.sort((a, b) => INFECTION_DATA[b].count * INFECTION_DATA[b].dmg - INFECTION_DATA[a].count * INFECTION_DATA[a].dmg
                                          || INFECTION_DATA[b].initiative - INFECTION_DATA[a].initiative);

        if (potentialTargets.length) {
          const target = potentialTargets[0];
          whomImmuneGroupsAreAttacking[attackerIdx] = target;
          infectionGroupTargets.delete(target);
        }
      }

      for (const attackerIdx of infectionGroupsAlive) {

        const attackerData = INFECTION_DATA[attackerIdx];
        const potentialDmg = attackerData.count * attackerData.dmg;

        let maxDamage = 0;
        let potentialTargets = [];

        for (const targetIdx of immuneGroupTargets) {

          const targetData = IMMUNE_DATA[targetIdx];
          const dmg = targetData.immunities.has(attackerData.dmgType) ? 0 :
                      targetData.weaknesses.has(attackerData.dmgType) ? 2 * potentialDmg :
                                                                        potentialDmg;

          if (dmg && dmg === maxDamage) {
            potentialTargets.push(targetIdx);
          }
          else if (dmg > maxDamage) {
            maxDamage = dmg;
            potentialTargets = [ targetIdx ];
          }
        }

        potentialTargets.sort((a, b) => IMMUNE_DATA[b].count * IMMUNE_DATA[b].dmg - IMMUNE_DATA[a].count * IMMUNE_DATA[a].dmg
                                          || IMMUNE_DATA[b].initiative - IMMUNE_DATA[a].initiative);

        if (potentialTargets.length) {
          const target = potentialTargets[0];
          whomInfectionGroupsAreAttacking[attackerIdx] = target;
          immuneGroupTargets.delete(target);
        }
      }

      // ATTACK PHASE

      const immuneGroupsAliveWithType = immuneGroupsAlive.map(idx => ({ type: IMMUNE, idx }));
      const infectionGroupsAliveWithType = infectionGroupsAlive.map(idx => ({ type: INFECTION, idx }));

      const allGroupsAlive = [ ...immuneGroupsAliveWithType, ...infectionGroupsAliveWithType ].sort((a, b) => {
                                                                                                const idxA = a.idx;
                                                                                                const idxB = b.idx;
                                                                                                const dataA = (a.type === IMMUNE ? IMMUNE_DATA : INFECTION_DATA)[idxA];
                                                                                                const dataB = (b.type === IMMUNE ? IMMUNE_DATA : INFECTION_DATA)[idxB];
                                                                                                return dataB.initiative - dataA.initiative;
                                                                                              });

      let numAttacks = 0;                                                                                                             // for resolving stalemates (if remaining armies
                                                                                                                                      // are immune to each other's attacks, nobody wins)

      for (const attacker of allGroupsAlive) {

        const attackerIdx = attacker.idx;

        if (attacker.type === IMMUNE && !(attackerIdx in whomImmuneGroupsAreAttacking)                                                // no attack target for this attacker
            || attacker.type === INFECTION && !(attackerIdx in whomInfectionGroupsAreAttacking)
        ) {
          continue;
        }
        const targetIdx = (attacker.type === IMMUNE ? whomImmuneGroupsAreAttacking : whomInfectionGroupsAreAttacking)[attackerIdx];

        const attackerData = (attacker.type === IMMUNE ? IMMUNE_DATA : INFECTION_DATA)[attackerIdx];
        const targetData = (attacker.type === IMMUNE ? INFECTION_DATA : IMMUNE_DATA)[targetIdx];

        if (attackerData.count === 0) continue;                                                                                       // it's possible this group died

        ++numAttacks;

        const potentialDmg = attackerData.count * attackerData.dmg;

        const dmg = targetData.immunities.has(attackerData.dmgType)   ? 0 :
                      targetData.weaknesses.has(attackerData.dmgType) ? 2 * potentialDmg :
                                                                        potentialDmg;
        
        const unitsLost = Math.floor(dmg / targetData.HP);
        targetData.count = Math.max(0, targetData.count - unitsLost);

        if (targetData.count === 0) {
          if (targetData.type === IMMUNE) --numImmuneGroupsAlive;
          else                            --numInfectionGroupsAlive;
        }
      }

      if (!numAttacks) return { winner: null, remainingCount: null, round };                                                          // stalemate

      ++round;
    }

    if (numImmuneGroupsAlive)         return { winner: IMMUNE, remainingCount: IMMUNE_DATA.reduce((total, group) => total + group.count, 0), round };
    else if (numInfectionGroupsAlive) return { winner: INFECTION, remainingCount: INFECTION_DATA.reduce((total, group) => total + group.count, 0), round };
    else                              throw 'ERROR: SOMEHOW BOTH ARMIES ARE DEAD';
  }

  // ANALYZE
  if (part === 1) {                                                                                                                   // PART 1: ANALYZE BATTLE WITH NO BOOST

    const resWithoutBoost = simulateBattle(0);

    if (DISPLAY_EXTRA_INFO) {
      console.log(`NUMBER OF ROUNDS: ${resWithoutBoost.round}`);
    }

    return resWithoutBoost.remainingCount;

  } else {                                                                                                                            // PART 2: FIND MINIMUM BOOST SUCH THAT IMMUNE WINS

    let min = 0;
    let max = Number.MAX_SAFE_INTEGER;

    while (min <= max) {
      const mid = min + Math.floor((max - min) / 2);
      const res = simulateBattle(mid);
      if (res.winner !== IMMUNE) {                                                                                                    // result could be a stalemate
        min = mid + 1;
      } else {
        const resPrevNum = simulateBattle(mid - 1);
        if (resPrevNum.winner !== IMMUNE) {                                                                                           // result could be a stalemate

          if (DISPLAY_EXTRA_INFO) {
            console.log(`RESULTS WITH LOWEST BOOST: ${mid}`);
            console.log(res);
          }

          return res.remainingCount;
        }
        max = mid - 1;
      }
    }
    throw 'ERROR: NO SOLUTION FOUND';

  }
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
`Immune System:
17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2
989 units each with 1274 hit points (immune to fire; weak to bludgeoning, slashing) with an attack that does 25 slashing damage at initiative 3

Infection:
801 units each with 4706 hit points (weak to radiation) with an attack that does 116 bludgeoning damage at initiative 1
4485 units each with 2961 hit points (immune to radiation; weak to fire, cold) with an attack that does 12 slashing damage at initiative 4`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 5216;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 22244;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 51;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 2689;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);