import request from '@/utils/request'

const api_name = `/msm`

export default {
  sendCode(mobile) {
    return request({
      url: `${api_name}/send/${mobile}`,
      method: `get`
    })
  }
}
