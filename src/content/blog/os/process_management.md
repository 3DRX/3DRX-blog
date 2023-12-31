---
title: "OS: Process & its management"
description: "操作系统进程管理"
pubDate: "12/31/2023"
updatedDate: "12/31/2023"
heroImage: ""
---

<!--toc:start-->
- [进程](#进程)
  - [PCB: Process Control Block](#pcb-process-control-block)
  - [进程的状态](#进程的状态)
  - [进程的控制](#进程的控制)
  - [进程调度器](#进程调度器)
  - [进程间通信](#进程间通信)
- [线程](#线程)
<!--toc:end-->

---

## 进程
一个进程的实体由 PCB，程序段，数据段组成，
是系统进行资源分配和调度的一个独立单位，是资源分配的基本单位。

### PCB: Process Control Block
用于存储每个进程的资源占用情况、运行情况、进行现场保护，
CPU 切换当前执行的进程时，其上下文全部由 PCB 存储、导出。
- process state
- program counter
- CPU registers
- CPU-scheduling information
- memory-management information
- accounting information
- I/O status information

PCB 是进程存在的唯一标志。

### 进程的状态
- 创建态
- 就绪态
- 运行态
- 阻塞态
- 终止态

### 进程的控制
状态转换：原子性地将 PCB 的 state 变更，同时将进程从一个队列移动到另一个队列。
原子性由原语提供，通过关中断、开中断实现。

### 进程调度器

- Long-term scheduler: Job scheduler
决定将哪个进程放进 Ready queue，协调 CPU 为主（CPU-bound）和 I/O 为主（I/O-bound）的程序在 PSQ 中的比例。调度操作频率较低。
- Medium-term scheduler:
长期调度程序的一种替代在 PSQ 过大的时候从其中选择一些进程移出 PSQ。
- Short-term scheduler: CPU scheduler
决定 CPU 接下来执行队列中的那个进程，加载进程运行环境并分配 CPU 资源。

### 进程间通信

- 共享内存，如 Linux 中的 `shm` 申请一片共享内存，再通过 `mmap` 将共享内存区
映射到进程自己的地址空间。不同进程访问共享内存的操作应该是互斥的。
- 消息传递
    - 消息机制：PCB 中保存着一个消息队列，操作系统提供的
    发送原语将消息挂到目标进程的消息队列中。
    - 管道：在内存中分配一个大小固定的内存缓冲区，缓冲区是先入先出的。
    当管道写满时，写进程将被阻塞，直到读进程将管道中的数据取走，即可唤醒写进程。
    当管道空时，读进程将被阻塞，直到写进程向管道中写入数据，即可唤醒读进程。

## 线程

