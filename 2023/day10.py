"""

--- Day 10: Pipe Maze ---

You use the hang glider to ride the hot air from Desert Island all the way up to the floating metal island. This island is surprisingly cold and there definitely aren't any thermals to glide on, so you leave your hang glider behind.

You wander around for a while, but you don't find any people or animals. However, you do occasionally find signposts labeled "Hot Springs" pointing in a seemingly consistent direction; maybe you can find someone at the hot springs and ask them where the desert-machine parts are made.

The landscape here is alien; even the flowers and trees are made of metal. As you stop to admire some metal grass, you notice something metallic scurry away in your peripheral vision and jump into a big pipe! It didn't look like any animal you've ever seen; if you want a better look, you'll need to get ahead of it.

Scanning the area, you discover that the entire field you're standing on is densely packed with pipes; it was hard to tell at first because they're the same metallic silver color as the "ground". You make a quick sketch of all of the surface pipes you can see (your puzzle input).

The pipes are arranged in a two-dimensional grid of tiles:

    | is a vertical pipe connecting north and south.
    - is a horizontal pipe connecting east and west.
    L is a 90-degree bend connecting north and east.
    J is a 90-degree bend connecting north and west.
    7 is a 90-degree bend connecting south and west.
    F is a 90-degree bend connecting south and east.
    . is ground; there is no pipe in this tile.
    S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.

Based on the acoustics of the animal's scurrying, you're confident the pipe that contains the animal is one large, continuous loop.

For example, here is a square loop of pipe:

.....
.F-7.
.|.|.
.L-J.
.....

If the animal had entered this loop in the northwest corner, the sketch would instead look like this:

.....
.S-7.
.|.|.
.L-J.
.....

In the above diagram, the S tile is still a 90-degree F bend: you can tell because of how the adjacent pipes connect to it.

Unfortunately, there are also many pipes that aren't connected to the loop! This sketch shows the same loop as above:

-L|F7
7S-7|
L|7||
-L-J|
L|-JF

In the above diagram, you can still figure out which pipes form the main loop: they're the ones connected to S, pipes those pipes connect to, pipes those pipes connect to, and so on. Every pipe in the main loop connects to its two neighbors (including S, which will have exactly two pipes connecting to it, and which is assumed to connect back to those two pipes).

Here is a sketch that contains a slightly more complex main loop:

..F7.
.FJ|.
SJ.L7
|F--J
LJ...

Here's the same example sketch with the extra, non-main-loop pipe tiles also shown:

7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ

If you want to get out ahead of the animal, you should find the tile in the loop that is farthest from the starting position. Because the animal is in the pipe, it doesn't make sense to measure this by direct distance. Instead, you need to find the tile that would take the longest number of steps along the loop to reach from the starting point - regardless of which way around the loop the animal went.

In the first example with the square loop:

.....
.S-7.
.|.|.
.L-J.
.....

You can count the distance each tile in the loop is from the starting point like this:

.....
.012.
.1.3.
.234.
.....

In this example, the farthest point from the start is 4 steps away.

Here's the more complex loop again:

..F7.
.FJ|.
SJ.L7
|F--J
LJ...

Here are the distances for each tile on that loop:

..45.
.236.
01.78
14567
23...

Find the single giant loop starting at S. How many steps along the loop does it take to get from the starting position to the point farthest from the starting position?


--- Part Two ---

You quickly reach the farthest point of the loop, but the animal never emerges. Maybe its nest is within the area enclosed by the loop?

To determine whether it's even worth taking the time to search for such a nest, you should calculate how many tiles are contained within the loop. For example:

...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........

The above loop encloses merely four tiles - the two pairs of . in the southwest and southeast (marked I below). The middle . tiles (marked O below) are not in the loop. Here is the same loop again with those regions marked:

...........
.S-------7.
.|F-----7|.
.||OOOOO||.
.||OOOOO||.
.|L-7OF-J|.
.|II|O|II|.
.L--JOL--J.
.....O.....

In fact, there doesn't even need to be a full tile path to the outside for tiles to count as outside the loop - squeezing between pipes is also allowed! Here, I is still within the loop and O is still outside the loop:

..........
.S------7.
.|F----7|.
.||OOOO||.
.||OOOO||.
.|L-7F-J|.
.|II||II|.
.L--JL--J.
..........

In both of the above examples, 4 tiles are enclosed by the loop.

Here's a larger example:

.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...

The above sketch has many random bits of ground, some of which are in the loop (I) and some of which are outside it (O):

OF----7F7F7F7F-7OOOO
O|F--7||||||||FJOOOO
O||OFJ||||||||L7OOOO
FJL7L7LJLJ||LJIL-7OO
L--JOL7IIILJS7F-7L7O
OOOOF-JIIF7FJ|L7L7L7
OOOOL7IF7||L7|IL7L7|
OOOOO|FJLJ|FJ|F7|OLJ
OOOOFJL-7O||O||||OOO
OOOOL---JOLJOLJLJOOO

In this larger example, 8 tiles are enclosed by the loop.

Any tile that isn't part of the main loop can count as being enclosed by the loop. Here's another example with many bits of junk pipe lying around that aren't connected to the main loop at all:

FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L

Here are just the tiles that are enclosed by the loop marked with I:

FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJIF7FJ-
L---JF-JLJIIIIFJLJJ7
|F|F-JF---7IIIL7L|7|
|FFJF7L7F-JF7IIL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L

In this last example, 10 tiles are enclosed by the loop.

Figure out whether you have time to search for the nest by calculating the area within the loop. How many tiles are enclosed by the loop?


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


# SOLUTION 1: FOR PART 2, DOUBLE THE RESOLUTION AND FLOOD FILL

def analyze_contiguous_lines_and_regions(part, input_str, DEBUG = False):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')


  # CONSTANTS

  H = len(input_arr)
  W = len(input_arr[0])
  SPACE = '.'

  DELTAS_BY_DIR = {
    'U': (-1, 0),
    'D': (+1, 0),
    'L': (0, -1),
    'R': (0, +1),
  }

  DELTAS_BY_PIPE_TYPE = {
    '|': ['U', 'D'],
    '-': ['L', 'R'],
    'L': ['U', 'R'],
    'J': ['U', 'L'],
    '7': ['D', 'L'],
    'F': ['D', 'R'],
    SPACE: [],
  }


  # DATA STRUCTURE

  MAP = [[None] * W for _ in range(H)]


  # FIND STARTING POINT AND TYPE, POPULATE MAP DATA STRUCTURE

  start_row = None
  start_col = None
  starting_type = None
  for row in range(H):
    MAP[row] = [ c for c in input_arr[row] ]
    if start_row == None:
      for col in range(W):
        if MAP[row][col] == 'S':
          start_row = row
          start_col = col
          break

  connects_up = 'D' in DELTAS_BY_PIPE_TYPE[input_arr[start_row - 1][start_col]]
  connects_down = 'U' in DELTAS_BY_PIPE_TYPE[input_arr[start_row + 1][start_col]]
  connects_left = 'R' in DELTAS_BY_PIPE_TYPE[input_arr[start_row][start_col - 1]]
  connects_right = 'L' in DELTAS_BY_PIPE_TYPE[input_arr[start_row][start_col + 1]]

  if connects_up and connects_down:       starting_type = '|'
  elif connects_up and connects_left:     starting_type = 'J'
  elif connects_up and connects_right:    starting_type = 'L'
  elif connects_down and connects_left:   starting_type = '7'
  elif connects_down and connects_right:  starting_type = 'F'
  elif connects_left and connects_right:  starting_type = '-'
  else:                                   assert(False)

  MAP[start_row][start_col] = starting_type


  # ANALYZE

  if part == 1:                                                             # PART 1: RETURN DISTANCE OF FARTHEST POINT ALONG PIPE

    visited = {}
    Q = deque()
    Q.append((start_row, start_col, 0))
    highest_moves = 0
    while len(Q):
      (row, col, moves) = Q.popleft()
      if (row, col) in visited: continue
      visited[(row, col)] = moves
      highest_moves = max(highest_moves, moves)
      pipe_type = MAP[row][col]
      for dir in DELTAS_BY_PIPE_TYPE[pipe_type]:
        (dy, dx) = DELTAS_BY_DIR[dir]
        Q.append((row + dy, col + dx, moves + 1))

    return highest_moves

  else:                                                                     # PART 2: RETURN INERIOR AREA SURROUNDED BY PIPE

    """
    The idea here is to double the size of our map. Every original coordinate (r,c) is mapped to the expanded map coordinate (2*r, 2*c).
    The purpose of doing this is so that we can now connect what "should" be contiguous regions in tight spaces that our original map could
    not detect. The key example is given here:

    ..........
    .S------7.
    .|F----7|.
    .||OOOO||.
    .||OOOO||.
    .|L-7F-J|.
    .|II||II|.
    .L--JL--J.
    ..........

    There is no way to distinguish between the I and O regions. The two seemingly disjoint I regions should really be contiguous in the sense
    that they are both interior to the pipes. The O region is outside of the pipe, and should really be contiguous with the outer edge.

    By doubling the map size, and - critically - filling the gaps between adjacent pipe sections with more pipes, we can now run a flood fill
    from the outside of the map, and truly fill in all O regions.

    Here is the expanded example map, where the old pipe sections have now been marked with X:

    ....................
    ....................
    ..X.X.X.X.X.X.X.X...
    ....................
    ..X.X.X.X.X.X.X.X...
    ....................
    ..X.X.........X.X...
    ....................
    ..X.X.........X.X...
    ....................
    ..X.X.X.X.X.X.X.X...
    ....................
    ..X.....X.X.....X...
    ....................
    ..X.X.X.X.X.X.X.X...
    ....................
    ....................
    ....................

    Notice how the pipes no longer connect, but have gaps in between. However, if we were to fill in the gaps and mark those with an X as well:

    ....................
    ....................
    ..XXXXXXXXXXXXXXX...
    ..X.............X...
    ..X.XXXXXXXXXXX.X...
    ..X.X.........X.X...
    ..X.X.........X.X...
    ..X.X.........X.X...
    ..X.X.........X.X...
    ..X.X.........X.X...
    ..X.XXXXX.XXXXX.X...
    ..X.....X.X.....X...
    ..X.....X.X.....X...
    ..X.....X.X.....X...
    ..XXXXXXX.XXXXXXX...
    ....................
    ....................
    ....................

    Now the I regions are contiguous, and the O regions are contiguous. So if we then flood the rest of map from the outside with X:

    XXXXXXXXXXXXXXXXXXXX
    XXXXXXXXXXXXXXXXXXXX
    XXXXXXXXXXXXXXXXXXXX
    XXX.............XXXX
    XXX.XXXXXXXXXXX.XXXX
    XXX.XXXXXXXXXXX.XXXX
    XXX.XXXXXXXXXXX.XXXX
    XXX.XXXXXXXXXXX.XXXX
    XXX.XXXXXXXXXXX.XXXX
    XXX.XXXXXXXXXXX.XXXX
    XXX.XXXXXXXXXXX.XXXX
    XXX.....XXX.....XXXX
    XXX.....XXX.....XXXX
    XXX.....XXX.....XXXX
    XXXXXXXXXXXXXXXXXXXX
    XXXXXXXXXXXXXXXXXXXX
    XXXXXXXXXXXXXXXXXXXX
    XXXXXXXXXXXXXXXXXXXX

    What remains is to simply count the inner area. However, remember that these need to map back to the original coordinate system.
    Any coordinates that are not even in both row and col indices do not count, because they do not map back to an original coordinate.

    """


    # NEW CONSTANTS

    EXPANDED_H = H * 2
    EXPANDED_W = W * 2

    ORTHOGONAL_DELTAS = (
      (+1, 0),
      (-1, 0),
      (0, +1),
      (0, -1),
    )

    X = 'X'

    PRINT_PART2_MAP = DEBUG and DISPLAY_EXTRA_INFO


    # NEW DATA STRUCTURE

    EXPANDED_MAP = [[SPACE] * EXPANDED_W for _ in range(EXPANDED_H)]


    # FIND AND MARK ORIGINAL PIPES, AND FILL IN GAPS

    visited = {}
    Q = deque()
    Q.append((start_row, start_col, 0))
    while len(Q):
      (row, col, moves) = Q.popleft()
      if (row, col) in visited: continue
      visited[(row, col)] = moves

      EXPANDED_MAP[row * 2][col * 2] = X                                    # fill in corresponding pipe in expanded map

      pipe_type = MAP[row][col]
      for dir in DELTAS_BY_PIPE_TYPE[pipe_type]:
        (dy, dx) = DELTAS_BY_DIR[dir]
        EXPANDED_MAP[row * 2 + dy][col * 2 + dx] = X                        # IMPORTANT: fill in adjacent gap with pipe!
        Q.append((row + dy, col + dx, moves + 1))


    # UTILITY FUNCTION

    def flood(row, col):
      stack = [ (row, col) ]
      while stack:
        (r, c) = stack.pop()
        if EXPANDED_MAP[r][c] == X: continue
        EXPANDED_MAP[r][c] = X
        for (dy, dx) in ORTHOGONAL_DELTAS:
          nr = r + dy
          nc = c + dx
          if 0 <= nr < EXPANDED_H and 0 <= nc < EXPANDED_W:
            stack.append((nr, nc))


    # FLOOD FILL FROM OUTER BORDER

    for c in range(EXPANDED_W):
      flood(0, c)
      flood(EXPANDED_H - 1, c)
    for r in range(1, EXPANDED_H - 1):
      flood(r, 0)
      flood(r, EXPANDED_W - 1)

    if PRINT_PART2_MAP:
      print('FILLED EXPANDED MAP:')
      for r in EXPANDED_MAP:
        print(''.join(r))
      print('')


    # COUNT UNFILLED REGION

    if PRINT_PART2_MAP:
      for r in range(H):
        for c in range(W):
          MAP[r][c] = X                                                     # fill the original MAP

    count = 0

    for r in range(EXPANDED_H):
      for c in range(EXPANDED_W):
        if r % 2 == 0 and c % 2 == 0 and EXPANDED_MAP[r][c] != X:           # i.e. if these coords map to an original set of coords
          count += 1
          if PRINT_PART2_MAP:
            MAP[r // 2][c // 2] = SPACE                                     # clear the corresponding coords in the original MAP

    if PRINT_PART2_MAP:
      print('FILLED ORIGINAL MAP:')
      for r in MAP:
        print(''.join(r))

    return count


# SOLUTION 2: FOR PART 2, USE PARITY TO DETERMINE WHETHER REGION IS INSIDE OR OUTSIDE

def analyze_contiguous_lines_and_regions2(part, input_str, DEBUG = False):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')


  # CONSTANTS

  H = len(input_arr)
  W = len(input_arr[0])
  SPACE = '.'

  DELTAS_BY_DIR = {
    'U': (-1, 0),
    'D': (+1, 0),
    'L': (0, -1),
    'R': (0, +1),
  }

  DELTAS_BY_PIPE_TYPE = {
    '|': ['U', 'D'],
    '-': ['L', 'R'],
    'L': ['U', 'R'],
    'J': ['U', 'L'],
    '7': ['D', 'L'],
    'F': ['D', 'R'],
    SPACE: [],
  }


  # DATA STRUCTURE

  MAP = [[None] * W for _ in range(H)]


  # FIND STARTING POINT AND TYPE, POPULATE MAP DATA STRUCTURE

  start_row = None
  start_col = None
  starting_type = None
  for row in range(H):
    MAP[row] = [ c for c in input_arr[row] ]
    if start_row == None:
      for col in range(W):
        if MAP[row][col] == 'S':
          start_row = row
          start_col = col
          break

  connects_up = 'D' in DELTAS_BY_PIPE_TYPE[input_arr[start_row - 1][start_col]]
  connects_down = 'U' in DELTAS_BY_PIPE_TYPE[input_arr[start_row + 1][start_col]]
  connects_left = 'R' in DELTAS_BY_PIPE_TYPE[input_arr[start_row][start_col - 1]]
  connects_right = 'L' in DELTAS_BY_PIPE_TYPE[input_arr[start_row][start_col + 1]]

  if connects_up and connects_down:       starting_type = '|'
  elif connects_up and connects_left:     starting_type = 'J'
  elif connects_up and connects_right:    starting_type = 'L'
  elif connects_down and connects_left:   starting_type = '7'
  elif connects_down and connects_right:  starting_type = 'F'
  elif connects_left and connects_right:  starting_type = '-'
  else:                                   assert(False)

  MAP[start_row][start_col] = starting_type


  # ANALYZE

  if part == 1:                                                             # PART 1: RETURN DISTANCE OF FARTHEST POINT ALONG PIPE

    return analyze_contiguous_lines_and_regions(part, input_str, DEBUG)     # COPY SOLUTION 1

  else:                                                                     # PART 2: RETURN INERIOR AREA SURROUNDED BY PIPE

    # CLEAR NON-PIPE COORDS WITH EMPTY SPACE

    visited = {}
    Q = deque()
    Q.append((start_row, start_col, 0))
    while len(Q):
      (row, col, moves) = Q.popleft()
      if (row, col) in visited: continue
      visited[(row, col)] = moves
      pipe_type = MAP[row][col]
      for dir in DELTAS_BY_PIPE_TYPE[pipe_type]:
        (dy, dx) = DELTAS_BY_DIR[dir]
        Q.append((row + dy, col + dx, moves + 1))

    for r in range(H):
      for c in range(W):
        if (r, c) not in visited:
          MAP[r][c] = SPACE                                                 # clear all sections that are not from the pipe

    if DISPLAY_EXTRA_INFO:
      for r in MAP:
        print(''.join(r))


    """
    We will go row by row, and keep track of a bool `inside` to determine whether we are currently inside or outside of the pipe area.
    For each row we always start with `inside` set to False. The idea is that if we pick an arbitrary direction (left is convenient, since we naturally
    scan from left to right), and we count how many pipes we cross to get to the edge of the diagram, whether the count is odd/even should tell us whether
    we are inside/outside because that is how many times we have crossed a boundary.

    There are some pitfalls, however. Consider the following shape, from the point of view of 'x':

    ..|......
    ..L---7.x
    ......|..

    Note that we should not count the horizontal pipes (-).

    Should we count both the L and the 7? If so, then we get an even number, even though it should really be odd.

    So it turns out the solution will work if we only count vertical pipes (|), and half the corners (say, L and J, OR F and 7).
    Note that L and 7, or F and J will not work. The diagram I drew above illustrates L---7 and why that is crossing a boundary
    but should not be even. Similarly:

    ......|..
    ..F---J.x
    ..|......

    Here, going left would eventually cross the boundary once, but would pass over an even number of corners.

    """

    PIPES_THAT_FLIP_BOOL = { '|', 'J', 'L' }                                # pick either this set...
    PIPES_THAT_FLIP_BOOL = { '|', 'F', '7' }                                # ...or this set

    count = 0
    for r in range(H):
      inside = False
      for c in range(W):
        if MAP[r][c] == SPACE and inside:
          count += 1
        elif MAP[r][c] in PIPES_THAT_FLIP_BOOL:
          inside = not inside

    return count

# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = analyze_contiguous_lines_and_regions
skipped_tests = set([ 3, 4, 5, 6, 7 ])
skipped_tests = set([ 4, 5, 6, 7 ])
skipped_tests = set([ 7 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{DAY_NUM}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """.....
.S-7.
.|.|.
.L-J.
....."""

sample_input2 = """..F7.
.FJ|.
SJ.L7
|F--J
LJ..."""

sample_input3 = """...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
..........."""

sample_input4 = """..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
.........."""

sample_input5 = """.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ..."""

sample_input6 = """FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 4
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = 8
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 6815
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': sample_input3,
  'DEBUG': True,
}
test_expected = 4
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 5
test_input = {
  'part': 2,
  'input_str': sample_input4,
  'DEBUG': True,
}
test_expected = 4
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 6
test_input = {
  'part': 2,
  'input_str': sample_input5,
  'DEBUG': True,
}
test_expected = 8
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 7
test_input = {
  'part': 2,
  'input_str': sample_input6,
  'DEBUG': True,
}
test_expected = 10
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 8
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 269
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)