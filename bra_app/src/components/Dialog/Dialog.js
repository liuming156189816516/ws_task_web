
import Dialog from './Dialog.vue'
const DialogBox = Vue.extend(Dialog)
Dialog.install = function (data) {
    let instance = new DialogBox().$mount()
    instance.type = data.type
    instance.steps = data.steps
    instance.title = data.title
    instance.times = data.times
    instance.money = data.money
    instance.number = data.number
    instance.content = data.content
    document.getElementById("app").appendChild(instance.$el);
    Vue.nextTick(() => {instance.visible = true})
}
export default Dialog