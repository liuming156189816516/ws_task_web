import axios from 'axios'
import { i18n } from '@/assets/lang'
import { getToken } from '@/utils/tool';
import scehelper from '@/utils/helper';
const port = process.env.VUE_APP_PORT;
const devType = process.env.VUE_APP_ENV;
const address = location.host.split(":").shift()+port;
const pro_url = `${location.protocol}//${location.host}${port}`;
const baseURL = devType=="dev"?"/api/":devType=="test"?`${location.protocol}//${address}`:`${pro_url}`;

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
      //   this.$dialog.confirm({
      //     title: this.$t("other_008"),
      //     message: this.$t("other_009"),
      //     confirmButtonColor: "#ff9600",
      //     confirmButtonText: this.$t("other_003"),
      //     cancelButtonText: this.$t("other_007")
      // }).then(() => {
      //     this.$store.dispatch("User/logoutUser");
      //     var storage = window.localStorage;
      //     storage["isstorename"] =  "no";
      // })
        vant.Toast(i18n.t('other_046'));
        localStorage.clear();
        localStorage.removeItem('token');
        setTimeout(() => {
          window.likevm.$router.replace('/login');
        }, 1000);
      }
    } else {
      vant.Toast.fail(res.data.msg);
      localStorage.clear();
      localStorage.removeItem('token');
      setTimeout(() => {
        window.likevm.$router.replace('/login');
      },1000);
    }
  },error => {
    vant.Toast.fail(i18n.t('other_047'));
    // Message({ message: error.message, type: 'error',duration: 5*1000})
    // return Promise.reject(new Error(error));
  }
)
export default service