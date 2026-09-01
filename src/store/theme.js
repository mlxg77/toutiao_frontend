import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', () => {
  // state
  // ① 初始化时：从 localStorage 读取上次保存的主题
  const currentTheme = ref(localStorage.getItem('theme') || 'light'); // 默认浅色主题
  const themes = ref({
    light: {
      name: '浅色模式',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      primaryColor: '#1989fa',
      secondaryColor: '#f5f5f5',
    },
    dark: {
      name: '深色模式',
      backgroundColor: '#121212',
      textColor: '#ffffff',
      primaryColor: '#4c8bf5',
      secondaryColor: '#2d2d2d',
    },
    blue: {
      name: '蓝色主题',
      backgroundColor: '#e6f7ff',
      textColor: '#333333',
      primaryColor: '#1890ff',
      secondaryColor: '#bae7ff',
    },
    green: {
      name: '绿色主题',
      backgroundColor: '#f6ffed',
      textColor: '#333333',
      primaryColor: '#52c41a',
      secondaryColor: '#d9f7be',
    }
  });

  // getters 计算属性 = getter + 缓存
  // computed：是把这个计算结果包装成只读属性，并加上缓存
  // 箭头函数 () => ... 等价于 function () { ... }是一个匿名表达式的写法

  // 纯粹是为了命名语义——在组件里写 getCurrentTheme 比写 currentTheme 更像"getter"，和原来选项式写法保持风格一致。但从功能角度来说完全可以删掉，直接暴露 currentTheme 就够了。
  // 因为currentTheme 变化时，两者的值始终一模一样，
  // currentTheme.value   // 'dark'
  // getCurrentTheme.value // 'dark'
  const getCurrentTheme = computed(() => currentTheme.value);

  // ❌ 直接赋值：只执行一次，结果写死
  // const getThemeConfig = themes.value[currentTheme.value];
  // -----------------------------------------------------------
  // ✅ computed：每次 currentTheme 变化时自动重新计算
  // 响应式系统：
  // ref()      → 创建一个"信号源"，值变了会发通知
  // computed() → 订阅信号源，信号变了自动重新计算
  // 组件        → 订阅 computed，值变了自动重新渲染
  const getThemeConfig = computed(() => themes.value[currentTheme.value]);

  // 获取所有主题列表
  // Object.keys 和 map：把对象转换成数组
  // 第1步：Object.keys() 取所有键名，返回一个数组 ['light', 'dark', 'blue', 'green']
  // 第2步：map() 遍历数组，返回一个新数组
  const getAllThemes = computed(() =>
    // 
    Object.keys(themes.value).map(key => ({
      id: key,
      name: themes.value[key].name,
      primaryColor: themes.value[key].primaryColor
    }))
  );

  // actions
  // ② 用户切换主题时：同时保存到 localStorage
  function setTheme(themeName) {
    if (themes.value[themeName]) {
      currentTheme.value = themeName;
      localStorage.setItem('theme', themeName);
      applyTheme();
    }
  }

  function applyTheme() {
    const theme = themes.value[currentTheme.value];
    // -- 前缀是为了：为了和浏览器内置属性区分开。览器内置属性 = CSS 标准属性
    // 浏览器内置属性 = CSS 标准属性
    // 就是浏览器天生认识的那些 CSS 属性，不需要你自己定义
    document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', theme.textColor);
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
  }

  function initTheme() {
    applyTheme();
  }

  return {
    // state
    currentTheme,
    themes,
    // getters
    getCurrentTheme,
    getThemeConfig,
    getAllThemes,
    // actions
    setTheme,
    applyTheme,
    initTheme,
  };
});
