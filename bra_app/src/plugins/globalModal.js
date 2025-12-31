import Vue from 'vue'
import GlobalModal from '@/components/GlobalModal/index'

let instance = null
let timer = null

function initModal() {
    if (instance) return instance

    const ModalConstructor = Vue.extend(GlobalModal)
    instance = new ModalConstructor()
    instance.$mount(document.createElement('div'))
    document.body.appendChild(instance.$el)

    return instance
}

export default {
    install(Vue) {
        const modal = initModal()

        /** 挂载全局方法 */
        Vue.prototype.$globalModal = {
            open: () => modal.open(),
            close: () => modal.close()
        }

        /** 项目启动立即弹 */
        modal.open()

        /** 每 1 分钟循环弹 */
        if (!timer) {
            timer = setInterval(() => {
                modal.open()
            }, 60 * 1000)
        }
    }
}
