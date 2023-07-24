---
title: "Common matplotlib snippets"
description: "some handy pieces of code"
pubDate: "07/24/2023"
updatedDate: "07/24/2023"
heroImage: "https://source.unsplash.com/h3kuhYUCE9A"
---

## Creating figure(s)

For single figure plot

```python
fig = plt.figure(figsize=(20, 6))
```

For multiple figure plot

```python
fig, (plt1, plt2) = plt.subplots(
    1, # n rows
    2, # n columns
    figsize=(18, 6),
    gridspec_kw={
        'width_ratios': [1, 1], # 1:1 in this case
        # 👇 margin between subplots
        'wspace': 0.3,
        'hspace': 0.2
    }
)
```

