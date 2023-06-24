---
title: "PAR paper reading"
description: "improving video bitrate adaptation via payload-aware throughput prediction"
pubDate: "06/24/2023"
updatedDate: "06/24/2023"
heroImage: "https://source.unsplash.com/M5tzZtFCOfs"
---

> This is my notes reading [ICME'22 PAR](https://ieeexplore.ieee.org/document/9860000).

## Overview

ABR algorithm can be improved by adding payload awareness.
Two main modules used:
1. An online payload-aware throughput predictor, which utilizes a
lightweight neural network to predict future bandwidths
via past observations, and then calculate the corresponding
downloading rates for chunks in different bit rates.
2. A bit rate selector aiming at maximizing the given QoE function

## Background

Observed throughput is distinguished for chunks in
different bit rates, even if they are downloaded from the
same moment.

Estimation error due to ignorance of payload difference
will be exacerbated when the gap of bit rate levels increases.

The high volatility of network conditions will also enlarge
this estimation deviation.

## Detail

3 components
1. The client, running [dash.js](https://github.com/Dash-Industry-Forum/dash.js/)
in web browser.
2. The video server, basically a bunch of sliced videos and a running nginx,
nothing fancy.
3. The magic, ABR server powered by neural network.

**How it works**: client request video chunks from the video server,
and send streaming metadata to the ABR server, which then use the NN to predict
future throughput and response with a switch request, controlling the
video streaming.

In experiment, [tc](https://man7.org/linux/man-pages/man8/tc.8.html)
is also used to limit network speed to simulate poor network.

**Environment**: the LTE dataset and the HSDPA dataset.

$$
QoE = \sum^N_{i=1}(Q(i) - \mu W(i)) - \sum^N_{i=2}|Q(i) - Q(i-1)|
$$
- $W(i)$: rebuffering time
- $Q(i)$: chunk bit rate

