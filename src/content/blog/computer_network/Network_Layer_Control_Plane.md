---
title: "Computer Networking: Network Layer Control Plane"
description: "计算机网络：网络层 控制平面"
pubDate: "06/15/2023"
updatedDate: "06/16/2023"
heroImage: "https://source.unsplash.com/M5tzZtFCOfs"
---

> Network layer functions
> - forwarding: [**data** plane](/blog/computer_network/network_layer_data_plane/)
> - routing: **control** plane

There are 2 approaches to structuring network control plane:
1. per-router control (traditional)
2. logically centralized control ([SDN](#sdn-control-plane))

## Routing

> Goal: determine “good” paths (equivalently, routes),
> from sending hosts to receiving host, through network of routers.

In the following section,
a [graph](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics))
abstraction of link costs is used.

### Link state

> Basically,
> [Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm).

![](../../../assets/computer_networking/dijkstra.png)

Algorithm complexity
- The simple version: $O(n^2)$
- More efficient implementations: $O(n \cdot logn)$

Message complexity
- Each router must broadcast its link state information to other n routers.
- Efficient broadcast algorithms:
$O(n)$ link crossings to disseminate a broadcast message from one source
- Each router’s message crosses O(n) links: overall message complexity: $O(n^2)$

#### Oscillations possible

> 振荡  
> When link costs depend on traffic volume, **route oscillations** possible.

![](../../../assets/computer_networking/dijkstra_oscillation.png)

### Distance vector

> Based on
> [Bellman-Ford algorithm](https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm)
> (dynamic programming).

$$
D_x(y) = min_V \{c_{X,V} + D_V(y)\}
$$

- $D_V(y)$: estimated least-cost-path cost to $y$
- $c_{X,V}$: direct cost of link from $X$ to $V$

#### Link cost changes

> May cause distance count up to $\infty$.

![](../../../assets/computer_networking/link_cost_changes.png)

### Comparison of LS and DV

- message complexity
    - LS: n routers, $O(n^2)$ messages sent
    - DV: exchange between neighbors, convergence time varies
- speed of convergence
    - LS: $O(n^2)$ algorithm, $O(n^2)$ messages
        - may have oscillations
    - DV: convergence time varies
        - may have routing loops
        - count-to-infinity problem
- robustness
    - LS
        - router can advertise incorrect link cost
        - each router computes only its own table
    - DV
        - router can advertise incorrect path cost
        - each router's table used by others: error propagate through network

## Intra-ISP routing: OSPF

> Making routing scalable

Open Shortest Path First
- "open": publicly available
- classic link-state
    - each router floods OSPF link-state advertisements
    (directly over IP rather than using TCP/UDP) to all other routers in entire AS
    - multiple link costs metrics possible: bandwidth, delay
    - each router has full topology, uses Dijkstra’s algorithm to compute forwarding table
- security: all OSPF messages authenticated (to prevent malicious intrusion)

![](../../../assets/computer_networking/OSPF.png)

## Routing among ISPs: BGP

> Border Gateway Protocol: glue that holds the Internet together

- eBGP: obtain subnet reachability information from neighboring ASes
- iBGP: propagate reachability information to all AS-internal routers

![](../../../assets/computer_networking/BGP.png)

**BGP session**: two BGP routers ("peers")
exchange BGP messages over semi-permanent TCP connection

- BGP advertised route: prefix + attributes
    - prefix: destination being advertised
    - two important attributes
        - `AS-PATH`: list of ASes through which prefix advertisement has passed
        - `NEXT-HOP`: indicates specific internal-AS router to next-hop AS
- *policy-based routing*
    - gateway receiving route advertisement uses import policy
    to accept/decline path (e.g., never route through AS Y)
    - AS policy also determines whether to advertise path to other other neighboring ASes

**BGP messages**: exchanged between peers over TCP connection
- `OPEN`: opens TCP connection to remote BGP peer and authenticates sending BGP peer
- `UPDATE`: advertises new path (or withdraws old)
- `KEEPALIVE`: keeps connection alive in absence of UPDATES; also ACKs OPEN request
- `NOTIFICATION`: reports errors in previous msg; also used to close connection

The difference of intra and inter AS routing is as follows
- policy
    - inter: admin wants control over how its traffic routed, who routes through its network
    - intra: single admin, so policy less of an issue
- scale
    - hierarchical routing saves table size, reduced update traffic
- performance
    - intra: focus on performance
    - inter: policy dominates over performance

## SDN control plane

> Remote controller computes, installs forwarding tables in routers.

![](../../../assets/computer_networking/SDN.png)

Why a logically centralized control plane?
- Easier network management
- Table-based forwarding easier
- Open implementation of control plane

SDN control plain makes traffic engineering which is difficult in traditional
distributed control plain rather easier.

### OpenFlow protocol
- operates between controller, switch
- TCP used to exchange messages
- 3 classes of OpenFlow messages
    - controller-to-switch
    - asynchronous (switch to controller)
    - symmetric (misc.)
- distinct from OpenFlow API
    - API used to specify generalized forwarding actions

## ICMP

> Internet control message protocol
> - used by hosts and routers to communicate network-level information
> - network-layer “above” IP (ICMP messages carried in IP datagrams)

ICMP message:
- type
- code
- first 8 bytes of IP data gram causing error

| Type | Code | description |
|------|------|------------------------------|
| 0  |     0    |    echo reply (ping)         |
| 3  |     0    |    dest network unreachable |
| 3  |     1    |    dest host unreachable     |
| 3  |     2    |    dest protocol unreachable |
| 3  |     3    |    dest port unreachable     |
| 3  |     6    |    dest network unknown      |
| 3  |     7    |    dest host unknown         |
| 4  |     0    |    source quench (congestion control not used) |
| 8  |     0    |    echo request (ping)       |
| 9  |     0    |    route advertisement       |
| 10 |    0     |   router discovery           |
| 11 |    0     |   TTL expired                |
| 12 |    0     |   bad IP header              |

## Network management configuration

### Components

1. Managing server
2. Network management protocol
3. Managed device
4. Data

### SNMP protocol

### NETCONF / YANG

---

## Exercise

> From [*Computer Networking: A Top Down Approach 7th Edition*](https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm)

Chapter 4

### P12

*Consider the topology shown in Figure 4.20. Denote the three subnets with hosts (starting
clockwise at 12:00) as Networks A, B, and C. Denote the subnets without hosts as Networks D,
E, and F.*

*a. Assign network addresses to each of these six subnets, with the following constraints: All
addresses must be allocated from 214.97.254/23; Subnet A should have enough
addresses to support 250 interfaces; Subnet B should have enough addresses to
support 120 interfaces; and Subnet C should have enough addresses to support 120
interfaces. Of course, subnets D, E and F should each be able to support two interfaces.
For each subnet, the assignment should take the form a.b.c.d/x or a.b.c.d/x – e.f.g.h/y.*

*b. Using your answer to part (a), provide the forwarding tables (using longest prefix
matching) for each of the three routers.*

![](../../../assets/computer_networking/c4p12.png)

a.

Subnet A: 214.97.255/24 (256 addresses)  
Subnet B: 214.97.254.0/25 - 214.97.254.0/29 (128-8 = 120 addresses)  
Subnet C: 214.97.254.128/25 (128 addresses)  
Subnet D: 214.97.254.0/31 (2 addresses)  
Subnet E: 214.97.254.2/31 (2 addresses)  
Subnet F: 214.97.254.4/30 (4 addresses)  

b. To simplify the solution, assume that no datagrams have router interfaces as
ultimate destinations. Also, label D, E, F for the upper-right, bottom, and upper
left interior subnets, respectively.

Router 1

| Longest Prefix Match               | Outgoing Interface |
|------------------------------------|--------------------|
| 11010110 01100001 11111111         | Subnet A           |
| 11010110 01100001 11111110 0000000 | Subnet D           |
| 11010110 01100001 11111110 000001  | Subnet F           |

Router 2

| Longest Prefix Match               | Outgoing Interface |
|------------------------------------|--------------------|
| 11010110 01100001 11111111 0000000 | Subnet D           |
| 11010110 01100001 11111110 0       | Subnet B           |
| 11010110 01100001 11111110 0000001 | Subnet E           |

Router 3

| Longest Prefix Match               | Outgoing Interface |
|------------------------------------|--------------------|
| 11010110 01100001 11111111 000001  | Subnet F           |
| 11010110 01100001 11111110 0000001 | Subnet E           |
| 11010110 01100001 11111110 1       | Subnet C           |

### P15

*Suppose datagrams are limited to 1,500 bytes (including header) between source Host A
and destination Host B. Assuming a 20-byte IP header, how many datagrams would be required
to send an MP3 consisting of 5 million bytes? Explain how you computed your answer.*

// TODO
