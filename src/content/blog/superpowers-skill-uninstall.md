---
title: "神级Skill Superpowers，今天我终于把它卸载了。臃肿 + Token吞金兽！"
description: "Superpowers 曾是 AI 编程新手的必备神器，但随着模型能力越来越强、项目越来越复杂，它的超长 Skill 说明书反而成了负担。本文拆解 Superpowers 的三大硬伤，并给出不同阶段的推荐做法。"
pubDate: 2026-07-17
tags: ["AI 编程", "Claude Code", "Skill"]
cover: /blog/superpowers-skill-uninstall/cover.jpeg
wechatUrl: https://mp.weixin.qq.com/s/uaZjJ-0bICaZGCtBu6U51g
---

大家好，我是卡卡罗特。

之前我一直推荐大家使用一个叫 Superpowers 的 Skill。

![](/blog/superpowers-skill-uninstall/01.png)

过去几个月，这个项目收获了大量的 Star。Star 数已经来到了 25.2k，足以看出它有多受欢迎了吧。

### 这个项目是干嘛的？

这是一个 Skill，也就是说，它可以用在任何 AI Agent 里。比如你本地的 Claude Code、Codex、Cursor、Trae……

**有什么用呢？ 一句话总结，它会给你的 AI Agent 立规矩：别上来就写代码。**

先问清需求，做设计，列计划，写测试，再实现、检查和验收。

![](/blog/superpowers-skill-uninstall/02.png)

在以前的`古法编程时代，`这是一套非常标准的软件开发流程。

所以，对于小白来说，这个技能非常友好。

#### 举个栗子🌰

如果没有这个技能，你的 Claude Code 或 Codex 可能会像下面这样操作。

```
用户：帮我做一个登录功能
AI：好的，代码如下……
```

也就是说，你提出一个问题，AI 直接按照自己的规划，设想登录流程应该是什么样，然后直接帮你改代码，完成开发。

这非常依赖你的描述是否完整，说白了，很依赖经验。首先，你要对登录功能有一个清楚的描述。

如果你装了 Superpowers 这个技能，它可能会向你提出很多问题，然后才开始开发。

比如：

```
A、需要注册才可以登录吗？
B、登录需要哪些信息？是直接通过用户名和密码登录吗？
C、补充……
```

提问时，它会给你 A、B、C 这样的选项，你也可以自己补充。

等到多轮提问、多轮确认之后，你的 Agent 就知道你真正想做什么了，也明确了你的实际需求和边界。

说实话，对于很多人来说，尤其是非程序员、非产品经理，**能把自己的需求描述清楚，本身就是一个“技术活”。**

这非常依赖经验。没聊清楚，AI 直接改代码，很大概率是在做无用功。

而 Superpowers 这个项目内置了很多 Skills，它会严格按照下面这套工作流帮你执行。

```
1.先确认你真正想做什么
2.梳理需求和边界
3.给出设计方案
4.拆成可执行任务
5.编写测试
6.实现代码
7.调用子 Agent 检查
8.验证结果后才宣布完成
```

这套工作流对于没有接触过代码开发的人，或者经验不足的程序员来说，非常有帮助！

**如果你也刚开始学习 AI 编程，那我还是强烈推荐你去了解、去使用。**

如果你感兴趣，可以在评论区留言，后续我可以把这个技能的用法写得更深入一点🤔

但是，当你对项目比较熟悉，**项目也逐渐复杂、代码仓库逐渐庞大时，情况就不一样了。**

这个 Skill 就有点鸡肋，**甚至有点画蛇添足。**

主要体现在三个方面：

1、Superpowers 非常耗 Token。

2、上下文污染。

3、一些小任务会**过度规划：**小任务也可能生成 Spec 和 Plan 文档，然后在本地创建 Worktree。每次我都让它直接在本地项目分支改，不走 Worktree。

![](/blog/superpowers-skill-uninstall/03.png)

### 1、Token 消耗量高

不知道大家有没有发现，Superpowers 是非常耗 Token 的。这也是 Superpowers 一直被人诟病的最大问题。

因为 Superpowers 本质上是通过一系列 Skill 来保证 Agent 按照特定的工作流执行。底层则是通过一系列**超长说明书来限制 Agent。**

![](/blog/superpowers-skill-uninstall/04.png)

它内置的主要 Skills 包括：

- `brainstorming：`
  需求讨论和方案设计
- `writing-plans：`
  编写实施计划
- `test-driven-development：`
  测试驱动开发
- `systematic-debugging：`
  系统化排查 Bug
- `subagent-driven-development：`
  让多个子 Agent 分工执行
- `requesting-code-review：`
  代码审查
- `verification-before-completion：`
  完成前强制验证
- `using-git-worktrees：`
  用 Git Worktree 隔离开发任务

**每一个 Skill 都是超长的说明文档。**

比如，负责跟我们聊清楚需求的 Skill，底层其实是 `brainstorming` 这个头脑风暴 Skill。

![](/blog/superpowers-skill-uninstall/05.png)

执行 brainstorming 流程时，它还可能继续读取：

- `writing-plans/SKILL.md`

- `visual-companion.md`

- 项目文件和 Git 提交记录

- 最终生成的设计文档

- 其他基础 Skill 或系统提示词

因此，一次完整的 Superpowers 工作流，额外占用的上下文很容易达到**数千甚至上万 Tokens。**

当然，除了头脑风暴，还有用于编写需求文档、执行计划的 Skill……

每个 Skill 都会占用很多 Token，这些都会加载到上下文中。

- 会导致上下文窗口不够用

- Token 消耗量飙升

因为我们跟 AI 对话的时候，**每次都会带上完整的上下文。**

假设你在一个会话中进行了 10 轮对话，光这些 Skill 占用的上下文，就可能被重复带上 10 次。可以想象，Token 消耗是巨大的！

![](/blog/superpowers-skill-uninstall/06.png)

### 2、上下文污染

Anthropic 官方文档明确指出，随着上下文中的 Token 增加，模型的准确性和信息召回能力可能下降，这种现象被称为“上下文腐烂”。

系统提示、工具定义、文件内容、工具结果和思考内容都会占用上下文。

当上下文里塞满：

- 系统提示词

- Skill 说明

- 巨型计划

- Agent 总结

- 审查意见

- 历史失败记录

真正重要的业务需求和代码细节反而**可能被稀释，**注意力也被分散了。

于是出现很讽刺的结果：

> 本来装 Skill 是为了让它更聪明，最后 Skill 把它的工作记忆占满了。

![](/blog/superpowers-skill-uninstall/07.png)

### 3、过度规划

Superpowers 会自动针对非常简单的任务触发 brainstorming 和完整规划。

例如有人反馈：

- 简单重命名也进入完整规划

- 一个简单需求连续询问六个问题

- 缺少“任务复杂度阈值”

- 希望能够方便地开关，而不是全开或全关

一些长期用户给出的评价很一致：

做大改动和重构时很好用；**做小改动和无关紧要的任务时非常糟糕。**

比如这里，我让它做一个非常简单的任务。**只是将两个子页面的链接提取出来，然后放到导航栏里面。**

![](/blog/superpowers-skill-uninstall/08.png)

这里，它用头脑风暴 Skill 给我推荐了一个方案，没问题。

但它接下来又开始写计划书，我就觉得没必要了，毕竟这个任务很简单。

![](/blog/superpowers-skill-uninstall/09.png)

写完计划之后，它又跑到 Git Worktree 里开发。那我还得让它把那里的代码合并到当前分支。

**把一件简单的事情搞复杂了，真没必要**🥹。

![](/blog/superpowers-skill-uninstall/10.png)

![](/blog/superpowers-skill-uninstall/11.png)

### 推荐做法

既然 Superpowers 这么臃肿，那该怎么办呢？

现在的**大模型，远比你想象的聪明。**它的规划能力、执行能力已经很强了。

如果你准备开发一个新项目，那么 Superpowers 这一整套工作流程比较合适。

它可以帮你把需求聊清楚，然后生成一个 MVP（最小可行产品）。

如果你维护的是一个老项目，代码文件也非常多，那么再装一个 Superpowers 就没太大必要。你可以直接把 Superpowers 卸载掉。

如果你觉得不放心，或者已经习惯了这套流程，就可以只保留这两个 Skill：

- brainstorming

- writing-plans

![](/blog/superpowers-skill-uninstall/12.png)

### 怎么卸载？

#### Codex 怎么卸载？

在插件页面搜索 `super，`然后点击下面的 `Superpowers` 打开。

![](/blog/superpowers-skill-uninstall/13.png)

这里有开关，可以直接管理每一个 Skill。只打开 `Brainstorming、``Writing Plans` 这两个 Skill 就行。

![](/blog/superpowers-skill-uninstall/14.png)

#### Claude Code 怎么卸载？

在 Claude Code 中，Superpowers 一般是以插件形式安装的。

里面内置了十几个 Skill，似乎不能单独关闭。如果你有好的解决办法，在评论区聊聊呗。

通过 `skill` 命令打开技能列表后，会发现对应的 Skill 被锁定了，不能单独关闭🤔

![](/blog/superpowers-skill-uninstall/15.png)

那就只能把整个插件暂时关闭。

在 Claude Code 中使用 `/plugin` 命令打开插件系统。

![](/blog/superpowers-skill-uninstall/16.png)

然后选择 `Installed` 这个面板，搜索 `super，`就可以看到 Superpowers 这个插件了。

![](/blog/superpowers-skill-uninstall/17.png)

按回车选中它。

![](/blog/superpowers-skill-uninstall/18.png)

然后选择 `Disable Plugin，`就可以关闭插件了。需要重新启用时，也是相同的操作路径。

![](/blog/superpowers-skill-uninstall/19.png)**我是卡卡罗特，持续分享对你有用的 AI 信息～**
