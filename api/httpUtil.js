import axios from '@/plugins/axios'
import qs from 'qs'
import {md5Url} from '@/utils/'

class ApiService {
  constructor() {
  }

  createAxios(type, url, params, isCrypto = false, isDownload = false) {
    let config = {
      method: type,
      url,
      headers: {},
      responseType: isDownload ? 'blob' : 'json', //服务器返回的数据类型
    }
    if (type === 'get' || type === 'delete') {
      config.params = params
    } else {
      config.data = qs.stringify(params)
      if (isCrypto) {
        config.headers['sign-data'] = md5Url(url, params)
      }
    }
    return new Promise((resolve, reject) => {
      axios(config).then(response => {
        resolve(response.data)
      }).catch(err => {
        reject(err)
      })
    })
  }

  get(url, params, isCrypto, isDownload) {
    return this.createAxios('get', url, params, isCrypto, isDownload)
  }

  post(url, params, isCrypto) {
    return this.createAxios('post', url, params, isCrypto)
  }

  download(url, params, isCrypto) {
    return this.createAxios('get', url, params, isCrypto, true)
  }
}

const apiService = new ApiService()

export default apiService