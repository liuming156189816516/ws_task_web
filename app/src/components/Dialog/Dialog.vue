<template>
    <van-overlay :show="visible">
        <div class="overlay-mian" @click.stop>
            <div class="header_title">
                {{ title }}
                <van-icon class="close_btn" name="cross" @click="closeBtn" />
            </div>
            <div class="video_tips" v-if="type==1">
                <video ref="myVideo" poster="@/assets/images/home/cover_img.jpg" controls :src="content"></video>
            </div>
            <div class="contnet_mian" v-if="type==2">
                <div v-html="content"></div>
                <!-- <div class="bank_btn">
                    <van-button type="primary" @click="$router.push('/home')">确定</van-button>
                </div> -->
            </div>
        </div>
    </van-overlay>
</template>
<script>
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
            video.addEventListener('play', (e)=> {
                this.is_play=true;
            })
            video.addEventListener('pause',(e)=> {
                this.is_play=false;
            })
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
        overflow: hidden;
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