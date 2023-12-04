---
title: "Read WebRTC Fec code"
description: "WebRTC Fec 代码阅读笔记"
pubDate: "09/12/2023"
updatedDate: "09/13/2023"
heroImage: "https://cdn-cdpl.sgp1.cdn.digitaloceanspaces.com/source/998b78e349061b4971c0a2b0e8d6be41/webrtc.png"
---

## FEC 编码

WebRTC 中的 FEC 算法有两种，FlexFec 和 UlpFec，
其中默认的是 UlpFec。
两种 Fec 类的接口相同，是 `VideoFecGenerator`，
`UlpfecGenerator::AddPacketAndGenerateFec(const RtpPacketToSend& packet)` 是 fec 编码过程的入口。

其中调用了函数 `int ForwardErrorCorrection::EncodeFec(...)`

```cpp
...

fec_->EncodeFec(media_packets_, params.fec_rate, kNumImportantPackets,
        kUseUnequalProtection, params.fec_mask_type,
        &generated_fec_packets_);

...
```

该函数中如下语句控制产生 FEC 冗余数据量的比例

```cpp
...

// Prepare generated FEC packets.
int num_fec_packets = NumFecPackets(num_media_packets, protection_factor);
if (num_fec_packets == 0) {
  return 0;
}

... encode fec
```

## FEC rate 决策

`bool VCMNackFecMethod::ProtectionFactor(...)`

## 参考链接

https://xjsxjtu.github.io/2017-07-16/LearningWebRTC-adafec/

https://xjsxjtu.github.io/2017-07-16/LearningWebRTC-fec/
