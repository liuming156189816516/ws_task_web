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
            <div class="sys_serve w_f">
                <div class="serve_box w_f flex-item flex-align flex-between">
                    <div class="w_f flex-item flex-align">
                        <img src="@/assets/images/serveic/serve_icon.png" alt="">
                        <div>
                            <p class="font_28" style="font-weight: bold;">{{$t('serv_003')}}</p>
                            <p class="font_24">{{$t('serv_004')}}</p>
                        </div>
                    </div>
                    <van-button class="font_28" type="primary" @click="contactService(0)">{{$t('serv_005')}}</van-button>
                </div>
            </div>
            <div class="sys_serve w_f">
                <div class="serve_box w_f flex-item flex-align flex-between">
                    <div class="w_f flex-item flex-align">
                        <img src="@/assets/images/serveic/telege_icon.png" alt="">
                        <div>
                            <p class="font_28" style="font-weight: bold;">{{$t('spre_002')}}</p>
                            <p class="font_24">{{$t('serv_004')}}</p>
                        </div>
                    </div>
                    <van-button class="font_28" type="primary" @click="contactService(1)">{{$t('spre_001')}}</van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { getwithdrawconfig } from '@/api/pay';
import uniFun from "@/utils/uni-webview-js"
export default {
    data() {
        return {
            palyIdx:null,
            limit_amount:0,
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
        taskRuleOption(){
            return [
                [this.$t('serv_007'),this.$t('serv_017'),this.$t('serv_018')],
                [this.$t('serv_008'),this.$t('serv_020'),this.$t('serv_021')],
                [this.$t('serv_009'),this.$t('serv_023',{value:this.limit_amount}),this.$t('serv_024')],
                [this.$t('serv_010'),this.$t('serv_026')],
                [this.$t('serv_011'),this.$t('serv_028')]
            ]
        }
    },
    created() {
        this.getWithdrawalAmount();
    },
    methods: {
        async getWithdrawalAmount() {
            const { limit_amount } = await getwithdrawconfig()
            this.limit_amount = limit_amount;
        },
        contactService(idx){
            if(idx == 1){
                if(this.$Helper.checkBrowser()){
                    window.open(process.env.VUE_APP_TELEGRAM,"_blank");
                }else{
                    uniFun.postMessage({data:process.env.VUE_APP_TELEGRAM});
                }
            }else{
                if(this.$Helper.checkBrowser()){
                    window.open(process.env.VUE_APP_SERVICE,"_blank");
                }else{
                    uniFun.postMessage({data:process.env.VUE_APP_SERVICE});
                }
            }
        },
        showRule(idx){
            let tips = this.taskRuleOption[idx];
            this.$popDialog({content:tips,steps:true, type: 13 })
            // this.$popDialog({ content: this.help_url, title: this.$t("other_051"), type: 13 })
        },
        playAudio(idx){
            let allVideo = document.querySelectorAll(".myVideo");
            // console.log(allVideo);
            for (let k = 0; k < allVideo.length; k++) {
                allVideo[k].pause();
                if(idx === k){
                    this.palyIdx = k;
                    allVideo[k].play();
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .server_warp {
        height:100%;
        padding-bottom: 120px;
        background: $color-btnbg;
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
                        position: relative;
                        border: 1px solid $home-title-16;
                        p{
                            padding: 0;
                        }
                        .studay_video{
                            height: 120px;
                            overflow: hidden;
                            position: absolute;
                            top: 0;
                            left: 0;
                            z-index: 1;
                            background: rgba($color: #fff, $alpha: .5);
                            img{
                                height: 60px;  
                            }
                        }
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
                    flex-shrink: 0;
                    padding: 0 14px;
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
