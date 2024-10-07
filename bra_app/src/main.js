
import App from "./App.vue";
import router from "./router";
import store from "./store";
import filters from './utils/filters';
import Helper from './utils/helper';
import Global from "./core/Global"
import situantpop  from '@/components/Dialog/Dialog'
import popDialog  from '@/components/popDialog'
import './assets/iconfont/iconfont.css';
import VueLuckyCanvas from '@lucky-canvas/vue';
window.Global = Global
Global.setup();
// 导入资源文件
import { i18n, vantLocales } from './assets/lang'
import DrowDownComponent from "@/components/dropdown"
import scroll from "@/components/scroll"
Vue.prototype.$Helper = Helper;
Vue.config.productionTip = false;
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
import "./assets/styles/common.css";
import "./assets/styles/icon.css";
import 'amfe-flexible/index.js';
// import "swiper/css/swiper.min.css";
import "./utils/pcRem"
import "./utils/setInterval"

import Vue from 'vue'
import VueIntroStep from 'vue-intro-step'

Vue.component('vue-intro-step', VueIntroStep);
Vue.use(VueLuckyCanvas);
Vue.component("popDialog", popDialog)
Vue.prototype.$popDialog = situantpop.install
Vue.component("Scroll", scroll)
Vue.component("drop-down", DrowDownComponent)
Vue.prototype.moveNews = new Vue();
vantLocales(i18n.locale)
import 'animate.css'

import JsonExcel from 'vue-json-excel'
import { Popover, Calendar  } from 'vant';
Vue.prototype.EventBus = new Vue();

Vue.use(Popover).use(Calendar);
Vue.component('downloadExcel', JsonExcel)
Vue.prototype.$isShouDong = false

window.likevm = new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount("#app");