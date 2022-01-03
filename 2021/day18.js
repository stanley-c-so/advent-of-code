/*

--- Day 18: Snailfish ---

You descend into the ocean trench and encounter some snailfish. They say they saw the sleigh keys! They'll even tell you which direction the keys went if you help one of the smaller snailfish with his math homework.

Snailfish numbers aren't like regular numbers. Instead, every snailfish number is a pair - an ordered list of two elements. Each element of the pair can be either a regular number or another pair.

Pairs are written as [x,y], where x and y are the elements within the pair. Here are some example snailfish numbers, one snailfish number per line:

[1,2]
[[1,2],3]
[9,[8,7]]
[[1,9],[8,5]]
[[[[1,2],[3,4]],[[5,6],[7,8]]],9]
[[[9,[3,8]],[[0,9],6]],[[[3,7],[4,9]],3]]
[[[[1,3],[5,3]],[[1,3],[8,7]]],[[[4,9],[6,9]],[[8,2],[7,3]]]]

This snailfish homework is about addition. To add two snailfish numbers, form a pair from the left and right parameters of the addition operator. For example, [1,2] + [[3,4],5] becomes [[1,2],[[3,4],5]].

There's only one problem: snailfish numbers must always be reduced, and the process of adding two snailfish numbers can result in snailfish numbers that need to be reduced.

To reduce a snailfish number, you must repeatedly do the first action in this list that applies to the snailfish number:

If any pair is nested inside four pairs, the leftmost such pair explodes.
If any regular number is 10 or greater, the leftmost such regular number splits.

Once no action in the above list applies, the snailfish number is reduced.

During reduction, at most one action applies, after which the process returns to the top of the list of actions. For example, if split produces a pair that meets the explode criteria, that pair explodes before other splits occur.

To explode a pair, the pair's left value is added to the first regular number to the left of the exploding pair (if any), and the pair's right value is added to the first regular number to the right of the exploding pair (if any). Exploding pairs will always consist of two regular numbers. Then, the entire exploding pair is replaced with the regular number 0.

Here are some examples of a single explode action:

[[[[[9,8],1],2],3],4] becomes [[[[0,9],2],3],4] (the 9 has no regular number to its left, so it is not added to any regular number).
[7,[6,[5,[4,[3,2]]]]] becomes [7,[6,[5,[7,0]]]] (the 2 has no regular number to its right, and so it is not added to any regular number).
[[6,[5,[4,[3,2]]]],1] becomes [[6,[5,[7,0]]],3].
[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]] becomes [[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]] (the pair [3,2] is unaffected because the pair [7,3] is further to the left; [3,2] would explode on the next action).
[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]] becomes [[3,[2,[8,0]]],[9,[5,[7,0]]]].

To split a regular number, replace it with a pair; the left element of the pair should be the regular number divided by two and rounded down, while the right element of the pair should be the regular number divided by two and rounded up. For example, 10 becomes [5,5], 11 becomes [5,6], 12 becomes [6,6], and so on.

Here is the process of finding the reduced result of [[[[4,3],4],4],[7,[[8,4],9]]] + [1,1]:

after addition: [[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]
after explode:  [[[[0,7],4],[7,[[8,4],9]]],[1,1]]
after explode:  [[[[0,7],4],[15,[0,13]]],[1,1]]
after split:    [[[[0,7],4],[[7,8],[0,13]]],[1,1]]
after split:    [[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]
after explode:  [[[[0,7],4],[[7,8],[6,0]]],[8,1]]

Once no reduce actions apply, the snailfish number that remains is the actual result of the addition operation: [[[[0,7],4],[[7,8],[6,0]]],[8,1]].

The homework assignment involves adding up a list of snailfish numbers (your puzzle input). The snailfish numbers are each listed on a separate line. Add the first snailfish number and the second, then add that result and the third, then add that result and the fourth, and so on until all numbers in the list have been used once.

For example, the final sum of this list is [[[[1,1],[2,2]],[3,3]],[4,4]]:

[1,1]
[2,2]
[3,3]
[4,4]

The final sum of this list is [[[[3,0],[5,3]],[4,4]],[5,5]]:

[1,1]
[2,2]
[3,3]
[4,4]
[5,5]

The final sum of this list is [[[[5,0],[7,4]],[5,5]],[6,6]]:

[1,1]
[2,2]
[3,3]
[4,4]
[5,5]
[6,6]

Here's a slightly larger example:

[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]

The final sum [[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]] is found after adding up the above snailfish numbers:

  [[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
+ [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
= [[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]

  [[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]
+ [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
= [[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]

  [[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]
+ [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
= [[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]

  [[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]
+ [7,[5,[[3,8],[1,4]]]]
= [[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]

  [[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]
+ [[2,[2,2]],[8,[8,1]]]
= [[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]

  [[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]
+ [2,9]
= [[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]

  [[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]
+ [1,[[[9,3],9],[[9,0],[0,7]]]]
= [[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]

  [[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]
+ [[[5,[7,4]],7],1]
= [[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]

  [[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]
+ [[[[4,2],2],6],[8,7]]
= [[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]

To check whether it's the right answer, the snailfish teacher only checks the magnitude of the final sum. The magnitude of a pair is 3 times the magnitude of its left element plus 2 times the magnitude of its right element. The magnitude of a regular number is just that number.

For example, the magnitude of [9,1] is 3*9 + 2*1 = 29; the magnitude of [1,9] is 3*1 + 2*9 = 21. Magnitude calculations are recursive: the magnitude of [[9,1],[1,9]] is 3*29 + 2*21 = 129.

Here are a few more magnitude examples:

[[1,2],[[3,4],5]] becomes 143.
[[[[0,7],4],[[7,8],[6,0]]],[8,1]] becomes 1384.
[[[[1,1],[2,2]],[3,3]],[4,4]] becomes 445.
[[[[3,0],[5,3]],[4,4]],[5,5]] becomes 791.
[[[[5,0],[7,4]],[5,5]],[6,6]] becomes 1137.
[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]] becomes 3488.

So, given this example homework assignment:

[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]

The final sum is:

[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]

The magnitude of this final sum is 4140.

Add up all of the snailfish numbers from the homework assignment in the order they appear. What is the magnitude of the final sum?


--- Part Two ---

You notice a second question on the back of the homework assignment:

What is the largest magnitude you can get from adding only two of the snailfish numbers?

Note that snailfish addition is not commutative - that is, x + y and y + x can produce different results.

Again considering the last example homework assignment above:

[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]

The largest magnitude of the sum of any two snailfish numbers in this list is 3993. This is the magnitude of [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]] + [[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]], which reduces to [[[[7,8],[6,6]],[[6,0],[7,7]]],[[[7,8],[8,8]],[[7,9],[0,6]]]].

What is the largest magnitude of any sum of two different snailfish numbers from the homework assignment?

*/

function snailfishMath (part, inputStr) {
  
  // ========== HELPER FUNCTION(S) FOR DATA PARSING

  function convertStrToArr(str) {
    const stack = [];
    for (let i = 0; i < str.length; ++i) {
      const c = str[i];
      if (c === '[') {
        stack.push([]);
      } else if (c === ']') {
        if (stack.length > 1) {
          const arr = stack.pop();
          stack[stack.length - 1].push(arr);
        } else {
          return stack.pop();
        }
      } else if (c === ',') {
        continue;
      } else if ('0' <= c && c <= '9') {
        let numStr = '';
        let j = i;
        while ('0' <= str[j] && str[j] <= '9') {
          numStr += str[j];
          ++j;
        }
        i = j - 1;
        stack[stack.length - 1].push(Number(numStr));
      } else {
        throw 'YOU SCREWED UP: BAD CHARACTER', c;
      }
    }
    throw 'YOU SCREWED UP: SHOULD NOT REACH END OF FUNCTION WITHOUT RETURNING';
  }

  // // LEFT OVER FROM TONS OF TESTING, AND KEPT HERE FOR POSTERITY:
  // function convertArrToStr(arr) {
  //   if (typeof arr === 'number') return String(arr);
  //   if (arr.length !== 2) throw 'YOU SCREWED UP: ARRAY LENGTH NOT 2';
  //   return `[${convertArrToStr(arr[0])},${convertArrToStr(arr[1])}]`;
  // }

  // ========== PARSE DATA AND CONVERT STRINGS TO ARRAYS

  const inputArr = inputStr.split('\n').map(str => convertStrToArr(str));
  for (const snailfishNum of inputArr) {
    if (snailfishNum.length !== 2) throw 'YOU SCREWED UP: ARRAY LENGTH NOT 2';
  }

  // ========== HELPER FUNCTIONS AND NODE CLASS FOR ARRAY <-> BINARY TREE CONVERSION

  class Node {
    constructor(val, left = null, right = null) {
      this.val = val;
      this.left = left;
      this.right = right;
    }
  }

  function convertSnailfishNumToTree(snailfishNumOrNum) {
    if (typeof snailfishNumOrNum === 'number') return new Node(snailfishNumOrNum);
    return new Node(
      null,
      convertSnailfishNumToTree(snailfishNumOrNum[0]),
      convertSnailfishNumToTree(snailfishNumOrNum[1])
    );
  }

  function convertTreeToSnailfishNum(tree) {
    if (tree.val !== null) return tree.val;
    return [ convertTreeToSnailfishNum(tree.left), convertTreeToSnailfishNum(tree.right) ];
  }

  // ========== HELPER FUNCTIONS FOR SNAILFISH NUMBER REDUCTION

  function explode(snailfishNum) {
    const tree = convertSnailfishNumToTree(snailfishNum);
    let leftNum = null;
    let rightNum = null;
    let lastRegularNode = null;
    let finishedExplode = false;

    function DFS(node, depth) {
      if (finishedExplode) return true;
      if (leftNum === null && depth === 4 && node.val === null) {
        leftNum = node.left.val;
        rightNum = node.right.val;
        if (lastRegularNode) lastRegularNode.val += leftNum;
        node.val = 0;
        node.left = null;
        node.right = null;
        return false;
      }
      if (leftNum === null && node.val !== null) lastRegularNode = node;
      if (rightNum !== null && node.val !== null) {
        node.val += rightNum;
        rightNum = null;
        finishedExplode = true;
      }
      if (node.left) finishedExplode = DFS(node.left, depth + 1);
      if (node.right) finishedExplode = DFS(node.right, depth + 1);
      return finishedExplode;
    }
    
    const performedExplosion = DFS(tree, 0) || leftNum !== null;
    return { performedExplosion, snailfishNum: convertTreeToSnailfishNum(tree) };
  }

  function split(snailfishNum) {
    const tree = convertSnailfishNumToTree(snailfishNum);
    let foundSplit = false;

    function DFS(node) {
      if (node.val === null) return DFS(node.left) || DFS(node.right);
      if (!foundSplit && node.val > 9) {
        node.left = new Node(Math.floor(node.val / 2));
        node.right = new Node(Math.ceil(node.val / 2));
        node.val = null;
        foundSplit = true;
        return true;
      }
      return foundSplit;
    }

    const performedSplit = DFS(tree);
    return { performedSplit, snailfishNum: convertTreeToSnailfishNum(tree) };
  }

  function reduce(snailfishNum) {
    const callExplode = explode(snailfishNum);
    if (callExplode.performedExplosion) return reduce(callExplode.snailfishNum);

    const callSplit = split(snailfishNum);
    if (callSplit.performedSplit) return reduce(callSplit.snailfishNum);

    return snailfishNum;
  }

  function add(a, b) {
    return reduce( [ a, b ] );
  }

  // ========== HELPER FUNCTION FOR PROCESSING INPUT

  function getMagnitude(snailfishNum) {
    if (snailfishNum.length !== 2) throw 'YOU SCREWED UP: ARRAY LENGTH NOT 2';
    const a = 3 * (typeof snailfishNum[0] === 'number' ? snailfishNum[0] : getMagnitude(snailfishNum[0]));
    const b = 2 * (typeof snailfishNum[1] === 'number' ? snailfishNum[1] : getMagnitude(snailfishNum[1]));
    return a + b;
  }

  // ========== MAIN FUNCTION

  if (part === 1) {
    
    return getMagnitude(inputArr.reduce((sum, snailfishNum) => add(sum, snailfishNum)));

  } else {

    let maxMagnitude = -Infinity;
    for (let i = 0; i < inputArr.length; ++i) {
      for (let j = 0; j < inputArr.length; ++j) {
        if (i === j) continue;
        maxMagnitude = Math.max(maxMagnitude, getMagnitude(add(inputArr[i], inputArr[j])))
      }
    }
    return maxMagnitude;

  }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = snailfishMath;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;
// final sum should be: [[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]

const actualInput = `[[[3,9],[7,2]],[[8,4],[[5,6],0]]]
[[[1,[4,9]],[[1,8],[1,5]]],[[[2,6],[6,7]],[[4,6],[9,0]]]]
[[[[9,2],1],[[0,7],[9,6]]],[[5,9],[7,[6,9]]]]
[8,9]
[[4,[6,1]],[2,[[6,7],2]]]
[[6,[[4,1],5]],[4,9]]
[[[0,6],[8,[8,5]]],[6,9]]
[[0,[1,0]],[[8,[7,4]],[[1,1],[5,0]]]]
[[[1,[0,1]],6],[1,9]]
[[2,[[9,0],[6,1]]],[[8,4],[5,7]]]
[[[[5,3],[0,9]],[1,[0,7]]],[[9,0],[2,[2,0]]]]
[[2,[2,[6,8]]],[[9,[5,4]],[4,[3,4]]]]
[[[[4,0],[7,0]],[[4,8],[5,8]]],[[[7,2],[2,2]],[[3,3],3]]]
[[5,0],5]
[[8,[[5,0],2]],[6,[5,1]]]
[[[9,[8,8]],[8,7]],[[[4,2],4],[[5,1],[4,8]]]]
[[[[1,1],3],5],9]
[[[[1,7],[6,5]],5],[[0,6],0]]
[[9,6],2]
[[[2,[0,8]],[8,[2,1]]],5]
[[[9,[3,7]],3],[0,[5,9]]]
[[[2,[1,7]],6],[[7,[8,2]],[[8,2],8]]]
[[[[1,2],1],5],2]
[4,[8,[3,9]]]
[[[[8,9],[6,0]],[[1,6],7]],8]
[[2,[8,1]],3]
[[2,2],[[8,[0,2]],[[5,0],5]]]
[9,[2,[[6,1],[8,9]]]]
[[4,[[6,6],4]],[[[9,3],[3,1]],5]]
[[[7,8],1],0]
[[[8,8],[[1,0],7]],[4,6]]
[9,8]
[[[[4,2],9],[[9,9],7]],[7,[9,[5,8]]]]
[[4,[4,[3,3]]],8]
[0,2]
[[4,[5,5]],[9,[[6,9],4]]]
[[[7,3],[[1,2],6]],[[[2,4],[6,7]],[[5,0],9]]]
[[[[2,0],5],[4,5]],[[[6,5],[6,0]],[1,[3,4]]]]
[[3,[6,8]],[[[3,0],0],[[2,8],7]]]
[[[4,[6,2]],[9,[4,1]]],[8,[3,4]]]
[[[6,[6,8]],[7,[2,0]]],[4,[[8,7],[1,6]]]]
[2,[0,[4,0]]]
[[[[0,5],1],8],[[9,[0,3]],3]]
[[[3,[5,2]],[3,[3,2]]],[[[7,3],1],7]]
[1,[[[1,8],[1,7]],0]]
[[8,6],[[0,4],4]]
[[[8,2],[4,6]],3]
[5,[[[7,5],[4,5]],[0,2]]]
[[3,[3,6]],6]
[[[[6,8],[5,7]],[[7,3],5]],[[8,[4,8]],8]]
[[[[5,8],[3,1]],[[3,7],[7,0]]],[[9,7],0]]
[[2,[[5,3],8]],0]
[0,[2,8]]
[[8,9],[[[2,2],[4,7]],[[4,0],1]]]
[[[[3,0],8],[[7,3],[6,1]]],[[3,8],[4,2]]]
[[[[6,7],[4,3]],[[3,9],5]],8]
[[[7,7],[[3,4],7]],[[[0,4],1],9]]
[[[7,5],5],[[2,[9,9]],[0,[3,5]]]]
[[[[3,3],[6,1]],[5,8]],[[4,7],[8,1]]]
[[[0,[7,3]],[6,[7,2]]],[[0,8],7]]
[[[2,7],[9,7]],[8,[3,8]]]
[[[0,2],6],[[9,[6,5]],[[3,9],1]]]
[[7,[[3,4],[2,8]]],[[[4,1],4],7]]
[[3,[[3,4],6]],[[3,9],[[4,5],[3,0]]]]
[[[5,[5,1]],[2,4]],[1,[[1,6],6]]]
[[[5,6],[[1,3],[5,0]]],[[[4,1],8],[5,5]]]
[[[[2,0],7],[[8,9],1]],[[[4,0],[1,6]],1]]
[[[2,0],[[4,2],[9,9]]],[4,9]]
[[[[1,9],6],2],[[5,4],[2,4]]]
[[[[4,1],[4,5]],[[2,3],2]],[3,[[8,8],1]]]
[[[[8,1],0],[2,2]],[[2,[7,1]],1]]
[[[7,4],[[1,3],5]],[[6,8],[[0,0],2]]]
[[[1,2],8],[[[1,7],[4,0]],[[8,2],8]]]
[[[0,8],[3,6]],[[[5,3],7],[9,7]]]
[[4,6],[[[7,9],[7,5]],[[4,6],[8,4]]]]
[[[[7,3],0],[[6,2],[7,2]]],[9,[[8,0],3]]]
[[[3,0],1],[[2,3],1]]
[[[5,[8,6]],[[1,2],2]],[[[1,4],6],[5,[7,1]]]]
[[[[1,5],8],[0,0]],4]
[[[7,[6,8]],3],[[5,1],[[2,8],[4,6]]]]
[3,[[[5,8],[4,5]],[[7,7],8]]]
[[6,[7,[8,2]]],[[9,0],0]]
[[[8,[7,6]],1],[[2,4],6]]
[[[[0,4],2],[0,7]],[6,6]]
[1,[[1,9],[9,3]]]
[[[[5,2],[5,3]],[[9,0],4]],2]
[[[[5,5],3],[7,[1,2]]],[6,[7,2]]]
[[[[2,1],3],8],[[2,[8,2]],[7,4]]]
[[8,[9,[1,8]]],[[[4,4],[0,6]],[6,3]]]
[[[1,6],[1,[2,5]]],0]
[[[[0,1],[7,2]],[[7,2],3]],[2,[[7,8],[0,7]]]]
[[[[1,8],8],[[5,7],[3,4]]],[[[2,5],[7,4]],[[8,4],9]]]
[[[2,2],[5,[1,0]]],[[[6,6],[3,0]],[[8,5],5]]]
[[[[8,2],[4,8]],[9,4]],[[8,[7,9]],0]]
[[3,[5,[2,4]]],[[[8,1],0],[[0,4],[4,5]]]]
[[5,[9,[3,8]]],[4,[1,[5,2]]]]
[[[3,[0,6]],[7,[8,7]]],[[6,8],[[8,7],0]]]
[[[[0,2],5],[4,6]],3]
[[6,7],[[1,[4,6]],9]]
[7,[3,[[8,8],5]]]`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 4140;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 3675;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 3993;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 4650;
test(func, input, expected, testNum, lowestTest, highestTest);