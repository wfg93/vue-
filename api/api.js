import apiService from '@/utils/httpUtil'

const API = (url, type = 'post', isCrypto = false, isDownload) => (params) => apiService[type](url, params, isCrypto)

export default API