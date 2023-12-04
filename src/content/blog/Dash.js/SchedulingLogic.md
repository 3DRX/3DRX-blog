---
title: "Dash.js 源码阅读: Scheduling Logic"
description: "My notes while working with Dash.js, trying to enable the ability of getNextFragment in ABR algorithm."
pubDate: "07/4/2023"
updatedDate: "07/4/2023"
heroImage: "https://source.unsplash.com/VLzAkbs5afg"
---

<!--toc:start-->

- [Start point](#start-point)
  - [\_shouldScheduleNextRequest](#shouldschedulenextrequest)
  - [\_getNextFragment](#getnextfragment)
  - [执行请求](#执行请求)
  <!--toc:end-->

## Start point

`ScheduleController.js` 中的 schedule 函数每隔一段时间被调用一次（timer fired），
这个时间间隔在 `code/Settings.js` 的 897 行（v4.7.1）配置，默认为 500ms。

主要逻辑在 `_shouldScheduleNextRequest()` 对应的分支语句，当 timeout 时
首先[判断是否要安排](#_shouldScheduleNextRequest)下一个视频片段的请求。
其次，调用 ABR 算法，查询是否需要切换码率，如果需要，则再次调用 ABR 算法确认。
如果这一次的 ABR 算法结果与之前请求的码率相同，则[开始请求流程](#_getNextFragment)。

### \_shouldScheduleNextRequest

> 判断是否安排下一个请求

对于静态点播视频而言，这里需要关注的就是 currentRepresentationInfo 不为空且
`_shouldBuffer()` 为 `true` （即当前 buffer 没有超过固定阈值）。

### \_getNextFragment

> 发起请求事件

Dash.js 中有两种 segment: init or media segment，
这里首先判断要请求的是否是切换码率或轨道的第一个请求，
如果是则触发 `Events.INIT_FRAGMENT_NEEDED`，
否则触发 `Events.MEDIA_FRAGMENT_NEEDED`。

### 执行请求

> 在 StreamProcessor.js 中监听并响应上文发起请求的事件。

首先判断是否与其他操作 buffer 的任务有冲突，
如果正在更新媒体列表或者正在修剪 buffer，则忽略请求。

在执行请求前，还有两个判断逻辑，分别是延迟发送请求的判断和抛弃请求的判断。

延迟发送请求： `scheduleController.setTimeToLoadDelay(n: number)`
是一个为 ABR 算法提供的接口。

抛弃请求： 黑名单 URL 等等，没有算法相关逻辑。
