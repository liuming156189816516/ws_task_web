<template>
    <div class="server_warp w_f flex-item flex-dir-c">
        <div class="cover_gradient w_f">
            <div class="serve_top w_f flex-item flex-align">
                <div class="serve_l serve_r">
                    <img src="@/assets/images/serveic/ser_bots.png" alt="" srcset="">
                </div>
                <div class="serve_r flex-item flex-dir-c">
                    <p class="font_32">Hi，{{ userInfo.account }}</p>
                    <p class="font_28">How can I assist you</p>
                </div>
            </div>
            <div class="sys_task w_f">
                <div class="task_desc w_f">
                    <p class="font_32">Self-service video support</p>
                    <div class="w_f flex-item flex-align flex-center">
                        <img src="@/assets/images/serveic/play_icon.png" alt="" srcset="">
                    </div>
                    <!-- <video ref="myVideo" poster="@/assets/images/home/cover_img.jpg" controls="controls" style="width: 100%;height: 200px;" :src="help_url"></video> -->
                </div>
            </div>
            <div class="sys_serve w_f">
                <div class="serve_box w_f flex-item flex-align flex-between">
                    <div class="w_f flex-item flex-align">
                        <img src="@/assets/images/serveic/serve_icon.png" alt="">
                        <div>
                            <p class="font_28" style="font-weight: bold;">Live customer service</p>
                            <p class="font_24">24/7 service</p>
                        </div>
                    </div>
                    <van-button class="font_28" type="primary" @click="$Helper.globalService()">NOW</van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { gethelp } from '@/api/home';
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
        }
    }
}
</script>
<style lang="scss" scoped>
    .server_warp {
        height: 100vh;
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
            box-sizing: border-box;
            .task_desc{
                width: 100%;
                height: 300px;
                background: $font-color-white;
                border-radius: 24px;
                margin-top: -58px;
                p{
                    font-weight: bold;
                    padding: 14px 14px;
                    box-sizing: border-box;
                }
                img{
                  height: 60px;  
                  margin-top: 60px;
                //   display: flex;
                //   align-items: center;
                //   justify-content: center;
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
