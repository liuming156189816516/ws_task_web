<template>
    <div class="earn">
        <div class="custom_head">
            <page-header :title="$t('mine_011')" :show-icon="true" :bgColor="true"></page-header>
            <div class="dropdown_warp">
                <div class="promote_header flex-item flex-align flex-between">
                    <div class="change_value flex-item">
                        <span class="flex-item"> {{ timeText }}</span>
                        <span class="flex-item">{{ dateState }}</span>
                    </div>
                    <div class="fiter_icon flex-item flex-align" @click="pulldownState">
                        <span class="font_28" style="font-weight: 700;">{{$t('tail_013')}}</span>
                        <img src="@/assets/images/mine/down_icon.png">
                    </div>
                </div>
            </div>
        </div>
        <div class="record_list w_f" v-if="list&&list.length>0">
            <van-list v-model="loading" :finished="finished" :loading-text="$t('other_029')" :finished-text="$t('other_063')" offset="60" @load="onLoad">
                <div class="record_item flex-item flex-align" v-for="(item,index) in list" :key="index">
                    <img class="l_icon" src="@/assets/images/mine/order_icon.png" alt="">
                    <div class="w_f flex-item flex-align flex-dir-c">
                        <div class="w_f flex-item flex-align flex-between">
                            <div class="flex-item flex-dir-c">
                                <p class="task_bonus font_30">{{ $t('other_055') }}</p>
                                <p class="task_type font_24" v-if="item.status==3" :style="{color:`${orderOption[item.status].color}`}" @click="showReject(item)">{{ orderOption[item.status].name }}</p>
                                <p class="task_type font_24" v-else :style="{color:`${orderOption[item.status].color}`}">{{ orderOption[item.status].name }}</p>
                            </div>
                            <div class="task_money flex-item flex-align flex-dir-c">
                                <p class="font_30">-{{ item.amount }}</p>
                                <!-- <p class="font_24"> 
                                    {{$t('home_001',{value:item.balance})}}
                                </p> -->
                            </div>
                        </div>
                        <div class="order_time w_f flex-item flex-align flex-between font_26">
                            <!-- <span>{{$t('tail_014',{value:item.txid})}}</span> -->
                            <span>{{ formatTime(item.itime) }}</span>
                        </div>
                    </div>
                </div>
            </van-list>
        </div>
        <div v-else class="empty_tips w_f flex-item flex-align flex-center flex-dir-c">
            <img src="../../assets/images/empty_icon.png" alt="" />
            <p>{{$t('tail_010')}}</p>
        </div>
        <van-overlay :show = "showState" @click="showState = false">
            <div class="screen_down" @click.stop>
                <div class="w_f flex-item flex-dir-c">
                    <p class="font_24">{{$t('tail_002')}}</p>
                    <ul>
                        <li v-for="(item,index) in profitTime" :class="index === timeValue  ? 'checkActive':''" :key="index" @click="changeTime(item,index)">{{item}}</li>
                    </ul>
                    <p class="font_24">{{$t('tail_004')}}</p>
                    <ul>
                        <li v-for="item in profitType" :key="item.value" :class="stateValue===item.value?'checkActive':''" @click="changeType(item)">
                            {{item.lable}}
                        </li>
                    </ul>
                </div>
                <div class="footer_btn w_f flex-item flex-between">
                    <van-button type="primary" :loading="isLoading" @click="submitFun(1)">{{ $t('other_053') }}</van-button>
                    <van-button type="primary" :loading="isLoading" @click="submitFun(2)">{{ $t('home_038') }}</van-button>
                </div>
            </div>
        </van-overlay>
        <popDialog ref="isDialog" :title="$t('tail_012')" :titleContent = "dialogContent" :isCancel = false :isConfirm = true @confirm_btn = "confirm_btn"></popDialog>
    </div>
</template>
<script>
import moment from "moment";
import { Toast } from 'vant';
import PageHeader from "@/components/Header";
import {dateStamp,formatTime } from "@/utils/tool";
import popDialog from "@/components/popDialog";
import { getwithdrawapprovallist } from "@/api/pay";

export default {
    components: { PageHeader,popDialog },
    data() {
        return {
            dialogContent:"",
            stateValue:-1,
            timeValue:3,
            timeText:"",
            loading:false,
            finished :false,
            page_total:0,
            showState:false,
            showTime:false,
            currentDate: "",
            datetime: "",
            dateState: "",
            sTime:"",
            eTime:"",
            list: [],
            page: 1,
            limit:10,
            ptype: -1,
            total: 0
        };
    },
    computed:{
        profitTime(){
            return [this.$t('other_016'),this.$t('other_017'),this.$t('other_018'),this.$t('other_057')];
        },
        profitType(){
            return [{lable:this.$t('other_052'),value:-1},{lable:this.$t('home_006'),value:1 },{lable:this.$t('pay_031'),value:2 },{lable:this.$t('pay_032'),value:3 }];
        },
        orderOption(){
            return ["",
                {name:this.$t('pay_030'),color:"#FFA800"},
                {name:this.$t('pay_031'),color:"#008751"},
                {name:this.$t('pay_032'),color:"#FF4E28"}
            ]
        }
    },
    created() {
        this.dateState = this.$t('other_052');
        this.timeText = this.$t('other_057');
        this.getPointflow();
    },
    methods: {
        getPointflow() {
            let params = {
                page: this.page,
                limit: this.limit,
                status: this.stateValue,
                start_time: !this.sTime ? -1: dateStamp(this.sTime),
                end_time: !this.eTime ? -1: dateStamp(this.eTime),
            }
            this.list = [];
            let isLoading = Toast.loading({message:this.$t('other_029'),forbidClick: true})
            getwithdrawapprovallist(params).then(res => {
                isLoading.clear();
                this.loading = false;
                this.page_total = Math.ceil(res.total / this.limit);
                this.list = [...this.list,...res.list];
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
        getTime(times) {
            return moment(times * 1000).format("YYYY-MM-DD HH:mm:ss");
        },
        //查看驳回原因
        showReject(val){
            this.dialogContent = val.remark
            this.$refs.isDialog.showDialog()
        },
        //关闭驳回原因
        confirm_btn(){
            // this.$refs.isDialog.dialogModel = false
            this.$refs.isDialog.closeModel()
        },
        pulldownState(){
            this.showTime = false;
            this.showState = !this.showState;
        },
        pulldownTime(){
            this.showState = false;
            this.showTime = !this.showTime;
        },
        // 选择收益类型
        changeType(val){
            this.stateValue = val.value;
            this.dateState = val.lable;
            // this.getPointflow();
            // setTimeout(() =>{
            //     this.showState = false;
            // },200)
        },
        getStatusColor(status) {
            switch (status) {
                case 1:
                    return { color: "rgb(255, 144, 0)" };
                case 2:
                    return { color: "rgb(3, 176, 27)" };
                case 3:
                    return { color: "rgb(255, 0, 66)" };
                default:
                    return {};
            }
        },
        getStatusText(status) {
            switch (status) {
                case 1:
                    return this.$t("tail_005");
                case 2:
                    return this.$t("tail_006");
                case 3:
                    return this.$t("tail_011");
                default:
                    return "";
            }
        },
        // 选择收益时间
        changeTime(row,idx){
            this.page = 1;
            this.timeValue = idx;
            this.timeText = row;
            let newDate = new Date();
            let sTime = "00"+":"+"00"+":"+"00";
            let eTime = "23"+":"+"59"+":"+"59";
            if(idx == 0){
                newDate.setTime(newDate.getTime());
                let today = newDate.getFullYear()+"-" + (newDate.getMonth()+1) + "-" + newDate.getDate();
                this.datetime = today;
                this.sTime = today +" "+ sTime;
                this.eTime = today +" "+ eTime;
            }else if(idx == 1){
                newDate.setTime(newDate.getTime()-24*60*60*1000);
                let yTady = newDate.getFullYear()+"-" + (newDate.getMonth()+1) + "-" + newDate.getDate();
                this.datetime = yTady;
                this.sTime = yTady +" "+ sTime;
                this.eTime = yTady +" "+ eTime;
            }else if(idx == 2){
                newDate.setTime(newDate.getTime());
                let today = newDate.getFullYear()+"-" + (newDate.getMonth()+1) + "-" + newDate.getDate();
                newDate.setTime(newDate.getTime()-7*24*60*60*1000);
                let sevenTady = newDate.getFullYear()+"-" + (newDate.getMonth()+1) + "-" + newDate.getDate();
                this.datetime = sevenTady;
                this.sTime = sevenTady +" "+ sTime;
                this.eTime = today +" "+ eTime;
            }else{
                this.sTime = "";
                this.eTime = "";
            }
            // this.getPointflow();
            // setTimeout(() =>{
            //     this.showTime = false;
            // },200)
        },
        submitFun(type){
            if(type == 1){
                this.timeText="";
                this.dateState="";
                this.sTime = "";
                this.eTime = "";
                this.stateValue=null;
                this.timeValue=null;
            }
            this.getPointflow();
            setTimeout(() =>{
                this.showState = false;
            },200)
        },
        formatTime(time) {
            return formatTime(time,1);
        }
    }
};
</script>
<style lang="scss" scoped>
.earn {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: relative;
    background-color: #f2f2f2;
    -webkit-overflow-scrolling: touch;
    .custom_head{
        width:100%;
        float: left;
        z-index: 2;
        position: relative;
        .dropdown_warp{
            position: relative;
            .promote_header {
                width: 100%;
                height: 88px;
                font-size: 28px;
                padding: 0 26px;
                box-sizing: border-box;
                background-color: #fff;
                .fiter_icon{
                    img{
                        height: 12px;
                        margin: 6px 0 0 5px;
                    }
                }
                .change_value{
                    color: $color-theme;
                    span:nth-child(2){
                        margin-left: 20px;
                    }
                }
            }
        }
    }
}

.van-overlay{
    height: calc(100vh - 66px);
    position: absolute;
    top: 88px;
}
.screen_down{
    width: 100%;
    float: left;
    padding: 40px 45px;
    background-color: #fff;
    p{
        margin-bottom: 32px;
        color: $home-title-06;
    }
    .footer_btn{
        gap: 34px;
        margin-top: 36px;
        padding-top: 20px;
        border-top: 1px solid $home-title-17;
        .van-button{
            flex: 1;
            border-radius: 8px;
        }
        .van-button:nth-child(1){
            color: $color-theme;
            border-color: $home-title-16;
            background-color: $home-title-16;
        }
        .van-button:nth-child(2){
            border-color: $color-theme;
            background-color: $color-theme;
        }
    }
}
.record_list{
    gap: 20px;
    height: 100%;
    overflow-y: auto;
    padding: 20px 26px;
    padding-bottom: 160px;
    box-sizing: border-box;
    .record_item{
        margin-bottom: 20px;
        padding: 10px 10px;
        border-radius: 20px;
        box-sizing: border-box;
        background: $font-color-white;
        .l_icon{
            height: 52px;
            margin-right: 14px;
        }
        .task_bonus{
            font-weight: bold;
            color: $home-title-12;
        }
        .task_type{
            color: $home-title-06;
        }
        .task_money{
            font-weight: bold;
            color: $home-title-12;
        }
        .order_time{
            margin-top: 14px;
            color: $home-title-06;
        }
    }
}
.record_warp{
    padding: 10px 0;
    background-color: #e9e9e9;
}
.record_warp, .record_content{
    width: 100%;
    float: left;
    text-align: center;
    span{
        float: left;
        height: 60px;
        line-height: 62px;
    }
    span:nth-child(1) {
        width: 46%;
    }
    span:nth-child(2){
        width: 30%;
    }
    span:nth-child(3){
        width: 24%;
    }
}
.record_content{
    width: 100%;
    overflow-y: auto;
    font-size: 0.28rem;
    box-sizing: border-box;
    position: relative;
    height: calc(100vh - 430px);
    .buy-number{
        width: 100%;
        float: left;
        padding: 10px 0;
        background-color: #fff;
        border-bottom: 1px solid  #e9e9e9;
    }
    .record_cash{
        float: right;
        font-weight: 550;
        color: #fe003c;
        font-size: 0.28rem;
    }
}
.buy-title {
    flex-shrink: 0;
    background-color: rgb(233, 233, 233);
    font-size: 28px !important;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    overflow: hidden;
    border-bottom: none !important;
}
.reject_tips{
    img{
        width: 21px;
    }
}

.footer-disabled {
    background-color: rgba(179, 206, 244, 0.8) !important;
}
.buy-footer{
    width:100%;
    display: flex;
    font-size: 28px;
    align-items: center;
    justify-content: center;
    background: transparent;
}
.screen_down .checkActive, .singular_down .checkActive{
  color: #fff;
  background-color: $color-theme;
}
.singular_down .checkActive{
  background-color: transparent;
}
</style>
