---
title: "计算机组成原理：外围设备"
description: "Computer Organization: Disk and Display"
pubDate: "06/17/2023"
updatedDate: "06/17/2023"
heroImage: "https://source.unsplash.com/jXd2FSvcRr8"
---

## 磁盘

平均读写操作时间为

$$
T_a = T_s + \frac{1}{2r} + \frac{b}{rN}
$$

- $T_s$: 平均寻道时间
- $b$: 传送的字节数
- $\frac{b}{rN}$: 数据传输时间

## CRT 显示设备

为了不断提供刷新图像的信号，必须把一帧图像信息存储在**刷新存储器**，也称**视频存储器**。
其容量 $M$ 如下

$$
M = r \times C
$$

- $r$: 分辨率
- $C$: 颜色深度

刷新存储器的带宽

$$
B = M \times f
$$

- $M$: 容量
- $f$: 刷新率/帧率
