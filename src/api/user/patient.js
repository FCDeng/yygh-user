import request from '@/utils/request'

const api_name = `/api/user/patient`

export default {
  // 患者列表
  findList() {
    return request({
      url: `${api_name}/auth/findAll`,
      method: `get`
    })
  },
  // 根据id查询患者信息
  getById(id) {
    return request({
      url: `${api_name}/auth/get/${id}`,
      method: 'get'
    })
  },
  // 添加患者信息
  save(patient) {
    return request({
      url: `${api_name}/auth/save`,
      method: 'post',
      data: patient
    })
  },
  // 修改患者信息
  updateById(patient) {
    return request({
      url: `${api_name}/auth/update`,
      method: 'post',
      data: patient
    })
  },
  // 删除患者信息
  removeById(id) {
    return request({
      url: `${api_name}/auth/remove/${id}`,
      method: 'delete'
    })
  }
}
