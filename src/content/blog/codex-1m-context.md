---
title: "Codex支持1M上下文了！保姆级教程！附详细步骤截图！"
description: "GPT-5.6 Sol 原生支持 1M 上下文窗口，但 Codex 默认仅约 235K。本文详细介绍如何通过修改 config.toml 配置，将 GPT-5.6 Sol 上下文提升至 100 万 Token，并设置自动压缩阈值，附 Mac、Windows 配置步骤与实测效果。"
pubDate: 2026-08-17
tags: ["AI", "Codex", "教程"]
cover: /blog/codex-1m-context/cover.jpeg
wechatUrl: https://mp.weixin.qq.com/s/BRgNPXCNxoAeT6wDl_YasQ
---

昨晚ChatGPT的产品负责人Tibo发了一条帖子，说GPT 5.6模型其实是支持1M上下文的！

![](/blog/codex-1m-context/01.png)

但是在Codex/ChatGTP中，其实没有入口去设置。

只能通过修改**配置文件的**方式启动这**1M上下文。**

大家估计也是才知道的，emmmm

因为没改这个配置的时候，GPT5.6模型默认的上下文是258K。

![](/blog/codex-1m-context/02.png)

相比于其他热门模型，**这个窗口很小了。**

但是Codex的**上下文压缩**做的非常好，**即使压缩了，信息丢失也几乎无感知。**

你可以根据下面步骤配置5.6 Sol 模型支持1M上下文。

### 1、命令方式

输入这个命令，打开 Codex 的配置文件。

如果你是Mac电脑输入这个命令：

```

Open ~/.codex/config.toml
```

如果你是Windows电脑，在PowerShell 中输入这个命令：

```

notepad ~/.codex/config.toml
```

本质上就是在用户的`.codex`目录打开`config.toml`这个文件。

### 2、界面方式

你也可以通过页面点击方式打开`.codex`去修改。

但是，这个目录默认是**隐藏**的。

如果是Mac电脑可以使用到你的用户目录。然后按`shift + command + .`快捷键打开**隐藏的目录。**

**（注意后面是点）**

![](/blog/codex-1m-context/03.png)

然后找到`config.toml`这个文件打开即可。

![](/blog/codex-1m-context/04.png)

打开方式随便选个编程软件，或者是在【其他】里面选个记事本。

![](/blog/codex-1m-context/05.png)

Windows 电脑，也是到用户目录，可以按下面步骤打开`.codex`目录。

![](/blog/codex-1m-context/06.png)

## 配置

然后直接在模型下面加上这2个配置。

![](/blog/codex-1m-context/07.png)

- **model_context_window：**模型的上下文窗口阈值：1M 也就是100w

- **model_auto_compact_token_limit：**上下文多大就开启自动压缩，这里按Tibo推荐配置90w

```

model = "gpt-5.6-sol"

# 模型的上下文窗口阈值：1M 也就是100w
model_context_window = 1000000

# 上下文多大就开启自动压缩，这里按Tibo推荐配置90w
model_auto_compact_token_limit = 900000
```

## 测试

随便提问，然后使用`/status`命令，查看上下文占用情况。

![](/blog/codex-1m-context/08.png)

这里显示只有800多K，应该是系统上下文占了100多K了。

上下文越长，意味着可以承接更多的聊天内容。

如果上下文压缩，肯定会带来一定的信息丢失。

**但是需要注意的是！**

上下文越长， Token耗得也越快，额度掉的会很快。

**我是卡卡罗特，持续分享对于我们的硬核AI教程～**

---