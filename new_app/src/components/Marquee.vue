<template>
    <div ref="wrap notic_template" class="wrap notice_temp" >
        <van-notice-bar :scrollable = isScroll :class="from == true ? 'notice_first' : 'notice_second'" color="#333">
            <!-- <template v-slot:left-icon>
                <i class='laba'></i>
            </template> -->
            <van-swipe vertical style="height: 24px;" :autoplay="3000" :show-indicators="false"  >
                <van-swipe-item v-for="(item,idx) in list" :key="idx">{{ item }}</van-swipe-item>
            </van-swipe>
        </van-notice-bar>
    </div>
</template>
<script>
export default {
    props: {
        list: {
            type: String,
            default: ""
        },
        speed: {
            type: Number,
            default: 100
        },
        from: {
            type: Boolean,
            default: false
        },
        isScroll: {
            type: Boolean,
            default: false
        }
    },
    mounted() {},
    data() {
        return {
            // icon_url:"../assets/images/home/icon_laba.png"
        };
    },
    methods: {
    }
};
</script>
<style lang="scss" scoped>
.wrap {
    width: 100%;
    // float: left;
}
.notice_first, .notice_second{
    height: 48px;
    font-size: 28px;
    line-height: 48px;
    background-color: transparent;
}
// .van-notice-bar{
//     padding: 0;
//     width: 260px;
//     background: sandybrown;
// }

::v-deep{
    .laba{
        // background: url('../assets/images/zdq/laba@2x.png') center center no-repeat;
        display:inline-block;width: 28px;height: 34px;background-size: contain;margin-right:20px;
    }
}

</style>