<template>
    <div class="home-content" ref="warpBox">
        <div class="task_mian w_f">
            <page-header :title="$t('home_011')" :show-icon="true" :bgcolor="false" />
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
            </div>
            <div class="task_box w_f flex-item">
                <div class="task_Progress w_f flex-item flex-dir-c">
                    <p class="task_title w_f flex-item flex-center font_28">Task Information</p>
                    <div class="w_f flex-item flex-between">
                        <div class="task_item">
                            <p class="task_text font_24">Current Task Number</p>
                            <p class="task_num font_28">20240726212134</p>
                        </div>
                        <div>
                            <p class="task_text font_24">Current Task Status</p>
                            <p class="task_num font_28">In Progress <span class="font_28">00:23:21</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="task_win_bonus w_f flex-item flex-align flex-center font_32">Complete task to win bonus</div>
        </div>
        <div class="task_warp w_f flex-item">
            <div class="task_main w_f flex-item flex-dir-c">
                <div class="task_item w_f flex-item flex-dir-c font_34">
                    <div class="task_name w_f flex-item">
                        <img src="@/assets/images/mill/s_01.png" alt="" srcset="">
                    </div>
                    <div class="task_award w_f">
                        <div class="task_book font_28">Import contacts to your phone’s address book</div>
                        <div class="task_desc font_20">Click the Import button on the right to add the contact information provided by the system to the system’s address book!</div>
                    </div>
                    <div class="w_f flex-item flex-between flex-align font_24">
                        <span class="show_account">View Contact Numbers</span>
                        <van-button type="primary">Import</van-button>
                    </div>
                </div>

                <div class="task_item w_f flex-item flex-dir-c font_34">
                    <div class="task_name w_f flex-item">
                        <img src="@/assets/images/mill/s_02.png" alt="" srcset="">
                    </div>
                    <div class="task_award w_f">
                        <div class="task_book font_28">Submit Group Link</div>
                        <!-- <div class="task_desc font_20">Click the Import button on the right to add the contact information provided by the system to the system’s address book!</div> -->
                    </div>
                    <div class="group_link w_f flex-item flex-between flex-align font_24">
                        <input type="text" placeholder="Enter Group Link">
                        <van-button type="primary">Import</van-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="record_legend w_f flex-item flex-dir-c">
            <h3 class="font_28">Records：</h3>
            <div class="record_derc font_22">If you have any questions about the invitation records，please contact <span class="focus_tips">online customer service</span></div>
        </div>
        <div class="record_list w_f flex-item flex-dir-c">
            <div class="title_top w_f flex-item flex-align flex-between font_28">
                <span>Time</span>
                <span>Bonus</span>
            </div>
            <div class="title_top record_item w_f flex-item flex-align flex-between font_26" v-for="(item,idx) in recordList" :key="idx">
                <span>2024-07-31 05:57:02</span>
                <span>456.00</span>
            </div>
            <div class="title_top footer_tips w_f flex-item font_24">
                Task time is based on the start time of the task ,the system currently retains records for up to 3 months
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .home-content {
        height: 100%;
        height: 100vh;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #f2f2f2;
        -webkit-overflow-scrolling: touch; 
        padding-bottom: 120px;
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
                color: $font-color-white;
                // text-shadow: 0px 8px 3px #005440;
                text-shadow: 0 5px 3px #FF4F2B,0 -2px 0 #FF4F2B;
                .Win_l{
                  padding-left: 104px;
                }
                .Win_r{
                    align-self: flex-end;
                    padding-right: 102px;
                }
            }
            .task_box{
                padding: 0 76px;
                margin-top: 106px;
                box-sizing: border-box;
                .task_Progress{
                    border-radius: 24px;
                    padding: 14px 0 24px 24px;
                    box-sizing: border-box;
                    background: $font-color-white;
                    .task_title{
                        margin-bottom: 20px;
                    }
                }
                .task_text{
                    color: $home-title-06;
                    margin-bottom: 12px;
                }
                .task_num{
                    color: $home-title-12;
                    font-weight: bold;
                    span{
                        font-weight: initial;
                        color: $home-title-02;
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
                background: $font-color-white;
                .focus_tips{
                    color: $home-title-02;
                }
            }
        }
        .record_list{
            padding: 0 30px;
            margin-top: 20px;
            padding-bottom: 30px;
            box-sizing: border-box;
            color: $font-color-black;
            .title_top{
                height: 100px;
                padding: 0 40px;
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
            .footer_tips{
                padding: 16px 20px;
                box-sizing: border-box;
                color: $home-title-06;
                border-bottom-left-radius: 20px;
                border-bottom-right-radius: 20px;
            }
        }
    }
</style>
<script>
import { mapState } from 'vuex';
import PageHeader from "@/components/Header";
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
            recordList:[0,0,0,0,0]
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
        copySuccess(){
            this.$toast(`${this.$t("other_044")}`);
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
                // link.href = this.target_url;
                // link.setAttribute('download', 'phone_numbers');
                // link.click();
                // let textContent = "";
                // for (let k = 0; k < this.taskList.length; k++) {
                //     let number = this.taskList[k];
                //     textContent += `BEGIN:VCARD\rVERSION:2.1\rFN:${number.name}\rTEL:+${number.target}\rEND:VCARD\r`
                // }
                // let a = document.createElement('a');
                // const blob = new Blob([textContent], { type: 'text/plain' });
                // a.href = window.URL.createObjectURL(blob);
                // a.download = 'phone_numbers.vcf';
                // document.body.appendChild(a);
                // link.target = "_blank"; 
                // a.click();
                // document.body.removeChild(a);
                // window.URL.revokeObjectURL(a.href);

                // let tempLink = document.createElement("a");
                // tempLink.style.display = "none";
                // const blob = new Blob([textContent], { type: 'text/plain' });
                // tempLink.href = window.URL.createObjectURL(blob);
                // tempLink.setAttribute("download",'phone_numbers.vcf');
                // tempLink.setAttribute("target", "_blank");
                // document.body.appendChild(tempLink);
                // tempLink.click();
                // document.body.removeChild(tempLink);
            }else{
                uniFun.postMessage({data:this.taskList});
            }
            // uniFun.postMessage({data:this.taskList});
        },
        showVideo(){
            this.$router.push("/service")
        },
        downChrome(){
            const link = document.createElement('a');
            link.href = this.chrome_url;
            link.setAttribute('download', 'Chrome');
            link.click();
        }
	}
};
</script>
