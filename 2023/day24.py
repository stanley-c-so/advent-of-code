"""

--- Day 24: Never Tell Me The Odds ---

It seems like something is going wrong with the snow-making process. Instead of forming snow, the water that's been absorbed into the air seems to be forming hail!

Maybe there's something you can do to break up the hailstones?

Due to strong, probably-magical winds, the hailstones are all flying through the air in perfectly linear trajectories. You make a note of each hailstone's position and velocity (your puzzle input). For example:

19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3

Each line of text corresponds to the position and velocity of a single hailstone. The positions indicate where the hailstones are right now (at time 0). The velocities are constant and indicate exactly how far each hailstone will move in one nanosecond.

Each line of text uses the format px py pz @ vx vy vz. For instance, the hailstone specified by 20, 19, 15 @ 1, -5, -3 has initial X position 20, Y position 19, Z position 15, X velocity 1, Y velocity -5, and Z velocity -3. After one nanosecond, the hailstone would be at 21, 14, 12.

Perhaps you won't have to do anything. How likely are the hailstones to collide with each other and smash into tiny ice crystals?

To estimate this, consider only the X and Y axes; ignore the Z axis. Looking forward in time, how many of the hailstones' paths will intersect within a test area? (The hailstones themselves don't have to collide, just test for intersections between the paths they will trace.)

In this example, look for intersections that happen with an X and Y position each at least 7 and at most 27; in your actual data, you'll need to check a much larger test area. Comparing all pairs of hailstones' future paths produces the following results:

Hailstone A: 19, 13, 30 @ -2, 1, -2
Hailstone B: 18, 19, 22 @ -1, -1, -2
Hailstones' paths will cross inside the test area (at x=14.333, y=15.333).

Hailstone A: 19, 13, 30 @ -2, 1, -2
Hailstone B: 20, 25, 34 @ -2, -2, -4
Hailstones' paths will cross inside the test area (at x=11.667, y=16.667).

Hailstone A: 19, 13, 30 @ -2, 1, -2
Hailstone B: 12, 31, 28 @ -1, -2, -1
Hailstones' paths will cross outside the test area (at x=6.2, y=19.4).

Hailstone A: 19, 13, 30 @ -2, 1, -2
Hailstone B: 20, 19, 15 @ 1, -5, -3
Hailstones' paths crossed in the past for hailstone A.

Hailstone A: 18, 19, 22 @ -1, -1, -2
Hailstone B: 20, 25, 34 @ -2, -2, -4
Hailstones' paths are parallel; they never intersect.

Hailstone A: 18, 19, 22 @ -1, -1, -2
Hailstone B: 12, 31, 28 @ -1, -2, -1
Hailstones' paths will cross outside the test area (at x=-6, y=-5).

Hailstone A: 18, 19, 22 @ -1, -1, -2
Hailstone B: 20, 19, 15 @ 1, -5, -3
Hailstones' paths crossed in the past for both hailstones.

Hailstone A: 20, 25, 34 @ -2, -2, -4
Hailstone B: 12, 31, 28 @ -1, -2, -1
Hailstones' paths will cross outside the test area (at x=-2, y=3).

Hailstone A: 20, 25, 34 @ -2, -2, -4
Hailstone B: 20, 19, 15 @ 1, -5, -3
Hailstones' paths crossed in the past for hailstone B.

Hailstone A: 12, 31, 28 @ -1, -2, -1
Hailstone B: 20, 19, 15 @ 1, -5, -3
Hailstones' paths crossed in the past for both hailstones.
So, in this example, 2 hailstones' future paths cross inside the boundaries of the test area.

However, you'll need to search a much larger test area if you want to see if any hailstones might collide. Look for intersections that happen with an X and Y position each at least 200000000000000 and at most 400000000000000. Disregard the Z axis entirely.

Considering only the X and Y axes, check all pairs of hailstones' future paths for intersections. How many of these intersections occur within the test area?


--- Part Two ---

Upon further analysis, it doesn't seem like any hailstones will naturally collide. It's up to you to fix that!

You find a rock on the ground nearby. While it seems extremely unlikely, if you throw it just right, you should be able to hit every hailstone in a single throw!

You can use the probably-magical winds to reach any integer position you like and to propel the rock at any integer velocity. Now including the Z axis in your calculations, if you throw the rock at time 0, where do you need to be so that the rock perfectly collides with every hailstone? Due to probably-magical inertia, the rock won't slow down or change direction when it collides with a hailstone.

In the example above, you can achieve this by moving to position 24, 13, 10 and throwing the rock at velocity -3, 1, 2. If you do this, you will hit every hailstone as follows:

Hailstone: 19, 13, 30 @ -2, 1, -2
Collision time: 5
Collision position: 9, 18, 20

Hailstone: 18, 19, 22 @ -1, -1, -2
Collision time: 3
Collision position: 15, 16, 16

Hailstone: 20, 25, 34 @ -2, -2, -4
Collision time: 4
Collision position: 12, 17, 18

Hailstone: 12, 31, 28 @ -1, -2, -1
Collision time: 6
Collision position: 6, 19, 22

Hailstone: 20, 19, 15 @ 1, -5, -3
Collision time: 1
Collision position: 21, 14, 12

Above, each hailstone is identified by its initial position and its velocity. Then, the time and position of that hailstone's collision with your rock are given.

After 1 nanosecond, the rock has exactly the same position as one of the hailstones, obliterating it into ice dust! Another hailstone is smashed to bits two nanoseconds after that. After a total of 6 nanoseconds, all of the hailstones have been destroyed.

So, at time 0, the rock needs to be at X position 24, Y position 13, and Z position 10. Adding these three coordinates together produces 47. (Don't add any coordinates from the rock's velocity.)

Determine the exact position and velocity the rock needs to have at time 0 so that it perfectly collides with every hailstone. What do you get if you add up the X, Y, and Z coordinates of that initial position?

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

def NAME_OF_FUNC_HERE(part, input_str, test_area, DEBUG = False):

  # CONSTANTS

  position, velocity = 'position', 'velocity'


  # DATA STRUCTURE

  HAILSTONES = []


  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  for line in input_arr:
    [ pos_data, velocity_data ] = line.split(' @ ')
    HAILSTONES.append({
      position: [ int(n) for n in pos_data.split(', ') ],
      velocity: [ int(n) for n in velocity_data.split(', ') ],
    })
  

  # ANALYZE

  if part == 1:

    # HELPER FUNCTION: GIVEN TWO TRAJECTORIES, RETURNS COORDS OF INTERSECTION, AND TIMES FOR EACH OBJECT TO REACH IT

    def get_point_of_intersection_2D(A, B):

      [ APx, APy, APz ] = A[position]
      [ AVx, AVy, AVz ] = A[velocity]
      [ BPx, BPy, BPz ] = B[position]
      [ BVx, BVy, BVz ] = B[velocity]

      """
      y = mx + b, where m (slope) = Vy / Vx (rise / run)
      b = y - mx, where y = Py, x = Px
      """

      mA = AVy / AVx
      bA = APy - mA * APx

      mB = BVy / BVx
      bB = BPy - mB * BPx

      if mA == mB: return (None, None, None, None, None, None)                      # EDGE CASE: there will not be a single point solution if the slopes are equal

      x = (bB - bA) / (mA - mB)
      y = mA * x + bA

      AtX = (x - APx) / AVx if AVx else 0
      AtY = (y - APy) / AVy if AVy else 0

      BtX = (x - BPx) / BVx if BVx else 0
      BtY = (y - BPy) / BVy if BVy else 0
      
      ROUNDING_ERROR = 1                                                            # AtX and AtY should theoretically match. same with BtX and BtY. here i get a rounding error as high as 1.0
      assert abs(AtX - AtY) <= ROUNDING_ERROR
      assert abs(BtX - BtY) <= ROUNDING_ERROR

      return (x, y, AtX, AtY, BtX, BtY)


    total = 0

    for i in range(len(HAILSTONES) - 1):
      for j in range(i + 1, len(HAILSTONES)):
        A = HAILSTONES[i]
        B = HAILSTONES[j]

        x, y, AtX, AtY, BtX, BtY = get_point_of_intersection_2D(A, B)

        if (x, y) != (None, None) \
          and test_area[0] <= x <= test_area[1] \
          and test_area[0] <= y <= test_area[1] \
          and AtX >= 0 and AtY >= 0 and BtX >= 0 and BtY >= 0:                      # intersection point must be forward in time (not in the past)
          total += 1

    return total

  else:

    """
    If the velocities along some dimension d of two hailstones are the same, then the distance along dimension d between them is constant.
    So then the velocity of the solution stone (relative to these hailstones in dimension d) must be some factor of that constant distance.
    
    For example, if the two hailstones have the same x velocity, then the distance in x will be constant. Say it's 10. Then the relative
    x velocity of the stone must be either 1, 2, 5, or 10. Otherwise it could never hit them both at an integer coordinate.

    So we can look at all pairs of hailstones, searching for a common velocity along a dimension, and use the results to narrow down the possible
    velocities of the solution stone in that dimension. What we will find is that we always narrow it down to one possibility in each of the three dimensions.
    Then, using any two hailstones, along with the known velocity of the solution stone, we can use algebra to figure out the solution stone's initial position.
    """

    # It's reasonable to assume the solution stone's speed along any dimension won't be higher than that of hailstones, so let's find this value
    highest_speed_abs_value = 0
    for hailstone in HAILSTONES:
      for v in hailstone[velocity]:
        highest_speed_abs_value = max(highest_speed_abs_value, abs(v))

    # For each of 3 dimensions, create a copy of a set representing the search space for possible velocities of the solution stone
    LIMIT = highest_speed_abs_value
    VELOCITIES_BY_DIMENSION = []
    candidate_vels = set()
    for n in range(-LIMIT, LIMIT + 1): candidate_vels.add(n)
    for _ in range(3): VELOCITIES_BY_DIMENSION.append(candidate_vels.copy())

    # Look through each pair of hailstones for a common velocity along a dimension. If found, use that information to narrow the search space
    # for the solution stone's velocity in that dimension
    for i in range(len(HAILSTONES) - 1):
      for j in range(i + 1, len(HAILSTONES)):
        A = HAILSTONES[i]
        B = HAILSTONES[j]

        for d in range(3):
          if A[velocity][d] == B[velocity][d]:
            common_velocity = A[velocity][d]
            for n in VELOCITIES_BY_DIMENSION[d].copy():
              if common_velocity == n or abs(A[position][d] - B[position][d]) % (n - common_velocity) != 0:
                VELOCITIES_BY_DIMENSION[d].discard(n)

    if DISPLAY_EXTRA_INFO:
      print(f"Possible velocities for the solution stone:")
      print(f"SVx: {VELOCITIES_BY_DIMENSION[0]}")
      print(f"SVy: {VELOCITIES_BY_DIMENSION[1]}")
      print(f"SVz: {VELOCITIES_BY_DIMENSION[2]}")
      print("")

    """
    ALGEBRA:

    We want to find the solution stone's initial position coords:
    SPx, SPy, SPz

    For any two hailstones A and B, we know their positions and velocities:
    APx, APy, APz, AVx, AVy, AVz
    BPx, BPy, BPz, BVx, BVy, BVz

    We also have some candidate values for the solution stone's velocity:
    SVx, SVy, SVz

    Let tA represent the time at which solution stone collides with hailstone A.
    Let x represent the x-coord where solution stone collides with hailstone A.
    x = SPx + SVx * tA; x = APx + AVx * tA

    Isolate for SPx in terms of hailstone A's data:
    SPx = APx + AVx * tA - SVx * tA

    But, similarly, we can isolate SPx in terms of hailstone B's data:
    SPx = BPx + BVx * tB - SVx * tB

    The starting position of the solution stone is the same for either A or B, so we can set these equal, and then isolate for tA:
    APx + AVx * tA - SVx * tA = BPx + BVx * tB - SVx * tB
    tA * (AVx - SVx) = tB * (BVx - SVx) + BPx - APx
    tA = ( tB * (BVx - SVx) + BPx - APx ) / (AVx - SVx)

    NOTE THAT (AVx - SVx) != 0. WE WILL REFER TO THIS AS "divA". WHAT WOULD IT MEAN IF THEY WERE EQUAL (WHICH IS POSSIBLE, DEPENDING ON THE SELECTION OF HAILSTONE A)?
    IT MEANS THAT THIS IS A TRIVIAL EXAMPLE BECAUSE THE SOLUTION STONE AND HAILSTONE A ARE MOVING AT THE SAME RELATIVE SPEED IN x, SO IF THEY ARE EVER TO COLLIDE, THEY
    MUST BE AT THE SAME x POSITION THE WHOLE TIME TO BEGIN WITH. PRACTICALLY SPEAKING, WE SHOULD JUST DISCARD THE HAILSTONE SELECTION, AND PICK ANOTHER PAIRING.
    
    Similarly, we can express tA with data for either the y or z axes. Let's say we pick y:
    tA = ( tB * (BVy - SVy) + BPy - APy ) / (AVy - SVy)

    Setting these to be equal, we can then isolate for tB:
    ( tB * (BVx - SVx) + BPx - APx ) / (AVx - SVx) = ( tB * (BVy - SVy) + BPy - APy ) / (AVy - SVy)
    ( tB * (BVx - SVx) + BPx - APx ) * (AVy - SVy) = ( tB * (BVy - SVy) + BPy - APy ) * (AVx - SVx)
    tB * (BVx - SVx) * (AVy - SVy) + (BPx - APx) * (AVy - SVy) = tB * (BVy - SVy) * (AVx - SVx) + (BPy - APy) * (AVx - SVx)
    tB * ( (BVx - SVx) * (AVy - SVy) - (BVy - SVy) * (AVx - SVx) ) = (BPy - APy) * (AVx - SVx) - (BPx - APx) * (AVy - SVy)
    tB = (BPy - APy) * (AVx - SVx) - (BPx - APx) * (AVy - SVy) / ( (BVx - SVx) * (AVy - SVy) - (BVy - SVy) * (AVx - SVx) )

    AGAIN, THE DIVISOR ( (BVx - SVx) * (AVy - SVy) - (BVy - SVy) * (AVx - SVx) ) != 0. WE WILL REFER TO THIS AS "divB". I'M NOT ENTIRELY SURE WHAT IT "MEANS" IF THIS
    EXPRESSION IS EQUAL TO 0, AND I DON'T WANT TO THINK ABOUT THIS ANY LONGER. PRACTICALLY SPEAKING, WE SHOULD JUST DISCARD THE HAILSTONE SELECTION, AND PICK ANOTHER PAIRING. 

    Once we know tB, we can immediately solve for SPx, SPy, AND SPz:
    SPx = BPx + BVx * tB - SVx * tB
    SPy = BPy + BVy * tB - SVy * tB
    SPz = BPz + BVz * tB - SVz * tB

    Of course, we can also derive tA based on our now known value of tB, and double check the SPx, SPy, and SPz values based on tA to see if they match.
    (This is important because we will end up discarding some junk possibilities in the sample data this way.)
    SPx = APx + AVx * tA - SVx * tA
    SPy = APy + AVy * tA - SVy * tA
    SPz = APz + AVz * tA - SVz * tA

    """

    if DISPLAY_EXTRA_INFO:
      print('Now discarding triplets that result in any of:')
      print('(1) non-integer collision times,')
      print('(2) negative collision times, or')
      print('(3) inconsistent position values based on tA (hailstone A collision time) vs. tB')
      print('')

    # Now search for possible starting locations based on every possible combination of velocities of the starting stone.
    POSSIBILITIES = []
    for SVx in VELOCITIES_BY_DIMENSION[0]:
      for SVy in VELOCITIES_BY_DIMENSION[1]:
        for SVz in VELOCITIES_BY_DIMENSION[2]:
          
          # First, find two hailstones that do not mess up the algebra (because a divisor is 0)
          A, B = None, None
          AVx, AVy, AVz = None, None, None
          BVx, BVy, BVz = None, None, None
          divA, divB = None, None
          found_pair = False
          for i in range(len(HAILSTONES) - 1):
            A = HAILSTONES[i]
            [ AVx, AVy, AVz ] = A[velocity]
            divA = (AVy - SVy)                                                      # see algebra notes above for divA
            if divA != 0:                                                           # if divA is non-zero, hailstone A could work
              for j in range(i + 1, len(HAILSTONES)):
                B = HAILSTONES[j]
                [ BVx, BVy, BVz ] = B[velocity]
                divB = (BVx - SVx) * (AVy - SVy) - (BVy - SVy) * (AVx - SVx)        # see algebra notes above for divB
                if divB != 0:                                                       # if divB is also non-zero, hailstone B works, and we have a good pairing
                  found_pair = True
                  break            
                B = None            
            if found_pair: break
            A = None
          assert A and B                                                            # assert that we found a good pairing that won't mess up the algebra

          [ APx, APy, APz ] = A[position]
          [ BPx, BPy, BPz ] = B[position]

          # Calculate tB and tA values
          tB = ((BPy - APy) * (AVx - SVx) - (BPx - APx) * (AVy - SVy)) / divB
          tA = ( tB * (BVy - SVy) + BPy - APy ) / divA

          # Calculate SPx, SPy, and SPz values on the basis of tA
          SPx_tA = APx + (AVx * tA) - (SVx * tA)
          SPy_tA = APy + (AVy * tA) - (SVy * tA)
          SPz_tA = APz + (AVz * tA) - (SVz * tA)

          # Calculate SPx, SPy, and SPz values on the basis of tB
          SPx_tB = BPx + (BVx * tB) - (SVx * tB)
          SPy_tB = BPy + (BVy * tB) - (SVy * tB)
          SPz_tB = BPz + (BVz * tB) - (SVz * tB)

          # Discard junk triplet: either tA or tB is not an integer
          if not tA.is_integer() or not tB.is_integer():
            if DISPLAY_EXTRA_INFO:
              print(f"DISCARDING TRIPLET {SVx} {SVy} {SVz} || tA {tA} tB {tB}: time not integer")
            continue

          # Discard junk triplet: either tA or tB is negative
          if tA < 0 or tB < 0:
            if DISPLAY_EXTRA_INFO:
              print(f"DISCARDING TRIPLET {SVx} {SVy} {SVz} || tA {tA} tB {tB}: negative time value")
            continue

          # Discard junk triplet: at least one of the SPx, SPy, and SPz values do not agree based on tA vs. tB
          if (SPx_tA != SPx_tB or SPy_tA != SPy_tB or SPz_tA != SPz_tB):
            if DISPLAY_EXTRA_INFO:
              print(f"DISCARDING TRIPLET {SVx} {SVy} {SVz} || SPx_tA {SPx_tA} SPx_tB {SPx_tB} | SPy_tA {SPy_tA} SPy_tB {SPy_tB} | SPz_tA {SPz_tA} SPz_tB {SPz_tB}: tA-based value does not match tB-based value")
            continue

          POSSIBILITIES.append((int(SPx_tA), int(SPy_tA), int(SPz_tA)))

    if DISPLAY_EXTRA_INFO:
      print("")
      print("Remaining possible triplets for solution stone's starting position (there should only be one):")
      for possibilty in POSSIBILITIES: print(possibilty)
    
    assert len(POSSIBILITIES) == 1
    output = sum(POSSIBILITIES[0])
    if DISPLAY_EXTRA_INFO:
      print(f"Only one possible triplet - CONFIRMED! Sum is: {output}")
    return output


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
INPUT_PATH = CURRENT_DIR + '/' + (f"day{DAY_NUM}-input.txt" if DAY_NUM else 'template-input.txt')
actual_input = open(INPUT_PATH, 'r').read()

sample_input = """19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'test_area': (7, 27),
  'DEBUG': True,
}
test_expected = 2
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
  'test_area': (200000000000000, 400000000000000),
}
test_expected = 17244
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'test_area': None,
  'DEBUG': True,
}
test_expected = 47
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
  'test_area': None,
}
test_expected = 1025019997186820
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)