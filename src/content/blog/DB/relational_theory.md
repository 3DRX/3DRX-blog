---
title: "Relational Theory"
description: "关系数据理论"
pubDate: "12/23/2023"
updatedDate: "1/3/2023"
heroImage: "https://source.unsplash.com/Wpnoqo2plFA"
---

<!--toc:start-->
- [问题提出](#问题提出)
- [关系模式](#关系模式)
- [函数依赖*](#函数依赖)
  - [函数依赖集闭包](#函数依赖集闭包)
  - [属性集闭包](#属性集闭包)
  - [最小覆盖 Minimal Cover](#最小覆盖-minimal-cover)
  - [正则覆盖 Canonical Cover](#正则覆盖-canonical-cover)
- [键](#键)
- [基于函数依赖的关系模式范式*](#基于函数依赖的关系模式范式)
  - [1 NF](#1-nf)
  - [2 NF](#2-nf)
  - [3 NF](#3-nf)
  - [BCNF](#bcnf)
- [多值依赖](#多值依赖)
  - [4 NF](#4-nf)
- [关系模型的分解](#关系模型的分解)
  - [无损连接分解](#无损连接分解)
  - [函数依赖保持](#函数依赖保持)
  - [3 NF Decomposition Algorithm](#3-nf-decomposition-algorithm)
<!--toc:end-->

---

## 问题提出

数据冗余 + 增删改异常

**合适 vs *不合适（斜体）***

解决方式：形式化地表述数据之间的依赖关系
- *多值依赖： $x = f(y)$*
- 函数依赖： $y = f(x)$
    - 完全依赖 vs *部分依赖*
    - *传递依赖*
    - *平凡* vs 非平凡

## 关系模式

一个五元组 $R(U, D, DOM, F)$
- $R$ 关系名
- $U$ 一组属性
- $D$ 属性组 $U$ 中的属性所来自的域
- $DOM$ 为属性到域的映射
- $F$ 为属性组 $U$ 上的一组数据依赖

当且仅当 $U$ 上的一个关系 $r$ 满足 $F$ 时，称 $r$ 为关系模式 $R$ 上的一个关系。

## 函数依赖*

对属性集 $R(U)$ 中任意一个可能的关系 $r$，不可能存在两个原组
在 $X$ 上的属性相等，而在 $Y$ 上的属性不等
（即对给定的 $X$，有唯一确定的 $Y$），则称“$X$ 函数确定 $Y$”
或“$Y$ 函数依赖于 $X$”，记作 $X \rightarrow Y$。

平凡与非平凡
- $X \rightarrow Y$，但 $Y \subsetneq X$ 是**非平凡**的函数依赖
- $X \rightarrow Y$，但 $Y \subseteq X$ 是**平凡**的函数依赖
（显然成立）

完全与部分
- 若对 $X$ 的任意一个真子集 $X^{'}$，都有 $X^{'} \nrightarrow Y$，
则称 $Y$ 对 $X$ **完全函数依赖**，记作 $X \stackrel{F}{\rightarrow} Y$。
- 若 $Y$ 不完全函数依赖于 $X$，则称 $Y$ 对 $X$ **部分依赖**，记作
$X \stackrel{P}{\rightarrow} Y$。

传递函数依赖：满足
1. $X \rightarrow Y \; (Y \subsetneq X)$
2. $Y \nrightarrow X$
3. $Y \rightarrow Z$
4. $Z \subsetneq Y$

则称 $Z$ 对 $X$ 传递函数依赖（transitive functional dependency），
记为 $X \stackrel{传递}{\rightarrow} Z$。

### 函数依赖集闭包

$F^+$（一个关系的集合）是关系集合 $F$ 在 $R(U, F)$ 上的闭包，
当且仅当 $F^+$ 中的所有关系都可由 $F$ 中的关系推出。

例子：
$$
\begin{aligned}
given \\
R &= (A, B, C, G, H, I) \\
F &= \{ \\
& \; A \rightarrow B, \\
& \; A \rightarrow C, \\
& \; CG \rightarrow H, \\
& \; CG \rightarrow I, \\
& \; B \rightarrow H, \\
\} \\
then \\
F^+ &\supseteq \{ \\
& \; A \rightarrow H, \\
& \; AG \rightarrow I, \\
& \; CG \rightarrow HI, \\
\}
\end{aligned}
$$

### 属性集闭包

根据函数依赖能够推出的所有属性的集合，例子：

$$
\begin{aligned}
given \\
R &= (A, B, C, G, H, I) \\
F &= \{ \\
& \; A \rightarrow B, \\
& \; A \rightarrow C, \\
& \; CG \rightarrow H, \\
& \; CG \rightarrow I, \\
& \; B \rightarrow H, \\
\} \\
then \\
(AG)^+ &= \{A, B, C, G, H, I\}
\end{aligned}
$$

### 最小覆盖 Minimal Cover
也称最小函数依赖，可能不唯一。求解方式：
1. 右侧化为单属性（多属性的拆开写）
2. 去掉左侧冗余属性
3. 去掉冗余函数依赖

### 正则覆盖 Canonical Cover
$F_c$ 是 $F$ 的正则覆盖，需要满足下列条件：
1. $F$ 逻辑蕴含所有 $F_c$ 中的依赖
2. $F_c$ 逻辑蕴含所有 $F$ 中的依赖
3. $F_c$ 中不包含无关的函数依赖
4. $F_c$ 中所有函数依赖左侧是不重复的

求解正则覆盖的方式：
1. 先求最小函数依赖
2. 将最小函数依赖合并，如 $A \rightarrow B$, $A \rightarrow C$
合并为 $A \rightarrow BC$

## 键
- 候选键：可以唯一标志一个原组
- 主键：从候选键中挑一个
- 主属性*：包含在任何一个**候选键**中的属性，称为主属性 primary attribute
- 非主属性：不包含在任何键中的属性 non-primary / non-key attribute
- 全键：整个属性组是码，all-key

例子：以下属性中
```
(A, B, C, D, E)
```
`{A, B}`，`{B, C}` 都可以唯一标志一个原组。则：
- `{A, B}` 和 `{B, C}` 都是候选键
- `A`, `B`, `C` 都是主属性（不管 `{A, B}` 和 `{B, C}` 哪个是主键）

## 基于函数依赖的关系模式范式*

$$
\begin{aligned}
1NF \supset 2NF &\supset 3NF \supset BCNF \\
&\supset 4NF \supset 5NF
\end{aligned}
$$

其中 1 NF, 2 NF, 3 NF, BCNF 是函数依赖，4 NF, 5 NF 是多值依赖。

### 1 NF
作为二维表，关系要符合一个最基本的条件：**每个分量是不可分开的数据项**。

### 2 NF
在 1 NF 的基础上，每一个非主属性都完全函数依赖于任何一个候选键。
换言之，2 NF 中没有部分函数依赖。
如果一个关系模式不符合 2 NF，则会出现增删改异常，
因为非主属性存在对候选键的部分依赖。

关系模式不符合 2 NF 的解决方式（1 NF 转 2 NF）：模式分解（拆表）

### 3 NF

因为存在传递函数依赖，
所以只满足 2 NF 仍然存在数据冗余和增删改异常，因此需要更严格的规范化。
因此，3 NF 的定义就是在 2 NF 的基础上，没有非主属性对候选键的传递函数依赖。
从 2 NF 转 3 NF 的方法也是拆表。如果 $X \rightarrow Y \rightarrow Z$，
则 $X$, $Y$ 一个表，$Y$, $Z$ 一个表。

### BCNF

两种判断思路
1. 每一个决定属性集都包含候选键（即所有箭头左边都是候选键）。
2. 主属性内部不存在部分和传递依赖关系。

## 多值依赖

一个 $X$ 可以导出多个 $Y$，每个 $Y$ 之间可能也存在关系。

定义：设 $R(U)$ 是属性集 $U$ 上的一个关系模式。$X, Y, Z$ 是 $U$ 的子集，
并且 $Z = U - X - Y$。关系模式 $R(U)$ 中多值依赖 $X \rightarrow \rightarrow Y$
成立，当且仅当对 $R(U)$ 的任一关系 $r$，给定的一对 $(x, z)$ 值，有一组 $Y$ 的值，
这组值仅仅决定于 $x$ 值而与 $z$ 值无关。

### 4 NF

把多值依赖拆解成函数依赖。

## 关系模型的分解

### 无损连接分解
若 $R_1 \cap R_2 \rightarrow R_1$
或 $R_1 \cap R_2 \rightarrow R_2$，
则 $R_1$ 与 $R_2$ 是 $R$ 的 lossless-join decomposition 成立。

如：
$$
\begin{aligned}
R &= (A, B, C, D, E) \\
F &= {AB \rightarrow C, C \rightarrow DE} \\
R_1 &= (A, B, C) \\
R_2 &= (C, D, E) \\
\end{aligned}
$$
$R_1$ 与 $R_2$ 是 $R$ 的无损连接分解。

### 函数依赖保持
$$
(F_1 \cup F_2 \cup ... \cup F_n)^+ = F^+
$$
如：
$$
\begin{aligned}
F &= \{A \rightarrow B, B \rightarrow C\} \\
F_1 &= \{A \rightarrow B\} \\
F_2 &= \{A \rightarrow C\}
\end{aligned}
$$
不是函数依赖保持的分解，$B \rightarrow C$ 函数依赖丢失了。

### 3 NF Decomposition Algorithm
将关系模型分解为第三范式，同时保持无损连接和函数依赖。
1. 求 $F$ 的 canonical cover $F_c$
2. 对 $F_c$ 中的每一个函数依赖 $\alpha \rightarrow \beta$，
如果不存在包含 $\alpha$ 和 $\beta$ 的表，拆出一张新表 $R_n(\alpha, \beta)$
3. 如果拆出的子表中没有任何一个包含候选键，则将候选键作为一个单独的子表
