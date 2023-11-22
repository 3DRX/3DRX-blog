---
title: "Using TC with OpenWrt"
description: "在 OpenWrt 上使用 TC"
pubDate: "11/18/2023"
updatedDate: "11/18/2023"
---

## Purpose

Emulate actual network conditions in the wild,
used in the test bed of network transportation systems.

弱网测试，用于复现真实网络环境测试传输系统。

## Hardware

NanoPi R2S or similar

![img of r2s](../../../assets/gagets/r2s.jpg)

## OS

[OpenWrt 23.05.2](https://firmware-selector.openwrt.org/)

## Application

SSH into the device, and use following commands.
In this case, the network interface name on the LAN side is `br-lan`.

```
tc qdisc add dev br-lan root netem rate 1mbit

tc qdisc change dev br-lan root netem rate 2mbit

tc qdisc del dev br-lan root
```

With netem module, tc can control **bandwidth**, **packet loss**, and **delay**.  
More detailed usage [here](https://man7.org/linux/man-pages/man8/tc-netem.8.html).

[tcctl](/blog/gadgets/tcctl): a webui for tc.

## Reference

https://cizixs.com/2017/10/23/tc-netem-for-terrible-network/  
https://man7.org/linux/man-pages/man8/tc-netem.8.html  
https://man7.org/linux/man-pages/man8/tc.8.html  

