import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { apiConfig } from '../config/api';

// 自动找到已注册的 pinia 实例
// defineStore(id, setup, options?)：
//        id：是 store 的唯一标识；
//        setup：是 store 的核心函数（Setup 函数，定义 state/getters/actions）；
//        options：是可选参数，用于配置 store 的持久化等。
export const useUserStore = defineStore('user', () => {
  /**
   * 用户信息（state）
   */
  const userInfo = ref(null); 
  const token = ref('');
  const isLogin = ref(false);
  const userBio = ref('这是我的个人简介');

  /**
   * 获取用户信息（getters）
   */
  const getUserInfo = computed(() => userInfo.value);
  const getToken = computed(() => token.value);
  const getLoginStatus = computed(() => isLogin.value);
  const getUserBio = computed(() => userInfo.value?.bio || userBio.value);

  /**
   * 用户相关操作（actions）
   */

  /**
   * 登录
   */
  async function login(userData) {
    try {
      // 发送登录请求
      // axios 是一个 JavaScript 的 HTTP 请求库，专门用来和后端服务器通信（发请求、拿数据）。
      const response = await axios.post(`${apiConfig.baseURL}/api/user/login`, {
        username: userData.username,
        password: userData.password
      });
      
      // 检查响应状态
      if (response.data && response.data.code === 200) {
        // 登录成功
        userInfo.value = response.data.data.userInfo;
        token.value = response.data.data.token;
        isLogin.value = true;
        
        return {
          success: true,
          message: '登录成功'
        };
      } else {
        // 登录失败
        return {
          success: false,
          message: response.data.message || '登录失败'
        };
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      return {
        success: false,
        message: error.response?.data?.message || '登录请求失败，请稍后再试'
      };
    }
  }

  /**
   * 注册用户
   */
  async function register(userData) {
    try {
      // 发送注册请求
      const response = await axios.post(`${apiConfig.baseURL}/api/user/register`, {
        username: userData.username,
        password: userData.password
      });
      
      // 检查响应状态
      if (response.data && response.data.code === 200) {
        // 注册成功，自动登录
        userInfo.value = response.data.data.userInfo;
        token.value = response.data.data.token;
        isLogin.value = true;
        
        return {
          success: true,
          message: '注册成功'
        };
      } else {
        // 注册失败
        return {
          success: false,
          message: response.data.message || '注册失败'
        };
      }
    } catch (error) {
      console.error('注册请求失败:', error);
      return {
        success: false,
        message: error.response?.data?.message || '注册请求失败，请稍后再试'
      };
    }
  }

  /**
   * 登出用户
   */
  function logout() {
    userInfo.value = null;
    token.value = '';
    isLogin.value = false;
  }

  /**
   * 获取用户信息
   */
  async function getUserInfoDetail() {
    try {
      // 检查是否有token
      if (!token.value) {
        return {
          success: false,
          message: '未登录'
        };
      }
      
      // 发送获取用户信息请求
      const response = await axios.get(`${apiConfig.baseURL}/api/user/info`, {
        headers: {
          // Authorization: `Bearer ${token.value}`
          Authorization: token.value
        }
      });
      
      // 检查响应状态
      if (response.data && response.data.code === 200) {
        // 更新用户信息
        userInfo.value = response.data.data;
        
        return {
          success: true,
          message: '获取用户信息成功',
          data: response.data.data
        };
      } else {
        return {
          success: false,
          message: response.data.message || '获取用户信息失败'
        };
      }
    } catch (error) {
      console.error('获取用户信息请求失败:', error);
      return {
        success: false,
        message: error.response?.data?.message || '获取用户信息请求失败，请稍后再试'
      };
    }
  }

  /**
   * 更新个人简介
   */
  async function updateUserBio(bio) {
    try {
      // 检查是否有token
      if (!token.value) {
        return {
          success: false,
          message: '未登录'
        };
      }
      
      // 发送更新个人简介请求
      const response = await axios.put(`${apiConfig.baseURL}/api/user/update`, 
        // { bio } 是 { bio: bio } 的简写。
        { bio },
        {
          headers: {
            Authorization: token.value
          }
        }
      );
      
      // 检查响应状态
      if (response.data && response.data.code === 200) {
        // 更新本地用户简介
        userInfo.value.bio = bio;
        
        return {
          success: true,
          message: '更新个人简介成功'
        };
      } else {
        return {
          success: false,
          message: response.data.message || '更新个人简介失败'
        };
      }
    } catch (error) {
      console.error('更新个人简介请求失败:', error);
      return {
        success: false,
        message: error.response?.data?.message || '更新个人简介请求失败，请稍后再试'
      };
    }
  }

  /**
   * 修改密码
   */
  async function updatePassword(oldPassword, newPassword) {
    try {
      // 检查是否有token
      if (!token.value) {
        return {
          success: false,
          message: '未登录'
        };
      }
      
      // 发送修改密码请求
      const response = await axios.put(`${apiConfig.baseURL}/api/user/password`, 
        { 
          oldPassword,
          newPassword 
        },
        {
          headers: {
            Authorization: token.value
          }
        }
      );
      
      // 检查响应状态
      if (response.data && response.data.code === 200) {
        return {
          success: true,
          message: '密码修改成功'
        };
      } else {
        return {
          success: false,
          message: response.data.message || '密码修改失败'
        };
      }
    } catch (error) {
      console.error('修改密码请求失败:', error);
      return {
        success: false,
        message: error.response?.data?.message || '修改密码请求失败，请稍后再试'
      };
    }
  }

  // 必须 return 所有对外暴露的属性和方法
  return {
    // state
    userInfo,
    token,
    isLogin,
    userBio,
    // getters
    getUserInfo,
    getToken,
    getLoginStatus,
    getUserBio,
    // actions
    login,
    register,
    logout,
    getUserInfoDetail,
    updateUserBio,
    updatePassword
  };
}, {
  // 持久化配置（第三个参数） 
  // Pinia 的数据持久化配置，作用是：刷新页面或关闭浏览器后，用户的登录状态不会丢失。
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user-store',
        storage: localStorage
      }
    ]
  }
});