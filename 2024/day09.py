"""

--- Day 9: Disk Fragmenter ---

Another push of the button leaves you in the familiar hallways of some friendly amphipods! Good thing you each somehow got your own personal mini submarine. The Historians jet away in search of the Chief, mostly by driving directly into walls.

While The Historians quickly figure out how to pilot these things, you notice an amphipod in the corner struggling with his computer. He's trying to make more contiguous free space by compacting all of the files, but his program isn't working; you offer to help.

He shows you the disk map (your puzzle input) he's already generated. For example:

2333133121414131402
The disk map uses a dense format to represent the layout of files and free space on the disk. The digits alternate between indicating the length of a file and the length of free space.

So, a disk map like 12345 would represent a one-block file, two blocks of free space, a three-block file, four blocks of free space, and then a five-block file. A disk map like 90909 would represent three nine-block files in a row (with no free space between them).

Each file on disk also has an ID number based on the order of the files as they appear before they are rearranged, starting with ID 0. So, the disk map 12345 has three files: a one-block file with ID 0, a three-block file with ID 1, and a five-block file with ID 2. Using one character for each block where digits are the file ID and . is free space, the disk map 12345 represents these individual blocks:

0..111....22222
The first example above, 2333133121414131402, represents these individual blocks:

00...111...2...333.44.5555.6666.777.888899
The amphipod would like to move file blocks one at a time from the end of the disk to the leftmost free space block (until there are no gaps remaining between file blocks). For the disk map 12345, the process looks like this:

0..111....22222
02.111....2222.
022111....222..
0221112...22...
02211122..2....
022111222......
The first example requires a few more steps:

00...111...2...333.44.5555.6666.777.888899
009..111...2...333.44.5555.6666.777.88889.
0099.111...2...333.44.5555.6666.777.8888..
00998111...2...333.44.5555.6666.777.888...
009981118..2...333.44.5555.6666.777.88....
0099811188.2...333.44.5555.6666.777.8.....
009981118882...333.44.5555.6666.777.......
0099811188827..333.44.5555.6666.77........
00998111888277.333.44.5555.6666.7.........
009981118882777333.44.5555.6666...........
009981118882777333644.5555.666............
00998111888277733364465555.66.............
0099811188827773336446555566..............
The final step of this file-compacting process is to update the filesystem checksum. To calculate the checksum, add up the result of multiplying each of these blocks' position with the file ID number it contains. The leftmost block is in position 0. If a block contains free space, skip it instead.

Continuing the first example, the first few blocks' position multiplied by its file ID number are 0 * 0 = 0, 1 * 0 = 0, 2 * 9 = 18, 3 * 9 = 27, 4 * 8 = 32, and so on. In this example, the checksum is the sum of these, 1928.

Compact the amphipod's hard drive using the process he requested. What is the resulting filesystem checksum? (Be careful copy/pasting the input for this puzzle; it is a single, very long line.)


--- Part Two ---

Upon completion, two things immediately become clear. First, the disk definitely has a lot more contiguous free space, just like the amphipod hoped. Second, the computer is running much more slowly! Maybe introducing all of that file system fragmentation was a bad idea?

The eager amphipod already has a new plan: rather than move individual blocks, he'd like to try compacting the files on his disk by moving whole files instead.

This time, attempt to move whole files to the leftmost span of free space blocks that could fit the file. Attempt to move each file exactly once in order of decreasing file ID number starting with the file with the highest file ID number. If there is no span of free space to the left of a file that is large enough to fit the file, the file does not move.

The first example from above now proceeds differently:

00...111...2...333.44.5555.6666.777.888899
0099.111...2...333.44.5555.6666.777.8888..
0099.1117772...333.44.5555.6666.....8888..
0099.111777244.333....5555.6666.....8888..
00992111777.44.333....5555.6666.....8888..
The process of updating the filesystem checksum is the same; now, this example's checksum would be 2858.

Start over, now compacting the amphipod's hard drive using this new method instead. What is the resulting filesystem checksum?

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

def defragment_disk(part, input_str, DEBUG = False, *args):

  # CONSTANTS

  EMPTY = '.'


  # DATA STRUCTURES

  DATA_BY_ID = {}                                                                             # holds start idx and length information
  FREE_BLOCK_INDICES = []                                                                     # holds start idx and length information

  DISK = []                                                                                   # stores the representation of the data


  # UTILITY

  def checksum(DISK):
    total = 0
    for i in range(len(DISK)):
      if DISK[i] != EMPTY:
        total += i * DISK[i]
    return total

  def clean_up_free_block_indices():
    nonlocal FREE_BLOCK_INDICES
    FREE_BLOCK_INDICES = [ data for data in FREE_BLOCK_INDICES if data['length'] > 0 ]


  # PARSE INPUT DATA

  for i in range(0, len(input_str), 2):

    file_length = int(input_str[i])
    free_block_length = int(input_str[i + 1]) if i < len(input_str) - 1 else 0

    id = i // 2                                                                               # i.e. acts like a seed: 0, 1, 2, ...
    
    file_start_idx = len(DISK)
    DATA_BY_ID[id] = { 'idx': file_start_idx, 'length': file_length }                         # for part 2
    for _ in range(file_length): DISK.append(id)

    free_block_start_idx = len(DISK)
    FREE_BLOCK_INDICES.append({ 'idx': free_block_start_idx, 'length': free_block_length })   # for part 2
    for _ in range(free_block_length): DISK.append(EMPTY)

  clean_up_free_block_indices()                                                               # micro-optimization


  # ANALYZE

  TIME_AT_START = time.time()

  if part == 1:                                                                               # PART 1: swap single digits into empty spaces

    def in_bounds(idx):
      return 0 <= idx < len(DISK)

    left = 0
    right = len(DISK) - 1

    while True:
      while in_bounds(left) and DISK[left] != EMPTY: left += 1
      while in_bounds(right) and DISK[right] == EMPTY: right -= 1
      if left >= right: break
      DISK[left], DISK[right] = DISK[right], DISK[left]

  else:                                                                                       # PART 2: swap blocks of data into blocks of empty spaces

    if not DEBUG: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

    highest_id = DISK[-1]

    if DISPLAY_EXTRA_INFO:
      print(f"Highest ID: {highest_id}")
      print(f"Length of disk: {len(DISK)}")

    for id in range(highest_id, -1, -1):                                                      # consider all IDs, starting with the highest, going down

      file_data = DATA_BY_ID[id]
      file_start_idx = file_data['idx']
      file_length = file_data['length']

      for free_block_idx in range(len(FREE_BLOCK_INDICES)):                                   # consider all free blocks, from left to right

        free_block_start_idx = FREE_BLOCK_INDICES[free_block_idx]['idx']
        free_block_length = FREE_BLOCK_INDICES[free_block_idx]['length']

        if free_block_length >= file_length and free_block_start_idx < file_start_idx:        # empty block must be big enough AND be to the left of data

          for i in range(file_length):                                                        # swap the data...
            DISK[free_block_start_idx + i] = id
            DISK[file_start_idx + i] = EMPTY
          
          FREE_BLOCK_INDICES[free_block_idx]['idx'] += file_length                            # ...and update the free block's start idx...
          FREE_BLOCK_INDICES[free_block_idx]['length'] -= file_length                         # ...as well as length
          break

      clean_up_free_block_indices()                                                           # micro-optimization

    if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")                   # ~2.41 seconds

  return checksum(DISK)


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = defragment_disk
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

sample_input = """2333133121414131402"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 1928
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 6353658451014
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 2858
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 6382582136592
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)