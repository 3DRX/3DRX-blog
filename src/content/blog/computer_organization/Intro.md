---
title: "计算机组成原理：计算机系统概论"
description: "Computer Organization: Introduction"
pubDate: "06/16/2023"
updatedDate: "06/16/2023"
heroImage: "https://source.unsplash.com/jXd2FSvcRr8"
---

<!--toc:start-->
- [计算机的性能指标](#计算机的性能指标)
- [变形补码计算](#变形补码计算)
- [习题](#习题)
<!--toc:end-->

## 计算机的性能指标

    CPU 执行时间 = CPU 时钟周期数 * CPU 时钟周期

CPI (Click Per Instruction): 每条指令周期数

    CPI = 某段程序执行总时间 / 程序指令条数

MIPS (Million Instructions Per Second): 每秒百万指令数

    MIPS = 指令数 / (程序执行时间 * 10^6)

FLOPS (Floating-point Operations Per Second): 每秒执行浮点操作的次数

    FLOPS = 程序中的浮点操作次数 / 程序执行时间(s)

## 变形补码计算

判断是否溢出：两位补码都为1或0则不溢出

## 习题

*1、某计算机主频为1.44GHz，其指令分为A、B、C、D四类，对应的CPI依次为2、3、4、6，
我们可通过运行一基准程序来测定该机的执行速度，
已知在这段基准程序中A、B、C、D这四类指令占所占比例依次为40%、20%、10%、30%，请问该机的MIPS数是多少？*

    IPS = 1.44G / (2*40% + 3*20% + 4*10% + 6*30%)
    MIPS = IPS / 10^6 = 400

*2、某字长为8位的计算机中，已知整形变量x、y的机器数分别为[x]补=11110101，[y]补=10010100。
若整形变量z=2*x + y/4，则z的机器数是多少？*

    2x: x 左移1位 [x']补 = 11101010
    y/4: y 算术右移2位 [y']补 = 11100101
    [z]补 = [x']补 + [y']补 = 11001111

*3、已知x和y，用变形补码计算x+y，同时指出结果是否溢出*

*(1) x = 1 1011，y = 0 0011*

    [x+y]补 = 00.11110 没有溢出 x+y = 11110

*(2) x = 1 1011，y = -1 0101*

    [x+y]补 = 00.00110 没有溢出 x+y = 00110

*(3) x = -1 0110，y = -0 0001*

    [x+y]补 = 11.01001 没有溢出 x+y = -10111

*4、已知x和y，用变形补码计算x - y，同时指出运算结果是否溢出。*

*(1) x = 1 1011，y = -1 1111*

    [x-y]补 = 01.11010 溢出 x-y = 11010

*(2) x = 1 0111，y = 1 1011*

    [x-y]补 = 11.11100 没有溢出 x-y = -00100

*(3) x = 1 1011，y = -1 0011*

    [x-y]补 = 01.01110 溢出 x-y = 01110



