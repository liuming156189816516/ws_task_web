<template>
    <div class="forgot">
        <div class="nav_top">
            <div class="back_icon">
                <img src="@/assets/images/sign/left.png" @click="$router.go(-1)" />
            </div>
            <div class="serve_area">{{ $t('login_003') }}</div>
        </div>
        <div class="forget_continer">
            <div class="input_item">
                <label class="left_icon">
                    <img src="@/assets/images/sign/zhanghao.png" />
                </label>
                <input v-model="username" :placeholder="$t('other_001',{value:$t('login_001')})" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" />
            </div>
            <div class="input_item verfy_item">
                <div class="input_code">
                    <label class="left_icon">
                        <img src="@/assets/images/sign/secret.png" />
                    </label>
                    <input v-model="safe_code" :placeholder="$t('other_001',{value:$t('login_008')})" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" />
                </div>
                <div class="code_img" @click="getVerfyBtn">
                    <img :src="require(`@/assets/images/code/${item}.png`)" v-for="(item,idx) in verfyList" :key="idx">
                </div>
            </div>
            <div class="input_item">
                <label class="left_icon">
                    <img src="@/assets/images/sign/lock.png" />
                </label>
                <input v-model="pwd" :placeholder="$t('other_001',{value:$t('login_002')})" :type="regEye?'password':'text'" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" />
                <i :class="[regEye ? 'icon_biyan': 'icon_zhenyan']" @click="regEye = !regEye"></i>
            </div>
            <div class="input_item">
                <label class="left_icon">
                    <img src="@/assets/images/sign/lock.png" />
                </label>
                <input v-model="sur_pwd" :placeholder="$t('other_001',{value:$t('login_009')})" :type="regEye?'password':'text'" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" />
                <i :class="[regEye ? 'icon_biyan': 'icon_zhenyan']" @click="regEye = !regEye"></i>
            </div>
            <div class="login_btn">
				<van-button type="danger" :loading="isLoading" @click="handleRegister" :loading-text="$t('login_010')">{{ $t('other_003') }}</van-button>
			</div>
        </div>
    </div>
</template>
<script>
import { getcode,changepwd } from '@/api/login';
export default {
    name: "ForgotPassword",
    components: {  },
    data() {
        return {
            regEye:false,
            isLoading:false,
            username:"",
            pwd: "",
            code: "",
            sur_pwd: "",
            safe_code: "",
            verfyList:[],
            langIdx:Cookies.get("language")||'en',
        }
    },
    created() {
        this.timestamp = String(new Date().getTime());
        this.getVerfyBtn();
    },
    methods: {
        async getVerfyBtn(){
            const { code } = await getcode({ uuid: this.timestamp });
			this.verfyList = code.split("");
        },
        //注册
		handleRegister() {
			const zh_reg = new RegExp(/^[^\u4e00-\u9fa5]+$/);
			const regex = new RegExp(/^[0-9A-Za-z]{6,20}$/);
			if (!this.username) {
                return this.$toast(this.$t('other_001',{value:this.$t('login_001')}));
			}
            if (!this.safe_code) {
				return this.$toast(this.$t('other_001',{value:this.$t('login_008')}));
			}
			if (!this.pwd || !regex.test(this.pwd)) {
				this.$toast(this.$t('other_001',{value:this.$t('login_002')}));
			}
			if (this.sur_pwd !== this.pwd) {
				this.$toast(this.$t('other_001',{value:this.$t('login_019')}));
			}
			let params = {
				account: this.username,
				pwd: this.pwd,
				uuid: this.timestamp,
				code: this.safe_code,
                language:this.langIdx,
				finvite_Code: this.user_code
			};
			this.isLoading =true;
            changepwd(params).then(res=>{
                this.isLoading = false;
                if (res.code) return;
                this.$toast(this.$t('other_013'));
                setTimeout(()=>{this.$router.replace('/login')},1000)
            })
		}
    }
};
</script>
<style lang="scss" scoped>
.forgot {
    height: 100vh;
    .nav_top {
        width: 100%;
        height: 88px;
        display: flex;
        padding: 0 30px;
        box-sizing: border-box;
        align-items: center;
        .back_icon {
            flex-grow: 0;
            img {
                width: 18px;
            }
        }
        .serve_area {
            display: flex;
            flex-grow: 2;
            height: 100%;
            font-size: 34px;
            align-items: center;
            justify-content: center;
        }
    }
    .forget_continer {
        width: 100%;
        padding: 0 48px;
        margin-top: 10%;
	    box-sizing: border-box;
        input {
            background: transparent !important;
            border: transparent;
            outline: none;
            font-size: 28px;
            color: #626262;
            padding-left: 25px;
            flex-grow: 1;
        }
        .input_item{
            display: flex;
            height: 88px;
            position: relative;
            border-radius: 12px;
            padding: 0 22px;
            box-sizing: border-box;
            background-color: #F6F6F6;
            margin-bottom: 32px;
            justify-content: center;
            .left_icon {
                display: flex;
                width: 23px;
                height: auto;
                align-items: center;
            }
            .icon_biyan,
            .icon_zhenyan {
                width: 40px;
                height: 20px;
                position: absolute;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                background: url("../../assets/images/sign/icon_biyan.png") no-repeat;
                background-size: 100% 100% !important;
            }
            .icon_zhenyan {
                background: url("../../assets/images/sign/icon_zhenyan.png") no-repeat;
            }
        }
        .verfy_item{
            width: 100%;
            display: flex;
            padding: 0;
            align-items: center;
            background: transparent;
            justify-content: space-between;
            .input_code{
                display: flex;
                flex-grow: 1;
                height: 100%;
                border-radius: 12px;
                padding-left: 22px;
                box-sizing: border-box;
                background-color: #F6F6F6;
            }
            .code_img {
                width: 180px;
                height: 100%;
                display: flex;
                flex-shrink: 0;
                padding: 0 10px;
                align-items: center;
                margin-left: 20px;
                border-radius: 8px;
                letter-spacing: 6px;
                box-sizing: border-box;
                justify-content: center;
                background-color: #F6F6F6;
                gap: 6px;
				img{
					height: 50px;
				}
            }
        }
        .login_btn {
            width: 100%;
            display: flex;
            margin-top: 20px;
            flex-direction: column;
            .van-button {
                width: 100%;
                border: none;
                font-size: 18px;
                border-radius: 6px;
                margin-bottom: 20px;
            }
        }
    }
}
</style>
