"""

--- Day 6: Guard Gallivant ---

The Historians use their fancy device again, this time to whisk you all away to the North Pole prototype suit manufacturing lab... in the year 1518! It turns out that having direct access to history is very convenient for a group of historians.

You still have to be careful of time paradoxes, and so it will be important to avoid anyone from 1518 while The Historians search for the Chief. Unfortunately, a single guard is patrolling this part of the lab.

Maybe you can work out where the guard will go ahead of time so that The Historians can search safely?

You start by making a map (your puzzle input) of the situation. For example:

....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
The map shows the current position of the guard with ^ (to indicate the guard is currently facing up from the perspective of the map). Any obstructions - crates, desks, alchemical reactors, etc. - are shown as #.

Lab guards in 1518 follow a very strict patrol protocol which involves repeatedly following these steps:

If there is something directly in front of you, turn right 90 degrees.
Otherwise, take a step forward.
Following the above protocol, the guard moves up several times until she reaches an obstacle (in this case, a pile of failed suit prototypes):

....#.....
....^....#
..........
..#.......
.......#..
..........
.#........
........#.
#.........
......#...
Because there is now an obstacle in front of the guard, she turns right before continuing straight in her new facing direction:

....#.....
........>#
..........
..#.......
.......#..
..........
.#........
........#.
#.........
......#...
Reaching another obstacle (a spool of several very long polymers), she turns right again and continues downward:

....#.....
.........#
..........
..#.......
.......#..
..........
.#......v.
........#.
#.........
......#...
This process continues for a while, but the guard eventually leaves the mapped area (after walking past a tank of universal solvent):

....#.....
.........#
..........
..#.......
.......#..
..........
.#........
........#.
#.........
......#v..
By predicting the guard's route, you can determine which specific positions in the lab will be in the patrol path. Including the guard's starting position, the positions visited by the guard before leaving the area are marked with an X:

....#.....
....XXXXX#
....X...X.
..#.X...X.
..XXXXX#X.
..X.X.X.X.
.#XXXXXXX.
.XXXXXXX#.
#XXXXXXX..
......#X..
In this example, the guard will visit 41 distinct positions on your map.

Predict the path of the guard. How many distinct positions will the guard visit before leaving the mapped area?


--- Part Two ---

While The Historians begin working around the guard's patrol route, you borrow their fancy device and step outside the lab. From the safety of a supply closet, you time travel through the last few months and record the nightly status of the lab's guard post on the walls of the closet.

Returning after what seems like only a few seconds to The Historians, they explain that the guard's patrol area is simply too large for them to safely search the lab without getting caught.

Fortunately, they are pretty sure that adding a single new obstruction won't cause a time paradox. They'd like to place the new obstruction in such a way that the guard will get stuck in a loop, making the rest of the lab safe to search.

To have the lowest chance of creating a time paradox, The Historians would like to know all of the possible positions for such an obstruction. The new obstruction can't be placed at the guard's starting position - the guard is there right now and would notice.

In the above example, there are only 6 different positions where a new obstruction would cause the guard to get stuck in a loop. The diagrams of these six situations use O to mark the new obstruction, | to show a position where the guard moves up/down, - to show a position where the guard moves left/right, and + to show a position where the guard moves both up/down and left/right.

Option one, put a printing press next to the guard's starting position:

....#.....
....+---+#
....|...|.
..#.|...|.
....|..#|.
....|...|.
.#.O^---+.
........#.
#.........
......#...
Option two, put a stack of failed suit prototypes in the bottom right quadrant of the mapped area:


....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
......O.#.
#.........
......#...
Option three, put a crate of chimney-squeeze prototype fabric next to the standing desk in the bottom right quadrant:

....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
.+----+O#.
#+----+...
......#...
Option four, put an alchemical retroencabulator near the bottom left corner:

....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
..|...|.#.
#O+---+...
......#...
Option five, put the alchemical retroencabulator a bit to the right instead:

....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
....|.|.#.
#..O+-+...
......#...
Option six, put a tank of sovereign glue right next to the tank of universal solvent:

....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
.+----++#.
#+----++..
......#O..
It doesn't really matter what you choose to use as an obstacle so long as you and The Historians can put it into position without the guard noticing. The important thing is having enough options that you can find one that minimizes time paradoxes, and in this example, there are 6 different positions you could choose.

You need to get the guard stuck in a loop by adding a single new obstruction. How many different positions could you choose for this obstruction?

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

def analyze_movement_within_grid_with_obstacles(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  GRID = [ [ c for c in row ] for row in input_arr ]


  # CONSTANTS

  H, W = len(GRID), len(GRID[0])

  UP, DOWN, LEFT, RIGHT = '^', 'v', '<', '>'
  WALL, EMPTY = '#', '.'

  DELTAS_BY_SYMBOL = {
    UP    : (-1, 0),
    DOWN  : (+1, 0),
    LEFT  : (0, -1),
    RIGHT : (0, +1),
  }

  TURN_RIGHT_BY_DELTAS = {
    DELTAS_BY_SYMBOL[UP]    : DELTAS_BY_SYMBOL[RIGHT],
    DELTAS_BY_SYMBOL[DOWN]  : DELTAS_BY_SYMBOL[LEFT],
    DELTAS_BY_SYMBOL[LEFT]  : DELTAS_BY_SYMBOL[UP],
    DELTAS_BY_SYMBOL[RIGHT] : DELTAS_BY_SYMBOL[DOWN],
  }


  # INIT AND EXAMINE INPUT

  start_r, start_c = None, None
  start_deltas = None
  
  for row in range(H):
    for col in range(W):
      if GRID[row][col] in (UP, DOWN, LEFT, RIGHT):
        start_r, start_c = row, col
        start_deltas = DELTAS_BY_SYMBOL[GRID[row][col]]
        break

  if None in (start_r, start_c, start_deltas): assert False


  # UTILITY

  def in_bounds(r, c):
    return 0 <= r < H and 0 <= c < W

  def simulate_until_oob_or_loop(r, c, deltas):

    visited = {}

    while in_bounds(r, c):

      if (r, c) not in visited: visited[(r, c)] = set()
      if deltas in visited[(r, c)]:
        return { "visited_data": visited, "loop": True }                        # loop detected
      visited[(r, c)].add(deltas)

      dy, dx = deltas
      next_r, next_c = r + dy, c + dx
      if in_bounds(next_r, next_c) and GRID[next_r][next_c] == WALL:
        deltas = TURN_RIGHT_BY_DELTAS[deltas]
      else:
        r, c = next_r, next_c

    return { "visited_data": visited, "loop": False }                           # oob


  # ANALYZE

  TIME_AT_START = time.time()

  res = simulate_until_oob_or_loop(start_r, start_c, start_deltas)
  guard_original_path_coords = list(res["visited_data"].keys())

  if part == 1:                                                                 # PART 1: get total number of spaces visited before oob

    if DISPLAY_EXTRA_INFO:
      print(f"Grid size:")
      print(f"H = {H}")
      print(f"W = {W}")

      guard_original_path_coords_set = set(guard_original_path_coords)

      for row in range(H):
        GUARD_PATH = 'o'
        line = []
        for col in range(W):
          point = input_arr[row][col]
          line.append(point if point != EMPTY else GUARD_PATH if (row, col) in guard_original_path_coords_set else EMPTY)
        print(''.join(line))

    return len(guard_original_path_coords)

  else:                                                                         # PART 2: count number of spaces which, if turned into wall, would cause loop

    if not DEBUG: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

    total = 0

    for (row, col) in guard_original_path_coords:                               # it only makes sense to consider blocking spaces along guard's original path
      if (row, col) == (start_r, start_c): continue                             # do not count the guard's starting position
      if GRID[row][col] == WALL: continue
      GRID[row][col] = WALL
      res = simulate_until_oob_or_loop(start_r, start_c, start_deltas)
      if res["loop"]: total += 1
      GRID[row][col] = EMPTY

    if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")     # ~5.92 seconds
    return total


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = analyze_movement_within_grid_with_obstacles
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

sample_input = """....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#..."""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 41
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 4433
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 6
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 1516
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)