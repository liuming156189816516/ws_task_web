<template>
    <div class="earn">
        <page-header :title="$t('mine_004')" :show-icon="true"></page-header>
        <div class="dropdown_warp">
                <div class="promote-header">
                    <div class="tab_nav" @click="pulldownState">
                        <span v-if = "!stateValue||stateValue=='-1'">{{ $t('tail_008') }}</span> 
                        <span v-else>{{ dateState }}</span> 
                        <van-icon class="down_img" name="arrow-down" style="transition: all 200ms linear" :style="{ transform: `rotate(${showState ? 180 : 0}deg)`}" />
                    </div>
                    <div class="tab_nav" @click="pulldownTime">
                        <span v-if = "!timeValue || timeValue === 0">{{ $t('tail_004') }}</span> 
                        <span v-else-if = "timeValue == 1">{{ $t('other_016') }}</span> 
                        <span v-else-if= "timeValue == 2">{{ $t('other_017') }}</span> 
                        <span v-else-if= "timeValue == 3">{{ $t('other_018') }}</span>
                        <van-icon class="down_img" name="arrow-down" style="transition: all 200ms linear" :style="{ transform: `rotate(${showTime ? 180 : 0}deg)`}" />
                    </div>
                </div>
                <van-overlay :show = "showState" @click="showState = false">
                    <div class="screen_down" @click.stop>
                        <ul>
                            <li v-for="item in profitType" :key="item.value" :class="item.value === stateValue  ? 'checkActive':''" @click="changeType(item)">{{item.lable}}</li>
                        </ul>
                    </div>
                </van-overlay>
                <van-overlay :show = "showTime" @click="showTime = false">
                    <div class="screen_down" @click.stop>
                        <ul>
                            <li v-for="(item,index) in profitTime" :class="index === timeValue  ? 'checkActive':''" :key="index" @click="changeTime(index)">{{item}}</li>
                        </ul>
                    </div>
                </van-overlay>
            </div>

        <div class="service-body" v-if="list&&list.length>0">
            <div class="record_list">
                <div class="record_warp">
                    <span>{{ $t('tail_004') }}</span>
                    <span>{{ $t('tail_008') }}</span>
                    <span>{{ $t('pay_016') }}</span>
                </div>
            </div>
            <div class="record_content">
                <div class="buy-number" v-for="(item,index) in list" :key="index">
                    <span>{{ formatTime(item.itime) }}</span>
                    <span :style="getStatusColor(item.status)">{{getStatusText(item.status)}}</span>
                    <span class="record_cash" v-if="item.status!=3">{{ item.amount }}</span>
                    <span class="reject_tips record_cash" v-else @click="showReject(item)">{{ item.amount }} <img src="../../assets/images/mine/reject_img.png" alt=""> </span>
                </div>
            </div>
        </div>
        <div v-else class="empty_tips">{{ $t('other_022') }}</div>
        <PrevNext v-if="list&&list.length>0" :len="list.length" :page="page" :limit="limit" :total="total" @to-prev="onPrev" @to-next="onNext" />
        <popDialog ref="isDialog" :title="$t('tail_012')" :titleContent = "dialogContent" :isCancel = false :isConfirm = true @confirm_btn = "confirm_btn"></popDialog>
    </div>
</template>
<script>
import moment from "moment";
import { Toast } from 'vant';
import PageHeader from "@/components/Header";
import PrevNext from "@/components/PrevNext";
import {dateStamp,formatTime } from "@/utils/tool";
import popDialog from "@/components/popDialog";
import { getwithdrawapprovallist } from "@/api/pay";

export default {
    components: { PageHeader, PrevNext,popDialog },
    data() {
        return {
            dialogContent:"",
            stateValue:-1,
            timeValue:"",
            showState:false,
            showTime:false,
            datetime: "",
            dateState: "",
            sTime:"",
            eTime:"",
            currentDate: "", //初始化当前时间
            list: [],
            page: 1,
            limit: 20,
            ptype: -1,
            total: 0
        };
    },
    computed:{
        profitTime(){
            return [this.$t('other_024'),this.$t('other_016'),this.$t('other_017'),this.$t('other_023')];
        },
        profitType(){
            return [{lable:this.$t('other_024'),value:-1},{lable:this.$t('tail_005'),value:1 },{lable:this.$t('tail_006'),value:2 },{lable:this.$t('tail_011'),value:3 }];
        }
    },
    created() {
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
            let isLoading = Toast.loading({message:this.$t('other_029'),forbidClick: true})
            getwithdrawapprovallist(params).then(res => {
                isLoading.clear();
                this.list = res.list || [];
                this.total = res.total;
            })
        },
        onPrev() {
            this.page--;
            this.getPointflow();
        },
        onNext() {
            this.page++;
            this.getPointflow();
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
            this.getPointflow();
            setTimeout(() =>{
                this.showState = false;
            },200)
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
        changeTime(idx){
            this.page = 1;
            this.timeValue = idx;
            let newDate = new Date();
            let sTime = "00"+":"+"00"+":"+"00";
            let eTime = "23"+":"+"59"+":"+"59";
            if(idx == 1){
                newDate.setTime(newDate.getTime());
                let today = newDate.getFullYear()+"-" + (newDate.getMonth()+1) + "-" + newDate.getDate();
                this.datetime = today;
                this.sTime = today +" "+ sTime;
                this.eTime = today +" "+ eTime;
            }else if(idx == 2){
                newDate.setTime(newDate.getTime()-24*60*60*1000);
                let yTady = newDate.getFullYear()+"-" + (newDate.getMonth()+1) + "-" + newDate.getDate();
                this.datetime = yTady;
                this.sTime = yTady +" "+ sTime;
                this.eTime = yTady +" "+ eTime;
            }else if(idx == 3){
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
            this.getPointflow();
            setTimeout(() =>{
                this.showTime = false;
            },200)
        },
        formatTime(time) {
            return formatTime(time);
        }
    }
};
</script>
<style lang="scss" scoped>
.earn {
    width: 100%;
    height: 100vh;
    overflow-x: hidden;
    float: left;
    overflow-y: scroll;
    background-color: #f2f2f2;
        .dropdown_warp{
            // margin-top: 10px;
            position: relative;
        }
        .custom_head{
            width:100%;
            float: left;
            z-index: 2;
            position: relative;
        }
}
.promote-header {
    width: 100%;
    display: flex;
    color: #7e7e7e;
    flex-direction: row;
    padding: 12px 30px 12px;
    font-size: 28px;
    background-color: #fff;
    justify-content:space-around;
    border-bottom: 1px solid  #f2f2f2;
    gap: 20px;
    .tab_nav {
        display: flex;
        // flex: 1;
        width: max-content;
        padding: 20px 30px;
        text-align: center;
        border-radius: 44px;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        background-color: #F2F7FF;
        .down_img {
            width: 30px;
            margin-left: 6px;
            vertical-align: middle;
        }
    }
    .tab_nav:nth-child(1){
        border-right: 1px solid #f2f2f2;
    }
}
.van-overlay{
  height: calc(100vh - 66px);
  position: absolute;
  top: 50px;
}
.screen_down{
    width: 100%;
    float: left;
    padding: 30px 35px;
    background-color: #fff;
}
.service-body{
    width: 100%;
    float: left;
    background-color: #fff;
    font-size: 28px;
    box-sizing: border-box;
    .record_list{
        width: 100%;
        float: left;
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
}
</style>
