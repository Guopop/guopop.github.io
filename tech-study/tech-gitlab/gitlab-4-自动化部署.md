# Gitlab 自动化部署

通过推送或合并到指定分支，自动触发Gitlab Runner 来执行拉取代码，maven打包，上传到指定服务器，执行对应部署脚本，来部署服务的过程。

针对开发环境，测试环境采用自动触发模式。

针对正式环境，采用手动点击触发模式。

## Gitlab Runner 安装

用来执行.gitlab-ci.yml文件中具体的job

Gitlab Runner 可以放置在不同的服务器，也可以多个项目共用一个Gitlab Runner

```sh
docker pull gitlab/gitlab-runner
docker run -d --name gitlab-runner --restart always \
	-v /srv/gitlab-runner/config:/etc/gitlab-runner \
    -v /var/run/docker.sock:/var/run/docker.sock \
    gitlab/gitlab-runner:latest
```

## Gitlab Runner 注册到Gitlab

将Gitlab Runner 注册到Gitlab具体的项目，通过.gitlab-ci.yml来找到对应的Gitlab Runner 来执行对应的操作

<img src="https://guopop.oss-cn-beijing.aliyuncs.com/img/image-20210304092215715.png" alt="image-20210304092215715" style="zoom:67%;" />

<img src="https://guopop.oss-cn-beijing.aliyuncs.com/img/image-20210304092240469.png" alt="image-20210304092240469" style="zoom: 67%;" />

```sh
# 在对应的安装gitlab-runner服务器上进行注册
# 注册gitlab-runner到gitlab
docker run --rm -it -v /srv/gitlab-runner/config:/etc/gitlab-runner gitlab/gitlab-runner register
# Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com/):  上方的url
# Please enter the gitlab-ci token for this runner: 上方的令牌
# Please enter the gitlab-ci description for this runner: runner的描述
# Please enter the gitlab-ci tags for this runner (comma separated): gitlab-ci.yml 根据tag执行
# Please enter the executor: virtualbox, docker+machine, docker, shell, ssh, kubernetes, docker-ssh, parallels, docker-ssh+machine: docker 
```

> **gitlab 是根据tag来找到不同的runner，合理设置对应的tag**

<img src="https://guopop.oss-cn-beijing.aliyuncs.com/img/image-20210323163950154.png" alt="image-20210323163950154" style="zoom:67%;" />

## 编写.gitlab-ci.yml

```yaml
image: maven:latest

variables:
  MAVEN_OPTS: "-Dmaven.repo.local=.m2/repository"
  # 项目名称
  APP_NAME: "sxuh-pay-order"
  # 项目生成的jar包名称
  JAR_NAME: "$APP_NAME-0.0.1-SNAPSHOT"
  # 远程部署的地址
  DEPLOY_PATH: "/root/pay/$APP_NAME"
  
 # 全局缓存
cache:
  #　指定对应的key防止覆盖
  key: '$APP_NAME-maven'
  paths:
    - $APP_NAME/.m2/repository

stages:
  - build
  - package
  - deploy

build:
  stage: build
  tags:
    - deploy
  script:
    - echo "===============开始编译构建任务============"
    - cd $APP_NAME
    - mvn compile

package:
  stage: package
  tags:
    - deploy
  script:
    - echo "================开始打包任务============="
    - cd $APP_NAME
    - mvn clean package -Dmaven.test.skip=true
  # job执行完后产生的产物发送给gitlab, 可在gitlab作业进行下载
  artifacts:
    untracked: true
    paths:
      - target/

deploy:
  stage: deploy
  image: ubuntu
  tags:
    - deploy
  script:
    - echo "=================开始部署任务===================="
    - cd $APP_NAME
    - "which sshpass || (apt-get update -y && apt-get install sshpass -y)"
    # $PASSWORD $SSH_USERNAME $SSH_HOSTS 这三个值需要在gitlab项目变量中设置
    - sshpass -p $PASSWORD scp -o StrictHostKeychecking=no target/$JAR_NAME.jar $SSH_USERNAME@$SSH_HOSTS:$DEPLOY_PATH/build/
    # start.sh 这个脚本需要放在对应的服务器指定目录下
    # 最后的dev指定不同环境
    - sshpass -p $PASSWORD ssh -o StrictHostKeychecking=no $SSH_USERNAME@$SSH_HOSTS "bash $DEPLOY_PATH/start.sh $DEPLOY_PATH $JAR_NAME dev"
   only:
   # 指定对应的分支
   	- master
```

> 注意指定不同的环境 需要application.yml, .gitlab-ci.yml, gitlab的项目变量三者保持一致
>
> 上面的例子是指定master分支来运行application.yml中dev的配置
>
> 上面的cd $APP_NAME 是针对maven父子项目特加的
>
> 普通单项目去掉即可

在gitlab中设置.gitlab-ci.yml需要的变量，防止密钥泄露

<img src="https://guopop.oss-cn-beijing.aliyuncs.com/img/image-20210323172010019.png" alt="image-20210323172010019" style="zoom:67%;" />

## 部署服务器设置

```sh
# 这里创建的目录要和.gitlab-ci.yml中的DEPLOY_PATH保持一致
mkdir /root/pay/sxuh-pay-order
cd /root/pay/sxuh-pay-order
mkdir build
mkdir backup
mkdir heapError
vim start.sh
```

start.sh 

这个脚本不用改，整个参数都在.gitlab-ci.yml进行设置

```sh
#!/bin/bash
# 基础路径
BASE_PATH=$1
# 上传jar包路径
SOURCE_PATH=$BASE_PATH/build
# 应用名称
APP_NAME=$2
# 环境，不同的环境对应不同的配置，dev:开发; test:测试; prod:正式;
PROFILES_ACTIVE=$3

DATE=$(date +%Y%m%d%H%M)

# heapError 存放路径
HEAP_ERROR_PATH=$BASE_PATH/heapError
# JVM 参数
JAVA_OPS="-Xms1024m -Xmx1024m -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=$HEAP_ERROR_PATH"
# JavaAgent 参数。可用于配置 SkyWalking 等链路追踪
JAVA_AGENT=

# 备份代码
function backup() {
    # 如果不存在，则不备份
    if [ ! -f "$BASE_PATH/$APP_NAME.jar" ]; then
        echo "[backup] $BASE_PATH/$APP_NAME.jar 不存在，跳过备份"
    else
        echo "[backup] 开始备份 $APP_NAME ..."
        cp $BASE_PATH/$APP_NAME.jar $BASE_PATH/backup/$APP_NAME-$DATE.jar
    echo "[backup] 备份 $APP_NAME 完成"
    fi
}

# 更新代码
function transfer() {
    echo "[transfer] 开始转移 $APP_NAME.jar"

    # 删除原 jar 包
    if [ ! -f "$BASE_PATH/$APP_NAME.jar" ]; then
        echo "[transfer] $BASE_PATH/$APP_NAME.jar 不存在，跳过删除"
    else
        echo "[transfer] 移除 $BASE_PATH/$APP_NAME.jar 完成"
        rm $BASE_PATH/$APP_NAME.jar
    fi

    # 复制新 jar 包
    echo "[transfer] 从 $SOURCE_PATH 中获取 $APP_NAME.jar 并迁移至 $BASE_PATH ...."
        cp $SOURCE_PATH/$APP_NAME.jar $BASE_PATH

    echo "[transfer] 转移 $APP_NAME.jar 完成"
}

# 停止
function stop() {
    echo "[stop] 开始停止 $BASE_PATH/$APP_NAME"
    PID=$(ps -ef | grep $BASE_PATH/$APP_NAME | grep -v "grep" | awk '{print $2}')
    # 如果 Java 服务启动中，则进行关闭
    if [ -n "$PID" ]; then
        # 正常关闭
        echo "[stop] $BASE_PATH/$APP_NAME 运行中，开始 kill [$PID]"
        kill -15 $PID
        # 等待最大 60 秒，直到关闭完成。
        for ((i = 0; i < 60; i++))
            do
                sleep 1
                PID=$(ps -ef | grep $BASE_PATH/$APP_NAME | grep -v "grep" | awk '{print $2}')
                if [ -n "$PID" ]; then
                    echo -e ".\c"
                else
                    echo '[stop] 停止 $BASE_PATH/$APP_NAME 成功'
                    break
                fi
                    done

        # 如果正常关闭失败，那么进行强制 kill -9 进行关闭
        if [ -n "$PID" ]; then
            echo "[stop] $BASE_PATH/$APP_NAME 失败，强制 kill -9 $PID"
            kill -9 $PID
        fi
    # 如果 Java 服务未启动，则无需关闭
    else
        echo "[stop] $BASE_PATH/$APP_NAME 未启动，无需停止"
    fi
}

function start() {
    # 开启启动前，打印启动参数
    echo "[start] 开始启动 $BASE_PATH/$APP_NAME"
    echo "[start] JAVA_OPS: $JAVA_OPS"
    echo "[start] PROFILES: $PROFILES_ACTIVE"

    # 开始启动
    BUILD_ID=dontKillMe nohup java -server $JAVA_OPS -jar $BASE_PATH/$APP_NAME.jar --spring.profiles.active=$PROFILES_ACTIVE > $BASE_PATH/start.log &
    echo "[start] 启动 $BASE_PATH/$APP_NAME 完成"
}

# 部署
function deploy() {
    cd $BASE_PATH
    # 备份原 jar
    backup
    # 停止 Java 服务
    stop
    # 部署新 jar
    transfer
    # 启动 Java 服务
    start
}

deploy
```

## 提交代码，自动部署

push代码后，gitlab会显示对应进度流程

<img src="D:\file\md_file\guopop.github.io\images\image-20210323172539595.png" alt="image-20210323172539595" style="zoom:67%;" />

![image-20210323172559194](https://guopop.oss-cn-beijing.aliyuncs.com/img/image-20210323172559194.png)