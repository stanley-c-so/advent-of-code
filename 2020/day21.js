// --- Day 21: Allergen Assessment ---

// You reach the train's last stop and the closest you can get to your vacation island without getting wet. There aren't even any boats here, but nothing can stop you now: you build a raft. You just need a few days' worth of food for your journey.

// You don't speak the local language, so you can't read any ingredients lists. However, sometimes, allergens are listed in a language you do understand. You should be able to use this information to determine which ingredient contains which allergen and work out which foods are safe to take with you on your trip.

// You start by compiling a list of foods (your puzzle input), one food per line. Each line includes that food's ingredients list followed by some or all of the allergens the food contains.

// Each allergen is found in exactly one ingredient. Each ingredient contains zero or one allergen. Allergens aren't always marked; when they're listed (as in (contains nuts, shellfish) after an ingredients list), the ingredient that contains each listed allergen will be somewhere in the corresponding ingredients list. However, even if an allergen isn't listed, the ingredient that contains that allergen could still be present: maybe they forgot to label it, or maybe it was labeled in a language you don't know.

// For example, consider the following list of foods:

// mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
// trh fvjkl sbzzf mxmxvkd (contains dairy)
// sqjhc fvjkl (contains soy)
// sqjhc mxmxvkd sbzzf (contains fish)

// The first food in the list has four ingredients (written in a language you don't understand): mxmxvkd, kfcds, sqjhc, and nhms. While the food might contain other allergens, a few allergens the food definitely contains are listed afterward: dairy and fish.

// The first step is to determine which ingredients can't possibly contain any of the allergens in any food in your list. In the above example, none of the ingredients kfcds, nhms, sbzzf, or trh can contain an allergen. Counting the number of times any of these ingredients appear in any ingredients list produces 5: they all appear once each except sbzzf, which appears twice.

// Determine which ingredients cannot possibly contain any of the allergens in your list. How many times do any of those ingredients appear?

// --- Part Two ---

// Now that you've isolated the inert ingredients, you should have enough information to figure out which ingredient contains which allergen.

// In the above example:

// mxmxvkd contains dairy.
// sqjhc contains fish.
// fvjkl contains soy.

// Arrange the ingredients alphabetically by their allergen and separate them by commas to produce your canonical dangerous ingredient list. (There should not be any spaces in your canonical dangerous ingredient list.) In the above example, this would be mxmxvkd,sqjhc,fvjkl.

// Time to stock your raft with supplies. What is your canonical dangerous ingredient list?

function analyzeIngredients (part, inputStr) {
  const inputArr = inputStr.split('\n');

  // STEP 1: PARSE DATA: (i) MAINTAIN A LIST OF UNKNOWN INGREDIENTS FOR EACH FOOD, (ii) KEEP A DICTIONARY LISTING ALL FOODS CONTAINING A GIVEN ALLERGEN, (iii) TRACK UNSOLVED ALLERGENS
  const foodArr = [];                                                             // e.g. from sample input: foodArr[0] is ["mxmxvkd", "kfcds", "sqjhc", "nhms"]
  const allergens = {};                                                           // e.g. from sample input: allergens["fish"] is [0, 3] (fish is explicitly mentioned in foods 0 and 3)
  const unsolvedAllergens = new Set();                                            // will initially contain all explicitly listed allergens, and shrink as allergens get translated
  for (let i = 0; i < inputArr.length; ++i) {
    const [LS, RS] = inputArr[i].split(" (contains ");
    foodArr[i] = LS.split(" ");                                                   // populate foodArr[i] with parsed ingredients
    const knownAllergens = RS.slice(0, RS.length - 1).split(", ");                // (don't forget to slice away the final closing parens from RS)
    for (const allergen of knownAllergens) {
      if (!(allergen in allergens)) allergens[allergen] = [];
      allergens[allergen].push(i);                                                // populate allergens dictionary with current index
      unsolvedAllergens.add(allergen);                                            // add allergen to unsolvedAllergens set
    }
  }

  // STEP 2: BEGIN LOOPED DEDUCTION PROCESS WHERE INGREDIENT LISTS ACROSS MULTIPLE FOODS ALL CONTAINING A GIVEN ALLERGEN ARE COMPARED TO FIND COMMON ELEMENTS - IF ONLY 1, THE ALLERGEN IS SOLVED
  const possibleTranslations = {};                                                // each key is an allergen. the value is a set of ingredients that could possibly translate to that allergen

  function getCommonElements(arr1, arr2) {                                        // a utility function returning an array of elements common to two given arrays
    const common = [];
    const set1 = new Set(arr1);
    for (const element of arr2) if (set1.has(element)) common.push(element);
    return common;
  }

  function deduce() {                                                             // this function is meant to be run indefinitely, until it fails to make a new deduction on its final pass
    let madeDeduction = false;
    for (const allergen of [...unsolvedAllergens]) {                              // iterate through all unsolved allergens...
      for (const foodIdx of allergens[allergen]) {                                // for each unsolved allergen, iterate through all foods that are known to contain that allergen...
        if (!(allergen in possibleTranslations)) {                                // the very first time the allergen is processed by the deduce function, we must initialize possibleTranslations
          possibleTranslations[allergen] = new Set(foodArr[foodIdx]);             // we grab the entire list of ingredients for the first food that contains this allergen, and make it into a set
        } else {                                                                  // after the first time the allergen is processed by the deduce function...
          possibleTranslations[allergen] = new Set(getCommonElements(             // ...we will always eliminate from the set of possible translations...
            [...possibleTranslations[allergen]],                                  // ...any elements in there that are not common to...
            foodArr[foodIdx]                                                      // ...the ingredients list of the current food (as the true ingredient must be in all foods with this allergen)
          )); 
        }
        if (possibleTranslations[allergen].size === 1) {                          // at this point, check if the possible translations for this
          madeDeduction = true;                                                   // trigger the madeDeduction flag
          const ingredient = [...possibleTranslations[allergen]][0];              // this ingredient must be the translation for this allergen
          unsolvedAllergens.delete(allergen);                                     // thus, delete it from the unsolvedAllergens set
          for (let i = 0; i < foodArr.length; ++i) {                              // for all foods...
            const indexOfIngredient = foodArr[i].indexOf(ingredient);             // ...if the food contains the ingredient now known to be the allergen...
            if (indexOfIngredient >= 0) foodArr[i].splice(indexOfIngredient, 1);  // ...cut it out of the ingredient list, to narrow down possibilities for other unsolved items
          }
          break;                                                                  // we MUST break so as not to analyze further foods containing this allergen, not only for optimization,
                                                                                  // but because the solved allergen will have been removed from those foods' ingredients list!
        }
      }
    }
    return madeDeduction;                                                         // returns whether at least one new deduction was made (whether the madeDeduction flag got triggered)
  }
  
  while (deduce());                                                               // run deduce indefinitely until it fails to make any further deductions (and returns false). (it turns
                                                                                  // out that based on our data, every allergen WILL be solved, but i wrote this code assuming in part 1 that
                                                                                  // there could be unsolved allergens.)

  if (part === 1) {                                                               // PART 1: RETURN NUMBER OF TIMES INGREDIENTS THAT CANNOT CONTAIN EXPLICITLY LISTED ALLERGENS APPEAR IN INPUT

    return foodArr.reduce((total, food) => total + food.length, 0);               // since known ingredients are systematically removed from foodArr, the number of occurrences of ingredients
                                                                                  // that do not contain any allergens must be the total number of elements remaining in foodArr
                                                                                  // e.g. from sample input: [ ["kfcds", "nhms"], ["trh", "sbzzf"], [], ["sbzzf"] ] --> ingredients appear 5 times

  } else {                                                                        // PART 2: SOLVE FOR WHICH INGREDIENTS CONTAIN EXPLICITLY LISTED ALLERGENS; SORT BY ALLERGEN AND PRINT LIST

    return Object.keys(possibleTranslations)                                      // each allergen in possibleTranslations maps to a set containing a single ingredient. so take each allergen...
      .sort()                                                                     // ...sort the resulting array alphabetically...
      .map(allergen => [...possibleTranslations[allergen]][0])                    // ...map each allergen to the first (and only) element of the set of possible translations for that allergen...
      .join(",");                                                                 // ...and join the resulting array of ingredients together into a single comma-separated string

  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = analyzeIngredients;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`;

const actualInput = `gmgzk lpdz pqnvb kvbmftc bcnt xfqnss qpnvcj nct bzxl rfdspl jzzjz sncdd ntbvc csrhqtx ktmxcn sgxqfj hcql vfmmq xxjkk csmrb gjddl pzzghh vtfsc tnk rsdnp kbtrd pssbs mljgf gbthm mlkv vrcln jmttf gnthh mtbbmqx dxvsp skdj kmsdzs qjtlb zmdxkbl pllzxb hvtn tftzqv rrp ghk rgpl lrfhq grlj blpflv zmqm jzrks znhdgj fpfzjd zqtrtmt gjb lfcl bxlcs gxhf mlsgjf vspv clsfjdj fkxsxc bxkrd hkl llnhqgx cggjv fppqtg vvx gjtttz dkk szhpqll lzlq mdvm fkp rvcgr cjzfxzt mqngs rtdfn qmfg tqzgb rfbzdxpt dtxnkhj rfxr (contains peanuts, eggs, wheat)
mbdbdt skpqxj xmbr bcqqrr rdrfcd xrrlfcs vtfsc kznc bpqm csmrb dzkb vml xzdzl dtcr rfxr csrhqtx rqkxrrt bfhfqp jmfgh zmqm sncdd kmsdzs qvzd tftzqv gjddl jzzjz bkmfl vfgp gbthm bxkrd znbs vvx ntbvc nzjkbs gznnn gkzs vzxrgn jdhzzz hrf clsfjdj glcs fkxsxc xjgfn srbjjv tzxqf cggjv slqbc bzxl brtnxz fvpcbh kvbmftc bqblkh zqtrtmt ktmxcn qjtlb xncd vrcp jvhjxn dxvsp crqz lblqc vrcln fppqtg hbdcs hcql nptsm xfqnss mdvm qtbgl gsprc pllzxb (contains fish, sesame)
tqzgb gnthh jhrbjsr kshxlf mdvm bfhfqp rsdnp jhf nbkrmh vspv rmdlkn kmsdzs lcmvc sncdd lrfhq tlhj xfqnss jzzjz gbthm nkth fqzkg sgxqfj gxhf ntbvc xncd hcql llgjg hjc bhsvqks bhflr dxvsp bzxl jzrks fppqtg vkdj bkmfl mlkv pssbs gpjstjg jdhzzz znhdgj bxkrd vjxfx srbjjv sstkmq jktsl fkxsxc rfdspl tzxqf sq fkp lzlq dxvnl vml thkp qtbgl gjb dzkb tjvtpjq nq fqgccl nzjkbs bxlcs nptsm ghk rdrfcd brrb lfcl gjddl hgtzzp pqnvb vrcp rqkxrrt jlmvcn sqqg gkzs rvcgr (contains wheat)
nptsm bpqm gjtttz nq gpjstjg pllzxb skdj bkmfl qtbgl nkth gmgzk zqtrtmt ncdrm csmrb hkvglb dzkb jhf xpk bcnt clsfjdj vvx rrp csrhqtx rznvzm llgjg jmttf grlj znhdgj bxlcs pzzghh lfcl dbfx mftgt vfgp ffqpft bbxkm mlkv ktmxcn tjvtpjq pqnvb pzdsp brrb dbkz ghk hkl gsmg hnvcpljs tsxkcg nct bhflr tnk lcmvc bqblkh st hmgz vcpfq hbdcs zmdxkbl bxkrd dxvsp gjb znbs lcdd thkp fvpcbh brtnxz qmfg lbnmnf xfqnss sq svpth vspv bzxl kshxlf dtxnkhj rvcgr blpflv gjddl vjxfx (contains sesame, fish, shellfish)
bcqqrr gjb llnhqgx bhsvqks kvbmftc lblqc nzjkbs bfhfqp hkl gbthm mbdbdt kbtrd dtxnkhj sq qpnvcj vfmmq rgpl hffsbh zgj fvpcbh rrp gmgzk slqbc fmjpdnv pllzxb bkmfl lbnmnf gjddl hrf qmfg thkp fnjz nkth dbkz mlsgjf skpqxj pzdsp mljgf gjtttz nct jhf hcql dxvsp hbdcs svpth vspv tfqzgb xjgfn glcs zmqm sgxqfj tzxqf lcdd vtfsc jmfgh sqqg nvbhlj dzkb hkvh tqzgb vrcln blpflv vzxrgn jdhzzz gsprc ktmxcn xfqnss mqngs bbxkm kjd srbjjv lcmvc zmdxkbl mlkv lzlq fqzkg jzzjz dxvnl fppqtg gsmg (contains fish)
vfgp vrcln sstkmq jhf rfbzdxpt jzzjz xfqnss bpqm fpfzjd gmgzk fkxsxc ncdrm lpdz znbs fh vrcp skdj dxvsp gsprc nzjkbs ktmxcn hbdcs znhdgj hvtn hmgz xpk qmfg fqzkg ntbvc lcmvc rgpl vzxrgn gpjstjg qtxd hnvcpljs tzxqf pllzxb dxvnl bxkrd tjvtpjq ffnsz zmqm mlkv gjb qjtlb hgtzzp qtbgl nkth gjddl slqbc dzkb hrf (contains peanuts, wheat, sesame)
hffsbh vcpfq rfdspl crqz xrrlfcs fpfzjd tlhj qtbgl dzkb llgjg glcs mtbbmqx csrhqtx hnvcpljs bxkrd jdhzzz rfbzdxpt rvcgr nkth bkmfl jlmvcn bxlcs sstkmq dbfx fh kbtrd dtcr srqhhvfp xfqnss vfgp brrb txgdclk tzxqf pllzxb mftgt jz lfcl qqczc mlgch kmsdzs csmrb nptsm jmttf lpdz knfdh gjddl sncdd nq jzzjz hbdcs fmjpdnv hcql dxvsp grlj bcqqrr sgxqfj bzxl mlrmmt (contains peanuts)
lfcl pllzxb szhpqll dzkb bqblkh jzzjz nptsm xfqnss gsmg hcql bxkrd mlgch lrfhq rrp bbxkm pqnvb mlsgjf gsprc bktfm lblqc gpjstjg gznnn vspv cz hbdcs kznc gjtttz bcqqrr hnvcpljs rdrfcd lzlq hffsbh ghk jktsl znbs vzxrgn jz fvpcbh bhsvqks lbnmnf zqtrtmt lcmvc rqkxrrt dbkz kvbmftc dkk rgpl dxvsp fkp nq skdj dbfx vrcln bkmfl rtdfn (contains fish, wheat, eggs)
znbs crqz gnthh zmdxkbl mdvm pqnvb hgtzzp dzkb dtcr rdrfcd st gjddl thkp bfhfqp bpmpfs hrf jktsl vspv mqngs ljtb rtdfn brrb tftzqv jz nzjkbs ffnsz pllzxb kmzlpb hkmrt fpfzjd sncdd pssbs llgjg bxkrd ncdrm bkmfl rfxr bbxkm bhsvqks cggjv hnvcpljs qtxd jzzjz dxvsp (contains nuts, sesame)
bzxl srbjjv mbdbdt qmfg gznnn flfpkf pllzxb xncd ghk fqgccl fppqtg qtbgl dxvsp qjzzmx dxvnl jlmvcn bhsvqks sgxqfj fpfzjd tnk jdhzzz zqtrtmt rqkxrrt mlrmmt dkk jzzjz txgdclk csmrb kvbmftc rgpl vvx skpqxj grlj gmgzk dbkz ljtb hbdcs pssbs svpth lfcl vspv hvtn qqczc rfbzdxpt xfqnss rrp gjddl vml slqbc gnthh sstkmq bxkrd qvzd brrb crqz pzdsp rtdfn bhflr nct rdrfcd vcpfq hnvcpljs lcdd znbs bkmfl hmgz ncdrm nq kjd vtfsc lpdz hgtzzp sq hkmrt fkxsxc (contains peanuts, shellfish, wheat)
vzxrgn lfcl ghk vfgp xfqnss vspv bxkrd sq mtbbmqx sgxqfj hvtn dbfx srbjjv gdt gjb lrfhq pzdsp nzjkbs bhsvqks jzzjz fkxsxc xncd lbnmnf gnthh xpk clsfjdj bfhfqp qqczc dzkb jmttf znhdgj kmzlpb cz mljgf jhrbjsr dxvsp zgj gjddl bqblkh vkdj mlgch csmrb qtbgl zmqm sncdd skpqxj gbthm hffsbh lpdz sqqg gsprc kznc fpfzjd hmgz mqngs bkmfl gmgzk xmbr st pssbs vfmmq (contains dairy, nuts, wheat)
xxjkk fqzkg fppqtg zqtrtmt qpnvcj thkp tftzqv kjd mtbbmqx gdt cjzfxzt jlmvcn bxlcs hmgz rtdfn srbjjv rfbzdxpt vrcln jz mlsgjf gmgzk mlgch bzxl vspv znbs ffnsz dxvsp fkp fpfzjd dzkb dtxnkhj hkl xfqnss sncdd xzdzl dbkz fnjz gsprc rmdlkn rfdspl pllzxb jzzjz nct hvtn xrrlfcs csmrb tsxkcg glcs hcql sgxqfj mqngs mdvm slqbc ktmxcn knfdh zgj hkvh sstkmq bcqqrr gkzs rqkxrrt srqhhvfp bxkrd jvhjxn bcnt kznc vcpfq bbxkm hkmrt ffqpft rdrfcd bfhfqp pssbs bkmfl (contains fish, eggs)
gpjstjg rznvzm fkxsxc pllzxb mbdbdt mqngs dtxnkhj cz bxkrd skdj jhrbjsr xfqnss fqgccl gjddl csrhqtx srqhhvfp dxvsp pzzghh tftzqv hbdcs tlhj lrfhq rgpl vzxrgn brtnxz nzjkbs qtbgl zqtrtmt sncdd bhsvqks ntbvc vcpfq kmsdzs tzxqf blpflv sqqg llgjg znhdgj qqczc tsxkcg jmfgh fqzkg rfdspl jzzjz jktsl gjb hvtn rdrfcd jmttf hkvh vfmmq zmdxkbl vvx cjzfxzt gkzs mdvm vspv hkmrt rmdlkn hjc nbkrmh fkp dtcr (contains fish, eggs, peanuts)
tqzgb vspv zqtrtmt qmfg bbxkm rfdspl mdvm skpqxj nct grlj bhflr qvzd gsprc fqgccl lblqc gsmg bcqqrr xpk dxvsp nzjkbs znhdgj gjb hjc vtfsc hkl tzxqf zmdxkbl csmrb gkzs nptsm thkp glcs hbdcs qjzzmx mljgf hvtn ktmxcn zgj szhpqll gdt brtnxz st nq qpnvcj sgxqfj ljtb brrb xfqnss dzkb lpdz rfxr rtdfn xxjkk pllzxb tnk dtcr dtxnkhj mqngs vfmmq blpflv gxhf jz vml crqz hmgz vjxfx mtbbmqx hkmrt mlrmmt fkp lzlq vrcln fkxsxc tlhj slqbc fqzkg rvgfqs rqkxrrt vkdj knfdh fpfzjd fmjpdnv jmfgh jhf bxkrd jhrbjsr pssbs kjd rfbzdxpt srbjjv gjddl hffsbh rznvzm (contains fish, wheat)
llnhqgx bpqm tsxkcg jlmvcn dzkb lrfhq pllzxb rznvzm bbxkm mlrmmt dkk gbthm fmjpdnv kmzlpb bktfm dtcr gsprc bcqqrr lcmvc tftzqv xncd bkmfl gdt blpflv vzxrgn jzrks tfqzgb bcnt gjddl vkdj hmgz kshxlf xmbr vspv rgpl xjgfn xfqnss lfcl skpqxj jmfgh jzzjz qpnvcj bzxl cjzfxzt fkp gpjstjg dxvsp jvhjxn srqhhvfp rsdnp dtxnkhj zmqm xpk (contains dairy)
xrrlfcs hkvglb vtfsc vspv pllzxb mdvm lfcl ktmxcn dkk lrfhq xfqnss qmfg pzzghh dxvnl fkxsxc rvcgr tqzgb ghk tnk bbxkm ljtb mlrmmt vfgp nzjkbs sq mljgf qjtlb mtbbmqx kznc jzrks kshxlf dxvsp sqqg sgxqfj glcs kmsdzs dtxnkhj cjzfxzt knfdh qjzzmx gznnn ncdrm nvbhlj gjddl fmjpdnv lblqc xjgfn lcmvc rsdnp mftgt fppqtg hbdcs bhflr zqtrtmt qqczc pssbs lpdz jhf gxhf gkzs fvxx lzlq sncdd llgjg znbs kvbmftc qvzd nq bkmfl grlj mqngs skpqxj gnthh bpqm gsmg hgtzzp tftzqv srbjjv ntbvc gdt lcdd tjvtpjq tzxqf brrb tsxkcg gmgzk dzkb fvpcbh hmgz vcpfq jvhjxn jzzjz bktfm bxlcs zmdxkbl gjtttz (contains sesame, shellfish)
hmgz sq mdvm bcnt xfqnss jdhzzz fqzkg ncdrm lpdz kznc xpk csmrb gjddl gbthm flfpkf hrf gdt qjzzmx rfbzdxpt pzzghh zgj znhdgj bqblkh rfdspl xxjkk jhrbjsr csrhqtx jzrks fqgccl grlj tsxkcg jzzjz gznnn vspv dtcr mljgf bpmpfs tfqzgb tlhj gjtttz llgjg clsfjdj rznvzm fh xncd dzkb srqhhvfp bfhfqp jz bxkrd dxvsp cjzfxzt (contains eggs, peanuts, shellfish)
sqqg jzzjz tzxqf lfcl zqtrtmt qmfg lbnmnf bhsvqks bkmfl ffqpft vspv ghk xfqnss nq jhf pllzxb hkvglb qtxd vrcln znhdgj hkl thkp rtdfn bbxkm nkth qpnvcj qtbgl mljgf cjzfxzt clsfjdj gdt gpjstjg gznnn dxvsp hbdcs tfqzgb hmgz mlsgjf mlgch gjtttz dzkb kznc rmdlkn vml qvzd xncd fkxsxc mqngs gbthm lpdz hrf qjzzmx gjddl fqgccl ljtb hcql srqhhvfp fmjpdnv llnhqgx (contains dairy, shellfish, peanuts)
bkmfl jhrbjsr fqzkg jktsl gsprc rtdfn bpmpfs skpqxj dkk tftzqv gjddl mljgf nptsm kjd mbdbdt fvpcbh xzdzl pllzxb mqngs qqczc vfgp rgpl fmjpdnv brtnxz vml jvhjxn bzxl lblqc dxvsp bxkrd sncdd fvxx dzkb vzxrgn blpflv pssbs hrf ncdrm hnvcpljs gznnn bqblkh tlhj kbtrd jzzjz nvbhlj xfqnss fkxsxc (contains dairy, fish, sesame)
hcql nzjkbs st rsdnp gkzs gxhf hkvglb mqngs blpflv qjtlb rqkxrrt mdvm nkth vzxrgn bhsvqks qmfg dbkz fkp csmrb mlkv xjgfn tlhj vtfsc cggjv bpqm xfqnss dbfx fvxx tfqzgb gjddl jz skpqxj fpfzjd bxkrd kmzlpb srqhhvfp lrfhq dxvsp sgxqfj kshxlf xpk dxvnl qjzzmx jzzjz slqbc cjzfxzt hjc flfpkf srbjjv dzkb csrhqtx gdt vspv sq kbtrd qtxd rznvzm rgpl dtcr fh bbxkm pssbs ljtb vfgp gnthh (contains wheat, peanuts, dairy)
pllzxb dzkb vspv bxkrd pssbs xjgfn rfdspl vvx hjc lcmvc dxvsp glcs vfgp lbnmnf kmzlpb xncd hvtn szhpqll sqqg bfhfqp znhdgj lcdd vkdj skpqxj kshxlf nq qpnvcj slqbc ffnsz dbfx zgj gmgzk jdhzzz thkp nvbhlj llgjg gjtttz rsdnp gjddl jhrbjsr gnthh bzxl srqhhvfp qtxd dkk xpk nct mlgch hbdcs pqnvb srbjjv rrp rgpl sq vzxrgn crqz xfqnss ljtb hnvcpljs fppqtg pzzghh hmgz nptsm (contains nuts, shellfish)
sq hbdcs qtxd mtbbmqx gsmg fkxsxc mljgf jzzjz clsfjdj nct gmgzk bkmfl hkmrt gxhf fvpcbh dxvsp bxlcs srbjjv znhdgj vrcp bhsvqks hffsbh pllzxb xfqnss dzkb thkp gpjstjg sstkmq tqzgb tjvtpjq bktfm qpnvcj gjddl rfdspl zqtrtmt kjd gkzs zgj mlkv bxkrd xzdzl szhpqll rfbzdxpt (contains wheat, peanuts, eggs)
kmsdzs kvbmftc clsfjdj bxkrd xfqnss fmjpdnv bkmfl nzjkbs kbtrd sgxqfj jhf rdrfcd gpjstjg jmfgh vfmmq hnvcpljs dkk txgdclk pqnvb blpflv nct pllzxb qjtlb hgtzzp qvzd vrcln rfdspl pzzghh mbdbdt mlrmmt vvx zqtrtmt fvxx vzxrgn rgpl gkzs bktfm gdt jz hjc xpk tjvtpjq gxhf ffnsz fh jlmvcn lcmvc jzzjz nbkrmh fkp lpdz lzlq jdhzzz hkmrt rznvzm sstkmq cz pssbs qpnvcj qqczc hcql sncdd mlgch srqhhvfp nvbhlj skdj llnhqgx szhpqll gjddl tnk vrcp fvpcbh crqz grlj dzkb nq tsxkcg rmdlkn rfxr gjb jhrbjsr gsmg ktmxcn dxvsp rqkxrrt (contains eggs)
fmjpdnv gnthh vzxrgn hjc vml llgjg ffnsz bkmfl lrfhq jlmvcn dkk bktfm fqgccl knfdh skpqxj xzdzl cggjv rvcgr jzzjz kbtrd gsmg rqkxrrt hkvglb qmfg fvxx pzzghh jhrbjsr hmgz sq xfqnss fkxsxc dtcr hnvcpljs gmgzk llnhqgx rtdfn mftgt gjddl bhflr pllzxb dbkz cjzfxzt gznnn dxvnl ktmxcn kmsdzs dbfx szhpqll gbthm dxvsp hgtzzp gjtttz thkp kjd lblqc bxlcs bxkrd gjb dzkb mlgch vrcln vtfsc xpk ghk rgpl cz xrrlfcs mtbbmqx mdvm ntbvc rrp pqnvb jzrks fh lcmvc jhf hbdcs slqbc hrf kshxlf (contains wheat, eggs)
bhflr st rsdnp xfqnss zmdxkbl znhdgj szhpqll ljtb dtcr vspv llnhqgx pllzxb nptsm rfbzdxpt tfqzgb thkp kbtrd fqzkg srbjjv lzlq rvgfqs jhrbjsr sqqg qtbgl nq kjd rznvzm bxlcs lfcl jzzjz fkxsxc zgj mtbbmqx gpjstjg xjgfn xzdzl dxvsp qjtlb gdt lpdz hkvh rfdspl bbxkm vzxrgn hrf bxkrd jz ghk xxjkk lcdd skdj sstkmq mlrmmt txgdclk skpqxj dzkb fh (contains peanuts)
xmbr xrrlfcs jzzjz kjd vjxfx xfqnss bpqm csmrb vspv bbxkm kshxlf hcql blpflv fh slqbc sqqg tsxkcg grlj csrhqtx zgj hnvcpljs cz rmdlkn dkk nptsm dxvsp thkp pllzxb srbjjv xpk kbtrd brtnxz vvx gjddl jlmvcn rvcgr rznvzm nzjkbs gpjstjg tqzgb fpfzjd szhpqll bxkrd ffqpft tzxqf dtxnkhj crqz hffsbh ljtb gjtttz vrcp vml dbkz srqhhvfp tjvtpjq (contains nuts, peanuts)
hnvcpljs jzzjz qjtlb brrb xfqnss hbdcs nptsm vtfsc fvpcbh vvx jmttf xjgfn jvhjxn rgpl mlkv csmrb dtxnkhj dxvsp brtnxz vrcln svpth bzxl pllzxb bhflr hkl srqhhvfp lzlq hkmrt jzrks hjc grlj clsfjdj lcdd bpqm gmgzk gbthm mftgt gsprc sqqg vml lpdz sq dzkb bqblkh hrf vfmmq rfxr tsxkcg gkzs bxkrd vspv kmzlpb blpflv ffnsz jdhzzz knfdh bkmfl vrcp (contains wheat, dairy)
hvtn lblqc fqgccl qqczc dbfx mtbbmqx hjc xfqnss jktsl csrhqtx dzkb vcpfq jzzjz lrfhq pqnvb svpth xmbr bfhfqp sgxqfj vml nkth gxhf mlrmmt bxkrd kmzlpb zgj hgtzzp ffqpft pzzghh ncdrm thkp jhrbjsr ghk jdhzzz rmdlkn fppqtg rdrfcd cggjv gjb gnthh hffsbh glcs gznnn rgpl nct ljtb vspv mbdbdt brrb txgdclk gdt dxvnl nbkrmh nq jlmvcn jz qmfg tfqzgb lcmvc csmrb sncdd xrrlfcs dxvsp mljgf qtxd sqqg kvbmftc clsfjdj pllzxb znhdgj pssbs vvx fvpcbh srqhhvfp (contains eggs, shellfish)
rgpl jktsl hffsbh txgdclk pllzxb nbkrmh gjtttz hkl dkk nct jzzjz rfdspl xfqnss fqzkg bkmfl fh qjtlb bcqqrr lpdz slqbc svpth jzrks hkvh qmfg clsfjdj rfxr kmsdzs bktfm bxlcs lrfhq ffqpft tnk sncdd mdvm dzkb vtfsc hkvglb gnthh knfdh dxvsp hjc bxkrd jmfgh mlsgjf skdj ljtb hvtn thkp fmjpdnv bbxkm cjzfxzt hgtzzp rvcgr crqz rznvzm ghk hkmrt vspv dtxnkhj fkp dbfx grlj rtdfn vml gbthm qtbgl (contains shellfish, wheat)
qpnvcj bqblkh xrrlfcs dbkz gpjstjg glcs gjtttz dxvsp pllzxb csmrb mljgf flfpkf dzkb vvx dxvnl rvcgr hbdcs jzzjz lblqc tftzqv gznnn kmsdzs blpflv gnthh bhflr csrhqtx vspv sqqg fkp skpqxj bkmfl mlrmmt nptsm pssbs szhpqll nct tqzgb bcnt rmdlkn xmbr skdj hrf gdt vrcp qqczc gkzs zqtrtmt lfcl bxkrd clsfjdj pzdsp svpth bfhfqp hnvcpljs dtcr bpqm hkmrt vjxfx xfqnss ffqpft qvzd mlkv tzxqf vzxrgn bpmpfs st rdrfcd jhf fmjpdnv rqkxrrt tlhj qmfg rfdspl (contains fish)
hkvglb gjb mtbbmqx crqz skdj kbtrd rgpl hkl qjzzmx bqblkh thkp hcql zgj fqzkg pllzxb jz fvxx lbnmnf fvpcbh fnjz gkzs dxvsp ffnsz gxhf dkk hrf gpjstjg sgxqfj hbdcs sstkmq qmfg jktsl skpqxj rznvzm gjddl rfdspl st mftgt xfqnss jmfgh gdt rfbzdxpt ncdrm hnvcpljs rtdfn jzzjz szhpqll dzkb fppqtg kmsdzs jzrks jlmvcn srbjjv bxkrd qpnvcj sncdd lpdz xrrlfcs xpk (contains nuts, fish, sesame)
hkvh rvcgr xjgfn clsfjdj kjd crqz jvhjxn jzzjz dbfx tzxqf hgtzzp zmqm bxkrd jhrbjsr kznc tqzgb pqnvb csmrb brtnxz dxvsp sncdd lcdd hcql gmgzk vfgp gznnn fqgccl bcnt xpk zqtrtmt mtbbmqx pssbs xfqnss ghk cjzfxzt tjvtpjq dbkz xncd dzkb jzrks qqczc ffnsz glcs gjb rznvzm bzxl rdrfcd gjddl hnvcpljs vspv rvgfqs srbjjv jktsl lzlq fvpcbh mlkv nct ktmxcn ntbvc (contains sesame)
nbkrmh pzdsp bhsvqks dxvsp brtnxz llnhqgx hrf rmdlkn hmgz gsmg gsprc gjddl fvpcbh pssbs thkp qtxd sgxqfj lfcl rfxr qjtlb llgjg jzzjz gjtttz tjvtpjq ghk kznc hkmrt bkmfl nzjkbs dzkb bxkrd vspv lpdz kvbmftc zgj kjd qpnvcj fqgccl mljgf bhflr ljtb xjgfn srqhhvfp rvgfqs skdj grlj pllzxb (contains nuts)
srbjjv bkmfl rvgfqs nvbhlj dtxnkhj fh kmzlpb szhpqll hrf blpflv sqqg xfqnss vzxrgn mftgt lbnmnf zmqm fkp gjb xzdzl flfpkf mqngs ghk hkvglb bpmpfs mlsgjf dxvsp mlgch thkp brrb st llnhqgx rfbzdxpt fvpcbh gsprc bpqm fvxx qtxd brtnxz bxlcs csrhqtx vjxfx gmgzk bxkrd rdrfcd hnvcpljs sgxqfj kshxlf qtbgl dtcr pllzxb mljgf nq gjtttz lzlq bcqqrr mlkv bqblkh bcnt lrfhq qmfg kznc zqtrtmt glcs xxjkk qjtlb ktmxcn vcpfq vspv nptsm crqz rfxr jdhzzz rvcgr hkmrt rznvzm dzkb rfdspl zgj gjddl mbdbdt (contains peanuts, sesame)
gsprc gdt rfbzdxpt mqngs dxvsp tqzgb mftgt hrf mlgch dbkz lzlq ntbvc cggjv ktmxcn pllzxb xncd zmqm fqzkg brrb vspv blpflv bcnt xzdzl tlhj dzkb bpqm rgpl cjzfxzt nct ljtb sstkmq gjddl ffnsz xpk rfxr vtfsc nptsm fppqtg qjtlb brtnxz xmbr jmfgh fvxx xfqnss kvbmftc rznvzm znhdgj gjb mlsgjf jvhjxn bfhfqp cz kshxlf srbjjv fmjpdnv hgtzzp jzzjz gkzs csmrb vjxfx gnthh rtdfn mlrmmt mbdbdt fkp lbnmnf (contains dairy, wheat)
vfgp mqngs thkp bzxl kznc dxvnl bcnt st mlrmmt dzkb tftzqv mdvm kbtrd pzzghh pllzxb jzzjz bhsvqks jhf lbnmnf nptsm hkvh bcqqrr zqtrtmt vrcp rfbzdxpt xrrlfcs lzlq ktmxcn pzdsp tfqzgb llnhqgx crqz xzdzl bhflr vspv tsxkcg nbkrmh bxkrd llgjg srbjjv pssbs fnjz mlgch dxvsp mbdbdt qtbgl nct sstkmq bpmpfs flfpkf cz xfqnss skdj bbxkm fppqtg rfxr jmttf mlsgjf gmgzk rrp hgtzzp knfdh sq bqblkh clsfjdj fpfzjd sqqg gznnn rqkxrrt slqbc jzrks nzjkbs kvbmftc csmrb nq gkzs brtnxz szhpqll hrf rsdnp hcql grlj kjd (contains eggs)
csrhqtx kmzlpb mftgt ffnsz kznc srbjjv sgxqfj gkzs qjtlb lrfhq dbfx vjxfx gpjstjg mlgch jhrbjsr nvbhlj tzxqf jlmvcn hjc xrrlfcs svpth bpqm knfdh vspv qtbgl jmfgh mlkv bhflr sstkmq szhpqll fmjpdnv fqgccl gbthm nq tsxkcg fqzkg bfhfqp jz gznnn grlj hvtn pllzxb qpnvcj jzzjz dzkb cjzfxzt vrcp brrb vvx fvpcbh dxvsp xncd llgjg hffsbh bcqqrr jdhzzz rfxr mljgf hcql blpflv vkdj xxjkk tjvtpjq bxkrd mdvm rsdnp xfqnss dbkz jvhjxn srqhhvfp fkp zmdxkbl hrf lbnmnf znhdgj pzzghh tftzqv (contains dairy, wheat)
gnthh ncdrm hmgz lfcl rtdfn rznvzm bhflr xpk qvzd fqgccl vjxfx vrcp crqz gxhf rvcgr xfqnss skdj mlkv jzzjz xjgfn flfpkf bbxkm jhrbjsr nct qtbgl vkdj vspv gjddl hkl fnjz jzrks dxvsp glcs hrf dtcr pllzxb zgj bxkrd clsfjdj bktfm thkp vvx (contains dairy, fish, wheat)
mbdbdt bxkrd hnvcpljs kvbmftc brrb zgj jzzjz csrhqtx hkvh txgdclk pzzghh vml xxjkk gdt gjddl dxvsp lzlq mlsgjf sncdd rrp hcql nptsm lcdd mftgt xmbr xfqnss jhrbjsr brtnxz bcnt kmzlpb flfpkf kbtrd rvcgr nq gznnn hbdcs sq hmgz rmdlkn cz gnthh fpfzjd hrf hffsbh jhf glcs bhflr gjb fppqtg hkvglb dtxnkhj skpqxj bpqm vcpfq dzkb kmsdzs bzxl tftzqv vjxfx vfmmq kznc sqqg jz srqhhvfp xzdzl st dbfx gmgzk bpmpfs mdvm cggjv tsxkcg tfqzgb lpdz mqngs xrrlfcs vfgp fvxx fqgccl csmrb pzdsp bhsvqks zmdxkbl tqzgb jmttf vspv gsprc gkzs lfcl (contains shellfish, wheat, peanuts)
bfhfqp qjtlb vspv jzrks ffqpft hkvh tjvtpjq tnk bzxl zgj zmdxkbl gsmg pllzxb gjb fvxx hffsbh vkdj mljgf xzdzl hmgz kmsdzs ntbvc thkp rmdlkn jhrbjsr sstkmq gjddl gsprc gmgzk kvbmftc hjc lpdz hkl jz bbxkm bxkrd mftgt gdt rdrfcd kbtrd mlrmmt mtbbmqx qtbgl jdhzzz jzzjz rrp rtdfn hkvglb xfqnss lrfhq dzkb vrcp nct fkxsxc ghk hgtzzp (contains peanuts)
dzkb grlj xrrlfcs rqkxrrt gjtttz vspv szhpqll glcs sncdd thkp gnthh gjddl bkmfl csrhqtx pssbs flfpkf hkvh vcpfq dxvnl lpdz ktmxcn fqgccl gsmg gkzs vfgp vml fkp cjzfxzt nct fvxx lzlq qmfg nkth bktfm pllzxb pqnvb lcdd ghk jvhjxn jmttf tftzqv jz srqhhvfp hkvglb knfdh jzzjz hmgz fmjpdnv nvbhlj clsfjdj bcnt rvcgr xfqnss kshxlf hgtzzp brtnxz gxhf jlmvcn gsprc hvtn bxkrd mqngs (contains peanuts, nuts, sesame)`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 5;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 2423;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = `mxmxvkd,sqjhc,fvjkl`;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = `jzzjz,bxkrd,pllzxb,gjddl,xfqnss,dzkb,vspv,dxvsp`;
test(func, input, expected, testNum, lowestTest, highestTest);