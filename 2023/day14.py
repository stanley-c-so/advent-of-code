"""

--- Day 14: Parabolic Reflector Dish ---

You reach the place where all of the mirrors were pointing: a massive parabolic reflector dish attached to the side of another large mountain.

The dish is made up of many small mirrors, but while the mirrors themselves are roughly in the shape of a parabolic reflector dish, each individual mirror seems to be pointing in slightly the wrong direction. If the dish is meant to focus light, all it's doing right now is sending it in a vague direction.

This system must be what provides the energy for the lava! If you focus the reflector dish, maybe you can go where it's pointing and use the light to fix the lava production.

Upon closer inspection, the individual mirrors each appear to be connected via an elaborate system of ropes and pulleys to a large metal platform below the dish. The platform is covered in large rocks of various shapes. Depending on their position, the weight of the rocks deforms the platform, and the shape of the platform controls which ropes move and ultimately the focus of the dish.

In short: if you move the rocks, you can focus the dish. The platform even has a control panel on the side that lets you tilt it in one of four directions! The rounded rocks (O) will roll when the platform is tilted, while the cube-shaped rocks (#) will stay in place. You note the positions of all of the empty spaces (.) and rocks (your puzzle input). For example:

O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....

Start by tilting the lever so all of the rocks will slide north as far as they will go:

OOOO.#.O..
OO..#....#
OO..O##..O
O..#.OO...
........#.
..#....#.#
..O..#.O.O
..O.......
#....###..
#....#....

You notice that the support beams along the north side of the platform are damaged; to ensure the platform doesn't collapse, you should calculate the total load on the north support beams.

The amount of load caused by a single rounded rock (O) is equal to the number of rows from the rock to the south edge of the platform, including the row the rock is on. (Cube-shaped rocks (#) don't contribute to load.) So, the amount of load caused by each rock in each row is as follows:

OOOO.#.O.. 10
OO..#....#  9
OO..O##..O  8
O..#.OO...  7
........#.  6
..#....#.#  5
..O..#.O.O  4
..O.......  3
#....###..  2
#....#....  1

The total load is the sum of the load caused by all of the rounded rocks. In this example, the total load is 136.

Tilt the platform so that the rounded rocks all roll north. Afterward, what is the total load on the north support beams?


--- Part Two ---

The parabolic reflector dish deforms, but not in a way that focuses the beam. To do that, you'll need to move the rocks to the edges of the platform. Fortunately, a button on the side of the control panel labeled "spin cycle" attempts to do just that!

Each cycle tilts the platform four times so that the rounded rocks roll north, then west, then south, then east. After each tilt, the rounded rocks roll as far as they can before the platform tilts in the next direction. After one cycle, the platform will have finished rolling the rounded rocks in those four directions in that order.

Here's what happens in the example above after each of the first few cycles:

After 1 cycle:
.....#....
....#...O#
...OO##...
.OO#......
.....OOO#.
.O#...O#.#
....O#....
......OOOO
#...O###..
#..OO#....

After 2 cycles:
.....#....
....#...O#
.....##...
..O#......
.....OOO#.
.O#...O#.#
....O#...O
.......OOO
#..OO###..
#.OOO#...O

After 3 cycles:
.....#....
....#...O#
.....##...
..O#......
.....OOO#.
.O#...O#.#
....O#...O
.......OOO
#...O###.O
#.OOO#...O

This process should work if you leave it running long enough, but you're still worried about the north support beams. To make sure they'll survive for a while, you need to calculate the total load on the north support beams after 1000000000 cycles.

In the above example, after 1000000000 cycles, the total load on the north support beams is 64.

Run the spin cycle for 1000000000 cycles. Afterward, what is the total load on the north support beams?


"""

# LIBRARIES
import time
import pathlib
import os
from math import *
from functools import *
from sys import *
from collections import *

# MODULES
from _test import test

# OPTIONAL VARIABLES
DISPLAY_EXTRA_INFO = True
# DISPLAY_EXTRA_INFO = False

def roll_rocks_in_cardinal_direction(part, input_str, DEBUG = False):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  MAP = [ [ c for c in line ] for line in input_arr ]


  # DATA STRUCTURES

  MEMO = {}                                                               # keys are serialized positions, vals are the index of first appearance
  LOAD_VALUE = {}                                                                # keys are indices, vals are load values


  # CONSTANTS

  H, W = len(MAP), len(MAP[0])
  ROCK, CUBE, EMPTY = 'O', '#', '.'
  n, e, s, w = 'N', 'E', 'S', 'W'                                         # CAREFUL! W (capital) is already being used

  PARAMS = {
    n: {
      'r_range': range(1, H),
      'c_range': range(W),
      'deltas': (-1, 0),
    },
    w: {
      'r_range': range(H),
      'c_range': range(1, W),
      'deltas': (0, -1),
    },
    s: {
      'r_range': range(H - 1, -1, -1),
      'c_range': range(W),
      'deltas': (+1, 0),
    },
    e: {
      'r_range': range(H),
      'c_range': range(W - 1, -1, -1),
      'deltas': (0, +1),
    },
  }


  # HELPER FUNCTIONS

  def roll(dir):

    assert dir in (n, w, e, s)
    params = PARAMS[dir]

    for r in params['r_range']:                                           # iterate through the relevant rows...
      for c in params['c_range']:                                         # ...and cols...
        if MAP[r][c] == ROCK:
          dy, dx = params['deltas']                                       # (of course, one of these will be 0)
          new_r, new_c = r, c                                             # new_r, new_c represents potential destination to which a rock will roll
          while 0 <= (new_r + dy) < H \
                and 0 <= (new_c + dx) < H \
                and MAP[new_r + dy][new_c + dx] == EMPTY:                 # check if destination would be in bounds and empty
            new_r += dy
            new_c += dx
          MAP[r][c] = EMPTY                                               # once the while loop is done, empty the original rock location...
          MAP[new_r][new_c] = ROCK                                        # ...and place the rock at the new location (which may be the same location)

  def serialize():
    return ''.join([ ''.join(row) for row in MAP ])                       # convert entire board position into one big string

  def roll_cycle(i):

    if DEBUG and 0 < i <= 3 and DISPLAY_EXTRA_INFO:                       # for part 2 sample test, show the results after the first 3 cycles
      print(f"MAP AFTER {i} CYCLE(S):")
      for row in MAP:
        print(''.join(row))
      print('')

    # Check for repeated position
    serial = serialize()
    if serial in MEMO:
      return (True, serial)                                               # output[0] is whether a cycle was found; output[1] is the serialized board position

    # Cache current position
    MEMO[serial] = i
    LOAD_VALUE[i] = get_load()

    # Perform spin cycle, then return False to finish the iteration
    roll(n)
    roll(w)
    roll(s)
    roll(e)
    return (False, serial)

  def get_load():
    output = 0
    for r in range(H):
      output += sum(map(lambda x: (H - r) if x == ROCK else 0, MAP[r]))
    return output


  # ANALYZE

  TIME_AT_START = time.time()

  if part == 1:                                                           # PART 1: DO A SINGLE ROLL NORTH

    roll(n)
    return get_load()

  else:                                                                   # PART 2: DO 1,000,000,000 FULL CYCLES (n, w, s, e)

    if not DEBUG: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

    NUM_CYCLES = 1000000000
    output = None
    for i in range(NUM_CYCLES):
      found_cycle, serial = roll_cycle(i)
      if found_cycle:
        period = i - MEMO[serial]
        initial_lead = MEMO[serial]
        MOD = (NUM_CYCLES - initial_lead) % period
        output = LOAD_VALUE[initial_lead + MOD]
        if DISPLAY_EXTRA_INFO:
          print(f"Current position after {i} rolls (i.e. before the roll on i == {i}) is a repeat of same on i == {MEMO[serial]}.")
          print(f"Therefore, period is {i} - {MEMO[serial]} = {period}.")
          print(f"The first {initial_lead} cycles, before the first occurrence of the repeated position, is not part of the loop.")
          print(f"After the initial lead of {initial_lead}, if we skip all segments of {period}, a remainder of {MOD} will be left over before we reach {NUM_CYCLES}.")
          print(f"Thus, the result after {NUM_CYCLES} cycles is equal to the result after only {initial_lead} + {MOD} = {initial_lead + MOD} cycles.")
          print(f"Therefore, the answer is equal to the result at i == {initial_lead + MOD}.")
          print(f"LOAD_VALUE[{initial_lead + MOD}] == {output}.")
        break

    assert output

    if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
    return output


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = roll_rocks_in_cardinal_direction
skipped_tests = set([ 2, 3, 4 ])
skipped_tests = set([ 3, 4 ])
skipped_tests = set([ 4 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{DAY_NUM}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#...."""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 136
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 112048
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 64
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 105606
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)