OneCode
=======

## API部分
### 用户API
#### 获取所有用户列表
```
GET /api/users/
```
```
[
  {
    "id": "user-id",
    "username": "username",
    "email": "user@domain.com",
    "passports": []
  }
]
```

#### 获取用户基本信息
```
GET /api/users/<id>
```
参数:
  - id (必填) - 用户ID

<!--- FIXME 不知道passports 长什么样 -->
```
{
  "id": "user-id",
  "username": "username",
  "email": "user@domain.com",
  "passports": []
}
```

### 项目API
#### 获取所有项目列表
```
GET /api/projects/
```
```
[
  {
    "id": "project-id",
    "project_name": "your-project-name",
    "wechat_link": "http://some-url.com/wechat-link",
    "android_link": "http://some-url.com/android-link",
    "ios_link": "http://some-url.com/ios-link",
    "default_link": "http://some-url.com/default_link"
  }
]
```

#### 创建新项目
```
POST /api/projects/
```
参数:
<!--- FIXME 应该是必填吧 -->
  - project_name (必填) - 项目名
  - wechat_link (选填) - 微信跳转链接
  - android_link (选填) - 安卓跳转链接
  - ios_link (选填) - iOS跳转链接
  - default_link (选填) - 默认跳转链接

```
{
  "id": "project-id",
  "project_name": "your-project-name",
  "wechat_link": "http://some-url.com/wechat-link",
  "android_link": "http://some-url.com/android-link",
  "ios_link": "http://some-url.com/ios-link",
  "default_link": "http://some-url.com/default_link"
}
```

#### 获取项目信息
```
GET /api/projects/<id>
```
参数:
  - id (必填) - 项目ID

```
{
  "id": "project-id",
  "project_name": "your-project-name",
  "wechat_link": "http://some-url.com/wechat-link",
  "android_link": "http://some-url.com/android-link",
  "ios_link": "http://some-url.com/ios-link",
  "default_link": "http://some-url.com/default_link"
}
```

#### 删除项目
```
DELETE /api/projects/<id>
```
参数:
  - id (必填) - 项目ID

#### 修改项目
<!--- PUT 可能更Restful一点 -->
```
POST /api/projects/<id>
```
参数:
<!--- FIXME project_name 应该不是必填吧 -->
  - id (必填) - 项目ID
  - project_name (必填) - 项目名
  - wechat_link (选填) - 微信跳转链接
  - android_link (选填) - 安卓跳转链接
  - ios_link (选填) - iOS跳转链接
  - default_link (选填) - 默认跳转链接

```
{
  "id": "project-id",
  "project_name": "your-project-name",
  "wechat_link": "http://some-url.com/wechat-link",
  "android_link": "http://some-url.com/android-link",
  "ios_link": "http://some-url.com/ios-link",
  "default_link": "http://some-url.com/default_link"
}
```

#### 获取所有项目成员
```
GET /api/projects/<id>/members
```
参数:
  - id (必填) - 项目ID

<!--- FIXME 不确定 -->
```
[
  {
    "id": "user-id",
    "username": "username",
    "email": "user@domain.com",
    "passports": []
  }
]
```

#### 创建新成员
```
POST /api/projects/<id>/members
```
参数:
<!--- FIXME uid? -->
  - id (必填) - 项目ID
  - user (必填) -
  - access (必填) - 权限类型 `admin`/`collaborator`/`guest`

<!--- FIXME 此处应有 access 信息? -->
```
{
  "id": "user-id",
  "username": "username",
  "email": "user@domain.com",
  "passports": []
}
```

#### 获取项目成员信息
```
GET /api/projects/<id>/members/<uid>
```
参数:
  - id (必填) - 项目ID
  - uid (必填) - 用户ID

<!--- FIXME 此处应有 access 信息? -->
```
{
  "id": "user-id",
  "username": "username",
  "email": "user@domain.com",
  "passports": []
}
```

#### 修改项目成员权限
<!--- PUT 可能更Restful一点 -->
```
POST /api/projects/<id>/members/<uid>
```
参数:
  - id (必填) - 项目ID
  - uid (必填) - 用户ID
  - access (必填) - 权限类型 `admin`/`collaborator`/`guest`

```
{
  "id": "user-id",
  "username": "username",
  "email": "user@domain.com",
  "passports": []
}
```

#### 删除成员
```
DELETE /api/projects/<id>/members/<uid>
```
参数:
  - id (必填) - 项目ID
  - uid (必填) - 用户ID


## Admin/Collaborator/Guest

1. 凡事没登录的都拦截
1. 与查看行为相关的权限:
  1. user能看所有参与的项目的信息
  1. 同一个项目参与的user之间可以互相看到对方的基本信息
1. 与修改和删除行为相关权限
  1. user能创建新项目, 自己就是项目的admin
  1. 项目的collaborator能修改项目基本信息
  1. 项目的admin不但可以修改项目基本信息, 还能管理参与的人以及对应的权限。

# 设计API输出的对象模型
> 解释：目前的User Project Relation都是我们服务器内部的模型，内部模型适合代码访问，不太适合给人理解。

需要考虑的点：
<!--- 第三条, 通常是另一个model -->
1. User模型本身怎么展现, 如果需要同时展示Project, 是用1个API加多层次嵌套, 还是用2个API.
1. Project模型怎么展现, 由于需要同时展现参与的User以及权限, 怎么设计多层次嵌套结构.
1. User会在User的API和Project的API中都出现, 两个地方是完全一致的字段还是会存在一个简略版本的.
1. User模型本身是否存在权限控制，比如访问自己的信息是完整的，访问他人则是一个简略的之类.

## 输出QR Code图片
<!--- 现在似乎是google charts? 不满意的原因是墙? -->
<!---  我认为把这种任务直接丢给浏览器做比较好 -->
1. 寻找QR Code库, 根据输入的url参数生成并输出图片
1. 对已经请求过的图片进行缓存, 不重复生成图片

<!--- 不知道是啥
把之前的
-->
