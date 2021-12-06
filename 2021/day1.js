/*

--- Day 1: Sonar Sweep ---

You're minding your own business on a ship at sea when the overboard alarm goes off! You rush to see if you can help. Apparently, one of the Elves tripped and accidentally sent the sleigh keys flying into the ocean!

Before you know it, you're inside a submarine the Elves keep ready for situations like this. It's covered in Christmas lights (because of course it is), and it even has an experimental antenna that should be able to track the keys if you can boost its signal strength high enough; there's a little meter that indicates the antenna's signal strength by displaying 0-50 stars.

Your instincts tell you that in order to save Christmas, you'll need to get all fifty stars by December 25th.

Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

As the submarine drops below the surface of the ocean, it automatically performs a sonar sweep of the nearby sea floor. On a small screen, the sonar sweep report (your puzzle input) appears: each line is a measurement of the sea floor depth as the sweep looks further and further away from the submarine.

For example, suppose you had the following report:

199
200
208
210
200
207
240
269
260
263
This report indicates that, scanning outward from the submarine, the sonar sweep found depths of 199, 200, 208, 210, and so on.

The first order of business is to figure out how quickly the depth increases, just so you know what you're dealing with - you never know if the keys will get carried into deeper water by an ocean current or a fish or something.

To do this, count the number of times a depth measurement increases from the previous measurement. (There is no measurement before the first measurement.) In the example above, the changes are as follows:

199 (N/A - no previous measurement)
200 (increased)
208 (increased)
210 (increased)
200 (decreased)
207 (increased)
240 (increased)
269 (increased)
260 (decreased)
263 (increased)
In this example, there are 7 measurements that are larger than the previous measurement.

How many measurements are larger than the previous measurement?


--- Part Two ---

Considering every single measurement isn't as useful as you expected: there's just too much noise in the data.

Instead, consider sums of a three-measurement sliding window. Again considering the above example:

199  A      
200  A B    
208  A B C  
210    B C D
200  E   C D
207  E F   D
240  E F G  
269    F G H
260      G H
263        H
Start by comparing the first and second three-measurement windows. The measurements in the first window are marked A (199, 200, 208); their sum is 199 + 200 + 208 = 607. The second window is marked B (200, 208, 210); its sum is 618. The sum of measurements in the second window is larger than the sum of the first, so this first comparison increased.

Your goal now is to count the number of times the sum of measurements in this sliding window increases from the previous sum. So, compare A with B, then compare B with C, then C with D, and so on. Stop when there aren't enough measurements left to create a new three-measurement sum.

In the above example, the sum of each three-measurement window is as follows:

A: 607 (N/A - no previous sum)
B: 618 (increased)
C: 618 (no change)
D: 617 (decreased)
E: 647 (increased)
F: 716 (increased)
G: 769 (increased)
H: 792 (increased)
In this example, there are 5 sums that are larger than the previous sum.

Consider sums of a three-measurement sliding window. How many sums are larger than the previous sum?

*/

function slidingWindow (part, inputStr) {
  const inputArr = inputStr.split('\n').map(n => +n);

  const windowSize = part === 1 ? 1 : 3;
  let count = 0;
  let currWindowTotal = inputArr.slice(0, windowSize).reduce((sum, curr) => sum + curr);
  for (let i = windowSize; i < inputArr.length; ++i) {
    const prev = currWindowTotal;
    currWindowTotal += inputArr[i] - inputArr[i - windowSize];
    if (currWindowTotal > prev) ++count;
  }
  return count;

}

// TEST CASES

const test = require('./_test');
const testNum = [1];
let input, expected;
const func = slidingWindow;
const sortedFunc = (...args) => func(...args).sort();                   // used when the order of the output does not matter
const modFunc = (...args) => func(...args) % 1000000007;                // used when the output is very large
const lowestTest = 0 || 0;
const highestTest = 0 || Infinity;

const sampleInput = `199
200
208
210
200
207
240
269
260
263`;

const actualInput = `180
152
159
171
178
169
212
213
214
222
228
215
228
240
248
220
224
201
212
218
217
225
218
255
256
260
261
262
263
254
255
261
270
248
252
258
259
243
242
240
233
241
250
256
258
256
258
261
263
274
262
248
265
266
276
279
273
274
273
275
280
281
282
284
285
286
289
294
310
313
318
327
342
346
358
378
386
391
377
378
381
378
377
369
372
375
368
377
354
319
314
337
338
351
356
361
345
346
337
338
339
365
370
368
383
384
399
416
417
422
427
431
434
438
439
440
438
437
439
444
446
449
461
489
483
466
471
472
474
478
476
481
482
483
485
510
512
519
525
539
562
576
583
587
607
605
601
616
615
630
635
638
643
644
642
652
662
661
687
683
682
701
710
712
721
722
719
726
734
729
728
752
754
758
765
764
765
766
781
790
798
799
801
802
801
802
830
831
832
844
858
850
847
846
853
854
853
859
855
856
858
848
880
859
866
867
865
868
878
877
878
883
894
900
909
912
896
897
885
886
885
893
901
903
900
896
904
912
914
905
904
912
925
924
935
949
950
947
949
950
946
948
947
946
944
941
974
982
981
1005
1006
1003
1019
1020
1019
1033
1034
1035
1046
1049
1043
1054
1060
1059
1062
1065
1066
1071
1078
1080
1081
1085
1090
1091
1094
1099
1117
1119
1120
1126
1128
1126
1143
1145
1140
1144
1137
1110
1121
1119
1120
1121
1125
1116
1118
1116
1105
1106
1107
1105
1098
1099
1124
1129
1139
1143
1144
1145
1148
1149
1155
1174
1175
1178
1174
1182
1183
1190
1192
1190
1191
1192
1201
1202
1197
1200
1201
1230
1232
1250
1251
1257
1274
1290
1320
1319
1326
1328
1349
1341
1345
1355
1353
1356
1359
1368
1370
1387
1385
1402
1413
1416
1417
1422
1421
1420
1413
1420
1421
1422
1416
1425
1431
1433
1434
1436
1434
1440
1458
1459
1464
1466
1475
1477
1500
1502
1504
1492
1491
1495
1497
1504
1519
1516
1523
1527
1528
1538
1543
1544
1548
1549
1556
1557
1566
1564
1565
1566
1572
1583
1580
1579
1599
1603
1615
1616
1615
1618
1622
1619
1630
1629
1630
1629
1632
1635
1636
1638
1635
1634
1646
1649
1651
1649
1650
1648
1659
1686
1696
1694
1699
1700
1709
1703
1702
1703
1712
1716
1717
1718
1705
1706
1709
1713
1725
1724
1750
1751
1754
1752
1745
1744
1750
1751
1763
1764
1762
1763
1769
1747
1746
1737
1735
1736
1735
1732
1733
1736
1737
1742
1748
1754
1755
1736
1742
1735
1737
1755
1764
1762
1778
1793
1815
1826
1830
1831
1836
1860
1858
1831
1832
1833
1832
1836
1850
1851
1863
1865
1867
1868
1875
1895
1894
1895
1901
1906
1938
1967
1960
1961
1963
1952
1958
1960
1962
1960
1962
1955
1963
1957
1956
1959
1960
1954
1955
1954
1986
1985
2013
2011
2012
2034
2038
2041
2043
2044
2045
2050
2051
2061
2059
2057
2064
2083
2079
2084
2075
2079
2082
2119
2139
2147
2151
2152
2148
2149
2152
2155
2161
2162
2185
2196
2200
2202
2213
2214
2215
2207
2204
2208
2209
2211
2205
2206
2235
2255
2261
2274
2275
2280
2281
2288
2299
2300
2301
2302
2290
2309
2323
2324
2329
2331
2330
2317
2318
2315
2302
2305
2311
2316
2321
2323
2332
2331
2350
2342
2351
2352
2356
2362
2393
2400
2401
2405
2421
2423
2445
2441
2449
2451
2454
2458
2466
2463
2471
2477
2478
2474
2473
2475
2473
2471
2472
2483
2486
2489
2502
2503
2504
2516
2520
2523
2527
2526
2530
2531
2532
2536
2528
2535
2542
2553
2556
2560
2564
2549
2542
2544
2580
2581
2576
2602
2601
2605
2629
2628
2629
2628
2629
2631
2632
2624
2623
2632
2641
2642
2651
2661
2676
2706
2716
2729
2736
2737
2733
2734
2740
2731
2739
2734
2733
2732
2733
2735
2706
2709
2715
2713
2716
2718
2726
2728
2742
2730
2731
2733
2736
2761
2764
2771
2772
2773
2781
2782
2785
2791
2793
2796
2797
2798
2805
2806
2811
2820
2818
2816
2817
2818
2806
2815
2819
2824
2829
2833
2834
2825
2835
2837
2833
2831
2833
2827
2833
2848
2846
2843
2844
2845
2847
2857
2855
2875
2877
2879
2882
2891
2894
2897
2899
2901
2912
2917
2927
2928
2921
2922
2930
2931
2932
2933
2949
2951
2947
2953
2930
2913
2930
2931
2930
2932
2939
2937
2939
2950
2951
2953
2964
2969
2979
2981
2980
2983
2986
2993
2994
2982
2985
2986
2984
2964
2987
2986
2988
2997
2998
3005
3017
3034
3037
3038
3042
3045
3056
3057
3063
3069
3060
3059
3060
3064
3066
3056
3060
3062
3077
3078
3079
3067
3051
3052
3051
3050
3055
3058
3060
3079
3098
3099
3089
3113
3116
3115
3126
3110
3093
3105
3116
3123
3126
3135
3137
3139
3157
3159
3192
3193
3194
3192
3202
3207
3215
3219
3221
3222
3223
3228
3222
3223
3246
3256
3262
3248
3252
3254
3255
3256
3257
3259
3260
3266
3262
3251
3252
3262
3268
3267
3270
3266
3275
3274
3256
3257
3259
3262
3265
3266
3270
3273
3239
3252
3263
3291
3294
3310
3317
3359
3360
3359
3360
3361
3366
3369
3374
3378
3376
3389
3391
3405
3418
3448
3455
3461
3476
3485
3488
3491
3492
3495
3496
3497
3502
3504
3507
3519
3544
3546
3547
3548
3549
3550
3547
3556
3563
3572
3577
3578
3585
3593
3597
3598
3602
3597
3611
3590
3602
3591
3592
3585
3586
3578
3588
3589
3590
3596
3594
3606
3602
3618
3619
3613
3619
3597
3596
3605
3606
3607
3610
3612
3625
3655
3657
3652
3654
3660
3662
3664
3684
3685
3664
3667
3673
3674
3697
3693
3694
3697
3692
3694
3697
3695
3717
3731
3730
3728
3730
3735
3740
3738
3767
3775
3776
3777
3779
3783
3789
3791
3793
3794
3799
3800
3801
3792
3798
3800
3804
3778
3777
3782
3790
3792
3793
3816
3812
3853
3860
3881
3886
3888
3889
3896
3899
3907
3900
3905
3922
3924
3940
3941
3942
3930
3927
3928
3933
3944
3943
3956
3966
3968
3972
3979
3980
3982
3983
3989
4010
4007
4008
4019
4022
4020
4011
4013
4018
4029
4033
4037
4038
4024
4026
4014
4015
4047
4064
4065
4063
4065
4072
4081
4082
4093
4094
4099
4102
4101
4100
4101
4111
4115
4116
4125
4139
4144
4145
4129
4127
4128
4129
4130
4133
4148
4157
4173
4174
4171
4174
4175
4181
4194
4199
4201
4202
4207
4208
4209
4210
4222
4245
4243
4242
4252
4255
4258
4271
4288
4294
4295
4297
4291
4292
4304
4301
4307
4310
4309
4322
4324
4325
4334
4337
4332
4342
4345
4359
4356
4378
4380
4381
4387
4401
4405
4409
4408
4430
4419
4423
4429
4434
4442
4469
4476
4478
4519
4520
4521
4508
4514
4510
4513
4515
4516
4518
4524
4523
4514
4518
4520
4534
4537
4538
4545
4546
4543
4551
4566
4569
4570
4586
4582
4600
4599
4592
4617
4621
4648
4650
4654
4646
4647
4660
4663
4668
4679
4684
4693
4695
4696
4702
4701
4684
4708
4694
4695
4696
4723
4734
4733
4736
4732
4740
4736
4742
4744
4754
4756
4751
4755
4757
4743
4738
4739
4758
4763
4772
4774
4775
4782
4799
4808
4825
4836
4839
4840
4843
4838
4839
4858
4865
4857
4858
4855
4858
4884
4889
4895
4894
4902
4931
4933
4934
4935
4937
4938
4953
4956
4959
4948
4951
4960
4954
4967
4971
4967
4974
4975
4967
4966
4962
4963
4964
4967
4969
4968
4974
4994
4995
4981
4986
4991
4998
4999
5004
5011
5002
4997
4989
4990
4997
4993
5008
5019
5024
5027
5029
5038
5039
5022
5013
5014
5000
5002
5003
5004
5003
5011
5020
5023
5028
5037
5063
5059
5078
5079
5080
5081
5078
5081
5082
5087
5088
5089
5107
5125
5131
5142
5129
5124
5127
5130
5146
5149
5154
5155
5156
5155
5175
5174
5186
5192
5201
5209
5208
5213
5214
5213
5216
5218
5211
5202
5220
5226
5225
5233
5220
5221
5218
5215
5220
5223
5227
5231
5228
5230
5231
5232
5236
5215
5222
5224
5241
5252
5262
5273
5274
5282
5283
5279
5283
5289
5290
5294
5296
5297
5316
5314
5319
5301
5302
5279
5280
5278
5292
5293
5294
5298
5303
5316
5317
5318
5324
5333
5335
5336
5349
5352
5355
5375
5377
5378
5367
5365
5366
5387
5379
5385
5392
5394
5395
5382
5387
5386
5390
5385
5400
5409
5392
5390
5377
5363
5352
5353
5359
5376
5373
5370
5373
5377
5382
5395
5405
5438
5449
5464
5465
5468
5466
5469
5454
5462
5477
5475
5477
5478
5465
5466
5487
5464
5474
5479
5498
5499
5503
5518
5520
5523
5534
5550
5552
5576
5580
5571
5574
5587
5582
5565
5568
5569
5576
5577
5582
5595
5594
5604
5587
5586
5587
5591
5594
5596
5600
5604
5606
5614
5615
5614
5616
5620
5612
5630
5629
5636
5639
5640
5641
5611
5610
5613
5596
5597
5598
5599
5601
5621
5628
5629
5631
5634
5647
5646
5623
5632
5638
5649
5646
5648
5670
5701
5708
5724
5723
5728
5762
5779
5774
5777
5797
5806
5817
5814
5819
5844
5845
5844
5847
5849
5850
5860
5861
5858
5860
5874
5899
5900
5902
5903
5904
5908
5926
5928
5929
5930
5918
5924
5925
5927
5929
5908
5912
5925
5930
5927
5928
5926
5937
5938
5940
5939
5951
5954
5957
5960
5961
5969
5970
5971
5972
5983
5993
6009
6019
6012
5993
6015
6006
6020
6021
6009
6020
6021
6031
6033
6036
6039
6038
6062
6068
6069
6068
6075
6093
6096
6100
6116
6127
6134
6136
6138
6154
6155
6156
6154
6150
6151
6145
6151
6152
6147
6166
6164
6174
6185
6186
6195
6172
6194
6217
6226
6224
6245
6251
6252
6262
6266
6270
6271
6276
6282
6300
6301
6302
6300
6319
6328
6329
6330
6341
6346
6351
6352
6366
6365
6371
6372
6380
6377
6389
6399
6379
6380
6382
6381
6380
6384
6385
6399
6400
6396
6397
6405
6415
6402
6403
6414
6406
6399
6390
6407
6409
6390
6384
6386
6379
6381
6388
6401
6404
6397
6421
6431
6434
6438
6447
6446
6447
6448
6457
6463
6473
6476
6483
6488
6486
6483
6487
6491
6488
6455
6471
6475
6478
6498
6499
6500
6501
6494
6486
6487
6484
6501
6497
6499
6502
6504
6505
6509
6525
6524
6523
6543
6547
6546
6536
6552
6554
6562
6560
6589
6591
6609
6608
6604
6605
6594
6608
6611
6610
6611
6621
6607
6612
6613
6623
6628
6631
6642
6663
6654
6647
6640
6636
6635
6641
6646
6645
6646
6647
6654
6655
6656
6668
6669
6679
6675
6687
6685
6687
6716
6717
6722
6730
6729
6732
6735
6736
6748
6759
6758
6757
6780
6781
6784
6794
6796
6811
6817
6818
6819
6820
6821
6823
6812
6811
6837
6839
6842
6844
6842
6841
6852
6853
6856
6855
6865
6875
6876
6898
6904
6906
6910
6914
6915
6905
6890
6896
6894
6891
6899
6904
6909
6927
6928
6938
6935
6936
6937
6946
6949
6963
6966
6975
6976
6977
6973
6974
6980
6984
7014
6993
7004
7005
7013
7016
7014
7018
7029
7030
7031
7038
7039
7056
7079
7081
7085
7103
7105
7098
7101
7102
7106
7111
7112
7114
7101
7107
7117
7085
7093
7091
7119
7115
7126
7130
7129
7139
7142
7147
7169
7160
7171
7187
7188
7189
7188
7190
7194
7197
7212
7220
7228
7227
7223
7225
7236
7237
7241
7243
7246
7252
7280
7279
7294
7295
7298
7300
7289
7291
7290
7288
7289
7291
7290
7295
7294
7275
7278
7290
7295
7302
7304
7309
7308
7321
7325
7328
7346
7338
7340
7354
7361
7368
7391
7415
7426
7428
7429
7422
7423
7425
7426
7429
7431
7442
7440
7443
7457
7458
7457
7464
7474
7477
7469
7467
7471
7479
7480
7485
7482
7483
7484
7488
7497`;

// Test case 1
input = {
  part: 1,
  inputStr: sampleInput,
};
expected = 7;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 2
input = {
  part: 1,
  inputStr: actualInput,
};
expected = 1529;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 3
input = {
  part: 2,
  inputStr: sampleInput,
};
expected = 5;
test(func, input, expected, testNum, lowestTest, highestTest);

// Test case 4
input = {
  part: 2,
  inputStr: actualInput,
};
expected = 1567;
test(func, input, expected, testNum, lowestTest, highestTest);