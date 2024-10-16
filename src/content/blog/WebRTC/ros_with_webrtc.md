---
title: "ROS 传输视频流技术方案调研"
description: "WebRTC 等多种方案比较"
pubDate: "10/16/2024"
updatedDate: "10/17/2024"
---

<!--toc:start-->
- [什么是 ROS](#什么是-ros)
- [已有的方案](#已有的方案)
  - [Robot Web Tools](#robot-web-tools)
  - [Foxglove](#foxglove)
- [自己搭建 WebRTC Bridge](#自己搭建-webrtc-bridge)
  - [Go Binding of ROS Client Library](#go-binding-of-ros-client-library)
  - [WebRTC Library](#webrtc-library)
- [其他人怎么说](#其他人怎么说)
  - ["5 Ways to Stream Video from Robots and Why You Should Use WebRTC"](#5-ways-to-stream-video-from-robots-and-why-you-should-use-webrtc)
  - ["Seeking Best Practices for Cloud-Based Control and Management of Mobile Service Robots"](#seeking-best-practices-for-cloud-based-control-and-management-of-mobile-service-robots)
<!--toc:end-->

> 本文写于调研过程中，想要实现一个基于 ROS 的终端与服务器传输链路，上行传输视频，下行传输控制信号。

## 什么是 ROS

ChatGPT 给出了如下答案

> ROS（Robot Operating System）是一个用于机器人开发的开源框架，它提供了一系列工具和库，帮助开发者构建机器人应用。尽管它被称为“操作系统”，但实际上它是一个运行在已有操作系统（如Linux）之上的中间件。ROS主要有以下几个特点：
> 1. 分布式系统架构：ROS允许通过不同的节点（独立的进程）构建复杂的系统，这些节点可以在同一台机器上或通过网络在多台机器上运行。
> 2. 消息传递：节点之间通过消息进行通信。ROS支持异步的发布/订阅机制，允许节点通过特定的主题（topic）来交换消息。
> 3. 服务和动作机制：除了消息传递，ROS还提供了同步的服务（request/reply）模式和动作机制，用于执行更长时间的任务。
> 4. 工具链：ROS提供了丰富的工具用于调试、可视化、数据录制和回放等功能。例如，rviz是一个用于3D可视化的工具，rosbag用于录制和回放ROS消息。
> 5. 支持多种编程语言：ROS主要支持C++和Python编程，也可以与其他语言集成。
> 6. 丰富的社区和生态系统：ROS有一个庞大的开发者社区，提供了大量的开源包、驱动和算法库，使得它可以应用于从小型研究项目到工业机器人等多种场景。
>
> ROS的应用非常广泛，常见于自动驾驶、无人机控制、工业机器人和服务机器人等领域。

也就是说，想要将 ROS 中的摄像头数据转换为某种视频传输流，再将来自服务端的控制信号流转换为 ROS 中对其他模块的信号，
需要开发一个服务，既能与服务端建立传输通道，又能通过 ROS 的协议与 ROS 内其他模块通信。

## 已有的方案

### Robot Web Tools

https://robotwebtools.github.io
- [web_video_server](https://github.com/RobotWebTools/web_video_server)
是一个出现较早的 ROS 模块，其特性就像自身介绍的那样：

  > HTTP Streaming of ROS Image Topics in Multiple Formats.

- [webrtc_ros](https://github.com/RobotWebTools/webrtc_ros)
是一个使用了 libwebrtc 的 ROS 模块，将 image topic 转换为 WebRTC peer。
同时，还提供一个 demo 客户端。

这个组织下还有很多其他 ROS 相关的项目，可能会很有用。

### Foxglove

https://github.com/foxglove

提供一个基于 websocket 的 ROS bridge，将 ROS 的数据传输到一个进行可视化的客户端。
或许它提供很多其他功能，但 websocket 传输视频的效果估计一般。


## 自己搭建 WebRTC Bridge

如果要自己搭建 WebRTC Bridge，可以有以下组件使用。

### Go Binding of ROS Client Library

- https://github.com/tiiuae/rclgo
- https://github.com/bluenviron/goroslib

至于这两个能不能用，哪个好用可能真的得用了才知道。

### WebRTC Library

[Pion](https://github.com/pion)

## 其他人怎么说

> 找到了[一篇文章](https://transitiverobotics.com/blog/streaming-video-from-robots/)，
[一个 Reddit 帖子](https://www.reddit.com/r/robotics/comments/1buny5s/seeking_best_practices_for_cloudbased_control_and/)。
> 在这里简要概况一下主要内容。

### "5 Ways to Stream Video from Robots and Why You Should Use WebRTC"

这篇文章总结了几种传输视频流的方式：
1. 将每帧当作一个图片传输。
2. 通过 ssh tunnel 传输，如 [RViz](http://wiki.ros.org/rviz)。
3. 通过 websocket 传输，如 [Foxglove](https://github.com/foxglove)。
4. 通过 HTTP 传输，如 [web_video_server](https://github.com/RobotWebTools/web_video_server)。
5. 通过 WebRTC 传输。

### "Seeking Best Practices for Cloud-Based Control and Management of Mobile Service Robots"

这个帖子讨论了工业界管理移动机器人的传输方案，提问者描述了其所了解的基于 MQTT 的控制信号上下行传输方案，并提出了以下问题：
> 1. What are the best practices for managing a fleet of mobile robots through the cloud?
> 2. Is it appropriate to use ROS2 Actions for communication between the cloud and robots?
> 3. We faced challenges with our first-gen system, particularly in resuming scenarios after communication disruptions. Even when possible, the process to implement such recovery was complex. Would using ROS2 Actions enable automatic scenario resumption at the communication protocol level?

有如下回答：
> For the establishment of connections, we opted to utilize MQTT, subsequently transitioning to WebRTC for the establishment of audio, video, and data channels.
Our current implementation relies on WebRTC to monitor connectivity status, prompting a reconnection process in instances of disconnection.
>
> Unlike your approach, we decided against the utilization of ROS, choosing instead to develop a custom framework utilizing GoLang and the Pion library. This decision was motivated by our requirement to support execution on lower-end hardware platforms, which necessitated a more lightweight solution.
