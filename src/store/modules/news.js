import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { apiConfig } from '../../config/api';

export const useNewsStore = defineStore('news', () => {
  // state
  const newsList = ref([]);
  const newsDetail = ref({});
  const categories = ref([]);
  const currentCategory = ref(1);
  const loading = ref(false);
  const refreshing = ref(false);
  const finished = ref(false);
  const categoriesLoading = ref(false);

  // actions
  // 获取新闻分类
  async function getCategories() {
    if (categoriesLoading.value) return;

    categoriesLoading.value = true;

    try {
      // 调用API获取分类列表
      const response = await axios.get(`${apiConfig.baseURL}/api/news/categories`);

      if (response.data && response.data.code === 200) {
        // 设置分类数据
        categories.value = [...response.data.data, { id: 10, name: '更多' }];

        // 如果没有设置当前分类，则设置为第一个分类
        if (!currentCategory.value && categories.value.length > 0) {
          currentCategory.value = categories.value[0].id;
        }
      }
    } catch (error) {
      console.error('获取新闻分类失败:', error);
      // 设置默认分类，以防API请求失败
      categories.value = [
        { id: 1, name: '头条' },
        { id: 2, name: '社会' },
        { id: 3, name: '国内' },
        { id: 4, name: '国际' },
        { id: 5, name: '娱乐' },
        { id: 6, name: '体育' },
        { id: 7, name: '科技' }
      ];
    } finally {
      categoriesLoading.value = false;
    }
  }

  // 获取分类名称
  function getCategoryName(categoryId) {
    const category = categories.value.find(item => item.id === categoryId);
    return category ? category.name : '未知';
  }

  // 获取新闻列表
  async function getNewsList(isRefresh = false) {
    if (isRefresh) {
      refreshing.value = true;
      newsList.value = [];
      finished.value = false;
    }

    loading.value = true;

    try {
      // 使用API请求获取新闻列表
      const params = {
        categoryId: currentCategory.value,
        page: isRefresh ? 1 : Math.ceil(newsList.value.length / 10) + 1,
        pageSize: 10
      };

      const response = await axios.get(`${apiConfig.baseURL}/api/news/list`, { params });

      if (response.data && response.data.code === 200) {
        const newsData = response.data.data.list;

        // 更新新闻列表
        newsList.value = isRefresh ? newsData : [...newsList.value, ...newsData];

        // 判断是否加载完成
        if (newsData.length < params.pageSize) {
          finished.value = true;
        }
      }
    } catch (error) {
      console.error('获取新闻列表失败:', error);
    } finally {
      loading.value = false;
      refreshing.value = false;
    }
  }

  // 获取新闻详情
  async function getNewsDetail(id) {
    try {
      console.log('使用模拟新闻详情数据');

      const response = await axios.get(`${apiConfig.baseURL}/api/news/detail?id=${id}`);

      if (response.data && response.data.code === 200) {
        // 设置新闻详情数据
        newsDetail.value = response.data.data;
        return;
      } else {
        console.error('获取新闻详情失败: 接口返回错误');
      }
    } catch (error) {
      console.error('获取新闻详情失败:', error);
    }
  }

  // 切换新闻分类
  function changeCategory(categoryId) {
    if (currentCategory.value !== categoryId) {
      currentCategory.value = categoryId;
      newsList.value = [];
      finished.value = false;
      getNewsList(true);
    }
  }

  return {
    // state
    newsList,
    newsDetail,
    categories,
    currentCategory,
    loading,
    refreshing,
    finished,
    categoriesLoading,
    // actions
    getCategories,
    changeCategory,
    getNewsList,
    getNewsDetail,
    getCategoryName,
  };
});
