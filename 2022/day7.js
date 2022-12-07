/*

--- Day 7: No Space Left On Device ---

You can hear birds chirping and raindrops hitting leaves as the expedition proceeds. Occasionally, you can even hear much louder sounds in the distance; how big do the animals get out here, anyway?

The device the Elves gave you has problems with more than just its communication system. You try to run a system update:

$ system-update --please --pretty-please-with-sugar-on-top
Error: No space left on device

Perhaps you can delete some files to make space for the update?

You browse around the filesystem to assess the situation and save the resulting terminal output (your puzzle input). For example:

$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k

The filesystem consists of a tree of files (plain data) and directories (which can contain other directories or files). The outermost directory is called /. You can navigate around the filesystem, moving into or out of directories and listing the contents of the directory you're currently in.

Within the terminal output, lines that begin with $ are commands you executed, very much like some modern computers:

cd means change directory. This changes which directory is the current directory, but the specific result depends on the argument:

cd x moves in one level: it looks in the current directory for the directory named x and makes it the current directory.

cd .. moves out one level: it finds the directory that contains the current directory, then makes that directory the current directory.

cd / switches the current directory to the outermost directory, /.

ls means list. It prints out all of the files and directories immediately contained by the current directory:

123 abc means that the current directory contains a file named abc with size 123.

dir xyz means that the current directory contains a directory named xyz.

Given the commands and output in the example above, you can determine that the filesystem looks visually like this:

- / (dir)
  - a (dir)
    - e (dir)
      - i (file, size=584)
    - f (file, size=29116)
    - g (file, size=2557)
    - h.lst (file, size=62596)
  - b.txt (file, size=14848514)
  - c.dat (file, size=8504156)
  - d (dir)
    - j (file, size=4060174)
    - d.log (file, size=8033020)
    - d.ext (file, size=5626152)
    - k (file, size=7214296)

Here, there are four directories: / (the outermost directory), a and d (which are in /), and e (which is in a). These directories also contain files of various sizes.

Since the disk is full, your first step should probably be to find directories that are good candidates for deletion. To do this, you need to determine the total size of each directory. The total size of a directory is the sum of the sizes of the files it contains, directly or indirectly. (Directories themselves do not count as having any intrinsic size.)

The total sizes of the directories above can be found as follows:

The total size of directory e is 584 because it contains a single file i of size 584 and no other directories.
The directory a has total size 94853 because it contains files f (size 29116), g (size 2557), and h.lst (size 62596), plus file i indirectly (a contains e which contains i).
Directory d has total size 24933642.
As the outermost directory, / contains every file. Its total size is 48381165, the sum of the size of every file.

To begin, find all of the directories with a total size of at most 100000, then calculate the sum of their total sizes. In the example above, these directories are a and e; the sum of their total sizes is 95437 (94853 + 584). (As in this example, this process can count files more than once!)

Find all of the directories with a total size of at most 100000. What is the sum of the total sizes of those directories?


--- Part Two ---

Now, you're ready to choose a directory to delete.

The total disk space available to the filesystem is 70000000. To run the update, you need unused space of at least 30000000. You need to find a directory you can delete that will free up enough space to run the update.

In the example above, the total size of the outermost directory (and thus the total amount of used space) is 48381165; this means that the size of the unused space must currently be 21618835, which isn't quite the 30000000 required by the update. Therefore, the update still requires a directory with total size of at least 8381165 to be deleted before it can run.

To achieve this, you have the following options:

Delete directory e, which would increase unused space by 584.
Delete directory a, which would increase unused space by 94853.
Delete directory d, which would increase unused space by 24933642.
Delete directory /, which would increase unused space by 48381165.

Directories e and a are both too small; deleting them would not free up enough space. However, directories d and / are both big enough! Between these, choose the smallest: d, increasing unused space by 24933642.

Find the smallest directory that, if deleted, would free up enough space on the filesystem to run the update. What is the total size of that directory?

*/

function parseFilesystem (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');
  // if (DEBUG) {
  //   console.log(inputArr[0]);
  //   // console.log(inputArr[1]);
  // }

  // UTILITY
  const createDir = () => ({ parent: currentDir, size: 0 });                              // DATA STRUCTURE: folders need to know their size and their parent

  // INIT
  let currentDir = null;
  const DIRS = { '/': createDir() };                                                      // init DIRS with root directory '/'
  
  let currentlyInLs = false;                                                              // (OPTIONAL) sanity check to make sure output is coming from `ls` command
  
  // PARSE DATA
  for (const line of inputArr) {

    if (line[0] === '$') {                                                                // if line represents a command...
      currentlyInLs = false;
      const [COMMAND, ARG] = line.slice(2).split(' ');
      if (COMMAND === 'cd') {                                                             // ...`cd` command...
        if (ARG === '..') currentDir = DIRS[currentDir].parent;
        else if (ARG === '/') currentDir = '/';
        else {
          const newDir = (currentDir === '/' ? '' : currentDir) + '/' + ARG;
          if (!(newDir in DIRS)) DIRS[newDir] = createDir();                              // IMPORTANT: input DOES sometimes traverse to directories not yet discovered by `ls`
          currentDir = newDir;
        }
      }
      else if (COMMAND === 'ls') currentlyInLs = true;                                    // ...`ls` command (OPTIONAL)
      else throw `ERROR: UNEXPECTED COMMAND ${COMMAND}`;
    }

    else {                                                                                // else if line represents output...
      if (!currentlyInLs) throw 'ERROR: NOT CURRENTLY IN LS';                             // (OPTIONAL) sanity check to make sure output is coming from `ls` 
      if (!(currentDir in DIRS)) throw 'ERROR: CURRENT DIRECTORY NOT YET DISCOVERED';     // (OPTIONAL) sanity check to see if input traverses to directories not yet discovered by `ls`

      const [LS, RS] = line.split(' ');
      
      if (LS === 'dir') {                                                                 // ...discovered directory
        if (!(RS in DIRS)) DIRS[RS] = createDir();                                        // (OPTIONAL) since folders don't matter by themselves unless the input eventually navigates there and runs `ls`
      }
      
      else {                                                                              // ...discovered file
        let dir = currentDir;                                                             // navigate up the filesystem, updating the size of every directory along the way
        while (dir) {
          DIRS[dir].size += +LS;
          dir = DIRS[dir].parent;
        }
      }
    }

  }

  // ANALYZE
  if (part === 1) {                                                                       // PART 1: ADD UP ALL DIRECTORIES OF SIZE 100000 OR LESS

    const LIMIT = 100000;
    return Object.values(DIRS)
            .filter(dir => dir.size <= LIMIT)
            .reduce((sum, dir) => sum + dir.size, 0);

  } else {                                                                                // PART 2: FIND SIZE OF SMALLEST DIRECTORY THAT WOULD FREE UP ENOUGH SPACE

    const FILESYSTEM_TOTAL_SPACE = 70000000;
    const SIZE_OF_UPDATE = 30000000;

    const sizeOfRoot = DIRS['/'].size;
    const freeSpace = FILESYSTEM_TOTAL_SPACE - sizeOfRoot;
    const spaceThatNeedsToBeFreedUp = SIZE_OF_UPDATE - freeSpace;

    const DIR_SIZES = Object.values(DIRS).map(obj => obj.size).sort((a, b) => a - b);     // sort all dirs by size in increasing order...

    for (const dirSize of DIR_SIZES) {
      if (dirSize >= spaceThatNeedsToBeFreedUp) return dirSize;                           // ...then return the first one that would free up enough space
    }

    throw `ERROR: DID NOT FIND A SINGLE DIRECTORY OF SUFFICIENT SIZE ${spaceThatNeedsToBeFreedUp} OR MORE`;

  }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = parseFilesystem;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const skippedTests = new Set([  ]);
const lowestTest = 0;
const highestTest = 0;

const fs = require('fs');
const path = require('path');
const DAY_NUM = __filename.split('.js')[0].split('day')[1];
const INPUT_PATH = path.join(__dirname, `day${DAY_NUM}-input.txt`);
const actualInput = fs.readFileSync(INPUT_PATH, 'utf8');
const parseSampleInput = s => s.split('').map(c => c === '\n' ? '\r\n' : c).join('');

const sampleInput = parseSampleInput(
`$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 95437;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 1845346;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 24933642;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 3636703;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);