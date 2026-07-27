---
title: "Claude Code如何配置国产大模型？保姆级教程，建议收藏！"
description: "使用 CC Switch 为 Claude Code 配置并切换 DeepSeek、Kimi、Mimo、GLM 等国产大模型的完整教程。"
pubDate: 2026-07-20
tags: ["AI", "Claude Code", "国产大模型"]
cover: /blog/claude-code-chinese-models/cover.jpeg
wechatUrl: https://mp.weixin.qq.com/s/YUiF6gbT-6tOjxFtmDVM6A
---

大家好，我是卡卡罗特。

最近国内大模型真是一片火热，**卷出新高度，**能力越来越强。

Kimi K3 在国内外获得一致好评，再次出圈，几乎达到了当初的 **DeepSeek 时刻。**

![](/blog/claude-code-chinese-models/01.png)

Kimi K3由于能力太强，太火爆了，导致算力跟不上，然后目前 Kimi 已经**不再接受新的订阅**，你去官网上看，已经是**全部售罄**状态😂。

> 后续估计跟智谱GLM一样，要靠抢了....

![](/blog/claude-code-chinese-models/02.png)

然后 DeepSeek V4 正式版即将推出，也就是这两天，海外有一些博主拿到了早期的邀请码可以测评，据说能力达到了 Claude Opus 4.8，但是价格是他的**几十分之一！**

![](/blog/claude-code-chinese-models/03.png)

然后阿里巴巴的 `Qwen3.8-Max-Preview` 已经推出了，也是一个 2.4T 的大模型，官网非常不谦虚地说，除了 Fable 5 之外的最强大模型。

> 当然Preview只是一个预览版，真实版估计也就这几天了。

![](/blog/claude-code-chinese-models/04.png)

然后智谱的GLM 5.5也要推出了，我们期待一下吧。

国内这么多大模型厂商，基本都有各自对应的软件。

比如说 Kimi 有 Kimi Code，千问有 Qwen Coder，智谱有 ZCode......

但是Claude Code，毋庸置疑是最好用的`harness。`

上述模型厂商**都可以通过 API 的形式接入到 Claude Code**，然后在 Claude Code 里面使用对应的国内大模型。

------------------------------------------------------------------------

**那什么叫Harness呢？🤔**

![](/blog/claude-code-chinese-models/05.png)

**看个公式你就明白了：**`Agent = Harness + Model`

听着有点抽象，我用 Claude Code 举个例子。

Claude Code 它不只是跟你聊天，它会读文件、改代码、调用工具、管理上下文、规划任务，还会在合适的时候问你要不要执行某个操作。

这些东西，其实不是模型本身，而是**Harness。**

模型更像是负责**思考和生成的脑子。**

![](/blog/claude-code-chinese-models/06.png)

就像如图的三个机器人，每个机器人的动手能力都一样。

但是他们的大脑，也就是对应的模型不一样，那机器人的能力也有高低之分，擅长之处。

以 Claude Code 为例。

Claude Code 只是你本地的一个 Harness，你可以配置不同的 Model，就有了不同的能力。

Claude Code 默认使用 Anthropic 官方的 Claude 模型。

不过由于网络原因，以及 Anthropic 的排华、封号等问题，使用 Claude 官网模型非常麻烦。那你就可以替换一些国产模型，比如 DeepSeek、GLM、Kimi、小米 MIMO、腾讯混元模型......

![](/blog/claude-code-chinese-models/07.png)

正常来说，你直接替换系统变量 `ANTHROPIC_BASE_URL、``ANTHROPIC_AUTH_TOKEN` 为国产模型的 base_url 和 api_key，那 Claude Code 使用的时候就变成国产模型了。

**但是这样非常麻烦，并且容易出错。**

而且有一个致命的问题，切换不同模型的时候非常麻烦，要重新配置一遍。

那这个时候我就推荐使用一个第三方软件去做这件事，非常方便——**CC Switch。**

配置好各个模型后一键切换，如图，非常方便。

![](/blog/claude-code-chinese-models/08.png)

> 😎 **PS：** 当然，CC Switch 不止可以替换 Claude 的模型，还可以替换 Codex 的内置模型。我之前写过一篇文章，可以在我的主页找一下🤔。

## 一、CC Switch

CC Switch 是 GitHub 上的一个开源软件，截止到目前，2026 年 7 月 20 号，已经 119k 的 Star 数了，非常恐怖。

**GitHub 地址如下：**https://github.com/farion1231/cc-switch

![](/blog/claude-code-chinese-models/09.png)

作者已经打好了 release，支持 Windows 和 Mac，在项目的 Releases 链接里面可以下载。

![](/blog/claude-code-chinese-models/10.png)

**你也可以通过这个链接下载：**

✅https://github.com/farion1231/cc-switch/releases/tag/v3.17.0

![](/blog/claude-code-chinese-models/11.png)

他们现在有一个官网，你也可以在这个网站看介绍，里面也有一些使用的文档。

https://ccswitch.io/zh/

![](/blog/claude-code-chinese-models/12.png)

![](/blog/claude-code-chinese-models/13.png)

## 二、各大国产模型

下面就是在各大国内厂商的开放平台获取对应的 API_URL 和 API Key，然后配置到 CC Switch 的教程。

### 1、DeepSeek

你需要到 DeepSeek 的开放平台注册一下。

✅地址是这个：https://platform.deepseek.com

![](/blog/claude-code-chinese-models/14.png)

![](/blog/claude-code-chinese-models/15.png)

DeepSeek 目前只有**按量付费，**也就是说，你消耗多少 Token，它就会消耗你多少充值的余额🤔。

如果里面没有余额的话，需要充值，你可以先充 10 块。

![](/blog/claude-code-chinese-models/16.png)

**获取一个API Key。**

![](/blog/claude-code-chinese-models/17.png)

![](/blog/claude-code-chinese-models/18.png)

**这个API key 保存下来，不要发给任何人！**

然后我们回到 CC Switch 里面进行配置。

![](/blog/claude-code-chinese-models/19.png)

我们在供应商里面找到Deepseek，点一下。

![](/blog/claude-code-chinese-models/20.png)

页面往下滑，将上面复制的API Key粘贴过来。

![](/blog/claude-code-chinese-models/21.png)

然后往下滑到【高级选项】，点开进行【模型的配置】。

然后点一下【获取模型列表】，CC Switch 就会请求 DeepSeek 接口获取对应的 DeepSeek 模型。

在`Sonnet、``Opus、``Fable、``Haiku`中，下拉选择对应的Deepseek模型进行**映射。**

![](/blog/claude-code-chinese-models/22.png)

**配置完成之后记得启动DeepSeek 的配置。**

![](/blog/claude-code-chinese-models/23.png)

配置完之后，你启动一下 Claude Code。

发现启动的时候会提示你，默认使用的是 DeepSeek V4 Pro。

![](/blog/claude-code-chinese-models/24.png)

至此，你就成功在Claude Code上配置了Deepseek模型。

### 2、Kimi

Kimi 的配置分两种，一种是按量付费，也就是充多少用多少。

![](/blog/claude-code-chinese-models/25.png)

另一种是通过每月订阅套餐，消耗套餐内的额度。

> 如果不确定自己用哪种，我建议是最低档49块就行了。

![](/blog/claude-code-chinese-models/26.png)

#### 2-1、按量付费 - API 形式

需要登录到 Kimi 的开放平台：

✅地址：https://platform.kimi.com/console/account

![](/blog/claude-code-chinese-models/27.png)

先充 10 块。

然后在 API Keys 管理页面新增一个 API Key。

![](/blog/claude-code-chinese-models/28.png)

![](/blog/claude-code-chinese-models/29.png)

在CC Switch中选择Kimi的模型厂商。

![](/blog/claude-code-chinese-models/30.png)

![](/blog/claude-code-chinese-models/31.png)

跟上面DeepSeek的配置一样，改一下就行了。

![](/blog/claude-code-chinese-models/32.png)

#### 2-2、套餐形式

当你购买完套餐之后。

可以进到这个页面：https://www.kimi.com/code/console

> 这个页面我是怎么找到的呢？我下载了Kimi Code ，然后登录的时候跳转到了这个页面。在Kimi官网中找了很久都没找到，emmm，差评

![](/blog/claude-code-chinese-models/33.png)

然后新建一个API Key。

![](/blog/claude-code-chinese-models/34.png)

CC Switch中选择这个`Kimi for Coding Plan，`这是按套餐形式。

![](/blog/claude-code-chinese-models/35.png)

然后下拉选择对应的模型。

![](/blog/claude-code-chinese-models/36.png)

随后再启动就行了。

![](/blog/claude-code-chinese-models/37.png)

可以发现，如果你是按套餐形式，这里可以看到你 5 小时、7 天的额度使用情况。

**好评！**

### 3、小米Mimo

使用小米的API也有两种方式：按量付费和订阅套餐。

**小米MimoCode开放平台地址：**https://platform.xiaomimimo.com/token-plan

![](/blog/claude-code-chinese-models/38.png)

如果你账户里面没钱，那就先充点钱进去才可以使用。建议先充 10 块钱玩一玩。

![](/blog/claude-code-chinese-models/39.png)

**首次充值需要认证，按要求认证即可。**

![](/blog/claude-code-chinese-models/40.png)

在API Key这里新建一个API Key。

![](/blog/claude-code-chinese-models/41.png)

⚠️ **注意：** 这个API key一定不要发给别人，或者传到网络上，不然会被盗刷额度。

#### cc-switch配置

配置小米MIMO的方式如下。直接把刚刚的API key粘贴过来就行了。

![](/blog/claude-code-chinese-models/42.png)

然后往下滑，选择模型这里。一定要点击这个【获取模型列表】。然后在下拉框里面选择 `mimo-v2.5` 这个模型。

![](/blog/claude-code-chinese-models/43.png)

**跟上面Deepseek配置一样。**

### 4、智谱GLM

智谱GLM也是有两种：按量付费和订阅套餐。

✅**智谱官网地址：**https://bigmodel.cn/

![](/blog/claude-code-chinese-models/44.png)

#### 4-1、按量付费 - API 形式

点击控制台，进入到开放平台。

![](/blog/claude-code-chinese-models/45.png)

然后在API Key这里新建一个Key。

![](/blog/claude-code-chinese-models/46.png)

![](/blog/claude-code-chinese-models/47.png)

在右上角的财务这里，点击【去充值】。

![](/blog/claude-code-chinese-models/48.png)

可以先充 10 块钱试一下。

![](/blog/claude-code-chinese-models/49.png)

到CC Switch里面，粘贴API Key，然后获取对应的模型映射就行了。

![](/blog/claude-code-chinese-models/50.png)

#### 4-2、套餐形式

可以在后台这里点击 Coding Plan 去买一个月的套餐。

![](/blog/claude-code-chinese-models/51.png)![](/blog/claude-code-chinese-models/52.png)![](/blog/claude-code-chinese-models/53.png)

智谱的订阅分为**个人套餐**和**团队套餐。**

**个人套餐性价比更高；**如果你需要管理多个成员、或未来有团队协作需求，可以直接购买团队套餐。

一般是买个人套餐就行了。

但是，很可惜的是，智谱由于算力不足，**个人套餐购买每天都需要抢**😁。

每天早上 10 点补货，但是**非常难抢。**

如果你买了Coding Plan，配置方式跟上面【按量付费】一样，默认支持了Coding Plan的。

如果没有买Coding Plan，就会消耗充值的额度。

### 5、其他平台

当然还有其他模型配置方式也是一样的，只是要获取对应的API Key。

比如说腾讯的混元模型、字节跳动的豆包模型、阿里巴巴的千问模型、MiniMax 模型......

## 各大模型擅长领域（个人观点）

根据我使用各大模型的经验，我觉得国产模型都有各自的能力边界，每个模型有自己擅长的点。

我个人觉得，你按这个来就行。

> 这里先叠个甲，因为AI发展太快了，截止到2026年7月20号，我觉得各大模型的擅长做的事如下。

1、**写文本：** DeepSeek V4 Pro

2、**写代码：** Kimi K3 / GLM 5.2

3、**语音TTS：** MiniMax

4、**视频模型：** Seedance 2.0

5、**图片模型：** 即梦

各位觉得我这个选择如何呢🤔？欢迎评论区留言，说说大家的使用情况🫣。

**我是卡卡罗特，持续分享对你有用的AI信息～**
