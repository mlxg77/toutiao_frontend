<!-- Vue 单文件组件（SFC）由三部分组成：template（模板）、script（逻辑）、style（样式） -->
<!-- template 部分定义页面的 HTML 结构 -->
<template>
  <!-- 最外层容器，class="login-page" 用于给整个登录页设置样式 -->
  <div class="login-page">
    <!-- van-nav-bar 是 Vant 组件库提供的导航栏组件 -->
    <!-- title: 导航栏中间显示的标题文字 -->
    <!-- left-arrow: 显示左侧返回箭头（布尔属性，写了就是 true） -->
    <!-- @click-left: 点击左侧箭头时触发的事件，绑定到 onClickLeft 方法 -->
    <!-- fixed: 将导航栏固定在页面顶部（不随页面滚动） -->
    <van-nav-bar
      title="用户登录"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    
    <!-- 登录内容的主容器 -->
    <div class="login-container">
      <!-- Logo 区域容器，包含头像和标题 -->
      <div class="login-logo">
        <!-- van-image 是 Vant 的图片组件，比原生 <img> 功能更丰富 -->
        <!-- width/height: 设置图片宽高（单位默认是 px） -->
        <!-- src: 图片的网络地址 -->
        <!-- round: 将图片裁剪为圆形（布尔属性） -->
        <van-image
          width="80"
          height="80"
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
          round
        />
        <!-- 页面标题文字 -->
        <h2>新闻资讯</h2>
      </div>
      
      <!-- van-form 是 Vant 的表单组件，@submit 是表单提交时触发的事件 -->
      <!-- 当表单验证通过并提交时，会调用 onSubmit 方法，并传入表单数据 -->
      <van-form @submit="onSubmit" class="login-form">
        <!-- van-cell-group 是单元格分组容器，inset 属性让卡片有左右圆角和间距 -->
        <van-cell-group inset>
          <!-- van-field 是 Vant 的输入框组件 -->
          <!-- v-model="username": 双向绑定，输入框的值和 JS 中的 username 变量实时同步 -->
          <!-- name: 字段的名称，用于表单提交时标识这个字段 -->
          <!-- label: 输入框前面的标签文字 -->
          <!-- placeholder: 输入框为空时显示的提示文字 -->
          <!-- :rules: 表单验证规则数组（前面的冒号 : 表示这是 JS 表达式而非纯字符串） -->
          <!--   required: true 表示必填，message 是验证失败时的提示信息 -->
          <van-field
            v-model="username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <!-- 密码输入框，type="password" 让输入内容显示为圆点 -->
          <!-- 其他属性和上面的用户名输入框同理 -->
          <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>
        
        <!-- 提交按钮的外层容器，用于设置按钮的间距 -->
        <div class="submit-btn">
          <!-- van-button 是 Vant 的按钮组件 -->
          <!-- round: 圆角按钮样式 -->
          <!-- block: 按钮宽度撑满父容器（块级元素） -->
          <!-- type="primary": 按钮主题色（蓝色主色调） -->
          <!-- native-type="submit": 渲染为原生 <button type="submit">，点击后触发表单提交 -->
          <!-- size="large": 大尺寸按钮 -->
          <van-button round block type="primary" native-type="submit" size="large">
            登录
          </van-button>
        </div>
        
        <!-- 测试提示信息，告诉用户可以用哪个账号登录 -->
        <div class="login-tips">
          <p>测试账号：admin</p>
          <p>测试密码：123456</p>
        </div>
      </van-form>
    </div>
  </div>
</template>

<!-- script setup 是 Vue 3 的组合式 API 写法（Composition API） -->
<!-- setup 表示这是组件的逻辑入口，里面的代码会在组件创建时执行 -->
<script setup>
// 从 Vue 核心库导入 ref 函数
// ref 用于创建响应式变量：当变量值改变时，页面会自动更新显示
import { ref } from 'vue';
// 从 vue-router 导入路由相关方法
// useRouter 获取路由实例，用来在 JS 中进行页面跳转
import { useRouter } from 'vue-router';
// 从 Vant 组件库导入 showToast 方法
// showToast 用于显示一个轻量的提示弹窗（如"登录成功"、"登录失败"等）
import { showToast } from 'vant';
// 导入用户相关的 Pinia Store（状态管理）
// Pinia 类似于全局数据仓库，可以在多个页面间共享数据（如登录状态）
import { useUserStore } from '../store/user';

// 获取路由实例对象，后续用 router.push() 跳转页面、router.back() 返回上一页
const router = useRouter();
// 获取用户 Store 实例，里面封装了登录、注册等与用户相关的方法
const userStore = useUserStore();

// 定义响应式变量 username，初始值为空字符串
// .value 可以读取或修改它的值（在 script 中必须加 .value）
// 在 template 中则不需要加 .value，直接写 username 即可
const username = ref('');
// 定义响应式变量 password，初始值为空字符串
const password = ref('');

// 表单提交处理函数，async 表示这是一个异步函数（内部会使用 await 等待结果）
// values 参数是 Vant 表单自动验证通过后传入的表单数据对象
const onSubmit = async (values) => {
  // 调用 Vant 的 showToast 显示一个加载中的提示
  // type: 'loading' 显示旋转的加载图标
  // message: 提示文字
  // forbidClick: true 禁止用户点击背景（防止重复提交）
  // duration: 0 表示不自动关闭，需要手动关闭
  showToast({
    type: 'loading',
    message: '登录中...',
    forbidClick: true,
    duration: 0
  });
  
  // try...catch 是错误处理机制
  // try 里面放可能出错的代码，如果出错会跳到 catch 中处理
  try {
    // 调用 userStore 中的 login 方法进行登录请求
    // await 表示等待这个异步操作完成后才继续往下执行
    // 把用户名和密码作为参数传给后端 API
    const result = await userStore.login({
      username: username.value,  // 通过 .value 获取 ref 变量的实际值
      password: password.value
    });
    
    // 判断登录结果是否成功（result 是后端返回的数据对象）
    if (result.success) {
      // 登录成功：显示成功提示弹窗
      showToast({
        type: 'success',       // 显示绿色对勾图标
        message: result.message // 显示后端返回的成功消息，如"登录成功"
      });
      
      // 使用路由跳转到首页（'/' 是首页的路由路径）
      router.push('/');
    } else {
      // 登录失败（如密码错误）：显示失败提示弹窗
      showToast({
        type: 'fail',          // 显示红色叉号图标
        message: result.message // 显示后端返回的失败消息，如"密码错误"
      });
    }
  } catch (error) {
    // 当网络异常或其他意外错误时，会执行这里的代码
    // 显示一个通用的失败提示，避免把技术性的错误信息展示给用户
    showToast({
      type: 'fail',
      message: '登录失败，请稍后再试'
    });
  }
};

// 点击导航栏左侧返回箭头的处理函数
const onClickLeft = () => {
  // router.back() 返回上一个页面（类似浏览器的后退按钮）
  router.back();
};
</script>

<!-- style 部分定义页面的 CSS 样式 -->
<!-- scoped 表示这里的样式只作用于当前组件，不会影响其他页面 -->
<style scoped>
/* 登录页整体容器：撑满整个视口高度，设置浅灰色背景 */
.login-page {
  min-height: 100vh;           /* 最小高度为视口高度的 100%（vh = viewport height） */
  background-color: #f7f8fa;   /* 浅灰色背景，比纯白更柔和 */
}

/* 登录内容容器：顶部留出导航栏空间，使用 Flex 布局垂直居中内容 */
.login-container {
  padding-top: 56px;           /* 顶部内边距 56px，给固定导航栏留出空间，防止内容被遮挡 */
  display: flex;               /* 启用 Flex 弹性布局 */
  flex-direction: column;      /* 子元素纵向（垂直方向）排列 */
  align-items: center;         /* 子元素在水平方向上居中对齐 */
}

/* Logo 区域：设置上下间距，文字居中 */
.login-logo {
  margin: 40px 0;              /* 上下外边距 40px，左右为 0 */
  text-align: center;          /* 内部文字居中 */
}

/* Logo 下方的标题文字样式 */
.login-logo h2 {
  margin-top: 16px;            /* 顶部外边距 16px，和图片拉开间距 */
  color: #323233;              /* 深灰色字体颜色 */
  font-size: 22px;             /* 字体大小 22px */
}

/* 表单区域：占满宽度，左右留白 */
.login-form {
  width: 100%;                 /* 宽度 100% 撑满父容器 */
  padding: 0 16px;             /* 左右内边距 16px，让表单不贴边 */
}

/* 登录按钮区域：设置外边距让按钮和表单之间有间距 */
.submit-btn {
  margin: 24px 16px;           /* 上下外边距 24px，左右外边距 16px */
}

/* 测试账号提示信息区域 */
.login-tips {
  text-align: center;          /* 文字居中 */
  color: #969799;              /* 浅灰色文字，看起来不那么重要 */
  font-size: 14px;             /* 字体大小 14px */
  margin-top: 16px;            /* 顶部外边距 16px */
}

/* 提示信息段落之间的间距 */
.login-tips p {
  margin: 8px 0;               /* 上下外边距 8px，让两行提示文字之间有间距 */
}
</style>