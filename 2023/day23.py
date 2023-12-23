"""

--- Day 23: A Long Walk ---

The Elves resume water filtering operations! Clean water starts flowing over the edge of Island Island.

They offer to help you go over the edge of Island Island, too! Just hold on tight to one end of this impossibly long rope and they'll lower you down a safe distance from the massive waterfall you just created.

As you finally reach Snow Island, you see that the water isn't really reaching the ground: it's being absorbed by the air itself. It looks like you'll finally have a little downtime while the moisture builds up to snow-producing levels. Snow Island is pretty scenic, even without any snow; why not take a walk?

There's a map of nearby hiking trails (your puzzle input) that indicates paths (.), forest (#), and steep slopes (^, >, v, and <).

For example:

#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#

You're currently on the single path tile in the top row; your goal is to reach the single path tile in the bottom row. Because of all the mist from the waterfall, the slopes are probably quite icy; if you step onto a slope tile, your next step must be downhill (in the direction the arrow is pointing). To make sure you have the most scenic hike possible, never step onto the same tile twice. What is the longest hike you can take?

In the example above, the longest hike you can take is marked with O, and your starting position is marked S:

#S#####################
#OOOOOOO#########...###
#######O#########.#.###
###OOOOO#OOO>.###.#.###
###O#####O#O#.###.#.###
###OOOOO#O#O#.....#...#
###v###O#O#O#########.#
###...#O#O#OOOOOOO#...#
#####.#O#O#######O#.###
#.....#O#O#OOOOOOO#...#
#.#####O#O#O#########v#
#.#...#OOO#OOO###OOOOO#
#.#.#v#######O###O###O#
#...#.>.#...>OOO#O###O#
#####v#.#.###v#O#O###O#
#.....#...#...#O#O#OOO#
#.#########.###O#O#O###
#...###...#...#OOO#O###
###.###.#.###v#####O###
#...#...#.#.>.>.#.>O###
#.###.###.#.###.#.#O###
#.....###...###...#OOO#
#####################O#

This hike contains 94 steps. (The other possible hikes you could have taken were 90, 86, 82, 82, and 74 steps long.)

Find the longest hike you can take through the hiking trails listed on your map. How many steps long is the longest hike?


--- Part Two ---

As you reach the trailhead, you realize that the ground isn't as slippery as you expected; you'll have no problem climbing up the steep slopes.

Now, treat all slopes as if they were normal paths (.). You still want to make sure you have the most scenic hike possible, so continue to ensure that you never step onto the same tile twice. What is the longest hike you can take?

In the example above, this increases the longest hike to 154 steps:

#S#####################
#OOOOOOO#########OOO###
#######O#########O#O###
###OOOOO#.>OOO###O#O###
###O#####.#O#O###O#O###
###O>...#.#O#OOOOO#OOO#
###O###.#.#O#########O#
###OOO#.#.#OOOOOOO#OOO#
#####O#.#.#######O#O###
#OOOOO#.#.#OOOOOOO#OOO#
#O#####.#.#O#########O#
#O#OOO#...#OOO###...>O#
#O#O#O#######O###.###O#
#OOO#O>.#...>O>.#.###O#
#####O#.#.###O#.#.###O#
#OOOOO#...#OOO#.#.#OOO#
#O#########O###.#.#O###
#OOO###OOO#OOO#...#O###
###O###O#O###O#####O###
#OOO#OOO#O#OOO>.#.>O###
#O###O###O#O###.#.#O###
#OOOOO###OOO###...#OOO#
#####################O#

Find the longest hike you can take through the surprisingly dry hiking trails listed on your map. How many steps long is the longest hike?


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

def get_longest_path_through_maze_without_revisiting(part, input_str, DEBUG = False):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  MAP = [ [ c for c in row ] for row in input_arr ]


  # CONSTANTS

  SPACE, FOREST = '.', '#'
  U, D, L, R = '^', 'v', '<', '>'

  DELTAS = {
    U: (-1, 0),
    D: (+1, 0),
    L: (0, -1),
    R: (0, +1),
  }

  H, W = len(MAP), len(MAP[0])

  start_row = 0
  end_row = H - 1

  start_col = None
  for c in range(W):
    if MAP[start_row][c] == SPACE:
      start_col = c
      break

  end_col = None
  for c in range(W):
    if MAP[end_row][c] == SPACE:
      end_col = c
      break


  # SET RECURSION LIMIT - see https://stackoverflow.com/questions/14222416/recursion-in-python-runtimeerror-maximum-recursion-depth-exceeded-while-callin
  #
  # Apparently in Python, recursion is limited to 999 calls by default (and I was seeing this problem). Check it by calling `sys.getrecursionlimit()`.
  # I got 1000.
  #
  # The easiest workaround is to call `sys.recursionlimit(n)` where n is the new limit. The highest limit allowed depends on your platform. In my case,
  # I reasoned that the recursion depth equals the path length, and the longest path could not be any longer than the area of the grid, so I set it to H*W
  # and it was fine.
  
  setrecursionlimit(H*W)


  # ANALYZE

  TIME_AT_START = time.time()

  if part == 1:                                                               # PART 1: SLOPES ENFORCE ONE-WAY TRAVEL

    # Init
    longest_path = 0
    visited = set()

    # Backtrack function
    def backtrack(r, c, moves):
      nonlocal longest_path                                                   # since `longest_path` is primitive, we need to indicate that we are
                                                                              # referring to a primitive variable not local to the `backtrack` function

      # Edge cases
      if not (0 <= r < H and 0 <= c < W): return                              # EDGE CASE: out of bounds
      if MAP[r][c] == FOREST: return                                          # EDGE CASE: invalid move into a forest
      if (r, c) in visited: return                                            # EDGE CASE: already visited this location

      # Mark visited
      visited.add((r, c))

      if r == end_row and c == end_col:                                       # BASE CASE: reached end
        longest_path = max(longest_path, moves)
      elif part == 1 and MAP[r][c] == U:                                      # enforce up and backtrack
        backtrack(r - 1, c, moves + 1)
      elif part == 1 and MAP[r][c] == D:                                      # enforce down and backtrack
        backtrack(r + 1, c, moves + 1)
      elif part == 1 and MAP[r][c] == L:                                      # enforce left and backtrack
        backtrack(r, c - 1, moves + 1)
      elif part == 1 and MAP[r][c] == R:                                      # enforce right and backtrack
        backtrack(r, c + 1, moves + 1)
      else:                                                                   # try all moves and backtrack
        for dy, dx in DELTAS.values():
          backtrack(r + dy, c + dx, moves + 1)

      # Unmark visited before returning
      visited.remove((r, c))

    backtrack(start_row, start_col, 0)                                        # kick-start backtrack
    return longest_path

  else:                                                                       # PART 2: SLOPES ARE NO LONGER ONE-WAY, MEANING THE POSSIBILITY SPACE HAS
                                                                              # NOW INCREASED DRAMATICALLY. OUR PART 1 SOLUTION WILL BE TOO SLOW FOR THE
                                                                              # REAL INPUT, SO WE NEED TO SIMPLIFY THIS PROBLEM DOWN ANOTHER WAY.

    """
    Notice that the map is essentially a maze with narrow corridors. Very often, as you walk along a hallway, you have no choice of where to go
    but to continue along the hallway.

    The only time you have any choice is when you reach a "fork". Forks are characterized by the fact that they have more than 2 (usually 3, but
    possibly even 4!) neighboring empty spaces. Therefore, the movement through this maze can be simplified down to the movement between "fork" nodes.
    Forks can easily be found by scanning the map for all spaces with more than 2 neighbors. Luckily, a solid wall of forest surrounds the entire map
    (except for the start and end). Speaking of the start and end, while these do not fit the above definition of a fork, for purposes of modeling our
    map traversal as a graph traversal between nodes, we should consider start and end to be "fork" nodes as well: every other fork will have 3 or 4
    connections to other nodes, but only the start and end nodes will have exactly 1 connection.

    We need to do some initial exploratory work to figure out the lengths of the edges connecting the forks, but once we have that information, we can
    essentially repeat the same basic backtracking idea from part 1, except we are essentially instantly teleporting from intersection to intersection,
    instead of moving only one step at a time!
    """

    if not DEBUG: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

    # Data structures: FORKS, FORKS_SET, FORKS_REVERSE_LOOKUP, GRAPH
    # NOTE: Manually add in the start and end locations as "forks"
    FORKS = [ (start_row, start_col), (end_row, end_col) ]                    # we need some way of identifying each fork. we can use an index. so we use a list
    FORKS_SET = { (start_row, start_col), (end_row, end_col) }                # we can also use a set for O(1) lookup whether a location is a fork or not

    # Search map for forks
    # NOTE: We will not detect start and end locations here, so we added them manually earlier
    for r in range(1, H - 1):
      for c in range(1, W - 1):
        if MAP[r][c] != FOREST:
          num_neighbors = 0
          for dy, dx in DELTAS.values():
            if MAP[r + dy][c + dx] != FOREST:
              num_neighbors += 1
          if num_neighbors > 2:                                               # a fork is any non-forest location with more than 2 neighboring spaces
            FORKS.append((r, c))
            FORKS_SET.add((r, c))

    FORKS_REVERSE_LOOKUP = {}                                                 # allows us to get the index of a fork if we know its coordinates
    for i in range(len(FORKS)):
      fork = FORKS[i]
      FORKS_REVERSE_LOOKUP[fork] = i

    GRAPH = [ {} for _ in FORKS ]                                             # dict keys are neighboring fork indices; values are edge distances

    # Helper function
    def explore_fork(fork):
      fork_r, fork_c = fork
      fork_i = FORKS_REVERSE_LOOKUP[fork]
      stack = [ (fork_r, fork_c, 0) ]
      visited = set()
      while stack:
        r, c, moves = stack.pop()
        if (r, c) in FORKS_SET and (r, c) != fork:
          other_fork_i = FORKS_REVERSE_LOOKUP[(r, c)]
          GRAPH[fork_i][other_fork_i] = moves
          GRAPH[other_fork_i][fork_i] = moves
          continue
        visited.add((r, c))
        for dy, dx in DELTAS.values():
          new_r, new_c = r + dy, c + dx
          if MAP[new_r][new_c] != FOREST and (new_r, new_c) not in visited:
            stack.append((new_r, new_c, moves + 1))

    # Kick-start fork exploration to get edge distances
    for i in range(2, len(FORKS)):                                            # skip indices 0 and 1 because those are the start and end.
                                                                              # whatever connects to those, we will automatically pick up when exploring those
      explore_fork(FORKS[i])

    # Finally, backtrack through graph representation of maze. Move from fork to fork.
      
    longest_path = 0
    visited = set()

    def backtrack(i, moves):
      nonlocal longest_path

      if i in visited: return                                                 # EDGE CASE
      visited.add(i)

      if i == 1:                                                              # BASE CASE: end has index 1 (and start has index 0) since we manually added these
        longest_path = max(longest_path, moves)
      else:
        for neighbor_i in GRAPH[i]:
          backtrack(neighbor_i, moves + GRAPH[i][neighbor_i])

      visited.remove(i)

    backtrack(0, 0)
    if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")   # real input takes just over 11 seconds
    return longest_path


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = get_longest_path_through_maze_without_revisiting
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

sample_input = """#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 94
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 2194
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 154
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 6410
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)