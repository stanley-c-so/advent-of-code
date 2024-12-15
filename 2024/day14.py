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

  # SOLUTION

  SOLUTION = ''.join("""                                                           #                                         
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
                                   #    #                                                       #    """.split('\n'))

  # print(maxsize)
  # assert 0, 'yo'

  # CONSTANTS

  H, W = args
  EMPTY, ROBOT = ' ', '#'


  # DATA STRUCTURE

  ROBOTS = []
  seen = {}


  # UTILITY

  def serialize(GRID_FOR_DRAW):
    return ''.join([ ''.join(row) for row in GRID_FOR_DRAW ])
  
  def draw(GRID_FOR_DRAW, t):
    print(f'===== GRID AFTER {t} SECONDS: =====')
    for row in GRID_FOR_DRAW:
      print(''.join(row))
    print('')


  # PARSE INPUT DATA

  input_arr = input_str.split('\n')

  for line in input_arr:
    p_data, v_data = [ data.split('=')[1] for data in line.split(' ') ]
    Px, Py = [ int(n) for n in p_data.split(',') ]
    Vx, Vy = [ int(n) for n in v_data.split(',') ]
    # print(Px, Py, Vx, Vy)
    ROBOTS.append({ 'Px': Px, 'Py': Py, 'Vx': Vx, 'Vy': Vy })


  # ANALYZE

  TIME = 100 if part == 1 else maxsize

  for t in range(1, TIME + 1):
    GRID_FOR_DRAW = [ [EMPTY] * W for _ in range(H) ]

    for robot in ROBOTS:
      robot['Px'] = (robot['Px'] + robot['Vx']) % W
      robot['Py'] = (robot['Py'] + robot['Vy']) % H
      GRID_FOR_DRAW[robot['Py']][robot['Px']] = ROBOT

    if part == 2:
      serial = serialize(GRID_FOR_DRAW)
      if serial in seen:
        print(f"Previously saw this arrangement at time = {seen[serial]}")
        print(f"Period is {t - seen[serial]} seconds")
        assert False, 'Solution should have been found'
      seen[serial] = t
      if serial == SOLUTION:
        if DISPLAY_EXTRA_INFO:
          draw(GRID_FOR_DRAW, t)
        return t

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


  # 10397

  # if DEBUG:
  #   
  #   

  # ANALYZE

  TIME_AT_START = time.time()

  if part == 1:

    pass

  else:

    # if not DEBUG: print('RUNNING PART 2 ANALYSIS (PLEASE WAIT)...')


    # if not DEBUG: print(f"(RUN TOOK {(time.time() - TIME_AT_START)} SECS)")
    # return

    pass


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = NAME_OF_FUNC_HERE
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