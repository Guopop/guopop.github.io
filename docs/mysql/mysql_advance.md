---
outline: deep
---

# MySQL体系结构

![MySQL体系结构](/mysql_architecture.png)

连接层：最上层是一些客户端和链接服务，主要完成类似于连接处理、授权认证、及相关的安全方案。服务器也会为安全接入的每个客户端验证它所具有的操作权限

服务层：第二层主要完成大多数核心服务功能，如SQL接口，并完成缓存的查询，SQL的分析与优化，部分内置函数的执行。所有跨存储引擎的功能也在这一层实现，如过程，函数等。

引擎层：存储引擎真正负责了数据的存储和提取，服务器通过API和存储引擎进行通讯。不同的存储引擎有不同的功能，我们可以根据我们的需要来选取适合我们的存储引擎。

存储层：主要将数据存储在文件系统上，完成与存储引擎的交互

## 存储引擎

定义：存储数据，建立索引、更新/查询数据等技术的实现方式。存储引擎是基于表的

在创建表时指定存储引擎
```sql
create table 表名(
	字段1 字段1类型
	...
) ENGINE=INNODB[comment 表注释];
```

查询建表语句
```sql
show create table 表名;
```

查询当前数据库支持的存储引擎
```sql
show engines;
```

创建MyISAM 引擎类型表
```sql
create table my_myisam (
    id int,
    name varchar(10)
) engine MyISAM;
```

创建Memory 引擎类型表
```sql
create table my_memory (
    id int,
    name varchar(10)
) engine Memory;

```

### InnoDB

兼顾高可靠性和高性能的通用存储引擎

特点
- DML遵循ACID模型，支持事务
- 行级锁，提高并发访问性能
- 支持外键，保证数据的完整性和正确性

文件
xxx.ibd xxx是表名 InnoDB引擎的每张表都会对应这样一个表空间文件，存储表结构，数据和索引

逻辑存储结构

![[Pasted image 20221203142920.png]]

### MyISAM

MySQL早期默认引擎

特点
- 不支持事务，不支持外键
- 支持表锁，不支持行锁
- 访问速度快

文件
- xxx.sdi 存储表结构
- xxx.MYD 存储数据
- xxx.MYI 存储索引

### Memory

表数据存储在内存中，临时表，缓存使用

特点
- 内在存放
- hash索引

文件
- xxx.sdi 存储表结构

三者的区别

| 特点         | InnoDB | MyISAM | Memory |
| ------------ | ------ | ------ | ------ |
| 存储限制     | 64TB   | 有     | 有     |
| 事务安全     | 支持   |        |        |
| 锁机制       | 行锁   | 表锁   | 表锁   |
| B+tree索引   | 支持   | 支持   | 支持   |
| Hash索引     |        |        | 支持   |
| 全文索引     | 支持   | 支持   |        |
| 空间使用     | 高     | 低     |        |
| 内存使用     | 高     | 低     | 中等   |
| 批量插入速度 | 低     | 高     | 高     |
| 支持外键     | 支持   |        |        |

### 存储引擎的选择

- InnoDB：支持事务，外键，对事务完整性要求高，并发条件下数据的一致性，

- MyISAM：以读和插入为主，对事务完整性要求不高，并发性要求不高

- Memory：数据在内存，访问数据快，用于临时表和缓存

## 索引

### 索引概述

定义：索引是帮助MySQL高效获取数据的数据结构(有序)。在数据之外，数据库系统还维护着满足特定查找算法的数据结构，这些数据结构以某种方式引用(指向)数据，在这些数据结构上实现高级查找算法，这些数据结构就是算法

| 优点                                                        | 缺点       |
| ----------------------------------------------------------- | ---------- |
| 提高数据库的检索效率，降低数据库的IO成本                    | 索引占空间 |
| 通过索引列去数据进行排序，降低数据排序的成本，降低CPU的成本 | 降低表的更新速度，更新表，同时也要更新索引           |

### 索引结构

MySQL的索引是在存储引擎层实现的，不同的存储引擎有不同的结构

| 索引      | InnoDB | MyISAM | Memory |
| --------- | ------ | ------ | ------ |
| B+Tree    | Y      | Y      | Y      |
| Hash      | N      | N      | Y      |
| R-Tree    | N      | Y      | N      |
| Full-text | Y      | Y      | N      |

B Tree (多路平衡查找树)

![[Pasted image 20221203142936.png]]

树的度数是一个节点的子节点个数

B+ Tree

![[Pasted image 20221203142945.png]]

Hash

![[Pasted image 20221203143000.png]]

Hash索引只能用于对等比较，不能范围查询

无法利用索引完成排序操作

查询效率高

### 索引分类

| 分类     | 含义                                                 | 特点                   | 关键字  |
| -------- | ---------------------------------------------------- | ---------------------- | ------- |
| 主键索引 | 针对表中主键创建的索引                               | 默认自动创建，只有一个 | PRIMARY |
| 唯一索引 | 避免同一表中某数据列中值重复                         | 可有多个               | UNIQUE  |
| 常规索引 | 快速定位特定数据                                     | 可有多个               |         |
| 全文索引 | 全文索引查找的是文本中的关键词，而不是比较索引中的值 | 可有多个               | FULLTEXT        |

在InnoDB存储引擎中，根据索引的存储形式，分为两种

| 分类                      | 含义                                                       | 特点             |
| ------------------------- | ---------------------------------------------------------- | ---------------- |
| 聚集索引(Clustered Index) | 将数据存储和索引放在一块，索引结构的叶子节点保存了行数据   | 必有，且只有一个 |
| 二级索引(Secondary Index) | 将数据和索引分开存储，索引结构的叶子节点关联的是对应的主键 | 可以存在多个                 |

聚集索引选取规则
- 如果存在主键，主键索引就是聚集索引
- 如果不存在主键，将第一个唯一索引作为聚集索引
- 如果既没有主键，也没有唯一索引，InnoDB将自动生成一个rowid作为隐藏的聚集索引

回表查询：查二级索引，再根据主键id查询行数据

InnoDB主键索引的B+Tree高度为多高？

![[Pasted image 20221203143011.png]]

### 索引语法

#### 创建索引
```sql
create [unique|fulltext] index 索引名 on 表名(加索引的字段名,...);
```

#### 查看索引
```sql
show index from 表名;
```

#### 删除索引
```sql
drop index 索引名 on 表名;
```

demo

```sql
CREATE TABLE `tb_user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `email` varchar(50) NOT NULL DEFAULT '',
  `profession` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `age` tinyint NOT NULL DEFAULT '0',
  `gender` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '1',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '1',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_phone` (`phone`),
  KEY `idx_name` (`name`),
  KEY `idx_pro_age_sta` (`profession`,`age`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

show index from tb_user;

create index idx_name on tb_user(name);

create unique index idx_phone on tb_user(phone);

create index idx_pro_age_sta on tb_user(profession,age,status);

create index idx_email on tb_user(email);

drop index idx_email on tb_user;
```

### SQL 性能分析

#### SQL执行频率

查询服务器状态信息
```
show [global|session] status;
```

查询当前数据库的insert, update, delete, select 的访问频次
```sql
show [global|session] status like 'Com_______';
```

#### 慢查询日志

慢查询日志记录了所有执行时间超过指定参数(long_query_time, 单位:秒, 默认10秒)的所有SQL语句日志

MySQL慢查询日志需要开启，在`/etc/my.cnf`中添加内容

```cnf
# 开启慢查询日志开关
slow_query_log=1
# 设置慢查询日志时间为2秒，查询超过2秒，则为慢查询，记录日志
long_query_time=2
```

慢查询日志位置`/var/lib/mysql/localhost-slow.log`

#### profile详情

`show profiles`操作在SQL优化时，了解到sql的每个操作都耗费多少时间

查询当前MySQL是否支持profiles
```sql
select @@profiling;
```

默认profiling是关闭的，开启profiling
```sql
set profiling=1;
```

查看每一条SQL的基本耗时情况
```sql
show profiles;
```

查看指定query_id的SQL耗时情况
```sql
show profile for query query_id;
```

查看指定query_id的SQL的CPU耗时情况
```sql
show profile cpu for query query_id;
```

#### explain执行计划

`explain`或`desc`命令获取MySQL 如何执行MySQL的信息，包括select语句执行过程中表如何连接，连接的顺序

语法
```sql
explain/desc select语句;
```

explain执行计划各个字段的含义

| 字段         | 含义                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id           | select 查询的序列号，表示查询中执行的select子句或操作表的顺序(id相同，从上到下执行，id不同，值越大越先执行)                                                         |
| select_type  | 表示select的类型，simple(简单表，不使用表连接或子查询)；primary(主查询，即外层的查询)；union(union中第二个或后面的查询语句)；subquery(select/where之后包含了子查询) |
| type         | 表示连接类型，性能由好到差，依次为null、system、const、eq_ref、ref、range、index、all                                                                               |
| possible_key | 显示可能应用在这张表上的索引，一个或多个                                                                                                                            |
| key          | 实际使用的索引，如果为null，则没有使用索引                                                                                                                          |
| key_len      | 表示索引中使用的字节数，该值为索引字段最大可能长度，并非实际使用长度，在不损失精确性的情况下，长度越短越好                                                          |
| rows         | MySQL认为必须要执行查询的行数，在InnoDB引擎表，是一个估计值，并不精确                                                                                               |
| filtered     | 表示返回结果的行数占需读取行数的百分比，值越大越好                                                                                                                  |
| extra        | 额外信息                                                                                                                                                                    |

### 索引使用

#### 验证索引效率

针对大数据量的表，根据一个字段查询数据，查看耗时，然后在这个字段加索引，再次查询，查看耗时

会发现效率明显提高

#### 最左前缀法则

联合索引，要遵守最左前缀法则，最左前缀法则是指从索引的最左列开始，并且不跳过索引中的列

如果跳过某一列，后面的字段也索引失效

#### 范围查询

联合索引中，出现范围查询(`>,<`)，范围查询右侧的列索引失效

使用`>=,<=`索引不会失效

#### 索引列运算

在索引列上进行运算操作。索引将失效

#### 字符串不加引号

字符串类型字段使用时，不加引号，索引将失效

#### 模糊查询

如果仅仅是尾部模糊匹配，索引不会失效。

如果是头部模糊匹配，索引失效。

#### or连接的条件

用or分割开来的条件，如果or前面有索引，后面没有索引，涉及索引全部失效

只有or前后都有索引，才生效

#### 数据分布影响

如果MySQL评估，使用索引比扫描全表慢，则不使用索引

#### SQL提示

SQL提示是优化数据库的一个重要手段，在SQL语句中加入一些人为提示来达到优化数据库的操作

use index: 建议使用指定索引，不一定用
```sql
select * from 表名 use index(索引字段) where 索引字段 = ...;
```

ignore index:  忽略索引，不使用这个索引
```sql
select * from 表名 ignore index(索引字段) where 索引字段 = ...;
```

force index; 必须使用这个索引
```sql
select * from 表名 force index(索引字段) where 索引字段 = ...;
```

#### 覆盖索引

尽量使用覆盖索引，(查询使用了索引，且需要返回的列在，该索引中都能找到)，减少select *

explain 的extra 内容为Using Where, Using index（查找使用了索引，需要的数据在索引列中都能找到，不需要回表查询） 性能高， Using index condition（查找使用了索引，但需要回表查数据） 性能低

![[Pasted image 20221203143044.png]]
聚集索引 一般为id 叶子节点挂的是整行数据

辅助索引，index unique ，叶子节点挂的是id

#### 前缀索引

当字段类型为字符串(varchar, text)，有时候需要索引很长的字符串，这会让索引很大，查询时，浪费大量的磁盘IO，影响查询效率。

将字符串的一部分前缀，建立索引，大大节省索引空间，提高索引效率

语法，n为前缀长度
```sql
create index idx_xxx on table_name(column(n))；
```

前缀长度

可以根据索引的选择性来决定，选择性是指不重复的索引值与表记录总数的比值，索引的选择性越高，效率越高

唯一索引的选择性为1

计算选择性
```sql
select count(distinct email) / count(*) from tb_user;

select count(distinct substring(email, 1, 5)) / count(*) from tb_user;
```

#### 单列索引与联合索引

单列索引：一个索引只包含一个列

联合索引：一个索引包含多列

在业务场景中，如果存在多个查询条件，考虑针对查询字段建立索引时，建议建立联合索引

联合索引哪个字段在前，哪个字段在后，对查询效率有影响

### 索引设计原则

1. 针对数据量大，且查询比较频繁的表建立索引

2. 针对常作为查询条件(where)，排序(order by)，分组(group by) 操作的字段建立索引

3. 尽量选择区分度高的列建立索引，尽量建立唯一索引，区分度越高，查询效率越高

4. 如果是字符串类型的字段，字段的长度较长， 针对字段的特点，建立前缀索引

5. 尽量使用联合索引，减少单列索引，联合索引可以覆盖索引，节省存储空间，减少回表，提高效率

6. 要控制索引的数量，索引并不是越多越好，维护索引的代价大，会影响增删改效率

7. 如果索引列不能存储null, 在建表时not null 约束它，当优化器知道每列是否包含null值，可以更好确定哪个索引查询效率高

## SQL优化

### 插入数据

#### insert 优化

批量插入 500-1000条数据
```sql
insert into 表名 values (v1, v2),(v2, v3);
```

手动提交事务
```sql
start transaction;
insert into 表名 values (v1, v2);
insert into 表名 values (v3, v4);
insert into 表名 values (v5, v6);
commit;
```

主键顺序插入
```sql
主键顺序插入: 1, 2, 3, 4, 5
```

#### 大批量插入数据

```bash
# 客户端连接服务器时，加上参数 --local-infile
mysql --local-infile -u -root -p
# 设置全局参数为1，开启从本地加载文件导入数据的开关
set global local_infile=1
# 执行load指令，将准备后的数据加载到表结构中
load data local infile 本地文件地址 into table 表名 fields terminated by ',' lines terminated by '\n';
```

![[Pasted image 20221203143129.png]]

### 主键优化

#### 数据组织方式

在InnoDB存储引擎中，表数据都是根据主键顺序组织存放的，这种存储方式的表称为索引组织表(index organized table iot)

#### 页分裂

页可以为空，也可以填充一半，也可以填充100%，每个页包含2-N行数据(如果一行数据过大，会行溢出)，根据主键排列

#### 页合并

当删除一行记录时，实际上记录并没有被物理删除，只是记录被标记为删除，并且它的空间变得允许被其他记录声明使用

当页中删除的记录达到MERGE_THRESHOLD(默认为页的50%)，InnoDB会开始寻找最靠近的页(前或后)，看看是否可以将两个页合并以优化空间

MERGE_THRESHOLD：合并页的阈值，可以自己设置，在创建表或创建索引时指定

#### 主键设计原则

满足业务需求的情况下，尽量降低主键长度

插入数据时，尽量选择顺序插入，选择使用auto_increment自增主键

尽量不要使用UUID或其他自然主键，如身份证号

业务操作时，避免对主键的修改

### order by 优化

#### Using filesort

通过表的索引或全表扫描，读取满足条件的数据行，然后在排序缓冲区sort buffer中完成排序操作，所有不是通过索引顺序直接返回排序结果的排序都是filesort排序

#### Using index

通过有序索引顺序扫描直接返回有序数据，不需要额外排序，操作效率高

创建索引时指定排序方向
```sql
create index idx_user_age_pho_ad on tb_user (age asc, phone desc);
```

对两个字段排序，会将排第一个字段，然后对第一个字段相关的记录，再进行第二个字段的排序

#### 最佳实践

根据排序字段建立合适的索引，多字段排序时，也遵循最左前缀法则

尽量使用覆盖索引

多字段排序，一个升序，一个降序，此时要注意创建联合索引时的排序规则

如果不可避免出现filesort，大数据量排序时，可以适当增大排序缓冲区大小sort_buffer_size(默认256k)

### group by 优化

在分组操作时，可以通过索引来提高效率，未命中索引，会使用临时表(Using temporary)

分组操作时，索引的使用满足最左前缀法则

### limit 优化

一个常见的问题是limit 2000000,10，需要排序2000010条记录

优化思路：一般分页查询，覆盖索引可以比较好的提高性能，可以通过覆盖索引加子查询形式进行优化

```sql
select s.* from tb_sku s, (select id from tb_sku order by id limit 2000000,10) a where s.id = a.id;
```

### count 优化

InnoDB引擎，在进行count()函数时，会把数据一行一行读出来，计数

#### count(主键)

InnoDB引擎会遍历整张表，把每一行的主键id取出来返给服务层，服务层进行累加

#### count(字段)

没有not null约束，每行的字段值取出，不为null，累加，为null，跳过

有not null约束，每行的字段值取出，累加

#### count(1)

每行取出，赋值为1， 累加

#### count(`*`)

专门优化，不取值，直接累加

### update 优化

InnoDB的行锁是针对索引加的锁，不是针对记录加的锁，并且该索引不能失效，否则会从行锁升级为表锁。

## 视图/存储过程/触发器

### 视图

视图(view)是一种虚拟存在的表。视图中的数据并不在数据库真实存在，行和列来自定义视图的查询中使用的表，并且在使用视图是动态生成

视图只保存了查询的SQL逻辑，不保存查询结果

#### 创建
```sql
create [or replace] view 视图名称 as select语句 [with[cascaded|local]check option];
```

#### 查询
```sql
查看创建视图语句：show create view 视图名称;

查看视图数据：select * from 视图名称;
```

#### 修改
```sql
方式一：create [or replace] view 视图名称 as select语句 [with[cascaded|local]check option];

方式二：alter view 视图名称 as select语句 [with[cascaded|local]check option];
```

#### 删除
```sql
drop view [if exists] 视图名称;
```

#### 视图的检查选项

当使用with check option子句创建视图时，MySQL会通过视图检查正在更改的每一行，插入，更新，删除，以使其符合视图的定义。MySQL允许基于另外一个视图创建视图，它还会检查依赖视图中的规则以保持一致性。为了确定检查范围，提供了cascaded, local, 默认为cascaded

#### 视图的更新

要使视图更新，视图中的行与基础表中的行之间必须存在一对一的关系。

如果视图包含以下任何一项，则不能更新
1. 聚合函数或窗口函数（sum(), min(), max(), count()）
2. distinct
3. group by
4. having
5. union， union all

#### 视图的作用

简单

视图不仅可以简化用户对数据的理解，也可以简化他们的操作，经常使用的查询可以定义为视图，从而用户不用一定指定全部的条件

安全

数据库可以授权，但不能指定特定行和列，视图可以让用户查询或修改指定的数据

独立

视图可以帮助用户屏蔽真实表结构带来的变化

### 存储过程

介绍：

存储过程是事先经过编译存储在数据库的一段sql的集合，调用存储过程简化应用开发人员的工作，减少数据库与应用服务器之间的传输，提高数据处理效率

存储过程就是数据库SQL语言层面的代码封闭与复用

特点：

封装，复用

可以接收参数，也可以返回数据

减少网络交互，提高效率

创建
```sql
create procedure 存储过程名称 ([参数列表])
begin
	-- SQL语句
end;
```

调用
```sql
call 名称([参数]);
```

查看
```sql
show create procedure p1;
```


删除
```sql
drop procedure if exists p1;
```

#### 变量

系统变量

系统变量是MySQL服务器提供的，不是用户定义的，属于服务器层面的，分为全局变量(GLOBAL)，会话变量(SESSION)

查看系统变量
```sql
show [session|global] variables; -- 查看所有系统变量
show [session|global] variables like ''; -- 模糊查询系统变量
show @@[session|global].系统变量名称; -- 查看指定变量的值
```

设置系统变量
```sql
set [session|global] 系统变量名=值;
set @@[session|global].系统变量名=值;
```

默认为session

mysql 服务器重启后，设置所有参数失效，永久生效 配置/etc/my.cnf

用户自定义变量

用户自定义变量是用户根据自己需要定义的变量，用户变量不用提前声明，直接赋值即可，其作用域为当前连接

赋值
```sql
set @var_name = expr [, @var_name = expr]...;
set @var_name := expr [, @var_name := expr]...;

select @var_name := expr [, @var_name := expr]...;
select 字段名 into @var_name from 表名;
```

使用
```
select @var_name;
```

局部变量

局部变量是根据需要在发展部生效的变量，可用作存储过程的局部变量和参数，局部变量的作用域为begin...end之间

声明
```sql
declare 变量名 变量类型[default ..];
```

变量类型为数据库类型，

赋值
```sql
set 变量名 = 值；
set 变量名 := 值;
select 字段名 into 变量名 from 表名;
```

#### if判断

语法
```sql
if 条件1 then
...
elseif 条件2 then
...
else
...
end if;
```

#### 参数

| 类型  | 含义                                         | 备注 |
| ----- | -------------------------------------------- | ---- |
| IN    | 该类参数作为输入，也就是需要调用时传入值     | 默认 |
| OUT   | 该类参数作为输出，也就是该参数可以作为返回值 |      |
| INOUT | 既可作输入参数，也可作输出参数               |      |

#### case

语法一
```sql
case case_value
	when when_value1 then statement_list1
	[when when_value2 then statement_lsit2]...
	[else statement_list]
end case;
```

语法二
```sql
case
	when search_condition1 then statement_list1
	[when when_value2 then statement_list2]...
	[else statement_list]
end case;
```

#### 循环

while

while循环是有条件的循环控制语句，满足条件后，再执行循环中的语句

语法
```sql
while 条件 do
	sql逻辑
end while;
```

repeat

repeat 是有条件的循环控制语句，当满足条件时退出循环

语法
```sql
repeat
	sql逻辑...
	until 条件
end repeat;
```

loop

LOOP实现简单的循环，不在SQL逻辑中增加退出条件，可以实现简单的死循环，LOOP可以配合以下两个语句来使用
- leave ：退出循环
- iterate ：跳过剩下逻辑，进入下一次循环

```sql
[begin_label:] loop
	sql逻辑
end loop [end_label];
```

```sql
leave label; 退出指定循环标记的循环体
iterate label; 直接进入下一次循环
```

#### 游标

游标是用来存储查询结果集的数据类型，在存储过程和函数中可以使用游标对结果集进行循环处理，游标的处理包括声明，open，fetch，close

声明游标
```sql
declare 游标名称 cursor for 查询语句;
```

打开游标
```sql
open 游标名称;
```

获取游标记录
```sql
fetch 游标名称 into 变量[, 变量];
```

关闭游标
```sql
close 游标;
```

![[Pasted image 20221203143213.png]]

### 存储函数

存储函数是有返回值的存储过程，存储函数的参数只能是IN类型

语法
```sql
create function 存储函数名称([参数列表])
returns type [characteristic...]
begin
	sql语句
	return ...;
end;
```

characteristic说明
- deterministic: 相同的输入总是产生相同的结果
- no sql: 不包含sql语句
- reads sql data: 包含读取sql的语句，但不包含写入sql的语句


### 触发器

触发器是与表有关的数据库对象，指在insert/update/delete/之前或之后，触发并执行触发器之中SQL语句集合

触发器这种特性可以协助应用在数据库端确保数据的完整性，日志记录，数据校验等操作

使用别名OLD/NEW来引用触发器中发生变化的记录内容，

现在触发器只支持行级触发器，不支持语句级触发器

| 触发器类型     | NEW和OLD                                             |
| -------------- | ---------------------------------------------------- |
| insert型触发器 | NEW表示将要或已经新增的数据                          |
| update型触发器 | OLD表示修改之前的数据，NEW表示将要或已经修改后的数据 |
| delete型触发器 | OLD表示将要或已经删除的数据                                                     |

语法

创建
```sql
create trigger trigger_name
before/after insert/update/delete
on tb_name for each row -- 行级触发器
begin
	trigger_stmt
end;
```

查看
```sql
show triggers;
```

删除
```sql
drop trigger [schema_name.]trigger_name; --如果没有指定schema_name，默认为当前数据库
```

![[Pasted image 20221203143246.png]]

![[Pasted image 20221203143256.png]]

![[Pasted image 20221203143304.png]]

## 锁

## 概述

介绍

锁是计算机协调多个进程或线程并发访问同一资源的机制

在数据库中，除了传统的资源(CPU、RAM、I/O)，数据是供许多用户共享的资源

如何保证数据库并发访问的一致性，有效性是所有数据库必须解决的一个问题，锁冲突也是影响数据库并发访问的一个重要因素

从这个角度来看，锁对数据库显得尤为重要，也更复杂

分类

MySQL的锁，按锁的粒度，分为以下三类：
- 全局锁：锁定数据库中所有表
- 表级锁：每次操作锁住整张表
- 行级锁：每次操作锁住对应的行数据

## 全局锁

介绍

全局锁就是对整个数据库实例加锁，加锁后整个实例处于只读状态，后续的DML的写语句，DDL语句，已更新操作的事务提交语句都将被阻塞

其典型的使用场景就是对全库做数据备份，对所有表进行锁定，从而获得一致性视图，保证数据的完整性

语法

加全局锁
```sql
flush tables with read lock;
```

数据库备份
```sh
mysqldump -uroot -p1234 itcast > itcast.sql
```

解锁
```sql
unlock tables;
```

特点

数据库中加全局锁，是一个比较重的操作，存在以下问题：
- 如果在主库上备份，数据不能更新，业务停摆
- 如果在从库上备份，从库不能执行主库同步过来的二进制日志(binlog)，主从延迟

在InnoDB引擎中，在备份时加上`--single-transaction`参数来完成不加锁的一致性数据备份
```sql
mysqldump --single-transaction -uroot -p1234 itcast > itcast.sql
```

## 表级锁

介绍

表级锁，每次操作锁住整张表

锁定粒度高，发生锁冲突的概率最高，并发度最低

对于表级锁，分为以下三类：
1. 表锁
2. 元数据锁（meta data lock, mdl）
3. 意向锁

### 表锁

对于表锁，分为两类：
1. 表共享读锁(read lock)
2. 表独占写锁(write lock)

语法
1. 加锁：lock tables 表名 read/write
2. 解锁：unlock tables / 断开客户端连接

表共享读锁：多个客户端可以进行数据读取，但不能写，加锁客户端也不能写

表独占写锁：只能是加锁的客户端连接，进行读，写

### 元数据锁

元数据锁加锁过程是系统自动控制的，无需显示使用，在访问一张表时会自动加上，元数据锁主要作用是维护表元数据的一致性，在表上有活动事务的时候，不可以对元数据进行写入操作

为了避免DML和DDL冲突，保证读写的正确性

MySQL5.5引入MDL 当对一张表进行增删查改时，加MDL读锁(共享)，当对表结构进行变更操作时，加DML写锁(排他)

| 对应SQL                                       | 锁类型                                | 说明                                           |
| --------------------------------------------- | ------------------------------------- | ---------------------------------------------- |
| lock tables 表名 read/write                   | shared_read_only/shared_no_read_write |                                                |
| select, select ... lock in share mode         | shared_read                           | 与shared_read,shared_write兼容,与exclusive互斥 |
| insert, update, delete, select ... for update | shared_write                          | 与shared_read,shared_write兼容,与exclusive互斥 |
| alter table ...                               | exclusive                             | 与其他的mdl互斥                                               |

### 意向锁

意向共享锁(IS)：与表锁共享锁(read)兼容，与表锁排他锁(write)互斥

意向排他锁(IX)：与表锁共享锁，表锁排他锁都互斥，意向锁之间不互斥

查看意向锁，及行锁的加锁情况
```sql
select object_schema,object_name,index_name,lock_type,lock_mode,lock_data from performance_schema.data_locks;
```

## 行级锁

介绍

行级锁，每次操作锁住对应的行数据

锁定粒度最小，发生锁冲突的概率最低，并发度最高

应用在InnoDB引擎中

InnoDB的数据是基于索引组织的，行锁是通过对索引上的索引项加锁来实现的，而不是对记录加锁，分为以下三类
1. 行锁(record lock)：锁定单个行记录的锁，防止其他事务对此行进行update和delete，在RC, RR隔离级别都支持
2. 间隙锁(gap lock)：锁定索引记录间隙(不含该记录)，确保索引记录间隙不变，防止其他事务在这个间隙insert，防止幻读，在RR隔离级别下支持
3. 临键锁(next-key lock)：行锁和间隙锁的组合，同时锁住数据，并锁住数据前面的间隙，在RR隔离级别下支持

###  行锁

Innodb实现以下两种类型的行锁：
1. 共享锁(S)：允许一个事务去读一行，防止其他事务获得相同数据集的排他锁
2. 排他锁(X)：允许获取排他锁的事务更新数据，防止其他事务获得相同数据集的共享锁和排他锁

| 当前锁类型\\请求锁类型 | S (共享锁) | X (排他锁) |
| ---------------------- | ---------- | ---------- |
| S (共享锁)             | 兼容       | 冲突       |
| X (排他锁)             | 冲突       | 冲突           |


| SQL                           | 行锁类型 | 说明                                |
| ----------------------------- | -------- | ----------------------------------- |
| insert                        | 排他锁   | 自动加锁                            |
| update                        | 排他锁   | 自动加锁                            |
| delete                        | 排他锁   | 自动加锁                            |
| select                        | 不加锁   |                                     |
| select ... lock in share mode | 共享锁   | 手动在selec之后加lock in share mode |
| select ... for update         | 排他锁   | 手动在select之后加for update                                |

默认情况下，InnoDB在repeatable read 事务隔离级别下运行，使用next-key lock进行搜索和索引扫描，以防止幻读

1. 针对唯一索引进行检索时，对已存在的记录进行等值匹配时，将自动优化为行锁
2. InnoDB的行锁是针对索引加的锁，不通过索引条件检索数据，InnoDB将对表中所有记录加锁，升级为表锁

###  间隙锁/临键锁

1. 索引上的等值查询(唯一索引)，给不存在的记录加锁时，优化为间隙锁
2. 索引上的等值查询(普通索引)，向右遍历时，最后一个值不满足查询需求时，next-key lock 退化为间隙锁
3. 索引上的范围查询(唯一索引)，会访问到不满足条件的第一个值为止

> 间隙锁的唯一目的是防止其他事务插入间隙
> 间隙锁可以共存，一个事务采用的间隙锁并不影响其他事务在同一间隙上加间隙锁

## InnoDB引擎

### 逻辑存储架构

![[Pasted image 20221203143330.png]]

#### 表空间

ibd文件

一个MySQL实例可以对应多个表空间，用于存储记录，索引等数据

#### 段

分为
- 数据段(Leaf node segment)
- 索引段(Non-leaf node segment)
- 回滚段(Rollback segment)

InnoDB是索引组织表，数据段就是B+树的叶子节点，索引段即为B+树的非叶子节点

#### 区

表空间的单元结构，每个区的大小的1M，默认情况下，InnoDB存储引擎页的大小的16k，即一个小有64个连续的页

#### 页

InnoDB存储引擎磁盘管理的最小单元，每个页的大小默认为16k，为了保证页的连续性，InnoDB存储引擎每次从磁盘申请4-5个区

#### 行

InnoDB存储引擎数据是按行进行存储的

trx_id: 每次对某条记录进行改动时，都会把对应事务id赋值给trx_id隐藏行

Roll_pointer: 每次对每条记录进行改动时，都会把旧的版本写入到undo日志中，然后这个隐藏列就相当于一个指针，可以通过它来找到修改前的数据

### 架构

![[Pasted image 20221203143341.png]]

#### 内存结构

Buffer Pool

缓冲池是主内存中的一个区域，里面可以缓存磁盘上经常操作的真实数据，在执行增删改查操作时，先操作缓冲池上的数据（若缓冲区没有，则从磁盘加载到缓冲池）然后再以一定频率刷新到磁盘，从而减少磁盘IO，加快处理速度

缓冲池以page为单位，底层采用链表数据结构管理Page，根据状态，Page分为三类
- free page: 空闲page，未被使用
- clean page: 已被使用page, 未被修改过
- dirty page: 已被使用page, 数据被修改过，缓冲池与磁盘中数据不一致

Change Buffer

更改缓冲区，（针对非唯一二级索引页）在执行DML语句时，如果这个数据page没有在Buffer Pool中，不会直接操作磁盘，而将数据存放在Change Buffer中，在未来数据被读取时，再将数据合并恢复到Buffer Pool中，再将合并后的数据合并到磁盘中

change buffer的意义：与聚集索引不同，二级索引通常是非唯一的，并且以相对随机的顺序插入二级索引，同样，删除和更新可能会影响，索引树中不相邻的二级索引页，如果每次都操作磁盘，会造成大量的磁盘IO，有了Change Buffer之后，我们可以在缓冲池中进行合并处理，减少磁盘IO

Adaptive Hash Index

自适应hash索引，用于优化对Buffer Pool数据的查询，

InnoDB存储引擎会监控对表上各项索引页的查询，如观察到hash索引可以提升速度，则建立hash索引，称之为自适应hash索引

系统自动完成

参数：adaptive_hash_index

Log Buffer

日志缓冲区用来保存写入到磁盘中的log日志数据，(redo log, undo log) 默认大小16M，日志缓冲区中的日志会定期刷新到磁盘中

如果需要更新，插入或删除许多行事务，增加日志缓冲区的大小可以节省磁盘IO

参数：

innodb_log_buffer_size: 缓冲区大小

innodb_flush_log_at_trx_commit: 日志刷新到磁盘时机
- 1-日志在每次事务提交时，写入并刷新到磁盘
- 0-每秒写入并刷新到磁盘
- 2-日志在每次事务提交后，写入并每秒刷新到磁盘一次

#### 磁盘结构

System Tablespace

	系统表空间是更改缓冲区的存储区域

	如果表是在系统表空间而不是在每个表文件或通用表空间中创建，它可能包含表和索引数据

	参数：innodb_data_file_path

File-Per-Table Tablespaces

	每个表的文件表空间包含单个InnoDB表的数据和索引，并存储在文件系统上的单个数据文件中

	参数：innodb_file_per_table

General Tablespace

	通用表空间，需要通过CREATE TABLESPACE语法创建通用表空间，在创建表时，可以指定该表空间
```sql
create tablespace xxx add
datafile 'file_name'
engine=engine_name
```

```sql
create table xxx tablespace ts_name;
```

Undo Tablespaces

	撤销表空间，MySQL实例在初始化时，会自动创建两个默认的undo表空间(初始大小16M，用于存储undo log日志

	Temporary Tablespaces

	InnoDB使用会话临时表空间，全局临时表空间，存储用户创建的临时表数据

Doublewrite Buffer Files

	双写缓冲区，InnoDB引擎将数据从Buffer Pool刷新到磁盘前，先将数据写入双写缓冲区文件中， 便于系统异常时恢复数据

Redo log

重做日志，用来实现事务的持久性，该日志文件由两部分组成，重做日志缓冲(redo log buffer)和重做日志文件(redo log)，前者在内存中，后者在磁盘中，当事务提交后会把所有修改信息存储存储到该日志中，用于刷新脏页到磁盘时，发生错误，进行数据恢复

#### 后台线程

Master Thread

	核心后台线程，负责调度其他线程，还负责将缓冲池中的数据异步刷新到磁盘中，保持数据的一致性，还包括脏页的刷新，合并插入缓存，undo页的回收

IO Thread

	在InnoDB引擎中大量使用AIO来处理IO请求，极大提高数据库的性能，

| 线程类型      | 默认个数 | 职责                       |
| ------------- | -------- | -------------------------- |
| Read Thread   | 4        | 负责读操作                 |
| Write Thread  | 4        | 负责写操作                 |
| Log Thread    | 1        | 负责将日志缓存区刷新到磁盘 |
| Insert Thread | 1        | 负责将写缓存区刷新到磁盘   |

Purge Thread

	主要用于回收事务已经提交的undo log，事务提交后，undo log 被这个线程回收

Page Cleaner Thread

协助 Master Thread 刷新脏页到磁盘中，减少Master Thread的工作压力，减少阻塞


### 事务原理

#### 事务

事务是一组操作的集合，它是一个不可分割的单位，事务会把所有操作作为一个整体向系统提交和撤销操作请求，这些操作要么同时成功，要么同时失败

#### 特性

原子性(Atomicity): 事务是不可分割的最小操作单元，要么同时成功，要么同时失败

一致性(Consistency): 事务完成时，必须使所有数据保持一致状态

隔离性(Isolation): 数据库系统提供的隔离机制，保证事务在不受外部并发操作的独立环境下运行

持久性(Durability): 事务一旦提交或回滚，它都数据库的数据的改变就是永久的

![[Pasted image 20221203143401.png]]
#### redo log

重做日志，记录的是事务提交时数据页的物理修改，是用来实现事务的持久性的

该日志文件由两部分组成，重做日志缓冲(redo log buffer)和重做日志文件(redo log file)，前者是在内存中，后者是在磁盘中

当事务提交之后会把所有修改信息都存到该日志文件中，用于在刷新脏页到磁盘，发生错误时，进行数据恢复

![[Pasted image 20221203143408.png]]

#### undo log

回滚日志，用于记录数据被修改前信息，作用包含两个：提供回滚，和MVCC(多版本并发控制)

undo log 和 redo log 记录物理日志不同，它是逻辑日志，当delete一条记录时，undo log加一条insert记录，update一条记录，undo log加一条相反的update记录，当回滚时，就可以从undo log 中的逻辑记录读取相应内容进行回滚

undo log销毁：undo log 在事务执行时产生，事务提交时，并不会立即删除undo log ,可能还用于MVCC

undo log存储：undo log采用段的方式进行管理和记录，存放丰rollback segment回滚段中，内部包含1024个undo log segment

### MVCC

#### 基本概念

##### 当前读

读取的是记录的最新版本，读取时还要保证其他并发事务不能修改当前记录，会对读取的记录进行加锁

select ... lock in share mode(共享锁)，select .... for update, update, insert, delete(排他锁)都是一种当前读

##### 快照读

简单的select(不加锁)就是快照读，快照读，读取的是记录数据的可见版本，可能是历史数据，不加锁，是非阻塞读

read committed: 每次select 都会生成一个快照读

repeatable read: 开启事务后，第一个select语句，才是快照读的地方

serializable: 快照读会退化为当前读

##### MVCC

Multi Version Concurrency Control 多版本并发控制

维护一个数据的多个版本，使得读写操作没有冲突，快照读为MySQL实现MVCC提供了一个非阻塞读功能

MVCC的实现主要依赖数据库记录中三个隐式字段，undo log，readView

#### 实现原理

##### 记录中的隐藏字段

| 隐藏字段    | 含义                                                                 |
| ----------- | -------------------------------------------------------------------- |
| DB_TRX_ID   | 最近修改事务ID, 记录插入这条记录或最后修改这条记录的事务ID           |
| DB_ROLL_PTR | 回滚指针，指向这条记录的上一个版本，用于配合undo log, 指向上一个版本 |
| DB_ROW_ID   | 隐藏主键，如果表结构没有指定主键，会生成隐藏主键                                                                     |

##### undo log

回滚日志，在insert, update, delete时产生便于数据回滚的日志

当insert时，产生的undo log 日志只在回滚时需要，事务提交后，可被立即删除

update, delete时，产生的undo log 日志不仅在回滚时需要， 快照读时也需要， 不会被立即删除

##### undo log 版本链

![[Pasted image 20221203143418.png]]

##### readview

readview(读视图)是快照读SQL执行时 MVCC提取数据的依据，记录并维护着当前活跃事务的(未提交的)id

readview包含四个字段

| 字段           | 含义                                |
| -------------- | ----------------------------------- |
| m_ids          | 当前活跃事务的id集合                |
| min_trx_id     | 最小活跃事务id                      |
| max_trx_id     | 预分配事务id，当前最大活跃事务id加1 |
| creator_trx_id | ReadView创建者的事务id                                    |

![[Pasted image 20221203143426.png]]

不同的隔离级别，生成的readview时机不同

read committed: 在事务每一次生成快照读时，生成readview

repeatable read: 仅在事务第一次执行快照读时，生成readview，后续复用该readview

## MySQL管理

### 系统数据库

| 数据库             | 含义                                                                          |
| ------------------ | ----------------------------------------------------------------------------- |
| mysql              | 存储MySQL服务器正常运行所需要的各种信息(时区、主从、用户、权限)               |
| information_schema | 提供了访问数据库元数据的各种表和视图，包含数据库，表，字段类型及访问权限等    |
| performance_schema | 为MySQL服务器运行时状态提供一个底层监控功能，主要用于收集数据库服务器性能参数 |
| sys                | 包含了一系列方便DBA和开发人员利用performance_schema性能数据库进行性能调优和诊断的视图                                                                              |


### 常用工具

#### mysql

mysql的客户端工具

语法
`mysql [options] [database]`

选项

-u: 指定用户名
-p: 指定密码
-h: 指定服务器ip或域名
-P: 指定端口
-e: 执行sql语句并退出

#### mysqladmin

执行管理操作的客户端程序，用来检查服务器配置，当前状态，创建并删除数据库

#### mysqlbinlog

由于服务器生成的二进制日志文件以二进制格式保存，查看，需要使用mysqlbinlog

语法
`mysqlbinlog [options] log-file`

选项

-d: 指定数据库名称，只列出指定数据库的相关操作
-o: 忽略掉日志中的前n行命令
-r: 将输出的文本格式日志输出到指定的文件中
-s: 显示简单格式
-v: 将行事件重构的SQL语句
-vv: 将行事件重构为SQL语句，并输出注释信息
--start-datatime=date1 --stop-datatime=date2 指定日期间隔内的所有日志
--start-position=pos1 --stop-position=pos2 指定位置间隔内的所有日志

#### mysqlshow

对象查找工具，用来很快查找存在哪些数据库，数据库中的表，表中的列或索引

语法
`mysqlshow [options] [db_name] [table_name] [col_name]`

选项

--count: 显示数据库及表的统计信息
-i: 显示指定数据库或表的状态信息

#### mysqldump

用来备份数据库或在不同数据库之间进行数据迁移，备份内容包含创建表，及插入表的sql语句

语法
`mysqldump [options] db_name [tables]`
`mysqldump [options] --database/-B db1 [db2 db3]`
`mysqldump [options] --all-database/-A`

连接选项

-u: 指定用户名
-p: 指定密码
-h: 指定服务器ip或域名
-P: 指定端口

输出选项

--add-drop-database: 在每个数据库创建语句之前加drop database语句
--add-drop-table: 在每个表创建语句之间加drop table语句，默认开启
-n: 不包含数据库的创建语句
-t: 不包含数据表的创建语句
-d: 不包含数据
-T: 自动生成两个文件，一个sql文件，创建表结构的语句，一个txt文件，数据文件

#### mysqlimport

数据导入工具，用来导入mysqldump 加 -T 后导出的文本文件

语法
`mysqlimport [options] db_name textfile1`

#### source

导入sql文件，使用mysql的source指令

语法
`source xxx.sql`

