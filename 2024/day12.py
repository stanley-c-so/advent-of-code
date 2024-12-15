"""

--- Day 12: Garden Groups ---

Why not search for the Chief Historian near the gardener and his massive farm? There's plenty of food, so The Historians grab something to eat while they search.

You're about to settle near a complex arrangement of garden plots when some Elves ask if you can lend a hand. They'd like to set up fences around each region of garden plots, but they can't figure out how much fence they need to order or how much it will cost. They hand you a map (your puzzle input) of the garden plots.

Each garden plot grows only a single type of plant and is indicated by a single letter on your map. When multiple garden plots are growing the same type of plant and are touching (horizontally or vertically), they form a region. For example:

AAAA
BBCD
BBCC
EEEC
This 4x4 arrangement includes garden plots growing five different types of plants (labeled A, B, C, D, and E), each grouped into their own region.

In order to accurately calculate the cost of the fence around a single region, you need to know that region's area and perimeter.

The area of a region is simply the number of garden plots the region contains. The above map's type A, B, and C plants are each in a region of area 4. The type E plants are in a region of area 3; the type D plants are in a region of area 1.

Each garden plot is a square and so has four sides. The perimeter of a region is the number of sides of garden plots in the region that do not touch another garden plot in the same region. The type A and C plants are each in a region with perimeter 10. The type B and E plants are each in a region with perimeter 8. The lone D plot forms its own region with perimeter 4.

Visually indicating the sides of plots in each region that contribute to the perimeter using - and |, the above map's regions' perimeters are measured as follows:

+-+-+-+-+
|A A A A|
+-+-+-+-+     +-+
              |D|
+-+-+   +-+   +-+
|B B|   |C|
+   +   + +-+
|B B|   |C C|
+-+-+   +-+ +
          |C|
+-+-+-+   +-+
|E E E|
+-+-+-+
Plants of the same type can appear in multiple separate regions, and regions can even appear within other regions. For example:

OOOOO
OXOXO
OOOOO
OXOXO
OOOOO
The above map contains five regions, one containing all of the O garden plots, and the other four each containing a single X plot.

The four X regions each have area 1 and perimeter 4. The region containing 21 type O plants is more complicated; in addition to its outer edge contributing a perimeter of 20, its boundary with each X region contributes an additional 4 to its perimeter, for a total perimeter of 36.

Due to "modern" business practices, the price of fence required for a region is found by multiplying that region's area by its perimeter. The total price of fencing all regions on a map is found by adding together the price of fence for every region on the map.

In the first example, region A has price 4 * 10 = 40, region B has price 4 * 8 = 32, region C has price 4 * 10 = 40, region D has price 1 * 4 = 4, and region E has price 3 * 8 = 24. So, the total price for the first example is 140.

In the second example, the region with all of the O plants has price 21 * 36 = 756, and each of the four smaller X regions has price 1 * 4 = 4, for a total price of 772 (756 + 4 + 4 + 4 + 4).

Here's a larger example:

RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
It contains:

A region of R plants with price 12 * 18 = 216.
A region of I plants with price 4 * 8 = 32.
A region of C plants with price 14 * 28 = 392.
A region of F plants with price 10 * 18 = 180.
A region of V plants with price 13 * 20 = 260.
A region of J plants with price 11 * 20 = 220.
A region of C plants with price 1 * 4 = 4.
A region of E plants with price 13 * 18 = 234.
A region of I plants with price 14 * 22 = 308.
A region of M plants with price 5 * 12 = 60.
A region of S plants with price 3 * 8 = 24.
So, it has a total price of 1930.

What is the total price of fencing all regions on your map?


--- Part Two ---

Fortunately, the Elves are trying to order so much fence that they qualify for a bulk discount!

Under the bulk discount, instead of using the perimeter to calculate the price, you need to use the number of sides each region has. Each straight section of fence counts as a side, regardless of how long it is.

Consider this example again:

AAAA
BBCD
BBCC
EEEC
The region containing type A plants has 4 sides, as does each of the regions containing plants of type B, D, and E. However, the more complex region containing the plants of type C has 8 sides!

Using the new method of calculating the per-region price by multiplying the region's area by its number of sides, regions A through E have prices 16, 16, 32, 4, and 12, respectively, for a total price of 80.

The second example above (full of type X and O plants) would have a total price of 436.

Here's a map that includes an E-shaped region full of type E plants:

EEEEE
EXXXX
EEEEE
EXXXX
EEEEE
The E-shaped region has an area of 17 and 12 sides for a price of 204. Including the two regions full of type X plants, this map has a total price of 236.

This map has a total price of 368:

AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA
It includes two regions full of type B plants (each with 4 sides) and a single region full of type A plants (with 4 sides on the outside and 8 more sides on the inside, a total of 12 sides). Be especially careful when counting the fence around regions like the one full of type A plants; in particular, each section of fence has an in-side and an out-side, so the fence does not connect across the middle of the region (where the two B regions touch diagonally). (The Elves would have used the Möbius Fencing Company instead, but their contract terms were too one-sided.)

The larger example from before now has the following updated prices:

A region of R plants with price 12 * 10 = 120.
A region of I plants with price 4 * 4 = 16.
A region of C plants with price 14 * 22 = 308.
A region of F plants with price 10 * 12 = 120.
A region of V plants with price 13 * 10 = 130.
A region of J plants with price 11 * 12 = 132.
A region of C plants with price 1 * 4 = 4.
A region of E plants with price 13 * 8 = 104.
A region of I plants with price 14 * 16 = 224.
A region of M plants with price 5 * 6 = 30.
A region of S plants with price 3 * 6 = 18.
Adding these together produces its new total price of 1206.

What is the new total price of fencing all regions on your map?

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

"""
SOLUTION 1:

My original solution. Use a grid mask to keep track of fence data. When a new side is found, fill out the entire side.
"""
def analyze_area_perimeter_and_num_sides_of_regions(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  GRID = [ [ c for c in row ] for row in input_arr ]


  # CONSTANTS

  H, W = len(GRID), len(GRID[0])

  DELTAS = (+1, 0), (-1, 0), (0, +1), (0, -1)

  PERPENDICULAR_DELTAS = {
    (+1, 0): ( (0, +1), (0, -1) ),
    (-1, 0): ( (0, +1), (0, -1) ),
    (0, +1): ( (+1, 0), (-1, 0) ),
    (0, -1): ( (+1, 0), (-1, 0) ),
  }


  # DATA STRUCTURES

  FENCE_DATA = [                                                                # grid mask
    [
      { (dy, dx): False for (dy, dx) in DELTAS } for _ in range(W)              # every cell of grid has dict for all 4 deltas, with corresponding bool
                                                                                # representing whether there is a fence on that side. init as False.
    ] for _ in range(H)
  ]


  # UTILITY

  def in_bounds(r, c):
    return 0 <= r < H and 0 <= c < W
  
  def same_region(nr, nc, region_type):                                         # given a neighbor (nr, nc) (relative to some (r, c)), is it the same region?
    return in_bounds(nr, nc) and GRID[nr][nc] == region_type                    # it is iff it's in bounds and has the same type as (r, c) (region_type)
  

  # ANALYZE

  TIME_AT_START = time.time()

  total_price = 0
  visited = set()

  for row in range(H):
    for col in range(W):
      if (row, col) in visited: continue                                        # flood fill to find regions

      ### new region discovered ###

      # init
      region_type = GRID[row][col]
      region_area = 0                                                           # for parts 1 and 2
      region_perimeter = 0                                                      # for part 1 only
      region_sides = 0                                                          # for part 2 only

      # DFS
      stack = [ (row, col) ]
      while stack:
        (r, c) = stack.pop()
        if (r, c) in visited: continue
        visited.add((r, c))                                                     # new cell within region discovered

        region_area += 1
        local_perimeter = 4                                                     # init local perimeter at 4, but decrement when neighboring cells are the same region

        for dy, dx in DELTAS:                                                   # for all 4 cardinal directions...
          nr, nc = r + dy, c + dx

          # NO FENCE
          if same_region(nr, nc, region_type):                                  # if neighbor is in bounds and has a matching region type...

            stack.append((nr, nc))                                              # ...continue DFS
            local_perimeter -= 1                                                # ...decrement local perimeter, as no fence is needed

          # FENCE (part 2)
          else:

            if FENCE_DATA[r][c][(dy, dx)]: continue                             # we are already aware of this fence, having found this side previously. skip

            region_sides += 1                                                   # new side discovered (part 2)

            # discover the rest of the current side, and mark fences
            for pdy, pdx in PERPENDICULAR_DELTAS[(dy, dx)]:                     # walk perpendicularly in both directions
              curr_r, curr_c = r, c
              while same_region(curr_r, curr_c, region_type) \
                and not same_region(curr_r + dy, curr_c + dx, region_type):     # while neighbor is still in the same region, and also should have same fence...
                
                FENCE_DATA[curr_r][curr_c][(dy, dx)] = True                     # ...set the fence for that side as True
                
                curr_r += pdy
                curr_c += pdx

        region_perimeter += local_perimeter                                     # for part 1
      
      if part == 1:                                                             # PART 1: PRICE IS BASED ON REGION AREA * REGION PERIMETER

        total_price += region_area * region_perimeter

      else:                                                                     # PART 2: PRICE IS BASED ON REGION AREA * NUMBER OF SIDES OF REGION

        total_price += region_area * region_sides

  return total_price


"""
SOLUTION 2:

Count the corners: A polygon has the same number of sides as it has corners.
"""
def analyze_area_perimeter_and_num_sides_of_regions2(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  GRID = [ [ c for c in row ] for row in input_arr ]


  # CONSTANTS

  H, W = len(GRID), len(GRID[0])

  DELTAS = (+1, 0), (-1, 0), (0, +1), (0, -1)


  # UTILITY

  def in_bounds(r, c):
    return 0 <= r < H and 0 <= c < W
  
  def same_region(nr, nc, region_type):                                         # given a neighbor (nr, nc) (relative to some (r, c)), is it the same region?
    return in_bounds(nr, nc) and GRID[nr][nc] == region_type                    # it is iff it's in bounds and has the same type as (r, c) (region_type)
  

  # ANALYZE

  TIME_AT_START = time.time()

  total_price = 0
  visited = set()

  for row in range(H):
    for col in range(W):
      if (row, col) in visited: continue                                        # flood fill to find regions

      ### new region discovered ###

      # init
      region_type = GRID[row][col]
      region_area = 0                                                           # for parts 1 and 2
      region_perimeter = 0                                                      # for part 1 only
      region_sides = 0                                                          # for part 2 only

      # DFS
      stack = [ (row, col) ]
      while stack:
        (r, c) = stack.pop()
        if (r, c) in visited: continue
        visited.add((r, c))                                                     # new cell within region discovered

        region_area += 1
        local_perimeter = 4                                                     # init local perimeter at 4, but decrement when neighboring cells are the same region

        # HANDLE DFS AND LOCAL PERIMETER

        for dy, dx in DELTAS:                                                   # for all 4 cardinal directions...
          nr, nc = r + dy, c + dx

          if same_region(nr, nc, region_type):                                  # if neighbor is in bounds and has a matching region type...

            stack.append((nr, nc))                                              # ...continue DFS
            local_perimeter -= 1                                                # ...decrement local perimeter, as no fence is needed

        region_perimeter += local_perimeter                                     # for part 1

        # COUNT THE SIDES BY COUNTING THE CORNERS

        ARE_NEIGHBORING_CELLS_SAME_REGION = [ [None] * 3 for _ in range(3) ]
        for dy in range(-1, 2):
          for dx in range(-1, 2):
            nr, nc = r + dy, c + dx
            ARE_NEIGHBORING_CELLS_SAME_REGION[dy + 1][dx + 1] = same_region(nr, nc, region_type)

        [ [TL, U, TR], [L, _, R], [BL, D, BR] ] = ARE_NEIGHBORING_CELLS_SAME_REGION

        if not L and not U: region_sides += 1                                   # TL convex corner
        if not R and not U: region_sides += 1                                   # TR convex corner
        if not L and not D: region_sides += 1                                   # BL convex corner
        if not R and not D: region_sides += 1                                   # BR convex corner

        if L and U and not TL: region_sides += 1                                # TL concave corner
        if R and U and not TR: region_sides += 1                                # TR concave corner
        if L and D and not BL: region_sides += 1                                # BL concave corner
        if R and D and not BR: region_sides += 1                                # BR concave corner


      if part == 1:                                                             # PART 1: PRICE IS BASED ON REGION AREA * REGION PERIMETER

        total_price += region_area * region_perimeter

      else:                                                                     # PART 2: PRICE IS BASED ON REGION AREA * NUMBER OF SIDES OF REGION

        total_price += region_area * region_sides

  return total_price

# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = analyze_area_perimeter_and_num_sides_of_regions
func = analyze_area_perimeter_and_num_sides_of_regions2
skipped_tests = set([ 2, 3, 4, 5, 6, 7, 8, 9, 10 ])
skipped_tests = set([ 4, 5, 6, 7, 8, 9, 10 ])
skipped_tests = set([ 5, 6, 7, 8, 9, 10 ])
skipped_tests = set([ 6, 7, 8, 9, 10 ])
skipped_tests = set([ 10 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{str(DAY_NUM).zfill(2)}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """AAAA
BBCD
BBCC
EEEC"""

sample_input2 = """OOOOO
OXOXO
OOOOO
OXOXO
OOOOO"""

sample_input3 = """RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE"""

sample_input4 = """EEEEE
EXXXX
EEEEE
EXXXX
EEEEE"""

sample_input5 = """AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 140
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = 772
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 1,
  'input_str': sample_input3,
  'DEBUG': True,
}
test_expected = 1930
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 1446042
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 5
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 80
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 6
test_input = {
  'part': 2,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = 436
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 7
test_input = {
  'part': 2,
  'input_str': sample_input4,
  'DEBUG': True,
}
test_expected = 236
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 8
test_input = {
  'part': 2,
  'input_str': sample_input5,
  'DEBUG': True,
}
test_expected = 368
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 9
test_input = {
  'part': 2,
  'input_str': sample_input3,
  'DEBUG': True,
}
test_expected = 1206
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 10
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 902742
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)