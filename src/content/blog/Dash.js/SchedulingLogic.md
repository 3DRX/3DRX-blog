---
title: "Dash.js 源码阅读: Scheduling Logic"
description: "My notes while working with Dash.js, trying to enable the ability of getNextFragment in ABR algorithm."
pubDate: "07/4/2023"
updatedDate: "07/4/2023"
heroImage: "http://reference.dashif.org/dash.js/latest/samples/"
---

## Start point

`ScheduleController.js` 中的 schedule 函数每隔一段时间被调用一次（timer fired），
这个时间间隔在 `code/Settings.js` 的 897 行（v4.7.1）配置，默认为 500ms。

主要逻辑在 `_shouldScheduleNextRequest()` 对应的分支语句，当 timeout 时
首先调用 ABR 算法，查询是否需要切换码率，如果需要，则再次调用 ABR 算法确认。
如果这一次的 ABR 算法结果与之前请求的码率相同，则发起请求。

