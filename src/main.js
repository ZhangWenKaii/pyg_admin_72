import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// 引入全局css样式控制文件
import "./assets/css/global.css";
// 引入iconfont图标库样式文件
import "./assets/fonts/iconfont.css";

// 引入和注册elementui组件库
import ElementUI from "element-ui";
Vue.use(ElementUI);

import axios from "./http";
Vue.prototype.$http = axios;

import MyBread from "./components/MyBread";
Vue.component("my-bread", MyBread);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
