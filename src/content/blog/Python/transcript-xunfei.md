---
title: "在 Python 中使用讯飞语音转写 API"
description: "Using Xunfei Long Form ASR API with Python"
pubDate: "08/20/2024"
updatedDate: "08/20/2024"
heroImage: ""
---

相关链接
- [API 接口文档](https://www.xfyun.cn/doc/asr/ifasr_new/API.html#%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E)
- [语音转写服务控制台](https://console.xfyun.cn/services/lfasr)

第三方库
- [tqdm](https://tqdm.github.io/)

```python
import base64
import hashlib
import hmac
import json
import os
import time
import requests
from urllib import parse  # pyright: ignore

from tqdm import tqdm

lfasr_host = "https://raasr.xfyun.cn/v2/api"
# 请求的接口名
api_upload = "/upload"
api_get_result = "/getResult"


class RequestApi(object):
    def __init__(self, appid, secret_key, upload_file_path):
        self.appid = appid
        self.secret_key = secret_key
        self.upload_file_path = upload_file_path
        self.ts = str(int(time.time()))
        self.signa = self.get_signa()

    def get_signa(self):
        appid = self.appid
        secret_key = self.secret_key
        m2 = hashlib.md5()
        m2.update((appid + self.ts).encode("utf-8"))
        md5 = m2.hexdigest()
        md5 = bytes(md5, encoding="utf-8")
        # 以secret_key为key, 上面的md5为msg， 使用hashlib.sha1加密结果为signa
        signa = hmac.new(secret_key.encode("utf-8"), md5, hashlib.sha1).digest()
        signa = base64.b64encode(signa)
        signa = str(signa, "utf-8")
        return signa

    def upload(self):
        # print("上传部分：")
        upload_file_path = self.upload_file_path
        file_len = os.path.getsize(upload_file_path)
        file_name = os.path.basename(upload_file_path)

        param_dict = {}
        param_dict["appId"] = self.appid
        param_dict["signa"] = self.signa
        param_dict["ts"] = self.ts
        param_dict["fileSize"] = file_len
        param_dict["fileName"] = file_name
        param_dict["duration"] = "200"
        # print("upload参数：", param_dict)
        data = open(upload_file_path, "rb").read(file_len)

        response = requests.post(
            url=lfasr_host + api_upload + "?" + parse.urlencode(param_dict),
            headers={"Content-type": "application/json"},
            data=data,
        )
        # print("upload_url:", response.request.url)
        result = json.loads(response.text)
        # print("upload resp:", result)
        return result

    def get_result(self) -> dict:
        uploadresp = self.upload()
        orderId = uploadresp["content"]["orderId"]
        param_dict = {}
        param_dict["appId"] = self.appid
        param_dict["signa"] = self.signa
        param_dict["ts"] = self.ts
        param_dict["orderId"] = orderId
        param_dict["resultType"] = "transfer"
        # print("")
        # print("查询部分：")
        # print("get result参数：", param_dict)
        status = 3
        max_time = 0
        pbar = tqdm(total=100, bar_format="{l_bar}{bar}| [{elapsed}<{remaining}]")
        # 建议使用回调的方式查询结果，查询接口有请求频率限制
        result = {}
        while status == 3:
            response = requests.post(
                url=lfasr_host + api_get_result + "?" + parse.urlencode(param_dict),
                headers={"Content-type": "application/json"},
            )
            result = json.loads(response.text)
            estimate_time = result["content"]["taskEstimateTime"]
            max_time = max(max_time, estimate_time)
            pbar.total = max_time
            pbar.n = max_time - estimate_time
            pbar.refresh()
            status = result["content"]["orderInfo"]["status"]
            if status == 4:
                break
            time.sleep(5)
        return result


def extract_w_values(data, key="w"):
    values = []
    if isinstance(data, dict):
        for k, v in data.items():
            if k == key:
                values.append(v)
                pass
            values.extend(extract_w_values(v, key))
            pass
    elif isinstance(data, list):
        for item in data:
            values.extend(extract_w_values(item, key))
            pass
        pass
    return values


def parse_json(jsonobj: dict) -> str:
    lattice = jsonobj["lattice"]
    values = ""
    for item in lattice:
        item = json.loads(item["json_1best"])
        rt = item["st"]["rt"]
        tmp_values = extract_w_values(rt)
        values += "".join(tmp_values)
        pass
    return values


if __name__ == "__main__":
    api = RequestApi(
        appid="xxx",
        secret_key="xxxxxx",
        upload_file_path=r"./video.mp4",
    )

    res = api.get_result()
    res = json.loads(res["content"]["orderResult"])
    print(parse_json(res))
    pass
```
