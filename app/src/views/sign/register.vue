<template>
	<div class="login_warp">
		<div class="sign_login">
			<div class="nav_top">
				<div class="back_icon">
					<img src="@/assets/images/sign/left.png" @click="$router.go(-1)" />
				</div>
				<div class="serve_area">{{ $t('login_014') }}</div>
			</div>
			<img class="login_img" src="@/assets/images/logo.png" alt="" srcset="">
			<!-- <div class="head_title">{{ $t('login_029') }}</div> -->
			<div class="uilist">
				<div class="uilist_div">
					<img src="@/assets/images/sign/zhanghao.png" />
					<input v-model="username" :placeholder="$t('other_001',{value:$t('login_026')})" oninput="value=value.replace(/[^\w_]/g,'')" />
				</div>
				<div class="uilist_div pwd">
					<img src="@/assets/images/sign/lock.png" />
					<input v-model="pwd" :placeholder="$t('other_001',{value:$t('login_002')})" :type="regEye ? 'password' : 'text'" oninput="value=value.replace(/[^\w_]/g,'')" />
					<i :class="[regEye ? 'icon_biyan' : 'icon_zhenyan']" @click="showEye"></i>
				</div>
				<div class="uilist_div pwd">
					<img src="@/assets/images/sign/lock.png" />
					<input v-model="sur_pwd" :placeholder="$t('other_001',{value:$t('login_009')})" :type="regEye ? 'password' : 'text'" oninput="value=value.replace(/[^\w_]/g,'')" />
					<i :class="[regEye ? 'icon_biyan' : 'icon_zhenyan']" @click="showEye"></i>
				</div>
				<div class="uilist_div pwd">
					<img src="@/assets/images/sign/tuiguang.png" />
					<input style="flex-grow:1;" v-model="user_code" :placeholder="$t('other_001',{value:$t('login_013')})" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" />
				</div>
				<div class="uilist_div verfy_code">
					<div class="input_code">
						<img src="@/assets/images/sign/secret.png" />
						<input style="flex-grow:1;" v-model="safe_code" autocomplete="off" :placeholder="$t('other_001',{value:$t('login_008')})" oninput="value=value.replace(/[^\w_]/g,'')" />
					</div>
					<div class="code_img" @click="getVerfyBtn">
						<img :src="require(`@/assets/images/code/${item}.png`)" v-for="(item,idx) in verfyList" :key="idx">
					</div>
				</div>
			</div>
			<div class="login_btn">
				<van-button type="primary" :loading="isLoading" @click="handleRegister()" :loading-text="$t('login_010')">{{$t('login_014') }}</van-button>
			</div>
			<div class="register_btn">
				{{ $t('login_015') }}<span @click="goLogin">{{ $t('login_016') }}>></span>
			</div>
		</div>
	</div>
</template>
<script>
import { getcode } from '@/api/login';
export default {
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
			sur_pwd: "",
			bext_id: "",
			pixe_id: "",
			timestamp:"",
			user_verify: "",
			user_code:"",
			countTime: 60,
			uuid: "",
		}
	},
	created() {
		let url = window.location.search;
		if (url.indexOf("inviteCode=") > -1) {
			this.user_code = this.$Helper.getUrlParams("inviteCode");
		}
		if (url.indexOf("pixellid=") > -1) {
			this.pixe_id = this.$Helper.getUrlParams("pixellid");
		}
		if (url.indexOf("fbclid=") > -1) {
			this.bext_id = this.$Helper.getUrlParams("fbclid");
		}
		this.timestamp = String(new Date().getTime());
		this.getVerfyBtn();
	},
	methods: {
		goLogin() {
			this.$router.push("/login")
		},
		showEye(){
			this.regEye = !this.regEye;
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
				fbclid: this.bext_id,
				pixellid: this.pixe_id,
				finvite_Code: this.user_code
			};
			// console.log(params);
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
				if(!res.token) return;
				// if(process.env.NODE_ENV == 'production'){
				// 	fbq('track', 'CompleteRegistration');
				// }
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
	height: 100%;
	padding: 0 48px;
	box-sizing: border-box;
	position: relative;
	overflow: hidden;
	overflow-y: auto;
	input {
		background: transparent !important;
		border: transparent;
		outline: none;
		font-size: 28px;
		color: #626262;
		padding-left: 25px;
		flex-grow: 1;
	}

	.sign_login {
		display: flex;
		width: 100%;
		position: relative;
		flex-direction: column;
		.login_img{
			height: 120px;
			margin: 0 auto;
			margin-top: 8%;
			margin-bottom: 10%;
		}
		.nav_top {
			width: 100%;
			height: 88px;
			display: flex;
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
				// img {
				// 	width: 32px;
				// 	height: 40px;
				// 	margin-right: 8px;
				// }
				// span {
				// 	color: #F52C2C;
				// 	font-size: 28px;
				// 	font-weight: 600;
				// }
			}
		}

		.uilist {
			overflow: hidden;

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
		margin-top: 20px;
		flex-direction: column;

		.van-button {
			width: 100%;
			border: none;
			border-radius: 6px;
			margin-bottom: 20px;
		}

		.van-button:nth-child(2) {
			color: #323aa2;
			background: #e9edfe;
		}
	}

	.register_btn {
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		font-weight: bold;

		span {
			color: $home-copay-title;
		}
	}
}

.icon_biyan,
.icon_zhenyan {
	width: 40px;
	height: 20px;
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

.head_title {
	width: 100%;
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	margin: 20% 0 10% 0;
}
</style>
