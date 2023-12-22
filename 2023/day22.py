"""

--- Day 22: Sand Slabs ---

Enough sand has fallen; it can finally filter water for Snow Island.

Well, almost.

The sand has been falling as large compacted bricks of sand, piling up to form an impressive stack here near the edge of Island Island. In order to make use of the sand to filter water, some of the bricks will need to be broken apart - nay, disintegrated - back into freely flowing sand.

The stack is tall enough that you'll have to be careful about choosing which bricks to disintegrate; if you disintegrate the wrong brick, large portions of the stack could topple, which sounds pretty dangerous.

The Elves responsible for water filtering operations took a snapshot of the bricks while they were still falling (your puzzle input) which should let you work out which bricks are safe to disintegrate. For example:

1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9

Each line of text in the snapshot represents the position of a single brick at the time the snapshot was taken. The position is given as two x,y,z coordinates - one for each end of the brick - separated by a tilde (~). Each brick is made up of a single straight line of cubes, and the Elves were even careful to choose a time for the snapshot that had all of the free-falling bricks at integer positions above the ground, so the whole snapshot is aligned to a three-dimensional cube grid.

A line like 2,2,2~2,2,2 means that both ends of the brick are at the same coordinate - in other words, that the brick is a single cube.

Lines like 0,0,10~1,0,10 or 0,0,10~0,1,10 both represent bricks that are two cubes in volume, both oriented horizontally. The first brick extends in the x direction, while the second brick extends in the y direction.

A line like 0,0,1~0,0,10 represents a ten-cube brick which is oriented vertically. One end of the brick is the cube located at 0,0,1, while the other end of the brick is located directly above it at 0,0,10.

The ground is at z=0 and is perfectly flat; the lowest z value a brick can have is therefore 1. So, 5,5,1~5,6,1 and 0,2,1~0,2,5 are both resting on the ground, but 3,3,2~3,3,3 was above the ground at the time of the snapshot.

Because the snapshot was taken while the bricks were still falling, some bricks will still be in the air; you'll need to start by figuring out where they will end up. Bricks are magically stabilized, so they never rotate, even in weird situations like where a long horizontal brick is only supported on one end. Two bricks cannot occupy the same position, so a falling brick will come to rest upon the first other brick it encounters.

Here is the same example again, this time with each brick given a letter so it can be marked in diagrams:

1,0,1~1,2,1   <- A
0,0,2~2,0,2   <- B
0,2,3~2,2,3   <- C
0,0,4~0,2,4   <- D
2,0,5~2,2,5   <- E
0,1,6~2,1,6   <- F
1,1,8~1,1,9   <- G

At the time of the snapshot, from the side so the x axis goes left to right, these bricks are arranged like this:

 x
012
.G. 9
.G. 8
... 7
FFF 6
..E 5 z
D.. 4
CCC 3
BBB 2
.A. 1
--- 0

Rotating the perspective 90 degrees so the y axis now goes left to right, the same bricks are arranged like this:

 y
012
.G. 9
.G. 8
... 7
.F. 6
EEE 5 z
DDD 4
..C 3
B.. 2
AAA 1
--- 0

Once all of the bricks fall downward as far as they can go, the stack looks like this, where ? means bricks are hidden behind other bricks at that location:

 x
012
.G. 6
.G. 5
FFF 4
D.E 3 z
??? 2
.A. 1
--- 0

Again from the side:

 y
012
.G. 6
.G. 5
.F. 4
??? 3 z
B.C 2
AAA 1
--- 0

Now that all of the bricks have settled, it becomes easier to tell which bricks are supporting which other bricks:

    Brick A is the only brick supporting bricks B and C.
    Brick B is one of two bricks supporting brick D and brick E.
    Brick C is the other brick supporting brick D and brick E.
    Brick D supports brick F.
    Brick E also supports brick F.
    Brick F supports brick G.
    Brick G isn't supporting any bricks.

Your first task is to figure out which bricks are safe to disintegrate. A brick can be safely disintegrated if, after removing it, no other bricks would fall further directly downward. Don't actually disintegrate any bricks - just determine what would happen if, for each brick, only that brick were disintegrated. Bricks can be disintegrated even if they're completely surrounded by other bricks; you can squeeze between bricks if you need to.

In this example, the bricks can be disintegrated as follows:

    Brick A cannot be disintegrated safely; if it were disintegrated, bricks B and C would both fall.
    Brick B can be disintegrated; the bricks above it (D and E) would still be supported by brick C.
    Brick C can be disintegrated; the bricks above it (D and E) would still be supported by brick B.
    Brick D can be disintegrated; the brick above it (F) would still be supported by brick E.
    Brick E can be disintegrated; the brick above it (F) would still be supported by brick D.
    Brick F cannot be disintegrated; the brick above it (G) would fall.
    Brick G can be disintegrated; it does not support any other bricks.

So, in this example, 5 bricks can be safely disintegrated.

Figure how the blocks will settle based on the snapshot. Once they've settled, consider disintegrating a single brick; how many bricks could be safely chosen as the one to get disintegrated?


--- Part Two ---

Disintegrating bricks one at a time isn't going to be fast enough. While it might sound dangerous, what you really need is a chain reaction.

You'll need to figure out the best brick to disintegrate. For each brick, determine how many other bricks would fall if that brick were disintegrated.

Using the same example as above:

    Disintegrating brick A would cause all 6 other bricks to fall.
    Disintegrating brick F would cause only 1 other brick, G, to fall.

Disintegrating any other brick would cause no other bricks to fall. So, in this example, the sum of the number of other bricks that would fall as a result of disintegrating each brick is 7.

For each brick, determine how many other bricks would fall if that brick were disintegrated. What is the sum of the number of other bricks that would fall?


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

def analyze_falling_blocks(part, input_str, DEBUG = False):

  TIME_AT_START = time.time()

  # CONSTANTS

  X, Y, Z = 'x', 'y', 'z'

  # DATA STRUCTURES

  MAP = set()                                                       # holds tuples of coordinates that are occupied by some block  
  BRICKS = []                                                       # holds collections of bricks with their data


  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  for line in input_arr:
    left_str, right_str = line.split('~')
    [ xl, yl, zl ] = [ int(n) for n in left_str.split(',') ]
    [ xr, yr, zr ] = [ int(n) for n in right_str.split(',') ]
    
    dx, dy, dz = abs(xl - xr), abs(yl - yr), abs(zl - zr)

    brick = {
      'points': [],
      'lowest': zl if dz == 0 else min(zl, zr),                     # helps to sort bricks in order of their lowest block when dropping all bricks
      'orientation': None                                           # helps to know if a brick is in z orientation, so its droppability is determined
                                                                    # solely by whether space is clear below its lowest point only
    }

    if dx + dy + dz == 0:                                           # EDGE CASE: brick is 1x1x1 (because dx, dy, and dz are all 0)
      brick['points'].append([ xl, yl, zl ])

    elif dx != 0:                                                   # x orientation
      brick['orientation'] = X
      for x in range(min(xl, xr), max(xl, xr) + 1):                 # save each block into brick data, and occupy the MAP
        brick['points'].append([x, yl, zl])
        MAP.add((x, yl, zl))
    
    elif dy != 0:                                                   # y orientation
      brick['orientation'] = Y
      for y in range(min(yl, yr), max(yl, yr) + 1):
        brick['points'].append([xl, y, zl])
        MAP.add((xl, y, zl))
    
    elif dz != 0:                                                   # z orientation
      brick['orientation'] = Z
      for z in range(min(zl, zr), max(zl, zr) + 1):
        brick['points'].append([xl, yl, z])
        MAP.add((xl, yl, z))
      brick['points'].sort(key=lambda point: point[2])              # sort the points such that brick['points'][0] is the lowest point
    
    else: assert False

    BRICKS.append(brick)

  BRICKS.sort(key=lambda brick: brick['lowest'])                    # sort the bricks such that BRICKS[0]'s lowest point is the lowest of them all


  # HELPER FUNCTIONS

  def drop_bricks(BRICKS, MAP):                                     # drops all bricks into a static position, and returns the number of bricks that moved in the process

    bricks_that_fell = 0

    for brick in BRICKS:
      brick_fell = False                                            # track whether this brick fell
      while True:                                                   # keep iterating while this brick can fall
        can_fall = True

        if brick['points'][0][2] == 1:                              # CASE 1: brick's lowest point is already resting on the floor
                                                                    # (this works because: if Z orientation, we sorted blocks earlier; else, all blocks have same Z)
          can_fall = False

        elif brick['orientation'] == Z:                             # CASE 2: Z oriented brick: ONLY check space below bottom-most point
          bottom_brick = brick['points'][0]                         # this works because we sorted it during preprocessing!
          [x, y, z] = bottom_brick
          if (x, y, z - 1) in MAP:                                  # negate can_fall if the space below the bottom point is occupied
            can_fall = False
        
        else:                                                       # CASE 3: check every point along the block to see if any of them is resting on an occupied point
          for [x, y, z] in brick['points']:
            if (x, y, z - 1) in MAP:
              can_fall = False
              break

        if can_fall == False:                                       # if this brick cannot fall, break out of the while loop
          break
        
        brick_fell = True                                           # if we did not immediately break out of the while loop, this brick fell at least one unit distance
        lowest = float('inf')                                       # OPTIONAL: update information about its lowest point (optional because we no longer use it after preprocessing)
        for i in range(len(brick['points'])):
          [x, y, z] = brick['points'][i]
          brick['points'][i] = [x, y, z - 1]
          MAP.add((x, y, z - 1))
          # MAP.remove((x, y, z))
          MAP.discard((x, y, z))
          lowest = min(lowest, z - 1)                               # OPTIONAL: update information about its lowest point (optional because we no longer use it after preprocessing)

        brick['lowest'] = lowest                                    # OPTIONAL: update information about its lowest point (optional because we no longer use it after preprocessing)

      if brick_fell: bricks_that_fell += 1

    return bricks_that_fell
  

  def deep_copy_bricks(BRICKS):
    copy = []
    for brick in BRICKS:
      brick_copy = { 'points': [ point.copy() for point in brick['points'] ], 'lowest': brick['lowest'], 'orientation': brick['orientation'] }
      copy.append(brick_copy)
    return copy


  # PRE-PROCESSING: DROP ALL BRICKS INTO A STATIC POSITION

  drop_bricks(BRICKS, MAP)


  if not DEBUG: print(f"(TOOK {(time.time() - TIME_AT_START)} SECS TO DO ALL PREPROCESSING)")


  # ANALYZE

  TIME_AT_START_OF_ANALYSIS = time.time()

  if part == 1:                                                                             # PART 1: COUNT THE NUMBER OF BRICKS THAT CAN BE DISINTEGRATED WITH NOTHING ELSE FALLING

    if not DEBUG: print('RUNNING PART 1 ANALYSIS (PLEASE WAIT)...')

    num_can_safely_disintegrate = 0

    for i in range(len(BRICKS)):

      # IMPORTANT: MAKE DEEP COPY TO GET SPLICE OF BRICKS WITHOUT CURRENT BRICK
      deep_copy = deep_copy_bricks(BRICKS)
      bricks_copy = deep_copy[:i] + deep_copy[i+1:]

      # IMPORTANT: MAKE DEEP COPY OF MAP
      MAP_copy = MAP.copy()
      brick_removed = deep_copy[i]
      for (x, y, z) in brick_removed['points']:
        MAP_copy.remove((x, y, z))

      # Use helper function with deep copied data structures
      if drop_bricks(bricks_copy, MAP_copy) == 0:
        num_can_safely_disintegrate += 1

    if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START_OF_ANALYSIS)} SECS)")
    return num_can_safely_disintegrate

  else:                                                                                     # PART 2: SUM THE NUMBER OF OTHER BRICKS THAT WOULD FALL FOR EACH BRICK THAT GETS DISINTEGRATED

    if not DEBUG: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

    total = 0

    for i in range(len(BRICKS)):

      # IMPORTANT: MAKE DEEP COPY TO GET SPLICE OF BRICKS WITHOUT CURRENT BRICK
      deep_copy = deep_copy_bricks(BRICKS)
      bricks_copy = deep_copy[:i] + deep_copy[i+1:]

      # IMPORTANT: MAKE DEEP COPY OF MAP
      MAP_copy = MAP.copy()
      brick_removed = deep_copy[i]
      for (x, y, z) in brick_removed['points']:
        MAP_copy.remove((x, y, z))

      # Use helper function with deep copied data structures
      total += drop_bricks(bricks_copy, MAP_copy)

    if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START_OF_ANALYSIS)} SECS)")
    return total


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = analyze_falling_blocks
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

sample_input = """1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 5
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 475
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 7
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 79144
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)