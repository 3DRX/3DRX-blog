---
title: "SQL"
description: "Structured Query Language"
pubDate: "12/22/2023"
updatedDate: "12/23/2023"
heroImage: "https://source.unsplash.com/Wpnoqo2plFA"
---

<!--toc:start-->
- [数据定义](#数据定义)
  - [模式 Schema](#模式-schema)
  - [表 Table](#表-table)
  - [视图 View](#视图-view)
  - [索引 Index](#索引-index)
- [数据查询](#数据查询)
  - [`SELECT`](#select)
  - [`FROM`](#from)
  - [`WHERE`](#where)
  - [`GROUP BY` & `HAVING`](#group-by-having)
  - [`ORDER BY`](#order-by)
  - [聚集函数](#聚集函数)
  - [连接查询](#连接查询)
  - [嵌套查询](#嵌套查询)
  - [集合查询](#集合查询)
  - [基于派生表的查询](#基于派生表的查询)
- [数据更新（增、删、改）](#数据更新增删改)
  - [插入数据](#插入数据)
  - [修改数据](#修改数据)
  - [删除数据](#删除数据)
- [空值](#空值)
  - [空值的约束条件](#空值的约束条件)
  - [空值的运算*](#空值的运算)
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

- 从一个或几个基本表导出的表（虚表）
- 数据库中只存放视图的**定义**而不存放视图对应的**数据**
- 视图是一个虚表
- 用户可以在视图上再定义视图

创建
```sql
CREATE VIEW IS_Student AS
SELECT Sno, Sname, Sage
FROM Student
WHERE Sdept = 'IS';
```

建立信息系学生的视图，并要求进行修改和插入操作时仍需保证该视图只有信息系的学生。
```sql
CREATE VIEW IS_Student AS
SELECT Sno, Sname, Sage
FROM Student
WHERE Sdept = 'IS'
WITH CHECK OPTION;
```

查询视图和查询表一样。

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

### 连接查询

- 简单连接查询
- 外连接查询
```sql
SELECT Student.Sno, Sname, Ssex, Sage, Sdept, Cno, Grade
FROM Student LEFT OUT JOIN SC ON (Student.Sno = SC.Sno);
```

### 嵌套查询

```sql
SELECT Sname FROM Student
WHERE Sno IN (
    SELECT Sno FROM SC
    WHERE Cno = '2'
);
```

限制：子查询不能使用 `ORDER BY` 语句，如果需要排序，
只能在主查询的结尾加 `ORDER BY`。

- 不相关子查询：不依赖外层传入的值
- 相关子查询：依赖外层传入的值

> 连接查询与嵌套查询的区别：连接查询效率相对低一些
> （因为需要做笛卡尔积）

### 集合查询

查询计算机科学系的学生**及**年龄不大于 19 岁的学生（并）。
```sql
SELECT * FROM Student
WHERE Sdept = 'CS'
UNION
SELECT * FROM Student
WHERE Sage <= 19;
```

- `UNION` 自动去重
- `UNION ALL` 不去重

类似地， 查询计算机科学系的学生**与**年龄不大于 19 岁的学生（交）。
```sql
SELECT * FROM Student
WHERE Sdept = 'CS'
INTERSECT
SELECT * FROM Student
WHERE Sage <= 19;
```

类似地，`EXCEPT`（差）。

### 基于派生表的查询

派生表：`FROM` 后面跟的不是表，而是一个子查询语句。
例如，找出每个学生超过他自己选修课程平均成绩的课程号：
```sql
SELECT Sno, Cno
FROM SC, (
    SELECT Sno, Avg(Grade)
    FROM SC GROUP BY Sno
    AS Avg_sc(avg_sno, avg_grade)
)
WHERE SC.Sno = Avg_sc.avg_sno and
    SC.Grade >= Avg_sc.avg_grade;
```

## 数据更新（增、删、改）

### 插入数据

- 插入元组
    - 给出全部列的数据
    ```sql
    INSERT INTO Student(Sno, Sname, Ssex, Sdept, Sage)
    VALUES ('201215128', '张三', '男', 'CS', 18);
    ```
    - 自动赋空值
    ```sql
    INSERT INTO SC(Sno, Cno)
    VALUES ('201215128', '1');
    ```
    等价于
    ```sql
    INSERT INTO SC
    VALUES ('201215128', '1', NULL);
    ```
- 插入子查询结果
    - 例如，对每个系，求学生的平均年龄，并把结果存入数据库
    ```sql
    CREATE TABLE Dept_age (
        Sdept CHAR(15),
        Avg_age INT
    );
    INSERT INTO Dept_age(Sdept, Avg_age)
        SELECT Sdept, AVG(Sage)
        FROM Student
        GROUP BY Sdept;
    ```

### 修改数据

- 修改某一个元组的值
    ```sql
    UPDATE Student
    SET Sage = 22
    WHERE Sno = '201215121';
    ```
- 修改多个元组的值
    ```sql
    UPDATE Student
    SET Sage = Sage + 1;
    ```
- 带自查询的修改语句
    ```sql
    UPDATE SC
    SET Grade = 0
    WHERE Sno IN (
        SELECT Sno FROM Student
        WHERE Sdept = 'CS'
    );
    ```

### 删除数据

- 删除某一个元组的值
    ```sql
    DELETE FROM Student
    WHERE Sno = '201215128';
    ```
- 删除多个元组的值
    ```sql
    DELETE FROM SC;
    ```
    和 `DROP TABLE SC;` 的区别是这个会剩下空表。
- 带自查询的删除语句
    ```sql
    DELETE FROM SC
    WHERE Sno IN (
        SELECT Sno FROM Student
        WHERE Sdept = 'CS'
    );
    ```

## 空值

产生：`INSERT`，`UPDATE`

判断：`NOT NULL`

### 空值的约束条件

属性定义中
- `NOT NULL` 约束的不能是空值
- `UNIQUE` 约束的不能是空值
- `PRIMARY KEY` 不能是空值

### 空值的运算*

- `NULL` 与另一个值（任意）的算术运算结果为 `NULL`
- `NULL` 与另一个值（任意）的比较运算结果为 `UNKNOWN`
- 有 `UNKNOWN` 后，传统二值逻辑（`TRUE`, `FALSE`）就扩展成了三值逻辑

|x|y|x AND y|x OR y|NOT x|
|-|-|-|-|-|
|T|T|T|T|F|
|T|U|U|T|F|
|T|F|F|T|F|
|U|T|U|T|U|
|U|U|U|U|U|
|U|F|F|U|U|
|F|T|F|T|T|
|F|U|F|U|T|
|F|F|F|F|T|

在查询语句中的例子：找出选修 1 号课程的不及格的学生
```sql
SELECT Sno FROM SC
WHERE Grade < 60 AND Cno = '1';
```
查询结果不包含缺考的学生，因为他们的 `Grade` 值为 `NULL`。

找出选修 1 号课程的不及格及缺考的学生
```sql
SELECT Sno FROM SC
WHERE Cno = '1' AND
    (Grade < 60 OR Grade IS NULL);
```

