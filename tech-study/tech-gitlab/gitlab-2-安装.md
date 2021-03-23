

# Gitlab 安装

> 采用docker安装的方式

## 前置条件

- 了解下docker的基本使用
- 安装docker
- 安装docker compose

## Gitlab 安装

创建安装Gitlab的安装目录

```sh
mkdir /root/gitlab 
cd /root/gitlab
vim docker-compose.yml
```

docker-compose.yml

```yaml
version: '3' 
services: 
  web: 
    image: 'gitlab/gitlab-ce:latest'
    restart: always
    container_name: 'gitlab' 
    environment: 
      GITLAB_OMNIBUS_CONFIG: |
      	# gitlab管理界面地址
        external_url 'http://39.105.47.81:8888' 
        gitlab_rails['gitlab_shell_ssh_port'] = 8822 
        gitlab_rails['time_zone'] = 'Asia/Shanghai' 
    ports: 
      - '8888:8888' 
      - '8443:443' 
      - '8822:22' 
    volumes: 
      - './config:/etc/gitlab' 
      - './logs:/var/log/gitlab' 
      - './data:/var/opt/gitlab'
```

```sh
# 使用docker compose 命令后台启动gitlab
cd /root/gitlab
docker-compose u -d
```

稍等片刻

```sh
# 可以通过以下命令查看日志
docker logs -t -f --tail=100 gitlab
```

访问http://39.105.47.81:8880/ 即可访问gitlab主页

> **第一次设置管理员登录密码**

## 中文设置

![image-20210227113419104](https://guopop.oss-cn-beijing.aliyuncs.com/img/image-20210227113419104.png)