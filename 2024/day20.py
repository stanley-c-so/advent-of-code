"""

--- Day 20: Race Condition ---

The Historians are quite pixelated again. This time, a massive, black building looms over you - you're right outside the CPU!

While The Historians get to work, a nearby program sees that you're idle and challenges you to a race. Apparently, you've arrived just in time for the frequently-held race condition festival!

The race takes place on a particularly long and twisting code path; programs compete to see who can finish in the fewest picoseconds. The winner even gets their very own mutex!

They hand you a map of the racetrack (your puzzle input). For example:

###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
The map consists of track (.) - including the start (S) and end (E) positions (both of which also count as track) - and walls (#).

When a program runs through the racetrack, it starts at the start position. Then, it is allowed to move up, down, left, or right; each such move takes 1 picosecond. The goal is to reach the end position as quickly as possible. In this example racetrack, the fastest time is 84 picoseconds.

Because there is only a single path from the start to the end and the programs all go the same speed, the races used to be pretty boring. To make things more interesting, they introduced a new rule to the races: programs are allowed to cheat.

The rules for cheating are very strict. Exactly once during a race, a program may disable collision for up to 2 picoseconds. This allows the program to pass through walls as if they were regular track. At the end of the cheat, the program must be back on normal track again; otherwise, it will receive a segmentation fault and get disqualified.

So, a program could complete the course in 72 picoseconds (saving 12 picoseconds) by cheating for the two moves marked 1 and 2:

###############
#...#...12....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
Or, a program could complete the course in 64 picoseconds (saving 20 picoseconds) by cheating for the two moves marked 1 and 2:

###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...12..#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
This cheat saves 38 picoseconds:

###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.####1##.###
#...###.2.#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
This cheat saves 64 picoseconds and takes the program directly to the end:

###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..21...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
Each cheat has a distinct start position (the position where the cheat is activated, just before the first move that is allowed to go through walls) and end position; cheats are uniquely identified by their start position and end position.

In this example, the total number of cheats (grouped by the amount of time they save) are as follows:

There are 14 cheats that save 2 picoseconds.
There are 14 cheats that save 4 picoseconds.
There are 2 cheats that save 6 picoseconds.
There are 4 cheats that save 8 picoseconds.
There are 2 cheats that save 10 picoseconds.
There are 3 cheats that save 12 picoseconds.
There is one cheat that saves 20 picoseconds.
There is one cheat that saves 36 picoseconds.
There is one cheat that saves 38 picoseconds.
There is one cheat that saves 40 picoseconds.
There is one cheat that saves 64 picoseconds.
You aren't sure what the conditions of the racetrack will be like, so to give yourself as many options as possible, you'll need a list of the best cheats. How many cheats would save you at least 100 picoseconds?


--- Part Two ---

The programs seem perplexed by your list of cheats. Apparently, the two-picosecond cheating rule was deprecated several milliseconds ago! The latest version of the cheating rule permits a single cheat that instead lasts at most 20 picoseconds.

Now, in addition to all the cheats that were possible in just two picoseconds, many more cheats are possible. This six-picosecond cheat saves 76 picoseconds:

###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#1#####.#.#.###
#2#####.#.#...#
#3#####.#.###.#
#456.E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
Because this cheat has the same start and end positions as the one above, it's the same cheat, even though the path taken during the cheat is different:

###############
#...#...#.....#
#.#.#.#.#.###.#
#S12..#.#.#...#
###3###.#.#.###
###4###.#.#...#
###5###.#.###.#
###6.E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
Cheats don't need to use all 20 picoseconds; cheats can last any amount of time up to and including 20 picoseconds (but can still only end when the program is on normal track). Any cheat time not used is lost; it can't be saved for another cheat later.

You'll still need a list of the best cheats, but now there are even more to choose between. Here are the quantities of cheats in this example that save 50 picoseconds or more:

There are 32 cheats that save 50 picoseconds.
There are 31 cheats that save 52 picoseconds.
There are 29 cheats that save 54 picoseconds.
There are 39 cheats that save 56 picoseconds.
There are 25 cheats that save 58 picoseconds.
There are 23 cheats that save 60 picoseconds.
There are 20 cheats that save 62 picoseconds.
There are 19 cheats that save 64 picoseconds.
There are 12 cheats that save 66 picoseconds.
There are 14 cheats that save 68 picoseconds.
There are 12 cheats that save 70 picoseconds.
There are 22 cheats that save 72 picoseconds.
There are 4 cheats that save 74 picoseconds.
There are 3 cheats that save 76 picoseconds.
Find the best cheats using the updated cheating rules. How many cheats would save you at least 100 picoseconds?

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

def shortest_path_through_maze_with_one_time_walk_through_walls_for_max_distance_allowed(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')

  GRID = [ [ c for c in row ] for row in input_arr ]

  (min_time_saved, ) = args


  # CONSTANTS

  H, W = len(GRID), len(GRID[0])

  EMPTY, WALL = '.', '#'
  START, END = 'S', 'E'

  DELTAS = (0, +1), (+1, 0), (0, -1), (-1, 0)


  # DISCOVERY

  start_row, start_col = None, None
  end_row, end_col = None, None
  for row in range(H):
    for col in range(W):
      if GRID[row][col] == START: start_row, start_col = row, col
      if GRID[row][col] == END: end_row, end_col = row, col
  assert (start_row, start_col) != (None, None)
  assert (end_row, end_col) != (None, None)


  def simulate_backward_no_cheats():
    Q = deque()
    Q.append((end_row, end_col, 0))

    output = {}

    while len(Q):
      (row, col, moves) = Q.popleft()

      if (row, col) in output and output[(row, col)] <= moves: continue
      output[(row, col)] = moves

      for dy, dx in DELTAS:
        nr, nc = row + dy, col + dx

        if not (0 <= nr < H and 0 <= nc < W): continue
        if GRID[nr][nc] == WALL: continue
        Q.append((nr, nc, moves + 1))

    return output

  SHORTEST_PATH_TO_END_WITHOUT_CHEATS = simulate_backward_no_cheats()                               # save a reference for each non-wall location: what is the shortest distance from there to the end?
  BASELINE = SHORTEST_PATH_TO_END_WITHOUT_CHEATS[(start_row, start_col)]                            # BASELINE time taken with no cheats is the shortest distance from start to the end


  # UTILITY

  def manhattan_distance(r1, c1, r2, c2):
    return abs(r1 - r2) + abs(c1 - c2)


  # ANALYZE

  def simulate(TOTAL_CHEAT_LEN):
    Q = deque()
    Q.append((start_row, start_col, 0))

    output = {}                                                                                     # keys are unique (cheat_entry_row, cheat_entry_col, cheat_exit_row, cheat_exit_col) tuples (or None for no cheat);
                                                                                                    # values are sets of possible total moves to end for solutions involving that specific cheat serial

    visited = {}                                                                                    # keys are coords, values are moves. ASSUME NO CHEAT YET:
                                                                                                    # (once we cheat, we can calculate everything after, so we don't need to save that for BFS)
    while len(Q):
      (row, col, moves) = Q.popleft()                                                               # again, THIS STATE ASSUMES NO CHEAT YET

      if BASELINE - moves < min_time_saved: break                                                   # STOP CONDITION: you are no longer saving the minimum required amount of time

      if (row, col) == (end_row, end_col):                                                          # REACHED THE END WITHOUT CHEATING

        assert False                                                                                # this should never happen anyway, because the stop condition guards against taking too much time (with min_time_saved)

        if None not in output: output[None] = {}
        if None not in output[None]: output[None][None] = float('inf')
        output[None][None] = min(output[None][None], moves)
        continue

      if (row, col) in visited and visited[(row, col)] <= moves: continue                           # guard against revisiting coordinates pre-cheat
      visited[(row, col)] = moves

      ### CONTINUE BFS WITHOUT CHEATING ###

      for dy, dx in DELTAS:
        nr, nc = row + dy, col + dx
        if not (0 <= nr < H and 0 <= nc < W): continue                                              # guard against oob
        if GRID[nr][nc] == WALL: continue                                                           # no cheating allowed!
        Q.append((nr, nc, moves + 1))

      ### ACTIVATE CHEAT, AS THIS QUEUE ASSUMES NO CHEATING YET, AND CALCULATE ALL THE WAY TO THE END (SO WE DO NOT CONTINUE BFS POST-CHEAT) ###

      for nr in range(row - TOTAL_CHEAT_LEN, row + TOTAL_CHEAT_LEN + 1):                            # activating the cheat allows you to step freely in a diamond area (manhattan distance == TOTAL_CHEAT_LEN)
        for nc in range(col - TOTAL_CHEAT_LEN, col + TOTAL_CHEAT_LEN + 1):
          if not (0 <= nr < H and 0 <= nc < W): continue                                            # guard against oob
          if GRID[nr][nc] == WALL: continue                                                         # no ending in a wall - after the cheat, you MUST be in a non-wall space

          cheat_distance = manhattan_distance(row, col, nr, nc)
          if cheat_distance > TOTAL_CHEAT_LEN: continue                                             # outside of manhattan distance diamond area

          moves_from_cheat_exit_to_end = SHORTEST_PATH_TO_END_WITHOUT_CHEATS[(nr, nc)]              # once cheat is over, we are ONLY interested in the best path to the end
          total_moves_with_this_cheat = moves + cheat_distance + moves_from_cheat_exit_to_end

          cheat_serial = (row, col, nr, nc)
          output[cheat_serial] = total_moves_with_this_cheat

    return output


  if not DEBUG: print('RUNNING REAL DATA ANALYSIS (PLEASE WAIT)...')

  TIME_AT_START = time.time()

  TOTAL_CHEAT_LEN = 2 if part == 1 else 20                                                          # PART 1: CHEAT FOR UP TO 2 STEPS (LAST STEP MUST NOT BE WALL)
                                                                                                    # PART 2: CHEAT FOR UP TO 20 STEPS (LAST STEP MUST NOT BE WALL)

  res = simulate(TOTAL_CHEAT_LEN)

  aggregate_info = {}
  for cheat_serial in res:
    time_saved = BASELINE - res[cheat_serial]
    if time_saved >= min_time_saved:
      if time_saved not in aggregate_info: aggregate_info[time_saved] = 0
      aggregate_info[time_saved] += 1

  if DEBUG and DISPLAY_EXTRA_INFO:
    for time_saved in aggregate_info:
      if time_saved >= min_time_saved:
        print(f"Number of cheats that save {time_saved} moves: {aggregate_info[time_saved]}")
    print('')

  if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")                           # ~2.86 seconds
  return sum(aggregate_info.values())


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = shortest_path_through_maze_with_one_time_walk_through_walls_for_max_distance_allowed
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
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{str(DAY_NUM).zfill(2)}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
  'min_time_saved': 1,
}
test_expected = 14 + 14 + 2 + 4 + 2 + 3 + 1 + 1 + 1 + 1 + 1
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
  'min_time_saved': 100,
}
test_expected = 1511
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
  'min_time_saved': 50,
}
test_expected = 32 + 31 + 29 + 39 + 25 + 23 + 20 + 19 + 12 + 14 + 12 + 22 + 4 + 3
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
  'min_time_saved': 100,
}
test_expected = 1020507
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)