import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    // ① 初始化时：从 localStorage 读取上次保存的主题
    currentTheme: localStorage.getItem('theme') || 'light', // 默认浅色主题
    themes: {
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
    }
  }),
  
  getters: {
    getCurrentTheme: (state) => state.currentTheme,
    getThemeConfig: (state) => state.themes[state.currentTheme],
    getAllThemes: (state) => Object.keys(state.themes).map(key => ({
      id: key,
      name: state.themes[key].name,
      primaryColor: state.themes[key].primaryColor
    }))
  },
  
  actions: {
    // ② 用户切换主题时：同时保存到 localStorage
    setTheme(themeName) {
      if (this.themes[themeName]) {
        this.currentTheme = themeName;
        localStorage.setItem('theme', themeName);
        this.applyTheme();
      }
    },
    
    applyTheme() {
      const theme = this.themes[this.currentTheme];
      document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
      document.documentElement.style.setProperty('--text-color', theme.textColor);
      document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    },
    
    initTheme() {
      this.applyTheme();
    }
  }
});