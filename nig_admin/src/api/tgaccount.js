// TG接口
import request from '@/utils/request'
export const getaccountinfotglist = (params) =>{
    return request({url:'/accounttg/getaccountinfotglist',method:'post',data:params})
}
export const getaccountgrouptglist = (params) =>{
    return request({url:'/accounttg/getaccountgrouptglist',method:'post',data:params})
}
export const doaccountgrouptg = (params) =>{
    return request({url:'/accounttg/doaccountgrouptg',method:'post',data:params})
}
export const doupremarktg = (params) =>{
    return request({url:'/accounttg/doupremarktg',method:'post',data:params})
}
export const doupgrouptg = (params) =>{
    return request({url:'/accounttg/doupgrouptg',method:'post',data:params})
}
export const dooutputaccounttg = (params) =>{
    return request({url:'/accounttg/dooutputaccounttg',method:'post',data:params})
}
export const dobatchdelaccounttg = (params) =>{
    return request({url:'/accounttg/dobatchdelaccounttg',method:'post',data:params})
}
export const dobatchfastlogintg = (params) =>{
    return request({url:'/accounttg/dobatchfastlogintg',method:'post',data:params})
}
export const dobatchlogouttg = (params) =>{
    return request({url:'/accounttg/dobatchlogouttg',method:'post',data:params})
}
export const sortgrouptg = (params) =>{
    return request({url:'/accounttg/sortgrouptg',method:'post',data:params})
}
export const dobatchlogintg = (params) =>{
    return request({url:'/accounttg/dobatchlogintg',method:'post',data:params})
}