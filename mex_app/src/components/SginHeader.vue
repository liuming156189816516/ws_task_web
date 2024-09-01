<template>
    <div class="login_head w_f flex-item flex-align flex-between">
        <img class="le_logn" src="@/assets/images/logo-h.png" />
        <!-- <img class="le_logn" src="@/assets/images/logo.png" /> -->
        <div class="login_area flex-item flex-align font_24">
            <div class="flex-item flex-align">
                <span>SIGN IN</span>
                <span class="sign_bt flex-item flex-align">SING UP</span>
            </div>
            <!-- <div class="user_info flex-item flex-align">
                <img src="@/assets/images/gold_icon.png"> <span>8000</span>
            </div> -->
        </div>
    </div>
</template>

<script>
export default {

}
</script>
<style lang="scss" scoped>
    .login_head{
        padding: 10px 20px;
        box-sizing: border-box;
        background: $home-eart-long;
        .le_logn{
            height: 60px;
        }
        .login_area, .user_info{
            font-weight: bold;
            color: $font-color-white;
            .sign_bt{
                height: 100%;
                height: 80px;
                padding: 0 20px;
                margin-left: 20px;
                border-radius: 10px;
                box-sizing: border-box;
                background: $home-bg-value;
            }
            img{
                height: 45px;
            }
            span{
                margin-left: 10px;
            }
        }
    }
</style>