# Gitlab 简介

[wiki](https://zh.wikipedia.org/wiki/GitLab)

> GitLab 是由 GitLab Inc.开发，一款基于 Git 的完全集成的软件开发平台（fully 集成软件 development platform）。另外，GitLab 且具有wiki以及在线编辑、issue跟踪功能、CI/CD 等功能。

## CI/CD

GitLab CI/CD 是 GitLab 内置的一款工具，用于 通过 [持续方法论](https://docs.gitlab.com/ee/ci/introduction/index.html#introduction-to-cicd-methodologies) （[页面存档备份](https://web.archive.org/web/20201128163747/https://docs.gitlab.com/ee/ci/introduction/index.html#introduction-to-cicd-methodologies)，存于[互联网档案馆](https://zh.wikipedia.org/wiki/互联网档案馆)）（continuous methodologies）的软件开发。 该持续方法论包含三个部分：[持续集成](https://zh.wikipedia.org/wiki/持续集成)、[持续交付](https://zh.wikipedia.org/wiki/持續交付)、[持续部署](https://zh.wikipedia.org/wiki/持續部署)。[[7\]](https://zh.wikipedia.org/wiki/GitLab#cite_note-7)[[8\]](https://zh.wikipedia.org/wiki/GitLab#cite_note-8)

- [持续集成](https://zh.wikipedia.org/wiki/持续集成)（Continuous Integration，简称CI），每次在上传代码块到基于Git仓库时，[持续集成](https://zh.wikipedia.org/wiki/持续集成) 会运行脚本去构建、测试、校验代码，这些操作是在合并到默认分支之前进行的。
- [持续交付](https://zh.wikipedia.org/wiki/持續交付)（Continuous Delivery，简称CD），在 **持续集成** 之后（即合并到默认分支之后），[持续交付](https://zh.wikipedia.org/wiki/持續交付) 将进行**手动部署**应用。
- [持续部署](https://zh.wikipedia.org/wiki/持續部署)（Continuous Deployment，简称CD），在 **持续集成** 之后（即合并到默认分支之后），[持续部署](https://zh.wikipedia.org/wiki/持續交付) 将进行**自动部署**应用。

## 原理

当开发者配置了 GitLab CI/CD，那么当开发者使用 git 提交（commit），那么就会触发 CI/CD 相关的一系列操作。 这一系列操作由 GitLab Runner 执行，相关配置记载于.gitlab-ci.yml文件中，执行的结果将在Gitlab页面中展示。每一次的提交（commit）将会出发一条流水线（pipeline），流水线是不同阶段（Stage）的任务（Job）的一个集合。 阶段（Stage）用于逻辑切割，同一阶段的任务以并行方式执行，阶段间是顺序执行，上一个阶段执行失败，下一个阶段将不会执行。 .pre 为第一阶段（译为：之前） 和 .post 最后阶段（译为：提交时），这两个阶段不需要被定义，也无法被修改。

任务（Job）可以构建Artifacts ，提供用户下载。利用场景如下：在Android项目中，当配置了自动化构建Artifacts后，每次提交（push）代码后，GitLab CI/CD 将自动构建 APK文件，并在GitLab的页面上提供下载按钮。 任务（Job）可以自动部署文件到外部服务器，并通过 GitLab 页面查看该服务器现今部署的状态，以及进行重新部署（re-deploy）等操作。通过使用设定 environment 的 name 和 url ，还可以在GitLab页面直接上查看网站。通过该操作可以达到 持续部署 的目的。

```yaml
stages:
  - build
  - test
  - deploy

job 0:
  stage: .pre
  script: make something useful before build stage

job 1:
  stage: build
  script: make build dependencies

job 2:
  stage: build
  script: make build artifacts

job 3:
  stage: test
  script: make test

job 4:
  stage: deploy
  script: make deploy

job 5:
  stage: .post
  script: make something useful at the end of pipeline
```

## Gitlab Runner

GitLab Runner 是一项开源项目，用于执行任务（Job），并将执行结果传输回Gitlab。

Runner 可安装在操作系统，也可以通过Docker的方式安装。当 Runner 安装后，需要将其注册在 GitLab 中，方可使用。Runner 有若干种执executor可供使用，如：Docker、Shell、SSH。Runner 默认使用Shell，Shell模式下，所有构建都会发生在Runner安装的机器中，操作十分简单，但是缺点很多。

.gitlab-ci.ym 文件中通过 tags 关键词选择Runner。Runner 的相关配置在 config.toml 文件中记载。