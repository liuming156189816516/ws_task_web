import request from '@/utils/request'
// 获取银行列表
export const getlistbanks = (params = {}) => {
    return request({url: '/account/getlistbanks',method: 'post',data:params})
}
// 任务详情
export const gettaskrecordlist = (params = {}) => {
    return request({url: '/account/gettaskrecordlist',method: 'post',data:params})
}
//收入明细
export const getbillrecordlist = (params = {}) => {
    return request({url: '/account/getbillrecordlist',method: 'post',data:params})
}