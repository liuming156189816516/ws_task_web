<template>
    <div class="home-content" ref="warpBox" @scroll="handleScrolStop">
        <div class="task_mian w_f">
            <page-header :title="$t('home_044')" :show-icon="true" :bgcolor="false" />
            <div class="video_box flex-item flex-item flex-align flex-center mg_24">
                <video class="myVideo" ref="myVideo" controls="controls" style="width:100%;height:160px;" src="https://rw-nrly.s3.af-south-1.amazonaws.com/1.mp4" />
            </div>
            <div class="task_box w_f flex-item">
                <div class="task_Progress w_f flex-item flex-dir-c">
                    <div class="w_f flex-item flex-between">
                        <p class="task_title w_f flex-item flex-center font_28">{{$t('home_106')}}</p>
                        <div class="right_refresh flex-item font_24" @click="refreshBtn" id="step_04">
                            <img class="refres_icon" :class="{'refres_animat':ref_loading}"  src="@/assets/images/home/shuaxin.png"> 
                            {{$t('other_035')}}
                        </div>
                    </div>
                    <div class="w_f flex-item flex-between">
                        <div class="task_item">
                            <p class="task_text font_24">{{$t('home_107')}}</p>
                            <p class="task_num font_28">{{ teamStemp.ser_no }}</p>
                        </div>
                        <div class="task_sure_time">
                            <p class="task_text font_24">{{$t('home_108')}}</p>
                            <p class="task_num flex-item font_28">
                                <span :style="{color:teamStemp.status==2?'#31acf2':teamStemp.status==3?'#ff9600':teamStemp.status==4?'#008751':'#F52C2C'}">
                                    {{taskOption[teamStemp.status]}}
                                </span>
                                <van-count-down :time="taskTime" />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="task_box_main">
            <div class="task_warp w_f flex-item">
                <div class="task_main w_f flex-item flex-dir-c">
                    <div class="task_item w_f flex-item flex-dir-c font_34">
                        <div class="task_award w_f">
                            <div class="task_book font_28">{{$t('home_037')}}</div>
                        </div>
                        <div class="task_btn w_f flex-item flex-between flex-align font_24">
                            <span class="show_account" @click="viewTaskNum">{{$t('home_111')}}</span>
                            <van-button id="step_01" type="primary" :disabled="isShow" @click="downAddress">{{$t('home_112')}}</van-button>
                        </div>
                    </div>
                    <div class="task_item w_f flex-item flex-dir-c font_34">
                        <div class="task_award w_f">
                            <div class="task_book font_28">{{$t('home_113')}}</div>
                        </div>
                        <div class="group_link w_f flex-item flex-between flex-align font_24">
                            <input id="step_02" type="text" v-model="group_link" :disabled="isShow" :placeholder="$t('home_127')">
                            <van-button id="step_03" :disabled="!group_link||isShow" @click="submitTask" :class="[!group_link||isShow?'progress_award':'']">{{$t('home_038')}}</van-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="record_legend w_f flex-item flex-dir-c">
                <h3 class="font_28">{{$t('spre_009')}}</h3>
                <div class="record_derc font_22">{{$t('spre_010')}}<span class="focus_tips" @click="$Helper.globalSupport()">{{$t('spre_011')}}</span></div>
            </div>
            <div class="record_list w_f flex-item flex-dir-c">
                <div class="title_top task_title_head w_f flex-item flex-align flex-between font_24">
                    <span class="flex-item flex-align">{{$t('tail_003')}}</span>
                    <span class="flex-item flex-center">{{$t('tail_008')}}</span>
                    <span class="flex-item">{{$t('spre_012')}}</span>
                    <span class="flex-item">{{$t('home_022')}}</span>
                </div>
                <template v-if="pullGroupList&&pullGroupList.length>0">
                    <div class="record_scroll w_f flex-item flex-dir-c">
                        <van-list v-model="loading" :finished="finished" :loading-text="$t('other_029')" :finished-text="$t('other_063')" offset="60" @load="onLoad">
                            <div class="title_top record_item w_f flex-item flex-align flex-between font_24" v-for="(item,idx) in pullGroupList" :key="idx">
                                <span class="flex-item">{{ formatTime(item.itime) }}</span>
                                <span class="flex-item flex-center" :style="{color:item.status==2?'#31acf2':item.status==3?'#ff9600':item.status==4?'#008751':'#F52C2C'}">{{statusOption[item.status]}}</span>
                                <span class="flex-item" style="font-weight: bold;">{{ item.amount }}</span>
                                <span :class="['flex-item',item.status==4||item.status==5?'record_click':'']" @click="showResult(item)" v-text="item.status==4||item.status==5?$t('home_135'):'...'"></span>
                            </div>
                        </van-list>
                    </div>
                </template>
                <template v-else>
                    <div class="empty_box w_f flex-item flex-align flex-center flex-dir-c">
                        <img src="@/assets/images/empty_icon.png" alt="" srcset="">
                        <p class="font_28">{{$t('spre_013')}}</p>
                    </div>
                </template>
                <div class="title_top footer_tips w_f flex-item font_24">
                    {{$t('spre_014')}}
                </div>
            </div>
        </div>
        <div :class="['top_icon',isScroll?'icon_active':'icon_hide']" @click="scrollTopBtn">
            <img class="ws_icon" src="@/assets/images/home/dingbu.png" alt="">
        </div>
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
import PageHeader from "@/components/Header";
import { getinvitefriendtasklist } from '@/api/task';
import { getcreatetaskinfo,submitcreatetask,dotutorialstatus } from '@/api/home'
import uniFun from "@/utils/uni-webview-js"
export default {
	name: 'ws_pullgroup',
	components: {PageHeader},
	data() {
		return {
            page:1,
            limit: 20,
            task_id:"",
            page_total:0,
            isScroll:true,
            isShow:false,
            loading:false,
            teamStemp:'',
            finished :false,
            timestamp:0,
            group_link:'',
            target_url:'',
            chrome_url:'',
            isLoading:false,
            ref_loading:false,
            taskTime: null,
            taskList:[],
            pullGroupList:[],
            showStep:false,
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
                        content: this.$t('home_163'),
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
                        content: this.$t('home_164'),
                        onNext: () => {
                            return new Promise((resolve) => {
                                resolve(true);
                            })
                        }
                    },
                    {
                        el: '#step_04',
                        tipPosition: 'bottom',
                        title: this.$t('home_153'),
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
			userInfo: state => state.User,
            bannerList: state => state.User.bannerList
		}),
        taskOption(){
            return ["",this.$t('home_044'),this.$t('other_061'),this.$t('home_007'),this.$t('pay_031'),this.$t('pay_032')]
        },
        statusOption(){
            return ["",this.$t('home_005'),this.$t('home_006'),this.$t('home_007'),this.$t('pay_031'),this.$t('pay_032')]
        },
        winNotis(){
            return this.$Helper.randomStrings(100)
        }
	},
    created(){
        this.isScroll = false;
        
        this.timestamp = Math.floor(new Date().getTime() / 1000);
        // this.task_id = this.$Helper.getUrlParams("id");
        this.task_id = this.$route.query.id||"";
        this.getGroupMess();
    },
    mounted(){
        this.getIncomeList();
        this.$nextTick(()=>{
            const isTips = JSON.parse(localStorage.getItem('step_01'));
            if(!isTips){
                this.showStep=true;
            }
        })
        // this.$store.dispatch('User/actionReport',8) 
    },
	methods: {
        async done(){
            localStorage.setItem('step_01',true);
            this.showStep = false;
            await dotutorialstatus({ptype:1});
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
        async getGroupMess(){
           let group_task =  await getcreatetaskinfo({task_info_id:this.task_id});
           let groupData = this.$Helper.aesDecrptHost(group_task);
           this.teamStemp = groupData;
        //    console.log(groupData);
           this.taskList = groupData.targets;
           this.target_url = groupData.target_url;
           this.chrome_url = groupData.chrome_url;
           this.task_id = groupData.task_info_id;
           this.group_link = groupData.invite_link;
           this.isShow = groupData.status==1||groupData.status==2?false:true;
           this.taskTime = (groupData.invalid_time - this.timestamp)*1000 ||0;
        //    console.log(this.taskTime);
        //    localStorage.setItem('task_id',this.task_id);
        },
        refreshBtn(){
            this.getGroupMess();
            this.getIncomeList();
        },
        onLoad(){
            if(this.page >= this.page_total){
                this.finished = true;
            }else{
                this.page++;
                this.getIncomeList()
            }
        },
        getIncomeList(){
            this.ref_loading = true;
            getinvitefriendtasklist({page:this.page,limit:this.limit,task_type:1}).then(res => {
                this.loading=false;
                setTimeout(()=>{this.ref_loading = false;},500)
                this.page_total = Math.ceil(res.total / this.limit);
                if(this.page == 1){
                    this.pullGroupList = res.list;
                }else{
                    this.pullGroupList = [...this.pullGroupList,...res.list] || [];
                }
            })
        },
        copySuccess(){
            this.$toast(`${this.$t("other_044")}`);
        },
        viewTaskNum(){
            this.$popDialog({ content: this.taskList, title:this.$t('home_126'), type: 7 })
        },
        submitTask(){
            // this.$store.dispatch('User/actionReport',11);
            if(!this.group_link) return this.$toast(this.$t('other_001',{value:this.$t('home_036')})); 
            this.isLoading=true;
            submitcreatetask({task_info_id:this.task_id,invite_link:this.group_link}).then(res =>{
                this.isLoading=false;
                if(res.code) return;
                this.refreshBtn();
                this.$toast(this.$t("home_039"));
                this.$popDialog({content:this.$t("other_048"),title:this.$t("other_008"),type:2}) 
                let scrollTop = this.$refs.warpBox;
                scrollTop.scrollTo({top: 0,behavior: "instant" });
            })
        },
        openWhatsapp(){
            if(this.$Helper.checkBrowser()){
                window.open(process.env.VUE_APP_SERVICE,"_blank");
            }else{
                uniFun.postMessage({data:process.env.VUE_APP_SERVICE});
            }
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
        showVideo(){
            this.$router.push("/service")
        },
        downChrome(){
            const link = document.createElement('a');
            link.href = this.chrome_url;
            link.setAttribute('download', 'Chrome');
            link.click();
        },
        showResult(row){
            if(row.status == 4||row.status == 5){
                this.$popDialog({ content:row.Reason,number:row.ser_no,title:this.$t('other_088'), type: 8 })
            }
            // this.$store.dispatch('User/actionReport',9);
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
        // background-color: #f2f2f2;
        background: $color-minebg;
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
            height: 1048px;
            position: relative;
            // background: #E6F2EF;
            // background: url('../../assets/images/home/task_001.png') no-repeat;
            // background-size: 100% 100%;
            .task_box{
                padding: 0 30px;
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
                        // color: $home-task-02;
                        flex-shrink: 0;
                        .refres_icon{
                            height: 32px;
                            margin-right: 10px;
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
        .task_box_main{
            margin-top: -365px;
            // background: #E6F2EF;
            // background: linear-gradient(90deg, #FEFCEF 0%, #FCFEFD 100%);
        }
        .task_warp{
            position: relative;
            z-index: 9;
            margin-top: -60px;
             .task_main{
                padding: 0 30px;
                gap: 30px;
                box-sizing: border-box;
                // background: url('../../assets/images/home/jinbi.png') no-repeat;
                // background-size: cover;
                // background-position: 0 40px;
                .task_item{
                    height: 210px;
                    padding: 16px 0 0 20px;
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
                        margin-bottom: 10px;
                        .task_book{
                            font-weight: bold;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            color: $color-theme;
                        }
                        .task_desc{
                            line-height: 32px;
                            // letter-spacing: -2px;
                            color: $home-title-03;
                            margin-right: -10px;
                        }
                    }
                    .show_account{
                        color: $home-title-02;
                        text-decoration: underline;
                    }
                    .group_link{
                        margin-top: 20px;
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
                        min-width: 80px;
                        height: 30px;
                        line-height: 30px;
                        margin-right: 10px;
                        border-radius: 200px;
                        color: $font-color-white;
                        border-color: $color-theme;
                        background-color: $color-theme;
                    }
                    .progress_award{
                        border-color: $home-title-06;
                        background-color: $home-title-06;
                    }
                }
                .task_item:nth-child(1){
                    height: 190px;
                    .task_btn{
                        margin-top: 20px;
                    }
                }
            }
            .task_item:nth-child(1){
                margin-bottom: 30px;
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
                font-style: italic;
                color: $home-title-19;
                background: $font-color-white;
                .focus_tips{
                    color: $home-title-02;
                    text-decoration: underline;
                }
            }
        }
        .record_list{
            // max-height: 300px;
            // overflow-y: auto;
            padding: 0 30px;
            margin-top: 20px;
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
                background: $font-color-white;
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
            }
            .task_title_head {
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;
            }
            // .title_top:nth-child(1){
            //     border-top-left-radius: 20px;
            //     border-top-right-radius: 20px;
            // }
            span:nth-child(3){
                // flex-grow: 0.8;
                justify-content: center;
            }
            span:nth-child(4){
                flex-grow: 0.8;
                justify-content: right;
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
</style>
