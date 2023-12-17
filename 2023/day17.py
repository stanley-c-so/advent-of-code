"""

--- Day 17: Clumsy Crucible ---

The lava starts flowing rapidly once the Lava Production Facility is operational. As you leave, the reindeer offers you a parachute, allowing you to quickly reach Gear Island.

As you descend, your bird's-eye view of Gear Island reveals why you had trouble finding anyone on your way up: half of Gear Island is empty, but the half below you is a giant factory city!

You land near the gradually-filling pool of lava at the base of your new lavafall. Lavaducts will eventually carry the lava throughout the city, but to make use of it immediately, Elves are loading it into large crucibles on wheels.

The crucibles are top-heavy and pushed by hand. Unfortunately, the crucibles become very difficult to steer at high speeds, and so it can be hard to go in a straight line for very long.

To get Desert Island the machine parts it needs as soon as possible, you'll need to find the best way to get the crucible from the lava pool to the machine parts factory. To do this, you need to minimize heat loss while choosing a route that doesn't require the crucible to go in a straight line for too long.

Fortunately, the Elves here have a map (your puzzle input) that uses traffic patterns, ambient temperature, and hundreds of other parameters to calculate exactly how much heat loss can be expected for a crucible entering any particular city block.

For example:

2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533

Each city block is marked by a single digit that represents the amount of heat loss if the crucible enters that block. The starting point, the lava pool, is the top-left city block; the destination, the machine parts factory, is the bottom-right city block. (Because you already start in the top-left block, you don't incur that block's heat loss unless you leave that block and then return to it.)

Because it is difficult to keep the top-heavy crucible going in a straight line for very long, it can move at most three blocks in a single direction before it must turn 90 degrees left or right. The crucible also can't reverse direction; after entering each city block, it may only turn left, continue straight, or turn right.

One way to minimize heat loss is this path:

2>>34^>>>1323
32v>>>35v5623
32552456v>>54
3446585845v52
4546657867v>6
14385987984v4
44578769877v6
36378779796v>
465496798688v
456467998645v
12246868655<v
25465488877v5
43226746555v>

This path never moves more than three consecutive blocks in the same direction and incurs a heat loss of only 102.

Directing the crucible from the lava pool to the machine parts factory, but not moving more than three consecutive blocks in the same direction, what is the least heat loss it can incur?


--- Part Two ---

The crucibles of lava simply aren't large enough to provide an adequate supply of lava to the machine parts factory. Instead, the Elves are going to upgrade to ultra crucibles.

Ultra crucibles are even more difficult to steer than normal crucibles. Not only do they have trouble going in a straight line, but they also have trouble turning!

Once an ultra crucible starts moving in a direction, it needs to move a minimum of four blocks in that direction before it can turn (or even before it can stop at the end). However, it will eventually start to get wobbly: an ultra crucible can move a maximum of ten consecutive blocks without turning.

In the above example, an ultra crucible could follow this path to minimize heat loss:

2>>>>>>>>1323
32154535v5623
32552456v4254
34465858v5452
45466578v>>>>
143859879845v
445787698776v
363787797965v
465496798688v
456467998645v
122468686556v
254654888773v
432267465553v

In the above example, an ultra crucible would incur the minimum possible heat loss of 94.

Here's another example:

111111111111
999999999991
999999999991
999999999991
999999999991

Sadly, an ultra crucible would need to take an unfortunate path like this one:

1>>>>>>>1111
9999999v9991
9999999v9991
9999999v9991
9999999v>>>>

This route causes the ultra crucible to incur the minimum possible heat loss of 71.

Directing the ultra crucible from the lava pool to the machine parts factory, what is the least heat loss it can incur?


"""

# LIBRARIES
import time
import pathlib
import os
from math import *
from functools import *
from sys import *
from collections import *
from queue import *

# MODULES
from _test import test

# OPTIONAL VARIABLES
DISPLAY_EXTRA_INFO = True
# DISPLAY_EXTRA_INFO = False

def dijkstra_with_movement_streak_restrictions(part, input_str, DEBUG = False):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  MAP = [ [ int(n) for n in row ] for row in input_arr ]


  # CONSTANTS

  H, W = len(MAP), len(MAP[0])

  U, D, L, R = 'U', 'D', 'L', 'R'

  DELTAS = {
    U: (-1, 0),
    D: (+1, 0),
    L: (0, -1),
    R: (0, +1),
  }

  TURN_LEFT = {
    U: L,
    D: R,
    L: D,
    R: U,
  }

  TURN_RIGHT = {
    U: R,
    D: L,
    L: U,
    R: D,
  }

  MAX_STREAK = 3 if part == 1 else 10                                                   # PART 1: MUST TURN AFTER STREAK 3
                                                                                        # PART 2: MUST TURN AFTER STREAK 10

  MIN_STREAK = 1 if part == 1 else 4                                                    # PART 1: NO MINIMUM STREAK - CAN STOP ANY TIME
                                                                                        # PART 2: STREAK MUST BE AT LEAST 4 TO STOP


  # DATA STRUCTURE

  MEMO = {}                                                                             # keys are states which include (r, c, direction, streak)
                                                                                        # values are the lowest heat_loss to reach that state


  # HELPER FUNCTION

  def process(PQ, new_dir, heat_loss, new_streak, prev_state):
    dy, dx = DELTAS[new_dir]
    new_r, new_c = r + dy, c + dx
    if 0 <= new_r < H and 0 <= new_c < W:
      PQ.put(
        (
          heat_loss + MAP[new_r][new_c],                                                # priority: heat_loss to reach coords
          (new_r, new_c, new_dir, new_streak, prev_state)                               # data: state (r, c, direction, streak), AND prev_state
        )
      )


  # INIT

  PQ = PriorityQueue()
  PQ.put( (0, (0, 0, D, 0, None)) )                                                     # try both starting by moving down...
  PQ.put( (0, (0, 0, R, 0, None)) )                                                     # ...as well as by moving right

  min_heat_loss = float('inf')
  min_heat_loss_state = None                                                            # NOTE: this is only required for printing diagram


  # ANALYZE

  TIME_AT_START = time.time()
  if not DEBUG: print('RUNNING REAL DATA ANALYSIS (PLEASE WAIT)...')

  while not PQ.empty():

    # Extract data
    (heat_loss, data) = PQ.get()
    r, c, direction, streak, prev_state = data                                          # NOTE: prev_state is only required for printing diagram
    state = r, c, direction, streak

    # Memo - serialized state includes: coords, direction, and streak
    if streak:                                                                          # the first node is the only time when streak == 0
      if state not in MEMO:
        MEMO[state] = { 'heat_loss': float('inf'), 'prev_state': None }
      if MEMO[state]['heat_loss'] <= heat_loss: continue                                # if heat_loss is not better than memo, discontinue
      MEMO[state]['heat_loss'] = heat_loss                                              # else, save new record
      MEMO[state]['prev_state'] = prev_state                                            # (also save prev_state if you want to print diagram)

    # If reached end, update min_heat_loss
    if (r == H - 1 and c == W - 1) and (streak >= MIN_STREAK):                          # PART 2: THERE IS A MINIMUM STREAK BEFORE YOU CAN STOP

      if heat_loss < min_heat_loss:
        min_heat_loss = heat_loss
        min_heat_loss_state = state

    # Else, consider the next move
    else:

      # Turn left
      if streak >= MIN_STREAK:                                                          # PART 2: THERE IS A MINIMUM STREAK BEFORE YOU CAN TURN
        process(PQ, TURN_LEFT[direction], heat_loss, 1, state)                          # since you're turning, reset the streak to 1

      # Turn right
      if streak >= MIN_STREAK:                                                          # PART 2: THERE IS A MINIMUM STREAK BEFORE YOU CAN TURN
        process(PQ, TURN_RIGHT[direction], heat_loss, 1, state)                         # since you're turning, reset the streak to 1

      # Go straight
      if streak < MAX_STREAK:                                                           # can't go straight if you're at maximum streak
        process(PQ, direction, heat_loss, streak + 1, state)                            # increment the streak

  if DISPLAY_EXTRA_INFO:
    r, c, direction, streak = min_heat_loss_state
    path = [ (r, c, direction) ]
    while not (r == 0 and c == 0):
      r, c, direction, streak = MEMO[(r, c, direction, streak)]['prev_state']
      path.append((r, c, direction))
    ARROWS = { U: '^', D: 'v', L: '<', R: '>' }
    for (r, c, direction) in path:
      MAP[r][c] = ARROWS[direction]
    for row in MAP:
      row_to_print = []
      for c in row:
        if type(c) == type(1):
          row_to_print.append(str(c))
        else:
          row_to_print.append( '\033[93m' + c + '\033[0m' )
      print(''.join(row_to_print))
    print('')

  if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
  return min_heat_loss


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = dijkstra_with_movement_streak_restrictions
skipped_tests = set([ 2, 3, 4, 5 ])
skipped_tests = set([ 3, 4, 5 ])
skipped_tests = set([ 4, 5 ])
skipped_tests = set([ 5 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{DAY_NUM}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533"""

sample_input2 = """111111111111
999999999991
999999999991
999999999991
999999999991"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 102
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 963
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 94
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = 71
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 5
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 1178
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)