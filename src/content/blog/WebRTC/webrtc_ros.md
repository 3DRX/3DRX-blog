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
- [Deep Dive](#deep-dive)
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

## Deep Dive

The client and server shares signaling information using JSON, as an example shown below.

```json
{
   "type":"configure",
   "actions":[
      {
         "type":"add_stream",
         "id":"webrtc_ros-stream-658559275"
      },
      {
         "type":"add_video_track",
         "stream_id":"webrtc_ros-stream-658559275",
         "id":"webrtc_ros-stream-658559275/subscribed_video",
         "src":"ros_image:/camera/color/image_raw"
      }
   ]
}
```

```json
{
   "sdp":"v=0\r\no=- 5637367399711775237 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=video 9 UDP/TLS/RTP/SAVPF 96 97 98 99 125 121 124\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:4Iq3\r\na=ice-pwd:nVms1dq4dd2+m9l3zoBHfY6S\r\na=ice-options:trickle\r\na=fingerprint:sha-256 CB:ED:8E:71:68:A8:01:7A:86:12:75:06:C8:73:33:2C:B6:23:8D:CF:D3:EF:B4:C1:A3:AD:4F:69:E5:D5:51:16\r\na=setup:active\r\na=mid:video\r\na=extmap:1 urn:ietf:params:rtp-hdrext:toffset\r\na=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=extmap:3 urn:3gpp:video-orientation\r\na=extmap:4 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\na=extmap:5 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay\r\na=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/video-content-type\r\na=extmap:7 http://www.webrtc.org/experiments/rtp-hdrext/video-timing\r\na=extmap:8 http://www.webrtc.org/experiments/rtp-hdrext/color-space\r\na=recvonly\r\na=rtcp-mux\r\na=rtcp-rsize\r\na=rtpmap:96 VP8/90000\r\na=rtcp-fb:96 goog-remb\r\na=rtcp-fb:96 transport-cc\r\na=rtcp-fb:96 ccm fir\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=rtpmap:97 rtx/90000\r\na=fmtp:97 apt=96\r\na=rtpmap:98 VP9/90000\r\na=rtcp-fb:98 goog-remb\r\na=rtcp-fb:98 transport-cc\r\na=rtcp-fb:98 ccm fir\r\na=rtcp-fb:98 nack\r\na=rtcp-fb:98 nack pli\r\na=fmtp:98 profile-id=0\r\na=rtpmap:99 rtx/90000\r\na=fmtp:99 apt=98\r\na=rtpmap:125 red/90000\r\na=rtpmap:121 rtx/90000\r\na=fmtp:121 apt=125\r\na=rtpmap:124 ulpfec/90000\r\n",
   "type":"answer"
}
```

```json
{
   "sdp_mline_index":0,
   "sdp_mid":"video",
   "candidate":"candidate:26026609571 udp 2113937151 dc56f0b3-d444-44bd-9d7d-99776b96e816.local 65289 typ host generation 0 ufrag 4Iq3 network-cost 999",
   "type":"ice_candidate"
}
```

```json
{
   "sdp_mline_index":0,
   "sdp_mid":"video",
   "candidate":"candidate:20369424531 udp 2113939711 7241ff40-ce87-4048-807b-df218db424f3.local 63919 typ host generation 0 ufrag 4Iq3 network-cost 999",
   "type":"ice_candidate"
}
```
