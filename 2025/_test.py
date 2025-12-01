# MODULES
from _equality_checker import equals

# REFERENCE:
# https://stackoverflow.com/questions/287871/how-do-i-print-colored-text-to-the-terminal

class bcolors:
  HEADER = '\033[95m'
  OKBLUE = '\033[94m'
  OKCYAN = '\033[96m'
  OKGREEN = '\033[92m'
  WARNING = '\033[93m'
  FAIL = '\033[91m'
  ENDC = '\033[0m'
  BOLD = '\033[1m'
  UNDERLINE = '\033[4m'

def test(func, test_input, test_expected, test_num, skipped_tests, lowest_test, highest_test):
  if (lowest_test or 0) <= test_num[0] and test_num[0] <= (highest_test or float('inf')):
    if test_num[0] in skipped_tests:
      print(f"{bcolors.WARNING}ooooo TEST {test_num[0]} SKIPPED{bcolors.ENDC}")
    else:
      output = func(*test_input.values())
      if equals(output, test_expected):
        print(f"{bcolors.OKGREEN}+++++ TEST {test_num[0]} PASSED: OUTPUT IS {test_expected}{bcolors.ENDC}")
      else:
        print(f"{bcolors.FAIL}----- TEST {test_num[0]} FAILED: EXPECTED {test_expected} BUT GOT {output}{bcolors.ENDC}")
    print('')
  test_num[0] += 1