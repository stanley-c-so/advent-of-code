"""

--- Day 14: Restroom Redoubt ---

One of The Historians needs to use the bathroom; fortunately, you know there's a bathroom near an unvisited location on their list, and so you're all quickly teleported directly to the lobby of Easter Bunny Headquarters.

Unfortunately, EBHQ seems to have "improved" bathroom security again after your last visit. The area outside the bathroom is swarming with robots!

To get The Historian safely to the bathroom, you'll need a way to predict where the robots will be in the future. Fortunately, they all seem to be moving on the tile floor in predictable straight lines.

You make a list (your puzzle input) of all of the robots' current positions (p) and velocities (v), one robot per line. For example:

p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
Each robot's position is given as p=x,y where x represents the number of tiles the robot is from the left wall and y represents the number of tiles from the top wall (when viewed from above). So, a position of p=0,0 means the robot is all the way in the top-left corner.

Each robot's velocity is given as v=x,y where x and y are given in tiles per second. Positive x means the robot is moving to the right, and positive y means the robot is moving down. So, a velocity of v=1,-2 means that each second, the robot moves 1 tile to the right and 2 tiles up.

The robots outside the actual bathroom are in a space which is 101 tiles wide and 103 tiles tall (when viewed from above). However, in this example, the robots are in a space which is only 11 tiles wide and 7 tiles tall.

The robots are good at navigating over/under each other (due to a combination of springs, extendable legs, and quadcopters), so they can share the same tile and don't interact with each other. Visually, the number of robots on each tile in this example looks like this:

1.12.......
...........
...........
......11.11
1.1........
.........1.
.......1...
These robots have a unique feature for maximum bathroom security: they can teleport. When a robot would run into an edge of the space they're in, they instead teleport to the other side, effectively wrapping around the edges. Here is what robot p=2,4 v=2,-3 does for the first few seconds:

Initial state:
...........
...........
...........
...........
..1........
...........
...........

After 1 second:
...........
....1......
...........
...........
...........
...........
...........

After 2 seconds:
...........
...........
...........
...........
...........
......1....
...........

After 3 seconds:
...........
...........
........1..
...........
...........
...........
...........

After 4 seconds:
...........
...........
...........
...........
...........
...........
..........1

After 5 seconds:
...........
...........
...........
.1.........
...........
...........
...........
The Historian can't wait much longer, so you don't have to simulate the robots for very long. Where will the robots be after 100 seconds?

In the above example, the number of robots on each tile after 100 seconds has elapsed looks like this:

......2..1.
...........
1..........
.11........
.....1.....
...12......
.1....1....
To determine the safest area, count the number of robots in each quadrant after 100 seconds. Robots that are exactly in the middle (horizontally or vertically) don't count as being in any quadrant, so the only relevant robots are:

..... 2..1.
..... .....
1.... .....
           
..... .....
...12 .....
.1... 1....
In this example, the quadrants contain 1, 3, 4, and 1 robot. Multiplying these together gives a total safety factor of 12.

Predict the motion of the robots in your list within a space which is 101 tiles wide and 103 tiles tall. What will the safety factor be after exactly 100 seconds have elapsed?


--- Part Two ---

During the bathroom break, someone notices that these robots seem awfully similar to ones built and used at the North Pole. If they're the same type of robots, they should have a hard-coded Easter egg: very rarely, most of the robots should arrange themselves into a picture of a Christmas tree.

What is the fewest number of seconds that must elapse for the robots to display the Easter egg?

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

from copy import deepcopy

# MODULES
from _test import test

# OPTIONAL VARIABLES
DISPLAY_EXTRA_INFO = True
# DISPLAY_EXTRA_INFO = False

def find_easter_egg_image_from_movement_of_pixels_within_grid(part, input_str, DEBUG = False, *args):

  # SOLUTION

  SOLUTION = """                                                           #                                         
                                      #                                    #                         
                                                   #    #                                            
                                      #             #          #                                     
                                                                                                     
                              #                               #          #                           
                               #                       #                            #                
                                                                                                     
                                       #                                      #                      
 #                                            #                                                      
                                                                                                     
                                                                                                #    
               #               #                                               #                     
                                                                    #                                
                      #                          #                                                   
                          #                                                                          
                                    #     #                                                          
                                                   #             #                                   
                                    #                                       #                        
                                    #                                             #                  
                                                                      #                              
                 #                              #                                                    
        #        #                                                                                   
                           #                                        #                                
                                                                                                     
                                                                                         #           
     ##                                                                                              
                                                                                                     
                                                                                                     
                 #              #             #                                                      
                                 #                     #                                             
                            #                                      #                                 
                          #                #                     #          #                        
                                                                                                     
                                                                                                     
                                                                                                     
                  #                                                                                  
                                                                            #         #              
                               ###############################                                       
               #          #    #                             #                                       
                               #                             #                                       
                               #                             #                                       
                               #                             #                                       
                               #              #              #                                  #    
                               #             ###             #                           #           
                               #            #####            #                                       
              #                #           #######           #                                       
            #                  #          #########          #     #   #                             
                               #            #####            #                                       
          #                    #           #######           #                                       
                   #           #          #########          #                                       
                               #         ###########         #                                       
                               #        #############        #                                       
                               #          #########          #                       #          #    
   #                           #         ###########         #                                       
              #                #        #############        #                 #                     
      #                        #       ###############       #           #                           
                               #      #################      #                                       
                               #        #############        #          #        #  #          #     
                               #       ###############       #                                       
                               #      #################      #                                       
              #                #     ###################     #         #                             
                 #             #    #####################    # #                                     
                               #             ###             #               #            # #        
                               #             ###             #                            #          
                         #     #             ###             #                                       
                       #       #                             #          #                           #
                               #                             #                                       
                               #                             #                    #                  
                               #                             #                          #            
                               ###############################          #                    #       
                       #                                                                             
                                                                                                     
                         #                                                                           
              #           # #                                                               #        
      #              #                         #   #                                                 
                                                                                                     
                                              #                                              #       
        #                                                                                            
                                                                                                     
         #                                                                                           
         #                                  # #                                                      
                                                      #                                              
                                                                                  #                  
                                                                                                     
                     #                                                                               
                                #                                    #                 #             
                                                                                       #             
      #                                                  #          #                                
                  #                                                                                  
                # #                                                      #                           
                                # #               #                                                  
                                           #                               #                         
                                            #                            #                           
                                                                                                     
                                                                                                     
                 #                                                                                   
                                  #                       #                                          
                      #                                           #    #  #           #              
                                                                                                     
                                         #                                                           
                                                        #    #                                       
                                   #    #                                                       #    """


  # CONSTANTS

  H, W = args
  EMPTY, ROBOT = ' ', '#'


  # DATA STRUCTURE

  ROBOTS = []
  seen = {}


  # UTILITY

  def serialize(GRID_FOR_DRAW):
    output = [ [ [] for _ in range(W) ] for _ in range(H) ]
    INTRACELL_DELIMITER = ','
    CELL_DELIMITER = '|'
    ROW_DELIMITER = '\n'
    for row in range(H):
      for col in range(W):
        GRID_FOR_DRAW[row][col].sort()
        output[row][col] = INTRACELL_DELIMITER.join(GRID_FOR_DRAW[row][col])
    return ROW_DELIMITER.join([ CELL_DELIMITER.join(row) for row in output ])
  
  def convert_to_str_to_check_against_solution(GRID_FOR_DRAW):
    return '\n'.join([ ''.join([ ROBOT if len(cell) else EMPTY for cell in row ]) for row in GRID_FOR_DRAW ])
  
  def draw(GRID_FOR_DRAW, t):
    print(f'===== GRID AFTER {t} SECONDS: =====')
    for row in GRID_FOR_DRAW:
      print(''.join([ ROBOT if len(cell) else EMPTY for cell in row ]))
    print('')


  # PARSE INPUT DATA

  input_arr = input_str.split('\n')

  for line in input_arr:
    p_data, v_data = [ data.split('=')[1] for data in line.split(' ') ]
    Px, Py = [ int(n) for n in p_data.split(',') ]
    Vx, Vy = [ int(n) for n in v_data.split(',') ]
    ROBOTS.append({ 'Px': Px, 'Py': Py, 'Vx': Vx, 'Vy': Vy })


  # ANALYZE

  part_2_output = None
  GRID_AT_SOLUTION = None
  part_2_period = None

  TIME = 100 if part == 1 else maxsize                                        # PART 1: SIMULATE 100 SECONDS
                                                                              # PART 2: SIMULATE INDEFINITELY UNTIL EASTER EGG FOUND

  for t in range(1, TIME + 1):
    GRID_FOR_DRAW = [ [ [] for _ in range(W) ] for _ in range(H) ]

    for i in range(len(ROBOTS)):
      robot = ROBOTS[i]
      robot['Px'] = (robot['Px'] + robot['Vx']) % W
      robot['Py'] = (robot['Py'] + robot['Vy']) % H
      GRID_FOR_DRAW[robot['Py']][robot['Px']].append(str(i))

    if part == 2:                                                             # part 2 only: check for easter egg / cycle
      serial = serialize(GRID_FOR_DRAW)
      if serial in seen:                                                      # DISPLAY_EXTRA_INFO only: find the period
        part_2_period = t - seen[serial]
        print(f"Currently at time = {t} seconds")
        print(f"Previously saw this arrangement at time = {seen[serial]} seconds")
        print(f"Period is {part_2_period} seconds")
        print('')
        break
      seen[serial] = t
      if convert_to_str_to_check_against_solution(GRID_FOR_DRAW) == SOLUTION: # part 2 win condition
        part_2_output = t
        GRID_AT_SOLUTION = deepcopy(GRID_FOR_DRAW)
        if not DISPLAY_EXTRA_INFO: break

  if part == 1:                                                               # PART 1: COUNT ROBOTS IN EACH QUADRANT

    quadrantTL = 0
    quadrantTR = 0
    quadrantBL = 0
    quadrantBR = 0

    for robot in ROBOTS:
      top_half = robot['Py'] < H // 2
      bottom_half = H // 2 < robot['Py']
      left_half = robot['Px'] < W // 2
      right_half = W // 2 < robot['Px']

      if top_half and left_half: quadrantTL += 1
      if top_half and right_half: quadrantTR += 1
      if bottom_half and left_half: quadrantBL += 1
      if bottom_half and right_half: quadrantBR += 1

    return quadrantTL * quadrantTR * quadrantBL * quadrantBR

  else:                                                                       # PART 2: RETURN t AT WHICH EASTER EGG APPEARS
    
    assert part_2_output != None
    assert GRID_AT_SOLUTION != None
    draw(GRID_AT_SOLUTION, part_2_output)
    return part_2_output


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = find_easter_egg_image_from_movement_of_pixels_within_grid
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

sample_input = """p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
  'H': 7,
  'W': 11,
}
test_expected = 12
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'DEBUG': False,
  'H': 103,
  'W': 101,
}
test_expected = 232589280
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': actual_input,
  'DEBUG': False,
  'H': 103,
  'W': 101,
}
test_expected = 7569
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)