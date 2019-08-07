MySQL全局配置无法远程访问
打开mysqld.cnf文件
2.2 找到bind-adress = 127.0.0.1这行
2.3 取消本地限制
在bind-adress = 127.0.0.1前加上#号
2.4 重启mysql服务
service mysql restart
3.1 查询user表
# 登陆数据库后
use mysql;
select host, user from user;
3.2 修改地址权限
将需要远程登陆的用户的host修改成对应的地址
如果不做限制, host 改成通配符%

如:
update user set host = '%' where user = 'root';


