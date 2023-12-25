---
title: "Relational Theory"
description: "关系数据理论"
pubDate: "12/23/2023"
updatedDate: "12/23/2023"
heroImage: "https://source.unsplash.com/Wpnoqo2plFA"
---

<!--toc:start-->
- [问题提出](#问题提出)
- [定义](#定义)
  - [关系模式](#关系模式)
  - [函数依赖*](#函数依赖)
  - [键](#键)
  - [范式*](#范式)
    - [1 NF](#1-nf)
    - [2 NF](#2-nf)
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

## 定义

### 关系模式

一个五元组 $R(U, D, DOM, F)$
- $R$ 关系名
- $U$ 一组属性
- $D$ 属性组 $U$ 中的属性所来自的域
- $DOM$ 为属性到域的映射
- $F$ 为属性组 $U$ 上的一组数据依赖

当且仅当 $U$ 上的一个关系 $r$ 满足 $F$ 时，称 $r$ 为关系模式 $R$ 上的一个关系。

### 函数依赖*

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

### 键
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

### 范式*

$$
\begin{aligned}
1NF \supset 2NF &\supset 3NF \supset BCNF \\
&\supset 4NF \supset 5NF
\end{aligned}
$$

其中 1 NF, 2 NF, 3 NF, BCNF 是函数依赖，4 NF, 5 NF 是多值依赖。

#### 1 NF
作为二维表，关系要符合一个最基本的条件：**每个分量是不可分开的数据项**。

#### 2 NF
在 1 NF 的基础上，每一个非主属性都完全函数依赖于任何一个候选键。
换言之，2 NF 中没有部分函数依赖。

