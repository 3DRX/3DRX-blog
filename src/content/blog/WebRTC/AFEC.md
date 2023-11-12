---
title: "Adaptive Forward Error Correction in Video Streaming"
description: "动态自适应的前向纠错"
pubDate: "11/12/2023"
updatedDate: "11/12/2023"
---

## 评价指标

像所有算法优化一样，在开始之前，需要进行评价指标的确定。

### VMAF

[VMAF](https://github.com/Netflix/vmaf)（[视频多方法评估融合](https://zh.wikipedia.org/zh-cn/%E8%A7%86%E9%A2%91%E5%A4%9A%E6%96%B9%E6%B3%95%E8%AF%84%E4%BC%B0%E8%9E%8D%E5%90%88)） 
是根据源视频和传输/转码后视频画面本身对比评估画面质量的工具，比帧率、码率、分辨率这些指标更贴近观看体验。

### 帧率、码率、分辨率

> Frame rate, bit rate, resolution.

视频固有参数

### Average Frame Recovery Rate

> 平均帧恢复率

在丢包率和丢包分布同样的网络下，这个指标能够直接反映出 FEC 调控和编码算法的性能。

## Reference

[TCSVT'23 ABRF：Adaptive_BitRate-FEC_Joint_Control_for_Real-Time_Video_Streaming](https://ieeexplore.ieee.org/document/10050528)

