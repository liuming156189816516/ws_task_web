<template>
    <div class="home-content">
        <page-header :title="$t('home_009')" :show-icon="true" :bgcolor="false"></page-header>
        <div class="home_content">
            <div class="mian_continer">
                <div class="task-pro">
                    <div class="left-pro">
                        <p>{{ teamStemp.today_income || 0}}</p>
                        <p>{{ $t("mine_007") }}</p>
                    </div>
                    <div class="right-pro">
                        <p>{{ teamStemp.yesterday_income || 0 }}</p>
                        <p>{{ $t("mine_008") }}</p>
                    </div>
                </div>
                <div class="task_settl">
                    <van-notice-bar speed='20' :left-icon="require('@/assets/images/home/earn-icon-a.png')" scrollable :text="userInfo.baseNotice" />
                </div>
                <div class="code-area">
                    <van-collapse v-model="activeName" :border = false accordion>
                        <van-collapse-item name="1" color="#1989fa" :value="activeName==1?$t('home_014'):$t('home_015')">
                            <template #title>
                                <div>
                                    <van-icon :name="require('@/assets/images/home/erweima.png')" />
                                    {{ $t('home_016') }}
                                </div>
                            </template>
                            <div class="code-mian">
                                <div class="code_area">
                                    <!-- <div>
                                        <div class="area_icon" @click="showProvince=true">
                                            <img class="weizhi_icon" src="@/assets/images/home/weizhi.png" alt="" srcset="">
                                            <span class="area_name">{{loginArea||'~'}}</span>
                                            <img class="down_icon" src="@/assets/images/home/xiala_icon.png">
                                        </div>
                                    </div> -->
                                    <div>
                                        <van-radio-group v-model="num_type" checked-color="#07c160" :disabled="countTime!=60" shape="square" direction="horizontal" @change="changeCard">
                                            <van-radio name="1">{{ $t('home_017') }}</van-radio>
                                            <van-radio name="2">{{ $t('home_018') }}</van-radio>
                                        </van-radio-group>
                                    </div>
                                </div>
                                <div class="code-tips">
                                    <p>{{ $t('home_019') }} <span v-if="errState">{{ countTime}}s</span></p>
                                </div>
                                <div class="qr-code" v-show="errState">
                                    <div ref="qrcodeImg" class="view_qr @/assets/images/home/qr_err.png" id="qrcodeImg">
                                        <img class="qr_img" src="@/assets/images/home/ws_icon.png" alt="">
                                    </div>
                                </div>
                                <div class="err_code" v-show="!errState">
                                    <van-loading v-if="isRqLoding" size="24px">{{ $t('other_029') }}</van-loading>
                                    <img v-else src="@/assets/images/home/qr_err.png" alt="" srcset="">
                                    <van-button v-show="!isRqLoding" icon="replay" :disabled="countTime>0&&countTime<60" @click="refreQrBtn">{{countTime==60?$t('other_031'):countTime+$t('other_032')}}</van-button>
                                </div>
                                <p>{{ $t('other_033') }}</p>
                                <p>{{ $t('other_034') }}</p>
                            </div>
                            <template #right-icon >
                                <van-icon name="" :color="color"/>
                            </template>
                        </van-collapse-item>
                    </van-collapse>
                </div>
                <div class="wecht-list">
                    <div class="wecht-lable">
                        <span class="item_title" v-for="(item,idx) in lableItem" :key="idx">
                            {{item}}
                            <span class="reash_btn" v-if="idx==2" @click="initWechatList(1,2)">
                                <img class="loading_icon" :class="isLoading?'loading_active':''" src="@/assets/images/home/jiazai.png" alt="">
                                <span>{{ $t('other_035') }}</span>
                            </span>
                        </span>
                    </div>
                    <div class="wecht-mess">
                        <!-- <template> -->
                        <template v-if="loading">
                            <div class="item_mess" style="height: 204px;">
                                <van-loading size="24px">{{ $t('other_029') }}</van-loading>
                            </div>
                        </template>
                        <template v-else>
                            <template v-if="wechaList&&wechaList.length>0">
                                <div class="item_title item_mess" v-for="item in wechaList" :key="item.id">
                                    <span class="item_title">{{item.account}}</span>
                                    <span class="item_title item_status" :style="'color:'+(item.status!=2?'#D32C2C':'#28C445')">
                                        <a class="line_status" :class="item.status!=2?'down_status':''" href=""></a>
                                        {{statusOption[item.status]}}
                                    </span>
                                    <span class="item_title">
                                        <span class="del-btn" @click="showDelBtn(item)">{{ $t('other_036') }}</span>
                                    </span>
                                </div>
                            </template>
                            <template v-else>
                                <div class="item_mess">
                                    <img class="empty_data" src="@/assets/images/home/ws_icon.png" alt="" srcset="">
                                    <div class="empty_text">{{ $t('other_037') }}</div>
                                </div>
                            </template>
                            </template>
                    </div>
                </div>
                <div class="task_disc">
                    <p>{{ $t('other_038') }}</p>
                    <p>{{ $t('other_039') }}</p>
                    <p class="point_tips">{{ $t('other_040') }}</p>
                </div>
            </div>
        </div>
        <van-popup v-model="showProvince" position="bottom" :style="{ height: '260px' }">
            <van-picker :title="$t('other_041')" show-toolbar visible-item-count="4" value-key="name" :columns="provinceColumns" @confirm="onConfirm" @cancel="showProvince=false" />
        </van-popup>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2'
import { mapState } from 'vuex';
import { setTimeout } from 'timers';
import { fmoney } from '@/utils/tool';
import { Toast,Dialog} from 'vant';
import PageHeader from "@/components/Header";
import { getincome,getaccountlist,delaccount,getqrcode } from'@/api/home'
export default {
	name: 'home',
	components: {PageHeader},
	data() {
		return {
            page:1,
            total:0,
            limit:6,
            timer:null,
			iphoneX: '',
            IpObj:"",
            num_type:"1",
            loading:false,
            isLoading:false,
            visible:true,
            userProvince:"",
            errState:false,
            qrCodeImg:"",
            activeName:1,
            teamStemp:'',
            loginArea:'印度尼西亚',
            loginCode:62,
            qrCodeType:0,
            countTime:60,
            refreState:false,
            showProvince:false,
            isRqLoding:false,
            wechaList:[],
            list:[
                "https://img0.baidu.com/it/u=132095580,3308868527&fm=253&fmt=auto&app=138&f=JPG?w=592&h=296",
                "https://img0.baidu.com/it/u=1709064170,207840351&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=278",
                "https://img.tuguaishou.com/ips_templ_preview/53/2e/fa/lg_4426904_1634807148_61712d6ccc0a7.jpg!w1024_w?auth_key=2286544142-0-0-0408fba029f3f735dad77672222c8957",
            ],
            provinceColumns:[
                {   code:62,
                    name:"印度尼西亚"
                },
                {   code:91,
                    name:"印度"
                },
                {   code:55,
                    name:"巴西"
                },
                {   code:971,
                    name:"阿拉伯联合酋长国"
                },
                {   code:92,
                    name:"巴基斯坦 "
                },
                {   code:95,
                    name:"缅甸 "
                },
                {   code:856,
                    name:"老挝"
                }
            ]
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.User
		}),
        lableItem(){
            return [this.$t('home_020'),this.$t('home_021'),this.$t('home_022')]
        },
        statusOption(){
            return ["",this.$t('home_023'),this.$t('home_024'),this.$t('home_025'),this.$t('home_026'),this.$t('home_027')]
        },
        tipsOption(){
            return ["",this.$t('home_023')]
        }
	},
    created(){
        // this.$store.dispatch('User/getUserInfo');
        // setTimeout(()=>{
        //     this.IpObj=JSON.parse(sessionStorage.getItem('storageIP'))
        //     this.userProvince = this.IpObj.province !=undefined?this.IpObj.province:'' 
        // },500)
    },
    activated(){
        this.activeName="1";
        this.initSpread();
        this.initWechatList();
        this.$store.dispatch('User/plantCarousel');
    },
    mounted() {
        //this.initSpread();
	},
	methods: {
        onChange(idx){
            if(idx==1&&this.qrCodeType!=1){
                this.errState = true;
                this.initQrcode();
            }
        },
        changeCard(){
            if (this.countTime != 60) return;
            this.refreQrBtn();
        },
        //刷新二维码
        refreQrBtn(){
            clearInterval(this.timer);
            this.countTime = 60;
            this.initQrcode();
        },
        initQrcode(row,tips){
            this.settime();
            this.isRqLoding = true;
            getqrcode({account_type:Number(this.num_type)}).then(res => {
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
                    this.loginArea=this.userProvince;
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
        initWechatList(num,idx){
            this.loading =true;
            this.page=num!=undefined?num:this.page;
            getaccountlist().then(res => {
                this.loading=false;
                this.total = Math.ceil(res.total/this.limit);
                this.wechaList = res.list;
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
            let tipsText = row.status==2?this.$t('home_040'):this.$t('home_041')
            Dialog.confirm({
                title:this.$t('other_045'),
                message:tipsText,
                cancelButtonText:this.$t('other_007'),
                confirmButtonText:this.$t('other_011'),
                beforeClose: ((action, done) => {
                    if (action === 'confirm') {
                        delaccount({account: row.account}).then(res => {
                            Toast(this.$t('other_013'))
                            this.initWechatList();
                        })
                        done();
                    }else{
                        done();
                    }
                })
            });
        },
        async initSpread() {
          this.teamStemp = await getincome({});
        },
        onConfirm(val){
            clearInterval(this.timer);
            this.countTime = 60;
            this.loginArea = val.name;
            this.loginCode = val.code;
            this.qrCodeType = 1;
            this.qrCodeImg="";
            this.errState = false;
            this.initQrcode();
            this.activeName='1';
            this.$refs.qrcodeImg.textContent="";
            this.showProvince=false;
        },
        // 格式化金额
		formatMoney(point) {
			return fmoney(point, 2);
		},
        onPrev() {
            this.page--;
            this.initWechatList();
        },
        onNext() {
            this.page++;
            this.initWechatList();
        }
	}
};
</script>
<style lang="scss">
    .van-notice-bar__left-icon, .van-notice-bar__right-icon{
        min-width: 0;
        padding-right: 5px;
    }
    .home-content{
        .van-cell{
            display: flex;
            padding: 10px 0;
        }
        .van-collapse-item__content{
            padding: 12px 0;
        }
        .van-cell--clickable:active{
            background-color: transparent !important;
        }
        .van-cell__value{
            span{
                display: inline-block;
                width: 76px;
                height: 26px;
                color: #fff;
                font-size: 12px;
                text-align: center;
                border-radius: 18px;
                background-color: $color-theme !important;
            }
        }
    }
</style>
<style lang="scss" scoped>
    .home-content {
        height: 100%;
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #f2f2f2;
        -webkit-overflow-scrolling: touch; 
        padding-bottom: 120px;
        .home_content{
            width: 100%;
            float: left;
            margin-top: 20px;
            .my_swipe{
                width: 100%;
                height: 320px;
                // margin-bottom: 30px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .task-pro{
                width: 100%;
                display: flex;
                padding: 20px 0;
                border-radius: 10px;
                flex-direction: row;
                background-color: $color-theme;
                .left-pro, .right-pro{
                    flex: 1;
                    p{
                        width: 100%;
                        display: flex;
                        color: #fff;
                        justify-content: center;
                        align-items: center;
                    }
                }
                .left-pro p:nth-child(1), .right-pro p:nth-child(1){
                    font-size: 48px;
                }
                .left-pro p:nth-child(2), .right-pro p:nth-child(2){
                    font-size: 24px;
                    font-weight: 400;
                    margin-top: 12px;
                }
                .left-pro{
                    border-right: 1px solid #fff;
                }
            }
            .task_settl{
                font-size: 24px;
                font-weight: 500;
                margin-top: 10px;
                align-items: center;
                background-color: #fff;
                .van-notice-bar{
                    padding: 0 8px;
                    font-size: 15px;
                    color: $home-notice-tip;
                    background-color: transparent;
                }
                img{
                    width: 30px;
                    height: 30px;
                    // margin-right: 10px;
                }
                span{
                    color: $home-bind-button;
                }
            }
            .mian_continer{
                width: 100%;
                padding: 0 20px;
                box-sizing: border-box;
            }
            .code-area, .wecht-list{
                width: 100%;
                margin-top: 32px;
                border-radius: 20px;
                background-color:$font-color-white;
                .van-collapse{
                    padding: 4px 13px;
                    box-sizing: border-box;
                }
                .van-cell__title{
                    position: relative;
                    z-index: 1;
                    .van-icon{
                        font-size: 22px;
                        margin-right: 4px;
                    }
                    div{
                        width: max-content;
                        display: flex;
                        font-weight: bold;
                        font-size: 16px;
                        align-items: center;
                    }
                }
                .code-title, .code-mian{
                    width: 100%;
                    display: flex;
                    // padding-bottom: 21px;
                    border-bottom: 1px solid #e5e5e5;
                    // .wechat-icon, .task-logo{
                    // }
                    .wechat-icon{
                        flex-grow: 1;
                        color: #141414;
                        font-size: 32px;
                        display: flex;
                        font-weight: 500;
                        align-items: center;
                        img{
                            width: 44px;
                            height: 38px;
                            margin-right: 9px;
                        }
                        span{
                            font-weight: 600;
                        }
                    }
                    .task-logo{
                        flex-grow: 0;
                        img{
                            width: 158px;
                            height: auto;
                            float: right;
                        }
                    }
                }
                .code-mian{
                    width: 100%;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: center;
                    border-bottom: none;
                    .code_area{
                        width: 100%;
                        height: 74px;
                        display: flex;
                        padding-left:20px;
                        border-radius: 8px;
                        align-items: center;
                        box-sizing: border-box;
                        justify-content:space-between;
                        background-color: #F6F6F6;
                        .area_icon{
                            // flex-grow: 1;
                            display: flex;
                            margin-bottom: 10px;
                            align-items: center;
                            .weizhi_icon{
                                width:36px;
                                height: 34px;
                            }
                            .down_icon{
                                width:28px;
                                margin-left: 12px;
                            }
                            .text_left{
                                color: #939393;
                                font-size: 26px;
                            }
                            .area_name{
                                color: #141414;
                                font-size: 28px;
                                margin-left: 3px;
                                font-weight: 400;
                            }
                        }
                        .update_btn {
                            font-size: 24px;
                            display: flex;
                            align-items: center;
                            .van-button{
                                width: auto;
                                height: max-content;
                                padding: 0;
                                outline: none;
                                border: none;
                                color: #ff976a; 
                                background: transparent;
                            }
                            .van-button::before{
                                background-color:transparent!important;
                            }
                        }
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
                        width: 364px;
                        height: 364px;
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        justify-content: center;
                        img{
                            width: 100%;
                        }
                        .view_qr{
                            position: relative;
                            .qr_img{
                                width: 80px;
                                height: 80px;
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                z-index: 999;
                                transform: translate(-50%,-50%);
                            }
                        }
                    }
                    .err_code{
                        position: relative;
                        .van-button{
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            margin: 0;
                            transform: translate(-50%,-50%);
                            // width: auto;
                            height: max-content;
                            padding: 0;
                            outline: none;
                            border: none;
                            color: #ff976a; 
                            background: transparent;
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
                    .van-button{
                        width: 235px;
                        height: 34px;
                        background: $home-bind-button;
                        border-radius: 34px;
                        margin: 24px 0 21px 0;
                    }
                    p{
                        font-size: 24px;
                        font-weight: 400;
                        line-height: 36px;
                        color: #ADADAD;
                    } 
                }
            }
            .wecht-list{
                padding: 0 30px 5px 30px;
                .wecht-lable, .wecht-mess{
                    width: 100%;
                    display: flex;
                    font-size: 24px;
                    font-weight: 500;
                    color: #000000;
                    line-height: 88px;
                    border-bottom: 1px solid #f2f2f2;
                    .item_title{
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        .line_up{
                            margin-right: 8px;
                        }
                        .reash_btn{
                            color: $home-copay-title;
                            display: flex;
                            align-items: center;
                            .loading_icon{
                                width: 32px;
                                height: 32px;
                                margin: 0 3px 0 10px;
                            }
                            .loading_active{
                                width: 32px;
                                height: 32px;
                                -webkit-animation: rotation 15s linear infinite;
                                animation: rotation .8s linear infinite;
                            }
                            @keyframes rotation {
                                0% {
                                    -webkit-transform: rotate(0deg);
                                }
                        
                                100% {
                                    -webkit-transform: rotate(360deg);
                                }
                            }
                        }
                    }
                    .item_mess, .empty_mess{
                        width: 100%;
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        justify-content: center;
                        border-bottom: 1px solid #f2f2f2;
                            .item_status{
                                display: flex;
                                align-items: center;
                                box-sizing: border-box;
                                .line_status, .down_status{
                                    width: 14px;
                                    height: 14px;
                                    margin-right: 8px;
                                    border-radius: 50%;
                                    background: #28C445;
                                }
                                .down_status{
                                    background: #D32C2C;
                                }
                            }
                            .empty_data{
                                display: flex;
                                height: 100px;
                                flex-shrink: 0;
                                margin: 61px 0 41px 0;
                            }
                            .empty_text{
                                width: 100%;
                                color: #aaa;
                                display: flex;
                                line-height: 1;
                                text-align: center;
                                margin-bottom: 96px;
                            }
                    }
                    .item_mess:last-child{
                        border-bottom: none !important;
                    }
                    .page_footer{
                        width: 100%;
                        display: flex;
                        margin: 18px 0;
                        .paging_left{
                            flex-grow: 1;
                        }
                        .refash_right{
                            display: flex;
                            flex-grow: 0;
                            align-items: center;
                            justify-content: center;
                            span{
                                display: flex;
                                width: 152px;
                                height: 44px;
                                color: $home-bind-button;
                                align-items: center;
                                font-size: 24px;
                                border-radius: 26px;
                                justify-content: center;
                                border: 1px solid $home-bind-button;
                            }
                        }
                    }
                }
                .wecht-mess{
                    display: block;
                    color: #141414;
                    border-bottom: none;
                    .on-line{
                        color: #28C445;
                        margin-right: 24px;
                    }
                    .down-line{
                        color: #F52C2C;
                    }
                    .del-btn{
                        color: #A8A8A8;
                    }
                }
            }
            .task_disc{
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                p{
                    display: flex;
                    width: 100%;
                    font-size: 24px;
                    font-weight: 400;
                    color: #ADADAD;
                    align-items: center;
                    letter-spacing: 1px;
                    margin-bottom: 20px;
                }
                p:nth-child(1){
                    margin-top: 40px;
                }
                .point_tips{
                    color: #F52C2C;
                }
            }
        }
    }
</style>
