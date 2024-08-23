<template>
	<div id="app" :class="[hasTabBar ? 'set-padding-top' : '', isPc?'isPc': '']">
		<div v-if="!showNavBar" class="mobile_head_top"></div>
		<div :class="!showNavBar?'app_top_continer':'app_continer'">
			<keep-alive :include="keepAliveNames">
				<router-view></router-view>
			</keep-alive>
			<router-view name="tabBar"></router-view>
			<float-ball v-if="assistiveTouch"></float-ball>
		</div>
		<van-overlay :show="global.isLogin" style="overflow-y: auto;">
            <login v-if="global.isType==1" />
			<register v-if="global.isType==2" />
        </van-overlay>
		<van-overlay :show="global.logOut">
			<div class="log_warp w_f flex-item flex-align flex-center flex-dir-c">
				<div class="log_main">
					After logging out, you will no longer be able to view real-time earnings. Are you sure you want to log out?
					<div class="footer_bnt w_f flex-item flex-center">
						<van-button class="footer_confirm" type="primary" :loading="isLoading" loading-text="Loading..." @click="handle_confirm">Confirm</van-button>
						<van-button class="footer_cancel" type="primary" @click="handle_close">Cancel</van-button>
					</div>
				</div>
			</div>
        </van-overlay>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import { logout } from '@/api/login';
import FloatBall from './components/FloatBall';
import preLoad from './core/PreLoadProxy';
import login from './views/sign/login.vue';
import register from './views/sign/register.vue';
export default {
	components: {FloatBall,login,register},
	provide: function(){
		return {
			isPc: !window.navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            )
		}
	},
	data() {
		return {
			title: '',
			device:"",
			isLoading: false,
			hasTabBar: false,
			showNavBar: false,
			transitionName: '',
			keepAliveNames: ['home'],
			assistiveTouch: sessionStorage.getItem('plus_ready') && sessionStorage.getItem('plus_ready') === '1',
			isPc: !window.navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            )
		}
	},
	computed: {
		...mapState({
			global: state => state.Global,
			userInfo: state => state.User,
		})
	},
	beforeCreate() {},
	created() {
		// console.log(this.$store.state);
		let preLoadTemp = new preLoad();
		preLoadTemp.setup();
		const { title, hasTabBar } = this.$route.meta;
		this.title = title || '';
		this.hasTabBar = !!hasTabBar;
		this.showNavBar = this.$Helper.checkBrowser();
	},
	methods: {
		handle_close(){
			this.$store.dispatch('Global/isCloseTips',false);
		},
		handle_confirm(){
			this.isLoading=true;
			logout().then(result => {
				this.isLoading=false;
				var storage = window.localStorage;
				storage["isstorename"] =  "no";
				storage["is_play"] = false;
				this.$store.dispatch('Global/isCloseTips',false);
				this.$store.dispatch('User/logoutClear');
				sessionStorage.clear();
				localStorage.setItem('is_play',true);
				this.$router.replace('/home');
			}).catch(err => {
				this.$router.replace('/home');
				localStorage.removeItem('token');
			})
		}
	}
};
</script>
<style lang="scss">
html,
body,
#app {
	width: 100%;
	height: 100%;
	overflow: hidden;
	.van-overlay, .van-popup{
		z-index: 99 !important;
	}
	.mobile_head_top{
		width: 100%;
		height: 80px;
		position: fixed;
		top: 0;
		left: 0;
		background: radial-gradient(circle at 10% 20%, rgb(239, 246, 249) 0%, rgb(206, 239, 253) 90%);
	}
	.app_top_continer, .app_continer{
		width: 100%;
		height: 100%;
		// height: calc(100% - 180px);
		overflow-y: auto;
		margin-top: 80px;
		-webkit-overflow-scrolling: touch; 
	}
	.app_continer{
		margin-top: 0px;
	}
}

img {
	max-width: 100%;
}

.set-padding-top {
	padding-bottom: 120px;
}

#app {
	font-family: 'Microsoft YaHei';
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}
#app{
	max-width: 750px;
	margin: 0 auto;
	overflow: hidden;
}
//全局唐朝
.g-notice-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;

	&.single {
		.tit {
			font-size: 36px;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			line-height: 50px;
			text-align: center;
			padding: 60px 0 20px !important;
		}
	}

	.wrapperInner {
		width: 670px;
		padding: 10px 65px;
		background: #ffffff;
		border-radius: 16px;
		position: relative;

		.close {
			width: 88px;
			height: 88px;
			position: absolute;
			left: 50%;
			margin-left: -44px;
			bottom: -160px;
		}

		.tit {
			font-size: 36px;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			text-align: center;
			padding: 20px 0 45px;
		}

		.desc-tit {
			font-size: 30px;
			text-align: center;
			color: rgba(102, 102, 102, 1);
			line-height: 150px;
			font-weight: bold;
		}

		.desc {
			height: 250px;
			overflow-y: auto;
			font-size: 30px;
			font-weight: 400;
			color: rgba(102, 102, 102, 1);
			line-height: 1.4;
		}

		.btm {
			display: flex;
			align-items: center;
			margin-top: 61px;
			padding-bottom: 35px;
		}

		.btn {
			width: 250px;
			height: 88px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 44px;
			font-size: 36px;
		}

		.btn-border {
			border: 1px solid rgba(153, 153, 153, 1);
			color: #333333;
		}

		.btn-primary {
			border: 1px solid #0e63ff;
			background: #0e63ff;
			color: #fff;
			margin-left: 30px;
		}
	}
}
.van-icon-location-acc {
	&:after {
		content: '';
		width: 0.36rem;
		height: 0.382rem;
		background-image: url('./assets/images/sign/uname.png');
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center center;
		display: block;
	}
}
.van-icon-location-pwd {
	&:after {
		content: '';
		width: 0.36rem;
		height: 0.4rem;
		background-image: url('./assets/images/sign/password.png');
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center center;
		display: block;
	}
}
.van-icon-location-promo {
	&:after {
		content: '';
		width: 0.36rem;
		height: 0.4rem;
		background-image: url('./assets/images/sign/promo_code.png');
		background-repeat: no-repeat;
		background-size: contain;
		display: block;
	}
}
.van-icon-location-valid {
	&:after {
		content: '';
		width: 0.36rem;
		height: 0.4rem;
		background-image: url('./assets/images/sign/valid_code.png');
		background-repeat: no-repeat;
		background-size: contain;
		display: block;
	}
}

.van-empty__description {
	margin-top: 0 !important;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
	will-change: transform;
	transition: all 0.3s;
	position: absolute;
	width: 100%;
	left: 0;
}
.slide-right-enter {
	transform: translateX(-100%);
}
.slide-right-leave-active {
	transform: translateX(100%);
}
.slide-left-enter {
	transform: translateX(100%);
}
.slide-left-leave-active {
	transform: translateX(-100%);
}
.MoneyUnit {
	font-size: 20px;
	color: $color-theme;
}
.bind-title-select {
	.van-dropdown-menu__bar {
		border-radius: 8px !important;
		background-color: rgb(248, 197, 143) !important;
		height: 0.8rem;
	}
	.van-dropdown-menu__item {
		border-radius: 8px !important;
		height: 0.8rem;
	}
	.van-dropdown-menu__title {
		color: $font-color-white;
	}
	.van-dropdown-menu__title::after {
		position: absolute;
		top: 50%;
		right: 0;
		margin-top: -0.1rem;
		border: 0.06rem solid;
		background-image: url('./assets/images/home/down_arrow_white.png');
		border-color: transparent transparent #fff #fff;
		-webkit-transform: rotate(-45deg);
		transform: rotate(-45deg);
		opacity: 1;
	}
}
.disable-select {
	// margin: 0 50px 0 30px;
	font-size: 24px;
	color: $home-disabled-text;
	display: flex;
	justify-content: space-around;
	align-items: center;
	.van-dropdown-menu {
		width: 2.5rem;
	}
	.van-dropdown-menu__bar {
		width: 2.5rem;
		border-radius: 4px !important;
		height: 0.7rem;
	}
	.van-dropdown-menu__item {
		background-color: $home-disabled-back;
		border-radius: 4px !important;
		height: 0.7rem;
	}
	.van-dropdown-menu__title::after {
		position: absolute;
		top: 50%;
		right: -0.04rem;
		margin-top: -0.1rem;
		border: 0.06rem solid;
		background-image: url('./assets/images/home/down_arrow_white.png');
		border-color: transparent transparent rgba(102, 102, 102, 1) rgba(102, 102, 102, 1);
		-webkit-transform: rotate(-45deg);
		transform: rotate(-45deg);
		opacity: 1;
	}
}
.van-dialog__message {
	padding: 0.24rem;
}
#home-risk {
	width: 6.89rem;
	.van-dialog__header {
		height: 1rem;
	}
}
.dialog-close {
	position: absolute;
	right: 20px;
	top: 20px;
	width: 50px;
}
.van-dialog {
	width: 6.8rem;
}

.isPc{
	max-width: 1000px;
	margin: auto;
	::-webkit-scrollbar {
		display: none; /* Chrome Safari */
	}
	-ms-overflow-style: none; /* IE 10+ */
	scrollbar-width: none; /* Firefox */

	.van-popup, .van-overlay{
		max-width: 10rem;
		left: 50%;
		transform: translateX(-50%);
	}
	.van-popup--center{
		top: 50%;
		left: 50%;
		-webkit-transform: translate3d(-50%,-50%,0);
		transform: translate3d(-50%,-50%,0);
	}
}

.footer_bnt{
  gap: 50px;
  margin-top: 48px;
  .van-button{
    flex: 1;
    border-radius: 12px;
  }
  .footer_cancel{
    color: #008751;
    background: #F2F3FF;
    border-color: #F2F3FF;
  }
  .footer_confirm{
    color: #fff;
    background: #008751;
    border-color: #008751;
  }
}

</style>
