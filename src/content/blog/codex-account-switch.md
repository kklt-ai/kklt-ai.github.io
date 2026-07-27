---
title: "多个Codex账号如何优雅切换账号？不用频繁退出！保姆级教程！"
description: "Codex 账号太多切换麻烦？cockpit-tools 这款 12K Star 的开源工具，让你不退出就能自由切换多个 Codex 账号，还能实时查看每个账号的剩余额度和重置次数。同样支持 Cursor、Windsurf、Gemini CLI 等主流 AI 编程工具的多账号管理。"
pubDate: 2026-07-08
tags: ["AI", "Codex", "工具"]
cover: /blog/codex-account-switch/cover.jpeg
wechatUrl: https://mp.weixin.qq.com/s/AHrZb64h8IPoh7cO0TzQCg
---

大家好，我是卡卡罗特。

虚晃一枪，昨天ChatGPT 5.6并没有发布🤣。

然后Anthropic又宣布，**Fable5又续了五天。**

![](/blog/codex-account-switch/01.png)

我猜测是Anthropic偷偷拿到了OpenAI确切发布时间的黑幕🤔

![](/blog/codex-account-switch/02.jpeg)

为了对抗OpenAI的GPT 5.6，不得不又续了5天，emmmm。**商战就是那么朴实无华...**

然后OpenAI在12:00正式发消息通知周四会发布，中国时间大概在周四晚上或者凌晨就可以用到了。（可以蹲一波🐶）

![](/blog/codex-account-switch/03.png)

如果你还有重置次数或者额度的话，可以预留测试一波🤔

------------------------------------------------------------------------

**好了跑题了，回到标题🤔**

拿 Codex 来说——如果你是重度用户，开了一个 Plus 会员，大概率还是觉得额度不够用。

但 Pro 又太贵了，最便宜的都要 100 美刀。

**那怎么办**🤔？再开多一两个 Plus 账号，性价比直接拉满。很多人应该也是这么干的。

但问题来了：账号一多，频繁切换是真的烦！

![](/blog/codex-account-switch/04.jpeg)

假设现在有三个账号，A\B\C。A 的额度用完了，要切到 B。

按传统的做法，就是在 Codex 里面退出 A 账号，然后再登录 B 账号。

![](/blog/codex-account-switch/05.png)

B 用完之后再切回 C。

这样确实可以，**但，太麻烦了！**

今天给大家介绍一个开源软件，**可以在不退出账号的情况下，灵活切换多个账号，还能清楚看到每个账号的剩余额度。**

![](/blog/codex-account-switch/06.png)

## 1、软件介绍

这是GitHub上的一个开源软件：`cockpit-tools，`目前已收获了12K的Star了。

![](/blog/codex-account-switch/07.png)

**✅Github地址：**https://github.com/jlcodes99/cockpit-tools

这个软件其实是一个**通用的AI工具管理软件。**

除了Codex外，还可以方便地管理、切换其他国内外主流的AI Coding软件。比如Cursor，Gemini，Trae....

**并且同时支持Windows、Mac。**

![](/blog/codex-account-switch/08.png)

除了切换多个账号之外，它还支持开多个实例，比如说你可以开两个Codex一起开发。

总之，这个软件的功能很多，大家可以慢慢探索。

------------------------------------------------------------------------

**今天只跟大家分享怎么管理多个Codex的账号，并且灵活切换多个账号。�**\*

## 2、下载&安装

你可以在GitHub仓库打开Release这里下载。

![](/blog/codex-account-switch/09.png)

或者你可以直接打开这个链接：https://github.com/jlcodes99/cockpit-tools/releases

![](/blog/codex-account-switch/10.png)

然后根据软件安装指导，直接安装即可。

## 3、软件页面

下载后启动页面长这样，看着有点复杂。

![](/blog/codex-account-switch/11.png)

右上角这里可以点击平台**布局，**左侧就只显示Codex。这样看起来简洁一点。

![](/blog/codex-account-switch/12.png)

![](/blog/codex-account-switch/13.png)

## 4、添加ChatGPT账号

思考一下🤔，这个软件之所以能管理多个账号，肯定是这个软件把你的登录信息保存起来了。

我们说Codex跟ChatGPT共用的是一个账号。

所以我们就需要在这个软件里面，**登录我们的ChatGPT账号。**

![](/blog/codex-account-switch/14.png)

直接在浏览器里面打开。

![](/blog/codex-account-switch/15.png)

如果点击没反应？**可以拷贝上面的【授权链接】，到浏览器打开。**

![](/blog/codex-account-switch/16.png)

这里会**跳转到ChatGPT官网进行授权。**

如果显示的是你的这个账号，直接登录就行。如果不是的话，就点下面的【登录到另一个账户】。

![](/blog/codex-account-switch/17.png)

点击继续，页面会提示授权成功。

![](/blog/codex-account-switch/18.png)

然后我们回到软件，发现已经托管成功了。

![](/blog/codex-account-switch/19.png)

## 5、怎么用？

直接点击下方这个启动按钮。它会直接打开Codex。然后Codex的账号就是你登录的这个账号。

![](/blog/codex-account-switch/20.png)

打开Codex，查看左下角，你发现账号确实已经切换成功了。

![](/blog/codex-account-switch/21.png)

然后你就可以愉快地玩耍了🤗

![](/blog/codex-account-switch/22.jpeg)

## 6、⚠️注意事项

#### 多个账号不使用相同会话

当你用习惯之后，你会发现在Codex左侧这个历史消息面板中。多个账户的聊天记录都看得到。

比如你登录A账号，在一个项目问了一些问题。你切换到B账号，你是看得到A账号的聊天记录的。

![](/blog/codex-account-switch/23.png)

**这里强烈不建议，用B账号继续回答A账号没有回答完的问题。**

![](/blog/codex-account-switch/24.png)

因为你这样相当于会话串了。

每一轮会话有单独的session ID，你之前用A账户提问的session id 。在B账户中，肯定没有。

官方可能会检测，错误的把你识别为中转站，或者是搞了反向代理。提高了封号的风险！

所以用的时候一定要注意。

#### 重置次数

这个软件其实可以方便地看到每个账户的**重置次数。**

![](/blog/codex-account-switch/25.png)

这个项目作者一直在维护。基本几天就会更新一个版本。**如果提示有更新，最好先更新一下。**

![](/blog/codex-account-switch/26.png)

作者肯定加了一些新的功能，解决了Bug。**有些功能可能是与检测风控有关的，这就非常重要！**

除了今天讲的 Codex 多账号切换，它还支持 Cursor、Windsurf、Gemini CLI 等一堆 AI 编程工具，感兴趣可以自己慢慢探索🤔

------------------------------------------------------------------------

以上就是文章的全部内容了。

**我是卡卡罗特，持续分享对你有用的 AI 教程～**

如果对你有用，点个赞➕关注再走呗🥰
