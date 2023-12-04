---
title: "Read WebRTC GoogCC code"
description: "WebRTC GCC 代码阅读笔记"
pubDate: "09/12/2023"
updatedDate: "09/20/2023"
heroImage: "https://cdn-cdpl.sgp1.cdn.digitaloceanspaces.com/source/998b78e349061b4971c0a2b0e8d6be41/webrtc.png"
---

<!--toc:start-->

- [模块入口](#模块入口)
- [模块主函数](#模块主函数)
- [其他部分](#其他部分)
- [参考链接](#参考链接)
<!--toc:end-->

> 环境配置: [看这里](/blog/webrtc/compile_webrtc/)  
> 本文基于截至上次文字更新时间的最新 WebRTC main 分支

## 模块入口

类 `RtpTransportControllerSend` 中的 `controller_` 参数是一个具有 `NetworkControllerInterface` 的实例，
在此处便是一个 `GoogCcNetworkController` 的实例，即 GCC 控制器，
由 `RtpTransportControllerSend::MaybeCreateControllers()` 创建。

## 模块主函数

`GoogCcNetworkController` 中的核心是 `GoogCcNetworkController::OnTransportPacketsFeedback`，
这个函数在每收到一次 rtcp 包反馈的时候调用一次，其返回值是更新的对链路带宽的预估。
下文以代码注释的形式解读这个函数。

```cpp
NetworkControlUpdate GoogCcNetworkController::OnTransportPacketsFeedback(
    TransportPacketsFeedback report) {
  if (report.packet_feedbacks.empty()) {
    // TODO(bugs.webrtc.org/10125): Design a better mechanism to safe-guard
    // against building very large network queues.
    return NetworkControlUpdate();
  }

  // 计算延迟 >>>>>>>>

  if (congestion_window_pushback_controller_) {
    congestion_window_pushback_controller_->UpdateOutstandingData(
        report.data_in_flight.bytes());
  }
  TimeDelta max_feedback_rtt = TimeDelta::MinusInfinity();
  TimeDelta min_propagation_rtt = TimeDelta::PlusInfinity();
  Timestamp max_recv_time = Timestamp::MinusInfinity();

  std::vector<PacketResult> feedbacks = report.ReceivedWithSendInfo();
  for (const auto& feedback : feedbacks)
    max_recv_time = std::max(max_recv_time, feedback.receive_time);

  for (const auto& feedback : feedbacks) {
    TimeDelta feedback_rtt =
        report.feedback_time - feedback.sent_packet.send_time;
    TimeDelta min_pending_time = max_recv_time - feedback.receive_time;
    TimeDelta propagation_rtt = feedback_rtt - min_pending_time;
    max_feedback_rtt = std::max(max_feedback_rtt, feedback_rtt);
    min_propagation_rtt = std::min(min_propagation_rtt, propagation_rtt);
  }

  if (max_feedback_rtt.IsFinite()) {
    feedback_max_rtts_.push_back(max_feedback_rtt.ms());
    const size_t kMaxFeedbackRttWindow = 32;
    if (feedback_max_rtts_.size() > kMaxFeedbackRttWindow)
      feedback_max_rtts_.pop_front();
    // TODO(srte): Use time since last unacknowledged packet.
    bandwidth_estimation_->UpdatePropagationRtt(report.feedback_time,
                                                min_propagation_rtt);
  }
  // packet_feedback_only_ 的值永远是 true
  if (packet_feedback_only_) {
    if (!feedback_max_rtts_.empty()) {
      int64_t sum_rtt_ms =
          std::accumulate(feedback_max_rtts_.begin(), feedback_max_rtts_.end(),
                          static_cast<int64_t>(0));
      int64_t mean_rtt_ms = sum_rtt_ms / feedback_max_rtts_.size();
      if (delay_based_bwe_)
        delay_based_bwe_->OnRttUpdate(TimeDelta::Millis(mean_rtt_ms));
    }

    TimeDelta feedback_min_rtt = TimeDelta::PlusInfinity();
    for (const auto& packet_feedback : feedbacks) {
      TimeDelta pending_time = max_recv_time - packet_feedback.receive_time;
      TimeDelta rtt = report.feedback_time -
                      packet_feedback.sent_packet.send_time - pending_time;
      // Value used for predicting NACK round trip time in FEC controller.
      feedback_min_rtt = std::min(rtt, feedback_min_rtt);
    }
    if (feedback_min_rtt.IsFinite()) {
      bandwidth_estimation_->UpdateRtt(feedback_min_rtt, report.feedback_time);
    }

  // 计算延迟 <<<<<<<<

  // 计算丢包 >>>>>>>>

    expected_packets_since_last_loss_update_ +=
        report.PacketsWithFeedback().size();
    for (const auto& packet_feedback : report.PacketsWithFeedback()) {
      if (!packet_feedback.IsReceived())
        lost_packets_since_last_loss_update_ += 1;
    }
    if (report.feedback_time > next_loss_update_) {
      next_loss_update_ = report.feedback_time + kLossUpdateInterval;
      bandwidth_estimation_->UpdatePacketsLost(
          lost_packets_since_last_loss_update_,
          expected_packets_since_last_loss_update_, report.feedback_time);
      expected_packets_since_last_loss_update_ = 0;
      lost_packets_since_last_loss_update_ = 0;
    }
  }

  // 计算丢包 <<<<<<<<

  absl::optional<int64_t> alr_start_time =
      alr_detector_->GetApplicationLimitedRegionStartTime();

  if (previously_in_alr_ && !alr_start_time.has_value()) {
    int64_t now_ms = report.feedback_time.ms();
    acknowledged_bitrate_estimator_->SetAlrEndedTime(report.feedback_time);
    probe_controller_->SetAlrEndedTimeMs(now_ms);
  }
  previously_in_alr_ = alr_start_time.has_value();
  acknowledged_bitrate_estimator_->IncomingPacketFeedbackVector(
      report.SortedByReceiveTime());

  // 计算以及预估吞吐量 >>>>>>>>

  // 已知吞吐量，根据正常发送流量以及探测流量估计得到
  auto acknowledged_bitrate = acknowledged_bitrate_estimator_->bitrate();
  bandwidth_estimation_->SetAcknowledgedRate(acknowledged_bitrate,
                                             report.feedback_time);
  for (const auto& feedback : report.SortedByReceiveTime()) {
    if (feedback.sent_packet.pacing_info.probe_cluster_id !=
        PacedPacketInfo::kNotAProbe) {
      probe_bitrate_estimator_->HandleProbeAndEstimateBitrate(feedback);
    }
  }

  if (network_estimator_) {
    network_estimator_->OnTransportPacketsFeedback(report);
    auto prev_estimate = estimate_;
    estimate_ = network_estimator_->GetCurrentEstimate();
    // TODO(srte): Make OnTransportPacketsFeedback signal whether the state
    // changed to avoid the need for this check.
    if (estimate_ && (!prev_estimate || estimate_->last_feed_time !=
                                            prev_estimate->last_feed_time)) {
      event_log_->Log(std::make_unique<RtcEventRemoteEstimate>(
          estimate_->link_capacity_lower, estimate_->link_capacity_upper));
      probe_controller_->SetNetworkStateEstimate(*estimate_);
    }
  }
  absl::optional<DataRate> probe_bitrate =
      probe_bitrate_estimator_->FetchAndResetLastEstimatedBitrate();
  if (ignore_probes_lower_than_network_estimate_ && probe_bitrate &&
      estimate_ && *probe_bitrate < delay_based_bwe_->last_estimate() &&
      *probe_bitrate < estimate_->link_capacity_lower) {
    probe_bitrate.reset();
  }
  if (limit_probes_lower_than_throughput_estimate_ && probe_bitrate &&
      acknowledged_bitrate) {
    // Limit the backoff to something slightly below the acknowledged
    // bitrate. ("Slightly below" because we want to drain the queues
    // if we are actually overusing.)
    // The acknowledged bitrate shouldn't normally be higher than the delay
    // based estimate, but it could happen e.g. due to packet bursts or
    // encoder overshoot. We use std::min to ensure that a probe result
    // below the current BWE never causes an increase.
    DataRate limit =
        std::min(delay_based_bwe_->last_estimate(),
                 *acknowledged_bitrate * kProbeDropThroughputFraction);
    probe_bitrate = std::max(*probe_bitrate, limit);
  }

  NetworkControlUpdate update;
  bool recovered_from_overuse = false;

  // 基于延迟的带宽估计
  DelayBasedBwe::Result result;
  result = delay_based_bwe_->IncomingPacketFeedbackVector(
      report, acknowledged_bitrate, probe_bitrate, estimate_,
      alr_start_time.has_value());

  if (result.updated) {
    if (result.probe) {
      bandwidth_estimation_->SetSendBitrate(result.target_bitrate,
                                            report.feedback_time);
    }
    // Since SetSendBitrate now resets the delay-based estimate, we have to
    // call UpdateDelayBasedEstimate after SetSendBitrate.
    bandwidth_estimation_->UpdateDelayBasedEstimate(report.feedback_time,
                                                    result.target_bitrate);
  }
  // 基于丢包的带宽估计
  bandwidth_estimation_->UpdateLossBasedEstimator(
      report, result.delay_detector_state, probe_bitrate,
      estimate_ ? estimate_->link_capacity_upper : DataRate::PlusInfinity(),
      alr_start_time.has_value());
  if (result.updated) {
    // Update the estimate in the ProbeController, in case we want to probe.
    MaybeTriggerOnNetworkChanged(&update, report.feedback_time);
  }

  recovered_from_overuse = result.recovered_from_overuse;

  if (recovered_from_overuse) {
    probe_controller_->SetAlrStartTimeMs(alr_start_time);
    auto probes = probe_controller_->RequestProbe(report.feedback_time);
    update.probe_cluster_configs.insert(update.probe_cluster_configs.end(),
                                        probes.begin(), probes.end());
  }

  // No valid RTT could be because send-side BWE isn't used, in which case
  // we don't try to limit the outstanding packets.
  if (rate_control_settings_.UseCongestionWindow() &&
      max_feedback_rtt.IsFinite()) {
    UpdateCongestionWindowSize();
  }
  if (congestion_window_pushback_controller_ && current_data_window_) {
    congestion_window_pushback_controller_->SetDataWindow(
        *current_data_window_);
  } else {
    update.congestion_window = current_data_window_;
  }

  // 计算以及预估吞吐量 <<<<<<<<

  return update;
}
```

## 其他部分

可以注意到，`OnTransportPacketsFeedback` 中返回的 `update` 对象的 probe 相关参数为空。
这是因为 probe 相关参数由 `GoogCcNetworkController::OnProcessInterval()`
控制。`GoogCcNetworkController` 中 public 函数返回的 update 是所有函数共用的。
具体调用的 interval 参见 [GCC 控制器创建流程](#模块入口)

### 链路容量预估

`LinkCapacityTracker` （在 send_side_bandwidth_estimation.cc 中）

有四个输入

1. 根据基于延迟的带宽预估值变化

   如果当前基于延迟的预估带宽比上次的小，就将 link_capacity 更新为
   `link_capacity = min(link_capacity, delay_based_bwe)`

2. 根据初始值

   `link_capacity = start_rate`

3. 根据接收端实际速率和发送速率对比

   已知吞吐量等于上面两者最小值，
   如果这个值大于当前 link_capacity，则进行下面操作，
   否则不更新预估值。

```cpp
TimeDelta delta = at_time - last_link_capacity_update_;
double alpha = delta.IsFinite() ? exp(-(delta / tracking_rate.Get())) : 0;
capacity_estimate_bps_ = alpha * capacity_estimate_bps_ +
                         (1 - alpha) * acknowledged_target.bps<double>();
```

4. 根据 RTT backoff

   `link_capacity = min(link_capacity, backoff_rate)`
   其中 backoff_rate 的值由以下逻辑产生

```cpp
void SendSideBandwidthEstimation::UpdateEstimate(Timestamp at_time) {
  if (rtt_backoff_.IsRttAboveLimit()) {
    if (at_time - time_last_decrease_ >= rtt_backoff_.drop_interval_ &&
        current_target_ > rtt_backoff_.bandwidth_floor_) {
      time_last_decrease_ = at_time;
      DataRate new_bitrate =
          std::max(current_target_ * rtt_backoff_.drop_fraction_,
                   rtt_backoff_.bandwidth_floor_.Get());
      link_capacity_.OnRttBackoff(new_bitrate, at_time);
      // 上一行的 new_bitrate 就是 backoff_rate
      UpdateTargetBitrate(new_bitrate, at_time);
      return;
    }
    // TODO(srte): This is likely redundant in most cases.
    ApplyTargetLimits(at_time);
    return;
  }

  ...

}
```

### 码率约束限制

```cpp
struct BitrateConstraints {
  int min_bitrate_bps = 0;
  int start_bitrate_bps = kDefaultStartBitrateBps;
  int max_bitrate_bps = -1;

 private:
  static constexpr int kDefaultStartBitrateBps = 300000;
};
```

```cpp
BitrateConstraints DefaultBitrateConstraints() {
  BitrateConstraints constraints;

  constraints.min_bitrate_bps = 0;
  constraints.start_bitrate_bps = INT_MAX;
  constraints.max_bitrate_bps = INT_MAX;
  return constraints;
}
```

## GCC 结果生效处

GCC 中 `OnTransportPacketsFeedback` 函数返回 target_rate 和 stable_target_rate 之后，
其对编码起到限制作用的地方在
`void RtpVideoSender::OnBitrateUpdated(BitrateAllocationUpdate update, int framerate)`。
这里的 update 参数就是 GCC 返回的值。

该函数首先通过 `fec_controller_->UpdateFecRates()` 函数计算当前丢包和延迟下做冗余后剩余带宽，
然后告知编码器按照预估链路总带宽 - 冗余信息所占用带宽编码。

## 参考链接

https://blog.csdn.net/fanyamin/article/details/128479333

https://blog.csdn.net/weixin_29405665/article/details/110420315

https://zhuanlan.zhihu.com/p/490526586
