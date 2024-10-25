<template>
    <div class="title">
        <page-header :title="$t('home_138')" :show-icon="true" :bgColor="true" />
        <div class="detail">
            <div class="d_header">
                <div class="tit">{{ n_detail.name }}</div>
                <div class="date">{{ formatTime(n_detail.itime) }}</div>
            </div>
            <div class="cnt" v-html="n_detail.content"></div>
            <!-- <div class="cnt" v-if="cnt.type == 1">
                <div v-if="cnt.url == ''" v-html="cnt.text" class="innerTxt"></div>
                <img v-else :src="cnt.url" alt="">
            </div> -->
        </div>
    </div>
</template>
<script>
import { formatTime } from "@/utils/tool";
import { getmessagelbyid } from '@/api/home'
import PageHeader from "@/components/Header";
export default {
    components: { PageHeader },
    data() {
        return {
            n_id: "",
            n_detail:""
        };
    },
    created() {
        this.n_id = this.$route.query._id;
        this.getNoticeList();
    },
     methods: {
        getNoticeList() {
            getmessagelbyid({id:this.n_id}).then(res => {
                this.n_detail = res;
            })
        },
        formatTime(time) {
            return formatTime(time,1);
        }
    }
};
</script>
<style lang="scss" scoped>
.detail {
    flex: 1;
    overflow: hidden;
    padding: 20px 46px;
    border-top: 1px solid #e6e6e6;
    display: flex;
    flex-direction: column;
    .d_header {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: space-between;
        .tit {
            font-size: 32px;
            font-weight: 700;
            color: rgba(51, 51, 51, 1);
            line-height: 1.8;
            flex-basis: 60%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .date {
            flex-basis: 40%;
            font-weight: 400;
            font-size: 26px;
            color: #999999;
            line-height: 1.6;
            text-align: right;
        }
    }
    .cnt {
        font-weight: 400;
        font-size: 28px;
        color: #000000;
        line-height: 1.6;
        margin-top: 30px;
    }
}
</style>
