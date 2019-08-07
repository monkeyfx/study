SQL的分析与调优方法
MYSQL存储引擎
MYSQL实时监控
MYSQL集群监控方案
MYSQL性能测试的用例准备
使用Jmeter开发MYSQL性能测试脚本
执行测试

MariaDB is free and open source software

MYSQL数据库重点指标

QPS
queries per seconds 每秒钟查询数量
show global status like 'Queries%'
Queries/seconds

TPS

Transction per seconds
TPS = (Com_commit + Com_rollback)/seconds

show global status like "Com_commit";
show global status like 'Com_rollback'


线程连接数
show global status like "max_used_connections";
show global status like 'Threads%'


最大连接数
show variables like 'max_connections'

Query Cache

查询缓存用于缓存select查询结果
当下次接收到相同查询请求时，不再执行实际查询处理而直接返回结果

适用于大量查询，很少改变表中数据


修改my.cnf

将query_cache_size设置为具体的大小，具体大小是多少取决于查询的实际情况，
但最好设置为1024的倍数，参考值为32M



增加一行:query_cache_type = 0/1/2


如果设置为1，将会缓存所有的结果，除非你的select语句适用SQL_NO_CACHE禁用了查询缓存

如果设置为2，则只缓存在select语句中通过SQL_CACHE 指定需要查询的查询


Query Cache命中率

show status like 'Qcache%';
Query_cache_hits =(Qcache_hits/(Qcache_hist+Qcache_inserts))*100%


锁定状态
show global status like '%lock%';
Table_locks_waited/Table_locks_immediate 值越大代表表锁造成的阻塞越严重
Innodb_row_lock_waits innodb行锁 太大可能是间隙锁造成


主从延时
查询主从延迟时间：show slave status


MySQl 慢查询

执行速度超过定义的时间点查询
不同的系统定义不同的慢查询指标

慢查询开启

/etc/my.cnf 在【mysqld】中添加

开启慢查询：slow_query_log = 1


慢查询日志路径：slow_query_log_file = /data/mysql/slow.log

慢查询的时长：long_query_time = 1

未使用索引的查询也被记录到慢查询日志中


log_queries_not_using_indexes = 1 


mysqldumpslow 命令

-s 是表示按照何种方式排序

-t 是top n的意思 ，即为返回前面多少条的数据

-g 后边可以写一个正则匹配模式，大小写不敏感的

-s 更多参数
	c:访问计数
	l:锁定时间
	r:返回记录
	t:查询时间
	al:平均锁定时间
	ar:平均返回记录数
	at:平均查询时间


得到返回记录集最多的10个SQL
mysqldumpslow -s r -t 10 slow.log

得到访问次数最多的10个SQL
msyqldumpslow -s c -t 10 slow.sql


得到按照时间排序的前10条里面含油左链接的查询语句

mysqldumpslow -s t -t 10 -g "left join" slow.log




SQL语句性能分析


explain


explain select * from user;

mysql> explain select * from sales_order limit 10;
+----+-------------+-------------+------------+------+---------------+------+---------+------+--------+----------+-------+
| id | select_type | table       | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra |
+----+-------------+-------------+------------+------+---------------+------+---------+------+--------+----------+-------+
|  1 | SIMPLE      | sales_order | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 220933 |   100.00 | NULL  |
+----+-------------+-------------+------------+------+---------------+------+---------+------+--------+----------+-------+


id:

select 识别符，代表语句的执行顺序，一般在select嵌套查询时会不同，
id 列数字越大越先执行，如果说数字一样大，那么就从上往下依次执行
id列为null的就表示这是一个结果集，不需要使用它来进行查询。



select_type：


SIMPLE :表示不需要union操作或者不包括子查询的简单select查询，有连接查询时，外层的查询
为simple，且只有一个

union : union连接的两个select查询，第一个是dervied派生表，除来第一个表外，第二个以后的表
select_type 都是union

dependent union ：与union一样，出现union或union all语句中，但是这个查询要受到
外部查询的影响

union result:包括union的结果集，在union 和




类型

主键索引

它是一种特殊的唯一索引，不允许有空值
一般是在建表的时候同时创建主键索引


唯一索引

索引列的值必须唯一，但允许有空值


普通索引
最基本的索引，它没有任何限制


全文索引

fulltext 只适用MyISAM
被索引只有 char、varchar、text

组合索引

也叫所列索引，就是在多列上同时创建索引，使得多列的组合值唯一，创建组合索引的好处
是比分别创建多个单列索引的查询速度要快很多。

组合索引创建遵循 “最左前缀” 规则

如三列：id、name、age创建组合索引，则相当于分别创建了
id、name、age、
id、name
id
这三个索引


索引创建规范
索引是一把双刃剑，它可以提高查询效率但也会降低插入和更新的速度并占用磁盘空间
在插入与更新数据时，要重写索引文件


单张表中索引数量不超过5个

单个索引中的字段数不能操作5个
不适用更新频繁地列作为主键

合理创建组合索引（ 避免冗余）

不在低基数列上建立索引，sex

不在索引列进行数学运算和函数运算，会使索引失效

不实用%前导的查询，如like ‘%xxx’ 无法使用索引

不使用反向查询，如 not in / not like ，无法使用索引，导致全表扫描

选择越小的数据类型越好，因为通常越小的数据类型通常在磁盘、内存、cpu、缓存中 


在经常需要排序（order by），分组（group by） 和distinct 列上加索引（单独order by 用不了需索引），
索引考虑加where 或加limit

或表与表的而连接条件上加上索引，可以加快连接查询的速度


使用短索引，如果你的一个字段是chart(32) 或者int（32），在创建索引的时候指定前缀长度，比如前10个字符（前提是多数值是唯一的） 那么短索引可以提高查询速度，或可以减少I/O速度



MySql 存储引擎

MyISAM

优点
读的性能比InnoDB高很多
索引文件、数据文件分开

缺点
不支持事务
写入数据时、直接锁表（全表锁 不支持行锁）

A -100 中断

B +100

不支持回滚

InnoDB

优点
支持事务
支持外键
支持行级锁

缺点
不支持fulltext 索引（全文索引）
行级锁并不绝对，当不确定扫描范围时，锁全表




























































































































































