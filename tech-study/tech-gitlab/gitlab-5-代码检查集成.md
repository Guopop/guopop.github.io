# Gitlab 集成SonarQube进行代码检查

## postgresql 安装

```sh
mkdir /root/postgres
cd /root/postgres
vim docker-compose.yml
```

```yaml
version: '3'
services:
  postgres:
    image: postgres
    restart: always
    container_name: postgres
    ports:
      - 5432:5432
    environment:
      POSTGRES_PASSWORD: sonar
      POSTGRES_USER: sonar
      POSTGRES_DB: sonar
    volumes:
      - ./postgres.conf:/etc/postgresql/postgresql.conf
      - ./data:/var/lib/postgresql/data
```

```sh
docker-compose up -d
```

## SonarQube 安装

```sh
mkdir /root/sonarqube
cd /root/sonarqube
vim docker-compose.yml
```

```yaml
version: '3'
services:
  sonarqube:
    image: sonarqube:8.7-community
    restart: always
    container_name: sonarqube
    ports:
      - 9000:9000
    environment:
      # 此处的url,username,password是progresql的
      "sonar.jdbc.username": sonar
      "sonar.jdbc.password": sonar
      "sonar.jdbc.url": jdbc:postgresql://192.168.1.246:5432/sonar
    volumes:
      - ./conf:/opt/sonarqube/conf
      - ./extensions:/opt/sonarqube/extensions
      - ./logs:/opt/sonarqube/logs
      - ./data:/opt/sonarqube/data
```

启动前需要改下服务器的配置，解决一个es的问题

```sh
vim /etc/sysctl.conf
# 添加  
# vm.max_map_count=262144
# 重新加载配置
sysctl -p
```

再启动

```sh
docker-compose up -d
```

## 中文设置

![image-20210308181927911](https://guopop.oss-cn-beijing.aliyuncs.com/img/image-20210308181927911.png)

## 集成到gitlab

在sonarqube 创建一个项目

![image-20210309101542263](https://guopop.oss-cn-beijing.aliyuncs.com/img/image-20210309101542263.png)

创建令牌

<img src="https://guopop.oss-cn-beijing.aliyuncs.com/img/image-20210309101723856.png" alt="image-20210309101723856" style="zoom:67%;" />

![image-20210309101755634](https://guopop.oss-cn-beijing.aliyuncs.com/img/image-20210309101755634.png)

将sonar命令配置到.gitlab-ci.yml

```yaml
image: maven:latest

variables:
  MAVEN_OPTS: "-Dmaven.repo.local=.m2/repository"
  APP_NAME: "sxuh-pay-order"
  JAR_NAME: "$APP_NAME-0.0.1-SNAPSHOT"
  DEPLOY_PATH: "/root/pay/$APP_NAME"

cache:
  key: '$APP_NAME-maven'
  paths:
    - $APP_NAME/.m2/repository

stages:
  - build
  - package
  - sonar
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
  artifacts:
    untracked: true
    paths:
      - target/

sonar:
  stage: sonar
  tags:
    - deploy
  script:
    - echo "=====================开始代码检查========================"
    - cd $APP_NAME
    # 将上面的sonar命令复制到这个地方
    # -Dsonar.qualitygate.wait=true 通过代码质量检查才可以部署
    - mvn sonar:sonar -Dsonar.projectKey=sxuh-pay -Dsonar.host.url=http://192.168.1.246:9000 -Dsonar.login=0409677a0011416c24771431bcc5b856bb4f045e -Dsonar.qualitygate.wait=true

deploy:
  stage: deploy
  image: ubuntu
  tags:
    - deploy
  script:
    - echo "=================开始部署任务===================="
    - cd $APP_NAME
    - "which sshpass || (apt-get update -y && apt-get install sshpass -y)"
    - sshpass -p $PASSWORD scp -o StrictHostKeychecking=no target/$JAR_NAME.jar $SSH_USERNAME@$SSH_HOSTS:$DEPLOY_PATH/build/
    - sshpass -p $PASSWORD ssh -o StrictHostKeychecking=no $SSH_USERNAME@$SSH_HOSTS "bash $DEPLOY_PATH/start.sh $DEPLOY_PATH $JAR_NAME dev"
  only:
    - master
```

