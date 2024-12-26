<template>
    <div class="detailDetail">
        <page-header :title="$t('home_138')" :show-icon="true" :bgColor="true"></page-header>
        <!-- <div class="tab_bar">
            <van-tabs :active="curIndex" @change="changeTab">
                <van-tab :title="item.title" v-for="(item,index) in noticArry" :key="index"></van-tab>
            </van-tabs>
        </div> -->
        <div class="msg-main">
            <div class="empty_tips flex-item flex-align" v-if="loading">
                <van-loading size="24px">{{ $t('other_029') }}</van-loading>
            </div>
            <template>
                <div class="item-box" v-if="noticeList&&noticeList.length>0">
                    <div v-for="(item,index) in noticeList" :key="index" class="item-wrap"  @click="jumpDetail(item,tab_active)">
                        <div class="left">
                            <img src="../../assets/images/xiaoxi.png" alt />
                            <span class="redIcon" v-if="!item.status"></span>
                        </div>
                        <div class="right">
                            <div class="adver_content">
                                <h4 class="adver_title">{{item.name}}</h4>
                                <span class="adver_time">{{ formatTime(item.itime) }}</span>
                            </div>
                            <div class="adver_descr" v-html="item.content"></div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <van-empty :description="$t('tail_010')" />
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import { Toast } from 'vant';
import { formatTime } from "@/utils/tool";
import PageHeader from "@/components/Header";
import { getmessagellist,dousermessagel } from '@/api/home'
export default {
    components: { PageHeader },
    data() {
        return {
            curIndex:0,
            noticeList: [],
            tab_active: 0,
            loading: false,
            finished: false,
            num1: 0,
            num2: 0,
            noticArry:["news_002","news_003"],
        }
    },
    computed:{
        
    },
    created() {
        this.getNoticeList();
    },
    methods: {
        getNoticeList() {
            this.loading = true;
            getmessagellist().then(res => {
                setTimeout(()=>{this.loading=false},100)
                this.noticeList = res.list||[];
            })
        },
        formatTime(time) {
            return formatTime(time,1);
        },
        // 信息类型切换
        changeTab(idx){
            this.curIndex = idx;
            this.noticeList = [];
            this.getNoticeList();
        },
        tab_switch(tab) {
            this.tab_active = tab;
            this.onLoad();
        },
        async jumpDetail(item) {
            item.type = this.curIndex == 0 ? 1:0;
            let params = { type: item.type, id: item.id, ptype: 0 };
            if(item.status){

            }
            !item.status?await dousermessagel({id:item.id}):"";
            this.$router.push({path:'/msgDetail',query:{ _id:item.id}});
        },
        read_all() {
            let params = {
                type: this.tab_active,
                id: "",
                ptype: 1
            };
            readmsg(params).then(res => {
                this.$toast(this.$t("other_006"));
                this.getNoticeList();
            }).catch(e => {
                this.$toast(this.$t("other_007"));
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.detailDetail {
    padding: 0;
    height: 100vh;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    background-color: #f2f2f2;
    .msg-main {
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    .item-box {
        padding: 20px 30px;
        box-sizing: border-box;
        .item-wrap {
            padding: 37px 23px;
            border-radius: 24px;
            background-color: #ffffff;
            // border-radius: 20px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            box-shadow: 0.06rem 0.06rem 0.1rem #e0e0e0;
            .left {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(121.09deg, #006CEB 14.23%, #78B6FF 86.54%);
                img {
                    width: 40px;
                    height: 40px;
                }
                .redIcon {
                    width: 20px;
                    height: 20px;
                    background: red;
                    border-radius: 50%;
                    position: absolute;
                    top: -8px;
                    right: -6px;
                }
            }
            .right {
                width: 85%;
                flex-basis: 80%;
                .adver_content {
                    width: 100%;
                    display: flex;
                    font-size: 28px;
                    font-weight: 600;
                    justify-content: space-between;
                    .adver_title{
                        max-width: 230px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .adver_time{
                        font-weight: normal;
                    }
                }
                .adver_descr{
                    width: 100%;
                    height: 80px;
                    margin-top: 6px;
                    color: #8c8c8c;
                    font-size: 28px;
                    overflow: hidden;
                    // filter: blur(10px);
                    /* 应用线性渐变的遮罩 */
                    -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
                    mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
                }
                .adver_img{
                    width: 42px;
                    height: 42px;
                    float: left;
                }
            }
        }
    }
    ::v-deep {
        .van-tag {
            position: absolute;
            top: 2px;
            padding: 0;
            border-radius: 100%;
            text-align: center;
            display: block;
            right: 1.04rem;
            width: 18px;
            line-height: 18px;
            height: 18px;
        }
        .van-tab--active{
            color: #fe8c00 ;
        }
        .van-tabs__line {
            width: 0.8rem !important;
            background-color: #fe8c00 ;
        }
    }
}
</style>
