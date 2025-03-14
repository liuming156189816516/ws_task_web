<template>
    <div class="earn">
        <div class="custom_head">
            <page-header :title="$t('mine_010')" :show-icon="true" :bgColor="true"></page-header>
            <div class="dropdown_warp">
                <div class="promote_header flex-item flex-align flex-between">
                    <div class="change_value flex-item">
                        <span class="flex-item">{{ dateState }}</span>
                        <span class="flex-item"> {{ profitTime[timeValue] }}</span>
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
                                <p class="task_bonus font_30">{{profitType.find(val=> val.value == item.type)?profitType.find(val=> val.value == item.type).lable:"" }}</p>
                                <p class="task_type font_24" v-if="item.task_type>0">{{ taskOption[item.task_type] }}</p>
                            </div>
                            <div class="task_money font_30" v-if="item.type==9" style="color:#F52C2C;">{{ item.amount }}</div>
                            <div class="task_money font_30" v-else-if="item.type==4&&!checkReduce(item.amount)">{{ item.amount }}</div>
                            <div class="task_money font_30" v-else-if="item.type==8&&checkReduce(item.amount)">+{{ item.amount }}</div>
                            <div class="task_money font_30" v-else-if="item.type==8&&!checkReduce(item.amount)" style="color:#F52C2C;">{{ item.amount }}</div>
                            <div class="task_money font_30" v-else>+{{ item.amount }}</div>
                        </div>
                        <div class="order_time w_f flex-item flex-align flex-between font_26">
                            <!-- <span>{{$t('home_001',{value:item.balance})}}</span> -->
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
                        <li v-for="item in profitType" :key="item.value" :class="stateValue===item.value?'checkActive':''" @click="changeType(item)">
                            {{item.lable}}
                        </li>
                    </ul>
                    <p class="font_24">{{$t('tail_004')}}</p>
                    <ul>
                        <li v-for="(item,index) in profitTime" v-show="item!=''" :class="index === timeValue  ? 'checkActive':''" :key="index" @click="changeTime(item,index)">{{item}}</li>
                    </ul>
                </div>
                <div class="footer_btn w_f flex-item flex-between">
                    <van-button type="primary" :loading="isLoading" @click="submitFun(1)">{{ $t('other_053') }}</van-button>
                    <van-button type="primary" :loading="isLoading" @click="submitFun(2)">{{ $t('home_038') }}</van-button>
                </div>
            </div>
        </van-overlay>
    </div>
</template>
<script>
import { Toast } from 'vant';
import PageHeader from "@/components/Header";
import { fmoney,formatTime } from "@/utils/tool";
import PrevNext from "@/components/PrevNext";
import { getbillrecordlist } from '@/api/task';
export default {
    components: { PageHeader },
    data() {
        return {
            currentPage:1,
            total_point:0,
            stateValue:null,
            timeValue:"",
            loading:false,
            page_total:0,
            finished :false,
            showState:false,
            showTime:false,
            datetime: "",
            dateState: "",
            sTime:"",
            eTime:"",
            currentDate: "", //初始化当前时间
            page: 1,
            limit:20,
            total: 0,
            state:0,
            list: []
        };
    },
    computed:{
        profitTime(){
            return [this.$t('other_016'),this.$t('other_017'),this.$t('other_057')];
        },
        profitType(){
            return [{lable:this.$t('other_052'),value:-1},{lable:this.$t('other_025'),value:1 },{lable:this.$t('other_026'),value:2 },{lable:this.$t('spre_023'),value:3},{lable:this.$t('spre_024'),value:4},{lable:this.$t('spre_025'),value:5},{lable:this.$t('spre_026'),value:6},{lable:this.$t('other_027'),value:8 },{lable:this.$t('other_028'),value:9 },{lable:this.$t('other_103'),value:10 }];
        },
        taskOption(){
            return ["",this.$t('other_058'),this.$t('other_059'),this.$t('other_060')];
        }
    },
    created() {
        this.stateValue=-1;
        this.timeValue = 0;
        this.dateState = this.$t('other_052');
        // this.timeText = this.$t('other_057');
        let params = this.$route.query;
        if (params.type) {
            this.timeValue = Number(params.type);
            // this.changeTime(this.profitTime[this.timeValue],this.timeValue)
        }
        if (params.id) {
            this.stateValue = Number(params.id);
            this.dateState = this.$t('other_054');
        }
        this.billDetail();
    },
    methods: {
        billDetail() {
            this.page == 1?this.list=[]:"";
            let isLoading = Toast.loading({message:this.$t('other_029'),forbidClick: true});
            getbillrecordlist({
                page: this.page,
                limit: this.limit,
                date_type:this.timeValue+1,
                // start_time: !this.sTime ? -1 : Date.parse(this.sTime)/1000,
                // end_time: !this.eTime? -1 : Date.parse(this.eTime)/1000,
                type: this.stateValue
            }).then(res => {
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
                this.billDetail()
            }
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
            this.dateState = row.lable;
        },
        // 选择收益时间
        changeTime(row,idx){
            this.page = 1;
            this.timeValue = idx;
            this.timeText = row;
            // let newDate = new Date();
            // let sTime = "00"+":"+"00"+":"+"00";
            // let eTime = "23"+":"+"59"+":"+"59";
            // if(idx == 0){
            //     newDate.setTime(newDate.getTime());
            //     let today = newDate.getFullYear()+"-" + (newDate.getMonth()+1) + "-" + newDate.getDate();
            //     this.datetime = today;
            //     this.sTime = today +" "+ sTime;
            //     this.eTime = today +" "+ eTime;
            // }else if(idx == 1){
            //     newDate.setTime(newDate.getTime()-24*60*60*1000);
            //     let yTady = newDate.getFullYear()+"-" + (newDate.getMonth()+1) + "-" + newDate.getDate();
            //     this.datetime = yTady;
            //     this.sTime = yTady +" "+ sTime;
            //     this.eTime = yTady +" "+ eTime;
            // }else if(idx == 2){
            //     newDate.setTime(newDate.getTime());
            //     let today = newDate.getFullYear()+"-" + (newDate.getMonth()+1) + "-" + newDate.getDate();
            //     newDate.setTime(newDate.getTime()-7*24*60*60*1000);
            //     let sevenTady = newDate.getFullYear()+"-" + (newDate.getMonth()+1) + "-" + newDate.getDate();
            //     this.datetime = sevenTady;
            //     this.sTime = sevenTady +" "+ sTime;
            //     this.eTime = today +" "+ eTime;
            // }else{
            //     this.sTime = "";
            //     this.eTime = "";
            // }
            // this.billDetail();
            // setTimeout(() =>{
            //     this.showTime = false;
            // },200)
        },
        submitFun(type){
            if(type == 1){
                this.timeText="";
                this.timeValue=0;
                this.stateValue=null;
                this.dateState=this.$t('other_052');
            }
            this.billDetail();
            setTimeout(() =>{
                this.showState = false;
            },200)
        },
        // 格式化金额
        formatMoney(point) {
            return fmoney(point,2);
        },
        formatTime(time) {
            return formatTime(time,1);
        },
        filterPay(type){
            let result = this.profitType.filter(row=>{return row.value == type});
            if(result.length>0){
                return result[0].lable;
            }else{
                return "-";
            }
        },
        checkReduce(val){
            if (String(val).indexOf("-") > -1) {
                return false;
            }else{
                return true;
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
    margin-bottom: 30px;
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