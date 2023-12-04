---
title: "机器学习：模型评估与选择"
description: "Model Evaluation"
pubDate: "11/10/2023"
updatedDate: "11/10/2023"
---

<!--toc:start-->

- [误差](#误差)
- [评估方法](#评估方法)
  - [hold-out](#hold-out)
  - [cross validation](#cross-validation)
  - [bootstrapping 自助法](#bootstrapping-自助法)
- [性能度量](#性能度量)
  - [分类任务](#分类任务)
  - [回归任务](#回归任务)
  <!--toc:end-->

## 误差

- 训练误差 (training error)、经验误差 (empirical error)
- 泛化误差 (generalization error)

过拟合与欠拟合

## 评估方法

> 实验估计方法

### hold-out

将数据集划分为两个互斥的集合，一个作为训练集，一个作为测试集。

### cross validation

将数据集划分为 k 个大小相似的互斥子集，每次用 k-1 个子集的并集作为训练集，剩下的那个子集作为测试集，最终返回这 k 个测试结果的均值。

### bootstrapping 自助法

从给定数据集中有放回地均匀抽取一部分元素组成训练集，在集成学习中用的比较多。

## 性能度量

> 衡量模型泛化能力的评价标准

|          | 预测为正 | 预测为反 |
| -------- | -------- | -------- |
| 真实为正 | TP       | FN       |
| 真实为反 | FP       | TN       |

### 分类任务

- 错误率：分类错误的样本占样本总数的比例
- 精度：分类正确的样本占样本总数的比例
- 查准率：$P = \frac{TP}{TP+FP}$
- 查全率：$R = \frac{TP}{TP+FN}$

以查准率为纵轴、查全率为横轴作图，得到 P-R 曲线。若一个模型的 P-R 曲线被另一个模型包住，则可断言后者的性能优于前者。

- F1 度量：$F1 = \frac{2\times P\times R}{P+R} = \frac{2\times TP}{样本总数 + TP - TN}$
- F1 度量的一般形式：

$$
F_\beta = \frac{(1+\beta^2)\times P\times R}{(\beta^2\times P)+R}
$$

其中 $\beta>1$ 时查全率有更大影响，$\beta < 1$ 时查准率有更大影响。

### 回归任务

- ROC (Receiver Operating Characteristic)
  - 纵轴 True positive rate: $TPR = \frac{TP}{TP+FN}$
  - 横轴 False positive rate: $FPR = \frac{FP}{TN+FP}$
- AUC (Area Under ROC Curve) 越大说明模型性能越好
