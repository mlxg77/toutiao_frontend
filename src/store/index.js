import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

// 创建 Pinia 实例
const pinia = createPinia()

// 挂载持久化插件（pinia-plugin-persistedstate）
// —— 让所有开启了 persist 的 store 自动把数据存到 localStorage，刷新页面数据不丢失
pinia.use(createPersistedState({
  storage: localStorage
}))

// pinia：负责统一管理所有的 store
export default pinia