---
title: "被爆“偷”用户代码后，马斯克被迫把 Grok Builder 开源了"
description: "被爆偷用户代码后，马斯克开源 Grok Builder 了。"
pubDate: 2026-07-16
tags: ["AI", "Grok"]
cover: /blog/grok-builder-open-source/cover.jpeg
wechatUrl: https://mp.weixin.qq.com/s/hTSUjXGVtft-ioTGCg3mWA
---

上个礼拜，老马的Grok 模型发布后，模型能力只逼Claude 4.8，也挤入第一梯队，受到广大使用者的好。  

  

开心没几天，被技术大佬发现旗下的Grok Builder会偷偷打包使用者的代码然后上传到云端。

  

要看收不住了，老马也承认，然后说会把上传的代码删除😂

  

![](/blog/grok-builder-open-source/01.jpeg)

  

大家也能猜到，把用户代码上传到云端肯定是为了训练模型。

  

自己玩一玩的项目还好，如果是公司企业代码，里面大量公司配置敏感信息，企业核心代码……老马没告知用户直接一波打包带走，把代码偷走了，真是下头😑

  

虽然说马斯克承认会把代码删除掉，但是已经失了人心。眼看收不住，为了挽留用户，没办法只能宣布开源了。

![](/blog/grok-builder-open-source/02.jpeg)

![](/blog/grok-builder-open-source/03.jpeg)

  

周末找时间研究下代码😂

  

这件事也暴露出一个问题，本地的AI Agent，隐私是一个很大的问题。

  

如果是涉及到要读取或者写用户的工作目录，现在主流本地Agent的比如说Claude Code，Codex都是会请求用户授权，授权通过之后才会读写文件。

  

如果是全部授权给Agent，不可避免会存在隐私泄露问题。

现在这种交互模式，体验其实也不太好。

因为大家 VibeCoding的时候，基本都是一直同意，很少回去关注权限问题。🤔  

  

希望未来能有一个好的权限交互模式，然后成为一个统一的标准。

  

你觉得老马这波开源Grok Builder之后会，会挽回用户的信任吗？欢迎评论区聊聊🤔

  

我是卡卡罗特，持续分享对你有用的AI信息，加个关注再走呗～😋
