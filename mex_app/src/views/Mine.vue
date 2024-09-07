<template>
    <div class="home_warp" ref="warpBox">
        <div class="top_model w_f flex-item flex-dir-c">
            <div class="user_mess w_f flex-item flex-dir-c">
                <!-- <page-header :title="$t('login_027')" :showBack="false"/> -->
                <div class="page_title w_f flex-item font_32 flex-center"> {{$t('table_004')}} </div>
                <div class="w_f flex-item">
                    <div class="user_head" @click="updateHead">
                        <img :src="require(`../assets/images/head/${userInfo.avatar}.png`)" alt="" srcset="">
                    </div>
                    <div class="user_info">
                        <div class="user_name font_32">{{ userInfo.account }}</div>
                        <div class="user_code font_24">{{$t('login_012')}}&nbsp;:&nbsp;<span style="font-weight: bold;">{{userInfo.inviteCode}}</span> <span class="copay_code" v-clipboard:copy="userInfo.inviteCode" v-clipboard:success="copySuccess">{{$t('other_006')}}</span></div>
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
                            <span>{{userInfo.balance||0.00}}</span>
                        </div>
                    </div>
                    <van-button :class="['font_30',userInfo.balance<minWithdrawal||userInfo.balance>0&&!isWithdrawal||ser_money<minWithdrawal&&!isWithdrawal?'progress_award':'']" type="primary" :disabled="!isWithdrawal||userInfo.balance<minWithdrawal" @click="goWithdraw">{{$t('other_055')}}</van-button>
                    <div class="draw_tips font_22" v-if="userInfo.balance>minWithdrawal&&isWithdrawal"> {{$t('mine_014',{value:withdrawalNum})}}</div>
                    <div class="draw_tips font_22" v-else-if="userInfo.balance<minWithdrawal&&isWithdrawal" style="color:#F52C2C">{{$t('mine_015',{value:minWithdrawal-userInfo.balance})}}</div>
                    <div class="draw_tips font_22" v-else-if="userInfo.balance>minWithdrawal&&!isWithdrawal" :style="{color:withdrawalNum==0?'#F52C2C':''}">{{$t('mine_014',{value:withdrawalNum})}}</div>
                    <div class="draw_tips font_22" v-else-if="userInfo.balance<minWithdrawal&&!isWithdrawal" :style="{color:withdrawalNum==0?'#F52C2C':''}">
                        <p class="w_f flex-item flex-align flex-center">{{$t('mine_014',{value:withdrawalNum})}}</p>
                        <!-- <p>{{$t('mine_015',{value:minWithdrawal-userInfo.balance})}}</p> -->
                    </div>
                    <!-- <div class="draw_tips font_22" v-if="userInfo.balance/20<minWithdrawal">You are only {{ minWithdrawal-userInfo.balance }} away from withdrawing. Keep pushing, complete the tasks, and the generous bonus will be within your reach</div> -->
                </div>
            </div>
            <div class="self_jinbi w_f flex-item">
                <div class="self_item w_f flex-item flex-dir-c" @click="showIncome(0)">
                    <div class="flex-item flex-align flex-between">
                        <span class="font_28">{{$t('mine_016')}}</span>
                        <img class="more_icon" src="@/assets/images/home/more_icon.png" alt="" srcset="">
                    </div>
                    <div class="self_dold flex-item">{{ allIncome.today_bonus ||0 }}</div>
                </div>
                <div class="self_item w_f flex-item flex-dir-c" @click="showIncome(1)">
                    <div class="flex-item flex-align flex-between">
                        <span class="font_28">{{$t('mine_017')}}</span>
                        <img class="more_icon" src="@/assets/images/home/more_icon.png" alt="" srcset="">
                    </div>
                    <div class="self_dold flex-item">{{ allIncome.yesterday_bonus ||0 }}</div>
                </div>
            </div>
        </div>
        <div class="task_continer w_f flex-item flex-dir-c">
            <div class="task_main">
                <div class="task_item" v-for="(item,idx) in menuOption" :key="idx" @touchstart.stop="handleJump(item,idx)">
                    <div class="left_text">
                        <img class="ws_icon" :src="require(`@/assets/images/mine/${item.icon}.png`)" alt="">
                        <span class="font_32">{{$t(item.name)}}</span>
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
import { getbonus } from '@/api/home'
import { getwithdrawconfig } from '@/api/pay';
export default {
    name: 'Mine',
    data() {
        return {
            allIncome:"",
            isTotalNum:null,
            minWithdrawal:null,
            withdrawalNum:null,
            isWithdrawal:false,
            menuOption:[
                {
                    isShow:true,
                    name:"mine_010",
                    path:"/betrecord",
                    icon:"draw_icon"
                },
                {
                    isShow:true,
                    name:"mine_011",
                    path:"/putrecord",
                    icon:"task_icon"
                },
                {
                    isShow:true,
                    name:"mine_012",
                    path:"/ResetPwd",
                    icon:"pwd_icon"
                },
                {
                    isShow:true,
                    name:"mine_013",
                    path:"/log_out",
                    icon:"quit_icon"
                }
            ]
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.User
        })
    },
    created() {
        // for (let k = 0; k < this.menuOption.length; k++) {
        //     let item = this.menuOption[k];
        //     if (item.path == "/down_apk" && this.$Helper.checkBrowser() && this.$Helper.isAndroid()) {
        //         item.isShow = true;
        //     }
        //     this.$set(this.menuOption,k,item)
        // }
        this.$store.dispatch('User/getUserIncome');
        this.$store.dispatch('User/getUserHead');
        this.syncInitApi();
    },
    mounted(){
        let scrollTop = this.$refs.warpBox;
        scrollTop.scrollTo({top: 0,behavior: "instant" });
    },
    methods: {
        syncInitApi(){
            let fun1 = new Promise((resolve,reject)=>{
                getbonus().then(res =>{
                    resolve(res)
                })
            });
            let fun2 = new Promise((resolve,reject)=>{
                getwithdrawconfig().then(res =>{
                    resolve(res)
                })
            });
            Promise.all([fun1,fun2]).then( res => {
                const [data1,data2] = res;
                this.allIncome = data1;
                this.isTotalNum = data2.limit_count;
                this.withdrawalNum = data2.lave_count;
                this.minWithdrawal = data2.limit_amount;
                this.isWithdrawal = data2.limit_count_status;
                // for (let k = 0; k < this.menuOption.length; k++) {
                //     let item = this.menuOption[k];
                //     if(k == 4 && !this.$Helper.checkBrowser()&&!this.$Helper.isAndroid()){
                //         item.isShow = false;
                //         item.path = data3.url;
                //     }
                //     if(k == 4 && this.$Helper.checkBrowser()&&this.$Helper.isAndroid()){
                //         item.isShow = true;
                //         item.path = data3.url;
                //     }
                //     this.$set(this.menuOption,k,item)
                // }
            })
        },
        copySuccess() {
            this.$toast(`${this.$t("other_044")}`);
            this.$store.dispatch('User/actionReport',20);
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
        handleJump(val,idx){
            // if(path == '/down_apk'){
            //     let link = document.createElement('a');
            //     link.href = val.path;
            //     link.setAttribute('download', 'cashcow');
            //     link.click();
            // }
            if(val.path == "/log_out"){
                // this.logoutHandle();
                this.$store.dispatch('Global/isCloseTips',true);
            }else{
                this.$router.push(val.path);
            }
        },
        updateHead(){
            this.$router.push("/myHead");
        },
        showRule(){
            // this.$store.dispatch('User/actionReport',20);
            this.$popDialog({ content: this.help_url, title:this.$t('mine_018'),type: 4,times:this.isTotalNum,money:this.minWithdrawal })
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
    // height: 100vh;
    // overflow-x: hidden;
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
            background: linear-gradient(180deg, #31acf2 1.61%, rgba(255, 255, 255, 0.5) 100%);
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
                .progress_award{
                    border-color: $home-title-06;
                    background-color: $home-title-06;
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
