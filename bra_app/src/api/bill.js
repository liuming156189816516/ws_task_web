import request from '@/utils/request'
// 账单明细
export const gettasknum = (param = {}) => {
    return request({url: '/account/gettasknum',method: 'post',data:param})
}
export const getinvitenum = (param = {}) => {
    return request({url: '/account/getinvitenum',method: 'post',data:param})
}
export const getinvitelink = (param = {}) => {
    return request({url: '/account/getinvitelink',method: 'post',data:param})
}

