---
title: "计算机组成原理：运算方法与运算器"
description: "Computer Organization: Arithmetic Logic"
pubDate: "06/16/2023"
updatedDate: "06/16/2023"
heroImage: "https://source.unsplash.com/jXd2FSvcRr8"
---

<!--toc:start-->

- [整数](#整数)
  - [定点加、减法运算](#定点加减法运算)
  - [定点乘法运算](#定点乘法运算)
  - [习题](#习题)
- [浮点数](#浮点数)
  - [浮点数表示 IEEE 754](#浮点数表示-ieee-754)
  - [浮点数运算](#浮点数运算)
  - [习题](#习题)
  <!--toc:end-->

## 整数

### 定点加、减法运算

补码加法：[x]补 + [y]补 = [x+y]补

补码减法：[x-y]补 = [x]补 - [y]补 = [x]补 + [-y]补

### 定点乘法运算

原码一位乘法运算：符号位异或，其他位乘法。运算过程与十进制乘法类似（竖式）。

### 习题

**_某加法器进位链小组信号为C4C3C2C1，低位来的进位信号为C0，请分别按下述两种方式写出C4C3C2C1的逻辑表达式：_**

_(1) 串行进位方式_

_(2) 并行进位方式_

令$G_i = A_iB_i$，$P_i = A_i \oplus B_i$

1. 串行
   1. $C_1 = G_1 + P_1C_0$
   2. $C_2 = G_2 + P_2C_1$
   3. $C_3 = G_3 + P_3C_2$
   4. $C_4 = G_4 + P_4C_3$
2. 并行
   1. $C_1 = G_1 + P_1C_0$
   2. $C_2 = G_2 + P_2G_1 + P_2P_1C_0$
   3. $C_3 = G_3 + P_3G_2 + P_3P_2G_1 + P_3P_2P_1C_0$
   4. $C_4 = G_4 + P_4G_3 + P_4P_3G_2 + P_4P_3P_2G_1 + P_4P_4P_3P_1C_0$

## 浮点数

### 浮点数表示 IEEE 754

- S: 0正1负
- Exp: 阶码
- Frac: 尾数

$$
(-1)^S \cdot (1+Frac) \cdot 2^{Exp - Bias}
$$

$$
Bias = 2^{Exp长度-1} - 1
$$

32位float: S1 Exp8 Frac23

64位double: S1 Exp11 Frac52

### 浮点数运算

1. 对阶：小阶向大阶看齐。小阶每次尾数右移一位，阶码加一，直到阶码相同为止。
2. 尾数相加
3. 结果规格化（使尾数处于规格化范围内）：
   - 左规
     - 若尾数为原码，应使结果为x.1xxx
     - 若尾数为补码，最高位与符号位相反
     - 对 IEEE 754，尾数应为 1.M 形式
   - 右规
     - 若尾数形如01.xx..x或10.xx..x，应将其右移一位，阶码加一
4. 检查上溢或下溢
5. 舍入处理
   - 就近舍入（向偶数舍入）(默认是这个)：如果尾数超出共3为001, 010, 011舍去；101, 110, 111进位；
     100 看最低有效位，若为0则舍去，为1则进位，此时舍入结果始终为偶数
   - 朝0舍入：向数轴原点方向截断
   - 朝$+\infty$舍入：负数截断，正数多余不全为0就进位
   - 朝$-\infty$舍入：与👆相反

### 习题

_将下列十进制数表示成IEEE754标准的32位浮点规格数_

_(1) 27/64_

$27/64 = 0.011011 = 1.1011×2^{-2}$

S = 0

E = -2 + 127 = 125 = 0111 1101

M = 1011 0000 ... 0000

结果：0 01111101 1011 0000 0000 0000 0000 000

\*(2) -27/64

S 取反，其他一样

结果：1 01111101 1011 0000 0000 0000 0000 000

**_下列各数使用了IEEE 32位浮点格式，相等的十进制是什么？_**

_(1) 1 10000011 110 0000 0000 0000 0000 0000_

S = 1

Exp = 1000 0011 = 131

Frac = 110 0000 ... 0000

E = 131 - 127 = 4

M = 1.11

$X = -(1.11\times 2^4)$ = - 11100 = -28

_(2) 0 01111110 101 0000 0000 0000 0000 0000_

S = 0

Exp = 0111 1110 = 126

Frac = 101 0000 ... 0000

E = 126 - 127 = -1

M = 1.101

$X = 1.101 \times 2^-1$ = 0.1101 = 0.8125

**_32位字长的浮点数，其中阶码8位（含1位阶符），基数是2，尾数24位（含1位数符）。
当机器数采用原码表示，则其对应的最小正数、最小负数是多少？
当机器数采用补码表示，且尾数为规格化形式，则其对应的最大正数、最大负数是多少？_**

1. 原码表示时
   - 尾数非规格化
     - 最小正数：$2^{-127}\times 2^{-23}$
     - 最小负数：$-2^{127}\times (1 - 2^{-23})$
   - 尾数规格化
     - 最小正数：$2^{-127}\times 2^{-1}$
     - 最小负数：$-2^{127}\times (1 - 2^{-23})$
   - 故最小正数 $2^{-127}\times 2^{-23}$，最小负数 $-2^{127}\times (1 - 2^{-23})$。
2. 补码表示时
   - 尾数规格化
     - 最大正数：$2^{127}\times (1-2^{-23})$
     - 最大负数：$-2^{-128}\times (2^{-1} + 2^{-23})$

**_设阶码3位，尾数6位，按浮点运算方法，完成下列取值的[x + y]，[x - y]运算：_**

_(1) $x = 2^{-011}0.100101$, $y = 2^{-010}(-0.011110)$_

对阶为-010

_(2) $x = 2^{-101}(-0.010110)$, $y = 2^{-100}0.010110$_