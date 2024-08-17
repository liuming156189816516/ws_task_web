<template>
    <div class="spread_warp" ref="warpBox" @scroll="handleScrolStop">
        <page-header :title="$t('table_002')" :noBg="false" :bgColor="false" :showBack="false" />
        <div class="w_f spread_title flex-item font_50 flex-dir-c">
            <p class="flex-item flex-center">Profit from sharing</p>
            <p class="flex-item flex-center">Earn continuously by inviting</p>
        </div>
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
        <div class="share_main w_f">
            <div class="share_rule flex-item flex-center" @click="showRule">
                <img src="@/assets/images/mill/rules_icon.png" alt="" srcset="">
                <span class="flex-item font_26">Rules</span>
            </div>
            <div class="cover_img flex-item">
                <img class="mask_img" src="@/assets/images/mill/bg_02.png" alt="" srcset="">
                <div class="spred_mess w_f">
                    <div class="top_title w_f font_32 flex-item flex-align flex-center">Receive a large bonus</div>
                    <div class="spred_m w_f">
                        <p class="w_f font_28">Sharing your invitation link or referral code</p>
                        <div class="spred_l">
                           <div class="w_f flex-item flex-dir-c">
                            <div class="copay_desc flex-item flex-align flex-between">
                                <span class="left_desc flex-item font_28">My invitation link</span>
                                <van-button class="font_20" type="primary" v-clipboard:copy="invit_link+'?inviteCode='+userInfo.inviteCode+'#/register'" v-clipboard:success="copySuccess">{{$t('other_006')}}</van-button>
                            </div>
                            <div class="copay_text flex-item font_28">{{ invit_link+'?r='+userInfo.inviteCode+'#/register' }}</div>
                           </div>
                           <div class="invit_code w_f flex-item flex-dir-c">
                            <div class="copay_desc flex-item flex-align flex-between">
                                <span class="left_desc flex-item font_28">My invite code</span>
                                <van-button class="font_20" type="primary" v-clipboard:copy="userInfo.inviteCode" v-clipboard:success="copySuccess">{{$t('other_006')}}</van-button>
                            </div>
                            <div class="copay_text flex-item font_28">{{ userInfo.inviteCode }}</div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="share_continer w_f flex-item flex-dir-c">
            <div class="earn_warp flex-item flex-dir-c">
                <p class="font_32">Earn rewards in just 4 simple steps</p>
                <div class="w_f step_warp flex-item">
                    <div class="step_item w_f flex-item flex-align flex-dir-c" v-for="(item,idx) in stepOptopn" :key="idx">
                        <div class="w_f flex-item flex-center">
                            <img class="step_number" :src="require(`@/assets/images/mill/${item.img}.png`)" alt="">
                            <span class="w_f step_text flex-item font_26">{{item.text}}</span>
                        </div>
                        <div class="step_img w_f flex-item flex-center">
                            <img :src="require(`@/assets/images/mill/${item.icon}.png`)" alt="">
                        </div>
                        <div class="line_model w_f"></div>
                        <img :class="['line_triang',`triang_${idx}`]" src="@/assets/images/mill/dire_row.png" alt="" v-if="idx!=0">
                    </div>
                </div>
            </div>
            <div class="record_legend w_f flex-item flex-dir-c">
                <h3 class="font_28">Records：</h3>
                <div class="record_derc font_22">If you have any questions about the invitation records，please contact <span class="focus_tips" @click="$Helper.globalSupport()">online customer service</span></div>
            </div>
            <div class="record_list w_f flex-item flex-dir-c">
                <div class="title_top task_title_head top_title_1 w_f flex-item flex-align flex-between font_28">
                    <span>Time</span>
                    <span>Bonus</span>
                </div>
                <template v-if="millionList&&millionList.length>0">
                    <div class="record_scroll w_f flex-item flex-dir-c">
                        <van-list v-model="loading" :finished="finished" loading-text="loading..." finished-text="No more" offset="60" @load="onLoad">
                            <div class="title_top record_item w_f flex-item flex-align flex-between font_26" v-for="(item,idx) in millionList" :key="idx">
                                <span>{{ formatTime(item.itime) }}</span>
                                <span class="record_cash">{{ item.amount }}</span>
                            </div>
                        </van-list>
                    </div>
                </template>
                <template v-else>
                    <div class="empty_box w_f flex-item flex-align flex-center flex-dir-c">
                        <img src="@/assets/images/empty_icon.png" alt="" srcset="">
                        <p class="font_28">Invite your friends quickly to earn cash!</p>
                    </div>
                </template>
                <div class="title_top footer_tips w_f flex-item font_24">
                    Task time is based on the start time of the task ,the system currently retains records for up to 3 months
                </div>
            </div>
        </div>
        <div :class="['top_icon',isScroll?'icon_active':'icon_hide']" @click="scrollTopBtn">
            <img class="ws_icon" src="@/assets/images/home/dingbu.png" alt="">
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
import QRCode from 'qrcodejs2'
import { formatTime } from "@/utils/tool";
import { getinvitelink} from '@/api/bill';
import PageHeader from "@/components/Header";
import {  getbillrecordlist,getinvitefriendtasklist } from '@/api/task';
export default {
    components: { PageHeader },
    data() {
        return {
            page:1,
            limit:20,
            wk_name:'',
            iframeSrc:'',
            allIncome:"",
            today_task:"",
            today_invit:"",
            invit_link:"",
            today_incomet:0,
            isScroll:true,
            loading:false,
            finished :false,
            page_total:0,
            millionList:[]
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.User,
        }),
        stepOptopn(){
            return [
                {
                    text:"Share your link",
                    img:"s_01",
                    icon:"img_001"
                },
                {
                    text:"Invitee register and log in",
                    img:"s_02",
                    icon:"img_002"
                },
                {
                    text:"Invitee completes the task",
                    img:"s_03",
                    icon:"img_003"
                },
                {
                    text:"Distribute bonus",
                    img:"s_04",
                    icon:"img_004"
                }
            ]
        }
    },
    created() {
        this.isScroll = false;
        this.syncInitApi();
        this.getIncomeList();
    },
    methods:{
        getIncomeList(){
            getbillrecordlist({page:this.page,limit:this.limit,task_type:3}).then(res => {
                this.loading = false;
                this.page_total = Math.ceil(res.total / this.limit);
                this.millionList = res.list || [];
            })
        },
        onLoad(){
            if(this.page >= this.page_total){
                this.finished = true;
            }else{
                this.page++;
                this.getIncomeList()
            }
        },
        syncInitApi(){
            let fun1 = new Promise((resolve,reject)=>{
                getinvitelink().then(res =>{
                    resolve(res)
                })
            });
            Promise.all([fun1]).then( res => {
                const [{invite_link}] = res;
                // this.allIncome = income;
                this.invit_link = invite_link;
                // this.$refs.qrcodeImg.textContent="";
                // this.createQrcode(this.invit_link);
            })
        },
        createQrcode(url){
            new QRCode(this.$refs.qrcodeImg, {
                text: url,
                width: 182,
                height: 182,
                colorDark: "#333333",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.L
            })
        },
        copySuccess(){
            this.$toast(`${this.$t("other_044")}`);
        },
        showRule(){
            this.$popDialog({ content: this.help_url, title:"Millionaire Task Rules", type: 5 })
        },
        formatTime(time) {
            return formatTime(time);
        },
        handleScrolStop(){
            let scrollTop = this.$refs.warpBox;
            if(scrollTop.scrollTop >= 200){
                this.isScroll = true;
            }else{
                this.isScroll = false;
            }
        },
        scrollTopBtn(){
            this.isScroll = false;
            let scrollTop = this.$refs.warpBox;
            scrollTop.scrollTo({top: 0,behavior:"smooth"});
        }
    }
}
</script>
<style lang="scss" scoped>
    .spread_warp {
        width: 100%;
        height: 100%;
        position: relative;
        overflow-y: auto;
        margin-bottom: 100px;
        background: url('../assets/images/home/bg_img.png') no-repeat;
        background-size: cover;
        -webkit-overflow-scrolling: touch;
        .top_icon{
            width: 70px;
            height: 70px;
            position: fixed;
            right:5px;
            bottom: 120px;
            display: flex;
            z-index: 99999;
            flex-shrink: 0;
            opacity: 0;
            align-items: center;
            border-radius: 50%;
            transition: all .5s;
            justify-content: center;
            // background: $color-theme;
            img{
                height: 42px;
            }
        }
        .icon_active{
            opacity: 1;
        }
        .icon_hide{
            opacity: 0;
        }
        .spread_title{
            width: 100%;
            margin-bottom: 28px;
            color: $home-title-01;
            p{
                padding: 0;
                margin: 0;
                font-weight: 700;
            }
        }
        .notice_warp {
            position: relative;
            padding: 0 70px;
            // margin-top: 24px;
            box-sizing: border-box;
            .notice_mian{
                overflow: hidden;
                border-radius: 60px;
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
        .share_main, .share_continer{
            height: 613px;
            margin-top: 20px;
            position: relative;
            background: url('../assets/images/mill/bg_01.png') no-repeat;
            background-size: 100% 100%;
            .share_rule{
                color: $font-color-white;
                position: absolute;
                top: -10px;
                right: 0;
                z-index: 9;
                padding: 8px 12px;
                border-top-left-radius: 200px;
                border-bottom-left-radius: 200px;
                background: rgba($color: #000000, $alpha: .5);
                img{
                    height: 40px;
                    margin-right: 4px;
                }
            }
            .cover_img{
                position: relative;
                padding: 0 20px;
                margin-bottom: 30px;
                box-sizing: border-box;
                z-index: 1;
                .mask_img{
                    margin-top: 168px;
                }
                .spred_mess{
                    // height: 200px;
                    position: absolute;
                    top: 179px;
                    left: 0;
                    padding: 0 20px;
                    box-sizing: border-box;
                    // background: rgba($color: #000000, $alpha: 0.5);
                    .top_title{
                        height:66px;
                        color: $font-color-white;
                        font-weight: bold;
                        text-shadow: 4px 4px 0px #00000040;
                    }
                    .spred_m{
                        padding: 13px 70px;
                        box-sizing: border-box;
                        margin-top: 40px;
                        // background: rgba($color: plum, $alpha: 0.5);
                        p{
                            overflow: hidden;
                            white-space: nowrap;
                            font-weight: bold;
                            text-overflow: ellipsis;
                        }
                        .copay_desc{
                            height: 44px;
                            margin-top: 18px;
                            .left_desc{
                                font-weight: bold;
                            }
                            .van-button{
                                height: 22px;
                                padding: 0 8px;
                                border-radius: 100px;
                                border-color: $color-theme;
                                background-color: $color-theme;
                            }
                        }
                        .copay_text{
                            margin-top: 18px;
                            color: $home-title-06;
                        }
                        .invit_code{
                            margin-top: 16px;
                            border-top: 1px solid $home-title-07;
                        }
                    }
                }
            }
            .earn_warp{
                margin: 0 20px;
                padding: 30px 20px;
                padding-bottom: 60px;
                border-radius: 32px;
                box-sizing: border-box;
                background: $font-color-white;
                p{
                    color: $color-theme;
                    font-style: italic;
                    font-weight: bold;
                }
                .step_warp{
                    margin-top: 40px;
                    .step_item{
                        flex: 1;
                        height: 192px;
                        position: relative;
                        .step_number{
                            height: 50px;
                        }
                        .step_text{
                            position: absolute;
                            top: 28px;
                            left: 50%;
                            text-align: center;
                            color: $home-title-08;
                            transform: translateX(-50%);
                        }
                        .step_img{
                            margin-top: 68px;
                            img{
                                height: 100px;
                                position: absolute;
                                z-index: 2;
                            }
                        }
                        .line_model{
                            // width: 90%;
                            position: absolute;
                            left: 0;
                            bottom: 29px;
                            z-index: 1;
                            border-bottom: 1px dotted $home-title-09;
                        }
                        .line_triang{
                            height: 18px;
                            position: absolute;
                            left: 0;
                            bottom: 21px;
                            z-index: 1;
                        }
                        .triang_1{
                            left: 12px;
                        }
                        .triang_2{
                            left: 10px;
                        }
                        .triang_3{
                            left: -35px;
                        }
                    }
                }
                .step_item:nth-child(1), .step_item:nth-child(4){
                    flex-grow: 1;
                }
                .step_item:nth-child(2){
                     flex-grow: 1.6;
                }
                .step_item:nth-child(3){
                    flex-grow: 2;
                }
                .step_item:nth-child(1){
                    .line_model{
                        margin-left: 20px;
                    }
                }
                .step_item:nth-child(4){
                    .line_model{
                        width: 100px;
                    }
                }
            }
            .record_legend{
                padding: 0 30px;
                h3{
                    margin: 20px 0;
                }
                .record_derc{
                    padding: 12.2px 0 12.2px 18.82px;
                    border-radius: 20px;
                    box-sizing: border-box;
                    line-height: 34px;
                    font-style: italic;
                    color: $home-title-19;
                    background: $font-color-white;
                    .focus_tips{
                        text-decoration: underline;
                        color: $home-title-02;
                    }
                }
            }
            .record_list{
                padding: 0 30px;
                margin-top: 20px;
                box-sizing: border-box;
                color: $font-color-black;
                .title_top{
                    height: 100px;
                    padding: 0 40px;
                    flex-shrink: 0;
                    box-sizing: border-box;
                    background: $home-title-10;
                }
                .task_title_head {
                    border-top-left-radius: 20px;
                    border-top-right-radius: 20px;
                }
                .record_scroll{
                    max-height: 1100px;
                    overflow-y: auto;
                    background: $font-color-white;
                }
                .top_title_1{
                    font-weight: bold;
                }
                // .title_top:nth-child(1){
                //     border-top-left-radius: 20px;
                //     border-top-right-radius: 20px;
                // }
                .record_item{
                    height: 108px;
                    background: $font-color-white;
                    border-bottom: 1px solid $home-title-10;
                }
                .record_item:last-child{
                    border-bottom: 1px solid transparent;
                }
                .record_cash{
                    font-weight: bold;
                }
                .empty_box{
                    height: 364px;
                    color: $home-title-14;
                    background-color: $font-color-white;
                    img{
                        height: 202px;
                    }
                }
                .footer_tips{
                    padding: 16px 0 16px 20px;
                    box-sizing: border-box;
                    color: $home-title-06;
                    font-style: italic;
                    border-bottom-left-radius: 20px;
                    border-bottom-right-radius: 20px;
                }
            }
        }
        .share_continer{
            height: auto;
            padding-top: 84px;
            margin-top: 0px;
            padding-bottom: 20px;
            background: $home-title-20;
            // background: linear-gradient(to top, #ffff 0%, #008751 100%);
        }
    }
</style>
