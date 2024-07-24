<template>
    <div class="spread_warp">
        <div class="top_model">
            <div class="user_mess">{{$t('serv_001')}}</div>
            <div class="cover_model">
                <div class="task_warp">
                    <div class="left_img">
                        <img src="../assets/images/consult_icon.png" alt="" srcset="">
                    </div>
                    <div class="task_num">
                        <div class="task_top">
                            <div class="text_1">{{$t('serv_002')}}</div>
                            <div class="text_2">{{$t('serv_003')}}</div>
                        </div>
                        <van-button type="primary" @click="contactService">{{$t('serv_005')}}</van-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="spread_info">
            <div class="spread_l">
                <span class="left_icon"></span>{{$t('serv_004')}}
            </div>
            <div class="info_main">
                <video controls :src="help_url" type="video/mp4"/>
            </div>
        </div>
    </div>
</template>

<script>
import { gethelp } from '@/api/home';
import uniFun from "@/utils/uni-webview-js"
export default {
    data() {
        return {
            help_url:"",
        }
    },
    created() {
        this.getHelpVideo();
    },
    methods: {
        async getHelpVideo() {
            const { url } = await gethelp({});
            this.help_url = url;
        },
        contactService(){
            if(this.$Helper.checkBrowser()){
                window.open("https://wa.me/44737767567","_blank");
            }else{
                uniFun.postMessage({data:"https://wa.me/447377675671"});
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.spread_warp {
    width: 100%;
    height: 100vh;
    padding-bottom: 100px;
    background-color: #f2f2f2;
    .top_model {
        width: 100%;
        height: 380px;
        display: flex;
        padding: 0 30px;
        margin-bottom: 115px;
        position: relative;
        border-bottom-left-radius: 80px;
        border-bottom-right-radius: 80px;
        box-sizing: border-box;
        justify-content: space-between;
        background: $color-theme;
        .user_mess {
            width: 100%;
            display: flex;
            padding: 30px 0;
            font-size: 36px;
            justify-content: center;
            color: $font-color-white;
        }
        .cover_model {
            width: 100%;
            position: absolute;
            top: 120px;
            left: 0;
            padding: 0 20px;
            box-sizing: border-box;
            .task_warp {
                display: flex;
                padding: 40px 60px;
                border-radius: 10px;
                align-items: center;
                justify-content: space-between;
                background-color: $font-color-white;
                .left_img{
                    flex-shrink: 0;
                    img{
                        height: 280px;
                    }
                }
                .task_num {
                    display: flex;
                    height: 260px;
                    // flex-shrink: 0;
                    margin-left: 20px;
                    align-items: center;
                    flex-direction: column;
                    justify-content: space-around;  
                    .task_top{
                        display: flex;
                        flex-direction: column;
                        margin-bottom: 20px;
                        .text_1 {
                            display: flex;
                            font-size: 48px;
                            font-weight: bold;
                        }
                        .text_2 {
                            color: $home-earn-more;
                            font-size: 28px;
                        }
                    }
                    .van-button{
                        height: 32px !important;
                        display: flex;
                        flex-shrink: 0;
                        border-radius: 30px;
                        height: inherit;
                        padding: 10px 20px;
                    }
                }
            }
        }
    }
    .spread_info{
        width: 100%;
        display: flex;
        padding: 0 20px;
        box-sizing: border-box;
        flex-direction: column;
        .spread_l{
            height: 60px; 
            display: flex; 
            padding: 16px 0;
            font-size: 32px;
            font-weight: bold;
            align-items: center;
            margin: 20px 0;
        }
        .left_icon{
            height: 100%;
            width: 8px;
            margin-right: 10px;
            background-color: $color-theme;
            border-radius: 38px;
        }
        .info_main{
            width: 100%;
            display: flex;
            video {
                width: 100%;
                max-height: 100%;
            }
        }
    }
}
</style>