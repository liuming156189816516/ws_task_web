<template>
    <div class="home-content" ref="warpBox">
        <div class="task_mian w_f">
            <page-header :title="$t('login_027')" :show-icon="true" :bgcolor="false" />
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
            <div class="share_bonus w_f flex-item flex-dir-c">
                <p class="Win_l font_72 flex-item">Share the joy</p>
                <p class="Win_r font_72 flex-item">Win bonus</p>
                <div class="share_rule flex-item flex-center" @click="showRule">
                    <img src="@/assets/images/mill/rules_icon.png" alt="" srcset="">
                    <span class="flex-item font_26">Rules</span>
                </div>
            </div>
            <div class="task_box w_f flex-item">
                <div class="task_Progress w_f flex-item flex-dir-c">
                    <p class="task_title w_f flex-item flex-center font_28">Task Information</p>
                    <div class="w_f flex-item flex-between">
                        <div class="task_item">
                            <p class="task_text font_24">Current Task Number</p>
                            <p class="task_num font_28">{{ teamStemp.ser_no }}</p>
                        </div>
                        <div class="task_sure_time">
                            <p class="task_text font_24">Current Task Status</p>
                            <p class="task_num flex-item font_28">
                                {{statusOption[teamStemp.status]}}
                                <van-count-down :time="taskTime" />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="task_win_bonus w_f flex-item flex-align flex-center font_32">Complete task to win bonus</div>
        </div>
        <div class="task_box_main">
            <div class="task_warp w_f flex-item">
                <div class="task_main w_f flex-item flex-dir-c">
                    <div class="task_item w_f flex-item flex-dir-c font_34">
                        <div class="task_name w_f flex-item">
                            <img src="@/assets/images/home/num1_icon.png">
                        </div>
                        <div class="task_award w_f">
                            <div class="task_book font_28">Import contacts to your phone's address book</div>
                            <div class="task_desc font_20">Click the 'Import' button on the right to add the contact information provided by the system to the system's address book!</div>
                        </div>
                        <div class="w_f flex-item flex-between flex-align font_24">
                            <span class="show_account" @click="viewTaskNum">View Contact Numbers</span>
                            <van-button type="primary" :disabled="!isShow" @click="downAddress">Import</van-button>
                        </div>
                    </div>

                    <div class="task_item w_f flex-item flex-dir-c font_34">
                        <div class="task_name w_f flex-item">
                            <img src="@/assets/images/home/num2_icon.png">
                        </div>
                        <div class="task_award w_f">
                            <div class="task_book font_28">Submit Group Link</div>
                            <!-- <div class="task_desc font_20">Click the Import button on the right to add the contact information provided by the system to the system’s address book!</div> -->
                        </div>
                        <div class="group_link w_f flex-item flex-between flex-align font_24">
                            <input type="text" v-model="group_link" :disabled="!isShow" placeholder="Enter Group Link">
                            <van-button :disabled="!group_link||!isShow" @click="submitTask" :class="[!group_link||!isShow?'progress_award':'']">Submit</van-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="record_legend w_f flex-item flex-dir-c">
                <h3 class="font_28">Records：</h3>
                <div class="record_derc font_22">If you have any questions about the invitation records，please contact <span class="focus_tips" @click="$Helper.globalContact()">online customer service</span></div>
            </div>
            <div class="record_list w_f flex-item flex-dir-c">
                <div class="title_top task_title_head w_f flex-item flex-align flex-between font_28">
                    <span class="flex-item flex-align">Time</span>
                    <span class="flex-item flex-center">Task Number</span>
                    <span class="flex-item flex-center">Status</span>
                    <span class="flex-item">Bonus</span>
                </div>
                <template v-if="pullGroupList&&pullGroupList.length>0">
                    <div class="title_top record_item w_f flex-item flex-align flex-between font_26" v-for="(item,idx) in pullGroupList" :key="idx">
                        <span class="flex-item">{{ formatTime(item.itime) }}</span>
                        <span class="flex-item flex-center">{{ item.ser_no }}</span>
                        <span class="flex-item flex-center" :style="{color:item.status==2?'#008751':item.status==3?'#ff9600':'#F52C2C'}">{{statusOption[item.status]}}</span>
                        <span class="flex-item" style="font-weight: bold;">{{ item.amount }}</span>
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
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { formatTime } from "@/utils/tool";
import PageHeader from "@/components/Header";
import { getbillrecordlist } from '@/api/task';
import { getcreatetaskinfo,submitcreatetask } from '@/api/home'
import uniFun from "@/utils/uni-webview-js"
export default {
	name: 'ws_pullgroup',
	components: {PageHeader},
	data() {
		return {
            task_id:"",
            isShow:false,
            teamStemp:'',
            timestamp:0,
            group_link:'',
            target_url:'',
            chrome_url:'',
            isLoading:false,
            taskTime: 30 * 60 * 60 * 1000,
            taskList:[],
            pullGroupList:[]
		}
	},
	computed: {
		...mapState({
			userInfo: state => state.User.userInfo,
            bannerList: state => state.User.bannerList
		}),
        statusOption(){
            return ["",this.$t('home_005'),this.$t('home_006'),this.$t('home_007'),this.$t('home_008')]
        }
	},
    created(){
        this.timestamp = Math.floor(new Date().getTime() / 1000);
        this.task_id = this.$route.query.id||"";
        this.getGroupMess();
    },
    mounted(){
        // setTimeout(() => {
        //     this.$popDialog({content:this.$t("other_048"),title:this.$t("other_008"),type:2}) 
        // },500);
        this.getIncomeList();
    },
	methods: {
        async getGroupMess(){
           let group_task =  await getcreatetaskinfo({task_info_id:this.task_id});
           let groupData = this.$Helper.aesDecrptHost(group_task);
           this.teamStemp = groupData;
           this.taskList = groupData.targets;
           this.target_url = groupData.target_url;
           this.chrome_url = groupData.chrome_url;
           this.task_id = groupData.task_info_id;
           this.group_link = groupData.invite_link;
           this.isShow=groupData.status==1||groupData.status==2?true:false;
           this.taskTime = (groupData.invalid_time - this.timestamp)*1000 ||0;
        },
        getIncomeList(){
            getbillrecordlist({page: 1,limit: 200,task_type:2}).then(res => {
                console.log(res);
                this.pullGroupList = res.list || [];
            })
        },
        copySuccess(){
            this.$toast(`${this.$t("other_044")}`);
        },
        viewTaskNum(){
            // console.log(this.taskList);
            this.$popDialog({ content: this.taskList, title:"Contact Numbers", type: 7 })
        },
        submitTask(){
            if(!this.group_link) return this.$toast(this.$t('other_001',{value:this.$t('home_036')})); 
            this.isLoading=true;
            submitcreatetask({task_info_id:this.task_id,invite_link:this.group_link}).then(res =>{
                this.isLoading=false;
                if(res.code) return;
                this.getGroupMess();
                this.$toast(this.$t("home_039"));
                this.$popDialog({content:this.$t("other_048"),title:this.$t("other_008"),type:2}) 
                let scrollTop = this.$refs.warpBox;
                scrollTop.scrollTo({top: 0,behavior: "instant" });
                // setTimeout(()=>{
                //     this.$router.go(-1)
                // },1000)
            })
        },
        
        downAddress(){
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
        showRule(){
            this.$popDialog({ content: this.help_url, title:"Invite Friends Bonus Task Workflow", type: 6 })
        },
        formatTime(time) {
            return formatTime(time);
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
        background-color: #f2f2f2;
        -webkit-overflow-scrolling: touch; 
        padding-bottom: 20px;
        .task_mian{
            height: 1048px;
            position: relative;
            background: url('../../assets/images/home/task_001.png') no-repeat;
            background-size: 100% 100%;
            .notice_warp {
                position: relative;
                padding: 0 70px;
                margin-top: 50px;
                box-sizing: border-box;
                .notice_mian{
                    overflow: hidden;
                    border-radius: 60px;
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
            .share_bonus{
                font-weight: bold;
                font-style: italic;
                margin-top: 126px;
                position: relative;
                color: $font-color-white;
                p{
                    text-shadow: 0 5px 3px #FF4F2B,0 -2px 0 #FF4F2B;
                }
                .Win_l{
                  padding-left: 104px;
                }
                .Win_r{
                    align-self: flex-end;
                    padding-right: 102px;
                }
                .share_rule{
                    color: $font-color-white;
                    position: absolute;
                    top: -60px;
                    right: 0;
                    z-index: 9;
                    font-weight: initial;
                    padding: 8px 12px;
                    border-top-left-radius: 200px;
                    border-bottom-left-radius: 200px;
                    background: rgba($color: #000000, $alpha: .5);
                    img{
                        height: 40px;
                        margin-right: 4px;
                    }
                }
            }
            .task_box{
                padding: 0 76px;
                margin-top: 106px;
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
            background: #E6F2EF;
            // background: linear-gradient(90deg, #FEFCEF 0%, #FCFEFD 100%);
        }
        .task_warp{
            position: relative;
            z-index: 9;
            margin-top: -60px;
             .task_main{
                padding: 0 24px 0 36px;
                gap: 30px;
                box-sizing: border-box;
                // background: url('../../assets/images/home/jinbi.png') no-repeat;
                // background-size: cover;
                // background-position: 0 40px;
                .task_item{
                    height: 264px;
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
                            margin-right: -20px;
                        }
                    }
                    .show_account{
                        color: $home-title-02;
                        text-decoration: underline;
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
                        width: 80px;
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
            .task_title_head{
                font-weight: bold;
                color: $home-title-12;
            }
            .title_top{
                height: 100px;
                padding: 0 40px;
                box-sizing: border-box;
                background: $home-title-10;
                span{
                    flex: 1;
                }
            }
            .title_top:nth-child(1){
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;
            }
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
            // span{
            //     flex-shrink: 0;
            // }
            // span:nth-child(1), span:nth-child(2){
            //     flex-grow: 2;
            // }
            // span:nth-child(3), span:nth-child(4){
            //     flex-grow: 2;
            // }
            .record_item{
                height: 108px;
                background: $font-color-white;
                border-bottom: 1px solid $home-title-10;
            }
            .record_item:last-child{
                border-bottom: 1px solid transparent;
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
                font-style: italic;
                padding: 16px 20px;
                box-sizing: border-box;
                color: $home-title-06;
                border-bottom-left-radius: 20px;
                border-bottom-right-radius: 20px;
            }
        }
    }
</style>
