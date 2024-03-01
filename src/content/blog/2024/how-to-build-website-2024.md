---
title: 当下比较推荐的几种个人网站搭建方式
date: 2024-03-01 09:47:00
tags: [Frontend]
---

::toc

# 方案一：对象存储

适合只有前端代码的静态网站，比如：

- 静态博客（如 [Hexo](https://hexo.io)、[Jekyll](https://jekyllrb.com)、[Hugo](https://gohugo.io)）
- 静态文档（如 [VuePress](https://vuepress.vuejs.org)、[GitBook](https://www.gitbook.com)、[Mintlify](https://mintlify.com)）
- 其他自建静态网站，如 H5 网页等

使用 [腾讯云COS](https://cloud.tencent.com/product/cos) 或 [阿里云OSS](https://www.aliyun.com/product/oss) 等对象存储服务可以直接挂载静态网站。

这种方式**成本非常低**，每个月可能只需要几毛钱，而且都可以方便地接入 CDN 并提供免费的 SSL 证书，不过需要备案域名。（目前更推荐腾讯云，因为阿里云的免费证书从 1 年有效改成 3 个月有效了）

搭配 Github Workflow 可以做到提交代码全自动发布，下面是我常用的 Workflow：

::::details[展开 Workflow 代码]

```yaml title="deploy-cos.yaml"
name: Deploy to Tencent Cloud COS

on:
  push:
    branches: [main, master]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: setup node
        uses: actions/setup-node@v1
        with:
          node-version: 16

      # 构建你的网站
      - name: build
        run: |
          npm install
          npm run build

      # 上传静态网站
      - name: Upload
        uses: zkqiang/tencent-cos-action@v0.1.0
        with:
          args: upload -rf --sync --delete -y ./dist/ /
          secret_id: ${{ secrets.COS_SECRET_ID }}
          secret_key: ${{ secrets.COS_SECRET_KEY }}
          bucket: YOUR_BUCKET # 修改这里
          region: YOUR_BUCKET_REGION # 修改这里
```

```yaml title="deploy-oss.yaml"
# 下载阿里云 OSS 工具
- name: setup aliyun oss
  uses: manyuanrong/setup-ossutil@v3.0
  with:
    endpoint: oss-cn-chengdu.aliyuncs.com
    access-key-id: ${{ secrets.OSS_KEY_ID }}
    access-key-secret: ${{ secrets.OSS_KEY_SECRET }}

# 上传静态网站
- name: upload files
  run: ossutil sync --force --update --delete ./dist oss://YOUR-BUCKET/ # 修改这里
```

::::

# 方案二：前端托管

同样是适合纯前端项目，推荐几个好用的第三方托管服务（都是国外的，国内就不要想了）

- [Vercel](https://vercel.com)
- [Netlify](https://www.netlify.com/)
- [CloudFlare Pages](https://www.cloudflare.com/)
- [Deno Deploy](https://deno.com/deploy) （🤫嘘，目前在国内访问很通畅）

Vercel 是我用过的最舒服的网站托管了，它可以自动识别一众前端框架，完全一键部署，支持自定义域名、SSL、KV存储、边缘计算、图片加速等等，不需要备案，对个人用户甚至完全免费！

唯一的缺点就是国内访问受限。

另外 [GitBook](https://www.gitbook.com)、[Mintlify](https://mintlify.com) 这种文档类的托管网站也会提供免费的部署服务。

![Vercel Dashboard](@assets/how-to-build-website-2024/image-1.png)

# 方案三：Serverless

顾名思义，Serverless 无服务器。前几年抄的火热，不过就我已知的情况，国内一直是雷声大雨点小。

它最大的好处是降低运维成本，自动扩缩容，可以很好的应对突发流量。对于个人开发者来说，它还有一个好处是**按量付费**，用多少资源付多少钱，没有人访问时它甚至可以自动暂停扣费。

Serverless 还往往集成了日志收集、监控告警、公网接口、链路追踪等等功能，极大降低开发人员心智负担了可以说是。

阿里云、腾讯云等各大运营商都有自家的 Serverless 服务，我体验了阿里云的 Serverless Fcuntion，从看文档到服务上线还是要折腾一下的，因为它更推荐用 YAML 定义函数服务的各项细节，有些参数比如 VPC、安全组、交换机等等其实我完全不关心，也必须手动粘贴各种 ID 到 YAML 里一点一点配置。

后来阿里云推出了 Serverless App 这种直接在网站 UI 上搭建应用的功能，确实很方便，还可以和 Github 等代码仓库绑定。

![Serverless体验](@assets/how-to-build-website-2024/image-2.png)

:::tip
其实 Deno Deploy、Vercel 这些平台也支持部署 Serverless Function，可以用来做一些小玩意，比如 [hbsgithub/deno-azure-openai-proxy](https://github.com/hbsgithub/deno-azure-openai-proxy) 可以一键部署 OpenAI 代理（国内也可以访问）
:::

# 方案四：轻服务SaaS

这种平台我不知道它应该叫什么，暂且叫它轻服务吧，和 Serverless 很像，都是编写一些代码片段即可运行，Serverless 有的它都有。在这个基础上集成了 Database、调试控制台、WebIDE、甚至 Auth、SMS 等功能，就可以一站式解决后端服务。

这种 SaaS 服务比较有代表性的平台是 [Supabase](https://supabase.com/)，它就像一个完整的工作台，在它上面开发一切都很顺畅，就像有人给你精心设计了一系列游戏关卡，在里面感受制作人对程序员头发脱落问题的善意。

不过 Supabase 仍然在国内访问受限，国内的替代品是 [AirCode](https://aircode.io)、[LeanCloud](https://www.leancloud.cn/)。

![AirCode体验](@assets/how-to-build-website-2024/image-3.png)

:::caution
使用 SaaS 服务有一个坏处是，一旦用了一个平台就很难脱离，迁移困难是一方面，还要祈祷这个平台不要哪天突然挂了 XD
:::

# 方案五：容器托管

现在有些平台允许用户从自定义镜像部署服务，对比来说，它牺牲了一点轻服务的开箱即用的便捷（比如在轻服务上接入 Auth 可能只需要点几下，在容器托管的平台上你需要先找到一个合适的镜像），但是它的灵活性是很高的。

比如这上面部署一个 WordPress 易如反掌，因为 WordPress、MySQL 都有可以直接用的镜像，更重要的是它还可以部署自定义镜像，所以任何可以在 Docker 上运行的服务应该都可以直接搬到上面去。

我用过体验还不错的平台是 [Zeabur](https://zeabur.com/) 和 [SealOS](https://sealos.io)，这两个平台在国内访问都还 ok，一个是月会员一个是按量付费，我用了一段时间感觉 Zeabur 的 Discord 回复非常及时，SealOS 虽然没这种活跃度，但是它有个部署在国内的版本 [cloud.sealos.top](https://cloud.sealos.top)（服务器在杭州）访问速度非常好，所以各有千秋吧。

![Zeabur体验](@assets/how-to-build-website-2024/image-4.png)

> 虽然阿里云也有 ACS 容器计算，我试了下感觉太麻烦，不知道为什么就是难用。。

# 方案六：低代码

低代码的理想情况是把组件拖拖拽拽就可以构建出一个网站，虽然我还没见过哪个平台能让非技术人员快速建站，只能说比较有前瞻性吧。。

个人感觉它的理念有些矛盾，懂代码的没必要用低代码，不懂代码的又不能很好理解那些参数（有种在 Word 里面建网站的感觉）

低代码平台我见到比较不错的是 [Webflow](https://webflow.com)，它的新手引导设计的很不错。

另外由于最近 AI 的发力，Vercel 前段时间推出的基于 AI 的低代码平台 [v0](https://v0.dev/) 可以关注一下，和 AI 对话告诉它你想修改哪个部分，想返稿就返稿，相当于一个 1v1 专职程序员为你服务了，它也许才是以后低代码平台的最终形态。

![在线鞭打 AI 程序员](@assets/how-to-build-website-2024/image.png)
