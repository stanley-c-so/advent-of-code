# LIBRARIES
import pathlib
import os

CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))

for n in range(1, 26):
  FILENAME = f"day{str(n).zfill(2)}-input.txt"
  INPUT_PATH = CURRENT_DIR + '\\' + FILENAME
  try:
    open(INPUT_PATH, 'r').read()
    print(f"{FILENAME} already exists")
  except:
    open(INPUT_PATH, 'w+')
    print(f"{FILENAME} created")
