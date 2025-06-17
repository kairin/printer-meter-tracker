
import { Printer, PrinterType, MeterReading } from '../types';

// Original CSV for device setup
const devicesCsvDataString = `SN,BW Rate,FC Rate,Device Location,Device Model,Device Serial #,last reading (BW),current reading (BW),Chargeable (BW),last reading (FC),current reading (FC),Chargeable (FC),Unit Price (BW),Unit Price (FC),Amount (BW),Amount (FC),Amount (Before GST)
1,0.0025,0,Block 6 Level 5 School of Engineering (SOE) ,TASKalfa 5004i ,W7F3701780,60636,66393,5757,,,0,14.3925,0,14.39,,14.39
2,0.0025,0,Block 6 Level 5 School of Engineering (SOE) ,TASKalfa 5004i ,W7F3701713,36081,41277,5196,,,0,12.99,0,12.99,,12.99
3,0.0025,0,Block 6 Level 3 School of Business (PE) ,TASKalfa 5004i ,W7F3601615,42005,45381,3376,,,0,8.44,0,8.44,,8.44
4,0.0025,0,Block 6 Level 5 School of Engineering (SOE) ,TASKalfa 5004i ,W7F3601610,47727,53793,6066,,,0,15.165,0,15.17,,15.17
5,0.0025,0,Block 5 Level 5 School of Electronics & ICT (SEIT) ,TASKalfa 5004i ,W7F3601570,83190,87950,4760,,,0,11.9,0,11.9,,11.9
6,0.0025,0,Block 4 Level 4 School of Business (Lifeskills) ,TASKalfa 5004i ,W7F3601568,118980,130591,11611,,,0,29.0275,0,29.03,,29.03
7,0.0025,0,Block 5 Level 5 School of Electronics & ICT (SEIT) ,TASKalfa 5004i ,W7F3601564,69049,73185,4136,,,0,10.34,0,10.34,,10.34
8,0.0025,0,Block 5 Level 5 School of Electronics & ICT (SEIT) ,TASKalfa 5004i ,W7F3601563,21023,22754,1731,,,0,4.3275,0,4.33,,4.33
9,0.0025,0,Block 6 Level 5 School of Engineering (SOE) ,TASKalfa 5004i ,W7F3601558,100392,111622,11230,,,0,28.075,0,28.08,,28.08
10,0.0025,0,Block 5 Level 5 School of Electronics & ICT (SEIT) ,TASKalfa 5004i ,W7F3601555,53675,58051,4376,,,0,10.94,0,10.94,,10.94
11,0.0025,0,Block 5 Level 5 School of Electronics & ICT (SEIT) ,TASKalfa 5004i ,W7F3601552,69510,76129,6619,,,0,16.5475,0,16.55,,16.55
12,0.0025,0,Block 6 Level 5 School of Engineering (SOE) ,TASKalfa 5004i ,W7F3601550,33866,37758,3892,,,0,9.73,0,9.73,,9.73
13,0.0025,0,Block 4 Level 5 School of Business (Trade) ,TASKalfa 5004i ,W7F3501460,92422,96984,4562,,,0,11.405,0,11.41,,11.41
14,0.0025,0,Block 4 Level 5 School of Business (Trade) ,TASKalfa 5004i ,W7F3501425,58096,65762,7666,,,0,19.165,0,19.17,,19.17
15,0.0025,0,Block 3 Level 7 School of Hospitality (SOH) ,TASKalfa 5004i ,W7F3501405,97885,104559,6674,,,0,16.685,0,16.69,,16.69
16,0.0025,0,Block 4 Level 5 School of Business (Trade) ,TASKalfa 5004i ,W7F3501401,124014,135157,11143,,,0,27.8575,0,27.86,,27.86
17,0.0025,0,Block 3 Level 8 School of Engineering (FME) ,TASKalfa 5004i ,W7F3501399,129434,141128,11694,,,0,29.235,0,29.24,,29.24
18,0.0025,0,Block 3 Level 7 School of Hospitality (SOH) ,TASKalfa 5004i ,W7F3501393,64367,67666,3299,,,0,8.2475,0,8.25,,8.25
19.0,0.0058,0.02,Block 3 Level 8 College Administration Services (CAS) ,TASKalfa 5054ci ,W793601403,2279.0,2486.0,207.0,8818.0,10705.0,1887.0,1.2006,37.74,1.2,37.74,38.940000000000005
20.0,0.0058,0.02,Block 3 Level 9 (P Office) ,TASKalfa 5054ci ,W793601330,607.0,656.0,49.0,3530.0,3734.0,204.0,0.2842,4.08,0.28,4.08,4.36
21.0,0.0058,0.02,Block 6 Level 5 School of Engineering (SOE SH Room) ,TASKalfa 5054ci ,W793601285,9172.0,9645.0,473.0,13188.0,14310.0,1122.0,2.7434,22.44,2.74,22.44,25.18
22.0,0.0058,0.02,Block 3 Level 7 School of Hospitality (SOH) ,TASKalfa 5054ci ,W792Y00917,8688.0,9423.0,735.0,17638.0,18760.0,1122.0,4.263,22.44,4.26,22.44,26.700000000000003
23.0,0.0058,0.02,"Block 3 Level 3 Student Development (SDV, ASC) ",TASKalfa 5054ci ,W792Y00913,8033.0,10307.0,2274.0,41373.0,44474.0,3101.0,13.1892,62.02,13.19,62.02,75.21
24.0,0.0058,0.02,Block 2 Level 2 Customer Visitor Centre (CVC) ,TASKalfa 5054ci ,W792Y00912,11604.0,11980.0,376.0,16900.0,18040.0,1140.0,2.1808,22.8,2.18,22.8,24.98
25.0,0.0058,0.02,Block 3 Level 5 Library@West ,TASKalfa 5054ci ,W792Y00901,3707.0,3920.0,213.0,8989.0,9211.0,222.0,1.2353999999999998,4.44,1.24,4.44,5.680000000000001
26.0,0.0058,0.02,Block 3 Level 6 Student Care (SCR) ,TASKalfa 5054ci ,W792Y00900,12954.0,13282.0,328.0,17497.0,18241.0,744.0,1.9024,14.88,1.9,14.88,16.78
27.0,0.0058,0.02,Block 3 Level 2 Student Services (SSV) ,TASKalfa 5054ci ,W792300234,20781.0,22253.0,1472.0,24567.0,28513.0,3946.0,8.5376,78.92,8.54,78.92,87.46`;

// Invoice CSV for specific colour printer readings (previously called invoicesCsvDataString)
const colourInvoiceCsvDataString = `SN,Serial,Invoice number,Serial Number,Invoice Number,Date of Bill,Counters by duplex (Total),Charges indicated in Bill,GST,BW last,BW current,Chargeable BW,Colour Last,Colour current,Chargeable Color,Rate BW,Rate Color,Validate Charge by calculation,Cents to Dollar
9,W792300234,1634305830,27/11/2024,2905,49.89,4.49,22253,22831,578,28513,30840,2327,0.58,2,4989.24,49.8924,49.89,0
19,W792300234,1634311924,17/1/2025,4765,68.36,6.15,22831,24728,1897,30840,33708,2868,0.58,2,6836.26,68.3626,68.36,0
3027,W792300234,1634315723,21/2/2025,14613,139.06,12.52,24728,35517,10789,33708,37532,3824,0.58,2,13905.62,139.0562,135.99,-3.07
1,W792Y00900,1634305729,27/11/2024,602,10.08,0.91,13282,13420,138,18241,18705,464,0.58,2,1008.04,10.0804,10.08,0
12,W792Y00900,1634311896,17/1/2025,3156,41.56,3.74,13420,14938,1518,18705,20343,1638,0.58,2,4156.44,41.5644,41.56,0
3020,W792Y00900,1634315694,21/2/2025,982,11.72,1.05,14938,15496,558,20343,20767,424,0.58,2,1171.64,11.7164,11.72,0
3,W792Y00901,1634305737,27/11/2024,468,8.81,0.79,3920,3959,39,9211,9640,429,0.58,2,880.62,8.8062,8.81,0
14,W792Y00901,1634311914,17/1/2025,860,12.22,1.1,3959,4310,351,9640,10149,509,0.58,2,1221.58,12.2158,12.22,0
3024,W792Y00901,1634315715,21/2/2025,866,15.47,1.39,4310,4440,130,10149,10885,736,0.58,2,1547.4,15.474,15.47,0
5,W792Y00912,1634305739,27/11/2024,441,7.61,0.68,11980,12065,85,18040,18396,356,0.58,2,761.3,7.613,7.61,0
16,W792Y00912,1634311916,17/1/2025,5750,70,6.3,12065,15234,3169,18396,20977,2581,0.58,2,7000.02,70.0002,70,0
3028,W792Y00912,0,"Wednesday, 12 February 2025 12:00 am",1477,0,0,15234,16141,907,20977,21547,570,0.58,2,1666.06,16.6606,16.66,16.66
4,W792Y00913,1634305738,27/11/2024,3716,53.74,4.84,10307,11756,1449,44474,46741,2267,0.58,2,5374.42,53.7442,53.74,0
15,W792Y00913,1634311915,17/1/2025,9356,146.27,13.16,11756,14633,2877,46741,53220,6479,0.58,2,14626.66,146.2666,146.27,0
3025,W792Y00913,1634315716,21/2/2025,6589,93.41,8.41,14633,17335,2702,53220,57107,3887,0.58,2,9341.16,93.4116,93.41,0
2,W792Y00917,1634305736,27/11/2024,1233,22.52,2.03,9423,9574,151,18760,19842,1082,0.58,2,2251.58,22.5158,22.52,0
13,W792Y00917,1634311898,17/1/2025,3155,52.61,4.73,9574,10313,739,19842,22258,2416,0.58,2,5260.62,52.6062,52.61,0
3026,W792Y00917,1634315719,21/2/2025,1488,25.84,2.33,10313,10589,276,22258,23470,1212,0.58,2,2584.08,25.8408,27.18,1.34
10,W793601285,1634305750,27/11/2024,1308,19.9,1.79,9645,10086,441,14310,15177,867,0.58,2,1989.78,19.8978,19.9,0
20,W793601285,1634311922,17/1/2025,2186,25.08,2.26,10086,11399,1313,15177,16050,873,0.58,2,2507.54,25.0754,25.08,0
3023,W793601285,1634315713,21/2/2025,1515,22.77,2.05,11399,11929,530,16050,17035,985,0.58,2,2277.4,22.774,22.77,0
7,W793601330,1634305754,27/11/2024,202,3.39,0.31,656,702,46,3734,3890,156,0.58,2,338.68,3.3868,3.39,0
18,W793601330,1634311921,17/1/2025,1676,32.13,2.89,702,800,98,3890,5468,1578,0.58,2,3212.84,32.1284,32.13,0
3022,W793601330,1634315709,21/2/2025,968,17.81,1.6,800,909,109,5468,6327,859,0.58,2,1781.22,17.8122,17.81,0
8,W793601403,1634305755,27/11/2024,917,17.32,1.56,2486,2558,72,10705,11550,845,0.58,2,1731.76,17.3176,17.32,0
17,W793601403,1634311920,17/1/2025,663,10.39,0.94,2558,2760,202,11550,12011,461,0.58,2,1039.16,10.3916,10.39,0
3021,W793601403,1634315697,21/2/2025,3467,65.25,5.87,2760,3048,288,12011,15190,3179,0.58,2,6525.04,65.2504,65.25,0
6,W794302146,1634305821,27/11/2024,156,0.9,0.08,4,160,156,1,1,0,0.58,2,90.48,0.9048,0.9,0
11,W794302146,1634311918,17/1/2025,159,1.67,0.15,160,262,102,1,58,57,0.58,1.9,167.46,1.6746,1.67,0
3019,W794302146,1634315712,21/2/2025,132,2.07,0.19,262,295,33,58,157,99,0.58,1.9,207.24,2.0724,2.17,0.1`;

// Monthly usage CSV
const monthlyUsageCsvDataString = `"device_serial","device_type","device_model","location","date","meter_type","units_used"
"W792Y00912","Color","TASKalfa 5054ci","Block 2 Level 2 Customer Visitor Centre (CVC)","2024-01","Black","3128"
"W792Y00912","Color","TASKalfa 5054ci","Block 2 Level 2 Customer Visitor Centre (CVC)","2024-01","Color","10441"
"W792Y00912","Color","TASKalfa 5054ci","Block 2 Level 2 Customer Visitor Centre (CVC)","2024-02","Black","4960"
"W792Y00912","Color","TASKalfa 5054ci","Block 2 Level 2 Customer Visitor Centre (CVC)","2024-02","Color","11385"
"W792Y00912","Color","TASKalfa 5054ci","Block 2 Level 2 Customer Visitor Centre (CVC)","2024-03","Black","9359"
"W792Y00912","Color","TASKalfa 5054ci","Block 2 Level 2 Customer Visitor Centre (CVC)","2024-03","Color","12868"
"W792Y00912","Color","TASKalfa 5054ci","Block 2 Level 2 Customer Visitor Centre (CVC)","2024-04","Black","10643"
"W792Y00912","Color","TASKalfa 5054ci","Block 2 Level 2 Customer Visitor Centre (CVC)","2024-04","Color","13807"
"W792Y00912","Color","TASKalfa 5054ci","Block 2 Level 2 Customer Visitor Centre (CVC)","2024-05","Black","10965"
"W792Y00912","Color","TASKalfa 5054ci","Block 2 Level 2 Customer Visitor Centre (CVC)","2024-05","Color","14219"
"W792300234","Color","TASKalfa 5054ci","Block 3 Level 2 Student Services (SSV)","2024-01","Black","9988"
"W792300234","Color","TASKalfa 5054ci","Block 3 Level 2 Student Services (SSV)","2024-01","Color","11793"
"W792300234","Color","TASKalfa 5054ci","Block 3 Level 2 Student Services (SSV)","2024-02","Black","10039"
"W792300234","Color","TASKalfa 5054ci","Block 3 Level 2 Student Services (SSV)","2024-02","Color","12171"
"W792300234","Color","TASKalfa 5054ci","Block 3 Level 2 Student Services (SSV)","2024-03","Black","13776"
"W792300234","Color","TASKalfa 5054ci","Block 3 Level 2 Student Services (SSV)","2024-03","Color","13099"
"W792300234","Color","TASKalfa 5054ci","Block 3 Level 2 Student Services (SSV)","2024-04","Black","15380"
"W792300234","Color","TASKalfa 5054ci","Block 3 Level 2 Student Services (SSV)","2024-04","Color","13602"
"W792300234","Color","TASKalfa 5054ci","Block 3 Level 2 Student Services (SSV)","2024-05","Black","15598"
"W792300234","Color","TASKalfa 5054ci","Block 3 Level 2 Student Services (SSV)","2024-05","Color","14592"
"W792Y00913","Color","TASKalfa 5054ci","Block 3 Level 3 Student Development (SDV, ASC)","2024-01","Black","1461"
"W792Y00913","Color","TASKalfa 5054ci","Block 3 Level 3 Student Development (SDV, ASC)","2024-01","Color","18575"
"W792Y00913","Color","TASKalfa 5054ci","Block 3 Level 3 Student Development (SDV, ASC)","2024-02","Black","1522"
"W792Y00913","Color","TASKalfa 5054ci","Block 3 Level 3 Student Development (SDV, ASC)","2024-02","Color","19149"
"W792Y00913","Color","TASKalfa 5054ci","Block 3 Level 3 Student Development (SDV, ASC)","2024-03","Black","1735"
"W792Y00913","Color","TASKalfa 5054ci","Block 3 Level 3 Student Development (SDV, ASC)","2024-03","Color","23607"
"W792Y00913","Color","TASKalfa 5054ci","Block 3 Level 3 Student Development (SDV, ASC)","2024-04","Black","1840"
"W792Y00913","Color","TASKalfa 5054ci","Block 3 Level 3 Student Development (SDV, ASC)","2024-04","Color","24731"
"W792Y00913","Color","TASKalfa 5054ci","Block 3 Level 3 Student Development (SDV, ASC)","2024-05","Black","2252"
"W792Y00913","Color","TASKalfa 5054ci","Block 3 Level 3 Student Development (SDV, ASC)","2024-05","Color","30910"
"T1P2402079","Color","TASKalfa 4054ci","Block 4 Level 2 Human Resources (HRS)","2024-01","Black","3264"
"T1P2402079","Color","TASKalfa 4054ci","Block 4 Level 2 Human Resources (HRS)","2024-01","Color","11089"
"T1P2402079","Color","TASKalfa 4054ci","Block 4 Level 2 Human Resources (HRS)","2024-02","Black","4150"
"T1P2402079","Color","TASKalfa 4054ci","Block 4 Level 2 Human Resources (HRS)","2024-02","Color","14053"
"T1P2402079","Color","TASKalfa 4054ci","Block 4 Level 2 Human Resources (HRS)","2024-03","Black","5316"
"T1P2402079","Color","TASKalfa 4054ci","Block 4 Level 2 Human Resources (HRS)","2024-03","Color","18147"
"T1P2402079","Color","TASKalfa 4054ci","Block 4 Level 2 Human Resources (HRS)","2024-04","Black","5904"
"T1P2402079","Color","TASKalfa 4054ci","Block 4 Level 2 Human Resources (HRS)","2024-04","Color","19900"
"T1P2402079","Color","TASKalfa 4054ci","Block 4 Level 2 Human Resources (HRS)","2024-05","Black","6420"
"T1P2402079","Color","TASKalfa 4054ci","Block 4 Level 2 Human Resources (HRS)","2024-05","Color","21558"
"W792E00004","Color","TASKalfa 5054ci","Block 5 Level 2 Operations (OPS)","2024-01","Black","4027"
"W792E00004","Color","TASKalfa 5054ci","Block 5 Level 2 Operations (OPS)","2024-01","Color","2728"
"W792E00004","Color","TASKalfa 5054ci","Block 5 Level 2 Operations (OPS)","2024-02","Black","5047"
"W792E00004","Color","TASKalfa 5054ci","Block 5 Level 2 Operations (OPS)","2024-02","Color","3334"
"W792E00004","Color","TASKalfa 5054ci","Block 5 Level 2 Operations (OPS)","2024-03","Black","5963"
"W792E00004","Color","TASKalfa 5054ci","Block 5 Level 2 Operations (OPS)","2024-03","Color","4137"
"W792E00004","Color","TASKalfa 5054ci","Block 5 Level 2 Operations (OPS)","2024-04","Black","6493"
"W792E00004","Color","TASKalfa 5054ci","Block 5 Level 2 Operations (OPS)","2024-04","Color","4497"
"W792E00004","Color","TASKalfa 5054ci","Block 5 Level 2 Operations (OPS)","2024-05","Black","7179"
"W792E00004","Color","TASKalfa 5054ci","Block 5 Level 2 Operations (OPS)","2024-05","Color","4963"
"W792K00224","Color","TASKalfa 5054ci","Block 5 Level 5 Finance (FIN)","2024-01","Black","6479"
"W792K00224","Color","TASKalfa 5054ci","Block 5 Level 5 Finance (FIN)","2024-01","Color","11644"
"W792K00224","Color","TASKalfa 5054ci","Block 5 Level 5 Finance (FIN)","2024-02","Black","7264"
"W792K00224","Color","TASKalfa 5054ci","Block 5 Level 5 Finance (FIN)","2024-02","Color","13012"
"W792K00224","Color","TASKalfa 5054ci","Block 5 Level 5 Finance (FIN)","2024-03","Black","8325"
"W792K00224","Color","TASKalfa 5054ci","Block 5 Level 5 Finance (FIN)","2024-03","Color","14975"
"W792K00224","Color","TASKalfa 5054ci","Block 5 Level 5 Finance (FIN)","2024-04","Black","9169"
"W792K00224","Color","TASKalfa 5054ci","Block 5 Level 5 Finance (FIN)","2024-04","Color","16378"
"W792K00224","Color","TASKalfa 5054ci","Block 5 Level 5 Finance (FIN)","2024-05","Black","10036"
"W792K00224","Color","TASKalfa 5054ci","Block 5 Level 5 Finance (FIN)","2024-05","Color","17890"
"W792Y00916","Color","TASKalfa 5054ci","Block 6 Level 2 Student Life (SLF)","2024-01","Black","906"
"W792Y00916","Color","TASKalfa 5054ci","Block 6 Level 2 Student Life (SLF)","2024-01","Color","1962"
"W792Y00916","Color","TASKalfa 5054ci","Block 6 Level 2 Student Life (SLF)","2024-02","Black","1152"
"W792Y00916","Color","TASKalfa 5054ci","Block 6 Level 2 Student Life (SLF)","2024-02","Color","2458"
"W792Y00916","Color","TASKalfa 5054ci","Block 6 Level 2 Student Life (SLF)","2024-03","Black","1532"
"W792Y00916","Color","TASKalfa 5054ci","Block 6 Level 2 Student Life (SLF)","2024-03","Color","3231"
"W792Y00916","Color","TASKalfa 5054ci","Block 6 Level 2 Student Life (SLF)","2024-04","Black","1697"
"W792Y00916","Color","TASKalfa 5054ci","Block 6 Level 2 Student Life (SLF)","2024-04","Color","3559"
"W792Y00916","Color","TASKalfa 5054ci","Block 6 Level 2 Student Life (SLF)","2024-05","Black","1914"
"W792Y00916","Color","TASKalfa 5054ci","Block 6 Level 2 Student Life (SLF)","2024-05","Color","4032"
"W792K00234","Color","TASKalfa 5054ci","Block 6 Level 4 International (INT)","2024-01","Black","3215"
"W792K00234","Color","TASKalfa 5054ci","Block 6 Level 4 International (INT)","2024-01","Color","8245"
"W792K00234","Color","TASKalfa 5054ci","Block 6 Level 4 International (INT)","2024-02","Black","3845"
"W792K00234","Color","TASKalfa 5054ci","Block 6 Level 4 International (INT)","2024-02","Color","9773"
"W792K00234","Color","TASKalfa 5054ci","Block 6 Level 4 International (INT)","2024-03","Black","4863"
"W792K00234","Color","TASKalfa 5054ci","Block 6 Level 4 International (INT)","2024-03","Color","12253"
"W792K00234","Color","TASKalfa 5054ci","Block 6 Level 4 International (INT)","2024-04","Black","5345"
"W792K00234","Color","TASKalfa 5054ci","Block 6 Level 4 International (INT)","2024-04","Color","13355"
"W792K00234","Color","TASKalfa 5054ci","Block 6 Level 4 International (INT)","2024-05","Black","5957"
"W792K00234","Color","TASKalfa 5054ci","Block 6 Level 4 International (INT)","2024-05","Color","14835"
"T1P2403209","Black and White","TASKalfa 4004i","Block 3 Level 7 Executive Office (EXO)","2024-01","Black","4226"
"T1P2403209","Black and White","TASKalfa 4004i","Block 3 Level 7 Executive Office (EXO)","2024-02","Black","4784"
"T1P2403209","Black and White","TASKalfa 4004i","Block 3 Level 7 Executive Office (EXO)","2024-03","Black","5547"
"T1P2403209","Black and White","TASKalfa 4004i","Block 3 Level 7 Executive Office (EXO)","2024-04","Black","6086"
"T1P2403209","Black and White","TASKalfa 4004i","Block 3 Level 7 Executive Office (EXO)","2024-05","Black","6675"
"T1P2403212","Black and White","TASKalfa 4004i","Block 4 Level 4 Planning & Research (P&R)","2024-01","Black","4188"
"T1P2403212","Black and White","TASKalfa 4004i","Block 4 Level 4 Planning & Research (P&R)","2024-02","Black","4678"
"T1P2403212","Black and White","TASKalfa 4004i","Block 4 Level 4 Planning & Research (P&R)","2024-03","Black","5431"
"T1P2403212","Black and White","TASKalfa 4004i","Block 4 Level 4 Planning & Research (P&R)","2024-04","Black","5929"
"T1P2403212","Black and White","TASKalfa 4004i","Block 4 Level 4 Planning & Research (P&R)","2024-05","Black","6481"
"T1P2403216","Black and White","TASKalfa 4004i","Block 5 Level 4 Information Technology (IT)","2024-01","Black","10745"
"T1P2403216","Black and White","TASKalfa 4004i","Block 5 Level 4 Information Technology (IT)","2024-02","Black","13534"
"T1P2403216","Black and White","TASKalfa 4004i","Block 5 Level 4 Information Technology (IT)","2024-03","Black","18189"
"T1P2403216","Black and White","TASKalfa 4004i","Block 5 Level 4 Information Technology (IT)","2024-04","Black","20334"
"T1P2403216","Black and White","TASKalfa 4004i","Block 5 Level 4 Information Technology (IT)","2024-05","Black","23023"
"T1P2403215","Black and White","TASKalfa 4004i","Block 5 Level 6 Wellness Centre (WEL)","2024-01","Black","3245"
"T1P2403215","Black and White","TASKalfa 4004i","Block 5 Level 6 Wellness Centre (WEL)","2024-02","Black","3689"
"T1P2403215","Black and White","TASKalfa 4004i","Block 5 Level 6 Wellness Centre (WEL)","2024-03","Black","4354"
"T1P2403215","Black and White","TASKalfa 4004i","Block 5 Level 6 Wellness Centre (WEL)","2024-04","Black","4756"
"T1P2403215","Black and White","TASKalfa 4004i","Block 5 Level 6 Wellness Centre (WEL)","2024-05","Black","5223"
"T1P2403214","Black and White","TASKalfa 4004i","Block 6 Level 3 School of Business (SOB)","2024-01","Black","25874"
"T1P2403214","Black and White","TASKalfa 4004i","Block 6 Level 3 School of Business (SOB)","2024-02","Black","32623"
"T1P2403214","Black and White","TASKalfa 4004i","Block 6 Level 3 School of Business (SOB)","2024-03","Black","43967"
"T1P2403214","Black and White","TASKalfa 4004i","Block 6 Level 3 School of Business (SOB)","2024-04","Black","49267"
"T1P2403214","Black and White","TASKalfa 4004i","Block 6 Level 3 School of Business (SOB)","2024-05","Black","55645"
"W7F3601599","Black and White","TASKalfa 5004i","Block 6 Level 3 School of Business (SOB)","2024-01","Black","1067"
"W7F3601599","Black and White","TASKalfa 5004i","Block 6 Level 3 School of Business (SOB)","2024-02","Black","1346"
"W7F3601599","Black and White","TASKalfa 5004i","Block 6 Level 3 School of Business (SOB)","2024-03","Black","1814"
"W7F3601599","Black and White","TASKalfa 5004i","Block 6 Level 3 School of Business (SOB)","2024-04","Black","2032"
"W7F3601599","Black and White","TASKalfa 5004i","Block 6 Level 3 School of Business (SOB)","2024-05","Black","2299"
"W7F3601604","Black and White","TASKalfa 5004i","Block 6 Level 3 School of Design & Environment (SDE)","2024-01","Black","5342"
"W7F3601604","Black and White","TASKalfa 5004i","Block 6 Level 3 School of Design & Environment (SDE)","2024-02","Black","6745"
"W7F3601604","Black and White","TASKalfa 5004i","Block 6 Level 3 School of Design & Environment (SDE)","2024-03","Black","9087"
"W7F3601604","Black and White","TASKalfa 5004i","Block 6 Level 3 School of Design & Environment (SDE)","2024-04","Black","10158"
"W7F3601604","Black and White","TASKalfa 5004i","Block 6 Level 3 School of Design & Environment (SDE)","2024-05","Black","11499"
"W7F3601603","Black and White","TASKalfa 5004i","Block 6 Level 3 School of Design & Environment (SDE)","2024-01","Black","7854"
"W7F3601603","Black and White","TASKalfa 5004i","Block 6 Level 3 School of Design & Environment (SDE)","2024-02","Black","9914"
"W7F3601603","Black and White","TASKalfa 5004i","Block 6 Level 3 School of Design & Environment (SDE)","2024-03","Black","13363"
"W7F3601603","Black and White","TASKalfa 5004i","Block 6 Level 3 School of Design & Environment (SDE)","2024-04","Black","14946"
"W7F3601603","Black and White","TASKalfa 5004i","Block 6 Level 3 School of Design & Environment (SDE)","2024-05","Black","16910"
"W7F3601609","Black and White","TASKalfa 5004i","Block 6 Level 4 School of Health Sciences (SHS)","2024-01","Black","3234"
"W7F3601609","Black and White","TASKalfa 5004i","Block 6 Level 4 School of Health Sciences (SHS)","2024-02","Black","4080"
"W7F3601609","Black and White","TASKalfa 5004i","Block 6 Level 4 School of Health Sciences (SHS)","2024-03","Black","5495"
"W7F3601609","Black and White","TASKalfa 5004i","Block 6 Level 4 School of Health Sciences (SHS)","2024-04","Black","6150"
"W7F3601609","Black and White","TASKalfa 5004i","Block 6 Level 4 School of Health Sciences (SHS)","2024-05","Black","6961"
"W7F3601611","Black and White","TASKalfa 5004i","Block 6 Level 4 School of Health Sciences (SHS)","2024-01","Black","12534"
"W7F3601611","Black and White","TASKalfa 5004i","Block 6 Level 4 School of Health Sciences (SHS)","2024-02","Black","15822"
"W7F3601611","Black and White","TASKalfa 5004i","Block 6 Level 4 School of Health Sciences (SHS)","2024-03","Black","21312"
"W7F3601611","Black and White","TASKalfa 5004i","Block 6 Level 4 School of Health Sciences (SHS)","2024-04","Black","23854"
"W7F3601611","Black and White","TASKalfa 5004i","Block 6 Level 4 School of Health Sciences (SHS)","2024-05","Black","26998"
"W7F3601608","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-01","Black","15679"
"W7F3601608","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-02","Black","19779"
"W7F3601608","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-03","Black","26633"
"W7F3601608","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-04","Black","29789"
"W7F3601608","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-05","Black","33722"
"W7F3601610","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-01","Black","9577"
"W7F3601610","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-02","Black","12670"
"W7F3601610","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-03","Black","17312"
"W7F3601610","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-04","Black","18688"
"W7F3601610","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-05","Black","26954"
"W7F3701780","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-06","Black","5757"
"W7F3701713","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-06","Black","5196"
"W7F3601615","Black and White","TASKalfa 5004i","Block 6 Level 3 School of Business (PE)","2024-06","Black","3376"
"W7F3601610","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-06","Black","6066"
"W7F3601570","Black and White","TASKalfa 5004i","Block 5 Level 5 School of Electronics & ICT (SEIT)","2024-06","Black","4760"
"W7F3601568","Black and White","TASKalfa 5004i","Block 4 Level 4 School of Business (Lifeskills)","2024-06","Black","11611"
"W7F3601564","Black and White","TASKalfa 5004i","Block 5 Level 5 School of Electronics & ICT (SEIT)","2024-06","Black","4136"
"W7F3601563","Black and White","TASKalfa 5004i","Block 5 Level 5 School of Electronics & ICT (SEIT)","2024-06","Black","1731"
"W7F3601558","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-06","Black","11230"
"W7F3601554","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-06","Black","5623"
"W7F3601546","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-06","Black","3774"
"W7F3601544","Black and White","TASKalfa 5004i","Block 5 Level 5 School of Electronics & ICT (SEIT)","2024-06","Black","7641"
"W7F3601542","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-06","Black","5473"
"W7F3601539","Black and White","TASKalfa 5004i","Block 5 Level 5 School of Electronics & ICT (SEIT)","2024-06","Black","6426"
"W7F3601538","Black and White","TASKalfa 5004i","Block 5 Level 5 School of Electronics & ICT (SEIT)","2024-06","Black","4998"
"W7F3601537","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-06","Black","3869"
"W7F3601535","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-06","Black","7654"
"W7F3601534","Black and White","TASKalfa 5004i","Block 6 Level 5 School of Engineering (SOE)","2024-06","Black","8236"
"W792Y00925","Color","TASKalfa 5054ci","Block 2 Level 2 Customer Visitor Centre (CVC)","2024-06","Black","1259"
"W792Y00925","Color","TASKalfa 5054ci","Block 2 Level 2 Customer Visitor Centre (CVC)","2024-06","Color","2145"
"W792Y00923","Color","TASKalfa 5054ci","Block 3 Level 2 Student Services (SSV)","2024-06","Black","899"
"W792Y00923","Color","TASKalfa 5054ci","Block 3 Level 2 Student Services (SSV)","2024-06","Color","648"
"W792Y00922","Color","TASKalfa 5054ci","Block 2 Level 1 Student Services (SSV)","2024-06","Black","1042"
"W792Y00922","Color","TASKalfa 5054ci","Block 2 Level 1 Student Services (SSV)","2024-06","Color","698"
"W792Y00920","Color","TASKalfa 5054ci","Block 3 Level 3 Library@West","2024-06","Black","2046"
"W792Y00920","Color","TASKalfa 5054ci","Block 3 Level 3 Library@West","2024-06","Color","1359"
"W792Y00918","Color","TASKalfa 5054ci","Block 3 Level 3 Library@West","2024-06","Black","1468"
"W792Y00918","Color","TASKalfa 5054ci","Block 3 Level 3 Library@West","2024-06","Color","985"
"W792Y00914","Color","TASKalfa 5054ci","Block 2 Level 2 Customer Visitor Centre (CVC)","2024-06","Black","2236"
"W792Y00914","Color","TASKalfa 5054ci","Block 2 Level 2 Customer Visitor Centre (CVC)","2024-06","Color","2179"
"W792Y00912","Color","TASKalfa 5054ci","Block 2 Level 2 Customer Visitor Centre (CVC)","2024-06","Black","376"
"W792Y00912","Color","TASKalfa 5054ci","Block 2 Level 2 Customer Visitor Centre (CVC)","2024-06","Color","1140"
"W792Y00901","Color","TASKalfa 5054ci","Block 3 Level 5 Library@West","2024-06","Black","213"
"W792Y00901","Color","TASKalfa 5054ci","Block 3 Level 5 Library@West","2024-06","Color","222"
"W792Y00900","Color","TASKalfa 5054ci","Block 3 Level 6 Student Care (SCR)","2024-06","Black","328"
"W792Y00900","Color","TASKalfa 5054ci","Block 3 Level 6 Student Care (SCR)","2024-06","Color","744"
"W792300234","Color","TASKalfa 5054ci","Block 3 Level 2 Student Services (SSV)","2024-06","Black","1472"
"W792300234","Color","TASKalfa 5054ci","Block 3 Level 2 Student Services (SSV)","2024-06","Color","3946"`;

// New CSV for B&W specific invoices
const bwSpecificInvoicesCsvDataString = `S/N,Serial Number,Invoice Number,Date of Bill,Counters by duplex (Total), Charges indicated in Bill , GST ,BW last,BW current,Chargeable BW,Validate Charge by calculation,Cents to Dollar,Manually Round Up
1,W7F3501399,1634305745,"Wednesday, 27 November 2024","13,630",$34.08,$3.07,"141,128","154,758","13,630",3407.5,34.075,$34.08
2,W7F3501393,1634305747,"Wednesday, 27 November 2024","4,206",$10.52,$0.95,"67,666","71,872","4,206",1051.5,10.515,$10.52
3,W7F3501405,1634305748,"Wednesday, 27 November 2024","12,775",$31.94,$2.87,"104,559","117,334","12,775",3193.75,31.9375,$31.94
4,W7F3601568,1634305759,"Wednesday, 27 November 2024","8,304",$20.76,$1.87,"130,591","138,895","8,304",2076,20.76,$20.76
5,W7F3601552,1634305763,"Wednesday, 27 November 2024","9,230",$23.08,$2.08,"76,129","85,359","9,230",2307.5,23.075,$23.08
6,W7F3601555,1634305764,"Wednesday, 27 November 2024","5,676",$14.19,$1.28,"58,051","63,727","5,676",1419,14.19,$14.19
7,W7F3601563,1634305765,"Wednesday, 27 November 2024","2,254",$5.64,$0.51,"22,754","25,008","2,254",563.5,5.635,$5.64
8,W7F3601570,1634305766,"Wednesday, 27 November 2024","4,641",$11.60,$1.04,"87,950","92,591","4,641",1160.25,11.6025,$11.60
9,W7F3601615,1634305767,"Wednesday, 27 November 2024","3,323",$8.31,$0.75,"45,381","48,704","3,323",830.75,8.3075,$8.31
10,W7F3601550,1634305769,"Wednesday, 27 November 2024","3,766",$9.42,$0.85,"37,758","41,524","3,766",941.5,9.415,$9.42
11,W7F3601610,1634305770,"Wednesday, 27 November 2024","2,680",$6.70,$0.60,"53,793","56,473","2,680",670,6.7,$6.70
12,W7F3601558,1634305771,"Wednesday, 27 November 2024","8,508",$21.27,$1.91,"111,622","120,130","8,508",2127,21.27,$21.27
13,W7F3701713,1634305772,"Wednesday, 27 November 2024","3,103",$7.76,$0.70,"41,277","44,380","3,103",775.75,7.7575,$7.76
14,W7F3701780,1634305773,"Wednesday, 27 November 2024","7,070",$17.68,$1.59,"66,393","73,463","7,070",1767.5,17.675,$17.68
15,W7F3601564,1634305777,"Wednesday, 27 November 2024","5,138",$12.85,$1.16,"73,185","78,323","5,138",1284.5,12.845,$12.85
16,W7F3501425,1634305795,"Wednesday, 27 November 2024","4,699",$11.75,$1.06,"65,762","70,461","4,699",1174.75,11.7475,$11.75
17,W7F3501401,1634305815,"Wednesday, 27 November 2024","11,913",$29.78,$2.68,"135,157","147,070","11,913",2978.25,29.7825,$29.78
18,W7F3501460,1634305816,"Wednesday, 27 November 2024","4,304",$10.76,$0.97,"96,984","101,288","4,304",1076,10.76,$10.76
19,W7F3701780,1634311897,"Friday, 17 January 2025","7,267",$18.17,$1.64,"73,463","80,730","7,267",1816.75,18.1675,$18.17
20,W7F3601552,1634311899,"Friday, 17 January 2025","4,464",$11.16,$1.00,"85,359","89,823","4,464",1116,11.16,$11.16
21,W7F3501401,1634311900,"Friday, 17 January 2025","12,248",$30.62,$2.76,"147,070","159,318","12,248",3062,30.62,$30.62
22,W7F3601563,1634311901,"Friday, 17 January 2025",918,$2.30,$0.21,"25,008","25,926",918,229.5,2.295,$2.30
23,W7F3601570,1634311902,"Friday, 17 January 2025","4,738",$11.85,$1.07,"92,591","97,329","4,738",1184.5,11.845,$11.85
24,W7F3601615,1634311903,"Friday, 17 January 2025","2,477",$6.19,$0.56,"48,704","51,181","2,477",619.25,6.1925,$6.19
25,W7F3601550,1634311904,"Friday, 17 January 2025","3,126",$7.82,$0.70,"41,524","44,650","3,126",781.5,7.815,$7.82
26,W7F3601610,1634311905,"Friday, 17 January 2025","7,123",$17.81,$1.60,"56,473","63,596","7,123",1780.75,17.8075,$17.81
27,W7F3601558,1634311906,"Friday, 17 January 2025","7,645",$19.11,$1.72,"120,130","127,775","7,645",1911.25,19.1125,$19.11
28,W7F3701713,1634311907,"Friday, 17 January 2025","5,732",$14.33,$1.29,"44,380","50,112","5,732",1433,14.33,$14.33
29,W7F3601555,1634311909,"Friday, 17 January 2025","1,982",$4.96,$0.45,"63,727","65,709","1,982",495.5,4.955,$4.96
30,W7F3601568,1634311910,"Friday, 17 January 2025","5,405",$13.51,$1.22,"138,895","144,300","5,405",1351.25,13.5125,$13.51
31,W7F3601564,1634311911,"Friday, 17 January 2025","5,570",$13.93,$1.25,"78,323","83,893","5,570",1392.5,13.925,$13.93
32,W7F3501399,1634311912,"Friday, 17 January 2025","6,784",$16.96,$1.53,"154,758","161,542","6,784",1696,16.96,$16.96
33,W7F3501405,1634311913,"Friday, 17 January 2025","13,455",$33.64,$3.03,"117,334","130,789","13,455",3363.75,33.6375,$33.64
34,W7F3501393,1634311917,"Friday, 17 January 2025","6,889",$17.22,$1.55,"71,872","78,761","6,889",1722.25,17.2225,$17.22
35,W7F3501425,1634311919,"Friday, 17 January 2025","8,120",$20.30,$1.83,"70,461","78,581","8,120",2030,20.3,$20.30
36,W7F3501460,1634311923,"Friday, 17 January 2025","6,405",$16.01,$1.44,"101,288","107,693","6,405",1601.25,16.0125,$16.01
37,W7F3601570,1634315699,"Wednesday, 12 February 2025","6,420",$16.05,$1.44,"97,329","103,749","6,420",1605,16.05,$16.05
38,W7F3501399,1634315695,"Friday, 21 February 2025","15,522",$38.81,$3.49,"161,542","177,064","15,522",3880.5,38.805,$38.81
39,W7F3601550,1634315696,"Friday, 21 February 2025","3,121",$7.80,$0.70,"44,650","47,771","3,121",780.25,7.8025,$7.80
40,W7F3601558,1634315698,"Friday, 21 February 2025","11,207",$28.02,$2.52,"127,775","138,982","11,207",2801.75,28.0175,$28.02
41,W7F3701713,1634315700,"Friday, 21 February 2025","5,028",$12.57,$1.13,"50,112","55,140","5,028",1257,12.57,$12.57
42,W7F3501393,1634315702,"Friday, 21 February 2025","5,221",$13.05,$1.17,"78,761","83,982","5,221",1305.25,13.0525,$13.05
43,W7F3601610,1634315703,"Friday, 21 February 2025","5,497",$13.74,$1.24,"63,596","69,093","5,497",1374.25,13.7425,$13.74
44,W7F3601563,1634315704,"Friday, 21 February 2025","1,288",$3.22,$0.29,"25,926","27,214","1,288",322,3.22,$3.22
45,W7F3701780,1634315705,"Friday, 21 February 2025","8,515",$1.04,$0.09,"80,730","89,245","8,515",2128.75,21.2875,$21.29
46,W7F3601552,1634315706,"Friday, 21 February 2025","5,161",$12.90,$1.16,"89,823","94,984","5,161",1290.25,12.9025,$12.90
47,W7F3501405,1634315707,"Friday, 21 February 2025","8,637",$21.59,$1.94,"130,789","139,426","8,637",2159.25,21.5925,$21.59
48,W7F3601555,1634315708,"Friday, 21 February 2025","1,759",$4.40,$0.40,"65,709","67,468","1,759",439.75,4.3975,$4.40
49,W7F3601568,1634315710,"Friday, 21 February 2025","13,738",$34.35,$3.09,"144,300","158,038","13,738",3434.5,34.345,$34.35
50,W7F3501460,1634315711,"Friday, 21 February 2025","7,345",$18.36,$1.65,"107,693","115,038","7,345",1836.25,18.3625,$18.36
51,W7F3501425,1634315714,"Friday, 21 February 2025","5,767",$14.42,$1.30,"78,581","84,348","5,767",1441.75,14.4175,$14.42
52,W7F3501401,1634315717,"Friday, 21 February 2025","11,525",$28.81,$2.59,"159,318","170,843","11,525",2881.25,28.8125,$28.81
53,W7F3601564,1634315718,"Friday, 21 February 2025","4,491",$11.23,$1.01,"83,893","88,384","4,491",1122.75,11.2275,$11.23`;


const kyoceraInvoicesOcrDataString = `
==Start of OCR for page 1==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
BILL TO
ITE COLLEGE WEST(CHOA CHU KANG CAMPUS)
STUDENT SERVICES STAFF ROOM
1 CHOA CHU KANG GROVE, BLK 3 LEVEL 2
SINGAPORE 688236
ATTN:MS CLARA CHUA
DELIVER TO
28-Apr-2025
STUDENT SERVICES STAFF ROOM 1 CHOA CHU KANG
GROVE, BLK 3 LEVEL 2
1634325457
688236
Tel. 65902231
CUSTOMER NO.
PURCHASE ORDER NO.
0160012916
ITEM NO.
SERIAL NO.
W792300234
MODEL
OUR REF.
TERM
TASKalfa 505
4039
30 DAYS NET
DESCRIPTION
QUANTITY
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
137.34
Contract No : CSA5446/07/2022WL
Contract Type: 20_CSA
Last M/R Date :2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading:38, 699
(BW) Current Reading : 47,168
(BW) ChargeableCopies:8,469
(BW) Rate/Copy:0.58 cents
(FC) Last Reading: 43, 891
(FC) Current Reading : 48, 302
(FC) ChargeableCopies: 4, 411
(FC) Rate/Copy:2 cents
Read Source: Email
SUB TOTAL
GST 9.00%
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
TOTAL
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
137.34
137.34
12.36
149.70
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 1==
==Start of OCR for page 1==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
1634325433
BILL TO
DELIVER TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE WEST (ITE33)
STUDENT CARE CENTRE
ITE
1 CHOA CHU KANG GROVE, ITECW BLOCK 3 LEVEL 6
ROOM 01 (3601)
SINGAPORE 688236
ATTN: CLARA CHUA (MS)
28-Apr-2025
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE WEST (ITE33)
STUDENT CARE CENTRE
1 CHOA CHU KANG GROVE, ITECW BLOCK LEVEL 6
ROOM 01 (3601)
688236
CUSTOMER NO.
0160013467
PURCHASE ORDER NO.
SERIAL NO.
W792Y00900
MODEL
OUR REF.
ITEM NO.
DESCRIPTION
TASKalfa 505
QUANTITY
4039
UNIT PRICE
(SGD)
8CC116002
COPY USAGE CHARGE
1
Contract No :
CSA5849j/03/2023WL
Contract Type: 20_CSA
Last M/R Date: 2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading: 16,091
(BW) Current Reading :17, 030
(BW) ChargeableCopies:939
(BW) Rate/Copy:0.58 cents
(FC) Last Reading:22, 260
(FC) Current Reading: 23, 199
(FC) ChargeableCopies:939
(FC) Rate/Copy: 2 cents
Read Source: Email
24. 23
SUB TOTAL
GST 9.00%
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
TOTAL
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
TERM
30 DAYS NET
AMOUNT
(SGD)
24. 23
24. 23
2.18
26. 41
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 1==
==Start of OCR for page 1==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
DELIVER TO
28-Apr-2025
1634325435
BILL TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE CENTRAL (ITE25)
SINGAPORE
ATTN: ACCOUNTS DEPARTMENT
ITE
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE CENTRAL (ITE2
ITE_CC0139
1 CHOA CHU KANG GROVE
CCK 3701 STAFF ACAD CTR (SOH)
688236
CUSTOMER NO.
0160013462
PURCHASE ORDER NO.
SERIAL NO.
W7F3501405
MODEL
OUR REF.
TERM
ITEM NO.
DESCRIPTION
TASKalfa 500
QUANTITY
4039
30 DAYS NET
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
27.46
SUB TOTAL
GST 9.00%
27.46
27.46
2.47
Contract No :
CSA6308a/09/2023WL
Contract Type: 20_CSA
Last M/R Date: 2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading:157, 494
(BW) Current Reading:168, 479
(BW) ChargeableCopies:10,985
(BW) Rate/Copy:0.25 cents
Read Source: Email
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
TOTAL
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
29.93
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 1==
==Start of OCR for page 2==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
DELIVER TO
28-Apr-2025
1634325436
BILL TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE CENTRAL (ITE25)
SINGAPORE
ATTN: ACCOUNTS DEPARTMENT
ITE
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE CENTRAL (ITE2
ITE CC0118
1 CHOA CHU KANG GROVE
CCK 3801 COLLEGE ADMIN OFFICE
688236
CUSTOMER NO.
0160013462
ITEM NO.
PURCHASE ORDER NO.
SERIAL NO.
W7F3501399
MODEL
OUR REF.
TERM
TASKalfa 500
4039
30 DAYS NET
DESCRIPTION
QUANTITY
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
19.34
Contract No : CSA6309/09/2023WL
Contract Type: 20_CSA
Last M/R Date :2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading: 195, 139
(BW) Current Reading : 202, 874
(BW) ChargeableCopies: 7,735
(BW) Rate/Copy:0.25 cents
Read Source: Email
19.34
SUB TOTAL
GST 9.00%
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
TOTAL
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
19.34
1.74
21.08
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 2==
==Start of OCR for page 3==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
BILL TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE CENTRAL (ITE25)
SINGAPORE
ATTN: ACCOUNTS DEPARTMENT
DELIVER TO
28-Apr-2025
1634325437
ITE
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE CENTRAL (ITE2
ITE CC0123
1 CHOA CHU KANG GROVE
CCK 4410 COMMUNICATION HUB
688236
CUSTOMER NO.
0160013462
ITEM NO.
PURCHASE ORDER NO.
SERIAL NO.
W7F3601568
MODEL
OUR REF.
TERM
TASKalfa 500
4039
30 DAYS NET
DESCRIPTION
QUANTITY
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
20.12
20.12
SUB TOTAL
GST 9.00%
20.12
1.81
Contract No : CSA6310/09/2023WL
Contract Type: 20_CSA
Last M/R Date :2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading:180, 890
(BW) Current Reading:188, 938
(BW) ChargeableCopies: 8,048
(BW) Rate/Copy:0.25 cents
Read Source: Email
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
21.93
TOTAL
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 3==
==Start of OCR for page 4==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
BILL TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE CENTRAL (ITE25)
SINGAPORE
ATTN: ACCOUNTS DEPARTMENT
DELIVER TO
28-Apr-2025
1634325438
ITE
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE CENTRAL (ITE2
ITE CC0126
1 CHOA CHU KANG GROVE
CCK 4503 STAFF ACAD CTR (BS)
688236
CUSTOMER NO.
0160013462
ITEM NO.
PURCHASE ORDER NO.
SERIAL NO.
W7F3501460
MODEL
OUR REF.
TASKalfa 500
4039
DESCRIPTION
QUANTITY
UNIT PRICE
(SGD)
8CC116002
COPY USAGE CHARGE
1
Contract No : CSA6311/092023WL
Contract Type: 20_CSA
Last M/R Date :2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading: 131, 933
(BW) Current Reading : 137, 622
(BW) ChargeableCopies:5,689
(BW) Rate/Copy:0.25 cents
Read Source: Email
14. 22
SUB TOTAL
GST 9.00%
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
TOTAL
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
TERM
30 DAYS NET
AMOUNT
(SGD)
14. 22
14. 22
1.28
15.50
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 4==
==Start of OCR for page 5==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
BILL TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE CENTRAL (ITE25)
SINGAPORE
ATTN: ACCOUNTS DEPARTMENT
DELIVER TO
28-Apr-2025
1634325439
ITE
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE CENTRAL (ITE2
ITE CC0126
1 CHOA CHU KANG GROVE
CCK 4503 STAFF ACAD CTR (BS)
688236
CUSTOMER NO.
0160013462
ITEM NO.
PURCHASE ORDER NO.
SERIAL NO.
W7F3501401
MODEL
OUR REF.
TERM
DESCRIPTION
TASKalfa 500
QUANTITY
4039
30 DAYS NET
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
Contract No :
CSA6311b/09/2023WL
Contract Type: 20_CSA
Last M/R Date :2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading: 191, 085
(BW) Current Reading :198, 257
(BW) ChargeableCopies: 7, 172
(BW) Rate/Copy:0.25 cents
Read Source: Email
17.93
SUB TOTAL
GST 9.00%
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
TOTAL
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
17.93
17.93
1.61
19.54
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 5==
==Start of OCR for page 6==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
BILL TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE CENTRAL (ITE25)
SINGAPORE
ATTN: ACCOUNTS DEPARTMENT
DELIVER TO
28-Apr-2025
1634325440
ITE
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE CENTRAL (ITE2
ITE CC0126
1 CHOA CHU KANG GROVE
CCK 4503 STAFF ACAD CTR (BS)
688236
CUSTOMER NO.
0160013462
PURCHASE ORDER NO.
SERIAL NO.
W7F3501425
MODEL
OUR REF.
TERM
ITEM NO.
DESCRIPTION
TASKalfa 500
QUANTITY
4039
30 DAYS NET
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
Contract No :
18.92
SUB TOTAL
GST 9.00%
18.92
18.92
1.70
CSA6311c/09/2023WL
Contract Type: 20_CSA
Last M/R Date: 2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading:97, 662
(BW) Current Reading : 105, 230
(BW) ChargeableCopies:7,568
(BW) Rate/Copy:0.25 cents
Read Source: Email
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
TOTAL
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
20.62
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 6==
==Start of OCR for page 7==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
BILL TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE CENTRAL (ITE25)
SINGAPORE
ATTN: ACCOUNTS DEPARTMENT
DELIVER TO
28-Apr-2025
1634325441
ITE
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE CENTRAL (ITE2
ITE CC0134
1 CHOA CHU KANG GROVE
CCK 5503 STAFF ACAD CTR (EIT)
688236
CUSTOMER NO.
0160013462
PURCHASE ORDER NO.
SERIAL NO.
W7F3601564
MODEL
OUR REF.
TERM
TASKalfa 500
4039
30 DAYS NET
ITEM NO.
DESCRIPTION
QUANTITY
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
Contract No :
16.36
SUB TOTAL
GST 9.00%
16.36
16.36
1.47
CSA6312a/10/2023WL
Contract Type: 20_CSA
Last M/R Date: 2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading:98, 475
(BW) Current Reading : 105, 017
(BW) ChargeableCopies:6,542
(BW) Rate/Copy:0.25 cents
Read Source: Email
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
TOTAL
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
17.83
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 7==
==Start of OCR for page 8==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
DELIVER TO
28-Apr-2025
1634325442
BILL TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE CENTRAL (ITE25)
SINGAPORE
ATTN: ACCOUNTS DEPARTMENT
ITE
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE CENTRAL (ITE2
ITE CC0134
1 CHOA CHU KANG GROVE
CCK 5503 STAFF ACAD CTR (EIT)
688236
CUSTOMER NO.
0160013462
ITEM NO.
PURCHASE ORDER NO.
SERIAL NO.
W7F3601552
MODEL
OUR REF.
TERM
DESCRIPTION
TASKalfa 500
QUANTITY
4039
30 DAYS NET
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
12.35
12.35
SUB TOTAL
12.35
GST 9.00%
1.11
Contract No :
CSA6312b/10/2023WL
Contract Type: 20_CSA
Last M/R Date: 2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading:103, 535
(BW) Current Reading : 108, 475
(BW) ChargeableCopies:4,940
(BW) Rate/Copy:0.25 cents
Read Source: Email
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
13.46
TOTAL
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 8==
==Start of OCR for page 9==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
BILL TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE CENTRAL (ITE25)
SINGAPORE
ATTN: ACCOUNTS DEPARTMENT
DELIVER TO
28-Apr-2025
1634325443
ITE
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE CENTRAL (ITE2
ITE CC0134
1 CHOA CHU KANG GROVE
CCK 5503 STAFF ACAD CTR (EIT)
688236
CUSTOMER NO.
0160013462
PURCHASE ORDER NO.
SERIAL NO.
W7F3601555
MODEL
OUR REF.
TERM
TASKalfa 500
4039
30 DAYS NET
ITEM NO.
DESCRIPTION
QUANTITY
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
Contract No :
11.73
SUB TOTAL
GST 9.00%
11.73
11.73
1.06
CSA6312c/09/2023WL
Contract Type: 20_CSA
Last M/R Date: 2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading:75, 528
(BW) Current Reading:80, 220
(BW) ChargeableCopies: 4,692
(BW) Rate/Copy:0.25 cents
Read Source: Email
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
TOTAL
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
12.79
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 9==
==Start of OCR for page 10==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
DELIVER TO
28-Apr-2025
1634325444
BILL TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE CENTRAL (ITE25)
SINGAPORE
ATTN: ACCOUNTS DEPARTMENT
ITE
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE CENTRAL (ITE2
ITE CC0134
1 CHOA CHU KANG GROVE
CCK 5503 STAFF ACAD CTR (EID)
688236
CUSTOMER NO.
0160013462
PURCHASE ORDER NO.
SERIAL NO.
W7F3601563
MODEL
OUR REF.
TERM
TASKalfa 500
4039
30 DAYS NET
ITEM NO.
DESCRIPTION
QUANTITY
UNIT PRICE
AMOUNT
(SGD)
(SGD)
8CC116002
COPY USAGE CHARGE
1
3.33
3.33
SUB TOTAL
3.33
Contract No :
GST 9.00%
0.30
CSA6312d/09/2023WL
Contract Type: 20_CSA
Last M/R Date: 2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading: 31,077
(BW) Current Reading: 32, 407
(BW) ChargeableCopies:1,330
(BW) Rate/Copy:0.25 cents
Read Source: Email
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
3.63
TOTAL
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 10==
==Start of OCR for page 11==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
DELIVER TO
28-Apr-2025
1634325445
BILL TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE CENTRAL (ITE25)
SINGAPORE
ATTN: ACCOUNTS DEPARTMENT
ITE
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE CENTRAL (ITE2
ITE_CC00124
1 CHOA CHU KANG GROVE
CCK 6312 STAFF ACAD CTR (PE)
688236
CUSTOMER NO.
0160013462
ITEM NO.
PURCHASE ORDER NO.
SERIAL NO.
W7F3601615
MODEL
OUR REF.
TERM
TASKalfa 500
4039
30 DAYS NET
DESCRIPTION
QUANTITY
UNIT PRICE
AMOUNT
(SGD)
(SGD)
8CC116002
COPY USAGE CHARGE
1
7.81
7.81
SUB TOTAL
7.81
GST 9.00%
0.70
Contract No : CSA6313/09/2023WL
Contract Type: 20_CSA
Last M/R Date: 2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading: 60, 937
(BW) Current Reading :64, 061
(BW) ChargeableCopies: 3, 124
(BW) Rate/Copy:0.25 cents
Read Source: Email
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
8.51
TOTAL
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 11==
==Start of OCR for page 12==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
DELIVER TO
28-Apr-2025
1634325446
BILL TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE CENTRAL (ITE25)
SINGAPORE
ATTN: ACCOUNTS DEPARTMENT
ITE
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE CENTRAL (ITE2
ITE_CC0132
1 Choa Chu Kang Grove
CCK 6503 Staff Acad Ctr (Eng)
688236
CUSTOMER NO.
0160013462
ITEM NO.
PURCHASE ORDER NO.
SERIAL NO.
W7F3601550
MODEL
OUR REF.
TERM
DESCRIPTION
TASKalfa 500
QUANTITY
4039
30 DAYS NET
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
Contract No :
CSA6314a/09/2023wl
Contract Type: 20_CSA
Last M/R Date :2025/02/12
Current M/R Date :2025/04/25
(BW) Last Reading:47, 771
(BW) Current Reading:59, 956
(BW) ChargeableCopies:12, 185
30.46
SUB TOTAL
GST 9.00%
30.46
30.46
2.74
(BW) Rate/Copy:0.25 cents
Read Source: Email
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
TOTAL
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
33. 20
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 12==
==Start of OCR for page 13==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
DELIVER TO
28-Apr-2025
1634325447
BILL TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE CENTRAL (ITE25)
SINGAPORE
ATTN: ACCOUNTS DEPARTMENT
ITE
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE CENTRAL (ITE2
1 Choa Chu Kang Grove
CCK 6503 Staff Acad Ctr (Eng)
688236
CUSTOMER NO.
0160013462
PURCHASE ORDER NO.
SERIAL NO.
W7F3601610
MODEL
OUR REF.
TERM
TASKalfa 500
4039
30 DAYS NET
ITEM NO.
DESCRIPTION
QUANTITY
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
14.63
Contract No :
CSA6314b/09/2023WL
Contract Type: 20_CSA
Last M/R Date: 2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading:77,599
(BW) Current Reading : 83,450
(BW) ChargeableCopies: 5,851
(BW) Rate/Copy:0.25 cents
Read Source: Email
14.63
SUB TOTAL
GST 9.00%
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
TOTAL
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
14.63
1.32
15.95
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 13==
==Start of OCR for page 14==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
DELIVER TO
28-Apr-2025
1634325448
BILL TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE CENTRAL (ITE25)
SINGAPORE
ATTN: ACCOUNTS DEPARTMENT
ITE
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE CENTRAL (ITE2
1 Choa Chu Kang Grove
CCK 6503 Staff Acad Ctr (Eng)
688236
CUSTOMER NO.
0160013462
ITEM NO.
PURCHASE ORDER NO.
SERIAL NO.
W7F3601558
MODEL
OUR REF.
TERM
TASKalfa 500
4039
30 DAYS NET
DESCRIPTION
QUANTITY
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
26.39
SUB TOTAL
GST 9.00%
26.39
26.39
2.38
Contract No :
CSA6314c/09/2023WL
Contract Type: 20_CSA
Last M/R Date :2025/03/16
Current M/R Date :2025/04/25
(BW) Last Reading: 155, 055
(BW) Current Reading: 165, 609
(BW) ChargeableCopies:10, 554
(BW) Rate/Copy:0.25 cents
Read Source: Email
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
TOTAL
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
28.77
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 14==
==Start of OCR for page 15==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
DELIVER TO
28-Apr-2025
1634325449
BILL TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE CENTRAL (ITE25)
SINGAPORE
ATTN: ACCOUNTS DEPARTMENT
ITE
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE CENTRAL (ITE2
ITE CC0132
1 CHOA CHU KANG GROVE
CCK 6503 STAFF ACAD CTR (ENG)
688236
CUSTOMER NO.
0160013462
ITEM NO.
PURCHASE ORDER NO.
SERIAL NO.
W7F3701713
MODEL
OUR REF.
TERM
DESCRIPTION
TASKalfa 500
QUANTITY
4039
30 DAYS NET
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
12.59
SUB TOTAL
GST 9.00%
12.59
12.59
1.13
Contract No :
CSA6314d/09/2023WL
Contract Type: 20_CSA
Last M/R Date:2025/03/16
Current M/R Date :2025/04/25
(BW) Last Reading:61,555
(BW) Current Reading : 66,590
(BW) ChargeableCopies: 5,035
(BW) Rate/Copy:0.25 cents
Read Source: Email
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
TOTAL
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
13.72
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 15==
==Start of OCR for page 16==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
DELIVER TO
28-Apr-2025
1634325450
BILL TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE CENTRAL (ITE25)
SINGAPORE
ATTN: ACCOUNTS DEPARTMENT
ITE
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE CENTRAL (ITE2
ITE CC0132
1 CHOA CHU KANG GROVE
CCK 6503 STAFF ACAD CTR (ENG)
688236
CUSTOMER NO.
0160013462
PURCHASE ORDER NO.
SERIAL NO.
W7F3701780
MODEL
OUR REF.
TERM
ITEM NO.
DESCRIPTION
TASKalfa 500
QUANTITY
4039
30 DAYS NET
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
22.72
22.72
SUB TOTAL
22.72
Contract No :
GST 9.00%
2.04
CSA6314e/09/2023WL
Contract Type: 20_CSA
Last M/R Date: 2025/03/16
Current M/R Date :2025/04/25
(BW) Last Reading: 98, 932
(BW) Current Reading : 108, 018
(BW) ChargeableCopies:9,086
(BW) Rate/Copy:0.25 cents
Read Source: Email
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
24.76
TOTAL
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 16==
==Start of OCR for page 17==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
PAGE
TAX INVOICE
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
DELIVER TO
28-Apr-2025
1634325455
BILL TO
INSTITUTE OF TECHNICAL EDUCATION
COLLEGE CENTRAL (ITE25)
SINGAPORE
ATTN: ACCOUNTS DEPARTMENT
ITE
INSTITUTE OF TECHNICAL EDUCATION – ITE
COLLEGE CENTRAL (ITE2
ITE CC0132
1 CHOA CHU KANG GROVE
CCK 6503 STAFF ACAD CTR (ENG)
688236
CUSTOMER NO.
0160013462
ITEM NO.
PURCHASE ORDER NO.
SERIAL NO.
W793601285
MODEL
OUR REF.
TERM
TASKalfa 505
4039
30 DAYS NET
DESCRIPTION
QUANTITY
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
17.64
17.64
Contract No : CSA6307/09/2023WL
Contract Type: 20_CSA
Last M/R Date :2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading:12, 461
(BW) Current Reading : 13,237
(BW) ChargeableCopies:776
(BW) Rate/Copy:0.58 cents
(FC) Last Reading:18,951
(FC) Current Reading : 19,608
(FC) ChargeableCopies:657
(FC) Rate/Copy: 2 cents
Read Source: Email
SUB TOTAL
GST 9.00%
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
TOTAL
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
17.64
1.59
19. 23
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 17==
==Start of OCR for page 18==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
PAGE
TAX INVOICE
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
BILL TO
DELIVER TO
INSTITUTE OF TECHNICAL EDUCATION
(ITE06)
ITE HQ
2 ANG MO KIO DRIVE
BLK A LEVEL 6
SINGAPORE 567720
ATTN:CHING MEI LING (MS)
28-Apr-2025
INSTITUTE OF TECHNICAL EDUCATION – ITE HQ
(ITE06)
STAFF ROOM
1 CHOA CHU KANG GROVE, ITECW BLOCK 2 LEVEL 2
ROOM 08B (2208B)
688236
1634325451
CUSTOMER NO.
PURCHASE ORDER NO.
0160013922
ITEM NO.
SERIAL NO.
W792Y00912
DESCRIPTION
MODEL
TASKalfa 505
QUANTITY
OUR REF.
TERM
4039
30 DAYS NET
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
15.66
SUB TOTAL
15.66
15.66
GST 9.00%
1.41
Contract No :
CSA5849k/03/2023WL
Contract Type: 20_CSA
Last M/R Date :2025/03/19
Current M/R Date :2025/04/25
(BW) Last Reading:16, 552
(BW) Current Reading:17,504
(BW) ChargeableCopies:952
(BW) Rate/Copy:0.58 cents
(FC) Last Reading:22, 240
(FC) Current Reading : 22,747
(FC) ChargeableCopies:507
(FC) Rate/Copy: 2 cents
Read Source : Email
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
17.07
TOTAL
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 18==
==Start of OCR for page 19==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
PAGE
TAX INVOICE
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
BILL TO
DELIVER TO
INSTITUTE OF TECHNICAL EDUCATION
(ITE06)
ITE HQ
2 ANG MO KIO DRIVE
BLK A LEVEL 6
SINGAPORE 567720
ATTN:CHING MEI LING (MS)
28-Apr-2025
INSTITUTE OF TECHNICAL EDUCATION – ITE HQ
(ITE06)
STUDENT SERVICE CTR
1 CHOA CHU KANG GROVE, ITECW BLOCK 3 LEVEL 3
ROOM 01 (3301)
688236
1634325452
CUSTOMER NO.
PURCHASE ORDER NO.
0160013922
ITEM NO.
SERIAL NO.
W792Y00913
MODEL
OUR REF.
TERM
DESCRIPTION
TASKalfa 505
QUANTITY
4039
30 DAYS NET
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
79.28
SUB TOTAL
GST 9.00%
79.28
79.28
7.14
Contract No :
CSA58491/03/2023WL
Contract Type: 20_CSA
Last M/R Date :2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading:20, 136
(BW) Current Reading :22, 556
(BW) ChargeableCopies: 2, 420
(BW) Rate/Copy:0.58 cents
(FC) Last Reading: 62, 994
(FC) Current Reading : 66,256
(FC) ChargeableCopies: 3, 262
(FC) Rate/Copy: 2 cents
Read Source: Email
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
TOTAL
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
86.42
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 19==
==Start of OCR for page 20==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
PAGE
TAX INVOICE
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
BILL TO
DELIVER TO
INSTITUTE OF TECHNICAL EDUCATION
(ITE06)
ITE HQ
2 ANG MO KIO DRIVE
BLK A LEVEL 6
SINGAPORE 567720
ATTN:CHING MEI LING (MS)
28-Apr-2025
INSTITUTE OF TECHNICAL EDUCATION – ITE HQ
(ITE06)
LIBRARY@WEST
1 CHOA CHU KANG GROVE, ITECW BLOCK 3 LEVEL 5
ROOM 01 (3501)
688236
1634325453
CUSTOMER NO.
PURCHASE ORDER NO.
0160013922
ITEM NO.
SERIAL NO.
W792Y00901
MODEL
OUR REF.
TERM
TASKalfa 505
4039
30 DAYS NET
DESCRIPTION
QUANTITY
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
4.01
4.01
SUB TOTAL
4.01
GST 9.00%
0.36
Contract No :
CSA5849m/03/2023WL
Contract Type: 20_CSA
Last M/R Date :2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading: 4,837
(BW) Current Reading : 4,887
(BW) ChargeableCopies:50
(BW) Rate/Copy:0.58 cents
(FC) Last Reading:11,858
(FC) Current Reading : 12,044
(FC) ChargeableCopies:186
(FC) Rate/Copy: 2 cents
Read Source : Email
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
4.37
TOTAL
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 20==
==Start of OCR for page 21==
KYOCERA
KYOCERA Document Solutions Singapore Pte. Ltd.
601 Macpherson Road #04-12 Grantral Complex, Singapore 368242
PAGE
TAX INVOICE
TELEPHONE : (65) 6741 8733
SERVICE TEL: (65) 6747 6042
CO REGN. NO. 197501708R
FACSIMILE : (65) 6748 3788
DATE
Page 1 of 1
NUMBER
GST REGN. NO. M200226259
BILL TO
DELIVER TO
INSTITUTE OF TECHNICAL EDUCATION
(ITE06)
ITE HQ
2 ANG MO KIO DRIVE
BLK A LEVEL 6
SINGAPORE 567720
ATTN:CHING MEI LING (MS)
28-Apr-2025
INSTITUTE OF TECHNICAL EDUCATION – ITE HQ
(ITE06)
SECTION HEAD ROOM
1 CHOA CHU KANG GROVE, ITECW BLOCK 3 LEVEL 7
ROOM 01C (3701C)
688236
1634325454
CUSTOMER NO.
PURCHASE ORDER NO.
0160013922
ITEM NO.
SERIAL NO.
W792Y00917
MODEL
OUR REF.
TERM
DESCRIPTION
TASKalfa 505
QUANTITY
4039
30 DAYS NET
UNIT PRICE
(SGD)
AMOUNT
(SGD)
8CC116002
COPY USAGE CHARGE
1
32.94
SUB TOTAL
GST 9.00%
32.94
32.94
2.96
Contract No :
CSA5849n/03/2023WL
Contract Type: 20_CSA
Last M/R Date: 2025/03/26
Current M/R Date :2025/04/25
(BW) Last Reading: 11,016
(BW) Current Reading :11,591
(BW) ChargeableCopies:575
(BW) Rate/Copy:0.58 cents
(FC) Last Reading:25, 739
(FC) Current Reading : 27,219
(FC) ChargeableCopies:1,480
(FC) Rate/Copy: 2 cents
Read Source: Email
Ε.& Ο.Ε.
THIS INVOICE IS A COMPUTER GENERATED INVOICE. NO SIGNATURE IS REQUIRED.
GOODS SOLD ARE NOT RETURNABLE. INTEREST OF 1% WILL BE CHARGED ON OVERDUE ACCOUNTS.
TOTAL
THE TITLE OF ANY GOODS SUPPLIED AGAINST THIS INVOICE SHALL NOT PASS TO THE PURCHASER UNTIL
ALL THE SUMS, INCLUDING THE COST OF SUCH GOODS, HAVE BEEN DISCHARGED IN FULL.
By cheque: crossed & payable to "KYOCERA Document Solutions Singapore Pte. Ltd."
By Bank transfer:
Bank
35.90
PAYNOW
UEN:197501708R
Swift Code
Bank Code
Branch Code
A/C no (SGD)
MUFG Bank, Ltd
BOTKSGSX
7126
001
252748
Standard Chartered Bank (Singapore) Limited
SCBLSG22
9496
009
091001176-1
==End of OCR for page 21==`;


// Helper to parse CSV (simple version for these fixed data formats)
function parseCsvData(csvString: string, hasQuotedFields: boolean = false): { headers: string[], data: string[][] } {
  const lines = csvString.trim().replace(/^\uFEFF/, '').split('\n'); // Remove BOM if present
  if (lines.length === 0) {
    return { headers: [], data: [] };
  }
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '')); // Remove surrounding quotes from headers
  
  const dataLines = lines.slice(1).map(line => {
    if (!hasQuotedFields) {
      return line.split(',').map(field => field.trim());
    }
    // Simple CSV field parser that handles quoted fields with commas
    const fields = [];
    let currentField = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && (i === 0 || line[i-1] !== '\\')) { // Handle basic quotes, not escaped ones
            // If it's a double quote inside a quoted field (e.g. "" to represent one ")
            if (inQuotes && i + 1 < line.length && line[i+1] === '"') {
                currentField += '"';
                i++; // Skip next quote
                continue;
            }
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            fields.push(currentField.trim().replace(/^"|"$/g, '')); // Remove surrounding quotes from field
            currentField = '';
        } else {
            currentField += char;
        }
    }
    fields.push(currentField.trim().replace(/^"|"$/g, '')); // Add last field and remove surrounding quotes
    return fields;
  });
  return { headers, data: dataLines };
}


/**
 * Parses a date string in DD/MM/YYYY, "Day, DD Month YYYY HH:MM am/pm", or "DD-Mon-YYYY" format to an ISO string.
 * @param dateString The date string to parse.
 * @returns An ISO date string or null if parsing fails.
 */
function parseFlexibleDateToISO(dateString: string): string | null {
  if (!dateString) return null;
  const cleanedDateString = dateString.trim().replace(/^"|"$/g, ''); 

  // Try parsing DD-Mon-YYYY (e.g., 28-Apr-2025)
  const datePartsMon = cleanedDateString.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
  if (datePartsMon) {
    const day = parseInt(datePartsMon[1], 10);
    const monthStr = datePartsMon[2];
    const year = parseInt(datePartsMon[3], 10);
    const tempDateForMonth = new Date(Date.parse(monthStr +" 1, 2000")); // e.g. "Apr 1, 2000"
    if (!isNaN(tempDateForMonth.getMonth())) {
        const monthIndex = tempDateForMonth.getMonth();
        if (!isNaN(day) && !isNaN(year) && year > 1900) { // Added year > 1900 check
            const d = new Date(Date.UTC(year, monthIndex, day));
            if (d.getUTCFullYear() === year && d.getUTCMonth() === monthIndex && d.getUTCDate() === day) {
                return d.toISOString();
            }
        }
    }
  }

  // Try parsing "Day, DD Month YYYY HH:MM am/pm" (e.g., "Wednesday, 12 February 2025 12:00 am")
  let date = new Date(cleanedDateString);
  if (!isNaN(date.getTime()) && date.getFullYear() > 2000) { 
    return date.toISOString();
  }
  
  // Try parsing DD/MM/YYYY
  const parts = cleanedDateString.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; 
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year) && year > 1900) { // Added year > 1900 check
      date = new Date(Date.UTC(year, month, day)); 
      if (date.getUTCFullYear() === year && date.getUTCMonth() === month && date.getUTCDate() === day) {
        return date.toISOString();
      }
    }
  }

  console.warn(`Could not parse date string: "${cleanedDateString}" into a valid ISO string.`);
  return null;
}

/**
 * Parses a "YYYY-MM" string to the last day of that month as an ISO string.
 * @param yearMonth The "YYYY-MM" string.
 * @returns An ISO date string for the last day of the month or null.
 */
function getLastDayOfMonthISO(yearMonth: string): string | null {
  if (!yearMonth || !/^\d{4}-\d{2}$/.test(yearMonth)) {
    console.warn(`Invalid YYYY-MM format: "${yearMonth}"`);
    return null;
  }
  const [year, month] = yearMonth.split('-').map(Number);
  const date = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)); 
  return date.toISOString();
}

// --- Step 1: Parse the initial devices CSV ---
const { headers: deviceCsvHeaders, data: parsedDeviceCsvRows } = parseCsvData(devicesCsvDataString, true);
const deviceHeaderIndexMap: { [key: string]: number } = {};
deviceCsvHeaders.forEach((header, index) => { deviceHeaderIndexMap[header] = index; });

const DH = { // Device Headers
  SERIAL: deviceHeaderIndexMap['Device Serial #'],
  MODEL: deviceHeaderIndexMap['Device Model'],
  LOCATION: deviceHeaderIndexMap['Device Location'],
  FC_RATE: deviceHeaderIndexMap['FC Rate'],
  BW_RATE: deviceHeaderIndexMap['BW Rate'],
  LAST_BW: deviceHeaderIndexMap['last reading (BW)'],
  CURRENT_BW: deviceHeaderIndexMap['current reading (BW)'],
  LAST_FC: deviceHeaderIndexMap['last reading (FC)'],
  CURRENT_FC: deviceHeaderIndexMap['current reading (FC)'],
};

function addInitialReadingsFromDeviceCsv(
  readingsArray: MeterReading[],
  lastValStr: string | undefined,
  currentValStr: string | undefined,
  readingType: 'BW' | 'FC',
  serial: string
) {
  const lastReadingDateStr = "2024-07-01T10:00:00.000Z"; 
  const currentReadingDateStr = "2024-07-28T10:00:00.000Z";

  const lastReadingNum = lastValStr ? parseInt(lastValStr.replace(/,/g, ''), 10) : NaN;
  const currentReadingNum = currentValStr ? parseInt(currentValStr.replace(/,/g, ''), 10) : NaN;

  if (!isNaN(lastReadingNum) && lastReadingNum >= 0) {
    readingsArray.push({
      id: crypto.randomUUID(),
      date: lastReadingDateStr,
      reading: lastReadingNum,
      notes: `Historical reading (${readingType}) from initial CSV`
    });
  }
  if (!isNaN(currentReadingNum) && currentReadingNum >= (isNaN(lastReadingNum) ? 0 : lastReadingNum)) {
     readingsArray.push({
      id: crypto.randomUUID(),
      date: currentReadingDateStr,
      reading: currentReadingNum,
      notes: `Current reading (${readingType}) from initial CSV`
    });
  } else if (!isNaN(currentReadingNum) && currentReadingNum < lastReadingNum) {
    console.warn(`Initial current ${readingType} reading for ${serial} (${currentReadingNum}) is less than initial last ${readingType} reading (${lastReadingNum}). Adding current reading anyway.`);
    readingsArray.push({
        id: crypto.randomUUID(),
        date: currentReadingDateStr, 
        reading: currentReadingNum,
        notes: `Current reading (${readingType}) from initial CSV (lower than prior)`
      });
  }
}

const tempPrinters: Printer[] = parsedDeviceCsvRows.map((row): Printer | null => {
  const serial = row[DH.SERIAL];
  if (!serial) {
    console.warn("Skipping device row due to missing serial number:", row);
    return null;
  }

  const model = row[DH.MODEL] || "Unknown Model";
  const location = row[DH.LOCATION] || "Unknown Location";
  
  const fcRateString = row[DH.FC_RATE];
  const parsedFcRate = fcRateString ? parseFloat(fcRateString.replace(/,/g, '')) : 0;
  const printerType = (parsedFcRate > 0) ? PrinterType.FULL_COLOUR : PrinterType.BLACK_AND_WHITE;

  const bwRateString = row[DH.BW_RATE];
  const parsedBwRate = bwRateString ? parseFloat(bwRateString.replace(/,/g, '')) : 0;

  const readings: MeterReading[] = [];
  const installationDateStr = "2023-01-15T00:00:00.000Z"; 

  if (printerType === PrinterType.BLACK_AND_WHITE) {
    addInitialReadingsFromDeviceCsv(readings, row[DH.LAST_BW], row[DH.CURRENT_BW], 'BW', serial);
  } else { 
    addInitialReadingsFromDeviceCsv(readings, row[DH.LAST_FC], row[DH.CURRENT_FC], 'FC', serial);
  }
  
  return {
    id: serial,
    name: `${model} (${serial})`,
    model: model,
    type: printerType, 
    location: location,
    installationDate: installationDateStr,
    readings: readings,
    bwRate: !isNaN(parsedBwRate) ? parsedBwRate : undefined,
    fcRate: !isNaN(parsedFcRate) && parsedFcRate > 0 ? parsedFcRate : undefined,
  };
}).filter(printer => printer !== null) as Printer[];


const printerMap = new Map(tempPrinters.map(p => [p.id, p]));

// --- Process Colour Invoice CSV Data ---
const { headers: colourInvHeaders, data: colourInvRows } = parseCsvData(colourInvoiceCsvDataString, true);
const CIH = { SERIAL: 1, INVOICE_NUM: 2, BILL_DATE: 3, BW_CURRENT: 10, COLOUR_CURRENT: 13 }; // Hardcoded indices based on structure

colourInvRows.forEach((row, index) => {
  const serial = row[CIH.SERIAL];
  if (!serial) { console.warn(`Colour Invoice Row ${index+1}: Missing serial.`); return; }
  const printer = printerMap.get(serial);
  if (!printer) { console.warn(`Colour Invoice: Printer ${serial} not found (Inv: ${row[CIH.INVOICE_NUM]}).`); return; }
  
  const billDateStr = row[CIH.BILL_DATE];
  const isoBillDate = parseFlexibleDateToISO(billDateStr);
  if (!isoBillDate) { console.warn(`Colour Invoice ${serial} (Inv: ${row[CIH.INVOICE_NUM]}): Bad date "${billDateStr}".`); return; }

  let readingValueStr: string | undefined;
  let readingTypeNote: string;

  if (printer.type === PrinterType.BLACK_AND_WHITE) {
    readingValueStr = row[CIH.BW_CURRENT];
    readingTypeNote = "BW";
  } else {
    readingValueStr = row[CIH.COLOUR_CURRENT];
    readingTypeNote = "FC";
  }
  const readingValue = readingValueStr ? parseInt(readingValueStr.replace(/,/g, ''), 10) : NaN;
  if (isNaN(readingValue)) { console.warn(`Colour Invoice ${serial} (Inv: ${row[CIH.INVOICE_NUM]}): Bad ${readingTypeNote} reading "${readingValueStr}".`); return; }

  printer.readings.push({
    id: crypto.randomUUID(), date: isoBillDate, reading: readingValue,
    notes: `From Colour Invoice ${row[CIH.INVOICE_NUM]} (Bill Date: ${billDateStr}, Type: ${readingTypeNote})`,
  });
});

// --- Process B&W Specific Invoice CSV Data ---
const { headers: bwSpecificInvHeaders, data: bwSpecificInvRows } = parseCsvData(bwSpecificInvoicesCsvDataString, true);
const BSIH = { SERIAL_NUM: 1, INVOICE_NUM: 2, BILL_DATE: 3, BW_CURRENT: 8 }; // Column "BW current"

bwSpecificInvRows.forEach((row, index) => {
    const serial = row[BSIH.SERIAL_NUM];
    if (!serial) { console.warn(`B&W Specific Invoice Row ${index + 1}: Missing serial.`); return; }

    const printer = printerMap.get(serial);
    if (!printer) { console.warn(`B&W Specific Invoice: Printer ${serial} not found (Inv: ${row[BSIH.INVOICE_NUM]}).`); return; }

    if (printer.type === PrinterType.FULL_COLOUR) {
        console.warn(`B&W Specific Invoice: Printer ${serial} (Inv: ${row[BSIH.INVOICE_NUM]}) is Full Colour. Skipping B&W only reading from this file to avoid data conflict.`);
        return;
    }
    
    const billDateStr = row[BSIH.BILL_DATE];
    const isoBillDate = parseFlexibleDateToISO(billDateStr);
    if (!isoBillDate) { console.warn(`B&W Specific Invoice ${serial} (Inv: ${row[BSIH.INVOICE_NUM]}): Bad date "${billDateStr}".`); return; }

    const bwCurrentStr = row[BSIH.BW_CURRENT];
    const readingValue = bwCurrentStr ? parseInt(bwCurrentStr.replace(/,/g, ''), 10) : NaN;

    if (isNaN(readingValue) || readingValue < 0) {
        console.warn(`B&W Specific Invoice ${serial} (Inv: ${row[BSIH.INVOICE_NUM]}): Bad B&W reading "${bwCurrentStr}".`);
        return;
    }

    printer.readings.push({
        id: crypto.randomUUID(),
        date: isoBillDate,
        reading: readingValue,
        notes: `From B&W Invoice ${row[BSIH.INVOICE_NUM]} (Bill Date: ${billDateStr}, Type: BW)`,
    });
});


// --- Process Monthly Usage CSV Data ---
const { headers: monthlyUsageHeaders, data: monthlyUsageRows } = parseCsvData(monthlyUsageCsvDataString, true);
const MUH = { SERIAL: 0, TYPE: 1, MODEL: 2, LOCATION: 3, DATE: 4, METER_TYPE: 5, UNITS_USED: 6 };

monthlyUsageRows.forEach((row, index) => {
    const serial = row[MUH.SERIAL];
    if (!serial) { console.warn(`Monthly Usage Row ${index + 1}: Missing serial.`); return; }

    let printer = printerMap.get(serial);
    const yearMonth = row[MUH.DATE];
    const isoReadingDate = getLastDayOfMonthISO(yearMonth);
    if (!isoReadingDate) { console.warn(`Monthly Usage ${serial}: Bad date format "${yearMonth}".`); return; }

    if (!printer) {
        const deviceTypeStr = row[MUH.TYPE]?.toLowerCase();
        const printerType = deviceTypeStr === 'color' ? PrinterType.FULL_COLOUR : PrinterType.BLACK_AND_WHITE;
        
        let inferredBwRate: number | undefined = undefined;
        let inferredFcRate: number | undefined = undefined;
        const sameModelPrinters = Array.from(printerMap.values()).filter(p => p.model === row[MUH.MODEL]);
        if (sameModelPrinters.length > 0) {
            inferredBwRate = sameModelPrinters[0].bwRate;
            if (printerType === PrinterType.FULL_COLOUR) inferredFcRate = sameModelPrinters[0].fcRate;
        }

        printer = {
            id: serial,
            name: `${row[MUH.MODEL]} (${serial})`,
            model: row[MUH.MODEL] || "Unknown Model",
            type: printerType,
            location: row[MUH.LOCATION] || "Unknown Location",
            installationDate: isoReadingDate, 
            readings: [],
            bwRate: inferredBwRate,
            fcRate: inferredFcRate,
        };
        printerMap.set(serial, printer);
        console.log(`Monthly Usage: New printer ${serial} created from usage data.`);
    }

    const unitsUsed = parseInt(row[MUH.UNITS_USED].replace(/,/g, ''), 10);
    if (isNaN(unitsUsed)) { console.warn(`Monthly Usage ${serial} ${yearMonth}: Bad units_used "${row[MUH.UNITS_USED]}".`); return; }

    const meterType = row[MUH.METER_TYPE]?.toLowerCase();
    
    let targetReadingType: 'BW' | 'FC' | null = null;
    if (printer.type === PrinterType.BLACK_AND_WHITE && meterType === 'black') {
        targetReadingType = 'BW';
    } else if (printer.type === PrinterType.FULL_COLOUR && meterType === 'color') {
        targetReadingType = 'FC';
    } else if (printer.type === PrinterType.FULL_COLOUR && meterType === 'black') {
        // console.warn(`Monthly Usage ${serial} ${yearMonth}: B&W usage (${unitsUsed}) for a Full Colour printer. This data is logged but not added to primary FC readings.`);
        return; 
    } else {
        console.warn(`Monthly Usage ${serial} ${yearMonth}: Meter type "${meterType}" not applicable for printer type "${printer.type}".`);
        return;
    }

    printer.readings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let lastCumulativeReading = 0;
    const startOfMonthForCurrentEntry = new Date(isoReadingDate);
    startOfMonthForCurrentEntry.setUTCDate(1); 
    startOfMonthForCurrentEntry.setUTCHours(0,0,0,0);


    for (let i = printer.readings.length - 1; i >= 0; i--) {
        const rDate = new Date(printer.readings[i].date);
        if (rDate < startOfMonthForCurrentEntry) {
            lastCumulativeReading = printer.readings[i].reading;
            break;
        }
    }
    
    const newCumulativeValue = lastCumulativeReading + unitsUsed;

    printer.readings.push({
        id: crypto.randomUUID(),
        date: isoReadingDate,
        reading: newCumulativeValue,
        notes: `Monthly Usage (${meterType}): ${unitsUsed} units used in ${yearMonth}`,
    });
});

// --- Process Kyocera OCR Invoice Data ---
const invoiceOcrBlocks: string[] = [];
const ocrContent = kyoceraInvoicesOcrDataString;
const blockRegex = /KYOCERA.*?==End of OCR for page \d+==/gs;
let ocrMatch;
while ((ocrMatch = blockRegex.exec(ocrContent)) !== null) {
  invoiceOcrBlocks.push(ocrMatch[0]);
}

invoiceOcrBlocks.forEach((block, idx) => {
    if (block.trim().length === 0) return;

    const serialMatch = block.match(/SERIAL NO\.\s*([A-Z0-9]+)/);
    const invoiceNumMatch = block.match(/NUMBER\s*(\d+)/);
    const dateMatch = block.match(/DATE\s*(\d{1,2}-[A-Za-z]{3}-\d{4})/);
    const bwReadingMatch = block.match(/\(BW\) Current Reading\s*:\s*([\d,]+)/);
    const fcReadingMatch = block.match(/\(FC\) Current Reading\s*:\s*([\d,]+)/);

    const serial = serialMatch ? serialMatch[1].trim() : null;
    const invoiceNum = invoiceNumMatch ? invoiceNumMatch[1].trim() : null;
    const dateStr = dateMatch ? dateMatch[1].trim() : null;
    
    if (!serial || !invoiceNum || !dateStr) {
        console.warn(`Skipping OCR invoice block #${idx + 1} due to missing essential fields (Serial, Invoice #, or Date). Preview:`, block.substring(0, 200));
        return;
    }

    const isoDate = parseFlexibleDateToISO(dateStr);
    if (!isoDate) {
        console.warn(`OCR Invoice ${serial} (Inv: ${invoiceNum}): Bad date "${dateStr}".`);
        return;
    }

    const printer = printerMap.get(serial);
    if (!printer) {
        console.warn(`OCR Invoice: Printer ${serial} not found (Inv: ${invoiceNum}). Skipping this invoice's readings.`);
        return;
    }

    if (printer.type === PrinterType.BLACK_AND_WHITE && bwReadingMatch) {
        const bwReadingStr = bwReadingMatch[1];
        const bwReadingVal = parseInt(bwReadingStr.replace(/,/g, ''), 10);
        if (!isNaN(bwReadingVal)) {
            printer.readings.push({
                id: crypto.randomUUID(),
                date: isoDate,
                reading: bwReadingVal,
                notes: `From Kyocera Invoice ${invoiceNum} (Bill Date: ${dateStr}, Type: BW)`,
            });
        } else {
            console.warn(`OCR Invoice ${serial} (Inv: ${invoiceNum}): Bad BW reading "${bwReadingStr}".`);
        }
    } else if (printer.type === PrinterType.FULL_COLOUR && fcReadingMatch) {
        const fcReadingStr = fcReadingMatch[1];
        const fcReadingVal = parseInt(fcReadingStr.replace(/,/g, ''), 10);
        if (!isNaN(fcReadingVal)) {
            printer.readings.push({
                id: crypto.randomUUID(),
                date: isoDate,
                reading: fcReadingVal,
                notes: `From Kyocera Invoice ${invoiceNum} (Bill Date: ${dateStr}, Type: FC)`,
            });
        } else {
            console.warn(`OCR Invoice ${serial} (Inv: ${invoiceNum}): Bad FC reading "${fcReadingStr}".`);
        }
    } else if (printer.type === PrinterType.FULL_COLOUR && bwReadingMatch && !fcReadingMatch) {
        // If it's a Full Colour printer and only BW reading is found in OCR, we might log it differently or ignore for main readings.
        // For now, if an FC printer has an OCR invoice and only BW is listed, we assume the invoice might be incomplete for FC.
        // The main reading for an FC printer comes from its FC counter.
        // However, the first provided OCR for W792300234 (FC) includes *both* BW and FC readings.
        // The current logic will add the FC reading. If an FC invoice *only* had BW, this block would skip it for the FC type.
        // Let's also add BW reading for FC printers if present, as it could be useful context, but not primary.
        // For consistency with how other data is added (where FC printers' `readings` list holds FC values),
        // we will prioritize FC for FC printers. If invoice has both, FC is added. If only BW, it's ambiguous for an FC printer.
        // The previous logic for `devicesCsvDataString` directly puts FC readings into `readings` for FC printers.
        // So, let's stick to that: if it's an FC printer, we only care about FC reading from the OCR for its main `readings` array.
        // The BW reading from OCR for an FC printer is not added to the primary `readings` array.
        console.warn(`OCR Invoice ${serial} (Inv: ${invoiceNum}): BW reading found for FC printer, but no FC reading. Primary reading not updated from this source for FC type.`);
    }

});


// --- Final Consolidation: Sort and Deduplicate All Readings ---
printerMap.forEach(printer => {
  printer.readings.sort((a, b) => {
    const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateComparison === 0) return a.reading - b.reading; 
    return dateComparison;
  });

  const uniqueReadings: MeterReading[] = [];
  const seenReadings = new Set<string>();
  for (const reading of printer.readings) {
      const key = `${reading.date}-${reading.reading}`; 
      if (!seenReadings.has(key)) {
          uniqueReadings.push(reading);
          seenReadings.add(key);
      }
  }
  printer.readings = uniqueReadings;

  if (printer.readings.length === 0) {
    console.warn(`Printer ${printer.id} (${printer.name}) has zero readings after all processing.`);
  }
});

export const initialPrinters: Printer[] = Array.from(printerMap.values());

if (initialPrinters.length === 0) {
    console.warn("No printers were successfully processed. initialPrinters array is empty.");
}
// Example debug:
// initialPrinters.filter(p => p.id === 'W792300234').forEach(p => {
//    console.log(`Debug Printer (Post-OCR): ${p.id}, Name: ${p.name}, Type: ${p.type}`);
//    p.readings.forEach(r => console.log(`  - Date: ${new Date(r.date).toLocaleDateString()}, Reading: ${r.reading}, Notes: ${r.notes}`));
// });
// initialPrinters.filter(p => p.id === 'W7F3501405').forEach(p => {
//    console.log(`Debug Printer (Post-OCR): ${p.id}, Name: ${p.name}, Type: ${p.type}`);
//    p.readings.forEach(r => console.log(`  - Date: ${new Date(r.date).toLocaleDateString()}, Reading: ${r.reading}, Notes: ${r.notes}`));
// });

