---
title: 基于 CoreText 的排版引擎
datetime: '2026-04-11 14:00:00'
permalink: /posts/code_coretext_001
category: 技术
tags:
  - Core Text
---

# 基于 CoreText 的排版引擎

使用CoreText技术，我们可以对富文本进行复杂的排版。经过一些简单的扩展，我们还可以实现对于图片、链接的点击效果。CoreText 技术相对于 UIWebView，有内存占用少，以及可以在后台渲染的优点，非常适合排版工作。

我们将从最基本的开始，一步一步完成一个支持图文混排、支持图片和链接点击的排版引擎。

## CoreText 简介

CoreText 是用于处理文字和字体的底层技术。它直接和 Core Graphics（又被称为 Quartz）打交道。Quartz 是一个 2D 图形渲染引擎，能够处理 OSX 和iOS 中的图形显示问题。

Quartz能够直接处理字体（font）和字形（glyphs），将文字渲染到界面上，它是基础库中唯一能够处理字形的模块。因此，CoreText 为了排版，需要将显示的文本内容、位置、字体、字形直接传递给 Quartz。与其他UI组件相比，由于 CoreText 直接和 Quartz来交互，所以它具有高效的排版功能。

下图是 CoreText 的架构图，可以看到，CoreText 处于非常底层的位置，上层的UI控件（包括 UILabel、UITextField 及 UTTextView） 和UIWeb View 都是基于 CoreText 来实现的。

UIWebView 也是处理复杂的文字排版的备选方案。对于排版，基于 CoreText 和基于 UIWeb-View 相比，具有以下不同之处：

• CoreText 占用的内存更少，渲染速度更快，UIWebView 占用的内存多，渲染速度慢。

• CoreText 在渲染界面前就可以精确地获得显示内容的高度（只要有了CTFrame即可），而 UIWebView 只有渲染出内容后，才能获得内容的高度（而且还需要用 JavaScript 代码来获取）。

• CoreText的 CTFrame 可以在后台线程渲染，UIWebView 的内容只能在主线程（UI线程）渲染。

• 基于 CoreText 可以做更好的原生交互效果，交互效果可以更细腻。而UIWebView 的交互效果都是用 JavaScript 来实现的，在交互效果上会有一些卡顿情况存在。例如，在UIWebView 下，一个简单的按钮按下操作，都无法做出原生按钮的即时和细腻的按下效果。

当然，基于 CoreText 的排版方案也有一些劣势：

• Core Text 渲染出来的内容不能像 UIWebView 那样方便地支持内容的复制。

• 基于 CoreText 来排版需要自己处理很多复杂逻辑，例如需要自己处理图片与文字混排相关的逻辑，也需要自己实现链接点击操作的支持。

## 基于 CoreText 的基础排版引擎不带图片的排版引擎

下面我们来尝试完成一个基于 CoreText的排版引擎。我们将从最简单的排版功能开始，然后逐步支持图文混排、链接点击等功能。
首先我们来尝试完成一个不支持图片内容的纯文字排版引擎。

```swift

```



