---
title: "OS: Process Synchronization"
description: "操作系统进程同步"
pubDate: "12/31/2023"
updatedDate: "12/31/2023"
heroImage: ""
---

<!--toc:start-->
- [Peterson's Solution](#petersons-solution)
- [硬件实现方法](#硬件实现方法)
  - [中断屏蔽](#中断屏蔽)
  - [TestAndSet 指令](#testandset-指令)
  - [CompareAndSwap 指令](#compareandswap-指令)
- [Mutex Lock](#mutex-lock)
- [Semaphore](#semaphore)
- [管程](#管程)
- [Deadlock](#deadlock)
  - [预防死锁 Prevention](#预防死锁-prevention)
  - [避免死锁 Avoidance](#避免死锁-avoidance)
  - [死锁的检测](#死锁的检测)
  - [死锁的解除](#死锁的解除)
<!--toc:end-->

---

## Peterson's Solution
软件实现的用于两个进程间互斥访问临界区的方法
- 一个 turn 变量
- 一个 flag[2] 数组，表示两个进程想要进入临界区的意愿

缺点，不使用于多处理器多进程同步的情况。

## 硬件实现方法

### 中断屏蔽
只能在内核中使用

### TestAndSet 指令
原子的硬件实现的指令，实现如下逻辑功能
```c
bool TestAndSet (bool *lock) {
    bool old = *lock;
    *lock = true;
    return old;
}
```
使用时进行如下操作
```c
while (TestAndSet(&lock));
// critical section
lock = false;
```
适用于多处理器，但不满足让权等待。

### CompareAndSwap 指令
硬件指令实现如下功能
```c
void CompareAndSwap(bool *a, bool *b) {
    bool temp = *a;
    *a = *b;
    *b = temp;
}
```
使用时进行如下操作
```c
bool old = true;
while (old == true)
    CompareAndSwap(&lock, &old);
// critical section
lock = false;
```

## Mutex Lock
互斥锁，上锁解锁操作具有原子性。

## Semaphore
信号量，解决了上面所有方法都不能“让权等待”的问题。
`wait(S)` 和 `signal(S)` 操作具有原子性， 这两个操作也称 `P(S)`，`V(S)` 操作。
其中 `wait` 操作时会阻塞进程，而非自旋忙等。`Semaphore` 数据结构的定义如下
```c
typedef struct {
    int value;
    struct Process *L;
} Semaphore;
```

## 管程
为什么要引入管程？在出现管程之前，人们就是手动写 PV 操作来实现进程同步。
管程就是编程语言内对同步机制的更高层的抽象，如 JAVA 中的 `synchronized` 关键字，
表明一个函数或一个对象在同一时间内只能被一个线程调用，
这个是由语言的编译器或解释器实现的。

## Deadlock
必要条件
- 互斥条件
- 不剥夺条件（一个进程获取一个资源后在其完成操作前如果被阻塞不会释放已获取的资源）。

### 预防死锁 Prevention
静态策略
- 破坏互斥条件
spooling
- 破坏不剥夺条件
- 破坏请求和保持条件
运行前就分配好所有需要的资源
- 破坏循环等待条件
给资源编号，按照顺序申请资源，缺点是不方便增加新设备

### 避免死锁 Avoidance
动态策略，银行家算法，定义一种更容易通过规则保证和维护的安全状态，
安全状态是不会发生死锁的状态的超集。

安全序列是按照一个特定的序列执行并发的任务，每个进程都能顺利完成并释放资源。
只要能找到一个安全序列，当前状态就是安全状态。

### 死锁的检测
资源分配图：一种数据结构，有两种节点
1. 进程节点
2. 资源节点

和两种边
1. 请求边：进程节点 -> 资源节点，表示进程在申请使用这个资源
2. 分配边：资源节点 -> 进程节点，表示这个资源被分配给了这个进程

当一个进程能够正常执行结束时，将其所有的边删除。
如果出现死锁，则资源分配图中无法消除所有的边。

### 死锁的解除
1. 资源剥夺法
2. 撤销进程法
3. 进程回退法

执行这些操作时，可以考虑进程的特征
1. 优先级
2. 已执行时间
3. 剩余执行时间
4. 已使用资源量
5. 是交互式进程还是批处理进程

