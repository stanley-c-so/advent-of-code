"""

--- Day 5: If You Give A Seed A Fertilizer ---

You take the boat and find the gardener right where you were told he would be: managing a giant "garden" that looks more to you like a farm.

"A water source? Island Island is the water source!" You point out that Snow Island isn't receiving any water.

"Oh, we had to stop the water because we ran out of sand to filter it with! Can't make snow with dirty water. Don't worry, I'm sure we'll get more sand soon; we only turned off the water a few days... weeks... oh no." His face sinks into a look of horrified realization.

"I've been so busy making sure everyone here has food that I completely forgot to check why we stopped getting more sand! There's a ferry leaving soon that is headed over in that direction - it's much faster than your boat. Could you please go check it out?"

You barely have time to agree to this request when he brings up another. "While you wait for the ferry, maybe you can help us with our food production problem. The latest Island Island Almanac just arrived and we're having trouble making sense of it."

The almanac (your puzzle input) lists all of the seeds that need to be planted. It also lists what type of soil to use with each kind of seed, what type of fertilizer to use with each kind of soil, what type of water to use with each kind of fertilizer, and so on. Every type of seed, soil, fertilizer and so on is identified with a number, but numbers are reused by each category - that is, soil 123 and fertilizer 123 aren't necessarily related to each other.

For example:

seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4

The almanac starts by listing which seeds need to be planted: seeds 79, 14, 55, and 13.

The rest of the almanac contains a list of maps which describe how to convert numbers from a source category into numbers in a destination category. That is, the section that starts with seed-to-soil map: describes how to convert a seed number (the source) to a soil number (the destination). This lets the gardener and his team know which soil to use with which seeds, which water to use with which fertilizer, and so on.

Rather than list every source number and its corresponding destination number one by one, the maps describe entire ranges of numbers that can be converted. Each line within a map contains three numbers: the destination range start, the source range start, and the range length.

Consider again the example seed-to-soil map:

50 98 2
52 50 48

The first line has a destination range start of 50, a source range start of 98, and a range length of 2. This line means that the source range starts at 98 and contains two values: 98 and 99. The destination range is the same length, but it starts at 50, so its two values are 50 and 51. With this information, you know that seed number 98 corresponds to soil number 50 and that seed number 99 corresponds to soil number 51.

The second line means that the source range starts at 50 and contains 48 values: 50, 51, ..., 96, 97. This corresponds to a destination range starting at 52 and also containing 48 values: 52, 53, ..., 98, 99. So, seed number 53 corresponds to soil number 55.

Any source numbers that aren't mapped correspond to the same destination number. So, seed number 10 corresponds to soil number 10.

So, the entire list of seed numbers and their corresponding soil numbers looks like this:

seed  soil
0     0
1     1
...   ...
48    48
49    49
50    52
51    53
...   ...
96    98
97    99
98    50
99    51

With this map, you can look up the soil number required for each initial seed number:

    Seed number 79 corresponds to soil number 81.
    Seed number 14 corresponds to soil number 14.
    Seed number 55 corresponds to soil number 57.
    Seed number 13 corresponds to soil number 13.

The gardener and his team want to get started as soon as possible, so they'd like to know the closest location that needs a seed. Using these maps, find the lowest location number that corresponds to any of the initial seeds. To do this, you'll need to convert each seed number through other categories until you can find its corresponding location number. In this example, the corresponding types are:

    Seed 79, soil 81, fertilizer 81, water 81, light 74, temperature 78, humidity 78, location 82.
    Seed 14, soil 14, fertilizer 53, water 49, light 42, temperature 42, humidity 43, location 43.
    Seed 55, soil 57, fertilizer 57, water 53, light 46, temperature 82, humidity 82, location 86.
    Seed 13, soil 13, fertilizer 52, water 41, light 34, temperature 34, humidity 35, location 35.

So, the lowest location number in this example is 35.

What is the lowest location number that corresponds to any of the initial seed numbers?


--- Part Two ---

Everyone will starve if you only plant such a small number of seeds. Re-reading the almanac, it looks like the seeds: line actually describes ranges of seed numbers.

The values on the initial seeds: line come in pairs. Within each pair, the first value is the start of the range and the second value is the length of the range. So, in the first line of the example above:

seeds: 79 14 55 13

This line describes two ranges of seed numbers to be planted in the garden. The first range starts with seed number 79 and contains 14 values: 79, 80, ..., 91, 92. The second range starts with seed number 55 and contains 13 values: 55, 56, ..., 66, 67.

Now, rather than considering four seed numbers, you need to consider a total of 27 seed numbers.

In the above example, the lowest location number can be obtained from seed number 82, which corresponds to soil 84, fertilizer 84, water 84, light 77, temperature 45, humidity 46, and location 46. So, the lowest location number is 46.

Consider all of the initial seed numbers listed in the ranges on the first line of the almanac. What is the lowest location number that corresponds to any of the initial seed numbers?


"""

# LIBRARIES
import time
import pathlib
import os
import math

# MODULES
from _test import test

# OPTIONAL VARIABLES
DISPLAY_EXTRA_INFO = True
# DISPLAY_EXTRA_INFO = False

def NAME_OF_FUNC_HERE(part, input_str, DEBUG = False):

  # DATA STRUCTURES

  seed_to_soil_ranges = []
  soil_to_fertilizer_ranges = []
  fertilizer_to_water_ranges = []
  water_to_light_ranges = []
  light_to_temperature_ranges = []
  temperature_to_humidity_ranges = []
  humidity_to_location_ranges = []

  ALL_RANGES = {
    'seed_to_soil': seed_to_soil_ranges,
    'soil_to_fertilizer': soil_to_fertilizer_ranges,
    'fertilizer_to_water': fertilizer_to_water_ranges,
    'water_to_light': water_to_light_ranges,
    'light_to_temp': light_to_temperature_ranges,
    'temperature_to_humidity': temperature_to_humidity_ranges,
    'humidity_to_location': humidity_to_location_ranges,
  }

  # PARSE INPUT DATA

  input_blocks = input_str.split('\n\n')

  seeds_data = [ int(n) for n in input_blocks[0].split(': ')[1].split(' ') ]
  seed_to_soil_data = [ [ int(n) for n in s.split(' ') ] for s in input_blocks[1].split('\n')[1:] ]
  for line in seed_to_soil_data:
    [dest, src, rangelen] = line
    seed_to_soil_ranges.append({ 'range': [src, src + rangelen - 1], 'delta': dest - src })
    seed_to_soil_ranges.sort(key=lambda data: data['range'][0], reverse=True)

  soil_to_fertilizer_data = [ [ int(n) for n in s.split(' ') ] for s in input_blocks[2].split('\n')[1:] ]
  for line in soil_to_fertilizer_data:
    [dest, src, rangelen] = line
    soil_to_fertilizer_ranges.append({ 'range': [src, src + rangelen - 1], 'delta': dest - src })
    soil_to_fertilizer_ranges.sort(key=lambda data: data['range'][0], reverse=True)
  fertilizer_to_water_data = [ [ int(n) for n in s.split(' ') ] for s in input_blocks[3].split('\n')[1:] ]
  for line in fertilizer_to_water_data:
    [dest, src, rangelen] = line
    fertilizer_to_water_ranges.append({ 'range': [src, src + rangelen - 1], 'delta': dest - src })
    fertilizer_to_water_ranges.sort(key=lambda data: data['range'][0], reverse=True)
  water_to_light_data = [ [ int(n) for n in s.split(' ') ] for s in input_blocks[4].split('\n')[1:] ]
  for line in water_to_light_data:
    [dest, src, rangelen] = line
    water_to_light_ranges.append({ 'range': [src, src + rangelen - 1], 'delta': dest - src })
    water_to_light_ranges.sort(key=lambda data: data['range'][0], reverse=True)
  light_to_temperature_data = [ [ int(n) for n in s.split(' ') ] for s in input_blocks[5].split('\n')[1:] ]
  for line in light_to_temperature_data:
    [dest, src, rangelen] = line
    light_to_temperature_ranges.append({ 'range': [src, src + rangelen - 1], 'delta': dest - src })
    light_to_temperature_ranges.sort(key=lambda data: data['range'][0], reverse=True)
  temperature_to_humidity_data = [ [ int(n) for n in s.split(' ') ] for s in input_blocks[6].split('\n')[1:] ]
  for line in temperature_to_humidity_data:
    [dest, src, rangelen] = line
    temperature_to_humidity_ranges.append({ 'range': [src, src + rangelen - 1], 'delta': dest - src })
    temperature_to_humidity_ranges.sort(key=lambda data: data['range'][0], reverse=True)
  humidity_to_location_data = [ [ int(n) for n in s.split(' ') ] for s in input_blocks[7].split('\n')[1:] ]
  for line in humidity_to_location_data:
    [dest, src, rangelen] = line
    humidity_to_location_ranges.append({ 'range': [src, src + rangelen - 1], 'delta': dest - src })
    humidity_to_location_ranges.sort(key=lambda data: data['range'][0], reverse=True)


  if part == 1:

    # HELPER FUNCTIONS

    def convert_seed_to_soil(input):
      for line in seed_to_soil_data:
        [dest, src, rangelen] = line
        if src <= input and input < src + rangelen:
          return input + (dest - src)
      return input

    def convert_soil_to_fertilizer(input):
      for line in soil_to_fertilizer_data:
        [dest, src, rangelen] = line
        if src <= input and input < src + rangelen:
          return input + (dest - src)
      return input

    def convert_fertilizer_to_water(input):
      for line in fertilizer_to_water_data:
        [dest, src, rangelen] = line
        if src <= input and input < src + rangelen:
          return input + (dest - src)
      return input

    def convert_water_to_light(input):
      for line in water_to_light_data:
        [dest, src, rangelen] = line
        if src <= input and input < src + rangelen:
          return input + (dest - src)
      return input

    def convert_light_to_temperature(input):
      for line in light_to_temperature_data:
        [dest, src, rangelen] = line
        if src <= input and input < src + rangelen:
          return input + (dest - src)
      return input

    def convert_temperature_to_humidity(input):
      for line in temperature_to_humidity_data:
        [dest, src, rangelen] = line
        if src <= input and input < src + rangelen:
          return input + (dest - src)
      return input

    def convert_humidity_to_location(input):
      for line in humidity_to_location_data:
        [dest, src, rangelen] = line
        if src <= input and input < src + rangelen:
          return input + (dest - src)
      return input

    MEMO = {}
    def convert_seed_to_location(seed):
      if seed not in MEMO:
        soil = convert_seed_to_soil(seed)
        fertilizer = convert_soil_to_fertilizer(soil)
        water = convert_fertilizer_to_water(fertilizer)
        light = convert_water_to_light(water)
        temperature = convert_light_to_temperature(light)
        humidity = convert_temperature_to_humidity(temperature)
        location = convert_humidity_to_location(humidity)
        MEMO[seed] = location
      else: assert False                                          # looks like MEMO never gets used!
      return MEMO[seed]


    # ANALYZE

    lowest_location = float('inf')

    for seed in seeds_data:
      location = convert_seed_to_location(seed)
      lowest_location = min(lowest_location, location)

    return lowest_location

  else:

    # PARSE SEEDS DATA UNDER NEW INTERPRETATION

    seeds_ranges = []
    for i in range(0, len(seeds_data), 2):
      start_value = seeds_data[i]
      rangelen = seeds_data[i + 1]
      seeds_ranges.append([start_value, start_value + rangelen - 1])
    seeds_ranges.sort(key=lambda interval: interval[0], reverse=True)


    # ANALYZE

    for RANGE in ALL_RANGES:

      if DEBUG: print(f'===== BEGINNING ANALYSIS ON CONVERSION RANGES FOR DATASET: {RANGE}')

      new_seeds_ranges = []

      # Step 1: Apply each conversion range against all current seeds rangesß

      while seeds_ranges and ALL_RANGES[RANGE]:

        # Case A: current seed interval starts EARLIER than current conversion interval
        if seeds_ranges[-1][0] < ALL_RANGES[RANGE][-1]['range'][0]:
          if DEBUG: print('CASE A (current seed interval starts earlier)')

          # No overlap
          if seeds_ranges[-1][1] < ALL_RANGES[RANGE][-1]['range'][0]:
            if DEBUG: print('case A-i (NO OVERLAP)')
            # handle entire unchanged interval
            unchanged = seeds_ranges[-1]
            new_seeds_ranges.append(unchanged)
            # pop entire interval
            seeds_ranges.pop()

          # Some overlap
          else:
            if DEBUG: print('case A-ii (SOME OVERLAP)')
            # handle unchanged portion of interval
            unchanged = [seeds_ranges[-1][0], ALL_RANGES[RANGE][-1]['range'][0] - 1]
            new_seeds_ranges.append(unchanged)

            # update current interval to start where it overlaps with conversion interval - will be handled on next loop iteration
            seeds_ranges[-1][0] = ALL_RANGES[RANGE][-1]['range'][0]

        # Case B: current conversion interval starts EARLIER OR AT THE SAME POINT as the current seed interval
        else:
          if DEBUG: print('CASE B (current conversion interval starts earlier, or at same point')

          # No overlap
          if ALL_RANGES[RANGE][-1]['range'][1] < seeds_ranges[-1][0]:
            if DEBUG: print('case B-i (NO OVERLAP)')

            # pop conversion interval
            ALL_RANGES[RANGE].pop()
          # current conversion interval ends before end of current seed interval
          elif ALL_RANGES[RANGE][-1]['range'][1] < seeds_ranges[-1][1]:
            if DEBUG: print('case B-ii (PARTIAL OVERLAP, CONVERSION INTERVAL ENDS EARLIER)')

            # convert changed portion of interval
            changed = [seeds_ranges[-1][0] + ALL_RANGES[RANGE][-1]['delta'], ALL_RANGES[RANGE][-1]['range'][1] + ALL_RANGES[RANGE][-1]['delta']]
            new_seeds_ranges.append(changed)

            # update current interval to start after overlap with conversion interval - will be handled on next loop iteration
            seeds_ranges[-1][0] = ALL_RANGES[RANGE][-1]['range'][1] + 1

          # current conversion interval ends at or after end of current seed interval
          else:
            if DEBUG: print('case B-iii (CONVERSION INTERVAL ECLIPSES SEED INTERVAL)')

            # convert entire changed interval
            changed = [seeds_ranges[-1][0] + ALL_RANGES[RANGE][-1]['delta'], seeds_ranges[-1][1] + ALL_RANGES[RANGE][-1]['delta']]
            new_seeds_ranges.append(changed)

            # pop entire interval
            seeds_ranges.pop()

      # In case any remaining seeds ranges left over, just add them to the list of new ranges
      while seeds_ranges:
        if DEBUG: print(f'SOME SEED RANGES LEFT OVER AFTER PROCESSING ALL CONVERSION INTERVALS: {seeds_ranges}')
        new_seeds_ranges.append(seeds_ranges.pop())

      # Step 2: Sort new ranges (optionally, merge overlapping intervals)
      new_seeds_ranges.sort(key=lambda interval: interval[0], reverse=True)
      seeds_ranges = new_seeds_ranges

      # OPTIONAL: MERGE OVERLAPPING INTERVALS
      if DEBUG: print(f'(BEFORE MERGE) {new_seeds_ranges}')
      new_seeds_ranges.reverse()
      merged = [ new_seeds_ranges[0] ]
      for i in range(1, len(new_seeds_ranges)):
        if merged[-1][1] >= new_seeds_ranges[i][0] - 1:
          merged[-1][1] = max(merged[-1][1], new_seeds_ranges[i][1])
        else:
          merged.append(new_seeds_ranges[i])
      merged.reverse()
      seeds_ranges = merged
      if DEBUG: print(f'(AFTER MERGE) {merged}')

      if DEBUG:
        print(f'>>> NOW DONE WITH {RANGE}! SEEDS RANGES: {seeds_ranges}')
        print('')


    # FINAL RESULTS

    seeds_ranges.reverse()
    if DEBUG:
      print(f'~~~~~ FINAL RESULTS: {seeds_ranges}')
    return seeds_ranges[0][0]


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = NAME_OF_FUNC_HERE
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

sample_input = """seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 35
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 178159714
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 46
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 100165128
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)