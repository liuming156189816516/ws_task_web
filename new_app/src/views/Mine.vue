<template>
    <div class="home_warp" ref="warpBox">
        <div class="top_model w_f flex-item flex-dir-c">
            <div class="user_mess w_f flex-item flex-dir-c">
                <!-- <page-header :title="$t('login_027')" :showBack="false"/> -->
                <div class="page_title w_f flex-item font_32 flex-center">Account</div>
                <div class="w_f flex-item">
                    <div class="user_head" @click="updateHead">
                        <img :src="require(`../assets/images/head/${userInfo.avatar}.png`)" alt="" srcset="">
                    </div>
                    <div class="user_info">
                        <div class="user_name font_32">{{ userInfo.account }}</div>
                        <div class="user_code font_24">{{$t('other_005')}}&nbsp;:&nbsp;<span style="font-weight: bold;">{{userInfo.inviteCode}}</span> <span class="copay_code" v-clipboard:copy="userInfo.inviteCode" v-clipboard:success="copySuccess">{{$t('other_006')}}</span></div>
                    </div>
                </div>
            </div>
            <div class="cover_model">
                <div class="task_warp w_f flex-item flex-align">
                    <div class="task_num">
                        <div class="text_1 w_f flex-item flex-center">
                            {{$t('mine_001')}}
                            <img src="@/assets/images/symbol_icon.png" @click="showRule">
                        </div>
                        <div class="text_2 flex-item font_48">
                            <!-- <img src="../assets/images/gold_icon.png" alt="" srcset=""> -->
                            <span>{{user_money||0.00}}</span>
                        </div>
                    </div>
                    <van-button class="font_30" type="primary" :disabled="!isWithdrawal||user_money<minWithdrawal" @click="goWithdraw">Withdraw</van-button>
                    <div class="draw_tips font_22" v-if="user_money/20<minWithdrawal" style="color:#F52C2C">You are only {{ (minWithdrawal*20)-user_money }} away from withdrawing. Keep pushing, complete the tasks, and the generous bonus will be within your reach</div>
                    <div class="draw_tips font_22" v-else-if="withdrawalNum>=0" :style="{color:withdrawalNum==0?'#F52C2C':''}">Number of withdrawals remaining Today：{{ withdrawalNum }}</div>
                    <!-- <div class="draw_tips font_22" v-if="user_money/20<minWithdrawal">You are only {{ minWithdrawal-user_money }} away from withdrawing. Keep pushing, complete the tasks, and the generous bonus will be within your reach</div> -->
                </div>
            </div>
            <div class="self_jinbi w_f flex-item">
                <div class="self_item w_f flex-item flex-dir-c" @click="showIncome(1)">
                    <div class="flex-item flex-align flex-between">
                        <span class="font_28">Today's Earnings</span>
                        <img class="more_icon" src="@/assets/images/home/more_icon.png" alt="" srcset="">
                    </div>
                    <div class="self_dold flex-item">{{ allIncome.today_bonus ||0 }}</div>
                </div>
                <div class="self_item w_f flex-item flex-dir-c" @click="showIncome(2)">
                    <div class="flex-item flex-align flex-between">
                        <span class="font_28">Yesterday's Earnings</span>
                        <img class="more_icon" src="@/assets/images/home/more_icon.png" alt="" srcset="">
                    </div>
                    <div class="self_dold flex-item">{{ allIncome.yesterday_bonus ||0 }}</div>
                </div>
            </div>
        </div>
        <div class="task_continer w_f flex-item flex-dir-c">
            <div class="task_main">
                <div class="task_item" v-for="(item, idx) in menuOption" :key="idx" @click="handleJump(item.path,idx)" v-show="item.isShow">
                    <div class="left_text">
                        <img class="ws_icon" :src="require(`@/assets/images/mine/${item.icon}.png`)" alt="">
                        <span class="font_32">{{ item.name }}</span>
                    </div>
                    <div class="right_icon">
                        <img src="../assets/images/home/xiala_icon.png" alt="" srcset="">
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="login_out">
            <van-button type="primary" @click="logoutHandle">{{ $t("other_010") }}</van-button>
        </div> -->
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { getwithdrawconfig } from '@/api/pay';
import { getaccountincome,getbonus,getdownloadurl } from '@/api/home'
export default {
    name: 'Mine',
    data() {
        return {
            apk_url:"",
            user_money:0,
            allIncome:"",
            minWithdrawal:null,
            withdrawalNum:null,
            isWithdrawal:false,
            withdrawConfig:"",
            taskOption: [
                {
                    status: 1,
                },
                {
                    status: 2,
                },
                {
                    status: 3,
                }
            ]
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.User
        }),
        menuOption() {
            return [
                {
                    isShow:true,
                    name:this.$t("mine_010"),
                    path:"/betrecord",
                    icon:"draw_icon"
                },
                // {
                //     isShow:true,
                //     name:this.$t("mine_002"),
                //     path:"/withdraw",
                //     icon:"task_icon"
                // },
                {
                    isShow:true,
                    name:this.$t("mine_011"),
                    path:"/putrecord",
                    icon:"task_icon"
                },
                // {
                //     name:"消息中心",
                //     path:"/sysMsg",
                //     icon:require("../assets/images/mine/mine-message-center.png")
                // },
                {
                    isShow:true,
                    name:this.$t("mine_012"),
                    path:"/ResetPwd",
                    icon:"pwd_icon"
                },
                {
                    isShow:false,
                    name:this.$t("mine_009"),
                    path:"/down_apk",
                    icon:"anzhuo"
                },
                {
                    isShow:true,
                    name:this.$t("mine_013"),
                    path:"/log_out",
                    icon:"quit_icon"
                }
            ]
        }
    },
    created() {
        for (let k = 0; k < this.menuOption.length; k++) {
            let item = this.menuOption[k];
            if (item.path == "/down_apk" && this.$Helper.checkBrowser() && this.$Helper.isAndroid()) {
                item.isShow = true;
            }
            this.$set(this.menuOption,k,item)
        }
        this.syncInitApi();
        this.$store.dispatch('User/getUserHead');
    },
    mounted(){
        let scrollTop = this.$refs.warpBox;
        scrollTop.scrollTo({top: 0,behavior: "instant" });
    },
    methods: {
        syncInitApi(){
            let fun1 = new Promise((resolve,reject)=>{
                getaccountincome().then(res =>{
                    resolve(res)
                })
            });
            let fun2 = new Promise((resolve,reject)=>{
                getbonus().then(res =>{
                    resolve(res)
                })
            });
            let fun3 = new Promise((resolve,reject)=>{
                getdownloadurl().then(res =>{
                    resolve(res)
                })
            });
            let fun4 = new Promise((resolve,reject)=>{
                getwithdrawconfig().then(res =>{
                    resolve(res)
                })
            });
            Promise.all([fun1,fun2,fun3,fun4]).then( res => {
                const [{income},data2,data3,data4] = res;
                this.user_money = income;
                this.allIncome = data2;
                this.minWithdrawal = Number(data4.limit_count);
                this.withdrawalNum = data4.limit_amount;
                this.isWithdrawal = data4.limit_count_status;
                for (let k = 0; k < this.menuOption.length; k++) {
                    let item = this.menuOption[k];
                    if(k == 4 && !this.$Helper.checkBrowser()&&!this.$Helper.isAndroid()){
                        item.isShow = false;
                        item.path = data3.url;
                    }
                    if(k == 4 && this.$Helper.checkBrowser()&&this.$Helper.isAndroid()){
                        item.isShow = true;
                        item.path = data3.url;
                    }
                    this.$set(this.menuOption,k,item)
                }
            })
        },
        copySuccess() {
            this.$toast(`${this.$t("other_044")}`);
        },
        handleTask(row) {
            if (row.status == 1) {
                this.$router.push("/scanOnline")
            } else if (row.status == 2) {
                this.$router.push("/pullgroupTask")
            } else if (row.status == 3) {
                this.$router.push("/pullPownTask")
            }
        },
        handleJump(path,idx){
            if(path == '/down_apk'){
                let link = document.createElement('a');
                link.href = path;
                link.setAttribute('download', 'cashcow');
                link.click();
            }
            if(path == "/log_out"){
                // this.logoutHandle();
                this.$store.dispatch('Global/isCloseTips',true);
            }else{
                this.$router.push(path);
            }
        },
        updateHead(){
            this.$router.push("/myHead");
        },
        showRule(){
            this.$popDialog({ content: this.help_url, title:"Notes",type: 4,times:this.withdrawalNum,money:this.minWithdrawal })
        },
        goWithdraw(){
            this.$router.push("/withdraw");
        },
        showIncome(type){
            this.$router.push(`betrecord?type=${type}`);
        },
        logoutHandle() {
            this.$dialog.confirm({
                // title: this.$t("other_008"),
                message: this.$t("other_009"),
                confirmButtonColor: "#ff9600",
                confirmButtonText: this.$t("other_003"),
                cancelButtonText: this.$t("other_007")
            }).then(() => {
                this.$store.dispatch("User/logoutUser");
                // try{
                //     if(this.isAndroid){
                //         JSInterface.onLoginout();
                //     }else if(this.isIOS){
                //         let params = {"method":"onLoginout"};
                //         window.webkit.messageHandlers.jsCallNativeMethod.postMessage(params);
                //     }
                // }catch(e){}
                // this.$router.push('/home');
                // this.$router.push("/login")
            })
        }
    }
};
</script>
<style lang="scss" scoped>
.home_warp {
    height: 100%;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: scroll;
    padding-bottom: 240px;
    background-color: #f2f2f2;
    -webkit-overflow-scrolling: touch;
    .top_model {
        .user_mess {
            height: 280px;
            padding: 0 30px;
            box-sizing: border-box;
            color: $font-color-black;
            align-items: center;
            background: linear-gradient(180deg, #008751 1.61%, rgba(255, 255, 255, 0.5) 100%);
            .page_title{
                margin: 40px 0;
                font-style: italic;
                color: $font-color-white;
            }
            .user_head {
                width: 120px;
                height: 120px;
                flex-shrink: 0;
                overflow: hidden;
                border-radius: 50%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .user_info {
                margin-left: 20px;
                .user_name {
                    font-weight: bold;
                }
                .user_code {
                    margin-top: 10px;
                    .copay_code {
                        padding: 8px 26px;
                        color: $font-color-white;
                        background: $color-theme;
                    }
                }
            }
        }

        .cover_model {
            width: 100%;
            padding: 0 20px;
            margin-top: 20px;
            box-sizing: border-box;
            .task_warp {
                display: flex;
                flex-direction: column;
                padding: 30px 0 40px 0;
                border-radius: 40px;
                background-color: $font-color-white;
                .task_num {
                    width: 100%;
                    display: flex;
                    margin-bottom: 34px;
                    align-items: center;
                    flex-direction: column;
                    .text_1 {
                        position: relative;
                        font-size: 28px;
                        img{
                            height: 36px;
                            position: absolute;
                            top: 50%;
                            right: 20px;
                            transform: translateY(-50%);
                        }
                    }

                    .text_2 {
                        font-weight: bold;
                        margin-top: 14px;
                        font-style: italic;
                        img {
                            height: 64px;
                            margin-right: 10px;
                        }
                    }
                }
                .van-button {
                    width: 211px;
                    height: max-content;
                    line-height: 1;
                    padding: 10px 0;
                    border-radius: 35px;
                    box-sizing: border-box;
                    border-color: $color-theme;
                    background-color: $color-theme;
                }
                .draw_tips{
                    padding-left: 30px;
                    margin-top: 20px;
                    box-sizing: border-box;
                }
            }
        }
        .self_jinbi{
            padding: 0 26px;
            margin-top: 20px;
            gap: 24px;
            box-sizing: border-box;
            .self_item{
                flex: 1;
                padding: 20px 20px;
                box-sizing: border-box;
                color: $home-title-12;
                padding-bottom: 20px;
                border-radius: 20px;
                background: $font-color-white;
                span{
                    color: $home-title-06;
                    margin-right: -10px;
                }
                .self_dold{
                    font-weight: bold;
                    margin-top: 16px;
                    color: $home-title-12;
                }
                .more_icon{
                    height: 24px;
                    margin-left: 4px;
                }
            }
        }
    }

    .task_continer {
        padding: 0 26px;
        margin-top: 20px;
        box-sizing: border-box;
        .task_main {
            display: flex;
            padding: 0 20px;
            border-radius: 40px;
            box-sizing: border-box;
            flex-direction: column;
            background-color: $font-color-white;
            .task_item {
                width: 100%;
                display: flex;
                padding: 20px 20px;
                align-items: center;
                box-sizing: border-box;
                justify-content: space-between;
                // border-bottom: 1px solid #ececec;
                .left_text {
                    display: flex;
                    align-items: center;
                    .ws_icon {
                        height: 40px;
                        margin-right: 10px;
                    }
                }
                .right_icon{
                    img{
                        height: 26px;
                        transform: rotate(-90deg);
                    }
                }

                .van-button {
                    width: 100px;
                    height: max-content;
                    line-height: 1;
                    padding: 10px 0;
                    font-size: 12px;
                    border-radius: 35px;
                    box-sizing: border-box;
                }
            }
            .task_item:last-child{
                border: none;
            }
        }
    }
    .login_out{
        width: 100%;
        display: flex;
        padding: 60px 20px;
        box-sizing: border-box;
        .van-button{
            width: 100%;
            border-radius: 30px;
        }
    }
}
</style>
