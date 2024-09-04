<style lang="scss" scoped>
    .down_app{
        height: 92px;
        overflow: hidden;
        position: relative;
        padding: 14px 20px 14px 30px;
        box-sizing: border-box;
        background: linear-gradient(90deg, #ff9600, #ff013d);
        .close_btn{
            width: 60px;
            height: 60px;
            position: absolute;
            top: -16px;
            left: -16px;
            font-weight: bold;
            padding: 8px 0 0 12px;
            box-sizing: border-box;
            color: $home-title-09;
            border-radius: 50%;
            background: rgba($color: hsl(0, 0%, 0%), $alpha: .3);
        }
        .down_text{
            font-weight: bold;
            color: $font-color-white;
        }
        .down_apk{
            min-width: 166px;
            height: 100%;
            padding: 0 10px;
            font-weight: 500;
            box-sizing: border-box;
            border-radius: 10px;
            color: $home-order-title;
            background: $font-color-white;
            img{
                height: 32px;
            }
        }
    }
</style>
<template>
    <div class="home_warp w_f" ref="warpBox" @click="isIndex=false">
        <div class="down_app w_f flex-item flex-align flex-between" v-if="showApk&&$Helper.checkBrowser()&&$Helper.isAndroid()">
            <span class="close_btn flex-item flex-align flex-center font_20" @click="showApk=false">✕</span>
            <div class="down_text font_24">{{$t('other_072',{value:5000})}}</div>
            <div class="down_apk flex-item flex-align flex-center font_24">
                <img src="@/assets/images/home/shouji.png" alt="" srcset="">
                {{$t('mine_009')}}
            </div>
        </div>
        <Sgin-header />
        <div class="warp_mian w_f flex-item flex-dir-c head_title_top">
            <div class="user_mess" v-if="userInfo.token">
                <div class="user_head">
                    <img :src="require(`../assets/images/head/${userInfo.avatar}.png`)" alt="" srcset="">
                </div>
                <div class="user_info">
                    <div class="user_name">{{ userInfo.account }}</div>
                    <div class="user_code">{{$t('login_012')}}：{{userInfo.inviteCode}} 
                        <span class="copay_text" v-clipboard:copy="userInfo.inviteCode" v-clipboard:success="copySuccess">{{$t('other_006')}}</span>
                    </div>
                </div>
                <div class="l_value" @click="showChangeBtn" @click.stop>
                    <span class="font_28">{{ viewLang() }}</span>
                    <img class="down_icon" src="../assets/images/home/down_arrow_white.png" alt="" srcset="">
                    <van-transition name="fade-up">
                        <div class="down_list" :class="isIndex?'active_open':'active_close'">
                            <p :class="[langIdx==item.lang?'select_active':'']" v-for="item in langOptions" :key="item.lang" @click="onChangeType(item)">{{item.name}}</p>
                        </div>
                    </van-transition>
                </div>
            </div>
            <div class="notice_warp">
                <van-swipe class="my_swipe" :autoplay="3500" indicator-color="white">
                    <van-swipe-item v-for="(item,idx) in userInfo.baseBanner||imagesList" :key="idx" @click="jumpLink(item.link)">
                        <img :src="item.file_url">
                    </van-swipe-item>
                </van-swipe>
            </div>
            <div class="adv_warp flex-item flex-between font_28">
                <div class="adv_item flex-item flex-align flex-center" @click="jumpLucky(0)">
                    {{$t('home_124')}}{{appLogin}}
                </div>
                <div class="adv_item flex-item flex-align flex-center" @click="jumpLucky(1)">
                    {{$t('home_125')}}
                </div>
            </div>
            <div class="task_main w_f flex-item flex-dir-c">
                <div class="task_item w_f flex-item flex-dir-c" v-for="(item,idx) in taskOption" :key="idx" @click="handleTask(item)">
                    <div class="task_name font_34">{{taskNameOption[item.type].name}}</div>
                    <div class="task_live flex-item flex-align font_22">
                        <div class="task_live_1 flex-item flex-align">
                            <span class="flex-item">{{$t('home_093')}}</span>
                            <img v-for="(v,i) in taskNameOption[item.type].live1" :key="i" src="@/assets/images/home/star_icon.png">
                        </div>
                        <div class="task_live_2 flex-item flex-align">
                            <span class="flex-item">{{$t('home_094')}}</span>
                            <img v-for="(v,i) in taskNameOption[item.type].live2" :key="i" src="@/assets/images/home/star_icon.png">
                        </div>
                    </div>
                    <div class="task_award flex-item font_24">
                        <div class="task_small_title" v-html="$t(taskNameOption[item.type].award)" style="font-weight: bold;"></div>
                        <van-count-down v-if="item.invalid_time" :time="(item.invalid_time-currentTime())*1000" />
                        <van-button v-if="item.type==3" :class="[item.status==2?'progress_award':'']" type="primary">{{taskStatusOption[item.status]}}</van-button>
                        <van-button v-else type="primary">{{taskNameOption[item.type].btn}}</van-button>
                    </div>
                </div>
            </div>
            <!-- <div class="record_warp w_f flex-item" v-if="userInfo.token">
                <div class="today_record w_f flex-item flex-align flex-dir-c">
                    <div class="top_title w_f flex-item flex-align flex-center font_32">{{$t('home_052')}}</div>
                    <div class="self_code w_f flex-item flex-dir-c">
                        <p class="font_32">{{ userInfo.account}}</p>
                        <div class="self_code_mess w_f flex-item flex-align flex-between">
                            <div class="flex-item font_24">{{$t('home_053')}}<span class="flex-item">{{userInfo.inviteCode }}</span></div>
                            <van-button class="font_20" type="primary">{{$t('other_006')}}</van-button>
                        </div>
                    </div>
                    <div class="self_jinbi w_f flex-item">
                        <div class="self_item w_f flex-item flex-dir-c">
                            <div class="self_dold flex-item flex-center">{{ teamStemp.task_income || 0.00 }}</div>
                            <div class="task_type flex-item flex-center flex-align" @click="showTask(1)">
                                <span class="font_28">{{$t('home_054')}}</span>
                                <img class="more_icon" src="@/assets/images/home/more_icon.png" alt="" srcset="">
                            </div>
                        </div>
                        <div class="self_item w_f flex-item flex-dir-c">
                            <div class="self_dold flex-item flex-center">{{ teamStemp.promotion_income || 0.00 }}</div>
                            <div class="flex-item flex-center flex-align" @click="showTask(2)">
                                <span class="task_type font_28">{{$t('home_055')}}</span>
                                <img class="more_icon" src="@/assets/images/home/more_icon.png" alt="" srcset="">
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
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
import SginHeader from "@/components/SginHeader";
import { gettaskliststatus,setappuserlanguage,gethelp } from '@/api/home'
export default {
    name: 'home',
    components: { SginHeader },
    data() {
        return {
            showApk:true,
            isLogin:false,
            visible:true,
            isIndex:false,
            user_money: 0,
            teamStemp: "",
            help_url: "",
            taskOption: [],
            langIdx:Cookies.get("language")||'es',
            taskType: ['', 'scanOnline', 'spread', 'pullgroupTask'],
            bannerList:[],
            imagesList:[
                {
                  link:"",
                  file_url:require("../assets/images/banner/banner1.png"),
                },
                {
                  link:"",
                  file_url:require("../assets/images/banner/banner2.png"),
                },
                {
                  link:"",
                  file_url:require("../assets/images/banner/banner3.png"),
                }
            ]
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
                {name:this.$t('home_089'),live1:1,live2:2,type:1,status:null,task_info_id:null,award:this.$t('home_048',{value:1999}),btn:this.$t('home_058'),desc:this.$t('home_051')},
                {name:this.$t('home_045'),live1:2,live2:4,type:2,status:null,task_info_id:null,award:this.$t('home_088',{value:'20%'}),btn:this.$t('home_057'),desc:this.$t('home_050')},
                {name:this.$t('home_044'),live1:2,live2:5,type:3,status:null,task_info_id:null,award:this.$t('home_047',{value:7777}),btn:this.$t('home_056'),desc:this.$t('home_049')}
            ]
        },
        taskStatusOption() {
            return ["", this.$t('home_005'), this.$t('home_006'), this.$t('home_007'), this.$t('home_008')]
        },
        langOptions(){
            return this.$Helper.langOptions();
        }
    },
    created(){
        this.moveNews.$on("login-env",res=>{
            this.initHandle();
        })
        this.moveNews.$on("login-cover",res=>{
            this.$store.dispatch('Global/isShowLogin',{type:2,isShow:true})
        })
        this.$store.dispatch('User/plantCarousel');
    },
    activated() {
        if(getToken()){
            this.initHandle();
            this.$store.dispatch('User/getUserIncome');
            this.$store.dispatch('User/actionReport',1)
        }else{
            // this.initRuleTips();
            this.$store.dispatch('User/actionReport',1)
            this.taskOption= this.$Helper.defaultOption();
        }
        window.addEventListener('message', function(event) {
            this.appLogin = event.data;
            // console.log('Message received from UniApp:', event.data);
        });
    },
    methods: {
        initHandle(){
            this.getTaskList();
            // this.initRuleTips();
        },
        initRuleTips(){
            setTimeout(() => {
                const isTips = JSON.parse(localStorage.getItem('step_01'));
                if (!isTips) {
                    this.$popDialog({steps:true, type: 9 })
                    // this.$popDialog({ content: this.help_url, title: this.$t("other_051"), type: 3 })
                }
            }, 600);
        },
        getTaskList() {
            gettaskliststatus().then(res => {
                this.taskOption = res.list||[];
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
        showChangeBtn(){
			this.isIndex=!this.isIndex;
		},
        async onChangeType(row) {
            this.langIdx = row.lang;
            this.$i18n.locale = row.lang;
            Cookies.set("language", row.lang);
            // await setappuserlanguage({ language: row.lang });
            await this.$store.dispatch('User/plantCarousel');
        },
        handleTask(row) {
            const path = this.taskType[row.type];
            if(path=="pullgroupTask"){
                this.$store.dispatch('User/actionReport',5) 
            }
            if(path=="spread"){
                this.$store.dispatch('User/actionReport',6) 
            }
            if(path=="scanOnline"){
                this.$store.dispatch('User/actionReport',7) 
            }
            // if(!getToken()){
               
            // }
            // if(getToken()){
            //     if(path=="pullgroupTask"){
            //         this.$store.dispatch('User/actionReport',8) 
            //     }
            //     if(path=="spread"){
            //         this.$store.dispatch('User/actionReport',10) 
            //     }
            //     if(path=="scanOnline"){
            //         this.$store.dispatch('User/actionReport',12) 
            //     }
            // }
            if (!getToken()) return this.$router.push("/login");
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
        },
        jumpLucky(idx){
            const activRouter = ['/luckyWheel','/dailySign'];
            this.$router.push(activRouter[idx]);   
        },
        currentTime(){
            return Math.floor(new Date().getTime() / 1000);
        }
    }
};
</script>
<style lang="scss" scoped>
.home_warp {
    position: relative;
    padding-bottom: 140px;
    // background: $color-theme;
    background: linear-gradient(180deg, #31acf2 1.61%, rgba(255, 255, 255, 0.5) 100%);
    // background: url('../assets/images/home/bg_img.png') no-repeat;
    // background-size: cover;
    -webkit-overflow-scrolling: touch;
    .warp_mian {
        padding: 0 20px;
        box-sizing: border-box;
        .user_mess{
            display: flex;
            font-size: 28px;
            height: 180px;
            color: #fff;
            position: relative;
            margin-bottom: -30px;
            align-items: center;
            .user_head{
                width: 120px;
                height: 120px;
                flex-shrink: 0;
                overflow: hidden;
                border-radius: 50%;
                border: 1px solid #fff;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .user_info{
                margin-left: 20px;
                .user_name{
                    font-weight: bold;
                    font-size: 36px;
                }
                .user_code{
                    margin-top: 10px;
                    .copay_text{
                        padding: 8px 26px;
                        font-size: 24px;
                        margin-left:10px;
                        border-radius:30px;
                        color: $color-theme;
                        background: $font-color-white;
                    }
                }
            }
        }
        .l_value{
            position: absolute;
            top: 40px;
            right: 0;
            display: flex;
            align-items: center;
            span{
                width: 100%;
                flex-grow: 1;
                color: #fff;
                border-radius: 8px;
            }
            .down_icon{
                display: flex;
                width: 30px;
                margin-left: 20px;
            }
            .down_list{
                width: 180px;
                max-height: 230px;
                position: absolute;
                right: 0px;
                top: 50px;
                z-index: 1;
                color: $font-color-black;
                font-size: 28px;
                padding: 16px 20px;
                border-radius: 8px;
                box-sizing: border-box;
                background-color: #fff;
                p{
                    padding: 10px 0;
                    border-bottom: 1px solid #ebedf0;
                }
                p:last-child{
                    border: none;
                }
                .select_active{
                    color: $color-theme;
                }
            }
            .down_list:before {
                content: "";
                display: block;
                position: absolute;
                width:0;
                height: 0;
                border: 16px solid transparent;
                border-bottom-color: #fff;
                left: 40px;
                top: -30px;
            }
            .active_open{
                display: block;
                transition: all .2s;
                // animation: slide-down .2s ease-in;
                transition: .2s ease-in;
                transform-origin: 50% 0;
                box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            }
            .active_close{
                display: none;
                transition: all .5s;
                animation: select-close .5s ease-in;
                transition: .3s ease-in;
                transform-origin: 50% 0;
            }
            @keyframes slide-down{
                0%{transform: scale(1,.5)}
                100%{transform: scale(1,1)}
            }
        }
        .notice_warp {
            width: 100%;
            display: flex;
            margin-bottom: 30px;
            margin-top: 30px;
            position: relative;
            flex-direction: column;
            .my_swipe{
                width: calc(100vw - 40px);
                height: 280px;
                border-radius: 20px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .adv_warp{
            gap: 20px;
            margin-bottom: 30px;
            .adv_item{
                flex: 1;
                height: 88px;
                flex-shrink: 0;
                font-weight: bold;
                color: $font-color-white;
                // border-radius: 10px;
                background: url("../assets/images/lucky_icon.png");
                background-size: 100% 100%;
                box-sizing: border-box;
            }
            .adv_item:nth-child(1){
                padding-left: 80px;
            }
            .adv_item:nth-child(2){
                padding-right: 80px;
                background: url("../assets/images/sign_icon.png");
                background-size: 100% 100%;
            }
        }
        .task_main{
            gap: 30px;
            box-sizing: border-box;
            background: url('../assets/images/home/jinbi.png') no-repeat;
            background-size: cover;
            background-position: 0 40px;
            .task_item{
                padding: 30px 0 30px 20px;
                background: url('../assets/images/home/task_icon.png') no-repeat;
                background-size: 100% 100%;
                .task_name{
                    color: $color-theme;
                    font-weight: 900;
                    margin-bottom: 18px;
                    text-shadow: 0px 2px 3px #005440;
                }
                .task_live{
                    margin-bottom: 14px;
                    .task_live_1, .task_live_2{
                        color: $home-title-21;
                        width: 250px;
                        span{
                            margin-right: 14px;
                        }
                        img{
                            height: 20px; 
                        }
                    }
                }
                .task_award{
                    position: relative;
                    color: $font-color-black;
                    margin-bottom: 10px;
                    .task_small_title{
                        width: 70%;
                        flex-wrap: wrap;
                    }
                    .award_money{
                        font-weight: bold;
                        color: $home-title-02;
                    }
                    .van-count-down{
                        position: absolute;
                        top: -25px;
                        right: 40px;
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
                    // height: 160px;
                    // margin-top: 6px;
                    // line-height: 32px;
                    padding-right: 15px;
                    color: $home-title-03;
                    box-sizing: border-box;
                    .task_desc_item{
                        // height: 140px;
                        margin-right: -10px;
                    }
                    // .task_btn{
                    //     flex-grow: 2;
                    //     flex-shrink: 0;
                    //     align-items: center;
                    // }
                    // display: -webkit-box;
                    // -webkit-line-clamp: 2;
                    // -webkit-box-orient: vertical;
                    // overflow: hidden;
                    // text-overflow: ellipsis;
                    // .task_desc_item{
                    //     flex-grow: 2;
                    //     flex-shrink: 0;
                    //     flex-wrap: wrap;
                    // }
                    // .task_btn{
                    //     flex-wrap: 1;
                    //     flex-shrink: 0;
                    // }
                }
            }
            // .task_item:nth-child(1){
            //     .task_desc{
            //         height: 130px;
            //         margin-bottom: 20px;
            //         // background: darkblue;
            //     }
            //     .task_btn{
            //         height: 130px;
            //     }
            // }
            // .task_item:nth-child(2), .task_item:nth-child(3){
            //     .task_desc{
            //         height: 100px;
            //         margin-bottom: 20px;
            //     }
            //     .task_btn{
            //         height: 100px;
            //     }
            // }
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
