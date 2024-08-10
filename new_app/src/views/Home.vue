<template>
    <div class="home_warp w_f" @click="isIndex = false" ref="warpBox" @scroll="handleScrolStop">
        <div class="warp_mian w_f flex-item flex-dir-c head_title_top">
            <div class="logo_title w_f flex-item flex-center font_36">
                {{$t('login_027')}}
                <!-- <img src="@/assets/images/home/h_login.png" alt="" srcset=""> -->
                <span class="flex-item font_32" @click="showRule">{{$t('other_051')}}</span>
            </div>
            <div class="ui_time flex-item flex-center font_50">Ultimate Wealth Challenge</div>
            <div class="notice_warp w_f">
                <div class="notice_mian w_f">
                    <img class="left_icon" src="@/assets/images/home/news_icon.png" alt="" srcset="">
                    <van-notice-bar :scrollable="false">
                        <van-swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
                            <van-swipe-item>Alexander Complet tasks to earn ₦999.00</van-swipe-item>
                            <van-swipe-item>Alexander Complet tasks to earn ₦999.00</van-swipe-item>
                            <van-swipe-item>Alexander Complet tasks to earn ₦999.00</van-swipe-item>
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
                        <van-button type="primary">{{taskNameOption[item.type].btn}}</van-button>
                    </div>
                    <div class="task_desc font_24">{{taskNameOption[item.type].desc}}</div>
                </div>
            </div>
            <div class="record_warp w_f flex-item">
                <div class="today_record w_f flex-item flex-align flex-dir-c">
                    <div class="top_title w_f flex-item flex-align flex-center font_32">Today's performance</div>
                    <div class="self_code w_f flex-item flex-dir-c">
                        <p class="font_32">Alexander</p>
                        <div class="w_f flex-item flex-align flex-between">
                            <span class="font_24">Your current invite code : Alexander</span>
                            <van-button class="font_20" type="primary">{{$t('other_006')}}</van-button>
                        </div>
                    </div>
                    <div class="self_jinbi w_f flex-item">
                        <div class="self_item w_f flex-item flex-dir-c">
                            <div class="self_dold flex-item flex-center">999.00</div>
                            <div class="flex-item flex-center flex-align">
                                <span class="font_28">Task Earnings</span>
                                <img class="more_icon" src="@/assets/images/home/more_icon.png" alt="" srcset="">
                            </div>
                        </div>
                         <div class="self_item w_f flex-item flex-dir-c">
                            <div class="self_dold flex-item flex-center">999.00</div>
                            <div class="flex-item flex-center flex-align">
                                <span class="font_28">Millionaire Earnings</span>
                                <img class="more_icon" src="@/assets/images/home/more_icon.png" alt="" srcset="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import uniFun from "@/utils/uni-webview-js"
// import dragIcon from "../components/dragIcon.vue";
import { getaccountincome, gettodayincome, gettaskliststatus, getalltasklist, setappuserlanguage, gethelp } from '@/api/home'
export default {
    name: 'home',
    // components: {dragIcon},
    data() {
        return {
            isScroll: false,
            isIndex: false,
            user_money: 0,
            teamStemp: "",
            help_url: "",
            taskOption: [],
            langIdx: Cookies.get("language") || 'en',
            taskType: ['', 'scanOnline', 'pullPownTask', 'pullgroupTask'],
            langOptions: [{ lang: "en", name: "en-US" }, { lang: "zh", name: "zh_CN" }]
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
                {name:this.$t('home_044'),type:2,status:null,task_info_id:null,award:this.$t('home_047',{value:50}),btn:this.$t('home_056'),desc:this.$t('home_049')},
                {name:this.$t('home_045'),type:3,status:null,task_info_id:null,award:this.$t('home_047',{value:70}),btn:this.$t('home_057'),desc:this.$t('home_050')},
                {name:this.$t('home_046'),type:1,status:null,task_info_id:null,award:this.$t('home_048',{value:90}),btn:this.$t('home_058'),desc:this.$t('home_051')}
            ]
        },
        taskStatusOption() {
            return ["", this.$t('home_005'), this.$t('home_006'), this.$t('home_007'), this.$t('home_008')]
        }
    },
    created() {
        // this.$store.dispatch('User/getUserHead');
        // this.getHelpServe();
        // this.$store.dispatch('User/plantCarousel');
    },
    activated() {
        // this.syncInitApi();
        this.isIndex = false;
        this.isScroll = false;
        if (JSON.parse(window.localStorage.getItem('is_play'))) {
            setTimeout(() => {
                this.$popDialog({ content: this.help_url, title: this.$t("serv_004"), type: 1 })
            }, 500)
        }
    },
    methods: {
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
            let fun4 = new Promise((resolve, reject) => {
                getalltasklist().then(res => {
                    resolve(res)
                })
            });
            Promise.all([fun1, fun2, fun3, fun4]).then(res => {
                const [{ income }, data2, data3, data4, data5] = res;
                this.user_money = income;
                this.teamStemp = data2;
                this.taskOption = [...data3.list, ...data4.list];
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
        showChangeBtn() {
            this.isIndex = !this.isIndex;
        },
        async onChangeType(row) {
            this.langIdx = row.lang;
            this.$i18n.locale = row.lang;
            Cookies.set("language", row.lang);
            await setappuserlanguage({ language: row.lang });
            await this.$store.dispatch('User/plantCarousel');
        },
        handleTask(row) {
            const path = this.taskType[row.type];
            this.$router.push(`${path}?id=${row.task_info_id}`)
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
        handleScrolStop() {
            let scrollTop = this.$refs.warpBox;
            if (scrollTop.scrollTop >= 100) {
                this.isScroll = true;
            } else {
                this.isScroll = false;
            }
        },
        scrollTopBtn() {
            this.isScroll = false;
            let scrollTop = this.$refs.warpBox;
            scrollTop.scrollTo({ top: 0, behavior: "smooth" });
        },
        contactService() {
            if (this.$Helper.checkBrowser()) {
                window.open("https://wa.me/447377675671", "_blank");
            } else {
                uniFun.postMessage({ data: "https://wa.me/447377675671" });
            }
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
            position: relative;
            padding: 0 70px;
            margin-top: 50px;
            box-sizing: border-box;
            .notice_mian{
                overflow: hidden;
                border-radius: 60px;
                .van-notice-bar{
                    height: 26px;
                    padding: 0 4px 0 20px;
                    color: $color-theme;
                    background-color: $home-title-04;
                }
                ::v-deep .van-swipe__track{
                    height: 26px !important;
                    line-height: 26px;
                    text-align: center;
                }
            }
            .left_icon{
                position: absolute;
                height: 58px;
                top: 50%;
                left: 50px;
                z-index: 1;
                transform: translateY(-50%);
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
                    margin-bottom: 20px;
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
                    .van-button{
                        width: 114px;
                        padding: 0;
                        position: absolute;
                        top: -10px;
                        right: 10px;
                        height: 30px;
                        line-height: 30px;
                        border-radius: 100px;
                        color: $font-color-white;
                        border-color: $color-theme;
                        background-color: $color-theme;
                    }
                }
                .task_desc{
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
                        font-weight: 500;
                        margin-bottom: 14px;
                        color: $home-title-12;
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
                        .more_icon{
                            height: 24px;
                            margin-left: 4px;
                        }
                    }
                }
            }
        }
    }
}
</style>
