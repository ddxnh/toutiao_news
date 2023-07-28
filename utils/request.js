// axios 公共配置
// 基地址
axios.defaults.baseURL = 'http://geek.itheima.net'

// 配置请求拦截器 个人管理和内容在发起请求之前携带token
axios.interceptors.request.use(function (config) {
  // 从本地获取token字符串
  const token = localStorage.getItem('token')
  // 如果有给请求头添加token字符串
  token && (config.headers.Authorization = `Bearer ${token}`)
  // 把配置对象返回
  return config
}, function (error) {
  return Promise.reject(error)
})


// 配置响应拦截器
axios.interceptors.response.use(function (response) {

  // 对返回来的数据作处理
  const result = response.data
  return result
}, function (error) {
  if (error?.response?.status === 401) {
    alert('登录身份过期，请重新登录')
    localStorage.clear()
    location.href = '../login/index.html'
  }
  return Promise.reject(error)
})