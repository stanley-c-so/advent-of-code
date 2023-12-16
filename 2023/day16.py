"""

--- Day 16: The Floor Will Be Lava ---

With the beam of light completely focused somewhere, the reindeer leads you deeper still into the Lava Production Facility. At some point, you realize that the steel facility walls have been replaced with cave, and the doorways are just cave, and the floor is cave, and you're pretty sure this is actually just a giant cave.

Finally, as you approach what must be the heart of the mountain, you see a bright light in a cavern up ahead. There, you discover that the beam of light you so carefully focused is emerging from the cavern wall closest to the facility and pouring all of its energy into a contraption on the opposite side.

Upon closer inspection, the contraption appears to be a flat, two-dimensional square grid containing empty space (.), mirrors (/ and \), and splitters (| and -).

The contraption is aligned so that most of the beam bounces around the grid, but each tile on the grid converts some of the beam's light into heat to melt the rock in the cavern.

You note the layout of the contraption (your puzzle input). For example:

.|...\....
|.-.\.....
.....|-...
........|.
..........
.........\
..../.\\..
.-.-/..|..
.|....-|.\
..//.|....

The beam enters in the top-left corner from the left and heading to the right. Then, its behavior depends on what it encounters as it moves:

    If the beam encounters empty space (.), it continues in the same direction.
    If the beam encounters a mirror (/ or \), the beam is reflected 90 degrees depending on the angle of the mirror. For instance, a rightward-moving beam that encounters a / mirror would continue upward in the mirror's column, while a rightward-moving beam that encounters a \ mirror would continue downward from the mirror's column.
    If the beam encounters the pointy end of a splitter (| or -), the beam passes through the splitter as if the splitter were empty space. For instance, a rightward-moving beam that encounters a - splitter would continue in the same direction.
    If the beam encounters the flat side of a splitter (| or -), the beam is split into two beams going in each of the two directions the splitter's pointy ends are pointing. For instance, a rightward-moving beam that encounters a | splitter would split into two beams: one that continues upward from the splitter's column and one that continues downward from the splitter's column.

Beams do not interact with other beams; a tile can have many beams passing through it at the same time. A tile is energized if that tile has at least one beam pass through it, reflect in it, or split in it.

In the above example, here is how the beam of light bounces around the contraption:

>|<<<\....
|v-.\^....
.v...|->>>
.v...v^.|.
.v...v^...
.v...v^..\
.v../2\\..
<->-/vv|..
.|<<<2-|.\
.v//.|.v..

Beams are only shown on empty tiles; arrows indicate the direction of the beams. If a tile contains beams moving in multiple directions, the number of distinct directions is shown instead. Here is the same diagram but instead only showing whether a tile is energized (#) or not (.):

######....
.#...#....
.#...#####
.#...##...
.#...##...
.#...##...
.#..####..
########..
.#######..
.#...#.#..

Ultimately, in this example, 46 tiles become energized.

The light isn't energizing enough tiles to produce lava; to debug the contraption, you need to start by analyzing the current situation. With the beam starting in the top-left heading right, how many tiles end up being energized?


--- Part Two ---

As you try to work out what might be wrong, the reindeer tugs on your shirt and leads you to a nearby control panel. There, a collection of buttons lets you align the contraption so that the beam enters from any edge tile and heading away from that edge. (You can choose either of two directions for the beam if it starts on a corner; for instance, if the beam starts in the bottom-right corner, it can start heading either left or upward.)

So, the beam could start on any tile in the top row (heading downward), any tile in the bottom row (heading upward), any tile in the leftmost column (heading right), or any tile in the rightmost column (heading left). To produce lava, you need to find the configuration that energizes as many tiles as possible.

In the above example, this can be achieved by starting the beam in the fourth tile from the left in the top row:

.|<2<\....
|v-v\^....
.v.v.|->>>
.v.v.v^.|.
.v.v.v^...
.v.v.v^..\
.v.v/2\\..
<-2-/vv|..
.|<<<2-|.\
.v//.|.v..

Using this configuration, 51 tiles are energized:

.#####....
.#.#.#....
.#.#.#####
.#.#.##...
.#.#.##...
.#.#.##...
.#.#####..
########..
.#######..
.#...#.#..

Find the initial beam configuration that energizes the largest number of tiles; how many tiles are energized in that configuration?


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

def run_a_laser_through_grid_of_mirrors(part, input_str, DEBUG = False):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  MAP = [ [ c for c in row ] for row in input_arr ]


  # CONSTANTS

  H, W = len(MAP), len(MAP[0])

  U, D, L, R, SPACE, SLASH, BACKSLASH, PIPE, DASH = 'U', 'D', 'L', 'R', '.', '/', '\\', '|', '-'

  DELTAS = {
    U: (-1, 0),
    D: (+1, 0),
    L: (0, -1),
    R: (0, +1),
  }


  # HELPER FUNCTION

  def fire_beam(start_row, start_col, start_dir, max_tiles):

    # Verify that the beam is being fired from an edge
    assert start_row == 0 \
            or start_row == H - 1 \
            or start_col == 0 \
            or start_col == W - 1

    # A NOTE ABOUT THESE SETS:
    #
    # As seen in the example, the laser will turn back upon itself and revisit old coordinates with the same direction.
    #
    # In other words, *the laser simulation will never end* because the laser does not simply escape; there will be some neverending cycle.
    #
    # Since we ultimately only care about counting tiles that get visited by a laser, for our purposes we can stop simulating a beam
    # that has a state we have seen before. A state includes both a position (r, c) and direction.
    #
    # The `visited_states` set tracks these states (r, c, direction).
    #
    # However, ultimately, when we count the visited tiles, if we simply count the size of `visited_states`, we may be over counting because
    # it will almost certainly contain different elements that have the same coords (r, c) but different directions.
    #
    # Therefore we will also keep track of a separate set, `visited_coords`, which only stores coords. The size of this set is the output.

    visited_states = set()                                        # elements are (r, c, dir)
    visited_coords = set()                                        # elements are (r, c)

    # Helper function
    def process(stack, r, c, new_dir):
      dy, dx = DELTAS[new_dir]
      new_r, new_c = r + dy, c + dx
      if 0 <= new_r < H and 0 <= new_c < W:
        stack.append( (new_r, new_c, new_dir) )

    # DFS
    stack = [ (start_row, start_col, start_dir) ]
    while stack:

      # Extract data from node and make validations
      r, c, direction = stack.pop()
      assert direction in (U, D, L, R)
      assert MAP[r][c] in (SPACE, SLASH, BACKSLASH, PIPE, DASH)

      # Serialize and check against memo
      serial = (r, c, direction)
      if (serial in visited_states): continue
      visited_states.add(serial)
      visited_coords.add((r, c))

      match MAP[r][c]:

        case '.':                                                 # beam passes through
          process(stack, r, c, direction)

        case '/':
          if direction == U:                                      # beam redirected U --> R
            process(stack, r, c, R)
          elif direction == D:                                    # beam redirected D --> L
            process(stack, r, c, L)
          elif direction == L:                                    # beam redirected L --> D
            process(stack, r, c, D)
          elif direction == R:                                    # beam redirected R --> U
            process(stack, r, c, U)

        case '\\':
          if direction == U:                                      # beam redirected U --> L
            process(stack, r, c, L)
          elif direction == D:                                    # beam redirected D --> R
            process(stack, r, c, R)
          elif direction == L:                                    # beam redirected L --> U
            process(stack, r, c, U)
          elif direction == R:                                    # beam redirected R --> D
            process(stack, r, c, D)

        case '|':
          if direction in (U, D):                                 # beam passes through
            process(stack, r, c, direction)
          elif direction in (L, R):                               # beam gets split
            process(stack, r, c, U)
            process(stack, r, c, D)

        case '-':
          if direction in (U, D):                                 # beam gets split
            process(stack, r, c, L)
            process(stack, r, c, R)
          elif direction in (L, R):                               # beam passes through
            process(stack, r, c, direction)

    if DISPLAY_EXTRA_INFO and len(visited_coords) > max_tiles:
      BEAM = '#'
      print(f"Energized tiles: {len(visited_coords)}")
      for r in range(H):
        output = ''
        for c in range(W):
          output += BEAM if (r, c) in visited_coords else SPACE
        print(output)
      print('')

    return len(visited_coords)


  # ANALYZE

  TIME_AT_START = time.time()

  max_tiles = 0

  if part == 1:

    return fire_beam(0, 0, R, max_tiles)

  else:

    if not DEBUG: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

    # try top edge going D
    for c in range(W):
      res = fire_beam(0, c, D, max_tiles)
      if res > max_tiles:
        max_tiles = res
        print(f"NEW RECORD: {res} BY FIRING DOWN AT {0}, {c}")

    # try bottom edge going U
    for c in range(W):
      res = fire_beam(H - 1, c, U, max_tiles)
      if res > max_tiles:
        max_tiles = res
        print(f"NEW RECORD: {res} BY FIRING UP AT {H - 1}, {c}")

    # try left edge going R
    for r in range(H):
      res = fire_beam(r, 0, R, max_tiles)
      if res > max_tiles:
        max_tiles = res
        print(f"NEW RECORD: {res} BY FIRING RIGHT AT {r}, {0}")

    # try right edge going L
    for r in range(H):
      res = fire_beam(r, W - 1, L, max_tiles)
      if res > max_tiles:
        max_tiles = res
        print(f"NEW RECORD: {res} BY FIRING LEFT AT {W - 1}, {0}")

    if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
    return max_tiles


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = run_a_laser_through_grid_of_mirrors
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

# NOTE: HAD TO MANUALLY ADD EXTRA BACKSLASH IN ROWS 5, 6, 8 SO IT DOESN'T INTERPRET IT AS AN ESCAPE CHARACTER.
# HOWEVER, THERE WAS NO NEED TO MODIFY THE ACTUAL DATA IN THIS WAY.
sample_input = """.|...\....
|.-.\.....
.....|-...
........|.
..........
.........\\
..../.\\\..
.-.-/..|..
.|....-|.\\
..//.|...."""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 46
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 8539
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 51
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 8674
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)