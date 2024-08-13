<template>
    <div class="reset-password">
        <page-header :title="$t('mine_005')" :bgColor="true"></page-header>
        <div class="content-block">
            <van-cell-group :border="false">
                <van-field
                    :label="$t('login_020')"
                    class="cell-block"
                    autocomplete="off"
                    :right-icon="regEye0 ? 'closed-eye': 'eye-o'"
                    :type="regEye0 ? 'password': 'text'"
                    @click-right-icon="regEye0 = !regEye0"
                    :placeholder="$t('login_020')"
                    v-model="oPwd"
                ></van-field>
                <van-field
                    :label="$t('login_021')"
                    class="cell-block"
                    autocomplete="off"
                    :right-icon="regEye1 ? 'closed-eye': 'eye-o'"
                    :type="regEye1 ? 'password': 'text'"
                    @click-right-icon="regEye1 = !regEye1"
                    :placeholder="$t('login_021')"
                    v-model="nPwd"
                ></van-field>
                <van-field
                    :label="$t('login_007')"
                    class="cell-block"
                    autocomplete="off"
                    :right-icon="regEye2 ? 'closed-eye': 'eye-o'"
                    :type="regEye2 ? 'password': 'text'"
                    @click-right-icon="regEye2 = !regEye2"
                    :placeholder="$t('login_007')"
                    v-model="cPwd"
                ></van-field>
            </van-cell-group>
            <van-button type="primary" :loading="isLoading" @click="submitFun">{{ $t('home_038') }}</van-button>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
import { revisepwd } from "@/api/login";
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
            regEye0: true,
            regEye1: true,
            regEye2: true,
            countTime:  60,

            num1 : 2,
			num2: 3,
			operate: 'jia',
			code_verify_v: '',
			uuid: '',
			code_verify_v_r: '',
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
                this.$dialog.confirm({
                    title: this.$t("other_008"),
                    message: this.$t("login_022"),
                    confirmButtonText: this.$t("other_011"),
                    showCancelButton: false
                }).then(() => {
                    this.$store.dispatch("User/logoutUser");
                    this.$router.push({ name: "/login" });
                })
            })
        }
    }
};
</script>
<style lang="scss" scoped>
.reset-password {
    height: 100vh;
    background-color: $font-color-white;
}
.header {
    height: 102px;
    width: 100%;
    padding: 0 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
    font-size: 36px;
    background-image: linear-gradient(90deg, #709fff 0%, #597ef7 100%);
    div i {
        vertical-align: middle;
    }
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
.content-block {
    padding: 0 35px;
    .van-cell{
        border-radius: 5px;
    }
    .van-button{
        margin-top: 50px;
        border-color: $color-theme;
        background-color: $color-theme;
    }
}
.submit-button {
    // width: 680px;
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
.header-nav {
    display: flex;
    height: 88px;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-left: 10%;
    margin-bottom: 20px;
    .nav-item {
        margin-right: 20%;
        .title {
            font-size: 32px;
            color: #7e868d;
        }
        .b_line {
            height: 6px;
            width: 50px;
            border-radius: 3px;
            position: relative;
            margin: 20px auto 0 auto;
            visibility: hidden;
            &.active {
                visibility: visible;
            }
        }
    }
}
::v-deep {
    .van-cell__value{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        .van-field__body{
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
        .van-button--primary, .van-button--info{
            background-color: $color-theme;
            border-color: $color-theme;
        }
        .van-button--info{
            opacity: 0.75;pointer-events: none;
        }
    }
}
.van-button{
    width: 100%;
    border-radius: 5px;
}
::v-deep .van-field__label{
    min-width: 130px;
    margin-right: 0;
}
</style>
