---
title: "Computer Networking: Network Layer Data Plane"
description: "计算机网络：网络层 数据平面"
pubDate: "06/15/2023"
updatedDate: "06/15/2023"
heroImage: "https://source.unsplash.com/M5tzZtFCOfs"
---

<!--toc:start-->
- [Network layer overview](#network-layer-overview)
- [Router](#router)
  - [Longest prefix matching](#longest-prefix-matching)
  - [Switching fabric](#switching-fabric)
- [IP](#ip)
  - [IP addressing](#ip-addressing)
    - [DHCP: Dynamic Host Configuration Protocol](#dhcp-dynamic-host-configuration-protocol)
  - [NAT](#nat)
  - [IPv6](#ipv6)
- [SDN](#sdn)
- [Exercise](#exercise)
  - [P4](#p4)
  - [P5](#p5)
  - [P7](#p7)
<!--toc:end-->

## Network layer overview

**Two key network layer functions**: forwarding and routing.

- Data plane
    - local, per-router function
- [Control plane](/blog/computer_network/network_layer_control_plane/)
    - network-wide logic

> Best effort service: simplicity of mechanism,
sufficient provisioning of bandwidth, replicated application-layer distributed services,
congestion control of "elastic" services.

## Router

### Longest prefix matching

When looking for forwarding table entry for given destination address,
use the longest address prefix that matches destination address.

### Switching fabric

Output & input port queuing.

**How much buffering?**

A recent recommendation: with N flows, buffering equal to

$$
\frac{RTT \cdot C}{\sqrt{N}}
$$

**Scheduling policy**
- FCFS
- priority
- round-robin
- weighted fair queuing

## IP

> The Internet protocol

### IP addressing

IP address: 32 bit identifier associated with each host or router interface.

**How to get one?** Via DHCP

#### DHCP: Dynamic Host Configuration Protocol

- host broadcasts DHCP discover message
- DHCP server responds with DHCP offer message
- host requests IP address: DHCP request message
- DHCP server sends address: DHCP ACK message

DHCP: more than IP addresses
- address of first-hop router for client
- name and IP address of DNS server
- network mask (indicating network versus host portion of address)

### NAT

> Network address translation

The router maps each host in subnet to a port of itself.

### IPv6

**Transition from IPv4 to IPv6**: tunneling and encapsulation

![](../../../assets/computer_networking/v6v4tunneling.png)

## SDN

Software defined networking

---

## Exercise

> From [*Computer Networking: A Top Down Approach 7th Edition*](https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm)

Chapter 4

### P4

*Consider the switch shown below. Suppose that all datagrams have the same fixed length,
that the switch operates in a slotted, synchronous manner, and that in one time slot a datagram
can be transferred from an input port to an output port. The switch fabric is a crossbar so that at
most one datagram can be transferred to a given output port in a time slot, but different output
ports can receive datagrams from different input ports in a single time slot. What is the minimal
number of time slots needed to transfer the packets shown from input ports to their output ports,
assuming any input queue scheduling order you want (i.e., it need not have HOL blocking)?
What is the largest number of slots needed, assuming the worst-case scheduling order you can
devise, assuming that a non-empty input queue is never idle?*

![](../../../assets/computer_networking/c4p4.png)

The minimal number of time slots needed is 3. The scheduling is as follows.

Slot 1: send X in top input queue, send Y in middle input queue.  
Slot 2: send X in middle input queue, send Y in bottom input queue.  
Slot 3: send Z in bottom input queue.

Largest number of slots is still 3. Actually, based on the assumption that a non-empty
input queue is never idle, we see that the first time slot always consists of sending X in
the top input queue and Y in either middle or bottom input queue, and in the second time
slot, we can always send two more datagram, and the last datagram can be sent in third
time slot.

NOTE: Actually, if the first datagram in the bottom input queue is X, then the worst case
would require 4 time slots.

### P5


*Consider a datagram network using 32-bit host addresses. Suppose a router has four links,
numbered 0 through 3, and packets are to be forwarded to the link interfaces as follows:*


![](../../../assets/computer_networking/c4p5.png)

a.

| Prefix Match        | Link Interface |
|---------------------|----------------|
| `11100000 00`       | 0              |
| `11100000 01000000` | 1              |
| `1110000`           | 2              |
| `11100001 1`        | 3              |
| otherwise           | 3              |

b.

Prefix match for first address is 5th entry: link interface 3  
Prefix match for second address is 3rd entry: link interface 2  
Prefix match for third address is 4th entry: link interface 3  

### P7

*Consider a data gram network using 8-bit host addresses.
Suppose a router uses longest prefix matching and has
the following forwarding table:*

![](../../../assets/computer_networking/c4p7.png)

*For each of the four interfaces,
give the associated range of destination host addresses and the
number of addresses in the range.*

| Destination Address Range                    | Link Interface |
|----------------------------------------------|----------------|
| `11000000` through `11011111` (32 addresses) | 0              |
| `10000000` through `10111111` (64 addresses) | 1              |
| `11100000` through `11111111` (32 addresses) | 2              |
| `00000000` through `01111111` (128 addresses)| 3              |

