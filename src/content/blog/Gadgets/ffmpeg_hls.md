---
title: "Create HLS stream using ffmpeg"
description: "How to generate multiple tracks"
pubDate: "10/06/2024"
updatedDate: "10/06/2024"
heroImage: ""
---

Example with input video `input.mp4`, slow down 5x, generate 4 quality levels with different bit rates and resolutions,
and control the chunk size to 2 seconds:

First create directory `hls_tracks` and `cd` into it.

```sh
ffmpeg -i ../input.mp4 \
  -filter_complex \
  "[0:v]setpts=5*PTS[slowv]; \
   [slowv]split=4[v1][v2][v3][v4]; \
   [v1]fps=6[v1out]; \
   [v2]fps=6,scale=w=1920:h=960[v2out]; \
   [v3]fps=6,scale=w=1280:h=640[v3out]; \
   [v4]fps=6,scale=w=856:h=428[v4out]" \
  -map "[v1out]" -c:v:0 libx264 -b:v:0 2.5M -maxrate:v:0 2.5M -bufsize:v:0 5M -g 12 \
  -map "[v2out]" -c:v:1 libx264 -b:v:1 1.25M -maxrate:v:1 1.25M -bufsize:v:1 1.5M -g 12 \
  -map "[v3out]" -c:v:2 libx264 -b:v:2 0.6M -maxrate:v:2 0.6M -bufsize:v:2 1.2M -g 12 \
  -map "[v4out]" -c:v:3 libx264 -b:v:3 0.3M -maxrate:v:3 0.3M -bufsize:v:3 0.6M -g 12 \
  -f hls \
  -var_stream_map "v:0 v:1 v:2 v:3" \
  -master_pl_name all.m3u8 \
  -hls_time 2 \
  -hls_list_size 0 \
  -hls_segment_filename "stream_%v/data%03d.ts" \
  stream_%v.m3u8
```

> In the above command, the -g 12 in each output track is calculated by `hls_time(chunk time) x fps`.

In my case, the auto generated m3u8 files are incorrect, so the following script is needed to patch them.

```python
import os

if __name__ == "__main__":
    # for all stream_x.m3u8 files in ./image_pca/
    # replace all lines with dataxxx.ts to stream_x/dataxxx.ts
    for filename in os.listdir("./image_pca/"):
        if filename.endswith(".m3u8") and filename != "all.m3u8":
            with open("./hls_tracks/" + filename, "r") as f:
                lines = f.readlines()
            with open("./hls_tracks/" + filename, "w") as f:
                for line in lines:
                    if line.startswith("data"):
                        f.write(filename.split(".")[0] + "/" + line)
                    else:
                        f.write(line)
        pass
    pass
```
