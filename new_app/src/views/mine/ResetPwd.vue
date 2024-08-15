<template>
    <div class="reset_password">
        <page-header :title="$t('mine_012')" :bgColor="true" />
        <div class="password_block w_f flex-item flex-dir-c">
            <div class="password_item w_f flex-item flex-dir-c">
                <p class="w_f flex-item font_24">{{ $t('login_030') }}</p>
                <div class="password_text w_f flex-item">
                    <input class="font_24" v-model="oPwd" :type="regEye ? 'password' : 'text'" :placeholder="$t('login_031')">
                    <i :class="[regEye ? 'icon_biyan' : 'icon_zhenyan']" @click="showEye" oninput="value=value.replace(/[^\w_]/g,'')"></i>
                </div>
            </div>
            <div class="password_item w_f flex-item flex-dir-c">
                <p class="w_f flex-item font_24">{{ $t('login_021') }}</p>
                <div class="password_text w_f flex-item">
                    <input class="font_24" v-model="nPwd" :type="regEye ? 'password' : 'text'" :placeholder="$t('login_031')">
                    <i :class="[regEye ? 'icon_biyan' : 'icon_zhenyan']" @click="showEye" oninput="value=value.replace(/[^\w_]/g,'')"></i>
                </div>
            </div>
            <div class="password_item w_f flex-item flex-dir-c">
                <p class="w_f flex-item font_24">{{ $t('login_032') }}</p>
                <div class="password_text w_f flex-item">
                    <input class="font_24" v-model="cPwd" :type="regEye ? 'password' : 'text'" :placeholder="$t('login_031')">
                    <i :class="[regEye ? 'icon_biyan' : 'icon_zhenyan']" @click="showEye" oninput="value=value.replace(/[^\w_]/g,'')"></i>
                </div>
            </div>
            <van-button type="primary" :class="[!oPwd||!nPwd||!cPwd?'progress_award':'']" :disabled="!oPwd||!nPwd||!cPwd" :loading="isLoading" @click="submitFun">{{ $t('home_038') }}</van-button>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
import { revisepwd,logout } from "@/api/login";
import PageHeader from "@/components/Header";

export default {
    name: "reset-pwd",
    components: {PageHeader},
    data() {
        return {
            oPwd:"",    
            nPwd:"", 
            cPwd:"", 
            isLoading:false,
            regEye: true,
            countTime:  60,
        };
    },
    computed: {
        active: function() {
            return (
                this.forgetData.oldPwd &&
                this.forgetData.new_pwd &&
                this.confirm_pwd
            );
        },
         ...mapState({
            userInfo: state => state.User.userInfo
        })
    },
    methods: {
        showEye(){
            this.regEye = !this.regEye;
        },
        submitFun() {
            if (!this.oPwd) {
                return this.$toast(this.$t('other_001',{value:this.$t('login_020')}));
            }
            if (!this.nPwd) {
                return this.$toast(this.$t('other_001',{value:this.$t('login_021')}));
            }else if(this.nPwd != this.cPwd){
                return this.$toast(this.$t('login_019'));
            }
            this.isLoading=true;
            revisepwd({old_pwd:this.oPwd,new_pwd:this.nPwd}).then(res => {
                this.isLoading=false;
                if(res.code) return;
                sessionStorage.clear();
                let storage = window.localStorage;
                storage["isstorename"] =  "no";
                this.$store.dispatch('User/logoutClear');
                this.$dialog.confirm({
                    title: this.$t("other_008"),
                    message: this.$t("login_022"),
                    confirmButtonText: this.$t("other_011"),
                    showCancelButton: false
                }).then(() => {
                    this.$router.replace('/home');
                })
            })
        }
    }
};
</script>
<style lang="scss" scoped>
.reset_password {
    height: 100vh;
    background-color: $font-color-white;
}
.cell-block {
    padding: 24px;
    height: 90px;
    background: #ffffff;
    border-radius: 20px;
    margin: 20px 0;
    color: #666666;
}
.van-cell-group {
    background-color: transparent;
}
.password_block {
    gap: 20px;
    padding: 0 40px;
    margin-top: 88px;
    box-sizing: border-box;
    .password_item{
        border-bottom: 1px solid $home-title-13;
        p{
            margin-left: 20px;
            color: $home-title-15;
        }
        input {
            height: 88px;
			border: transparent;
			outline: none;
			color: $home-title-06;
			padding-left: 20px;
			flex-grow: 1;
            // background: darkcyan;
		}
        .password_text{
            position: relative;
            margin-top: 8px;
            .icon_biyan, .icon_zhenyan {
                width: 48px;
                height: 48px;
                background: url("../../assets/images/sign/icon_biyan.png") no-repeat;
                background-size: 100% 100% !important;
            }
            .icon_zhenyan {
                background: url("../../assets/images/sign/icon_zhenyan.png") no-repeat;
            }
        }
    }
    .van-button{
        margin-top: 50px;
        border-color: $color-theme;
        background-color: $color-theme;
    }
    .progress_award{
        border-color: $home-title-06;
        background-color: $home-title-06;
    }
}
.submit-button {
    padding:20px 0;
    margin: 60px 35px;
    text-align: center;
    font-size: 36px;
    color: #ffffff;
    border-radius: 10px;
    border-color: $color-theme;
    background-color: $color-theme;
    &.active {
        background: $home-bind-button;
    }
}
.verify-img-block {
    vertical-align: middle;
    img {
        height: 100%;
    }
}
.van-button{
    width: 100%;
    border-radius: 5px;
}
</style>
