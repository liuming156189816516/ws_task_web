<template>
    <div class="title">
        <page-header :title="$route.meta.title" :show-icon="true" :bgColor="true" />
        <div class="detail">
            <div class="d_header">
                <div class="tit">{{cnt.title}}</div>
                <div class="date">{{cnt.time}}</div>
            </div>
            <div class="cnt" v-if="cnt.type == 0">
                <div v-html="cnt.text" class="innerTxt" v-if="cnt.type == 0"></div>
            </div>
            <div class="cnt" v-if="cnt.type == 1">
                <div v-if="cnt.url == ''" v-html="cnt.text" class="innerTxt"></div>
                <img v-else :src="cnt.url" alt="">
            </div>
        </div>
    </div>
</template>
<script>
import PageHeader from "../../components/Header";
export default {
    components: { PageHeader },
    data() {
        return {
            title: "",
            cnt: {
                type:0,
                title: "hello", //客服和公告的标题、
                time:"2024-09-10 11:08:29",
                text: "习近平在全国教育大会上发表重要讲话 代表党中央向全国广大教师和教育工作者致以节日祝贺和诚挚问候",
            }
        };
    },
    created() {
        // this.cnt = this.$route.params.data;
        // console.log(this.$route.meta.title);
        
    },
    methods: {}
};
</script>
<style lang="scss" scoped>
.title{
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
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
        padding-bottom: 30px;
        flex: 1;
        overflow: auto;
        .innerTxt {
            margin-top: 20px;
            padding-bottom: 30px;
            word-wrap: break-word;
        }
        img{
            display: table;
            width: 6.2rem;
            height: 7rem;
            margin: 0 auto;
            margin-top: 20px;
        }
    }
}
</style>
