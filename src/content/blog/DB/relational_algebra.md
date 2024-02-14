---
title: "Relational Algebra"
description: "关系代数"
pubDate: "12/21/2023"
updatedDate: "12/22/2023"
heroImage: "https://source.unsplash.com/Wpnoqo2plFA"
---

<!--toc:start-->
- [集合运算](#集合运算)
  - [并 Union $\cup$](#并-union-cup)
  - [差 Difference $-$](#差-difference)
  - [交 Intersection $\cap$](#交-intersection-cap)
  - [笛卡尔积 Cartesian Product $\times$](#笛卡尔积-cartesian-product-times)
- [关系运算](#关系运算)
  - [记号](#记号)
  - [选择 $\sigma$](#选择-sigma)
  - [投影 $\Pi$](#投影-pi)
  - [连接 $\Join$](#连接-join)
    - [常用的连接运算](#常用的连接运算)
  - [除 $\div$](#除-div)
    - [例子](#例子)
<!--toc:end-->

---

## 集合运算

> - 参与运算的关系具有相同的目
> - 相应的属性取自同一个域

### 并 Union $\cup$

$$
R \cup S = \{t | t \isin R \vee t \isin S\}
$$

### 差 Difference $-$

$$
R - S = \{t | t \isin R \wedge t \notin S\}
$$

### 交 Intersection $\cap$

$$
\begin{aligned}
R \cap S &= \{t | t \isin R \wedge t \isin S\} \\
R \cap S &= R - (R - S)
\end{aligned}
$$

---

### 笛卡尔积 Cartesian Product $\times$

- R: n 目关系，$k_1$ 个元组  
- S: m 目关系，$k_2$ 个元组

$$
R \times S = \{
\mathop{t_r t_s}\limits^{\frown} | t_r \isin R \wedge
t_s \isin S
\} 
$$

结果有 $m + n$ 列和 $k_1 \times k_2$ 行。

## 关系运算

> 结果仍是表

### 记号

- $R$
- $t \isin R$
- $t[A_i]$

设关系模式为 $R(A_1, A_2, ..., A_n)$，它的一个关系设为 $R$，
$t \isin R$ 表示 $t$ 是 $R$ 的一个元组，$t[A_i]$ 则表示元组 $t$
中相应对于属性 $A_i$ 的一个分量。

- $A$
- $t[A]$
- $\overline{A}$

$A$ 是属性列（属性组），$t[A]$ 是元素 $t$ 在 $A$ 上各个分量的集合，
$\overline{A}$ 是去掉某一列以外其他的列组成的属性组。

- $\mathop{t_r t_s}\limits^{\frown}$

原组的连接。

- 象集 Images Set $Z_x$

给定一个关系 $R(X, Z)$，$X$ 和 $Z$ 为属性组，
当 $t[X] = x$ 时，$x$ 在 $R$ 中的象集为
$$
Z_x = \{t[Z] | t \isin R, t[X] = x\}
$$
表示 $R$ 中属性组 $X$ 上值为 $x$ 的各个原组在 $Z$ 上分量的集合。

### 选择 $\sigma$

$$
\sigma_{Sdept='IS'}(Student)
$$

### 投影 $\Pi$

$$
\Pi_{Sname, Sdept}(Student)
$$

### 连接 $\Join$

$$
\begin{aligned}
&R \underset{A \theta B}\Join S =\\
&\{
\mathop{t_r t_s}\limits^{\frown} | t_r \isin R \wedge t_s \isin S
\wedge t_r[A] \theta t_s[B]
\}
\end{aligned}
$$

#### 常用的连接运算

- 等值连接：上面 $\theta$ 定义为 $=$
- 自然连接：特殊的等值连接，在结果中**把重复的属性列去掉**
- 外连接：对于关系 $R$ 中有而关系 $S$ 中没有的元素，
外连接会创建对应的原组，将空缺设置为 NULL，
外连接分为左外连接、右外连接。

### 除 $\div$

$$
R \div S = \{t_r[X] | t_r \isin R \wedge \Pi_Y(S) \subseteq Y_x\}
$$

其中 $Y_x$ 是 $x$ 在 $R$ 中的象集，$x = t_r[X]$。

#### 例子

$R$：

|A|B|C|
|-|-|-|
|a1|b1|c2|
|a2|b3|c7|
|a3|b4|c6|
|a1|b2|c3|
|a4|b6|c6|
|a2|b2|c3|
|a1|b2|c1|

$S$：

|B|C|D|
|-|-|-|
|b1|c2|d1|
|b2|c1|d1|
|b2|c3|d2|

$R \div S$：

|A|
|-|
|a1|

步骤：

1. 关系 $R$ 中 $A$ 可以取 4 个值
    - $a1$ 在 $R$ 上的象集是 $\{(b1, c2), (b2, c3), (b2, c1)\}$
    - $a2$ 在 $R$ 上的象集是 $\{(b3, c7), (b2, c3)\}$
    - $a3$ 在 $R$ 上的象集是 $\{(b4, c6)\}$
    - $a4$ 在 $R$ 上的象集是 $\{(b6, c6)\}$
2. $S$ 在 $(B, C)$ 上的投影为 $\{(b1 c2), (b2, c1), (b2, c3)\}$
只有 $a1$ 的象集包含在了这之中，所以 $R \div S = \{a1\}$

> 思想：包含

