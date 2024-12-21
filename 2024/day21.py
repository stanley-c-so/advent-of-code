"""

COPY + PASTE PUZZLE DESCRIPTION HERE (PART 1)


COPY + PASTE PUZZLE DESCRIPTION HERE (PART 2)

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

def NAME_OF_FUNC_HERE(part, input_str, DEBUG = False, *args):

  # PARSE INPUT DATA

  TARGETS = input_str.split('\n')


  # CONSTANTS

  A = 'A'
  U, D, L, R = '^', 'v', '<', '>'

  NUMERIC_KEYPAD_COORDS_BY_C = {
    '7': (0, 0),
    '8': (0, 1),
    '9': (0, 2),
    '4': (1, 0),
    '5': (1, 1),
    '6': (1, 2),
    '1': (2, 0),
    '2': (2, 1),
    '3': (2, 2),
    '0': (3, 1),
    A: (3, 2),
  }

  DIRECTIONAL_KEYPAD_COORDS_BY_C = {
    U: (0, 1),
    A: (0, 2),
    L: (1, 0),
    D: (1, 1),
    R: (1, 2),
  }

  SYMBOL_BY_DELTAS = {
    (-1, 0): U,
    (0, -1): L,
    (+1, 0): D,
    (0, +1): R,
  }


  # UTILITY

  def keypad_all_routes(a, b, COORD_REF, FORBIDDEN):
    start_row, start_col = COORD_REF[a]
    end_row, end_col = COORD_REF[b]
    dy, dx = end_row - start_row, end_col - start_col
    ways = set()
    path = []
    def backtrack(row, col):
      if (row, col) == FORBIDDEN:
        return
      elif (row, col) == (end_row, end_col):
        ways.add(''.join(path))
      else:
        if row != end_row:
          margin = 1 if dy > 0 else -1
          deltas = (margin, 0)
          path.append(SYMBOL_BY_DELTAS[deltas])
          backtrack(row + margin, col)
          path.pop()
        if col != end_col:
          margin = 1 if dx > 0 else -1
          deltas = (0, margin)
          path.append(SYMBOL_BY_DELTAS[deltas])
          backtrack(row, col + margin)
          path.pop()
    
    backtrack(start_row, start_col)
    return ways


  # PRE-PROCESSING

  ALL_PATHS_ROBOT_1 = {}
  for num_key_a in NUMERIC_KEYPAD_COORDS_BY_C.keys():
    for num_key_b in NUMERIC_KEYPAD_COORDS_BY_C.keys():
      if (num_key_a, num_key_b) not in ALL_PATHS_ROBOT_1: ALL_PATHS_ROBOT_1[(num_key_a, num_key_b)] = set()
      for way in keypad_all_routes(num_key_a, num_key_b, NUMERIC_KEYPAD_COORDS_BY_C, (3, 0)):
        ALL_PATHS_ROBOT_1[(num_key_a, num_key_b)].add(way)

  # print(ALL_PATHS_ROBOT_1)
  # assert 0, 'test'
  # {('7', '7'): {''}, ('7', '8'): {'>'}, ('7', '9'): {'>>'}, ('7', '4'): {'v'}, ('7', '5'): {'>v', 'v>'}, ('7', '6'): {'v>>', '>v>', '>>v'}, ('7', '1'): {'vv'}, ('7', '2'): {'vv>', '>vv', 'v>v'}, ('7', '3'): {'v>>v', '>>vv', 'v>v>', '>v>v', 'vv>>', '>vv>'}, ('7', '0'): {'vv>v', 'v>vv', '>vvv'}, ('7', 'A'): {'v>>vv', 'v>v>v', '>vv>v', '>vvv>', 'vv>v>', '>>vvv', 'v>vv>', 'vv>>v', '>v>vv'}, ('8', '7'): {'<'}, ('8', '8'): {''}, ('8', '9'): {'>'}, ('8', '4'): {'v<', '<v'}, ('8', '5'): {'v'}, ('8', '6'): {'>v', 'v>'}, ('8', '1'): {'<vv', 'v<v', 'vv<'}, ('8', '2'): {'vv'}, ('8', '3'): {'vv>', '>vv', 'v>v'}, ('8', '0'): {'vvv'}, ('8', 'A'): {'vv>v', 'vvv>', 'v>vv', '>vvv'}, ('9', '7'): {'<<'}, ('9', '8'): {'<'}, ('9', '9'): {''}, ('9', '4'): {'v<<', '<v<', '<<v'}, ('9', '5'): {'v<', '<v'}, ('9', '6'): {'v'}, ('9', '1'): {'v<<v', '<v<v', '<<vv', 'v<v<', '<vv<', 'vv<<'}, ('9', '2'): {'<vv', 'v<v', 'vv<'}, ('9', '3'): {'vv'}, ('9', '0'): {'vv<v', 'vvv<', '<vvv', 'v<vv'}, ('9', 'A'): {'vvv'}, ('4', '7'): {'^'}, ('4', '8'): {'^>', '>^'}, ('4', '9'): {'^>>', '>^>', '>>^'}, ('4', '4'): {''}, ('4', '5'): {'>'}, ('4', '6'): {'>>'}, ('4', '1'): {'v'}, ('4', '2'): {'>v', 'v>'}, ('4', '3'): {'v>>', '>v>', '>>v'}, ('4', '0'): {'>vv', 'v>v'}, ('4', 'A'): {'v>>v', '>>vv', 'v>v>', '>v>v', '>vv>'}, ('5', '7'): {'^<', '<^'}, ('5', '8'): {'^'}, ('5', '9'): {'^>', '>^'}, ('5', '4'): {'<'}, ('5', '5'): {''}, ('5', '6'): {'>'}, ('5', '1'): {'v<', '<v'}, ('5', '2'): {'v'}, ('5', '3'): {'>v', 'v>'}, ('5', '0'): {'vv'}, ('5', 'A'): {'vv>', '>vv', 'v>v'}, ('6', '7'): {'<^<', '^<<', '<<^'}, ('6', '8'): {'^<', '<^'}, ('6', '9'): {'^'}, ('6', '4'): {'<<'}, ('6', '5'): {'<'}, ('6', '6'): {''}, ('6', '1'): {'v<<', '<v<', '<<v'}, ('6', '2'): {'v<', '<v'}, ('6', '3'): {'v'}, ('6', '0'): {'<vv', 'v<v', 'vv<'}, ('6', 'A'): {'vv'}, ('1', '7'): {'^^'}, ('1', '8'): {'^^>', '>^^', '^>^'}, ('1', '9'): {'>^^>', '>^>^', '>>^^', '^^>>', '^>>^', '^>^>'}, ('1', '4'): {'^'}, ('1', '5'): {'^>', '>^'}, ('1', '6'): {'^>>', '>^>', '>>^'}, ('1', '1'): {''}, ('1', '2'): {'>'}, ('1', '3'): {'>>'}, ('1', '0'): {'>v'}, ('1', 'A'): {'>v>', '>>v'}, ('2', '7'): {'^^<', '<^^', '^<^'}, ('2', '8'): {'^^'}, ('2', '9'): {'^^>', '>^^', '^>^'}, ('2', '4'): {'^<', '<^'}, ('2', '5'): {'^'}, ('2', '6'): {'^>', '>^'}, ('2', '1'): {'<'}, ('2', '2'): {''}, ('2', '3'): {'>'}, ('2', '0'): {'v'}, ('2', 'A'): {'>v', 'v>'}, ('3', '7'): {'<^^<', '<<^^', '^<<^', '^^<<', '<^<^', '^<^<'}, ('3', '8'): {'^^<', '<^^', '^<^'}, ('3', '9'): {'^^'}, ('3', '4'): {'<^<', '^<<', '<<^'}, ('3', '5'): {'^<', '<^'}, ('3', '6'): {'^'}, ('3', '1'): {'<<'}, ('3', '2'): {'<'}, ('3', '3'): {''}, ('3', '0'): {'v<', '<v'}, ('3', 'A'): {'v'}, ('0', '7'): {'^^<^', '^^^<', '^<^^'}, ('0', '8'): {'^^^'}, ('0', '9'): {'^>^^', '^^>^', '^^^>', '>^^^'}, ('0', '4'): {'^^<', '^<^'}, ('0', '5'): {'^^'}, ('0', '6'): {'^^>', '>^^', '^>^'}, ('0', '1'): {'^<'}, ('0', '2'): {'^'}, ('0', '3'): {'^>', '>^'}, ('0', '0'): {''}, ('0', 'A'): {'>'}, ('A', '7'): {'^^^<<', '<^<^^', '<^^^<', '^<^<^', '^^<<^', '^<<^^', '<^^<^', '^^<^<', '^<^^<'}, ('A', '8'): {'<^^^', '^^<^', '^^^<', '^<^^'}, ('A', '9'): {'^^^'}, ('A', '4'): {'<^^<', '^<<^', '^^<<', '<^<^', '^<^<'}, ('A', '5'): {'^^<', '<^^', '^<^'}, ('A', '6'): {'^^'}, ('A', '1'): {'^<<', '<^<'}, ('A', '2'): {'^<', '<^'}, ('A', '3'): {'^'}, ('A', '0'): {'<'}, ('A', 'A'): {''}}

  # ALL_PATHS_ROBOT_2 = {}
  # for dir_key_a in DIRECTIONAL_KEYPAD_COORDS_BY_C.keys():
  #   for dir_key_b in DIRECTIONAL_KEYPAD_COORDS_BY_C.keys():
  #     # print(f"trying {dir_key_a, dir_key_b}")
  #     if (dir_key_a, dir_key_b) not in ALL_PATHS_ROBOT_2: ALL_PATHS_ROBOT_2[(dir_key_a, dir_key_b)] = set()
  #     for way in keypad_all_routes(dir_key_a, dir_key_b, DIRECTIONAL_KEYPAD_COORDS_BY_C, (0, 0)):
  #       ALL_PATHS_ROBOT_2[(dir_key_a, dir_key_b)].add(way)
  #     # print(f"done {dir_key_a, dir_key_b}")

  # # print(ALL_PATHS_ROBOT_2)
  # # assert 0, 'test'
  # # {('^', '^'): {''}, ('^', 'A'): {'>'}, ('^', '<'): {'v<'}, ('^', 'v'): {'v'}, ('^', '>'): {'v>', '>v'}, ('A', '^'): {'<'}, ('A', 'A'): {''}, ('A', '<'): {'<v<', 'v<<'}, ('A', 'v'): {'<v', 'v<'}, ('A', '>'): {'v'}, ('<', '^'): {'>^'}, ('<', 'A'): {'>^>', '>>^'}, ('<', '<'): {''}, ('<', 'v'): {'>'}, ('<', '>'): {'>>'}, ('v', '^'): {'^'}, ('v', 'A'): {'>^', '^>'}, ('v', '<'): {'<'}, ('v', 'v'): {''}, ('v', '>'): {'>'}, ('>', '^'): {'<^', '^<'}, ('>', 'A'): {'^'}, ('>', '<'): {'<<'}, ('>', 'v'): {'<'}, ('>', '>'): {''}}

  # ALL_PATHS_ROBOT_3 = {}
  # for dir_key_a in DIRECTIONAL_KEYPAD_COORDS_BY_C.keys():
  #   for dir_key_b in DIRECTIONAL_KEYPAD_COORDS_BY_C.keys():
  #     # print(f"trying {dir_key_a, dir_key_b}")
  #     if (dir_key_a, dir_key_b) not in ALL_PATHS_ROBOT_3: ALL_PATHS_ROBOT_3[(dir_key_a, dir_key_b)] = set()
  #     for way in keypad_all_routes(dir_key_a, dir_key_b, DIRECTIONAL_KEYPAD_COORDS_BY_C, (0, 0)):
  #       ALL_PATHS_ROBOT_3[(dir_key_a, dir_key_b)].add(way)
  #     # print(f"done {dir_key_a, dir_key_b}")

  # # print(ALL_PATHS_ROBOT_3)
  # # assert 0, 'test'
  # # {('^', '^'): {''}, ('^', 'A'): {'>'}, ('^', '<'): {'v<'}, ('^', 'v'): {'v'}, ('^', '>'): {'>v', 'v>'}, ('A', '^'): {'<'}, ('A', 'A'): {''}, ('A', '<'): {'v<<', '<v<'}, ('A', 'v'): {'v<', '<v'}, ('A', '>'): {'v'}, ('<', '^'): {'>^'}, ('<', 'A'): {'>>^', '>^>'}, ('<', '<'): {''}, ('<', 'v'): {'>'}, ('<', '>'): {'>>'}, ('v', '^'): {'^'}, ('v', 'A'): {'^>', '>^'}, ('v', '<'): {'<'}, ('v', 'v'): {''}, ('v', '>'): {'>'}, ('>', '^'): {'^<', '<^'}, ('>', 'A'): {'^'}, ('>', '<'): {'<<'}, ('>', 'v'): {'<'}, ('>', '>'): {''}}


  def get_one_path_robot_2(robot_1_sequence):
    output = []
    for i in range(len(robot_1_sequence)):
      a = robot_1_sequence[i - 1] if i > 0 else A
      b = robot_1_sequence[i]
      for way in keypad_all_routes(a, b, NUMERIC_KEYPAD_COORDS_BY_C, (3, 0)):
        output.append(way + A)
        break
    return ''.join(output)

  def get_one_path_robot_3(robot_2_sequence):
    output = []
    for i in range(len(robot_2_sequence)):
      a = robot_2_sequence[i - 1] if i > 0 else A
      b = robot_2_sequence[i]
      for way in keypad_all_routes(a, b, DIRECTIONAL_KEYPAD_COORDS_BY_C, (0, 0)):
        output.append(way + A)
        break
    return ''.join(output)



  def get_all_paths_robot_2(robot_1_sequence):
    possible_paths = []
    for i in range(len(robot_1_sequence)):
      possible_ways_next_move = []
      # candidate_way_len = float('inf')
      a = robot_1_sequence[i - 1] if i > 0 else A
      b = robot_1_sequence[i]
      for way in keypad_all_routes(a, b, NUMERIC_KEYPAD_COORDS_BY_C, (3, 0)):
        # if len(way) > candidate_way_len:
        #   continue
        # if len(way) < candidate_way_len:
        #   possible_ways_next_move.clear()
        #   candidate_way_len = len(way)
        possible_ways_next_move.append(way + A)
      possible_paths.append(possible_ways_next_move)

    output = []

    path_so_far = []
    def backtrack(i):
      if i == len(possible_paths):
        flattened_path = []
        for segment in path_so_far:
          for c in segment:
            flattened_path.append(c)
        output.append(flattened_path)
        # return
      else:
        for possible_way_next_move in possible_paths[i]:
          path_so_far.append(possible_way_next_move)
          backtrack(i + 1)
          path_so_far.pop()
    backtrack(0)
    
    output = list(set([ ''.join(path) for path in output ]))
    # print([ len(path) for path in output ])

    set_of_all_lens = set([ len(path) for path in output ])
    assert len(set_of_all_lens) == 1, f"LENS ARE NOT ALL THE SAME: {set_of_all_lens}"

    return output


  # robot_1_sequence = '029A'
  # print(get_all_paths_robot_2(robot_1_sequence))
  # assert 0, 'test'


  def get_all_paths_robot_3(robot_2_sequence):
    possible_paths = []
    for i in range(len(robot_2_sequence)):
      possible_ways_next_move = []
      # candidate_way_len = float('inf')
      a = robot_2_sequence[i - 1] if i > 0 else A
      b = robot_2_sequence[i]
      for way in keypad_all_routes(a, b, DIRECTIONAL_KEYPAD_COORDS_BY_C, (0, 0)):
        # if len(way) > candidate_way_len:
        #   continue
        # if len(way) < candidate_way_len:
        #   possible_ways_next_move.clear()
        #   candidate_way_len = len(way)
        possible_ways_next_move.append(way + A)
      possible_paths.append(possible_ways_next_move)

    output = []

    path_so_far = []
    def backtrack(i):
      if i == len(possible_paths):
        flattened_path = []
        for segment in path_so_far:
          for c in segment:
            flattened_path.append(c)
        output.append(flattened_path)
        # return
      else:
        for possible_way_next_move in possible_paths[i]:
          path_so_far.append(possible_way_next_move)
          backtrack(i + 1)
          path_so_far.pop()
    backtrack(0)
    
    output = list(set([ ''.join(path) for path in output ]))
    # print([ len(path) for path in output ])

    set_of_all_lens = set([ len(path) for path in output ])
    assert len(set_of_all_lens) == 1, f"LENS ARE NOT ALL THE SAME: {set_of_all_lens}"

    return output

  
  # robot_2_sequence = '<A^A>^^AvvvA'
  # get_all_paths_robot_3(robot_2_sequence)
  # assert 0, 'test'


  def best_paths_you_given_robot_3(robot_3_sequence):
    possible_paths = []
    for i in range(len(robot_3_sequence)):
      possible_ways_next_move = []
      # candidate_way_len = float('inf')
      a = robot_3_sequence[i - 1] if i > 0 else A
      b = robot_3_sequence[i]
      for way in keypad_all_routes(a, b, DIRECTIONAL_KEYPAD_COORDS_BY_C, (0, 0)):
        # if len(way) > candidate_way_len:
        #   continue
        # if len(way) < candidate_way_len:
        #   possible_ways_next_move.clear()
        #   candidate_way_len = len(way)
        possible_ways_next_move.append(way + A)
      possible_paths.append(possible_ways_next_move)

    best_paths_you = []

    path_so_far = []
    def backtrack(i):
      if i == len(possible_paths):
        flattened_path = []
        for segment in path_so_far:
          for c in segment:
            flattened_path.append(c)
        best_paths_you.append(flattened_path)
      else:
        for possible_way_next_move in possible_paths[i]:
          path_so_far.append(possible_way_next_move)
          backtrack(i + 1)
          path_so_far.pop()
    backtrack(0)
    
    best_paths_you = list(set([ ''.join(path) for path in best_paths_you ]))

    set_of_all_lens = set([ len(path) for path in best_paths_you ])
    assert len(set_of_all_lens) == 1, f"LENS ARE NOT ALL THE SAME: {set_of_all_lens}"

    return best_paths_you

  # robot_3_sequence = 'v<<A>^>A<A>AvA<^AA>A<vAAA>^A'
  # print(best_paths_you(robot_3_sequence))
  # assert 0, 'test'

  def best_paths_you_given_robot_2(robot_2_sequence):

    best_paths_you_len = float('inf')
    best_paths_you = []

    for robot_3_sequence in get_all_paths_robot_3(robot_2_sequence):
      for best_path_you_given_robot_3 in best_paths_you_given_robot_3(robot_3_sequence):
        if len(best_path_you_given_robot_3) > best_paths_you_len:
          # print(f"eliminating bad path for robot 2")
          continue
        if len(best_path_you_given_robot_3) < best_paths_you_len:
          best_paths_you_len = len(best_path_you_given_robot_3)
          best_paths_you.clear()
        best_paths_you.append(best_path_you_given_robot_3)

    # robot_3_sequence = get_one_path_robot_3(robot_2_sequence)
    # for best_path_you_given_robot_3 in best_paths_you_given_robot_3(robot_3_sequence):
    #   if len(best_path_you_given_robot_3) > best_paths_you_len:
    #     # print(f"eliminating bad path for robot 2")
    #     continue
    #   if len(best_path_you_given_robot_3) < best_paths_you_len:
    #     best_paths_you_len = len(best_path_you_given_robot_3)
    #     best_paths_you.clear()
    #   best_paths_you.append(best_path_you_given_robot_3)
        
    # print(best_paths_you)
    # print(best_paths_you_len)
    # assert 0, 'test'
    return best_paths_you

  # robot_2_sequence = '<A^A>^^AvvvA'
  # print(best_paths_you_given_robot_2(robot_2_sequence))
  # assert 0, 'test'


  best_paths_you_given_robot_1_MEMO = {}
  def best_paths_you_given_robot_1(robot_1_sequence):
    if robot_1_sequence not in best_paths_you_given_robot_1_MEMO:
      best_paths_you_len = float('inf')
      best_paths_you = []

      for robot_2_sequence in get_all_paths_robot_2(robot_1_sequence):
        for best_path_you_given_robot_2 in best_paths_you_given_robot_2(robot_2_sequence):
          if len(best_path_you_given_robot_2) > best_paths_you_len:
            # print(f"eliminating bad path for robot 1")
            continue
          if len(best_path_you_given_robot_2) < best_paths_you_len:
            best_paths_you_len = len(best_path_you_given_robot_2)
            best_paths_you.clear()
          best_paths_you.append(best_path_you_given_robot_2)

      # robot_2_sequence = get_one_path_robot_2(robot_1_sequence)
      # for best_path_you_given_robot_2 in best_paths_you_given_robot_2(robot_2_sequence):
      #   if len(best_path_you_given_robot_2) > best_paths_you_len:
      #     # print(f"eliminating bad path for robot 1")
      #     continue
      #   if len(best_path_you_given_robot_2) < best_paths_you_len:
      #     best_paths_you_len = len(best_path_you_given_robot_2)
      #     best_paths_you.clear()
      #   best_paths_you.append(best_path_you_given_robot_2)
          

      # print(best_paths_you)
      # print(best_paths_you_len)
      # assert 0, 'test'
      best_paths_you_given_robot_1_MEMO[robot_1_sequence] = best_paths_you
    return best_paths_you_given_robot_1_MEMO[robot_1_sequence]


  # ANALYZE

  if not DEBUG: print('RUNNING REAL DATA ANALYSIS (PLEASE WAIT)...')
  TIME_AT_START = time.time()

  total = 0

  if part == 1:

    for TARGET in TARGETS:
      print(f"NOW ANALYZING TARGET: {TARGET}")
      # assert 0

      # robot_2_sequence = get_robot_2_sequence(TARGET)
      # if TARGET == '379A': print(f"robot_2_sequence: {''.join(robot_2_sequence)}")
      # robot_3_sequence = get_robot_3_sequence(robot_2_sequence)
      # if TARGET == '379A': print(f"robot_3_sequence: {''.join(robot_3_sequence)}")
      # your_sequence = get_your_sequence(robot_3_sequence)
      # if TARGET == '379A': print(f"your sequence: {''.join(your_sequence)}")

      robot_1_sequence = TARGET
      your_sequence = best_paths_you_given_robot_1(robot_1_sequence)[0]
      # print(f"{len(your_sequence)}: {your_sequence}")
      # print(f"{len(your_sequence)}")
      # assert 0

      complexity = len(your_sequence) * int(TARGET[:-1])
      print(f"complexity: {len(your_sequence)} * {int(TARGET[:-1])} = {complexity}")
      total += complexity
      print('---------')

    if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")   # ~45.33 seconds
    return total



  if not DEBUG or True:
    print('RUNNING REAL DATA ANALYSIS (PLEASE WAIT)...')
  TIME_AT_START = time.time()

  # for k in NUMERIC_KEYPAD_COORDS_BY_C:
  #   print(best_paths_you_given_robot_1(k))

  FINAL_LEN_ALL_PATHS_ROBOT_1 = {}
  for num_key_a in NUMERIC_KEYPAD_COORDS_BY_C.keys():
    for num_key_b in NUMERIC_KEYPAD_COORDS_BY_C.keys():
      print(f"now analyzing {num_key_a, num_key_b}")
      # if (num_key_a, num_key_b) not in FINAL_LEN_ALL_PATHS_ROBOT_1: FINAL_LEN_ALL_PATHS_ROBOT_1[(num_key_a, num_key_b)] = set()
      # for way in keypad_all_routes(num_key_a, num_key_b, NUMERIC_KEYPAD_COORDS_BY_C, (3, 0)):
      #   FINAL_LEN_ALL_PATHS_ROBOT_1[(num_key_a, num_key_b)].add(way)
      FINAL_LEN_ALL_PATHS_ROBOT_1[(num_key_a, num_key_b)] = len(best_paths_you_given_robot_1(num_key_a + num_key_b)[0]) - len(best_paths_you_given_robot_1(num_key_a)[0])

  print(FINAL_LEN_ALL_PATHS_ROBOT_1)

  if not DEBUG or True:
    print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")   # 


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = NAME_OF_FUNC_HERE
skipped_tests = set([ 2, 3, 4 ])
skipped_tests = set([ 3, 4 ])
# skipped_tests = set([ 4 ])
# skipped_tests = set([  ])

skipped_tests = set([ 1, 2, 4 ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{str(DAY_NUM).zfill(2)}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """029A
980A
179A
456A
379A"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 126384
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 217662
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = None
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = None
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)