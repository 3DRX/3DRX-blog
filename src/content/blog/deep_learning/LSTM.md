---
title: "LSTM"
description: "长短期记忆网络"
pubDate: "06/28/2023"
updatedDate: "07/2/2023"
heroImage: "https://source.unsplash.com/CyFBmFEsytU"
---

> Long short term memory, 一种特殊的 RNN，主要解决了长序列训练过程中的梯度消失和梯度爆炸。

## RNN

处理序列化数据的神经网络，可以将上一轮的输出结果作为下一轮的输入，以此预测接下来的序列。

### 困惑度

1 表示十分确定，越大表示对结果越不确定。

### 梯度裁剪

避免梯度爆炸：如果梯度长度超过 $\theta$，那么“压”回长度 $\theta$。

$$
g \leftarrow min(1, \frac{\theta}{||g||})g
$$

## PyTorch implementation

Define nn.Module

```py
class LSTM(nn.Module):
    def __init__(self, hidden_layer_size=100, output_size=1):
        super().__init__()
        self.hidden_layer_size = hidden_layer_size
        self.lstm = nn.LSTM(1, hidden_layer_size, batch_first=True)
        self.linear = nn.Linear(hidden_layer_size, output_size)
        pass

    def init_hidden(self, batch_size, device):
        self.hidden = (
            torch.zeros(1, batch_size, self.hidden_layer_size).to(device),
            torch.zeros(1, batch_size, self.hidden_layer_size).to(device)
        )

    def forward(self, x):
        x = x.view(x.shape[0], x.shape[1], 1)
        r_out, self.hidden = self.lstm(x, self.hidden)
        r_out_reshaped = r_out.reshape(-1, self.hidden_layer_size)
        outs = self.linear(r_out_reshaped)
        outs = outs.view(x.shape[0], x.shape[1], -1)
        index = torch.ones(
            outs.shape[0],
            outs.shape[2]
        ).long().cuda() * (outs.shape[1] - 1)
        outs = torch.gather(outs, dim=1, index=index.unsqueeze(1)).squeeze(1)
        return outs
```

Training
```py
for i in range(epoch):
    err_train = []
    for seq, labels in batches(X, y, batch_size, shuffle=False):
        model.init_hidden(batch_size, device)
        y_pred = model(seq)
        loss = loss_function(y_pred, labels)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        err_train.append(loss.item())
    if i % 100 == 0:
        print(f"epoch:{i+1:4}\ttrain:{np.mean(err_train):10.10f}")
        pass
    pass
```

---

本文仅作为个人学习记录，作者水平很差，如有错误，恳请指正。

