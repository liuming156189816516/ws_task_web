<template>
	<div class="login_warp" @click="isIndex=false">
		<!-- <page-header :title="$t('login_027')" :showBack="false" :rightIcon="true"></page-header> -->
		<!-- <div class="l_value" @click="showChangeBtn" @click.stop>
			<span>{{ viewLang() }}</span>
			<img class="down_icon" src="@/assets/images/home/xiala.png">
			<van-transition name="fade-up">
				<div class="down_list" :class="isIndex?'active_open':'active_close'">
					<p v-for="item in langOptions" :key="item.lang" :style="langIdx==item.lang?'color:#07c160;':''" @click="onChangeType(item)">{{item.name}}</p>
				</div>
			</van-transition>
		</div> -->
		<div class="head_main w_f flex-item flex-dir-c">
			<div class="head_title">
				{{$t('login_034')}}
				<img src="@/assets/images/sign/close_icon.png" @click="bankIcon">
			</div>
			<div class="small_text flex-item font_32">{{$t('login_034')}}</div>
		</div>
		<div class="login_main flex-item flex-dir-c">
			<div class="sign_login">
				<!-- <img class="login_img" src="@/assets/images/logo.png"> -->
				<div class="uilist">
					<div class="uilist_div account">
						<!-- <img src="@/assets/images/sign/zhanghao.png" alt /> -->
						<input v-model="username" :placeholder="$t('login_026')" autocomplete="off" oninput="value=value.replace(/[^\w_]/g,'')" />
					</div>
					<div class="uilist_div pwd">
						<!-- <img src="@/assets/images/sign/icon_suo.png" alt /> -->
						<input v-model="password" :placeholder="$t('login_002')" :type="regEye ? 'password' : 'text'" oninput="value=value.replace(/[^\w_]/g,'')" />
						<i :class="[regEye ? 'icon_biyan' : 'icon_zhenyan']" @click="eyeBol"></i>
					</div>
					<!-- <div class="forget_pwd">
						<van-checkbox v-model="autologin" shape="square" checked-color="#008751">{{$t('other_002')}}</van-checkbox>
						<span class="forget_text" @click="forgetFunc">{{ $t('login_003') }}</span>
					</div> -->
				</div>
				<div class="login_btn">
					<van-button type="primary" :loading="isLoading" @click="handleLogin" :loading-text="$t('login_005')">{{$t('login_004')}}</van-button>
					<!-- <van-button plain type="primary" @click="goRegister" >{{ $t('login_006') }}</van-button> -->
				</div>
			</div>
			<div class="register_text w_f flex-item flex-center font_32" :class="{'is_bottom':isBottom}" @click="goRegister">{{$t('login_028')}}<span class="reg_text"> {{$t('login_029')}}</span></div>
		</div>
		   <!-- <drag-icon ref="dragIconCom" :gapWidthPx="24" :coefficientHeight="0.68">
            <div class="serve_icon" slot="icon" @click="contactService">
                <img src="../assets/images/ms_serve.png" alt="" />
            </div>
        </drag-icon> -->
	</div>
</template>
<script>
import PageHeader from "@/components/Header";
export default {
	// components: { PageHeader },
	data() {
		return {
			regEye:true,
			autologin:true,
			username:"",
			password:"",
			isBottom:false,
			langIdx:Cookies.get("language")||'en',
			isIndex:false,
			langOptions: [
				{lang:"en",name:"en-US"},
				{lang:"zh",name:"zh_CN"}
			]
		}
	},
	created() {
		if(this.$Helper.checkBrowser()&&this.$Helper.isIos()){
			this.isBottom = true;
		}else{
			this.isBottom = true;
		}
		this.$store.dispatch('User/actionReport',3)
		// this.userAccount();
    },
	methods: {
		//登录
		handleLogin() {
			const regex = /^[0-9A-Za-z]{6,20}$/;
			const reg = new RegExp(/^1[3456789]\d{9}$/);
			if (!this.username) {
				/*|| !reg.test(this.username)*/
				// return this.$toast(this.$t('login_007'));
				return this.$toast(this.$t('other_001',{value:this.$t('login_026')}))
			}
			if (!this.password) {
				return this.$toast(this.$t('other_001',{value:this.$t('login_002')}));
			}
			let params = {
				account: this.username,
				pwd:this.password,
				language:this.langIdx
			};
			const Toast = this.$toast.loading({
				duration: 3000,
				message: this.$t('login_005'),
				forbidClick: true,
				loadingType: 'spinner',
			});
			this.isLoading= true;
			// let pp = this.$Helper.aesEncrptMsg(JSON.stringify(params));
			// console.log(this.$Helper.aesDecrptHost(pp));
			this.$store.dispatch('User/userLogin',params).then(res => {
				Toast.clear();
				this.moveNews.$emit('login-env',"hello");
				setTimeout(()=>{this.isLoading= false},2000)
				if(!res.token) return;
				this.checkChange();
				localStorage.removeItem('step_01');
				localStorage.setItem('is_play',false);
				this.$store.dispatch('Global/isShowLogin',false);
				if(window.location.href.includes("?")){
					window.location.replace(this.$Helper.restAddress())
				}else{
					this.$router.push('/home');
				}
				this.isLoading= false;
			}).catch(error => {
				this.isLoading= false
				if (window.location.host == 'fcwk.dpqcblzs.com' || window.location.host == 'fcwk.hnjsjzdl.com' || window.location.host == 'www.mifengxj.com') {
					this.qrcodeImg.show = true;
				}
				Toast.clear();
			});
		},
		checkChange(val) {
			let storage = window.localStorage;
			storage['isstorename'] = 'yes';
			storage['loginphone'] = this.username;
			storage['loginpwd'] = this.password;
		},
		userAccount() {
			let storage = window.localStorage;
			if (storage['isstorename'] == 'yes') {
				this.autologin = true;
				this.username = storage['loginphone'];
				this.password = storage['loginpwd'];
				this.handleLogin();
			} else {
				this.autologin = false;
				this.username = storage['loginphone'];
				this.password = storage['loginpwd'];
			}
		},
		bankIcon(){
			// this.$router.push("/home")
			this.$store.dispatch('Global/isShowLogin',false);
		},
		eyeBol() {
			this.regEye = !this.regEye;
		},
		goRegister() {
			// this.$router.push("/register")
			this.$store.dispatch('Global/isShowType',2);
		},
		forgetFunc(){
			this.$router.push("/forget_pwd")
		},
		showChangeBtn(){
			this.isIndex=!this.isIndex;
		},
		onChangeType(row){
			this.langIdx=row.lang;
			this.$i18n.locale=row.lang;
            Cookies.set("language",row.lang)
		},
		viewLang(){
			let lang = this.langOptions.find(item=>item.lang == this.langIdx);
			return lang.name
		}
	}
};
</script>
<style lang="scss" scoped>
.login_warp {
	width: 100%;
	height: 100%;
	position: relative;
	min-height: 100vh;
	background: url('../../assets/images/home/bg_img.png') no-repeat;
    background-size: cover;
	.head_main{
		padding: 48px 48px 0 48px;
		box-sizing: border-box;
		.head_title{
			width: 100%;
			display: flex;
			font-weight: bold;
			font-size: 72px;
			position: relative;
			align-items: center;
			justify-content: center; 
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
			margin: 80px 0 96px 0;
			color: $home-title-04;
		}
	}
	.login_main {
		width: 100%;
		position: relative;
		height: calc(100% - 428px);
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
		.sign_login {
			display: flex;
			width: 100%;
			position: relative;
			// align-items: center;
			flex-direction: column;
			.login_img{
				height: 120px;
				margin: 0 auto;
				margin-top: 20%;
			}
			.uilist {
				overflow: hidden;
				padding: 60px 48px 0 48px;
				box-sizing: border-box;
				// background: $font-color-white;
				.uilist_div{
					position: relative;
					display: flex;
					border-radius: 12px;
					align-items: center;
					padding: 0 22px;
					height: 88px;
					box-sizing: border-box;
					background-color: #F6F6F6;
					margin-bottom: 32px;
					&:nth-last-child(1){
						border-bottom: transparent;
						margin-bottom: 56px;
					}
				}
			}
		}
		.login_btn{
			width: 100%;
			display: flex;
			margin-top: 20px;
			padding: 0 48px;
			box-sizing: border-box;
			flex-direction: column;
			.van-button{
				width: 100%;
				// border: none;
				border-radius: 6px;
				margin-bottom: 20px;
				border-color: $color-theme;
				background-color: $color-theme;
			}
			// .van-button:nth-child(2){
			// 	color: #323aa2;
			// 	background: #e9edfe;
			// }
		}
		.register_text, .is_bottom{
			margin-top: 45%;
			justify-self: flex-end;
			// position: absolute;
			// left: 0;
			// bottom: 100px;
			// color: $home-title-03;
			color: $home-title-03;
			.reg_text{
				color: $color-theme;
			}
		}
		.is_bottom{
			// margin-top: 35%;
		}
	}
}
.icon_biyan, .icon_zhenyan {
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
.forget_pwd{
	display: flex;
	font-size: 28px;
	margin-bottom: 20px;
	justify-content: space-between;
	.forget_text{
		color: $font-color-black;
		font-size: 28px;
	}
}
.l_value{
	display: flex;
	position: relative;
	align-items: center;
	position: absolute;
	top: 30px;
	right: 30px;
	z-index: 1;
	span{
		width: 100%;
		flex-grow: 1;
		color: #000;
		font-size: 32px;
		border-radius: 8px;
	}
	.down_icon{
		display: flex;
		width: 30px;
		margin-left: 20px;
	}
	.down_list{
		width: 160px;
		max-height: 230px;
		position: absolute;
		left: 0;
		top: 60px;
		z-index: 2;
		font-size: 28px;
		padding: 16px 20px;
		border-radius: 8px;
		box-sizing: border-box;
		color: $font-color-black;
		//background-color: $home-eart-status-value;
		// background-color: $color-Nobtnbg;
		p{
			padding: 10px 0;
			border-bottom: 1px solid #ebedf0;
		}
		p:last-child{
			border: none;
		}
	}
	.down_list:before {
		content: "";
		display: block;
		position: absolute;
		width:0;
		height: 0;
		border: 16px solid transparent;
		border-bottom-color: rgba(100, 100, 111, .1);
		left: 40px;
		top: -30px;
	}
	.active_open{
		display: block;
		transition: all .2s;
		// animation: slide-down .2s ease-in;
		transition: .2s ease-in;
		transform-origin: 50% 0;
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
	}
	.active_close{
		display: none;
		transition: all .5s;
		animation: select-close .5s ease-in;
		transition: .3s ease-in;
		transform-origin: 50% 0;
	}
	@keyframes slide-down{
		0%{transform: scale(1,.5)}
		100%{transform: scale(1,1)}
	}
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 5s;
}
</style>
