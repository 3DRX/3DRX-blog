---
title: "Dash.js source code reading: ABR triggering logic"
description: "My notes while working with Dash.js"
pubDate: "06/25/2023"
updatedDate: "06/25/2023"
heroImage: "https://source.unsplash.com/niUkImZcSP8"
---

For each ABR rule in [Dash.js](https://github.com/Dash-Industry-Forum/dash.js/),
the function `getMaxIndex()` is the entry point, which is called when ever
the program needs to decide the bit rate of next chunk to fetch.

Such as:
```js
function getMaxIndex(rulesContext) {
    const switchRequest = SwitchRequest(context).create();

    if (!rulesContext || !rulesContext.hasOwnProperty('getMediaInfo') || !rulesContext.hasOwnProperty('getMediaType') ||
        !rulesContext.hasOwnProperty('getScheduleController') || !rulesContext.hasOwnProperty('getStreamInfo') ||
        !rulesContext.hasOwnProperty('getAbrController') || !rulesContext.hasOwnProperty('useBufferOccupancyABR')) {
        return switchRequest;
    }

    const mediaInfo = rulesContext.getMediaInfo();
    const mediaType = rulesContext.getMediaType();
    const abrController = rulesContext.getAbrController();
    const throughputHistory = abrController.getThroughputHistory();
    const traceHistory = throughputHistory.getTraceHistory();
    const bufferLevel = dashMetrics.getCurrentBufferLevel(mediaType);
    const ladders = abrController.getBitrateList(mediaInfo);

    let choose_quality = -1;
    let estimate_throughput = -1;
    // some ABR algorithm logic

    switchRequest.quality = choose_quality;
    switchRequest.reason = {};
    switchRequest.reason.throughput = estimate_throughput;

    return switchRequest;
}
```

The call stack is as following:

- MediaPlayer
    - StreamController
        - Stream
            - StreamProcessor
                - scheduleController.startScheduleTimer()
                    - ScheduleController.schedule()
                        - abrController.checkPlaybackQuality()
                            - abrRulesCollection.getMaxQuality()
                                - *rule.getMaxIndex()

---

Related posts:
[PAR paper reading](https://www.3drx.top/blog/computer_network/par/),
[Computer Networking: Application Layer](https://www.3drx.top/blog/computer_network/application_layer/)

