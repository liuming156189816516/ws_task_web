import request from '@/utils/request'

export const getaccountfilelisttg = (params) =>{
    return request({url:'/accounttg/getaccountfilelisttg',method:'post',data:params})
}
export const dobathdelaccountfiletg = (params) =>{
    return request({url:'/accounttg/dobathdelaccountfiletg',method:'post',data:params})
}
export const checkaccountfiletg = (params) =>{
    return request({url:'/accounttg/checkaccountfiletg',method:'post',data:params})
}
export const getaccountloglisttg = (params) =>{
    return request({url:'/accounttg/getaccountloglisttg',method:'post',data:params})
}
export const addaccounttg = (params) =>{
    return request({url:'/accounttg/addaccounttg',method:'post',data:params})
}
export const getaccountscheduletg = (params) =>{
    return request({url:'/accounttg/getaccountscheduletg',method:'post',data:params})
}
export const dooutputaccountlogtg = (params) =>{
    return request({url:'/accounttg/dooutputaccountlogtg',method:'post',data:params})
}