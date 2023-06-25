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


