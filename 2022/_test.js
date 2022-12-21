const equals = require('./_equality-checker');

function test (func, input, expected, testNum, skippedTests, lowestTest, highestTest) {
  if ((lowestTest || 0) <= testNum[0] && testNum[0] <= (highestTest || Infinity)) {
    if (skippedTests.has(testNum[0])) {
      console.log(`ooooo TEST ${testNum[0]} SKIPPED`);
    } else {
      const output = func(...Object.values(input));
      console.log(
        equals(output, expected)
          ? `+++++ TEST ${testNum[0]} PASSED: OUTPUT IS ${expected}`
          : `----- TEST ${testNum[0]} FAILED: EXPECTED ${expected} BUT GOT ${output}`
      );
    }
    console.log('');
  }
  ++testNum[0];
};

module.exports = test;