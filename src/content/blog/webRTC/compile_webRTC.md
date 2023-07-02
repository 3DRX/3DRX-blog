---
title: "Compiling WebRTC"
description: "编译 WebRTC"
pubDate: "07/2/2023"
updatedDate: "07/2/2023"
heroImage: "https://cdn-cdpl.sgp1.cdn.digitaloceanspaces.com/source/998b78e349061b4971c0a2b0e8d6be41/webrtc.png"
---

<!--toc:start-->
- [System Requirements](#system-requirements)
- [Normal Process (from Google's repo)](#normal-process-from-googles-repo)
- [如果访问 Google 有困难](#如果访问-google-有困难)
<!--toc:end-->

## System Requirements

By the time when this article is written, the tooling around building WebRTC seems not working
properly on Ubuntu 22.04, but is fine on Ubuntu 20.04.

## Normal Process (from Google's repo)

First, clone this repo `https://chromium.googlesource.com/chromium/tools/depot_tools.git`
and add it to PATH. Note, use absolute path to this repo, don't use `~`.

You might also need to make sure the `python` command is pointing to python2 rather than python3,
because according to line 121 of `depot_tools/gclient.py`, their python3 migration is not done yet.

```
# TODO(crbug.com/953884): Remove this when python3 migration is done.
```

After this, you can follow [the guide from Google](https://webrtc.github.io/webrtc-org/native-code/development/).

## 如果访问 Google [有困难](https://en.wikipedia.org/wiki/Great_Firewall)

WebRTC 国内镜像地址: https://webrtc.org.cn/mirror/
