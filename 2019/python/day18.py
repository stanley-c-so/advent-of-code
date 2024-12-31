"""

--- Day 18: Many-Worlds Interpretation ---

As you approach Neptune, a planetary security system detects you and activates a giant tractor beam on Triton! You have no choice but to land.

A scan of the local area reveals only one interesting feature: a massive underground vault. You generate a map of the tunnels (your puzzle input). The tunnels are too narrow to move diagonally.

Only one entrance (marked @) is present among the open passages (marked .) and stone walls (#), but you also detect an assortment of keys (shown as lowercase letters) and doors (shown as uppercase letters). Keys of a given letter open the door of the same letter: a opens A, b opens B, and so on. You aren't sure which key you need to disable the tractor beam, so you'll need to collect all of them.

For example, suppose you have the following map:

#########
#b.A.@.a#
#########
Starting from the entrance (@), you can only access a large door (A) and a key (a). Moving toward the door doesn't help you, but you can move 2 steps to collect the key, unlocking A in the process:

#########
#b.....@#
#########
Then, you can move 6 steps to collect the only other key, b:

#########
#@......#
#########
So, collecting every key took a total of 8 steps.

Here is a larger example:

########################
#f.D.E.e.C.b.A.@.a.B.c.#
######################.#
#d.....................#
########################
The only reasonable move is to take key a and unlock door A:

########################
#f.D.E.e.C.b.....@.B.c.#
######################.#
#d.....................#
########################
Then, do the same with key b:

########################
#f.D.E.e.C.@.........c.#
######################.#
#d.....................#
########################
...and the same with key c:

########################
#f.D.E.e.............@.#
######################.#
#d.....................#
########################
Now, you have a choice between keys d and e. While key e is closer, collecting it now would be slower in the long run than collecting key d first, so that's the best choice:

########################
#f...E.e...............#
######################.#
#@.....................#
########################
Finally, collect key e to unlock door E, then collect key f, taking a grand total of 86 steps.

Here are a few more examples:

########################
#...............b.C.D.f#
#.######################
#.....@.a.B.c.d.A.e.F.g#
########################
Shortest path is 132 steps: b, a, c, d, f, e, g

#################
#i.G..c...e..H.p#
########.########
#j.A..b...f..D.o#
########@########
#k.E..a...g..B.n#
########.########
#l.F..d...h..C.m#
#################
Shortest paths are 136 steps;
one is: a, f, b, j, g, n, h, d, l, o, e, p, c, i, k, m

########################
#@..............ac.GI.b#
###d#e#f################
###A#B#C################
###g#h#i################
########################
Shortest paths are 81 steps; one is: a, c, f, i, d, g, b, e, h

How many steps is the shortest path that collects all of the keys?


--- Part Two ---

You arrive at the vault only to discover that there is not one vault, but four - each with its own entrance.

On your map, find the area in the middle that looks like this:

...
.@.
...
Update your map to instead use the correct data:

@#@
###
@#@
This change will split your map into four separate sections, each with its own entrance:

#######       #######
#a.#Cd#       #a.#Cd#
##...##       ##@#@##
##.@.##  -->  #######
##...##       ##@#@##
#cB#Ab#       #cB#Ab#
#######       #######
Because some of the keys are for doors in other vaults, it would take much too long to collect all of the keys by yourself. Instead, you deploy four remote-controlled robots. Each starts at one of the entrances (@).

Your goal is still to collect all of the keys in the fewest steps, but now, each robot has its own position and can move independently. You can only remotely control a single robot at a time. Collecting a key instantly unlocks any corresponding doors, regardless of the vault in which the key or door is found.

For example, in the map above, the top-left robot first collects key a, unlocking door A in the bottom-right vault:

#######
#@.#Cd#
##.#@##
#######
##@#@##
#cB#.b#
#######
Then, the bottom-right robot collects key b, unlocking door B in the bottom-left vault:

#######
#@.#Cd#
##.#@##
#######
##@#.##
#c.#.@#
#######
Then, the bottom-left robot collects key c:

#######
#@.#.d#
##.#@##
#######
##.#.##
#@.#.@#
#######
Finally, the top-right robot collects key d:

#######
#@.#.@#
##.#.##
#######
##.#.##
#@.#.@#
#######
In this example, it only took 8 steps to collect all of the keys.

Sometimes, multiple robots might have keys available, or a robot might have to wait for multiple keys to be collected:

###############
#d.ABC.#.....a#
######@#@######
###############
######@#@######
#b.....#.....c#
###############
First, the top-right, bottom-left, and bottom-right robots take turns collecting keys a, b, and c, a total of 6 + 6 + 6 = 18 steps. Then, the top-left robot can access key d, spending another 6 steps; collecting all of the keys here takes a minimum of 24 steps.

Here's a more complex example:

#############
#DcBa.#.GhKl#
#.###@#@#I###
#e#d#####j#k#
###C#@#@###J#
#fEbA.#.FgHi#
#############
Top-left robot collects key a.
Bottom-left robot collects key b.
Top-left robot collects key c.
Bottom-left robot collects key d.
Top-left robot collects key e.
Bottom-left robot collects key f.
Bottom-right robot collects key g.
Top-right robot collects key h.
Bottom-right robot collects key i.
Top-right robot collects key j.
Bottom-right robot collects key k.
Top-right robot collects key l.
In the above example, the fewest steps to collect all of the keys is 32.

Here's an example with more choices:

#############
#g#f.D#..h#l#
#F###e#E###.#
#dCba@#@BcIJ#
#############
#nK.L@#@G...#
#M###N#H###.#
#o#m..#i#jk.#
#############
One solution with the fewest steps is:

Top-left robot collects key e.
Top-right robot collects key h.
Bottom-right robot collects key i.
Top-left robot collects key a.
Top-left robot collects key b.
Top-right robot collects key c.
Top-left robot collects key d.
Top-left robot collects key f.
Top-left robot collects key g.
Bottom-right robot collects key k.
Bottom-right robot collects key j.
Top-right robot collects key l.
Bottom-left robot collects key n.
Bottom-left robot collects key m.
Bottom-left robot collects key o.
This example requires at least 72 steps to collect all keys.

After updating your map and using the remote-controlled robots, what is the fewest steps necessary to collect all of the keys?

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

def navigate_separate_mazes_with_locks_and_shared_keys(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  GRID = [ [ c for c in row ] for row in input_str.split('\n') ]


  # CONSTANTS

  DELTAS = (+1, 0), (-1, 0), (0, +1), (0, -1)

  H, W = len(GRID), len(GRID[0])

  WALL, FLOOR = '#', '.'
  ROBOT = '@'


  # DATA STRUCTURES

  KEYS = set()
  GRAPHS = []                                                       # PART 2: TL, TR, BL, BR quadrants
  ROBOTS = []                                                       # PART 2: TL, TR, BL, BR quadrants


  # UTILITY

  def is_key(c):
    return ord('a') <= ord(c) <= ord('z')

  def is_lock(c):
    return ord('A') <= ord(c) <= ord('Z')

  def can_open(c, inventory):
    if not is_lock(c): return True
    key = c.lower()
    return key in inventory

  def copy_of_inventory_plus_key(inventory, key):
    copy = inventory.copy()
    copy.add(key)
    return copy


  # DISCOVERY

  part_2_transformation_detected = False
  for row in range(H):
    for col in range(W):
      if is_key(GRID[row][col]):
        KEYS.add(GRID[row][col])

      if part == 1:                                                             # PART 1: ONLY ONE ROBOT TO BE FOUND

        if GRID[row][col] == ROBOT:
          ROBOTS.append((row, col))

      else:                                                                     # PART 2: MIDDLE OF MAP GETS TRANSFORMED INTO CROSS-WALL
                                                                                # THAT SPLITS UP GRID INTO 4 QUADRANTS, EACH WITH A ROBOT

        if not part_2_transformation_detected:

          # if you stumble upon a bot, then the transformation is already good, so switch the flag
          if GRID[row][col] == ROBOT:
            assert GRID[row][col + 2] == ROBOT, f"SHOULD HAVE FOUND THE TRANSFORMATION WITH TOP LEFT AT row={row}, col={col}"
            assert GRID[row + 2][col] == ROBOT, f"SHOULD HAVE FOUND THE TRANSFORMATION WITH TOP LEFT AT row={row}, col={col}"
            assert GRID[row + 2][col + 2] == ROBOT, f"SHOULD HAVE FOUND THE TRANSFORMATION WITH TOP LEFT AT row={row}, col={col}"
            
            # record the robot starting locations
            ROBOTS.append((row, col))
            ROBOTS.append((row, col + 2))
            ROBOTS.append((row + 2, col))
            ROBOTS.append((row + 2, col + 2))
            part_2_transformation_detected = True

          # looking down-right: if you detect the single bot scenario (no adjacent walls), make the transformation happen and switch the flag
          elif col < W - 1 and GRID[row + 1][col + 1] == ROBOT and \
            {
              GRID[row][col + 1],
              GRID[row + 1][col],
              GRID[row + 1][col + 2],
              GRID[row + 2][col + 1]
            } == { FLOOR }:

            # actually transform the map
            for dy in range(3):
              for dx in range(3):
                GRID[row + dy][col + dx] = WALL
            GRID[row][col] = ROBOT
            GRID[row][col + 2] = ROBOT
            GRID[row + 2][col] = ROBOT
            GRID[row + 2][col + 2] = ROBOT

            # record the robot starting locations
            ROBOTS.append((row, col))
            ROBOTS.append((row, col + 2))
            ROBOTS.append((row + 2, col))
            ROBOTS.append((row + 2, col + 2))
            part_2_transformation_detected = True

  assert len(ROBOTS) == (1 if part == 1 else 4)                                 # PART 1: 1 ROBOT
                                                                                # PART 2: 4 ROBOTS
  if part == 2:
    assert part_2_transformation_detected, f"DID NOT FIND THE TRANSFORMATION IN PART 2"


  # TRANSFORM GRID(S) TO GRAPH(S) FOR DIJKSTRA'S

  for i in range(len(ROBOTS)):
    GRAPH = {}
    stack = [ ROBOTS[i] ]
    while stack:
      (row, col) = stack.pop()
      landmark = GRID[row][col]
      if landmark in GRAPH: continue
      GRAPH[landmark] = {}

      Q = deque()
      Q.append((row, col, 0))
      visited = {}
      neighbors = {}
      while len(Q):
        r, c, moves = Q.popleft()

        if (r, c) in visited and visited[(r, c)] <= moves: continue
        visited[(r, c)] = moves

        if GRID[r][c] != FLOOR and (r, c) != (row, col):
          neighbors[(r, c)] = moves
        else:
          for dy, dx in DELTAS:
            nr, nc = r + dy, c + dx
            if 0 <= nr < H and 0 <= nc < W and GRID[nr][nc] != WALL:
              Q.append((nr, nc, moves + 1))

      for (r, c) in neighbors:
        neighbor = GRID[r][c]
        moves = neighbors[(r, c)]
        GRAPH[landmark][neighbor] = moves
        stack.append((r, c))

    GRAPHS.append(GRAPH)


  # ANALYZE: DIJKSTRA'S ALGORITHM

  print('RUNNING ANALYSIS (PLEASE WAIT)...')
  TIME_AT_START = time.time()

  if DISPLAY_EXTRA_INFO:
    print(f"All keys in the map: {', '.join(sorted(KEYS))}")
    print('')

  PQ = PriorityQueue()
  initial_landmarks_tup = tuple([ GRID[row][col] for (row, col) in ROBOTS ])    # each position stores the unique landmark symbol where the robot is located
  initial_inventory_tup = tuple()
  PQ.put( ( 0, initial_landmarks_tup, initial_inventory_tup ) )
  COST = {}

  while not PQ.empty():
    ( cost, landmarks_tup, inventory_tup ) = PQ.get()

    state = landmarks_tup + inventory_tup
    if state in COST and COST[state] <= cost: continue
    COST[state] = cost


    ### WIN CONDITION ###

    if len(inventory_tup) == len(KEYS):
      print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")                 # test 4: ~0.28 seconds (very long if you use BFS instead of dijkstra's)
                                                                                # part 1: ~0.11 seconds
                                                                                # part 2: ~23.12 seconds
      return cost
    

    ### CONTINUE SEARCH ###

    inventory_set = set(inventory_tup)
    landmarks_list = list(landmarks_tup)
    for i in range(len(ROBOTS)):
      landmark = landmarks_list[i]
      GRAPH = GRAPHS[i]
      for neighbor in GRAPH[landmark]:
        if can_open(neighbor, inventory_set):

          next_inventory_set = copy_of_inventory_plus_key(inventory_set, neighbor) if is_key(neighbor) else inventory_set
          next_inventory_tup = tuple(sorted(next_inventory_set))

          landmarks_list_copy = landmarks_list.copy()
          landmarks_list_copy[i] = neighbor
          next_landmarks_tup = tuple(landmarks_list_copy)

          PQ.put( (
            cost + GRAPH[landmark][neighbor],
            next_landmarks_tup,
            next_inventory_tup,
          ) )
    
  assert False, f"DID NOT FIND A SOLUTION"


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = navigate_separate_mazes_with_locks_and_shared_keys
skipped_tests = set([ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ])
skipped_tests = set([ 4, 6, 7, 8, 9, 10, 11 ])                                  # test 4 VERY long if you do BFS instead of dijkstra's
skipped_tests = set([ 6, 7, 8, 9, 10, 11 ])
skipped_tests = set([ 7, 8, 9, 10, 11 ])
skipped_tests = set([ 11 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{str(DAY_NUM).zfill(2)}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """#########
#b.A.@.a#
#########"""

sample_input2 = """########################
#f.D.E.e.C.b.A.@.a.B.c.#
######################.#
#d.....................#
########################"""

sample_input3 = """########################
#...............b.C.D.f#
#.######################
#.....@.a.B.c.d.A.e.F.g#
########################"""

sample_input4 = """#################
#i.G..c...e..H.p#
########.########
#j.A..b...f..D.o#
########@########
#k.E..a...g..B.n#
########.########
#l.F..d...h..C.m#
#################"""

sample_input5 = """########################
#@..............ac.GI.b#
###d#e#f################
###A#B#C################
###g#h#i################
########################"""

sample_input6 = """#######
#a.#Cd#
##...##
##.@.##
##...##
#cB#Ab#
#######"""

sample_input7 = """###############
#d.ABC.#.....a#
######@#@######
###############
######@#@######
#b.....#.....c#
###############"""

sample_input8 = """#############
#DcBa.#.GhKl#
#.###@#@#I###
#e#d#####j#k#
###C#@#@###J#
#fEbA.#.FgHi#
#############"""

sample_input9 = """#############
#g#f.D#..h#l#
#F###e#E###.#
#dCba@#@BcIJ#
#############
#nK.L@#@G...#
#M###N#H###.#
#o#m..#i#jk.#
#############"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 8
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = 86
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 1,
  'input_str': sample_input3,
  'DEBUG': True,
}
test_expected = 132
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 1,
  'input_str': sample_input4,
  'DEBUG': True,
}
test_expected = 136
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 5
test_input = {
  'part': 1,
  'input_str': sample_input5,
  'DEBUG': True,
}
test_expected = 81
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 6
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 4762
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 7
test_input = {
  'part': 2,
  'input_str': sample_input6,
  'DEBUG': True,
}
test_expected = 8
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 8
test_input = {
  'part': 2,
  'input_str': sample_input7,
  'DEBUG': True,
}
test_expected = 24
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 9
test_input = {
  'part': 2,
  'input_str': sample_input8,
  'DEBUG': True,
}
test_expected = 32
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 10
test_input = {
  'part': 2,
  'input_str': sample_input9,
  'DEBUG': True,
}
test_expected = 72
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 11
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 1876
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)