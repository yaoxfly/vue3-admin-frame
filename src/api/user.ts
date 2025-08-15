import { request, transformRequest, multipartFormData } from '@/request'
/**
 *put、delete、post一样都可传p arams和data  params就是query, data就是body
*/
export const getUserInfo = (param = {}) => {
  return request({
    url: '/test/get',
    method: 'get',
    params: param
  })
}

export const postUserInfo = (param = {}) => request({
  url: '/test/post',
  method: 'post',
  params: param,
  data: param,
  ...transformRequest()
})

export const putUserInfo = (param = {}) => request({
  url: '/test/put',
  method: 'put',
  params: param,
  data: param
})

export const deleteUserInfo = (param = {}) => request({
  url: '/test/delete',
  method: 'delete',
  params: param,
  data: param
})

export const upload = (param = {}) => request({
  url: '/test/upload',
  method: 'post',
  data: param,
  ...multipartFormData()
})

export const download = (param = {}) => request<Blob>({
  url: '/download/pdf',
  method: 'get',
  data: param,
  responseType: 'blob'
})
