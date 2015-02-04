

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
2 与查看行为相关的权限：
a user能看所有参与的项目的信息
b 同一个项目参与的user之间可以互相看到对方的基本信息
3 与修改和删除行为相关权限
a user能创建新项目，自己就是项目的admin
b 项目的collaborator 能修改项目基本信息
c 项目的admin不但可以修改项目基本信息，还能管理参与的人以及对应的权限。

设计API输出的对象模型
解释：目前的User Project Relation都是我们服务器内部的模型，内部模型适合代码访问，不太适合给人理解。
需要考虑的点：
1 User模型本身怎么展现，如果需要同时展示Project，是用1个API加多层次嵌套，还是用2个API。
2 Project模型怎么展现，由于需要同时展现参与的User以及权限，怎么设计多层次嵌套结构。
3 User会在User的API和Project的API中都出现，两个地方是完全一致的字段还是会存在一个简略版本的
4 User模型本身是否存在权限控制，比如访问自己的信息是完整的，访问他人则是一个简略的之类。

输出QR Code图片
1 寻找QR Code库，根据输入的url参数生成并输出图片
2 对已经请求过的图片进行缓存，不重复生成图片

把之前的
