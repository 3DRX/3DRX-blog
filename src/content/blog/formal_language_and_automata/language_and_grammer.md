---
title: "形式语言与自动机：语言及文法"
description: "Formal language and automata: language and grammer"
pubDate: "06/19/2023"
updatedDate: "06/19/2023"
heroImage: "https://source.unsplash.com/cvBBO4PzWPg"
---

## 符号语言

大写字母表示串，小写字母表示单个字符（终结符），
$\epsilon$ 表示空串。

$|A|$: 字符串 $A$ 的长度

$\widetilde{A}$: 字符串 $A$ 的逆（翻转）

格局：$(q, \omega)$ 其中 q 是状态，$\omega$ 是待输入串。
- 初始格局：$(q_0, \omega)$
- 终止格局：$(q_1, \epsilon)$

例如：

$$
(q_0, 0010) |- (q_1, 010) |- (q_2, 10) |- (q_2, 0) |- (q_0, \epsilon)
$$

## 文法

$$
G = (N, T, P, S)
$$
- $N$: 非终结符集合
- $T$: 终结符集合
- $P$: 生成式
- $S$: 起始符

## 文法的分类

### 0 型文法

无限制性语言。

### 1 型文法

上下文有关文法，形式为 $\alpha \rightarrow \beta$，
其中 $|\alpha| \leq |\beta|$，$\alpha$ 至少含有一个
非终结符号。

### 2 型文法

上下文无关文法，形式为 $A \rightarrow \alpha$。

### 3 型文法

正则文法。形式为 $A \rightarrow \omega B$ 或
$A \rightarrow \omega$ 的称右线性文法，
形式为 $A \rightarrow B \omega$ 或 $A \rightarrow \omega$
的称左线性文法。

## 例题

***由语言生成文法***

略

***由文法生成式得到语言***

略

> 没有特别统一的算法，看造化构造。

