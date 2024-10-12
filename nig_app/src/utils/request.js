import axios from 'axios'
import { Dialog } from 'vant';
import { i18n } from '@/assets/lang'
import { getToken } from '@/utils/tool';
import scehelper from '@/utils/helper';
const port = process.env.VUE_APP_PORT;
const devType = process.env.VUE_APP_ENV;
const pro_url = `${location.protocol}//${location.host}${port}`;
const address = `${location.protocol}//${location.host.split(":").shift()}${port}`;
const baseURL = devType=="dev"?"/api/":devType=="test"?address:`${pro_url}`;

const service = axios.create({baseURL:baseURL,timeout: 8000});
service.interceptors.request.use(config => {
    config.method = config.method || 'get'
    config.headers = {
      'Content-Type': 'text/plain;charset=utf-8',
      ...config.headers
    }
    if(config.method.toLowerCase() === 'get'){
      config.params = config.data;
    }
    if(config.url.includes("$")){
      config.data = scehelper.aesEncrptMsg(JSON.stringify(config.data));
      const rest_url = config.url.replace("$","");
      config.url = getToken()?`${rest_url}?token=${getToken()}`:rest_url;
    }else{
      config.url = getToken()?`${config.url}?token=${getToken()}`:config.url;
    }
    return config;
  },error => {
    console.log(error)
    Promise.reject(error)
  }
)
service.interceptors.response.use(res => {
  if (res.status == 200) {
      let data = res.data;
      if(data.code == 0){
        return data.data;
      }else if(data.code == 401){
        Dialog.confirm({
          title: i18n.t('other_008'),
          message: i18n.t('other_046'),
          closeOnClickOverlay: true,
          showCancelButton:false,
          confirmButtonColor: "#ff9600",
          confirmButtonText: i18n.t('other_003'),
        }).then(() => {
          window.location.reload(true);
          // window.localStorage.clear();
          window.localStorage.removeItem('uid');
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('account');
          window.localStorage.removeItem('inviteCode');
          window.likevm.$router.replace('/home');
        })
      }else{
        vant.Toast.fail(data.msg);
        return data;
      }
    } else {
      vant.Toast.fail(data.msg);
      localStorage.clear();
      localStorage.removeItem('token');
      if(!window.location.href.includes("/home")){
        setTimeout(() => {
          window.likevm.$router.replace('/home');
        },1000);
      }
    }
  },error => {
    vant.Toast.fail(i18n.t('other_047'));
    // Message({ message: error.message, type: 'error',duration: 5*1000})
    // return Promise.reject(new Error(error));
  }
)
export default service