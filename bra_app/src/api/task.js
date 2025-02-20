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

//邀请任务明细
export const getinvitefriendtasklist = (params = {}) => {
    return request({url: '/account/getinvitefriendtasklist',method: 'post',data:params})
}

export const submitgrouplinktask = (params = {}) => {
    return request({url: '/account/submitgrouplinktask$',method: 'post',data:params})
}
export const getaimsginfo = (params = {}) => {
    return request({url: '/account/getaimsginfo$',method: 'post',data:params})
}
//TG任务明细
export const gettgaimsginfo = (params = {}) => {
    return request({url: '/account/gettgaimsginfo$',method: 'post',data:params})
}
export const uploadfile = (params)=> {
    return request({url:'/account/upload',method:'post',data:params})
}

export const submitaimessagetask = (params)=> {
    return request({url:'/account/submitaimessagetask',method:'post',data:params})
}
export const getaimessagetaskcontacts = (params)=> {
    return request({url:'/account/getaimessagetaskcontacts',method:'post',data:params})
}

export const gettaskliststatus = (params)=> {
    return request({url:'/account/gettaskliststatus',method:'post',data:params})
}
export const getaimsginfows = (params)=> {
    return request({url:'/account/getaimsginfows',method:'post',data:params})
}
export const submitaimessagetaskws = (params)=> {
    return request({url:'/account/submitaimessagetaskws',method:'post',data:params})
}
export const uploadws = (params)=> {
    return request({url:'/account/uploadws',method:'post',data:params})
}






