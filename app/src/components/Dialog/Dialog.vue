<template>
    <van-overlay :show="visible">
        <div class="overlay-mian" @click.stop>
            <div class="header_title">
                {{ title }}
                <van-icon class="close_btn" name="cross" @click="closeBtn" />
            </div>
            <div class="video_tips">
                <video metadata controls src="https://wstask.s3.ap-southeast-1.amazonaws.com/help_url.mp4" type="video/mp4" />
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
            qqCode:"",
            wechatCode:"",
            visible:false,
            adverImg:[]
        };
    },
    mounted() {
    },
    methods: {
        closeBtn(){
            document.getElementById("app").removeChild(this.$el);
            this.visible=false;
        }
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
            padding-bottom: 20px;
            background: $font-color-white;
            video{
                width: 100%;
                max-height: 100%;
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