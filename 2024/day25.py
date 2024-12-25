"""

--- Day 25: Code Chronicle ---

Out of ideas and time, The Historians agree that they should go back to check the Chief Historian's office one last time, just in case he went back there without you noticing.

When you get there, you are surprised to discover that the door to his office is locked! You can hear someone inside, but knocking yields no response. The locks on this floor are all fancy, expensive, virtual versions of five-pin tumbler locks, so you contact North Pole security to see if they can help open the door.

Unfortunately, they've lost track of which locks are installed and which keys go with them, so the best they can do is send over schematics of every lock and every key for the floor you're on (your puzzle input).

The schematics are in a cryptic file format, but they do contain manufacturer information, so you look up their support number.

"Our Virtual Five-Pin Tumbler product? That's our most expensive model! Way more secure than--" You explain that you need to open a door and don't have a lot of time.

"Well, you can't know whether a key opens a lock without actually trying the key in the lock (due to quantum hidden variables), but you can rule out some of the key/lock combinations."

"The virtual system is complicated, but part of it really is a crude simulation of a five-pin tumbler lock, mostly for marketing reasons. If you look at the schematics, you can figure out whether a key could possibly fit in a lock."

He transmits you some example schematics:

#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####
"The locks are schematics that have the top row filled (#) and the bottom row empty (.); the keys have the top row empty and the bottom row filled. If you look closely, you'll see that each schematic is actually a set of columns of various heights, either extending downward from the top (for locks) or upward from the bottom (for keys)."

"For locks, those are the pins themselves; you can convert the pins in schematics to a list of heights, one per column. For keys, the columns make up the shape of the key where it aligns with pins; those can also be converted to a list of heights."

"So, you could say the first lock has pin heights 0,5,3,4,3:"

#####
.####
.####
.####
.#.#.
.#...
.....
"Or, that the first key has heights 5,0,2,1,3:"

.....
#....
#....
#...#
#.#.#
#.###
#####
"These seem like they should fit together; in the first four columns, the pins and key don't overlap. However, this key cannot be for this lock: in the rightmost column, the lock's pin overlaps with the key, which you know because in that column the sum of the lock height and key height is more than the available space."

"So anyway, you can narrow down the keys you'd need to try by just testing each key with each lock, which means you would have to check... wait, you have how many locks? But the only installation that size is at the North--" You disconnect the call.

In this example, converting both locks to pin heights produces:

0,5,3,4,3
1,2,0,5,3
Converting all three keys to heights produces:

5,0,2,1,3
4,3,4,0,2
3,0,2,0,1
Then, you can try every key with every lock:

Lock 0,5,3,4,3 and key 5,0,2,1,3: overlap in the last column.
Lock 0,5,3,4,3 and key 4,3,4,0,2: overlap in the second column.
Lock 0,5,3,4,3 and key 3,0,2,0,1: all columns fit!
Lock 1,2,0,5,3 and key 5,0,2,1,3: overlap in the first column.
Lock 1,2,0,5,3 and key 4,3,4,0,2: all columns fit!
Lock 1,2,0,5,3 and key 3,0,2,0,1: all columns fit!
So, in this example, the number of unique lock/key pairs that fit together without overlapping in any column is 3.

Analyze your lock and key schematics. How many unique lock/key pairs fit together without overlapping in any column?


--- Part Two ---

You and The Historians crowd into the office, startling the Chief Historian awake! The Historians all take turns looking confused until one asks where he's been for the last few months.

"I've been right here, working on this high-priority request from Santa! I think the only time I even stepped away was about a month ago when I went to grab a cup of coffee..."

Just then, the Chief notices the time. "Oh no! I'm going to be late! I must have fallen asleep trying to put the finishing touches on this chronicle Santa requested, but now I don't have enough time to go visit the last 50 places on my list and complete the chronicle before Santa leaves! He said he needed it before tonight's sleigh launch."

One of The Historians holds up the list they've been using this whole time to keep track of where they've been searching. Next to each place you all visited, they checked off that place with a star. Other Historians hold up their own notes they took on the journey; as The Historians, how could they resist writing everything down while visiting all those historically significant places?

The Chief's eyes get wide. "With all this, we might just have enough time to finish the chronicle! Santa said he wanted it wrapped up with a bow, so I'll call down to the wrapping department and... hey, could you bring it up to Santa? I'll need to be in my seat to watch the sleigh launch by then."

You nod, and The Historians quickly work to collect their notes into the final set of pages for the chronicle.

If you like, you can [Deliver The Chronicle Again].

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

def fit_keys_into_locks(part, input_str, DEBUG = False, *args):

  # CONSTANTS

  FILLED = '#'
  H, W = 5, 5


  # DATA STRUCTURES

  LOCKS = []
  KEYS = []


  # PARSE INPUT DATA

  DATA = input_str.split('\n\n')

  for item_str in DATA:
    item = item_str.split('\n')
    lock = item[0] == FILLED * W
    key = item[-1] == FILLED * W
    assert not (lock and key)

    if lock:
      serial = []
      for c in range(W):
        for r in range(1, H + 1 + 1):
          if item[r][c] != FILLED:
            serial.append(r - 1)
            break
      LOCKS.append(serial)

    elif key:
      serial = []
      for c in range(W):
        for r in range(H + 1 - 1, -1, -1):
          if item[r][c] != FILLED:
            serial.append(H + 1 - 1 - r)
            break
      KEYS.append(serial)

    else: assert False, f"YOU HAVE NEITHER A LOCK NOR A KEY: {item}"

  if DISPLAY_EXTRA_INFO:
    print(f"There are {len(LOCKS)} locks and {len(KEYS)} keys.")


  # ANALYZE

  total = 0

  for lock in LOCKS:
    for key in KEYS:
      fits = True
      for i in range(5):
        if lock[i] + key[i] > 5:
          fits = False
          break
      if fits: total += 1

  return total


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = fit_keys_into_locks
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

sample_input = """#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 3
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
}
test_expected = 3287
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# # Test case 3
# test_input = {
#   'part': 2,
#   'input_str': sample_input,
#   'DEBUG': True,
# }
# test_expected = None
# test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# # Test case 4
# test_input = {
#   'part': 2,
#   'input_str': actual_input,
#   'DEBUG': False,
# }
# test_expected = None
# test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)