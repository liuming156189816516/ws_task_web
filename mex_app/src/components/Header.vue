<template>
    <div :class="['header-box w_f',!brColor?'hide_br':'',bgColor?'headerBg':'', isPcH?'isPcH': '']">
        <div class="header w_f flex-item flex-align flex-center font_32">
            <div class="lable_left" @click="onClickLeft">
                <img v-show="showBack" src="@/assets/images/bank_icon.png" alt="" srcset="">
            </div>
            <div class="lable_center flex-item flex-center font_36" v-show="showTitle">{{title}}</div>
            <div class="lable_right flex-item" @click="showRule">
                <img v-show="rightIcon" src="../assets/images/qiandao.png" alt="" srcset="">
                <!-- <span v-show="rightIcon">{{ $t('other_051') }}</span> -->
            </div>
        </div>
    </div>
</template>
<script>
import { getToken } from '@/utils/tool';
import WebsiteSetting from "../mixin/websiteSetting";
export default {
    mixins: [WebsiteSetting],
    props: {
        jumpType: {
            type: String,
            default: ""
        },
        showBack: {
            type: Boolean,
            default: true
        },
        title: {
            default: "",
            required: true
        },
        showBarPlace: {
            default: true
        },
        showTitle: {
            default: true
        },
        showIcon: {
            default: false
        },
        read: {
            default: false
        },
        rightIcon: {
            default: false
        },
        bgColor: {
            default: false
        },
        brColor: {
            default: false
        },
        prevent: Boolean
    },
    data() {
        return {
            wk_name:'',
            isPcH: !window.navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            )
        };
    },
    methods: {
        onClickLeft() {
            if (this.$props.prevent) {
                this.$emit("return");
            } else {
                this.$router.go(-1);
            }
        },
        onClickRight() {
            this.$emit("read_all");
        },
        showRule(){
            // if(!getToken()){
            //     this.$store.dispatch('User/actionReport',5)
            // }else{
            //     this.$store.dispatch('User/actionReport',6)
            // }
            // this.$store.dispatch('User/actionReport',4)
            // this.$popDialog({ content: this.help_url, title: this.$t("other_051"), type: 3 })
        }
    },
    created() {
        this.wk_name=process.env.VUE_APP_NAME
    }
};
</script>
<style lang="scss" scoped>
.header-box {
    display:flex;
    height: 88px;
    position: relative;
    align-items: center;
    background: transparent;
    // border-bottom: 1px solid #D8D8D8;
    .header {
        height: 100%;
        padding: 0 30px;
        box-sizing: border-box;
        color: $font-color-white;
        .lable_left, .lable_right{
            flex-grow: 1;
            flex-shrink: 0;
            font-weight: bold;
        }
        .lable_left {
            img{
                height: 27px;
            }
        }
        .lable_center {
            flex-grow: 4;
            flex-shrink: 0;
            font-style: italic;
            font-weight: bold;
        }
        .lable_right {
            font-style: italic;
            justify-content: right;
            img{
                height: 42px;
            }
        }
    }
    ::v-deep{
        .van-icon-arrow-left{
                color:#000;
        }
    }
}
.headerBg {
    background-color: $color-theme;
    .header {
        color: #ffffff;
    }
    .read_all {
        color: #ffffff;
    }
}
.isPcH{
    max-width: 1000px;
    left: 50% !important;
    transform: translateX(-50%);
}
.hide_br{
    border: none !important;
    .title{
        color: $font-color-white !important;
    }
}
</style>
