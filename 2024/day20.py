"""

COPY + PASTE PUZZLE DESCRIPTION HERE (PART 1)


COPY + PASTE PUZZLE DESCRIPTION HERE (PART 2)

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

def NAME_OF_FUNC_HERE(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  # input_arr = [ block.split('\n') for block in input_str.split('\n\n') ]
  # print(input_arr)

  GRID = [ [ c for c in row ] for row in input_arr ]
  # print(GRID)

  (min_time_saved, ) = args
  print(f"MIN TIME SAVED: {min_time_saved}")


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


  def simulate(TOTAL_CHEAT_LEN, baseline=float('inf')):
    Q = deque()
    Q.append((start_row, start_col, None, 0, TOTAL_CHEAT_LEN))

    output = []
    # output = {}

    visited = set()
    while len(Q):
      (row, col, cheat_data, moves, cheat_len_remaining) = Q.popleft()

      if baseline - moves < min_time_saved: break

      state = (row, col, cheat_data)

      if (row, col) == (end_row, end_col):                                              # WIN CONDITION: REACHED THE END

        cheat_entry = None if cheat_data == None else (cheat_data[0], cheat_data[1])
        cheat_exit = None if cheat_data == None else (cheat_data[2], cheat_data[3])

        if cheat_data != None and (cheat_data[2], cheat_data[3]) == (None, None):       # edge case where you step out of the wall and immediately hit exit
          cheat_exit = (end_row, end_col)

        output.append({
          'moves': moves,
          'cheat_entry': cheat_entry,
          'cheat_exit': cheat_exit,
        })

        continue
      
      if state in visited: continue                                                     # guard

      if cheat_data != None:                                                            # optimization: prevents revisiting pre-cheat coords
        # (entry_row, entry_col, exit_row, exit_col) = cheat_data
        state_before_cheat = (row, col, None)
        if state_before_cheat in visited: continue

      visited.add(state)

      for dy, dx in DELTAS:
        nr, nc = row + dy, col + dx

        if not (0 <= nr < H and 0 <= nc < W): continue                                  # guard against oob

        if GRID[nr][nc] == WALL:                                                        # entering wall...

          if TOTAL_CHEAT_LEN == 0: continue                                             # if cheats disabled, continue

          if cheat_len_remaining == 0: continue                                         # if cannot keep cheat going, continue

          next_cheat_data = cheat_data

          if GRID[row][col] != WALL:
            next_cheat_data = (row, col, None, None)

          Q.append((nr, nc, next_cheat_data, moves + 1, cheat_len_remaining - 1))

        else:                                                                           # entering empty...

          next_cheat_data = cheat_data

          if GRID[row][col] == WALL:                                                    # ending cheat
            cheat_len_remaining = 0
            entry_row = cheat_data[0]
            entry_col = cheat_data[1]
            next_cheat_data = (entry_row, entry_col, nr, nc)

          Q.append((nr, nc, next_cheat_data, moves + 1, cheat_len_remaining))

        # if TOTAL_CHEAT_LEN > 0 and cheat_data == None and GRID[nr][nc] == WALL:
        #   Q.append((nr, nc, (nr, nc, None, None), moves + 1))

        # if GRID[nr][nc] != WALL:
        #   Q.append((nr, nc, cheat_data, moves + 1))

    return output


  # ANALYZE

  if not DEBUG: print('RUNNING REAL DATA ANALYSIS (PLEASE WAIT)...')

  TIME_AT_START = time.time()

  TOTAL_CHEAT_LEN = 2 - 1 if part == 1 else 20 - 1

  baseline = simulate(0)[0]['moves']
  print(f"BASELINE TIME: {baseline}")
  print('')

  res = simulate(TOTAL_CHEAT_LEN, baseline)
  # if DEBUG:
  #   print(f"1 cheat times: {res}")
  #   print('')
  print(f"res: {res}")
  print('')

  res_filtered = [ baseline - r['moves'] for r in res if baseline - r['moves'] >= min_time_saved ]
  # if DEBUG:
  #   print(f"1 cheat times, where min_time_saved is saved: {res_filtered}")
  #   print('')
  print(f"time saved, where min_time_saved is saved: {res_filtered}")
  print('')

  if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")   # ~47.41 seconds
  return len(res_filtered)


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = NAME_OF_FUNC_HERE
skipped_tests = set([ 2, 3, 4 ])
skipped_tests = set([ 3, 4 ])
skipped_tests = set([ 4 ])
skipped_tests = set([  ])
skipped_tests = set([ 1, 2, 4 ])
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
test_expected = None
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)