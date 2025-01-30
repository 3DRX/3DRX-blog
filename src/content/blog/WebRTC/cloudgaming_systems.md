---
title: "云游戏传输相关技术调研"
description: "Transportation technologies in cloud game"
pubDate: "01/30/2025"
updatedDate: "01/31/2025"
---

## 云游戏需要传输什么

- 下行
  - 视频
    - 视频编码
    - 前向冗余编码
  - 音频
    - 音频编码
- 上行：控制信息
  - 键盘
  - 鼠标
  - 手柄

## 一个完整的云游戏应用中有哪些组成部分

仅传输侧，不考虑业务。

- 游戏
- 云游戏服务
- 客户端

其中游戏本身作为一个单独的进程，和用户在本地下载到的游戏别无二致。
一个可扩展的云游戏服务不应依赖游戏本身对云游戏做适配，而是将两者解耦。

云游戏服务负责拉起游戏进程，捕获游戏画面和音频并将其编码并推流给客户端。
同时，也接收来自客户端的控制信息，并将控制信息通过某种方式接回到游戏的输入中。

客户端需要能解码云游戏服务传输到的音视频内容并将其播放给用户，
同时接受用户输入，将其编码后发送到服务器。

## 云游戏传输的不同方案

### NVIDIA GameStream

GameStream 是一个基于 RTSP 的非开源协议，在 rtsp 的 rtp-rtcp
建立连接之前通过一个 tcp (nvhttp) 建立握手，并在客户端与服务器之间同步信息。
NVIDIA 现已不再维护 GameStream 与 GeForce Experience，转而开发 GeForce Now。
但是有一个逆向了 GameStream 协议的开源客户端与服务器可用于在内网传输游戏，
分别是客户端 [moonlight](https://github.com/moonlight-stream) 和服务端
[sunshine](https://github.com/LizardByte/Sunshine)。

通过硬件编解码视频、底层捕获游戏窗口画面和使用基于 rtp-rtcp 的
rtsp 作为传输协议， sunshine 和 moonlight 取得了很低的延迟，
但其技术架构从根本上不适应在公网提供服务的云游戏。原因有两点：
1. 没有拥塞控制算法，尽管使用了 rtp-rtcp 协议，但 sunshine 没有使用类似 WebRTC
中的 twcc 或 rtcp-feedback 这样的机制能给发送端用于带宽估计。
因此，sunshine 中的带宽控制简单地在 pacing 中写死在了 0.8Gbps。
2. 没有自适应的 FEC 冗余度调控，尽管 sunshine 有 FEC 冗余度可变的能力，
但其冗余度值需要用户在开始一个 session 前手动设置，并且一个 session
中间不能修改。

尽管在带宽充足的情况下端到端延迟很低（非拥塞控制算法层面的优化做的很好，如线程同步优化），sunshine
的这两点缺陷使其根本无法被用于云游戏的传输。

### WebRTC

WebRTC 适合音视频与其他类型信息的实时传输，因此适用于云游戏传输场景。
其中音视频负载会通过 SRTP 包发送（WebRTC 中的 track），
控制信息会通过 SRTP 发送（WebRTC 中的 data channel）。

#### WebRTC 传输游戏的开源项目

[docker-steam-headless](https://github.com/Steam-Headless/docker-steam-headless/blob/master/docs/compose-files/.env)
这个项目中可以在 docker 容器中构建一个运行 X11 和 steam 的环境，并且可通过一个 Web UI 访问 steam。
其中的音视频传输有两种方案，分别是 VNC 与 [neko](https://github.com/m1k1o/neko)。
由于 VNC 显然不是我们所需的传输方案，这里介绍下 neko。
neko 是 golang 开发的，在网络侧使用了 pion WebRTC 库，在媒体编码侧使用了 gstreamer。
尽管 neko 使用了 WebRTC 的传输协议，但也没有应用拥塞控制和
FEC（简单读了下代码暂且下的结论，如有误请指正）。

## 开源云游戏技术的发展方向

从上面几个方案的例子可以看出，一个优秀的云游戏传输的实现需要以下几个技术的组合才能实现：
1. 高效的画面捕获，如 NvFBC。
2. 可以实时编码的编码器（大概率需要硬件编码），如 NVENC。
3. 某种传输协议，如 WebRTC 或 RTSP，需要足够低延迟（UDP -> RTP）。
4. 拥塞控制，这也是现在各个方案的开源项目最欠缺的部分，如 WebRTC 中的 GCC。
5. 自适应的，能和拥塞控制相适配的 FEC 编码，如 WebRTC 中的 FEC 实现方案。

从网络协议的能力来说，WebRTC 更占优势。从媒体栈如硬件编解码的能力而言，
现有的 sunshine-moonlight 更具优势。但是目前 sunshine-moonlight
有其作为 c++ 项目的维护难度，而且也因为其诞生之初是逆向了 GameStream
的协议，其必然不能成为标准被广泛使用。而另一方面，neko
项目的关注点是容器化的浏览器窗口（用于访问 docker 中的各个 webui）而非游戏传输。
因此，在技术上存在对能够兼具现有方案协议栈和媒体栈优势并且专门面向云游戏传输优化的项目的需求。
