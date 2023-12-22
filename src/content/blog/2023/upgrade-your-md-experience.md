---
title: 升级你的 Markdown 博客书写体验
date: 2023-12-22 19:06:00
tags: [Markdown, Astro]
description: 来看看现代化的 Markdown 文章书写技巧吧
---

::toc

`Markdown` 用于日常书写已经非常流畅了，不过现在大部分语法支持是 2017 年由 Github 发布的 `GFM` （GitHub Flavored Markdown），已经不太能满足现代化博客的多样化需求。

虽然我们有更强更灵活的 `mdx`，支持在 Markdown 中插入组件，但是它需要书写者懂 `JSX` 的基本语法，引入组件时又没有代码提示（目前我使用的 vscode 插件不支持提示），无疑增加了使用门槛，而且和 markdown 本身带给作者的便利性有冲突。

就我个人而言更希望有一些不超出 Markdown 语法框架的增强功能，所以分享一下我自己在用的一些 Markdown 体验增强方法。

# 旁白

:::note[你是否想在文章中插入一些旁白？]
没错，非常简单。
:::

上面这段旁白只需要在 Markdown 中加入下面的代码

```md
:::note[你是否想在文章中插入一些旁白？]
没错，非常简单。
:::
```

甚至还可以轻松嵌套其他内容，以及支持多种样式

:::tip[Show you some code!]

```bash
$ echo Hello World!
```

:::

````md
:::tip[Show you some code!]

```bash
$ echo Hello World!
```

:::
````

这是我 Copy 自 [Starlight](https://starlight.astro.build) 框架的功能，它使用的是 `remark-js` 的 [`remark-directive`](https://github.com/remarkjs/remark-directive) 插件实现的。

如果你使用的是 `remark-js` 包进行渲染，或者用的是 `Astro` 框架搭建的网站，那么可以很轻松的加入这个功能，只需要将 [这段代码](https://github.com/Nomango/blog/tree/master/src/plugins/remark-asides) 拷贝到你的项目中，然后在 remark 插件配置中加入下面的代码：

```js title="astro.config.js" {7,8}
import remarkDirective from "remark-directive";
import remarkAsides from "./src/plugins/remark-asides";

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, remarkAsides({})],
  },
});
```

# 代码块增强

也许你已经注意到了，上面的代码块不仅显示了文件名，而且高亮了其中一行代码。

上面的代码块只需要在 Markdown 中这样书写：

````markdown /title=".+"/ /{\d+}/
```js title="astro.config.js" {5}
import remarkAsides from "./src/plugins/remark-asides";

export default defineConfig({
  markdown: {
    remarkPlugins: [...remarkAsides({})],
  },
});
```
````

还可以显示成 diff 样式

```js ins={1} del={2}
console.log("old codes");
console.log("new codes");
```

````markdown
```js ins={1} del={2}
console.log("old codes");
console.log("new codes");
```
````

以及代码块中的块高亮功能

```js "defineConfig"
export default defineConfig({});
```

````markdown
```js "defineConfig"
export default defineConfig({});
```
````

还支持正则匹配的块高亮

```js /define\w+/
export default defineConfig({});
export default defineProps({});
```

````markdown
```js /define\w+/
export default defineConfig({});
export default defineProps({});
```
````

这个功能是使用 [`expressive-code`](https://github.com/expressive-code/expressive-code) 插件实现的，它也有专门为 `Astro` 开发的版本，只需要这样进行安装

```bash
# When using npm
npm install astro-expressive-code

# When using pnpm
pnpm install astro-expressive-code

# When using yarn
yarn add astro-expressive-code
```

然后加入到框架集成配置中

```js {6}
// astro.config.mjs
import { defineConfig } from "astro/config";
import astroExpressiveCode from "astro-expressive-code";

export default defineConfig({
  integrations: [astroExpressiveCode()],
});
```

# 折叠块

示例：

:::collapse

```bash
$ echo Hello World!
```

:::

````markdown
:::collapse

```bash
$ echo Hello World!
```

:::
````

同样是一个基于 `remark-directive` 的插件，代码在[这里](https://github.com/Nomango/blog/tree/master/src/plugins/remark-directive-collapse)。

只需要将插件加入到 remark plugins 即可。

```js title="astro.config.js" {7,8}
import remarkDirective from "remark-directive";
import remarkDirectiveCollapse from "./src/plugins/remark-directive-collapse";

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, remarkDirectiveCollapse({ label: "展开" })],
  },
});
```

# 按钮

示例：

::btn[跳到标题]{href="#按钮"}

代码：

```markdown
::btn[跳到标题]{href="#按钮"}
```

一个样式稍微复杂的按钮：

:::btn{href="#按钮" target="\_blank"}
:i{.fas .fa-share-from-square .fa-fw} 在新标签打开
:::

代码：

```markdown
:::btn{href="#按钮" target="\_blank"}
:i{.fas .fa-share-from-square .fa-fw} 在新标签打开
:::
```

同样是一个基于 `remark-directive` 的插件，代码在[这里](https://github.com/Nomango/blog/tree/master/src/plugins/remark-directive-button)。

只需要将插件加入到 remark plugins 即可。

```js title="astro.config.js" {7,8}
import remarkDirective from "remark-directive";
import remarkDirectiveButton from "./src/plugins/remark-directive-button";

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, remarkDirectiveButton],
  },
});
```

# 图片拷贝

Markdown 最头疼的事之一就是图片管理，由于我的博客没有配置图床，是直接放置在 repo 中的，图片完全由 `vercel` 托管，所以对于我来说唯一的问题就是如何在编辑 Markdown 时，剪切板的图片可以直接粘贴到指定的本地目录下，并且自动插入正确路径。

好在 VSCode 的 Markdown 插件已经内置了这个功能，我们只需要在 Settings 中搜索 `markdown copy files`，然后配置路径即可：

![Markdown Copy Files Setting](@assets/upgrade-your-md-experience/image.png)

# 表格编辑

推荐安装 VSCode 的 `Markdown Table` 插件，在编写表格时具有自动对齐、Tab 跳转下一格等功能，极大的提高表格编辑效率。

![VSCode Markdown Table](@assets/upgrade-your-md-experience/image-1.png)

# 更多

TODO...
