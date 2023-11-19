---
title: "tcctl"
description: "A webui for tc netem"
pubDate: "11/19/2023"
updatedDate: "11/19/2023"
---

![tcctl](../../../assets/gagets/tcctl.png)

> A webui for tc netem, designed to be run on OpenWrt routers.  
> https://github.com/3DRX/tcctl

## Install & Run

1. Download build.zip on OpenWrt and decompress it
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
3. *TODO: Upload tracefile and apply limitations according to the trace*.

