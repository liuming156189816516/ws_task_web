<template>
    <van-overlay :show="visible">
        <div class="overlay-mian" @click.stop>
            <div class="header_title">
                {{ title }}
                <van-icon class="close_btn" name="cross" @click="closeBtn" />
            </div>
            <div class="video_tips">
                <div class="vide-cover" v-if="!is_play">
                    <img class="def_img" src= "../../assets/images/home/cover_img.jpg">
                    <img class="play_btn" src="../../assets/images/home/bofang.png" @click="palySource">
                </div>
                <video ref="myVideo" controls :src="content" type="video/mp4" />
            </div>
        </div>
    </van-overlay>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: "" //默认高度
        },
        type:{
            type: String,
            default: "" 
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
        let video = this.$refs.myVideo;
        video.addEventListener('play', (e)=> {
            this.is_play=true;
        })
        video.addEventListener('pause',(e)=> {
            this.is_play=false;
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
        }
    },
    beforeDestroy(){
        window.removeEventListener('play');
        indow.removeEventListener('pause');
    }
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
            height: 44px;
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
            padding-bottom: 20px;
            background: $font-color-white;
            video{
                width: 100%;
                min-height: 100%;
                max-height: 100%;
            }
            .vide-cover{
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 9;
                background: $font-color-black;
                .def_img{
                    width: 100%;
                    height: 100%;
                    margin-top: 5px;
                }
                .play_btn{
                    height: 48px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
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