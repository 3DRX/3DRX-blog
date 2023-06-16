---
title: "Computer Networking: Wireless and Mobile Networks"
description: "计算机网络：无线移动网络"
pubDate: "06/16/2023"
updatedDate: "06/16/2023"
heroImage: "https://source.unsplash.com/M5tzZtFCOfs"
---

<!--toc:start-->
- [Wireless](#wireless)
  - [Wireless links and network characteristics](#wireless-links-and-network-characteristics)
  - [Wi-Fi: 802.11 wireless LAN](#wi-fi-80211-wireless-lan)
  - [Cellular networks: 4G and 5G](#cellular-networks-4g-and-5g)
- [Mobility](#mobility)
  - [Principles](#principles)
  - [Practice](#practice)
<!--toc:end-->

![](../../../assets/computer_networking/characteristics_wireless.png)

## Wireless

### Wireless links and network characteristics

- decreased signal strength
- interference from other sources
- multipath propagation
- hidden terminal problem
- signal attenuation

![](../../../assets/computer_networking/hidden_terminal_signal_attenuation.png)

### Wi-Fi: 802.11 wireless LAN

![](../../../assets/computer_networking/wifi.png)

All use CSMA/CA for multiple access, and have base-station and ad-hoc network versions.

**Collision Avoidance**: RTS-CTS exchange

![](../../../assets/computer_networking/collision_avoidance.png)

### Cellular networks: 4G and 5G

![](../../../assets/computer_networking/cellular.png)

- Mobile device
- Base station
- Home Subscriber Service
- Serving Gateway (S-GW)
- PDN Gateway (P-GW)
- Mobility Management Entity

## Mobility

### Principles

Let end-systems handle it: functionality at the "edge"

### Practice

Major tasks
1. base station association
2. control-plane configuration
3. data-plane configuration
4. mobile handover

