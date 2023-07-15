---
title: "LSTM implementation in PyTorch"
description: "LSTM 的 PyTorch 实现"
pubDate: "07/15/2023"
updatedDate: "07/15/2023"
heroImage: "https://source.unsplash.com/CyFBmFEsytU"
---

## Module definition

```python
import torch
from torch import nn


class LSTM(nn.Module):
    def __init__(
            self,
            input_size,
            hidden_size,
            num_layers,
            num_output, device
    ):
        super(LSTM, self).__init__()
        self.hidden_size = hidden_size
        self.device = device
        self.num_layers = num_layers
        self.lstm = nn.LSTM(
            input_size,
            hidden_size,
            num_layers,
            batch_first=True,
            bidirectional=True
            # bidirectional=False
        )
        self.predict = nn.Linear(hidden_size * 2, num_output)
        # self.predict = nn.Linear(hidden_size, num_output)

    def forward(self, x):
        x = x.unsqueeze(0)
        h0 = torch.zeros(
            self.num_layers * 2,
            x.size(0),
            self.hidden_size
        ).to(self.device)
        c0 = torch.zeros(
            self.num_layers * 2,
            x.size(0),
            self.hidden_size
        ).to(self.device)
        # h0 = torch.zeros(
        #     self.num_layers,
        #     x.size(0),
        #     self.hidden_size
        # ).to(self.device)
        # c0 = torch.zeros(
        #     self.num_layers,
        #     x.size(0),
        #     self.hidden_size
        # ).to(self.device)
        out, _ = self.lstm(x, (h0, c0))
        out = self.predict(out[0])
        return out
```

The second input and the second output of `self.lstm()` could be useful in seq2seq,
but in this case, the second input is always 0 in correct shape, and the second output
is ignored.

## Training

```python
# ...
# data loading and batching
# ...

model = LSTM(
    input_size=history_len,
    hidden_size=100,
    num_layers=1,
    num_output=target_len,
    device=device
).to(device)
loss_function = nn.L1Loss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001, weight_decay=1e-4)
scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
    optimizer,
    mode='min',
    factor=0.1,
    patience=100,
    verbose=False,
    threshold=0.001,
    threshold_mode='rel',
    cooldown=0,
    min_lr=0,
    eps=1e-08
)
batch_size = 128

for i in range(epoch):
    err_train = []
    for seq, labels in minibatches(X, y, batch_size, shuffle=False):
        y_pred = model(seq)
        loss = loss_function(y_pred, labels)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        err_train.append(loss.item())
        pass
    if i % 10 == 0:
        print(
            f"epoch:{i+1:4}\tloss:{np.mean(err_train):10.10f}\tlr:{optimizer.param_groups[0]['lr']}")
        pass
    scheduler.step(np.mean(err_train))
    pass
```

Both scheduled learning rate (reduce on plateau) and weight decay can help to reduce
gradient explosion and overfitting.

## Save the model after training

```python
torch.save(model.state_dict(), "model.pth")
```

## Evaluation

```python
def mae(y_true, y_pred):
    n = len(y_true)
    mape = sum(np.abs(y_true - y_pred))/n*100
    return mape

for i, trace in enumerate(X_test):
    trace_tensor = torch\
        .from_numpy(trace)\
        .float()\
        .view(1, history_len)\
        .to(device)
    predict = []
    pred_list.append(model(trace_tensor).item())
    real_list.append(y_test[i][0] / 100000) # scale
    pass

print(mae(np.array(real_list), np.array(pred_list)))
```

