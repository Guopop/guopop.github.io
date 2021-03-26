# Spring Boot 集成 xxl-job

## mysql 安装

```yaml
version: "3"
services:
  mysql:
    image: mysql:5.7
    container_name: mysql
    environment:
      MYSQL_ROOT_PASSWORD: 123456
    volumes:
      - ./data:/var/lib/mysql
    ports:
      - "3306:3306"
```

[初始化sql语句](https://github.com/xuxueli/xxl-job/blob/master/doc/db/tables_xxl_job.sql)

安装完mysql后，执行初始化sql，再安装xxl-job

## xxl-job 安装

```yaml
version: '3' 
services:
  xxljob:
    image: xuxueli/xxl-job-admin:2.3.0
    container_name: xxljob
    ports:
      - "8888:8080"
    environment:
      PARAMS: "--spring.datasource.url=jdbc:mysql://106.53.248.242:3306/xxl_job?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai --spring.datasource.username=root --spring.datasource.password=123456 --spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver"
    volumes:
      - ./logs:/data/applogs
```

