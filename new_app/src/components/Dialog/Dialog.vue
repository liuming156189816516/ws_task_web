<template>
    <van-overlay :show="visible">
        <div class="overlay-mian" @click.stop>
            <template v-if="type==1||type==2">
                <div class="header_title">
                    {{ title }}
                    <van-icon class="close_btn" name="cross" @click="closeBtn" />
                </div>
            </template>
            <div class="video_tips" v-if="type==1">
                <video ref="myVideo" poster="@/assets/images/home/cover_img.jpg" controls :src="content"></video>
            </div>
            <div class="contnet_mian" v-if="type==2">
                <div v-html="content"></div>
                <!-- <div class="bank_btn">
                    <van-button type="primary" @click="$router.push('/home')">确定</van-button>
                </div> -->
            </div>
            <template v-if="type==3||type==4||type==5|type==6||type==7||type==8">
                <div class="rule_model w_f flex-item flex-align flex-dir-c">
                    <img class="close_icon" src="@/assets/images/close_icon.png" @click="closeBtn">
                    <div class="top_header w_f flex-item flex-center flex-align font_26">{{title}}</div>
                    <div class="rule_desc font_22" v-if="type==3">
                        <p>{{restLanuage('home_059')}}</p>
                        <p>{{restLanuage('home_060')}}</p>
                        <p>{{restLanuage('home_061')}}</p>
                        <p>{{restLanuage('home_062')}}</p>
                        <p>{{restLanuage('home_063')}}</p>
                    </div>
                    <div class="rule_desc font_22" v-if="type==4">
                        <p>{{restLanuage('home_064')}}</p>
                        <p>{{restLanuage('home_065')}}</p>
                        <p>{{restLanuage('home_066')}}</p>
                        <p>{{restLanuage('home_067')}}</p>
                    </div>
                    <div class="rule_desc font_22" v-if="type==5">
                        <p>{{restLanuage('home_068')}}</p>
                        <p>{{restLanuage('home_069')}}</p>
                        <p>{{restLanuage('home_070')}}</p>
                        <p>{{restLanuage('home_071')}}</p>
                    </div>
                    <div class="rule_desc font_22" v-if="type==6">
                        <div class="secound_tiitle">
                            <p class="font_26">{{restLanuage('home_072')}}</p>
                            <span class="font_22">{{restLanuage('home_073')}}</span>
                        </div>
                        <div class="secound_tiitle">
                            <p class="font_26">{{restLanuage('home_074')}}</p>
                            <span class="font_22">{{restLanuage('home_075')}}</span>
                        </div>
                        <div class="secound_tiitle">
                            <p class="font_26">{{restLanuage('home_076')}}</p>
                            <span class="font_22">{{restLanuage('home_077')}}</span>
                        </div>
                        <div class="secound_tiitle">
                            <p class="font_26">{{restLanuage('home_078')}}</p>
                            <span class="font_22">{{restLanuage('home_079')}}</span>
                        </div>
                    </div>
                    <div class="rule_desc w_f flex-item flex-between font_22" style="flex-wrap: wrap;" v-if="type==7">
                        <div class="task_list flex-item flex-center" v-for="(item,idx) in content" :key="idx">
                            {{ item.target }}
                            <!-- <span v-for="(item,idx) in content" :key="idx">{{ item.target }}</span> -->
                        </div>
                    </div>
                    <div class="rule_desc font_22" v-if="type==8">
                        <p>{{restLanuage('home_080')}}</p>
                        <p>{{restLanuage('home_081')}}</p>
                        <p>{{restLanuage('home_082')}}</p>
                        <p>{{restLanuage('home_083')}}</p>
                    </div>
                </div>
            </template>
        </div>
    </van-overlay>
</template>
<script>
import { i18n } from '@/assets/lang'
export default {
    props: {
        type:{
            type: Number,
            default: null 
        },
        title: {
            type: String,
            default: "" //默认高度
        },
        content: {
            type: String,
            default: "" 
        }
    },
    data() {
        return {
            visible:false,
            is_play:false
        };
    },
    mounted() {
        setTimeout(()=>{
            let video = this.$refs.myVideo;
            if(video){
                video.addEventListener('play', (e)=> {
                    this.is_play=true;
                })
                video.addEventListener('pause',(e)=> {
                    this.is_play=false;
                })
            }
        })
    },
    methods: {
        closeBtn(){
            document.getElementById("app").removeChild(this.$el);
            window.localStorage.setItem('is_play',false)
            this.visible=false;
        },
        palySource(){
            this.$refs.myVideo.play();
            this.is_play=true;
            // this.$refs.myVideo.setAttribute('webkit-playsinline', true);
            // this.$refs.myVideo.setAttribute('playsinline', true);
        },
        restLanuage(val){
            return i18n.t(val)
        }
    }
    // beforeDestroy(){
    //     window.removeEventListener('play');
    //     indow.removeEventListener('pause');
    // }
};
</script>
<style lang="scss" scoped>
.van-overlay{
    width: 100%;
    height: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    .overlay-mian{
        width: 100%;
        border-radius: 8px;
        // overflow: hidden;
        box-sizing: border-box;
        background-color: $font-color-white;
        .header_title{
            width: 100%;
            height: 66px;
            display: flex;
            position: relative;
            font-size: 20px;
            align-items: center;
            justify-content: center;
            .close_btn{
                // color: $home-eart-status-value;
                font-size: 20px;
                position: absolute;
                top: 12px;
                right: 12px;
            }
        }
        .video_tips{
            width: 100%;
            padding: 0;
            overflow: hidden;
            position: relative;
            // padding-bottom: 20px;
            margin-bottom: 20px;
            background: $font-color-white;
            video{
                width: 100%;
                height: 190px;
            }
        }
        .contnet_mian{
            width: 100%;
            // border-radius: 30px;
            padding: 0 20px 30px 20px;
            text-align: justify;
            box-sizing: border-box;
            .bank_btn{
                display: flex;
                width: 100%;
                margin-top: 20px;
                align-items: center;
                justify-content: center;
                .van-button{
                    height: max-content;
                    padding: 10px 20px;
                }
            }
        }
        .rule_model{
            width: 100%;
            // height: 300px;
            position: relative;
            border-radius: 30px;
            background-color: $font-color-white;
            .close_icon{
                height: 24px;
                position: absolute;
                top: -30px;
                right: 0;
            }
            .top_header{
                width: 233px;
                height: 33px;
                font-weight: 510;
                margin-bottom: 10px;
                color: $home-title-12;
                background: url('../../assets/images/head_icon.png') no-repeat;
                background-size: cover;
            }
            .rule_desc{
                padding: 10px 12px;
                box-sizing: border-box;
                p{
                    line-height: 14px;
                    color: $font-color-black;
                    margin-bottom: 12px;
                }
                .task_list{
                    width: 33.33%;
                    line-height: 1.8;
                }
                .secound_tiitle{
                    color: $home-title-15;
                    margin-bottom: 24px;
                    p{
                        margin-bottom: 8px;
                    }
                }
            }
        }
        // .continer{
        //     width: 100%;
        //     height: 320px;
        //     po
        //     background: cadetblue;
        // }
        // background: $font-color-white;
    }
}
// .van-dialog{
//     display: flex !important;
//     width: 85% !important;
//     top: 50%;
//     flex-direction: column !important;
//     ::v-deep .van-dialog__content{
//         background-color: darkcyan;
//     }
//     ::v-deep .van-dialog__header{
//         padding: 10px 0;
//     }
//     .close_btn{
//         color: $home-eart-status-value;
//         font-size: 20px;
//         position: absolute;
//         top: 12px;
//         right: 12px;
//     }
//     .video_tips{
//         width: 100%;
//         padding: 0;
//         overflow: hidden;
//         padding-bottom: 20px;
//         background: $font-color-white;
//         video{
//             width: 100%;
//         }
//     }
// }
</style>