const equals = require('./_equality-checker');

function test (func, input, expected, testNum, skippedTests, lowestTest = 0, highestTest = Infinity) {
  if (skippedTests.has(testNum[0])) {
    console.log(`TEST ${testNum[0]} SKIPPED`);
  } else if (testNum[0] >= lowestTest && testNum[0] <= highestTest) {
    const output = func(...Object.values(input));
    console.log(
      equals(output, expected)
        ? `TEST ${testNum[0]} PASSED`
        : `TEST ${testNum[0]} FAILED: EXPECTED ${expected} BUT GOT ${output}`
    );
  }
  ++testNum[0];
};

module.exports = test;