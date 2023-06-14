---
title: "Computer Networking: Transport Layer"
description: "计算机网络：传输层"
pubDate: "06/14/2023"
updatedDate: "06/15/2023"
heroImage: "https://source.unsplash.com/M5tzZtFCOfs"
---

## Transport layer services

- provide **logical communication** between application processes running on different hosts
- transport protocols actions
    - sender: breaks messages into **segments**, passes to network layer
    - receiver: reassembles segments, passes to application layer
- 2 protocols
    - TCP
    - UDP

## Multiplexing and demultiplexing

> multiplexing: 复用

Sender handle data from multiple sockets,
add transport header (later used for demultiplexing).

Receiver use header info to deliver received segments to correct socket.

Host uses **IP addresses and port numbers** to direct segment to appropriate socket.

- UDP: demultiplexing using destination port number (only)
- TCP: demultiplexing using 4-tuple: source and destination IP addresses,
and port numbers

## Connectionless transport: UDP

> - "best effort" service
> - segment may be lost or out of order
> - connectionless, no hand shaking

### Why we need UDP?

- No connection establishment
- Simple: no state
- No congestion control

### Use case of UDP

- streaming multimedia apps
- DNS
- SNMP
- HTTP/3

If reliable transfer needed over UDP (e.g. HTTP/3):
- add reliability at application layer
- add congestion control at application layer

### Internet checksum

## Principles of reliable data transfer

## Connection-oriented transport: TCP

## Principles of congestion control

## TCP congestion control

## Evolution of transport-layer functionality
