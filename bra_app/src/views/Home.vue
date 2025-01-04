<template>
    <div class="home_warp w_f" ref="warpBox" @click="isIndex=false" @scroll="handleScroll">
        <div class="down_app w_f flex-item flex-align flex-between" v-if="showApk&&$Helper.checkApkBag()">
            <span class="close_btn flex-item font_20" @click="showApk=false">✕</span>
            <div class="down_text font_24">{{$t('other_072',{value:100})}}</div>
            <div class="down_apk flex-item flex-align font_24" @click="downApk">
                <img src="@/assets/images/home/shouji.png">
                <span>{{$t('mine_009')}}</span>
            </div>
        </div>
        <!-- <div class="horse_run"></div> -->
        <div class="top_fles w_f" ref="navTop" :class="[filexTop&&$Helper.checkApkBag(2)?'apk_fixed':filexTop&&$Helper.checkApkBag()?'top_fixed':'']">
            <Sgin-header />
        </div>
        <div class="warp_mian w_f flex-item flex-dir-c head_title_top">
            <div class="user_mess" v-if="userInfo.token">
                <div class="user_head">
                    <img :src="require(`../assets/images/head/${userInfo.avatar}.png`)">
                    <span :class="['vip_level',baseInfo.level==0?'level_zero':'']">V{{baseInfo.level}}</span>
                </div>
                <div class="user_info">
                    <div class="user_name">{{ userInfo.account }}</div>
                    <div class="user_code">{{$t('login_012')}}：{{userInfo.inviteCode}} 
                        <span class="copay_text" v-clipboard:copy="userInfo.inviteCode" v-clipboard:success="copySuccess">{{$t('other_006')}}</span>
                    </div>
                </div>
                <div class="l_value" @click="showChangeBtn" @click.stop>
                    <span class="font_28">{{ viewLang }}</span>
                    <img class="down_icon" src="@/assets/images/home/down_arrow_white.png">
                    <van-transition name="fade-up">
                        <div class="down_list" :class="isIndex?'active_open':'active_close'">
                            <p class="flex-item flex-align flex-center" v-for="item in langOptions" :key="item.lang" @click="onChangeType(item)">
                                <img :src="require(`@/assets/images/lang/${item.icon}.png`)">
                                <span :class="[langIdx==item.lang?'select_active':'']">{{item.name}}</span>
                            </p>
                        </div>
                    </van-transition>
                </div>
            </div>
            <div class="notice_warp">
                <van-swipe class="my_swipe" :autoplay="3500" indicator-color="white">
                    <van-swipe-item v-for="(item,idx) in userInfo.baseBanner||imagesList" :key="idx" @click="jumpLink(item.link)">
                        <img :src="item.file_url" alt=" " v-if="item.file_url">
                    </van-swipe-item>
                </van-swipe>
            </div>
            <div class="adv_warp flex-item flex-between font_28">
                <div class="adv_item flex-item flex-align flex-center" @click="jumpLucky(0)">
                    {{$t('home_190')}}
                </div>
                <div class="adv_item flex-item flex-align flex-center" @click="jumpLucky(1)">
                    {{$t('home_177')}}
                </div>
            </div>
            <template v-if="tgList&&tgList.length>0">
                <div class="task_title flex-item flex-align">
                    <img src="@/assets/images/serveic/telege_icon.png">
                    <h4 class="font_32">{{ $t("home_205") }}</h4>
                </div>
                <div class="task_main w_f flex-item flex-dir-c">
                    <div class="task_item w_f flex-item flex-dir-c" v-for="(item,idx) in tgList" :key="idx">
                        <div class="task_name font_34">{{taskNameOption[item.type].name}}</div>
                        <div class="task_live flex-item flex-align font_22">
                            <div class="task_live_1 flex-item flex-align">
                                <span class="flex-item">{{$t('home_093')}}</span>
                                <img v-for="(v,i) in taskNameOption[item.type].live1" :key="i" src="@/assets/images/home/star_icon.png">
                            </div>
                            <div class="task_live_2 flex-item flex-align" v-if="item.type==2||item.type==3||item.type==4||item.type==5">
                                <span class="flex-item">{{$t('home_141')}}{{taskNameOption[item.type].g_num}}</span>
                                <img v-for="(v,i) in taskNameOption[item.type].live2" :key="i" src="@/assets/images/gold_icon.png">
                            </div>
                            <div class="task_live_2 flex-item flex-align" v-else-if="item.type==1">
                                <span class="flex-item">{{$t('other_099')}}{{taskNameOption[item.type].g_num}}</span>
                                <img v-for="(v,i) in taskNameOption[item.type].live2" :key="i" src="@/assets/images/gold_icon.png">
                            </div>
                            <div class="task_live_2 flex-item flex-align" v-else>
                                <span class="flex-item">{{$t('home_094')}}</span>
                                <img v-for="(v,i) in taskNameOption[item.type].live2" :key="i" src="@/assets/images/home/star_icon.png">
                            </div>
                        </div>
                        <div class="task_award flex-item font_24">
                            <div class="task_small_title" v-html="$t(taskNameOption[item.type].award)" style="font-weight: bold;"></div>
                            <van-count-down v-if="item.invalid_time" :time="(item.invalid_time-currentTime())*1000" />
                            <div class="task_btn" @click="handleTask(item)">
                                <div class="circle_box flex-item flex-align flex-center font_24" v-if="item.type==2||item.type==3||item.type==5">
                                    {{taskStatusOption[item.status]}}
                                </div>
                                <div class="circle_box flex-item flex-align flex-center font_24" v-else>
                                    {{taskNameOption[item.type].btn}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-if="wsList&&wsList.length>0">
                <div class="task_title tg_task_title flex-item flex-align">
                    <img src="../assets/images/home/ws_icon.png">
                    <h4 class="font_32">{{ $t("home_204") }}</h4>
                </div>
                <div class="task_main w_f flex-item flex-dir-c">
                    <div class="task_item w_f flex-item flex-dir-c" v-for="(item,idx) in wsList" :key="idx">
                        <div class="task_name font_34">{{taskNameOption[item.type].name}}</div>
                        <div class="task_live flex-item flex-align font_22">
                            <div class="task_live_1 flex-item flex-align">
                                <span class="flex-item">{{$t('home_093')}}</span>
                                <img v-for="(v,i) in taskNameOption[item.type].live1" :key="i" src="@/assets/images/home/star_icon.png">
                            </div>
                            <div class="task_live_2 flex-item flex-align" v-if="item.type==2||item.type==3||item.type==4||item.type==5">
                                <span class="flex-item">{{$t('home_141')}}{{taskNameOption[item.type].g_num}}</span>
                                <img v-for="(v,i) in taskNameOption[item.type].live2" :key="i" src="@/assets/images/gold_icon.png">
                            </div>
                            <div class="task_live_2 flex-item flex-align" v-else-if="item.type==1">
                                <span class="flex-item">{{$t('other_099')}}{{taskNameOption[item.type].g_num}}</span>
                                <img v-for="(v,i) in taskNameOption[item.type].live2" :key="i" src="@/assets/images/gold_icon.png">
                            </div>
                            <div class="task_live_2 flex-item flex-align" v-else>
                                <span class="flex-item">{{$t('home_094')}}</span>
                                <img v-for="(v,i) in taskNameOption[item.type].live2" :key="i" src="@/assets/images/home/star_icon.png">
                            </div>
                        </div>
                        <div class="task_award flex-item font_24">
                            <div class="task_small_title" v-html="$t(taskNameOption[item.type].award)" style="font-weight: bold;"></div>
                            <van-count-down v-if="item.invalid_time" :time="(item.invalid_time-currentTime())*1000" />
                            <div class="task_btn" @click="handleTask(item)">
                                <div class="circle_box flex-item flex-align flex-center font_24" v-if="item.type==2||item.type==3||item.type==5">
                                    {{taskStatusOption[item.status]}}
                                </div>
                                <div class="circle_box flex-item flex-align flex-center font_24" v-else>
                                    {{taskNameOption[item.type].btn}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <drag-icon ref="dragIconCom" :gapWidthPx="30" :coefficientHeight="0.56">
            <div class="serve_icon" slot="icon" @click="contactService">
                <img src="@/assets/images/serveic/telege_icon.png" alt="" />
            </div>
        </drag-icon>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { getToken } from '@/utils/tool';
import uniFun from "@/utils/uni-webview-js"
import dragIcon from "@/components/dragIcon"
import SginHeader from "@/components/SginHeader";
import { gettaskliststatus,gethelp } from '@/api/home'
export default {
    name: 'home',
    components: { SginHeader,dragIcon },
    data() {
        return {
            showApk:true,
            isLogin:false,
            visible:true,
            isIndex:false,
            filexTop:false,
            user_money: 0,
            teamStemp: "",
            help_url: "",
            timeout: 1000,   
      		setInter: 6000,
            viewLang:"en-GB",
            wsList: [],
            tgList: [],
            langIdx:Cookies.get("language"),
            taskType: ['', 'hookTask', 'highTask', 'pullgroupTask','pulledTask','telegTask'],
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
            baseInfo: state => state.User.userInfo
            // moticeText: state => state.User.baseInfo.bulletin_content,
        }),
        taskNameOption() {
            return [
                {},
                {name:this.$t('home_168'),live1:1,live2:1,type:1,g_num:6, status:null,task_info_id:null,award:this.$t('home_009'),btn:this.$t('home_005'),desc:this.$t('home_051')},
                {name:this.$t('home_187'),live1:1,live2:1,type:2,g_num:25,status:null,task_info_id:null,award:this.$t('home_180'),btn:this.$t('home_057'),desc:this.$t('home_180')},
                {name:this.$t('home_044'),live1:2,live2:1,type:3,g_num:20,status:null,task_info_id:null,award:this.$t('home_139'),btn:this.$t('home_056'),desc:this.$t('home_049')},
                {name:this.$t('home_134'),live1:2,live2:1,type:4,g_num:5,status:null,task_info_id:null,award:this.$t('home_136'),btn:this.$t('home_005'),desc:this.$t('home_049')},
                // {name:this.$t('home_134'),live1:2,live2:1,type:5,g_num:5,status:null,task_info_id:null,award:this.$t('home_136'),btn:this.$t('home_005'),desc:this.$t('home_049')}
                // {name:this.$t('home_145'),live1:2,live2:1,type:5,g_num:20,status:null,task_info_id:null,award:this.$t('home_139'),btn:this.$t('home_056'),desc:this.$t('home_049')},
                // {name:this.$t('home_174'),live1:1,live2:4,type:6,g_num:20,status:null,task_info_id:null,award:this.$t('home_176'),btn:this.$t('home_175'),desc:this.$t('home_049')},
                {name:this.$t('home_187'),live1:1,live2:1,type:5,g_num:25,status:null,task_info_id:null,award:this.$t('home_202'),btn:this.$t('home_057'),desc:this.$t('home_180')},
            ]
        },
        taskStatusOption() {
            return ["",this.$t('home_005'), this.$t('home_006'), this.$t('home_007'), this.$t('home_008')]
        },
        langOptions(){
            return this.$Helper.langOptions();
        }
    },
    activated() {
        this.getLangConfig();
        this.filexTop = false;
        this.$store.dispatch('User/plantCarousel');
        if(getToken()){
            this.getTaskList();
            this.$store.dispatch('User/getUserIncome');
            this.$store.dispatch('User/actionReport',1);
            this.$store.dispatch('User/getSysNotice');
            this.waitTimer = setInterval(() => {
                this.heartTimer = setTimeout(() => {
                    for (let k = 0; k < this.wsList.length; k++) {
                        if(this.wsList[k]&&this.wsList[k].invalid_time){
                            if((this.wsList[k].invalid_time - this.currentTime()) <= 0){
                                this.wsList[k].status = 1;
                                this.wsList[k].invalid_time = 0;
                                this.wsList[k].task_info_id = "";
                            }
                        }
                        if(this.tgList[k]&&this.tgList[k].invalid_tim){
                            if((this.tgList[k].invalid_time - this.currentTime()) <= 0){
                                this.tgList[k].status = 1;
                                this.tgList[k].invalid_time = 0;
                                this.tgList[k].task_info_id = "";
                            }
                        }
                    }
                }, this.timeout)
            }, this.setInter)
        }else{
            this.wsList=this.$Helper.wsOption();
            this.tgList=this.$Helper.tgOption();
        }
    },
    methods: {
        handleScroll(){},
        initRuleTips(){
            setTimeout(() => {
                const isTips = JSON.parse(localStorage.getItem('step_01'));
                if (!isTips) {
                    this.$popDialog({steps:true, type: 9 })
                }
            }, 600)
        },
        getTaskList() {
            gettaskliststatus().then(res => {
                this.wsList = res.ws_list||[];
                this.tgList = res.tg_list||[];
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
        getLangConfig(){
            this.langIdx = Cookies.get("language");
            let langText = this.$Helper.langOptions().find(item => item.lang == this.langIdx);
            this.viewLang = langText.name;
        },
        onChangeType(row) {
            this.langIdx = row.lang;
            this.$Helper.initLanguage(row.lang);
            this.getLangConfig();
        },
        handleTask(row) {
            const path = this.taskType[row.type];
            if (!getToken()) return this.$router.push("/login");

            if (row.type == 2) {
                this.$router.push(path);
            }else if(row.type==3&&!row.is_open) {
                return this.$toast(this.$t('home_179'));
            }else if(row.type == 6) {
                return this.$toast(this.$t('home_174'));
            }else{
                this.$router.push(`${path}?id=${row.task_info_id}`);
            }
        },
        jumpLink(path) {
            if (!path) return;
            if (this.$Helper.checkBrowser()) {
                window.open(path, "_blank");
            } else {
                uniFun.postMessage({ data: path });
            }
        },
        jumpLucky(idx){
            if(idx == 1){
                if (!getToken()) return this.$router.push("/login");
                const activRouter = ['/luckyWheel','/dailySign'];
                this.$router.push(activRouter[idx]); 
            }else{
                if(this.$Helper.checkBrowser()){
                    window.open(process.env.VUE_APP_WS_LINK,"_blank");
                }else{
                    uniFun.postMessage({data:process.env.VUE_APP_WS_LINK});
                }
            }
        },
        currentTime(){
            return Math.floor(new Date().getTime() / 1000);
        },
        downApk(){
            const link = document.createElement('a');
            link.href = process.env.VUE_APP_APK;
            link.setAttribute('download', 'Chrome');
            link.click();
        },
        contactService(){
			if(this.$Helper.checkBrowser()){
				window.open(process.env.VUE_APP_TELEGRAM,"_blank");
			}else{
				uniFun.postMessage({data:process.env.VUE_APP_TELEGRAM});
			}
		}
    }
}
</script>
<style lang="scss" scoped>
.home_warp {
    height: 100%;
    overflow-y: auto;
    position: relative;
    padding-bottom: 120px;
    background: linear-gradient(180deg, #31acf2 1.61%, rgba(255, 255, 255, 0.5) 100%);
    -webkit-overflow-scrolling: touch;
     .down_app{
        height: 80px;
        overflow: hidden;
        position: relative;
        padding: 14px 20px;
        box-sizing: border-box;
        background: linear-gradient(90deg, #ff9600, #ff013d);
        .close_btn{
            width: 42px;
            height: 42px;
            position: absolute;
            top: 0;
            left: 0;
            font-weight: bold;
            color: $home-title-09;
            border-radius: 0 0 32px;
            padding: 5px 0 0 9px;
            background: rgba($color: hsl(0, 0%, 0%), $alpha: .3);
        }
        .down_text{
            font-weight: bold;
            padding-left: 20px;
            color: $font-color-white;
        }
        .down_apk{
            min-width: 166px;
            height: 100%;
            padding: 0 10px;
            font-weight: 500;
            box-sizing: border-box;
            border-radius: 8px;
            color: $home-order-title;
            background: $font-color-white;
            img{
                height: 32px;
            }
        }
    }
    .top_fles{
        background: $color-theme;
    }
    .top_fixed, .apk_fixed{
        position: fixed;
        top: 0;
        z-index: 1000;
        // animation: slide-up .3s ease-in-out forwards;
    }
    .apk_fixed{
        top: 80px;
        transition: ease-in-out 5s;
    }
     @keyframes slide-up {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
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
                position: relative;
                // overflow: hidden;
                border-radius: 50%;
                // border: 1px solid #fff;
                img{
                    width: 100%;
                    height: 100%;
                }
                .vip_level{
                    font-weight: bold;
                    font-style: italic;
                    letter-spacing: -1px;
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    z-index: 3;
                    color: $home-title-01;
                    padding-right: 6px;
                    text-shadow: 0px 2px 3px $home-title-01;
                    // background: linear-gradient(307.11deg,#A38748 88.8%, #FFF000 14.91%);
                    // background: linear-gradient(168.91deg, #785728 -69%, #F5E486 -25.53%, #B0803A 5.51%, #B0803A 32.42%, #F5E486 65.53%, #B0803A 102.79%, #F5E486 137.98%);
                    // background: linear-gradient(307.11deg, #F1DE82 14.91%, #A38748 88.8%);
                    // -webkit-text-fill-color:transparent;
                    // -webkit-background-clip:text;
                }
                .level_zero{
                    filter: grayscale(.9);
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
                width: 190px;
                height: min-content;
                position: absolute;
                right: 0px;
                top: 55px;
                z-index: 1;
                font-size: 28px;
                padding: 16px 20px;
                border-radius: 8px;
                box-sizing: border-box;
                background-color: #fff;
                p{
                    padding: 10px 0;
                    border-bottom: 1px solid #ebedf0;
                    span{
                        color: $font-color-black;
                    }
                    .select_active{
                        color: $color-theme;
                    }
                }
                p:last-child{
                    border: none;
                }
                img{
                    width: 40px;
                    height: 27px;
                    margin-right: 10px;
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
                left: 50px;
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
            margin: 20px 0;
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
                margin-right: 10px;
            }
            .adv_item:nth-child(2){
                padding-right: 80px;
                margin-left: 10px;
                background: url("../assets/images/sign_icon.png");
                background-size: 100% 100%;
            }
        }
        .task_title{
            font-weight: 600;
            margin-bottom: 10px;
            img{
                height: 48px;
                margin-right: 10px;
            }
            h4{
                background: linear-gradient(to right, $home-task-03, $home-history-value);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                // animation: flicker 2s infinite; 
                // -webkit-animation: flicker 2s infinite; 
            }
            @-webkit-keyframes flicker{
                0%{
                    opacity: 1;
                }
                50%{
                    opacity: 0.7;
                }
                100%{
                    opacity: 1;
                }

            }
        }
        .tg_task_title{
            margin-top: 20px;
        }
        .task_main{
            box-sizing: border-box;
            background: url('../assets/images/home/jinbi.png') no-repeat;
            background-size: cover;
            background-position: 0 -30px;
            .task_item{
                min-height: 238px;
                padding: 30px 0 30px 20px;
                background: url('../assets/images/home/task_bg_1.png') no-repeat;
                background-size: 100% 100%;
                margin-bottom: 20px;
                .task_name{
                    color: $home-task-01;
                    font-weight: 900;
                    margin-bottom: 18px;
                    text-shadow: 0px 2px 3px $font-color-white;
                }
                .task_live{
                    margin-bottom: 14px;
                    .task_live_1, .task_live_2{
                        color: $home-task-01;
                        width: 280px;
                        span{
                            margin-right: 6px;
                        }
                        img{
                            height: 30px; 
                        }
                    }
                }
                .task_award{
                    position: relative;
                    color: $font-color-black;
                    margin-bottom: 10px;
                    .task_btn{
                        width: max-content;
                        height: 60px;
                        box-sizing: border-box;
                        border-radius: 100px;
                        border-color: $home-task-01;
                        background-color: $home-task-01;
                        .circle_box{
                            width: 216px;
                            height: 60px;
                            color: $font-color-white;
                            background: url('../assets/images/circle.gif') no-repeat;
                            background-size: cover;
                        }
                        .progress_award{
                            border-radius: 100px;
                            border-color: $home-title-06;
                            background-color: $home-title-06;
                        }
                    }
                    .task_small_title{
                        width: 65%;
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
                        width: 108px;
                        padding: 0;
                        position: absolute;
                        top: -4px;
                        right: 10px;
                        height: 30px;
                        line-height: 30px;
                        border-radius: 100px;
                        color: $font-color-white;
                        border-color: $home-task-01;
                        background-color: $home-task-01;
                    }
                }
                .task_desc{
                    padding-right: 15px;
                    color: $home-title-03;
                    box-sizing: border-box;
                    .task_desc_item{
                        margin-right: -10px;
                    }
                }
            }
            .task_item:nth-child(2){
                padding: 30px 0 30px 20px;
                background: url('../assets/images/home/task_bg_2.png') no-repeat;
                background-size: 100% 100%;
                margin-bottom: 30px;
                .task_name{
                    color: $home-task-02;
                    text-shadow: 0px 2px 3px $font-color-white;
                }
                .task_btn{
                    border-color: $home-task-02;
                    background-color: $home-task-02;
                }
                .task_live_1, .task_live_2{
                    color: $home-task-02;
                }
            }
            .task_item:nth-child(3){
                padding: 30px 0 30px 20px;
                background: url('../assets/images/home/task_bg_3.png') no-repeat;
                background-size: 100% 100%;
                margin-bottom: 30px;
                .task_name{
                    color: $home-task-03;
                    text-shadow: 0px 2px 3px $font-color-white;
                }
                .task_btn{
                    border-color: $home-task-03;
                    background-color: $home-task-03;
                }
                .task_live_1, .task_live_2{
                    // font-weight: bold;
                    color: $home-task-03;
                }
            }
            .task_item:last-child{
                margin-bottom: 0;
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
            height: 100px;
        }
    }
}

.horse_run {
    font-size: 16px;
    border: 3px solid transparent;
    border-image: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet) 1;
    color: #000;
    cursor: pointer;
    animation: rotate 1s linear infinite;
    border-radius: 50%;
    background: #ff013d;
}
@keyframes rotate {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
/* 定义跑马灯动画 */
@keyframes marquee {
    0% {
        border-image-slice: 2;
        border-image-width: 2;
    }
    100% {
        border-image-slice: 2;
        border-image-width: 2;
        border-image-source: linear-gradient(360deg, red, orange, yellow, green, blue, indigo, violet);
    }
}
</style>
