<template>
        <div class="home-content" ref="warpBox" @scroll="handleScrolStop">
            <div class="task_mian w_f">
                <page-header :title="$t('home_168')" :show-icon="true" :bgcolor="false" />
                <div class="video_box flex-item flex-item flex-align flex-center mg_24">
                    <video class="myVideo" ref="myVideo" controls="controls" style="width:100%;height:160px;" src="https://rw-nrly.s3.af-south-1.amazonaws.com/5.MP4" />
                </div>
            </div>
            <div class="task_warp w_f flex-item">
                <div class="task_main w_f flex-item flex-dir-c">
                    <div class="task_item w_f flex-item flex-dir-c font_34">
                        <div :class="['ws_head w_f flex-item flex-dir-c',!show_code?'ws_head_active':'']">
                            <div class="task_award w_f">
                                <div class="w_f task_book flex-item flex-between font_28">
                                    <div class="task_title"> {{$t('home_144')}} </div>
                                    <van-button class="flex-item font_28" @click="show_code=!show_code">{{show_code?$t('home_171'):$t('home_170')}}</van-button>
                                </div>
                            </div>
                        </div>
                        <div class="ws_list w_f flex-item flex-dir-c" v-if="show_code">
                            <div class="ws_account" style="background:transparent;">
                                <div class="ws_verfy_box w_f flex-item flex-align flex-center flex-dir-c">
                                    <div class="ws_value w_f flex-item flex-align flex-center" id="step_02">
                                        <div class="area_code flex-item font_28" @click="showOverlay">+ <span>{{current_code}}</span></div>
                                        <input v-model="ws_account" :disabled="ws_status!=0" :placeholder="$t('login_027')+' '+$t('login_038')" autocomplete="off" oninput="value=value.replace(/\D/g,'')" />
                                        <span class="select_icon flex-item flex-align flex-cente" v-if="ws_status!=0">
                                            <van-button class="flex-item font_28" :loading="isUnbind" :disabled="isUnbind" @click="handleUnbind" :loading-text="$t('other_029')">{{$t('other_094')}}</van-button>
                                        </span>
                                    </div>
                                    <template v-if="ws_status==0">
                                        <van-button id="step_03" class="tabs_item flex-item font_28" :loading="isLoading" :disabled="!ws_account||isLoading||countTime!=60" @click="getVerifBtn" :loading-text="$t('other_029')">
                                            {{countTime!=60? $t('other_093',{value:countTime}):$t('login_017')}}
                                        </van-button>
                                        <div class="verfy_list w_f flex-item flex-align flex-between">
                                            <div class="flex-item flex-align flex-center" v-for="(item,idx) in codeOption" :key="idx">
                                                <span v-if="item=='—'" class="flex-item flex-align flex-center">{{item}}</span>
                                                <span v-else class="modle_line flex-item flex-align flex-center">{{item}}</span>
                                            </div>
                                            <span class="copay_text flex-item flex-align flex-center" v-clipboard:copy="very_code" v-clipboard:success="copySuccess">
                                                <img src="@/assets/images/home/copau_icon.png">
                                            </span>
                                        </div>
                                        <div class="mt_20 font_28">{{$t('other_095')}}</div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ws_hook_list w_f flex-item flex-between font_30">
                <h3 class="ws_title flex-item font_24">
                    {{$t('home_169')}}：
                </h3>
                <div class="flex-item status_tips flex-align" @click="refreshBtn">
                    <img class="refres_icon" :class="{'refres_animat':ref_loading}"  src="@/assets/images/home/shuaxin.png"> 
                    {{$t('other_035')}}
                </div>
            </div>
            <div class="record_list w_f flex-item flex-dir-c">
                <div class="title_top task_title_head w_f flex-item flex-align flex-between font_24">
                    <span class="flex-item flex-align">{{$t('login_038')}}</span>
                    <!-- <span class="flex-item flex-center">{{$t('home_031')}}</span> -->
                    <span class="flex-item flex-center">{{$t('tail_008')}}</span>
                    <!-- <span class="flex-item">{{$t('spre_012')}}</span> -->
                    <span class="flex-item">{{$t('home_022')}}</span>
                </div>
                <template v-if="pullGroupList&&pullGroupList.length>0">
                    <div class="record_scroll w_f flex-item flex-dir-c">
                        <div class="title_top record_item w_f flex-item flex-align flex-between font_24" v-for="(item,idx) in pullGroupList" :key="idx">
                            <span class="flex-item">{{ item.account }}</span>
                            <span class="flex-item" :style="'color:'+(item.status!=2?'#D32C2C':'#28C445')">{{statusOption[item.status]}}</span>
                            <span :class="['flex-item',item.status==2?'record_click':'']" @click="showDelBtn(item)">{{$t('other_010')}}</span>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="empty_box w_f flex-item flex-align flex-center flex-dir-c">
                        <img src="@/assets/images/empty_icon.png" alt="" srcset="">
                        <p class="font_28">{{$t('tail_010')}}</p>
                    </div>
                </template>
            </div>
            <div class="born_record w_f flex-item flex-dir-c">
                <h3 class="font_28">{{$t('mine_010')}}</h3>
            </div>
            <div class="record_list w_f flex-item flex-dir-c">
                <div class="title_top task_title_head w_f flex-item flex-align flex-between font_24">
                    <span class="flex-item flex-align">{{$t('tail_003')}}</span>
                    <!-- <span class="flex-item flex-center">{{$t('home_031')}}</span> -->
                    <span class="flex-item flex-center">{{$t('home_020')}}</span>
                    <!-- <span class="flex-item">{{$t('spre_012')}}</span> -->
                    <span class="flex-item">{{$t('spre_012')}}</span>
                </div>
                <template v-if="hookRecordList&&hookRecordList.length>0">
                    <div class="record_scroll w_f flex-item flex-dir-c">
                        <van-list v-model="loading" :finished="finished" :loading-text="$t('other_029')" :finished-text="$t('other_063')" offset="60" @load="onLoad">
                            <div class="title_top record_item w_f flex-item flex-align flex-between font_24" v-for="(item,idx) in hookRecordList" :key="idx">
                                <span class="flex-item">{{ formatTime(item.itime) }}</span>
                                <span class="flex-item">{{item.account}}</span>
                                <span class="flex-item">{{item.amount}}</span>
                            </div>
                        </van-list>
                    </div>
                </template>
                <template v-else>
                    <div class="empty_box w_f flex-item flex-align flex-center flex-dir-c">
                        <img src="@/assets/images/empty_icon.png" alt="" srcset="">
                        <p class="font_28">{{$t('tail_010')}}</p>
                    </div>
                </template>
            </div>
            <div class="record_legend w_f flex-item flex-dir-c">
                <h3 class="font_28">{{$t('spre_009')}}</h3>
                <div class="record_derc font_22">{{$t('spre_010')}} <span class="focus_tips" @click="$Helper.globalSupport()">{{$t('spre_011')}}</span></div>
            </div>
            <div :class="['top_icon',isScroll?'icon_active':'icon_hide']" @click="scrollTopBtn">
                <img class="ws_icon" src="@/assets/images/home/dingbu.png" alt="">
            </div>
            <van-overlay :show="code_model">
                <div class="country_warp w_f">
                    <div class="country_head flex-item flex-align font_36">
                        <img @click="code_model=false" src="@/assets/images/bank_icon.png" alt="" srcset="">
                        <span>{{$t('home_148')}}</span>
                    </div>
                    <div class="code_query w_f">
                        <div class="ws_value w_f flex-item flex-align flex-center font_24 flex-between">
                            <input v-model="ws_code" @keyup="filterCity" :placeholder="$t('home_149')" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" />
                        </div>
                    </div>
                    <div class="country_list w_f" ref="tips_scroll">
                        <div class="country_item w_f flex-item font_28 flex-between" v-for="(item,idx) in countryList" :key="idx" @click="handleCode(item.code)">
                            <span>{{item.name}}</span>
                            <span class="c_code">{{item.code}}</span>
                        </div>
                    </div>
                </div>
            </van-overlay>

            <van-overlay :show="del_model">
                <div class="log_warp w_f flex-item flex-align flex-center flex-dir-c">
                    <div class="log_main">
                        {{ tipsText }}
                        <div class="footer_bnt w_f flex-item flex-center">
                            <van-button class="footer_confirm" type="primary" :loading="isLoading" loading-text="Loading..." @click="handle_confirm">{{$t('other_003')}}</van-button>
                            <van-button class="footer_cancel" type="primary" @click="del_model=false">{{$t('other_007')}}</van-button>
                        </div>
                    </div>
                </div>
            </van-overlay>
            <vue-intro-step v-model="showStep" :config="config" ref="myIntroStep">
                <template #prev="{tipItem, index}">
                    <button @click="prev(tipItem, index)" class="step_prev">{{$t('home_160')}}</button>
                </template>
                <template #next="{tipItem}">
                    <button @click="next(tipItem)" class="next_step">{{$t('home_161')}}</button>
                </template>
                <template #skip>
                    <button @click="skip" class="skip_step">{{$t('home_162')}}</button>
                </template>
                <template #done>
                    <button @click="done" class="next_step">{{$t('home_162')}}</button>
                </template>
            </vue-intro-step>
        </div>
</template>
<script>
import { mapState } from 'vuex';
import { formatTime } from "@/utils/tool";
import uniFun from "@/utils/uni-webview-js"
import PageHeader from "@/components/Header";
import { getautogroupinfo,getqrcode,delaccount,submitautogrouptask,getautogroupaccountstatus,getaccountlist,getwsincomelist } from '@/api/home'
export default {
	name: 'scan_online',
	components: {PageHeader},
	data() {
		return {
            page:1,
            limit: 20,
            showStep:false,
            page_total:0,
            timer:null,
            ws_account:"",
            // ws_account:"8138570713",
            very_code:"",
            ws_code:"",
            code_model:false,
            del_model:false,
            task_id:"",
            old_account:"",
            isShow:false,
            isStatus:false,
            wechaList:[],
            taskList:[],
            tipsText:"",
            account:"",
            isDown:false,
            countTime:60,
            isLoading:false,
            isUnbind:false,
            teamStemp:'',
            finished :false,
            timestamp:0,
            group_link:'',
            target_url:'',
            taskTime: null,
            isScroll:false,
            show_code:true,
            ws_status: 0,
            ref_loading:false,
            account_type:"1",
            pullGroupList:[],
            countryList:[],
            hookRecordList:[],
            current_code:""||"234",
            accountList:[1,1,1,1,1,1],
            codeOption:["","","","","—","","","",""],
            config: {
                backgroundOpacity: 0.7,
                titleStyle: {
                    textAlign: 'center',
                    fontSize: '16px',
                    marginBottom: '0',
                },
                contentStyle: {
                    textAlign: 'center',
                    fontSize: '13px',
                },
                tips: [
                    {
                        el: '#step_01',
                        tipPosition: 'bottom',
                        title: this.$t('home_150'),
                        content: this.$t('home_155'),
                        onNext: () => {
                            return new Promise((resolve, reject) => {
                                setTimeout(() => {resolve(true);},300);
                            });
                        }
                    },
                    {
                        el: '#step_02',
                        tipPosition: 'top',
                        title: this.$t('home_151'),
                        content: this.$t('home_156'),
                        onPrev: () => {
                            return new Promise((resolve) => {
                                resolve(true);
                            });
                        },
                        onNext: () => {
                            return new Promise((resolve) => {
                                resolve(true);
                            })
                        }
                    },
                    {
                        el: '#step_03',
                        tipPosition: 'top',
                        title: this.$t('home_152'),
                        content: this.$t('home_157'),
                        onNext: () => {
                            return new Promise((resolve) => {
                                resolve(true);
                            })
                        }
                    },
                    {
                        el: '#step_04',
                        tipPosition: 'top',
                        title: this.$t('home_153'),
                        content: this.$t('home_158'),
                        onNext: () => {
                            return new Promise((resolve) => {
                                resolve(true);
                            })
                        }
                    },
                    {
                        el: '#step_05',
                        tipPosition: 'bottom',
                        title: this.$t('home_154'),
                        content: this.$t('home_159'),
                        onNext: () => {
                            return new Promise((resolve) => {
                                resolve(true);
                            })
                        }
                    }
                ]
            }
		}
	},
	computed: {
		...mapState({
			userInfo: state => state.User.userInfo,
		}),
        taskOption(){
            return ["",this.$t('home_044'),this.$t('other_061'),this.$t('home_007'),this.$t('pay_031'),this.$t('pay_032')]
        },
        statusOption(){
            return ["",this.$t('home_023'),this.$t('home_024'),this.$t('home_025'),this.$t('home_026'),this.$t('home_027')]
        },
        wsStatus(){
            return [this.$t('home_146'),this.$t('home_023'),this.$t('home_024'),this.$t('home_025'),this.$t('home_026'),this.$t('home_027')]
        }
	},
    created(){
        this.isScroll=false;
        this.task_id = this.$route.query.id||"";
        this.countryList = this.$Helper.countryList();
        this.timestamp = Math.floor(new Date().getTime() / 1000);
        this.initWechatList();
        this.initHookList();
    },
    mounted(){
        setTimeout(()=>{
            let list = this.$refs.tips_scroll;
            if (list) {
                list.addEventListener("touchmove",e => e.stopPropagation(),false)
            }
        },1000)
    },
	methods: {
        done(){
            let scrollTop = this.$refs.warpBox;
            scrollTop.scrollTo({top: 0,behavior:"smooth"});
            localStorage.setItem('step_02',true);
            this.showStep = false;
        },
        skip(){
            this.$refs.myIntroStep.next()
        },
        next(){
            this.$refs.myIntroStep.next()
        },
        prev(){
            this.$refs.myIntroStep.prev()
        },
        changeType(){
            this.ws_account="";
            this.old_account="";
            this.very_code="";
        },
        handleUnbind(){
            this.isUnbind = true;
            delaccount({account:`${this.current_code}${this.old_account}`}).then(res => {
                this.isUnbind = false;
                this.ws_status = 0;
                this.ws_account = "";
                this.old_account = "";
                this.account_type = "1";
                this.current_code = "234";
                this.$toast(this.$t("other_013"));
            })
        },
        async getWsStatus(){
            this.isStatus = true;
            let { account,account_status,area_code,account_type } = await getautogroupaccountstatus({task_info_id:this.task_id});
            setTimeout(()=>{this.isStatus = false;},300);
            this.old_account = account;
            this.ws_status = account_status;
            this.ws_account = account||this.ws_account;
            this.current_code = area_code||this.current_code;  
            this.account_type = account_type?String(account_type):this.account_type;
            const isTips = JSON.parse(localStorage.getItem('step_02'));
            if(!isTips&&this.ws_status==0){
                let scrollTop = this.$refs.warpBox;
                scrollTop.scrollTo({top: 120,behavior:"instant"});
                this.showStep=true;
            }
        },
        getVerifBtn(){
            this.isLoading = true;
            getqrcode({task_info_id:this.task_id,area_code:String(this.current_code),account:String(this.ws_account),account_type:Number(this.account_type)}).then(res => {
                this.isLoading = false;
                if(!res.code&&res.qr_code.length==8){
                    this.very_code = res.qr_code;
                    let result = res.qr_code.slice(0,4)+"—"+res.qr_code.slice(4,9)
                    for (let k = 0; k < this.codeOption.length; k++) {
                        this.codeOption[k] = result[k]
                    }
                    this.startSettime()
                }
            })
        },
        refreshBtn(){
            this.page=1;
            // this.getGroupMess();
            this.initWechatList();
            this.initHookList();
        },
        async getGroupMess(){
           let group_task =  await getautogroupinfo({task_info_id:this.task_id});
           let groupData = this.$Helper.aesDecrptHost(group_task);
        //    console.log(groupData);
           this.teamStemp = groupData;
           this.taskList = groupData.targets;
           this.target_url = groupData.target_url;
           this.task_id = groupData.task_info_id; 
           this.isShow = groupData.status==1||groupData.status==2?false:true;
           this.taskTime = (groupData.invalid_time - this.timestamp)*1000 ||0;
           await this.getWsStatus();
        //    console.log(this.taskTime);
        },
        onLoad(){
            if(this.page >= this.page_total){
                this.finished = true;
            }else{
                this.page++;
                this.hookRecordList()
            }
        },
        initWechatList(){
            this.ref_loading = true;
            this.pullGroupList = [];
            getaccountlist({page:1,limit:20}).then(res => {
                setTimeout(()=>{this.ref_loading = false;},300)
                // this.page_total = Math.ceil(res.total / this.limit);
                this.pullGroupList = [...this.pullGroupList,...res.list] || [];
            })
        },
        initHookList(){
            this.h_loading = true;
            this.pullGroupList = [];
            getwsincomelist({page:this.page,limit:this.limit}).then(res => {
                setTimeout(()=>{this.h_loading = false;},300)
                this.page_total = Math.ceil(res.total / this.limit);
                this.hookRecordList = [...this.hookRecordList,...res.list] || [];
            })
        },
        startSettime() {
            this.timer = setInterval(()=> {
                if (this.countTime > 1) {
                    this.countTime--;
                } else {
                    clearInterval(this.timer);
                    this.countTime = 60;
                    this.very_code="";
                    this.codeOption = ["","","","","—","","","",""]
                    this.initWechatList();
                    // this.errState = false;
                }
            }, 1000);
		},
        formatTime(time) {
            return formatTime(time*1000);
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
        },
        showOverlay(){
            if(this.ws_status!=0) return this.$toast(`${this.$t("home_147")}`);
            this.ws_code = "";
            this.countryList = this.$Helper.countryList();
            this.code_model=true;
            this.$nextTick(()=>{
                this.$refs.tips_scroll.scrollTo({top: 0,behavior:'instant'})
            })
        },
        handleCode(code){
            this.current_code = parseInt(code);
            this.code_model = false;
        },
        filterCity(){
            this.countryList =  this.$Helper.countryList() 
            if(this.ws_code){
                this.countryList = this.countryList.filter(item => item.code.toLowerCase().includes(`+${this.ws_code}`));
            }
        },
        viewTaskNum(){
            this.$popDialog({ content: this.taskList, title:this.$t('home_126'), type: 7 })
        },
        downAddress(){
            if(this.$Helper.checkBrowser()){
                const link = document.createElement('a');
                link.href = this.target_url;
                link.download = this.$Helper.randomString(2)+'_phone_numbers';
                link.target = "_blank";
                link.click();
            }else{
                if(this.taskList.length == 0) return;
                let newArr = this.taskList.map(item => {return {...item,target:`+${item.target}`}});
                uniFun.postMessage({data:newArr});
            }
        },
        showResult(row){
            if(row.status == 4||row.status == 5){
                this.$popDialog({ content:row.Reason,number:row.ser_no,title:this.$t('other_088'), type: 8 })
            }
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
                this.$toast(this.$t("other_013"));
                this.initWechatList();
            })
        },
        async submitBtn(){
            if(this.ws_status !==2)return this.$toast(this.$t("other_097"));
            this.sLoading=true;
            let backRes = await submitautogrouptask({task_info_id:this.task_id,account:`${this.current_code}${this.ws_account}`});
            setTimeout(()=>{this.sLoading=false;},300)
            let result = this.$Helper.aesDecrptHost(backRes);
            if(result.code) return;
            this.refreshBtn();
            // this.$toast(this.$t("home_039"));
            let scrollTop = this.$refs.warpBox;
            scrollTop.scrollTo({top: 0,behavior: "instant" });
            this.$popDialog({content:this.$t("other_096"),title:this.$t("other_008"),type:10}) 
        },
        copySuccess() {
            this.$toast(`${this.$t("other_044")}`);
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
        background: $color-minebg;
        -webkit-overflow-scrolling: touch; 
        padding-bottom: 20px;
        input {
            height: 100%;
            background: transparent !important;
            border: transparent;
            outline: none;
            font-size: 28px;
            color: #626262;
            padding-left: 10px;
            flex-grow: 1;
        }
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
            // height: 1048px;
            position: relative;
            // background-size: 100% 100%;
            .task_box{
                padding: 0 20px;
                margin-top: 30px;
                box-sizing: border-box;
                .task_Progress{
                    border-radius: 24px;
                    padding: 14px 20px 24px 24px;
                    box-sizing: border-box;
                    background: $font-color-white;
                    .task_title{
                        font-weight: bold;
                        margin-bottom: 20px;
                    }
                    .right_refresh{
                        flex-shrink: 0;
                        .refres_icon{
                            height: 32px;
                            margin-right: 10px;
                        }
                    }
                }
                .task_text{
                    color: $home-title-06;
                    margin-bottom: 12px;
                }
                .task_num{
                    color: $home-title-12;
                    font-weight: bold;
                    .van-count-down{
                        width: 60px;
                        color: $home-title-02;
                        margin-left: 10px;
                    }
                }
            }
            .task_win_bonus{
                height: 102px;
                position: absolute;
                left: 0;
                bottom: 115px;
                font-weight: bold;
            }
        }
        .task_warp{
            position: relative;
            z-index: 9;
             .task_main{
                padding: 0 20px;
                // gap: 30px;
                box-sizing: border-box;
                .task_book{
                    margin-top: 10px;
                    .task_title{
                        font-weight: bold;
                        color: $color-theme;
                        margin-bottom: 10px;
                        // text-shadow: 0px 4px 3px rgba(0,0,0,0.2);
                    }
                }
                .task_item1{
                    height: 180px;
                    margin-top: 30px;
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
                    .task_book{
                        margin-bottom: 10px;
                    }
                    .show_account{
                        color: $home-title-02;
                        text-decoration: underline;
                    }
                }
                // .task_item:nth-child(1){
                //     margin-bottom: 30px;
                // }
                .task_item{
                    margin-top: 30px;
                    .ws_head{
                        padding: 20px 20px;
                        box-sizing: border-box;
                        background: url('../../assets/images/home/ws_head.png') no-repeat;
                        background-size: 100% 100%;
                        .task_award{
                            position: relative;
                            margin-top: 10px;
                            margin-bottom: 14px;
                            .van-button{
                                position: absolute;
                                top: 10px;
                                right: -10px;
                            }
                        }
                        .title_head_top{
                            font-weight: bold;
                        }
                    }
                    .ws_head_active{
                        border-bottom-left-radius: 10px;
                        border-bottom-right-radius: 10px;
                    }
                    .ws_list{
                        padding: 0 20px 40px 20px;
                        box-sizing: border-box;
                        border-bottom-left-radius: 20px;
                        border-bottom-right-radius: 20px;
                        background: linear-gradient(90deg, #FEFCEF 0%, #FCFEFD 100%);
                        .ws_account{
                            background: $font-color-white;
                        }
                        .title_top{
                            padding: 20px 0;
                        }
                        .ws_verfy_box{
                            // gap: 40px;
                            color: $home-title-03;
                            .table_type{
                                margin: 10px 0 20px 0;
                            }
                            .ws_tips{
                                margin-top: 10px;
                            }
                            ::v-deep .van-radio__icon .van-icon{
                                border-radius: 0 !important;
                            }
                            ::v-deep .van-radio__label{
                                font-size: 14px;
                                font-weight: bold;
                                color: $home-title-03;
                            }
                            ::v-deep .van-radio__icon--checked .van-icon{
                                border-color: $color-theme;
                                background: $color-theme;
                            }
                            .ws_value{
                                width: 100%;
                                height: 66px;
                                position: relative;
                                border-radius: 10px;
                                margin-top: 20px;
                                border: 1px solid #008751;
                                .area_code{
                                    margin-left: 10px;
                                    color: $home-notice-tip;
                                    padding-right: 10px;
                                    border-right:1px solid rgba(0,0,0,.1);
                                    span{
                                        color: $font-color-black;
                                    }
                                }
                            }
                            .tabs_item{
                                margin: 30px 0;
                            }
                            .verfy_list{
                                .modle_line{
                                    width: 60px;
                                    height: 60px;
                                    flex-shrink: 0;
                                    border-radius: 6px;
                                    border: 1px solid $home-title-08;
                                }
                                img{
                                    height: 45px;
                                }
                                .copay_text{
                                    height: 100%;
                                }
                            }
                            .submit_text{
                                margin-top: 30px;
                            }
                            .pre_tips{
                                gap: 10px !important;
                                h3{
                                    color: $font-color-black;
                                }
                            }
                        }
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
        }
        .ws_hook_list{
            padding: 0 30px;
            margin: 30px 0 20px 0;
            box-sizing: border-box;
            // color: $font-color-white;
            .status_tips{
                color: $home-eart-long;
            }
            img{
                height: 32px;
                margin-right: 10px;
            }
        }
        .record_legend{
            padding: 0 30px;
            margin-bottom: 30px;
            box-sizing: border-box;
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
        .born_record{
            padding: 0 30px 20px 30px;
            box-sizing: border-box;
        }
        .record_list{
            // max-height: 300px;
            // overflow-y: auto;
            padding: 0 30px;
            border-radius: 20px;;
            padding-bottom: 30px;
            box-sizing: border-box;
            color: $font-color-black;
            .task_title_head{
                font-weight: bold;
                color: $home-title-12;
            }
            .record_scroll{
                max-height: 1100px;
                overflow-y: auto;
                // border-radius: 20px;
                background: $font-color-white;
                border-bottom-left-radius: 20px;
                border-bottom-right-radius: 20px;
            }
            .title_top{
                height: 100px;
                padding: 0 40px;
                flex-shrink: 0;
                box-sizing: border-box;
                background: $home-title-10;
                span{
                    flex: 1;
                }
                span:nth-child(2){
                    justify-content: center;
                }
                span:nth-child(3){
                    flex-grow: 0.8;
                    justify-content: right;
                }
                .log_out{
                    em{
                        flex-shrink: 0;
                        padding: 10px 20px;
                        box-sizing: border-box;
                        background: $home-title-18;
                        border-radius: 200px;
                        color: $color-theme;
                    }
                }
            }
            .task_title_head {
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;
            }
            span:nth-child(3){
                justify-content: center !important;
            }
            .record_item{
                height: 108px;
                background: $font-color-white;
                border-bottom: 1px solid $home-title-10;
            }
            .record_item:last-child{
                border-bottom: 1px solid transparent;
            }
            .record_click{
                color: $home-copay-title;
                text-decoration: underline;
            }
            .empty_box{
                height: 364px;
                color: $home-title-14;
                background-color: $font-color-white;
                border-bottom-left-radius: 20px;
                border-bottom-right-radius: 20px;
                img{
                    height: 202px;
                }
            }
            .footer_tips{
                height: auto;
                font-style: italic;
                padding: 16px 20px;
                color: $home-title-06;
                border-bottom-left-radius: 20px;
                border-bottom-right-radius: 20px;
            }
        }
    }
    .refres_animat{
        animation: rotate 2s linear infinite;
    }
    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(720deg);
        }
    }
     .van-overlay{
        height: 100% !important;
        .country_warp{
            height: auto;
            background: $font-color-white;
            .country_head{
                height: 44px;
                padding: 0 20px;
                box-sizing: border-box;
                background: $color-theme;
                color: $font-color-white;
                img{
                    height: 12px;
                    margin-right: 10px;
                }
            }
            .code_query{
                padding: 0 20px;
                margin: 10px 0;
                box-sizing: border-box;
                .ws_value{
                    height: 33px;
                    padding-left: 10px;
                    border-radius: 10px;
                    background: rgba($color: #8E8E8E, $alpha: .3);
                    .area_code{
                        margin-left: 10px;
                    }
                }
            }
            .country_list{
                height: calc(100vh - 88px);
                overflow-y: auto;
                padding: 0 20px;
                box-sizing: border-box;
                .country_item{
                    padding: 10px 0;
                    border-bottom:1px solid rgba(0,0,0,.1);
                    .c_code{
                        color: $color-theme;
                    }
                }
                .country_item:last-child{
                    border-bottom:1px solid transparent;
                }
            }
        }
    }
</style>
