---
title: "计算机组成原理：总线系统"
description: "Computer Organization: BUS"
pubDate: "06/17/2023"
updatedDate: "06/17/2023"
heroImage: "https://source.unsplash.com/jXd2FSvcRr8"
---
## 总线事物

1. 请求
2. 仲裁
3. 寻址
4. 传输：起始位0,停止位1
5. 释放

## 总线仲裁

### 集中式仲裁

使用**总线仲裁器**

- 链式查询方式：链上靠近总线仲裁器一侧的优先级高
- 计数器定时查询方式：轮询
- 独立请求方式：每个设备一条单独的控制线，可由总线仲裁器内部自定优先级

### 分布式仲裁

每个潜在的功能模块都有自己的仲裁号和仲裁器，有请求时，将自己的仲裁号发到仲裁总线上，
每个模块将仲裁总线上的号与自己的仲裁号相比较，如果仲裁总线上的号大，则其请求不与相应，
并撤销它的仲裁号。最终保留一个设备使用总线。

## 总线的性能指标

**总线宽度**：总线系统中数据总线的位数称为总线宽度

**总线的数据传输率**：每秒钟传输的最大字节数，B/s
