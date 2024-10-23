---
title: "How to build and use webrtc_ros"
description: "webrtc_ros 实战"
pubDate: "10/23/2024"
updatedDate: "10/23/2024"
---

<!--toc:start-->
- [Previously](#previously)
- [webrtc_ros](#webrtcros)
- [System Environment](#system-environment)
- [Build Steps](#build-steps)
- [Run](#run)
- [Problem Solving](#problem-solving)
  - [Failed to initialize the ADM](#failed-to-initialize-the-adm)
  - [PulseAudio stuff is somehow unhappy](#pulseaudio-stuff-is-somehow-unhappy)
<!--toc:end-->

## Previously

[ROS 传输视频流技术方案调研](/blog/webrtc/ros_with_webrtc/)

## webrtc_ros

> https://github.com/RobotWebTools/webrtc_ros ：一个将 ROS Image Topic 转换为 WebRTC 视频流的库。

## System Environment

Ubuntu 22.04 LTS, ROS 2 Humble.

## Build Steps

1. `cd` to your ros workspace's `src/` folder.
2. `git clone https://github.com/RobotWebTools/webrtc_ros.git`.
3. `cd` back to your ros workspace's root directory.
3. `colcon build --packages-select webrtc`.
4. `colcon build --packages-select webrtc`.

## Run

Open 2 shells.

First shell
1. Launch the camera topic producer, for example:
`ros2 launch astra_camera gemini.launch.py`.

Second shell
1. Run webrtc_ros server node:
`ros2 run webrtc_ros webrtc_ros_server_node`.

## Problem Solving

### Failed to initialize the ADM

```
#
# Fatal error in: ../../../src/webrtc_ros/webrtc/build/webrtc/src/media/engine/adm_helpers.cc, line 39
# last system error: 88
# Check failed: 0 == adm->Init() (0 vs. -1)
# Failed to initialize the ADM.[ros2run]: Aborted
```

This command:
`pulseaudio --start --log-target=syslog`
might be useful when the webrtc_ros_server_node crashes when establishing
WebRTC connection.

> BTW: The [issues page](https://github.com/RobotWebTools/webrtc_ros/issues)
is really helpful when encountering problems, don't forget to check it out.

### PulseAudio stuff is somehow unhappy

```
XDG_RUNTIME_DIR (/run/user/1001) is not owned by us (uid 1000), but by uid 1001! (This could e.g. happen if you try to connect to
a non-root PulseAudio as a root user, over the native protocol. Don't do that.)
XDG_RUNTIME_DIR (/run/user/1001) is not owned by us (uid 1000), but by uid 1001! (This could e.g. happen if you try to connect to
a non-root PulseAudio as a root user, over the native protocol. Don't do that.)
```

The lazy solution: `sudo chown -R $USER /run/user/1001/`
