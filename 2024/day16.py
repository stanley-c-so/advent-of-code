"""

--- Day 16: Reindeer Maze ---

It's time again for the Reindeer Olympics! This year, the big event is the Reindeer Maze, where the Reindeer compete for the lowest score.

You and The Historians arrive to search for the Chief right as the event is about to start. It wouldn't hurt to watch a little, right?

The Reindeer start on the Start Tile (marked S) facing East and need to reach the End Tile (marked E). They can move forward one tile at a time (increasing their score by 1 point), but never into a wall (#). They can also rotate clockwise or counterclockwise 90 degrees at a time (increasing their score by 1000 points).

To figure out the best place to sit, you start by grabbing a map (your puzzle input) from a nearby kiosk. For example:

###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
There are many paths through this maze, but taking any of the best paths would incur a score of only 7036. This can be achieved by taking a total of 36 steps forward and turning 90 degrees a total of 7 times:


###############
#.......#....E#
#.#.###.#.###^#
#.....#.#...#^#
#.###.#####.#^#
#.#.#.......#^#
#.#.#####.###^#
#..>>>>>>>>v#^#
###^#.#####v#^#
#>>^#.....#v#^#
#^#.#.###.#v#^#
#^....#...#v#^#
#^###.#.#.#v#^#
#S..#.....#>>^#
###############
Here's a second example:

#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
In this maze, the best paths cost 11048 points; following one such path would look like this:

#################
#...#...#...#..E#
#.#.#.#.#.#.#.#^#
#.#.#.#...#...#^#
#.#.#.#.###.#.#^#
#>>v#.#.#.....#^#
#^#v#.#.#.#####^#
#^#v..#.#.#>>>>^#
#^#v#####.#^###.#
#^#v#..>>>>^#...#
#^#v###^#####.###
#^#v#>>^#.....#.#
#^#v#^#####.###.#
#^#v#^........#.#
#^#v#^#########.#
#S#>>^..........#
#################
Note that the path shown above includes one 90 degree turn as the very first move, rotating the Reindeer from facing East to facing North.

Analyze your map carefully. What is the lowest score a Reindeer could possibly get?


--- Part Two ---

Now that you know what the best paths look like, you can figure out the best spot to sit.

Every non-wall tile (S, ., or E) is equipped with places to sit along the edges of the tile. While determining which of these tiles would be the best spot to sit depends on a whole bunch of factors (how comfortable the seats are, how far away the bathrooms are, whether there's a pillar blocking your view, etc.), the most important factor is whether the tile is on one of the best paths through the maze. If you sit somewhere else, you'd miss all the action!

So, you'll need to determine which tiles are part of any best path through the maze, including the S and E tiles.

In the first example, there are 45 tiles (marked O) that are part of at least one of the various best paths through the maze:

###############
#.......#....O#
#.#.###.#.###O#
#.....#.#...#O#
#.###.#####.#O#
#.#.#.......#O#
#.#.#####.###O#
#..OOOOOOOOO#O#
###O#O#####O#O#
#OOO#O....#O#O#
#O#O#O###.#O#O#
#OOOOO#...#O#O#
#O###.#.#.#O#O#
#O..#.....#OOO#
###############
In the second example, there are 64 tiles that are part of at least one of the best paths:

#################
#...#...#...#..O#
#.#.#.#.#.#.#.#O#
#.#.#.#...#...#O#
#.#.#.#.###.#.#O#
#OOO#.#.#.....#O#
#O#O#.#.#.#####O#
#O#O..#.#.#OOOOO#
#O#O#####.#O###O#
#O#O#..OOOOO#OOO#
#O#O###O#####O###
#O#O#OOO#..OOO#.#
#O#O#O#####O###.#
#O#O#OOOOOOO..#.#
#O#O#O#########.#
#O#OOO..........#
#################
Analyze your map further. How many tiles are part of at least one of the best paths through the maze?

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

def best_path_through_maze_with_costs_for_moving_and_turning(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')

  GRID = [ [ c for c in row ] for row in input_arr ]


  # CONSTANTS

  WALL, EMPTY, START, END = '#', '.', 'S', 'E'

  DELTAS = (0, +1), (+1, 0), (0, -1), (-1, 0)                                             # ORDER IS IMPORTANT
                                                                                          # each subsequent delta is a right turn

  COST_GO = 1
  COST_TURN = 1000

  H, W = len(GRID), len(GRID[0])

  start_row, start_col = None, None
  end_row, end_col = None, None
  for row in range(H):
    for col in range(W):
      if GRID[row][col] == START: start_row, start_col = row, col
      if GRID[row][col] == END: end_row, end_col = row, col
  assert (start_row, start_col) != (None, None) and (end_row, end_col) != (None, None)


  # UTILITY

  def draw(ref_set):
    for row in range(H):
      row_to_draw = []
      for col in range(W):
        if (row, col) in ref_set: row_to_draw.append('O')
        else: row_to_draw.append(GRID[row][col])
      print(''.join(row_to_draw))
    print('')


  # DATA STRUCTURES

  VISITED_WITH_LOWEST_COST = {}                                                           # keys: (row, col, curr_dir)
                                                                                          # values: { 'cost': ___, 'prev_landmark': ___ }

  INTERSECTIONS_AND_CORNERS_AND_ENDPOINT = set()                                          # stores all landmarks where you may have to turn (or stop)
  for row in range(H):
    for col in range(W):
      if GRID[row][col] == END:
        INTERSECTIONS_AND_CORNERS_AND_ENDPOINT.add((row, col))                            # landmark: endpoint
      elif GRID[row][col] == EMPTY:
        empty_neighbors = 0
        for dy, dx in DELTAS:
          nr, nc = row + dy, col + dx
          if GRID[nr][nc] == EMPTY:                                                       # assume in bounds as map is always surrounded by wall
            empty_neighbors += 1
        if empty_neighbors > 2:
          INTERSECTIONS_AND_CORNERS_AND_ENDPOINT.add((row, col))                          # landmark: 3- or 4-way intersection
        elif empty_neighbors == 2:
          if GRID[row + 1][col] == EMPTY and GRID[row - 1][col] == EMPTY: continue        # (vertical line - not a corner)
          if GRID[row][col + 1] == EMPTY and GRID[row][col - 1] == EMPTY: continue        # (horizontal line - not a corner)
          INTERSECTIONS_AND_CORNERS_AND_ENDPOINT.add((row, col))                          # landmark: corner

  if DISPLAY_EXTRA_INFO:
    if DEBUG:
      print(f"KEY POINTS (intersections, corners, endpoints):")
      print(f"{INTERSECTIONS_AND_CORNERS_AND_ENDPOINT}")
    print(f"Landmark count: {len(INTERSECTIONS_AND_CORNERS_AND_ENDPOINT)}")
    print('')


  # ANALYZE

  if not DEBUG: print('RUNNING REAL DATA ANALYSIS (PLEASE WAIT)...')
  TIME_AT_START = time.time()

  best_cost = float('inf')
  part_2_reverse_path = []

  stack = [ ( start_row, start_col, 0, 0, None ) ]                                        # initial cost: 0, initial dir: 0, initial prev_landmark: None

  while stack:
    (row, col, curr_dir, cost, prev_landmark) = stack.pop()
    curr_landmark = (row, col, curr_dir)

    # MORE EXPENSIVE: discontinue
    if curr_landmark in VISITED_WITH_LOWEST_COST \
      and VISITED_WITH_LOWEST_COST[curr_landmark]['cost'] < cost:

      continue

    # EQUALLY AS EXPENSIVE: discontinue (IMPORTANT!), but first, update prev_landmark
    elif curr_landmark in VISITED_WITH_LOWEST_COST \
      and VISITED_WITH_LOWEST_COST[curr_landmark]['cost'] == cost:

      VISITED_WITH_LOWEST_COST[curr_landmark]['prev_landmark'].add(prev_landmark)
      continue

    # CHEAPER: init if needed...
    if curr_landmark not in VISITED_WITH_LOWEST_COST:
      VISITED_WITH_LOWEST_COST[curr_landmark] = {
        'cost': float('inf'),
        'prev_landmark': set(),
      }
    # ...then set/update cost and prev_landmark...
    VISITED_WITH_LOWEST_COST[curr_landmark]['cost'] = cost
    VISITED_WITH_LOWEST_COST[curr_landmark]['prev_landmark'] = { prev_landmark }

    # ...then explore

    # BASE CASE: REACHED END
    if GRID[row][col] == END:

      best_cost = min(best_cost, cost)

      part_2_reverse_path.append(curr_landmark)

    # RECURSIVE CASE: YOU MUST BE AT THE START, OR AT A LANDMARK
    else:

      # Attempt to go forward in current dir
      dy, dx = DELTAS[curr_dir]
      r, c = row + dy, col + dx
      next_cost = cost + COST_GO
      while GRID[r][c] != WALL and (r, c) not in INTERSECTIONS_AND_CORNERS_AND_ENDPOINT:  # assume in bounds as map is always surrounded by wall
        r += dy
        c += dx
        next_cost += COST_GO
      if GRID[r][c] != WALL:                                                              # assume in bounds as map is always surrounded by wall
        stack.append((r, c, curr_dir, next_cost, curr_landmark))                          # only continue search if you haven't collided with a wall

      # Also attempt to turn right and left
      for i in (1, 3):
        next_dir = (curr_dir + i) % 4
        stack.append((row, col, next_dir, cost + COST_TURN, curr_landmark))
      
      # No need to attempt to turn 180

  if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")

  if part == 1:                                                                           # PART 1: GET BEST COST TO REACH THE END

    return best_cost
  
  else:                                                                                   # PART 2: GET TOTAL AREA OF ALL BEST PATHS TO THE END

    part_2_output = { (end_row, end_col) }                                                # init with endpoint included

    part_2_reverse_path = [                                                               # filter out states that did not achieve best cost
      final_landmark for final_landmark in part_2_reverse_path
      if VISITED_WITH_LOWEST_COST[final_landmark]['cost'] == best_cost
    ]

    visited = set()
    while part_2_reverse_path:
      landmark = part_2_reverse_path.pop()
      if landmark in visited or landmark == None: continue                                # landmark can be None when reaching start position
      visited.add(landmark)

      (row, col, curr_dir) = landmark

      for prev_landmark in VISITED_WITH_LOWEST_COST[landmark]['prev_landmark']:
        if prev_landmark == None:                                                         # when reaching start
          continue
        elif row == prev_landmark[0] and col == prev_landmark[1]:                         # previous move was a 90 degree turn
          part_2_reverse_path.append(prev_landmark)
        else:                                                                             # retrace path to prev_landmark
          r, c = row, col
          while not (r == prev_landmark[0] and c == prev_landmark[1]):
            r -= DELTAS[curr_dir][0]
            c -= DELTAS[curr_dir][1]
            part_2_output.add((r, c))
          part_2_reverse_path.append((r, c, curr_dir))

    if DISPLAY_EXTRA_INFO:
      draw(part_2_output)

    return len(part_2_output)


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = best_path_through_maze_with_costs_for_moving_and_turning
skipped_tests = set([ 3, 4, 5, 6 ])
skipped_tests = set([ 4, 5, 6 ])
skipped_tests = set([ 3, 6 ])
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
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############"""

sample_input2 = """#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 7036
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = 11048
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 65436
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 45
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 5
test_input = {
  'part': 2,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = 64
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 6
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 489
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)