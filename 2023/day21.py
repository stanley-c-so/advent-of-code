"""

--- Day 21: Step Counter ---

You manage to catch the airship right as it's dropping someone else off on their all-expenses-paid trip to Desert Island! It even helpfully drops you off near the gardener and his massive farm.

"You got the sand flowing again! Great work! Now we just need to wait until we have enough sand to filter the water for Snow Island and we'll have snow again in no time."

While you wait, one of the Elves that works with the gardener heard how good you are at solving problems and would like your help. He needs to get his steps in for the day, and so he'd like to know which garden plots he can reach with exactly his remaining 64 steps.

He gives you an up-to-date map (your puzzle input) of his starting position (S), garden plots (.), and rocks (#). For example:

...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........

The Elf starts at the starting position (S) which also counts as a garden plot. Then, he can take one step north, south, east, or west, but only onto tiles that are garden plots. This would allow him to reach any of the tiles marked O:

...........
.....###.#.
.###.##..#.
..#.#...#..
....#O#....
.##.OS####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........

Then, he takes a second step. Since at this point he could be at either tile marked O, his second step would allow him to reach any garden plot that is one step north, south, east, or west of any tile that he could have reached after the first step:

...........
.....###.#.
.###.##..#.
..#.#O..#..
....#.#....
.##O.O####.
.##.O#...#.
.......##..
.##.#.####.
.##..##.##.
...........

After two steps, he could be at any of the tiles marked O above, including the starting position (either by going north-then-south or by going west-then-east).

A single third step leads to even more possibilities:

...........
.....###.#.
.###.##..#.
..#.#.O.#..
...O#O#....
.##.OS####.
.##O.#...#.
....O..##..
.##.#.####.
.##..##.##.
...........

He will continue like this until his steps for the day have been exhausted. After a total of 6 steps, he could reach any of the garden plots marked O:

...........
.....###.#.
.###.##.O#.
.O#O#O.O#..
O.O.#.#.O..
.##O.O####.
.##.O#O..#.
.O.O.O.##..
.##.#.####.
.##O.##.##.
...........

In this example, if the Elf's goal was to get exactly 6 more steps today, he could use them to reach any of 16 garden plots.

However, the Elf actually needs to get 64 steps today, and the map he's handed you is much larger than the example map.

Starting from the garden plot marked S on your map, how many garden plots could the Elf reach in exactly 64 steps?


--- Part Two ---

The Elf seems confused by your answer until he realizes his mistake: he was reading from a list of his favorite numbers that are both perfect squares and perfect cubes, not his step counter.

The actual number of steps he needs to get today is exactly 26501365.

He also points out that the garden plots and rocks are set up so that the map repeats infinitely in every direction.

So, if you were to look one additional map-width or map-height out from the edge of the example map above, you would find that it keeps repeating:

.................................
.....###.#......###.#......###.#.
.###.##..#..###.##..#..###.##..#.
..#.#...#....#.#...#....#.#...#..
....#.#........#.#........#.#....
.##...####..##...####..##...####.
.##..#...#..##..#...#..##..#...#.
.......##.........##.........##..
.##.#.####..##.#.####..##.#.####.
.##..##.##..##..##.##..##..##.##.
.................................
.................................
.....###.#......###.#......###.#.
.###.##..#..###.##..#..###.##..#.
..#.#...#....#.#...#....#.#...#..
....#.#........#.#........#.#....
.##...####..##..S####..##...####.
.##..#...#..##..#...#..##..#...#.
.......##.........##.........##..
.##.#.####..##.#.####..##.#.####.
.##..##.##..##..##.##..##..##.##.
.................................
.................................
.....###.#......###.#......###.#.
.###.##..#..###.##..#..###.##..#.
..#.#...#....#.#...#....#.#...#..
....#.#........#.#........#.#....
.##...####..##...####..##...####.
.##..#...#..##..#...#..##..#...#.
.......##.........##.........##..
.##.#.####..##.#.####..##.#.####.
.##..##.##..##..##.##..##..##.##.
.................................

This is just a tiny three-map-by-three-map slice of the inexplicably-infinite farm layout; garden plots and rocks repeat as far as you can see. The Elf still starts on the one middle tile marked S, though - every other repeated S is replaced with a normal garden plot (.).

Here are the number of reachable garden plots in this new infinite version of the example map for different numbers of steps:

    In exactly 6 steps, he can still reach 16 garden plots.
    In exactly 10 steps, he can reach any of 50 garden plots.
    In exactly 50 steps, he can reach 1594 garden plots.
    In exactly 100 steps, he can reach 6536 garden plots.
    In exactly 500 steps, he can reach 167004 garden plots.
    In exactly 1000 steps, he can reach 668697 garden plots.
    In exactly 5000 steps, he can reach 16733044 garden plots.

However, the step count the Elf needs is much larger! Starting from the garden plot marked S on your infinite map, how many garden plots could the Elf reach in exactly 26501365 steps?


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

def get_size_of_possible_destinations_after_n_steps(part, input_str, steps, DEBUG = False):

  # CONSTANTS

  SPACE, WALL, START = '.', '#', 'S'

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

  # Find start
  start_row, start_col = None, None
  for r in range(H):
    for c in range(W):
      if MAP[r][c] == START:
        start_row = r
        start_col = c
    if start_row != None: break


  # HELPER FUNCTION

  def solve_for_one_instance(steps):
    VISITED_EVEN, VISITED_ODD = set(), set()                              # we are basically alternating between these two data structures
    VISITED_EVEN.add((start_row, start_col))
    
    locations = set()
    locations.add((start_row, start_col))
    for n in range(1, steps + 1):
      new_locations = set()
      VISITED = VISITED_EVEN if n % 2 == 0 else VISITED_ODD
      for (r, c) in locations:
        for (dy, dx) in DELTAS:
          new_r, new_c = r + dy, c + dx
          if not (0 <= new_r < H and 0 <= new_c < W) \
            or MAP[new_r][new_c] == WALL \
            or (new_r, new_c) in VISITED:
            continue
          VISITED.add((new_r, new_c))
          new_locations.add((new_r, new_c))
      locations = new_locations
      if len(locations) == 0: break

    return len(VISITED_EVEN if steps % 2 == 0 else VISITED_ODD)


  # ANALYZE

  TIME_AT_START = time.time()

  if part == 1:                                                           # PART 1: COUNT POSSIBLE STOPPING POINTS FOR ONE INSTANCE OF THE MAP

    return solve_for_one_instance(steps)

  else:                                                                   # PART 2: COUNT POSSIBLE STOPPING POINTS FOR INFINITE INSTANCES OF THE MAP

    ORIGINAL_STEPS = steps

    """
    The example is not helpful here. The actual input requires heavy analysis to figure out how to code a solution, and the input has
    the following properties:

    - The map is an odd by odd set of dimensions (example has this too)
    - The starting point is in the middle of the map (example has this too)
    - There are no obstacles whatsoever from the center straight to the edges in all 4 directions (NOT in example)
    - The number of steps is equal to half the width of the map (to get to the edge of the initial instance) plus some multiple of the entire width of the map (to get to the edge
      of the final instance)
    - The actual input is relatively sparse (arguably NOT in example)
    
    With the real input, we would expect the possibility space to be roughly in a rhombus shape (but not precisely at the edges, because of the wall obstacles).
    It is vital to remember that the actual squares will be in a checkerboard pattern because of parity (here, we move an ODD number of steps) so even if there were no walls,
    half the squares would not be valid places to end on.

    There is a potential trap: the actual input also contains "prisons":

    .#.
    #.#
    .#.

    Such that the inside area is unreachable. My input has two such prisons per instance of the map. Therefore, we cannot blindly count the checkerboard squares and subtract
    the wall count. We have to actually flood fill the board instance to see how many tiles are reachable.

    """

    SQUARE_FILLED = 'SQUARE_FILLED'
    SQUARE_PRIME_FILLED = 'SQUARE_PRIME_FILLED'
    E_BIG = 'E_BIG'
    F_BIG = 'F_BIG'
    G_BIG = 'G_BIG'
    H_BIG = 'H_BIG'
    E_SMALL = 'E_SMALL'
    F_SMALL = 'F_SMALL'
    G_SMALL = 'G_SMALL'
    H_SMALL = 'H_SMALL'
    A_POINT = 'A_POINT'
    B_POINT = 'B_POINT'
    C_POINT = 'C_POINT'
    D_POINT = 'D_POINT'


    SPECIAL_REGIONS_DATA = {}

    # Takes approximately 70 seconds
    SKIP_CALCULATION_OF_AREA_VALUES_TO_SAVE_TIME = True
    SKIP_CALCULATION_OF_AREA_VALUES_TO_SAVE_TIME = False

    if not DEBUG and SKIP_CALCULATION_OF_AREA_VALUES_TO_SAVE_TIME:

      SPECIAL_REGIONS_DATA = {

        SQUARE_FILLED: 7748,        # 7748
        SQUARE_PRIME_FILLED: 7757,  # 7757

        E_BIG: 6813,                # 6813
        F_BIG: 6804,                # 6804
        G_BIG: 6790,                # 6790
        H_BIG: 6781,                # 6781

        E_SMALL: 990,               # 990
        F_SMALL: 978,               # 978
        G_SMALL: 977,               # 977
        H_SMALL: 996,               # 996

        A_POINT: 5869,              # 5869
        B_POINT: 5846,              # 5846
        C_POINT: 5823,              # 5823
        D_POINT: 5846,              # 5846

      }


    # GET FILLED NUMS
    # The reason why you can't just count checkerboard non-wall tiles to get these numbers is because there is a possibility
    # of "prisons" (unreachable positions). Therefore it's better to adopt the part 1 code with a sufficiently large number,
    # and part 1 will break early when it realizes that every possible location within one instance has been reached.
    FILLED_AFTER_ODD = solve_for_one_instance((H + W) // 2 * 2 + 1)       # 7748
    FILLED_AFTER_EVEN = solve_for_one_instance((H + W) // 2 * 2)          # 7757 (there are 2 prisons, so it's not 7759)


    # Because you may be crossing over the edge from one instance to another, and you need to know which instance, and what relative r, c coords
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

    # Run the actual analysis for example cases, or for the real input if we are NOT skipping
    if DEBUG or not SKIP_CALCULATION_OF_AREA_VALUES_TO_SAVE_TIME:

      print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

      INSTANCES_THAT_ARE_DONE = {}                                        # mini-optimization: stop processing locations inside filled instances

      locations = { (0, 0): set() }
      if steps % 2 == 0:                                                  # even: start normally
        locations[(0, 0)].add((start_row, start_col))
      else:                                                               # odd: make 1 move in advance
        for (dy, dx) in DELTAS:
          if MAP[start_row + dy][start_col + dx] != WALL:
            locations[(0, 0)].add((start_row + dy, start_col + dx))

      # Cut steps down for real data (we have all the data we need after moving 4 instances out)
      if not DEBUG: steps = start_row + H * 4

      start_n = 1 if steps % 2 == 0 else 2                                # remember to skip first n if odd. then increase n by 2 per loop because we simulate a pair of moves
      for n in range(start_n, steps + 1, 2):

        new_locations = {}
        for (instance_x, instance_y) in locations:
          for (r, c) in locations[(instance_x, instance_y)]:

            # Move n (1-indexed)
            intermediate_locations = {}
            for dy, dx in DELTAS:
              intermediate_neighbor_instance_x, intermediate_neighbor_instance_y, intermediate_neighbor_r, intermediate_neighbor_c = get_new_coords(instance_x, instance_y, r, c, dy, dx)
              if MAP[intermediate_neighbor_r][intermediate_neighbor_c] != WALL:
                if (intermediate_neighbor_instance_x, intermediate_neighbor_instance_y) not in intermediate_locations:
                  intermediate_locations[(intermediate_neighbor_instance_x, intermediate_neighbor_instance_y)] = set()
                intermediate_locations[(intermediate_neighbor_instance_x, intermediate_neighbor_instance_y)].add((intermediate_neighbor_r, intermediate_neighbor_c))

            # Move n + 1 (1-indexed)
            for (intermediate_neighbor_instance_x, intermediate_neighbor_instance_y) in intermediate_locations:
              for (intermediate_neighbor_r, intermediate_neighbor_c) in intermediate_locations[(intermediate_neighbor_instance_x, intermediate_neighbor_instance_y)]:
                for dy, dx in DELTAS:
                  final_neighbor_instance_x, final_neighbor_instance_y, final_neighbor_instance_r, final_neighbor_instance_c = get_new_coords(intermediate_neighbor_instance_x, intermediate_neighbor_instance_y, intermediate_neighbor_r, intermediate_neighbor_c, dy, dx)
                  if MAP[final_neighbor_instance_r][final_neighbor_instance_c] != WALL:
                    if (final_neighbor_instance_x, final_neighbor_instance_y) not in new_locations:
                      new_locations[(final_neighbor_instance_x, final_neighbor_instance_y)] = set()
                    new_locations[(final_neighbor_instance_x, final_neighbor_instance_y)].add((final_neighbor_instance_r, final_neighbor_instance_c))

        for instance in locations:
          instance_x, instance_y = instance
          
          FILLED_NUMBER = (FILLED_AFTER_ODD if steps % 2 == 1 else FILLED_AFTER_EVEN) if instance_x % 2 == instance_y % 2 \
                            else (FILLED_AFTER_EVEN if steps % 2 == 1 else FILLED_AFTER_ODD)

          if len(locations[instance]) == FILLED_NUMBER:
            INSTANCES_THAT_ARE_DONE[instance] = FILLED_NUMBER

        for instance in new_locations.copy():                             # COPY, so you don't modify new_locations itself in the middle of iteration
          if instance in INSTANCES_THAT_ARE_DONE:
            del new_locations[instance]

        locations = new_locations

      # For the examples, we should be able to reach the end via this brute force analysis, so return the total
      if DEBUG:

        total = 0

        # Add incomplete instances to total
        for s in locations.values():
          total += len(s)

        # Add complete instances to total
        for (instance_x, instance_y) in INSTANCES_THAT_ARE_DONE:
          FILLED_NUMBER = (FILLED_AFTER_ODD if steps % 2 == 1 else FILLED_AFTER_EVEN) if instance_x % 2 == instance_y % 2 \
                            else (FILLED_AFTER_EVEN if steps % 2 == 1 else FILLED_AFTER_ODD)
          total += FILLED_NUMBER

        print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
        return total

      # For the real input, measure the key instance types for the final analysis
      else:

        SPECIAL_REGIONS_DATA = {

          SQUARE_FILLED: FILLED_AFTER_ODD,          # 7748
          SQUARE_PRIME_FILLED: FILLED_AFTER_EVEN,   # 7757

          E_BIG: len(locations[(-2, 2)]),           # 6813
          F_BIG: len(locations[(2, 2)]),            # 6804
          G_BIG: len(locations[(2, -2)]),           # 6790
          H_BIG: len(locations[(-2, -2)]),          # 6781

          E_SMALL: len(locations[(-4, 1)]),         # 990
          F_SMALL: len(locations[(4, 1)]),          # 978
          G_SMALL: len(locations[(4, -1)]),         # 977
          H_SMALL: len(locations[(-4, -1)]),        # 996

          A_POINT: len(locations[(0, 4)]),          # 5869
          B_POINT: len(locations[(4, 0)]),          # 5846
          C_POINT: len(locations[(0, -4)]),         # 5823
          D_POINT: len(locations[(-4, 0)]),         # 5846

        }

    else: print('USING PRE-DISCOVERED VALUES TO SAVE TIME')

    # For the real input, now you have all the measured values you need.

    # This refers to the component of the formula for the final count that changes depending on the multiples of grid instances you have stepped out from the initial instance
    # (These values were manually discovered by measuring up to the first 4 grid instances away from the initial instance.)
    VARIABLE_VALUE = {
      SQUARE_FILLED: 3,
      SQUARE_PRIME_FILLED: 4,
      E_BIG: 3,
      F_BIG: 3,
      G_BIG: 3,
      H_BIG: 3,
      E_SMALL: 4,
      F_SMALL: 4,
      G_SMALL: 4,
      H_SMALL: 4,
      A_POINT: 1,
      B_POINT: 1,
      C_POINT: 1,
      D_POINT: 1,
    }

    # This refers to how much the VARIABLE_VALUE increases by every time you step 2 more grid instances away from the initial instance.
    # (These values were manually discovered by measuring up to the first 4 grid instances away from the initial instance.)
    VARIABLE_VALUE_DELTA = {
      SQUARE_FILLED: 2,
      SQUARE_PRIME_FILLED: 2,
      E_BIG: 2,
      F_BIG: 2,
      G_BIG: 2,
      H_BIG: 2,
      E_SMALL: 2,
      F_SMALL: 2,
      G_SMALL: 2,
      H_SMALL: 2,
      A_POINT: 0,
      B_POINT: 0,
      C_POINT: 0,
      D_POINT: 0,
    }

    # Simulate expanding the step count, two grid instances at a time
    for n in range(start_row + H * 4 + 2, ORIGINAL_STEPS + 1, H * 2):
      for item in SPECIAL_REGIONS_DATA:
        VARIABLE_VALUE[item] += VARIABLE_VALUE_DELTA[item]                # with each iteration, increase the variable values by the corresponding deltas

    # (These formulae were manually discovered by measuring up to the first 4 grid instances away from the initial instance.)
    COUNT = {                                                             # 26501365 steps = 65 steps (from middle to edge of initial instance) + 131 steps (width of instance) * 202300
                                                                          # let m = 202300 (the number of grid instances we move out from the initial instance)
      SQUARE_FILLED: VARIABLE_VALUE[SQUARE_FILLED]**2,                    # equals (m - 1)**2, or 40924885401
      SQUARE_PRIME_FILLED: VARIABLE_VALUE[SQUARE_PRIME_FILLED]**2,        # equals m**2, or 40925290000
      E_BIG: VARIABLE_VALUE[E_BIG],                                       # equals m - 1, or 202299
      F_BIG: VARIABLE_VALUE[F_BIG],
      G_BIG: VARIABLE_VALUE[G_BIG],
      H_BIG: VARIABLE_VALUE[H_BIG],
      E_SMALL: VARIABLE_VALUE[E_SMALL],                                   # equals m, or 202300
      F_SMALL: VARIABLE_VALUE[F_SMALL],
      G_SMALL: VARIABLE_VALUE[G_SMALL],
      H_SMALL: VARIABLE_VALUE[H_SMALL],
      A_POINT: VARIABLE_VALUE[A_POINT],                                   # equals 1
      B_POINT: VARIABLE_VALUE[B_POINT],
      C_POINT: VARIABLE_VALUE[C_POINT],
      D_POINT: VARIABLE_VALUE[D_POINT],
    }

    if DISPLAY_EXTRA_INFO:
      print('-- Number of each type: --')
      for item in COUNT:
        print(f"{item}: {COUNT[item]}")

    # Multiply the counts by the measured areas
    total = 0
    for item in COUNT:
      total += floor(COUNT[item] * SPECIAL_REGIONS_DATA[item])

    print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
    return total


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = get_size_of_possible_destinations_after_n_steps
skipped_tests = set([ 2, 3, 4, 5, 6, 7, 8, 9, 10 ])
skipped_tests = set([ 3, 4, 5, 6, 7, 8, 9, 10 ])
skipped_tests = set([ 7, 8, 9, 10 ])
skipped_tests = set([ 8, 9, 10 ])
# skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '/' + (f"day{DAY_NUM}-input.txt" if DAY_NUM else 'template-input.txt')
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
  'input_str': actual_input,
  'steps': 26501365,
}
test_expected = 634549784009844
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

"""
These last 3 tests are included in the problem description but the last one takes a while to run (> 6 mins).

They can be disabled as the problem description's examples are not actually helpful to the problem since the example
data lacks key properties that the actual data have, which is critical to how we solve the problem here. So we have to
brute force it.
"""

# Test case 8
test_input = {
  'part': 2,
  'input_str': sample_input,
  'steps': 500,
}
test_expected = 167004
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 9
test_input = {
  'part': 2,
  'input_str': sample_input,
  'steps': 1000,
}
test_expected = 668697
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 10
test_input = {
  'part': 2,
  'input_str': sample_input,
  'steps': 5000,
}
test_expected = 16733044
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)