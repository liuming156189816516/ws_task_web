<template>
    <div class="home-content" ref="warpBox">
        <page-header :title="$t('home_011')" :show-icon="true" :bgcolor="false"></page-header>
        <div class="home_content">
            <div class="task_step_detail">
                <div class="task-pro">
                    <div class="left-pro">
                        <p class="invit_num">{{ teamStemp.member_num || 0}}</p>
                        <p class="invit_text">{{$t('home_028')}}</p>
                    </div>
                    <div class="right-pro">
                        <p class="invit_num">{{ teamStemp.amount || 0 }}</p>
                        <p class="invit_text">{{$t('home_029')}}</p>
                    </div>
                </div>
                <div class="custom_line">
                    <span class="botton_line"></span>
                </div>
                <div class="task_detail" @click="$router.push('/betrecord')">{{$t('home_030')}}</div>
            </div>
            <div class="task_desc">
                <div class="task_top">
                    <span>{{$t('home_031')}}：{{ teamStemp.ser_no }}</span>
                    <span>{{$t('home_032')}}：{{statusOption[teamStemp.status]}}</span>
                </div>
                <div v-if="this.$Helper.checkBrowser()" class="task_set_text">
                    <span v-html="$t('home_033',{value:$t('home_042')})"></span>
                    <span class="down_text" @click="downChrome">{{$t('home_043')}}</span>
                    <!-- {{ $t('home_033',{value:$t('home_042')}) }} -->
                </div>
                <div v-else class="task_set_text" v-html="$t('home_033',{value:''})"></div>
            </div>
            <div class="ws_account_warp">
                <div class="ws_account_time">
                    <div class="ws_account_top">
                        <span>{{$t('home_034')}}</span>
                        <span class="task_time">
                            <van-count-down :time="taskTime" />
                        </span>
                        <span class="task_video" @click="showVideo">{{$t('home_035')}}</span>
                    </div>
                    <div class="account_warp">
                        <div class="account_list" v-for="(item,idx) in taskList" :key="idx">
                            <div class="account_item">
                                <span>{{ item.target }}</span>
                                <img src="../../assets/images/fuzhi.png" v-clipboard:copy="item" v-clipboard:success="copySuccess">
                            </div>
                            <!-- <div class="account_item">
                                <span>+551197128935{{  }}</span>
                                <img src="../../assets/images/fuzhi.png"  v-clipboard:copy="item" v-clipboard:success="copySuccess">
                            </div> -->
                        </div>
                    </div>
                    <div>
                        <van-field :disabled="!isShow" v-model="group_link" :placeholder="$t('other_001',{value:$t('home_036')})" /> 
                    </div>
                </div>
            </div>
        </div>
        <div class="footer_btn" v-if="isShow">
            <van-button type="primary" :loading="isLoading" :loading-text="$t('other_029')" @click="submitTask">{{$t('home_038')}}</van-button>
            <van-button plain type="primary" @click="downAddress">{{$t('home_037')}}</van-button>
        </div>
    </div>
</template>
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
            taskList:[]
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
            padding: 0 20px;
            margin-top: 20px;
            margin-bottom: 200px;
            box-sizing: border-box;
            .task_step_detail{
                width: 100%;
                display: flex;
                padding: 20px 0;
                flex-direction: column;
                border-radius: 10px;
                box-sizing: border-box;
                background-color: $color-theme;
                .task-pro{
                    width: 100%;
                    display: flex;
                    flex-direction: row;
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
                    .invit_num{
                        font-size: 48px;
                    }
                    .invit_text{
                        font-size: 24px;
                        font-weight: 400;
                        margin-top: 12px;
                    }
                    .left-pro{
                        border-right: 1px dashed #fff;
                    }
                }
                .custom_line{
                    margin-top: 30px;
                }
                .task_detail{
                    width: 100%;
                    color: #fff;
                    display: flex;
                    font-size: 24px;
                    margin-top: 20px;
                    justify-content: center;
                    text-decoration: underline;
                }
            }
            .task_desc{
                display: flex;
                width: 100%;
                padding: 30px 0;
                flex-direction: column;
                box-sizing: border-box;
                .task_top{
                    width: 100%;
                    display: flex;
                    font-size: 26px;
                    font-weight: bold;
                    justify-content: space-between;
                }
                .task_set_text{
                    font-size: 24px;
                    margin-top: 20px;
                    line-height: 1.4;
                    text-align: justify;
                    .down_text{
                        color: $color-theme;
                        text-decoration: underline;
                    }
                }
            }
            .ws_account_warp{
                display: flex;
                width: 100%;
                padding-bottom: 30px;
                flex-direction: column;
                box-sizing: border-box;
                .ws_account_time{
                    display: flex;
                    flex-direction: column;
                    .ws_account_top{
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        // background-color: cadetblue;
                        span{
                            display: flex;
                            flex: 1;
                            font-size: 24px;
                            font-weight: bold;
                            justify-content: center;
                        }
                        .task_time{
                            font-size: 42px;
                        }
                        .task_video{
                            width: 100%;
                            display: flex;
                            color: #ff976a;
                        }
                    }
                    .account_warp{
                        width: 100%; 
                        display: flex;
                        flex-wrap: wrap; 
                        max-height: 360px;
                        overflow-y: auto;
                        // margin-bottom: 20px;
                        justify-content: space-between;
                        .account_list{
                            width: 48%;
                            display: flex;
                            font-size: 32px;
                            margin-top: 20px;
                            align-items: center;
                            flex-wrap:nowrap;
                            // justify-content: space-between;
                            .account_item{
                                display: flex;
                                align-items: center;
                                img{
                                    height: 30px;
                                    margin-left: 10px;
                                }
                            }
                        }
                    }
                    .account_list:nth-child(even){
                        display: flex;
                        justify-content: right;
                    }
                    .van-cell{
                        padding: 8px 10px;
                        border-radius: 8px;
                        line-height: 1;
                        margin-top: 10px;
                    }
                }
            }
        }
        .footer_btn{
            width: 100%;
            display: flex;
            padding: 0 20px;
            position: fixed;
            left: 0;
            flex-shrink: 0;
            bottom: 40px;
            box-sizing: border-box;
            flex-direction: column;
            justify-content: center;
            background-color: #f2f2f2;
            .van-button{
                border-radius: 35px;
            }
            .van-button:nth-child(1){
                margin-bottom: 10px;
            }
        }
    }
</style>
