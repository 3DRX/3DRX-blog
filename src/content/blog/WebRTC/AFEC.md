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

### PSNR

> Peak signal-to-noise ratio，峰值信噪比。

### Average Frame Recovery Rate

> 平均帧恢复率

在丢包率和丢包分布同样的网络下，这个指标能够直接反映出 FEC 调控和编码算法的性能。

## 算法思路

### 查表：静态规则

- WebRTC 中的冗余率表：根据当前时刻的 RTT、丢包、吞吐量等信息结合帧类型（关键帧、非关键帧）给出一个相应的冗余率。
- MaxFilter: Calculates the maximum packet loss rate in
the received network reports in a fixed size window and
chooses it as the prediction result.
- KalmanFilter: Applies Kalman Filter to the sequence of
packet loss rate, considering the difference of importance
between packet loss rates in network reports.

### 基于学习的动态算法

一种实现方式是将过去一段时间的丢包、RTT、吞吐量、反馈时间间隔等信息作为机器学习算法的输入，
其输出为对未来丢包分布趋势的预测。
其所使用的机器学习模型可以是离线训练好的神经网络，
也可以是强化学习模型。

- DeepRS: A recently proposed deep-learning-based
prototypical AFEC algorithm. It applies Long-Short Term
Memory (LSTM) neural networks to make sequence
predictions on packet loss rate.

## Reference

[TCSVT'23 ABRF：Adaptive_BitRate-FEC_Joint_Control_for_Real-Time_Video_Streaming](https://ieeexplore.ieee.org/document/10050528)

