<template>
    <div class="buy-footer font_30">
        <span :class="isCanPrev() ? '':'footer-disabled'" @click="isCanPrev() && toPrev()">{{$t("other_019")}}</span>
        <em class="total_page flex-item flex-center">{{ page }}/{{ totalPage }}</em>
        <span :class="isCanNext() ? '':'footer-disabled'"  @click="isCanNext() && toNext()">{{$t("other_020")}}</span>
    </div>
</template>

<script>
export default {
    name: "PrevNext",
    props: {
        total: {
            type: Number,
            default: 0
        },
        limit: {
            type: Number,
            default: 115
        },
        page: {
            type: Number,
            default: 1
        },
        count: {
            type: Number,
            default: 1
        },
        len: {
            type: Number,
            default: 0
        }
    },
    computed:{
        totalPage(){
          return  Math.ceil(this.total/this.limit);  
        }
    },
    methods: {
        showFooter() {
            return this.isCanPrev() || this.isCanNext();
        },
        isCanPrev() {
            return this.page > 1;
        },
        isCanNext() {
            return (this.page - 1) * this.limit + this.len < this.total;
        },
        toPrev() {
            this.$emit("to-prev");
        },
        toNext() {
            this.$emit("to-next");
        }
    },
    created() {},
    mounted() {}
};
</script>

<style scoped lang="scss">
.buy-footer {
    display: flex;
    padding: 20px 0;
    align-items: center;
    justify-content: center;
    background-color: $font-color-white;
    // background-color: seagreen;
    .total_page{
        min-width: 100px;
    }
    & > span {
        font-size: 20px;
        color: #fff;
        height: 46px;
        padding: 0 20px;
        line-height: 46px;
        text-align: center;
        border-radius: 23px;
        background-color: $color-theme;
    }
}
.footer-disabled {
    background-color: #D2D2D2 !important;
}
</style>
