"""

--- Day 7: Camel Cards ---

Your all-expenses-paid trip turns out to be a one-way, five-minute ride in an airship. (At least it's a cool airship!) It drops you off at the edge of a vast desert and descends back to Island Island.

"Did you bring the parts?"

You turn around to see an Elf completely covered in white clothing, wearing goggles, and riding a large camel.

"Did you bring the parts?" she asks again, louder this time. You aren't sure what parts she's looking for; you're here to figure out why the sand stopped.

"The parts! For the sand, yes! Come with me; I will show you." She beckons you onto the camel.

After riding a bit across the sands of Desert Island, you can see what look like very large rocks covering half of the horizon. The Elf explains that the rocks are all along the part of Desert Island that is directly above Island Island, making it hard to even get there. Normally, they use big machines to move the rocks and filter the sand, but the machines have broken down because Desert Island recently stopped receiving the parts they need to fix the machines.

You've already assumed it'll be your job to figure out why the parts stopped when she asks if you can help. You agree automatically.

Because the journey will take a few days, she offers to teach you the game of Camel Cards. Camel Cards is sort of similar to poker except it's designed to be easier to play while riding a camel.

In Camel Cards, you get a list of hands, and your goal is to order them based on the strength of each hand. A hand consists of five cards labeled one of A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, or 2. The relative strength of each card follows this order, where A is the highest and 2 is the lowest.

Every hand is exactly one type. From strongest to weakest, they are:

    Five of a kind, where all five cards have the same label: AAAAA
    Four of a kind, where four cards have the same label and one card has a different label: AA8AA
    Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
    Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
    Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
    One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
    High card, where all cards' labels are distinct: 23456

Hands are primarily ordered based on type; for example, every full house is stronger than any three of a kind.

If two hands have the same type, a second ordering rule takes effect. Start by comparing the first card in each hand. If these cards are different, the hand with the stronger first card is considered stronger. If the first card in each hand have the same label, however, then move on to considering the second card in each hand. If they differ, the hand with the higher second card wins; otherwise, continue with the third card in each hand, then the fourth, then the fifth.

So, 33332 and 2AAAA are both four of a kind hands, but 33332 is stronger because its first card is stronger. Similarly, 77888 and 77788 are both a full house, but 77888 is stronger because its third card is stronger (and both hands have the same first and second card).

To play Camel Cards, you are given a list of hands and their corresponding bid (your puzzle input). For example:

32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483

This example shows five hands; each hand is followed by its bid amount. Each hand wins an amount equal to its bid multiplied by its rank, where the weakest hand gets rank 1, the second-weakest hand gets rank 2, and so on up to the strongest hand. Because there are five hands in this example, the strongest hand will have rank 5 and its bid will be multiplied by 5.

So, the first step is to put the hands in order of strength:

    32T3K is the only one pair and the other hands are all a stronger type, so it gets rank 1.
    KK677 and KTJJT are both two pair. Their first cards both have the same label, but the second card of KK677 is stronger (K vs T), so KTJJT gets rank 2 and KK677 gets rank 3.
    T55J5 and QQQJA are both three of a kind. QQQJA has a stronger first card, so it gets rank 5 and T55J5 gets rank 4.

Now, you can determine the total winnings of this set of hands by adding up the result of multiplying each hand's bid with its rank (765 * 1 + 220 * 2 + 28 * 3 + 684 * 4 + 483 * 5). So the total winnings in this example are 6440.

Find the rank of every hand in your set. What are the total winnings?


--- Part Two ---

To make things a little more interesting, the Elf introduces one additional rule. Now, J cards are jokers - wildcards that can act like whatever card would make the hand the strongest type possible.

To balance this, J cards are now the weakest individual cards, weaker even than 2. The other cards stay in the same order: A, K, Q, T, 9, 8, 7, 6, 5, 4, 3, 2, J.

J cards can pretend to be whatever card is best for the purpose of determining hand type; for example, QJJQ2 is now considered four of a kind. However, for the purpose of breaking ties between two hands of the same type, J is always treated as J, not the card it's pretending to be: JKKK2 is weaker than QQQQ2 because J is weaker than Q.

Now, the above example goes very differently:

32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483

    32T3K is still the only one pair; it doesn't contain any jokers, so its strength doesn't increase.
    KK677 is now the only two pair, making it the second-weakest hand.
    T55J5, KTJJT, and QQQJA are now all four of a kind! T55J5 gets rank 3, QQQJA gets rank 4, and KTJJT gets rank 5.

With the new joker rule, the total winnings in this example are 5905.

Using the new joker rule, find the rank of every hand in your set. What are the new total winnings?


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

def sort_by_hand_strength(part, input_str, DEBUG = False):

  # DATA STRUCTURE

  hands = []


  # PARSE INPUT DATA

  input_arr = input_str.split('\n')
  for line in input_arr:
    split = line.split(' ')
    hands.append({ 'hand': split[0], 'bid': int(split[1]) })
  

  # CONSTANTS
  
  ALL_CARDS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']


  # HELPER FUNCTIONS

  def pip_value(pip):
    if pip == 'A': return 14
    if pip == 'K': return 13
    if pip == 'Q': return 12
    if pip == 'J': return 11                            # NOTE: IN PART 1, J MEANS JACK
    if pip == 'T': return 10
    return int(pip)
  
  def pip_value_with_jokers(pip):
    if pip == 'A': return 14
    if pip == 'K': return 13
    if pip == 'Q': return 12
    if pip == 'T': return 10
    if pip == 'J': return 1                             # NOTE: IN PART 2, J MEANS JOKER
    return int(pip)

  def rank(hand):
    freq = Counter(hand)
    values = list(freq.values())
    values.sort(reverse=True)
    if values[0] == 5: return 7                         # five of a kind
    if values[0] == 4: return 6                         # four of a kind
    if values[0] == 3 and values[1] == 2: return 5      # full house
    if values[0] == 3: return 4                         # three of a kind
    if values[0] == 2 and values[1] == 2: return 3      # two pair
    if values[0] == 2: return 2                         # one pair
    return 1                                            # high card

  def rank_with_jokers(hand):
    freq = Counter(hand)
    values = list(freq.values())
    values.sort(reverse=True)
    if 'J' not in freq: return rank(hand)
    if freq['J'] == 5: return 7                         # five of a kind
    if freq['J'] == 4: return 7                         # five of a kind
    if freq['J'] == 3:
      if values[1] == 2: return 7                       # five of a kind
      return 6                                          # four of a kind

    first_idx = hand.find('J')
    last_idx = hand.rfind('J')

    # # SOLUTION 1: TRY EVERY POSSIBILITY FOR JOKERS

    # # for all other scenarios, we have to try every possibility for the 1-2 jokers
    # if freq['J'] == 2:
    #   best_rank = 1
    #   for card1 in ALL_CARDS:
    #     for card2 in ALL_CARDS:
    #       hand_copy_list = [ c for c in hand ]
    #       hand_copy_list[first_idx] = card1
    #       hand_copy_list[last_idx] = card2
    #       hand_copy = ''.join(hand_copy_list)
    #       best_rank = max(best_rank, rank(hand_copy))
    #   return best_rank
    # if freq['J'] == 1:
    #   best_rank = 1
    #   for card in ALL_CARDS:
    #     hand_copy_list = [ c for c in hand ]
    #     hand_copy_list[first_idx] = card
    #     hand_copy = ''.join(hand_copy_list)
    #     best_rank = max(best_rank, rank(hand_copy))
    #   return best_rank

    # SOLUTION 2: SET JOKER TO WHATEVER PIP HAS THE HIGHEST FREQUENCY

    keys_without_jokers = list(filter(lambda k: k != 'J', freq.keys()))
    keys_without_jokers.sort(key=lambda k: freq[k], reverse=True)
    most_frequent_pip = keys_without_jokers[0]
    hand_copy_list = [ c for c in hand ]
    hand_copy_list[first_idx] = most_frequent_pip
    hand_copy_list[last_idx] = most_frequent_pip
    hand_copy = ''.join(hand_copy_list)
    return rank(hand_copy)
    
    # sanity check
    assert(False)

  def compare(data1, data2):
    hand1 = data1['hand']
    hand2 = data2['hand']
    if rank(hand1) < rank(hand2): return -1
    if rank(hand1) > rank(hand2): return 1
    for i in range(5):
      if pip_value(hand1[i]) < pip_value(hand2[i]): return -1
      if pip_value(hand1[i]) > pip_value(hand2[i]): return 1
    return 0

  def compare_with_jokers(data1, data2):
    hand1 = data1['hand']
    hand2 = data2['hand']
    if rank_with_jokers(hand1) < rank_with_jokers(hand2): return -1
    if rank_with_jokers(hand1) > rank_with_jokers(hand2): return 1
    for i in range(5):
      if pip_value_with_jokers(hand1[i]) < pip_value_with_jokers(hand2[i]): return -1
      if pip_value_with_jokers(hand1[i]) > pip_value_with_jokers(hand2[i]): return 1
    return 0


  # ANALYZE

  hands.sort(key=cmp_to_key(compare if part == 1 else compare_with_jokers))
  total = 0
  for i in range(len(hands)):
    multiplier = i + 1
    total += multiplier * hands[i]['bid']

  if DISPLAY_EXTRA_INFO: print(f'SORTED HANDS WITH RANK: {[ (hand["hand"], rank_with_jokers(hand["hand"])) for hand in hands ]}')
  return total


# TEST CASES

test_num = [1]
test_input = None
test_expected = None
func = sort_by_hand_strength
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

sample_input = """32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483"""

sample_input2 = """JJJ45 0
77772 0"""

# Test case 1
test_input = {
  'part': 1,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 6440
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 2
test_input = {
  'part': 1,
  'input_str': actual_input,
}
test_expected = 253313241
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 3
test_input = {
  'part': 2,
  'input_str': sample_input,
  'DEBUG': True,
}
test_expected = 5905
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)

# Test case 4
test_input = {
  'part': 2,
  'input_str': actual_input,
}
test_expected = 253362743
test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test)