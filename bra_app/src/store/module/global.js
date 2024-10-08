import router from "../../router";
import { getToken } from '@/utils/tool';
export default {
	namespaced: true,
	state: {
		isType:null,
		logOut:false,
		isLogin:false,
		keepAliveComponents: [],
		matainInfo: {
			startTime: '--:--:--',
			endTime: '--:--:--'
		},
		locale:process.env.VUE_APP_LOCALE,
		bank_list:{},
		tied_list:{},
		card_types:{},
		webSiteConfig:{},
		message_list:{},
		announce_list:{},
		maintain:{},
		forbidden:{},
		applying_list:[],
		task_collection: {
			0: [],
			1: [],
			2: [],
			3: [],
			4: [],
			5: []
		},
		task_list:[],
		home_list:[],
		list_total:[],
		home_total:[],
		updateTaskAddList:false,//刷新任务详情的接口，socket接收到消息后改变他，在页面watch
	},
	mutations: {
		keepAlive (state, component) {
			!state.keepAliveComponents.includes(component) &&state.keepAliveComponents.push(component)
		},
		noKeepAlive (state, component) {
			const index = state.keepAliveComponents.indexOf(component)
			index !== -1 &&
			state.keepAliveComponents.splice(index, 1)
		},
		clearKeepAlive (state, component) {
			state.keepAliveComponents = [];
		},
		setMaintainInfo(state, errData) {
			this.maintain = errData;
			state.maintain = errData.forbidden;
			router.push({
				name:'maintain',
				params:errData,
			})
		},
		triggerUdateTaskAddList(state){
			state.updateTaskAddList=!state.updateTaskAddList;
		},
		STORE_LOGIN(state, value) {
			state.isType = value.type;
			state.isLogin = value.isShow;
		},
		STORE_Type(state, value) {
			state.isType = value;
		},
		STORE_tips(state, value) {
			state.logOut = value;
		}
	},
	actions:{
		isShowLogin({ commit },params) {
			commit('STORE_LOGIN', params);
		},
		isShowType({ commit },type) {
			commit('STORE_Type', type);
		},
		isCloseTips({ commit },type) {
			commit('STORE_tips', type);
		},
		applying_task({state}){
			get_applying_list().then(data=>{
				state.applying_list = data;
			})
		},
		async task_plan_list({state}, params) {
			if(params.page == 1){
				state.task_collection[params.vip] = [];
			}
			return new Promise((resolve, reject) => {
				task_collection(params).then(data=>{
					let result = data.list || [];
					state.task_collection[params.vip] = state.task_collection[params.vip].concat(result);
					resolve(result.length < params.limit)
				}).catch(reason => reject(reason))
			})
		},
		applicable_task({state}, data){
			return new Promise((resolve, reject) => {
				const {page,limit,status} = data;
				mytask({page: page, limit: limit, status: status}).then(
					data => {
						if (page > 1) {
							state.task_list.push(...data.list)
						} else {
							state.task_list = data.list || [];
						}
						state.list_total = data.total;
						resolve(data.list.length < limit)
					}
				).catch(reason => reject(reason));
			})
		},
		// // 用户未登录行为上报
		// loggedInReport({state}, data){
		// 	return new Promise((resolve, reject) => {
		// 		buriedpointlogout({type:data}).then (res => {
		// 			resolve()
		// 		}).catch(error => {
		// 			reject(error);
		// 		})
		// 	})
		// }
	}
}
