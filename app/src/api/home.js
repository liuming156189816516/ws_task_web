import Post from "../http/index";
// 查询收益
export const getincome = (param = {}) => {
    return Post("account/getincome", param);
}
// 查询余额
export const getaccountincome = (param = {}) => {
    return Post("account/getaccountincome", param);
}
// 获取ws列表
export const getaccountlist = (param = {}) => {
    return Post("account/getaccountlist", param);
}
// 获取二维码
export const getqrcode = (param = {}) => {
    return Post("account/getqrcode", param);
}
// 删除账号
export const delaccount = (param = {}) => {
    return Post("account/delaccount", param);
}
export const gettodayincome = (param = {}) => {
    return Post("account/gettodayincome", param);
}
export const getbrokeragestatis = (param = {}) => {
    return Post("account/getbrokeragestatis", param);
}
export const gethelp = (param = {}) => {
    return Post("account/gethelp", param);
}
export const gettaskliststatus = (param) => {
    return Post("account/gettaskliststatus", param)
}
export const getcreatetaskinfo = (param) => {
    return Post("account/getcreatetaskinfo", param)
}
export const getalltasklist = (param) => {
    return Post("account/getalltasklist", param)
}
export const submitcreatetask = (param) => {
    return Post("account/submitcreatetask", param)
}
export const setappuserlanguage = (param) => {
    return Post("account/setappuserlanguage", param)
}





