---
title: "OS: File System"
description: "操作系统文件系统"
pubDate: "12/31/2023"
updatedDate: "1/6/2024"
heroImage: ""
---

<!--toc:start-->
- [操作](#操作)
- [逻辑结构](#逻辑结构)
- [物理结构](#物理结构)
  - [连续分配](#连续分配)
  - [链接分配](#链接分配)
    - [隐式链接](#隐式链接)
    - [显式链接](#显式链接)
  - [索引分配](#索引分配)
- [存储空间管理](#存储空间管理)
  - [空闲表法](#空闲表法)
  - [空闲链表法](#空闲链表法)
    - [空闲盘块链](#空闲盘块链)
    - [空闲盘区链](#空闲盘区链)
  - [位视图法](#位视图法)
  - [成组链接法](#成组链接法)
<!--toc:end-->

---

## 操作
File Operations:
- create
- write
- read
- reposition within file
- delete
- truncate

Directory Operations:
- search for a file
- create a file
- delete a file
- list a directory
- rename a file
- traverse the file system

## 逻辑结构
- 无结构文件
- 有结构文件
    - 顺序文件
    - 索引文件
    - 索引顺序文件

文件目录是由 FCB 组成的存放文件名、类型、存取权限、物理位置等等，
文件目录结构
- 树型结构
- 有向无环图结构

索引结点（FCB 的改进），由文件名和索引结点指针组成，
目录表所需空间更小，因而在一个磁盘块中能存放更多的目录项，
提升文件检索速度。

## 物理结构
文件的逻辑地址也被分为了一个个的逻辑块，
操作系统为文件分配存储空间都是以块为单位的。
不同的文件分配方式，就是不同的把逻辑块号映射为物理块号的方式。

### 连续分配
每个文件在磁盘上占有一组连续的块，文件目录中记录存放的起始块号和长度。
则物理块号 = 起始块号 + 逻辑块号。
> 支持顺序访问和随机访问，在顺序读、写时速度最快。不方便拓展，
存储空间利用率低，会产生磁盘碎片。

### 链接分配
#### 隐式链接
目录中记录文件存放的起始块号和结束块号，除了文件的最后一个磁盘块之外，
每个磁盘块种都会保存指向下一个磁盘块的指针。
> 只支持顺序访问，不支持随机访问。方便拓展文件，不会有碎片问题，
外存利用率高。

#### 显式链接
把用于链接文件各物理块的指针显式地存放在一张表中，即 FAT File Allocation Table。
目录中只记录文件的起始块号，FAT 中两个字段分别是物理块号和下一块的块号，
其中物理块号可以隐含（数组下标）。
FAT 常驻内存，逻辑块号转换成物理块号的过程不需要读磁盘操作。
> 支持顺序访问和随机访问，速度比隐式链接块，也不会产生外部碎片，
也可以方便地拓展文件。缺点是 FAT 占用内存空间。

### 索引分配
为每个文件建立一张索引表，表中记录了各个逻辑块号对应的物理块号，
逻辑块号以数组下标的形式隐含。索引表存放在磁盘上的索引块中，
文件目录中记录文件的索引表所在的索引块。
> 支持随机访问，文件也可以拓展。但是索引表需要占用一定的空间。

当文件的块数超过了一个磁盘块的大小 / 索引表项大小时，
一个磁盘块装不下整个索引表，需要引入额外方案，有三种
1. 链接方案，索引表拆分，每个索引块中存储指向下一个索引块的指针，
目录中存储第一个索引块的块号。
2. 多层索引，目录中存储顶级索引表的块号。访问过程：
    1. 如果要访问 1026 号逻辑块，同时磁盘块能存放 256 个索引表项，采用两级索引，
    则 1026 / 256 = 4，1026 % 256 = 2。
    2. 先查一级索引表的 4 号表项，得到对应的二级索引表所在块号。
    3. 再查二级索引表的 2 号表项，得到 1026 号逻辑块号对应的物理块号。
3. 混合索引，直接地址索引、一级间接索引、两级间接索引.... 的结合。
综合了多层索引支持大文件，和直接索引对小文件访问快的优点。

## 存储空间管理
### 空闲表法
两个字段，第一个空闲盘块号和空闲盘块数。
- 分配：在为一个文件分配连续的存储空间时，
同样可以采用首次适应、最佳适应、最坏适应等算法来分配。
- 回收：回收某个存储区时需要有 4 种情况，要注意表项的合并问题
    1. 回收区的前后都没有相邻空闲区
    2. 回收区的前后都是空闲区
    3. 回收区只有前面空闲
    4. 回收区只有后面空闲

### 空闲链表法
系统保存着链头、链尾指针。
#### 空闲盘块链
空闲盘块种存储着下一个空闲盘块的指针。
分配时，从头开始摘下 K 个盘块，并修改链头指针。
回收时，回收的盘块依次挂到链尾，并修改链尾指针。
> 适用于离散分配的物理结构，为文件分配多个盘块时可能要重复多次操作。

#### 空闲盘区链
连续的空闲盘块组成一个空闲盘区，
空闲盘区中的第一个盘块记录了盘区的长度、下一个盘区的指针。
分配时，可以采用首次适应、最佳适应等不同的算法，从链头开始检索，
找到一个符合算法规则的空闲盘区，分配给文件。
如没有合适的盘块，则可以将不同盘区的盘块同时分配给一个文件。
> 适用于离散分配的物理结构，在为文件分配多个盘块时效率更高。

### 位视图法
每个二进制位对应一个盘块。已知字长，可以通过字号和位号计算出盘块号。
这三个都是从 0 开始的。
> 连续、离散分配都适用。

### 成组链接法
空闲表法、空闲链表法不适用于大型文件系统，因为空闲表或空闲链表可能过大。
文件卷的目录区中专门用一个磁盘块作为“超级块”，系统启动时将超级块读入内存，
并维护内存于硬盘上超级块的数据一致性。