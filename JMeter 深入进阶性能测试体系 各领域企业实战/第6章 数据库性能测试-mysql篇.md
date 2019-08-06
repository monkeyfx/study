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











































































































