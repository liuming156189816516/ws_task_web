<template>
	<div class="withdraw">
		<div class="panel">
			<page-header :title="$t('mine_002')" :show-icon="true" :bgColor="true"></page-header>
			<!-- <van-tabs title-active-color="#ff9600" :active="curIndex" @change="onChange">
                <van-tab :title="item" v-for="(item,idx) in personList" :key="idx"></van-tab>
            </van-tabs> -->
			<div class="draw_main">
				<div class="card_box">
					<div class="card">
						<div class="title">
							<span>{{ $t('pay_004') }}</span>
						</div>
						<div class="amount van-ellipsis">
							<img src="@/assets/images/gold_icon.png">
							{{ WithdMoney || 0 }}≈{{ income_naira || 0 }}<span>{{ $t('pay_024') }}</span>
						</div>
						<div class="btn_withdraw">
							<van-button type="primary" @click="submitBtn">{{ $t('pay_005') }}</van-button>
						</div>
					</div>
				</div>
				<div class="share_box">
					<div class="share_link">
						<span class="account_name" v-text="curIndex==0?$t('login_026')+'：':$t('pay_014')+'：'"></span>
						<span class="account_text" v-text="curIndex==0?card_no||$t('pay_006'):card_no||$t('pay_014',{value:$t('pay_014')})"></span>
					</div>
					<div class="share_btn" @click="bindCardBtn">
						<van-button type="primary">{{curIndex==0&&card_no?$t('pay_008'):curIndex==1&&card_no?$t('pay_008'):$t('pay_007')}}</van-button>
					</div>
				</div>
			</div>
		</div>
		<div class="tip">
			<div class="cash_adverice">
				<div class="title-tip">{{ $t('pay_009') }}</div>
				<div class="title_item">
					<van-tag type="warning" /> {{$t('pay_010',{value:withdraw_cash})}}
				</div>
				<div class="title_item">
					<van-tag type="warning" />
					{{ $t('pay_025',{value:withdraw_times}) }}
				</div>
				<div class="title_item">
					<van-tag type="warning" />
					{{ $t('pay_012') }}
				</div>
				<div class="title_item">
					<van-tag type="warning" />
					{{ $t('pay_026') }}
				</div>
			</div>
		</div>
		<van-popup :close-on-click-overlay="false" :overlay="true" v-model="showModel">
			<div class="dialog_content">
				<div class="header_title">{{ $t('pay_027') }}</div>
				<!-- <div class="header_title">{{ $t('pay_001') }}</div>
				<div class="header_tips">{{ $t('pay_015',{value:WithdMoney}) }}</div> -->
				<van-cell-group inset :border="false" style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
					<van-field v-model="withdraw_num" type="number" clearable placeholder="0" oninput="value=value.replace(/[^\w_]/g,'')" />
				</van-cell-group>
				<div class="auto_computed">{{withdraw_num||0}}{{ $t('pay_027') }}≈{{withdraw_num*0.03}}{{ $t('pay_024') }}</div>
				<div class="custom_dialog__footer">
					<van-button class="custom_dialog_cancel" @click="showModel=false">{{ $t('other_007') }}</van-button>
					<span class="model_line"></span>
					<van-button class="custom_dialog_confirm" :loading="isLoading" :loading-text="$t('other_012')" @click="withdrawBtn">{{ $t('other_003') }}</van-button>
				</div>
			</div>
		</van-popup>
	</div>
</template>
<script>
import { getaccountincome} from '@/api/home';
import { getwithdrawcard,savewithdrawapproval,getwithdrawconfig } from '@/api/pay';
import PageHeader from '@/components/Header';
import { setTimeout } from 'timers';
export default {
	components: { PageHeader },
	data() {
		return {
			card_no:"",
			bank_name:"",
			payee_name:"",
			curIndex:"0",
			WithdMoney:0,
			bank_code:"",
			identify_Num:"",
			income_naira:0,
			userInfo:"",
			account_type:"",
			isLoading:false,
			withdraw_num:null,
			withdraw_times:null,
			withdraw_cash:null,
			is_withdraw: false,
			showModel: false,
			is_prevent: false
		}
	},
	computed: {
		personList(){
			return [this.$t('pay_002')];
			// return [this.$t('pay_002'),this.$t('pay_003')];
		}
    },
	created() {
		this.syncInitApi();
		this.getBankInfo();
	},
	mounted() {
		if (this.$route.params && this.$route.params.back) {
			this.is_prevent = true;
		}
	},
	methods: {
		syncInitApi(){
            let fun1 = new Promise((resolve,reject)=>{
                getaccountincome().then(res =>{
                    resolve(res)
                })
            });
            let fun2 = new Promise((resolve,reject)=>{
                getwithdrawconfig().then(res =>{
                    resolve(res)
                })
            });
            Promise.all([fun1,fun2]).then( res => {
                const [{income,income_naira},{limit_amount,limit_count,limit_count_status}] = res;
				this.WithdMoney = income||0;
				this.income_naira = income_naira||0;
				this.withdraw_times = limit_count||0;
				this.withdraw_cash = limit_amount||0;
				this.is_withdraw = limit_count_status||false;
            })
        },

		async getBankInfo(){
			let { card_no,payee_name,identify_Num,type } = await getwithdrawcard({type:Number(this.curIndex)+1});
			this.card_no = card_no||"";
			this.account_type = type||"";
			this.payee_name = payee_name||"";
			this.identify_Num = identify_Num||"";
		},
		onChange(idx){
			this.curIndex=idx;
			this.getBankInfo();
		},
		testingMoney(){
			if(!/^[1-9]\d*00$/.test(this.WithdMoney)){
				if(this.WithdMoney<100){
					this.WithdMoney=100
				}else{
					this.WithdMoney=this.WithdMoney.slice(0,1)+'00'
				}
			}
		},
		submitBtn() {
			this.withdraw_num = "";
			let payIdx = Number(this.curIndex+1);
			if(!this.is_withdraw) return this.$toast(this.$t('pay_029'));
			if(payIdx==1&&!this.card_no){
				return this.$toast(this.$t('other_001',{value:this.$t('pay_013')}));
			} else if(payIdx==2&&!this.card_no){
				return this.$toast(this.$t('other_001',{value:this.$t('pay_014')}));
			} else if(this.WithdMoney<this.withdraw_cash){
				return this.$toast(this.$t('pay_017'));
			}
			this.showModel=true;
		},
		async withdrawBtn(){
			if(!this.card_no) return this.$toast(this.$t('other_001',{value:this.$t('pay_013')}));
			if(this.withdraw_num > this.WithdMoney || this.withdraw_num<=0){
				return this.$toast(this.$t('pay_018'));
			}else if(this.withdraw_num % 1 != 0){
				return this.$toast(this.$t('pay_019'));
			}else if(this.withdraw_num < this.withdraw_cash){
				return this.$toast(this.$t('pay_028',{value:this.withdraw_cash}));
			}
			let params = {
				card_no:this.card_no,
				payee_name:this.payee_name,
				type:this.account_type,
				identify_Num:this.identify_Num,
				amount:Number(this.withdraw_num)
			}
			this.isLoading = true;
			let res = await savewithdrawapproval(params);
			this.isLoading = false;
			if(res.code) return;
			this.withdraw_num = "";
			this.$toast(this.$t('other_013'));
			setTimeout(() => {this.$router.go(-1)},1000);
		},
		getPutPoint() {
			let init = (this.userInfo.point || 0) / 10000;
			init = init - (init % (this.userInfo.hundred || 1));
			let min = this.curIndex==0?this.userInfo.min_point_ali:this.curIndex==1?this.userInfo.min_point:100;
			let max = this.curIndex==0?this.userInfo.max_point_ali:this.curIndex==1?this.userInfo.max_point_ali:10000000;
			if (init < min) {
				return 0;
			} else if (init > max) {
				return max * 10000;
			} else {
				return init * 10000;
			}
		},
		bindCardBtn(){
			// this.$router.push("/personCenter");
			this.$router.push({path:'/personCenter', query: { type:Number(this.curIndex)+1 } });
		}
	},
};
</script>
<style lang="scss" scoped>
.editor-icon {
	width: 32px;
}
.withdraw {
	width: 100%;
	float: left;
	overflow-y: auto;
	height: 100vh;
	position: relative;
	background-color: #fff;
	-webkit-overflow-scrolling: touch;


	.header {
		background: #000000;
		padding: 0.3rem 0.4rem;
		.nav {
			height: 46px;
			display: flex;
			justify-content: space-between;
			color: #ffffff;
			align-items: center;
			font-size: 32px;
			.ke-fu-icon {
				img {
					width: 42px;
					height: 42px;
				}
			}
		}
	}
	.panel {
		width: 100%;
		float: left;
		box-sizing: border-box;
		position: relative;
		z-index: 3;
		box-sizing: border-box;
		// background-image: url('../../assets/images/home/shouye_01.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		.draw_main{
			display: flex;
			width: 100%;
			flex-direction: column;
			padding: 0 24px 0 24px;
			box-sizing: border-box;
			.card_box {
				width: 100%;
				margin-bottom: 24px;
				padding-top: 30px;
				.card {
					height: 447px;
					background-color: $color-theme;
					border-radius: 10px;
					text-align: center;
					border-radius: 20px;
					.title {
						padding-top: 64px;
						font-size: 28px;
						// color: rgb(102, 102, 102);
						// 
						span {
							vertical-align: middle;
							color: #fff;
						}
						img {
							height: 0.34rem;
							width: 0.4rem;
							vertical-align: middle;
						}
					}
					.amount {
						display: flex;
						color: #fff;
						margin-top: 40px;
						font-size: 75px;
						font-weight: 500;
						align-items: center;
						justify-content: center;
						font-family: 'Arial MT';
						img{
							height: 56px;
							margin-right: 10px;
						}
						span{
							display: flex;
							align-items: end;
							font-size: 24px;
							margin-left: 10px;
							margin-top: 25px;
						}
					}
					.desc {
						display: flex;
						padding: 40px 0;
						margin-top: 10px;
						span {
							color: #cccccc;
							border-left: 1px solid #cccccc;
						}
					}
					.btn_withdraw {
						width: 100%;
						float: left;
						padding: 0 50px;
						// margin-top: 57px;
						box-sizing: border-box;
						.van-button {
							width: 100%;
							padding: 0;
							height: 44px;
							border-radius: 44px;
							font-size: 0.32rem;
							font-weight: bold;
							border-color: #fff;
							background-color: #fff;
							color: $color-theme;
						}
					}
				}
			}
		}
		.share_box{
			width: 100%;
			display: flex;
			padding: 38px 32px;
			box-sizing: border-box;
			background: #FFE9E9;
			border-radius: 20px;
			.share_link, .share_btn{
				flex-grow: 1;
				// justify-content: space-between;
				.van-button{
					width: 56px;
					height: 24px;
					color: #feeeee;
					float: right;
					font-size: 12px;
					border-radius: 20px;
					border-color: $color-theme;
                    background-color: $color-theme;
				}
			}
			.share_link{
				display: flex;
				font-size: 28px;
				// flex-wrap: wrap;
				align-items: center;
				.account_name{
					font-weight: 400;
					color: #666666;
				}
				.account_text{
					width: max-content;
					color:#999999;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowra
				}
				p:nth-child(2){
					color: #F52C2C;
				}
			}
			.share_btn{
				flex-grow: 0;
			}
		}
	}
	.tip {
		width: 100%;
		display: flex;
		font-size: 28px;
		color: #666666;
		line-height: 54px;
		padding: 0 30px;
		flex-direction: column;
		.bank_account {
			width: 100%;
			float: left;
			padding: 22px 0;
			// margin-bottom: 40px;
			border-bottom: 1px solid #ebedf0;
			.van-cell {
				width: 80%;
				float: left;
				padding: 0;
			}
			.van-hairline--top-bottom::after,
			.van-hairline-unset--top-bottom::after {
				border-width: 0;
			}
			.revise_account {
				width: 120px;
				height: 0;
				float: right;
				line-height: 0px;
				color: $color-theme;
				margin-top: 4px;
				padding: 32px 0 28px 30px;
				border-radius: 10px;
				border-color: $color-theme;
				background-color: transparent;
				.van-button__text {
					margin-left: 0px;
				}
				.van-button__icon {
					margin-right: -45px;
					margin-top: -1px;
				}
			}
		}
		.pay_type {
			padding-bottom: 0;
			border-bottom: transparent;
			.van-cell {
				padding: 16px 0;
				width: 100%;
				border-bottom: 1px solid #ebedf0;
				.van-cell__title,
				.van-cell__value {
					padding-left: 20px;
				}
			}
		}
		.item {
			width: 100%;
			float: left;
			padding: 20px 0;
			margin-bottom: 20px;
			border-bottom: 1px solid #e6e6e6;
			.title {
				float: left;
				font-size: 34px;
				color: #666666;
				letter-spacing: 0.58px;
			}
			.fake-input {
				width: 4rem;
				float: left;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-left: 30px;
				font-size: 30px;
				color: #999999;
				&.active {
					color: #000000;
					font-weight: 500;
				}
			}
			.fake-btn {
				width: 100px;
				display: flex;
				line-height: initial;
				padding: 2px 0;
				color: #000;
				align-items: center;
				justify-content: center;
				border-radius: 10px;
				border: 1px solid #000;
				// position: absolute;
				// top: 0.3rem;
				// right: 0.2rem;
				// top: 0.25rem;
				// color: #000;
				// width: 100px;
				// height: 0;
				// line-height: 0;
				// padding: 30px 0 20px 0;
				// text-align: center;
				// border: 1px solid #000;
				// border-radius: 10px;
			}
		}
		.cash_adverice {
			width: 100%;
			float: left;
			margin-top: 20px;
			padding-left: 20px;
			padding-bottom: 20px;
			box-sizing: border-box;
			.trends_content {
				color: #ee0a24;
				font-weight: 600;
				font-size: 32px;
			}
			.title_item{
				line-height: 1.3;
				margin-bottom: 20px;
			}
		}
		.title-tip {
			font-size: 35px;
			color: #000000;
			font-weight: 500;
			padding: 0.1rem 0;
		}
		.blue {
			margin-left: 4px;
			color: $color-theme;
			text-decoration: underline;
		}
		.red {
			color: $home-risk-value;
		}
	}
}
.van-popup{
	width: calc(100% - 40px);
	border-radius: 8px;
	overflow: hidden;
	.dialog_content{
		width: 100%;
		display: flex;
		padding-top: 20px;
		flex-direction: column;
		.header_title, .custom_dialog__footer{
			display: flex;
			justify-content: center;
		}
		.header_title{
			font-size: 24px;
			margin-bottom: 20px;
		}
		.auto_computed{
			width: 100%; 
			display: flex;
			font-size: 16px; 
			padding: 10px 0;
			align-items: center;
			justify-content: center;
		}
		.header_tips{
			display: flex;
			font-size: 16px;
			margin: 10px 0;
			padding: 10px 20px;
			justify-content: center;
			box-sizing: border-box;
		}
		.van-cell-group{
			display: flex;
			width: 100%;
			justify-content: center;
			box-sizing: border-box;
			.van-cell{
				width: 180px;
				border-radius: 4px;
				padding: 6px 10px;
				text-align: center;
				background-color: #f2f3f5;
				::v-deep .van-field__control{
					text-align: center;
				}
			}
		}
		.custom_dialog__footer{
			display: flex;
			border-top: 1px solid #f2f3f5;
			.van-button{
				flex: 1;
				border: none;
				background: none;
				font-size: 16px;
				border-radius: 0;
			}
			.model_line{
				width: 0;
				border-left: 1px solid #f2f3f5;
			}
			.custom_dialog_confirm{
				color: $home-copay-title;
			}
		}
	}
}
::v-deep .van-tabs__line{
	background-color: $home-copay-title;
}
</style>
