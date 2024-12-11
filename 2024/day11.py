"""

--- Day 11: Plutonian Pebbles ---

The ancient civilization on Pluto was known for its ability to manipulate spacetime, and while The Historians explore their infinite corridors, you've noticed a strange set of physics-defying stones.

At first glance, they seem like normal stones: they're arranged in a perfectly straight line, and each stone has a number engraved on it.

The strange part is that every time you blink, the stones change.

Sometimes, the number engraved on a stone changes. Other times, a stone might split in two, causing all the other stones to shift over a bit to make room in their perfectly straight line.

As you observe them for a while, you find that the stones have a consistent behavior. Every time you blink, the stones each simultaneously change according to the first applicable rule in this list:

If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
If the stone is engraved with a number that has an even number of digits, it is replaced by two stones. The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
No matter how the stones change, their order is preserved, and they stay on their perfectly straight line.

How will the stones evolve if you keep blinking at them? You take a note of the number engraved on each stone in the line (your puzzle input).

If you have an arrangement of five stones engraved with the numbers 0 1 10 99 999 and you blink once, the stones transform as follows:

The first stone, 0, becomes a stone marked 1.
The second stone, 1, is multiplied by 2024 to become 2024.
The third stone, 10, is split into a stone marked 1 followed by a stone marked 0.
The fourth stone, 99, is split into two stones marked 9.
The fifth stone, 999, is replaced by a stone marked 2021976.
So, after blinking once, your five stones would become an arrangement of seven stones engraved with the numbers 1 2024 1 0 9 9 2021976.

Here is a longer example:

Initial arrangement:
125 17

After 1 blink:
253000 1 7

After 2 blinks:
253 0 2024 14168

After 3 blinks:
512072 1 20 24 28676032

After 4 blinks:
512 72 2024 2 0 2 4 2867 6032

After 5 blinks:
1036288 7 2 20 24 4048 1 4048 8096 28 67 60 32

After 6 blinks:
2097446912 14168 4048 2 0 2 4 40 48 2024 40 48 80 96 2 8 6 7 6 0 3 2
In this example, after blinking six times, you would have 22 stones. After blinking 25 times, you would have 55312 stones!

Consider the arrangement of stones in front of you. How many stones will you have after blinking 25 times?


--- Part Two ---

The Historians sure are taking a long time. To be fair, the infinite corridors are very large.

How many stones would you have after blinking a total of 75 times?

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

def analyze_amount_of_growth_of_num_list(part, input_str, DEBUG = False):

  # PARSE INPUT DATA

  STONES = [ int(n) for n in input_str.split(' ') ]


  # UTILITY

  MEMO = {}
  cache_hits = 0
  def get_len_additions_by_num_and_iterations(num, iterations):
    if num not in MEMO: MEMO[num] = {}
    if iterations not in MEMO[num]:
      new_nums = []
      if num == 0:
        new_nums.append(1)
      elif len(str(num)) % 2 == 0:
        s = str(num)
        new_nums.append(int(s[ : len(s) // 2]))
        new_nums.append(int(s[len(s) // 2 : ]))
      else:
        new_nums.append(num * 2024)

      MEMO[num][iterations] = len(new_nums) - 1
      if iterations > 1:
        total = 0
        for new_num in new_nums:
          total += get_len_additions_by_num_and_iterations(new_num, iterations - 1)
        MEMO[num][iterations] += total

    else:
      nonlocal cache_hits
      cache_hits += 1

    return MEMO[num][iterations]


  # ANALYZE

  TIME_AT_START = time.time()

  NUM_ITERATIONS = 25 if part == 1 else 75                                                                  # PART 1: run 25 iterations
                                                                                                            # PART 2: run 75 iterations

  res = len(STONES) + sum(get_len_additions_by_num_and_iterations(num, NUM_ITERATIONS) for num in STONES)   # initial length is len(STONES)
                                                                                                            # add the number of len additions per stone

  if DISPLAY_EXTRA_INFO:
    print(f'Number of unique numbers: {len(MEMO)}')
    print(f'Number of cached number/iteration results: {sum(len(MEMO[key]) for key in MEMO)}')
    print(f'Number of cache hits: {cache_hits}')

  return res


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = analyze_amount_of_growth_of_num_list
skipped_tests = set([ 2, 3 ])
skipped_tests = set([ 3 ])
skipped_tests = set([  ])
lowest_test = 0
highest_test = 0

FILENAME = pathlib.Path(__file__).name
FILENAME_SPLIT = FILENAME.split('.py')[0].split('day')
DAY_NUM = FILENAME_SPLIT[1] if len(FILENAME_SPLIT) > 1 else None
CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
INPUT_PATH = CURRENT_DIR + '\\' + (f"day{str(DAY_NUM).zfill(2)}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """125 17"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 55312
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 203457
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 241394363462435
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)