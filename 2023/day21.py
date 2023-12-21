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

def NAME_OF_FUNC_HERE(part, input_str, steps, DEBUG = False):


  SPACE, WALL = '.', '#'
  START = 'S'

  DELTAS = {
    (-1, 0),
    (+1, 0),
    (0, -1),
    (0, +1),
  }

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  MAP = [ [ c for c in row ] for row in input_arr ]

  H, W = len(MAP), len(MAP[0])

  num_walls = 0

  # find start
  start_row, start_col = None, None
  for r in range(H):
    for c in range(W):
      if MAP[r][c] == START:
        start_row = r
        start_col = c
        # break
      if MAP[r][c] == WALL:
        num_walls += 1
    # if start_row != None: break

  num_spaces = H * W - num_walls

  # print(f"NUM WALLS {num_walls}")
  # print(f"NUM SPACES {num_spaces}")

  # ANALYZE

  TIME_AT_START = time.time()

  if part == 1:

    locations = set()
    locations.add((start_row, start_col))
    for n in range(steps):
      new_locations = set()
      for (r, c) in locations:
        for (dy, dx) in DELTAS:
          new_r, new_c = r + dy, c + dx
          if not (0 <= new_r < H and 0 <= new_c < W) \
            or MAP[new_r][new_c] == WALL:
            continue
          new_locations.add((new_r, new_c))
      locations = new_locations
    
    return len(locations)

  else:

    print(H, W)


    assert 0


    # REAL DATA RESEARCH

    # for r in range(H):
    #   if MAP[r][start_col] == WALL:
    #     assert 0
    # for c in range(W):
    #   if MAP[start_row][c] == WALL:
    #     assert 0

    # print('YAY')

    # print(H, W) # 131, 131 --> 17,161 cells
    # 1654 walls, 15507 spaces

    # print(start_row, start_col) # 65, 65

    # the num of squares i can reach after an odd number of moves is floor(17161/2) = 8580
    # the num of squares i can reach after an even number of moves is ceil(17161/2) = 8581

    # once you account for the walls, though
    # 832 walls for odd --> 8580 - 832 = 7748
    # 822 walls for even --> 8581 - 822 = 7759

    # num_blockers = 0
    # for r in range(H):
    #   for c in range(1 if r % 2 else 0, W, 2):
    #     if MAP[r][c] == WALL: num_blockers += 1
    # print(num_blockers)
    # assert 0

    def get_new_coords(instance_x, instance_y, r, c, dy, dx):
      new_r, new_c = r + dy, c + dx
      if (0 <= new_r < H and 0 <= new_c < W):
        return (instance_x, instance_y, new_r, new_c)
      elif (new_r < 0):
        return (instance_x, instance_y + 1, H - 1, c)
      elif (new_r == H):
        return (instance_x, instance_y - 1, 0, c)
      elif (new_c < 0):
        return (instance_x - 1, instance_y, r, W - 1)
      elif (new_c == W):
        return (instance_x + 1, instance_y, r, 0)
      else:
        assert False


    if not DEBUG: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

    locations_even = { (0, 0): set() }
    locations_even[(0, 0)].add((start_row, start_col))
    
    locations_odd = {}

    # once you account for the walls, though
    # 832 walls for odd --> 8580 - 832 = 7748
    # 822 walls for even --> 8581 - 822 = 7759

    # found_odd = False
    # found_even = False

    INSTANCES_THAT_ARE_DONE = set()
    INSTANCES_THAT_HAVE_STARTED = {}

    # MAGIC_NUMS = [ 7748, 7757 ]
    MAGIC_NUMS = [ 7757, 7748 ]

    SPECIAL_REGIONS_DATA = {
      (0, +1): { 'start_n': None, 'end_n': None, 'sizes': [] },     # A size 196
      (+1, 0): { 'start_n': None, 'end_n': None, 'sizes': [] },     # B
      (0, -1): { 'start_n': None, 'end_n': None, 'sizes': [] },     # C
      (-1, 0): { 'start_n': None, 'end_n': None, 'sizes': [] },     # D

      (-1, +1): { 'start_n': None, 'end_n': None, 'sizes': [] },    # E size 260
      (+1, -1): { 'start_n': None, 'end_n': None, 'sizes': [] },    # F
      (-1, -1): { 'start_n': None, 'end_n': None, 'sizes': [] },    # G
      (+1, +1): { 'start_n': None, 'end_n': None, 'sizes': [] },    # H

      (0, +2): { 'start_n': None, 'end_n': None, 'sizes': [] },     # A' size 195
      (+2, 0): { 'start_n': None, 'end_n': None, 'sizes': [] },     # B'
      (0, -2): { 'start_n': None, 'end_n': None, 'sizes': [] },     # C'
      (-2, 0): { 'start_n': None, 'end_n': None, 'sizes': [] },     # D'

      (-2, +1): { 'start_n': None, 'end_n': None, 'sizes': [] },    # E' size 261
      (+2, -1): { 'start_n': None, 'end_n': None, 'sizes': [] },    # F'
      (-2, -1): { 'start_n': None, 'end_n': None, 'sizes': [] },    # G'
      (+2, +1): { 'start_n': None, 'end_n': None, 'sizes': [] },    # H'
    }


    for n in range(steps):

      # if n > 391 + 131:
      #   print(SPECIAL_REGIONS_DATA)
      #   assert 0

      # print(f"analyzing step {n + 1}")

      # if (n+1) % 50 == 0:
      #   print(f"analyzing step {n + 1}")
      #   # print(INSTANCES_THAT_ARE_DONE)
      #   if len(INSTANCES_THAT_ARE_DONE) >= 9:
      #     print(len(locations_even[(-1, 0)]), len(locations_odd[(-1, 0)]))
      #     print(len(locations_even[(+1, 0)]), len(locations_odd[(+1, 0)]))
      #     print(len(locations_even[(0, -1)]), len(locations_odd[(0, -1)]))
      #     print(len(locations_even[(0, +1)]), len(locations_odd[(0, +1)]))
      #     assert 0

      # if 129 <= (n+1) <= 260:
      #   print(f"n+1=={n+1}:")
      #   print(len(locations_even[(-1, 0)]), len(locations_odd[(-1, 0)]))
      #   print(len(locations_even[(+1, 0)]), len(locations_odd[(+1, 0)]))
      #   print(len(locations_even[(0, -1)]), len(locations_odd[(0, -1)]))
      #   print(len(locations_even[(0, +1)]), len(locations_odd[(0, +1)]))
      #   print('---')
      # if n > 260: assert 0

      # test_tup = (-1, 0)
      # test_tup = (1, 0)
      # if (test_tup in locations_even) or (test_tup in locations_odd):
      #   print(f"{n+1} | {len(locations_even[test_tup]) if test_tup in locations_even else 0} {len(locations_odd[test_tup]) if test_tup in locations_odd else 0}")
      
      # if (n+1) > 260: assert 0


      new_locations = {}
      locations = locations_odd if n % 2 else locations_even
      for (instance_x, instance_y) in locations:
        for (r, c) in locations[(instance_x, instance_y)]:
          for (dy, dx) in DELTAS:
            # print(dy, dx)
            new_instance_x, new_instance_y, new_r, new_c = get_new_coords(instance_x, instance_y, r, c, dy, dx)
            # print(new_instance_x, new_instance_y, new_r, new_c)
            if MAP[new_r][new_c] == WALL:
              continue
            if (new_instance_x, new_instance_y) in INSTANCES_THAT_ARE_DONE:
              continue
            if (new_instance_x, new_instance_y) not in new_locations:
              new_locations[(new_instance_x, new_instance_y)] = set()
            new_locations[(new_instance_x, new_instance_y)].add((new_r, new_c))
      
            if (new_instance_x, new_instance_y) not in INSTANCES_THAT_HAVE_STARTED:
              INSTANCES_THAT_HAVE_STARTED[(new_instance_x, new_instance_y)] = n

              if (new_instance_x, new_instance_y) in SPECIAL_REGIONS_DATA:
                SPECIAL_REGIONS_DATA[(new_instance_x, new_instance_y)]['start_n'] = n

      for instance_tup in SPECIAL_REGIONS_DATA:
        if instance_tup not in INSTANCES_THAT_ARE_DONE and instance_tup in INSTANCES_THAT_HAVE_STARTED:
          SPECIAL_REGIONS_DATA[instance_tup]['sizes'].append(len(new_locations[instance_tup]))

      for instance_tup in new_locations.copy():
        instance_x, instance_y = instance_tup
        if (n+1) % 2 and (len(new_locations[instance_tup]) == MAGIC_NUMS[int( instance_x % 2 == instance_y % 2 )]):
          INSTANCES_THAT_ARE_DONE.add(instance_tup)
          print(f"odd | instance is done {instance_tup} after {n+1} moves")
          del INSTANCES_THAT_HAVE_STARTED[instance_tup]

          if instance_tup in SPECIAL_REGIONS_DATA:
            SPECIAL_REGIONS_DATA[instance_tup]['end_n'] = n

          # if all([ (instance_x + dx, instance_y + dy) in INSTANCES_THAT_ARE_DONE for (dy, dx) in DELTAS]):
          #   del new_locations[instance_tup]
          #   print(f"ODD | REMOVING INSTANCE {instance_tup} AFTER {n+1} moves")
        # if (n+1) % 2 == 0 and (len(new_locations[instance_tup]) == MAGIC_NUMS[int( instance_x % 2 != instance_y % 2 )]):
        #   INSTANCES_THAT_ARE_DONE.add(instance_tup)
        #   print(f"even | instance is done {instance_tup} after {n+1} moves")
        #   if all([ (instance_x + dx, instance_y + dy) in INSTANCES_THAT_ARE_DONE for (dy, dx) in DELTAS]):
        #     del new_locations[instance_tup]
        #     print(f"EVEN | REMOVING INSTANCE {instance_tup} AFTER {n+1} moves")

      if n % 2:
        locations_even = new_locations
      else:
        locations_odd = new_locations


      # print(f"LOCATIONS AFTER STEP {n + 1}: {locations}")

      # if found_odd == False and (n+1) % 2 and len(locations[(0, 0)]) == 7748:
      #   found_odd = True
      #   print(f"found odd after {n + 1} moves!")
      # if found_even == False and (n+1) % 2 == 0 and len(locations[(0, 0)]) == 7759:
      #   found_even = True
      #   print(f"found even after {n + 1} moves!")
      # if found_odd and found_even:
      #   assert 0

      # if (n+1) % 2 == 0 and len(locations[(0, 0)]) == 7757:
      #   PRINT = [ [None] * W for _ in range(H) ]
      #   for r in range(H):
      #     for c in range(W):
      #       if r%2 != c%2:
      #         PRINT[r][c] = '_'
      #       elif MAP[r][c] == WALL:
      #         PRINT[r][c] = WALL
      #       elif (r, c) in locations[(0, 0)]:
      #         PRINT[r][c] = 'O'
      #       else:
      #         # PRINT[r][c] = SPACE
      #         PRINT[r][c] = '~'
      #         print(f"unreachable char at {r} {c}")
      #   for row in PRINT:
      #     print(''.join(row))
      #   assert 0

      #   unreachable char at 52 50
      #   unreachable char at 78 30
      # for (R, C) in [(52, 50), (78, 30)]:
      #   print(''.join(MAP[R - 1]))
      #   print(''.join(MAP[R]))
      #   print(''.join(MAP[R + 1]))
      #   print('')
      # assert 0

    # return len(locations.values())
    total = 0
    for s in locations.values():
      total += len(s)


    # for loc in locations:
    #   print(f"{loc}: {len(locations[loc])}")

    # print(locations[(1, 0)] == locations[(0, 1)])
    # PRINT = [ [None] * W for _ in range(H) ]
    # for r in range(H):
    #   for c in range(W):
    #     if MAP[r][c] == WALL:
    #       PRINT[r][c] = WALL
    #     elif (r, c) in locations[(1, 0)]:
    #       PRINT[r][c] = 'O'
    #     else:
    #       PRINT[r][c] = SPACE
    # for row in PRINT:
    #   print(''.join(row))


    if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
    return total
    # return


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = NAME_OF_FUNC_HERE
skipped_tests = set([ 2, 3, 4, 5, 6, 7, 8, 9, 10 ])
skipped_tests = set([ 3, 4, 5, 6, 7, 8, 9, 10 ])
skipped_tests = set([ 4, 5, 6, 7, 8, 9, 10 ])
# skipped_tests = set([ 10 ])
skipped_tests = set([ 3, 4, 5, 6, 7, 10 ])
skipped_tests = set([ 3, 4, 5, 7, 8, 9, 10 ])
skipped_tests = set([ 1, 2, 3, 4, 5, 6, 7, 8, 9 ])
# skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{DAY_NUM}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
..........."""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'steps': 6,
  'DEBUG': True,
}
test_expected = 16
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'steps': 64,
}
test_expected = 3816
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'steps': 6,
  'DEBUG': True,
}
test_expected = 16
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': sample_input,
  'steps': 10,
  'DEBUG': True,
}
test_expected = 50
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 5
test_input = {
  'part': 2,
  'input_str': sample_input,
  'steps': 50,
  'DEBUG': True,
}
test_expected = 1594
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 6
test_input = {
  'part': 2,
  'input_str': sample_input,
  'steps': 100,
  'DEBUG': True,
}
test_expected = 6536
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 7
test_input = {
  'part': 2,
  'input_str': sample_input,
  'steps': 500,
  'DEBUG': True,
}
test_expected = 167004
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 8
test_input = {
  'part': 2,
  'input_str': sample_input,
  'steps': 1000,
  'DEBUG': True,
}
test_expected = 668697
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 9
test_input = {
  'part': 2,
  'input_str': sample_input,
  'steps': 5000,
  'DEBUG': True,
}
test_expected = 16733044
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 10
test_input = {
  'part': 2,
  'input_str': actual_input,
  'steps': 26501365,
}
test_expected = None
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)