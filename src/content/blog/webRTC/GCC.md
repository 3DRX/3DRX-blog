---
title: "GCC: Google Congestion Control"
description: "GCC 论文阅读笔记"
pubDate: "07/6/2023"
updatedDate: "07/6/2023"
heroImage: "https://cdn-cdpl.sgp1.cdn.digitaloceanspaces.com/source/998b78e349061b4971c0a2b0e8d6be41/webrtc.png"
---

> GCC: 基于 RTP/RTCP 应用于实时视频传输的拥塞控制  
> https://c3lab.poliba.it/images/6/65/Gcc-analysis.pdf

## Motivation

实时视频传输对网络提出了新的要求，
基于 TCP 的传输方式和基于丢包的拥塞控制不在适用于 RTC。
- TCP 在应用层的拥塞控制导致延迟较大
- 震荡问题

相关内容
- 利用 RTT 分析拥塞情况: TCP Vegas, TCP FAST
- 利用单向的延迟分析拥塞: LEDBAT, TCP-LP
- 利用 delay-gradient 延迟梯度分析拥塞: CDG, Verus
- 其他方法: Sprout, Remy, FBRA
- RTP/RTCP

