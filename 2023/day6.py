"""

--- Day 6: Wait For It ---

The ferry quickly brings you across Island Island. After asking around, you discover that there is indeed normally a large pile of sand somewhere near here, but you don't see anything besides lots of water and the small island where the ferry has docked.

As you try to figure out what to do next, you notice a poster on a wall near the ferry dock. "Boat races! Open to the public! Grand prize is an all-expenses-paid trip to Desert Island!" That must be where the sand comes from! Best of all, the boat races are starting in just a few minutes.

You manage to sign up as a competitor in the boat races just in time. The organizer explains that it's not really a traditional race - instead, you will get a fixed amount of time during which your boat has to travel as far as it can, and you win if your boat goes the farthest.

As part of signing up, you get a sheet of paper (your puzzle input) that lists the time allowed for each race and also the best distance ever recorded in that race. To guarantee you win the grand prize, you need to make sure you go farther in each race than the current record holder.

The organizer brings you over to the area where the boat races are held. The boats are much smaller than you expected - they're actually toy boats, each with a big button on top. Holding down the button charges the boat, and releasing the button allows the boat to move. Boats move faster if their button was held longer, but time spent holding the button counts against the total race time. You can only hold the button at the start of the race, and boats don't move until the button is released.

For example:

Time:      7  15   30
Distance:  9  40  200

This document describes three races:

    The first race lasts 7 milliseconds. The record distance in this race is 9 millimeters.
    The second race lasts 15 milliseconds. The record distance in this race is 40 millimeters.
    The third race lasts 30 milliseconds. The record distance in this race is 200 millimeters.

Your toy boat has a starting speed of zero millimeters per millisecond. For each whole millisecond you spend at the beginning of the race holding down the button, the boat's speed increases by one millimeter per millisecond.

So, because the first race lasts 7 milliseconds, you only have a few options:

    Don't hold the button at all (that is, hold it for 0 milliseconds) at the start of the race. The boat won't move; it will have traveled 0 millimeters by the end of the race.
    Hold the button for 1 millisecond at the start of the race. Then, the boat will travel at a speed of 1 millimeter per millisecond for 6 milliseconds, reaching a total distance traveled of 6 millimeters.
    Hold the button for 2 milliseconds, giving the boat a speed of 2 millimeters per millisecond. It will then get 5 milliseconds to move, reaching a total distance of 10 millimeters.
    Hold the button for 3 milliseconds. After its remaining 4 milliseconds of travel time, the boat will have gone 12 millimeters.
    Hold the button for 4 milliseconds. After its remaining 3 milliseconds of travel time, the boat will have gone 12 millimeters.
    Hold the button for 5 milliseconds, causing the boat to travel a total of 10 millimeters.
    Hold the button for 6 milliseconds, causing the boat to travel a total of 6 millimeters.
    Hold the button for 7 milliseconds. That's the entire duration of the race. You never let go of the button. The boat can't move until you let you of the button. Please make sure you let go of the button so the boat gets to move. 0 millimeters.

Since the current record for this race is 9 millimeters, there are actually 4 different ways you could win: you could hold the button for 2, 3, 4, or 5 milliseconds at the start of the race.

In the second race, you could hold the button for at least 4 milliseconds and at most 11 milliseconds and beat the record, a total of 8 different ways to win.

In the third race, you could hold the button for at least 11 milliseconds and no more than 19 milliseconds and still beat the record, a total of 9 ways you could win.

To see how much margin of error you have, determine the number of ways you can beat the record in each race; in this example, if you multiply these values together, you get 288 (4 * 8 * 9).

Determine the number of ways you could beat the record in each race. What do you get if you multiply these numbers together?


--- Part Two ---

As the race is about to start, you realize the piece of paper with race times and record distances you got earlier actually just has very bad kerning. There's really only one race - ignore the spaces between the numbers on each line.

So, the example from before:

Time:      7  15   30
Distance:  9  40  200

...now instead means this:

Time:      71530
Distance:  940200

Now, you have to figure out how many ways there are to win this single race. In this example, the race lasts for 71530 milliseconds and the record distance you need to beat is 940200 millimeters. You could hold the button anywhere from 14 to 71516 milliseconds and beat the record, a total of 71503 ways!

How many ways can you beat the record in this one much longer race?

"""

# LIBRARIES
import time
import pathlib
import os
from math import *
from functools import *
from sys import *
from collections import *

# MODULES
from _test import test

# OPTIONAL VARIABLES
DISPLAY_EXTRA_INFO = True
# DISPLAY_EXTRA_INFO = False

def count_ways_to_win_race(part, input_str, DEBUG = False):

  # PARSE INPUT DATA

  input_arr = input_str.split('\n')

  if part == 1:

    TIMES = [ int(n) for n in input_arr[0].split()[1:] ]
    DISTANCES = [ int(n) for n in input_arr[1].split()[1:] ]

  else:

    JOINED_TIME = ''.join(input_arr[0].split()[1:])
    JOINED_DISTANCE = ''.join(input_arr[1].split()[1:])
    TIMES = [ int(JOINED_TIME) ]
    DISTANCES = [ int(JOINED_DISTANCE) ]


  # CONSTANT

  NUM_RACES = len(TIMES)


  # INIT

  ways_to_win_list = []


  # # SOLUTION 1: BRUTE FORCE

  # # ANALYZE

  # TIME_AT_START = time.time()

  # if not DEBUG and part == 2: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

  # for race in range(NUM_RACES):
  #   time_limit = TIMES[race]
  #   distance_to_beat = DISTANCES[race]
  #   ways_to_win = 0
  #   for charge_time in range(1, time_limit):              # note: no need to test 0, or time_limit, since those go 0 distance
  #     remaining_time = time_limit - charge_time
  #     speed = charge_time
  #     distance = speed * remaining_time
  #     if distance > distance_to_beat: ways_to_win += 1
  #   ways_to_win_list.append(ways_to_win)

  # print(ways_to_win_list)

  # if not DEBUG and part == 2: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
  # return reduce((lambda a, b: a * b), ways_to_win_list)


  # SOLUTION 2: QUADRATIC FORMULA

  # Let x = charge time = speed
  # distance_to_beat = (time_limit - x) * (x)
  # => -x^2 + time_limit * x - distance_to_beat = 0
  # => solutions for x: (-(time_limit) +/- sqrt(time_limit^2 - 4*distance_to_beat)) / -2

  # ANALYZE

  TIME_AT_START = time.time()

  if not DEBUG and part == 2: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

  for race in range(NUM_RACES):
    time_limit = TIMES[race]
    distance_to_beat = DISTANCES[race]

    lowest_charge_time = (-time_limit + sqrt(time_limit**2 - 4*distance_to_beat)) / -2
    if lowest_charge_time == ceil(lowest_charge_time): lowest_charge_time = int(lowest_charge_time) + 1         # you must BEAT distance_to_beat
    else: lowest_charge_time = ceil(lowest_charge_time)

    highest_charge_time = (-time_limit - sqrt(time_limit**2 - 4*distance_to_beat)) / -2
    if highest_charge_time == floor(highest_charge_time): highest_charge_time = int(highest_charge_time) - 1    # you must BEAT distance_to_beat
    else: highest_charge_time = floor(highest_charge_time)

    ways_to_win_list.append(highest_charge_time - lowest_charge_time + 1)
  
  if not DEBUG and part == 2: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
  return reduce((lambda a, b: a * b), ways_to_win_list)


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = count_ways_to_win_race
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

sample_input = """Time:      7  15   30
Distance:  9  40  200"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 288
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 128700
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 71503
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 39594072
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)