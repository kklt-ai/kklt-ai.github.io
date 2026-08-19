---
title: "DeepSeek Harness 保姆级教程：从安装、配置到插件玩法一次讲清! 建议收藏"
description: "DeepSeek Harness 保姆级上手教程：从 Node.js 安装、API Key 配置，到工作区设置、接入第三方模型与插件市场，程序员可对照 Codex、Claude Code 使用。"
pubDate: 2026-08-18
tags: ["AI", "教程", "DeepSeek"]
cover: /blog/deepseek-harness-guide/cover.jpeg
wechatUrl: https://mp.weixin.qq.com/s/p7gUEBhGJuPUIuNFq2nP5A
---

前几天 DeepSeek 发布了自家的 **Harness** 项目。

相比 Codex、Claude Code 因为过于精简，像毛坯房，被人吐槽。

但是，这个项目在GitHub上异常活跃，现在已经快200k了。

![](/blog/deepseek-harness-guide/01.png)

他们的开发者社区更是异常活跃，这几天的插件已经飙升到上千个了。

还有非常多**好玩的插件，**DeepSeek Harness 的未来不可估量。

产品名起得很直白，就叫`DeepSeek Harness。`

![](/blog/deepseek-harness-guide/02.jpeg)

![](/blog/deepseek-harness-guide/03.png)

## 什么是 Harness？

Harness 这个词其实早在两三个月前就已经火了，这个英文单词翻译过来叫**马鞍**或**马具，**是用来骑马用的。

![](/blog/deepseek-harness-guide/04.png)

后来还有一个词叫 Harness Engineering，翻译过来叫**驾驭工程。**

------------------------------------------------------------------------

**这名字听着很唬人。**

其实，你只要记住一个公式就懂了：`Harness = Agent - 模型`

![](/blog/deepseek-harness-guide/05.png)

以 Claude Code 为例。

Claude Code 是个 Agent，你也可以把它理解成一个软件。

但是你可以把里面的模型替换成**国产模型，**比如 Kimi、DeepSeek、GLM……都行。

那么 Claude Code 这个软件加上模型，就是一个 Agent。

回到刚刚的公式`Harness = Agent - 模型`

这下你懂了吧。

![](/blog/deepseek-harness-guide/06.jpeg)

Harness 就是**除了模型之外的其他组件，**比如上下文管理、提示词、工具列表、压缩机制……

既然都有了 Claude Code，为什么还要开发自己的 Harness？

**模型适配。**

自家开发的软件，对自家的模型适配能力肯定是最高的。

比如很多人喜欢把 DeepSeek 接入到 Codex 中。

**其实效果非常差。**

![](/blog/deepseek-harness-guide/07.png)

Codex 中很多插件或功能都依赖视觉。

而 DeepSeek 是**文本模型**，没有**视觉能力。**

为了给 DeepSeek 加上视觉，还要引入第三方视觉模型。

**整体用起来非常别扭。**

## 1、安装 DeepSeek Harness

首先需要你安装一个 `Node.js，`如果你装过 Claude Code，那肯定已经有了。

可以使用`node -v`命令在控制台试下。

![](/blog/deepseek-harness-guide/08.png)

如果你不知道怎么安装，可以直接让 WorkBuddy 这类有图形界面的 Agent 帮你装。

![](/blog/deepseek-harness-guide/09.png)

然后到 DeepSeek Harness 官网复制这条命令进行安装即可。

![](/blog/deepseek-harness-guide/10.png)

![](/blog/deepseek-harness-guide/11.png)

然后在**终端**输入上面这条命令安装：`npx @deepseek-ai/dsh web`

![](/blog/deepseek-harness-guide/12.png)

这里相当于是在你电脑上启动了一个`本地服务器，``127.0.0.1` 是本机地址，用来访问你自己电脑上启动的服务。

`3080` 是端口号。

然后复制这个链接到浏览器打开就行:

![](/blog/deepseek-harness-guide/13.png)

### 终端怎么启动？

Windows 使用 `Win + R` 快捷键打开运行窗口。

Mac 使用`command + 空格，`搜索`终端。`

![](/blog/deepseek-harness-guide/14.png)

### 永久安装

如果你要永久安装，可以使用 `npm install -g @deepseek-ai/dsh。`

之后你就可以用 `dsh web` 启动了。

启动时，需要填入 DeepSeek 的 API Key，这个 Key 需要到 **DeepSeek 的开放平台**获取。

![](/blog/deepseek-harness-guide/15.png)

## 2、DeepSeek 开放平台

![](/blog/deepseek-harness-guide/16.png)

当然，你得充一点钱才能用，它是实时消耗 Token 的。

![](/blog/deepseek-harness-guide/17.png)

接着点击 API Keys，新建一个 Key。

![](/blog/deepseek-harness-guide/18.png)

![](/blog/deepseek-harness-guide/19.png)

![](/blog/deepseek-harness-guide/20.png)

复制这个 Key，粘贴到 DeepSeek Harness 之后，页面长这样。

![](/blog/deepseek-harness-guide/21.png)

打开页面，你会发现整个页面跟 Codex 很像。

左侧是聊天记录，中间是输入框。

## 3、页面介绍

### 设置工作区

用的时候需要设置一个工作区，之后的代码、文件都会放到你自己电脑的文件夹中。

![](/blog/deepseek-harness-guide/22.png)

和 Claude Code 里的 Agent 一样，不过 DeepSeek Harness 是以网页形式打开的。

### 模式

这里有几种模式，看着非常唬人。

直接使用标准模式就行了。其他的更多的是给开发者用的，大多数人都用不到。

![](/blog/deepseek-harness-guide/23.png)

### 命令

点击左下角这个加号，可以执行一些命令。

这里有一些常见的命令。

- `compact：`
  压缩上下文。当你的上下文过多的时候可以执行。
- `goal：`
  目标模式。你可以给它设置一个长任务，它会自动运行，直到把目标完成，中间不用你审批。
- `plan：`
  计划模式。生成一份计划文档。一般是做项目规划的时候使用。

![](/blog/deepseek-harness-guide/24.png)

### 读写权限

点击加号旁边的按钮，可以选择读写权限，直接选 Workspace Write 就行了。

- Read Only ：表示只能读取文件，不能新增、修改文件

- Workspace Write：表示在这个工作区可修改文件，生成文件。

- Full access：完全访问，最大的权限

![](/blog/deepseek-harness-guide/25.png)

### 模型选择

右下角这里可以选择模型以及对应的推理等级。

目前默认只有两个模型，分别是 DeepSeek V4 Flash 和 DeepSeek V4 Pro。

Flash 是轻量模型，速度更快，价格也更低。

![](/blog/deepseek-harness-guide/26.png)

### 设置

打开左下角的设置，这里可以设置一些常用项。

#### 第三方模型

模型这里可以设置一些第三方模型，如 Kimi、GLM、MiniMax，基本主流的模型都可以接入。

![](/blog/deepseek-harness-guide/27.png)

不过需要到对应的平台上获取 API Key。

![](/blog/deepseek-harness-guide/28.png)

#### 插件

点到插件这里，你会发现它内置了很多插件，不过这些插件是不可以更改的。

![](/blog/deepseek-harness-guide/29.png)

可以发现它把所有的 Agent Loop、Session……都当做一个插件。

这些都是一个Agent的核心组件。

emmmm，这个理念还挺独特的。找个时间研究下源代码。

## 4、使用

直接在对话框里提问，跟在命令行里提问一样。

它都会操作你本地的工作目录。

![](/blog/deepseek-harness-guide/30.png)

## 5、插件体系

![](/blog/deepseek-harness-guide/31.png)

DeepSeek Harness 最强大的地方是它的插件系统。

它的社区非常活跃。你可以安装很多有意思的插件。

你可以从这个入口进去。

![](/blog/deepseek-harness-guide/32.png)

![](/blog/deepseek-harness-guide/33.png)

但是里面密密麻麻全是插件，**看起来很乱。**

我推荐你在这个仓库里面安装插件。这里面都是精选的。

![](/blog/deepseek-harness-guide/34.png)

滑到下面，你可以使用这条命令，安装一个`插件市场`的插件，emmm。

![](/blog/deepseek-harness-guide/35.png)

如果你发现上面的命令执行不了，提示 `dsh` 命令找不到。

那你就需要全局安装 `dsh` 命令，使用这个命令安装：

`npm install -g @deepseek-ai/dsh。`

然后再执行这条命令 `dsh plugin --profile web add dshmarket，`安装这个精选的插件市场。

执行完上面这个命令之后，在设置里就会多出一个**插件市场**的按钮。

![](/blog/deepseek-harness-guide/36.png)

点击进去可以发现很多好玩的插件。

点击安装就行了，\*\*不用再通过命令的方式安装，非常方便。\*\*🤔

### 鲸鱼娘皮肤

比如你可以安装这个插件。

![](/blog/deepseek-harness-guide/37.png)

安装完毕后重启，页面长这样，emmmmm

![](/blog/deepseek-harness-guide/38.png)

这些程序员都是一群二次元佬～🤔

### web-UI

![](/blog/deepseek-harness-guide/39.png)

装了这个插件后，里面有很多功能会改变你的 UI。

它会在你的右下角放一只默认的宠物，emmmm。

![](/blog/deepseek-harness-guide/40.png)

还有换皮肤，emmmm

![](/blog/deepseek-harness-guide/41.png)

打开设置，发现多了很多按钮，都是这个插件引入的，感兴趣可以去看一下。

![](/blog/deepseek-harness-guide/42.png)

### TUI

![](/blog/deepseek-harness-guide/43.png)

装了这个插件之后，就有了一个终端 TUI，可以像 Claude Code 一样在终端提问了。

## 6、模型价格

顺便一提，今天 8 月 17 号，DeepSeek 已经涨价了。

![](/blog/deepseek-harness-guide/44.png)

每百万 Token，Pro 模型高峰时段 27 元，Flash 只要 9 元！

空闲时段价格是高峰时段的一半。

不过 DeepSeek 的缓存命中率非常高，实际没有想象中那么消耗 Token。

大家觉得这个价格怎么样呢？对得起梁圣这个称号吗？emmm

![](/blog/deepseek-harness-guide/45.png)

## 7、一点点看法

尽管 DeepSeek Harness 有很多插件，但它现在还只是一个早期开发版本。

它们官网标注的还只是个**开发者预览版，**功能也很少，页面交互对非程序员其实不太友好。

![](/blog/deepseek-harness-guide/46.png)

即使现在不玩，也不用焦虑，可以让子弹飞一会儿～

**下期再推荐一些好玩、有用的插件，欢迎加个关注👏～**

**我是悟空，持续分享对你有用的硬核AI教程～ 我们下期见～**
