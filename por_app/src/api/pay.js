import request from '@/utils/request'
// 获取银行列表
export const getlistbanks = (params = {}) => {
    return request({url: '/account/getlistbanks',method: 'post',data:params})
}
// 获取提现信息
export const getwithdrawcard = params => {
    return request({url: '/account/getwithdrawcard',method: 'post',data:params})
}
// 发起提现
export const savewithdrawapproval = params => {
    return request({url: '/account/savewithdrawapproval$',method: 'post',data:params})
}
// 修改提现信息
export const dowithdrawcard = (params = {}) => {
    return request({url: '/account/dowithdrawcard$',method: 'post',data:params})
}
export const getwithdrawapprovallist = (params = {}) => {
    return request({url: '/account/getwithdrawapprovallist',method: 'post',data:params})
}
export const getwithdrawconfig = (params = {}) => {
    return request({url: '/account/getwithdrawconfig',method: 'post',data:params})
}


