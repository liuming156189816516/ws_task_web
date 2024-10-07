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
		// return [{status:1,task_info_id:"",type:5},{status:1,task_info_id:"",type:2}];
        return [{status:1,task_info_id:"",type:5},{status:1,task_info_id:"",type:3},{status:1,task_info_id:"",type:2}];
		// return [{status:1,task_info_id:"",type:3},{status:1,task_info_id:"",type:2},{status:1,task_info_id:"",type:4}];
	},
	langOptions(){
		// return [{ lang: "zh", name: "zh_CN" },{ lang: "es", name: "España" }];
		return [{icon:"en", lang: "en", name: "en-GB" },{icon:"zh", lang: "zh", name: "zh-CN" },{icon:"es", lang: "es", name: "es-MX" },{icon:"br", lang: "br", name: "pt-BR" }];
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
	},
	countryList(){
		return [{
            name: "Afghanistan",
            code: "+93"
        }, {
            name: "Albania",
            code: "+355"
        }, {
            name: "Algeria",
            code: "+213"
        }, {
            name: "American Samoa",
            code: "+1684"
        }, {
            name: "Andorra",
            code: "+376"
        }, {
            name: "Angola",
            code: "+244"
        }, {
            name: "Anguilla",
            code: "+1264"
        }, {
            name: "Antigua & Barbuda",
            code: "+1268"
        }, {
            name: "Argentina",
            code: "+54"
        }, {
            name: "Armenia",
            code: "+374"
        }, {
            name: "Aruba",
            code: "+297"
        }, {
            name: "Ascension Island",
            code: "+247"
        }, {
            name: "Australia",
            code: "+61"
        }, {
            name: "Austria",
            code: "+43"
        }, {
            name: "Azerbaijan",
            code: "+994"
        }, {
            name: "Bahamas",
            code: "+1242"
        }, {
            name: "Bahrain",
            code: "+973"
        }, {
            name: "Bangladesh",
            code: "+880"
        }, {
            name: "Barbados",
            code: "+1246"
        }, {
            name: "Barbuda",
            code: "+1268"
        }, {
            name: "Belarus",
            code: "+375"
        }, {
            name: "Belgium",
            code: "+32"
        }, {
            name: "Belize",
            code: "+501"
        }, {
            name: "Benin",
            code: "+229"
        }, {
            name: "Bermuda",
            code: "+1441"
        }, {
            name: "Bhutan",
            code: "+975"
        }, {
            name: "Bolivia",
            code: "+591"
        }, {
            name: "Bosnia & Herzegovina",
            code: "+387"
        }, {
            name: "Botswana",
            code: "+267"
        }, {
            name: "Brazil",
            code: "+55"
        }, {
            name: "British Indian Ocean Territory",
            code: "+246"
        }, {
            name: "British Virgin Islands",
            code: "+1284"
        }, {
            name: "Brunei",
            code: "+673"
        }, {
            name: "Bulgaria",
            code: "+359"
        }, {
            name: "Burkina-faso",
            code: "+226"
        }, {
            name: "Burundi",
            code: "+257"
        }, {
            name: "Cameroon",
            code: "+237"
        }, {
            name: "Canada",
            code: "+1"
        }, {
            name: "Cape Verde",
            code: "+238"
        }, {
            name: "Caribbean Netherlands",
            code: "+5997"
        }, {
            name: "Cayman Is.",
            code: "+1345"
        }, {
            name: "Central African Republic",
            code: "+236"
        }, {
            name: "Chad",
            code: "+235"
        }, {
            name: "Chile",
            code: "+56"
        }, {
            name: "China mainland",
            code: "+86"
        }, {
            name: "Christmas Island",
            code: "+61"
        }, {
            name: "Cocos (Keeling) Islands",
            code: "+61"
        }, {
            name: "Colombia",
            code: "+57"
        }, {
            name: "Comoros",
            code: "+269"
        }, {
            name: "Congo - Brazzaville",
            code: "+242"
        }, {
            name: "Congo - Kinshasa",
            code: "+243"
        }, {
            name: "Cook Is.",
            code: "+682"
        }, {
            name: "Costa Rica",
            code: "+506"
        }, {
            name: "Croatia",
            code: "+385"
        }, {
            name: "Curaçao",
            code: "+5999"
        }, {
            name: "Cyprus",
            code: "+357"
        }, {
            name: "Czechia",
            code: "+420"
        }, {
            name: "Denmark",
            code: "+45"
        }, {
            name: "Diego Garcia",
            code: "+246"
        }, {
            name: "Djibouti",
            code: "+253"
        }, {
            name: "Dominica",
            code: "+1767"
        }, {
            name: "Dominican Republic",
            code: "+1"
        }, {
            name: "EI Salvador",
            code: "+503"
        }, {
            name: "Ecuador",
            code: "+593"
        }, {
            name: "Egypt",
            code: "+20"
        }, {
            name: "Equatorial Guinea",
            code: "+240"
        }, {
            name: "Eritrea",
            code: "+291"
        }, {
            name: "Estonia",
            code: "+372"
        }, {
            name: "Eswatini",
            code: "+268"
        }, {
            name: "Ethiopia",
            code: "+251"
        }, {
            name: "Falkland Islands",
            code: "+500"
        }, {
            name: "Faroe Islands",
            code: "+298"
        }, {
            name: "Fiji",
            code: "+679"
        }, {
            name: "Finland",
            code: "+358"
        }, {
            name: "France",
            code: "+33"
        }, {
            name: "French Guiana",
            code: "+594"
        }, {
            name: "French Polynesia",
            code: "+689"
        }, {
            name: "Gabon",
            code: "+241"
        }, {
            name: "Gambia",
            code: "+220"
        }, {
            name: "Georgia",
            code: "+995"
        }, {
            name: "Germany",
            code: "+49"
        }, {
            name: "Ghana",
            code: "+233"
        }, {
            name: "Gibraltar",
            code: "+350"
        }, {
            name: "Greece",
            code: "+30"
        }, {
            name: "Greenland",
            code: "+299"
        }, {
            name: "Grenada",
            code: "+1473"
        }, {
            name: "Guadeloupe",
            code: "+590"
        }, {
            name: "Guam",
            code: "+1671"
        }, {
            name: "Guatemala",
            code: "+502"
        }, {
            name: "Guernsey",
            code: "+44"
        }, {
            name: "Guinea",
            code: "+224"
        }, {
            name: "Guinea-Bissau",
            code: "+245"
        }, {
            name: "Guyana",
            code: "+592"
        }, {
            name: "Haiti",
            code: "+509"
        }, {
            name: "Honduras",
            code: "+504"
        }, {
            name: "Hongkong",
            code: "+852"
        }, {
            name: "Hungary",
            code: "+36"
        }, {
            name: "Iceland",
            code: "+354"
        }, {
            name: "India",
            code: "+91"
        }, {
            name: "Indonesia",
            code: "+62"
        }, {
            name: "Iraq",
            code: "+964"
        }, {
            name: "Ireland",
            code: "+353"
        }, {
            name: "Israel",
            code: "+972"
        }, {
            name: "Isle of Man",
            code: "+44"
        }, {
            name: "Italy",
            code: "+39"
        }, {
            name: "Ivory Coast",
            code: "+225"
        }, {
            name: "Jamaica",
            code: "+1876"
        }, {
            name: "Japan",
            code: "+81"
        }, {
            name: "Jersey",
            code: "+44"
        }, {
            name: "Jordan",
            code: "+962"
        }, {
            name: "Kampuchea (Cambodia )",
            code: "+855"
        }, {
            name: "Kazakhstan",
            code: "+76"
        }, {
            name: "Kazakhstan",
            code: "+77"
        }, {
            name: "Kenya",
            code: "+254"
        }, {
            name: "Kiribati",
            code: "+686"
        }, {
            name: "Korea",
            code: "+82"
        }, {
            name: "Kosovo",
            code: "+383"
        }, {
            name: "Kuwait",
            code: "+965"
        }, {
            name: "Kyrgyzstan",
            code: "+996"
        }, {
            name: "Laos",
            code: "+856"
        }, {
            name: "Latvia",
            code: "+371"
        }, {
            name: "Lebanon",
            code: "+961"
        }, {
            name: "Lesotho",
            code: "+266"
        }, {
            name: "Liberia",
            code: "+231"
        }, {
            name: "Libya",
            code: "+218"
        }, {
            name: "Liechtenstein",
            code: "+423"
        }, {
            name: "Lithuania",
            code: "+370"
        }, {
            name: "Luxembourg",
            code: "+352"
        }, {
            name: "Macao",
            code: "+853"
        }, {
            name: "Madagascar",
            code: "+261"
        }, {
            name: "Malawi",
            code: "+265"
        }, {
            name: "Malaysia",
            code: "+60"
        }, {
            name: "Maldives",
            code: "+960"
        }, {
            name: "Mali",
            code: "+223"
        }, {
            name: "Malta",
            code: "+356"
        }, {
            name: "Marshall Islands",
            code: "+692"
        }, {
            name: "Martinique",
            code: "+596"
        }, {
            name: "Mauritania",
            code: "+222"
        }, {
            name: "Mauritius",
            code: "+230"
        }, {
            name: "Mayotte",
            code: "+262"
        }, {
            name: "Mexico",
            code: "+52"
        }, {
            name: "Micronesia",
            code: "+691"
        }, {
            name: "Moldova, Republic of",
            code: "+373"
        }, {
            name: "Monaco",
            code: "+377"
        }, {
            name: "Mongolia",
            code: "+976"
        }, {
            name: "Montenegro",
            code: "+382"
        }, {
            name: "Montserrat",
            code: "+1664"
        }, {
            name: "Morocco",
            code: "+212"
        }, {
            name: "Mozambique",
            code: "+258"
        }, {
            name: "Myanmar (Burma)",
            code: "+95"
        }, {
            name: "Namibia",
            code: "+264"
        }, {
            name: "Nauru",
            code: "+674"
        }, {
            name: "Nepal",
            code: "+977"
        }, {
            name: "Netherlands",
            code: "+31"
        }, {
            name: "New Caledonia",
            code: "+687"
        }, {
            name: "New Zealand",
            code: "+64"
        }, {
            name: "Nicaragua",
            code: "+505"
        }, {
            name: "Niger",
            code: "+227"
        }, {
            name: "Nigeria",
            code: "+234"
        }, {
            name: "Niue",
            code: "+683"
        }, {
            name: "Norfolk Island",
            code: "+672"
        }, {
            name: "North Macedonia",
            code: "+389"
        }, {
            name: "Northern Mariana Islands",
            code: "+1670"
        }, {
            name: "Norway",
            code: "+47"
        }, {
            name: "Oman",
            code: "+968"
        }, {
            name: "Pakistan",
            code: "+92"
        }, {
            name: "Palau",
            code: "+680"
        }, {
            name: "Palestinian Territories",
            code: "+970"
        }, {
            name: "Panama",
            code: "+507"
        }, {
            name: "Papua New Cuinea",
            code: "+675"
        }, {
            name: "Paraguay",
            code: "+595"
        }, {
            name: "Peru",
            code: "+51"
        }, {
            name: "Philippines",
            code: "+63"
        }, {
            name: "Pitcairn Islands",
            code: "+64"
        }, {
            name: "Poland",
            code: "+48"
        }, {
            name: "Portugal",
            code: "+351"
        }, {
            name: "Puerto Rico",
            code: "+1787"
        }, {
            name: "Puerto Rico",
            code: "+1939"
        }, {
            name: "Qatar",
            code: "+974"
        }, {
            name: "Réunion",
            code: "+262"
        }, {
            name: "Romania",
            code: "+40"
        }, {
            name: "Russia",
            code: "+7"
        }, {
            name: "Rwanda",
            code: "+250"
        }, {
            name: "Samoa",
            code: "+685"
        }, {
            name: "San Marino",
            code: "+378"
        }, {
            name: "Sao Tome and Principe",
            code: "+239"
        }, {
            name: "Saudi Arabia",
            code: "+966"
        }, {
            name: "Senegal",
            code: "+221"
        }, {
            name: "Serbia",
            code: "+381"
        }, {
            name: "Seychelles",
            code: "+248"
        }, {
            name: "Sierra Leone",
            code: "+232"
        }, {
            name: "Singapore",
            code: "+65"
        }, {
            name: "Sint Maarten",
            code: "+1721"
        }, {
            name: "Slovakia",
            code: "+421"
        }, {
            name: "Slovenia",
            code: "+386"
        }, {
            name: "Solomon Is",
            code: "+677"
        }, {
            name: "Somali",
            code: "+252"
        }, {
            name: "South Africa",
            code: "+27"
        }, {
            name: "So. Georgia & So. Sandwich Isl.",
            code: "+500"
        }, {
            name: "South Sudan",
            code: "+211"
        }, {
            name: "Spain",
            code: "+34"
        }, {
            name: "Sri Lanka",
            code: "+94"
        }, {
            name: "St. Barthélemy",
            code: "+590"
        }, {
            name: "St. Helena",
            code: "+290"
        }, {
            name: "St. Kitts & Nevis",
            code: "+1869"
        }, {
            name: "St. Martin",
            code: "+590"
        }, {
            name: "St. Pierre & Miquelon",
            code: "+508"
        }, {
            name: "St.Lucia",
            code: "+1758"
        }, {
            name: "St. Vincent & Grenadines",
            code: "+1784"
        }, {
            name: "Sudan",
            code: "+249"
        }, {
            name: "Suriname",
            code: "+597"
        }, {
            name: "Svalbard & Jan Mayen",
            code: "+4779"
        }, {
            name: "Sweden",
            code: "+46"
        }, {
            name: "Switzerland",
            code: "+41"
        }, {
            name: "Taiwan",
            code: "+886"
        }, {
            name: "Tajikstan",
            code: "+992"
        }, {
            name: "Tanzania",
            code: "+255"
        }, {
            name: "Thailand",
            code: "+66"
        }, {
            name: "Timor-Leste",
            code: "+670"
        }, {
            name: "Togo",
            code: "+228"
        }, {
            name: "Tokelau",
            code: "+690"
        }, {
            name: "Tonga",
            code: "+676"
        }, {
            name: "Trinidad & Tobago",
            code: "+1868"
        }, {
            name: "Tunisia",
            code: "+216"
        }, {
            name: "Turkey",
            code: "+90"
        }, {
            name: "Turkmenistan",
            code: "+993"
        }, {
            name: "Turks & Caicos Islands",
            code: "+1649"
        }, {
            name: "Tuvalu",
            code: "+688"
        }, {
            name: "U.S. Virgin Islands",
            code: "+1340"
        }, {
            name: "Uganda",
            code: "+256"
        }, {
            name: "Ukraine",
            code: "+380"
        }, {
            name: "United Arab Emirates",
            code: "+971"
        }, {
            name: "United Kingdom",
            code: "+44"
        }, {
            name: "United States",
            code: "+1"
        }, {
            name: "Uruguay",
            code: "+598"
        }, {
            name: "Uzbekistan",
            code: "+998"
        }, {
            name: "Vanuatu",
            code: "+678"
        }, {
            name: "Vatican City",
            code: "+379"
        }, {
            name: "Venezuela",
            code: "+58"
        }, {
            name: "Vietnam",
            code: "+84"
        }, {
            name: "Wallis & Futuna",
            code: "+681"
        }, {
            name: "Western Sahara",
            code: "+212"
        }, {
            name: "Yemen",
            code: "+967"
        }, {
            name: "Zambia",
            code: "+260"
        }, {
            name: "Zimbabwe",
            code: "+263"
        }] 
	}
};
export default Helper;