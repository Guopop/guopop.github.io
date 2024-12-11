---
outline: deep
---

# MySQL 基础
## MySQL 概述

| 名称      | 全称                              | 简称                               |
|---------|---------------------------------|----------------------------------|
| 数据库     | 存储数据的仓库，数据是有组织进行存储的             | DataBase(DB)                     |
| 数据库管理系统 | 操纵和管理数据库的大型软件                   | Database Management System(DBMS) |
| SQL     | 操作关系型数据库的编程语言，定义了一套操作关系型数据库统一标准 | Structured Query Language(SQL)   |

## SQL

### SQL分类

| 分类  | 全称                         | 说明                         |
|-----|----------------------------|----------------------------|
| DDL | Data Definition Language   | 数据定义语言，用来定义数据库对象（数据库，表，字段） |
| DML | Data Manipulation Language | 数据操作语言，用来对数据库表中的数据进行增删改    |
| DQL | Data Query Language        | 数据查询语言，用来查询数据库中表的记录        |
| DCL | Data Control Language      | 数据控制语言，用来创建数据库用户，控制数据库的    |                                                    |

### DDL

#### 数据库操作

查询

查询所有数据库

```sql
show databases;
```

查询当前数据库

```sql
select database();
```

创建

```sql
create database [if not exists] 数据库名 [default charset 字符集] [collate 排序规则];
```

删除

```sql
drop database [if exists] 数据库名;
```

使用

```sql
use 数据库名;
```

练习

```sql
show databases;

select database();

create database itcast;

drop database itcast;

use itcast;
```

#### 表操作

##### 数据类型

数值类型

| 类型        | 大小      | 有符号(SIGNED)范围                            | 无符号(UNSIGNED)范围                        | 描述         |
|-----------|---------|------------------------------------------|----------------------------------------|------------|
| TINYINT   | 1 byte  | (-128, 127)                              | (0, 255)                               | 小整数值       |
| SMALLINT  | 2 bytes | (-32768, 32767)                          | (0, 65535)                             | 大整数值       |
| MEDIUMINT | 3 bytes | (-8388608, 8388607)                      | (0, 16777215)                          | 大整数值       |
| INT       | 4 bytes | (-2147483648, 2147483647)                | (0, 4294967295)                        | 大整数值       |
| BIGINT    | 8 bytes | ($-2^{63}$, $2^{63}-1$)                  | (0, $2^{64}-1$)                        | 极大整数值      |
| FLOAT     | 4 bytes | (-3.402823466 E+38, 3.402823466351 E+38) | 0和(1.175494351 E-38, 3.402823466 E+38) | 单精度浮点数值    |
| DOUBLE    | 8 bytes |                                          |                                        | 双精度浮点数值    |
| DECIMAL   |         |                                          |                                        | 小数值(精确定点数) |

字符串类型

| 类型         | 大小                 | 描述              |
|------------|--------------------|-----------------|
| CHAR       | 0-255 bytes        | 定长字符串           |
| VARCHAR    | 0-65535 bytes      | 变长字符串           |
| TINYBLOB   | 0-255 bytes        | 不超过255个字符的二进制数据 |
| TINYTEXT   | 0-255 bytes        | 短文本字符串          |
| BLOB       | 0-65535 bytes      | 二进制形式的长文本数据     |
| TEXT       | 0-65535 bytes      | 长文本数据           |
| MEDIUMBLOB | 0-16777215 bytes   | 二进制形式的中等长度文本数据  |
| MEDIUMTEXT | 0-16777215 bytes   | 中等长度的文本数据       |
| LONGBLOB   | 0-4294967295 bytes | 二进制形式的极长文本数据    |
| LONGTEXT   | 0-4294967295 bytes | 极长文本数据          |

日期时间类型

| 类型        | 大小 | 范围                                        | 格式                  | 描述    |
|-----------|----|-------------------------------------------|---------------------|-------|
| DATE      | 3  | 1000-01-01 至 9999-12-31                   | YYYY-MM-DD          | 日期值   |
| TIME      | 3  | -838:59:59 至 838:59:59                    | HH:mm:SS            | 时间值   |
| YEAR      | 1  | 1901 至 2155                               | YYYY                | 年份值   |
| DATETIME  | 8  | 1000-01-01 00:00:00 至 9999-12-31 23:59:59 | YYYY-MM-DD HH:mm:SS | 日期时间值 |
| TIMESTAMP | 4  | 1970-01-01 00:00:00 至 2038-01-19 03:14:07 | YYYY-MM-DD HH:mm:SS | 时间戳   |

```sql
create table emp(
	id int comment '编号',
	workno varchar(10) comment '工号',
	name varchar(10) comment '姓名',
	gender char(1) comment '性别',
	age tinyint unsigned comment '年龄',
	idcard char(18) comment '身份证',
	entrydate date comment '入职日期'
) comment '员工表';
```

##### 查询

查询当前数据库所有表

```sql
show tables;
```

查询表结构

```sql
desc 表名;
```

查询指定表的建表语句

```sql
show create table 表名;
```

##### 创建

```sql
create table 表名(
	字段1 字段1类型 [comment 字段1注释],
	字段2 字段2类型 [comment 字段2注释]
)[comment 表注释];
```

练习

```sql
create table tb_user (
    id int comment '编号',
    name varchar(10) comment '姓名',
    age int comment '年龄',
    gender varchar(1) comment '性别'
);

show tables;

desc tb_user;

show create table tb_user;
```

##### 修改

添加字段

```sql
alter table 表名 add 字段名 数据类型(长度) [comment 注释] [约束];
```

修改数据类型

```sql
alter table 表名 modify 字段名 新数据类型(长度);
```

修改字段名和字段类型

```sql
alter table 表名 change 旧字段名 新字段名 类型(长度) [comment 注释] [约束];
```

删除字段

```sql
alter table 表名 drop 字段名;
```

修改表名

```sql
alter table 表名 rename to 新表名;
```

练习

```sql
show tables;

desc tb_user;

show create table tb_user;

alter table tb_user add nickname varchar(20) comment '昵称';

alter table tb_user modify gender tinyint(2);

alter table tb_user change nickname nname varchar(30) comment '小名';

alter table tb_user drop nname;

alter table tb_user rename to t_user;
```

##### 删除

删除表

```sql
drop table [if exists] 表名;
```

删除指定表，并重新创建该表

```sql
truncate table 表名;
```

练习

```sql
drop table t_user;

truncate table tb_user;
```

### DML

#### 添加数据

给指定字段添加数据

```sql
insert into 表名 (字段1, 字段2, ...) values(值1, 值2, ...);
```

给全部字段添加数据

```sql
insert into 表名 values(值1, 值2, ...);
```

批量添加数据

```sql
insert into 表名 (字段1, 字段2, ...) values(值1, 值2, ...), (值1, 值2, ...);

insert into 表名 values(值1, 值2, ...), (值1, 值2, ...);
```

练习

```sql
create table employee (
    id int comment '编号',
    workno varchar(10) comment '工号',
    name varchar(10) comment '姓名',
    gender char(1) comment '性别',
    age tinyint unsigned comment '年龄',
    idcard char(18) comment '身份证号',
    entrydate date comment '入职日期'
);

insert into employee (id, workno, name, gender, age, idcard, entrydate) values (1, '00001', 'guopop', '男', 28, '012345678901234567', '2022-10-10');


insert into employee (id, workno, name, gender, age, idcard, entrydate) values 
    (2, '00002', 'aaa', '男', 28, '012345678901234567', '2022-10-10'),
    (3, '00003', 'bbb', '男', 28, '012345678901234567', '2022-10-10');
```

#### 修改数据

```sql
update 表名 set 字段名1=值1, 字段名2=值2, ... [where 条件];
```

练习

```sql
update employee set name = 'ccc' where id = 1;
```

#### 删除数据

```sql
delete from 表名 [where 条件];
```

练习

```sql
delete from employee where id = 3;
```

### DQL

语法

```sql
select
	字段列表
from
	表名列表
where
	条件列表
group by 
	分组字段列表
having
	分组后条件列表
order by 
	排序字段列表
limit
	分页参数
```

#### 基本查询

查询多个字段

```sql
select 字段1, 字段2, ... from 表名;

select * from 表名;
```

设置别名

```sql
select 字段1 [as 别名1], 字段2 [as 别名2], ... from 表名;
```

去除重复记录

```sql
select distinct 字段列表 from 表名;
```

练习

```sql
create table emp (
    id int comment '编号',
    workno varchar(10) comment '工号',
    name varchar(10) comment '姓名',
    gender char(1) comment '性别',
    age tinyint unsigned comment '年龄',
    idcard char(18) comment '身份证号',
    workaddress varchar(50) comment '工作地址',
    entrydate date comment '入职日期'
);

insert into emp (id, workno, name, gender, age, idcard, workaddress, entrydate) values
    (1, '1', '柳岩', '女', 20, '123456789012345678', '北京', '2000-01-01'),
    (2, '2', '张无忌', '男', 18, '123456789012345678', '北京', '2005-09-01'),
    (3, '3', '韦一笑', '男', 38, '123456789012345678', '上海', '2005-08-01'),
    (4, '4', '赵敏', '女', 18, '123456789012345678', '北京', '2009-12-01'),
    (5, '5', '小昭', '女', 16, '123456789012345678', '上海', '2007-07-01'),
    (6, '6', '杨逍', '男', 28, '123456789012345678', '北京', '2006-01-01'),
    (7, '7', '范瑶', '男', 40, '123456789012345678', '北京', '2005-05-01'),
    (8, '8', '黛绮丝', '女', 38, '123456789012345678', '天津', '2015-05-01'),
    (9, '9', '范凉凉', '女', 45, '123456789012345678', '北京', '2010-04-01'),
    (10, '10', '陈友谅', '男', 53, '123456789012345678', '北京', '2010-04-01'),
    (11, '11', '张士诚', '男', 55, '123456789012345678', '苏州', '2015-05-01'),
    (12, '12', '常遇春', '男', 32, '123456789012345678', '北京', '2004-02-01'),
    (13, '13', '张三丰', '男', 88, '123456789012345678', '苏州', '2020-11-01'),
    (14, '14', '灭绝', '女', 65, '123456789012345678', '西安', '2019-05-01'),
    (15, '15', '胡青牛', '男', 70, '123456789012345678', '西安', '2018-04-01'),
    (16, '16', '周芷若', '女', 18, null, '北京', '2012-06-01')
    ;

select name, workno, age from emp;

select * from emp;

select workaddress wa from emp;

select distinct workaddress from emp;

```

#### 条件查询

语法

```sql
select 字段列表 from 表名 where 条件列表;
```

条件

| 比较运算符                 | 功能                        |
|-----------------------|---------------------------|
| `>`                   | 大于                        |
| `>=`                  | 大于等于                      |
| `<`                   | 小于                        |
| `<=`                  | 小于等于                      |
| `=`                   | 等于                        |
| `<>` 或 `!=`           | 不等于                       |
| `between ... and ...` | 在某个范围之内(含最小，最大值)          |
| `in(...)`             | 在in之后的列表中的值，多选一           |
| `like` 占位符            | 模糊匹配(`_`匹配单个字符，`%`匹配任意字符) |
| `is null`             | 是NULL                     |

| 逻辑运算符      | 功能           |
|------------|--------------|
| and 或 `&&` | 并且(多个条件同时成立) |
| or 或 `     |              |`  | 或者(多个条件任意一个成立) |
| not 或 `!`  | 非，不是         |

练习

```sql
select * from emp where age = 88;

select * from emp where age < 20;

select * from emp where age <= 20;

select * from emp where idcard is null;

select * from emp where idcard is not null;

select * from emp where age <> 88;

select * from emp where age != 88;

select * from emp where age >= 15 and age <= 20;

select * from emp where age between 15 and 20;

select * from emp where gender = '女' and age < 25;

select * from emp where age = 18 or age = 20 or age = 40;

select * from emp where age in (18, 20, 40);

select * from emp where name like '__';

select * from emp where idcard like '%X';
```

#### 聚合函数

将一列数据作为一个整体，进行纵向计算

常见聚合函数

| 函数    | 功能   |
|-------|------|
| count | 统计数量 |
| max   | 最大值  |
| min   | 最小值  |
| avg   | 平均值  |
| sum   | 求和   |

语法

```sql
select 聚合函数(字段列表) from 表名;
```

> null值不参与所有聚合函数计算

练习

```sql
select count(*) from emp;

select avg(age) from emp;

select max(age) from emp;

select min(age) from emp;

select sum(age) from emp where workaddress = '西安';
```

#### 分组查询

语法

```sql
select 字段列表 from 表名 [where 条件] group by 分组字段名 [having 分组后过滤条件];
```

where和having区别

- 执行时机不同：where是分组之前进行过滤，不满足where条件，不参与分组；having是分组之后进行过滤
- 判断条件不同：where不能对聚合函数进行判断，having可以

> 执行顺序：where > 聚合函数 > having
> 分组之后，查询的字段一般为聚合函数和分组字段，其他字段无意义

练习

```sql
select gender, count(*) from emp group by gender;

select gender, avg(age) from emp group by gender;

select workaddress, count(*) c from emp where age < 45 group by workaddress having c >= 3;
```

#### 排序查询

语法

```sql
select 字段列表 from 表名 order by 字段1 排序方式1, 字段2 排序方式2;
```

排序方式

- asc 升序(默认)
- desc 降序

> 多字段排序，第一个字段相同，才会根据第二个字段排序

练习

```sql
select * from emp order by age;

select * from emp order by entrydate desc;

select * from emp order by age asc, entrydate desc;
```

#### 分页查询

语法

```sql
select 字段列表 from 表名 limit 起始索引, 查询记录数;
```

> 起始索引从0开始，起始索引 = (查询页码 - 1) * 查询记录数
> 分页查询是数据库的方言，不同数据库有不同的实现
> 查询第一页，起始索引可以省略

练习

```sql
select * from emp limit 0,10;

select * from emp limit 10,10;
```

#### 案例练习

```sql
select * from emp where gender = '女' and age in (20, 21, 22, 23);

select * from emp where gender = '男' and age between 20 and 40 and name like '___';

select gender, count(*) from emp where age < 60 group by gender;

select name, age from emp where age <= 35 order by age asc, entrydate desc;

select * from emp where gender = '男' and age between 20 and 40 order by age asc, entrydate desc limit 5;
```

#### 执行顺序

### DCL

#### 用户管理

查询用户

```sql
use mysql;
select * from user;
```

创建用户

```sql
create user '用户名'@'主机名' identified by '密码';
```

修改用户密码

```sql
alter user '用户名'@'主机名' identified with mysql_native_password by '新密码';
```

删除用户

```sql
drop user '用户名'@'主机名';
```

> %匹配任意主机名

练习

```sql
select * from user;

create user 'itcast'@'localhost' identified by '123456';

create user 'heima'@'%' identified by '123456';

alter user 'heima'@'%' identified with mysql_native_password by '1234';

drop user 'heima'@'%';
```

#### 权限控制

| 权限                  | 说明         |
|---------------------|------------|
| ALL, ALL PRIVILEGES | 所有权限       |
| SELECT              | 查询数据       |
| INSERT              | 插入数据       |
| UPDATE              | 修改数据       |
| DELETE              | 删除数据       |
| ALTER               | 修改表        |
| DROP                | 删除数据库/表/视图 |
| CREATE              | 创建数据库/表    |

查询权限

```sql
show grants for '用户名'@'主机名';
```

授予权限

```sql
grant 权限列表 on 数据库名.表名 to '用户名'@'主机名';
```

撤销权限

```sql
revoke 权限列表 on 数据库名.表名 from '用户名'@'主机名';
```

练习

```sql
show grants for 'itcast'@'localhost';

grant all on itcast.* to 'itcast'@'localhost';

revoke all on itcast.* from 'itcast'@'localhost';
```

## 函数

### 字符串函数

| 函数                     | 功能                            |
|------------------------|-------------------------------|
| concat(s1, s2, ... sn) | 字符串拼接，将s1, s2, ... sn拼接成一个字符串 |
| lower(s)               | 将字符串s转换为小写                    |
| upper(s)               | 将字符串s转换为大写                    |
| lpad(s, n, p)          | 左填充，用字符串p对s进行左填充，直达n个字符       |
| rpad(s, n, p)          | 右填充，用字符串p对s进行右填充，直达n个字符       |
| trim(s)                | 对字符串s去掉头部和尾部空格                |
| substring(s, n, l)     | 截取字符串s从n起l个长度的位置              |

练习

```sql
select concat('hello', ', mysql');

select lower("MySQL");

select upper("MySQL");

select lpad('01', 5 , '-');

select rpad('01', 5, '-');

select trim(' hello mysql.   ');

select subString('hellomysql', 1, 5);
```

### 数值函数

| 函数         | 功能            |
|------------|---------------|
| ceil(x)    | 向上取整          |
| floor(x)   | 向下取整          |
| mod(x,y)   | 返回x/y的模       |
| rand()     | 返回0-1之间的随机数   |
| round(x,y) | 对x四舍五入，保留y个小数 |

练习

```sql
select ceil(19.5);

select floor(19.5);

select mod(6,5);

select rand();

select round(3.14159, 3);
```

### 日期函数

| 函数                                 | 功能                                                                   |
|------------------------------------|----------------------------------------------------------------------|
| curdate()                          | 当前日期                                                                 |
| curtime()                          | 当前时间                                                                 |
| now()                              | 当前日期时间                                                               |
| year(date)                         | 指定date年份                                                             |
| month(date)                        | 指定date月份                                                             |
| day(date)                          | 指定date日期                                                             |
| date_add(date, interval expr type) | 一个日期/时间值，加上一个时间间隔expr, expr类型 year, month, day, hour, minute, second |
| datediff(date1, date2)             | date1到date2之间的天数                                                     |

练习

```sql
select curdate();

select curtime();

select now();

select year(now());

select month(now());

select day(now());

select date_add(now(), interval 5 day);

select datediff(now(), date_add(now(), interval -1 MONTH));
```

### 流程函数

| 函数                                                     | 功能                             |
|--------------------------------------------------------|--------------------------------|
| if(b, t, f)                                            | 如果b为true，返回t，否则返回f             |
| ifnull(v1, v2)                                         | 如果v1不为null, 返回v1, 否则返回v2       |
| case when [v1] then [s1] ... else [default] end        | 如果v1为true，返回s1，。。。否则返回default  |
| case [expr] when [v1] then [s1] ... else [default] end | 如果expr等于v1，返回s1，。。。否则返回default |

练习

```sql
select ifnull('a', 'b');

select ifnull(null,'b');

select 
name,
case workaddress when '北京' then '一线城市' when '上海'  then '一线城市' else '其他' end
from emp;

select
id,
name,
(case when math >= 85 then '优秀' when math >= 60 then '及格' else '不及格' end) '数学',
(case when english >= 85 then '优秀' when english >= 60 then '及格' else '不及格' end) '数学',
(case when chinese >= 85 then '优秀' when chinese >= 60 then '及格' else '不及格' end) '数学'
from 
score;
```

## 约束

### 概述

概念：约束是作用于表中字段上的规则，用于限制存储在表中的数据

目的：保证数据库中数据的正确性，有效性，完整性

分类

| 约束   | 描述                         | 关键字         |
|------|----------------------------|-------------|
| 非空约束 | 限制该字段的数据数据不能为null          | not null    |
| 唯一约束 | 保证该字段的所有数据都唯一，不重复          | unique      |
| 主键约束 | 主键是一行数据的唯一标识，非空且唯一         | primary key |
| 默认约束 | 保存数据时，如果未指定该字段的值，则使用默认值    | default     |
| 检查约束 | 保证字段值满足某个条件                | check       |
| 外键约束 | 用来让两张表的数据建立连接，保证数据的一致性，完整性 | foreign key |

> 约束是作用于表中字段上的，可以在创建表或修改表时添加约束

### 约束演示

```sql
create table user (
    id int primary key AUTO_INCREMENT comment '主键',
    name varchar(10) not null UNIQUE comment '姓名',
    age int check (age > 0 && age <= 120) comment '年龄',
    status char(1) default '1' comment '状态',
    gender char(1) comment '性别'

) COMMENT '用户表';

insert into user (name, age, status, gender) values 
    ('tom1', 19, '1', '男'),
    ('tom2', 20, '1', '男')
;

insert into user (name, age, status, gender) values 
    (null, 20, '1', '男')
;

insert into user (name, age, status, gender) values 
    ('tom2', 20, '1', '男')
;

insert into user (name, age, status, gender) values 
    ('tom3', 0, '1', '男')
;

insert into user (name, age, gender) values 
    ('tom4', 120, '男')
;
```

### 外键约束

语法

添加外键

```sql
create table 表名 (
	字段名 类型
	...
	[constraint] [外键名称] foreign key (外键字段名) references 主表(主表字段名)
);
```

```sql
alter table 表名 add constraint 外键名称 foreign key (外键字段名) references 主表(主表字段名);
```

删除外键

```sql
alter table 表名 drop foreign key 外键名称;
```

删除/更新行为

| 行为          | 说明                                                         |
|-------------|------------------------------------------------------------|
| no action   | 当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有，则不允许删除/更新               |
| restrict    | 当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有，则不允许删除/更新               |
| cascade     | 当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有，则删除/更新外键子表中的记录          |
| set null    | 当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有，则设置外键为null (要求外键可以null) |
| set default | 父表有变更时，外键设置为默认值(Innodb不支持)                                 | 

```sql
alter table 表名 add constraint 外键名称 foreign key (外键字段名) references 主表(主表字段名) on update cascade on delete cascade;
```

练习

```sql
alter table emp drop foreign key fk_emp_dept_id;

alter table emp add constraint fk_emp_dept_id foreign key (dept_id) references dept(id);
```

## 多表查询

### 多表关系

#### 概述

项目开发中，在进行数据库表结构设计时，会根据业务需求和业务模块之间的关系，分析并设计表结构，由于业务之间相互关联，所以各个表结构之间也存在着各种关系，基本分为三种

#### 一对多(多对一)

案例：员工与部门

关系：一个部门有多个员工，一个员工属于一个部门

实现：在多的一方建立外键，指向一的一方的主键

#### 多对多

案例：学生与课程的关系

关系：一个学生可以选修多门课程，一门课程可以被多个学生选修

实现： 建立第三方中间表，中间表至少包含两个外键，分别关联两方主键

#### 一对一

案例：用户与用户详情的关系

关系：一对一关系，单表拆分，基础字段放在一张表，额外字段放在另一张表

实现：在任意一方加入外键，关联另一方的主键，并设置外键为unique

### 多表查询概述

定义：从多张表中查询数据

笛卡尔积：两个集合之间所有的组合情况

多表查询时需要消除无效的笛卡尔积

分类：

### 内连接

查询两个表交集部分

语法：

隐式内连接：

```sql
select 字段列表 from 表1, 表2 where 条件...;
```

显式内连接：

```sql
select 字段列表 from 表1 inner join 表2 on 连接条件...;
```

练习

```sql
select e.*, d.* from emp e, dept d where e.dept_id = d.id;

select e.*, d.* from emp e inner join dept d on e.dept_id = d.id;
```

### 外连接

左外连接：查询左表数据，以及两张表交集的数据

右外连接：查询右表数据，以及两张表交集的数据

语法：

左外连接：

```sql
select 字段列表 from 表1 left [outer] join 表2 on 条件...;
```

右外连接：

```sql
select 字段列表 from 表1 right [outer] join 表2 on 条件...;
```

练习

```sql
select e.*, d.* from emp e left join dept d on e.dept_id = d.id;
```

### 自连接

当前表与自身的连接查询，必须使用别名

语法

```sql
select 字段列表 from 表A 别名A join 表A 别名B on 条件...;
```

可以使用内连接，也可以使用外连接

练习

```sql
select a.name, b.name from emp a, emp b where a.managerid = b.id; 
```

### 联合查询

对多次查询结果进行合并，形成一个新的查询集

语法

```sql
select 字段列表 from 表A ...
union [all]
select 字段列表 from 表B ...;
```

联合查询的字段列表必须保持一致，包括类型

union all 全部合并不去重

union 去重

练习

```sql
select * from emp where salary < 15000
union
select * from emp where age >20;
```

### 子查询

定义：SQL语句中嵌套select语句

语法

```sql
select * from t1 where column1 = (select column1 from t2);
```

子查询的外部语句可以是insert/update/delete/select

#### 标量子查询

子查询的返回结果是单个值，可以是日期，数值，字符串

常用操作符：`=`  `<>` `>` `>=` `<` `<=`

练习

```sql
select * from emp e where e.dept_id = (select id from dept d where d.name = '研发部');
```

#### 列子查询

子查询返回的结果是一列(多行)

常用操作符

| 操作符    | 描述             |
|--------|----------------|
| in     | 指定集合范围之内，多选一   |
| not in | 与in相反          |
| any    | 子查询返回结果有一个满足即可 |
| some   | 等同于any         |
| all    | 子查询返回结果必须全部满足  |

练习

```sql
select * from emp e where e.dept_id in (select id from dept d where d.name = '研发部' or d.name = '财务部');
```

#### 行子查询

子查询返回的是一行(多列)

常用操作符：`=` 、`<>`、 `in`、 `not in`

练习

```sql
select * from emp e where (salary,managerid) = (select salary, managerid from emp where name = '赵敏');
```

#### 表子查询

子查询返回的是多行多列

常用操作符： `in`

练习

```sql
select * from emp e where (salary,managerid) in (select salary, managerid from emp where name = '赵敏' or name = '张无忌');
```

### 多表查询案例

## 事务

定义：事务是一组操作的集合，不可分割，事务会把所有操作作为一个整体向系统提交或撤销请求，这些操作要么同时成功，要么同时失败

MySQL的事务是自动提交的，执行一条DML语句，自动提交

### 事务操作

查看/设置事务提交方式

```sql
select @@autocommit;
set @@autocommit=0;
```

开启事务

```sql
start transaction;
```

提交事务

```sql
commit;
```

回滚事务

```sql
rollback;
```

练习

```sql
create table account (
    id int auto_increment primary key comment '主键id',
    name varchar(10) comment '姓名',
    money int comment '余额'
) comment '账户表';

insert into account (name, money) values('张三',2000), ('李四',2000);

update account set money = 2000 where name = '张三' or name = '李四';

start transaction;

select * from account where name = '张三';

update account set money = money - 1000 where name = '张三';


update account set money = money + 1000 where name = '李四';

select @@autocommit;

set @@autocommit=0;
```

### 事务的四大特性

原子性：(Atomicity) 事务是不可分割的最小单元，要么全部成功，要么全部失败

一致性：(Consistency) 事务完成时，必须使所有数据都保持一致状态

隔离性：(Isolation) 数据库系统提供的隔离机制，保证事务在不受外部并发操作影响的独立环境下运行

持久性：(Durability) 事务一旦提交或回滚，对数据库的数据的改变是永久的

### 并发事务问题

| 问题    | 描述                                                 |
|-------|----------------------------------------------------|
| 脏读    | 一个事务读到另一个事务还没提交的数据                                 |
| 不可重复读 | 一个事务先后读取同一条记录，但两次读取的数据不同                           |
| 幻读    | 一个事务按照条件查询数据时，没有对应的数据行，但在插入数据时，又发现这行数据已经存在，好像出现了幻影 |

### 事务隔离级别

| 隔离级别             | 脏读 | 不可重复读 | 幻读 |
|------------------|----|-------|----|
| read uncommitted | y  | y     | y  |
| read committed   | n  | y     | y  |
| repeatable read  | n  | n     | y  |
| serializable     | n  | n     | n  |

mysql 默认 repeatable read

查看事务隔离级别

```sql
select @@transaction_isolation;
```

设置事务隔离级别

```sql
set [session|global] transaction isolation level [read uncommitted|read committed|repeatable read|serializable]
```

事务隔离级别越高，数据越安全，性能越低

