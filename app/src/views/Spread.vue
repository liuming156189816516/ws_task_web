<template>
    <div class="spread_warp">
        <div class="top_model">
            <div class="user_mess">{{ $t("spre_001") }}</div>
            <div class="cover_model">
                <div class="task_warp">
                    <div class="task_num">
                        <div class="text_1">{{ $t("spre_002") }}</div>
                        <div class="text_2">
                            <img src="../assets/images/gold_icon.png" alt="" srcset="">
                            <span>{{ allIncome.total_amount || 0}}</span>
                        </div>
                    </div>
                    <div class="custom_line">
                        <span class="botton_line" style="background-color: #ececec;"></span>
                    </div>
                    <div class="task-pro">
                        <div class="left-pro">
                            <p>{{ allIncome.today_amount || 0}}</p>
                            <p>{{ $t("spre_003") }}</p>
                        </div>
                        <div class="right-pro">
                            <p>{{ allIncome.yesterday_amount || 0 }}</p>
                            <p>{{ $t("spre_004") }}</p>
                        </div>
                        <div class="right-pro">
                            <p>{{allIncome.team_num || 0}}</p>
                            <p>{{ $t("spre_005") }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="spread_info">
            <div class="info_main">
                <div class="line_item">
                    <div style="display: flex;">
                        <span class="l_label">{{$t('other_005')}}：</span>
                        <span>{{userInfo.inviteCode}}</span>
                    </div>
                    <div class="copay_text" v-clipboard:copy="userInfo.inviteCode" v-clipboard:success="copySuccess">{{ $t('other_006') }}</div>
                </div>
                <div class="line_item">
                    <div style="display: flex;">
                        <span class="l_label"> {{$t('spre_006')}}：</span>
                        <span>{{invit_link}}</span>
                    </div>
                    <div class="copay_text" v-clipboard:copy="invit_link+'?inviteCode='+userInfo.inviteCode+'#/register'" v-clipboard:success="copySuccess">{{ $t('other_006') }}</div>
                </div>
                <div class="invit_code" ref="qrcodeImg">
                    <!-- <img src="../assets/images/home/qrCode.jpg" alt="" srcset=""> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import QRCode from 'qrcodejs2'
import { getinvitelink} from '@/api/bill';
import { getbrokeragestatis} from '@/api/home';
export default {
    data() {
        return {
            wk_name:'',
            iframeSrc:'',
            allIncome:"",
            today_task:"",
            today_invit:"",
            invit_link:"",
            today_incomet:0
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.User,
        })
    },
    created() {
        this.syncInitApi();
    },
    methods:{
        syncInitApi(){
            let fun1 = new Promise((resolve,reject)=>{
                getbrokeragestatis().then(res =>{
                    resolve(res)
                })
            });
            let fun2 = new Promise((resolve,reject)=>{
                getinvitelink().then(res =>{
                    resolve(res)
                })
            });
            Promise.all([fun1,fun2]).then( res => {
                const [income,{invite_link}] = res;
                this.allIncome = income;
                this.invit_link = invite_link;
                this.$refs.qrcodeImg.textContent="";
                this.createQrcode(this.invit_link);
            })
        },
        createQrcode(url){
            new QRCode(this.$refs.qrcodeImg, {
                text: url,
                width: 182,
                height: 182,
                colorDark: "#333333",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.L
            })
        },
        copySuccess(){
            this.$toast(`${this.$t("other_044")}`);
        }
    }
}
</script>

<style lang="scss" scoped>
.spread_warp {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding-bottom: 200px;
    background-color: #f2f2f2;
    .top_model {
        width: 100%;
        height: 380px;
        display: flex;
        padding: 0 30px;
        margin-bottom: 180px;
        position: relative;
        border-bottom-left-radius: 80px;
        border-bottom-right-radius: 80px;
        box-sizing: border-box;
        justify-content: space-between;
        background: $color-theme;

        .user_mess {
            width: 100%;
            display: flex;
            padding: 30px 0;
            font-size: 36px;
            justify-content: center;
            color: $font-color-white;
        }

        .cover_model {
            width: 100%;
            position: absolute;
            top: 120px;
            left: 0;
            padding: 0 20px;
            box-sizing: border-box;

            .task_warp {
                display: flex;
                flex-direction: column;
                padding: 30px 0 40px 0;
                border-radius: 10px;
                background-color: $font-color-white;
                .task_num {
                    width: 100%;
                    display: flex;
                    margin-bottom: 40px;
                    align-items: center;
                    flex-direction: column;

                    .text_1 {
                        font-size: 28px;
                    }

                    .text_2 {
                        display: flex;
                        font-size: 78px;
                        font-weight: bold;
                        align-items: center;
                        margin-top: 30px;

                        img {
                            height: 64px;
                            margin-right: 30px;
                        }
                    }
                }
            }

            .task-pro {
                width: 100%;
                display: flex;
                margin-top: 30px;
                flex-direction: row;

                .left-pro,
                .right-pro {
                    flex: 1;

                    p {
                        width: 100%;
                        display: flex;
                        color: #999999;
                        font-weight: bold;
                        justify-content: center;
                        align-items: center;
                    }
                }

                .left-pro p:nth-child(1),
                .right-pro p:nth-child(1) {
                    color: #000;
                    font-size: 46px;
                }

                .left-pro p:nth-child(2),
                .right-pro p:nth-child(2) {
                    font-size: 24px;
                    margin-top: 12px;
                }
            }
        }
    }
    .spread_info{
        width: 100%;
        overflow-y: auto;
        display: flex;
        padding: 0 20px;
        .info_main{
            width: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
            padding: 0 30px 50px 30px;
            border-radius: 10px;
            box-sizing: border-box;
            background-color: $font-color-white;
            .line_item{
                width: 100%;
                display: flex;
                height:120px;
                // padding: 30px 0;
                font-size: 28px;;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #ececec;
                .l_label{
                    display: flex;
                    width: 185px;
                    flex-shrink: 0;
                }
                .copay_text{
                    display: flex;
                    padding: 8px 26px;
                    font-size: 24px;
                    flex-shrink: 0;
                    border-radius:30px;
                    align-items:center;
                    justify-content: center;
                    line-height: inherit;
                    color: $font-color-white;
                    background: $color-theme;
                }
            }
            .invit_code{
                width: 320px;
                height: 320px;
                display: flex;
                margin-top: 40px;
                align-items: center;
            }
        }
    }
}
</style>