---
title: "LSTM"
description: "长短期记忆网络"
pubDate: "06/28/2023"
updatedDate: "06/28/2023"
heroImage: "https://source.unsplash.com/CyFBmFEsytU"
---

> Long short term memory, 一种特殊的 RNN，主要解决了长序列训练过程中的梯度消失和梯度爆炸。

## RNN

### 困惑度

1 表示十分确定，越大表示对结果越不确定。

### 梯度裁剪

避免梯度爆炸：如果梯度长度超过 $\theta$，那么“压”回长度 $\theta$。

$$
g \leftarrow min(1, \frac{\theta}{||g||})g
$$
