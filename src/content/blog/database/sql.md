---
title: "SQL"
description: "Structured Query Language"
pubDate: "12/22/2023"
updatedDate: "12/22/2023"
heroImage: "https://source.unsplash.com/Wpnoqo2plFA"
---

<!--toc:start-->
- [数据定义](#数据定义)
  - [模式 Schema](#模式-schema)
  - [表 Table](#表-table)
  - [视图 View](#视图-view)
  - [索引 Index](#索引-index)
- [数据查询](#数据查询)
<!--toc:end-->

---

## 数据定义

### 模式 Schema

`CREATE SCHEMA ...`,
`DROP SCHEMA ...`

### 表 Table

`CREATE TABLE ...`,
`DROP TABLE ...`,
`ALTER TABLE ...`

### 视图 View

- 从一个或几个基本表导出的表
- 数据库中只存放视图的定义而不存放视图对应的数据
- 视图是一个虚表
- 用户可以在视图上再定义视图

`CREATE VIEW ...`,
`DROP VIEW ...`

### 索引 Index

`CREATE INDEX ...`,
`DROP INDEX ...`,
`ALTER INDEX ...`

## 数据查询

### `SELECT`
- `ALL ...`
- `DISTINCT ...`

### `FROM`

后接表名，可以 `AS ...` 起别名，多表用 `,` 分开。

### `WHERE`
- 通用条件判断语句
- `LIKE` 运算符
    - `%` 任意长度（可以为 0）的字符串
    - `_` 任意单个字符
    - 例如
    ```sql
    SELECT Sname, Sno FROM Student
    WHERE Sname LIKE '_阳%';
    ```
    - 如果要表示原本的 `%` 和 `_` 字符使用 `\%`, `\_`
    加上 `ESCAPE '\'`，例如
    ```sql
    SELECT Cno, Ccredit FROM Course
    WHERE Cname LIKE 'DB\_Design' ESCAPE '\';
    ```

### `GROUP BY` & `HAVING`

`HAVING` 用于过滤 `GROUP BY` 的结果，
例如：查询选修了 3 门以上课程的学生学号

```sql
SELECT Sno FROM SC
GROUP BY Sno
HAVING COUNT(*) > 3;
```

### `ORDER BY`

- `ASC` 升序，默认的
- `DESC` 降序

### 聚集函数

```sql
SELECT COUNT(*) FROM Student;
```

中的 `COUNT` 是聚集函数

- `COUNT`
- `DISTINCT`
- `AVG`

// CKPT: 数据库第三章第二部分 2:11
