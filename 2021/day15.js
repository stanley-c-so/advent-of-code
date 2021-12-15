/*

--- Day 15: Chiton ---

You've almost reached the exit of the cave, but the walls are getting closer together. Your submarine can barely still fit, though; the main problem is that the walls of the cave are covered in chitons, and it would be best not to bump any of them.

The cavern is large, but has a very low ceiling, restricting your motion to two dimensions. The shape of the cavern resembles a square; a quick scan of chiton density produces a map of risk level throughout the cave (your puzzle input). For example:

1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581

You start in the top left position, your destination is the bottom right position, and you cannot move diagonally. The number at each position is its risk level; to determine the total risk of an entire path, add up the risk levels of each position you enter (that is, don't count the risk level of your starting position unless you enter it; leaving it adds no risk to your total).

Your goal is to find a path with the lowest total risk. In this example, a path with the lowest total risk is highlighted here:

1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581

The total risk of this path is 40 (the starting position is never entered, so its risk is not counted).

What is the lowest total risk of any path from the top left to the bottom right?


--- Part Two ---

Now that you know how to find low-risk paths in the cave, you can try to find your way out.

The entire cave is actually five times larger in both dimensions than you thought; the area you originally scanned is just one tile in a 5x5 tile area that forms the full map. Your original map tile repeats to the right and downward; each time the tile repeats to the right or downward, all of its risk levels are 1 higher than the tile immediately up or left of it. However, risk levels above 9 wrap back around to 1. So, if your original map had some position with a risk level of 8, then that same position on each of the 25 total tiles would be as follows:

8 9 1 2 3
9 1 2 3 4
1 2 3 4 5
2 3 4 5 6
3 4 5 6 7

Each single digit above corresponds to the example position with a value of 8 on the top-left tile. Because the full map is actually five times larger in both dimensions, that position appears a total of 25 times, once in each duplicated tile, with the values shown above.

Here is the full five-times-as-large version of the first example above, with the original map in the top left corner highlighted:

11637517422274862853338597396444961841755517295286
13813736722492484783351359589446246169155735727126
21365113283247622439435873354154698446526571955763
36949315694715142671582625378269373648937148475914
74634171118574528222968563933317967414442817852555
13191281372421239248353234135946434524615754563572
13599124212461123532357223464346833457545794456865
31254216394236532741534764385264587549637569865174
12931385212314249632342535174345364628545647573965
23119445813422155692453326671356443778246755488935
22748628533385973964449618417555172952866628316397
24924847833513595894462461691557357271266846838237
32476224394358733541546984465265719557637682166874
47151426715826253782693736489371484759148259586125
85745282229685639333179674144428178525553928963666
24212392483532341359464345246157545635726865674683
24611235323572234643468334575457944568656815567976
42365327415347643852645875496375698651748671976285
23142496323425351743453646285456475739656758684176
34221556924533266713564437782467554889357866599146
33859739644496184175551729528666283163977739427418
35135958944624616915573572712668468382377957949348
43587335415469844652657195576376821668748793277985
58262537826937364893714847591482595861259361697236
96856393331796741444281785255539289636664139174777
35323413594643452461575456357268656746837976785794
35722346434683345754579445686568155679767926678187
53476438526458754963756986517486719762859782187396
34253517434536462854564757396567586841767869795287
45332667135644377824675548893578665991468977611257
44961841755517295286662831639777394274188841538529
46246169155735727126684683823779579493488168151459
54698446526571955763768216687487932779859814388196
69373648937148475914825958612593616972361472718347
17967414442817852555392896366641391747775241285888
46434524615754563572686567468379767857948187896815
46833457545794456865681556797679266781878137789298
64587549637569865174867197628597821873961893298417
45364628545647573965675868417678697952878971816398
56443778246755488935786659914689776112579188722368
55172952866628316397773942741888415385299952649631
57357271266846838237795794934881681514599279262561
65719557637682166874879327798598143881961925499217
71484759148259586125936169723614727183472583829458
28178525553928963666413917477752412858886352396999
57545635726865674683797678579481878968159298917926
57944568656815567976792667818781377892989248891319
75698651748671976285978218739618932984172914319528
56475739656758684176786979528789718163989182927419
67554889357866599146897761125791887223681299833479

Equipped with the full map, you can now find a path from the top left corner to the bottom right corner with the lowest total risk:

11637517422274862853338597396444961841755517295286
13813736722492484783351359589446246169155735727126
21365113283247622439435873354154698446526571955763
36949315694715142671582625378269373648937148475914
74634171118574528222968563933317967414442817852555
13191281372421239248353234135946434524615754563572
13599124212461123532357223464346833457545794456865
31254216394236532741534764385264587549637569865174
12931385212314249632342535174345364628545647573965
23119445813422155692453326671356443778246755488935
22748628533385973964449618417555172952866628316397
24924847833513595894462461691557357271266846838237
32476224394358733541546984465265719557637682166874
47151426715826253782693736489371484759148259586125
85745282229685639333179674144428178525553928963666
24212392483532341359464345246157545635726865674683
24611235323572234643468334575457944568656815567976
42365327415347643852645875496375698651748671976285
23142496323425351743453646285456475739656758684176
34221556924533266713564437782467554889357866599146
33859739644496184175551729528666283163977739427418
35135958944624616915573572712668468382377957949348
43587335415469844652657195576376821668748793277985
58262537826937364893714847591482595861259361697236
96856393331796741444281785255539289636664139174777
35323413594643452461575456357268656746837976785794
35722346434683345754579445686568155679767926678187
53476438526458754963756986517486719762859782187396
34253517434536462854564757396567586841767869795287
45332667135644377824675548893578665991468977611257
44961841755517295286662831639777394274188841538529
46246169155735727126684683823779579493488168151459
54698446526571955763768216687487932779859814388196
69373648937148475914825958612593616972361472718347
17967414442817852555392896366641391747775241285888
46434524615754563572686567468379767857948187896815
46833457545794456865681556797679266781878137789298
64587549637569865174867197628597821873961893298417
45364628545647573965675868417678697952878971816398
56443778246755488935786659914689776112579188722368
55172952866628316397773942741888415385299952649631
57357271266846838237795794934881681514599279262561
65719557637682166874879327798598143881961925499217
71484759148259586125936169723614727183472583829458
28178525553928963666413917477752412858886352396999
57545635726865674683797678579481878968159298917926
57944568656815567976792667818781377892989248891319
75698651748671976285978218739618932984172914319528
56475739656758684176786979528789718163989182927419
67554889357866599146897761125791887223681299833479

The total risk of this path is 315 (the starting position is still never entered, so its risk is not counted).

Using the full map, what is the lowest total risk of any path from the top left to the bottom right?

*/

// ===== BORROWED THIS MinHeap CODE FROM ONE OF MY OTHER REPOS

class MinHeap {

  constructor () {
    this.queue = [];                                            // elements will be in the form of {value: someValue, priority: somePriority}
  }
  
  // ===== UTILITY METHODS =====

  _swap (idxA, idxB) {
    [this.queue[idxA], this.queue[idxB]] = [this.queue[idxB], this.queue[idxA]];
  }

  _parentIdx (childIdx) {
    return Math.floor((childIdx - 1) / 2);
  }

  _childrenIndices (parentIdx) {
    return [2 * parentIdx + 1, 2 * parentIdx + 2];
  }

  // ===== PQ METHODS =====

  peek () {
    return this.queue[0];
  }

  insert (value, priority = value) {

    // FIRST, ADD THE NEW ELEMENT TO THE END OF QUEUE
    this.queue.push({value, priority});

    // NEXT, 'HEAPIFY UP' ('bubble up' the first element in queue until heap is proper)
    let currentNodeIdx = this.queue.length - 1;
    while (currentNodeIdx !== 0 && this.queue[currentNodeIdx].priority < this.queue[this._parentIdx(currentNodeIdx)].priority) {
      this._swap(currentNodeIdx, this._parentIdx(currentNodeIdx));
      currentNodeIdx = this._parentIdx(currentNodeIdx);
    }
    
    return this;                                                // for chaining
  }

  popMin () {

    // EDGE CASES: 0- OR 1-LENGTH HEAP
    if (!this.queue.length) return undefined;
    if (this.queue.length === 1) return this.queue.pop();       // if only one node, just pop it off the queue and return
    
    // FIRST, SAVE THE TOP ELEMENT AND THEN REPLACE IT WITH LAST ELEMENT (AFTER POPPING IT OFF)
    const poppedMin = this.peek();                              // use .peek() to save the top element inside poppedMin, to be returned later
    this.queue[0] = this.queue.pop();                           // replace top of heap with node popped off from end of queue

    // NEXT, 'HEAPIFY DOWN' ('push down' the first element in queue until heap is proper)
    let currentNodeIdx = 0;
    let [left, right] = this._childrenIndices(currentNodeIdx);
    while (left < this.queue.length) {                          // while left child exists...
      let smallestChildIdx = right < this.queue.length && this.queue[right].priority < this.queue[left].priority
        ? right                                                 // ...smallestChildIdx is right if right child exists AND takes priority over left child...
        : left;                                                 // ...otherwise, smallestChildIdx is left
      if (this.queue[smallestChildIdx].priority < this.queue[currentNodeIdx].priority) {    // see if smallest child is smaller than parent
        this._swap(currentNodeIdx, smallestChildIdx);           // swap parent and smaller child
        currentNodeIdx = smallestChildIdx;                      // update currentNodeIdx
        [left, right] = this._childrenIndices(currentNodeIdx);  // update left and right
      } else {
        break;                                                  // if smaller child is not smaller than parent, break out of heapify down
      }
    }

    return poppedMin;                                           // finally, return the stored top element from the beginning
  }
}

function dijkstra (part, inputStr) {
  const inputArr = inputStr.split('\n');

  // INITIALIZE REFERENCE DATA STRUCTURES BASED ON INPUT
  const initH = inputArr.length;
  const initW = inputArr[0].length;
  const H = initH * (part === 1 ? 1 : 5);                                                             // PART 1: just use puzzle input as is; PART 2: input is one "sector" of 5x5
  const W = initW * (part === 1 ? 1 : 5);

  const sectorIncreaseMap = Array(5).fill(0).map((_, i) => Array(5).fill(0).map((_, j) => i + j));    // PART 2: this tracks the amount all risk levels increase by, based on sector
                                                                                                      // [[0, 1, 2, 3, 4],
                                                                                                      //  [1, 2, 3, 4, 5],
                                                                                                      //  [2, 3, 4, 5, 6],
                                                                                                      //  [3, 4, 5, 6, 7],
                                                                                                      //  [4, 5, 6, 7, 8]]

  const riskMap = Array.from({length: H}, () => Array(W))
  for (let sectorR = 0; sectorR < (part === 1 ? 1 : 5); ++sectorR) {                                  // PART 1: you stay in sector 0, 0; PART 2: from sector 0, 0 through 4, 4
    for (let sectorC = 0; sectorC < (part === 1 ? 1 : 5); ++sectorC) {

      const sectorIncrease = sectorIncreaseMap[sectorR][sectorC];                                     // how much the risk levels must increase by in the current sector

      for (let row = 0; row < initH; ++row) {
        for (let col = 0; col < initW; ++col) {
          const trueRow = sectorR * initH + row;
          const trueCol = sectorC * initW + col;
          const riskLevelFromScan = +inputArr[row][col];
          riskMap[trueRow][trueCol] = riskLevelFromScan + sectorIncrease;
          if (riskMap[trueRow][trueCol] > 9) riskMap[trueRow][trueCol] -= 9;                          // risk level is at most 9, and sectorIncrease is at most 8, so subtracting 9 is enough
        }
      }
    }
  }

  // UTILITY
  const inBounds = (row, col) => 0 <= row && row < H && 0 <= col && col < W;
  const dirs = [ [0, +1], [0, -1], [+1, 0], [-1, 0] ];

  // DIJKSTRA'S ALGORITHM
  const visited = Array.from({length: H}, () => Array(W).fill(false));                                // track visited nodes
  const costArr = Array.from({length: H}, () => Array(W).fill(Infinity));                             // track current known costs of reaching each coord (initialize at Infinity)
  costArr[0][0] = 0;                                                                                  // set cost of (0, 0) to 0 because you start there

  const PQ = new MinHeap();                                                                           // PQ nodes: { value: [row, col], priority: costOfTravelingToCoords }
  PQ.insert([0, 0], 0);                                                                               // initialize PQ with node representing starting point

  while (PQ.queue.length) {                                                                           // while PQ is not empty...
    const popped = PQ.popMin();
    const [row, col] = popped.value;
    const cost = popped.priority;
    if (visited[row][col]) continue;                                                                  // guard against visited nodes
    for (const [dy, dx] of dirs) {                                                                    // for all unvisited neighbors...
      if (!inBounds(row + dy, col + dx) || visited[row + dy][col + dx]) continue;                     // (...guard against out of bounds or visited neighbors...)
      const tentative = cost + riskMap[row + dy][col + dx];                                           // ...consider the tentative cost of reaching neighbor through current node...
      if (tentative < costArr[row + dy][col + dx]) {                                                  // ...if that tentative cost beats the current known lowest cost...
        costArr[row + dy][col + dx] = tentative;                                                      // ...then update that cost...
        PQ.insert([row + dy, col + dx], tentative);                                                   // ...and insert that neighbor into the PQ with new cost
      }
    }
    visited[row][col] = true;                                                                         // finally, mark this node as visited
  }

  return costArr[H - 1][W - 1];                                                                       // we are looking for the cost of the bottom right cell
}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = dijkstra;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

const actualInput = `1124751783612228519483416186391693192764152281421133194141163183224351733212394799536339411529842112
1299938854391228215712461147511117912185733411491416388811646391912138661213722223824151532652174491
3339197559983134739317425934547716331696227221882122961476799987711635499267472178182145359213635923
3275111279884782539314241187762113814171394161491634629424134127254634143155261122133724143114517171
3719252118791433135122231855197812222238914994648147192141951214948299478914959275216261881654181459
1611117951314292139456114142392662772939225937136486428161234281216234329234315111776511563151948482
2568826483341639224876553822412669632282339258375519267395999314194775717338955473111882125281113119
3211535497996954958315977618271374429983722314139733843419727946959246752499319415154271225547899217
9182381814515842193317619241122295417132515941811977373112934221316141138111911121121111793678163186
3844189817214722127981149242928145957137126937131386516329118218111198674162815191994371914762733967
2341991198198671797918854491942998311516141218456591158159195192211227471918835699934872448189793938
4914562622368117861639397331397217328431182986624263992197435816915439591962133158497224891382954532
7626651214813838216185911429272999894518636231382989678893369367388711391734813452975811156327428911
6619547343521975253174481211413831293662121339851815212317311237391545399111182897667911821424149598
9973191187241313192815214227191649743296915314888729322114168515823743777711899119191553298115729119
1139287494922611751257731929722771498336139611251121442114394245137973342111145499332316959261235284
2957197428427162517942347211164151149912112158641321995248419171621811597221619949431227171998811472
3942647388316719894411111531921126183713231811198382654685441319271454138942281133619242611612293827
7937119217256311112391437861121498616811956123353462521891125694135126297129995285155114368995531781
3451961913122271833382989211151286596622992323752134162138122516383189222433812253226845819142198221
2778119153629891339923532321818124533756116181684147179833125112111826952511175359231299984985971323
3111241849191534385261731569341927433476113958471723118832747854529179328115274125434719722218912131
3142339531392581988128137411211196234548128214999949588185228836196627923352221497911291281534111199
2247331434479875142918842833898559624238445292211715118881294135283574749565172271411631413491566199
5942278576394177315387294721122691617961774138211922471397191215938266718124567292193989959261637132
3165937631221963265792414421441393495719931248192344794567976762321141859115829128661211272472736862
6245216271127518123199222191484234611151315582117171596574729739922992724612599562343116361844622764
8113544322656226212151951279235114941989556194198115559251582213981835589429635885493383187341531965
9167334539972119189967382996641594933763662148772253141953186111414742999511119411388291132416516449
3613823811913288411123382135529243111267199921121439155729919326116169791514491996989971122517181152
8673611192477161631212112481894911858892968239143914865319658975331149334747126743512225484277694151
1573562476555619452428261559215411721579288335558515411134313992163812836653437129992833619198146362
1985275213511588337218921661953495211191671194622531866114745941231929893241192939732541431596251229
1265136118282217612545222191931962743537199362634214512441818421145212152171522295123221817416511192
8297798221482948311881157477219864767525628534952929138168821168196211119111519681828383199111919196
2534111997313111473186996839118152776719511994169115192212165984228917912783244345623614586619121326
5841498181267192895193154811932281737529524821838531213993721717189699211939288511893237393416182963
4291365191619323711913413926441339411267931111249294286234263722174939997111633217333235111582923441
1287162672582123747413148471918114922719181577167138269131143162782619895168443398922587114315692159
1265925622411611266789112299971891313715613359912627191225939742625214121139321211686759611131173819
2138953588999163543822384688714958315246965691333881631171314291246656696539111996811849918124146199
1246641611311144149732152211911939355725818779248359199268117115556131393567479697235189376137881341
2899323821125691382122622121279464139996512843263627599964991689326381239953514685697311811566519319
2736949532739218813892326217621918912123391961114292438971239114718244292915281445924621121161621333
3284227711481113791259114169152546556372395121491214478676766673451539272714243257528999117191132191
1491645992221246232691159831148693751711539199173418148515113374123227919399121713163369423119344294
9132112419279766149552388219119879126631964411873291514292382629182256527396923261916197289667422219
4435263531452645499818123111966429163563711994892138163281911392712947829833494132517185151159797235
3377999473376535692397871161267942211991447319627223732643859136911321291147933161219919912554143594
3949323991733462336411199416212721417161994737197381813716349241925143828318311249159179991229329171
1762136928289612837322111798838212828232194159395467913129898285979511558911359718111211715278482292
1118257643855683112121972927223668654922187717441698273158822189761169916992651219511457913769191141
1658133214212128183392871646163111119424394424612113962259435119311183885137744192432918197134375132
3591713174418138371811543613511348758114531127679321532212958111147949196891591688991927112311822659
1236514266615278952886111333113128112861958723136379141934411821192618183131222512832888648251713999
8123213361595969218132551112914729944243931512311795497816271296492513311341682399128274945195119112
2462825227696446183996491353919233459561152451155132169141431681617413626542619881461141223688519198
9621989515111471113381577698758628164221411666452251895517161458991756482464135232192737151721333241
1845633941916891433521922233371928968912324239271162428588753196413672815131973146761647212761387593
1213191632931181293214711139975148754136566435292974252811697693911887328591189183554433169371667213
4519131126388191338914531223891121466796183273431621945951424794146112514299112124121572531131372111
1331344969619935133794416261913442341424183712193444133541852317113515211181326734947129151289182833
1355758512615534971555911998128211268588155773916181718217932133414645114253821929111112911181223396
1921812718591189155234925136611421141621741789512111114849236968196293982164297416554297277314296498
2925818269222199331695127966441449818292484293218699694191219141796929886179788888289778893154112915
7349332956191336793938825411116431794116518627151175184126599498959181846349128914531693382871224114
2975711544499872811921879322745419629143299769241363453113298718372441111116129736331374245812629681
2419398835867978148157517197312837563211153716146118174293922233694112229384117648726494771916746336
2322473321962284111112435812293374144731592114895311931296931978723998962913118278111921783414789472
7421933294181593157278951313456166911311561151111468883991937345182554571275781533927232981213941792
1668835358177241114335636733193482471442299199859434499861711136613117473328576171139593142184617345
5339642815719926226879311379167325793396941892597215179614941121636812111539912741116971188971946499
7581333191573246312732795518731212368211299298495989164122116531125184283943222911391615243311251361
9492966914243222969499792183412424152773224381646928911135496174621299924524112331962952547214129323
2729194232211462151119459711313211822621531163797412446181172721913949189555142143791213834886518948
2754215791553781642269915399358262512494443343121198134218639979927842122994421127962456193396136699
8271611911227341219949383285981988595252121593129637541475392137413899839912239225135459931743267972
1332131171959982211855642861212718138325111114239233279171544919563891942832117949581464743292494391
5144166291493181763279457131141327146537961189933599395341461291371919123151359118199368625742376117
1636191619675379923419873222911119821251129276117414194193998142948136713325351617571519395951914216
6863238911796142259595658671251783127926389189168272138182549591741951937121824471372228139189226966
1398611275788896954682838421735924943417195641181143853286733633811931911189111341679192676374118319
7425912442414194918974222966129621141925526265112323617731363617133673511925955331462169117293471296
8311915233126172592295451734596934578641991127992454954549337724839691119685881916643781992923996572
7168461267393883112656311283191232322499117185912521188899182419918914911212513325386275539329721472
4418929132119621184239621272934448319225211997924183117861911136919317465941177911127948161449124731
9271153581452542386794695144559617972331134217961265186239771199325391879412411821372724989746391111
3752522113112162859371199119415298331514424128999524132149996846199915924629121214916277199845231181
8461129155427192357991128752552628161188794894374724397322312139214838121389889613819783991892292158
4999141138619713275215481369646529918918936887478711111135124192624311852137911719581517593373711112
9228956819912994881488113276489314945969876898139152128325918347915249723837311238669717631918756448
1272313111232619631582529173782417217912411245971957172218911853664936489571219898133821585115925152
1324983253974657485632276593196749111921819449973115611494598217724911344731933114417612111528118291
8521515271325847484517496514692991413334913117194153459926716822674627611191634943962214123151399931
1141639315518932691635973515217951611118329247113938399181114133617465682162932426295992195929458883
8229351197214731215324515139273121165384915712119675514893281751526119183679227515364941156137548174
6116894132781317191382191142114151317798773795981911112434921641114411589131331717998932176521898319
5362677393912312215419378899211815319464811111851912257961211293814411559971191515896993251933358962
6926527339383986515331739126963132928923957918814875739969162479336291216879152811764569629328261149
7598541186247351172883789213137911264491891391569216562276119911413437411237411934123311912324427449`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 40;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 429;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 315;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 2844;
test(func, input, expected, testNum, lowestTest, highestTest);