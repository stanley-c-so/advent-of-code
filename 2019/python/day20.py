"""

--- Day 20: Donut Maze ---

You notice a strange pattern on the surface of Pluto and land nearby to get a closer look. Upon closer inspection, you realize you've come across one of the famous space-warping mazes of the long-lost Pluto civilization!

Because there isn't much space on Pluto, the civilization that used to live here thrived by inventing a method for folding spacetime. Although the technology is no longer understood, mazes like this one provide a small glimpse into the daily life of an ancient Pluto citizen.

This maze is shaped like a donut. Portals along the inner and outer edge of the donut can instantly teleport you from one side to the other. For example:

         A           
         A           
  #######.#########  
  #######.........#  
  #######.#######.#  
  #######.#######.#  
  #######.#######.#  
  #####  B    ###.#  
BC...##  C    ###.#  
  ##.##       ###.#  
  ##...DE  F  ###.#  
  #####    G  ###.#  
  #########.#####.#  
DE..#######...###.#  
  #.#########.###.#  
FG..#########.....#  
  ###########.#####  
             Z       
             Z       
This map of the maze shows solid walls (#) and open passages (.). Every maze on Pluto has a start (the open tile next to AA) and an end (the open tile next to ZZ). Mazes on Pluto also have portals; this maze has three pairs of portals: BC, DE, and FG. When on an open tile next to one of these labels, a single step can take you to the other tile with the same label. (You can only walk on . tiles; labels and empty space are not traversable.)

One path through the maze doesn't require any portals. Starting at AA, you could go down 1, right 8, down 12, left 4, and down 1 to reach ZZ, a total of 26 steps.

However, there is a shorter path: You could walk from AA to the inner BC portal (4 steps), warp to the outer BC portal (1 step), walk to the inner DE (6 steps), warp to the outer DE (1 step), walk to the outer FG (4 steps), warp to the inner FG (1 step), and finally walk to ZZ (6 steps). In total, this is only 23 steps.

Here is a larger example:

                   A               
                   A               
  #################.#############  
  #.#...#...................#.#.#  
  #.#.#.###.###.###.#########.#.#  
  #.#.#.......#...#.....#.#.#...#  
  #.#########.###.#####.#.#.###.#  
  #.............#.#.....#.......#  
  ###.###########.###.#####.#.#.#  
  #.....#        A   C    #.#.#.#  
  #######        S   P    #####.#  
  #.#...#                 #......VT
  #.#.#.#                 #.#####  
  #...#.#               YN....#.#  
  #.###.#                 #####.#  
DI....#.#                 #.....#  
  #####.#                 #.###.#  
ZZ......#               QG....#..AS
  ###.###                 #######  
JO..#.#.#                 #.....#  
  #.#.#.#                 ###.#.#  
  #...#..DI             BU....#..LF
  #####.#                 #.#####  
YN......#               VT..#....QG
  #.###.#                 #.###.#  
  #.#...#                 #.....#  
  ###.###    J L     J    #.#.###  
  #.....#    O F     P    #.#...#  
  #.###.#####.#.#####.#####.###.#  
  #...#.#.#...#.....#.....#.#...#  
  #.#####.###.###.#.#.#########.#  
  #...#.#.....#...#.#.#.#.....#.#  
  #.###.#####.###.###.#.#.#######  
  #.#.........#...#.............#  
  #########.###.###.#############  
           B   J   C               
           U   P   P               
Here, AA has no direct path to ZZ, but it does connect to AS and CP. By passing through AS, QG, BU, and JO, you can reach ZZ in 58 steps.

In your maze, how many steps does it take to get from the open tile marked AA to the open tile marked ZZ?


--- Part Two ---

Strangely, the exit isn't open when you reach it. Then, you remember: the ancient Plutonians were famous for building recursive spaces.

The marked connections in the maze aren't portals: they physically connect to a larger or smaller copy of the maze. Specifically, the labeled tiles around the inside edge actually connect to a smaller copy of the same maze, and the smaller copy's inner labeled tiles connect to yet a smaller copy, and so on.

When you enter the maze, you are at the outermost level; when at the outermost level, only the outer labels AA and ZZ function (as the start and end, respectively); all other outer labeled tiles are effectively walls. At any other level, AA and ZZ count as walls, but the other outer labeled tiles bring you one level outward.

Your goal is to find a path through the maze that brings you back to ZZ at the outermost level of the maze.

In the first example above, the shortest path is now the loop around the right side. If the starting level is 0, then taking the previously-shortest path would pass through BC (to level 1), DE (to level 2), and FG (back to level 1). Because this is not the outermost level, ZZ is a wall, and the only option is to go back around to BC, which would only send you even deeper into the recursive maze.

In the second example above, there is no path that brings you to ZZ at the outermost level.

Here is a more interesting example:

             Z L X W       C                 
             Z P Q B       K                 
  ###########.#.#.#.#######.###############  
  #...#.......#.#.......#.#.......#.#.#...#  
  ###.#.#.#.#.#.#.#.###.#.#.#######.#.#.###  
  #.#...#.#.#...#.#.#...#...#...#.#.......#  
  #.###.#######.###.###.#.###.###.#.#######  
  #...#.......#.#...#...#.............#...#  
  #.#########.#######.#.#######.#######.###  
  #...#.#    F       R I       Z    #.#.#.#  
  #.###.#    D       E C       H    #.#.#.#  
  #.#...#                           #...#.#  
  #.###.#                           #.###.#  
  #.#....OA                       WB..#.#..ZH
  #.###.#                           #.#.#.#  
CJ......#                           #.....#  
  #######                           #######  
  #.#....CK                         #......IC
  #.###.#                           #.###.#  
  #.....#                           #...#.#  
  ###.###                           #.#.#.#  
XF....#.#                         RF..#.#.#  
  #####.#                           #######  
  #......CJ                       NM..#...#  
  ###.#.#                           #.###.#  
RE....#.#                           #......RF
  ###.###        X   X       L      #.#.#.#  
  #.....#        F   Q       P      #.#.#.#  
  ###.###########.###.#######.#########.###  
  #.....#...#.....#.......#...#.....#.#...#  
  #####.#.###.#######.#######.###.###.#.#.#  
  #.......#.......#.#.#.#.#...#...#...#.#.#  
  #####.###.#####.#.#.#.#.###.###.#.###.###  
  #.......#.....#.#...#...............#...#  
  #############.#.#.###.###################  
               A O F   N                     
               A A D   M                     
One shortest path through the maze is the following:

Walk from AA to XF (16 steps)
Recurse into level 1 through XF (1 step)
Walk from XF to CK (10 steps)
Recurse into level 2 through CK (1 step)
Walk from CK to ZH (14 steps)
Recurse into level 3 through ZH (1 step)
Walk from ZH to WB (10 steps)
Recurse into level 4 through WB (1 step)
Walk from WB to IC (10 steps)
Recurse into level 5 through IC (1 step)
Walk from IC to RF (10 steps)
Recurse into level 6 through RF (1 step)
Walk from RF to NM (8 steps)
Recurse into level 7 through NM (1 step)
Walk from NM to LP (12 steps)
Recurse into level 8 through LP (1 step)
Walk from LP to FD (24 steps)
Recurse into level 9 through FD (1 step)
Walk from FD to XQ (8 steps)
Recurse into level 10 through XQ (1 step)
Walk from XQ to WB (4 steps)
Return to level 9 through WB (1 step)
Walk from WB to ZH (10 steps)
Return to level 8 through ZH (1 step)
Walk from ZH to CK (14 steps)
Return to level 7 through CK (1 step)
Walk from CK to XF (10 steps)
Return to level 6 through XF (1 step)
Walk from XF to OA (14 steps)
Return to level 5 through OA (1 step)
Walk from OA to CJ (8 steps)
Return to level 4 through CJ (1 step)
Walk from CJ to RE (8 steps)
Return to level 3 through RE (1 step)
Walk from RE to IC (4 steps)
Recurse into level 4 through IC (1 step)
Walk from IC to RF (10 steps)
Recurse into level 5 through RF (1 step)
Walk from RF to NM (8 steps)
Recurse into level 6 through NM (1 step)
Walk from NM to LP (12 steps)
Recurse into level 7 through LP (1 step)
Walk from LP to FD (24 steps)
Recurse into level 8 through FD (1 step)
Walk from FD to XQ (8 steps)
Recurse into level 9 through XQ (1 step)
Walk from XQ to WB (4 steps)
Return to level 8 through WB (1 step)
Walk from WB to ZH (10 steps)
Return to level 7 through ZH (1 step)
Walk from ZH to CK (14 steps)
Return to level 6 through CK (1 step)
Walk from CK to XF (10 steps)
Return to level 5 through XF (1 step)
Walk from XF to OA (14 steps)
Return to level 4 through OA (1 step)
Walk from OA to CJ (8 steps)
Return to level 3 through CJ (1 step)
Walk from CJ to RE (8 steps)
Return to level 2 through RE (1 step)
Walk from RE to XQ (14 steps)
Return to level 1 through XQ (1 step)
Walk from XQ to FD (8 steps)
Return to level 0 through FD (1 step)
Walk from FD to ZZ (18 steps)
This path takes a total of 396 steps to move from AA at the outermost layer to ZZ at the outermost layer.

In your maze, when accounting for recursion, how many steps does it take to get from the open tile marked AA to the open tile marked ZZ, both at the outermost layer?

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

def dijkstra_through_maze_with_portals_and_different_dimensions(part, input_str, DEBUG = False, *args):

  # DATA STRUCTURES

  ENDPOINTS_BY_PORTAL = {}
  PORTAL_BY_ENDPOINT = {}


  # PARSE INPUT DATA

  GRID = [ [ c for c in row ] for row in input_str.split('\n') ]


  # CONSTANTS

  DELTAS = (+1, 0), (-1, 0), (0, +1), (0, -1)

  WALL, EMPTY, NULL = '#', '.', ' '

  H, W = len(GRID), len(GRID[0])

  START, END = None, None

  NUM_PORTALS = None


  # UTILITY

  def is_uppercase_char(c):
    return ord('A') <= ord(c) <= ord('Z')
  
  def is_outer_wall(row, col):
    return row in ( 2, H - 1 - 2 ) or col in ( 2, W - 1 - 2 )
  
  def is_outer_portal(row, col):
    return is_outer_wall(row, col) and (row, col) in PORTAL_BY_ENDPOINT


  # DISCOVERY

  for row in range(2, H - 2):                                           # safe to assume a "padding" space of 2 on all sides
    for col in range(2, W - 2):                                         # between the edge of the map and the outermost wall/floors 
      if GRID[row][col] == EMPTY:
        portal = None                                                   # safe to assume a floor will be next to at most one portal
        if is_uppercase_char(GRID[row - 1][col]):                       # up
          portal = GRID[row - 2][col] + GRID[row - 1][col]
        elif is_uppercase_char(GRID[row + 1][col]):                     # down
          portal = GRID[row + 1][col] + GRID[row + 2][col]
        elif is_uppercase_char(GRID[row][col - 1]):                     # left
          portal = GRID[row][col - 2] + GRID[row][col - 1]
        elif is_uppercase_char(GRID[row][col + 1]):                     # right
          portal = GRID[row][col + 1] + GRID[row][col + 2]
        
        if portal == 'AA':
          START = (row, col)
        elif portal == 'ZZ':
          END = (row, col)
        elif portal:
          if portal not in ENDPOINTS_BY_PORTAL: ENDPOINTS_BY_PORTAL[portal] = []
          ENDPOINTS_BY_PORTAL[portal].append((row, col))
          assert (row, col) not in PORTAL_BY_ENDPOINT, f"({row}, {col}) ALREADY ASSOCIATED WITH PORTAL {PORTAL_BY_ENDPOINT[(row, col)]}"
          PORTAL_BY_ENDPOINT[(row, col)] = portal

  NUM_PORTALS = len(ENDPOINTS_BY_PORTAL)

  assert START != None, f"START NOT DISCOVERED"
  assert END != None, f"END NOT DISCOVERED"
  assert all([ len(portal_data) == 2 for portal_data in ENDPOINTS_BY_PORTAL.values() ]), f"NOT ALL PORTALS HAVE EXACTLY 2 NODES: {ENDPOINTS_BY_PORTAL}"


  # ANALYZE

  if not DEBUG: print('RUNNING REAL DATA ANALYSIS (PLEASE WAIT)...')
  TIME_AT_START = time.time()

  PQ = PriorityQueue()
  PQ.put( ( 0, (START, 0) ) )
  COST = {}

  while not PQ.empty():
    ( cost, ((row, col), level) ) = PQ.get()    
    assert level >= 0, f"SOMEHOW YOU REACHED A NEGATIVE LEVEL {level} EVEN THOUGH OUTER PORTALS SHOULD BE INACCESSIBLE AT LEVEL 0"
    
    # Not sure what the upper bound should be for level, but I don't think it should ever reach NUM_PORTALS,
    # because I think that would put you in the same state as you could have previously reached at a much lower level.
    if level == NUM_PORTALS:
      print(f"Discontinuing after reaching recursion level {level}, which is equal to the number of portals")
      continue

    state = (level, row, col)
    if state in COST and COST[state] <= cost: continue
    COST[state] = cost

    if (row, col) == END:
      assert level == 0, f"SOMEHOW YOU REACHED THE END AT LEVEL {level} EVEN THOUGH IT SHOULD BE INACCESSIBLE THERE"
      if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")   # ~0.01 seconds for part 1; ~0.44 seconds for part 2
      return cost

    for dy, dx in DELTAS:                                               # regular movements
      nr, nc = row + dy, col + dx
      if GRID[nr][nc] == EMPTY:

                                                                        # PART 1: ANY FLOOR IS ACCESSIBLE
                                                                        # PART 2: LEVEL 0 OUTER PORTALS DON'T EXIST,
                                                                        # AND LEVEL 1+ START AND END DON'T EXIST 
        if part == 1 or \
          (
            not (level == 0 and is_outer_portal(nr, nc)) and \
            not (level > 0 and (nr, nc) in (START, END))
          ):
          PQ.put( ( cost + 1, ((nr, nc), level) ) )

    if (row, col) in PORTAL_BY_ENDPOINT:                                # portal movements
      portal = PORTAL_BY_ENDPOINT[(row, col)]
      for endpoint in ENDPOINTS_BY_PORTAL[portal]:
        if endpoint != (row, col):
          next_level = 0 if part == 1 \
                        else level - 1 if is_outer_wall(row, col) \
                        else level + 1
          PQ.put( ( cost + 1, (endpoint, next_level) ) )

  print('DID NOT FIND SOLUTION')                                        # there is a sample test case where this is expected
  if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
  return None


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = dijkstra_through_maze_with_portals_and_different_dimensions
skipped_tests = set([ 2, 3, 4, 5, 6, 7 ])
skipped_tests = set([ 3, 4, 5, 6, 7 ])
skipped_tests = set([ 4, 5, 6, 7 ])
skipped_tests = set([ 5, 6, 7 ])
skipped_tests = set([ 6, 7 ])
skipped_tests = set([ 7 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{str(DAY_NUM).zfill(2)}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """         A           
         A           
  #######.#########  
  #######.........#  
  #######.#######.#  
  #######.#######.#  
  #######.#######.#  
  #####  B    ###.#  
BC...##  C    ###.#  
  ##.##       ###.#  
  ##...DE  F  ###.#  
  #####    G  ###.#  
  #########.#####.#  
DE..#######...###.#  
  #.#########.###.#  
FG..#########.....#  
  ###########.#####  
             Z       
             Z      """

sample_input2 = """                   A               
                   A               
  #################.#############  
  #.#...#...................#.#.#  
  #.#.#.###.###.###.#########.#.#  
  #.#.#.......#...#.....#.#.#...#  
  #.#########.###.#####.#.#.###.#  
  #.............#.#.....#.......#  
  ###.###########.###.#####.#.#.#  
  #.....#        A   C    #.#.#.#  
  #######        S   P    #####.#  
  #.#...#                 #......VT
  #.#.#.#                 #.#####  
  #...#.#               YN....#.#  
  #.###.#                 #####.#  
DI....#.#                 #.....#  
  #####.#                 #.###.#  
ZZ......#               QG....#..AS
  ###.###                 #######  
JO..#.#.#                 #.....#  
  #.#.#.#                 ###.#.#  
  #...#..DI             BU....#..LF
  #####.#                 #.#####  
YN......#               VT..#....QG
  #.###.#                 #.###.#  
  #.#...#                 #.....#  
  ###.###    J L     J    #.#.###  
  #.....#    O F     P    #.#...#  
  #.###.#####.#.#####.#####.###.#  
  #...#.#.#...#.....#.....#.#...#  
  #.#####.###.###.#.#.#########.#  
  #...#.#.....#...#.#.#.#.....#.#  
  #.###.#####.###.###.#.#.#######  
  #.#.........#...#.............#  
  #########.###.###.#############  
           B   J   C               
           U   P   P               """

sample_input3 = """             Z L X W       C                 
             Z P Q B       K                 
  ###########.#.#.#.#######.###############  
  #...#.......#.#.......#.#.......#.#.#...#  
  ###.#.#.#.#.#.#.#.###.#.#.#######.#.#.###  
  #.#...#.#.#...#.#.#...#...#...#.#.......#  
  #.###.#######.###.###.#.###.###.#.#######  
  #...#.......#.#...#...#.............#...#  
  #.#########.#######.#.#######.#######.###  
  #...#.#    F       R I       Z    #.#.#.#  
  #.###.#    D       E C       H    #.#.#.#  
  #.#...#                           #...#.#  
  #.###.#                           #.###.#  
  #.#....OA                       WB..#.#..ZH
  #.###.#                           #.#.#.#  
CJ......#                           #.....#  
  #######                           #######  
  #.#....CK                         #......IC
  #.###.#                           #.###.#  
  #.....#                           #...#.#  
  ###.###                           #.#.#.#  
XF....#.#                         RF..#.#.#  
  #####.#                           #######  
  #......CJ                       NM..#...#  
  ###.#.#                           #.###.#  
RE....#.#                           #......RF
  ###.###        X   X       L      #.#.#.#  
  #.....#        F   Q       P      #.#.#.#  
  ###.###########.###.#######.#########.###  
  #.....#...#.....#.......#...#.....#.#...#  
  #####.#.###.#######.#######.###.###.#.#.#  
  #.......#.......#.#.#.#.#...#...#...#.#.#  
  #####.###.#####.#.#.#.#.###.###.#.###.###  
  #.......#.....#.#...#...............#...#  
  #############.#.#.###.###################  
               A O F   N                     
               A A D   M                     """

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 23
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = 58
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 668
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 26
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 5
test_input = {
  'part': 2,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = None
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 6
test_input = {
  'part': 2,
  'input_str': sample_input3,
  'DEBUG': True,
}
test_expected = 396
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 7
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 7778
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)