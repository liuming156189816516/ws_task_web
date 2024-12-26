<template>
    <div class="login_head w_f flex-item flex-align flex-between">
        <div class="flex-item flex-align">
            <img class="le_logn" src="@/assets/images/logo.png" />
            <span class="font_30" style="color:#fff;margin-left:5px;font-weight: bold;">clickatm.com</span>
            <!-- <span class="gold_num flex-item flex-align font_20">1000{{ $t('pay_027') }}=800{{ $t('pay_024') }}</span> -->
        </div>
        <!-- <img class="le_logn" src="@/assets/images/logo.png" /> -->
        <div class="login_area flex-item flex-align font_24">
            <div class="flex-item flex-align" v-if="!userInfo.token">
                <span @click="jumpPage(0)">{{lanageType($t('login_004'))}}</span>
                <span class="sign_bt flex-item flex-align flex-center" @click="jumpPage(1)">{{lanageType($t('login_014'))}}</span>
            </div>
            <div class="user_info flex-item flex-align" v-else>
                <span :class="['flex-item flex-align',!userInfo.sysNotice?'notoce_active':'']" style="position: relative;">
                    <img class="msg_icon" src="@/assets/images/xiaoxi.png" @click="jumpMsg">
                    <span class="notoce_tips" v-if="!userInfo.sysNotice"></span>
                </span>
                <img src="@/assets/images/gold_icon.png"> <span class="font_28" style="font-weight: bold;">{{baseInfo.income}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    computed: {
        ...mapState({
            userInfo: state => state.User,
            baseInfo: state => state.User.userInfo
        })
    },
    methods: {
        jumpPage(idx){
            let path = ['/login','/register']
            this.$router.push(path[idx]);
        },
        jumpMsg(){
            this.$router.push("/SysMsg");
        },
        lanageType(val){
            let langeType = Cookies.get("language");
            if(langeType == 'en'){
                return val.toUpperCase();
            }else{
                return val;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .login_head{
        padding: 10px 20px;
        box-sizing: border-box;
        // background: $color-headbg;
        // background: rgba($color: $home-eart-long, $alpha: .5);
        .le_logn{
            width: 60px;
            height: 60px;
            border-radius: 6px;
        }
        .gold_num{
            font-weight: bold;
            color: $home-bind-button;
        }
        .login_area, .user_info{
            color: $font-color-white;
            .sign_bt{
                min-width: 140px;
                height: 100%;
                padding: 20px 12px;
                margin-left: 20px;
                font-weight: bold;
                border-radius: 10px;
                box-sizing: border-box;
                // background: $home-bg-value;
            }
            img{
                height: 45px;
            }
            span{
                margin-left: 10px;
            }
            .msg_icon{
                height: 48px;
                margin-right: 10px;
            }
        }
    }
</style>