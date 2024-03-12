---
title: "Introduction to Gource"
description: "Gource —— git 可视化工具，从 git 记录生成视频"
pubDate: "06/14/2023"
updatedDate: "06/14/2023"
heroImage: "https://source.unsplash.com/EaB4Ml7C7fE"
---

> https://gource.io/ a git visualization tool

## Feature

Generates beautiful video using git commit informations.

<iframe
    id="yt-iframe"
    src="https://www.youtube.com/embed/bn2l7GpePtY"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
></iframe>
<style>
#yt-iframe {
    max-width: 65ch;
    height: 36.5ch;
    width: 90vw;
}
</style>

## Installation

Follow instructions [here](https://gource.io/).

By default, gource doesn't encode the video, so we also need [ffmpeg](https://ffmpeg.org/).

## Usage

My command

```
gource --camera-mode overview --seconds-per-day 3 -a 0.5 -1920x1080 -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset veryslow -pix_fmt yuv420p -crf 17 -threads 0 -bf 0 ~/Desktop/demo.mp4
```
