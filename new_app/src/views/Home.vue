<template>
    <div class="home_warp w_f" ref="warpBox">
        <page-header :title="$t('login_027')" :showBack="false" :rightIcon="true" />
        <div class="warp_mian w_f flex-item flex-dir-c head_title_top">
            <div class="ui_time flex-item flex-center font_50">Ultimate Wealth Challenge</div>
            <div class="notice_warp">
                <div class="notice_mian">
                    <img class="left_icon" src="@/assets/images/home/news_icon.png">
                    <van-notice-bar :scrollable="false">
                        <van-swipe vertical style="height: 24px;" :autoplay="3000" :show-indicators="false"  >
                            <van-swipe-item v-for="(item,idx) in winNotis" :key="idx">{{ item }}</van-swipe-item>
                        </van-swipe>
                    </van-notice-bar>
                </div>
            </div>
            <div class="adv_warp w_f flex-item">
                <div class="adv_text">
                    <h2 class="font_32">CashCow</h2>
                    <p class="flex-item">Do the tasks well</p>
                    <p class="flex-item">get your cash quickly</p>
                </div>
                <div class="adv_img">
                    <img src="@/assets/images/home/money_01.png" alt="" srcset="">
                </div>
            </div>
            <div class="task_main w_f flex-item flex-dir-c">
                <div class="task_item w_f flex-item flex-dir-c font_34" v-for="(item,idx) in taskOption" :key="idx" @click="handleTask(item)">
                    <div class="task_name">{{taskNameOption[item.type].name}}</div>
                    <div class="task_award font_30">
                        <div v-html="$t(taskNameOption[item.type].award)"></div>
                        <van-count-down v-if="item.invalid_time" :time="item.invalid_time/1000" />
                        <van-button v-if="item.type==3" :class="[item.status==2?'progress_award':'']" type="primary">{{taskStatusOption[item.status]}}</van-button>
                        <van-button v-else type="primary">{{taskNameOption[item.type].btn}}</van-button>
                    </div>
                    <div class="task_desc font_24">{{taskNameOption[item.type].desc}}</div>
                </div>
            </div>
            <div class="record_warp w_f flex-item" v-if="userInfo.token">
                <div class="today_record w_f flex-item flex-align flex-dir-c">
                    <div class="top_title w_f flex-item flex-align flex-center font_32">Today's performance</div>
                    <div class="self_code w_f flex-item flex-dir-c">
                        <p class="font_32">{{ userInfo.account}}</p>
                        <div class="self_code_mess w_f flex-item flex-align flex-between">
                            <div class="flex-item font_24">Your current invite code ：<span class="flex-item">{{userInfo.inviteCode }}</span></div>
                            <van-button class="font_20" type="primary">{{$t('other_006')}}</van-button>
                        </div>
                    </div>
                    <div class="self_jinbi w_f flex-item">
                        <div class="self_item w_f flex-item flex-dir-c">
                            <div class="self_dold flex-item flex-center">{{ teamStemp.task_income || 0.00 }}</div>
                            <div class="task_type flex-item flex-center flex-align" @click="showTask(1)">
                                <span class="font_28">Task Earnings</span>
                                <img class="more_icon" src="@/assets/images/home/more_icon.png" alt="" srcset="">
                            </div>
                        </div>
                        <div class="self_item w_f flex-item flex-dir-c">
                            <div class="self_dold flex-item flex-center">{{ teamStemp.promotion_income || 0.00 }}</div>
                            <div class="flex-item flex-center flex-align" @click="showTask(2)">
                                <span class="task_type font_28">Millionaire Earnings</span>
                                <img class="more_icon" src="@/assets/images/home/more_icon.png" alt="" srcset="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <drag-icon ref="dragIconCom" :gapWidthPx="30" :coefficientHeight="0.68">
            <div class="serve_icon" slot="icon" @click="$Helper.globalSupport()">
                <img src="../assets/images/ms_serve.png" alt="" />
            </div>
        </drag-icon> -->
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { getToken } from '@/utils/tool';
import uniFun from "@/utils/uni-webview-js"
import PageHeader from "@/components/Header";
import dragIcon from "../components/dragIcon.vue";
import { getaccountincome, gettodayincome, gettaskliststatus, getalltasklist, setappuserlanguage, gethelp } from '@/api/home'
export default {
    name: 'home',
    components: {PageHeader},
    data() {
        return {
            isLogin:false,
            visible:true,
            user_money: 0,
            teamStemp: "",
            help_url: "",
            taskOption: [],
            langIdx: Cookies.get("language") || 'en',
            taskType: ['', 'scanOnline', 'spread', 'pullgroupTask'],
            langOptions: [{ lang: "en", name: "en-US" }, { lang: "zh", name: "zh_CN" }],
            animationStyle: {
                animation: 'scrolling 5s linear infinite',
            }
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.User,
            // moticeText: state => state.User.baseInfo.bulletin_content,
        }),
        taskNameOption() {
            return [
                {},
                {name:this.$t('home_046'),type:3,status:null,task_info_id:null,award:this.$t('home_048',{value:888}),btn:this.$t('home_058'),desc:this.$t('home_051')},
                {name:this.$t('home_045'),type:2,status:null,task_info_id:null,award:this.$t('home_047',{value:888}),btn:this.$t('home_057'),desc:this.$t('home_050')},
                {name:this.$t('home_044'),type:1,status:null,task_info_id:null,award:this.$t('home_047',{value:999}),btn:this.$t('home_056'),desc:this.$t('home_049')}
            ]
        },
        taskStatusOption() {
            return ["", this.$t('home_005'), this.$t('home_006'), this.$t('home_007'), this.$t('home_008')]
        },
        winNotis(){
            return this.$Helper.randomStrings(100)
        }
    },
    created(){
        this.moveNews.$on("login-env",res=>{
            this.initHandle();
        })
        this.moveNews.$on("login-cover",res=>{
            this.$store.dispatch('Global/isShowLogin',{type:2,isShow:true})
        })
    },
    activated() {
        if(getToken()){
           this.initHandle();
        }else{
            this.initRuleTips();
            this.taskOption= this.$Helper.defaultOption();
        }
    },
    methods: {
        initHandle(){
            this.syncInitApi();
            this.initRuleTips();
        },
        initRuleTips(){
            // console.log("8888");
            // this.$nextTick(() => {
            //     const isTips = JSON.parse(localStorage.getItem('is_play'));
            //     if (!isTips) {
            //         this.$popDialog({ content: this.help_url, title: this.$t("other_051"), type: 3 })
            //     }
            // },600)
            setTimeout(() => {
                const isTips = JSON.parse(localStorage.getItem('is_play'));
                if (!isTips) {
                    this.$popDialog({ content: this.help_url, title: this.$t("other_051"), type: 3 })
                }
            }, 600);
        },
        syncInitApi() {
            let fun1 = new Promise((resolve, reject) => {
                getaccountincome().then(res => {
                    resolve(res)
                })
            });
            let fun2 = new Promise((resolve, reject) => {
                gettodayincome().then(res => {
                    resolve(res)
                })
            });
            let fun3 = new Promise((resolve, reject) => {
                gettaskliststatus().then(res => {
                    resolve(res)
                })
            });
            Promise.all([fun1, fun2, fun3]).then(res => {
                const [{ income }, data2, data3] = res;
                this.user_money = income;
                this.teamStemp = data2;
                this.taskOption = data3.list;
            })
        },
        showRule(){
            this.$popDialog({ content: this.help_url, title: this.$t("other_051"), type: 3 })
        },
        async getHelpServe() {
            const { url } = await gethelp();
            this.help_url = url || "";
        },
        copySuccess() {
            this.$toast(`${this.$t("other_044")}`);
        },
        async onChangeType(row) {
            this.langIdx = row.lang;
            this.$i18n.locale = row.lang;
            Cookies.set("language", row.lang);
            await setappuserlanguage({ language: row.lang });
            await this.$store.dispatch('User/plantCarousel');
        },
        handleTask(row) {
            if (!getToken()) return this.$store.dispatch('Global/isShowLogin',{type:1,isShow:true});
            const path = this.taskType[row.type];
            if (row.type == 2) {
                this.$router.push(path);
            }else{
                this.$router.push(`${path}?id=${row.task_info_id}`);
            }
        },
        viewLang() {
            let lang = this.langOptions.find(item => item.lang == this.langIdx);
            return lang.name
        },
        jumpLink(path) {
            if (!path) return;
            if (this.$Helper.checkBrowser()) {
                window.open(path, "_blank");
            } else {
                uniFun.postMessage({ data: path });
            }
        },
        showTask(idx){
            this.$router.push(`/betrecord?id=1`);
        }
    }
};
</script>
<style lang="scss" scoped>
.home_warp {
    position: relative;
    padding-bottom: 140px;
    background: url('../assets/images/home/bg_img.png') no-repeat;
    background-size: cover;
    -webkit-overflow-scrolling: touch;
    .warp_mian {
        .logo_title {
            position: relative;
            color: $font-color-white;
            margin-top: 60px;
            font-weight: bold;
            span{
                font-style: italic;
                position: absolute;
                top: 50%;
                right: 36px;
                transform: translateY(-50%);
            }
        }

        .ui_time {
            font-weight: bold;
            color: $home-title-01;
            margin-top: 50px;
            text-shadow: 0px 8px 3px #005440;
        }

        .notice_warp {
            padding: 0 70px;
            margin-top: 50px;
            position: relative;
            box-sizing: border-box;
            .left_icon{
                position: absolute;
                height: 58px;
                top: 50%;
                left: 95px;
                z-index: 1;
                transform: translateY(-50%);
            }
            .notice_mian{
                max-width: 540px;
                overflow: hidden;
                border-radius: 60px;
                margin: 0 auto;
                .van-notice-bar{
                    height: 26px;
                    padding: 0 4px 0 20px;
                    color: $color-theme;
                    background-color: #86c6af;
                }
                ::v-deep .van-swipe__track{
                    height: 26px !important;
                    line-height: 26px;
                    text-align: center;
                }
                .van-swipe-item{
                    height: 26px;
                    line-height: 26px;
                    margin-left: 2px;
                    color: $color-theme;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
        .adv_warp{
            // height: 360px;
            padding-left: 30px;
            align-items: center;
            margin-top: 10px;
            .adv_text{
                flex-grow:1;
                color: $font-color-white;
                text-shadow: 0px 8px 3px #005440;
                h2{
                    font-size: 64px;
                    font-weight: bold; 
                    margin-top: -70px;
                    margin-bottom: 10px;
                }
                p{
                    font-weight: bold;
                    font-size: 38px;
                    line-height: 62px;
                }
                p:nth-child(3){
                    margin-right: -80px;
                }
            }
            .adv_img{
                flex-shrink: 0;
                img{
                    height: 306px;
                }
            }
        }
        .task_main{
            padding: 0 30px;
            gap: 30px;
            box-sizing: border-box;
            background: url('../assets/images/home/jinbi.png') no-repeat;
            background-size: cover;
            background-position: 0 40px;
            .task_item{
                height: 250.8px;
                padding: 35px 0 0 20px;
                background: url('../assets/images/home/task_icon.png') no-repeat;
                background-size: 100% 100%;
                .task_name{
                    color: $color-theme;
                    font-weight: 900;
                    margin-bottom: 24px;
                    text-shadow: 0px 3px 3px #005440;
                }
                .task_award{
                    position: relative;
                    color: $font-color-black;
                    margin-bottom: 10px;
                    .award_money{
                        font-weight: bold;
                        color: $home-title-02;
                    }
                    .van-count-down{
                        position: absolute;
                        top: -23px;
                        right: 41px;
                        z-index: 9;
                        font-weight: 700;
                        font-size: 12px !important;
                        color: $home-title-02;
                    }
                    .van-button{
                        width: 114px;
                        padding: 0;
                        position: absolute;
                        top: -4px;
                        right: 10px;
                        height: 30px;
                        line-height: 30px;
                        border-radius: 100px;
                        color: $font-color-white;
                        border-color: $color-theme;
                        background-color: $color-theme;
                    }
                    .progress_award{
                        border-color: $home-title-06;
                        background-color: $home-title-06;
                    }
                }
                .task_desc{
                    margin-top: 6px;
                    line-height: 32px;
                    color: $home-title-03;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
        .record_warp{
            padding: 0 30px;
            margin-top: 32px;
            box-sizing: border-box;
            .today_record{
                padding: 0 30px 18px 30px;
                border-radius: 32px;
                box-sizing: border-box;
                background: $font-color-white;
                .top_title{
                    width: 566px;
                    height: 82px;
                    color: $font-color-black;
                    font-weight: 510;
                    margin-bottom: 26px;
                    background: url('../assets/images/home/today_icon.png') no-repeat;
                    background-size: cover;
                }
                .self_code{
                    padding: 36px 40px;
                    border-radius: 20px;
                    box-sizing: border-box;
                    background: $home-title-11;
                    p{
                        font-weight: bold;
                        margin-bottom: 14px;
                        color: $home-title-12;
                    }
                    .self_code_mess{
                        color: $home-title-12;
                        span{
                            font-weight: bold;
                        }
                    }
                    .van-button{
                        height: 22px;
                        padding: 0 8px;
                        border-radius: 100px;
                        border-color: $color-theme;
                        background-color: $color-theme;
                    }
                }
                .self_jinbi{
                    .self_item{
                        flex: 1;
                        color: $home-title-12;
                        padding-bottom: 20px;
                        .self_dold{
                            font-weight: 700;
                            margin: 46px 0 16px 0;
                        }
                        .task_type{
                            color: $home-title-06;
                        }
                        .more_icon{
                            height: 24px;
                            margin-left: 4px;
                        }
                    }
                }
            }
        }
    }
    .serve_icon{
        img{
            height: 80px;
        }
    }
}
</style>
