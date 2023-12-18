"""

--- Day 18: Lavaduct Lagoon ---

Thanks to your efforts, the machine parts factory is one of the first factories up and running since the lavafall came back. However, to catch up with the large backlog of parts requests, the factory will also need a large supply of lava for a while; the Elves have already started creating a large lagoon nearby for this purpose.

However, they aren't sure the lagoon will be big enough; they've asked you to take a look at the dig plan (your puzzle input). For example:

R 6 (#70c710)
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
U 2 (#7a21e3)

The digger starts in a 1 meter cube hole in the ground. They then dig the specified number of meters up (U), down (D), left (L), or right (R), clearing full 1 meter cubes as they go. The directions are given as seen from above, so if "up" were north, then "right" would be east, and so on. Each trench is also listed with the color that the edge of the trench should be painted as an RGB hexadecimal color code.

When viewed from above, the above example dig plan would result in the following loop of trench (#) having been dug out from otherwise ground-level terrain (.):

#######
#.....#
###...#
..#...#
..#...#
###.###
#...#..
##..###
.#....#
.######

At this point, the trench could contain 38 cubic meters of lava. However, this is just the edge of the lagoon; the next step is to dig out the interior so that it is one meter deep as well:

#######
#######
#######
..#####
..#####
#######
#####..
#######
.######
.######

Now, the lagoon can contain a much more respectable 62 cubic meters of lava. While the interior is dug out, the edges are also painted according to the color codes in the dig plan.

The Elves are concerned the lagoon won't be large enough; if they follow their dig plan, how many cubic meters of lava could it hold?


--- Part Two ---

The Elves were right to be concerned; the planned lagoon would be much too small.

After a few minutes, someone realizes what happened; someone swapped the color and instruction parameters when producing the dig plan. They don't have time to fix the bug; one of them asks if you can extract the correct instructions from the hexadecimal codes.

Each hexadecimal code is six hexadecimal digits long. The first five hexadecimal digits encode the distance in meters as a five-digit hexadecimal number. The last hexadecimal digit encodes the direction to dig: 0 means R, 1 means D, 2 means L, and 3 means U.

So, in the above example, the hexadecimal codes can be converted into the true instructions:

    #70c710 = R 461937
    #0dc571 = D 56407
    #5713f0 = R 356671
    #d2c081 = D 863240
    #59c680 = R 367720
    #411b91 = D 266681
    #8ceee2 = L 577262
    #caa173 = U 829975
    #1b58a2 = L 112010
    #caa171 = D 829975
    #7807d2 = L 491645
    #a77fa3 = U 686074
    #015232 = L 5411
    #7a21e3 = U 500254

Digging out this loop and its interior produces a lagoon that can hold an impressive 952408144115 cubic meters of lava.

Convert the hexadecimal color codes into the correct instructions; if the Elves follow this new dig plan, how many cubic meters of lava could the lagoon hold?


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
  UP, DOWN, LEFT, RIGHT = '^', 'v', '<', '>'
  EMPTY, FILLED = '.', '#'

  DELTAS = {
    U: (+1, 0),
    D: (-1, 0),
    L: (0, -1),
    R: (0, +1),
  }

  SYMBOLS = { U: UP, D: DOWN, L: LEFT, R: RIGHT }


  # DATA STRUCTURES

  visited = {}


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

    for _ in range(n):
      x += dx
      y += dy
      min_x = min(min_x, x)
      max_x = max(max_x, x)
      min_y = min(min_y, y)
      max_y = max(max_y, y)
      visited[(x, y)] = SYMBOLS[direction]


  # ANALYZE

  if part == 1:

    # Increase boundary by 1 to make sure that flooding from the edge will in fact be the outside
    min_x -= 1
    max_x += 1
    min_y -= 1
    max_y += 1

    H = max_y - min_y + 1
    W = max_x - min_x + 1

    MAP = [ [FILLED] * W for _ in range(H) ]                                              # we will flood fill the outside to empty later

    offset_x = min_x
    offset_y = max_y

    for curr_x in range(min_x, max_x + 1):
      for curr_y in range(min_y, max_y + 1):
        map_x = curr_x - offset_x                                                         # since offset_x (constant) = curr_x - map_x
        map_y = offset_y - curr_y                                                         # since offset_y (constant) = curr_y + map_y
        if (curr_x, curr_y) in visited:
          MAP[map_y][map_x] = visited[(curr_x, curr_y)]

    # Flood fill
    outside_count = 0
    stack = [ (0, 0) ]
    while stack:
      r, c = stack.pop()
      if not (0 <= r < H and 0 <= c < W): continue
      if MAP[r][c] != FILLED: continue
      MAP[r][c] = EMPTY
      outside_count += 1
      for dy, dx in DELTAS.values():
        stack.append((r + dy, c + dx))

    if DISPLAY_EXTRA_INFO and 1:
      for row in MAP:
        row_to_print = []
        for c in row:
          if c in (UP, DOWN, LEFT, RIGHT):
            row_to_print.append( '\033[1m' + '\033[93m' + c + '\033[0m' )
          elif c == FILLED:
            row_to_print.append( '\033[92m' + c + '\033[0m' )
          else:
            row_to_print.append(c)
        print(''.join(row_to_print))
      print('')

    return H * W - outside_count


# SOLUTION 2 - SHOELACE ALGORITHM (https://www.101computing.net/the-shoelace-algorithm/)
#
# The difficulty here, however, is dealing with discrete lines.
#
# The key to converting this into a general shoelace problem with point coordinates is to look at the pixel (discrete) corner squares,
# and figure out which of the 4 corners of the corner square is the coordinate that counts.
#
# Two variables go into this decision: (1) Is the corner square part of an F, 7, J, or L? (2) Are we going CW or CCW around the shape?
#
# If we select the correct direction, we are grabbing the total area, including that of the dig lines (which is what the problem wants).
# Notably, however, if we select the incorrect direction, we are grabbing the INTERIOR area, which EXCLUDES that of the dig lines.
# However: interior area + area of dig lines = total area.
#
# We can run the shoelace algorithm for both CW and CCW and simply return whichever is larger.
# However, we can also verify our logic is correct by calculating the dig lines area, and adding it to the smaller result, and checking if
# it maches the larger result!


def get_interior_area2(part, input_str, DEBUG = False):

  if part == 1: return get_interior_area(part, input_str, DEBUG)                          # OPTIONAL: run solution 1 for part 1.
                                                                                          # solution 2 works for part 1 as well,
                                                                                          # but part 1 can print out a visualization.

  # CONSTANTS
  
  U, D, L, R = 'U', 'D', 'L', 'R'

  DELTAS = {
    U: (+1, 0),
    D: (-1, 0),
    L: (0, -1),
    R: (0, +1),
  }


  # DATA STRUCTURES

  CW_COORDS = []                                                                          # point coords if we are moving CW around the shape
  CCW_COORDS = []                                                                         # point coords if we are moving CCW around the shape
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

    TRUE_N.append(n if part == 1 else hex_num_in_dec)                                     # PART 1: n is directly given; PART 2: n comes from hex
    TRUE_DIRECTION.append(direction if part == 1 else hex_dir)                            # PART 2: dir is directly given; PART 2: dir comes from hex


  # Step 2: Get coords of corners

  x, y = 0, 0

  visited_count = 0                                                                       # for verification at the end

  for i in range(len(input_arr)):

    true_n = TRUE_N[i]
    true_direction = TRUE_DIRECTION[i]

    dy, dx = DELTAS[true_direction]
    x += dx * true_n
    y += dy * true_n

    true_next_direction = TRUE_DIRECTION[0 if i == len(input_arr) - 1 else i + 1]

    visited_count += true_n

    # Account for off-by-one precise outside corner points relative to the grid coords

    # Offsets if going clockwise
    if (true_direction, true_next_direction) in ((R, D), (D, R)):                         # top right corner of pixel
      CW_COORDS.append((x + 1, y))
    elif (true_direction, true_next_direction) in ((D, L), (L, D)):                       # bottom right corner of pixel
      CW_COORDS.append((x + 1, y - 1))
    elif (true_direction, true_next_direction) in ((L, U), (U, L)):                       # bottom left corner of pixel
      CW_COORDS.append((x, y - 1))
    elif (true_direction, true_next_direction) in ((U, R), (R, U)):                       # top left corner of pixel
      CW_COORDS.append((x, y))
    else:
      assert False

    # Offsets if going counter-clockwise
    if (true_direction, true_next_direction) in ((R, D), (D, R)):                         # bottom left corner of pixel
      CCW_COORDS.append((x, y - 1))
    elif (true_direction, true_next_direction) in ((D, L), (L, D)):                       # top left corner of pixel
      CCW_COORDS.append((x, y))
    elif (true_direction, true_next_direction) in ((L, U), (U, L)):                       # top right corner of pixel
      CCW_COORDS.append((x + 1, y))
    elif (true_direction, true_next_direction) in ((U, R), (R, U)):                       # bottom right corner of pixel
      CCW_COORDS.append((x + 1, y - 1))
    else:
      assert False


  # ANALYZE: CROSS-MULTIPLY THE COORDS, FIND ABSOLUTE VALUE, AND RETURN HALF.
  # DO THIS FOR BOTH CW_COORDS AND CCW_COORDS, AND RETURN THE LARGER RESULT.

  def shoelace(coords):
    sum1 = 0
    sum2 = 0
    for i in range(len(coords)):
      coord = coords[i]
      next_coord = coords[0] if i == len(coords) - 1 else coords[i + 1]
      sum1 += coord[0] * next_coord[1]
      sum2 += coord[1] * next_coord[0]
    return(abs(sum1 - sum2) // 2)

  res_cw = shoelace(CW_COORDS)
  res_ccw = shoelace(CCW_COORDS)

  larger_result = max(res_cw, res_ccw)
  smaller_result = min(res_cw, res_ccw)

  if DISPLAY_EXTRA_INFO:
    print(f"Interior area: {smaller_result}")
    print(f"Dig lines area: {visited_count}")
    print(f"Interior area + dig lines area: {smaller_result + visited_count} (this should equal total area)")
    print(f"Total area: {larger_result}")

  assert larger_result == smaller_result + visited_count
  return larger_result


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