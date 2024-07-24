<template>
    <div class="home_warp" @click="isIndex=false" ref="warpBox" @scroll="handleScrolStop">
        <div class="top_model">
            <div class="user_mess">
                <div class="user_head">
                    <img :src="require(`../assets/images/head/${userInfo.avatar}.png`)" alt="" srcset="">
                </div>
                <div class="user_info">
                    <div class="user_name">{{ userInfo.account }}</div>
                    <div class="user_code">{{$t('other_005')}}：{{userInfo.inviteCode}} 
                        <span class="copay_text" v-clipboard:copy="userInfo.inviteCode" v-clipboard:success="copySuccess">{{$t('other_006')}}</span>
                    </div>
                </div>
            </div>
            <div class="l_value" @click="showChangeBtn" @click.stop>
                <span>{{ viewLang() }}</span>
                <img class="down_icon" src="../assets/images/home/down_arrow_white.png" alt="" srcset="">
                <van-transition name="fade-up">
                    <div class="down_list" :class="isIndex?'active_open':'active_close'">
                        <p v-for="item in langOptions" :key="item.lang" :style="langIdx==item.lang?'color:#07c160;':''" @click="onChangeType(item)">{{item.name}}</p>
                    </div>
                </van-transition>
            </div>
            <div class="cover_model">
                <div class="task-pro">
                    <div class="left-pro">
                        <p>{{user_money||0.00}}</p>
                        <p>{{ $t("home_001") }}</p>
                    </div>
                    <div class="custom_set_line">
                        <span></span>
                    </div>
                    <div class="right-pro">
                        <p>{{ teamStemp.task_income || 0.00 }}</p>
                        <p>{{ $t("home_002") }}</p>
                    </div>
                    <div class="custom_set_line">
                        <span></span>
                    </div>
                    <div class="right-pro">
                        <p>{{ teamStemp.promotion_income || 0.00 }}</p>
                        <p>{{ $t("home_003") }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="home_content">
            <div class="notice_text">
                <van-notice-bar speed='20' :left-icon="require('../assets/images/home/earn-icon-a.png')" scrollable :text="userInfo.baseNotice" />
            </div>
            <van-swipe class="my_swipe" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="(item,idx) in userInfo.baseBanner" :key="idx" @click="jumpLink(item.link)">
                    <template v-if="item.link">
                        <img :src="item.file_url">
                    </template>
                    <template v-else>
                        <img :src="item.file_url" alt="">
                    </template>
                </van-swipe-item>
            </van-swipe>
        </div>
        <div class="task_continer">
            <div class="task_main">
                <div class="model_line">
                    <van-divider :style="{ color: '#07c160', borderColor: '#07c160', padding: '0 16px', marginTop:'10px '}">{{ $t("home_004") }}</van-divider>
                </div>
                <div class="task_item" v-for="(item,idx) in taskOption" :key="idx" @click="handleTask(item)" v-show="idx!=1">
                    <div class="left_text">
                        <img class="ws_icon" src="../assets/images/home/ws_icon.png" alt="">
                        <span>{{ taskNameOption[item.type]||item.task_name }}</span>
                    </div>
                    <van-button :class="item.status==4?'close_task':''" :type="item.status==1?'primary':item.status==2?'primary':item.status==3?'warning':'default'">{{ taskStatusOption[item.status] }}</van-button>
                </div>
            </div>
        </div>
        <div :class="['top_icon',isScroll?'icon_active':'icon_hide']" @click="scrollTopBtn">
            <img class="ws_icon" src="../assets/images/home/dingbu.png" alt="">
        </div>
        <drag-icon ref="dragIconCom" :gapWidthPx="40" :coefficientHeight="0.66">
            <div class="serve_icon" slot="icon" @click="contactService">
                <img src="../assets/images/ms_serve.png" alt="" />
            </div>
        </drag-icon>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import uniFun from "@/utils/uni-webview-js"
import dragIcon from "../components/dragIcon.vue";
import { getaccountincome,gettodayincome,gettaskliststatus,getalltasklist,setappuserlanguage,gethelp } from'@/api/home'
export default {
	name: 'home',
	components: {dragIcon},
	data() {
		return {
            isScroll:false,
            isIndex:false,
            user_money:0,
            teamStemp:"",
            help_url:"",
            taskOption:[],
            langIdx:Cookies.get("language")||'en',
            taskType:['','scanOnline','pullPownTask','pullgroupTask'],
            langOptions:[{lang:"en",name:"en-US"},{lang:"zh",name:"zh_CN"}]
		}
	},
	computed: {
		...mapState({
			userInfo: state => state.User,
            // moticeText: state => state.User.baseInfo.bulletin_content,
		}),
        taskNameOption(){
            return ["",this.$t('home_009'),this.$t('home_010'),this.$t('home_011')]
        },
        taskStatusOption(){
            return ["",this.$t('home_005'),this.$t('home_006'),this.$t('home_007'),this.$t('home_008')]
        }
	},
    created(){
        this.$store.dispatch('User/getUserHead');
        this.$store.dispatch('User/plantCarousel');
    },
    activated(){
        this.syncInitApi();
        this.isIndex = false;
        this.isScroll = false;
        if(JSON.parse(window.localStorage.getItem('is_play'))){
            setTimeout(() => {
                this.$popDialog({content:this.help_url,title:this.$t("serv_004"),type:1}) 
            },500);
        }
    },
	methods: {
        syncInitApi(){
            let fun1 = new Promise((resolve,reject)=>{
                getaccountincome().then(res =>{
                    resolve(res)
                })
            });
            let fun2 = new Promise((resolve,reject)=>{
                gettodayincome().then(res =>{
                    resolve(res)
                })
            });
            let fun3 = new Promise((resolve,reject)=>{
                gettaskliststatus().then(res =>{
                    resolve(res)
                })
            });
            let fun4 = new Promise((resolve,reject)=>{
                getalltasklist().then(res =>{
                    resolve(res)
                })
            });
            let fun5 = new Promise((resolve,reject)=>{
                gethelp().then(res =>{
                    resolve(res)
                })
            });
            Promise.all([fun1,fun2,fun3,fun4,fun5]).then( res => {
                const [{income},data2,data3,data4,data5] = res;
                this.user_money = income;
                this.teamStemp = data2;
                this.taskOption = [...data3.list,...data4.list];
                this.help_url = data5.url;
            })
        },
        copySuccess(){
            this.$toast(`${this.$t("other_044")}`);
        },
        showChangeBtn(){
			this.isIndex=!this.isIndex;
		},
        async onChangeType(row){
			this.langIdx=row.lang;
			this.$i18n.locale=row.lang;
            Cookies.set("language",row.lang);
            await setappuserlanguage({language:row.lang});
            await this.$store.dispatch('User/plantCarousel');
		},
        handleTask(row){
            const path = this.taskType[row.type];
            this.$router.push(`${path}?id=${row.task_info_id}`)
        },
		viewLang(){
			let lang = this.langOptions.find(item=>item.lang == this.langIdx);
			return lang.name
		},
        jumpLink(path){
            if(!path) return;
            if(this.$Helper.checkBrowser()){
                window.open(path,"_blank");
            }else{
                uniFun.postMessage({data:path});
            }
        },
        handleScrolStop(){
            let scrollTop = this.$refs.warpBox;
            if(scrollTop.scrollTop >= 100){
                this.isScroll = true;
            }else{
                this.isScroll = false;
            }
        },
        scrollTopBtn(){
            this.isScroll = false;
            let scrollTop = this.$refs.warpBox;
            scrollTop.scrollTo({top: 0,behavior:"smooth"});
        },
        contactService(){
            if(this.$Helper.checkBrowser()){
                window.open("https://wa.me/447377675671","_blank");
            }else{
                uniFun.postMessage({data:"https://wa.me/447377675671"});
            }
        }
	}
};
</script>
<style lang="scss" scoped>
    .home_warp {
        height: 100%;
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        position: relative;
        padding-bottom: 200px;
        background-color: #f2f2f2;
        -webkit-overflow-scrolling: touch; 
        .top_icon{
            width: 70px;
            height: 70px;
            position: fixed;
            right:60px;
            bottom: 160px;
            display: flex;
            z-index: 99999;
            flex-shrink: 0;
            opacity: 0;
            align-items: center;
            border-radius: 50%;
            transition: all .5s;
            justify-content: center;
            background: $font-color-white;
            img{
                height: 40px;
            }
        }
        .icon_active{
            opacity: 1;
        }
        .icon_hide{
            opacity: 0;
        }
        .top_model{
            width: 100%;
            height: 340px;
            display: flex;
            padding: 0 30px;
            margin-bottom: 60px;
            position: relative;
            box-sizing: border-box;
            justify-content: space-between;
            background: $color-theme;
            .user_mess, .l_value{
                display: flex;
                font-size: 28px;
                height: 180px;
                color: #fff;
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
            .lang_mess{
                display: flex;
                img{
                    height: 20px;
                    margin-left: 10px;
                }
            }
            .l_value{
                display: flex;
                position: relative;
                align-items: center;
                span{
                    width: 100%;
                    flex-grow: 1;
                    color: #fff;
                    font-size: 32px;
                    border-radius: 8px;
                }
                .down_icon{
                    display: flex;
                    width: 30px;
                    margin-left: 20px;
                }
                .down_list{
                    width: 160px;
                    max-height: 230px;
                    position: absolute;
                    left: 0;
                    top: 140px;
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
            .cover_model{
                width: 100%;
                position: absolute;
                left: 0;
                bottom: -40px;
                padding: 0 20px;
                box-sizing: border-box;
                .task-pro{
                    width: 100%;
                    display: flex;
                    padding: 30px 0 40px 0;
                    border-radius: 10px;
                    flex-direction: row;
                    background-color: $font-color-white;
                    .left-pro, .right-pro{
                        flex: 1;
                        p{
                            width: 100%;
                            display: flex;
                            color: $home-notice-tip;
                            font-weight: bold;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                    .left-pro p:nth-child(1), .right-pro p:nth-child(1){
                        color: $font-color-black;
                        font-size: 46px;
                    }
                    .left-pro p:nth-child(2), .right-pro p:nth-child(2){
                        font-size: 24px;
                        margin-top: 12px;
                    }
                }
            }
        }
        .home_content{
            width: 100%;
            display: flex;
            padding: 0 20px;
            flex-direction: column;
            box-sizing: border-box;
            .my_swipe{
                width: 100%;
                height: 300px;
                border-radius: 10px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .notice_text{
                font-size: 24px;
                font-weight: 500;
                margin-bottom: 20px;
                align-items: center;
                .van-notice-bar{
                    padding: 0 10px;
                    font-size: 15px;
                    color: $home-notice-tip;
                    border-radius: 6px;
                    background-color: #fff;
                }
                img{
                    width: 30px;
                    height: 30px;
                }
            }
        }
        .task_continer{
            width: 100%;
            padding: 0 20px;
            display: flex;
            margin-top: 20px;
            flex-direction: column;
            box-sizing: border-box;
            .task_main{
                display: flex;
                font-size: 28px;
                padding: 30px 20px;
                border-radius: 10px;
                box-sizing: border-box;
                flex-direction: column;
                background-color: $font-color-white;
                .model_line{
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .task_item{
                    width: 100%;
                    display: flex;
                    padding: 16px 20px;
                    margin-bottom: 20px;
                    align-items: center;
                    box-sizing: border-box;
                    border-radius: 10px;
                    justify-content: space-between;
                    background-color: #f4f4f5;
                    .left_text{
                        display: flex;
                        align-items: center;
                        .ws_icon{
                            height: 80px;
                            margin-right: 10px;
                        }
                    }
                    .van-button{
                        min-width: 90px;
                        height: max-content;
                        line-height: 1;
                        padding: 10px 0;
                        font-size: 12px;
                        border-radius: 35px;
                        box-sizing: border-box;
                    }
                }
                .close_task{
                    background: #c8c9cc;
                }
            }
        }
    }
    .custom_set_line{
        display: flex;
        padding: 20px 0;
        box-sizing: border-box;
        span{
            display: flex;
            border-left: 2px solid #ececec;
        }
    }
    .serve_icon{
        img{
            height: 80px;
        }
    }

</style>
