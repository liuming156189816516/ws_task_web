<template>
    <div class="server_warp w_f flex-item flex-dir-c">
        <div class="cover_gradient w_f">
            <div class="serve_top w_f flex-item flex-align">
                <div class="serve_l serve_r">
                    <img src="@/assets/images/serveic/ser_bots.png" alt="" srcset="">
                </div>
                <div class="serve_r flex-item flex-dir-c">
                    <p class="font_32">{{$t('serv_001',{value:userInfo.account})}}</p>
                    <p class="font_28">{{$t('serv_002')}}</p>
                </div>
            </div>
            <div class="task_continer w_f flex-item flex-dir-c">
                <div class="task_main">
                    <div class="video_title font_32">{{$t('serv_006')}}</div>
                    <div class="task_item" v-for="(item, idx) in menuOption" :key="idx" @click="showRule(idx)">
                        <div class="left_text">
                            <span class="font_28">{{ item }}</span>
                        </div>
                        <!-- <div class="right_icon"> -->
                            <img src="@/assets/images/home/xiala_icon.png" alt="" srcset="">
                        <!-- </div> -->
                    </div>
                </div>
            </div>
            <div class="sys_task w_f flex-item">
                <div class="task_desc w_f">
                    <p class="font_32">{{$t('serv_012')}}</p>
                    <div class="video_item flex-item flex-align flex-center">
                        <div class="w_f item_dir flex-item flex-align flex-center flex-dir-c" v-for="(item,idx) in videoOption" :key="idx">
                            <!-- <img src="@/assets/images/serveic/play_icon.png"> -->
                            <!-- <div class="studay_video flex-item flex-align"> -->
                            <video ref="myVideo" poster="../assets/images/home/cover_img.jpg" controls="controls" style="width:100%;height:88px;" :src="item.url" />
                            <!-- </div> -->
                            <div class="text_item font_18 flex-item flex-align flex-center flex-dir-c">
                                <p>{{$t('login_027')}}:</p>
                                <div class="flex-item flex-align flex-center">{{item.name}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             <!-- <video ref="myVideo" poster="@/assets/images/home/cover_img.jpg" controls="controls" style="width: 100%;height: 200px;" :src="help_url"></video> -->
            <div class="sys_serve w_f">
                <div class="serve_box w_f flex-item flex-align flex-between">
                    <div class="w_f flex-item flex-align">
                        <img src="@/assets/images/serveic/serve_icon.png" alt="">
                        <div>
                            <p class="font_28" style="font-weight: bold;">{{$t('serv_003')}}</p>
                            <p class="font_24">{{$t('serv_004')}}</p>
                        </div>
                    </div>
                    <van-button class="font_28" type="primary" @click="contactService">{{$t('serv_005')}}</van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { gethelp } from '@/api/home';
import uniFun from "@/utils/uni-webview-js"
export default {
    data() {
        return {
            help_url:"",
            is_play:false,
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.User
        }),
        menuOption(){
            return [this.$t('serv_007'),this.$t('serv_008'),this.$t('serv_009'),this.$t('serv_010'),this.$t('serv_011')]
        },
        videoOption(){
            return [
                {
                    url:require("../assets/video/1.mp4"),
                    name:this.$t('serv_013')
                },
                {
                    url:require("../assets/video/2.mp4"),
                    name:this.$t('serv_014')
                },
                {
                    url:require("../assets/video/3.mp4"),
                    name:this.$t('serv_015')
                }
            ]
        },
        taskRuleOption(){
            return [
                [this.$t('serv_016'),this.$t('serv_017'),this.$t('serv_018')],
                [this.$t('serv_019'),this.$t('serv_020'),this.$t('serv_021')],
                [this.$t('serv_022'),this.$t('serv_023'),this.$t('serv_024')],
                [this.$t('serv_025'),this.$t('serv_026')],
                [this.$t('serv_027'),this.$t('serv_028')]
            ]
        }
    },
    created() {
        this.getHelpVideo();
    },
    mounted() {
        // setTimeout(()=>{
        //     let video = this.$refs.myVideo;
        //     video.addEventListener('play', (e)=> {
        //         this.is_play=true;
        //     })
        //     video.addEventListener('pause',(e)=> {
        //         this.is_play=false;
        //     })
        // })
    },
    methods: {
        async getHelpVideo() {
            const { url } = await gethelp({});
            this.help_url = url;
        },
        contactService(){
            if(this.$Helper.checkBrowser()){
                window.open(process.env.VUE_APP_SERVICE,"_blank");
            }else{
                uniFun.postMessage({data:process.env.VUE_APP_SERVICE});
            }
        },
        showRule(idx){
            let tips = this.taskRuleOption[idx];
            this.$popDialog({content:tips,steps:true, type: 13 })
            // this.$popDialog({ content: this.help_url, title: this.$t("other_051"), type: 13 })
        }
    }
}
</script>
<style lang="scss" scoped>
    .server_warp {
        padding-bottom: 120px;
        background: url('../assets/images/home/bg_img.png') no-repeat;
        background: linear-gradient(to top,#ffff 0%, $color-theme 100%);
        background-size: cover;
        .serve_top{
            height: 200px;
            margin-top: 46px;
            .serve_l{
                margin-left: 54px;
                img{
                    height: 200px;
                }
            }
            .serve_r{
                p:nth-child(1){
                    color: $font-color-white;
                    margin-top: -40px;
                }
                p:nth-child(2){
                    color: $home-title-05;
                    margin-top: 10px;
                }
            }
        }
        .sys_task{
            position: relative;
            padding: 0 26px;
            margin-top: 20px;
            box-sizing: border-box;
            .task_desc{
                width: 100%;
                border-radius: 24px;
                background: $font-color-white;
                .video_item{
                    gap: 18px;
                    padding: 0 20px;
                    margin-bottom: 20px;
                    box-sizing: border-box;
                    // padding-bottom: 10px;
                    color: $home-title-06;
                    .item_dir{
                        overflow: hidden;
                        border-radius: 32px;
                        border: 1px solid $home-title-16;
                        p{
                            padding: 0;
                        }
                        // .studay_video{
                        //     height: 88px;
                        //     overflow: hidden;
                        // }
                    }   
                    .text_item{
                        margin-top: 20px;
                        padding: 6px 2px 10px 2px;
                        box-sizing: border-box;
                        background: $home-title-16;
                    }
                }
                p{
                    font-weight: bold;
                    padding: 14px 14px;
                    box-sizing: border-box;
                }
                img{
                  height: 60px;  
                  margin-top: 46px;
                //   display: flex;
                //   align-items: center;
                //   justify-content: center;
                }
            }
        }
        .task_continer {
            padding: 0 26px;
            margin-top: 20px;
            margin-top: -58px;
            box-sizing: border-box;
            .task_main {
                display: flex;
                padding: 0 28px;
                border-radius: 24px;
                box-sizing: border-box;
                flex-direction: column;
                background-color: $font-color-white;
                .video_title{
                    margin-top: 28px;
                    font-weight: bold;
                }
                .task_item {
                    width: 100%;
                    display: flex;
                    padding: 32px 0;
                    align-items: center;
                    box-sizing: border-box;
                    justify-content: space-between;
                    border-bottom: 1px solid #ececec;
                    .left_text {
                        display: flex;
                        align-items: center;
                        .ws_icon {
                            height: 40px;
                            margin-right: 10px;
                        }
                    }
                    img{
                        height: 26px;
                        flex-shrink: 0;
                        transform: rotate(-90deg);
                    }
                    .van-button {
                        width: 100px;
                        height: max-content;
                        line-height: 1;
                        padding: 10px 0;
                        font-size: 12px;
                        border-radius: 35px;
                        box-sizing: border-box;
                    }
                }
                .task_item:last-child{
                    border: none;
                }
            }
        }
        .sys_serve{
            padding: 0 26px;
            margin-top: 20px;
            box-sizing: border-box;
            .serve_box{
                padding: 24px 32px;
                box-sizing: border-box;
                color: $font-color-white;
                border-radius: 200px;
                background: $font-color-white;
                img{
                    height: 48.2px;
                    margin-right: 20px;
                }
                p:nth-child(1){
                    color: $home-title-12;
                }
                p:nth-child(2){
                    color: $home-title-06;
                }
                .van-button{
                    width: max-content;
                    height: 32px;
                    padding: 0 20px;
                    font-size: 14px;
                    line-height: 32px;
                    border-radius: 100px;
                    border-color: $color-theme;
                    background-color: $color-theme;
                }
                // video {
                //     width: 100%;
                //     height: 400px;
                // }
            }
        }
    }
</style>
