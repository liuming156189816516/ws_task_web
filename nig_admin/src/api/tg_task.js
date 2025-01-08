import request from '@/utils/request'

/*** ws群发任务*/
export const getcreategroupinfolist = (params)=> {
  return request({url:'/grouptg/getcreategroupinfolisttg',method:'post',data:params})
}
export const groupsendmsg = (params)=> {
    return request({url:'/grouptg/groupsendmsgtg',method:'post',data:params})
}
export const getsysconfig = (params)=> {
    return request({url:'/grouptg/getsysconfigtg',method:'post',data:params})
}
export const upsysconfig = (params)=> {
    return request({url:'/grouptg/upsysconfigtg',method:'post',data:params})
}
export const dooutexcel = (params)=> {
    return request({url:'/grouptg/dooutexceltg',method:'post',data:params})
}