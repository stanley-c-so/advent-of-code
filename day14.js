// --- Day 14: Space Stoichiometry ---

// PART 1:

// As you approach the rings of Saturn, your ship's low fuel indicator turns on. There isn't any fuel here, but the rings have plenty of raw material. Perhaps your ship's Inter-Stellar Refinery Union brand nanofactory can turn these raw materials into fuel.

// You ask the nanofactory to produce a list of the reactions it can perform that are relevant to this process (your puzzle input). Every reaction turns some quantities of specific input chemicals into some quantity of an output chemical. Almost every chemical is produced by exactly one reaction; the only exception, ORE, is the raw material input to the entire process and is not produced by a reaction.

// You just need to know how much ORE you'll need to collect before you can produce one unit of FUEL.

// Each reaction gives specific quantities for its inputs and output; reactions cannot be partially run, so only whole integer multiples of these quantities can be used. (It's okay to have leftover chemicals when you're done, though.) For example, the reaction 1 A, 2 B, 3 C => 2 D means that exactly 2 units of chemical D can be produced by consuming exactly 1 A, 2 B and 3 C. You can run the full reaction as many times as necessary; for example, you could produce 10 D by consuming 5 A, 10 B, and 15 C.

// Suppose your nanofactory produces the following list of reactions:

// 10 ORE => 10 A
// 1 ORE => 1 B
// 7 A, 1 B => 1 C
// 7 A, 1 C => 1 D
// 7 A, 1 D => 1 E
// 7 A, 1 E => 1 FUEL

// The first two reactions use only ORE as inputs; they indicate that you can produce as much of chemical A as you want (in increments of 10 units, each 10 costing 10 ORE) and as much of chemical B as you want (each costing 1 ORE). To produce 1 FUEL, a total of 31 ORE is required: 1 ORE to produce 1 B, then 30 more ORE to produce the 7 + 7 + 7 + 7 = 28 A (with 2 extra A wasted) required in the reactions to convert the B into C, C into D, D into E, and finally E into FUEL. (30 A is produced because its reaction requires that it is created in increments of 10.)

// Or, suppose you have the following list of reactions:

// 9 ORE => 2 A
// 8 ORE => 3 B
// 7 ORE => 5 C
// 3 A, 4 B => 1 AB
// 5 B, 7 C => 1 BC
// 4 C, 1 A => 1 CA
// 2 AB, 3 BC, 4 CA => 1 FUEL

// The above list of reactions requires 165 ORE to produce 1 FUEL:

// Consume 45 ORE to produce 10 A.
// Consume 64 ORE to produce 24 B.
// Consume 56 ORE to produce 40 C.
// Consume 6 A, 8 B to produce 2 AB.
// Consume 15 B, 21 C to produce 3 BC.
// Consume 16 C, 4 A to produce 4 CA.
// Consume 2 AB, 3 BC, 4 CA to produce 1 FUEL.

// Here are some larger examples:

// 13312 ORE for 1 FUEL:

// 157 ORE => 5 NZVS
// 165 ORE => 6 DCFZ
// 44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
// 12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
// 179 ORE => 7 PSHF
// 177 ORE => 5 HKGWZ
// 7 DCFZ, 7 PSHF => 2 XJWVT
// 165 ORE => 2 GPVTF
// 3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT

// 180697 ORE for 1 FUEL:

// 2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
// 17 NVRVD, 3 JNWZP => 8 VPVL
// 53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
// 22 VJHF, 37 MNCFX => 5 FWMGM
// 139 ORE => 4 NVRVD
// 144 ORE => 7 JNWZP
// 5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
// 5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
// 145 ORE => 6 MNCFX
// 1 NVRVD => 8 CXFTF
// 1 VJHF, 6 MNCFX => 4 RFSQX
// 176 ORE => 6 VJHF

// 2210736 ORE for 1 FUEL:

// 171 ORE => 8 CNZTR
// 7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
// 114 ORE => 4 BHXH
// 14 VRPVC => 6 BMBT
// 6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
// 6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
// 15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
// 13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
// 5 BMBT => 4 WPTQ
// 189 ORE => 9 KTJDG
// 1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
// 12 VRPVC, 27 CNZTR => 2 XDBXC
// 15 KTJDG, 12 BHXH => 5 XCVML
// 3 BHXH, 2 VRPVC => 7 MZWV
// 121 ORE => 7 VRPVC
// 7 XCVML => 6 RJRHP
// 5 BHXH, 4 VRPVC => 5 LTCX

// Given the list of reactions in your puzzle input, what is the minimum amount of ORE required to produce exactly 1 FUEL?

// PART 2:

// After collecting ORE for a while, you check your cargo hold: 1 trillion (1000000000000) units of ORE.

// With that much ore, given the examples above:

// The 13312 ORE-per-FUEL example could produce 82892753 FUEL.
// The 180697 ORE-per-FUEL example could produce 5586022 FUEL.
// The 2210736 ORE-per-FUEL example could produce 460664 FUEL.

// Given 1 trillion ORE, what is the maximum amount of FUEL you can produce?

function stoichiometry (part, reactionsStr) {

  const reactions = {};                                                                 // chemicals will have a key, and the value will be another object of its qty and an object of reagents and quantities
  const reactionsArr = reactionsStr.split('\n');
  for (const reaction of reactionsArr) {
    const [reagents, qtyProduct] = reaction.split(' => ');
    const [qtyP, product] = qtyProduct.split(' ');
    for (const qtyReagent of reagents.split(', ')) {
      const [qtyR, reagent] = qtyReagent.split(' ');
      if (!(product in reactions)) reactions[product] = {qty: +qtyP, reagents: {}};
      reactions[product].reagents[reagent] = +qtyR;
    }
  }

  function calculateORE (product, qtyP, excess) {

    function takeFromExcess (material, qtyM, excess) {                                  // grabs material from excess stockpile and returns the amount of that material that you still need afterward
      if (!(material in excess)) return qtyM;                                           // if the material you need does not even exist in the excess stockpile, simply return the amount of material you need
      if (qtyM < excess[material]) {                                                    // IF you can take entirely from excess, do so and return 0
        excess[material] -= qtyM;
        return 0;
      }
      const remainder = qtyM - excess[material];                                        // ELSE you exhaust whatever you had in your excess, so delete the key and return the remainder that you still need
      delete excess[material];
      return remainder;
    }

    qtyP = takeFromExcess(product, qtyP, excess);                                       // first, try to grab any of the product you need directly from excess
    if (!qtyP) return 0;                                                                // there's a chance that everything you needed was in excess. if so, return 0

    if (product === 'ORE') return qtyP;                                                 // next, see if your desired product is ORE itself, in which case, just mine and return that much ORE

    const reagents = reactions[product].reagents;                                       // at this point, you will have to build your product out of other reagents. create reference to reagents
    let requiredOre = 0;                                                                // go reagent by reagent, adding up amount of required ore for each reagent
    for (const reagent in reagents) {
      const qtyR = takeFromExcess(                                                                                              // first, try to take from excess
        reagent,
        Math.ceil(qtyP / reactions[product].qty) * reagents[reagent],
        excess
      );
      requiredOre += calculateORE(reagent, qtyR, excess);                                                                       // then, recurse and add the ORE required for that reagent to your running total
      if (reagent !== 'ORE') {                                                                                                  // unless the reagent is ORE, you may have to produce excess reagent
        excess[reagent] = (excess[reagent] || 0) + Math.ceil(qtyR / reactions[reagent].qty) * reactions[reagent].qty - qtyR;    // calculate the amount of excess
        if (!excess[reagent]) delete excess[reagent];                                                                           // if excess is 0, delete the key
      }
    }
    return requiredOre;
  }

  // PART 1 VS PART 2
  if (part === 1) {

    return calculateORE('FUEL', 1, {});
    
  } else {

    const reserves = 1000000000000;                                                           // the problem provides that you have 1 trillion ORE reserves

    let num = 0;                                                                              // start running total (num) at 0
    let powerOfTen = 1;                                                                       // start powerOfTen at 1
    while (calculateORE('FUEL', powerOfTen * 10, {}) <= reserves) powerOfTen *= 10;           // this part only needs to be done once: find the highest powerOfTen that won't cost more ORE than what you have
    while (powerOfTen >= 1) {                                                                 // for all powers of ten starting from the highest, down to ones, start with a digit of 0...
      let digit = 0;
      while (calculateORE('FUEL', num + powerOfTen * (digit + 1), {}) <= reserves) digit++;   // ...increment the digit as high as possible without costing more ORE than what you have
      num += powerOfTen * digit;                                                              // after the correct digit is found, increase that amount to your running total
      powerOfTen /= 10;                                                                       // decrement powerOfTen (by a factor of 10, obivously)
    };

    return num;

  }

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = stoichiometry;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const actualInput = `164 ORE => 2 TLJL
2 VKMKW => 4 DTCB
2 VKMKW, 16 ZKMXZ, 2 TSVN => 3 TSVQX
2 NFJKN, 2 LMVCD, 5 DSQLK => 1 RNRPB
3 NFJKN, 3 TSVQX, 6 VKMKW => 7 FBFQZ
7 ZKMXZ, 1 PVQLR => 4 MBWVZ
3 SHMGH => 4 ZKMXZ
2 MSZWL => 4 QSDC
3 DGFK => 9 TSVN
21 DTCB, 1 DSQLK => 8 DGDGS
1 DGFK, 1 SXNZP, 1 GCHL => 9 JZWH
1 DSQLK, 4 WFDK, 1 BVSL, 1 TZND, 15 HVPMK, 1 NSKX => 3 DSFDZ
1 ZDVCH, 2 PVQLR, 7 VLNX, 4 JTZM, 1 MVLHV, 1 RDBR, 11 MBWVZ => 7 ZTXQ
9 JZWH, 4 BVSL, 2 NFJKN, 26 LMVCD, 3 MKFDR, 2 TGMNG, 1 NTMRX, 12 DGDGS => 4 PBRZF
25 RNRPB => 6 MKFDR
27 ZKMXZ, 4 NFJKN, 1 DTCB => 5 RDBR
2 ZXTQ, 13 KHRFD => 7 JQJGR
3 WFDVM, 18 QSLKV => 5 NSBN
2 ZXTQ, 6 NTMRX => 4 WFDK
1 VKMKW, 14 TSVQX, 10 ZKMXZ => 6 NFJKN
1 NVDL, 1 ZKMXZ, 9 NSKX => 5 ZDVCH
7 QSDC, 1 BVSL => 4 GCHL
1 QSLKV, 13 XRBKF => 5 NTMRX
11 GDPLN => 8 KHRFD
15 VCJSD => 7 LSLP
4 PCHC, 1 SXNZP, 1 JQJGR => 9 KPBPL
18 TGMNG => 4 HVPMK
1 XRBKF, 26 LVLV => 6 WFDVM
9 VCJSD, 14 SXNZP => 4 TGMNG
22 WFDK, 20 FBFQZ => 6 LHJBH
195 ORE => 7 SHMGH
2 VCJSD, 1 XRBKF => 8 QSLKV
8 ZTXNJ, 4 TLJL => 2 MSZWL
2 LMVCD, 9 PVQLR => 4 NSKX
2 TLJL, 1 GJDPC, 8 ZXTQ => 8 PCHC
6 NSBN, 4 JVJV => 9 ZCDZ
155 ORE => 1 GDPLN
1 GDPLN => 4 VKMKW
1 KPBPL => 8 LVLV
30 NSBN, 20 MVLHV => 1 JVJV
1 LVLV => 1 DGFK
7 TSVQX => 6 LMVCD
7 TLJL, 16 MSZWL, 5 KHRFD => 2 ZXTQ
55 MBWVZ, 61 KHRFD, 16 DSFDZ, 40 LHJBH, 6 ZTXQ, 28 JZWH, 1 PBRZF => 1 FUEL
5 JQJGR, 20 VCJSD => 5 MVLHV
1 SHMGH, 1 ZTXNJ => 4 GJDPC
3 XRBKF, 9 QSLKV, 2 WFDK => 5 JTZM
5 GJDPC => 6 VCJSD
1 GJDPC, 7 XRBKF => 4 PVQLR
11 BVSL => 6 SXNZP
104 ORE => 3 ZTXNJ
3 JZWH, 9 HVPMK, 2 GCHL => 6 VLNX
1 LSLP => 6 XRBKF
1 TLJL => 5 BVSL
5 HVPMK => 9 DSQLK
6 FBFQZ, 22 PVQLR, 4 ZCDZ => 1 NVDL
3 JZWH => 1 TZND`;

// Test case 1
input = {
  part: 1,
  reactionsStr: `10 ORE => 10 A
1 ORE => 1 B
7 A, 1 B => 1 C
7 A, 1 C => 1 D
7 A, 1 D => 1 E
7 A, 1 E => 1 FUEL`,
};
expected = 31;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  reactionsStr: `9 ORE => 2 A
8 ORE => 3 B
7 ORE => 5 C
3 A, 4 B => 1 AB
5 B, 7 C => 1 BC
4 C, 1 A => 1 CA
2 AB, 3 BC, 4 CA => 1 FUEL`,
};
expected = 165;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 1,
  reactionsStr: `157 ORE => 5 NZVS
165 ORE => 6 DCFZ
44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
179 ORE => 7 PSHF
177 ORE => 5 HKGWZ
7 DCFZ, 7 PSHF => 2 XJWVT
165 ORE => 2 GPVTF
3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT`,
};
expected = 13312;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 1,
  reactionsStr: `2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
17 NVRVD, 3 JNWZP => 8 VPVL
53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
22 VJHF, 37 MNCFX => 5 FWMGM
139 ORE => 4 NVRVD
144 ORE => 7 JNWZP
5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
145 ORE => 6 MNCFX
1 NVRVD => 8 CXFTF
1 VJHF, 6 MNCFX => 4 RFSQX
176 ORE => 6 VJHF`,
};
expected = 180697;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 5
input = {
  part: 1,
  reactionsStr: `171 ORE => 8 CNZTR
7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
114 ORE => 4 BHXH
14 VRPVC => 6 BMBT
6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
5 BMBT => 4 WPTQ
189 ORE => 9 KTJDG
1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
12 VRPVC, 27 CNZTR => 2 XDBXC
15 KTJDG, 12 BHXH => 5 XCVML
3 BHXH, 2 VRPVC => 7 MZWV
121 ORE => 7 VRPVC
7 XCVML => 6 RJRHP
5 BHXH, 4 VRPVC => 5 LTCX`,
};
expected = 2210736;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 6
input = {
  part: 1,
  reactionsStr: actualInput,
};
expected = 741927;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 7
input = {
  part: 2,
  reactionsStr: `157 ORE => 5 NZVS
165 ORE => 6 DCFZ
44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
179 ORE => 7 PSHF
177 ORE => 5 HKGWZ
7 DCFZ, 7 PSHF => 2 XJWVT
165 ORE => 2 GPVTF
3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT`,
};
expected = 82892753;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 8
input = {
  part: 2,
  reactionsStr: `2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
17 NVRVD, 3 JNWZP => 8 VPVL
53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
22 VJHF, 37 MNCFX => 5 FWMGM
139 ORE => 4 NVRVD
144 ORE => 7 JNWZP
5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
145 ORE => 6 MNCFX
1 NVRVD => 8 CXFTF
1 VJHF, 6 MNCFX => 4 RFSQX
176 ORE => 6 VJHF`,
};
expected = 5586022;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 9
input = {
  part: 2,
  reactionsStr: `171 ORE => 8 CNZTR
7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
114 ORE => 4 BHXH
14 VRPVC => 6 BMBT
6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
5 BMBT => 4 WPTQ
189 ORE => 9 KTJDG
1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
12 VRPVC, 27 CNZTR => 2 XDBXC
15 KTJDG, 12 BHXH => 5 XCVML
3 BHXH, 2 VRPVC => 7 MZWV
121 ORE => 7 VRPVC
7 XCVML => 6 RJRHP
5 BHXH, 4 VRPVC => 5 LTCX`,
};
expected = 460664;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 10
input = {
  part: 2,
  reactionsStr: actualInput,
};
expected = 2371699;
test(func, input, expected, testNum, lowestTest, highestTest);