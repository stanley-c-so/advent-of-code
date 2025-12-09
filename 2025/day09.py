"""

--- Day 9: Movie Theater ---

You slide down the firepole in the corner of the playground and land in the North Pole base movie theater!

The movie theater has a big tile floor with an interesting pattern. Elves here are redecorating the theater by switching out some of the square tiles in the big grid they form. Some of the tiles are red; the Elves would like to find the largest rectangle that uses red tiles for two of its opposite corners. They even have a list of where the red tiles are located in the grid (your puzzle input).

For example:

7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3
Showing red tiles as # and other tiles as ., the above arrangement of red tiles would look like this:

..............
.......#...#..
..............
..#....#......
..............
..#......#....
..............
.........#.#..
..............
You can choose any two red tiles as the opposite corners of your rectangle; your goal is to find the largest rectangle possible.

For example, you could make a rectangle (shown as O) with an area of 24 between 2,5 and 9,7:

..............
.......#...#..
..............
..#....#......
..............
..OOOOOOOO....
..OOOOOOOO....
..OOOOOOOO.#..
..............
Or, you could make a rectangle with area 35 between 7,1 and 11,7:

..............
.......OOOOO..
.......OOOOO..
..#....OOOOO..
.......OOOOO..
..#....OOOOO..
.......OOOOO..
.......OOOOO..
..............
You could even make a thin rectangle with an area of only 6 between 7,3 and 2,3:

..............
.......#...#..
..............
..OOOOOO......
..............
..#......#....
..............
.........#.#..
..............
Ultimately, the largest rectangle you can make in this example has area 50. One way to do this is between 2,5 and 11,1:

..............
..OOOOOOOOOO..
..OOOOOOOOOO..
..OOOOOOOOOO..
..OOOOOOOOOO..
..OOOOOOOOOO..
..............
.........#.#..
..............
Using two red tiles as opposite corners, what is the largest area of any rectangle you can make?


--- Part Two ---

The Elves just remembered: they can only switch out tiles that are red or green. So, your rectangle can only include red or green tiles.

In your list, every red tile is connected to the red tile before and after it by a straight line of green tiles. The list wraps, so the first red tile is also connected to the last red tile. Tiles that are adjacent in your list will always be on either the same row or the same column.

Using the same example as before, the tiles marked X would be green:

..............
.......#XXX#..
.......X...X..
..#XXXX#...X..
..X........X..
..#XXXXXX#.X..
.........X.X..
.........#X#..
..............
In addition, all of the tiles inside this loop of red and green tiles are also green. So, in this example, these are the green tiles:

..............
.......#XXX#..
.......XXXXX..
..#XXXX#XXXX..
..XXXXXXXXXX..
..#XXXXXX#XX..
.........XXX..
.........#X#..
..............
The remaining tiles are never red nor green.

The rectangle you choose still must have red tiles in opposite corners, but any other tiles it includes must now be red or green. This significantly limits your options.

For example, you could make a rectangle out of red and green tiles with an area of 15 between 7,3 and 11,1:

..............
.......OOOOO..
.......OOOOO..
..#XXXXOOOOO..
..XXXXXXXXXX..
..#XXXXXX#XX..
.........XXX..
.........#X#..
..............
Or, you could make a thin rectangle with an area of 3 between 9,7 and 9,5:

..............
.......#XXX#..
.......XXXXX..
..#XXXX#XXXX..
..XXXXXXXXXX..
..#XXXXXXOXX..
.........OXX..
.........OX#..
..............
The largest rectangle you can make in this example using only red and green tiles has area 24. One way to do this is between 9,5 and 2,3:

..............
.......#XXX#..
.......XXXXX..
..OOOOOOOOXX..
..OOOOOOOOXX..
..OOOOOOOOXX..
.........XXX..
.........#X#..
..............
Using two red tiles as opposite corners, what is the largest area of any rectangle you can make using only red and green tiles?

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

def choose_two_points_as_opposite_corners_to_maximize_rectangle(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')


  # PRE-PROCESSING AND DATA STRUCTURES

  MIN_X = float('inf')
  MIN_Y = float('inf')
  MAX_X = float('-inf')
  MAX_Y = float('-inf')

  POINTS = []
  for line in input_arr:
    x, y = ( int(n) for n in line.split(',') )
    POINTS.append((x, y))
    MIN_X = min(MIN_X, x)
    MIN_Y = min(MIN_Y, y)
    MAX_X = max(MAX_X, x)
    MAX_Y = max(MAX_Y, y)
  
  POINTS_SET = set(POINTS)


  # ANALYZE

  if part == 1:                                                                   # PART 1: LARGEST RECTANGLE ONLY NEEDS TO USE TWO POINTS AS OPPOSITE CORNERS - NO RESTRICTIONS

    max_size = 0
    for i in range(len(POINTS) - 1):
      for j in range(i + 1, len(POINTS)):
        x1, y1 = POINTS[i]
        x2, y2 = POINTS[j]
        h = abs((y1 - y2)) + 1
        w = abs((x1 - x2)) + 1
        size = h * w
        max_size = max(max_size, size)
    return max_size

  else:                                                                           # PART 2: LARGEST RECTANGLE MUST BE *CONTAINED BY THE SHAPE FORMED BY CONNECTING THE POINTS IN ORDER*

    """
    This initial solution worked for the sample input, and (I think) is theoretically correct for generic input, but takes way too long for the real data.
    """

    if DEBUG:

      def is_corner(x, y):
        return (x, y) in POINTS_SET

      MEMO_IS_BOUNDARY = {}
      def is_boundary(x, y):                                                      # 0 is false, 1 is horizontal boundary, 2 is vertical boundary
        if (x, y) not in MEMO_IS_BOUNDARY:
          if is_corner(x, y):
            MEMO_IS_BOUNDARY[(x, y)] = 0
          else:
            res = 0
            for i in range(len(POINTS)):
              x1, y1 = POINTS[i]
              x2, y2 = POINTS[(i + 1) % len(POINTS)]

              if x1 == x2:
                if x == x1 and min(y1, y2) <= y <= max(y1, y2):
                  res = 2                                                         # vertical boundary
                  break
              elif y1 == y2:
                if y == y1 and min(x1, x2) <= x <= max(x1, x2):
                  res = 1                                                         # horizontal boundary
                  break
              else:
                assert f'ERROR: Adjacent points ({x1},{y1}) and ({x2},{y2}) should have an axis value in common'
            MEMO_IS_BOUNDARY[(x, y)] = res
        return MEMO_IS_BOUNDARY[(x, y)]
      
      MEMO_IS_INTERIOR = {}
      def is_interior(x, y):
        if x < MIN_X or MAX_X < x or y < MIN_Y or MAX_Y < y:
          return False

        if (x, y) not in MEMO_IS_INTERIOR:
          COND = (x1, y1) == (9, 5) and (x2, y2) == (2, 3)
          if is_corner(x, y) or is_boundary(x, y):
            MEMO_IS_INTERIOR[(x, y)] = True
          else:
            inside = False
            a, b, c, d = (x - MIN_X), (MAX_X - x), (y - MIN_Y), (MAX_Y - y)
            if a <= b and a <= c and a <= d:
              for xx in range(MIN_X - 1, x + 1):
                if is_corner(xx, y) or is_boundary(xx, y) == 2:
                  inside = not inside
              MEMO_IS_INTERIOR[(x, y)] = inside
            elif b <= a and b <= c and b <= d:
              for xx in range(MAX_X + 1, x - 1, -1):
                if is_corner(xx, y) or is_boundary(xx, y) == 2:
                  inside = not inside
              MEMO_IS_INTERIOR[(x, y)] = inside
            elif c <= a and c <= b and c <= d:
              for yy in range(MIN_Y - 1, y + 1):
                if is_corner(x, yy) or is_boundary(x, yy) == 1:
                  inside = not inside
              MEMO_IS_INTERIOR[(x, y)] = inside
            elif d <= a and d <= b and d <= c:
              for yy in range(MAX_Y + 1, y - 1, -1):
                if is_corner(x, yy) or is_boundary(x, yy) == 1:
                  inside = not inside
              MEMO_IS_INTERIOR[(x, y)] = inside
            else:
              assert False, f'ERROR: No closest boundary | x={x}, y={y}, MIN_X={MIN_X}, MAX_X={MAX_X}, MIN_Y={MIN_Y}, MAX_Y={MAX_Y}'
        return MEMO_IS_INTERIOR[(x, y)]

      def is_valid(x1, y1, x2, y2):
        res = True
        for x in range(min(x1, x2), max(x1, x2) + 1):
          if not is_interior(x, y1):
            res = False
            break
        if not res: return False
        for y in range(min(y1, y2), max(y1, y2) + 1):
          if not is_interior(x2, y):
            res = False
            break
        if not res: return False
        for x in range(max(x1, x2), min(x1, x2) - 1, -1):
          if not is_interior(x, y2):
            res = False
            break
        if not res: return False
        for y in range(max(y1, y2), min(y1, y2) - 1):
          if not is_interior(x1, y):
            res = False
            break
        return res

      max_size = 0
      for i in range(len(POINTS) - 1):
        for j in range(i + 1, len(POINTS)):
          x1, y1 = POINTS[i]
          x2, y2 = POINTS[j]
          valid = is_valid(x1, y1, x2, y2)
          if valid:
            h = abs((y1 - y2)) + 1
            w = abs((x1 - x2)) + 1
            size = h * w
            max_size = max(max_size, size)
      
      return max_size

    """
    The key is to inspect the data:

    y values start at 50290 and generally increase to a max of 98410, then generally decrease to a min of 1871 (with some fluctuation at times).

    Similarly, x values start at 97989 and generally decrease to a min of 1828, then generally increase to a max of 98367 (with some fluctuation at times).

    This overall shape is some sort of convex shape (possibly like a diamond, or possibly like a circle).

    The uppermost side of the shape is the line segment between (49707, 98410) and (50925, 98410).
    The rightmost side of the shape is the line segment between (98367, 50290) and (98367, 49067).
    The bottommost side of the shape is the line segment between (47878, 1871) and (49071, 1871).
    The leftmost side of the shape is the line segment between (1828, 48487) and (1828, 47303), but see the caveat below:

    HOWEVER, there are two points that are a major exception to this: on lines 249 and 250 of the input, the x values suddenly spike - from 2009 on line 248 to 94671 on lines 249 and 250, and back down to 1828 on line 251.

    So, we have a convex shape, with a large narrow rectangle cut out of the left part of it, near the middle (a bit above the leftmost edge), and ending up VERY close to the right edge, kind of like:

                    ________
               __              __
            __                     __
          
        |                             |
        |__________________________   |
        ___________________________|  X <--- input starts around here somewhere, and goes counter-clockwise
        |                             |
           __                      __
              __              __
                   ________

    
    So, logically, the answer must be some very wide rectangle either on the top half of this shape (bottom edge flush against the top of the narrow hole), or on the bottom half of this shape (top edge flush against the bottom of the narrow hole). (Since the hole is cut so close to the right edge, the answer can't be a vertical rectangle to the right of the hole, spanning both the top and bottom halves of the shape.)

    Moreover, one of two right corners of the rectangular hole MUST be one of the two corners of the final rectangle.

    So we have two cases:
    1) The final rectangle is in the top half of the shape, and the top left corner of the final rectangle is somewhere in the upper left quadrant of the shape;
    2) The final rectangle is in the bottom half of the shape, and the bottom left corner of the final rectangle is somewhere in the bottom left quadrant of the shape.

    The only trap to be aware of is that the shape is not perfectly convex, so we have to be wary of traps that look something like this, for example:
                                  ____
                             ____|
              ______________|
             |.________
              ________|
        ____ |
    ___|

    If this is the top left quadrant of the shape, the corner marked by the period is NOT a valid candidate corner for the final rectangle, because it lives in a mini hole.
    Such a final rectangle would not be fully filled in by the shape.
    """

    # FURTHER DISCOVERY

    X_RIGHT_OF_HOLE = 94671                                                       # derived from inspection of input for anomalies
    y_values_at_right_of_hole = []
    index_values_of_right_of_hole = []
    index_values_of_MAX_X = []
    index_values_of_MIN_Y = []
    index_values_of_MAX_Y = []
    for i in range(len(POINTS)):
      (x, y) = POINTS[i]
      if x == X_RIGHT_OF_HOLE:
        y_values_at_right_of_hole.append(y)
        index_values_of_right_of_hole.append(i)
      elif x == MAX_X:
        index_values_of_MAX_X.append(i)
      elif y == MIN_Y:
        index_values_of_MIN_Y.append(i)
      elif y == MAX_Y:
        index_values_of_MAX_Y.append(i)

    assert all(len(lst) == 2 for lst in (
      y_values_at_right_of_hole,
      index_values_of_right_of_hole,
      index_values_of_MAX_X,
      index_values_of_MIN_Y,
      index_values_of_MAX_Y,
    )), f'Something does not have length 2: y_values_at_right_of_hole={y_values_at_right_of_hole}, index_values_of_right_of_hole={index_values_of_right_of_hole}, index_values_of_MAX_X={index_values_of_MAX_X}, index_values_of_MIN_Y={index_values_of_MIN_Y}, index_values_of_MAX_Y={index_values_of_MAX_Y}'

    Y_TOP_OF_HOLE = max(y_values_at_right_of_hole)
    Y_BOTTOM_OF_HOLE = min(y_values_at_right_of_hole)

    # Find the highest point above X_RIGHT_OF_HOLE that's still in the shape
    highest_y_above_X_RIGHT_OF_HOLE = float('-inf')
    idx = min(index_values_of_MAX_X)
    while True:
      x, y = POINTS[idx]
      idx = (idx + 1) % len(POINTS)                                               # input sweeps counter-clockwise, so incrementing goes ccw
      if x < X_RIGHT_OF_HOLE: break
      if y < Y_TOP_OF_HOLE: continue                                              # skip point at bottom right corner of hole, just in case
      highest_y_above_X_RIGHT_OF_HOLE = max(highest_y_above_X_RIGHT_OF_HOLE, y)

    # Find the lowest point below X_RIGHT_OF_HOLE that's still in the shape
    lowest_y_below_X_RIGHT_OF_HOLE = float('inf')
    idx = max(index_values_of_MAX_X)
    while True:
      x, y = POINTS[idx]
      idx = (idx - 1) % len(POINTS)                                               # input sweeps counter-clockwise, so decrementing goes cw
      if x < X_RIGHT_OF_HOLE: break
      if y > Y_BOTTOM_OF_HOLE: continue                                           # skip point at top right corner of hole, just in case
      lowest_y_below_X_RIGHT_OF_HOLE = min(lowest_y_below_X_RIGHT_OF_HOLE, y)


    # CASE 1: TOP HALF
    max_size_if_top_half = 0
    idx = min(index_values_of_right_of_hole) - 1                                  # start at left end of top edge of hole (1 before the top right corner)
    case_1_rightmost_x_so_far = POINTS[idx][0]
    while True:
      x, y = POINTS[idx]
      idx = (idx - 1) % len(POINTS)                                               # input sweeps counter-clockwise, so decrementing goes cw

      if y > highest_y_above_X_RIGHT_OF_HOLE: break                               # break loop if we've gone above the height above right side of hole:
                                                                                  # any higher and our rectangle would poke through boundary at the top right

      if x < case_1_rightmost_x_so_far: continue                                  # there's a weird mini-hole at lines 215-216 of the input, which messes up our
                                                                                  # result for this half (and actual answer!) if we don't enforce this rule!
      case_1_rightmost_x_so_far = max(case_1_rightmost_x_so_far, x)               # ignore holes if a subsequent point begins more left of our current x boundary

      h = abs(y - Y_TOP_OF_HOLE) + 1
      w = abs(x - X_RIGHT_OF_HOLE) + 1
      max_size_if_top_half = max(max_size_if_top_half, h * w)

    # CASE 2: BOTTOM HALF
    max_size_if_bottom_half = 0
    idx = max(index_values_of_right_of_hole) + 1                                  # start at left end of bottom edge of hole (1 after the bottom right corner)
    case_2_rightmost_x_so_far = POINTS[idx][0]
    while True:
      x, y = POINTS[idx]
      idx = (idx + 1) % len(POINTS)                                               # input sweeps counter-clockwise, so incrementing goes ccw

      if y < lowest_y_below_X_RIGHT_OF_HOLE: break                                # break loop if we've gone below the height below right side of hole:
                                                                                  # any lower and our rectangle would poke through boundary at the bottom right

      if x < case_2_rightmost_x_so_far: continue                                  # there's a weird mini-hole at lines 273-274 of the input, which messes up our
                                                                                  # result for this half if we don't enforce this rule!
      case_2_rightmost_x_so_far = max(case_2_rightmost_x_so_far, x)               # ignore holes if a subsequent point begins more left of our current x boundary

      h = abs(y - Y_BOTTOM_OF_HOLE) + 1
      w = abs(x - X_RIGHT_OF_HOLE) + 1
      max_size_if_bottom_half = max(max_size_if_bottom_half, h * w)

    print(f'Max size for top half: {max_size_if_top_half}')
    print(f'Max size for bottom half: {max_size_if_bottom_half}')
    return max(max_size_if_top_half, max_size_if_bottom_half)


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = choose_two_points_as_opposite_corners_to_maximize_rectangle
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

sample_input = """7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 50
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 4755064176
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 24
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 1613305596
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)