<template>
    <div class="home_warp" ref="warpBox">
        <div class="top_model w_f flex-item flex-dir-c">
            <div class="user_mess w_f flex-item flex-dir-c">
                <div class="page_title w_f flex-item font_32 flex-center"> {{$t('table_004')}} </div>
                <div class="w_f flex-item">
                    <div class="user_head">
                        <img :src="require(`../assets/images/head/${userInfo.avatar}.png`)" alt="" srcset="">
                    </div>
                    <div class="user_info">
                        <div class="user_name font_32">{{ userInfo.account }}</div>
                        <div class="user_code font_24">{{$t('login_012')}}&nbsp;:&nbsp;<span style="font-weight: bold;">{{userInfo.inviteCode}}</span> <span class="copay_code" v-clipboard:copy="userInfo.inviteCode" v-clipboard:success="copySuccess">{{$t('other_006')}}</span></div>
                    </div>
                </div>
                <div class="user_vip w_f flex-item flex-dir-c">
                    <p class="total_gold font_36" v-html="$t('mine_022',{value:baseInfo.his_balance})"></p>
                    <div class="user_grade flex-item flex-align flex-center" :class="[baseInfo.level==0?'grade_zome':'']">
                        <span class="flex-item flex-align flex-center font_28">V{{baseInfo.level}}</span>
                        <!-- <img src="@/assets/images/mine/vip_icon.png" alt="" srcset=""> -->
                        <!-- <p class="font_34">VIP{{baseInfo.level}}</p> -->
                    </div>
                    <p class="grade_desc font_28" v-html="$t('mine_021',{gold:baseInfo.diferencia,vip:Number(baseInfo.level)+1})"></p>
                    <p>
                        <van-progress :percentage="baseInfo.cronograma" :show-pivot="false" track-color="#fff" color="linear-gradient(to right, #FFFF99, #FFD700)" />
                    </p>
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
                            <span>{{baseInfo.income||0.00}}</span>
                        </div>
                    </div>
                    <van-button :class="['font_30',baseInfo.income<minWithdrawal||baseInfo.income>0&&!isWithdrawal||ser_money<minWithdrawal&&!isWithdrawal?'progress_award':'']" type="primary" :disabled="!isWithdrawal||baseInfo.income<minWithdrawal" @click="goWithdraw">{{$t('other_055')}}</van-button>
                    <div class="draw_tips font_22" v-if="baseInfo.income>minWithdrawal&&isWithdrawal"> {{$t('mine_014',{value:withdrawalNum})}}</div>
                    <div class="draw_tips font_22" v-else-if="baseInfo.income<minWithdrawal&&isWithdrawal" style="color:#F52C2C">{{$t('mine_015',{value:minWithdrawal-baseInfo.income})}}</div>
                    <div class="draw_tips font_22" v-else-if="baseInfo.income>minWithdrawal&&!isWithdrawal" :style="{color:withdrawalNum==0?'#F52C2C':''}">{{$t('mine_014',{value:withdrawalNum})}}</div>
                    <div class="draw_tips font_22" v-else-if="baseInfo.income<minWithdrawal&&!isWithdrawal" :style="{color:withdrawalNum==0?'#F52C2C':''}">
                        <p class="w_f flex-item flex-align flex-center">{{$t('mine_014',{value:withdrawalNum})}}</p>
                    </div>
                </div>
            </div>
            <div class="self_jinbi w_f flex-item">
                <div class="self_item w_f flex-item flex-dir-c" @click="showIncome(0)">
                    <div class="flex-item flex-align flex-between">
                        <span class="font_28">{{$t('mine_016')}}</span>
                        <img class="more_icon" src="@/assets/images/home/more_icon.png" alt="" srcset="">
                    </div>
                    <div class="self_dold flex-item font_48">{{ allIncome.today_bonus ||0 }}</div>
                </div>
                <div class="self_item w_f flex-item flex-dir-c" @click="showIncome(1)">
                    <div class="flex-item flex-align flex-between">
                        <span class="font_28">{{$t('mine_017')}}</span>
                        <img class="more_icon" src="@/assets/images/home/more_icon.png" alt="" srcset="">
                    </div>
                    <div class="self_dold flex-item font_48">{{ allIncome.yesterday_bonus ||0 }}</div>
                </div>
            </div>
        </div>
        <div class="task_continer w_f flex-item flex-dir-c">
            <div class="task_main">
                <div class="task_item" v-for="(item,idx) in menuOption" :key="idx" @click.stop="handleJump(item,idx)">
                    <div class="left_text">
                        <!-- <span :class="['notoce_tips',userInfo.sysNotice?'notoce_active':'']" v-if="item.path=='/SysMsg'"></span> -->
                        <img class="ws_icon" :src="require(`@/assets/images/mine/${item.icon}.png`)" alt="">
                        <span class="font_32">{{$t(item.name)}}</span>
                    </div>
                    <div class="right_icon flex-item">
                        <img src="@/assets/images/home/xiala_icon.png" alt="" srcset="">
                    </div>
                </div>
            </div>
        </div>
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
            gradeIdx:0,
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
                // {
                //     isShow:true,
                //     name:"mine_020",
                //     path:"/SysMsg",
                //     icon:"news_icon"
                // },
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
            userInfo: state => state.User,
            baseInfo: state => state.User.userInfo
        })
    },
    created() {
        this.$store.dispatch('User/getUserIncome');
        this.$store.dispatch('User/getUserHead');
        this.syncInitApi();
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
            if(val.path === "/log_out"){
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
    // background-color: #f2f2f2;
    // background: $color-btnbg;
    background: $color-minebg;
    -webkit-overflow-scrolling: touch;
    .top_model {
        .user_mess {
            // height: 280px;
            padding: 0 30px;
            align-items: center;
            box-sizing: border-box;
            color: $font-color-white;
            background: $color-minebg;
            // background: linear-gradient(180deg, #31acf2 1.61%, rgba(255, 255, 255, 0.5) 100%);
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
                .user_code {
                    margin-top: 10px;
                    .copay_code {
                        padding: 8px 26px;
                        color: $font-color-white;
                        background: $color-theme;
                    }
                }
            }
            .user_vip{
                margin: 20px 0;
                padding: 30px 10px;
                border-radius: 20px;
                box-sizing: border-box;
                position: relative;
                color: $font-color-white;
                background: $color-cardbg;
                .total_gold{
                    font-weight: bold;
                }
                .user_grade{
                    width: 100px;
                    height: 94px;
                    position: absolute;
                    top: -38px;
                    right: 20px;
                    z-index: 1;
                    margin-top: 10px;
                    background: url('../assets/images/mine/vip_icon.png') no-repeat;
                    background-size: 100% 100%;
                    // color:$home-gold-value;
                    span{
                        width: 100%;
                        font-weight: bold;
                        font-style: italic;
                        letter-spacing: -1px;
                        position: relative;
                        z-index: 399;
                        margin-top: -10px;
                        // padding-right: 6px;
                        // background: linear-gradient(307.11deg,#A38748 88.8%, #785728 14.91%);
                        background: linear-gradient(168.91deg, #785728 -69%, #F5E486 -25.53%, #B0803A 5.51%, #B0803A 32.42%, #F5E486 65.53%, #B0803A 102.79%, #F5E486 137.98%);
                        // background: linear-gradient(307.11deg, #F1DE82 14.91%, #A38748 88.8%);
                        -webkit-text-fill-color:transparent;
                        -webkit-background-clip:text;
                    }
                    img{
                        height: 66px;
                    }
                }
                .grade_zome{
                    filter: grayscale(.9);
                }
                .grade_desc{
                    margin: 10px 0 30px 0;
                    // margin: 20px 0;
                    color: $font-color-white;
                    .vip_g{
                        color: $home-gold-value;
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
                height: 120px;
                display: flex;
                padding: 0 20px;
                align-items: center;
                box-sizing: border-box;
                justify-content: space-between;
                // border-bottom: 1px solid #ececec;
                .left_text {
                    display: flex;
                    position: relative;
                    align-items: center;
                    .ws_icon {
                        height: 40px;
                        margin-right: 10px;
                    }
                    .notoce_tips{
                        top: -2px;
                        left: 30px;   
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