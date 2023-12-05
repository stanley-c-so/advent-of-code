"""

COPY + PASTE PUZZLE DESCRIPTION HERE (PART 1)

COPY + PASTE PUZZLE DESCRIPTION HERE (PART 2)

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

  seed_to_soil_map = {}
  soil_to_fertilizer_map = {}
  fertilizer_to_water_map = {}
  water_to_light_map = {}
  light_to_temp_map = {}
  temp_to_humidity_map = {}
  humidity_to_location_map = {}


  # PARSE INPUT DATA

  input_blocks = input_str.split('\n\n')
  # print(input_blocks)
  seeds_data = [ int(n) for n in input_blocks[0].split(': ')[1].split(' ') ]
  
  seed_to_soil_data = [ [ int(n) for n in s.split(' ') ] for s in input_blocks[1].split('\n')[1:] ]
  for line in seed_to_soil_data:
    [dest, src, rangelen] = line
    # for i in range(rangelen):
    #   seed_to_soil_map[src + i] = dest + i

  soil_to_fertilizer_data = [ [ int(n) for n in s.split(' ') ] for s in input_blocks[2].split('\n')[1:] ]
  for line in soil_to_fertilizer_data:
    [dest, src, rangelen] = line
    # for i in range(rangelen):
    #   soil_to_fertilizer_map[src + i] = dest + i
  
  fertilizer_to_water_data = [ [ int(n) for n in s.split(' ') ] for s in input_blocks[3].split('\n')[1:] ]
  for line in fertilizer_to_water_data:
    [dest, src, rangelen] = line
    # for i in range(rangelen):
    #   fertilizer_to_water_map[src + i] = dest + i
  
  water_to_light_data = [ [ int(n) for n in s.split(' ') ] for s in input_blocks[4].split('\n')[1:] ]
  for line in water_to_light_data:
    [dest, src, rangelen] = line
    # for i in range(rangelen):
    #   water_to_light_map[src + i] = dest + i
  
  light_to_temp_data = [ [ int(n) for n in s.split(' ') ] for s in input_blocks[5].split('\n')[1:] ]
  for line in light_to_temp_data:
    [dest, src, rangelen] = line
    # for i in range(rangelen):
    #   light_to_temp_map[src + i] = dest + i
  
  temp_to_humidity_data = [ [ int(n) for n in s.split(' ') ] for s in input_blocks[6].split('\n')[1:] ]
  for line in temp_to_humidity_data:
    [dest, src, rangelen] = line
    # for i in range(rangelen):
    #   temp_to_humidity_map[src + i] = dest + i
  
  humidity_to_location_data = [ [ int(n) for n in s.split(' ') ] for s in input_blocks[7].split('\n')[1:] ]
  for line in humidity_to_location_data:
    [dest, src, rangelen] = line
    # for i in range(rangelen):
    #   humidity_to_location_map[src + i] = dest + i

  # print(seeds_data)
  # print(seed_to_soil_data)
  # print(soil_to_fertilizer_data)
  # print(humidity_to_location_data)
  # print(seed_to_soil_map)

  def convert_seed_to_soil(input):
    # print(seed_to_soil_data)
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
    for line in light_to_temp_data:
      [dest, src, rangelen] = line
      if src <= input and input < src + rangelen:
        return input + (dest - src)
    return input

  def convert_temperature_to_humidity(input):
    for line in temp_to_humidity_data:
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


  # if DEBUG:
  #   
  #   

  TIME_AT_START = time.time()

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
    return MEMO[seed]


  # ANALYZE

  lowest_location = float('inf')

  if part == 1:

    for seed in seeds_data:
      location = convert_seed_to_location(seed)
      lowest_location = min(lowest_location, location)
    return lowest_location

  else:

    # outputs = []
    # for i in range(0, len(seeds_data), 2):
    #   start_value = seeds_data[i]
    #   rangelen = seeds_data[i + 1]
    #   for seed in range(start_value, start_value + rangelen):
    #     converted = convert_seed_to_location(seed)
    #     print(f'seed {seed}: {converted}')
    #     outputs.append(converted)

    # print('-----')
    # outputs.sort()
    # print(outputs)
    # print('=====')

    # # SEED INTERVALS

    # intervals = []
    # for i in range(0, len(seeds_data), 2):
    #   start_value = seeds_data[i]
    #   rangelen = seeds_data[i + 1]
    #   intervals.append([start_value, start_value + rangelen - 1])
    # intervals.sort(key=lambda interval: interval[0])

    # # print('SORTED?', intervals)
    # intervals_set = set((interval[0], interval[1]) for interval in intervals)
    # print('INITIAL', intervals_set)


    # '''
    # [a, b]
    # 1) none of it overlaps with a conversion interval --> leave it alone
    # 2) it is totally eclipsed by a conversion interval --> convert it
    # 3) right portion of it overlaps with a conversion interval --> cut it up, and convert the relevant part
    # 4) left portion of it overlaps with a conversion interval --> cut it up, and convert the relevant part

    # '''

    # def merge_overlapping_intervals(intervals):
    #   merged = [ intervals[0] ]
    #   for i in range(1, len(intervals)):
    #     if merged[-1][1] >= intervals[i][0] - 1:
    #       merged[-1][1] = max(merged[-1][1], intervals[i][1])
    #     else:
    #       merged.append(intervals[i])
    #   return merged

    # DATASETS = {
    #   'seed to soil': seed_to_soil_data,
    #   'soil to fert': soil_to_fertilizer_data,
    #   'fert to water': fertilizer_to_water_data,
    #   'water to light': water_to_light_data,
    #   'light to temp': light_to_temp_data,
    #   'temp to humidity': temp_to_humidity_data,
    #   'humidity to loc': humidity_to_location_data
    # }

    # # for dataset in DATASETS:
    # for key in DATASETS:
    #   print(f'===== NOW ANALYZING {key}')
    #   dataset = DATASETS[key]
    #   intervals_set_copy = intervals_set.copy()
    #   # print(f'DATASET: {dataset}')
    #   for line in dataset:
    #     # intervals_set_copy = intervals_set.copy()
    #     [dest, src, rangelen] = line
    #     conversion_interval = (src, src + rangelen - 1)
    #     conversion_delta = dest - src
    #     for interval in intervals_set:
    #       if conversion_interval[1] < interval[0] or interval[1] < conversion_interval[0]:
    #         print(f'case a (no overlap) | interval {interval}, conversion_interval {conversion_interval}, delta {conversion_delta}')
    #         continue
    #       elif conversion_interval[0] <= interval[0] and interval[1] <= conversion_interval[1]:
    #         print(f'case b (complete eclipse) | interval {interval}, conversion_interval {conversion_interval}, delta {conversion_delta}')
    #         # intervals_set_copy.remove(interval)
    #         intervals_set_copy.discard(interval)
    #         intervals_set_copy.add((interval[0] + conversion_delta, interval[1] + conversion_delta))
    #       # elif interval[0] <= conversion_interval[0]:
    #       elif interval[0] < conversion_interval[0]:
    #         print(f'case c (convert right portion of interval) | interval {interval}, conversion_interval {conversion_interval}, delta {conversion_delta}')
    #         # intervals_set_copy.remove(interval)
    #         intervals_set_copy.discard(interval)
    #         intervals_set_copy.add((conversion_interval[0] + conversion_delta, interval[1] + conversion_delta))
    #         intervals_set_copy.add((interval[0], conversion_interval[0] - 1))
    #         print(f'> converted: {(conversion_interval[0] + conversion_delta, interval[1] + conversion_delta)}')
    #         print(f'> unchanged: {(interval[0], conversion_interval[0] - 1)}')
    #       # elif conversion_interval[0] <= interval[0]:
    #       elif conversion_interval[1] < interval[1]:
    #         print(f'case d (convert left portion of interval) | interval {interval}, conversion_interval {conversion_interval}, delta {conversion_delta}')
    #         # intervals_set_copy.remove(interval)
    #         intervals_set_copy.discard(interval)
    #         intervals_set_copy.add((interval[0] + conversion_delta, conversion_interval[1] + conversion_delta))
    #         intervals_set_copy.add((conversion_interval[1] + 1, interval[1]))
    #         print(f'> converted: {(interval[0] + conversion_delta, conversion_interval[1] + conversion_delta)}')
    #         print(f'> unchanged: {(conversion_interval[1] + 1, interval[1])}')
    #       else:
    #         print(f'CONVERSION INTERVAL {conversion_interval}, INTERVAL {interval}')
    #         return 1/0
    #       print(f'>>> intervals now: {intervals_set_copy}')

    #   L = [ [tup[0], tup[1]] for tup in intervals_set_copy ]
    #   L.sort(key=lambda interval: interval[0])
    #   # print('BEFORE MERGE:', L)
    #   L = merge_overlapping_intervals(L)
    #   print('AFTER MERGE:', L)
    #   intervals_set = set([ (interval[0], interval[1]) for interval in L ])
    #   print(f'>>> intervals now (after merge): {intervals_set}')

    #   # print(intervals_set)

    # print('FINAL INTERVALS_SET', intervals_set)
    # L = [ [tup[0], tup[1]] for tup in intervals_set ]
    # L.sort(key=lambda interval: interval[0])
    # print('BEFORE FINAL MERGE', L)
    # L = merge_overlapping_intervals(L)
    # print('FINAL L AFTER FINAL MERGE', L)
    # print(outputs)

    # print('+++++')
    # for line in light_to_temp_data:
    #   intervals_set_copy = intervals_set.copy()
    #   [dest, src, rangelen] = line
    #   print((src, src + rangelen - 1), dest - src)

    # return L[0][0]

    # 1229787380 TOO HIGH
    # 719150722 too high
    # 127453946 wrong

    # lowest_delta = float('inf')
    # for line in humidity_to_location_data:
    #   [dest, src, rangelen] = line
    #   delta = (dest - src)
    #   if delta < 0:
    #     print(f'DELTA {delta} | OLD RANGE FROM {src} TO {src + rangelen} | NEW RANGE FROM {src + delta} TO {src + rangelen + delta}')

    #   if delta < lowest_delta:
    #     print(f'NEW LOWEST DELTA {delta} FROM {src} TO {src + rangelen}')
    #     lowest_delta = delta
    #   if src <= input and input < src + rangelen:
    #     return input + (dest - src)
    # print(lowest_delta)

    if not DEBUG: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')

    NEXT_MIN_TARGET = 1

    for i in range(0, len(seeds_data), 2):
      start_value = seeds_data[i]
      rangelen = seeds_data[i + 1]
      for seed in range(start_value, start_value + rangelen):

        if DISPLAY_EXTRA_INFO and math.floor((time.time() - TIME_AT_START)/60) == NEXT_MIN_TARGET:
          print(f'{NEXT_MIN_TARGET} mins have passed since beginning this run')
          NEXT_MIN_TARGET += 1
          print(lowest_location)


        location = convert_seed_to_location(seed)
        lowest_location = min(lowest_location, location)

    if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)/1000} SECS)")
    return lowest_location


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = NAME_OF_FUNC_HERE
skipped_tests = set([ 2, 3, 4 ])
skipped_tests = set([ 3, 4 ])
skipped_tests = set([ 4 ])
skipped_tests = set([  ])
# skipped_tests = set([ 1, 2, 3 ])
# skipped_tests = set([ 1, 2, 4 ])
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
test_expected = None
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)