/*

--- Day 19: Not Enough Minerals ---

Your scans show that the lava did indeed form obsidian!

The wind has changed direction enough to stop sending lava droplets toward you, so you and the elephants exit the cave. As you do, you notice a collection of geodes around the pond. Perhaps you could use the obsidian to create some geode-cracking robots and break them open?

To collect the obsidian from the bottom of the pond, you'll need waterproof obsidian-collecting robots. Fortunately, there is an abundant amount of clay nearby that you can use to make them waterproof.

In order to harvest the clay, you'll need special-purpose clay-collecting robots. To make any type of robot, you'll need ore, which is also plentiful but in the opposite direction from the clay.

Collecting ore requires ore-collecting robots with big drills. Fortunately, you have exactly one ore-collecting robot in your pack that you can use to kickstart the whole operation.

Each robot can collect 1 of its resource type per minute. It also takes one minute for the robot factory (also conveniently from your pack) to construct any type of robot, although it consumes the necessary resources available when construction begins.

The robot factory has many blueprints (your puzzle input) you can choose from, but once you've configured it with a blueprint, you can't change it. You'll need to work out which blueprint is best.

For example:

Blueprint 1:
  Each ore robot costs 4 ore.
  Each clay robot costs 2 ore.
  Each obsidian robot costs 3 ore and 14 clay.
  Each geode robot costs 2 ore and 7 obsidian.

Blueprint 2:
  Each ore robot costs 2 ore.
  Each clay robot costs 3 ore.
  Each obsidian robot costs 3 ore and 8 clay.
  Each geode robot costs 3 ore and 12 obsidian.

(Blueprints have been line-wrapped here for legibility. The robot factory's actual assortment of blueprints are provided one blueprint per line.)

The elephants are starting to look hungry, so you shouldn't take too long; you need to figure out which blueprint would maximize the number of opened geodes after 24 minutes by figuring out which robots to build and when to build them.

Using blueprint 1 in the example above, the largest number of geodes you could open in 24 minutes is 9. One way to achieve that is:

== Minute 1 ==
1 ore-collecting robot collects 1 ore; you now have 1 ore.

== Minute 2 ==
1 ore-collecting robot collects 1 ore; you now have 2 ore.

== Minute 3 ==
Spend 2 ore to start building a clay-collecting robot.
1 ore-collecting robot collects 1 ore; you now have 1 ore.
The new clay-collecting robot is ready; you now have 1 of them.

== Minute 4 ==
1 ore-collecting robot collects 1 ore; you now have 2 ore.
1 clay-collecting robot collects 1 clay; you now have 1 clay.

== Minute 5 ==
Spend 2 ore to start building a clay-collecting robot.
1 ore-collecting robot collects 1 ore; you now have 1 ore.
1 clay-collecting robot collects 1 clay; you now have 2 clay.
The new clay-collecting robot is ready; you now have 2 of them.

== Minute 6 ==
1 ore-collecting robot collects 1 ore; you now have 2 ore.
2 clay-collecting robots collect 2 clay; you now have 4 clay.

== Minute 7 ==
Spend 2 ore to start building a clay-collecting robot.
1 ore-collecting robot collects 1 ore; you now have 1 ore.
2 clay-collecting robots collect 2 clay; you now have 6 clay.
The new clay-collecting robot is ready; you now have 3 of them.

== Minute 8 ==
1 ore-collecting robot collects 1 ore; you now have 2 ore.
3 clay-collecting robots collect 3 clay; you now have 9 clay.

== Minute 9 ==
1 ore-collecting robot collects 1 ore; you now have 3 ore.
3 clay-collecting robots collect 3 clay; you now have 12 clay.

== Minute 10 ==
1 ore-collecting robot collects 1 ore; you now have 4 ore.
3 clay-collecting robots collect 3 clay; you now have 15 clay.

== Minute 11 ==
Spend 3 ore and 14 clay to start building an obsidian-collecting robot.
1 ore-collecting robot collects 1 ore; you now have 2 ore.
3 clay-collecting robots collect 3 clay; you now have 4 clay.
The new obsidian-collecting robot is ready; you now have 1 of them.

== Minute 12 ==
Spend 2 ore to start building a clay-collecting robot.
1 ore-collecting robot collects 1 ore; you now have 1 ore.
3 clay-collecting robots collect 3 clay; you now have 7 clay.
1 obsidian-collecting robot collects 1 obsidian; you now have 1 obsidian.
The new clay-collecting robot is ready; you now have 4 of them.

== Minute 13 ==
1 ore-collecting robot collects 1 ore; you now have 2 ore.
4 clay-collecting robots collect 4 clay; you now have 11 clay.
1 obsidian-collecting robot collects 1 obsidian; you now have 2 obsidian.

== Minute 14 ==
1 ore-collecting robot collects 1 ore; you now have 3 ore.
4 clay-collecting robots collect 4 clay; you now have 15 clay.
1 obsidian-collecting robot collects 1 obsidian; you now have 3 obsidian.

== Minute 15 ==
Spend 3 ore and 14 clay to start building an obsidian-collecting robot.
1 ore-collecting robot collects 1 ore; you now have 1 ore.
4 clay-collecting robots collect 4 clay; you now have 5 clay.
1 obsidian-collecting robot collects 1 obsidian; you now have 4 obsidian.
The new obsidian-collecting robot is ready; you now have 2 of them.

== Minute 16 ==
1 ore-collecting robot collects 1 ore; you now have 2 ore.
4 clay-collecting robots collect 4 clay; you now have 9 clay.
2 obsidian-collecting robots collect 2 obsidian; you now have 6 obsidian.

== Minute 17 ==
1 ore-collecting robot collects 1 ore; you now have 3 ore.
4 clay-collecting robots collect 4 clay; you now have 13 clay.
2 obsidian-collecting robots collect 2 obsidian; you now have 8 obsidian.

== Minute 18 ==
Spend 2 ore and 7 obsidian to start building a geode-cracking robot.
1 ore-collecting robot collects 1 ore; you now have 2 ore.
4 clay-collecting robots collect 4 clay; you now have 17 clay.
2 obsidian-collecting robots collect 2 obsidian; you now have 3 obsidian.
The new geode-cracking robot is ready; you now have 1 of them.

== Minute 19 ==
1 ore-collecting robot collects 1 ore; you now have 3 ore.
4 clay-collecting robots collect 4 clay; you now have 21 clay.
2 obsidian-collecting robots collect 2 obsidian; you now have 5 obsidian.
1 geode-cracking robot cracks 1 geode; you now have 1 open geode.

== Minute 20 ==
1 ore-collecting robot collects 1 ore; you now have 4 ore.
4 clay-collecting robots collect 4 clay; you now have 25 clay.
2 obsidian-collecting robots collect 2 obsidian; you now have 7 obsidian.
1 geode-cracking robot cracks 1 geode; you now have 2 open geodes.

== Minute 21 ==
Spend 2 ore and 7 obsidian to start building a geode-cracking robot.
1 ore-collecting robot collects 1 ore; you now have 3 ore.
4 clay-collecting robots collect 4 clay; you now have 29 clay.
2 obsidian-collecting robots collect 2 obsidian; you now have 2 obsidian.
1 geode-cracking robot cracks 1 geode; you now have 3 open geodes.
The new geode-cracking robot is ready; you now have 2 of them.

== Minute 22 ==
1 ore-collecting robot collects 1 ore; you now have 4 ore.
4 clay-collecting robots collect 4 clay; you now have 33 clay.
2 obsidian-collecting robots collect 2 obsidian; you now have 4 obsidian.
2 geode-cracking robots crack 2 geodes; you now have 5 open geodes.

== Minute 23 ==
1 ore-collecting robot collects 1 ore; you now have 5 ore.
4 clay-collecting robots collect 4 clay; you now have 37 clay.
2 obsidian-collecting robots collect 2 obsidian; you now have 6 obsidian.
2 geode-cracking robots crack 2 geodes; you now have 7 open geodes.

== Minute 24 ==
1 ore-collecting robot collects 1 ore; you now have 6 ore.
4 clay-collecting robots collect 4 clay; you now have 41 clay.
2 obsidian-collecting robots collect 2 obsidian; you now have 8 obsidian.
2 geode-cracking robots crack 2 geodes; you now have 9 open geodes.

However, by using blueprint 2 in the example above, you could do even better: the largest number of geodes you could open in 24 minutes is 12.

Determine the quality level of each blueprint by multiplying that blueprint's ID number with the largest number of geodes that can be opened in 24 minutes using that blueprint. In this example, the first blueprint has ID 1 and can open 9 geodes, so its quality level is 9. The second blueprint has ID 2 and can open 12 geodes, so its quality level is 24. Finally, if you add up the quality levels of all of the blueprints in the list, you get 33.

Determine the quality level of each blueprint using the largest number of geodes it could produce in 24 minutes. What do you get if you add up the quality level of all of the blueprints in your list?


--- Part Two ---

While you were choosing the best blueprint, the elephants found some food on their own, so you're not in as much of a hurry; you figure you probably have 32 minutes before the wind changes direction again and you'll need to get out of range of the erupting volcano.

Unfortunately, one of the elephants ate most of your blueprint list! Now, only the first three blueprints in your list are intact.

In 32 minutes, the largest number of geodes blueprint 1 (from the example above) can open is 56. One way to achieve that is:

== Minute 1 ==
1 ore-collecting robot collects 1 ore; you now have 1 ore.

== Minute 2 ==
1 ore-collecting robot collects 1 ore; you now have 2 ore.

== Minute 3 ==
1 ore-collecting robot collects 1 ore; you now have 3 ore.

== Minute 4 ==
1 ore-collecting robot collects 1 ore; you now have 4 ore.

== Minute 5 ==
Spend 4 ore to start building an ore-collecting robot.
1 ore-collecting robot collects 1 ore; you now have 1 ore.
The new ore-collecting robot is ready; you now have 2 of them.

== Minute 6 ==
2 ore-collecting robots collect 2 ore; you now have 3 ore.

== Minute 7 ==
Spend 2 ore to start building a clay-collecting robot.
2 ore-collecting robots collect 2 ore; you now have 3 ore.
The new clay-collecting robot is ready; you now have 1 of them.

== Minute 8 ==
Spend 2 ore to start building a clay-collecting robot.
2 ore-collecting robots collect 2 ore; you now have 3 ore.
1 clay-collecting robot collects 1 clay; you now have 1 clay.
The new clay-collecting robot is ready; you now have 2 of them.

== Minute 9 ==
Spend 2 ore to start building a clay-collecting robot.
2 ore-collecting robots collect 2 ore; you now have 3 ore.
2 clay-collecting robots collect 2 clay; you now have 3 clay.
The new clay-collecting robot is ready; you now have 3 of them.

== Minute 10 ==
Spend 2 ore to start building a clay-collecting robot.
2 ore-collecting robots collect 2 ore; you now have 3 ore.
3 clay-collecting robots collect 3 clay; you now have 6 clay.
The new clay-collecting robot is ready; you now have 4 of them.

== Minute 11 ==
Spend 2 ore to start building a clay-collecting robot.
2 ore-collecting robots collect 2 ore; you now have 3 ore.
4 clay-collecting robots collect 4 clay; you now have 10 clay.
The new clay-collecting robot is ready; you now have 5 of them.

== Minute 12 ==
Spend 2 ore to start building a clay-collecting robot.
2 ore-collecting robots collect 2 ore; you now have 3 ore.
5 clay-collecting robots collect 5 clay; you now have 15 clay.
The new clay-collecting robot is ready; you now have 6 of them.

== Minute 13 ==
Spend 2 ore to start building a clay-collecting robot.
2 ore-collecting robots collect 2 ore; you now have 3 ore.
6 clay-collecting robots collect 6 clay; you now have 21 clay.
The new clay-collecting robot is ready; you now have 7 of them.

== Minute 14 ==
Spend 3 ore and 14 clay to start building an obsidian-collecting robot.
2 ore-collecting robots collect 2 ore; you now have 2 ore.
7 clay-collecting robots collect 7 clay; you now have 14 clay.
The new obsidian-collecting robot is ready; you now have 1 of them.

== Minute 15 ==
2 ore-collecting robots collect 2 ore; you now have 4 ore.
7 clay-collecting robots collect 7 clay; you now have 21 clay.
1 obsidian-collecting robot collects 1 obsidian; you now have 1 obsidian.

== Minute 16 ==
Spend 3 ore and 14 clay to start building an obsidian-collecting robot.
2 ore-collecting robots collect 2 ore; you now have 3 ore.
7 clay-collecting robots collect 7 clay; you now have 14 clay.
1 obsidian-collecting robot collects 1 obsidian; you now have 2 obsidian.
The new obsidian-collecting robot is ready; you now have 2 of them.

== Minute 17 ==
Spend 3 ore and 14 clay to start building an obsidian-collecting robot.
2 ore-collecting robots collect 2 ore; you now have 2 ore.
7 clay-collecting robots collect 7 clay; you now have 7 clay.
2 obsidian-collecting robots collect 2 obsidian; you now have 4 obsidian.
The new obsidian-collecting robot is ready; you now have 3 of them.

== Minute 18 ==
2 ore-collecting robots collect 2 ore; you now have 4 ore.
7 clay-collecting robots collect 7 clay; you now have 14 clay.
3 obsidian-collecting robots collect 3 obsidian; you now have 7 obsidian.

== Minute 19 ==
Spend 3 ore and 14 clay to start building an obsidian-collecting robot.
2 ore-collecting robots collect 2 ore; you now have 3 ore.
7 clay-collecting robots collect 7 clay; you now have 7 clay.
3 obsidian-collecting robots collect 3 obsidian; you now have 10 obsidian.
The new obsidian-collecting robot is ready; you now have 4 of them.

== Minute 20 ==
Spend 2 ore and 7 obsidian to start building a geode-cracking robot.
2 ore-collecting robots collect 2 ore; you now have 3 ore.
7 clay-collecting robots collect 7 clay; you now have 14 clay.
4 obsidian-collecting robots collect 4 obsidian; you now have 7 obsidian.
The new geode-cracking robot is ready; you now have 1 of them.

== Minute 21 ==
Spend 3 ore and 14 clay to start building an obsidian-collecting robot.
2 ore-collecting robots collect 2 ore; you now have 2 ore.
7 clay-collecting robots collect 7 clay; you now have 7 clay.
4 obsidian-collecting robots collect 4 obsidian; you now have 11 obsidian.
1 geode-cracking robot cracks 1 geode; you now have 1 open geode.
The new obsidian-collecting robot is ready; you now have 5 of them.

== Minute 22 ==
Spend 2 ore and 7 obsidian to start building a geode-cracking robot.
2 ore-collecting robots collect 2 ore; you now have 2 ore.
7 clay-collecting robots collect 7 clay; you now have 14 clay.
5 obsidian-collecting robots collect 5 obsidian; you now have 9 obsidian.
1 geode-cracking robot cracks 1 geode; you now have 2 open geodes.
The new geode-cracking robot is ready; you now have 2 of them.

== Minute 23 ==
Spend 2 ore and 7 obsidian to start building a geode-cracking robot.
2 ore-collecting robots collect 2 ore; you now have 2 ore.
7 clay-collecting robots collect 7 clay; you now have 21 clay.
5 obsidian-collecting robots collect 5 obsidian; you now have 7 obsidian.
2 geode-cracking robots crack 2 geodes; you now have 4 open geodes.
The new geode-cracking robot is ready; you now have 3 of them.

== Minute 24 ==
Spend 2 ore and 7 obsidian to start building a geode-cracking robot.
2 ore-collecting robots collect 2 ore; you now have 2 ore.
7 clay-collecting robots collect 7 clay; you now have 28 clay.
5 obsidian-collecting robots collect 5 obsidian; you now have 5 obsidian.
3 geode-cracking robots crack 3 geodes; you now have 7 open geodes.
The new geode-cracking robot is ready; you now have 4 of them.

== Minute 25 ==
2 ore-collecting robots collect 2 ore; you now have 4 ore.
7 clay-collecting robots collect 7 clay; you now have 35 clay.
5 obsidian-collecting robots collect 5 obsidian; you now have 10 obsidian.
4 geode-cracking robots crack 4 geodes; you now have 11 open geodes.

== Minute 26 ==
Spend 2 ore and 7 obsidian to start building a geode-cracking robot.
2 ore-collecting robots collect 2 ore; you now have 4 ore.
7 clay-collecting robots collect 7 clay; you now have 42 clay.
5 obsidian-collecting robots collect 5 obsidian; you now have 8 obsidian.
4 geode-cracking robots crack 4 geodes; you now have 15 open geodes.
The new geode-cracking robot is ready; you now have 5 of them.

== Minute 27 ==
Spend 2 ore and 7 obsidian to start building a geode-cracking robot.
2 ore-collecting robots collect 2 ore; you now have 4 ore.
7 clay-collecting robots collect 7 clay; you now have 49 clay.
5 obsidian-collecting robots collect 5 obsidian; you now have 6 obsidian.
5 geode-cracking robots crack 5 geodes; you now have 20 open geodes.
The new geode-cracking robot is ready; you now have 6 of them.

== Minute 28 ==
2 ore-collecting robots collect 2 ore; you now have 6 ore.
7 clay-collecting robots collect 7 clay; you now have 56 clay.
5 obsidian-collecting robots collect 5 obsidian; you now have 11 obsidian.
6 geode-cracking robots crack 6 geodes; you now have 26 open geodes.

== Minute 29 ==
Spend 2 ore and 7 obsidian to start building a geode-cracking robot.
2 ore-collecting robots collect 2 ore; you now have 6 ore.
7 clay-collecting robots collect 7 clay; you now have 63 clay.
5 obsidian-collecting robots collect 5 obsidian; you now have 9 obsidian.
6 geode-cracking robots crack 6 geodes; you now have 32 open geodes.
The new geode-cracking robot is ready; you now have 7 of them.

== Minute 30 ==
Spend 2 ore and 7 obsidian to start building a geode-cracking robot.
2 ore-collecting robots collect 2 ore; you now have 6 ore.
7 clay-collecting robots collect 7 clay; you now have 70 clay.
5 obsidian-collecting robots collect 5 obsidian; you now have 7 obsidian.
7 geode-cracking robots crack 7 geodes; you now have 39 open geodes.
The new geode-cracking robot is ready; you now have 8 of them.

== Minute 31 ==
Spend 2 ore and 7 obsidian to start building a geode-cracking robot.
2 ore-collecting robots collect 2 ore; you now have 6 ore.
7 clay-collecting robots collect 7 clay; you now have 77 clay.
5 obsidian-collecting robots collect 5 obsidian; you now have 5 obsidian.
8 geode-cracking robots crack 8 geodes; you now have 47 open geodes.
The new geode-cracking robot is ready; you now have 9 of them.

== Minute 32 ==
2 ore-collecting robots collect 2 ore; you now have 8 ore.
7 clay-collecting robots collect 7 clay; you now have 84 clay.
5 obsidian-collecting robots collect 5 obsidian; you now have 10 obsidian.
9 geode-cracking robots crack 9 geodes; you now have 56 open geodes.

However, blueprint 2 from the example above is still better; using it, the largest number of geodes you could open in 32 minutes is 62.

You no longer have enough blueprints to worry about quality levels. Instead, for each of the first three blueprints, determine the largest number of geodes you could open; then, multiply these three values together.

Don't worry about quality levels; instead, just determine the largest number of geodes you could open using each of the first three blueprints. What do you get if you multiply these numbers together?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = true;


// NOTE: THIS WAS ONE OF THE HARDEST PROBLEMS I HAVE EVER SOLVED. THIS WAS DESIGNED TO FORCE YOU TO TRY EVERY TRICK IN THE BOOK TO
// OPTIMIZE YOUR CODE SO THAT IT HAS A SNOWBALL'S CHANCE IN HELL TO FINISH RUNNING THIS CENTURY. MY FIRST FEW ATTEMPTS RAN FOR LITERALLY
// HOURS BEFORE I KILLED THE PROCESSES. I HAVE FOUND THAT THE MOST DRAMATICALLY EFFECTIVE OPTIMIZATION FOR MY CODE WAS NOT TO SIMULATE
// EVERY INDIVIDUAL DAY (LEADING TO EXPONENTIAL BRANCHING) BUT RATHER TO FRAME THE CHOICES IN TERMS OF WHICH ROBOT TYPE (IF ANY) TO BUY
// NEXT, AS SOON AS IT IS POSSIBLE TO DO SO. THUS IN THE INTERIM, THE ONLY STATE CHANGE WILL BE THE INFLUX OF RESOURCES FROM YOUR ROBOTS.
// BY DOING THIS WE ARE ESSENTIALLY COLLAPSING THE SIZE OF THE TREE BY POTENTIALLY SKIPPING DAYS AT A TIME. EVERY ADDITIONAL DAY COUNTS,
// AS THE RUNTIME WILL EASILY SPIRAL OUT OF CONTROL. IN THIS CODE AS IT IS WRITTEN HERE, THE PART 2 SOLUTION RUNS THE ACTUAL DATA IN
// APPROXIMATELY 15 SECONDS!
//
// NOTE: A QUICK NOTE ABOUT NOMENCLATURE IN THIS SOLUTION - THE TIME UNIT GIVEN IN THIS PROBLEM IS IN TERMS OF MINUTES. HOWEVER,
// FOR WHATEVER REASON, I CALLED IT A 'DAY' INSTEAD, AND IT WOULD BE TOO MUCH WORK TO FIX IT NOW. SOMEHOW, THIS IS FITTING, BECAUSE ONE
// WOULD NORMALLY EXPECT THESE SOLUTIONS TO RUN WITHIN A SHORT PERIOD OF TIME, YET MY FIRST FEW ATTEMPTS AT THIS RESULTED IN PROGRAMS THAT
// RAN FOR SEVERAL HOURS AND NEVER FINISHED BEFORE I TERMINATED.

function optimizeResourceChain (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // PARSE INPUT DATA
  const BLUEPRINTS = [];
  for (const line of inputArr) {
    const SPLIT = line.split(' ');                                                              // we will parse based on position within sentence

    const ORE_ROBOT_ORE = +SPLIT[6];
    const CLAY_ROBOT_ORE = +SPLIT[12];
    const OBSIDIAN_ROBOT_ORE = +SPLIT[18];
    const OBSIDIAN_ROBOT_CLAY = +SPLIT[21];
    const GEODE_ROBOT_ORE = +SPLIT[27];
    const GEODE_ROBOT_OBSIDIAN = +SPLIT[30];

    BLUEPRINTS.push({
      ORE_ROBOT: { ore: ORE_ROBOT_ORE },
      CLAY_ROBOT: { ore: CLAY_ROBOT_ORE },
      OBSIDIAN_ROBOT: { ore: OBSIDIAN_ROBOT_ORE, clay: OBSIDIAN_ROBOT_CLAY },
      GEODE_ROBOT: { ore: GEODE_ROBOT_ORE, obsidian: GEODE_ROBOT_OBSIDIAN },
    });
  }

  // CONSTANTS TO AVOID STRING TYPOS
  const ORE = 'ORE';
  const CLAY = 'CLAY';
  const OBSIDIAN = 'OBSIDIAN';
  const GEODE = 'GEODE';

  // MAIN DRIVER FUNCTION
  function analyze(TIME_LIMIT, BLUEPRINTS_TO_BE_EXAMINED) {

    const TIME_AT_START = Date.now();
                      
    const BLUEPRINT_RESULTS = Array(BLUEPRINTS).fill(null);

    for (let b = 1; b <= BLUEPRINTS_TO_BE_EXAMINED; ++b) {                                      // iterate through all blueprints

      if (DISPLAY_EXTRA_INFO) console.log('> NOW ANALYZING BLUEPRINT:', b);                     // indicates activity while code is running
      const TIME_START_BLUEPRINT = Date.now();
      let NEXT_MIN_TARGET = 1;

      const COSTS = BLUEPRINTS[b - 1];

      // NOTE: IMPORTANT OPTIMIZATION. IF YOU HAVE ENOUGH OBSIDIAN ROBOTS SUCH THAT EVERY DAY YOU ARE GETTING A YIELD EQUAL TO
      // THE OBSIDIAN COST OF A GEODE ROBOT (THE ONLY THING THAT COSTS OBSIDIAN), YOU ARE ALREADY AT THE MAX NUMBER OF OBSIDIAN
      // ROBOTS YOU SHOULD BUY. THERE IS NO NEED TO BUY MORE.
      //
      // THE SAME LOGIC APPLIES TO CLAY ROBOTS. THERE WILL NEVER BE A NEED TO GENERATE MORE CLAY YIELD PER DAY THAN THE CLAY REQUIRED
      // TO BUY AN OBSIDIAN ROBOT.
      //
      // ONCE THE ORE -> CLAY -> OBSIDIAN 'PIPELINE' IS NO LONGER NECESSARY, THEN THE ONLY FURTHER PURPOSE OF ORE WOULD BE TO BUY
      // GEODE ROBOTS. IF THE NUMBER OF ORE ROBOTS EQUALS THE ORE COST OF A GEODE ROBOT AT THAT POINT, THERE WOULD BE NO NEED TO BUY MORE.
      const MAX_OBSIDIAN_ROBOTS = COSTS.GEODE_ROBOT.obsidian;
      const MAX_CLAY_ROBOTS = COSTS.OBSIDIAN_ROBOT.clay;
      const MAX_ORE_ROBOTS = COSTS.GEODE_ROBOT.ore;

      // NOTE: STATE CONSISTS OF: day, amount of each of the four resources (include 'geodes'), and amount of each of the four robot types
      const STARTING_STATE = [ 0, 0, 0, 0, 1, 0, 0, 0 ];                                        // i.e. you start with 1 ore robot and nothing else
      const MEMO = Array.from({length: TIME_LIMIT + 1}, () => ({}));
      
      let BEST_GEODES = 0;                                                                      // tracker variable to access best geode result so far

      // HELPER FUNCTION
      function DFS( day,
                    TODAY_ORE,                                                                  // amount of resources at the start of the day
                    TODAY_CLAY,
                    TODAY_OBSIDIAN,
                    TODAY_GEODES,
                    TODAY_ORE_ROBOTS,
                    TODAY_CLAY_ROBOTS,
                    TODAY_OBSIDIAN_ROBOTS,
                    TODAY_GEODE_ROBOTS) {
        
        if (DISPLAY_EXTRA_INFO
            && Math.floor((Date.now() - TIME_START_BLUEPRINT)/(1000*60)) === NEXT_MIN_TARGET)
        {
          console.log(`... ${
            NEXT_MIN_TARGET
            } mins have passed since beginning this blueprint`);
          console.log(`... ${
            Math.floor((Date.now() - TIME_AT_START)/(1000*60))
            } mins have passed since beginning this run`);
          ++NEXT_MIN_TARGET;
        }

        if (day > TIME_LIMIT) return 0;                                                         // if DFS gets called past TIME_LIMIT, return 0
                                                                                                // to indicate a 'dead' branch

        if (day === TIME_LIMIT) {                                                               // BASE CASE: AT TIME LIMIT
          BEST_GEODES = Math.max(BEST_GEODES, TODAY_GEODES);
          return TODAY_GEODES;
        }

        const STATE = [
          TODAY_ORE,
          TODAY_CLAY,
          TODAY_OBSIDIAN,
          TODAY_GEODES,
          TODAY_ORE_ROBOTS,
          TODAY_CLAY_ROBOTS,
          TODAY_OBSIDIAN_ROBOTS,
          TODAY_GEODE_ROBOTS
        ];
        const SERIAL = STATE.join(',')


        // NOTE: IMPORTANT OPTIMIZATION. WE CHECK IF WE COULD MAGICALLY GUARANTEE THAT WE BUY A GEODE ROBOT EVERY DAY FOR THE
        // REST OF THE SIMULATION, STARTING NOW, THAT WOULD STILL NOT GENERATE ENOUGH GEODES COMPARED TO A PREVIOUSLY KNOWN VALUE.
        // IF THIS HAPPENS WE CAN PRUNE THIS BRANCH.
        const CANNOT_GET_ENOUGH_GEODES = TODAY_GEODES
                                          + ((TIME_LIMIT - day) * TODAY_GEODE_ROBOTS)
                                          + ((TIME_LIMIT - day - 1) * (TIME_LIMIT - day) / 2)
                                            <= BEST_GEODES;
        if (CANNOT_GET_ENOUGH_GEODES) MEMO[day][SERIAL] = 0;


        // TNOTE: these booleans make it very easy to reason through the decision tree
        const NO_MORE_OBSIDIAN_ROBOTS = TODAY_OBSIDIAN_ROBOTS >= MAX_OBSIDIAN_ROBOTS;
        const NO_MORE_CLAY_ROBOTS = NO_MORE_OBSIDIAN_ROBOTS || TODAY_CLAY_ROBOTS >= MAX_CLAY_ROBOTS;
        const NO_MORE_ORE_ROBOTS = NO_MORE_OBSIDIAN_ROBOTS && TODAY_ORE_ROBOTS >= MAX_ORE_ROBOTS;

        if (!(SERIAL in MEMO[day])) {

          // NOTE: INSTEAD OF SIMULATING EACH INDIVIDUAL DAY, THE OPTIMIZATION HEURISTIC WE USE HERE IS TO RECOGNIZE THAT
          // EVERY TIME WE RUN THE DFS FUNCTION, WE HAVE A CHOICE TO MAKE: WHICH ROBOT, IF ANY, WILL BE THE ONE WE BUY NEXT
          // (WHETHER IMMEDIATELY OR AFTER A FEW DAYS)? NOTE THAT WE SHOULD BUY THIS ROBOT AS SOON AS IT IS POSSIBLE TO DO SO.
          // FURTHERMORE WE CAN, BY DEFINITION, ASSERT THAT THERE ARE NO OTHER CHANGES TO THE ROBOT COUNT UNTIL THE NEXT ROBOT IS
          // PURCHASED.

          function GET_DAYS_TO_WAIT(NEXT_ROBOT) {
            switch (NEXT_ROBOT) {
              case GEODE:
                return Math.max(
                  TODAY_ORE >= COSTS.GEODE_ROBOT.ore
                    ? 0
                    : Math.ceil((COSTS.GEODE_ROBOT.ore - TODAY_ORE) / TODAY_ORE_ROBOTS),
                  TODAY_OBSIDIAN >= COSTS.GEODE_ROBOT.obsidian
                    ? 0
                    : Math.ceil((COSTS.GEODE_ROBOT.obsidian - TODAY_OBSIDIAN) / TODAY_OBSIDIAN_ROBOTS)
                );

              case OBSIDIAN:
                return Math.max(
                  TODAY_ORE >= COSTS.OBSIDIAN_ROBOT.ore
                    ? 0
                    : Math.ceil((COSTS.OBSIDIAN_ROBOT.ore - TODAY_ORE) / TODAY_ORE_ROBOTS),
                  TODAY_CLAY >= COSTS.OBSIDIAN_ROBOT.clay
                    ? 0
                    : Math.ceil((COSTS.OBSIDIAN_ROBOT.clay - TODAY_CLAY) / TODAY_CLAY_ROBOTS)
                );

              case CLAY:
                return TODAY_ORE >= COSTS.CLAY_ROBOT.ore
                  ? 0
                  : Math.ceil((COSTS.CLAY_ROBOT.ore - TODAY_ORE) / TODAY_ORE_ROBOTS);

              case ORE:
                return TODAY_ORE >= COSTS.ORE_ROBOT.ore
                  ? 0
                  : Math.ceil((COSTS.ORE_ROBOT.ore - TODAY_ORE) / TODAY_ORE_ROBOTS);

              default:
                throw 'ERROR: INVALID ROBOT TYPE';
            }
          }

          const DAYS_TO_WAIT_FOR_GEODE_ROBOT = GET_DAYS_TO_WAIT(GEODE);
          const DAYS_TO_WAIT_FOR_OBSIDIAN_ROBOT = GET_DAYS_TO_WAIT(OBSIDIAN);
          const DAYS_TO_WAIT_FOR_CLAY_ROBOT = GET_DAYS_TO_WAIT(CLAY);
          const DAYS_TO_WAIT_FOR_ORE_ROBOT = GET_DAYS_TO_WAIT(ORE);

          // NOTE: ANOTHER IMPORTANT OPTIMIZATION IS THAT WE *THROW AWAY EXTRA RESOURCES* THAT WE DON'T NEED, IN HOPES OF REDUCING
          // UNNECESSARY VARIATION TO STATES, AND INCREASING THE LIKELIHOOD OF GETTING A CACHE HIT ON THE MEMO.
          
          // NOTE ALSO THAT IT SEEMS (THOUGH I AM NOT ENTIRELY SURE) THAT IT IS BETTER TO RECURSE WITH THE MOST AGGRESSIVE BUYING STRATEGY
          // FIRST BEFORE THE OTHERS, BECAUSE I BELIEVE IT WILL RESULT IN MORE CACHE HITS (WHICH IS TIME SAVED).

          const BUY_GEODE_ROBOT = DFS(day + (DAYS_TO_WAIT_FOR_GEODE_ROBOT + 1),
                                      NO_MORE_ORE_ROBOTS      ? MAX_ORE_ROBOTS                                                    // max useful # ore robots
                                                              : TODAY_ORE
                                                                  + (DAYS_TO_WAIT_FOR_GEODE_ROBOT + 1) * TODAY_ORE_ROBOTS
                                                                  - COSTS.GEODE_ROBOT.ore,
                                      NO_MORE_CLAY_ROBOTS     ? 0                                                                 // throw away extra clay
                                                              : TODAY_CLAY
                                                                  + (DAYS_TO_WAIT_FOR_GEODE_ROBOT + 1) * TODAY_CLAY_ROBOTS,
                                      NO_MORE_OBSIDIAN_ROBOTS ? MAX_OBSIDIAN_ROBOTS                                               // max useful # obsidian robots
                                                              : TODAY_OBSIDIAN
                                                                  + (DAYS_TO_WAIT_FOR_GEODE_ROBOT + 1) * TODAY_OBSIDIAN_ROBOTS
                                                                  - COSTS.GEODE_ROBOT.obsidian,
                                      TODAY_GEODES
                                        + (DAYS_TO_WAIT_FOR_GEODE_ROBOT + 1) * TODAY_GEODE_ROBOTS,
                                      TODAY_ORE_ROBOTS,
                                      TODAY_CLAY_ROBOTS,
                                      TODAY_OBSIDIAN_ROBOTS,
                                      TODAY_GEODE_ROBOTS + 1);

          const BUY_OBSIDIAN_ROBOT = NO_MORE_OBSIDIAN_ROBOTS
                                      ? 0
                                      : DFS(day + (DAYS_TO_WAIT_FOR_OBSIDIAN_ROBOT + 1),
                                            TODAY_ORE
                                              + (DAYS_TO_WAIT_FOR_OBSIDIAN_ROBOT + 1) * TODAY_ORE_ROBOTS
                                              - COSTS.OBSIDIAN_ROBOT.ore,
                                            TODAY_CLAY
                                              + (DAYS_TO_WAIT_FOR_OBSIDIAN_ROBOT + 1) * TODAY_CLAY_ROBOTS
                                              - COSTS.OBSIDIAN_ROBOT.clay,
                                            TODAY_OBSIDIAN
                                              + (DAYS_TO_WAIT_FOR_OBSIDIAN_ROBOT + 1) * TODAY_OBSIDIAN_ROBOTS,
                                            TODAY_GEODES
                                              + (DAYS_TO_WAIT_FOR_OBSIDIAN_ROBOT + 1) * TODAY_GEODE_ROBOTS,
                                            TODAY_ORE_ROBOTS,
                                            TODAY_CLAY_ROBOTS,
                                            TODAY_OBSIDIAN_ROBOTS + 1,
                                            TODAY_GEODE_ROBOTS);

          const BUY_CLAY_ROBOT = NO_MORE_CLAY_ROBOTS
                                  ? 0
                                  : DFS(day + (DAYS_TO_WAIT_FOR_CLAY_ROBOT + 1),
                                        TODAY_ORE
                                          + (DAYS_TO_WAIT_FOR_CLAY_ROBOT + 1) * TODAY_ORE_ROBOTS
                                          - COSTS.CLAY_ROBOT.ore,
                                        TODAY_CLAY
                                          + (DAYS_TO_WAIT_FOR_CLAY_ROBOT + 1) * TODAY_CLAY_ROBOTS,
                                        TODAY_OBSIDIAN
                                          + (DAYS_TO_WAIT_FOR_CLAY_ROBOT + 1) * TODAY_OBSIDIAN_ROBOTS,
                                        TODAY_GEODES
                                          + (DAYS_TO_WAIT_FOR_CLAY_ROBOT + 1) * TODAY_GEODE_ROBOTS,
                                        TODAY_ORE_ROBOTS,
                                        TODAY_CLAY_ROBOTS + 1,
                                        TODAY_OBSIDIAN_ROBOTS,
                                        TODAY_GEODE_ROBOTS);

          const BUY_ORE_ROBOT = NO_MORE_ORE_ROBOTS
                                  ? 0
                                  : DFS(day + (DAYS_TO_WAIT_FOR_ORE_ROBOT + 1),
                                        TODAY_ORE
                                          + (DAYS_TO_WAIT_FOR_ORE_ROBOT + 1) * TODAY_ORE_ROBOTS
                                          - COSTS.ORE_ROBOT.ore,
                                        NO_MORE_CLAY_ROBOTS     ? 0
                                                                : TODAY_CLAY
                                                                    + (DAYS_TO_WAIT_FOR_ORE_ROBOT + 1) * TODAY_CLAY_ROBOTS,
                                        NO_MORE_OBSIDIAN_ROBOTS ? MAX_OBSIDIAN_ROBOTS
                                                                : TODAY_OBSIDIAN
                                                                    + (DAYS_TO_WAIT_FOR_ORE_ROBOT + 1) * TODAY_OBSIDIAN_ROBOTS,
                                        TODAY_GEODES
                                          + (DAYS_TO_WAIT_FOR_ORE_ROBOT + 1) * TODAY_GEODE_ROBOTS,
                                        TODAY_ORE_ROBOTS + 1,
                                        TODAY_CLAY_ROBOTS,
                                        TODAY_OBSIDIAN_ROBOTS,
                                        TODAY_GEODE_ROBOTS);

          const BUY_NOTHING = TODAY_GEODES + TODAY_GEODE_ROBOTS * (TIME_LIMIT - day);           // calculate total geode yield based on geode robots owned today

          // THERE ARE ONLY 5 THINGS YOU CAN DO: CHOOSE THE ROBOT TYPE YOU WILL BUY NEXT BEFORE ANY OTHERS, OR COMMIT TO NEVER BUY ANOTHER ROBOT

          MEMO[day][SERIAL] = Math.max( BUY_GEODE_ROBOT, BUY_OBSIDIAN_ROBOT, BUY_CLAY_ROBOT, BUY_ORE_ROBOT, BUY_NOTHING );
        }

        BEST_GEODES = Math.max(BEST_GEODES, MEMO[day][SERIAL]);
        return MEMO[day][SERIAL];
      }
      
      DFS(0, ...STARTING_STATE);                                                                // kick-start recursion. note that it should return
                                                                                                // the highest geode count, but the tracker variable
                                                                                                // BEST_GEODES also does the same. this variable is
                                                                                                // necessary for the DFS to be able to check against
                                                                                                // best results so far, as a pruning optimization.
      BLUEPRINT_RESULTS[b - 1] = BEST_GEODES;

      if (DISPLAY_EXTRA_INFO) {
        console.log('BEST_GEODES:', BEST_GEODES);
        console.log(`(BLUEPRINT TOOK ${(Date.now() - TIME_START_BLUEPRINT)/1000} SECS)`);
        console.log('');
      }
    }

    console.log(`(ENTIRE RUN TOOK ${(Date.now() - TIME_AT_START)/1000} SECS)`)
    return BLUEPRINT_RESULTS;
  }

  // ANALYZE
  if (part === 1) {                                                                             // PART 1: 24 DAYS, FULL BLUEPRINT LIST

    return analyze(24, BLUEPRINTS.length)
            .reduce((output, geodes, i) => output += (geodes * (i + 1)), 0);                    // take the sum of the values multiplied by their 1-index
    
  } else {                                                                                      // PART 2: 32 DAYS, FIRST 3 BLUEPRINTS ONLY
    
    return analyze(32, Math.min(BLUEPRINTS.length, 3))                                          // the sample data only has 2 blueprints, so use Math.min
            .reduce((output, geodes) => output *= geodes, 1);                                   // just take the product of the values

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = optimizeResourceChain;
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
`Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  // DEBUG: true,
};
expected = 33;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 2160;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 56 * 62;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 13340;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);