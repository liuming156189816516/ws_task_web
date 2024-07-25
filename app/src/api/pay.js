import request from '@/utils/request'
// 获取银行列表
export const getlistbanks = (params = {}) => {
    return request({url: '/account/getlistbanks',method: 'post',data:param})
}
// 获取提现信息
export const getwithdrawcard = param => {
    return request({url: '/account/getwithdrawcard',method: 'post',data:param})
}
// 发起提现
export const savewithdrawapproval = param => {
    return request({url: '/account/savewithdrawapproval',method: 'post',data:param})
}
// 修改提现信息
export const dowithdrawcard = (params = {}) => {
    return request({url: '/account/dowithdrawcard',method: 'post',data:param})
}
export const getwithdrawapprovallist = (params = {}) => {
    return request({url: '/account/getwithdrawapprovallist',method: 'post',data:param})
}
export const getwithdrawconfig = (params = {}) => {
    return request({url: '/account/getwithdrawconfig',method: 'post',data:param})
}


