// 导出一个已经配置好的 axios
// 引入axios并配置
import axios from "axios";

// 给axios配置请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 给axios本身配置token信息
    // config:本身是一个对象，具体是axios.defaults的体现
    // axios本身是对象，内部有defaults成员，也是对象
    // config可以直接给axios做具体信息配置的
    // 给axios配置token信息，这个“token”是通过请求头方式设置的
    // console.log(config)
    var token = window.sessionStorage.getItem("token");
    config.headers.Authorization = token;

    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);
// 基准路径
axios.defaults.baseURL = "http://127.0.0.1:11333/api/private/v1/";
export default axios;
