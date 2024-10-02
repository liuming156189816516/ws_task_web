<template>
    <div class="bottom-box">
		<div class="six-tabbar">
			<div class="six-tabbar-item"  v-for="(item,idx) in tabBarList" :key="idx" @touchstart.stop="handlePage(item.path)">
				<div class="item_bg">
					<img class="icon-cl" :class="{'animate__animated animate__rotateIn':$route.path.includes(item.path)}" :src="$route.path.includes(item.path)?item.active:item.inactive" alt="icons" />
					<!-- <span :class="['notoce_tips',userInfo.sysNotice?'notoce_active':'']" v-if="item.path=='/mine'"></span> -->
				</div>
				<div class="tabbar_name font_24" >
					<span :class="{active: $route.path.includes(item.path)}" >{{$t(item.name)}}</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import { getToken } from '@/utils/tool';
export default {
    data() {
        return {
            active: 0,
            newStatus:0,
			tabBarList: [
				{
					name: "table_001",
					active: require("../assets/images/new_tab/home-icon-a.png"),
					inactive: require("../assets/images/new_tab/home-icon.png"),
					path: "/home"
				},
				{
					name: "table_002",
					active: require("../assets/images/new_tab/prom_icon-a.png"),
					inactive: require("../assets/images/new_tab/prom_icon.png"),
					path: "/spread"
				},
				{
					name: "table_003",
					active: require("../assets/images/new_tab/server-icon-a.png"),
					inactive: require("../assets/images/new_tab/server-icon.png"),
					path: "/service"
				},
				{
					name: "table_004",
					active: require("../assets/images/new_tab/mine-icon-a.png"),
					inactive: require("../assets/images/new_tab/mine-icon.png"),
					path: "/mine"
				}
			]
        }
    },
	computed: {
        ...mapState({
            userInfo: state => state.User,
        })
	},
	// created(){
	// 	console.log(this.userInfo);
	// },
    methods: {
        handlePage(path) {
			if(this.$route.path !== '/login'&&!getToken()){
				return this.$router.push("/login");
			}else{
				this.$router.push(path);
			}
        }
    }
};
</script>
<style lang='scss'>
.bottom-box {
	width: 750px;
	height: 98px;
	position: fixed;
	left: 50%;
	bottom: 0;
	z-index: 9;
	box-sizing: content-box;
	transform: translateX(-50%);
	box-shadow: 10px 10px 10px 10px #f2f2f2;
	-moz-box-shadow: 10px 10px 10px 10px #f2f2f2;
	border-top: 1px solid #E6E6E6;
	.six-tabbar, .un-login {
		height: 100%;
		width: 100%;
		display: flex;
		display: -webkit-box;
		display: -webkit-flex;
		background: #ffffff;
		.six-tabbar-item {
			display: -webkit-box;
			display: -webkit-flex;
			display: flex;
            flex: 1;
			position: relative;
			-webkit-box-orient: vertical;
			-webkit-box-direction: normal;
			-webkit-flex-direction: column;
			flex-direction: column;
			-webkit-box-align: center;
			-webkit-align-items: center;
			align-items: center;
			-webkit-box-pack: center;
			-webkit-justify-content: center;
			justify-content: center;
			font-size: 42px;
			color: #666666;
			line-height: 1;
			.active {
				color: $color-theme;
				font-weight: bold;
			}
			.item_bg{
				position: relative;
			}
		}
	}
	.un-login {
		height: 88px;
		background: rgba(0, 0, 0, 0.8);
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		.login-text {
			font-size: 32;
			color: #ffffff;
			margin-right: 3%;
		}
		& > div > .login-btn {
			display: block;
			text-align: center;
			color: #fff;
			height: 58px;
			line-height: 60px;
			width: 160px;
			font-size: 28px;
			background-color: #7a98f9;
			border: 1px solid;
			border-radius: 29px;
		}
	}
	.icon-cl {
		height: 40px;
	}
	.tabbar_name {
		font-weight: 500;
		color: $home-title-12;
		margin-top: 2px;
	}
}
.recommend{
	z-index: 1;
	font-size: 92px;
}

.animate__animated.animate__flip2 {
    -webkit-backface-visibility: visible;
    backface-visibility: visible;
    -webkit-animation-name: flip2;
    animation-name: flip2;
}
@keyframes flip2 {
	0% {
		-webkit-transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg);
		transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg);
		-webkit-animation-timing-function: ease-out;
		animation-timing-function: ease-out;
	}
	40% {
		-webkit-transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 1.1) rotate3d(0, 1, 0, -190deg);
		transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 1.1) rotate3d(0, 1, 0, -190deg);
		-webkit-animation-timing-function: ease-out;
		animation-timing-function: ease-out;
	}
	50% {
		-webkit-transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 1.1) rotate3d(0, 1, 0, -170deg);
		transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 1.1) rotate3d(0, 1, 0, -170deg);
		-webkit-animation-timing-function: ease-in;
		animation-timing-function: ease-in;
	}
	80% {
		-webkit-transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
		transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
		-webkit-animation-timing-function: ease-in;
		animation-timing-function: ease-in;
	}
	100% {
		-webkit-transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
		transform: perspective(4rem) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
		-webkit-animation-timing-function: ease-in;
		animation-timing-function: ease-in;
	}
}
.isPcBottom{
	max-width: 750px;
	margin: 0 auto;
	left: 50%;
	transform: translateX(-50%);
}
</style>