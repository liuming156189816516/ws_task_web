<template>
    <div class="home_warp w_f" ref="warpBox" @click="isIndex=false">
        <div class="down_app w_f flex-item flex-align flex-between" v-if="showApk&&$Helper.checkApkBag()">
            <span class="close_btn flex-item font_20" @click="showApk=false">✕</span>
            <div class="down_text font_24">{{$t('other_072',{value:200})}}</div>
            <div class="down_apk flex-item flex-align flex-center font_24" @click="downApk">
                <img src="@/assets/images/home/shouji.png">
                {{$t('mine_009')}}
            </div>
        </div>
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
                    {{$t('home_124')}}
                </div>
                <div class="adv_item flex-item flex-align flex-center" @click="jumpLucky(1)">
                    {{$t('home_125')}}
                </div>
            </div>
            <div class="task_main w_f flex-item flex-dir-c">
                <div class="task_item w_f flex-item flex-dir-c" v-for="(item,idx) in taskOption" :key="idx">
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
                            <span class="flex-item">{{$t('other_101')}}{{taskNameOption[item.type].g_num}}</span>
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
                             <!-- :class="[item.status==2?'progress_award':'']" -->
                            <div class="circle_box flex-item flex-align flex-center font_24" v-if="item.type==2||item.type==3||item.type==5">
                                {{taskStatusOption[item.status]}}
                            </div>
                             <div class="circle_box flex-item flex-align flex-center font_24" v-else>
                                {{taskNameOption[item.type].btn}}
                                <!-- <van-button class="" v-if="item.type==3" :class="[item.status==2?'progress_award':'']" type="primary">{{taskStatusOption[item.status]}}</van-button>
                                <van-button class="" v-else type="primary">{{taskNameOption[item.type].btn}}</van-button> -->
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
import { getToken } from '@/utils/tool';
import uniFun from "@/utils/uni-webview-js"
import SginHeader from "@/components/SginHeader";
import { gettaskliststatus,gethelp,getmessagellist,getnewmessagel } from '@/api/home'
export default {
    name: 'home',
    components: { SginHeader },
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
            taskOption: [],
            langIdx:Cookies.get("language"),
            taskType: ['', 'hookTask', 'highTask', 'pullgroupTask','pulledTask','codeOnline'],
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
                {name:this.$t('home_168'),live1:1,live2:1,type:1,g_num:20, status:null,task_info_id:null,award:this.$t('home_168'),btn:this.$t('home_005'),desc:this.$t('home_051')},
                {name:this.$t('home_183'),live1:2,live2:1,type:2,g_num:30,status:null,task_info_id:null,award:this.$t('home_178',{value:'20%'}),btn:this.$t('home_057'),desc:this.$t('home_050')},
                {name:this.$t('home_044'),live1:2,live2:1,type:3,g_num:15,status:null,task_info_id:null,award:this.$t('home_139'),btn:this.$t('home_056'),desc:this.$t('home_049')},
                {name:this.$t('home_134'),live1:2,live2:1,type:4,g_num:4,status:null,task_info_id:null,award:this.$t('home_136'),btn:this.$t('home_005'),desc:this.$t('home_049')},
                {name:this.$t('home_145'),live1:2,live2:1,type:5,g_num:20,status:null,task_info_id:null,award:this.$t('home_139'),btn:this.$t('home_056'),desc:this.$t('home_049')},
                // {name:this.$t('home_134'),live1:2,live2:1,type:5,g_num:5,status:null,task_info_id:null,award:this.$t('home_136'),btn:this.$t('home_005'),desc:this.$t('home_049')}
                {name:this.$t('home_145'),live1:2,live2:1,type:6,g_num:10,status:null,task_info_id:null,award:this.$t('home_139'),btn:this.$t('home_056'),desc:this.$t('home_049')},
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
            this.initHandle();
            this.getNoticeList();
            this.$store.dispatch('User/getUserIncome');
            this.$store.dispatch('User/getSysNotice');
            this.waitTimer = setInterval(() => {
                this.heartTimer = setTimeout(() => {
                    for (let k = 0; k < this.taskOption.length; k++) {
                        if((this.taskOption[k].invalid_time - this.currentTime()) <= 0){
                            this.taskOption[k].status = 1;
                            this.taskOption[k].invalid_time = 0;
                            this.taskOption[k].task_info_id = "";
                        }
                    }
                }, this.timeout)
            }, this.setInter)
        }else{
            // this.$store.dispatch('User/actionReport',1)
            this.taskOption = this.$Helper.defaultOption();
        }
        // this.getContacts();
    },
    methods: {
        getContacts(){
            // window.plus.contacts.getAddressBook(window.plus.contacts.ADDRESSBOOK_PHONE, (addressbook)=> {
            //     console.log(addressbook);
            //     console.log("addressbook");
            // })
            navigator.contacts.find(["displayName", "phoneNumbers"],(contacts)=> {
                    console.log(contacts);  // 在这里你可以获取并处理通讯录信息
                },(error)=> {
                    console.log("读取通讯录失败", error);
                }
            )
        },
        handleScroll(){
            if (this.taskOption&&this.taskOption.length>2) {
                const scrollTop = this.$refs.warpBox;
                const navHeight = this.$refs.navTop.clientHeight;
                if(scrollTop.scrollTop >= navHeight){
                    this.filexTop = true;
                }else{
                    this.filexTop = false;
                } 
            }
        },
        
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
        showTask(idx){
            this.$router.push(`/betrecord?id=1`);
        },
        jumpLucky(idx){
            if (!getToken()) return this.$router.push("/login");
            const activRouter = ['/luckyWheel','/dailySign'];
            this.$router.push(activRouter[idx]);   
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
				window.open(process.env.VUE_APP_TG_LINK,"_blank");
			}else{
				uniFun.postMessage({data:process.env.VUE_APP_TG_LINK});
			}
		},
        getNoticeList() {
            getnewmessagel().then(res => {
                if(!res)return;
                let {id,name,content} = res;
                if(!localStorage.setItem('is_play')){
                    this.$popDialog({adv_id:id,title:name,content:content,steps:true, type: 99 })
                }
            })
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
    background: $color-btnbg;
    -webkit-overflow-scrolling: touch;
    .down_app{
        height: 80px;
        overflow: hidden;
        position: relative;
        padding: 14px 20px;
        box-sizing: border-box;
        background: -moz-linear-gradient(left,#ff9600 0,#ff013d 100%);
        background: -o-linear-gradient(left,#ff9600 0,#ff013d 100%);
        background: linear-gradient(90deg,#ff9600,#ff013d);
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
        background: $color-headbg;
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
                height: max-content;
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
                    padding: 20px 0;
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
                    border: none;
                }
            }
        }
        .adv_warp{
            // gap: 20px;
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
        .task_main{
            box-sizing: border-box;
            background: url('../assets/images/home/jinbi.png') no-repeat;
            background-size: cover;
            background-position: 0 -30px;
            .task_item{
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
                    // .task_live_2{
                    //     font-weight: bold;
                    // }
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
            .task_item:nth-child(2){
                padding: 30px 0 30px 20px;
                background: url('../assets/images/home/task_bg_2.png') no-repeat;
                background-size: 100% 100%;
                .task_name{
                    color: $home-task-02;
                    text-shadow: 0px 2px 3px $font-color-white;
                }
                .task_btn{
                    border-color: $home-task-02;
                    background-color: $home-task-02;
                }
                .task_live_1, .task_live_2{
                    // font-weight: bold;
                    color: $home-task-02;
                }
            }
            .task_item:nth-child(3){
                padding: 30px 0 30px 20px;
                background: url('../assets/images/home/task_bg_3.png') no-repeat;
                background-size: 100% 100%;
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
            height: 100px;
        }
    }
}
</style>
