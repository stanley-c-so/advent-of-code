/*

--- Day 21: Monkey Math ---

The monkeys are back! You're worried they're going to try to steal your stuff again, but it seems like they're just holding their ground and making various monkey noises at you.

Eventually, one of the elephants realizes you don't speak monkey and comes over to interpret. As it turns out, they overheard you talking about trying to find the grove; they can show you a shortcut if you answer their riddle.

Each monkey is given a job: either to yell a specific number or to yell the result of a math operation. All of the number-yelling monkeys know their number from the start; however, the math operation monkeys need to wait for two other monkeys to yell a number, and those two other monkeys might also be waiting on other monkeys.

Your job is to work out the number the monkey named root will yell before the monkeys figure it out themselves.

For example:

root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32

Each line contains the name of a monkey, a colon, and then the job of that monkey:

A lone number means the monkey's job is simply to yell that number.
A job like aaaa + bbbb means the monkey waits for monkeys aaaa and bbbb to yell each of their numbers; the monkey then yells the sum of those two numbers.
aaaa - bbbb means the monkey yells aaaa's number minus bbbb's number.
Job aaaa * bbbb will yell aaaa's number multiplied by bbbb's number.
Job aaaa / bbbb will yell aaaa's number divided by bbbb's number.

So, in the above example, monkey drzm has to wait for monkeys hmdt and zczc to yell their numbers. Fortunately, both hmdt and zczc have jobs that involve simply yelling a single number, so they do this immediately: 32 and 2. Monkey drzm can then yell its number by finding 32 minus 2: 30.

Then, monkey sjmn has one of its numbers (30, from monkey drzm), and already has its other number, 5, from dbpl. This allows it to yell its own number by finding 30 multiplied by 5: 150.

This process continues until root yells a number: 152.

However, your actual situation involves considerably more monkeys. What number will the monkey named root yell?


--- Part Two ---

Due to some kind of monkey-elephant-human mistranslation, you seem to have misunderstood a few key details about the riddle.

First, you got the wrong job for the monkey named root; specifically, you got the wrong math operation. The correct operation for monkey root should be =, which means that it still listens for two numbers (from the same two monkeys as before), but now checks that the two numbers match.

Second, you got the wrong monkey for the job starting with humn:. It isn't a monkey - it's you. Actually, you got the job wrong, too: you need to figure out what number you need to yell so that root's equality check passes. (The number that appears after humn: in your input is now irrelevant.)

In the above example, the number you need to yell to pass root's equality test is 301. (This causes root to get the same number, 150, from both of its monkeys.)

What number do you yell to pass root's equality test?

*/

// OPTIONAL VARIABLES
const DISPLAY_EXTRA_INFO = 0;


// ========== SOLUTION 1: FOR PART 1, DO A SIMPLE DFS WITH RECURSION. KEEP A MEMO OF KNOWN VALUES (ANY MONKEYS WITH LITERAL NUMBERS AUTOMATICALLY GET
// ENTERED INTO THE MEMO ON DATA INGESTION). FOR MONKEYS WITH EXPRESSIONS, WE SIMPLY RECURSE ON THE OPERAND MONKEYS, AND PERFORM THE OPERATION.
// FOR PART 2, WE DISCOVER THAT THERE IS A LINEAR DEPENDENCY CHAIN: ONLY ONE MONKEY RELIES ON humn, ONLY ONE OTHER MONKEY RELIES ON THE PREVIOUS MONKEY,
// AND SO ON AND SO FORTH. THEREFORE, FROM THE root MONKEY, ONE SIDE'S EXPRESSION CAN BE EVALUATED INTO A LITERAL NUMBER (BECAUSE AS YOU GO DOWN THAT
// PART OF THE TREE, WE RUN INTO ALL LITERALS), WHEREAS THE OTHER SIDE'S EXPRESSION IS DEPENDENT ON THE VALUE OF humn. SINCE WE KNOW THAT BOTH EXPRESSIONS
// FOR root MUST BE EQUAL, WE TREAT THIS AS AN ALGEBRA PROBLEM: THE VALUE OF humn IS X, AND WE CONSTRUCT A STRING OF THE EXPRESSION AND SAVE THAT INTO
// THE MEMO. THEN WE ITERATE THROUGH THE DEPENDENCY CHAIN, SIMPLIFYING THE EXPRESSION EACH TIME UNTIL WE FIGURE OUT THE VALUE OF X.

function dependencyChainAlgebra (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // DATA STRUCTURES
  const MEMO = {};
  const EXPRESSION = {};
  const MONKEY_DEPENDENT_ON = {};

  // PARSE INPUT DATA
  for (const line of inputArr) {
    const [ monkey, expression ] = line.split(': ');
    const split = expression.split(' ');

    if (split.length === 1) {
      MEMO[monkey] = +split[0];
    } else {

      // PART 1: save a reference to this monkey's expression
      EXPRESSION[monkey] = split;

      // PART 2: save dependency information to form dependency chain
      const [A, operator, B] = split;

      // NOTE: i initially had the values inside MONKEY_DEPENDENT_ON as a set, in case there were multiple monkeys dependent on the same given monkey. however,
      // after inspecting the example and the real data, it became clear that the dependencies were always linear chains (i.e. there was at most one monkey
      // dependent on any given monkey). this allowed me to simplify my data structure and code, and add a sanity check after the fact.

      if (A in MONKEY_DEPENDENT_ON) {
        throw `ERROR: KEY ${A} SHOULD NOT BE IN DEPENDENCY OBJECT YET, AS THERE SHOULD BE NO DUPLICATES`;
      }
      if (B in MONKEY_DEPENDENT_ON) {
        throw `ERROR: KEY ${B} SHOULD NOT BE IN DEPENDENCY OBJECT YET, AS THERE SHOULD BE NO DUPLICATES`;
      }
      MONKEY_DEPENDENT_ON[A] = monkey;
      MONKEY_DEPENDENT_ON[B] = monkey;
    }
  }
  if (DISPLAY_EXTRA_INFO && DEBUG) {
    console.log('MEMO OF MONKEYS WITH LITERAL VALUES:', MEMO);
    console.log(' ');
    console.log('MONKEY DEPENDENCIES (dependency: dependent):', MONKEY_DEPENDENT_ON);
  }

  // PART 2: CREATE DEPENDENCY CHAIN TO HELP WORK OUT THE ORDER TO SOLVE THE ALGEBRAIC EXPRESSION
  const DEPENDENCY_CHAIN = [ ];
  const stack = [ 'humn' ];
  while (stack.length) {
    const monkey = stack.pop();
    const dependent = MONKEY_DEPENDENT_ON[monkey];
    if (dependent !== 'root') {
      DEPENDENCY_CHAIN.push(dependent);
      stack.push(dependent);
    }
  }
  if (DISPLAY_EXTRA_INFO && part === 2) {
    console.log('DEPENDENCY CHAIN (a <- b means b depends on a; chain only includes lowercase monkeys):');
    console.log(['HUMN', ...DEPENDENCY_CHAIN, 'ROOT'].join(' <- '));
    console.log('');
  }

  // HELPER FUNCTION: RETURNS VALUE CALLED OUT BY THE GIVEN MONKEY
  function getValueForMonkey(monkey) {

    // PART 2 OVERRIDES: original 'humn' value is replaced with 'X', and original 'root' expression's operator gets replaced with `=`
    if (part === 2) {
      if (monkey === 'humn') {
        MEMO['humn'] = 'X';
      }
      if (monkey === 'root') {
        const [ A, operator, B ] = EXPRESSION[monkey];
        MEMO['root'] = `${getValueForMonkey(A)} = ${getValueForMonkey(B)}`;
      }
    }

    // CACHE MISS
    if (!(monkey in MEMO)) {                                                    // NOTE: any monkey associated with a literal number from input data will not be a cache miss

      const [ A, operator, B ] = EXPRESSION[monkey];    
      const LS = getValueForMonkey(A);
      const RS = getValueForMonkey(B);

      if (part === 1 || ![typeof LS, typeof RS].includes('string')) {           // PART 1, or PART 2 and LS, RS values are not connected to X

        switch (operator) {
          case '+':
            MEMO[monkey] = LS + RS;
            break;
          case '-':
            MEMO[monkey] = LS - RS;
            break;
          case '*':
            MEMO[monkey] = LS * RS;
            break;
          case '/':
            if (LS % RS !== 0) {                                                // sanity check: any expressions involving division will always be evenly divisible
              throw `${LS} not divisible by ${RS}`;
            }
            MEMO[monkey] = LS / RS;
            break;
          default:
            throw `ERROR: UNRECOGNIZED OPERATOR ${operator}`;
        }

      } else {                                                                  // PART 2: any expression involving X (value of humn) should be saved as a string expression

        const ls = typeof LS === 'string' ? `(${LS})` : LS;                     // add parentheses around string expressions
        const rs = typeof RS === 'string' ? `(${RS})` : RS;                     // note that with our data having a linear dependency chain, monkeys will only have at most one side as a string

        switch (operator) {                                                     // build out new string expression
          case '+':
            MEMO[monkey] = `${ls} + ${rs}`;
            break;
          case '-':
            MEMO[monkey] = `${ls} - ${rs}`;
            break;
          case '*':
            MEMO[monkey] = `${ls} * ${rs}`;
            break;
          case '/':
            MEMO[monkey] = `${ls} / ${rs}`;
            break;
          default:
            throw `ERROR: UNRECOGNIZED OPERATOR ${operator}`;
        }

      }
    }

    return MEMO[monkey];
  }

  // ANALYZE
  if (part === 1) {                                                             // PART 1: RETURN THE VALUE ASSOCIATED WITH MONKEY 'root'

    return getValueForMonkey('root');                                           // invoke helper function to ultimately return value associated with monkey 'root'

  } else {                                                                      // PART 2: IGNORE 'humn' VALUE. INSTEAD, FIND WHAT IT NEEDS TO BE IN ORDER FOR 'root' MATCH EXPRESSION TO WORK

    // separate the literal and string expression parts of root expression
    const [LS, RS] = getValueForMonkey('root')                                  // invoke helper function to fill out MEMO data structure and get ` === ` expression belonging to monkey 'root'
                      .split(' = ')
                      .map(n => +n);                                            // cast both sides to numbers (string expressions will become NaN)

    if (isNaN(LS) && isNaN(RS)) {
      throw 'ERROR: BOTH SIDES OF ROOT EXPRESSION ARE NOT LITERAL NUMBERS';
    }

    let LITERAL_VALUE = isNaN(LS) ? RS : LS;

    // now traverse the dependency chain, algebraically 'undoing' the literal portion of the string expression, and applying the same transformation to the literal value.
    // eventually the evolving string expression will become '(X)', and the evolving literal value will be what X equals, which solves PART 2.
    while (DEPENDENCY_CHAIN.length) {
      
      const expression = getValueForMonkey( DEPENDENCY_CHAIN.pop() );
      const split = expression.split(' ');

      if (DISPLAY_EXTRA_INFO) {
        console.log(`${expression} = ${LITERAL_VALUE}`);
        console.log('');
      }

      let LITERAL_NUM_IS_ON_LEFT,                                               // every expression itself should have one half be a literal number, and the other half another expression wrapped in parens
          number,
          operator;

      if (split[0][0] === '(') {                                                // expression is in the form of: ( ...something involving X ) o N, where o is operator, N is literal number
        LITERAL_NUM_IS_ON_LEFT = false;
        number = +split.at(-1);                                                 // literal number is at the far right...
        operator = split.at(-2);                                                // ...and operator is to its left
      }
      else if (split.at(-1).at(-1) === ')') {                                   // expression is in the form of: N o ( ...something involving X ), where o is operator, N is literal number
        LITERAL_NUM_IS_ON_LEFT = true;
        number = +split[0];                                                     // literal number is at the far left...
        operator = split[1];                                                    // ...and operator is to its right
      }
      else throw `ERROR: EXPRESSION DOES NOT ITSELF HAVE A PORTION CONSISTING OF A PARENTHESES-WRAPPED EXPRESSION: ${expression}`;

      switch (operator) {                                                       // transform old LITERAL_VALUE into new LITERAL_VALUE, which is what expression equals
        case '+':
          LITERAL_VALUE -= number;                                              // N + expression = LITERAL_VALUE  -->  new LITERAL_VALUE = expression = LITERAL_VALUE - N
          break;
        case '-':
          LITERAL_VALUE = LITERAL_NUM_IS_ON_LEFT  ? number - LITERAL_VALUE      // N - expression = LITERAL_VALUE  -->  new LITERAL_VALUE = expression = N - LITERAL_VALUE
                                                  : LITERAL_VALUE + number;     // expression - N = LITERAL_VALUE  -->  new LITERAL_VALUE = expression = LITERAL_VALUE + N
          break;
        case '*':
          LITERAL_VALUE /= number;                                              // N * expression = LITERAL_VALUE  -->  new LITERAL_VALUE = expression = LITERAL_VALUE / N
          break;
        case '/':
          LITERAL_VALUE = LITERAL_NUM_IS_ON_LEFT  ? number / LITERAL_VALUE      // N / expression = LITERAL_VALUE  -->  new LITERAL_VALUE = expression = N / LITERAL_VALUE
                                                  : LITERAL_VALUE * number;     // expression / N = LITERAL_VALUE  -->  new LITERAL_VALUE = expression = LITERAL_VALUE * N
          break;
        default:
          throw `ERROR: UNRECOGNIZED OPERATOR ${operator}`;
      }
    }

    return LITERAL_VALUE;
  }
}


// ========== SOLUTION 2: IN PART 2, WE DO A BINARY SEARCH. I DON'T ACTUALLY LIKE THIS METHOD AS MUCH BECAUSE IT RELIES ON MORE ASSUMPTIONS THAT NEED
// TO BE VERIFIED WITH THE DATA. BASICALLY, THE BINARY SEARCH STARTS FROM THE RANGE -9007199254740991 TO 9007199254740991, AND SEE WHAT THE RESULT
// WOULD BE IF humn HAD THAT VALUE. DEPENDING ON THE DATA, THE VARIABLE EXPRESSION FOR THE root MONKEY WILL EITHER INCREASE OR DECREASE, AS THE CANDIDATE
// humn VALUE INCREASES. ONCE WE FIGURE OUT WHETHER THE RESULTS ARE ASCENDING OR NOT, WE CAN MAKE OUR BINARY SEARCH RESTRICT THE SEARCH FIELD TO EITHER
// THE LOWER HALF OR THE GREATER HALF EACH TIME THE MIDDLE NUMBER FAILS. IN TERMS OF SPEED, THIS SOLUTION SEEMS TO BE SLIGHTLY SLOWER, ALTHOUGH FOR
// PRACTICAL PURPOSES BOTH SOLUTIONS SEEM BLAZINGLY FAST. THE ONE THING THAT IS BETTER IS THAT THIS SOLUTION WAS EASIER TO IMPLEMENT, AND REQUIRES
// LESS COMPLICATED DATA INGESTION, ALTHOUGH THE RETURN VALUE OF THE RECURSIVE FUNCTION IS MORE COMPLICATED.

function dependencyChainAlgebra2 (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // DATA STRUCTURES
  const MEMO = {};
  const EXPRESSION = {};

  // PARSE INPUT DATA
  for (const line of inputArr) {
    const [ monkey, expression ] = line.split(': ');
    const split = expression.split(' ');

    if (split.length === 1) {
      MEMO[monkey] = { val: +split[0], LS: null, RS: null, fail: false };
    } else {
      EXPRESSION[monkey] = split;
    }
  }
  if (DISPLAY_EXTRA_INFO && DEBUG) {
    console.log('MEMO OF MONKEYS WITH LITERAL VALUES:', MEMO);
  }

  // HELPER FUNCTION: RETURNS AN OBJECT WHICH CONTAINS THE VALUE CALLED OUT BY THE GIVEN MONKEY. IF THE MONKEY IS MAPPED TO AN EXPRESSION,
  // THEN THIS OBJECT WILL ALSO CONTAIN THE LITERAL RESULTS OF THE LEFT AND RIGHT EXPRESSIONS; OTHERWISE THESE WOULD BE null. FINALLY,
  // THE FAIL ATTRIBUTE IS FOR SANITY CHECKING: THIS GETS SET TO TRUE IF A DIVISION EXPRESSION DOES NOT RESULT IN EVEN DIVISION. THEN ANY
  // OTHER EXPRESSION THAT RELIES ON A FAILED EXPRESSION ALSO GETS MARKED AS FAILED.
  function getValueForMonkey(monkey, MEMO, HUMN = null) {

    // PART 2 OVERRIDES
    if (part === 2) {
      if (monkey === 'humn') {
        return { val: HUMN, LS: null, RS: null, fail: false };
      }
      if (monkey === 'root') {
        const [ A, operator, B ] = EXPRESSION[monkey];
        const LS = getValueForMonkey(A, MEMO, HUMN);
        const RS = getValueForMonkey(B, MEMO, HUMN);
        return {
          val: LS.val === RS.val,
          LS: LS.val,
          RS: RS.val,
          fail: LS.fail || RS.fail
        };
      }
    }

    // CACHE MISS
    if (!(monkey in MEMO)) {                                                    // NOTE: any monkey associated with a literal number from input data will not be a cache miss
      
      const [ A, operator, B ] = EXPRESSION[monkey];    
      const LS = getValueForMonkey(A, MEMO, HUMN);
      const RS = getValueForMonkey(B, MEMO, HUMN);

      const RTN = {
        val: null,
        LS: LS.val,
        RS: RS.val,
        fail: LS.fail || RS.fail                                                // propagate the fail values of the LS and RS expressions
      };

      switch (operator) {
        case '+':
          RTN.val = LS.val + RS.val;
          break;
        case '-':
          RTN.val = LS.val - RS.val;
          break;
        case '*':
          RTN.val = LS.val * RS.val;
          break;
        case '/':
          if (LS.val % RS.val !== 0) {                                          // sanity check: any expressions involving division will always be evenly divisible
            if (DISPLAY_EXTRA_INFO) {
              console.log(`FAIL: ${LS.val} not divisible by ${RS.val}`);
            }
            RTN.fail = true;
          }
          RTN.val = LS.val / RS.val;
          break;
        default:
          throw `ERROR: UNRECOGNIZED OPERATOR ${operator}`;
      }

      MEMO[monkey] = RTN;
    }

    return MEMO[monkey];
  }

  // ANALYZE
  if (part === 1) {                                                             // PART 1: RETURN THE VALUE ASSOCIATED WITH MONKEY 'root'

    return getValueForMonkey('root', {...MEMO}).val;                            // invoke helper function to ultimately return value associated with monkey 'root'

  } else {                                                                      // PART 2: IGNORE 'humn' VALUE. INSTEAD, FIND WHAT IT NEEDS TO BE IN ORDER FOR 'root' MATCH EXPRESSION TO WORK

    // init MIN/MAX variables (these will change later during binary search)
    let MIN = Number.MIN_SAFE_INTEGER;
    let MAX = Number.MAX_SAFE_INTEGER;
    
    // figure out whether the results should be increasing or decreasing
    const MIN_RES = getValueForMonkey('root', {...MEMO}, MIN);
    const MAX_RES = getValueForMonkey('root', {...MEMO}, MAX);
    if (DISPLAY_EXTRA_INFO) {
      console.log(`${MIN}:`, MIN_RES);
      console.log(`${MAX}:`, MAX_RES);
    }

    // edge case: if it just so happens that the true answer is at the starting extremes, we need to return accordingly
    if (MIN_RES.LS === MIN_RES.RS) return MIN;                                  // true answer is -9007199254740991
    if (MAX_RES.LS === MAX_RES.RS) return MAX;                                  // true answer is 9007199254740991

    if (MIN_RES.LS !== MAX_RES.LS && MIN_RES.RS !== MAX_RES.RS) {
      throw 'ERROR: EITHER THE LS OR THE RS EXPRESSIONS MUST BE CONSTANT';      // since one of root's expressions is NOT dependent on humn
    }

    const CONSTANT_IS_ON_LEFT = MIN_RES.LS === MAX_RES.LS;
    const MIN_VAR_RES = CONSTANT_IS_ON_LEFT ? MIN_RES.RS : MIN_RES.LS;          // if constant expression is on LS, then variable expression is RS...
    const MAX_VAR_RES = CONSTANT_IS_ON_LEFT ? MAX_RES.RS : MAX_RES.LS;          // ...and vice versa. this applies equaly to MIN and MAX.
    const CONSTANT_RES = CONSTANT_IS_ON_LEFT ? MIN_RES.LS : MIN_RES.RS;

    // sanity check to confirm that either the results will be ascending or descending
    if (MIN_VAR_RES > CONSTANT_RES && MAX_VAR_RES > CONSTANT_RES) {
      throw 'ERROR: THE LS AND RS VARIABLE RESULTS CANNOT BOTH BE GREATER THAN THE CONSTANT';
    }
    if (MIN_VAR_RES < CONSTANT_RES && MAX_VAR_RES < CONSTANT_RES) {
      throw 'ERROR: THE LS AND RS VARIABLE RESULTS CANNOT BOTH BE LESS THAN THE CONSTANT';
    }
    const ASCENDING = MIN_VAR_RES < CONSTANT_RES && CONSTANT_RES < MAX_VAR_RES;

    // binary search
    while (MIN <= MAX) {
      const MID = MIN + Math.floor((MAX - MIN)) / 2;
      const MID_RES = getValueForMonkey('root', {...MEMO}, MID);
      if (DISPLAY_EXTRA_INFO) console.log(`${MID}:`, MID_RES);

      const MID_VAR_RES = CONSTANT_IS_ON_LEFT ? MID_RES.RS : MID_RES.LS;

      if (MID_VAR_RES > CONSTANT_RES) {
        if (ASCENDING) MAX = MID - 1;
        else MIN = MID + 1;
      }
      else if (MID_VAR_RES < CONSTANT_RES) {
        if (ASCENDING) MIN = MID + 1;
        else MAX = MID - 1;
      }
      else {                                                                    // if MID_VAR_RES === CONSTANT_RES, MID should be the answer. but first...
        if (!MID_RES.val) {                                                     // ...sanity check to make sure that part 2 override for root returns true val
          throw `ERROR: APPARENT SOLUTION ${MID} DOES NOT RETURN A MATCH`;
        }
        if (MID_RES.fail) {                                                     // ...sanity check to make sure no division failures were propagated
          throw `ERROR: APPARENT SOLUTION ${MID} PROPAGATES A DIVSION FAILURE`;
        }
        return MID;
      }
    }
    
  }
}


// ========== SOLUTION 3: MY BEST AND SIMPLEST SOLUTION. THE getValueForMonkey FUNCTION ONCE AGAIN RETURNS THE SIMPLE VALUE OF A MONKEY WITH
// A KNOWN LITERAL VALUE. EVEN IF THE MONKEY MAPS TO AN EXPRESSION, DFS WILL RECURSE AND FIND OUT THE LITERAL VALUES OF THE OPERANDS TO CONVERT
// THIS MONKEY INTO AN EXPRESSION, JUST LIKE IN MY PREVIOUS SOLUTIONS. IN PART 2, HOWEVER, IF A MONKEY MAPS TO AN EXPRESSION DEPENDENT ON humn,
// IT STAYS IN EXPRESSION FORM, REPRESENTED AS AN ARRAY WITH 3 ELEMENTS: AN INNER EXPRESSION, AN OPERATOR, AND A LITERAL VALUE. HOWEVER, SINCE
// THE INNER EXPRESSION IS DEPENDENT ON humn, WE WILL INSTEAD HAVE humn AND ALL INNER EXPRESSIONS DEPENDENT ON humn HAVE THE VALUE OF THE CONSTANT
// `HUMN` INSTEAD, WHICH WE CAN ASSIGN TO null. THIS WAY WHEN WE KICKSTART RECURSION ON root, WE WILL SOLVE FOR ALL MONKEYS NOT DEPENDENT ON humn,
// AND THEN AFTERWARD, WE CAN START AT root, SEPARATE OUT THE INNER EXPRESSION AND THE NOW KNOWN LITERAL VALUE, AND KEEP DRILLING DOWN INTO THE
// INNER EXPRESSION WHILE WE REASSIGN THE LITERAL VALUE BASED ON ALGEBRA, PROGRESSIVELY 'UNDOING' THE INNER EXPRESSION UNTIL IT BECOMES HUMN (null).

function dependencyChainAlgebra3 (part, inputStr, DEBUG = false) {
  const inputArr = inputStr.split('\r\n');

  // CONSTANTS
  const HUMN = null;

  // DATA STRUCTURES
  const MEMO = {};
  const EXPRESSION = {};

  // PARSE INPUT DATA
  for (const line of inputArr) {
    const [ monkey, expression ] = line.split(': ');
    const split = expression.split(' ');

    if (split.length === 1) {                                                   // monkey has a literal value
      MEMO[monkey] = +split[0];
    } else {                                                                    // monkey has an expression
      EXPRESSION[monkey] = split;
    }
  }
  if (DISPLAY_EXTRA_INFO && DEBUG) {
    console.log('MEMO OF MONKEYS WITH LITERAL VALUES:', MEMO);
  }

  // HELPER FUNCTION: RETURNS VALUE CALLED OUT BY THE GIVEN MONKEY
  function getValueForMonkey(monkey) {

    // PART 2 OVERRIDE: original 'humn' value is replaced with HUMN (null). going forward, any expression ultimately dependent on humn will also be HUMN (null)
    if (part === 2 && monkey === 'humn') {
      MEMO['humn'] = HUMN;
    }

    // CACHE MISS
    if (!(monkey in MEMO)) {                                                    // NOTE: any monkey associated with a literal number from input data will not be a cache miss

      const [ A, operator, B ] = EXPRESSION[monkey];
      const LS = getValueForMonkey(A);
      const RS = getValueForMonkey(B);

      if (typeof LS === 'number' && typeof RS === 'number') {                   // if both sides of expression are now known literals, convert exprsesion into literal

        switch (operator) {
          case '+':
            MEMO[monkey] = LS + RS;
            break;
          case '-':
            MEMO[monkey] = LS - RS;
            break;
          case '*':
            MEMO[monkey] = LS * RS;
            break;
          case '/':
            if (LS % RS !== 0) {                                                // sanity check: any expressions involving division will always be evenly divisible
              throw `${LS} not divisible by ${RS}`;
            }
            MEMO[monkey] = LS / RS;
            break;
          default:
            throw `ERROR: UNRECOGNIZED OPERATOR ${operator}`;
        }

      }
      else MEMO[monkey] = [ LS, operator, RS ];

    }

    return MEMO[monkey];
  }

  // ANALYZE
  if (part === 1) {                                                             // PART 1: RETURN THE VALUE ASSOCIATED WITH MONKEY 'root'

    return getValueForMonkey('root');                                           // invoke helper function to ultimately return value associated with monkey 'root'

  } else {                                                                      // PART 2: IGNORE 'humn' VALUE. INSTEAD, FIND WHAT IT NEEDS TO BE IN ORDER FOR 'root' MATCH EXPRESSION TO WORK
    
    // first, kickstart recursion
    const [ LS, _, RS ] = getValueForMonkey('root');                            // kickstart recursion; any expressions involving humn will be HUMN (null) instead

    // then do some initial setup based on root result (whose operator is deemed to be unique, so we will handle it a little differently)
    let literal = typeof LS === 'number' ? LS : RS;                             // init current literal (starts as the literal component of root expression)
    let expression = typeof LS === 'number' ? RS : LS;                          // init current expression (starts as the expression component of root expression)

    // then, once our values have been initialized, keep drilling down into expression until it becomes HUMN (null)
    while (expression !== HUMN) {
      const [ LS, operator, RS ] = expression;
      const innerLiteral = typeof LS === 'number' ? LS : RS;
      const innerExpression = typeof LS === 'number' ? RS : LS;
      const LITERAL_NUM_IS_ON_LEFT = typeof LS === 'number';                    // NOTE: makes a difference for reversing - and / operations!

      switch (operator) {                                                       // drill down deeper by reassigning literal to whatever innerExpression equals
        case '+':
          literal -= innerLiteral;                                              // innerExpression + innerLiteral = literal  -->  innerExpression = literal - innerLiteral
          break;
        case '-':
          if (LITERAL_NUM_IS_ON_LEFT) literal = innerLiteral - literal;         // innerLiteral - innerExpression = literal  -->  innerExpression = innerLiteral - literal
          else literal += innerLiteral;                                         // innerExpression - innerLiteral = literal  -->  innerExpression = literal + innerLiteral
          break;
        case '*':
          literal /= innerLiteral;                                              // innerExpression * innerLiteral = literal  -->  innerExpression = literal / innerLiteral
          break;
        case '/':
          if (LITERAL_NUM_IS_ON_LEFT) literal = innerLiteral / literal;         // innerLiteral / innerExpression = literal  -->  innerExpression = innerLiteral / literal
          else literal *= innerLiteral;                                         // innerExpression / innerLiteral = literal  -->  innerExpression = literal * innerLiteral
          break;
        default:
          throw `ERROR: UNRECOGNIZED OPERATOR ${operator}`;
      }
      expression = innerExpression;                                             // finally, reassign expression to innerExpression to drill down deeper
    }

    return literal;                                                             // after ending the while loop, literal should equal the true value of humn
  }
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
// const func = dependencyChainAlgebra;
// const func = dependencyChainAlgebra2;
const func = dependencyChainAlgebra3;
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
`root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`
);

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 152;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 158731561459602;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
  DEBUG: true,
};
expected = 301;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 3769668716709;
test(func, input, expected, testNum, skippedTests, lowestTest, highestTest);