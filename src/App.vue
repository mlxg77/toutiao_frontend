<template>
  <div class="app">
    <!-- <router-view>:路由出口——当前 URL 对应哪个页面，就显示在这里。 
                      访问 /home   → 这里显示 Home.vue
                      访问 /login  → 这里显示 Login.vue -->
    <!-- v-slot="{ Component }" : Vue 的作用域插槽语法，意思是：
                                把 <router-view> 内部提供的当前页面组件，取出来赋值给变量 Component-
    这里的主要作用是:手动决定怎么渲染它（加缓存 or 不加缓存）,如果不考虑加缓存判断,那么<router-view /> 一行搞定
    -->
    <router-view v-slot="{ Component }">
      <!-- <keep-alive> — 页面缓存，切换 Tab 不重新加载。
        缓存 = 记住页面离开时的样子。Tab 之间频繁切换的页面适合缓存，用完即走的页面不需要缓存 -->
      <!-- include：只缓存指定 name 的组件。动态从路由 meta.keepAlive 中读取，只需在 router/index.js 维护 -->
      <!-- :is 是 Vue 的动态组件语法，意思是"渲染哪个组件，由变量决定"。 -->
      <keep-alive :include="cachedViews">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup>

import { useRouter } from 'vue-router'
// 读取在 router/index.js 里写的所有路由配置，包含所有路由的 name 和 meta 信息
const router = useRouter()

// 从路由配置中读取所有 meta.keepAlive === true 的路由 name，作为缓存列表
const cachedViews = router.options.routes
  .filter(r => r.meta?.keepAlive)  // 只保留 meta.keepAlive === true 的路由
  .map(r => r.name)                // 取出它们的 name
// 结果：['Home', 'Category', 'AIChat', 'My']
</script>

<style>
/* *是 CSS 中的通配符选择器，页面里每一个 HTML 标签都会被这条规则影响到，无一例外。 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* 这段代码给 <html> 和 <body> 两个标签设置全局基础样式 */
html, body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  background-color: #f7f8fa;
  color: #333;
  height: 100%;
  width: 100%;
}

.app {
  max-width: 750px;
  margin: 0 auto;
  height: 100%;
}

/* 移动端适配,目前休眠状态，没有实际效果 */
@media screen and (max-width: 750px) {
  html {
    font-size: calc(100vw / 750 * 16);
  }
}
</style>
