---
title: "Compiling WebRTC"
description: "编译 WebRTC"
pubDate: "07/2/2023"
updatedDate: "08/8/2023"
heroImage: "https://cdn-cdpl.sgp1.cdn.digitaloceanspaces.com/source/998b78e349061b4971c0a2b0e8d6be41/webrtc.png"
---

<!--toc:start-->

- [System Requirements](#system-requirements)
- [Normal Process (from Google's repo)](#normal-process-from-googles-repo)
- [如果访问 Google 有困难](#如果访问-google-有困难)
<!--toc:end-->

## System Requirements

By the time when this article is written, the tooling around building WebRTC seems not working
properly on Ubuntu 22.04, but is fine on Ubuntu 20.04 and Debian 12.

Also, you need to install `pkg-config`.

## Normal Process (from Google's repo)

First, clone this repo `https://chromium.googlesource.com/chromium/tools/depot_tools.git`
and add it to PATH. Note, use absolute path to this repo, don't use `~`.

After this, you can follow [the guide from Google](https://webrtc.github.io/webrtc-org/native-code/development/).

BTW, use `gclient sync --nohooks --verbose` since gclient might seem to be "stuck" without the `--verbose` parameter,
due to its slowness.

## 如果访问 Google [有困难](https://en.wikipedia.org/wiki/Great_Firewall)

WebRTC 国内镜像地址: https://webrtc.org.cn/mirror/

## Other resources generaed during compile

Use command `gn gen out/Default --ide=json --export-compile-commands` can generate `compile_commands.json` in out/Default folder,
which is useful when using an LSP or IDE.

## Checkout to Certain Branches

Use `git branch -r` to display all branches, choose the branch you want at
[release branches](https://chromiumdash.appspot.com/branches).
Then checkout to release branch.

## Save a Certain Branch to Your Own Repo

First, you need to mirror the repo.

```sh
git remote rename origin old-origin
git remote add origin <new-remote>
git fetch old-origin --prune
git push --prune origin +refs/remotes/old-origin/*:refs/heads/* +refs/tags/*:refs/tags/*
```

This will copy the entire repo (with every branch and tags).

Then, make a new directory `mkdir webrtc_mirror_checkout` and cd into it.
Create a `.gclient` file with following content.

```json
solutions = [
  {
    "url": "https://github.com/[username]/webrtc.git",
    "managed": False,
    "name": "src",
    "deps_file": "DEPS",
    "custom_deps": {},
  },
]
```

Clone the mirror repo into `src` folder.

```sh
git clone https://github.com/[username]/webrtc.git src
```

Then use gclient to get all dependencies.

```sh
gclient sync --verbose
```

### Failed Approach In My Case

https://github.com/webrtc-sdk/webrtc seems to be legit, but the code doesn't compile with the above process somehow.
I then made a mirror repo manually, and it worked.
