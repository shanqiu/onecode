

API部分
/api/users/
GET 得到所有用户列表
/api/users/<id>
GET 用户id是<id>的基本信息
/api/projects/
GET 得到所有项目列表
POST 创建一个新项目，并返回id（实际上返回的是 /api/projects/<id>）
/api/projects/<id>
GET id为<id>的项目信息
DELETE 删除id为<id>的项目
POST 修改id为<id>的项目
/api/projects/<id>/members
GET 列出 id为<id>的项目的成员信息
POST 增加成员
/api/projects/<id>/members/<uid>
GET 列出 id为<id>的项目中，userid是uid的成员的信息
POST 修改userid是uid的成员的权限 access=admin/xxx/xxx/
DELETE 删除成员

admin collaborator guest

1, 凡事没登录的都拦截
2 查看权限：
a user能看所有参与的项目的信息
b 同一个项目参与的user之间可以互相看到对方的基本信息
3 修改权限
a user能创建新项目，自己就是项目的admin
b 项目的collaborator 能修改项目基本信息
c 项目的admin不但可以修改项目基本信息，还能管理参与的人以及对应的权限。
