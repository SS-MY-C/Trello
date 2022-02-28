import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import '@/assets/css/css.css'
import '@/assets/css/style.css'
import '@/assets/css/register.css'
import '@/assets/css/board.css'
import '@/assets/css/card.css'
import '@/assets/css/notFound.css'
import '@/assets/css/message.css'
import Message from './components/Message/Message';

Vue.config.productionTip = false

Vue.prototype.$message = Message

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
