import axios from 'axios'
import {  message } from '@/components'
import cookie from 'js-cookie'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:9999',
  timeout: 15000 // 请求超时时间
})
// http request 拦截器
service.interceptors.request.use(
  config => {
    // 判断cookie是否有token值
    if(cookie.get('token')) {
      // token值放到cookie里面
      config.headers['token']=cookie.get('token')
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })
// http response 拦截器
service.interceptors.response.use(
  response => {
    if(response.data.code === 208) {
      //弹出登录输入框
      loginEvent.$emit('loginDialogEvent')
      return
    } else {
      if (response.data.code !== 200) {
        message.error(response.data.message) 
        return Promise.reject(response.data)
      } else {
        return response.data
      }
    }
  },
  error => {
    return Promise.reject(error.response)
  })
export default service
