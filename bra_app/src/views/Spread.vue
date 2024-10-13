<template>
    <div class="spread_warp" ref="warpBox" @scroll="handleScrolStop">
        <page-header :title="$t('home_045')" :noBg="false" :bgColor="false" :showBack="false" />
        <div class="video_box flex-item flex-item flex-align flex-center mg_24">
            <video class="myVideo" ref="myVideo" controls="controls" style="width:100%;height:140px;" src="https://rw-bx.s3.sa-east-1.amazonaws.com/6.mp4" />
            <!-- <div v-if="palyIdx!=1" class="paly_btn w_f h_f flex-item flex-align flex-center" @click="palyVideo(1)">
                <img src="@/assets/images/serveic/play_icon.png" alt="">
            </div> -->
        </div>
        <!-- <div class="share_main w_f">
            <div class="cover_img flex-item">
                <img class="mask_img" src="@/assets/images/mill/bg_02.png" alt="" srcset="">
                <div class="spred_mess w_f">
                    <div class="top_title w_f font_32 flex-item flex-align flex-center">{{$t('spre_004')}}</div>
                </div>
            </div>
        </div> -->
        <div class="spred_m w_f">
            <div class="spred_l">
                <p class="top_title flex-item flex-align flex-center font_36">{{$t('spre_004')}}</p>
                <div class="w_f flex-item flex-dir-c">
                    <div class="copay_desc flex-item flex-align flex-between">
                        <span class="left_desc flex-item font_28">{{$t('spre_006')}}</span>
                        <van-button id="step_01" class="font_20" type="primary" v-clipboard:copy="invit_link+'?inviteCode='+userInfo.inviteCode+'#/home'" v-clipboard:success="copySuccess">{{$t('other_006')}}</van-button>
                    </div>
                    <div class="copay_text flex-item font_28">{{ invit_link+'?r='+userInfo.inviteCode+'#/home' }}</div>
                </div>
                <div class="invit_code w_f flex-item flex-dir-c">
                    <div class="copay_desc flex-item flex-align flex-between">
                        <span class="left_desc flex-item font_28">{{$t('spre_007')}}</span>
                        <van-button class="font_20" type="primary" v-clipboard:copy="userInfo.inviteCode" v-clipboard:success="copCodeSuccess">{{$t('other_006')}}</van-button>
                    </div>
                    <div class="copay_text flex-item font_28">{{ userInfo.inviteCode }}</div>
                </div>
                <div id="step_02">
                    <div class="w_f flex-item">
                        <div class="invit_code w_f flex-item flex-dir-c">
                            <div class="copay_desc flex-item flex-align flex-center">
                                <span class="left_desc flex-item font_28">{{$t('spre_019')}}</span>
                            </div>
                            <div class="copay_text flex-item flex-center font_28">{{team_size}}</div>
                        </div>
                        <div class="invit_code w_f flex-item flex-dir-c">
                            <div class="copay_desc flex-item flex-align flex-center flex-between">
                                <span class="left_desc flex-item font_28">{{$t('spre_020')}}</span>
                            </div>
                            <div class="copay_text flex-item flex-center font_28">{{today_rebate}}</div>
                        </div>
                    </div>

                    <div class="flex-item flex-align">
                        <div class="invit_code w_f flex-item flex-dir-c">
                            <div class="copay_desc flex-item flex-align flex-center">
                                <span class="left_desc flex-item font_24">{{$t('spre_021')}}</span>
                            </div>
                            <div class="copay_text flex-item flex-center font_28">{{yesterday_rebate}}</div>
                        </div>
                        <div class="invit_code w_f flex-item flex-dir-c">
                            <div class="copay_desc flex-item flex-align flex-center">
                                <span class="left_desc flex-item font_24">{{$t('spre_022')}}</span>
                            </div>
                            <div class="copay_text flex-item flex-center font_28">{{total_rebate}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="share_continer w_f flex-item flex-dir-c">
            <div class="record_legend w_f flex-item flex-dir-c">
                <h3 class="font_28">{{$t('spre_009')}}</h3>
                <div class="record_derc font_22">{{$t('spre_010')}} <span class="focus_tips" @click="$Helper.globalSupport()">{{$t('spre_011')}}</span></div>
            </div>
        </div>
        <vue-intro-step v-model="showStep" :config="config" ref="myIntroStep">
            <template #prev="{tipItem, index}">
                <button @click="prev(tipItem, index)" class="step_prev">{{$t('home_160')}}</button>
            </template>
            <template #next="{tipItem}">
                <button @click="next(tipItem)" class="next_step">{{$t('home_161')}}</button>
            </template>
            <template #skip>
                <button @click="skip" class="skip_step">{{$t('home_162')}}</button>
            </template>
            <template #done>
                <button @click="done" class="next_step">{{$t('home_162')}}</button>
            </template>
        </vue-intro-step>
    </div>
</template>
<script>
import { mapState } from "vuex";
import { formatTime } from "@/utils/tool";
import { getinvitelink} from '@/api/bill';
import PageHeader from "@/components/Header";
import { getteammatesinfo } from '@/api/home';
export default {
    components: { PageHeader },
    data() {
        return {
            page:1,
            limit:20,
            wk_name:'',
            iframeSrc:'',
            allIncome:"",
            team_size:"",
            today_rebate:0,
            total_rebate:0,
            yesterday_rebate:0,
            isScroll:true,
            loading:false,
            finished:false,
            showStep:false,
            page_total:0,
            millionList:[],
            config: {
                backgroundOpacity: 0.7,
                titleStyle: {
                    textAlign: 'center',
                    fontSize: '16px',
                    marginBottom: '0',
                },
                contentStyle: {
                    textAlign: 'center',
                    fontSize: '13px',
                },
                tips: [
                    {
                        el: '#step_01',
                        tipPosition: 'bottom',
                        title: this.$t('home_150'),
                        content: this.$t('home_166'),
                        onNext: () => {
                            return new Promise((resolve) => {
                                resolve(true);
                            })
                        }
                    },
                    {
                        el: '#step_02',
                        tipPosition: 'bottom',
                        title: this.$t('home_151'),
                        content: this.$t('home_167'),
                        onNext: () => {
                            return new Promise((resolve) => {
                                resolve(true);
                            })
                        }
                    }
                ]
            },
            invit_link:"https://www.bbzvip.com",
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.User,
        }),
        winNotis(){
            return this.$Helper.randomStrings(100)
        },
        stepOptopn(){
            return [
                {
                    text:this.$t('spre_015'),
                    img:"s_01",
                    icon:"img_001"
                },
                {
                    text:this.$t('spre_016'),
                    img:"s_02",
                    icon:"img_002"
                },
                {
                    text:this.$t('spre_017'),
                    img:"s_03",
                    icon:"img_003"
                },
                {
                    text:this.$t('spre_018'),
                    img:"s_04",
                    icon:"img_004"
                }
            ]
        }
    },
    created() {
        this.isScroll = false;
        // this.syncInitApi();
        this.getIncomeList();
    },
    mounted(){
        this.$nextTick(()=>{
            const isTips = JSON.parse(localStorage.getItem('step_04'));
            if(!isTips){
                this.showStep=true;
            }
        })
    },
    methods:{
        done(){
            localStorage.setItem('step_04',true);
            this.showStep = false;
        },
        skip(){
            this.$refs.myIntroStep.next()
        },
        next(){
            this.$refs.myIntroStep.next()
        },
        prev(){
            this.$refs.myIntroStep.prev()
        },
        async getIncomeList(){
            let {team_size,today_rebate,yesterday_rebate,total_rebate} = await getteammatesinfo();
            this.team_size = team_size;
            this.today_rebate = today_rebate;
            this.total_rebate = total_rebate;
            this.yesterday_rebate = yesterday_rebate;
        },
        onLoad(){
            if(this.page >= this.page_total){
                this.finished = true;
            }else{
                this.page++;
                this.getIncomeList()
            }
        },
        syncInitApi(){
            let fun1 = new Promise((resolve,reject)=>{
                getinvitelink().then(res =>{
                    resolve(res)
                })
            });
            Promise.all([fun1]).then( res => {
                const [{invite_link}] = res;
                // this.allIncome = income;
                this.invit_link = invite_link;
                // this.$refs.qrcodeImg.textContent="";
                // this.createQrcode(this.invit_link);
            })
        },
        copySuccess(){
            this.$toast(`${this.$t("other_044")}`);
            // this.$store.dispatch('User/actionReport',14);
        },
        copCodeSuccess(){
            this.$toast(`${this.$t("other_044")}`);
            // this.$store.dispatch('User/actionReport',15);
        },
        formatTime(time) {
            return formatTime(time);
        },
        handleScrolStop(){
            let scrollTop = this.$refs.warpBox;
            if(scrollTop.scrollTop >= 200){
                this.isScroll = true;
            }else{
                this.isScroll = false;
            }
        },
        scrollTopBtn(){
            this.isScroll = false;
            let scrollTop = this.$refs.warpBox;
            scrollTop.scrollTo({top: 0,behavior:"smooth"});
        }
    }
}
</script>
<style lang="scss" scoped>
    .spread_warp {
        width: 100%;
        position: relative;
        overflow-y: auto;
        padding-bottom: 95px;
        background: linear-gradient(180deg, #31acf2 1.61%, rgba(255, 255, 255, 0.5) 100%);
        // background: url('../assets/images/home/bg_img.png') no-repeat;
        // background-size: cover;
        -webkit-overflow-scrolling: touch;
        .share_main, .share_continer{
            height: 613px;
            margin-top: 20px;
            position: relative;
            // background: url('../assets/images/mill/bg_01.png') no-repeat;
            // background-size: 100% 100%;
            .share_rule{
                color: $font-color-white;
                position: absolute;
                top: -10px;
                right: 0;
                z-index: 9;
                padding: 11px 14px;
                border-top-left-radius: 200px;
                border-bottom-left-radius: 200px;
                background: rgba($color: #000000, $alpha: .5);
                img{
                    height: 40px;
                    margin-right: 4px;
                }
            }
            .cover_img{
                position: relative;
                padding: 0 20px;
                margin-bottom: 30px;
                box-sizing: border-box;
                z-index: 1;
                .mask_img{
                    height: 540px;
                    margin-top: 168px;
                }
                .spred_mess{
                    // height: 200px;
                    position: absolute;
                    top: 179px;
                    left: 0;
                    padding: 0 20px;
                    box-sizing: border-box;
                    // background: rgba($color: #000000, $alpha: 0.5);
                }
            }
            .record_legend{
                padding: 0 30px;
                h3{
                    margin: 20px 0;
                }
                .record_derc{
                    padding: 12.2px 0 12.2px 18.82px;
                    border-radius: 20px;
                    box-sizing: border-box;
                    line-height: 34px;
                    font-style: italic;
                    color: $home-title-19;
                    background: $font-color-white;
                    .focus_tips{
                        text-decoration: underline;
                        color: $home-title-02;
                    }
                }
            }
            .record_list{
                padding: 0 30px;
                margin-top: 20px;
                box-sizing: border-box;
                color: $font-color-black;
                .title_top{
                    height: 100px;
                    padding: 0 40px;
                    flex-shrink: 0;
                    box-sizing: border-box;
                    background: $home-title-10;
                }
                .task_title_head {
                    border-top-left-radius: 20px;
                    border-top-right-radius: 20px;
                }
                .record_scroll{
                    max-height: 1100px;
                    overflow-y: auto;
                    background: $font-color-white;
                }
                .top_title_1{
                    font-weight: bold;
                }
                // .title_top:nth-child(1){
                //     border-top-left-radius: 20px;
                //     border-top-right-radius: 20px;
                // }
                .record_item{
                    height: 108px;
                    background: $font-color-white;
                    border-bottom: 1px solid $home-title-10;
                }
                .record_item:last-child{
                    border-bottom: 1px solid transparent;
                }
                .record_cash{
                    font-weight: bold;
                }
                .empty_box{
                    height: 364px;
                    color: $home-title-14;
                    background-color: $font-color-white;
                    img{
                        height: 202px;
                    }
                }
                .footer_tips{
                    padding: 16px 0 16px 20px;
                    box-sizing: border-box;
                    color: $home-title-06;
                    font-style: italic;
                    border-bottom-left-radius: 20px;
                    border-bottom-right-radius: 20px;
                }
            }
        }
        .spred_m{
            padding: 0 30px;
            margin-top: 40px;
            box-sizing: border-box;
            .spred_l{
                overflow: hidden;
                padding: 10px 20px;
                border-radius: 20px;
                box-sizing: border-box;
                background: $font-color-white;
                .top_title{
                    height:66px;
                    font-weight: bold;
                    color: $font-color-black;
                    text-shadow: 4px 4px 0px #00000040;
                }
            }
            p{
                overflow: hidden;
                white-space: nowrap;
                font-weight: bold;
                text-overflow: ellipsis;
            }
            .copay_desc{
                height: 32px;
                margin-top: 18px;
                .left_desc{
                    font-weight: bold;
                }
                .van-button{
                    height: 22px;
                    padding: 0 8px;
                    border-radius: 100px;
                    border-color: $color-theme;
                    background-color: $color-theme;
                }
            }
            .copay_text{
                margin-top: 18px;
                color: $home-title-06;
            }
            .invit_code{
                margin-top: 16px;
                border-top: 1px solid $home-title-07;
            }
        }
        .share_continer{
            height: auto;
            // padding-top: 20px;
            margin-top: 0px;
            padding-bottom: 20px;
            // background: $home-title-20;
            // background: linear-gradient(to top, #ffff 0%, #008751 100%);
        }
    }
</style>
