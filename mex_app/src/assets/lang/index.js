
import VueI18n from 'vue-i18n'
import { Locale } from 'vant'
import zhCN from './zh.js'
import enCN from './en.js'
import esCN from './es.js'
Vue.use(VueI18n)

const messages = {
	en: {
		...enCN
	},
	zh: {
		...zhCN
	},
	es: {
		...esCN
	}
}
const i18n = new VueI18n({
	locale: Cookies.get('language') || "en", // 设置默认语言
	silentTranslationWarn: true,
	messages: messages // 设置资源文件对象
})
// 更新vant组件库本身的语言变化，支持国际化
function vantLocales(lang) {
	if (lang === 'zh') {
		Locale.use(lang, messages.zh)
	} 
}

export {
	i18n,
	messages,
	vantLocales
}