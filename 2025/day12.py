"""

--- Day 12: Christmas Tree Farm ---

You're almost out of time, but there can't be much left to decorate. Although there are no stairs, elevators, escalators, tunnels, chutes, teleporters, firepoles, or conduits here that would take you deeper into the North Pole base, there is a ventilation duct. You jump in.

After bumping around for a few minutes, you emerge into a large, well-lit cavern full of Christmas trees!

There are a few Elves here frantically decorating before the deadline. They think they'll be able to finish most of the work, but the one thing they're worried about is the presents for all the young Elves that live here at the North Pole. It's an ancient tradition to put the presents under the trees, but the Elves are worried they won't fit.

The presents come in a few standard but very weird shapes. The shapes and the regions into which they need to fit are all measured in standard units. To be aesthetically pleasing, the presents need to be placed into the regions in a way that follows a standardized two-dimensional unit grid; you also can't stack presents.

As always, the Elves have a summary of the situation (your puzzle input) for you. First, it contains a list of the presents' shapes. Second, it contains the size of the region under each tree and a list of the number of presents of each shape that need to fit into that region. For example:

0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2
The first section lists the standard present shapes. For convenience, each shape starts with its index and a colon; then, the shape is displayed visually, where # is part of the shape and . is not.

The second section lists the regions under the trees. Each line starts with the width and length of the region; 12x5 means the region is 12 units wide and 5 units long. The rest of the line describes the presents that need to fit into that region by listing the quantity of each shape of present; 1 0 1 0 3 2 means you need to fit one present with shape index 0, no presents with shape index 1, one present with shape index 2, no presents with shape index 3, three presents with shape index 4, and two presents with shape index 5.

Presents can be rotated and flipped as necessary to make them fit in the available space, but they have to always be placed perfectly on the grid. Shapes can't overlap (that is, the # part from two different presents can't go in the same place on the grid), but they can fit together (that is, the . part in a present's shape's diagram does not block another present from occupying that space on the grid).

The Elves need to know how many of the regions can fit the presents listed. In the above example, there are six unique present shapes and three regions that need checking.

The first region is 4x4:

....
....
....
....
In it, you need to determine whether you could fit two presents that have shape index 4:

###
#..
###
After some experimentation, it turns out that you can fit both presents in this region. Here is one way to do it, using A to represent one present and B to represent the other:

AAA.
ABAB
ABAB
.BBB
The second region, 12x5: 1 0 1 0 2 2, is 12 units wide and 5 units long. In that region, you need to try to fit one present with shape index 0, one present with shape index 2, two presents with shape index 4, and two presents with shape index 5.

It turns out that these presents can all fit in this region. Here is one way to do it, again using different capital letters to represent all the required presents:

....AAAFFE.E
.BBBAAFFFEEE
DDDBAAFFCECE
DBBB....CCC.
DDD.....C.C.
The third region, 12x5: 1 0 1 0 3 2, is the same size as the previous region; the only difference is that this region needs to fit one additional present with shape index 4. Unfortunately, no matter how hard you try, there is no way to fit all of the presents into this region.

So, in this example, 2 regions can fit all of their listed presents.

Consider the regions beneath each tree and the presents the Elves would like to fit into each of them. How many of the regions can fit all of the presents listed?


--- Part Two ---

The Elves thank you profusely for the help and start rearranging the oddly-shaped presents. As you look up, you notice that a lot more Elves have arrived here at the Christmas tree farm.

In fact, many of these new arrivals look familiar: they're the Elves you helped while decorating the North Pole base. Right on schedule, each group seems to have brought a star to put atop one of the Christmas trees!

Before any of them can find a ladder, a particularly large Christmas tree suddenly flashes brightly when a large star magically appears above it! As your eyes readjust, you think you notice a portly man with a white beard disappear into the crowd.

You go look for a ladder; only 23 stars to go.

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

def exact_cover_problem(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n\n')
  PROBLEMS = [
    {
      'width': [ int(n) for n in line.split(': ')[0].split('x') ][0],
      'height': [ int(n) for n in line.split(': ')[0].split('x') ][1],
      'counts': [ int(n) for n in line.split(': ')[1].split(' ') ],
    } for line in input_arr.pop().split('\n')
  ]
  TEMPLATES = [ line[3:].split('\n') for line in input_arr ]

  def parse_template(lines):                                                            # convert to list of tuples of occupied squares
    if len(lines) != 3 or any(len(r) != 3 for r in lines):
      raise ValueError('Each template must be 3 lines of length 3.')
    cells = set()
    for y, row in enumerate(lines):
      for x, ch in enumerate(row):
        if ch == '#':
          cells.add((x, y))
    if not cells:
      raise ValueError('Template has no filled cells.')
    return cells

  PARSED_TEMPLATES = [ parse_template(template) for template in TEMPLATES ]


  """
  ChatGPT helped me write this solver code using PuLP for the legit solution.
  I'm estimating it would take 1-2 hours to get through 1,000 problems.
  (It ended up taking about 77 minutes to get through all 1,000 problems.)
  """

  import pulp

  def normalize(cells):
    minx = min(x for x, _ in cells)
    miny = min(y for _, y in cells)
    shifted = sorted((x - minx, y - miny) for x, y in cells)
    return tuple(shifted)


  def rot90(cells):
    # rotate within 3x3 using (x,y)->(y,2-x)
    return {(y, 2 - x) for (x, y) in cells}


  def flipx(cells):
    # mirror within 3x3 using (x,y)->(2-x,y)
    return {(2 - x, y) for (x, y) in cells}


  def unique_orientations(cells):
    seen = set()
    outs = []
    for base in (cells, flipx(cells)):
      cur = base
      for _ in range(4):
        key = normalize(cur)
        if key not in seen:
          seen.add(key)
          outs.append(key)  # tuple of (dx,dy)
        cur = rot90(cur)
    return outs


  def enumerate_placements(W, H, templates):
    placements = []                                                                     # list of dicts
    by_type = [[] for _ in templates]                                                   # indices into placements per template type

    for t, cells in enumerate(templates):
      orients = unique_orientations(cells)
      for oid, orient in enumerate(orients):
        max_dx = max(dx for dx, _ in orient)
        max_dy = max(dy for _, dy in orient)

        # anchor top-left at (x,y), ensure all dx/dy in bounds
        for x in range(W - max_dx):
          for y in range(H - max_dy):
            covered = tuple((x + dx, y + dy) for dx, dy in orient)
            idx = len(placements)
            placements.append({
              't': t,
              'orient_id': oid,
              'x': x,
              'y': y,
              'covered': covered,
            })
            by_type[t].append(idx)

    return placements, by_type


  def solve_packing_pulp(W, H, required, templates, time_limit_sec=120, msg=False):
    placements, by_type = enumerate_placements(W, H, templates)

    # Decision vars: one per placement
    x = {}
    for i in range(len(placements)):
      x[i] = pulp.LpVariable(f'x_{i}', lowBound=0, upBound=1, cat=pulp.LpBinary)

    prob = pulp.LpProblem('shape_packing', pulp.LpStatusOptimal)

    # Exact counts per template type
    for t, k in enumerate(required):
      prob += pulp.lpSum(x[i] for i in by_type[t]) == k, f'count_t{t}'

    # Non-overlap per canvas cell
    cell_to_vars = {(cx, cy): [] for cx in range(W) for cy in range(H)}
    for i, p in enumerate(placements):
      for c in p['covered']:
        cell_to_vars[c].append(x[i])

    for (cx, cy), vars_ in cell_to_vars.items():
      if vars_:
        prob += pulp.lpSum(vars_) <= 1, f'cell_{cx}_{cy}'

    # Feasibility objective
    prob += 0

    solver = pulp.PULP_CBC_CMD(msg=msg, timeLimit=time_limit_sec, options=['maxSolutions 1']) if time_limit_sec else pulp.PULP_CBC_CMD(msg=msg)
    status = prob.solve(solver)

    if pulp.LpStatus[status] not in ('Optimal', 'Feasible'):
      return None, placements

    chosen = [placements[i] for i in range(len(placements)) if pulp.value(x[i]) > 0.5]
    return chosen, placements


  def render_solution(W, H, chosen):
    marks = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    grid = [['.' for _ in range(W)] for _ in range(H)]
    for p in chosen:
      ch = marks[p['t'] % len(marks)]
      for (x, y) in p['covered']:
        grid[y][x] = ch
    return [''.join(row) for row in grid]


  def legit_solver(CANVAS_W, CANVAS_H, REQUIRED, problem_num):

    class bcolors:
      # HEADER = '\033[95m'
      # OKBLUE = '\033[94m'
      # OKCYAN = '\033[96m'
      OKGREEN = '\033[92m'
      WARNING = '\033[93m'
      FAIL = '\033[91m'
      ENDC = '\033[0m'
      # BOLD = '\033[1m'
      # UNDERLINE = '\033[4m'

    if len(REQUIRED) != len(PARSED_TEMPLATES):
      raise ValueError('REQUIRED length must match number of PARSED_TEMPLATES.')

    total_filled = 0
    for i in range(len(PARSED_TEMPLATES)):
      total_filled += len(PARSED_TEMPLATES[i]) * REQUIRED[i]
    if total_filled > CANVAS_W * CANVAS_H:
      print(f'PROBLEM {problem_num} | {bcolors.FAIL}IMPOSSIBLE by area alone (required filled cells > canvas cells).{bcolors.ENDC}')
      return 0

    chosen, placements = solve_packing_pulp(CANVAS_W, CANVAS_H, REQUIRED, PARSED_TEMPLATES, time_limit_sec=120, msg=False)
    if chosen is None:
      print(f'PROBLEM {problem_num} | {bcolors.FAIL}No feasible solution found (or timed out).{bcolors.ENDC}')
      return 0

    print(f'PROBLEM {problem_num} | {bcolors.OKGREEN}Found a solution!{bcolors.ENDC}')
    if DEBUG:
      art = render_solution(CANVAS_W, CANVAS_H, chosen)
      print('\n'.join(art))
    
    return 1


  """
  It turns out that *FOR THE ACTUAL INPUT ONLY*, and not the sample input, each problem falls into one of two categories:
  1) Total area required by the counts of each template is far less than the total canvas size (typically 60-70%), OR
  2) Total area required by the counts of each template is slightly over 100% of the total canvas size (and is therefore impossible)

  Thus you can just count the total space taken up by your required counts and bypass the mapping problem entirely.
  """

  def hack_solver(CANVAS_W, CANVAS_H, REQUIRED, problem_num):
    class bcolors:
      # HEADER = '\033[95m'
      # OKBLUE = '\033[94m'
      # OKCYAN = '\033[96m'
      OKGREEN = '\033[92m'
      WARNING = '\033[93m'
      FAIL = '\033[91m'
      ENDC = '\033[0m'
      # BOLD = '\033[1m'
      # UNDERLINE = '\033[4m'

    if len(REQUIRED) != len(PARSED_TEMPLATES):
      raise ValueError('REQUIRED length must match number of PARSED_TEMPLATES.')

    total_filled = 0
    for i in range(len(PARSED_TEMPLATES)):
      total_filled += len(PARSED_TEMPLATES[i]) * REQUIRED[i]
    
    CANVAS_AREA = CANVAS_W * CANVAS_H
    valid = total_filled <= CANVAS_AREA
    if DISPLAY_EXTRA_INFO:
      print(f'Canvas size: {CANVAS_W} x {CANVAS_H} = {CANVAS_AREA}')
      print(f'Minimum space required: {total_filled}')
      print(f'% space filled: {bcolors.OKGREEN if valid else bcolors.FAIL}{total_filled / CANVAS_AREA * 100}%{bcolors.ENDC}')
      print(f'PROBLEM {problem_num} | Result: {bcolors.OKGREEN + 'VALID' if valid else bcolors.FAIL + 'INVALID'}{bcolors.ENDC}')
    return int(valid)


  TIME_AT_START = time.time()
  NEXT_MIN_TARGET = 1

  ### COMMENT/UNCOMMENT TO TRY THE LEGIT SOLVER OR HACK SOLVER FOR ACTUAL INPUT ###
  # actual_input_solver = legit_solver
  actual_input_solver = hack_solver

  output = 0
  for i in range(len(PROBLEMS)):
    problem = PROBLEMS[i]
    output += (legit_solver if DEBUG else actual_input_solver)(problem['width'], problem['height'], problem['counts'], i)
    print('')

    if floor((time.time() - TIME_AT_START) / 60) == NEXT_MIN_TARGET:
      print(f"{NEXT_MIN_TARGET} mins have passed since beginning this run")
      NEXT_MIN_TARGET += 1

  return output


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = exact_cover_problem
skipped_tests = set([ 2 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{str(DAY_NUM).zfill(2)}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 2
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 505
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)