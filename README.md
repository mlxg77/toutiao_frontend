# xwzx-news 新闻资讯前端项目

> 基于 Vue 3 + Vite 的移动端新闻资讯应用前端，配合 FastAPI 后端使用。

---

## 技术栈总览

| 技术 | 版本 | 作用 |
|------|------|------|
| Vue 3 | - | 前端框架 |
| Vite | ^7.1.6 | 构建工具 + 开发服务器 |
| Vue Router | ^4.5.1 | 页面路由 |
| Pinia | ^3.0.3 | 状态管理 |
| Vant | ^4.9.21 | 移动端 UI 组件库 |
| Axios | ^1.12.2 | HTTP 请求 |
| vue-i18n | ^9.8.0 | 国际化（中英文） |
| Marked + DOMPurify | - | Markdown 渲染与 XSS 防护（AI 聊天用） |

---

## 项目结构详解

```
xwzx-news/
├── index.html          # 应用入口 HTML
├── vite.config.js      # Vite 构建配置
├── package.json        # 项目依赖与脚本
├── public/             # 静态资源（不经过打包处理）
└── src/
    ├── main.js         # 应用启动入口
    ├── App.vue         # 根组件
    ├── style.css       # 全局样式
    ├── config/         # 配置文件
    ├── router/         # 路由配置
    ├── store/          # 状态管理（Pinia）
    ├── views/          # 页面组件
    ├── components/     # 公共复用组件
    ├── i18n/           # 国际化配置
    └── assets/         # 静态资源
```

---

## 各模块详解

### 1. `index.html` — 应用入口

```
类比：
  Spring Boot → Application.java 中的 main() 方法
  FastAPI     → main.py 中的 uvicorn.run()
```

这是整个单页应用（SPA）的**唯一 HTML 页面**。所有 Vue 组件最终都会被挂载到 `<div id="app"></div>` 这个 DOM 节点上。`<script type="module" src="/src/main.js">` 引入了应用的启动脚本。

---

### 2. `vite.config.js` — 构建配置

```
类比：
  Spring Boot → application.yml / pom.xml 中的 build 配置
  FastAPI     → pyproject.toml / setup.cfg
```

配置 Vite 如何打包和运行项目。当前配置了 Vue 插件，使 Vite 能识别和编译 `.vue` 文件。

---

### 3. `package.json` — 依赖与脚本

```
类比：
  Spring Boot → pom.xml（Maven 依赖管理）
  FastAPI     → requirements.txt / pyproject.toml
```

定义了项目依赖（dependencies）和可执行的 npm 脚本：

| 命令 | 作用 |
|------|------|
| `npm run dev` | 启动开发服务器（热更新） |
| `npm run build` | 打包为生产环境静态文件 |
| `npm run preview` | 本地预览打包产物 |

---

### 4. `src/main.js` — 应用启动入口

```
类比：
  Spring Boot → @SpringBootApplication 启动类，注册各种 Bean
  FastAPI     → main.py，创建 app 实例并注册中间件
```

做以下几件事：
1. 创建 Vue 应用实例（`createApp`）
2. 注册插件：Router、Pinia、i18n
3. 全局注册 Vant UI 组件
4. 将应用挂载到 `#app` DOM 节点
5. 初始化主题

#### 应用启动执行顺序

`index.html` 和 `main.js` 协同工作，完整启动流程如下：

```
用户在浏览器打开页面
        ↓
浏览器加载 index.html
        ↓
发现 <script src="/src/main.js">，开始加载 main.js
        ↓
main.js 依次执行：
  ① import App, router, pinia, i18n, Vant 组件  ← 导入依赖
  ② createApp(App)                              ← 创建 Vue 应用实例
  ③ app.use(i18n)                               ← 注册国际化插件
  ④ app.use(Button / NavBar / ...)              ← 全局注册 Vant UI 组件
  ⑤ app.use(router)                             ← 注册路由（URL → 页面的映射）
  ⑥ app.use(pinia)                              ← 注册状态管理（数据仓库）
  ⑦ app.mount('#app')                           ← 将应用挂载到 index.html 的 <div id="app">
        ↓
<div id="app"></div> 被 Vue 填充为完整页面
        ↓
用户看到新闻列表 / 导航栏 / 底部 Tab
```

> **关键关系**：`index.html` 提供空的容器 `<div id="app"></div>`，`main.js` 负责把整个应用渲染进去。两者通过 `#app` 这个 id 连接起来。

---

### 5. `src/App.vue` — 根组件

```
类比：
  Spring Boot → 全局 Filter / Interceptor 所在的入口层
  FastAPI     → app 级别的中间件
```

所有页面的**最外层容器**。使用了 `<router-view>` 来渲染当前路由匹配的页面组件，并通过 `<keep-alive>` 缓存部分页面（如首页、我的），避免切换 Tab 时重新加载。

---

### 6. `src/config/api.js` — API 配置

```
类比：
  Spring Boot → application.yml 中的 spring.datasource.url、外部服务 URL
  FastAPI     → .env 文件或 config.py 中的配置项
```

集中存放后端 API 地址和第三方服务配置：
- `apiConfig.baseURL`：后端 FastAPI 地址（`http://127.0.0.1:8000`）
- `aiChatConfig`：阿里云通义千问 AI 接口配置（API Key、模型名称）

---

### 7. `src/router/index.js` — 路由配置

```
类比：
  Spring Boot → @RequestMapping 注解 / Controller 中的 URL 映射
  FastAPI     → @app.get("/path") 路由装饰器
```

定义了 URL 路径与页面组件的对应关系：

| 路径 | 组件 | 说明 | keep-alive |
|------|------|------|:---:|
| `/home` | Home.vue | 首页新闻列表 | ✅ |
| `/news/detail/:id` | NewsDetail.vue | 新闻详情 | ❌ |
| `/category` | Category.vue | 全部分类 | ✅ |
| `/aichat` | AIChat.vue | AI 问答 | ✅ |
| `/my` | My.vue | 个人中心 | ✅ |
| `/profile` | Profile.vue | 个人信息编辑 | ❌ |
| `/favorite` | Favorite.vue | 我的收藏 | ❌ |
| `/history` | History.vue | 浏览历史 | ❌ |
| `/settings` | Settings.vue | 设置（主题/语言） | ❌ |
| `/login` | Login.vue | 登录 | ❌ |
| `/register` | Register.vue | 注册 | ❌ |

还配置了**全局前置守卫**（`beforeEach`），在每次页面跳转前自动设置浏览器标题（`document.title`）。

```
补充类比：
  路由守卫（beforeEach）≈ Spring Boot 的 HandlerInterceptor.preHandle()
                         ≈ FastAPI 的 Depends() 依赖注入/鉴权函数
```

---

### 8. `src/store/` — 状态管理（Pinia）

```
类比：
  Spring Boot → @Service 层（业务逻辑）+ @Entity 实体
  FastAPI     → service.py（业务层）+ schemas.py（数据模型）
```

Pinia 是这个项目的**核心数据层**，所有跨组件共享的数据都存放在这里。每个 Store 包含三部分：
- **state**：数据字段（≈ 实体类的属性）
- **getters**：计算属性（≈ @Property / getter 方法）
- **actions**：业务方法，包括调用后端 API（≈ Service 方法）

#### 8.1 `store/index.js` — Pinia 实例

创建 Pinia 实例并启用持久化插件（`pinia-plugin-persistedstate`），使状态自动保存到 `localStorage`，刷新页面不丢失数据。

```
类比：
  持久化插件 ≈ Spring Boot 的 Spring Session（会话持久化）
             ≈ FastAPI 的 SQLAlchemy ORM（数据持久化到数据库）
```

#### 8.2 `store/user.js` — 用户 Store

| 数据 | 说明 |
|------|------|
| `userInfo` | 用户信息对象 |
| `token` | JWT Token |
| `isLogin` | 登录状态 |

| 方法 | 说明 | 后端接口 |
|------|------|----------|
| `login()` | 登录 | `POST /api/user/login` |
| `register()` | 注册 | `POST /api/user/register` |
| `logout()` | 退出登录 | -（本地清除） |
| `getUserInfoDetail()` | 获取用户信息 | `GET /api/user/info` |
| `updateUserBio()` | 修改个人简介 | `PUT /api/user/update` |
| `updatePassword()` | 修改密码 | `PUT /api/user/password` |

```
类比：
  user.js ≈ Spring Boot 的 UserService.java
          ≈ FastAPI 的 user_service.py
```

#### 8.3 `store/modules/news.js` — 新闻 Store

| 数据 | 说明 |
|------|------|
| `newsList` | 新闻列表（支持分页加载） |
| `newsDetail` | 当前新闻详情 |
| `categories` | 新闻分类列表 |
| `currentCategory` | 当前选中分类 |

| 方法 | 说明 | 后端接口 |
|------|------|----------|
| `getCategories()` | 获取分类列表 | `GET /api/news/categories` |
| `getNewsList()` | 分页获取新闻列表 | `GET /api/news/list` |
| `getNewsDetail()` | 获取新闻详情 | `GET /api/news/detail?id=` |
| `changeCategory()` | 切换分类并重新加载 | - |

```
类比：
  news.js ≈ Spring Boot 的 NewsService.java
          ≈ FastAPI 的 news_service.py
```

#### 8.4 `store/modules/favorite.js` — 收藏 Store

| 方法 | 说明 | 后端接口 |
|------|------|----------|
| `toggleFavorite()` | 切换收藏状态（收藏/取消） | - |
| `addFavoriteApi()` | 添加收藏 | `POST /api/favorite/add` |
| `removeFavoriteApi()` | 取消收藏 | `DELETE /api/favorite/remove` |
| `getFavoriteListApi()` | 获取收藏列表 | `GET /api/favorite/list` |
| `checkFavoriteStatusApi()` | 检查收藏状态 | `GET /api/favorite/check` |
| `clearFavoritesApi()` | 清空所有收藏 | `DELETE /api/favorite/clear` |

#### 8.5 `store/modules/history.js` — 浏览历史 Store

| 方法 | 说明 | 后端接口 |
|------|------|----------|
| `addHistoryApi()` | 记录浏览历史 | `POST /api/history/add` |
| `getHistoryListApi()` | 获取历史列表 | `GET /api/history/list` |
| `removeHistoryApi()` | 删除单条历史 | `DELETE /api/history/delete/{id}` |
| `clearHistoryApi()` | 清空所有历史 | `DELETE /api/history/clear` |

#### 8.6 `store/theme.js` — 主题 Store

管理应用主题（浅色/深色/蓝色/绿色），通过修改 CSS 变量实现主题切换，并持久化到 `localStorage`。

```
类比：
  theme.js ≈ 后端的系统配置表（sys_config）
  无直接对应后端 Service，纯前端功能
```

#### 8.7 `store/language.js` — 语言 Store

记录当前语言偏好（`zh-CN` / `en-US`），配合 vue-i18n 实现多语言切换。

---

### 9. `src/views/` — 页面组件

```
类比：
  Spring Boot → Controller 层（处理请求，返回视图）
  FastAPI     → 路由函数（返回 HTMLResponse 或 Jinja2Templates）
```

每个 `.vue` 文件对应一个完整页面，包含三部分：
- `<template>`：HTML 结构（≈ Jinja2 模板 / Thymeleaf 模板）
- `<script setup>`：JS 逻辑（≈ Controller 方法）
- `<style scoped>`：CSS 样式（仅对当前组件生效）

| 页面 | 功能描述 |
|------|----------|
| `Home.vue` | 首页：分类 Tab + 下拉刷新 + 上拉加载更多新闻列表 |
| `NewsDetail.vue` | 新闻详情：展示完整文章内容，支持收藏 |
| `Category.vue` | 分类页：展示所有新闻分类（网格布局） |
| `AIChat.vue` | AI 问答：与通义千问对话，支持 Markdown 渲染 |
| `My.vue` | 个人中心：用户信息、菜单入口（收藏/历史/设置） |
| `Profile.vue` | 个人信息编辑：修改头像、简介 |
| `Favorite.vue` | 收藏列表：展示所有已收藏的新闻 |
| `History.vue` | 浏览历史：展示最近阅读的新闻 |
| `Login.vue` | 登录页：账号密码登录 |
| `Register.vue` | 注册页：新用户注册 |
| `Settings.vue` | 设置页：主题切换、语言切换 |

---

### 10. `src/components/` — 公共复用组件

```
类比：
  Spring Boot → 工具类（Utils）/ 公共 DTO
  FastAPI     → 公共 schema / 工具函数
```

被多个页面复用的 UI 组件：

| 组件 | 功能 |
|------|------|
| `NewsItem.vue` | 新闻列表项（左图右文布局），点击跳转详情页 |
| `TabBar.vue` | 底部导航栏（首页 / AI问答 / 我的），支持国际化 |
| `HelloWorld.vue` | Vite 脚手架默认组件（未使用） |

---

### 11. `src/i18n/` — 国际化（多语言）

```
类比：
  Spring Boot → messages_zh_CN.properties / messages_en_US.properties
  FastAPI     → gettext (.po/.mo 文件) 或 babel 配置
```

| 文件 | 说明 |
|------|------|
| `i18n/index.js` | 创建 i18n 实例，设置默认语言，提供动态切换方法 |
| `i18n/locales/zh-CN.js` | 中文语言包（所有中文文案） |
| `i18n/locales/en-US.js` | 英文语言包（所有英文文案） |

在组件中通过 `$t('key')` 或 `t('key')` 获取翻译文本：
```html
<!-- 中文环境显示"首页"，英文环境显示"Home" -->
<van-tabbar-item>{{ $t('nav.home') }}</van-tabbar-item>
```

---

## 数据流架构

```
用户操作（点击、滑动）
        ↓
   View 页面组件（Home.vue / Favorite.vue ...）
        ↓  调用
   Pinia Store（news.js / favorite.js / user.js ...）
        ↓  发请求（Axios）
   FastAPI 后端（http://127.0.0.1:8000/api/...）
        ↓  返回 JSON
   Pinia Store 更新 state
        ↓  响应式自动更新
   View 页面组件重新渲染
```

```
类比后端分层：
  View 组件      ≈ Controller 层（接收用户输入，触发业务逻辑）
  Pinia Store    ≈ Service 层（业务逻辑，数据处理）
  Axios 请求     ≈ DAO/Repository 层（与数据源交互）
  FastAPI 后端   ≈ 数据库 + 后端 API
```

---

## 后端 API 接口汇总

本项目对接的 FastAPI 后端接口一览（`baseURL = http://127.0.0.1:8000`）：

| 模块 | 方法 | 接口路径 | 说明 |
|------|------|----------|------|
| 用户 | POST | `/api/user/login` | 登录 |
| 用户 | POST | `/api/user/register` | 注册 |
| 用户 | GET | `/api/user/info` | 获取用户信息 |
| 用户 | PUT | `/api/user/update` | 更新个人简介 |
| 用户 | PUT | `/api/user/password` | 修改密码 |
| 新闻 | GET | `/api/news/categories` | 获取新闻分类 |
| 新闻 | GET | `/api/news/list` | 分页获取新闻列表 |
| 新闻 | GET | `/api/news/detail` | 获取新闻详情 |
| 收藏 | GET | `/api/favorite/check` | 检查收藏状态 |
| 收藏 | POST | `/api/favorite/add` | 添加收藏 |
| 收藏 | DELETE | `/api/favorite/remove` | 取消收藏 |
| 收藏 | GET | `/api/favorite/list` | 获取收藏列表 |
| 收藏 | DELETE | `/api/favorite/clear` | 清空收藏 |
| 历史 | POST | `/api/history/add` | 添加浏览记录 |
| 历史 | GET | `/api/history/list` | 获取历史列表 |
| 历史 | DELETE | `/api/history/delete/{id}` | 删除单条历史 |
| 历史 | DELETE | `/api/history/clear` | 清空历史 |

---

## 环境要求

| 工具 | 最低版本 | 说明 |
|------|----------|------|
| Node.js | >= 18.x | JavaScript 运行环境 |
| npm | >= 9.x | 包管理器（随 Node.js 一起安装） |

> 检查版本：`node -v` 和 `npm -v`
>
> Node.js 安装地址：https://nodejs.org/

---

## 项目初始化（首次搭建）

如果你是第一次搭建这个项目，按以下步骤操作：

### 第一步：安装 Node.js

前往 [Node.js 官网](https://nodejs.org/) 下载 LTS 版本并安装。

```bash
# 验证安装成功
node -v    # 输出版本号，如 v20.x.x
npm -v     # 输出版本号，如 10.x.x
```

### 第二步：创建项目（已完成可跳过）

```bash
# 使用 Vite 脚手架创建 Vue 3 项目
npm create vite@latest xwzx-news -- --template vue

# 进入项目目录
cd xwzx-news
```

### 第三步：安装项目依赖

```bash
npm install
```

执行后 npm 会读取 `package.json`，将所有依赖下载到 `node_modules/` 目录，并生成 `package-lock.json`。

```bash
# 安装完成后目录结构
xwzx-news/
├── node_modules/    ← 所有依赖包（约几十 MB，不要提交到 Git）
├── package.json
├── package-lock.json
└── ...
```

### 第四步：安装额外依赖（已完成可跳过）

```bash
# 安装 Pinia（状态管理）
npm install pinia pinia-plugin-persistedstate

# 安装 Vue Router（路由）
npm install vue-router

# 安装 Vant（移动端 UI 组件库）
npm install vant

# 安装 Axios（HTTP 请求）
npm install axios

# 安装 vue-i18n（国际化）
npm install vue-i18n

# 安装 Marked + DOMPurify（Markdown 渲染，AI 聊天用）
npm install marked dompurify
```

---

## 项目运行

### 开发模式（日常开发使用）

```bash
npm run dev
```

启动后在浏览器访问 `http://localhost:5173`（端口以终端输出为准）。

特性：
- **热更新（HMR）**：修改代码后浏览器自动刷新，无需手动重启
- **实时报错**：控制台会显示编译错误

> **前提条件**：FastAPI 后端需已运行在 `http://127.0.0.1:8000`，否则新闻列表、登录等功能无法正常使用。
> 若后端地址不同，请修改 `src/config/api.js` 中的 `baseURL`。

### 预览构建产物

```bash
# 先打包，再预览
npm run build
npm run preview
```

在本地模拟生产环境，用于上线前检查打包结果是否正常。

---

## 项目构建（打包上线）

```bash
npm run build
```

执行后生成 `dist/` 目录，包含所有可部署的静态文件：

```
dist/
├── index.html          # 入口 HTML
└── assets/
    ├── index-xxx.js    # 打包压缩后的 JavaScript
    └── index-xxx.css   # 打包压缩后的 CSS
```

将 `dist/` 目录部署到任意静态文件服务器即可，例如：

| 部署方式 | 说明 |
|----------|------|
| Nginx | 将 `dist/` 放入网站根目录，配置 `try_files` 支持 SPA 路由 |
| Vercel / Netlify | 直接关联 Git 仓库，自动构建部署 |
| Docker | 使用 Nginx 镜像挂载 `dist/` 目录 |

### Nginx 部署参考配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # SPA 路由支持：所有路径都返回 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 反向代理后端 API（可选，解决生产环境跨域）
    location /api {
        proxy_pass http://127.0.0.1:8000;
    }
}
```

---

## 常见问题

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| `npm install` 报错 | Node.js 版本过低 | 升级到 Node.js >= 18 |
| 页面空白，无数据 | 后端未启动 | 先启动 FastAPI 后端 |
| 端口 5173 被占用 | 其他程序占用 | Vite 会自动切换到 5174，看终端输出 |
| 刷新页面 404 | Nginx 未配置 SPA 路由 | 添加 `try_files $uri $uri/ /index.html;` |
