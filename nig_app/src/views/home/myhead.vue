<template>
    <div class="my_head">
        <page-header :title="$t('mine_006')"></page-header>
        <div class="image_list flex-item w_f">
            <div class="image_box flex-item" v-for="(item,idx) in userHeadList" :key="idx" @click="updateCheckImage(idx)">
                <van-image fit="contain" :src="item" />
            </div>
        </div>
        <van-dialog
            v-model="show"
            title
            show-cancel-button
            class="image_dialog"
            @confirm="ok"
            @cancel="cancel"
            :cancel-button-text="$t('other_007')"
            :confirm-button-text="$t('other_003')"
            close-on-click-overlay
            close-on-popstate
        >
            <img :src="userHeadList[checkIndex]" class="check_image" />
            <div class="check_tip">{{$t("other_042")}}</div>
        </van-dialog>
    </div>
</template>
<script>
import PageHeader from "@/components/Header";
import { revisehead } from '@/api/login'
export default {
    components: { PageHeader },
    data() {
        return {
            checkIndex: 0,
            checkSrc: "",
            show: false,
            selectedItem: {}, //弹窗公告原生
            unread: 0
        };
    },
    computed: {
        userHeadList() {
            return this.$store.state.User.userHeadList;
        }
    },
    created() {},
    methods: {
        updateCheckImage(idx) {
            this.checkIndex = idx;
            this.show = true;
        },
        ok() {
            let toast;
            let Toast = setTimeout(() => {
                toast = this.$toast.loading({ duration: 3000 });
            }, 1000);
            revisehead({head:`${this.checkIndex+1}`}).then(res => {
                if (Toast) {
                    clearTimeout(Toast);
                    Toast = null;
                }
                if (toast) {
                    toast.clear();
                }
                this.$router.go(-1);
            });
        },
        cancel() {
            this.show = false;
        }
    }
};
</script>
<style lang="scss" scoped>
.my_head {
    height: 100%;
    background: $color-minebg;
    .image_list {
        gap: 10px;
        flex-wrap: wrap;
        padding-bottom: 20px;
        .image_box {
            width: calc((100% - 30px) / 4);
            padding: 20px;
            border-radius: 6px;
            box-sizing: border-box;
            background: rgba($color: $home-title-04, $alpha: .5);
        }
    }
    .image_dialog {
        padding-top: 50px;
        text-align: center;
        .check_image {
            width: 30%;
            text-align: center;
        }
        .check_tip {
            color: #999;
            font-size: 20px;
            padding-top: 50px;
            padding-bottom: 20px;
        }
    }
}
</style>
<style lang="scss">
    .image_dialog{
        .van-dialog__confirm, .van-dialog__confirm:active{
            color: $color-theme;
            // border-color: $color-theme;
            // background-color: $color-theme;
        }
    }
</style>
