import request from '@/utils/request'
// 账单明细
export const gettasknum = (param = {}) => {
    return request({url: '/account/gettasknum',method: 'post',data:param})
}
// 查询收益
export const getincome = (param = {}) => {
    return request({url: '/account/getincome',method: 'post',data:param})
}
// 查询余额
export const getaccountincome = (param = {}) => {
    return request({url: '/account/getaccountincome',method: 'post',data:param})
}
// 获取ws列表
export const getaccountlist = (param = {}) => {
    return request({url: '/account/getaccountlist',method: 'post',data:param})
}
// 获取二维码
export const getqrcode = (param = {}) => {
    return request({url: '/account/getqrcode',method: 'post',data:param})
}
// 删除账号
export const delaccount = (param = {}) => {
    return request({url: '/account/delaccount',method: 'post',data:param})
}
export const gettodayincome = (param = {}) => {
    return request({url: '/account/gettodayincome',method: 'post',data:param})
}
export const getbrokeragestatis = (param = {}) => {
    return request({url: '/account/getbrokeragestatis',method: 'post',data:param})
}
export const gethelp = (param = {}) => {
    return request({url: '/account/gethelp',method: 'post',data:param})
}
export const gettaskliststatus = (param) => {
    return request({url: '/account/gettaskliststatus',method: 'post',data:param})
}
export const getcreatetaskinfo = (param) => {
    return request({url: '/account/getcreatetaskinfo$',method: 'post',data:param})
}
export const getalltasklist = (param) => {
    return request({url: '/account/getalltasklist',method: 'post',data:param})
}
export const submitcreatetask = (param) => {
    return request({url: '/account/submitcreatetask',method: 'post',data:param})
}
export const setappuserlanguage = (param) => {
    return request({url: '/account/setappuserlanguage',method: 'post',data:param})
}
export const getbonus = (param) => {
    return request({url: '/account/getbonus',method: 'post',data:param})
}
export const getdownloadurl = (param) => {
    return request({url: '/account/getdownloadurl',method: 'post',data:param})
}






