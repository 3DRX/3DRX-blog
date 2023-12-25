---
title: "Recovery System"
description: "恢复系统"
pubDate: "12/25/2023"
updatedDate: "12/25/2023"
heroImage: "https://source.unsplash.com/Wpnoqo2plFA"
---

<!--toc:start-->
- [概念](#概念)
  - [Failure Classification](#failure-classification)
  - [Recovery Algorithms](#recovery-algorithms)
  - [Storage Sturcture](#storage-sturcture)
- [Log-based Recovery](#log-based-recovery)
<!--toc:end-->

---

## 概念
### Failure Classification

Transaction failure
- 逻辑错误：事物因内部错误状态无法完成。
- 系统错误：数据库系统出错（如死锁）。

System crash
数据库所运行在的硬件、软件系统出错
- Fail-stop assumption：默认非易失的数据不会在 system crash 中出错。

Disk failure
持久化存储的介质出错，默认出错可以被探测到（如 checksum）。

### Recovery Algorithms

组成
1. 正常事物执行时记录足够的信息，用于恢复。
2. Failure 出现时进行处理，保证 ACID。

### Storage Sturcture

- Volatile storage 易失的存储
- Nonvolatile storage 可以经受 system crash
- Stable storage 理论上（数据库运行的环境中可以做到的最安全）
可以抵御一切错误的存储（如 RAID）

Physical block 是在磁盘上的块，
Buffer block 是临时加载到内存中的块。

## Log-based Recovery

log 存储在 stable storage 上

```
<Ti start>
<Ti, X, V1, V2>
<Ti commit>
<Ti abort>
```

### undo(Ti)
将所有被 Ti 影响到的数据对象回滚到之前的状态

### redo(Ti)
将所有 Ti 影响到的数据对象的值设置为新值

> 上述两种操作都是幂等的（即可以重复执行若干次结果不变）

### 两种策略的使用
使用undo(Ti)
- Ti 已经开始
- 但是没有 commit 或 abort

需要 undo 意味着这个 Ti 本身有问题，所以不能重新执行，
需要将系统状态恢复到 Ti 执行之前。

使用redo(Ti)
- Ti 已经开始
- 存在 commit 或 abort

需要 redo 意味着 Ti 本身没有出错，而是受到了其他错误的影响，
因此需要重新执行。

### Check point
- 将所有的 log record 从内存写入存储
- 将所有发生改变的数据块写入磁盘
- 在 log 中加上一个 checkpoint 记录

因为 checkpoint 前的所有操作已经写如磁盘持久化存储，
在 checkpoint 前完成的操作不需要 redo。

### 例题
```
<T1 start>
<T1, A, 100, 200>
<T2, start>
<T3, start>
<T2, B, 200, 100>
<T1, commit>
<T3, C, 0, 100>
<T3, C, 100, 400>
<checkpoint {T2, T3}>
<T4, start>
<T4, A, 200, 400>
<T5, start>
<T2, B, 100, 200>
<T5, D, 300, 100>
<T5, commit>
<T4, A, 400, 250>
<T3, C, 0>
<T4, commit>
<T3, abort>
**Crash**
```
- redo: T1, T5, T4
- undo: T2, T3

恢复后 A, B, C, D 依次为：250, 200, 0, 100
