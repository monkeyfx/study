
一、安装Percona数据库
1. 离线安装Percona
进入RPM安装文件目录，执行下面的脚本
yum localinstall *.rpm
管理MySQL服务

systemctl start mysqld
systemctl stop mysqld
systemctl restart mysqld

2. 在线安装Percona

使用yum命令安装
yum install http://www.percona.com/downloads/percona-release/redhat/0.1-3/percona-release-0.1-3.noarch.rpm
yum  install  Percona-Server-server-57

管理MySQL服务
service mysql start
service mysql stop
service mysql restart

3. 开放防火墙端口

firewall-cmd --zone=public --add-port=3306/tcp --permanent
firewall-cmd --reload

4. 修改MySQL配置文件
vi /etc/my.cnf

[mysqld]
character_set_server = utf8
bind-address = 0.0.0.0
#跳过DNS解析
skip-name-resolve

service mysql restart 

5. 禁止开机启动MySQL

chkconfig mysqld off

6. 初始化MySQL数据库
查看MySQL初始密码
cat /var/log/mysqld.log | grep "A temporary password"
修改MySQL密码

mysql_secure_installation

创建远程管理员账户
mysql -u root -p

CREATE USER 'admin'@'%' IDENTIFIED BY 'Abc_123456';
GRANT all privileges ON *.* TO 'admin'@'%';
FLUSH PRIVILEGES;

二、创建PXC集群
1. 删除MariaDB程序包
yum -y remove mari*
2. 开放防火墙端口
firewall-cmd --zone=public --add-port=3306/tcp --permanent
firewall-cmd --zone=public --add-port=4444/tcp --permanent
firewall-cmd --zone=public --add-port=4567/tcp --permanent
firewall-cmd --zone=public --add-port=4568/tcp --permanent

3. 关闭SELINUX
vi /etc/selinux/config
把SELINUX属性值设置成disabled
reboot
4. 离线安装PXC
进入RPM文件目录，执行安装命令
yum localinstall *.rpm
参考第一章内容，修改MySQL配置文件、创建账户等操作

5. 创建PXC集群
停止MySQL服务

修改每个PXC节点的/etc/my.cnf文件（在不同节点上，注意调整文件内容）

server-id=1  #PXC集群中MySQL实例的唯一ID，不能重复，必须是数字
wsrep_provider=/usr/lib64/galera3/libgalera_smm.so
wsrep_cluster_name=pxc-cluster  #PXC集群的名称
wsrep_cluster_address=gcomm://192.168.99.151,192.168.99.159,192.168.99.215
wsrep_node_name=pxc1  #当前节点的名称
wsrep_node_address=192.168.99.151  #当前节点的IP
wsrep_sst_method=xtrabackup-v2  #同步方法（mysqldump、rsync、xtrabackup）
wsrep_sst_auth= admin:Abc_123456  #同步使用的帐户
pxc_strict_mode=ENFORCING  #同步严厉模式
binlog_format=ROW  #基于ROW复制（安全可靠）
default_storage_engine=InnoDB  #默认引擎
innodb_autoinc_lock_mode=2  #主键自增长不锁表

主节点的管理命令（第一个启动的PXC节点）


systemctl start mysql@bootstrap.service
systemctl stop mysql@bootstrap.service
systemctl restart mysql@bootstrap.service


非主节点的管理命令（非第一个启动的PXC节点）

service mysql start
service mysql stop
service mysql restart


查看PXC集群状态信息
show status like 'wsrep_cluster%'; 

按照上述配置方法，创建两组PXC集群


6. PXC节点启动与关闭

如果最后关闭的PXC节点是安全退出的，那么下次启动要最先启动这个节点，而且要以主节点启动
如果最后关闭的PXC节点不是安全退出的，那么要先修改/var/lib/mysql/grastate.dat 文件，把其中的safe_to_bootstrap属性值设置为1，再安装主节点启动

