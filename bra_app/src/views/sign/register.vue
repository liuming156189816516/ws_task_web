<template>
	<div class="login_warp">
		<div class="head_main w_f flex-item flex-dir-c">
			<div class="head_title">
				{{$t('login_014')}}
				<img src="@/assets/images/sign/close_icon.png" @click="bankIcon">
			</div>
			<div class="small_text flex-item font_32"> {{$t('login_035')}} </div>
		</div>
		<div class="sign_login">
			<!-- <img class="login_img" src="@/assets/images/logo.png" alt="" srcset=""> -->
			<!-- <div class="head_title">{{ $t('login_029') }}</div> -->
			<div class="uilist">
				<div class="uilist_div">
					<!-- <img src="@/assets/images/sign/zhanghao.png" /> -->
					<input v-model="username" :placeholder="$t('login_026')" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" />
				</div>
				<div class="uilist_div pwd">
					<!-- <img src="@/assets/images/sign/lock.png" /> -->
					<input v-model="pwd" :placeholder="$t('login_002')" autocomplete="off" :type="regEye ? 'password' : 'text'" oninput="value=value.replace(/[^\w_]/g,'')" />
					<i :class="[regEye ? 'icon_biyan' : 'icon_zhenyan']" @click="showEye"></i>
				</div>
				<div class="uilist_div pwd">
					<!-- <img src="@/assets/images/sign/lock.png" /> -->
					<input v-model="sur_pwd" :placeholder="$t('login_009')" autocomplete="off" :type="regEye ? 'password' : 'text'" oninput="value=value.replace(/[^\w_]/g,'')" />
					<i :class="[regEye ? 'icon_biyan' : 'icon_zhenyan']" @click="showEye"></i>
				</div>
				<div class="uilist_div pwd">
					<!-- <img src="@/assets/images/sign/tuiguang.png" /> -->
					<input style="flex-grow:1;" v-model="user_code" :placeholder="$t('login_013')" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" />
				</div>
				<div class="uilist_div verfy_code">
					<div class="input_code">
						<!-- <img src="@/assets/images/sign/secret.png" /> -->
						<input style="flex-grow:1;" v-model="safe_code" autocomplete="off" :placeholder="$t('login_008')" oninput="value=value.replace(/[^\w_]/g,'')" />
					</div>
					<div class="code_img" @click="getVerfyBtn">
						<img :src="require(`@/assets/images/code/${item}.png`)" v-for="(item,idx) in verfyList" :key="idx">
					</div>
				</div>
				<div class="login_btn">
					<van-button type="primary" :loading="isLoading" @click="handleRegister()" :loading-text="$t('login_010')">{{$t('login_014') }}</van-button>
				</div>
				<div class="register_btn w_f flex-item flex-center font_32">
					{{ $t('login_015') }}<span @click="goLogin">{{ $t('login_016') }}</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { getcode } from '@/api/login';
import PageHeader from "@/components/Header";
export default {
	// components: { PageHeader },
	data() {
		return {
			regEye:true,
			isLoading:false,
			is_login: 1,
			safe_code: "",
			username: "",
			password: "",
			verfyList:[],
			pwd: "",
			bext_id: "",
			pixe_id: "",
			sur_pwd: "",
			timestamp:"",
			user_verify: "",
			user_code:"",
			countTime: 60,
			uuid: "",
		}
	},
	created() {
		this.user_code=this.$Helper.getUrlParams("inviteCode")||"";
		this.timestamp = String(new Date().getTime());
		this.getVerfyBtn();
		this.$store.dispatch('User/actionReport',2)
	},
	methods: {
		goLogin() {
			this.$router.push("/login")
			// this.$store.dispatch('Global/isShowType',1);
		},
		showEye(){
			this.regEye = !this.regEye;
		},
		bankIcon(){
			// this.$store.dispatch('Global/isShowType',1);
			this.$router.go("-1")
		},
		// handleBlur(){
		// 	if (!this.username) return;
		// 	this.getVerfyBtn();
		// },
		async getVerfyBtn() {
			// if (!this.username) return this.$toast('请输入手机号');
			// var regMobile = new RegExp(/^1[3456789]\d{9}$/);
			// if (!regMobile.test(this.username)) {
			// 	return this.$toast('请输入正确的手机号');
			// }
			const { code } = await getcode({ uuid: this.timestamp });
			this.verfyList = code.split("");
		},
		//注册
		handleRegister() {
			const zh_reg = new RegExp(/^[^\u4e00-\u9fa5]+$/);
			const reg = new RegExp(/^1[3456789]\d{9}$/);
			const regex = new RegExp(/^[0-9A-Za-z]{6,20}$/);
			if (!this.username) {
				return this.$toast(this.$t('other_001',{value:this.$t('login_026')}))
			} else if(!zh_reg.test(this.username)){
				return this.$toast(this.$t('other_001',{value:this.$t('login_018')}));
			}
			if (!this.pwd) {
				return this.$toast(this.$t('other_001',{value:this.$t('login_002')}));
			}else if(!regex.test(this.pwd)){
				return this.$toast(this.$t('other_001',{value:this.$t('login_023')}));
			}
			if (this.sur_pwd !== this.pwd) {
				return this.$toast(this.$t('login_019'));
			}
			// if (!this.user_code) {
			// 	return this.$toast(this.$t('other_001',{value:this.$t('login_012')}));
			// }
			if (!this.safe_code) {
				return this.$toast(this.$t('other_001',{value:this.$t('login_008')}));
			}
			if (this.user_code.length > 10) {
				if (this.user_code.indexOf('user_code') > -1) {
					this.user_code = this.user_code.split('=').pop().split('|').shift();
				}
			}
			let params = {
				account: this.username,
				pwd: this.pwd,
				uuid: this.timestamp,
				code: this.safe_code,
				finvite_Code: this.user_code,
				device:this.$Helper.checkApkBag(1),
				ch:this.$Helper.getUrlParams("ch")||"",
				click_id:this.$Helper.getUrlParams("click_id")||"",
				pixel_id:this.$Helper.getUrlParams("pixel_id")||"",
				CreativeID:this.$Helper.getUrlParams("CreativeID")||""
			};
			// let Toast = this.$toast.loading({
			// 	duration: 2000,
			// 	message: this.$t('login_013'),
			// 	forbidClick: true,
			// 	loadingType: 'spinner',
			// });
			this.isLoading =true;
			this.$store.dispatch('User/userRegister', params).then(res => {
				this.isLoading = false;
				this.getVerfyBtn();
				if(res.code) return;
				// if(process.env.NODE_ENV == 'production'){
				// 	fbq('track', 'CompleteRegistration');
				// }
				// localStorage.setItem('is_play',false);
				// this.moveNews.$emit('login-env',"hello");
				// this.$store.dispatch('Global/isShowLogin',false);
				if(window.location.href.includes("?")){
					window.location.replace(this.$Helper.restAddress())
				}else{
					this.$router.push('/home');
				}
				// try {
				// 	if (this.$Helper.isAndroid()) {
				// 		JSInterface.onLoginin();
				// 	} else if (this.$Helper.isIos()) {
				// 		let params = { method: 'onLoginin' };
				// 		window.webkit.messageHandlers.jsCallNativeMethod.postMessage(params);
				// 	}
				// } catch (e) { }
			}).catch(() => {
				this.isLoading = false;
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.login_warp {
	width: 100%;
	height: 100vh;
	position: relative;
	background: $font-color-white;
	input {
		background: transparent !important;
		border: transparent;
		outline: none;
		font-size: 28px;
		color: #626262;
		padding-left: 25px;
		flex-grow: 1;
	}
	.head_main{
		padding: 48px 48px 0 48px;
		box-sizing: border-box;
		background: $color-theme;
		// background: url('../../assets/images/home/bg_img.png') no-repeat;
    	// background-size: cover;
		.head_title{
			width: 100%;
			height: 188px;
			display: flex;
			font-weight: bold;
			font-size: 72px;
			position: relative;
			// align-items: center;
			// justify-content: center; 
			color: $font-color-white;
			img{
				width: 48px;
				height: 48px;
				position: absolute;
				top: 32px;
				right: 0;
			}
		}
		.small_text{
			margin: 40px 0;
			color: $font-color-white;
		}
	}
	.sign_login {
		display: flex;
		width: 100%;
		height: calc(100% - 428px);
		padding-top: 60px;
		position: relative;
		flex-direction: column;
		background: $font-color-white;
		.login_img{
			height: 120px;
			margin: 0 auto;
			margin-top: 8%;
			margin-bottom: 10%;
		}
		.uilist {
			overflow: hidden;
			padding: 0 48px;
			box-sizing: border-box;
			.uilist_div,
			.verfy_code {
				position: relative;
				display: flex;
				border-radius: 12px;
				align-items: center;
				padding: 0 22px;
				height: 88px;
				box-sizing: border-box;
				background-color: #F6F6F6;
				margin-bottom: 32px;

				>img {
					width: 23px;
					height: auto;
				}

				&:nth-last-child(1) {
					border-bottom: transparent;
					margin-bottom: 56px;
				}

				.forget_text {
					color: #323aa2;
					font-size: 28px;
					position: absolute;
					right: 0;
					bottom: -50px;
				}
			}

			.verfy_code {
				width: 100%;
				display: flex;
				padding: 0;
				justify-content: space-between;
				background-color: transparent;

				.input_code {
					display: flex;
					flex-grow: 1;
					height: 100%;
					align-items: center;
					border-radius: 12px;
					padding-left: 22px;
					box-sizing: border-box;
					background-color: #F6F6F6;

					>img {
						width: 23px;
						height: auto;
					}

					&:nth-last-child(1) {
						border-bottom: transparent;
						margin-bottom: 56px;
					}
				}

				.verfy_title {
					display: flex;
					width: 254px;
					height: 100%;
					flex-grow: 0;
					color: #fff;
					border: none;
					border-radius: 12px;
					justify-content: center;
					align-items: center;
					background-color: #F52C2C;
					font-size: 24px;
					margin-left: 8px;
				}
			}
			.code_img {
				width: 180px;
				height: 100%;
				display: flex;
				flex-shrink: 0;
				padding: 0 10px;
				align-items: center;
				margin-left: 10px;
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
	}

	.login_btn {
		width: 100%;
		display: flex;
		margin-top: 70px;
		flex-direction: column;
		.van-button {
			width: 100%;
			border: none;
			border-radius: 6px;
			margin-bottom: 20px;
			border-color: $color-theme;
			background-color: $color-theme;
		}
		.van-button:nth-child(2) {
			color: #323aa2;
			background: #e9edfe;
		}
	}

	.register_btn {
		color: $home-title-03;
		margin-bottom: 40px;
		span{
			color: $color-theme;
		}
	}
}

.icon_biyan,
.icon_zhenyan {
	width: 48px;
	height: 48px;
	background: url("../../assets/images/sign/icon_biyan.png") no-repeat;
	background-size: 100% 100% !important;
}

.icon_zhenyan {
	background: url("../../assets/images/sign/icon_zhenyan.png") no-repeat;
}

::-webkit-input-placeholder {
	color: #a7a7a7;
}

:-moz-placeholder {
	color: #a7a7a7;
}

::-moz-placeholder {
	color: #a7a7a7;
}

:-ms-input-placeholder {
	color: #a7a7a7;
}

</style>
