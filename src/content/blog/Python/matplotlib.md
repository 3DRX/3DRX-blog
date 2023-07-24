---
title: "Common matplotlib snippets"
description: "some handy pieces of code"
pubDate: "07/24/2023"
updatedDate: "07/24/2023"
heroImage: "https://source.unsplash.com/h3kuhYUCE9A"
---

<!--toc:start-->
- [Creating figure(s)](#creating-figures)
- [Setting axis style & width](#setting-axis-style-width)
- [Constants](#constants)
- [Legend](#legend)
- [Saving the plot](#saving-the-plot)
<!--toc:end-->

## Creating figure(s)

For single figure plot

```python
fig = plt.figure(figsize=(20, 6))
# ...
plt.plot(...)
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
# ...
plt.subplot(1, 2, 1) # start ploting on subplot at [0, 0]
# ...
plt.subplot(1, 2, 2) # start ploting on subplot at [0, 1]
```

## Setting axis style & width

```python
ax = plt.gca()
ax.spines['top'].set_linewidth(3)
ax.spines['right'].set_linewidth(3)
ax.spines['left'].set_linewidth(3)
ax.spines['bottom'].set_linewidth(3)
```

This can be set different in different subplots.

## Constants

It is handy to set things like colors, line styles, font sizes as global constants,
since it is common to modify the style of the figures multiple times.

```python
H1 = 35
H2 = 30
colors = ['#324DC2', '#F3B194', '#58C8F5', '#6D738F', '#C24017']
hatches = ['x', '/', 'o', '\\', '.']
bar_width = 0.27
```

## Legend

```python
plt.legend(
    ax.get_legend_handles_labels()[0],
    ax.get_legend_handles_labels()[1],
    # 👆 upper lines can be manipulated to avoid repeating legend
    loc='upper center',
    fontsize=H2, # I prefer to set global constants for font size
    frameon=False, # no frame around legend
    ncol=2,
    handletextpad=0.2,
    columnspacing=4,
    borderpad=0.3,
)
```

## Saving the plot

```python
plt.savefig('./plot.pdf', bbox_inches='tight', dpi=300)
```

