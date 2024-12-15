"""

--- Day 15: Warehouse Woes ---

You appear back inside your own mini submarine! Each Historian drives their mini submarine in a different direction; maybe the Chief has his own submarine down here somewhere as well?

You look up to see a vast school of lanternfish swimming past you. On closer inspection, they seem quite anxious, so you drive your mini submarine over to see if you can help.

Because lanternfish populations grow rapidly, they need a lot of food, and that food needs to be stored somewhere. That's why these lanternfish have built elaborate warehouse complexes operated by robots!

These lanternfish seem so anxious because they have lost control of the robot that operates one of their most important warehouses! It is currently running amok, pushing around boxes in the warehouse with no regard for lanternfish logistics or lanternfish inventory management strategies.

Right now, none of the lanternfish are brave enough to swim up to an unpredictable robot so they could shut it off. However, if you could anticipate the robot's movements, maybe they could find a safe option.

The lanternfish already have a map of the warehouse and a list of movements the robot will attempt to make (your puzzle input). The problem is that the movements will sometimes fail as boxes are shifted around, making the actual movements of the robot difficult to predict.

For example:

##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
As the robot (@) attempts to move, if there are any boxes (O) in the way, the robot will also attempt to push those boxes. However, if this action would cause the robot or a box to move into a wall (#), nothing moves instead, including the robot. The initial positions of these are shown on the map at the top of the document the lanternfish gave you.

The rest of the document describes the moves (^ for up, v for down, < for left, > for right) that the robot will attempt to make, in order. (The moves form a single giant sequence; they are broken into multiple lines just to make copy-pasting easier. Newlines within the move sequence should be ignored.)

Here is a smaller example to get started:

########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<
Were the robot to attempt the given sequence of moves, it would push around the boxes as follows:

Initial state:
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

Move <:
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

Move ^:
########
#.@O.O.#
##..O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

Move ^:
########
#.@O.O.#
##..O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

Move >:
########
#..@OO.#
##..O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

Move >:
########
#...@OO#
##..O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

Move >:
########
#...@OO#
##..O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

Move v:
########
#....OO#
##..@..#
#...O..#
#.#.O..#
#...O..#
#...O..#
########

Move v:
########
#....OO#
##..@..#
#...O..#
#.#.O..#
#...O..#
#...O..#
########

Move <:
########
#....OO#
##.@...#
#...O..#
#.#.O..#
#...O..#
#...O..#
########

Move v:
########
#....OO#
##.....#
#..@O..#
#.#.O..#
#...O..#
#...O..#
########

Move >:
########
#....OO#
##.....#
#...@O.#
#.#.O..#
#...O..#
#...O..#
########

Move >:
########
#....OO#
##.....#
#....@O#
#.#.O..#
#...O..#
#...O..#
########

Move v:
########
#....OO#
##.....#
#.....O#
#.#.O@.#
#...O..#
#...O..#
########

Move <:
########
#....OO#
##.....#
#.....O#
#.#O@..#
#...O..#
#...O..#
########

Move <:
########
#....OO#
##.....#
#.....O#
#.#O@..#
#...O..#
#...O..#
########
The larger example has many more moves; after the robot has finished those moves, the warehouse would look like this:

##########
#.O.O.OOO#
#........#
#OO......#
#OO@.....#
#O#.....O#
#O.....OO#
#O.....OO#
#OO....OO#
##########
The lanternfish use their own custom Goods Positioning System (GPS for short) to track the locations of the boxes. The GPS coordinate of a box is equal to 100 times its distance from the top edge of the map plus its distance from the left edge of the map. (This process does not stop at wall tiles; measure all the way to the edges of the map.)

So, the box shown below has a distance of 1 from the top edge of the map and 4 from the left edge of the map, resulting in a GPS coordinate of 100 * 1 + 4 = 104.

#######
#...O..
#......
The lanternfish would like to know the sum of all boxes' GPS coordinates after the robot finishes moving. In the larger example, the sum of all boxes' GPS coordinates is 10092. In the smaller example, the sum is 2028.

Predict the motion of the robot and boxes in the warehouse. After the robot is finished moving, what is the sum of all boxes' GPS coordinates?


--- Part Two ---

The lanternfish use your information to find a safe moment to swim in and turn off the malfunctioning robot! Just as they start preparing a festival in your honor, reports start coming in that a second warehouse's robot is also malfunctioning.

This warehouse's layout is surprisingly similar to the one you just helped. There is one key difference: everything except the robot is twice as wide! The robot's list of movements doesn't change.

To get the wider warehouse's map, start with your original map and, for each tile, make the following changes:

If the tile is #, the new map contains ## instead.
If the tile is O, the new map contains [] instead.
If the tile is ., the new map contains .. instead.
If the tile is @, the new map contains @. instead.
This will produce a new warehouse map which is twice as wide and with wide boxes that are represented by []. (The robot does not change size.)

The larger example from before would now look like this:

####################
##....[]....[]..[]##
##............[]..##
##..[][]....[]..[]##
##....[]@.....[]..##
##[]##....[]......##
##[]....[]....[]..##
##..[][]..[]..[][]##
##........[]......##
####################
Because boxes are now twice as wide but the robot is still the same size and speed, boxes can be aligned such that they directly push two other boxes at once. For example, consider this situation:

#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^
After appropriately resizing this map, the robot would push around these boxes as follows:

Initial state:
##############
##......##..##
##..........##
##....[][]@.##
##....[]....##
##..........##
##############

Move <:
##############
##......##..##
##..........##
##...[][]@..##
##....[]....##
##..........##
##############

Move v:
##############
##......##..##
##..........##
##...[][]...##
##....[].@..##
##..........##
##############

Move v:
##############
##......##..##
##..........##
##...[][]...##
##....[]....##
##.......@..##
##############

Move <:
##############
##......##..##
##..........##
##...[][]...##
##....[]....##
##......@...##
##############

Move <:
##############
##......##..##
##..........##
##...[][]...##
##....[]....##
##.....@....##
##############

Move ^:
##############
##......##..##
##...[][]...##
##....[]....##
##.....@....##
##..........##
##############

Move ^:
##############
##......##..##
##...[][]...##
##....[]....##
##.....@....##
##..........##
##############

Move <:
##############
##......##..##
##...[][]...##
##....[]....##
##....@.....##
##..........##
##############

Move <:
##############
##......##..##
##...[][]...##
##....[]....##
##...@......##
##..........##
##############

Move ^:
##############
##......##..##
##...[][]...##
##...@[]....##
##..........##
##..........##
##############

Move ^:
##############
##...[].##..##
##...@.[]...##
##....[]....##
##..........##
##..........##
##############
This warehouse also uses GPS to locate the boxes. For these larger boxes, distances are measured from the edge of the map to the closest edge of the box in question. So, the box shown below has a distance of 1 from the top edge of the map and 5 from the left edge of the map, resulting in a GPS coordinate of 100 * 1 + 5 = 105.

##########
##...[]...
##........
In the scaled-up version of the larger example from above, after the robot has finished all of its moves, the warehouse would look like this:

####################
##[].......[].[][]##
##[]...........[].##
##[]........[][][]##
##[]......[]....[]##
##..##......[]....##
##..[]............##
##..@......[].[][]##
##......[][]..[]..##
####################
The sum of these boxes' GPS coordinates is 9021.

Predict the motion of the robot and boxes in this new, scaled-up warehouse. What is the sum of all boxes' final GPS coordinates?

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

def push_boxes_around_grid_with_walls_using_robot(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  [ map_data_with_newlines, moves_data_with_newlines ] = input_str.split('\n\n')
  map_data = map_data_with_newlines.split('\n')
  moves_data = ''.join(moves_data_with_newlines.split('\n'))


  # CONSTANTS
  
  WALL, EMPTY, BOX, ROBOT = '#', '.', 'O', '@'
  WIDE_BOX_L, WIDE_BOX_R = '[', ']'                                             # for part 2

  UP, DOWN, LEFT, RIGHT = '^', 'v', '<', '>'

  DELTAS = {
    UP: (-1, 0),
    DOWN: (+1, 0),
    LEFT: (0, -1),
    RIGHT: (0, +1),
  }

  H = len(map_data)
  W = len(map_data[0]) * (1 if part == 1 else 2)                                # PART 1: NORMAL GRID
                                                                                # PART 2: GRID IS TWICE AS WIDE


  # DATA STRUCTURE

  GRID = []

  def mapper(c):
    if part == 1: return [ c ]                                                  # PART 1: CHARACTER IS UNMODIFIED
    if c == WALL: return [ WALL, WALL ]                                         # PART 2: ALL CHARACTERS ARE WIDENED
    if c == BOX: return [ WIDE_BOX_L, WIDE_BOX_R ]
    if c == EMPTY: return [ EMPTY, EMPTY ]
    if c == ROBOT: return [ ROBOT, EMPTY ]
    assert False, f"Unrecognized character: {c}"

  for row in map_data:
    new_row = []
    for c in row:
      for cc in mapper(c): new_row.append(cc)
    GRID.append(new_row)


  # UTILITY

  def in_bounds(row, col):
    return 0 <= row < H and 0 <= col < W
  
  def draw(GRID):
    for row in GRID:
      print(''.join(row))
    print('')


  # INIT

  robot_row, robot_col = None, None
  for row in range(H):
    for col in range(W):
      if GRID[row][col] == ROBOT:
        robot_row, robot_col = row, col
        break
  assert robot_row != None and robot_col != None


  # ANALYZE

  TIME_AT_START = time.time()

  total_gps_coord = 0

  def valid_push_part1(row, col, move, push_stack):                             # we are pushing with `move` into (`row`, `col`)
    if not in_bounds(row, col): return False
    elif GRID[row][col] == WALL: return False
    elif GRID[row][col] == EMPTY: return True
    elif GRID[row][col] == BOX:
      push_stack.append((row, col))
      if move == UP:
        return valid_push(row - 1, col, move, push_stack)
      elif move == DOWN:
        return valid_push(row + 1, col, move, push_stack)
      elif move == LEFT:
        return valid_push(row, col - 1, move, push_stack)
      elif move == RIGHT:
        return valid_push(row, col + 1, move, push_stack)
      else:
        assert False, f"Unrecognized move: {move}"
    else:
      assert False, f"Unrecognized entity at row {row} col {col}: {GRID[row][col]}"

  def valid_push_part2(row, col, move, push_stack):                             # we are pushing with `move` into (`row`, `col`)
    if not in_bounds(row, col): return False
    elif GRID[row][col] == WALL: return False
    elif GRID[row][col] == EMPTY: return True
    elif GRID[row][col] in (WIDE_BOX_L, WIDE_BOX_R):
      if move == UP:
        if GRID[row][col] == WIDE_BOX_L:
          assert GRID[row][col + 1] == WIDE_BOX_R
          push_stack.append((row, col))
          push_stack.append((row, col + 1))
          return valid_push(row - 1, col, move, push_stack) and valid_push(row - 1, col + 1, move, push_stack)
        elif GRID[row][col] == WIDE_BOX_R:
          assert GRID[row][col - 1] == WIDE_BOX_L
          push_stack.append((row, col - 1))
          push_stack.append((row, col))
          return valid_push(row - 1, col - 1, move, push_stack) and valid_push(row - 1, col, move, push_stack)
        else:
          assert False, f"Unrecognized entity at row {row} col {col}: {GRID[row][col]}"
      elif move == DOWN:
        if GRID[row][col] == WIDE_BOX_L:
          assert GRID[row][col + 1] == WIDE_BOX_R
          push_stack.append((row, col))
          push_stack.append((row, col + 1))
          return valid_push(row + 1, col, move, push_stack) and valid_push(row + 1, col + 1, move, push_stack)
        elif GRID[row][col] == WIDE_BOX_R:
          assert GRID[row][col - 1] == WIDE_BOX_L
          push_stack.append((row, col - 1))
          push_stack.append((row, col))
          return valid_push(row + 1, col - 1, move, push_stack) and valid_push(row + 1, col, move, push_stack)
        else:
          assert False, f"Unrecognized entity at row {row} col {col}: {GRID[row][col]}"
      elif move == LEFT:
        if GRID[row][col] == WIDE_BOX_R:
          assert GRID[row][col - 1] == WIDE_BOX_L
          push_stack.append((row, col))                                         # NOTE: order is important!
          push_stack.append((row, col - 1))                                     # NOTE: order is important!
          return valid_push(row, col - 2, move, push_stack)
        else:
          assert False, f"Unrecognized entity at row {row} col {col}: {GRID[row][col]}"
      elif move == RIGHT:
        if GRID[row][col] == WIDE_BOX_L:
          assert GRID[row][col + 1] == WIDE_BOX_R
          push_stack.append((row, col))                                         # NOTE: order is important!
          push_stack.append((row, col + 1))                                     # NOTE: order is important!
          return valid_push(row, col + 2, move, push_stack)
        else:
          assert False, f"Unrecognized entity at row {row} col {col}: {GRID[row][col]}"
      else:
        assert False, f"Unrecognized move: {move}"
    else:
      assert False, f"Unrecognized entity at row {row} col {col}: {GRID[row][col]}"


  valid_push = valid_push_part1 if part == 1 else valid_push_part2              # PART 1: USE SIMPLER LOGIC
                                                                                # PART 2: STAGGERED BOXES CAN CAUSE BRANCHING EFFECTS
  
  box_indicator = BOX if part == 1 else WIDE_BOX_L                              # PART 1: GPS CALCULATED FROM 'O'
                                                                                # PART 2: GPS CALCULATED FROM '['


  if DISPLAY_EXTRA_INFO:
    print(f"Initial position:")
    draw(GRID)

  # Process moves
  for move in moves_data:
    dy, dx = DELTAS[move]
    push_stack = [(robot_row, robot_col)]
    visited = set()
    is_push_valid = valid_push(robot_row + dy, robot_col + dx, move, push_stack)

    if DEBUG and DISPLAY_EXTRA_INFO:
      print(f"Move: {move}")
      print(f"Push valid? {is_push_valid}")
      if is_push_valid: print(f"Push stack: {push_stack}")
      print('')

    if is_push_valid:
      while push_stack:
        (r, c) = push_stack.pop()
        if (r, c) in visited: continue                                          # don't process a pushed box twice!
        visited.add((r, c))
        nr, nc = r + dy, c + dx
        GRID[nr][nc] = GRID[r][c]
        GRID[r][c] = EMPTY
      
      robot_row += dy                                                           # adjust robot coords if push was valid
      robot_col += dx

  # Add up total GPS
  for row in range(H):
    for col in range(W):
      if GRID[row][col] == box_indicator:
        total_gps_coord += row * 100 + col

  if DISPLAY_EXTRA_INFO:
    print(f"Final position:")
    draw(GRID)
  
  return total_gps_coord


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = push_boxes_around_grid_with_walls_using_robot
skipped_tests = set([ 2, 3, 4, 5 ])
skipped_tests = set([ 3, 4, 5 ])
skipped_tests = set([ 4, 5 ])
skipped_tests = set([ 5 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{str(DAY_NUM).zfill(2)}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^"""

sample_input2 = """########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 10092
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': sample_input2,
  'DEBUG': True,
}
test_expected = 2028
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 1515788
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 9021
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 5
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 1516544
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)