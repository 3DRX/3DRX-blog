---
title: "Indexing"
description: "数据库索引"
pubDate: "12/29/2023"
updatedDate: "12/29/2023"
heroImage: "https://source.unsplash.com/Wpnoqo2plFA"
---

<!--toc:start-->
- [基本概念](#基本概念)
- [索引的不同分类方式](#索引的不同分类方式)
  - [Primary vs Secondary](#primary-vs-secondary)
  - [Dense vs Sparse](#dense-vs-sparse)
  - [Multilevel Index](#multilevel-index)
- [更新索引](#更新索引)
- [SQL 中的索引](#sql-中的索引)
<!--toc:end-->

## 基本概念

Index file 中的 records 有两个字段
- search-key
- pointer

Index Evaluation Metrics
- Access types supported
- Access time
- Insertion time
- Deletion time
- Space overhead

## 索引的不同分类方式

### Primary vs Secondary
- Primary Index 也称 **clustering index**, 是有序的，且顺序与原数据的顺序一致。
主索引的 search-key 通常（但不永远）是主键。
- Secondary Index 的 search-key 排列顺序与主索引不同。

### Dense vs Sparse

- Dense Index's index record appears for every search-key value in the file.
- Sparse Index contains index records for only some search-key values.

### Multilevel Index

如果表很大，主索引在内存中放不下，那就需要使用多级索引。
- outer index：pointer 指向 inner index
- inner index：pointer 指向数据

## 更新索引

- Deletion
    - 对稠密索引，需要 update 一部分 pointer
    - 对于稀疏索引，不需要进行额外操作
- Insertion
    - 单层索引
        - 稠密：insert index / add pointer / update pointer
        - 稀疏：no change / insert index / update pointer
    - 多层索引需要执行额外的操作来维护多层索引

## SQL 中的索引

- create index
`CREATE [UNIQUE] INDEX <index-name> or <relation name> <attribute-list>;`
- create cluster index
    - `CREATE NONCLUSTER INDEX ...;`
    - `CREATE UNIQUE INDEX ...;`
- drop an index
`DROP INDEX <index-name>;`

