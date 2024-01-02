---
title: "Concurrency Control"
description: "并发控制"
pubDate: "12/25/2023"
updatedDate: "12/25/2023"
heroImage: "https://source.unsplash.com/Wpnoqo2plFA"
---

<!--toc:start-->
- [问题提出](#问题提出)
- [Locks](#locks)
  - [Two-phase locking](#two-phase-locking)
  - [Multiple Granularity Lock](#multiple-granularity-lock)
<!--toc:end-->

---

## 问题提出

- 保证执行任务之间的串行关系
- 在运行时判断任务之间是否冲突可串行太晚了

解决方式

- Lock-based
- Timestamp-based

## Locks

对数据对象而言，有 2 种锁（可以同时读但不能同时写或同时读和写）
1. 互斥锁 X
2. 共享锁 S

Lock based protocol 就是任务执行过程中通过加锁解锁来控制并发，
缺点：
- 会产生死锁
- 如果读写非原子操作，不能保证正确执行
- 可能导致饥饿

### Two-phase locking

1. Growing phase
    - 可以加锁
    - 不可以释放锁
2. Shrinking phase
    - 可以释放锁
    - 不可以加锁

保证冲突可串行（会级联回滚），不能保证避免死锁。

#### Strict two-phase locking
所有互斥锁（X锁）需要保持到 commit 或 abort 时再释放。

#### Rigorous two-phase locking
更严格，所有锁都要保持到commit 或 abort 时才能释放。
此时，事物可以按照 commit 的顺序串行。

### Multiple Granularity Lock

锁控制的数据对象可以是不同大小，不同层级的，
可以被图形化地表示为一颗树。
