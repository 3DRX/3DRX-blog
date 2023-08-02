---
title: "Using Matplotlib to Produce Figures in Paper"
description: "Some configurations and environment setup"
pubDate: "08/2/2023"
updatedDate: "08/2/2023"
heroImage: "https://source.unsplash.com/h3kuhYUCE9A"
---

In academic paper, figures are required to use certain fonts, a common choice is Arial.
However, on macOS and Linux, Matplotlib does not use the preferred configurations by default.
We need to manually configure it.

## Install font

> Solving: ***findfont: Font family ['Arial'] not found***

Use `fc-match Arial` to check if the font is already installed.

If Arial is not installed, use `sudo apt install ttf-mscorefonts-installer` to install it.
Then `sudo fc-cache -f -v` to refresh cache.

You may also need to clear Matplotlib cache by `rm ~/.cache/matplotlib/fontlist-v300.json`

## Using the font in plots

```python
import matplotlib.pyplot as plt
import matplotlib

plt.rcParams['font.family'] = 'Arial'
plt.rcParams['font.sans-serif'] = ['Arial']
plt.rcParams['font.serif'] = ['Arial']

# Default Type 3 fonts are not suitable in some cases
matplotlib.rcParams['pdf.fonttype'] = 42
matplotlib.rcParams['ps.fonttype'] = 42
```
