<template>
    <div class="home-content" ref="warpBox" @scroll="handleScrolStop">
        <div class="task_mian w_f">
            <page-header :title="$t('home_046')" :show-icon="true" :bgcolor="false" />
            <div class="notice_warp w_f">
                <div class="notice_mian w_f">
                    <img class="left_icon" src="@/assets/images/home/news_icon.png" alt="" srcset="">
                    <van-notice-bar :scrollable="false">
                        <van-swipe vertical style="height: 24px;" :autoplay="3000" :show-indicators="false"  >
                            <van-swipe-item v-for="(item,idx) in winNotis" :key="idx">{{ item }}</van-swipe-item>
                        </van-swipe>
                    </van-notice-bar>
                </div>
            </div>
            <div class="share_bonus w_f flex-item flex-dir-c">
                <p class="Win_l font_52 flex-item">Add Your Social Account</p>
                <p class="Win_r font_64 flex-item">Win Extra Cash</p>
                <div class="share_rule flex-item flex-center font_38" @click="showRule">
                    <img src="@/assets/images/mill/rules_icon.png" alt="" srcset="">
                    <span class="flex-item font_26">Tutorials & Rules</span>
                </div>
            </div>
            <div class="task_win_bonus w_f flex-item flex-align flex-center font_32">
                <img src="@/assets/images/home/cash_icon.png" alt="" srcset="">
            </div>
        </div>
        <div class="task_warp w_f flex-item">
            <div class="task_main w_f flex-item flex-dir-c">
                <div class="task_item w_f flex-item flex-dir-c font_34">
                    <div class="task_award w_f">
                        <div class="task_book font_34">Scan QR code</div>
                    </div>
                    <div class="w_f flex-item flex-between flex-align font_24">
                        <span class="show_account">Add your WhatsApp account</span>
                        <van-button type="primary" @click="addQrcode">Add Now</van-button>
                    </div>
                </div>

                <div class="task_item w_f flex-item flex-dir-c font_34">
                    <div class="ws_head w_f flex-item flex-dir-c">
                        <div class="task_award w_f">
                            <div class="task_book flex-item flex-align font_34" @click="initWechatList(1)">
                                <span>Account List </span>
                                <img src="@/assets/images/home/refsh_icon.png" alt="" srcset="">
                            </div>
                        </div>
                        <div class="title_top title_head_top w_f flex-item flex-align flex-between font_28" v-if="wechaList&&wechaList.length>0">
                            <span class="flex-item flex-align">Account</span>
                            <span class="flex-item flex-center">Status</span>
                            <span class="flex-item flex-center">Operation</span>
                        </div>
                    </div>
                    <div class="ws_list w_f flex-item flex-dir-c" >
                        <div class="ws_account" :style="wechaList.length==0?'background:transparent;':''">
                            <template v-if="wechaList&&wechaList.length>0">
                                <div class="title_top record_item w_f flex-item flex-align flex-between font_26" v-for="(item,idx) in wechaList" :key="idx">
                                    <span class="flex-item">{{item.account}}</span>
                                    <span class="item_title item_status" :style="'color:'+(item.status!=2?'#D32C2C':'#28C445')">
                                        <a class="line_status" :class="item.status!=2?'down_status':''" href=""></a>
                                        {{statusOption[item.status]}}
                                    </span>
                                    <!-- <span class="flex-item flex-center">On Line</span> -->
                                    <span class="log_out flex-item flex-align flex-center font_26" @click="showDelBtn(item)">Log Out</span>
                                </div>
                            </template>
                            <template v-else>
                                <div class="empty_box w_f flex-item flex-align flex-center flex-dir-c">
                                    <img src="@/assets/images/empty_icon.png" alt="" srcset="">
                                    <p class="font_28">Add your account and win cash</p>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="record_legend w_f flex-item flex-dir-c">
            <h3 class="font_28">Records：</h3>
            <div class="record_derc font_22">If you have any questions about the invitation records，please contact <span class="focus_tips" @click="$Helper.globalSupport()">online customer service</span></div>
        </div>
        <div class="record_list w_f flex-item flex-dir-c">
            <div class="title_top title_top_head w_f flex-item flex-align flex-between font_28">
                <span class="flex-item flex-align">Time</span>
                <span class="flex-item">Bonus</span>
            </div>
            <template v-if="wsTaskList&&wsTaskList.length>0">
                <div class="record_scroll w_f flex-item flex-dir-c">
                    <div class="title_top record_item w_f flex-item flex-align flex-between font_26" v-for="(item,idx) in wsTaskList" :key="idx">
                        <span class="flex-item">{{ formatTime(item.itime) }}</span>
                        <span class="flex-item" style="font-weight: bold;">{{ item.amount }}</span>
                    </div>
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
        <van-overlay :show="visible" class="qr_mask_model w_f flex-item flex-align">
            <div class="qr_warp">
                <img class="close_icon" src="@/assets/images/close_icon.png" @click="visible=false">
                <div class="qr_rule font_24">Scan the QR code on your mobile WhatsApp, click confirm, then close this page ! (Wait 3-5 minutes, then click the 'Refresh' button to update and check WhatsApp status) <span v-if="errState">{{ countTime}}s</span></div>
                <div class="qr_continer w_f flex-item flex-dir-c">
                    <!-- <van-tabs v-model="active" @change="changeCard">
                        <van-tab title="WhatsApp" />
                        <van-tab title="WhatsApp Business" />
                    </van-tabs> -->
                    <div class="tabs_list w_f flex-align flex-item flex-between">
                        <div class="tabs_item flex-item font_28" :style="tabsIdx==idx?'coloe:#171717;font-weight: bold;':''"  v-for="(item,idx) in whatsOption" :key="idx" @click="changeTabs(idx)" v-show="idx!=0">
                            {{ item }}
                            <span class="tabs_active" v-if="idx == tabsIdx"></span>
                        </div>
                    </div>

                    <div class="qr-code w_f" v-show="errState">
                        <div ref="qrcodeImg" class="view_qr @/assets/images/home/qr_err.png" id="qrcodeImg">
                            <img class="qr_img" src="@/assets/images/home/ws_icon.png" alt="">
                        </div>
                    </div>
                    <div class="err_code w_f" v-show="!errState">
                        <van-loading v-if="isRqLoding" size="24px">{{ $t('other_029') }}</van-loading>
                        <img v-else src="@/assets/images/home/qr_err.png" alt="" srcset="">
                        <van-button v-show="!isRqLoding" icon="replay" :disabled="countTime>0&&countTime<60" @click="refreQrBtn">{{countTime==60?$t('other_031'):countTime+$t('other_032')}}</van-button>
                    </div>
                </div>
                <div class="qr_mask w_f"></div>
            </div>
        </van-overlay>
        <van-overlay :show="del_model">
			<div class="log_warp w_f flex-item flex-align flex-center flex-dir-c">
				<div class="log_main">
                    {{ tipsText }}
					<div class="footer_bnt w_f flex-item flex-center">
						<van-button class="footer_confirm" type="primary" :loading="isLoading" loading-text="Loading..." @click="handle_confirm">Confirm</van-button>
						<van-button class="footer_cancel" type="primary" @click="del_model=false">Cancel</van-button>
					</div>
				</div>
			</div>
        </van-overlay>
        <div :class="['top_icon',isScroll?'icon_active':'icon_hide']" @click="scrollTopBtn">
            <img class="ws_icon" src="@/assets/images/home/dingbu.png" alt="">
        </div>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2'
import { mapState } from 'vuex';
import { Toast,Dialog} from 'vant';
import { formatTime } from "@/utils/tool";
import PageHeader from "@/components/Header";
import { getbillrecordlist,getinvitefriendtasklist } from '@/api/task';
import { getincome,getaccountlist,delaccount,getqrcode } from'@/api/home'
export default {
	name: 'scan_online',
	components: {PageHeader},
	data() {
		return {
            task_id:"",
            tabsIdx:1,
            isShow:false,
            visible:false,
            del_model:false,
            timestamp:0,
            group_link:'',
            target_url:'',
            chrome_url:'',
            loading:false,
            isLoading:false,
            userProvince:"",
            errState:false,
            qrCodeImg:"",
            activeName:1,
            teamStemp:'',
            loginCode:62,
            qrCodeType:0,
            countTime:60,
            refreState:false,
            showProvince:false,
            isRqLoding:false,
            isScroll:true,
            wechaList:[],
            taskList:[],
            tipsText:"",
            account:"",
            taskTime: 30 * 60 * 60 * 1000,
            wsTaskList:[],
            whatsOption:["","WhatsApp","WhatsApp Business"]
		}
	},
	computed: {
		...mapState({
			userInfo: state => state.User.userInfo,
            bannerList: state => state.User.bannerList
		}),
        statusOption(){
            return ["",this.$t('home_023'),this.$t('home_024'),this.$t('home_025'),this.$t('home_026'),this.$t('home_027')]
        },
        winNotis(){
            return this.$Helper.randomStrings(100)
        }
	},
    created(){
        this.isScroll=false;
        this.getIncomeList();
        this.initWechatList();
    //     this.timestamp = Math.floor(new Date().getTime() / 1000);
    //     this.task_id = this.$route.query.id||"";
    },
    mounted(){
        // setTimeout(() => {
        //     this.$popDialog({content:this.$t("other_048"),title:this.$t("other_008"),type:2}) 
        // },500);
    },
	methods: {
        getIncomeList(){
            getbillrecordlist({page: 1,limit: 100,task_type:1}).then(res => {
                this.wsTaskList = res.list || [];
            })
        },
        addQrcode(){
            clearInterval(this.timer);
            this.countTime = 60;
            this.initQrcode();
            this.visible = true;
            this.$nextTick(() => {
                this.$refs.qrcodeImg.textContent="";
            })
        },
        // changeCard(){
        //     if (this.countTime != 60) return this.active = this.active;
        //     this.refreQrBtn();
        // },
        changeTabs(idx){
            // if (this.countTime != 60) return;
            // this.isRqLoding = true;
            this.tabsIdx = idx;
            this.errState=false;
            this.refreQrBtn();
        },
        //刷新二维码
        refreQrBtn(){
            clearInterval(this.timer);
            this.countTime = 60;
            this.$refs.qrcodeImg.textContent="";
            this.initQrcode();
        },
        initQrcode(row,tips){
            this.settime();
            this.isRqLoding = true;
            getqrcode({account_type:this.tabsIdx}).then(res => {
                setTimeout(()=>{this.isRqLoding = false},3000)
                if(res.qr_code){
                    this.errState = true;
                    this.createQrcode(res.qr_code);
                    // this.qrCodeImg = res.qr_code;
                    // tips!=undefined?Toast(tips+'完成'):'';
                    this.initWechatList();
                }else{
                    Toast(res.msg)
                    this.isRqLoding = false;
                    this.errState = false;
                }
            })
        },
        settime() {
            this.timer = setInterval(()=> {
                if (this.countTime > 1) {
                    this.countTime--;
                } else {
                    clearInterval(this.timer);
                    this.countTime = 60;
                    this.errState = false;
                    this.$refs.qrcodeImg.textContent="";
                }
            }, 1000);
		},
        initWechatList(num){
            this.loading =true;
            this.page=num!=undefined?num:this.page;
            getaccountlist().then(res => {
                this.loading=false;
                this.total = Math.ceil(res.total/this.limit);
                this.wechaList = res.list||[];
            })
        },
        createQrcode(url){
            let qrcode = new QRCode(this.$refs.qrcodeImg, {
                text: url,
                width: 182,
                height: 182,
                colorDark: "#333333",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.L
            })
            this.isRqLoding = false;
        },
        showDelBtn(row){
            this.account = row.account;
            this.del_model = true;
            this.tipsText = row.status==2?this.$t('home_040'):this.$t('home_041');
        },
        handle_confirm(){
            this.isLoading=true;
            delaccount({account:this.account}).then(res => {
                this.isLoading = false;
                this.del_model = false;
                Toast(this.$t('other_013'))
                this.initWechatList();
            })
        },
        // showDelBtn(row){
        //     let tipsText = row.status==2?this.$t('home_040'):this.$t('home_041')
        //     Dialog.confirm({
        //         title:this.$t('other_045'),
        //         message:tipsText,
        //         cancelButtonText:this.$t('other_007'),
        //         confirmButtonText:this.$t('other_011'),
        //         beforeClose: ((action, done) => {
        //             if (action === 'confirm') {
                        
        //                 done();
        //             }else{
        //                 done();
        //             }
        //         })
        //     });
        // },
        async initSpread() {
          this.teamStemp = await getincome({});
        },
        onConfirm(val){
            clearInterval(this.timer);
            this.countTime = 60;
            this.loginCode = val.code;
            this.qrCodeType = 1;
            this.qrCodeImg="";
            this.errState = false;
            this.initQrcode();
            this.activeName='1';
            this.$refs.qrcodeImg.textContent="";
            this.showProvince=false;
        },
        viewTaskNum(){
            this.$popDialog({ content: this.taskList, title:"Contact Numbers", type: 7 })
        },
        downAddress(){
        },
        showRule(){
            this.$popDialog({ content: this.help_url, title:"Social Media Bonus", type: 8 })
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
};
</script>
<style lang="scss" scoped>
    .home-content {
        height: 100%;
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        position: relative;
        background: $home-title-18;
        -webkit-overflow-scrolling: touch; 
        padding-bottom: 20px;
        .top_icon{
            width: 70px;
            height: 70px;
            position: fixed;
            right:5px;
            bottom: 50px;
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
        .task_mian{
            height: 990px;
            position: relative;
            background: url('../../assets/images/home/task_002.png') no-repeat;
            background-size: 100% 100%;
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
                        background-color: $font-color-white;
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
            .share_bonus{
                font-weight: bold;
                font-style: italic;
                margin-top:82px;
                position: relative;
                color: $font-color-white;
                p{
                    text-shadow: 0 5px 3px #FF4F2B,0 -2px 0 #FF4F2B;
                }
                .Win_l{
                  padding-left: 56px;
                }
                .Win_r{
                    align-self: flex-end;
                    padding-right: 46px;
                }
                .share_rule{
                    color: $font-color-white;
                    position: absolute;
                    right: 0;
                    bottom: -100px;
                    z-index: 9;
                    font-weight: initial;
                    padding: 11px 14px;
                    border-top-left-radius: 200px; 
                    border-bottom-left-radius: 200px;
                    background: rgba($color: #000000, $alpha: .5);
                    img{
                        height: 40px;
                        margin-right: 4px;
                    }
                }
            }
            .task_win_bonus{
                height: 130px;
                position: absolute;
                left: 0;
                bottom: 115px;
                img{
                    height: 67px;
                }
                // background: rgba($color: #000000, $alpha: .5);
            }
        }
        .task_warp{
            position: relative;
            z-index: 9;
            margin-top: -50px;
             .task_main{
                padding: 0 24px 0 36px;
                gap: 30px;
                box-sizing: border-box;
                // background: url('../../assets/images/home/jinbi.png') no-repeat;
                // background-size: cover;
                // background-position: 0 40px;
                .task_item{
                    height: 205px;
                    padding: 16px 0 0 28px;
                    box-sizing: border-box;
                    background: url('../../assets/images/home/task_icon.png') no-repeat;
                    background-size: 100% 100%;
                    .task_name{
                        margin-top: 8px;
                        img{
                            height: 40px;
                        }
                    }
                    .task_award{
                        position: relative;
                        color: $font-color-black;
                        margin-top: 5px;
                        margin-bottom: 42px;
                        .task_book{
                            font-weight: bold;
                            color: $color-theme;
                            text-shadow: 0px 4px 3px rgba(0,0,0,0.2);
                            // text-shadow: 0px 3px 3px #000;

                        }
                        .task_desc{
                            line-height: 32px;
                            // letter-spacing: -2px;
                            color: $home-title-03;
                            margin-right: -20px;
                        }
                    }
                    .show_account{
                        color: $home-title-03;
                    }
                    .group_link{
                        margin-top: 30px;
                        input {
                            width: 408px;
                            height: 72px;
                            background: $home-title-13 !important;
                            border: $home-title-13;
                            border-radius: 200px;
                            outline: none;
                            font-size: 28px;
                            color: #626262;
                            padding-left: 25px;
                            flex-grow: 1;
                        }
                        .van-button{
                            margin-left: 20px;
                        }
                    }
                    .van-button{
                        width: max-content;
                        height: 30px;
                        line-height: 30px;
                        margin-right: 10px;
                        border-radius: 200px;
                        color: $font-color-white;
                        border-color: $color-theme;
                        background-color: $color-theme;
                    }
                }
                .task_item:nth-child(2){
                    width: 100%;
                    height: initial;
                    padding-left: 0;
                    padding-right: 0;
                    overflow: hidden;
                    padding-bottom: 20px;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    background: none;
                    .ws_head{
                        // height: 181px;
                        padding: 0 20px;
                        box-sizing: border-box;
                        background: url('../../assets/images/home/ws_head.png') no-repeat;
                        background-size: 100% 100%;
                        .task_award{
                            margin-top: 24px;
                            margin-bottom: 14px;
                        }
                        .task_book{ 
                            margin-left: 10px;
                            img{
                                height: 40px;
                                margin-left: 10px;
                            }
                        }
                        .title_top{
                            height: 88px;
                            padding: 0 20px;
                            font-weight: bold;
                            box-sizing: border-box;
                            border-top-left-radius: 20px;
                            border-top-right-radius: 20px;
                            background: $home-title-10;
                        }
                        .title_head_top{
                            font-weight: bold;
                        }
                    }
                    .ws_list{
                        padding: 0 20px;
                        padding-bottom: 20px;
                        box-sizing: border-box;
                        border-bottom-left-radius: 20px;
                        border-bottom-right-radius: 20px;
                        background: linear-gradient(90deg, #FEFCEF 0%, #FCFEFD 100%);
                        .ws_account{
                            // max-height: 300px;
                            // overflow-y: auto;
                            // overflow: hidden;
                            // padding: 20px 20px 10px 20px;
                            background: $font-color-white;
                            .log_out{
                                width: 140px;
                                // height: 50px;
                                padding: 10px 0;
                                box-sizing: border-box;
                                background: $home-title-18;
                                border-radius: 200px;
                                color: $color-theme;
                            }
                        }
                        .title_top{
                            padding: 20px 0;
                        }
                        .empty_box{
                            color: $home-title-03;
                            img{
                               height: 120px; 
                            }
                        }
                    }
                    .task_book{ 
                        margin-left: 24px;
                    }
                    .record_list{
                        padding: 0 20px;
                    }
                }
            }
        }
        .record_legend{
            padding: 0 30px;
            h3{
                margin: 20px 0;
            }
            .record_derc{
                font-style: italic;
                padding: 12.2px 0 12.2px 18.82px;
                border-radius: 20px;
                box-sizing: border-box;
                line-height: 34px;
                color:$home-title-03;
                background: $font-color-white;
                .focus_tips{
                    color: $home-title-02;
                    text-decoration: underline;
                }
            }
        }
        .record_list{
            padding: 0 30px;
            margin-top: 20px;
            padding-bottom: 30px;
            box-sizing: border-box;
            color: $font-color-black;
            .title_top_head{
                font-weight: bold;
            }
            .record_scroll{
                max-height: 1100px;
                overflow-y: auto;
            }
            .title_top{
                height: 100px;
                padding: 0 40px;
                flex-shrink: 0;
                box-sizing: border-box;
                background: $home-title-10;
            }
            .title_top:nth-child(1){
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;
            }
            .record_item{
                height: 108px;
                background: $font-color-white;
                border-bottom: 1px solid $home-title-10;
            }
            .record_item:last-child{
                border-bottom: 1px solid transparent;
            }
            // .record_item{
            //     height: 66px;
            // }
            .empty_box{
                height: 364px;
                color: $home-title-14;
                background-color: $font-color-white;
                img{
                    height: 202px;
                }
            }
            .footer_tips{
                font-style: italic;
                padding: 10px 0 10px 16px;
                box-sizing: border-box;
                color: $home-title-06;
                border-bottom-left-radius: 20px;
                border-bottom-right-radius: 20px;
            }
        }
    }
    .qr_mask_model{
        padding: 0 60px;
        box-sizing: border-box;
    }
    .van-overlay{
        height: 100% !important;
        .qr_warp{
            width: 100%;
            padding: 32px 23px 20px 23px;
            border-radius: 10px;
            position: relative;
            box-sizing: border-box;
            background: url("../../assets/images/home/qr_bg.png") no-repeat;
            background-size: 100% 100%;
            .qr_mask{
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 1;
                background: url("../../assets/images/home/qr_mask.png") no-repeat;
                background-size: 100% 100%;
            }
            .qr_rule{
                position: relative;
                color: $color-theme;
                z-index: 2;
            }
            .qr_continer{
                margin-top: 30px;
                border-radius: 24px;
                background: #FEFCEF;
            }
            .close_icon{
                height: 24px;
                position: absolute;
                top: -30px;
                right: 0;
            }
            ::v-deep .van-tabs__nav{
                background: transparent;
            }
            ::v-deep .van-tab{
                padding: 0;
            }

            .code-tips{
                font-size: 24px;
                font-weight: 400;
                margin: 20px 0 10px 0;
                p{
                    text-align: center;
                    color: $home-copay-title;
                }
            }
            .qr-code, .err_code{
                min-height: 200px;
                display: flex;
                // margin-top: 20px;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                img{
                    width: 180px;
                }
                .view_qr{
                    position: relative;
                    .qr_img{
                        width: 40px;
                        height: 40px;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        z-index: 999;
                        transform: translate(-50%,-50%);
                    }
                }
            }
            .qr-code{
                padding-bottom: 24px;
                // padding: 30px 0 24px 0;
            }
            .err_code{
                position: relative;
                box-sizing: border-box;
                .van-button{
                    height: max-content;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    padding: 0;
                    z-index: 3;
                    outline: none;
                    border: none;
                    color: #ff976a; 
                    background: transparent;
                    transform: translate(-50%,-50%);
                }
                .van-button::before{
                    background-color:transparent!important;
                }
                .refresh_btn{
                    width: max-content;
                    display: flex;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                }
            }
        }
        .tabs_list{
            width: 100%;
            height: 66px;
            padding: 0 20px;
            box-sizing: border-box;
            .tabs_item{
                position: relative;
                z-index: 3;
                // background-color: chartreuse;
                .tabs_active{
                    width: 60%;
                    position: absolute;
                    left: 50%;
                    bottom: -10px;
                    color: $home-title-12;
                    transform: translateX(-50%);
                    border-bottom: 4px solid red;
                }
            }
            .tabs_item:nth-child(2){
                width: max-content;
                justify-content: right;
            }
        }
        .log_main{
            padding: 24px 24px;
            box-sizing: border-box;
            height: auto;
        }
        .footer_bnt{
            gap: 24px;
            margin-top: 48px;
            .van-button{
                flex: 1;
                border-radius: 12px;
            }
            .footer_cancel{
                color: #008751;
                background: #F2F3FF;
                border-color: #F2F3FF;
            }
            .footer_confirm{
                color: #fff;
                background: #008751;
                border-color: #008751;
            }
        }
    }
</style>
