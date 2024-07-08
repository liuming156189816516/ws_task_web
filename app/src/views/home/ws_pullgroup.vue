<template>
    <div class="home-content">
        <page-header title="WhatsApp拉群任务" :show-icon="true" :bgcolor="false"></page-header>
        <div class="home_content">
            <div class="task_step_detail">
                <div class="task-pro">
                    <div class="left-pro">
                        <p class="invit_num">{{ teamStemp.today_income || 0}}</p>
                        <p class="invit_text">邀请进群人数(人)</p>
                    </div>
                    <div class="right-pro">
                        <p class="invit_num">{{ teamStemp.yesterday_income || 0 }}</p>
                        <p class="invit_text">获得金额(ENC)</p>
                    </div>
                </div>
                <div class="custom_line">
                    <span class="botton_line"></span>
                </div>
                <div class="task_detail" @click="$router.push('/betrecord')">查看详情</div>
            </div>
            <div class="task_desc">
                <div class="task_top">
                    <span>任务编号：{{ taskInfo.ser_no }}</span>
                    <span>任务状态：{{statusOption[taskInfo.status]}}</span>
                </div>
                <div class="task_set_text">
                    请将下列的号码的用户邀请到你的群主中，并在邀请结束后，提交你的群组链接。我们会用AI验证你的群成员是否符合要求，并按照符合要求的成员数量为你结算佣金。
                </div>
            </div>
            <div class="ws_account_warp">
                <div class="ws_account_time">
                    <div class="ws_account_top">
                        <span>任务倒计时</span>
                        <span class="task_time">
                            <van-count-down :time="taskTime" />
                        </span>
                        <span class="task_video">任务教程</span>
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
                        <van-field v-model="group_link" placeholder="请输入群组链接" /> 
                    </div>
                </div>
            </div>
        </div>
        <div class="footer_btn" v-if="isShow">
            <van-button type="danger" :loading="isLoading" loading-text="loading..." @click="submitTask">提交</van-button>
            <van-button plain type="warning" @click="downAddress">保存通讯录</van-button>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import PageHeader from "@/components/Header";
import { getincome,getcreatetaskinfo,submitcreatetask } from '@/api/home'
import uniFun from "../../utils/uni-webview-js"
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
            isLoading:false,
            taskTime: 30 * 60 * 60 * 1000,
            taskInfo:{},
            taskList:[]
		}
	},
	computed: {
		...mapState({
			userInfo: state => state.User.userInfo,
            bannerList: state => state.User.bannerList
		}),
        statusOption(){
            return ["","开始任务","进行中","结算中","已结束"]
        }
	},
    created(){
        this.timestamp = Math.floor(new Date().getTime() / 1000);
        this.task_id = this.$route.query.id||"";
        this.syncInitApi();
    },
	methods: {
        syncInitApi(){
            let fun1 = new Promise((resolve,reject)=>{
                getincome().then(res =>{
                    resolve(res)
                })
            });
            let fun2 = new Promise((resolve,reject)=>{
                getcreatetaskinfo({task_info_id:this.task_id}).then(res =>{
                    resolve(res)
                })
            });
            Promise.all([fun1,fun2]).then( res => {
                const [data1,data2] = res;
                this.teamStemp = data1;
                this.taskInfo = data2;
                this.group_link = data2.invite_link;
                this.task_id==""?data2.task_info_id:this.task_id;
                this.isShow=data2.status==1||data2.status==2?true:false;
                this.taskTime = (data2.invalid_time - this.timestamp)*1000 ||0;
                this.taskList = data2.targets.filter(item=>{ return item})
            })
        },
        copySuccess(){
            this.$toast(`${this.$t("home_031")}${this.$t("other_006")}`);
        },
        submitTask(){
            if(!this.group_link) return this.$toast("请输入群组链接"); 
            this.isLoading=true;
            submitcreatetask({task_info_id:this.task_id,invite_link:this.group_link}).then(res =>{
                this.isLoading=false;
                if(res.code) return;
                this.$toast("任务已提交，及时关注佣金收益！");
                setTimeout(()=>{
                    this.$router.go(-1)
                },1000)
            })
        },
        downAddress(){
           // 请求获取通讯录权限
            uniFun.postMessage({data:this.taskList});
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
            margin-bottom: 160px;
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
                    line-height: 1.5;
                    letter-spacing: 2px;
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
            gap: 20px;
            position: fixed;
            left: 0;
            bottom: 40px;
            box-sizing: border-box;
            flex-direction: column;
            justify-content: center;
            .van-button{
                border-radius: 35px;
            }
        }
    }
</style>
