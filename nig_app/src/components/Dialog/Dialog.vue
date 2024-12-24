<template>
    <van-overlay :show="visible" :class="{'mian_padding':!steps}">
        <div class="overlay_mian" @click.stop v-if="!steps">
            <template v-if="type==1||type==2||type==10">
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
            <div class="contnet_mian" v-if="type==10">
                <div v-html="content" class="font_28"></div>
            </div>
            <template v-if="type==3||type==4||type==5|type==7||type==8||type==9">
                <div class="rule_model w_f flex-item flex-align flex-dir-c">
                    <img class="close_icon" src="@/assets/images/close_icon.png" @click="closeBtn">
                    <div class="top_header w_f flex-item flex-center flex-align font_26">{{title}}</div>
                    <div ref="tips_scroll" class="rule_desc tips_rule font_22" v-if="type==3">
                        <p @click="jumpLogin" v-html="restLanuage('home_059')"></p>
                        <h3 class="big_title flex-item flex-center font_34">&lt;How to complete the task&gt;</h3>
                        <p class="back_color mb_24 font_26" v-html="restLanuage('home_060')"></p>
                        <img class="guide_01" src="@/assets/images/home/guide_01.png" alt="" srcset="">
                        <h3 class="big_title flex-item flex-center font_34">&lt;How to check my coins&gt;</h3>
                        <p class="back_color mb_24 font_26" v-html="restLanuage('home_061')"></p>
                        <img class="guide_02" src="@/assets/images/home/guide_02.png" alt="" srcset="">
                        <p class="back_color mg_24 font_26" v-html="restLanuage('home_062')"></p>
                        <img class="guide_02" src="@/assets/images/home/guide_03.png" alt="" srcset="">
                        <h3 class="big_title flex-item flex-center font_34">&lt;How to withdraw&gt;</h3>
                        <p class="back_color mb_24 font_26" v-html="restLanuage('home_063')"></p>
                        <img class="guide_02" src="@/assets/images/home/guide_04.png" alt="" srcset="">
                        <p style="color:#F52C2C; font_26" v-html="restLanuage('home_115')"></p>
                        <!-- <p v-html="restLanuage('home_061')"></p>
                        <p v-html="restLanuage('home_061')"></p>
                        <p>{{restLanuage('home_062')}}</p>
                        <p>{{restLanuage('home_063')}}</p> -->
                    </div>
                    <div class="rule_desc rule_desc_04 font_22" v-if="type==4">
                        <p>{{restLanuage('home_064',times)}}</p>
                        <p class="mg_24">{{restLanuage('home_065',money)}}</p>
                        <p class="mb_24">{{restLanuage('home_066')}}</p>
                        <p>{{restLanuage('home_067')}}</p>
                    </div>
                    <div class="rule_desc rule_desc_5 font_28" v-if="type==5">
                        <p>{{restLanuage('other_081')}}</p>
                        <p class="mg_24">{{restLanuage('other_082')}}</p>
                        <!-- <p>{{restLanuage('other_083')}}</p> -->
                        <!-- <p class="mg_24">{{restLanuage('home_142')}}</p> -->
                        <!-- <p class="mg_24">{{restLanuage('other_081')}}</p>
                        <p class="mb_24">{{restLanuage('other_082')}}</p>
                        <p>{{restLanuage('other_083')}}</p> -->
                    </div>
                    <div class="rule_desc w_f flex-item flex-between font_22" style="flex-wrap:wrap;" v-if="type==7">
                        <div class="task_list flex-item flex-center" v-for="(item,idx) in content" :key="idx">
                            {{ item.target }}
                            <!-- <span v-for="(item,idx) in content" :key="idx">{{ item.target }}</span> -->
                        </div>
                    </div>
                    <div class="rule_desc font_28" v-if="type==8">
                        <!-- <p class="mb_24">{{restLanuage('home_031')}}：{{number}}</p> -->
                        <p class="mb_24" style="line-height: 20px;" >{{content}}</p>
                    </div>
                    <div class="rule_desc flex-item flex-align flex-center flex-dir-c font_28" v-if="type==9">
                        <p class="mb_24">{{restLanuage('home_143')}}：{{number}}</p>
                        <p class="mb_24" style="line-height: 20px;" >{{content}}</p>
                        <span class="copay_code flex-item flex-align flex-center" v-clipboard:copy="number" v-clipboard:success="copySuccess">{{restLanuage('other_006')}}</span>
                    </div>
                </div>
            </template>
            <div class="rule_model rule_model_06 w_f flex-item flex-align flex-dir-c" v-if="type==6">
                <img class="close_icon" src="@/assets/images/close_icon.png" @click="closeBtn">
                <div class="rule_model_hide w_f flex-item flex-item flex-dir-c">
                    <div class="switch_label w_f flex-item flex-align flex-between font_26">
                        <span class="flex-item flex-align flex-center font_34" :class="[ruleIdx==idx?'label_active':'']" v-for="(item,idx) in labelOption" :key="idx" @click="changeLabel(idx)">{{item}}</span>
                    </div>
                    <div class="rule_model_box w_f flex-item flex-item flex-align flex-dir-c" ref="tips_scroll">
                        <div class="rule_outside w_f flex-item flex-align flex-dir-c" v-if="ruleIdx==0">
                            <!-- <div class="top_header w_f flex-item flex-center flex-align font_26">{{title}}</div> -->
                            <div class="rule_desc rule_desc_1 font_22">
                                <div class="secound_tiitle">
                                    <p class="font_26">{{restLanuage('home_072')}}</p>
                                    <span class="font_22">{{restLanuage('home_073')}}</span><br />
                                    <span class="font_22" style="color:#F52C2C">{{restLanuage('home_119')}}</span>
                                    <div class="video_item flex-item flex-align flex-center mg_24">
                                       <!-- <video class="myVideo" ref="myVideo" controls="controls" style="width:100%;height:120px;" src="../../assets/video/1.mp4" /> -->
                                       <div v-if="palyIdx!=0" class="paly_btn w_f h_f flex-item flex-align flex-center" @click="palyVideo(0)">
                                            <img src="@/assets/images/serveic/play_icon.png" alt="">
                                       </div>
                                    </div>
                                </div>
                                <div class="secound_tiitle">
                                    <p class="font_26">{{restLanuage('home_074')}}</p>
                                    <span class="font_22">{{restLanuage('home_075')}}</span><br />
                                    <span class="font_22" style="color:#F52C2C">{{restLanuage('home_119')}}</span>
                                    <div class="video_item flex-item flex-item flex-align flex-center mg_24">
                                        <!-- <video class="myVideo" ref="myVideo" controls="controls" style="width:100%;height:120px;" src="../../assets/video/2.mp4" /> -->
                                        <div v-if="palyIdx!=1" class="paly_btn w_f h_f flex-item flex-align flex-center" @click="palyVideo(1)">
                                            <img src="@/assets/images/serveic/play_icon.png" alt="">
                                        </div>
                                    </div>
                                </div>
                                <div class="secound_tiitle">
                                    <p class="font_26">{{restLanuage('home_076')}}</p>
                                    <span class="font_22">{{restLanuage('home_077')}}</span><br />
                                    <span class="font_22" style="color:#F52C2C">{{restLanuage('home_119')}}</span>
                                    <div class="video_item flex-item flex-item flex-align flex-center mg_24">
                                        <!-- <video class="myVideo" ref="myVideo" controls="controls" style="width:100%;height:120px;" src="../../assets/video/3.mp4" /> -->
                                        <div v-if="palyIdx!=2" class="paly_btn w_f h_f flex-item flex-align flex-center" @click="palyVideo(2)">
                                            <img src="@/assets/images/serveic/play_icon.png" alt="">
                                        </div>
                                    </div>
                                </div>
                                <div class="secound_tiitle flex-item flex-between" style="margin-bottom: 10px;">
                                    <div class="tips_icon h_f">
                                        <img src="@/assets/images/tips_icon.png" alt="" srcset="">
                                    </div>
                                    <!-- <p class="font_26">{{restLanuage('home_078')}}</p> -->
                                    <span class="font_22" style="color:#F52C2C">{{restLanuage('home_120')}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="rule_outside w_f flex-item flex-align flex-dir-c" style="margin-top: 10px;" v-if="ruleIdx==1">
                            <img class="close_icon" src="@/assets/images/close_icon.png" @click="closeBtn">
                            <!-- <div class="top_header w_f flex-item flex-center flex-align font_26">Invite Friends Bonus Task Rules</div> -->
                            <div class="rule_desc rule_desc_1 font_22">
                                <div class="secound_tiitle">
                                    <p>{{restLanuage('home_084')}}</p>
                                    <p>{{restLanuage('home_085')}}</p>
                                    <p>{{restLanuage('home_086')}}</p>
                                    <p>{{restLanuage('home_087')}}</p>
                                    <p>{{restLanuage('home_118')}}</p>
                                    <p style="color:#F52C2C">{{restLanuage('home_115')}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="steps_main w_f h_f" v-if="steps&&type==9">
            <div class="bg_step w_f">
                <div class="step_text flex-item flex-align flex-dir-c">
                    <p class="font_24">Click the <span class="font_28">Tips</span> button view the guide</p>
                    <van-button type="primary" @click="kenwBtn(1)">{{restLanuage('other_062')}}</van-button>
                </div>
            </div>
        </div>
        <div :class="['steps_main group_steps w_f h_f',type==11?'task_steps':type==12?'qr_steps':'']" v-if="steps&&type==10||type==11||type==12">
            <div class="bg_step w_f">
                <div class="step_text flex-item flex-align flex-dir-c">
                    <p class="font_24">
                        Click <span class="font_28">Tutorials & Rules </span> to learn about the task details and complete task more quickly
                    </p>
                    <van-button v-if="type==10" type="primary" @click="kenwBtn(2)">{{restLanuage('other_062')}}</van-button>
                    <van-button v-if="type==11" type="primary" @click="kenwBtn(3)">{{restLanuage('other_062')}}</van-button>
                    <van-button v-if="type==12" type="primary" @click="kenwBtn(4)">{{restLanuage('other_062')}}</van-button>
                </div>
            </div>
        </div>
        <div class="steps_main w_f h_f" v-if="type==13">
            <div class="task_rule w_f font_26"> 
                <img class="close_icon" src="@/assets/images/close_icon.png" @click="closeBtn">
                <div :class="['font_26',idx==0?'first_color':'']" v-for="(item,idx) in content" :key="idx">{{item}}</div>
            </div>
        </div>
        <transition name="el-fade-in-linear">
            <div class="steps_main w_f h_f" v-if="steps&&type==99&&content">
                <div class="adv_step w_f flex-item flex-align flex-center">
                    <div class="w_f adv_cover flex-item flex-align flex-center flex-dir-c" ref="tips_scroll">
                        <!-- <h4 class="w_f font_32">产生的速度慢了点吗没事没事面对吗没什么输出吗</h4> -->
                        <h4 class="w_f font_32">{{ title }}</h4>
                        <div class="adv_content w_f flex-item flex-center flex-dir-c font_26" v-html="content"></div>
                        <van-button type="primary" @click="closeAdvBtn" plain>{{restLanuage('home_162')}}</van-button>
                    </div>
                </div>
            </div>
        </transition>
    </van-overlay>
</template>
<script>
import { i18n } from '@/assets/lang'
import { getToken } from '@/utils/tool';
import Global from "@/store/module/global";
import { dousermessagel } from '@/api/home'
export default {
    props: {
        type:{
            type: Number,
            default: null 
        },
        title: {
            type: String,
            default: ""
        },
        times: {
            type: Number,
            default: 0 
        },
        money: {
            type: Number,
            default:0
        },
        number:null,
        content:null,
        adv_id:null,
        steps: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            ruleIdx:0,
            palyIdx:null,
            visible:false,
            is_play:false,
            labelOption:[i18n.t('home_116'),i18n.t('home_117')]
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
            let list = this.$refs.tips_scroll;
            if (list) {
                list.addEventListener("touchmove",e => e.stopPropagation(),false)
            }
        })
    },
    methods: {
        changeLabel(idx){
            this.ruleIdx = idx;
        },
        closeBtn(){
            document.getElementById("app").removeChild(this.$el);
            window.localStorage.setItem('is_play',true)
            this.visible=false;
        },
        async closeAdvBtn(){
            await dousermessagel({id:this.adv_id});
            document.getElementById("app").removeChild(this.$el);
            window.localStorage.setItem('is_play',true)
            this.visible=false;
        },
        palySource(){
            this.$refs.myVideo.play();
            this.is_play=true;
        },
        restLanuage(val,num){
            if(num){
                return i18n.t(val,{value:num})
            }else{
                return i18n.t(val)
            }
        },
        jumpLogin(){
            if(!getToken()){
                this.visible=false;
                this.moveNews.$emit('login-cover',"hello");
            }
        },
        kenwBtn(val){
            document.getElementById("app").removeChild(this.$el);
            window.localStorage.setItem(`step_0${val}`,true)
            this.visible=false;
        },
        palyVideo(idx){
            let allVideo = document.querySelectorAll(".myVideo");
            for (let k = 0; k < allVideo.length; k++) {
                allVideo[k].pause();
                if(idx === k){
                    this.palyIdx = k;
                    allVideo[k].play();
                }
            }
        //   this.$refs.myVideo[k].play();
        },
        copySuccess() {
            this.$toast(`${i18n.t("other_044")}`);
        }
    }
    // beforeDestroy(){
    //     window.removeEventListener('play');
    //     indow.removeEventListener('pause');
    // }
};
</script>
<style lang="scss">
    .adv_step{
        height: 100%;
        padding: 30px 20px;
        box-sizing: border-box;
        .adv_cover{
            width: 100%;
            flex-shrink: 0;
            overflow-y: auto;
            overflow-x: hidden;
            min-height: 300px;
            max-height: 1200px;
            border-radius: 6px;
            background: #fff;
            padding: 20px 30px;
            box-sizing: border-box;
            h4{
                display: block;
                flex-shrink: 0;
                padding: 10px 0;
                text-align: center;
                margin-bottom: 10px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                box-sizing: border-box;
            }
            .adv_content{
                transition: opacity 0.3s ease, visibility 0s linear 0.3s;
                p{
                    width: 100%;
                    display: flex;
                    margin: 0;
                    flex-shrink: 0;
                    flex-wrap: wrap;
                    img{
                        margin: 0 auto;
                        max-width: 100%;
                    }
                }
            }
            .van-button{
                height: 32px;
                width: max-content;
                flex-shrink: 0;
                border-radius: 5px;
                margin: 20px 0 10px 0;
            }
        }
    }
    
</style>
<style lang="scss" scoped>
.van-overlay{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .overlay_mian{
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
        .rule_model, .rule_model_06{
            width: 100%;
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
                font-weight: bold;
                margin-bottom: 10px;
                color: $home-title-12;
                background: url('../../assets/images/head_icon.png') no-repeat;
                background-size: cover;
            }
            .rule_desc, .tips_rule{
                padding: 10px 12px;
                box-sizing: border-box;
                p{
                    line-height: 14px;
                    color: $home-title-19;
                    // margin-bottom: 12px;
                }
                .big_title{
                    margin: 12px 0;
                }
                .task_list{
                    width: 33.33%;
                    line-height: 1.8;
                }
                .secound_tiitle{
                    color: $home-title-15;
                    p{
                        margin-bottom: 8px;
                    }
                    .video_item{
                        height: 120px;
                        overflow: hidden;
                        border-radius: 10px;
                        position: relative;
                        z-index: 2;
                        border: 1px solid $home-title-17;
                        .video{
                            position: relative;
                            z-index: 1;
                        }
                        .paly_btn{
                            position: absolute;
                            top: 0;
                            left: 0;
                            z-index: 1;
                            background: rgba($color: #fff, $alpha: .5);
                        }
                    }
                    .tips_icon{
                        margin-right: 10px;
                    }
                }
            }
            .tips_rule{
                height: 560px;
                overflow-y: auto;
                .back_color{
                    color: $font-color-black;
                }
            }
            .rule_desc_04{
                p{
                    color: $home-title-15;
                }
            }
            .rule_desc_5{
                color: $home-title-15;
            }
        }
        .rule_model_06{
            position: relative;
            padding-bottom: 0;
            background: $home-title-13;
            .rule_model_hide{
                height: 100%;
                overflow: hidden;
                border-radius: 30px;
                background: $font-color-white;
                .rule_model_box{
                    max-height: 500px;
                    overflow-y: scroll;
                    -webkit-overflow-scrolling: touch;
                    .rule_outside{
                        // overflow-y: auto;
                        border-radius: 26px;
                        background: $font-color-white;
                        .top_header{
                            width: 257px;
                            height: 34px;
                            font-weight: bold;
                            margin-bottom: 10px;
                            color: $home-title-12;
                            background: url('../../assets/images/max_head_icon.png') no-repeat;
                            background-size: cover;
                        }
                        .rule_desc_1{
                            padding: 10px 12px;
                            box-sizing: border-box;
                            border-bottom-left-radius: 27px;
                            border-bottom-right-radius: 27px;
                            .secound_tiitle{
                                p{
                                    color: $home-title-15;
                                    margin-bottom: 24px;
                                }
                            }
                        }
                    }
                }
                .switch_label{
                    width: 210px;
                    height: 36px;
                    margin: 0 auto;
                    margin-top: 20px;
                    border-radius: 100px;
                    background: $home-title-16;
                    span{
                        flex: 1;
                        color: $font-color-black;
                    }
                    .label_active{
                        height: 100%;
                        transition: all .6s;
                        border-radius: 100px;
                        background: $color-theme;
                        color: $font-color-white;
                    }
                }
            }
        }
    }
    .steps_main, .group_steps{
        position: relative;
        .bg_step{
            height: 190px;
            flex-shrink: 0;
            position: relative;
            background: url('../../assets/images/steps_01.png') no-repeat;
            background-size: 100% 100%;
            .step_text{
                width: 280px;
                height: 102px;
                padding: 23px 0 0 30px;
                box-sizing: border-box;
                position: absolute;
                right: 12px;
                bottom: 4px;
                border-radius: 10px;
                p{
                    color: $home-title-06;
                    margin-bottom: 18px;
                }
                span{
                    font-style: italic;
                    font-weight: bold;
                    color: $home-title-12;
                }
                .van-button{
                    width: 80px;
                    height: 24px;
                    border-radius: 100px;
                    border-color: $color-theme;
                    background-color: $color-theme;
                    .van-button__text{
                        font-size: 13px;
                        font-weight: initial;
                        color: $font-color-white;
                    }
                }
            }
        }
        .task_rule{
            position: absolute;
            left: 0;
            bottom: 0;
            padding: 20px 20px 0 20px;
            box-sizing: border-box;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
            background: $font-color-white;
            animation: slide-up .5s ease-in-out forwards;
            .close_icon{
                height: 24px;
                position: absolute;
                top: -30px;
                right: 0;
            }
            div{
                color: $home-title-12;
                margin-bottom: 20px;
            }
            .first_color{
                color: $color-theme;
            }
        }
        @keyframes slide-up {
            from {
                transform: translateY(200px);
            }
            to {
                transform: translateY(0);
            }
        }
    }
    .group_steps{
        .bg_step{
            height: 190px;
            flex-shrink: 0;
            margin-top:146px;
            position: relative;
            background: url('../../assets/images/steps_02.png') no-repeat;
            background-size: 100% 100%;
            .step_text{
                padding: 10px 22px 0 45px;
                box-sizing: border-box;
                position: absolute;
                right: 25px;
                bottom: 8px;
                // background: rgba($color: red, $alpha: .7);
                p{
                    margin-bottom: 0px;
                }
                .van-button{
                   position: absolute;
                   right: 15px;
                   bottom: 12px;
                }
            }
        }
    }
    .task_steps{
        .bg_step{
            margin-top:95px;
        }
    }
    .qr_steps{
       .bg_step{
            margin-top:225px;
        } 
    }
}
.mian_padding{
    padding: 0 20px;
    box-sizing: border-box;
}
.copay_code {
    width: max-content;
    flex-shrink: 0;
    padding: 0 20px;
    margin-top: 10px;
    margin: 10px;
    line-height: initial;
    color: $font-color-white;
    background: $color-theme;
}
</style>