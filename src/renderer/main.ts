import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/style.css'
import './assets/icon/iconfont.css'

import { db } from '../common/db'
db('Chat')
  .first()
  .then((obj) => {
    console.log('main', obj)
  })

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
