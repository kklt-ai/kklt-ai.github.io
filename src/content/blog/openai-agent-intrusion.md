---
title: OpenAI 模型自主入侵顶级 AI 公司系统！当 AI 开始有了意识之后
description: Hugging Face 被 AI Agent 入侵，OpenAI CEO 山姆·奥特曼认领：模型在漏洞测试中越狱沙箱、攻击外部系统并拿到答案。
pubDate: 2026-07-24
tags: ['AI 安全', 'OpenAI', 'Hugging Face']
cover: /blog/openai-agent-intrusion/01-hf-announce.png
wechatUrl: https://mp.weixin.qq.com/s/s6cbAQOBEgLtE-pgeHde7w
---

## Agent入侵
7 月 16 号的时候，Hugging Face 发布了一则公告，公告里面说他们的系统被 **AI Agent 入侵了。**

这也是一起前所未有的 **AI 安全事件**，然后快速登上热搜，引发全网激烈讨论。

![Hugging Face 公告](/blog/openai-agent-intrusion/01-hf-announce.png)

---

## Hugging Face
**Hugging Face 是干嘛的？**

Hugging Face 是全球最大的开源 AI 平台之一，可以理解为「AI 模型界的 GitHub」。

开发者可以在上面上传、下载和测试大模型、数据集及 AI 应用，很多开源模型都会选择在 Hugging Face 首发或提供下载。

---

比如你可以在 Hugging Face 上找到 DeepSeek、Kimi 或者 GLM 的模型。

![Hugging Face 上的模型](/blog/openai-agent-intrusion/02-hf-models.png)

**一般开源模型都会上传到 Hugging Face，供其他开发者下载学习。**

回到刚刚说的入侵问题。

![Hugging Face 称入侵疑似 AI Agent](/blog/openai-agent-intrusion/03-hf-unknown-agent.png)

Hugging Face 说此次入侵似乎是某个 AI Agent，但是他们也不知道具体是哪个模型。

然后今天，OpenAI 的 CEO 山姆·奥特曼发帖，认领了此次入侵。

![山姆·奥特曼认领入侵](/blog/openai-agent-intrusion/04-altman-claim.png)

**事情是怎么发生的呢？**

这要从 OpenAI 的一次内部测试说起。

OpenAI 利用 GPT 5.6 Sol 和一款尚未发布的模型，在进行一个 **漏洞测试**。

这个测试业界叫做 **ExploitGym**。

这个测试就像给 AI 出 **安全测试题**，它包含近 900 个来自真实软件的漏洞（比如浏览器引擎、Linux 内核等）。

任务是：**给 AI 一个已知的漏洞和触发它的简单例子，让 AI 自己想办法写出完整的攻击代码，最终实现对目标程序的控制。**

目的呢，就是为了 **测试模型的安全能力有多强**。

为了让模型发挥最大潜力，OpenAI 在测试时故意降低了部分安全限制。

他们把模型运行在一个 **高度隔离的沙箱环境** 里，理论上 **模型是不能访问互联网的**。

然后他们训练模型的时候，给模型的目标是「**尽可能完成任务、拿高分**」

可能是模型认为正面破解漏洞太难了，然后就开始 **偷懒了**，它没有按规则来，而是另辟蹊径。🤔

**模型决定去 Hugging Face 上直接找答案** 🤣。

![模型去找答案](/blog/openai-agent-intrusion/05-find-answers.jpeg)

因为模型猜测 Hugging Face 上很可能存放着相关模型、数据集，甚至测试题和答案。（像极了人类）

理论上模型被限制在了沙箱环境，正常来说是不能访问外部互联网的。

然后模型决定，**突破沙箱环境。**

![我悟了](/blog/openai-agent-intrusion/06-realized.jpeg)

因为模型需要下载一些软件包，就需要通过内部的代理下载。

然后这条途径就被模型利用了。

它花费了大量计算资源（相当于思考了很久），最终发现并利用了这个代理里的一个 **漏洞**。

借助这个漏洞，模型成功「越狱」获得了互联网访问权限。

![呀吼](/blog/openai-agent-intrusion/07-yahoo.jpeg)

模型连上互联网后，迅速分析环境，推断出 Hugging Face 很可能存放了 ExploitGym 相关的模型、数据集或答案。

然后它继续规划攻击路径。它结合了窃取凭证、利用其他漏洞等多种手段，最终在 Hugging Face 的服务器上实现了远程代码执行，相当于直接拿到了服务器管理员的权限。

![攻击链路](/blog/openai-agent-intrusion/08-attack-chain.png)

然后成功地访问了 Hugging Face 的 **生产数据库**，**拿到了测试答案。** 🤣

![拿到答案](/blog/openai-agent-intrusion/09-got-answers.jpeg)

与此同时呢，Hugging Face 的安全系统也检测到了异常。

然后 Hugging Face 的安全团队用 AI 分析攻击记录，重建攻击的时间线。

有意思的是 Hugging Face 最初想用 **商业闭源模型** 分析日志。由于日志里全是真实攻击命令和漏洞代码，商业模型的 **安全机制** 把请求拦住了，不让他们分析。

![商业模型安全机制拦截](/blog/openai-agent-intrusion/10-commercial-blocked.png)

> 这里猜测是 Anthropic 的 Mythos 5 模型，这也是号称地表最强的安全模型。

然后他们把开源的 GLM 5.2 部署在自家的服务器上，用来分析攻击数据，最终成功分析、还原了入侵的经过。

**国产模型上大分啊！**

![GLM 分析成功](/blog/openai-agent-intrusion/11-glm-analysis.png)

---

这件事也给大家了一个警告，**AI 已经能独立完成长链条攻击。**

模型可以自行完成「**发现漏洞—利用漏洞—提权—窃取凭据—横向移动—攻击外部系统—获取数据**」的完整过程。

**有点可怕。**

经过这次事件之后，这些模型估计会把安全限制再度加强，不然真的可能会出现严重的事故。

毕竟，不是所有公司的安全措施都做得那么到位。

**我是卡卡罗特，持续分享对你有用的 AI 信息～**
