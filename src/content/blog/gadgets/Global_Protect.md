---
title: "Linux 使用北邮 globalprotect 的方法"
description: ""
pubDate: "06/14/2023"
heroImage: ""
---

> 学校网站上提供 Windows macOS 版本globalprotect 的下载链接，但不提供 linux 桌面的下载链接。
> 而存在访问 OJ GitLab 等校内网资源的需求，本文将提供适合于各种发行版的解决方案。

## 步骤如下

1. 下载 [openconnect](https://www.infradead.org/openconnect/)
    注意**必须是 8.0 及以上**的版本
    有很多不同方式，如：
    1. [访问官方网站下载](https://www.infradead.org/openconnect/download/)
    2. 使用包管理器，如 Arch/Manjaro 下：
        `sudo pacman -S openconnect`
    3. 从源码编译
        [openconnect github repo](https://github.com/openconnect/openconnect)
2. 下载 [vpnc-script](https://gitlab.com/openconnect/vpnc-scripts/raw/master/vpnc-script)
    链接打开之后全选并复制文本，再将文本粘贴到这个文件（如果没有需新建）中
    `/etc/vpnc/vpnc-script`
3. 更改 vpnc-script 的执行权限
    `sudo chmod 777 /etc/vpnc/vpnc-script`
4. 环境配置完成，运行方法：
    `sudo ./openconnect --protocol=gp --script=/etc/vpnc/vpnc-script vpn.bupt.edu.cn`
5. （可选）可以在 `~/.bashrc` 或 `~/.zshrc` 中加入
    `alias globalprotect="sudo openconnect --protocol=gp --script=/etc/vpnc/vpnc-script vpn.bupt.edu.cn"`
    这样只需要输入 `globalprotect` 即可自动开始连接

> 开始运行后，终端窗口不能关闭。

