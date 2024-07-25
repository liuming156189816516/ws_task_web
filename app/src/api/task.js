import request from '@/utils/request'
// 获取银行列表
export const getlistbanks = (params = {}) => {
    return request({url: '/account/getlistbanks',method: 'post',data:param})
}
// 任务详情
export const gettaskrecordlist = (param = {}) => {
    return request({url: '/account/gettaskrecordlist',method: 'post',data:param})
}
//收入明细
export const getbillrecordlist = (param = {}) => {
    return request({url: '/account/getbillrecordlist',method: 'post',data:param})
}