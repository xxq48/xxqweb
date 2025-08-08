import './assets/main.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

import * as Icons from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(Icons)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)

app.mount('#app')





