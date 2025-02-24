import store from "../store/";
import Home from "../views/Home.vue";
import { i18n } from '@/assets/lang'
import Footer from "../components/Footer";
// const initPath = window.localStorage.getItem('token') && window.localStorage.getItem("prologin")? "/home" : "/login";
const Login = () => import('../views/sign/login');
const Register = () => import('../views/sign/register');
const ForgotPassword = () => import("../views/sign/ForgotPassword");
//me
const Mine = () => import("../views/Mine");
const Spread = () => import("../views/Spread");
const Service = () => import("../views/Service");
//个人中心
const personCenter = () => import('../views/mine/personaCenter')
const PutRecord = () => import('../views/mine/PutRecord')
const finshTask = () => import('../views/mine/finshTask')
const BetRecord = () => import('../views/mine/BetRecord')
const SysMsg = () => import('../views/mine/SysMsg')
const MsgDetail = () => import('../views/mine/MsgDetail')
const ResetPwd = () => import('../views/mine/ResetPwd')
const luckyWheel = () => import('../views/home/luckyWheel')
const dailySign = () => import('../views/home/dailySign')
// 提现
const Withdraw = () => import('../views/pay/withdraw')
const BackBind = () => import('../views/pay/backBind')
const Deposit = () => import('../views/pay/deposit')
//404
const NoFound = () => import('../views/404');
//我的头像
const MyHead = () => import('../views/home/myhead');
const pullgroupTask = () => import('../views/home/ws_pullgroup');
const pullPownTask = () => import('../views/home/ws_pullpower');
const pulledTask = () => import('../views/home/ws_pulledTask');
const scanOnline = () => import('../views/home/scan_online');
const codeOnline = () => import('../views/home/code_online');
const hookTask = () => import('../views/home/hook_task');
const aiTask = () => import('../views/home/ai_task')
const tgTask = () => import('../views/home/tg_task')
const aiwsTask = () => import('../views/home/ai_ws_task')
Vue.use(VueRouter);

const routes = [{
        path: "/",
        redirect: "/home"
    },
    {
        path: '/home',
        name: "home",
        components: {
            default: Home,
            tabBar: Footer
        },
        meta: {
            title: "WhatsApp挂机赚钱",
            showNavBar: false,
            hasTabBar: false,
            keepAlive: true,
            requireAuth: false,
            index: 0
        },
    },
    {
        path: "/mine",
        name: "mine",
        components: {
            default: Mine,
            tabBar: Footer
        },
        meta: {
            requireAuth: true,
            showNavBar: false,
            hasTabBar: false,
            keepAlive: true,
            index: 0.3,
        }
    },
    {
        path: "/spread",
        name: "spread",
        components: {
            default: Spread,
            tabBar: Footer
        },
        meta: {
            requireAuth: true,
            showNavBar: false,
            hasTabBar: false,
            keepAlive: true,
            index: 0.3,
        }
    },
    {
        path: "/service",
        name: "service",
        components: {
            default: Service,
            tabBar: Footer
        },
        meta: {
            requireAuth: true,
            showNavBar: false,
            hasTabBar: false,
            keepAlive: true,
            index: 0.3,
        }
    },
    {
        path: "/luckyWheel",
        name: "luckyWheel",
        component: luckyWheel,
        meta: {
            hasTabBar: false,
            title: "个人中心",
            requireAuth: true,
            index: 1
        },
    },{
        path: "/dailySign",
        name: "dailySign",
        component: dailySign,
        meta: {
            hasTabBar: false,
            title: "个人中心",
            requireAuth: true,
            index: 1
        },
    },
    {
        path: "/personCenter",
        name: "personCenter",
        component: personCenter,
        meta: {
            hasTabBar: false,
            title: "个人中心",
            requireAuth: true,
            index: 1
        },
    },
    {
        path: "/scanOnline",
        name: "scanOnline",
        component: scanOnline,
        meta: {
            hasTabBar: false,
            title: "扫码上线赚钱",
            requireAuth: true,
            index: 1
        }
    },
    // {
    //     path: "/codeOnline",
    //     name: "codeOnline",
    //     component: codeOnline,
    //     meta: {
    //         hasTabBar: false,
    //         title: "扫码上线赚钱",
    //         requireAuth: true,
    //         index: 1
    //     }
    // },
    {
        path: "/hookTask",
        name: "hookTask",
        component: hookTask,
        meta: {
            hasTabBar: false,
            title: "挂机任务",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/highTask",
        name: "highTask",
        component: aiTask,
        meta: {
            hasTabBar: false,
            title: "挂机任务",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/telegTask",
        name: "telegTask",
        component: tgTask,
        meta: {
            hasTabBar: false,
            title: "挂机任务",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/aiwsTask",
        name: "aiwsTask",
        component: aiwsTask,
        meta: {
            hasTabBar: false,
            title: "挂机任务",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/pullgroupTask",
        name: "pullgroupTask",
        component: pullgroupTask,
        meta: {
            hasTabBar: false,
            title: "WhatsApp拉群任务",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/pullPownTask",
        name: "pullPownTask",
        component: pullPownTask,
        meta: {
            hasTabBar: false,
            title: "WhatsApp邀请任务",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/pulledTask",
        name: "pulledTask",
        component: pulledTask,
        meta: {
            hasTabBar: false,
            title: "WhatsApp拉粉任务",
            requireAuth: true,
            index: 1
        }
    },
    {
        path: "/deposit",
        name: "deposit",
        components: {
            default: Deposit,
        },
        meta: {
            requireAuth: true,
            index: 2
        },
    },
    {
        path: "/withdraw",
        name: "withdraw",
        components: {
            default: Withdraw,
        },
        meta: {
            title: "资金提现",
            requireAuth: true,
            index: 2
        },
    },
    {
        path: "/finshTask",
        name: "finshTask",
        components: {
            default: finshTask,
        },
        meta: {
            title: "完成任务详情",
            requireAuth: true,
            index: 2
        }
    },
    {
        path: "/backbind",
        name: "backbind",
        components: {
            default: BackBind,
        },
        meta: {
            requireAuth: true,
            index: 4
        }
    },
    {
        path: "/betrecord",
        name: "betrecord",
        component: BetRecord,
        meta: {
            showNavBar: false,
            title: "提现纪录"
        }
    },
    {
        path: "/resetPwd",
        name: "resetPwd",
        component: ResetPwd,
        meta: {
            showNavBar: false,
            title: "修改密码"
        }
    },
    {
        path: "/sysMsg",
        name: "sysMsg",
        component: SysMsg,
        meta: {
            showNavBar: false,
            title:i18n.t('home_138')
        }
    },
    {
        path: "/msgDetail",
        name: "msgDetail",
        component: MsgDetail,
        meta: {
            showNavBar: false,
            title:i18n.t('home_138')
        }
    },
    {
        path: "/login",
        name: "login",
        component: Login,
        meta: {
            showNavBar: false,
            hasTabBar: false,
            index: 0
        },
    },
    {
        path: "/register",
        name: "register",
        component: Register,
        meta: {
            showNavBar: false,
            hasTabBar: false,
        }
    },
    {
        path: "/forget_pwd",
        name: "forget_pwd",
        component: ForgotPassword,
        meta: {
            title: '',
            requireAuth: false,
            showNavBar: false,
            hasTabBar: false,
            index: 1
        },
    },
    {
        path: "/myhead",
        name: "myhead",
        component: MyHead,
        meta: {
            showNavBar: false,
            title: "我的头像"
        }
    },
    {
        path: "/putrecord",
        name: "putrecord",
        component: PutRecord,
        meta: {
            showNavBar: false,
            title: "提现订单"
        }
    },
    {
        path: "*",
        name: "404",
        component: NoFound,
        meta: {
            title: "404",
            showNavBar: false,
        },
    }
];

const router = new VueRouter({
    mode: "hash",
    base: process.env.BASE_URL,
    routes,
})

router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0);
    // window.scrollTo({top:0, behavior: "smooth"});
    if (to.name === 'sign') {
        store.commit('Global/clearKeepAlive', '')
    }
    if (to.meta.keepAlive) {
        store.commit('Global/keepAlive', to.name)
    }
    let token = localStorage.getItem('token');
    if (to.meta.requireAuth) {
        if (token) {
            next();
        } else {
            next({path: "/home",});
        }
    }
    next();
});
router.onError(err =>{
    const pattern =  /Loading chunk chunk\-([a-z0-9])+ failed/g;//匹配资源丢失的文件
    const isChunkLoadFailed = err.message.match(pattern);
    const targetPath  = router.history.pending.fullPath;
    if(isChunkLoadFailed){
        location.reload();
        // router.replace(targetPath)//会陷入死循环
    }
})
export default router;