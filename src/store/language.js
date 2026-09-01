import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useLanguageStore = defineStore('language', () => {
  // state
  const currentLanguage = ref(localStorage.getItem('language') || 'zh-CN'); // 默认中文

  // getters
  const getCurrentLanguage = computed(() => currentLanguage.value);

  // actions
  function setLanguage(language) {
    currentLanguage.value = language;
    localStorage.setItem('language', language);
  }

  return {
    // state
    currentLanguage,
    // getters
    getCurrentLanguage,
    // actions
    setLanguage,
  };
});
