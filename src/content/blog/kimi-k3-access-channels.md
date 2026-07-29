---
title: "Kimi K3 开源！去哪能用上？5个最方便渠道全整理，竟然有白嫖渠道?"
description: "Kimi K3 开源后新用户订阅直接挤爆，去哪还能用上？整理了官网、API、WorkBuddy、OpenCode 五个渠道，附价格对比和实操步骤，帮你最快体验这个最强模型。"
pubDate: 2026-07-28
tags: ["AI", "Kimi", "教程"]
cover: /blog/kimi-k3-access-channels/cover.jpeg
wechatUrl: https://mp.weixin.qq.com/s/5TCAP5jkNaRNp2V4P2jAaA
---

大家好，我是卡卡罗特。

**昨晚 Kimi K3 正式开源，公布了权重。**

![](/blog/kimi-k3-access-channels/01.png)

Kimi K3 这几天也是热闹，把国内、国外AI圈搅得动静太大了。  
模型能力有多强？这不用我多说了吧？

尽管模型开源，但是自己部署一个 Kimi 开源模型，基本不可能。

因为 Kimi K3 是一个 2.8 万亿参数的 MoE 模型，光权重就有 1.56 TB。

想跑起来至少需要几十张 H800 显卡，单张卡就要十几万到几十万，**几十张下来几百万元起步，当然还不算电费和服务器🤔。**

个人部署基本没可能。

那我们肯定需要通过API的形式体验到这个最强模型。

去哪里可以用呢？

**首选肯定是官方的。**

## 怎么用上Kimi K3？

### 1、通过Kimi官网

Kimi的官网可以通过聊天的形式使用到K3模型。

![](/blog/kimi-k3-access-channels/02.png)

但是我们说Kimi K3最强的是Coding能力，那肯定是接入到AI Coding Agent更能体现它的能力。

那你可以看下面这几个方式。

### 2、Kimi官方买API订阅

Kimi 的API 是可以购买套餐，这肯定最划算。

不同等级的套餐额度不一样。如果你是包月的，价格如下。

![](/blog/kimi-k3-access-channels/03.png)

如果选择连续包年，价格如下。

![](/blog/kimi-k3-access-channels/04.png)

可惜的是，Kimi K3打出旗号之后，用户激增，**然后导致算力不足。**

新用户已经不能购买订阅了，需要预约。🤔

那就只能通过API的形式接入Kimi K3。

### 3、通过官方API

通过API的形式接入的话，需要在Kimi的**开放平台**获取对应的API Key，然后接入到Agent里面。

你可以在【左下角 -\> 开放平台】这里进入到Kimi的开放平台。

![](/blog/kimi-k3-access-channels/05.png)

点击用户中心。

![](/blog/kimi-k3-access-channels/06.png)

![](/blog/kimi-k3-access-channels/07.png)

这是Kimi K3的输出、输出价格，有点小贵🤔

![](/blog/kimi-k3-access-channels/08.png)

充值后，你可以在API Key 管理这里席间一个API key。

![](/blog/kimi-k3-access-channels/09.png)

拿到`api_key`之后，可以通过`cc-switch`配置到`Claude Code`中。

🤔我之前写了一篇文章介绍怎么使用cc-switch接入国产大模型到Claude Code中，包括了Kimi的套餐，**感兴趣可以翻翻主页。**

非常详细，这里不再多说了。

当然你也可以使用官方的CLI工具，`kimi-code。`

![](/blog/kimi-k3-access-channels/10.png)

把 Kimi Code 展开，然后点击进入到 Kimi Code 的介绍页，按提示安装就行。

![](/blog/kimi-k3-access-channels/11.png)

然后在控制台输入`kimi`就可以愉快地玩耍了。

![](/blog/kimi-k3-access-channels/12.png)

### 4、腾讯WorkBuddy

腾讯自家最强的Agent WorkBuddy已经接入了Kimi K3模型，倍率是1.62。

![](/blog/kimi-k3-access-channels/13.png)

免费用户，如果你有积分的话也可以使用，还是很香的。

WorkBuddy现在搞活动，每天可以领取100积分，活动还有1天😁

![](/blog/kimi-k3-access-channels/14.png)

如果你没积分，也可以办个套餐，最低档的套餐不连续包月99¥，一个月有2000积分。

![](/blog/kimi-k3-access-channels/15.png)

然后我看下我这里有2300的积分，忘记怎么来的了😂 似乎是送的+领的。

![](/blog/kimi-k3-access-channels/16.png)

然后我让 WorkBuddy 帮我生成了一个博客页面，\*\*大家觉得怎么样呢？\*\*🤔

![](/blog/kimi-k3-access-channels/17.png) 可能是我没表达清楚，这里只生成了一个HTML页面。如果能生成一个博客系统，会更好维护。  5、OpenCode ![](/blog/kimi-k3-access-channels/18.png)OpenCode 是国内一家AI公司做的开源工具，是GitHub上**热门的开源仓库，**目前已经收获了 190k Star。

✅GitHub 仓库地址在此：https://github.com/anomalyco/opencode OpenCode也支持购买套餐。

最低档 Go 套餐首月 5\$，现在在搞活动，Kimi K3 享受 2 倍额度，还是很香的。 ![](/blog/kimi-k3-access-channels/19.png)

5小时额度限制如下。 ![](/blog/kimi-k3-access-channels/20.png)

**大家这几天有用Kimi K3做什么好玩的东西吗？** 欢迎评论区交流交流。🤔

**我是卡卡罗特，持续分享对你有用的AI信息～**
