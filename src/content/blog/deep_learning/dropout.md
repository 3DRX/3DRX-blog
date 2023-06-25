---
title: "Deep Learning: Dropout regularization"
description: "深度学习中的丢弃法"
pubDate: "06/25/2023"
updatedDate: "06/25/2023"
heroImage: "https://source.unsplash.com/CyFBmFEsytU"
---

## 动机

一个好的模型需要对输入数据的扰动鲁棒，丢弃法实质：在层之间加入噪音。

## 细节

目标是要无偏差：$E[x'] = x$，对于 $x$ 加入噪音得到的 $x'$。

$$
x'_i = \left\{
\begin{aligned}
&0 \;\;\;\;\; with \; probability \; p\\
&\frac{x_i}{1-p} \;\;\; otherwise\\
\end{aligned}
\right.
$$

## 使用

通常用在隐藏全连接层的输出上，且只在训练中使用，预测时不使用正则项。
在 MLP 中用的比较多，在 CNN 等模型中用得少。
丢弃的概率 $p$ 是控制模型复杂度的超参数，通常取值：0.5, 0.7, 0.9。

