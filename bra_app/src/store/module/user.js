import router from '../../router/';
import { getincome,getaccountincome } from'@/api/home'
import scehelper from '@/utils/helper';
import { getusermessagelstatus } from '@/api/home';
import { login,register,getcarousellist,gethead } from '@/api/login';
// import { buriedpoint,buriedpointlogout } from '@/api/login';
export default {
	namespaced: true,
	state: {
		allIncome:"",
		avatar:""||0,
		interval: null,
		market: false,
		httpManager: {},
		uid:window.localStorage.getItem('uid') || null,
		token: window.localStorage.getItem('token') || null,
		account: window.localStorage.getItem('account') || null,
		userInfo:window.localStorage.getItem('baseUserInfo') || 0,
		baseBanner: window.localStorage.getItem('baseBanner')||null,
		baseNotice: window.localStorage.getItem('baseNotice')||null,
		inviteCode: window.localStorage.getItem('inviteCode')||null,
		sysNotice: window.localStorage.getItem('sysNotice')||true,
		config: {
			ex_rate: 3,
			first_point: 0,
			first_type: 1,
			list: [],
			mini_point: 10,
			put_fee: 0,
			return_point: 0
		},
		footerGet: [false, false, false],
		appList: [],
		userHeadList: [
			require('../../assets/images/head/1.png'),
			require('../../assets/images/head/2.png'),
			require('../../assets/images/head/3.png'),
			require('../../assets/images/head/4.png'),
			require('../../assets/images/head/5.png'),
			require('../../assets/images/head/6.png'),
			require('../../assets/images/head/7.png'),
			require('../../assets/images/head/8.png'),
			require('../../assets/images/head/9.png'),
			require('../../assets/images/head/10.png'),
			require('../../assets/images/head/11.png'),
			require('../../assets/images/head/12.png'),
			require('../../assets/images/head/13.png'),
			require('../../assets/images/head/14.png'),
			require('../../assets/images/head/15.png'),
			require('../../assets/images/head/16.png'),
			require('../../assets/images/head/17.png'),
			require('../../assets/images/head/18.png'),
			require('../../assets/images/head/19.png'),
			require('../../assets/images/head/20.png'),
		]
	},
	mutations: {
		updateAppList(state, value) {
			state.appList = value;
		},
		store_info: (state, data) => {
			const {token,user_info:{uid,account,invite_code,tutorial_list}} = data;
			state.uid = uid;
			state.token = token;
			state.account = account;
			state.inviteCode = invite_code;
			window.localStorage.setItem('uid',uid);
			window.localStorage.setItem('token',token);
			window.localStorage.setItem('account',account);
			window.localStorage.setItem('inviteCode',invite_code);
			if(tutorial_list&&tutorial_list.length>0){
				for (let k = 0; k < tutorial_list.length; k++) {
					if(tutorial_list[k] === 1){
						localStorage.setItem('step_01',true);
					}
					if(tutorial_list[k] === 2){
						localStorage.setItem('step_02',true);
					}
					if(tutorial_list[k] === 3){
						localStorage.setItem('step_03',true);
					}
					if(tutorial_list[k] === 4){
						localStorage.setItem('step_04',true);
					}
				}
			}
			// this.dispatch('User/plantCarousel');
		},
		clearUserInfo: (state, data) => {
			localStorage.removeItem('token');
			state.token = null;
			state.uid = '';
			state.appKey = null;
			state.IMtoken = null;
			state.userInfo = {};
		},
		closeInterval(state) {
			if (state.interval) {
				clearInterval(state.interval);
				state.interval = null;
			}
		},
		store_income(state, data) {
			state.allIncome = data;
		},
		store_head(state, data) {
			state.avatar = data;
		},
		store_carousel(state, data) {
			state.baseBanner = data.list;
			// state.baseNotice = data.bulletin_content;
			window.localStorage.setItem('baseBanner',data.list);
			// window.localStorage.setItem('baseNotice',data.bulletin_content);
		},
		store_balance(state, data) {
			state.userInfo = data;
			window.localStorage.setItem('baseBalance ',data);
		},
		store_notice(state, data) {
			state.sysNotice = data;
			window.localStorage.setItem('sysNotice ',data);
		},
		clear_token(state){
			state.uid = "";
			state.token = null;
			localStorage.removeItem('uid');
			localStorage.removeItem('token');
			localStorage.removeItem('account');
			localStorage.removeItem('inviteCode');
			localStorage.removeItem('step_01');
			localStorage.removeItem('step_02');
			localStorage.removeItem('step_03');
			localStorage.removeItem('step_04');
		}
	},
	actions: {
		userLogin({ commit,dispatch}, params ,callback) {
			commit('clearUserInfo');
			return new Promise((resolve, reject) => {
				login(params).then (res => {
					const userData = scehelper.aesDecrptHost(res);
					if(userData.token){
						commit('store_info', userData);
						resolve(userData)
						// dispatch('getUserHead');
						// dispatch('plantCarousel');
					}
					resolve(userData)
				}).catch(error => {
					reject(error);
				})
			})
		},
		userRegister({ commit,dispatch }, params) {
			commit('clearUserInfo');
			return new Promise((resolve, reject) => {
				register(params).then(res => {
					if(res.code){
						resolve(res);
					}else{
						const userData = scehelper.aesDecrptHost(res);
						commit('store_info', userData);
						resolve(userData);
					}
				}).catch(error => {
					reject(error)
				})
			})
		},
		getUserHead({ commit },params) {
			return new Promise((resolve, reject) => {
				gethead(params).then(res => {
					commit('store_head', res.head||0);
					resolve(res);
				}).catch(error => {
					reject(error)
				})
			})
		},
		userIncome({ commit }) {
			return new Promise((resolve, reject) => {
				getincome().then(res => {
					commit('store_income', res);
					resolve();
				}).catch(error => {
					reject(error)
				})
			})
		},
		plantCarousel({ commit }) {
			return new Promise((resolve, reject) => {
				getcarousellist().then(res => {
					commit('store_carousel', res);
					resolve();
				}).catch(error => {
					reject(error)
				})
			})
		},
		getUserIncome({ commit }) {
			return new Promise((resolve, reject) => {
				getaccountincome().then(res => {
					commit('store_balance', res);
					resolve();
				}).catch(error => {
					reject(error)
				})
			})
		},
		getSysNotice({ commit }) {
			return new Promise((resolve, reject) => {
				resolve();
				getusermessagelstatus().then(res => {
					commit('store_notice', res.status);
					resolve();
				}).catch(error => {
					reject(error)
				})
			})
		},
		logoutClear({ commit }) {
			commit('clear_token');
		},
		logoutClearAndJump({ commit }) {
			commit('clearUserInfo');
		},
		// 用户登录行为上报
		actionReport({state}, data){
			// return new Promise((resolve, reject) => {
			// 	buriedpoint({uid:state.uid,type:data}).then (res => {
			// 		resolve()
			// 	}).catch(error => {
			// 		reject(error);
			// 	})
			// })
		}
	},
	modules: {}
};
