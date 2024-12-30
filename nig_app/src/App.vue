<template>
	<div id="app" :class="{'set-padding-top':hasTabBar}">
		<div v-if="!showNavBar" class="mobile_head_top"></div>
		<div :class="!showNavBar?'app_top_continer':'app_continer'">
			<keep-alive :include="keepAliveNames">
				<router-view />
			</keep-alive>
			<router-view name="tabBar" />
			<drag-icon ref="dragIconCom" :gapWidthPx="30" :coefficientHeight="0.62">
				<div class="serve_icon" slot="icon" @click="contactService">
					<img src="@/assets/images/serveic/telege_icon.png" alt="" />
				</div>
			</drag-icon>
		</div>
		<van-overlay :show="global.logOut">
			<div class="log_warp w_f flex-item flex-align flex-center flex-dir-c">
				<div class="log_main">
					{{$t('other_009')}}
					<div class="footer_bnt w_f flex-item flex-center">
						<van-button class="footer_confirm" type="primary" :loading="isLoading" loading-text="Loading..." @click="handle_confirm">{{$t('other_003')}}</van-button>
						<van-button class="footer_cancel" type="primary" @click="handle_close">{{$t('other_007')}}</van-button>
					</div>
				</div>
			</div>
        </van-overlay>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import { logout } from '@/api/login';
import uniFun from "@/utils/uni-webview-js"
import dragIcon from "@/components/dragIcon"
export default {
	components: {dragIcon },
	data() {
		return {
			title:"",
			device:"",
			waitTimer:null,
			heartTimer:null,
			isLoading: false,
			hasTabBar: false,
			showNavBar: true,
			currentTIme:null,
			transitionName:"",
			timeout: 1000,   
      		setInter: 6000,
			keepAliveNames: ['home']
		}
	},
	computed: {
		...mapState({
			global: state => state.Global,
			userInfo: state => state.User,
		})
	},
	created() {
		// let preLoadTemp = new preLoad();
		// preLoadTemp.setup();
		this.$Helper.initLanguage();
		const { title, hasTabBar } = this.$route.meta;
		this.title = title || '';
		this.hasTabBar = !!hasTabBar;
		this.showNavBar = this.$Helper.checkBrowser();
		const VERSION_TIME = Date.parse(new Date());
		// console.log(VERSION_TIME);
	},
	mounted(){
		this.customHeader("#31acf2");
		this.handleVersion().then(res=>{
			this.currentTIme = res||"";
		})
		this.waitTimer = setInterval(() => {
			this.heartTimer = setTimeout(() => {
				this.initCheckVersion();
			}, this.timeout)
		}, this.setInter)
	},
	methods: {
		initCheckVersion (){
			this.handleVersion().then(res=>{
				if(this.currentTIme !== res){
					clearInterval(this.waitTimer);
					clearInterval(this.heartTimer);
					window.location.reload(true);
				}
			})
		},
		async handleVersion(){
			return await axios.get(location.origin + '/version.json?t=' + Date.now(), {
				headers: {'Cache-Control': 'no-cache',Pragma: 'no-cache',Expires: '-1',}
			}).then(res=>{
				return res.data;
			})
		},
		customHeader(color){
			// if (navigator.userAgent.match(/Android/i)) {
			// 动态设置 meta theme-color
			let metaThemeColor = document.querySelector('meta[name=theme-color]');
			if (!metaThemeColor) {
				metaThemeColor = document.createElement('meta');
				metaThemeColor.name = 'theme-color';
				document.head.appendChild(metaThemeColor);
			}
			metaThemeColor.content = color||'#31acf2'; // 设定颜色
			// }	
		},
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
		},
		contactService(){
			if(this.$Helper.checkBrowser()){
				window.open(process.env.VUE_APP_TELEGRAM,"_blank");
			}else{
				uniFun.postMessage({data:process.env.VUE_APP_TELEGRAM});
			}
		}
	},
	beforeDestroy(){
		clearInterval(this.waitTimer);
		clearInterval(this.heartTimer);
	},
	watch: {
		'$route'(to, from) {
			if(to.path == "/home"||to.path == "/spread"){
				this.customHeader("#31acf2");	
			}else{
				this.customHeader();	
			}
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
	// height: fit-content;
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
		background: $color-theme;
	}
	.app_top_continer, .app_continer{
		width: 100%;
		height: 100%;
		position: relative;
		overflow-y: auto;
		margin-top: 80px;
	}
	.app_continer{
		margin-top: 0px;
	}
}

#app {
	max-width: 750px;
	margin: 0 auto;
	overflow: hidden;
	font-family: 'Microsoft YaHei';
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	overflow: hidden;
	display: flex;
	flex-direction: column;
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
//   gap: 50px;
  margin-top: 48px;
  .van-button{
    flex: 1;
    border-radius: 12px;
  }
  .footer_cancel{
    color: $color-theme;
    background: #F2F3FF;
    border-color: #F2F3FF;
	margin-left: 25px;
  }
  .footer_confirm{
    color: #fff;
	margin-right: 25px;
    background: $color-theme;
    border-color: $color-theme;
  }
  .update_confirm{
	width: max-content;
	background: rgba($color: $color-theme, $alpha: .7);
    border-color: rgba($color: $color-theme, $alpha: .7);
  }
}
</style>
