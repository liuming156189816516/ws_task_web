import request from '@/utils/request'
// 登录
export const login = (param) => {
    return request({url: '/adminmember/login$',method: 'post',data:param})
}
// 注册
export const register = (param) => {
    return request({url: '/adminmember/register$',method: 'post',data:param})
}
// 修改密码
export const changepwd = (param) => {
    return request({url: '/adminmember/changepwd',method: 'post',data:param})
}
// 退出登录
export const logout = (param) => {
    return request({url: '/adminmember/loginout',method: 'post',data:param})
}
// 获取验证码
export const getcode = (param) => {
    return request({url: '/adminmember/code',method: 'post',data:param})
}
// 轮播
export const getcarousellist = (param) => {
    return request({url: '/account/getcarousellist',method: 'post',data:param})
}
// 修改密码
export const revisepwd = (param) => {
    return request({url: '/adminmember/revisepwd',method: 'post',data:param})
}
// 修改头像
export const revisehead = (param) => {
    return request({url: '/adminmember/revisehead',method: 'post',data:param})
}
// 用户头像
export const gethead = (param) => {
    return request({url: '/adminmember/gethead',method: 'post',data:param})
}
export const buriedpoint = (param) => {
    return request({url: '/account/buriedpoint',method: 'post',data:param})
}
export const buriedpointlogout = (param) => {
    return request({url: '/account/buriedpointlogout',method: 'post',data:param})
}
export const getcountrycode = (params)=> {
    return request({url:'/adminmember/getcountrycode',method:'post',data:params})
}


