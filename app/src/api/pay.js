import ajax from "../http";
import Post from "../http/index";
// 获取银行列表
export const getlistbanks = (params = {}) => {
    return Post('account/getlistbanks', params);
}
// 获取提现信息
export const getwithdrawcard = param => {
    return Post("account/getwithdrawcard", param);
}
// 发起提现
export const savewithdrawapproval = param => {
    return Post("account/savewithdrawapproval", param);
}
// 修改提现信息
export const dowithdrawcard = (params = {}) => {
    return Post('account/dowithdrawcard', params);
}
export const getwithdrawapprovallist = (params = {}) => {
    return Post('account/getwithdrawapprovallist', params);
}
export const getwithdrawconfig = (params = {}) => {
    return Post('account/getwithdrawconfig', params);
}


