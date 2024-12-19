"""

--- Day 18: RAM Run ---

You and The Historians look a lot more pixelated than you remember. You're inside a computer at the North Pole!

Just as you're about to check out your surroundings, a program runs up to you. "This region of memory isn't safe! The User misunderstood what a pushdown automaton is and their algorithm is pushing whole bytes down on top of us! Run!"

The algorithm is fast - it's going to cause a byte to fall into your memory space once every nanosecond! Fortunately, you're faster, and by quickly scanning the algorithm, you create a list of which bytes will fall (your puzzle input) in the order they'll land in your memory space.

Your memory space is a two-dimensional grid with coordinates that range from 0 to 70 both horizontally and vertically. However, for the sake of example, suppose you're on a smaller grid with coordinates that range from 0 to 6 and the following list of incoming byte positions:

5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
Each byte position is given as an X,Y coordinate, where X is the distance from the left edge of your memory space and Y is the distance from the top edge of your memory space.

You and The Historians are currently in the top left corner of the memory space (at 0,0) and need to reach the exit in the bottom right corner (at 70,70 in your memory space, but at 6,6 in this example). You'll need to simulate the falling bytes to plan out where it will be safe to run; for now, simulate just the first few bytes falling into your memory space.

As bytes fall into your memory space, they make that coordinate corrupted. Corrupted memory coordinates cannot be entered by you or The Historians, so you'll need to plan your route carefully. You also cannot leave the boundaries of the memory space; your only hope is to reach the exit.

In the above example, if you were to draw the memory space after the first 12 bytes have fallen (using . for safe and # for corrupted), it would look like this:

...#...
..#..#.
....#..
...#..#
..#..#.
.#..#..
#.#....
You can take steps up, down, left, or right. After just 12 bytes have corrupted locations in your memory space, the shortest path from the top left corner to the exit would take 22 steps. Here (marked with O) is one such path:

OO.#OOO
.O#OO#O
.OOO#OO
...#OO#
..#OO#.
.#.O#..
#.#OOOO
Simulate the first kilobyte (1024 bytes) falling onto your memory space. Afterward, what is the minimum number of steps needed to reach the exit?


--- Part Two ---

The Historians aren't as used to moving around in this pixelated universe as you are. You're afraid they're not going to be fast enough to make it to the exit before the path is completely blocked.

To determine how fast everyone needs to go, you need to determine the first byte that will cut off the path to the exit.

In the above example, after the byte at 1,1 falls, there is still a path to the exit:

O..#OOO
O##OO#O
O#OO#OO
OOO#OO#
###OO##
.##O###
#.#OOOO
However, after adding the very next byte (at 6,1), there is no longer a path to the exit:

...#...
.##..##
.#..#..
...#..#
###..##
.##.###
#.#....
So, in this example, the coordinates of the first byte that prevents the exit from being reachable are 6,1.

Simulate more of the bytes that are about to corrupt your memory space. What are the coordinates of the first byte that will prevent the exit from being reachable from your starting position? (Provide the answer as two integers separated by a comma with no other characters.)

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

  FALL_DATA = [ [ int(n) for n in line.split(',') ] for line in input_str.split('\n') ]

  (H, W), part_1_bytes = args


  # CONSTANTS

  CORRUPTED, SAFE = '#', ' '
  START, END, PATH_NODE = 'S', 'E', 'O'

  DELTAS = (0, +1), (+1, 0), (0, -1), (-1, 0)
  FAIL = -1

  START_ROW, START_COL = 0, 0
  END_ROW, END_COL = H - 1, W - 1


  # DATA STRUCTURES

  GRID = [ [SAFE] * W for _ in range(H) ]


  # UTILITY

  def BFS(GRID):                                                                          # optimization: returns both moves AND a set of best path coords
    Q = deque()
    Q.append((START_ROW, START_COL, 0, None))
    visited = set()
    PREV_COORDS_BY_COORDS = {}
    while Q:
      row, col, moves, prev_coords = Q.popleft()
      if not (0 <= row < H and 0 <= col < W): continue
      if GRID[row][col] == CORRUPTED: continue
      if (row, col) in visited: continue
      visited.add((row, col))

      PREV_COORDS_BY_COORDS[(row, col)] = prev_coords
      
      if (row, col) == (END_ROW, END_COL):                                                # END CONDITION

        PATH = [ (END_ROW, END_COL) ]
        while PATH[-1] != (START_ROW, START_COL):
          PATH.append(PREV_COORDS_BY_COORDS[PATH[-1]])
          
        return moves, set(PATH)                                                           # don't just return moves; also return
                                                                                          # a set of all coordinates on the best path,
                                                                                          # so that we have to rerun BFS in part 2 ONLY
                                                                                          # when a safe coord on the current path gets corrupted

      else:

        for dy, dx in DELTAS:
          Q.append((row + dy, col + dx, moves + 1, (row, col)))
    
    return FAIL, set()


  # ANALYZE

  TIME_AT_START = time.time()

  if part == 1:                                                                           # PART 1: RUN SIMULATION AFTER `part_1_bytes` CELLS GET CORRUPTED

    # Corrupt the first `path_1_bytes` cells
    for i in range(part_1_bytes):
      [X, Y] = FALL_DATA[i]
      GRID[Y][X] = CORRUPTED

    # Then simulate and return the required information
    moves, PATH_SET = BFS(GRID)                                                           # we only care about PATH_SET for DISPLAY_EXTRA_INFO

    if DISPLAY_EXTRA_INFO:
          
      class bcolors:
        # HEADER = '\033[95m'
        # OKBLUE = '\033[94m'
        # OKCYAN = '\033[96m'
        OKGREEN = '\033[92m'
        WARNING = '\033[93m'
        FAIL = '\033[91m'
        ENDC = '\033[0m'
        # BOLD = '\033[1m'
        # UNDERLINE = '\033[4m'

      for row in range(H):
        row_to_draw = []
        for col in range(W):
          if (row, col) == (START_ROW, START_COL): row_to_draw.append(f"{bcolors.OKGREEN}{START}{bcolors.ENDC}")
          elif (row, col) == (END_ROW, END_COL): row_to_draw.append(f"{bcolors.OKGREEN}{END}{bcolors.ENDC}")
          elif (row, col) in PATH_SET: row_to_draw.append(f"{bcolors.WARNING}{PATH_NODE}{bcolors.ENDC}")
          elif GRID[row][col] == CORRUPTED: row_to_draw.append(f"{bcolors.FAIL}{CORRUPTED}{bcolors.ENDC}")
          elif GRID[row][col] == SAFE: row_to_draw.append(f"{SAFE}")
          else: assert False, f"UNRECOGNIZED CHARACTER AT ({row}, {col}): {GRID[row][col]}"
        print(''.join(row_to_draw))

    return moves

  else:                                                                                   # PART 2: FIND THE CRITICAL CELL THAT BLOCKS ALL PATHS

    if not DEBUG: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

    OLD_PATH = None
    PATH_SET = None
    for i in range(len(FALL_DATA)):
      [X, Y] = FALL_DATA[i]
      GRID[Y][X] = CORRUPTED

      if PATH_SET == None or (Y, X) in PATH_SET:                                          # optimization: ONLY run BFS when (1) first time, or (2) a
                                                                                          # cell *on the current best path* gets corrupted.
                                                                                          # otherwise, no need to rerun BFS when the current path
                                                                                          # isn't blocked!

        OLD_PATH = PATH_SET                                                               # for DISPLAY_EXTRA_INFO
        moves, PATH_SET = BFS(GRID)

        if moves == FAIL:                                                                 # at this point, there are no more paths

          if DISPLAY_EXTRA_INFO:

            class bcolors:
              # HEADER = '\033[95m'
              OKBLUE = '\033[94m'
              # OKCYAN = '\033[96m'
              OKGREEN = '\033[92m'
              WARNING = '\033[93m'
              FAIL = '\033[91m'
              ENDC = '\033[0m'
              # BOLD = '\033[1m'
              # UNDERLINE = '\033[4m'

            for row in range(H):
              row_to_draw = []
              for col in range(W):
                if (row, col) == (START_ROW, START_COL): row_to_draw.append(f"{bcolors.OKGREEN}{START}{bcolors.ENDC}")
                elif (row, col) == (END_ROW, END_COL): row_to_draw.append(f"{bcolors.OKGREEN}{END}{bcolors.ENDC}")
                elif (row, col) == (Y, X): row_to_draw.append(f"{bcolors.OKBLUE}{CORRUPTED}{bcolors.ENDC}")
                elif (row, col) in OLD_PATH: row_to_draw.append(f"{bcolors.WARNING}{PATH_NODE}{bcolors.ENDC}")
                elif GRID[row][col] == CORRUPTED: row_to_draw.append(f"{bcolors.FAIL}{CORRUPTED}{bcolors.ENDC}")
                elif GRID[row][col] == SAFE: row_to_draw.append(f"{SAFE}")
                else: assert False, f"UNRECOGNIZED CHARACTER AT ({row}, {col}): {GRID[row][col]}"
              print(''.join(row_to_draw))

          if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")         # ~0.31 seconds (~8.85 seconds without optimization)
          return f"{X},{Y}"

    if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
    assert False, 'DID NOT FIND AN ANSWER'



# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = NAME_OF_FUNC_HERE
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

sample_input = """5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
  '(H, W)': (7, 7),
  'part_1_bytes': 12,
}
test_expected = 22
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
  '(H, W)': (71, 71),
  'part_1_bytes': 1024,
}
test_expected = 262
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
  '(H, W)': (7, 7),
  'part_1_bytes': None,
}
test_expected = '6,1'
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
  '(H, W)': (71, 71),
  'part_1_bytes': None,
}
test_expected = '22,20'
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)