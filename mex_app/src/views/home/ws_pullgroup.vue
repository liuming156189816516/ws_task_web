<template>
    <div class="home-content" ref="warpBox" @scroll="handleScrolStop">
        <div class="task_mian w_f">
            <page-header :title="$t('home_044')" :show-icon="true" :bgcolor="false" />
            <!-- <div class="share_bonus w_f flex-item flex-dir-c">
                <p class="Win_l font_72 flex-item">{{$t('home_104')}}</p>
                <p class="Win_r font_72 flex-item">{{$t('home_105')}}</p>
                <div class="share_rule flex-item flex-center" @click="showRule">
                    <img src="@/assets/images/mill/rules_icon.png" alt="" srcset="">
                    <span class="flex-item font_26">{{$t('spre_003')}}</span>
                </div>
            </div> -->
            <div class="video_box flex-item flex-item flex-align flex-center mg_24">
                <video class="myVideo" ref="myVideo" controls="controls" style="width:100%;height:160px;" src="@/assets/video/2.mp4" />
                <!-- <div v-if="palyIdx!=1" class="paly_btn w_f h_f flex-item flex-align flex-center" @click="palyVideo(1)">
                    <img src="@/assets/images/serveic/play_icon.png" alt="">
                </div> -->
            </div>
            <div class="task_box w_f flex-item">
                <div class="task_Progress w_f flex-item flex-dir-c">
                    <p class="task_title w_f flex-item flex-center font_28">{{$t('home_106')}}</p>
                    <div class="w_f flex-item flex-between">
                        <div class="task_item">
                            <p class="task_text font_24">{{$t('home_107')}}</p>
                            <p class="task_num font_28">{{ teamStemp.ser_no }}</p>
                        </div>
                        <div class="task_sure_time">
                            <p class="task_text font_24">{{$t('home_108')}}</p>
                            <p class="task_num flex-item font_28">
                                {{taskOption[teamStemp.status]}}
                                <van-count-down :time="taskTime" />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="task_win_bonus w_f flex-item flex-align flex-center font_32">Complete task to win bonus</div> -->
        </div>
        <div class="task_box_main">
            <div class="task_warp w_f flex-item">
                <div class="task_main w_f flex-item flex-dir-c">
                    <div class="task_item w_f flex-item flex-dir-c font_34">
                        <div class="task_name w_f flex-item">
                            <img src="@/assets/images/home/num1_icon.png">
                        </div>
                        <div class="task_award w_f">
                            <div class="task_book font_28">{{$t('home_037')}}</div>
                            <div class="task_desc font_20">{{$t('home_110')}}</div>
                        </div>
                        <div class="w_f flex-item flex-between flex-align font_24">
                            <span class="show_account" @click="viewTaskNum">{{$t('home_111')}}</span>
                            <van-button type="primary" :disabled="isShow" @click="downAddress">{{$t('home_112')}}</van-button>
                        </div>
                    </div>

                    <!-- <div class="task_item w_f flex-item flex-dir-c font_34">
                        <div class="task_name w_f flex-item">
                            <img src="@/assets/images/home/num2_icon.png">
                        </div>
                        <div class="task_award w_f">
                            <div class="task_book font_28">{{$t('home_121')}}</div>
                            <div class="task_desc font_20">{{$t('home_122')}}</div>
                        </div>
                        <div class="w_f flex-item flex-between flex-align font_24">
                            <span class="show_account"></span>
                            <van-button type="primary" @click="openWhatsapp">{{$t('home_123')}}</van-button>
                        </div>
                    </div> -->

                    <div class="task_item w_f flex-item flex-dir-c font_34">
                        <div class="task_name w_f flex-item">
                            <img src="@/assets/images/home/num2_icon.png">
                        </div>
                        <div class="task_award w_f">
                            <div class="task_book font_28">{{$t('home_113')}}</div>
                        </div>
                        <div class="group_link w_f flex-item flex-between flex-align font_24">
                            <input type="text" v-model="group_link" :disabled="isShow" :placeholder="$t('home_127')">
                            <van-button :disabled="!group_link||isShow" @click="submitTask" :class="[!group_link||isShow?'progress_award':'']">{{$t('home_038')}}</van-button>
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
                    <span class="flex-item flex-center">{{$t('home_031')}}</span>
                    <span class="flex-item flex-center">{{$t('tail_008')}}</span>
                    <span class="flex-item">{{$t('spre_012')}}</span>
                </div>
                <template v-if="pullGroupList&&pullGroupList.length>0">
                    <div class="record_scroll w_f flex-item flex-dir-c">
                        <van-list v-model="loading" :finished="finished" :loading-text="$t('other_029')" :finished-text="$t('other_063')" offset="60" @load="onLoad">
                            <div class="title_top record_item w_f flex-item flex-align flex-between font_24" v-for="(item,idx) in pullGroupList" :key="idx">
                                <span class="flex-item">{{ formatTime(item.itime) }}</span>
                                <span class="flex-item flex-center">{{ item.ser_no }}</span>
                                <span :class="['flex-item flex-center',item.status==4?'record_click':'']" :style="{color:item.status==2?'#008751':item.status==3?'#ff9600':'#F52C2C'}" @click="showResult(item)">{{statusOption[item.status]}}</span>
                                <span class="flex-item" style="font-weight: bold;">{{ item.amount }}</span>
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
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { formatTime } from "@/utils/tool";
import PageHeader from "@/components/Header";
import { getinvitefriendtasklist } from '@/api/task';
import { getcreatetaskinfo,submitcreatetask } from '@/api/home'
import uniFun from "@/utils/uni-webview-js"
export default {
	name: 'ws_pullgroup',
	components: {PageHeader},
	data() {
		return {
            page:1,
            limit:100,
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
            taskTime: null,
            taskList:[],
            pullGroupList:[]
		}
	},
	computed: {
		...mapState({
			userInfo: state => state.User,
            bannerList: state => state.User.bannerList
		}),
        taskOption(){
            return ["",this.$t('home_044'),this.$t('other_061'),this.$t('home_007'),this.$t('home_008')]
        },
        statusOption(){
            return ["",this.$t('home_005'),this.$t('home_006'),this.$t('home_007'),this.$t('home_008')]
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
        // this.$nextTick(()=>{
        //     const isTips = JSON.parse(localStorage.getItem('step_03'));
        //     if(!isTips){
        //         this.$popDialog({ steps:true, type: 11 })
        //     }
        // })
        this.$store.dispatch('User/actionReport',8) 
    },
	methods: {
        async getGroupMess(){
           let group_task =  await getcreatetaskinfo({task_info_id:this.task_id});
           let groupData = this.$Helper.aesDecrptHost(group_task);
        //    console.log(groupData);
           this.teamStemp = groupData;
           this.taskList = groupData.targets;
           this.target_url = groupData.target_url;
           this.chrome_url = groupData.chrome_url;
           this.task_id = groupData.task_info_id;
           this.group_link = groupData.invite_link;
           this.isShow = groupData.status==1||groupData.status==2?false:true;
           this.taskTime = (groupData.invalid_time - this.timestamp)*1000 ||0;
        //    localStorage.setItem('task_id',this.task_id);
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
            getinvitefriendtasklist({page:this.page,limit:this.limit,task_type:1}).then(res => {
                this.loading = false;
                this.page_total = Math.ceil(res.total / this.limit);
                this.pullGroupList = [...this.pullGroupList,...res.list] || [];
            })
        },
        copySuccess(){
            this.$toast(`${this.$t("other_044")}`);
        },
        viewTaskNum(){
            // console.log(this.taskList);
            this.$popDialog({ content: this.taskList, title:this.$t('home_126'), type: 7 })
        },
        submitTask(){
            // this.$store.dispatch('User/actionReport',11);
            if(!this.group_link) return this.$toast(this.$t('other_001',{value:this.$t('home_036')})); 
            this.isLoading=true;
            console.log("8888");
            submitcreatetask({task_info_id:this.task_id,invite_link:this.group_link}).then(res =>{
                this.isLoading=false;
                if(res.code) return;
                this.getGroupMess();
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
            this.$store.dispatch('User/actionReport',10);
            if(this.$Helper.checkBrowser()){
                const link = document.createElement('a');
                link.href = this.target_url;
                link.download = this.$Helper.randomString(2)+'_phone_numbers';
                link.target = "_blank";
                link.click();
            }else{
                uniFun.postMessage({data:this.taskList});
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
            if(row.status == 4){
                this.$popDialog({ content:row.Reason, title:this.$t('other_088'), type: 8 })
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
            background: linear-gradient(180deg, #31acf2 1.61%, rgba(255, 255, 255, 0.5) 100%);
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
                    // .task_sure_time{
                    //     flex-grow: 2;
                    // }
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
            margin-top: -376px;
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
                    height: 240px;
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
                    height: 260px;
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
            span:nth-child(1){
                flex-grow: 1.3;
                flex-shrink: 0;
                // background-color: darkblue;
            }
            span:nth-child(2){
                flex-grow: 1.6;
                // background-color: salmon;
            }
            span:nth-child(3){
                flex-grow: 1.2;
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
