---
title: "tcctl"
description: "A webui for tc netem"
pubDate: "11/19/2023"
updatedDate: "11/22/2023"
---

<!--toc:start-->
- [Install & Run](#install-run)
- [Usage](#usage)
  - [Manual](#manual)
  - [Trace File](#trace-file)
<!--toc:end-->

![tcctl](../../../assets/gagets/tcctl.png)

> A webui for tc netem, designed to be run on OpenWrt routers.  
> https://github.com/3DRX/tcctl

## Install & Run

1. Download release .zip on OpenWrt and decompress it
    - [tcctl-0.0.1.zip](/tcctl-0.0.1.zip)
2. Install following dependencies
```
opkg update
opkg install python3
opkg install python3-pip
opkg install python3-psutil
pip install flask
```
3. `cd build && chmod +x ./run_prod.sh && ./run_prod.sh`
4. Go to `http://<host_name_of_your_router>:8080`

## Usage

1. Monitor network traffic by interface.
2. Apply limitations on **delay**, **packet loss**, and **data rate** via [tc netem](/blog/gadgets/tc_openwrt).
3. Upload [trace file](#trace-file) and apply limitations according to the trace.
4. Switching between manual mode and trace file mode will reset all shaping rules.
5. It is recommended to connect to tcctl from a port that's not been controlled by itself.

### Manual

Set delay(ms/s), loss(%), rate(Mbps/Kbps) by **integer values**.
Click "Submit" to apply the values, if submit multiple times,
subsequent submissions will override previous ones.
Click "Reset" button to clear all shaping rules to network interface.

### Trace File

Set delay(ms/s), loss(%), rate(Mbps/Kbps) by **floating point precision**.
Select a NIC before upload trace file, click "Start" button to start playback the network trace.

