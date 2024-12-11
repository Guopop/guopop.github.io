---
outline: deep
---

# MySQL 运维
## 日志

### 错误日志

错误日志是MySQL中最重要的日志之一，它记录了MySQL启动或停止时，以及服务器在运行过程中发生任何严重错误时的相关信息

当数据库出现任何故障时，首先查看此日志

该日志默认开启，默认存放目录`/var/log/mysql` 日志名称为`error.log`

查看日志位置

```sql
show variables like '%log_error%'
```

### 二进制日志

二进制日志(binlog)记录了所有DDL和DML语句，不包括数据查询语句

作用：

灾难时的数据恢复

MySQL的主从复制

查看日志位置

```sql
show variables like '%log_bin%'
```

日志查看

mysqlbinlog

日志删除

| 指令                                               | 含义                                 |
|--------------------------------------------------|------------------------------------|
| reset master                                     | 删除全部binlog日志，删除之后，从binlog.000001开始 |
| purge master logs to 'binlog.xxxxx'              | 删除xxxxx编号之前的所有日志                   |
| purge master logs before 'yyyy-mm-dd hh24:mi:ss' | 删除日志为'yyyy-mm-dd hh24:mi:ss'之前所有日志 |

### 查询日志

查询日志记录了客户端的所有操作语句，而二进制日志不包含查询数据的SQL语句。默认情况是未开启的

```sql
show variables like '%general%'
```

修改MySQL的配置文件`/etc/my.cnf`文件

```cnf
# 1开启 0关闭
general_log=1
# 文件名称
general_log_file=mysql_query.log
```

### 慢查询日志

慢查询日志记录了所有执行时间超过参数`long_query_time`设置值并且扫描记录数不小于`min_examined_row_limit`的所有的sql语句的日志

默认未开启，`long_query_time`默认为10秒，最小为0，精确到微秒

```cnf
# 1开启0关闭
slow_query_log=1
# 执行时间参数
long_query_time=2
# 记录执行较慢的管理语句
log_slow_admin_statements=1
# 记录执行较慢的未使用索引的语句
log_queries_not_using_indexes=1
```

## 主从复制

### 概述

主从复制是指将主数据的DDL和DML操作通过二进制日志传到从库服务器中，然后在从库上对这些操作进行重新执行，从而使得从库与主库数据保持一致

MySQL支持一台主库向多台从库进行复制，从库也可以作为其他从库的主库，进行链式复制

优点

1. 主库出现服务，可以快速切换到从库提供服务
2. 实现读写分离，降低主库访问压力
3. 可以在从库进行备份，避免在备份中影响主库服务

### 原理

![[Pasted image 20221203143507.png]]

复制分为3步

1. 主库在事务提交时，会把数据变更记录在binlog中
2. 从库读取主库的binlog，写在从库的中继日志relay log 中
3. 从库执行relay log的sql, 进行数据变更

### 搭建

#### 服务器准备

两台服务器，一台做主库，一台做从库，关闭防火墙，或开启3306端口

#### 主库配置

1. 修改配置谁的/etc/my.cnf
   $1-2^{32}-1$

```cnf
# mysql 服务id, 保证整个集群环境唯一，取值范围$1-2^32-1$ 默认为1
server-id=1
# 是否只读，1表示只读，0表示读写
read-only=0
# 忽略的数据，指不需要同步的数据库
#binlog-ignore-db=mysql
# 指定同步的数据库
#binlog-do-db=db01
```

2. 重启mysql

```bash
systemctl restart mysqld
```

3. 登录mysql，创建远程连接账号，并授予主从复制权限

```bash
# 创建用户，并设置密码
create user 'guopop'@'%' identified with mysql_native_password by 'Root@123456'
# 为用户分配主从复制权限
grant replication slave on *.* to 'guopop'@'%'
```

4. 查看二进制日志坐标

```mysql
show master status;
```

字段含义说明

- file: 从哪个日志文件开始推送日志文件
- position: 从哪个位置开始推送日志文件
- binlog_ingore_db: 指定不需要同步的数据库

#### 从库配置

1. 修改配置文件`/etc/my.cnf`

```cnf
# mysql服务id 保证整个集群环境唯一
server-id=2
# 是否只读，1表示只读，0表示读写
read-only=1
```

2. 重新启动mysql

```bash
systemctl restart mysqld
```

3. 登录mysql， 设置主库配置

```mysql
change replication source to master_host='xxx', master_user='xxx', master_password='xxx', master_log_file='xxx', master_log_pos='xxx';

```

4. 开启同步操作

```sql
start slave;
```

5. 查看从库状态

```sql
show slave status;
```

## 分库分表

### 介绍

随着互联网及移动互联网的发展，应用系统的数据量也成指数式增长，若采用单数据库进行数据存储，存在以下性能瓶颈

- IO瓶颈：热点数据太多，数据库缓存不足，产生大量磁盘IO，效率低下。请求数据太多，带宽不够，网络IO瓶颈。
- CPU瓶颈：排序，分组，连接查询，聚合统计等SQL会耗费大量的CPU资源，请求数太多，CPU出现瓶颈。

#### 拆分策略

![[Pasted image 20221203143523.png]]

##### 垂直拆分

垂直分库：以表为依据，根据业务将不同表拆分到不同库中

- 每个库的表结构都不一样
- 每个库的数据也不一样
- 所有库的并集是全量数据

![[Pasted image 20221203143537.png]]

垂直分表：以字段为依据，根据字段属性将不同字段拆分到不同表中

- 每个表的结构都不一样
- 每个表的数据也不一样，一般通过一列(主键/外键)关联
- 所有表的并集是全量数据

![[Pasted image 20221203143547.png]]

##### 水平拆分

水平分库：以字段为依据，按照一定策略，将一个库中数据拆分到多个库中

- 每个库的表结构都一样
- 每个库的数据都不一样
- 所有库的并集是全量数据

![[Pasted image 20221203143558.png]]

水平分表：以字段为依据，按照一定策略，将一个表中数据拆分到多个表中

- 每个表的表结构都一样
- 每个表的数据都不一样
- 所有表的并集是全量数据

![[Pasted image 20221203143607.png]]

#### 实现技术

- shardingJDBC：基于AOP原理，在应用程序中对本地执行的SQL进行拦截、解析、必定、路由处理，需要自行编码配置实现，只支持java语言，性能高
- MyCat：数据库分库分表中间件，不用调整代码即可实现分库分表，支持多种语言，性能无shardingJDBC高

### Mycat概述

![[Pasted image 20221203143615.png]]

### Mycat入门

### Mycat配置

### Mycat分片

### Mycat管理及监控

## 读写分离

### 介绍

读写分离，是把对数据库的读操作和写操作分开，以对应不同的数据库服务器，主数据库提供写操作，从数据库提供读操作

### 一主一从

### 一主一从读写分离

### 双主双从

### 双主双从读写分离