---
title: "Transactions"
description: "数据库事物"
pubDate: "12/23/2023"
updatedDate: "12/23/2023"
heroImage: "https://source.unsplash.com/Wpnoqo2plFA"
---

<!--toc:start-->
- [基本概念](#基本概念)
- [调度](#调度)
  - [Conflict serializability 冲突可串行](#conflict-serializability-冲突可串行)
  - [判断是否冲突可串行](#判断是否冲突可串行)
  - [判断是否可恢复](#判断是否可恢复)
  - [Cascading rollback 级联回滚](#cascading-rollback-级联回滚)
<!--toc:end-->

---

## 基本概念

- A collection of operations that form a single logical unit of work.
- A unit of program execution that accesses and possibly updates various data items.

要解决的问题
- Failure management
![steven_he](../../../assets/database/steven_he.jpg)
- Concurrent execution of multiple transactions

要求：ACID
- Atomicity 原子性
- Consistency 一致性
- Isolation 隔离性
- Durability 保持性

transaction 状态
- Active
- Partially committed
- Failed
- Aborted
- Committed

## 调度

### Conflict serializability 冲突可串行

> 此处 $S$ 与 $S^{'}$ 是 schedule

conflict equivalent：
$S$ 可以通过交换一系列不冲突的指令转换为 $S^{'}$，则称 $S$ 与 $S^{'}$ 冲突等价。
冲突可串行意味着一个 schedule 与某个串行的 schedule 冲突等价。

### 判断是否冲突可串行

使用 precedence graph，一个有向图。Precedence graph 中的节点是指令，
节点之间有边 $T_i \rightarrow T_j$ 当且仅当
1. $T_i$ 执行 `write(Q)` 后 $T_j$ 执行 `read(Q)`
2. $T_i$ 执行 `read(Q)` 后 $T_j$ 执行 `write(Q)`
3. $T_i$ 执行 `write(Q)` 后 $T_j$ 执行 `write(Q)`

若 precedence graph 中无环，则该 schedule 是冲突可串行的。

### 判断是否可恢复

若 $T_j$ 在 $T_i$ 写入后读取同一块空间，并且 $T_j$ 先于 $T_i$ commit，
则该 schedule 不可恢复。
例如：

|$T_8$|$T_9$|
|-|-|
|read(A)| |
|write(A)| |
| |read(A)|
|read(B)| |

如果 $T_9$ 在 `read(A)` 后立刻 commit，则不可恢复。

### Cascading rollback 级联回滚

在一个事物出错需要回滚时，受这个事物结果影响的所有操作都需要回滚。

### Cascadeless schedule

不会出现级联回滚的 schedule，对于任意一对事物 $T_i$ 和 $T_j$，
若 $T_i$ `write(Q)` 后 $T_j$ `read(Q)`，
$T_i$ 的 `commit` 在 $T_j$ `read(Q)` 之前。
Cascadeless schedule 都是可恢复的。

