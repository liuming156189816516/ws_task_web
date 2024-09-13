import Global from "../core/Global";
import router from  "../router/index";
import CryptoJS from '../utils/crypto-js';
import uniFun from "@/utils/uni-webview-js"
import { getToken } from '@/utils/tool';
import { i18n } from '@/assets/lang'
// const releaseCrypKey = 'ZGdIobme/Sb4Idwg';//加密key
const releaseCrypIv = 'ZGdIobme/Sb4Idwg'
const releaseCrypKey = '8dw/JfjjoMs0dzVGOX2ntb1iw2k9+JD4'
const Helper = {
	//开发环境
	isDevelopment() {
		return process.env.NODE_ENV == 'development';
	},
	//线上测试环境
	isIntest() {
		return !this.isDevelopment() && !this.isRelease();
	},
	//线上正式环境
	isRelease() {
		return !this.isDevelopment() && process.env.VUE_APP_FLAG == 'pro';
	},
	format_time(time) {
		if (!time) return "";
		let date = new Date(time);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let hours = date.getHours();
		let minutes = date.getMinutes();
		let second = date.getSeconds();
		if (month < 10) {
			month = "0" + month;
		}
		if (day < 10) {
			day = "0" + day;
		}
		if (hours < 10) {
			hours = "0" + hours
		}
		if (minutes < 10) {
			minutes = "0" + minutes
		}
		if (second < 10) {
			second = "0" + second
		}
		return `${year}-${month}-${day} ${hours}:${minutes}:${second}`;
	},
	toOutLink(url,kefu, b) {
		if (!url) return;
		url = url.includes("http://") || url.includes("https://") ? url : "http://" + url
		// if(b){
		// 	var winRef = window.open("", "_blank")
		// 	setTimeout(() => {
		// 		winRef.location = url
		// 	}, 500)
		// 	return
		// }
		if (this.openInWebview()) { //判断是否是APP ，客户端打开
			var ua = navigator.userAgent.toLowerCase();
			if (ua.match(/WebApp/i) != null) {
				if(true || Global.Setting.SystemInfo.version){
					if(ua.match(/Android/i) != null || ua.match(/Adr/i) != null){
						Global.NativeEvent.openAppBrowser(url);
					}else{
						var winRef = window.open("", "_blank")
						setTimeout(() => {
							winRef.location = url
						}, 500)
					}
				}else{
					let Base64 = require('js-base64').Base64;
					window.location.href = `openNew://${Base64.encode(url)}`
				}
			} else {}
		} else {
			try {
				if(this.judgeClient()=="Android"){	
					window.open(url, "_blank")
				}else{
					if(kefu){
						if(b){
							var winRef = window.open("", "_blank")
							setTimeout(() => {
								winRef.location = url
							}, 500)
						}else{
							router.push({
								path:'kefu',
								query:{
									url:url
								}
							})
						}
					}else{
						router.push({
							path:'otherUrl',
							query:{
								url:url
							}
						})
					}
				}
			} catch (error) {
				var winRef = window.open("URL", "_blank")
				setTimeout(() => {
					winRef.location = url
				}, 500)
			}
		}
	},
	/*判断客户端IphoneX*/
	isIphoneX() {
		return /iphone/gi.test(window.navigator.userAgent) && (screen.height == 812 && screen.width == 375)
	},
	//是否是原生安卓
	isAndroid() {
		return this.openInWebview() && this.judgeClient() == "Android";
	},
	//是否是原生Ios
	isIos() {
		return this.openInWebview() && this.judgeClient() == "ios"
	},

	isSimulator() {
		const userAgent = navigator.userAgent || navigator.vendor;
		return /iPhone|iPad|iPod|Android/i.test(userAgent);
  	},
	//是否是web端
	isWeb() {
		return !this.openInWebview()
		// return !isWebView.check(navigator.userAgent);
	},
	//重置地址栏
	restAddress() {
		const urlPath = window.location.href.split("?").shift();
		return urlPath+"#/home";
	},
	checkBrowser() {
		if(navigator.userAgent.search("Html5Plus")==-1){
			return true;
		}else{
			return false;
		}
	},
	/*判断客户端*/
	judgeClient() {
		let client = '';
		if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
			client = 'ios';
		} else if (/(Android)/i.test(navigator.userAgent)) { //判断Android
			client = 'Android';
		} else {
			client = 'PC';
		}
		return client;
	},
	openInWebview() {
		var ua = navigator.userAgent.toLowerCase();
		return ua.match(/WebApp/i) != null;
	},
	format_point(val) {
		let str = (Math.floor(val * 100) / 100).toFixed(2)
		let int = parseInt(val);
		return int == Number(str) ? int : str
	},
	//判断版本号 仅在openInWebview中使用
	checkVersion(supportVersion) {
		let version = Global.Setting.SystemInfo.appVersion;
		let numVer = Number(version);
		if (isNaN(numVer) || numVer >= supportVersion) {
			return true;
		}
		return false;
	},
	point(str, value) {
		return this.format(str, [`<span style="color:rgb(255,0,66)">${value}%</span>`]) + "。"
	},
	format(str, value) {
		value.forEach(item => {
			str = str.replace("s%", item);
		})
		return str
	},
	//获取设备信息
	sysInfo() {
		let md = new MobileDetect(window.navigator.userAgent);
		let sysInfo = new Object();
		sysInfo.mobile = md.mobile() ? md.mobile() : "";
		sysInfo.phone = md.phone() ? md.phone() : "";
		sysInfo.tablet = md.tablet() ? md.tablet() : "";
		sysInfo.userAgent = md.userAgent() ? md.userAgent() : "";
		sysInfo.os = md.os() ? md.os() : "";
		sysInfo.isIphone = md.is('iPhone') ? md.is('iPhone') : false;
		sysInfo.isBot = md.is('bot') ? md.is('bot') : false;
		sysInfo.webkitVersion = md.version('Webkit') ? md.version('Webkit') : "";
		sysInfo.osVersion = md.versionStr('Build') ? md.versionStr('Build') : "";
		sysInfo.isXbox = md.match('playstation|xbox') ? md.match('playstation|xbox') : false;
		return {};
	},
	//安卓设备
	checkApkBag(type) {
		if(type==1){
			return !this.checkBrowser()&&this.judgeClient() == "Android"?1:0;
		}else if(type==2){
			return !this.checkBrowser()&&this.judgeClient();
		}else{
			return this.checkBrowser()&&this.judgeClient() == "Android";
		}
	},
	//时间戳转换
	format_newDate(strtime) {
		let date = new Date(strtime.replace(/-/g, '/'));
		return Date.parse(date) / 1000;
	},
	//时间转化
	format_date(date, is_begin, is_today) {
		let YY = date.getFullYear() + '-';
		let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
		let hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
		let mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
		let ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
		if (is_begin) {
			return YY + MM + DD + " " + "00:00:00";
		} else {
			return YY + MM + DD + " " + "23:59:59";
		}
	},

	// 加密
	// encryptByDES(message){
	// 	console.log(message);
    //     let keyHex = CryptoJS.enc.Utf8.parse(releaseCrypKey);
    //     let encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    //         mode: CryptoJS.mode.ECB,
    //         padding: CryptoJS.pad.Pkcs7
    //     });
    //     return encrypted.ciphertext.toString();
	// },
	aesEncrypt(cryptoKey, cryptoIv, msg) {
		let key = CryptoJS.enc.Utf8.parse(cryptoKey)
		let iv = CryptoJS.enc.Utf8.parse(cryptoIv)
		let encrypt = CryptoJS.AES.encrypt(msg, key, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7,
		})
		return encrypt.toString()
	},

	// 加密客户端发送的内容
	aesEncrptMsg(message) {
		let encryParams = {key:""};
		let encryptMsg = this.aesEncrypt(releaseCrypKey,releaseCrypIv, message)
		encryParams.key = encryptMsg;
		return encryParams;
	},

	// 解密客户端收到的内容
	aesDecrptHost(message) {
		let key = CryptoJS.enc.Utf8.parse(releaseCrypKey)
		let iv = CryptoJS.enc.Utf8.parse(releaseCrypIv)
		let decrypted = CryptoJS.AES.decrypt(message, key, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.NoPadding,
		})
		let decryptedStr = decrypted.toString(CryptoJS.enc.Utf8)
		//有控制字符，替换为空
		decryptedStr = JSON.parse(Global.Toolkit.strReplaceCtrChar(decryptedStr));
		return decryptedStr;
	},
	randomString(e) {
		var e = e || 32;
		var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
		a = t.length,
		n = "";
		for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
		return n
	},
	randomStrings(count,type) {
		const result = [];
		let seedArry = [3,4,5,6,7,8,9];
		let winArry = [1800,50,1000,600,5000,200];
		const probabilities = [0.1,0.3,0.1,0.2,0.1,0.2];
		const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const randomString = length => Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
		if(type==1){
			for (let i = 0; i < count; i++) {
				let index = Math.floor(Math.random() * winArry.length);
				let randomNum = this.getRanProbability(winArry,probabilities); 
				// let randomNum = String(Math.floor(100000 + Math.random() * 900000)).slice(0,3);
				let newObj = {name:randomString(6),desc:"Received",goldNum:randomNum}
				result.push(newObj)
			}
		}else{
			for (let i = 0; i < count; i++) {
				let index = Math.floor(Math.random() * seedArry.length);
				let randomNum = String(Math.floor(100000 + Math.random() * 900000)).slice(0,4);
				let newObj = `${randomString(6)} Complet ${index} tasks to earn ${randomNum}`
				result.push(newObj)
			}
		}
		return result;
	},
	getRanProbability(array, probabilities) {
		// 确保概率数组的长度与元素数组一致
		if (array.length !== probabilities.length) {
			throw new Error('数组和概率数组的长度不匹配');
		}
	
		// 确保概率的总和为1
		const totalProbability = probabilities.reduce((acc, prob) => acc + prob, 0);
		if (totalProbability !== 1) {
			throw new Error('概率总和必须为1');
		}
	
		// 计算每个元素的累积概率
		const cumulativeProbabilities = [];
		let cumulativeSum = 0;
		for (const prob of probabilities) {
			cumulativeSum += prob;
			cumulativeProbabilities.push(cumulativeSum);
		}
	
		// 生成一个0到1之间的随机数
		const random = Math.random();
	
		// 根据随机数选择元素
		for (let i = 0; i < cumulativeProbabilities.length; i++) {
			if (random < cumulativeProbabilities[i]) {
				return array[i];
			}
		}
	},
	
	// // 示例数据
	// const elements = ['apple', 'banana', 'cherry'];
	// const probabilities = [0.5, 0.3, 0.2]; // 确保这些概率加起来是1
	
	// const randomElement = getRandomElementWithProbability(elements, probabilities);
	// console.log(randomElement);
	
	defaultOption() {
		return [{status:1,task_info_id:"",type:3},{status:1,task_info_id:"",type:4},{status:1,task_info_id:"",type:2}];
		// return [{status:1,task_info_id:"",type:3},{status:1,task_info_id:"",type:2}];
	},
	langOptions(){
		return [{ lang: "zh", name: "zh_CN" },{ lang: "es", name: "España" }];
		// return [{ lang: "en", name: "en-US" }, { lang: "zh", name: "zh_CN" },{ lang: "es", name: "España" }];
	},
	globalSupport(){
		// if (this.checkBrowser()) {
		// 	window.open(process.env.VUE_APP_SERVEIC, "_blank");
		// } else {
		// 	uniFun.postMessage({ data:process.env.VUE_APP_SERVEIC });
		// }
		window.likevm.$router.replace('/service');
	},
	globalService(){
		if (this.checkBrowser()) {
			window.open(process.env.VUE_APP_SERVEIC, "_blank");
		} else {
			uniFun.postMessage({ data:process.env.VUE_APP_SERVEIC });
		}
	},
	RedirectLogin(){
		if(getToken()) return;
		window.likevm.$router.replace('/login');
	},
	//获取地址栏参数，key:参数名称
	getUrlParams(key) {
		let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
		let r = window.location.search.slice(1).match(reg);
		if (r != null) return decodeURIComponent(r[2]);
		return null;
	},
	//重置语言
	initLanguage(lang) {
		let storeLang = Cookies.get("language");
		if(storeLang&&!lang){
			i18n.locale = storeLang;
		}else{
			let setLang = lang||"es";
			i18n.locale = setLang;
			Cookies.set("language",setLang)
		}
	}
};
export default Helper;