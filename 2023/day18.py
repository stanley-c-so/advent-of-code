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


# SOLUTION 1 - FLOOD FILL OUTSIDE AND SUBTRACT - ONLY WORKS FOR PART 1; TOO SLOW FOR PART 2

def get_interior_area(part, input_str, DEBUG = False):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')


  # CONSTANTS

  U, D, L, R = 'U', 'D', 'L', 'R'

  DELTAS = {
    U: (+1, 0),
    D: (-1, 0),
    L: (0, -1),
    R: (0, +1),
  }

  SYMBOLS = {
    U: '^',
    D: 'v',
    L: '<',
    R: '>',
  }


  # DATA STRUCTURES

  visited = {}
  F_SET = set()
  SEVEN_SET = set()


  # INIT

  x, y = 0, 0
  min_x = 0
  max_x = 0
  min_y = 0
  max_y = 0

  TIME_AT_START = time.time()

  for line in input_arr:
    direction, n_str, hex_code = line.split(' ')
    n = int(n_str)
    dy, dx = DELTAS[direction]

    if (x, y) in visited:
      if (visited[(x, y)] == '^' and SYMBOLS[direction] == '>') or \
        (visited[(x, y)] == '<' and SYMBOLS[direction] == 'v'):
        F_SET.add((x, y))
      if (visited[(x, y)] == '>' and SYMBOLS[direction] == 'v') or \
        (visited[(x, y)] == '^' and SYMBOLS[direction] == '<'):
        SEVEN_SET.add((x, y))

    for _ in range(n):
      x += dx
      y += dy
      min_x = min(min_x, x)
      max_x = max(max_x, x)
      min_y = min(min_y, y)
      max_y = max(max_y, y)
      visited[(x, y)] = SYMBOLS[direction]


  # ANALYZE START SQUARE ONE LAST TIME TO SEE IF IT SHOULD BE ADDED TO F OR 7
  for line in [ input_arr[0] ]:
    direction, n_str, hex_code = line.split(' ')
    n = int(n_str)
    if (visited[(0, 0)] == '^' and SYMBOLS[direction] == '>') or \
      (visited[(0, 0)] == '<' and SYMBOLS[direction] == 'v'):
      F_SET.add((0, 0))
    if (visited[(0, 0)] == '>' and SYMBOLS[direction] == 'v') or \
      (visited[(0, 0)] == '^' and SYMBOLS[direction] == '<'):
      SEVEN_SET.add((x, y))


  # ANALYZE

  if part == 1:

    # Increase boundary by 1 to make sure that flooding from the edge will in fact be the outside
    min_x -= 1
    max_x += 1
    min_y -= 1
    max_y += 1

    H = max_y - min_y + 1
    W = max_x - min_x + 1

    MAP = [ ['.'] * W for _ in range(H) ]

    offset_x = min_x
    offset_y = max_y

    for curr_x in range(min_x, max_x + 1):
      for curr_y in range(min_y, max_y + 1):
        map_x = curr_x - offset_x
        map_y = offset_y - curr_y
        if (curr_x, curr_y) in visited:
          MAP[map_y][map_x] = visited[(curr_x, curr_y)]
        else:
          MAP[map_y][map_x] = '.'

    if DISPLAY_EXTRA_INFO:
      for row in MAP:
        print(''.join(row))

    # Flood fill
    outside_count = 0
    stack = [ (0, 0) ]
    visited_outside = set()
    while stack:
      r, c = stack.pop()
      if not (0 <= r < H and 0 <= c < W): continue
      if MAP[r][c] != '.': continue
      if (r, c) in visited_outside: continue
      visited_outside.add((r, c))
      for dy, dx in DELTAS.values():
        stack.append((r + dy, c + dx))

    return H * W - len(visited_outside)


# SOLUTION 2 - SHOELACE ALGORITHM
# https://www.101computing.net/the-shoelace-algorithm/

def get_interior_area2(part, input_str, DEBUG = False):

  # CONSTANTS
  
  U, D, L, R = 'U', 'D', 'L', 'R'

  DELTAS = {
    U: (+1, 0),
    D: (-1, 0),
    L: (0, -1),
    R: (0, +1),
  }


  # DATA STRUCTURES

  COORDS = []
  TRUE_N = []
  TRUE_DIRECTION = []


  # Step 1: Parse input data

  input_arr = input_str.split('\n')

  for i in range(len(input_arr)):
    line = input_arr[i]
    direction, n_str, hex_code = line.split(' ')
    n = int(n_str)

    hex_num_in_dec = int(hex_code[2:-2], 16)
    hex_dir = (R, D, L, U)[int(hex_code[-2])]

    TRUE_N.append(n if part == 1 else hex_num_in_dec)
    TRUE_DIRECTION.append(direction if part == 1 else hex_dir)


  # Step 2: Get coords of corners

  x, y = 0, 0

  for i in range(len(input_arr)):

    true_n = TRUE_N[i]
    true_direction = TRUE_DIRECTION[i]

    dy, dx = DELTAS[true_direction]
    x += dx * true_n
    y += dy * true_n

    true_next_direction = TRUE_DIRECTION[0 if i == len(input_arr) - 1 else i + 1]

    # Account for off-by-one precise outside corner points relative to the grid coords
    if (true_direction, true_next_direction) in ((R, D), (D, R)):
      COORDS.append((x + 1, y))
    elif (true_direction, true_next_direction) in ((D, L), (L, D)):
      COORDS.append((x + 1, y - 1))
    elif (true_direction, true_next_direction) in ((L, U), (U, L)):
      COORDS.append((x, y - 1))
    elif (true_direction, true_next_direction) in ((U, R), (R, U)):
      COORDS.append((x, y))
    else:
      assert False


  # ANALYZE: CROSS-MULTIPLY THE COORDS, FIND ABSOLUTE VALUE, AND RETURN HALF

  sum1 = 0
  sum2 = 0

  for i in range(len(COORDS)):
    coord = COORDS[i]
    next_coord = COORDS[0] if i == len(COORDS) - 1 else COORDS[i + 1]
    sum1 += coord[0] * next_coord[1]
    sum2 += coord[1] * next_coord[0]

  return(abs(sum1 - sum2) // 2)


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = get_interior_area2
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

sample_input = """R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 62
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 39039
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 952408144115
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 44644464596918
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)