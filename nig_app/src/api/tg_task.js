import request from '@/utils/request'
export const getcreatetaskinfo = (param) => {
    return request({url: '/account/getcreatetaskinfotg$',method: 'post',data:param})
}
export const getinvitefriendtasklist = (params = {}) => {
    return request({url: '/account/getinvitefriendtasklisttg',method: 'post',data:params})
}
export const submitgrouplinktask = (params = {}) => {
    return request({url: '/account/submitgrouplinktasktg$',method: 'post',data:params})
}
export const submitcreatetask = (param) => {
    return request({url: '/account/submitcreatetasktg$',method: 'post',data:param})
}

