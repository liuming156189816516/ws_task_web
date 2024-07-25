import axios from "./axios";
import { i18n } from '@/assets/lang'
export const cloudPath = () => {
    let seeeionToken = "";
    if(JSON.parse(sessionStorage.getItem("cloudStorage")) != undefined && JSON.parse(sessionStorage.getItem("cloudStorage")) != null){
        seeeionToken = JSON.parse(sessionStorage.getItem("cloudStorage")).img_url;
    }
    return seeeionToken;
    // return `htps:${seeeionToken.bucket}.cos.${seeeionToken.region}.myqcloud.com`;
};
let index = 0;
const Post = (func, data = {}, conf = {}) => {
    return new Promise((resolve, reject) => {
        ProMisePost(func, data,conf,resolve, reject)
    })
}

// const rupRequestUrl = () => {
//     let arr;
//     if (process.env.NODE_ENV != 'development' && process.env.VUE_APP_FLAG == 'pro') {
//         if (window.envInfo.releaseappInfo && window.envInfo.releaseappInfo.app_url && window.envInfo.releaseappInfo.app_url.length > 0) {
//             arr = window.envInfo.releaseappInfo.app_url
//         } else {
//             arr = window.envInfo.http
//         }
//     } else {
//         arr = window.envInfo.testappInfo.app_url
//     }
//     const num = Math.random()
//     if(num > 0.5){
//         arr = arr.reverse()
//     }
// }
// rupRequestUrl()

const ProMisePost = (func, data = {}, conf = {},resolve, reject)=>{
    let url,baseUrl;
    let config = {sendToken: true,...conf}
    data.httpRequestIndex = data.httpRequestIndex == undefined ? index : data.httpRequestIndex;
    data.httpRequestCount = data.httpRequestCount || 0;
    console.log(location.protocol);
    console.log(process.env.NODE_ENV);
    if(process.env.NODE_ENV == 'development'){
        url = process.env.VUE_APP_APIURL;
    }else{
        const pro_url = `${location.protocol}//${location.host}`
        console.log(pro_url);
        url = location.protocol=='https:'?`${pro_url}:8096/`:pro_url;
        console.log(url);
    }
    console.log(url);
    // if (process.env.NODE_ENV != 'development' && process.env.VUE_APP_FLAG == 'pro') {
    //     if (window.envInfo.releaseappInfo && window.envInfo.releaseappInfo.app_url && window.envInfo.releaseappInfo.app_url.length > 0) {
    //         urls = window.envInfo.releaseappInfo.app_url
    //     } else {
    //         urls = window.envInfo.http
    //     }
    //     url = urls[data.httpRequestIndex] // 开发环境代理地址  intest 环境
    // } else {
    //     // console.log(process.env);
    //     // console.log(window.envInfo.testappInfo.app_url);
    //     // console.log(data.httpRequestIndex);
    //     // console.log("11");
    //     urls = window.envInfo.testappInfo.app_url
    //     // url = urls[data.httpRequestIndex]
    // }
    // 是否带上token
    if (config.sendToken) {
        let token = localStorage.getItem('token');
        baseUrl =`${url}${func}?token=${token}`;
    } else {
        baseUrl =`${url}${func}`
    }
    axios.request({url: baseUrl,data: data,method:'POST',timeout:func=="account/dowithdrawcard"?30000:8000}).then(res => {
        let data = res.data;
        if (data.code == 0) {
            resolve(data.data)
        } else if (data.code == 401) {
            vant.Toast(i18n.t('other_046'));
            sessionStorage.clear();
            localStorage.clear();
            setTimeout(() => {
                window.likevm.$router.replace('/login')
            }, 1000);
        } else {
            if (data.code != 513) {
                vant.Toast(data.msg);
            }
            resolve(data)
            reject(data.msg)
        }
    }).catch(err => {
        if (!err.message) return;
        data.httpRequestCount++;
        // console.log(data.httpRequestCount);
        // if (data.httpRequestCount >= urls.length||data.httpRequestCount > 5) {
        if (data.httpRequestCount > 5) {
            vant.Toast.fail(i18n.t('other_047'));
            // setTimeout(() => {
            //     vant.Toast.clear();
            // }, 1500);
            reject(err)
        } else {
            // data.httpRequestIndex = 0
            data.httpRequestIndex += 1;
            // if (data.httpRequestIndex == urls.length - 1) {
            //     data.httpRequestIndex = 0
            // } else {
            //     data.httpRequestIndex += 1;
            // }
            ProMisePost(func, data,conf,resolve, reject)
        }
    })
}
export default Post;