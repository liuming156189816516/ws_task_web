<template>
    <div class="earn">
        <div class="custom_head">
            <page-header :title="$t('tail_001')" :show-icon="true" :bgcolor="false"></page-header>
            <div class="dropdown_warp">
                <div class="promote-header">
                    <div class="tab_nav" @click="pulldownState">
                        <span v-if = "dateState == ''">{{ $t('tail_002') }}</span> 
                        <span v-else>{{ dateState }}</span> 
                        <van-icon class="down_img" name="arrow-down" style="transition: all 200ms linear" :style="{ transform: `rotate(${showState ? 180 : 0}deg)`}" />
                    </div>
                    <div class="tab_nav" @click="pulldownTime">
                        <span v-if = "!timeValue || timeValue === 0">{{ $t('tail_003') }}</span> 
                        <span v-else-if = "timeValue == 1">{{ $t('other_016') }}</span> 
                        <span v-else-if= "timeValue == 2">{{ $t('other_017') }}</span> 
                        <span v-else-if= "timeValue == 3">{{ $t('other_018') }}</span>
                        <van-icon class="down_img" name="arrow-down" style="transition: all 200ms linear" :style="{ transform: `rotate(${showTime ? 180 : 0}deg)`}" />
                    </div>
                    <!-- <div class="tab_nav cash_nav" @click="pulldownState">
                        总收益：<span style="color:#F52C2C;">{{total_point||0}}元</span> 
                    </div> -->
                </div>
            </div>
        </div>
        <div class="record_list" v-if="list&&list.length>0">
            <div class="record_warp record_title">
                <span>{{$t("tail_004")}}</span>
                <span>{{$t("tail_005")}}</span>
                <span>{{$t("tail_006")}}</span>
            </div>
            <div class="record_content">
                <div class="buy-number" v-for="(item,index) in list" :key="index">
                    <span class="head_title">{{formatTime(item.itime)}}</span>
                    <span class="head_title">{{filterPay(item.type)}}</span>
                    <span class="record_cash">{{item.amount}}</span>
                </div>
            </div>
        </div>
        <div v-else class="empty_tips">{{$t("other_022")}}</div>
        <van-overlay :show = "showState" @click="showState = false">
            <div class="screen_down" @click.stop>
                <ul>
                    <li v-for="item in profitType" :key="item.value" :class="stateValue===item.value?'checkActive':''" @click="changeType(item)">
                        {{item.lable}}
                    </li>
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
        <PrevNext :len="list.length" :page="page" :limit="limit" :total="total" @to-prev="onPrev" @to-next="onNext"></PrevNext>
    </div>
</template>
<script>
import { Toast } from 'vant';
import PageHeader from "@/components/Header";
import { fmoney,formatTime } from "@/utils/tool";
import PrevNext from "@/components/PrevNext";
import { getbillrecordlist } from '@/api/task';
export default {
    components: { PageHeader,PrevNext },
    data() {
        return {
            currentPage:1,
            total_point:0,
            stateValue:null,
            timeValue:"",
            showState:false,
            showTime:false,
            datetime: "",
            dateState: "",
            sTime:"",
            eTime:"",
            currentDate: "", //初始化当前时间
            page: 1,
            limit: 20,
            total: 0,
            state:0,
            list: []
        };
    },
    computed:{
        profitTime(){
            return [this.$t('other_024'),this.$t('other_016'),this.$t('other_017'),this.$t('other_023')];
        },
        profitType(){
            return [{lable:this.$t('other_024'),value:-1},{lable:this.$t('other_025'),value:1 },{lable:this.$t('other_026'),value:2 },{lable:this.$t('other_027'),value:8 },{lable:this.$t('other_028'),value:9 }];
        }
    },
    created() {
        this.billDetail();
    },
    methods: {
        billDetail() {
            let isLoading = Toast.loading({message:this.$t('other_029'),forbidClick: true});
            getbillrecordlist({
                page: this.page,
                limit: this.limit,
                start_time: !this.sTime ? -1 : Date.parse(this.sTime)/1000,
                end_time: !this.eTime? -1 : Date.parse(this.eTime)/1000,
                type: this.stateValue||-1
            }).then(res => {
                isLoading.clear();
                this.total = res.total;
                this.list = res.list || [];
                this.total_point = res.total_point;
                // for(let i = 0;i<this.list.length;i++){
                //     if(String(this.list[i].amount).indexOf("-") == -1){
                //         this.list[i].amount = "+"+(this.list[i].amount/100)    
                //     }else{
                //        this.list[i].amount = this.list[i].amount/100
                //     }
                // }
            });
        },
        onPrev() {
            this.page--;
            this.billDetail();
        },
        onNext() {
            this.page++;
            this.billDetail();
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
        changeType(row){
            this.page = 1;
            this.stateValue = row.value;
            this.dateState = row.value!=-1?row.lable:"";
            this.billDetail();
            setTimeout(() =>{
                this.showState = false;
            },200)
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
            this.billDetail();
            setTimeout(() =>{
                this.showTime = false;
            },200)
        },
        // 格式化金额
        formatMoney(point) {
            return fmoney(point,2);
        },
        formatTime(time) {
            return formatTime(time);
        },
        filterPay(type){
            let result = this.profitType.filter(row=>{return row.value == type});
            if(result.length>0){
                return result[0].lable;
            }else{
                return "-";
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.earn {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color: #f2f2f2;
    -webkit-overflow-scrolling: touch;
    // .dropdown_warp{
    //     margin-top: 90px;
    // }
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
        width: max-content;
        display: flex;
        // flex: 1;
        padding: 20px 30px;
        overflow: hidden;
        border-radius: 0;
        background-color: #FFF2F2;
        .down_img {
            margin-left: 6px;
            width: 30px;
            vertical-align: middle;
        }
        border-radius: 44px;
        align-items: center;
        justify-content: center;
    }
    .cash_nav{
        flex-grow: 1;
        background: transparent;
    }
}
.van-overlay{
  height: calc(100vh - 66px);
  position: absolute;
  top: 135px;
}
.screen_down{
    width: 100%;
    float: left;
    padding: 40px 45px;
    background-color: #fff;
}
.record_list{
    width: 100%;
    float: left;
    overflow: hidden;
}
.record_warp, .record_content{
    width: 100%;
    float: left;
    text-align: center;
    span{
        float: left;
        height: 84px;
        line-height: 84px;
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
.record_warp{
    background-color: #e9e9e9;
}
.record_title{
    font-size: 28px;
    span{
        font-weight: 550;
    }  
}
.record_content{
    width: 100%;
    overflow-y: auto;
    font-size: 0.28rem;
    box-sizing: border-box;
    position: relative;
    height: calc(100vh - 425px);
    .buy-number{
        width: 100%;
        float: left;
        padding: 10px 0;
        background-color: #fff;
        border-bottom: 1px solid  #e9e9e9;
    }
    .record_cash{
        float: right;
        color: #fe003c;
        font-size: 0.28rem;
    }
}
.buy-footer{
    width:100%;
    display: flex;
    font-size: 28px;
    align-items: center;
    justify-content: center;
}
</style>